"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
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

  // Загрузка карточек из Firestore
  const loadCards = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "cards"));
      const cardsData: Card[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cardsData.push({
          id: doc.id,
          ...data,
        } as Card);
      });

      setCards(cardsData);
    } catch (error) {
      console.error("Ошибка загрузки карточек:", error);
      toast.error("Ошибка загрузки карточек");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCards();
  }, []);

  const filteredCards = cards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500";
      case "rare": return "bg-blue-500";
      case "epic": return "bg-purple-500";
      case "legendary": return "bg-orange-500";
      default: return "bg-gray-500";
    }
  };

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common": return "Обычная";
      case "rare": return "Редкая";
      case "epic": return "Эпическая";
      case "legendary": return "Легендарная";
      default: return "Неизвестно";
    }
  };

  const handleEdit = (card: Card) => {
    setEditingCard(card);
    setIsModalOpen(true);
  };

  const handleDelete = async (cardId: string) => {
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
      {/* Заголовок и поиск */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <Input
            placeholder="Поиск карточек..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 bg-[#18181B] border-zinc-600 text-white"
          />
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить карточку
        </Button>
      </div>

      {/* Таблица карточек */}
      <div className="rounded-lg border border-zinc-700 bg-[#18181B]">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700">
              <TableHead className="text-zinc-300">Изображение</TableHead>
              <TableHead className="text-zinc-300">Название</TableHead>
              <TableHead className="text-zinc-300">Цена</TableHead>
              <TableHead className="text-zinc-300">Редкость</TableHead>
              <TableHead className="text-zinc-300">Категория</TableHead>
              <TableHead className="text-zinc-300">На главной</TableHead>
              <TableHead className="text-zinc-300">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.map((card) => (
              <TableRow key={card.id} className="border-zinc-700 hover:bg-[#27272A]">
                <TableCell>
                  <img
                    src={card.imageUrl || card.image}
                    alt={card.title || card.name}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </TableCell>
                <TableCell className="text-white font-medium">{card.title || card.name}</TableCell>
                <TableCell className="text-white">{card.price.toLocaleString()} BYN</TableCell>
                <TableCell>
                  <Badge className={`${getRarityColor(card.rarity)} text-white`}>
                    {getRarityText(card.rarity)}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400">{card.category}</TableCell>
                <TableCell>
                  {card.isFeatured ? (
                    <Badge className="bg-green-600 text-white">
                      Да
                    </Badge>
                  ) : (
                    <Badge variant="secondary" className="bg-zinc-600 text-zinc-300">
                      Нет
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(card)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(card.id)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredCards.length === 0 && !isLoading && (
        <div className="text-center text-zinc-400 py-20">
          {searchTerm ? "Карточки не найдены" : "Нет карточек для отображения"}
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
