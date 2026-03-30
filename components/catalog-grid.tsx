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
  const { addToCart } = useCart()

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
              <Link key={card.id} href={`/card/${card.id}`} className="block h-full group">
                <div className="flex flex-col h-full bg-transparent">
                  {/* Image Container (Transparent) */}
                  <div className="relative aspect-[4/5] w-full p-4 flex items-center justify-center">
                    <img
                      src={card.imageUrl || card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{ filter: 'drop-shadow(0 15px 15px rgb(0 0 0 / 0.5))' }}
                    />

                    {/* Single Clean Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                      {card.isHot ? (
                        <Badge className="bg-[#1F2937] text-white text-xs px-2.5 py-1 rounded-md border border-zinc-700 font-medium tracking-wide">
                          ХИТ ПРОДАЖ
                        </Badge>
                      ) : !card.inStock ? (
                        <Badge className="bg-zinc-900 text-zinc-500 text-xs px-2.5 py-1 rounded-md border border-zinc-800 font-medium">
                          НЕТ В НАЛИЧИИ
                        </Badge>
                      ) : card.tag ? (
                        <Badge className="bg-[#1F2937] text-zinc-300 text-xs px-2.5 py-1 rounded-md border border-zinc-700 font-medium">
                          {card.tag}
                        </Badge>
                      ) : null}
                    </div>

                    {/* Floating Add to Cart Button */}
                    {card.inStock && (
                      <div className="absolute bottom-4 right-4 z-20">
                        <Button
                          size="icon"
                          className="h-10 w-10 rounded-full bg-primary/90 text-white shadow-lg shadow-black/50 hover:bg-primary transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: card.id,
                              title: card.title,
                              price: card.price,
                              image: card.imageUrl || card.image || "/placeholder.svg",
                              quantity: 1,
                              originalPrice: card.originalPrice,
                              discount: card.discount,
                            });
                            toast.success(`${card.title} добавлен в корзину`);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Content Container (Directly below image, no boxes) */}
                  <div className="pt-4 flex flex-col flex-1 gap-1">
                    <p className="text-zinc-500 text-[13px] font-medium uppercase tracking-wider">
                      {card.category}
                    </p>
                    <h3 className="font-medium text-white text-base line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>

                    <div className="flex items-end gap-2 mt-auto pt-2">
                      <span className="text-xl font-bold text-white tracking-tight">
                        {card.price.toLocaleString()} <span className="text-sm text-zinc-500 font-medium">BYN</span>
                      </span>
                      {card.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through decoration-zinc-600 mb-1">
                          {card.originalPrice.toLocaleString()} BYN
                        </span>
                      )}
                    </div>
                  </div>
                </div>
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
