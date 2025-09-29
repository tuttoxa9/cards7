"use client";

import { useState, useEffect } from "react";
import { MoreHorizontal, Plus, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useDrawer } from "@/hooks/use-drawer";
import { CardForm } from "./card-form";
import { DrawerCardActions } from "./drawer-card-actions";
import { DrawerDeleteConfirmation } from "./drawer-delete-confirmation";

interface Card {
  id: string;
  name: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
  imageUrl: string;
  bannerImageUrl?: string;
  cardBackImageUrl?: string;
  carouselImageUrl?: string;
  isFeatured: boolean;
  category: string;
  description: string;
  inStock: boolean;
  isHot: boolean;
  rating?: number;
  reviews?: number;
  tag?: string;
}

export function CardsManagement() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Card; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });
  const { openDrawer, closeDrawer } = useDrawer();

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        const cardsQuerySnapshot = await getDocs(collection(db, "cards"));
        const cardsData: Card[] = cardsQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card));
        setCards(cardsData);

        const categoriesQuerySnapshot = await getDocs(collection(db, "categories"));
        const categoriesData: string[] = categoriesQuerySnapshot.docs.map(doc => doc.data().name);
        setCategories(categoriesData);

      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        toast.error("Ошибка загрузки данных");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const sortedAndFilteredCards = [...cards]
    .filter(card => {
      const searchTermLower = searchTerm.toLowerCase();
      const categoryMatch = selectedCategory === 'all' || card.category === selectedCategory;
      const searchMatch = card.name.toLowerCase().includes(searchTermLower) || card.category.toLowerCase().includes(searchTermLower);
      return categoryMatch && searchMatch;
    })
    .sort((a, b) => {
      const aValue = a[sortConfig.key];
      const bValue = b[sortConfig.key];
      if (aValue === undefined || bValue === undefined) return 0;
      let comparison = 0;
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue;
      } else if (typeof aValue === 'string' && typeof bValue === 'string') {
        comparison = aValue.localeCompare(bValue);
      }
      return sortConfig.direction === 'ascending' ? comparison : -comparison;
    });

  const requestSort = (key: keyof Card) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const handleSaveCard = async (cardData: Omit<Card, "id">, editingCardId?: string) => {
    try {
      if (editingCardId) {
        await updateDoc(doc(db, "cards", editingCardId), cardData);
        setCards(cards.map(card =>
          card.id === editingCardId ? { ...cardData, id: editingCardId } : card
        ));
        toast.success("Карточка успешно обновлена");
      } else {
        const docRef = await addDoc(collection(db, "cards"), cardData);
        const newCard: Card = { ...cardData, id: docRef.id };
        setCards([...cards, newCard]);
        toast.success("Карточка успешно добавлена");
      }
      closeDrawer();
    } catch (error) {
      console.error("Ошибка сохранения карточки:", error);
      toast.error("Ошибка сохранения карточки");
    }
  };

  const handleAdd = () => {
    openDrawer(
      CardForm,
      {
        onSave: (cardData: Omit<Card, "id">) => handleSaveCard(cardData),
        onCancel: closeDrawer,
      },
      { size: "wide", title: "Создание новой карточки" }
    );
  };

  const handleEdit = (card: Card) => {
    openDrawer(
      CardForm,
      {
        editingCard: card,
        onSave: (cardData: Omit<Card, "id">) => handleSaveCard(cardData, card.id),
        onCancel: closeDrawer,
      },
      { size: "wide", title: `Редактирование: ${card.title}` }
    );
  };

  const handleDelete = async (cardId: string) => {
    try {
      await deleteDoc(doc(db, "cards", cardId));
      setCards(cards.filter(card => card.id !== cardId));
      toast.success("Карточка успешно удалена");
      closeDrawer();
    } catch (error) {
      console.error("Ошибка удаления карточки:", error);
      toast.error("Ошибка удаления карточки");
    }
  };

  const openDeleteConfirmation = (card: Card) => {
    openDrawer(
      DrawerDeleteConfirmation,
      {
        cardName: card.title,
        onConfirm: () => handleDelete(card.id),
        onCancel: () => openActionsDrawer(card), // Go back to actions
      },
      { size: "default", title: "Подтверждение удаления" }
    );
  };

  const openActionsDrawer = (card: Card) => {
    openDrawer(
      DrawerCardActions,
      {
        onEdit: () => handleEdit(card),
        onDelete: () => openDeleteConfirmation(card),
      },
      { size: "default", title: `Действия: ${card.title}` }
    );
  };

  const handleToggleFeatured = async (cardId: string, isFeatured: boolean) => {
    try {
      const cardRef = doc(db, "cards", cardId);
      await updateDoc(cardRef, { isFeatured });
      setCards(cards.map(card =>
        card.id === cardId ? { ...card, isFeatured } : card
      ));
      toast.success(`Карточка ${isFeatured ? "добавлена на главную" : "убрана с главной"}`);
    } catch (error) {
      console.error("Ошибка обновления статуса 'На главной':", error);
      toast.error("Не удалось обновить статус");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 bg-zinc-700" />
          <Skeleton className="h-10 w-32 bg-zinc-700" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-zinc-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex flex-col sm:flex-row gap-4 flex-1 min-w-0">
          <div className="relative flex-grow">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
            <Input
              placeholder="Поиск карточек..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full bg-[#18181B] border-zinc-600 text-white"
            />
          </div>
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="w-full sm:w-[180px] bg-[#18181B] border-zinc-600 text-white">
              <SelectValue placeholder="Фильтр по категории" />
            </SelectTrigger>
            <SelectContent className="bg-[#27272A] border-zinc-700 text-zinc-300">
              <SelectItem value="all" className="cursor-pointer focus:bg-zinc-700 focus:text-white">Все категории</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category} className="cursor-pointer focus:bg-zinc-700 focus:text-white">
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Добавить карточку
          </Button>
        </div>
      </div>

      <div className="rounded-lg border border-zinc-700 bg-[#18181B]/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b-zinc-700 hover:bg-transparent">
              <TableHead className="text-zinc-300 w-[76px] p-2">Изображение</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>Название</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('category')}>Категория</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('price')}>Цена (BYN)</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3">Статус</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3">На главной</TableHead>
              <TableHead className="text-zinc-300 text-right w-[80px] px-4 py-3">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedAndFilteredCards.map((card) => (
              <TableRow key={card.id} className="border-zinc-800 hover:bg-[#27272A]/50 data-[state=selected]:bg-[#27272A]">
                <TableCell className="p-2">
                  <img
                    src={card.imageUrl || card.image}
                    alt={card.title || card.name}
                    className="w-10 h-[60px] object-cover rounded-sm"
                    onError={(e) => { e.currentTarget.src = "/placeholder.jpg"; }}
                  />
                </TableCell>
                <TableCell className="py-3 px-4 text-white font-medium">{card.title || card.name}</TableCell>
                <TableCell className="py-3 px-4 text-zinc-400">{card.category}</TableCell>
                <TableCell className="py-3 px-4 text-white">{card.price.toLocaleString()}</TableCell>
                <TableCell className="py-3 px-4">
                  <Badge variant={card.inStock ? "default" : "destructive"} className={card.inStock ? "bg-green-600/80 border-green-600" : ""}>
                    {card.inStock ? "В наличии" : "Закончился"}
                  </Badge>
                </TableCell>
                <TableCell className="py-3 px-4">
                  <Switch
                    checked={card.isFeatured}
                    onCheckedChange={(isFeatured) => handleToggleFeatured(card.id, isFeatured)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </TableCell>
                <TableCell className="py-3 px-4 text-right">
                  <Button
                    variant="ghost"
                    className="h-8 w-8 p-0 hover:bg-zinc-700"
                    onClick={() => openActionsDrawer(card)}
                  >
                    <span className="sr-only">Открыть меню</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {sortedAndFilteredCards.length === 0 && !isLoading && (
        <div className="text-center text-zinc-400 py-20">
          {searchTerm || selectedCategory !== 'all' ? "Карточки не найдены" : "Нет карточек для отображения"}
        </div>
      )}
    </div>
  );
}
