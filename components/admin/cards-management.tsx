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

interface Card {
  id: string;
  name: string;
  price: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
  category: string;
  description: string;
}

export function CardsManagement() {
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<Card | null>(null);

  // Имитация загрузки данных
  useEffect(() => {
    const loadCards = async () => {
      setIsLoading(true);
      // Имитация задержки API
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Демо данные
      const demoCards: Card[] = [
        {
          id: "1",
          name: "Темный Феникс",
          price: 2999,
          rarity: "legendary",
          image: "/dark-phoenix-card.jpg",
          category: "Супергерои",
          description: "Редкая карточка Темного Феникса из коллекции Marvel"
        },
        {
          id: "2",
          name: "Lamborghini Aventador",
          price: 1999,
          rarity: "epic",
          image: "/lamborghini-card.jpg",
          category: "Автомобили",
          description: "Эксклюзивная карточка суперкара Lamborghini"
        },
        {
          id: "3",
          name: "Гоку Ультра Инстинкт",
          price: 2499,
          rarity: "legendary",
          image: "/goku-card.jpg",
          category: "Аниме",
          description: "Ультра редкая карточка Гоку в форме Ультра Инстинкт"
        }
      ];

      setCards(demoCards);
      setIsLoading(false);
    };

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
      setCards(cards.filter(card => card.id !== cardId));
      toast.success("Карточка успешно удалена");
    }
  };

  const handleAdd = () => {
    setEditingCard(null);
    setIsModalOpen(true);
  };

  const handleSaveCard = (cardData: Omit<Card, "id">) => {
    if (editingCard) {
      // Редактирование
      setCards(cards.map(card =>
        card.id === editingCard.id
          ? { ...cardData, id: editingCard.id }
          : card
      ));
      toast.success("Карточка успешно обновлена");
    } else {
      // Добавление
      const newCard: Card = {
        ...cardData,
        id: Date.now().toString()
      };
      setCards([...cards, newCard]);
      toast.success("Карточка успешно добавлена");
    }
    setIsModalOpen(false);
    setEditingCard(null);
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
              <TableHead className="text-zinc-300">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCards.map((card) => (
              <TableRow key={card.id} className="border-zinc-700 hover:bg-[#27272A]">
                <TableCell>
                  <img
                    src={card.image}
                    alt={card.name}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </TableCell>
                <TableCell className="text-white font-medium">{card.name}</TableCell>
                <TableCell className="text-white">{card.price.toLocaleString()} ₽</TableCell>
                <TableCell>
                  <Badge className={`${getRarityColor(card.rarity)} text-white`}>
                    {getRarityText(card.rarity)}
                  </Badge>
                </TableCell>
                <TableCell className="text-zinc-400">{card.category}</TableCell>
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
