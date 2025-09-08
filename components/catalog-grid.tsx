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
    title: "Spider-Man Legendary",
    image: "/spider-man-multiverse-trading-card-web-design.jpg",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    rating: 4.9,
    reviews: 156,
    category: "Супергерои",
    rarity: "Легендарные",
    inStock: true,
    isHot: true,
  },
  {
    id: 2,
    title: "Cyberpunk GT-R",
    image: "/futuristic-cyberpunk-car-trading-card-neon.jpg",
    price: 1899,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 89,
    category: "Автомобили",
    rarity: "Эпические",
    inStock: true,
    isHot: false,
  },
  {
    id: 3,
    title: "Avengers Assemble",
    image: "/avengers-team-trading-card-epic-composition.jpg",
    price: 3299,
    originalPrice: 4199,
    discount: 21,
    rating: 4.9,
    reviews: 234,
    category: "Супергерои",
    rarity: "Уникальные",
    inStock: true,
    isHot: true,
  },
  {
    id: 4,
    title: "JDM Legends GTR",
    image: "/japanese-sports-car-trading-card-nissan-gtr.jpg",
    price: 1599,
    originalPrice: 1999,
    discount: 20,
    rating: 4.7,
    reviews: 67,
    category: "Автомобили",
    rarity: "Редкие",
    inStock: false,
    isHot: false,
  },
  {
    id: 5,
    title: "Formula 1 Champion",
    image: "/formula-1-racing-car-trading-card-speed.jpg",
    price: 2199,
    originalPrice: null,
    discount: null,
    rating: 4.8,
    reviews: 123,
    category: "Автомобили",
    rarity: "Эпические",
    inStock: true,
    isHot: false,
  },
  {
    id: 6,
    title: "Batman Dark Knight",
    image: "/batman-dark-knight-trading-card-gothic.jpg",
    price: 2799,
    originalPrice: 3499,
    discount: 20,
    rating: 4.9,
    reviews: 189,
    category: "Супергерои",
    rarity: "Легендарные",
    inStock: true,
    isHot: true,
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
            <Card className="group cursor-pointer bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
              <div
                className={`relative overflow-hidden ${viewMode === "grid" ? "aspect-[3/4]" : "aspect-[4/3] md:aspect-[5/3]"}`}
              >
                <img
                  src={card.image || "/placeholder.svg"}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex flex-col space-y-2">
                  <Badge className="bg-primary text-primary-foreground text-xs">{card.category}</Badge>
                  {card.isHot && <Badge className="bg-red-600 text-white text-xs">Хит продаж</Badge>}
                  {!card.inStock && (
                    <Badge variant="secondary" className="bg-gray-600 text-white text-xs">
                      Нет в наличии
                    </Badge>
                  )}
                </div>

                {card.discount && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="destructive" className="bg-red-600 text-xs">
                      -{card.discount}%
                    </Badge>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="absolute bottom-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-background/80 hover:bg-background">
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="secondary" className="w-8 h-8 bg-background/80 hover:bg-background">
                    <ShoppingCart className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold text-card-foreground text-balance line-clamp-2">{card.title}</h3>
                    <p className="text-xs text-muted-foreground mt-1">{card.rarity}</p>
                  </div>

                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3 h-3 ${i < Math.floor(card.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                      />
                    ))}
                    <span className="text-xs text-muted-foreground ml-1">
                      ({card.rating}) • {card.reviews} отзывов
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-foreground">{card.price} ₽</span>
                      {card.originalPrice && (
                        <span className="text-sm text-muted-foreground line-through">{card.originalPrice} ₽</span>
                      )}
                    </div>

                    {card.inStock ? (
                      <Button size="sm" className="bg-primary hover:bg-primary/90">
                        В корзину
                      </Button>
                    ) : (
                      <Button size="sm" variant="outline" disabled>
                        Нет в наличии
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
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
