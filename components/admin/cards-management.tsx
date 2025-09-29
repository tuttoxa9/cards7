"use client";

import { useState, useEffect, useRef } from "react";
import { MoreHorizontal, Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { CardFormModal } from "./card-form-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortConfig, setSortConfig] = useState<{ key: keyof Card; direction: 'ascending' | 'descending' }>({ key: 'name', direction: 'ascending' });
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        // Загрузка карточек
        const cardsQuerySnapshot = await getDocs(collection(db, "cards"));
        const cardsData: Card[] = cardsQuerySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Card));
        setCards(cardsData);

        // Загрузка категорий
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

  // Закрытие dropdown при клике вне области
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
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


  const toggleDropdown = (cardId: string) => {
    setOpenDropdown(openDropdown === cardId ? null : cardId);
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setIsModalOpen(true);
    setOpenDropdown(null);
  };

  const handleDelete = async (cardId: string) => {
    setOpenDropdown(null);
    if (window.confirm("Вы уверены, что хотите удалить эту карточку?")) {
      try {
        await deleteDoc(doc(db, "cards", cardId));
        setCards(cards.filter(card => card.id !== cardId));
        toast.success("Карточка успешно удалена");
      } catch (error) {
        console.error("Ошибка удаления карточки:", error);
        toast.error("Ошибка удаления карточки");
      }
    }
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

  const handleAdd = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleSaveCard = async (cardData: Omit<Card, "id">) => {
    try {
      if (editingCard) {
        // Редактирование
        await updateDoc(doc(db, "cards", editingCard.id), cardData);
        setCards(cards.map(card =>
          card.id === editingCard.id
            ? { ...cardData, id: editingCard.id }
            : card
        ));
        toast.success("Карточка успешно обновлена");
      } else {
        // Добавление
        const docRef = await addDoc(collection(db, "cards"), cardData);
        const newCard: Card = {
          ...cardData,
          id: docRef.id
        };
        setCards([...cards, newCard]);
        toast.success("Карточка успешно добавлена");
      }
      setIsModalOpen(false);
      setEditingCard(null);
    } catch (error) {
      console.error("Ошибка сохранения карточки:", error);
      toast.error("Ошибка сохранения карточки");
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
      {/* Панель действий */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        {/* Левая часть: Поиск и фильтр */}
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

        {/* Правая часть: Кнопка добавления */}
        <div className="flex-shrink-0">
          <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700 w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Добавить карточку
          </Button>
        </div>
      </div>

      {/* Таблица карточек */}
      <div className="rounded-lg border border-zinc-700 bg-[#18181B]/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b-zinc-700 hover:bg-transparent">
              <TableHead className="text-zinc-300 w-[76px] p-2">Изображение</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('name')}>Название</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('category')}>Категория</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3 cursor-pointer hover:text-white transition-colors" onClick={() => requestSort('price')}>Цена (BYN)</TableHead>
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
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </TableCell>
                <TableCell className="py-3 px-4 text-white font-medium">{card.title || card.name}</TableCell>
                <TableCell className="py-3 px-4 text-zinc-400">{card.category}</TableCell>
                <TableCell className="py-3 px-4 text-white">{card.price.toLocaleString()}</TableCell>
                <TableCell className="py-3 px-4">
                  <Switch
                    checked={card.isFeatured}
                    onCheckedChange={(isFeatured) => handleToggleFeatured(card.id, isFeatured)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                </TableCell>
                <TableCell className="py-3 px-4 text-right relative">
                  <div className="relative" ref={dropdownRef}>
                    <Button
                      variant="ghost"
                      className="h-8 w-8 p-0 hover:bg-zinc-700"
                      onClick={() => toggleDropdown(card.id)}
                    >
                      <span className="sr-only">Открыть меню</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>

                    {openDropdown === card.id && (
                      <div
                        className="absolute right-0 top-full mt-1 w-48 bg-zinc-900 border border-zinc-700 rounded-md shadow-lg z-[9999] py-1"
                      >
                        <button
                          onClick={() => handleEdit(card)}
                          className="w-full px-3 py-2 text-left text-zinc-300 hover:bg-zinc-700 hover:text-white flex items-center"
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Редактировать
                        </button>
                        <button
                          onClick={() => handleDelete(card.id)}
                          className="w-full px-3 py-2 text-left text-red-400 hover:bg-red-900/50 hover:text-red-300 flex items-center"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Удалить
                        </button>
                      </div>
                    )}
                  </div>
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

      {/* Модальное окно для добавления/редактирования карточки */}
      <CardFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveCard}
        editingCard={editingCard}
      />
    </div>
  );
}
