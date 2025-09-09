"use client"

import { useMemo, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Grid3X3, List, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { useCart } from "@/context/cart-context"

const mockCards = [
  { id: 1, title: "Spider-Man Legendary", image: "/spider-man-multiverse-trading-card-web-design.jpg", price: 2499, originalPrice: 3299, discount: 24, rating: 4.9, reviews: 156, category: "Супергерои", rarity: "Легендарные", inStock: true, isHot: true, date: "2024-07-15" },
  { id: 2, title: "Cyberpunk GT-R", image: "/futuristic-cyberpunk-car-trading-card-neon.jpg", price: 1899, originalPrice: null, discount: null, rating: 4.8, reviews: 89, category: "Автомобили", rarity: "Эпические", inStock: true, isHot: false, date: "2024-07-10" },
  { id: 3, title: "Avengers Assemble", image: "/avengers-team-trading-card-epic-composition.jpg", price: 3299, originalPrice: 4199, discount: 21, rating: 4.9, reviews: 234, category: "Супергерои", rarity: "Уникальные", inStock: true, isHot: true, date: "2024-06-20" },
  { id: 4, title: "JDM Legends GTR", image: "/japanese-sports-car-trading-card-nissan-gtr.jpg", price: 1599, originalPrice: 1999, discount: 20, rating: 4.7, reviews: 67, category: "Автомобили", rarity: "Редкие", inStock: false, isHot: false, date: "2024-05-01" },
  { id: 5, title: "Formula 1 Champion", image: "/formula-1-racing-car-trading-card-speed.jpg", price: 2199, originalPrice: null, discount: null, rating: 4.8, reviews: 123, category: "Автомобили", rarity: "Эпические", inStock: true, isHot: false, date: "2024-07-18" },
  { id: 6, title: "Batman Dark Knight", image: "/batman-dark-knight-trading-card-gothic.jpg", price: 2799, originalPrice: 3499, discount: 20, rating: 4.9, reviews: 189, category: "Супергерои", rarity: "Легендарные", inStock: true, isHot: true, date: "2024-07-01" },
  { id: 7, title: "Goku Super Saiyan", image: "/goku-card.jpg", price: 1999, originalPrice: 2499, discount: 20, rating: 4.9, reviews: 301, category: "Аниме", rarity: "Легендарные", inStock: true, isHot: true, date: "2024-07-20" },
  { id: 8, title: "Dark Phoenix Saga", image: "/dark-phoenix-card.jpg", price: 2999, originalPrice: null, discount: null, rating: 4.8, reviews: 150, category: "Супергерои", rarity: "Эпические", inStock: false, isHot: false, date: "2024-06-15" },
  { id: 9, title: "Lamborghini Vision", image: "/lamborghini-card.jpg", price: 4999, originalPrice: 6000, discount: 17, rating: 5.0, reviews: 250, category: "Автомобили", rarity: "Уникальные", inStock: true, isHot: true, date: "2024-07-21" },
  { id: 10, title: "Mystical Dragon", image: "/dark-fantasy-trading-card-background-with-mystical.jpg", price: 1799, originalPrice: null, discount: null, rating: 4.7, reviews: 95, category: "Фэнтези", rarity: "Редкие", inStock: true, isHot: false, date: "2024-04-10" },
  { id: 11, title: "Goku Ultra Instinct", image: "/goku-ultra-instinct-card-background.jpg", price: 3499, originalPrice: 4200, discount: 17, rating: 5.0, reviews: 450, category: "Аниме", rarity: "Уникальные", inStock: true, isHot: true, date: "2024-07-22" },
  { id: 12, title: "Dark Phoenix Unleashed", image: "/dark-phoenix-marvel-card-background.jpg", price: 3199, originalPrice: null, discount: null, rating: 4.9, reviews: 210, category: "Супергерои", rarity: "Легендарные", inStock: true, isHot: false, date: "2024-07-19" },
  { id: 13, title: "Aventador Dreams", image: "/lamborghini-aventador-card-background.jpg", price: 4599, originalPrice: 5500, discount: 16, rating: 4.9, reviews: 180, category: "Автомобили", rarity: "Легендарные", inStock: false, isHot: false, date: "2024-07-12" },
]

export function CatalogGrid() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8
  const { addToCart, toggleWishlist, isInWishlist } = useCart()

  const sortedAndPagedCards = useMemo(() => {
    let sortedCards = [...mockCards]

    switch (sortBy) {
      case "price-asc":
        sortedCards.sort((a, b) => a.price - b.price)
        break
      case "price-desc":
        sortedCards.sort((a, b) => b.price - a.price)
        break
      case "rating":
        sortedCards.sort((a, b) => b.rating - a.rating)
        break
      case "newest":
        sortedCards.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        break
      case "popular":
      default:
        sortedCards.sort((a, b) => b.reviews - a.reviews)
        break
    }

    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    return sortedCards.slice(startIndex, endIndex)
  }, [sortBy, currentPage])

  const totalPages = Math.ceil(mockCards.length / itemsPerPage)

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
        className={`grid gap-6 ${
          viewMode === "grid" ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-4" : "grid-cols-1"
        }`}
      >
        {sortedAndPagedCards.map((card) => (
          <Card
            key={card.id}
            className="group relative flex flex-col cursor-pointer bg-card border-border hover:shadow-lg transition-shadow duration-300 overflow-hidden"
          >
            <Link href={`/card/${card.id}`} className="absolute inset-0 z-0" />
            <div className="relative overflow-hidden aspect-[4/5]">
              <img
                src={card.image || "/placeholder.svg"}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />

              {/* Badges */}
              <div className="absolute top-2 left-2 flex flex-wrap gap-1">
                <Badge className="bg-primary/90 text-primary-foreground text-[10px] backdrop-blur-sm">
                  {card.category}
                </Badge>
                {card.isHot && (
                  <Badge className="bg-red-600/90 text-white text-[10px] backdrop-blur-sm">Хит</Badge>
                )}
              </div>

              {card.discount && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="bg-red-600/90 text-[10px] backdrop-blur-sm">
                    -{card.discount}%
                  </Badge>
                </div>
              )}

              {/* Quick Actions */}
              <div className="absolute bottom-2 right-2 z-10 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault()
                    toggleWishlist(card.id)
                  }}
                >
                  <Heart
                    className={`w-4 h-4 transition-colors ${
                      isInWishlist(card.id) ? "text-red-500 fill-red-500" : ""
                    }`}
                  />
                </Button>
                <Button
                  size="icon"
                  variant="secondary"
                  className="w-8 h-8 bg-background/80 hover:bg-background"
                  onClick={(e) => {
                    e.preventDefault()
                    addToCart(card)
                  }}
                >
                  <ShoppingCart className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <CardContent className="p-3 flex flex-col flex-grow">
              <div className="flex-grow space-y-2">
                <div>
                  <h3 className="font-semibold text-sm text-card-foreground leading-snug line-clamp-2">
                    {card.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-0.5">{card.rarity}</p>
                </div>

                <div className="flex items-center space-x-1">
                  <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                  <span className="text-xs font-medium text-foreground">
                    {card.rating}{" "}
                    <span className="text-muted-foreground font-light">({card.reviews} отзывов)</span>
                  </span>
                </div>

                <div className="flex-grow" />

                <div>
                  <div className="flex items-baseline gap-2 mb-2">
                    <span className="text-lg font-bold text-foreground">{card.price} ₽</span>
                    {card.originalPrice && (
                      <span className="text-xs text-muted-foreground line-through">{card.originalPrice} ₽</span>
                    )}
                  </div>

                  {card.inStock ? (
                    <Button
                      size="sm"
                      className="w-full bg-primary hover:bg-primary/90 z-10 relative"
                      onClick={(e) => {
                        e.preventDefault()
                        addToCart(card)
                      }}
                    >
                      В корзину
                    </Button>
                  ) : (
                    <Button size="sm" variant="outline" className="w-full z-10 relative" disabled>
                      Нет в наличии
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-center space-x-2 pt-8">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
          disabled={currentPage === 1}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
          <Button
            key={page}
            variant={currentPage === page ? "default" : "outline"}
            size="sm"
            onClick={() => setCurrentPage(page)}
          >
            {page}
          </Button>
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
          disabled={currentPage === totalPages}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
