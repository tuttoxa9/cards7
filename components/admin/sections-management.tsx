"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { collection, getDocs, doc, getDoc, setDoc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface CardData {
  id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  price: number;
  category: string;
}

interface SectionData {
  cardIds: string[];
}

export function SectionsManagement() {
  const [cards, setCards] = useState<CardData[]>([]);
  const [sections, setSections] = useState({
    weeklyDeals: [] as string[],
    bestSellers: [] as string[],
    newArrivals: [] as string[]
  });
  const [isLoading, setIsLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<keyof typeof sections>("weeklyDeals");

  // Загрузка всех карточек и секций
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);

        // Загружаем все карточки
        const cardsSnapshot = await getDocs(collection(db, "cards"));
        const cardsData: CardData[] = [];
        cardsSnapshot.forEach((doc) => {
          const data = doc.data();
          cardsData.push({
            id: doc.id,
            ...data,
          } as CardData);
        });
        setCards(cardsData);

        // Загружаем конфигурацию секций
        const weeklyDealsDoc = await getDoc(doc(db, "homepageSections", "weeklyDeals"));
        const bestSellersDoc = await getDoc(doc(db, "homepageSections", "bestSellers"));
        const newArrivalsDoc = await getDoc(doc(db, "homepageSections", "newArrivals"));

        setSections({
          weeklyDeals: weeklyDealsDoc.exists() ? (weeklyDealsDoc.data() as SectionData).cardIds : [],
          bestSellers: bestSellersDoc.exists() ? (bestSellersDoc.data() as SectionData).cardIds : [],
          newArrivals: newArrivalsDoc.exists() ? (newArrivalsDoc.data() as SectionData).cardIds : []
        });

      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
        toast.error("Ошибка загрузки данных");
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addCardToSection = async (cardId: string) => {
    if (sections[activeSection].includes(cardId)) {
      toast.error("Карточка уже добавлена в эту секцию");
      return;
    }

    try {
      const newCardIds = [...sections[activeSection], cardId];

      await setDoc(doc(db, "homepageSections", activeSection), {
        cardIds: newCardIds
      }, { merge: true });

      setSections(prev => ({
        ...prev,
        [activeSection]: newCardIds
      }));

      toast.success("Карточка добавлена в секцию");
    } catch (error) {
      console.error("Ошибка добавления карточки:", error);
      toast.error("Ошибка добавления карточки");
    }
  };

  const removeCardFromSection = async (cardId: string) => {
    try {
      const newCardIds = sections[activeSection].filter(id => id !== cardId);

      await setDoc(doc(db, "homepageSections", activeSection), {
        cardIds: newCardIds
      }, { merge: true });

      setSections(prev => ({
        ...prev,
        [activeSection]: newCardIds
      }));

      toast.success("Карточка удалена из секции");
    } catch (error) {
      console.error("Ошибка удаления карточки:", error);
      toast.error("Ошибка удаления карточки");
    }
  };

  const getSectionTitle = (section: keyof typeof sections) => {
    switch (section) {
      case "weeklyDeals": return "Предложения недели";
      case "bestSellers": return "Лидеры продаж";
      case "newArrivals": return "Новое в каталоге";
      default: return "";
    }
  };

  const getCardsInSection = () => {
    return cards.filter(card => sections[activeSection].includes(card.id));
  };

  const getAvailableCards = () => {
    return cards.filter(card => !sections[activeSection].includes(card.id));
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
      {/* Выбор секции */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <h3 className="text-xl font-semibold text-white">Управление секциями главной страницы</h3>
          <Select value={activeSection} onValueChange={(value) => setActiveSection(value as keyof typeof sections)}>
            <SelectTrigger className="w-64 bg-[#18181B] border-zinc-600 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-[#27272A] border-zinc-600">
              <SelectItem value="weeklyDeals" className="text-white hover:bg-[#18181B]">Предложения недели</SelectItem>
              <SelectItem value="bestSellers" className="text-white hover:bg-[#18181B]">Лидеры продаж</SelectItem>
              <SelectItem value="newArrivals" className="text-white hover:bg-[#18181B]">Новое в каталоге</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <Badge className="bg-blue-600 text-white">
          {sections[activeSection].length} карточек в секции
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Карточки в секции */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Карточки в секции "{getSectionTitle(activeSection)}"</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {getCardsInSection().map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 bg-[#18181B] rounded-lg border border-zinc-700">
                <div className="flex items-center space-x-3">
                  <img
                    src={card.imageUrl || card.image}
                    alt={card.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <div>
                    <p className="text-white font-medium">{card.title}</p>
                    <p className="text-zinc-400 text-sm">{card.price.toLocaleString()} BYN</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => removeCardFromSection(card.id)}
                  className="text-red-400 hover:text-red-300"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {getCardsInSection().length === 0 && (
              <p className="text-zinc-400 text-center py-8">Нет карточек в этой секции</p>
            )}
          </div>
        </div>

        {/* Доступные карточки */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white">Доступные карточки</h4>
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {getAvailableCards().map((card) => (
              <div key={card.id} className="flex items-center justify-between p-3 bg-[#18181B] rounded-lg border border-zinc-700">
                <div className="flex items-center space-x-3">
                  <img
                    src={card.imageUrl || card.image}
                    alt={card.title}
                    className="w-12 h-16 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <div>
                    <p className="text-white font-medium">{card.title}</p>
                    <p className="text-zinc-400 text-sm">{card.price.toLocaleString()} BYN • {card.category}</p>
                  </div>
                </div>
                <Button
                  size="sm"
                  onClick={() => addCardToSection(card.id)}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            ))}
            {getAvailableCards().length === 0 && (
              <p className="text-zinc-400 text-center py-8">Все карточки уже добавлены в эту секцию</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
