"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { collection, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface CardData {
  id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  category: string;
  rarity?: string;
  inStock: boolean;
  isHot: boolean;
  tag?: string;
}

interface CatalogGridProps {
  onCardsCountChange?: (count: number) => void;
}

export function CatalogGrid({ onCardsCountChange }: CatalogGridProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  // Загрузка карточек из Firestore
  useEffect(() => {
    const loadCards = async () => {
      try {
        setIsLoading(true);
        const querySnapshot = await getDocs(collection(db, "cards"));
        const cardsData: CardData[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          cardsData.push({
            id: doc.id,
            ...data,
          } as CardData);
        });

        setCards(cardsData);
        onCardsCountChange?.(cardsData.length);
      } catch (error) {
        console.error("Ошибка загрузки карточек:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCards();
  }, []);

  return (
    <div className="flex-1 space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Найдено {cards.length} карточек</span>
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue placeholder="Сортировать по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Популярности</SelectItem>
              <SelectItem value="price-asc">Цене: по возрастанию</SelectItem>
              <SelectItem value="price-desc">Цене: по убыванию</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner center">
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
          >
            {cards.map((card) => (
          <Link key={card.id} href={`/card/${card.id}`}>
            <Card className="group cursor-pointer bg-transparent border-2 border-transparent hover:border-primary/70 transition-all duration-300 overflow-hidden rounded-3xl aspect-square">
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <img
                  src={card.imageUrl || card.image || "/placeholder.svg"}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {card.isHot && <Badge className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">Хит продаж</Badge>}
                  {card.tag && <Badge className="bg-blue-600 text-white text-sm px-3 py-1 rounded-full">{card.tag}</Badge>}
                  {!card.inStock && (
                    <Badge variant="secondary" className="bg-gray-600 text-white text-sm px-3 py-1 rounded-full">
                      Нет в наличии
                    </Badge>
                  )}
                </div>

                {/* Price at bottom */}
                <div className="absolute bottom-4 left-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-white">{card.price} BYN</span>
                      {card.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through text-gray-400">{card.originalPrice} BYN</span>
                      )}
                    </div>
                    {card.originalPrice && card.originalPrice > card.price && (
                      <Badge variant="destructive" className="bg-red-600 text-white text-xs">
                        -{Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Hover icons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-fill w-7 h-7" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                  </Button>
                  <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-heart-fill w-7 h-7" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
            ))}
          </div>

          {/* Empty State */}
          {cards.length === 0 && (
            <div className="text-center text-muted-foreground py-20">
              Карточки не найдены
            </div>
          )}
        </>
      )}


    </div>
  )
}
