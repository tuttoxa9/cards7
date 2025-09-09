"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Shield, Truck, RotateCcw, Check } from "lucide-react"
import { useCart } from "@/context/cart-context"

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
  const { addToCart, toggleWishlist, isInWishlist } = useCart()

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

  const handleAddToCart = () => {
    const item = {
      id: card.id,
      title: card.title,
      price: card.price,
      image: card.images[0],
    }
    addToCart(item, quantity)
  }

  const isWishlisted = isInWishlist(card.id)

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-sm">
          <Badge className="bg-primary/10 text-primary hover:bg-primary/20">{card.category}</Badge>
          <span className="text-muted-foreground">•</span>
          <span className="text-muted-foreground">{card.year}</span>
        </div>
        <h1 className="text-4xl font-bold tracking-tight text-foreground text-balance">{card.title}</h1>
      </div>

      {/* Rating & Rarity */}
      <div className="flex items-center gap-6 text-sm">
        <div className="flex items-center gap-1.5">
          <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          <span className="font-semibold text-foreground">{card.rating}</span>
          <span className="text-muted-foreground">({card.reviews} отзывов)</span>
        </div>
        <Separator orientation="vertical" className="h-5" />
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">Редкость:</span>
          <span className="font-semibold text-foreground">{card.rarity}</span>
        </div>
      </div>

      {/* Price */}
      <div className="space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-4xl font-bold text-foreground">{card.price.toLocaleString()} ₽</span>
          {card.originalPrice && (
            <span className="text-xl text-muted-foreground line-through">
              {card.originalPrice.toLocaleString()} ₽
            </span>
          )}
        </div>
        {card.originalPrice && (
          <div className="flex items-center gap-2">
            <Badge variant="destructive" className="bg-red-600/10 text-red-600">
              Скидка {card.discount}%
            </Badge>
            <p className="text-sm text-muted-foreground">
              Вы экономите {(card.originalPrice - card.price).toLocaleString()} ₽
            </p>
          </div>
        )}
      </div>

      <Separator />

      {/* Actions */}
      {card.inStock ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between border border-border rounded-lg p-2">
            <span className="text-sm font-medium text-foreground pl-2">Количество:</span>
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={decreaseQuantity} disabled={quantity <= 1}>
                <Minus className="w-4 h-4" />
              </Button>
              <span className="w-10 text-center text-lg font-semibold text-foreground">{quantity}</span>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= card.stockCount}
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button size="lg" className="flex-1 bg-primary hover:bg-primary/90" onClick={handleAddToCart}>
              <ShoppingCart className="w-5 h-5 mr-2" />
              В корзину
            </Button>
            <Button
              variant={isWishlisted ? "secondary" : "outline"}
              size="lg"
              onClick={() => toggleWishlist(card.id)}
              className="px-3"
            >
              <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? "text-red-500 fill-red-500" : ""}`} />
            </Button>
            <Button variant="outline" size="lg" className="px-3">
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        </div>
      ) : (
        <Card className="bg-muted/50 border-dashed">
          <CardContent className="pt-6">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-foreground">Нет в наличии</h3>
              <p className="text-muted-foreground mt-1">Этот товар временно отсутствует</p>
              <Button variant="outline" className="mt-4">
                Уведомить о поступлении
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stock Info */}
      <div className="flex items-center gap-2 text-sm">
        {card.inStock ? (
          <>
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-green-600 font-semibold">В наличии</span>
            <span className="text-muted-foreground">({card.stockCount} шт.)</span>
          </>
        ) : (
          <>
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <span className="text-red-600 font-semibold">Нет в наличии</span>
          </>
        )}
      </div>

      <Tabs defaultValue="description" className="w-full">
        <TabsList className="grid w-full grid-cols-2 bg-muted/50">
          <TabsTrigger value="description">Описание</TabsTrigger>
          <TabsTrigger value="features">Особенности</TabsTrigger>
        </TabsList>
        <TabsContent value="description" className="pt-6">
          <div className="prose prose-sm max-w-none text-foreground/80">
            <p>{card.description}</p>
          </div>
        </TabsContent>
        <TabsContent value="features" className="pt-6">
          <div className="prose prose-sm max-w-none text-foreground/80">
            <ul className="space-y-2">
              {card.features.map((feature, index) => (
                <li key={index} className="flex items-start gap-3">
                  <Check className="w-4 h-4 mt-1 text-primary flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </div>
        </TabsContent>
      </Tabs>

      {/* Guarantees */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        <div className="flex items-center gap-3">
          <Shield className="w-8 h-8 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Гарантия качества</p>
            <p className="text-sm text-muted-foreground">100% оригинал</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Truck className="w-8 h-8 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Быстрая доставка</p>
            <p className="text-sm text-muted-foreground">1-3 рабочих дня</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <RotateCcw className="w-8 h-8 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Возврат 14 дней</p>
            <p className="text-sm text-muted-foreground">Без вопросов</p>
          </div>
        </div>
      </div>
    </div>
  )
}
