"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"

const mockCards = [
  {
    id: 1,
    title: "Pokemon TCG Scarlet & Violet Base Set",
    image: "/spider-man-multiverse-trading-card-web-design.jpg",
    price: 484,
    originalPrice: 3559,
    discount: 86,
    rating: 4.9,
    reviews: 1247,
    category: "Pokemon",
    rarity: "Бустерпак",
    inStock: true,
    isHot: true,
  },
  {
    id: 2,
    title: "Magic: The Gathering Wilds of Eldraine",
    image: "/futuristic-cyberpunk-car-trading-card-neon.jpg",
    price: 290,
    originalPrice: 1179,
    discount: 75,
    rating: 4.8,
    reviews: 892,
    category: "MTG",
    rarity: "Бустерпак",
    inStock: true,
    isHot: true,
  },
  {
    id: 3,
    title: "Yu-Gi-Oh! 25th Anniversary Ultimate Kaiba Set",
    image: "/avengers-team-trading-card-epic-composition.jpg",
    price: 57,
    originalPrice: 999,
    discount: 94,
    rating: 4.9,
    reviews: 756,
    category: "Yu-Gi-Oh!",
    rarity: "Коллекционный набор",
    inStock: true,
    isHot: true,
  },
  {
    id: 4,
    title: "One Piece Card Game Booster Pack OP-01",
    image: "/japanese-sports-car-trading-card-nissan-gtr.jpg",
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    rating: 4.7,
    reviews: 432,
    category: "Аниме",
    rarity: "Бустерпак",
    inStock: false,
    isHot: false,
  },
  {
    id: 5,
    title: "Dragon Ball Super Card Game Series 22",
    image: "/formula-1-racing-car-trading-card-speed.jpg",
    price: 2199,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 345,
    category: "Аниме",
    rarity: "Бустерпак",
    inStock: true,
    isHot: false,
  },
  {
    id: 6,
    title: "Disney Lorcana The First Chapter",
    image: "/batman-dark-knight-trading-card-gothic.jpg",
    price: 2799,
    originalPrice: 3499,
    discount: 20,
    rating: 4.9,
    reviews: 689,
    category: "Disney",
    rarity: "Стартовый набор",
    inStock: true,
    isHot: true,
  },
  {
    id: 7,
    title: "Flesh and Blood Tales of Aria",
    image: "/dark-fantasy-trading-card-background-with-mystical.jpg",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    rating: 4.6,
    reviews: 234,
    category: "Фэнтези",
    rarity: "Бустерпак",
    inStock: true,
    isHot: false,
  },
  {
    id: 8,
    title: "Marvel Crisis Protocol Core Set",
    image: "/placeholder-2n0yc.png",
    price: 4899,
    originalPrice: 5999,
    discount: 18,
    rating: 4.8,
    reviews: 167,
    category: "Marvel",
    rarity: "Стартовый набор",
    inStock: true,
    isHot: false,
  },
]

export function CatalogGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 12

  return (
    <div className="flex-1 space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Найдено {mockCards.length} карточек</span>
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
              <SelectItem value="rating">Рейтингу</SelectItem>
              <SelectItem value="newest">Новинкам</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Cards Grid */}
      <div
        className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3" : "grid-cols-1"}`}
      >
        {mockCards.map((card) => (
          <Link key={card.id} href={`/card/${card.id}`}>
            <Card className="group cursor-pointer bg-transparent border-2 border-transparent hover:border-primary/70 transition-all duration-300 overflow-hidden rounded-3xl aspect-square">
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col space-y-2">
                  {card.isHot && <Badge className="bg-red-600 text-white text-sm px-3 py-1 rounded-full">Хит продаж</Badge>}
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
                      <span className="text-xl font-bold text-white">{card.price} ₽</span>
                      {card.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through text-gray-400">{card.originalPrice} ₽</span>
                      )}
                    </div>
                    {card.discount && (
                      <Badge variant="destructive" className="bg-red-600 text-white text-xs">
                        -{card.discount}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Hover icons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                    <ShoppingCart className="w-6 h-6" />
                  </Button>
                  <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 pt-8">
        <Button variant="outline" size="sm" disabled>
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button variant="default" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <span className="text-muted-foreground">...</span>
        <Button variant="outline" size="sm">
          12
        </Button>
        <Button variant="outline" size="sm">
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
