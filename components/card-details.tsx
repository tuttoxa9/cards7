"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Star, Heart, Share2, ShoppingCart, Minus, Plus, Shield, Truck, RotateCcw, Sparkles, TrendingUp, Award, Copy, Check } from "lucide-react"
import { toast } from "sonner"

interface CardDetailsProps {
  card: {
    id: string
    title: string
    price: number
    originalPrice?: number
    discount?: number
    rating?: number
    reviews?: number
    category: string
    rarity?: string
    year?: string
    description: string
    features?: string[]
    inStock: boolean
    stockCount?: number
  }
}

import { useCart } from "@/lib/cart-context"

export function CardDetails({ card }: CardDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const { addToCart } = useCart()

  const increaseQuantity = () => {
    const maxStock = card.stockCount || 999
    if (quantity < maxStock) {
      setQuantity((prev) => prev + 1)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1)
    }
  }

  const handleAddToCart = () => {
    setAddingToCart(true)
    addToCart({
      id: card.id,
      title: card.title,
      price: card.price,
      image: card.imageUrl || "/placeholder.svg",
      quantity: quantity
    })
    setAddingToCart(false)
    toast.success(`${card.title} добавлен в корзину`)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: card.title,
          text: card.description,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      toast.success('Ссылка скопирована!')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getRarityColor = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return 'from-amber-500 to-orange-500'
      case 'epic': return 'from-purple-500 to-pink-500'
      case 'rare': return 'from-blue-500 to-cyan-500'
      case 'common': return 'from-gray-500 to-gray-600'
      default: return 'from-gray-500 to-gray-600'
    }
  }

  const getRarityIcon = (rarity?: string) => {
    switch (rarity?.toLowerCase()) {
      case 'legendary': return <Sparkles className="w-4 h-4" />
      case 'epic': return <Award className="w-4 h-4" />
      case 'rare': return <TrendingUp className="w-4 h-4" />
      default: return <Star className="w-4 h-4" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Title and Category */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <Badge className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 px-3 py-1 font-medium transition-colors">
            {card.category}
          </Badge>
          {card.rarity && (
            <Badge className={`bg-gradient-to-r ${getRarityColor(card.rarity)} text-white font-medium border-0`}>
              {getRarityIcon(card.rarity)}
              <span className="ml-1.5">{card.rarity}</span>
            </Badge>
          )}
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-white leading-tight tracking-tight text-balance drop-shadow-sm">
          {card.title}
        </h1>

        {/* Rating & Simple Stock */}
        <div className="flex items-center flex-wrap gap-4 pt-2">
          {card.rating && card.rating > 0 && (
            <div className="flex items-center gap-2">
              <div className="flex items-center text-yellow-500">
                <Star className="w-5 h-5 fill-current" />
                <span className="ml-1.5 font-semibold text-zinc-300">{card.rating}</span>
              </div>
              <span className="text-zinc-500 text-sm">({card.reviews || 0} отзывов)</span>
            </div>
          )}

          {(card.rating && card.rating > 0) && (
            <div className="w-1 h-1 bg-zinc-700 rounded-full" />
          )}

          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full ${card.inStock ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-medium ${card.inStock ? 'text-green-400' : 'text-red-400'}`}>
              {card.inStock ? (card.stockCount ? `В наличии (${card.stockCount} шт)` : "В наличии") : "Нет в наличии"}
            </span>
          </div>
        </div>
      </div>

      <div className="h-px bg-zinc-800 w-full my-6" />

      {/* Price & Actions Inline */}
      <div className="space-y-6">
        <div className="flex flex-col gap-2">
          <div className="flex items-baseline gap-4">
            <span className="text-4xl font-bold text-zinc-100 tracking-tight drop-shadow-sm">
              {card.price.toLocaleString()} <span className="text-2xl text-zinc-400 font-medium">BYN</span>
            </span>
            {card.originalPrice && (
              <span className="text-xl text-zinc-500 line-through decoration-zinc-600">
                {card.originalPrice.toLocaleString()} BYN
              </span>
            )}
            {card.originalPrice && (
              <Badge className="bg-red-500/10 text-red-500 hover:bg-red-500/20 border-red-500/20 font-semibold px-2 py-0.5">
                {card.discount
                  ? `-${card.discount}%`
                  : `-${Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%`}
              </Badge>
            )}
          </div>
        </div>

        {card.inStock && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden h-14">
              <Button
                variant="ghost"
                size="icon"
                onClick={decreaseQuantity}
                disabled={quantity <= 1}
                className="h-full w-12 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-none"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <div className="w-12 text-center text-white font-semibold">
                {quantity}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={increaseQuantity}
                disabled={quantity >= (card.stockCount || 999)}
                className="h-full w-12 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-none"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <Button
              size="lg"
              className="flex-1 h-14 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-base rounded-xl transition-all shadow-lg shadow-primary/20"
              onClick={handleAddToCart}
              disabled={addingToCart}
            >
              {addingToCart ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Добавление...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  <span>В корзину</span>
                </div>
              )}
            </Button>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`h-14 w-14 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-colors ${
                  isWishlisted ? "text-red-500 border-red-500/20 bg-red-500/10 hover:bg-red-500/20" : "text-zinc-400"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="outline"
                size="icon"
                onClick={handleShare}
                className="h-14 w-14 rounded-xl border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 text-zinc-400 transition-colors"
              >
                {copied ? <Check className="w-5 h-5 text-green-500" /> : <Share2 className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        )}
      </div>

      <div className="h-px bg-zinc-800 w-full my-8" />

      {/* Description */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-white">Описание</h3>
        <p className="text-zinc-400 leading-relaxed text-pretty text-base">{card.description}</p>
      </div>

      {/* Features List */}
      {card.features && card.features.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="text-xl font-semibold text-white">Особенности</h3>
          <ul className="grid grid-cols-1 gap-3">
            {card.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 text-zinc-400">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="leading-relaxed">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="h-px bg-zinc-800 w-full my-8" />

      {/* Minimal Guarantees List */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center flex-shrink-0">
            <Shield className="w-5 h-5 text-green-500" />
          </div>
          <span className="text-sm font-medium text-zinc-300">Оригинальный<br/>товар</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-blue-500" />
          </div>
          <span className="text-sm font-medium text-zinc-300">Быстрая<br/>доставка</span>
        </div>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center flex-shrink-0">
            <RotateCcw className="w-5 h-5 text-purple-500" />
          </div>
          <span className="text-sm font-medium text-zinc-300">Возврат<br/>14 дней</span>
        </div>
      </div>
    </div>
  )
}
