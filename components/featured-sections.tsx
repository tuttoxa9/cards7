"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Clock, Zap, ShoppingCart, Flame, Heart } from "lucide-react"
import { collection, getDocs, doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface CardData {
  id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  tag?: string;
}

interface SectionData {
  cardIds: string[];
}

export function FeaturedSections() {
  const [weeklyDeals, setWeeklyDeals] = useState<CardData[]>([]);
  const [bestSellers, setBestSellers] = useState<CardData[]>([]);
  const [newArrivals, setNewArrivals] = useState<CardData[]>([]);
  const [categories, setCategories] = useState<string[]>(["Все"]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  const handleAddToCart = (card: CardData) => {
    addToCart({
      id: card.id,
      title: card.title,
      image: card.image,
      imageUrl: card.imageUrl,
      price: card.price,
      originalPrice: card.originalPrice,
      discount: card.discount,
      category: card.category,
      rarity: "Обычная", // можно добавить поле rarity в CardData
      inStock: true
    });
    toast.success(`${card.title} добавлена в корзину!`);
  };

  // Функция для получения карточек по их ID
  const getCardsByIds = async (cardIds: string[]): Promise<CardData[]> => {
    const cards: CardData[] = [];

    for (const cardId of cardIds) {
      try {
        const cardDoc = await getDoc(doc(db, "cards", cardId));
        if (cardDoc.exists()) {
          cards.push({
            id: cardDoc.id,
            ...cardDoc.data()
          } as CardData);
        }
      } catch (error) {
        console.error(`Ошибка загрузки карточки ${cardId}:`, error);
      }
    }

    return cards;
  };

  // Функция для загрузки категорий из Firestore
  const loadCategories = async () => {
    try {
      const categoriesDoc = await getDoc(doc(db, "settings", "categories"));
      if (categoriesDoc.exists()) {
        const data = categoriesDoc.data();
        setCategories(["Все", ...(data.list || [])]);
      }
    } catch (error) {
      console.error("Ошибка загрузки категорий:", error);
    }
  };

  // Загрузка данных секций из Firestore
  useEffect(() => {
    const loadSections = async () => {
      try {
        setIsLoading(true);

        // Загрузка категорий
        await loadCategories();

        // Загрузка конфигурации секций
        const [weeklyDealsDoc, bestSellersDoc, newArrivalsDoc] = await Promise.all([
          getDoc(doc(db, "homepageSections", "weeklyDeals")),
          getDoc(doc(db, "homepageSections", "bestSellers")),
          getDoc(doc(db, "homepageSections", "newArrivals"))
        ]);

        // Загрузка карточек для каждой секции
        if (weeklyDealsDoc.exists()) {
          const data = weeklyDealsDoc.data() as SectionData;
          const cards = await getCardsByIds(data.cardIds || []);
          setWeeklyDeals(cards);
        }

        if (bestSellersDoc.exists()) {
          const data = bestSellersDoc.data() as SectionData;
          const cards = await getCardsByIds(data.cardIds || []);
          setBestSellers(cards);
        }

        if (newArrivalsDoc.exists()) {
          const data = newArrivalsDoc.data() as SectionData;
          const cards = await getCardsByIds(data.cardIds || []);
          setNewArrivals(cards);
        }

      } catch (error) {
        console.error("Ошибка загрузки секций:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSections();
  }, []);
  return (
    <div className="space-y-24 mt-8">
      {/* Weekly Deals Section */}
      <section>
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Flame className="w-6 h-6 md:w-8 md:h-8 text-red-500" />
            <h2 className="text-2xl md:text-4xl font-bold text-white">Предложения недели</h2>
          </div>
          <Button
            variant="ghost"
            className="text-red-400 hover:text-red-300 text-sm md:text-lg font-semibold"
          >
            Смотреть все
          </Button>
        </div>

        <div className="relative">
          {/* Desktop horizontal cards */}
          <div className="hidden md:flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {isLoading ? (
              // Скелетоны загрузки
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-80 bg-gray-800 rounded-3xl animate-pulse" />
              ))
            ) : (
              weeklyDeals.map((card) => (
              <Card
                key={card.id}
                className="group cursor-pointer flex-shrink-0 w-80 h-80 glass-strong border-white/10 hover-glow-red transition-all duration-300 overflow-visible rounded-2xl hover:scale-[1.03]"
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  <img
                    src={card.imageUrl || card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  {/* Discount badge */}
                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-lg border border-red-400/30">
                      🔥 {card.tag || "Акция"}
                    </Badge>
                  </div>

                  {/* Price at bottom */}
                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="glass-strong rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-white">
                            {card.price.toLocaleString()} BYN
                          </span>
                          {card.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {card.originalPrice.toLocaleString()} BYN
                            </span>
                          )}
                        </div>
                        {card.originalPrice && card.originalPrice > card.price && (
                          <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            -{Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay with icons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                    <Button
                      size="icon"
                      onClick={() => handleAddToCart(card)}
                      className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full shadow-xl border border-red-400/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-fill w-6 h-6" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                      </svg>
                    </Button>
                    <Button size="icon" className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-full shadow-xl border border-purple-400/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-heart-fill w-6 h-6" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
              ))
            )}
          </div>

          {/* Mobile vertical list */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              // Скелетоны загрузки
              [...Array(3)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-800/50 rounded-2xl animate-pulse">
                  <div className="w-20 h-24 bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                    <div className="h-6 bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              weeklyDeals.map((card) => (
                <div
                  key={card.id}
                  className="flex gap-4 p-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50"
                >
                  <div className="relative">
                    {/* Discount badge */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-1 rounded-full">
                        Акция
                      </Badge>
                    </div>

                    <img
                      src={card.imageUrl || card.image}
                      alt={card.title}
                      className="w-20 h-28 object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-2">{card.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-xs line-through">
                          {card.originalPrice?.toLocaleString() || '5 479'} BYN
                        </span>
                        <Badge className="bg-pink-600 text-white text-xs font-bold px-2 py-1">
                          -{card.discount || '79'}%
                        </Badge>
                      </div>
                      <div className="text-white font-bold text-lg mb-2">
                        {card.price.toLocaleString()} BYN
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(card)}
                        className="bg-red-500 hover:bg-red-600 text-white flex-1 rounded-full text-xs font-semibold"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-cart-fill mr-1" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        Купить
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

      {/* Best Sellers Section */}
      <section>
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-2 md:space-x-3">
            <TrendingUp className="w-6 h-6 md:w-8 md:h-8 text-orange-500" />
            <h2 className="text-2xl md:text-4xl font-bold text-white">Лидеры продаж</h2>
          </div>
          <Button
            variant="ghost"
            className="text-red-400 hover:text-red-300 text-sm md:text-lg font-semibold"
          >
            Смотреть все
          </Button>
        </div>

        {/* Category filters - только на десктопе */}
        <div className="hidden md:flex flex-wrap gap-3 mb-8">
          {categories.map((category) => (
            <Button
              key={category}
              variant={category === "Все" ? "default" : "ghost"}
              className={`rounded-full px-6 py-2 transition-all duration-300 ${
                category === "Все"
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Desktop grid */}
        <div className="hidden md:grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {isLoading ? (
            // Скелетоны загрузки
            [...Array(3)].map((_, i) => (
              <div key={i} className="aspect-square h-64 bg-gray-800 rounded-3xl animate-pulse" />
            ))
          ) : (
            bestSellers.map((card) => (
            <Card
              key={card.id}
              className="group cursor-pointer glass-strong border-white/10 hover-glow-purple transition-all duration-300 overflow-visible rounded-2xl aspect-square h-64 hover:scale-[1.03]"
            >
              <div className="relative w-full h-full overflow-hidden rounded-2xl">
                <img
                  src={card.imageUrl || card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                <div className="absolute top-3 left-3 z-10">
                  <Badge className="glass text-white font-bold text-xs px-2.5 py-1.5 rounded-full shadow-lg border border-purple-400/30">
                    ⭐ {card.tag || "Хит продаж"}
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3 right-3 z-10">
                  <div className="glass-strong rounded-lg p-2.5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-white">
                          {card.price} BYN
                        </span>
                        {card.originalPrice && (
                          <span className="text-xs text-gray-400 line-through">
                            {card.originalPrice} BYN
                          </span>
                        )}
                      </div>
                      {card.originalPrice && card.originalPrice > card.price && (
                        <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                          -{Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>

                {/* Hover overlay with icons */}
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3 z-20">
                  <Button
                    size="icon"
                    onClick={() => handleAddToCart(card)}
                    className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-full shadow-xl border border-purple-400/30"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-fill w-5 h-5" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                  </Button>
                  <Button size="icon" className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full shadow-xl border border-red-400/30">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart-fill w-5 h-5" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
            ))
          )}
        </div>

        {/* Mobile vertical list */}
        <div className="md:hidden space-y-4">
          {isLoading ? (
            // Скелетоны загрузки
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 p-4 bg-gray-800/50 rounded-2xl animate-pulse">
                <div className="w-20 h-24 bg-gray-700 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 bg-gray-700 rounded w-3/4" />
                  <div className="h-3 bg-gray-700 rounded w-1/2" />
                  <div className="h-6 bg-gray-700 rounded w-1/3" />
                </div>
              </div>
            ))
          ) : (
            bestSellers.slice(0, 4).map((card) => (
              <div
                key={card.id}
                className="flex gap-4 p-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50"
              >
                <div className="relative">

                  <img
                    src={card.imageUrl || card.image}
                    alt={card.title}
                    className="w-20 h-28 object-cover rounded-xl"
                  />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{card.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-gray-400 text-xs line-through">
                        {card.originalPrice?.toLocaleString() || '3 499'} BYN
                      </span>
                      <Badge className="bg-blue-600 text-white text-xs font-bold px-2 py-1">
                        -{card.discount || '80'}%
                      </Badge>
                    </div>
                    <div className="text-white font-bold text-lg mb-2">
                      {Math.round(card.price * 0.2).toLocaleString()} BYN
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleAddToCart(card)}
                      className="bg-red-500 hover:bg-red-600 text-white flex-1 rounded-full text-xs font-semibold"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-cart-fill mr-1" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                      </svg>
                      Купить
                    </Button>
                    <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* New in Catalog Section */}
      <section>
        <div className="flex items-center justify-between mb-6 md:mb-8">
          <div className="flex items-center space-x-2 md:space-x-3">
            <Zap className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
            <h2 className="text-2xl md:text-4xl font-bold text-white">Новое в каталоге</h2>
          </div>
          <Button
            variant="ghost"
            className="text-red-400 hover:text-red-300 text-sm md:text-lg font-semibold"
          >
            Смотреть все
          </Button>
        </div>

        <div className="relative">
          {/* Desktop horizontal cards */}
          <div className="hidden md:flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {isLoading ? (
              // Скелетоны загрузки
              [...Array(5)].map((_, i) => (
                <div key={i} className="flex-shrink-0 w-80 h-80 bg-gray-800 rounded-3xl animate-pulse" />
              ))
            ) : (
              newArrivals.map((card) => (
              <Card
                key={card.id}
                className="group cursor-pointer flex-shrink-0 w-80 h-80 glass-strong border-white/10 hover-glow-purple transition-all duration-300 overflow-visible rounded-2xl hover:scale-[1.03]"
              >
                <div className="relative w-full h-full overflow-hidden rounded-2xl">
                  <img
                    src={card.imageUrl || card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                  <div className="absolute top-4 left-4 z-10">
                    <Badge className="glass text-white font-bold text-sm px-3 py-1.5 rounded-full shadow-lg border border-purple-400/30">
                      ✨ {card.tag || "Новинка"}
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4 z-10">
                    <div className="glass-strong rounded-xl p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="text-xl font-bold text-white">
                            {card.price.toLocaleString()} BYN
                          </span>
                          {card.originalPrice && (
                            <span className="text-sm text-gray-400 line-through">
                              {card.originalPrice.toLocaleString()} BYN
                            </span>
                          )}
                        </div>
                        {card.originalPrice && card.originalPrice > card.price && (
                          <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs px-2 py-1 rounded-full font-bold">
                            -{Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Hover overlay with icons */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 z-20">
                    <Button
                      size="icon"
                      onClick={() => handleAddToCart(card)}
                      className="w-14 h-14 bg-gradient-to-br from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white rounded-full shadow-xl border border-purple-400/30"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-fill w-6 h-6" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                      </svg>
                    </Button>
                    <Button size="icon" className="w-14 h-14 bg-gradient-to-br from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white rounded-full shadow-xl border border-red-400/30">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-heart-fill w-6 h-6" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
              ))
            )}
          </div>

          {/* Mobile vertical list */}
          <div className="md:hidden space-y-4">
            {isLoading ? (
              // Скелетоны загрузки
              [...Array(4)].map((_, i) => (
                <div key={i} className="flex gap-4 p-4 bg-gray-800/50 rounded-2xl animate-pulse">
                  <div className="w-20 h-24 bg-gray-700 rounded-xl" />
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-700 rounded w-3/4" />
                    <div className="h-3 bg-gray-700 rounded w-1/2" />
                    <div className="h-6 bg-gray-700 rounded w-1/3" />
                  </div>
                </div>
              ))
            ) : (
              newArrivals.slice(0, 4).map((card) => (
                <div
                  key={card.id}
                  className="flex gap-4 p-4 bg-black/40 backdrop-blur-sm rounded-2xl border border-gray-800/50"
                >
                  <div className="relative">
                    {/* Action badge */}
                    <div className="absolute -top-2 -left-2 z-10">
                      <Badge className="bg-red-500 text-white font-bold text-xs px-2 py-1 rounded-full">
                        Акция
                      </Badge>
                    </div>

                    <img
                      src={card.imageUrl || card.image}
                      alt={card.title}
                      className="w-20 h-28 object-cover rounded-xl"
                    />
                  </div>
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-white font-semibold text-sm mb-1 line-clamp-1">{card.title}</h3>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-gray-400 text-xs line-through">
                          {card.originalPrice?.toLocaleString() || '599'} BYN
                        </span>
                        <Badge className="bg-purple-600 text-white text-xs font-bold px-2 py-1">
                          -{card.discount || '68'}%
                        </Badge>
                      </div>
                      <div className="text-white font-bold text-lg mb-2">
                        193 BYN
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleAddToCart(card)}
                        className="bg-red-500 hover:bg-red-600 text-white flex-1 rounded-full text-xs font-semibold"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" className="bi bi-cart-fill mr-1" viewBox="0 0 16 16">
                          <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                        </svg>
                        Купить
                      </Button>
                      <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white p-2 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill" viewBox="0 0 16 16">
                          <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                        </svg>
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
