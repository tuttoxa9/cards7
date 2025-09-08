"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Shield, Truck, RotateCcw } from "lucide-react"

interface CardDetailsProps {
  card: {
    id: number
    title: string
    price: number
    originalPrice?: number
    discount?: number
    rating: number
    reviews: number
    category: string
    rarity: string
    year: string
    description: string
    features: string[]
    inStock: boolean
    stockCount: number
  }
}

export function CardDetails({ card }: CardDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)

  const increaseQuantity = () => {
    if (quantity < card.stockCount) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  return (
    <div className="space-y-6">
      {/* Title and Category */}
      <div>
        <div className="flex items-center space-x-2 mb-2">
          <Badge className="bg-primary text-primary-foreground">{card.category}</Badge>
          <Badge variant="outline" className="border-border">
            {card.year}
          </Badge>
        </div>
        <h1 className="text-3xl font-bold text-foreground text-balance">{card.title}</h1>
      </div>

      {/* Rating and Reviews */}
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${i < Math.floor(card.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
            />
          ))}
          <span className="text-sm font-medium text-foreground ml-2">{card.rating}</span>
        </div>
        <span className="text-sm text-muted-foreground">({card.reviews} отзывов)</span>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <span className="text-3xl font-bold text-foreground">{card.price.toLocaleString()} ₽</span>
          {card.originalPrice && (
            <>
              <span className="text-xl text-muted-foreground line-through">
                {card.originalPrice.toLocaleString()} ₽
              </span>
              <Badge variant="destructive" className="bg-red-600">
                -{card.discount}%
              </Badge>
            </>
          )}
        </div>
        {card.originalPrice && (
          <p className="text-sm text-green-600">Вы экономите {(card.originalPrice - card.price).toLocaleString()} ₽</p>
        )}
      </div>

      {/* Rarity and Stock */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Редкость</p>
              <p className="font-semibold text-card-foreground">{card.rarity}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">В наличии</p>
              <p className={`font-semibold ${card.inStock ? "text-green-600" : "text-red-600"}`}>
                {card.inStock ? `${card.stockCount} шт.` : "Нет в наличии"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quantity and Add to Cart */}
      {card.inStock && (
        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-foreground">Количество:</span>
            <div className="flex items-center border border-border rounded-lg">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-10 w-10"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <span className="px-4 py-2 text-center min-w-[3rem] text-foreground">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= card.stockCount}
                className="h-10 w-10"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex space-x-3">
            <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90">
              <ShoppingCart className="w-4 h-4 mr-2" />
              Добавить в корзину
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => setIsWishlisted(!isWishlisted)}
              className={`border-border ${isWishlisted ? "bg-red-50 border-red-200 text-red-600" : ""}`}
            >
              <Heart className={`w-4 h-4 ${isWishlisted ? "fill-current" : ""}`} />
            </Button>
            <Button variant="outline" size="lg" className="border-border bg-transparent">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Description */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Описание</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-card-foreground leading-relaxed">{card.description}</p>
        </CardContent>
      </Card>

      {/* Features */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Особенности</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-2">
            {card.features.map((feature, index) => (
              <li key={index} className="flex items-center space-x-2 text-card-foreground">
                <div className="w-1.5 h-1.5 bg-primary rounded-full" />
                <span>{feature}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* Guarantees */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Гарантия качества</p>
                <p className="text-xs text-muted-foreground">100% оригинал</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Быстрая доставка</p>
                <p className="text-xs text-muted-foreground">1-3 рабочих дня</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <RotateCcw className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Возврат 14 дней</p>
                <p className="text-xs text-muted-foreground">Без вопросов</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
