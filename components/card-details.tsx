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

export function CardDetails({ card }: CardDetailsProps) {
  const [quantity, setQuantity] = useState(1)
  const [isWishlisted, setIsWishlisted] = useState(false)
  const [copied, setCopied] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)

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

  const handleAddToCart = async () => {
    setAddingToCart(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
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
    <div className="space-y-8">
      {/* Title and Category with enhanced styling */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3 mb-3">
          <Badge className="bg-gradient-to-r from-primary to-primary/80 text-white shadow-lg shadow-primary/25 px-3 py-1">
            {card.category}
          </Badge>
          {card.year && (
            <Badge variant="outline" className="border-zinc-600 text-zinc-300 bg-zinc-900/50">
              {card.year}
            </Badge>
          )}
          {card.rarity && (
            <Badge className={`bg-gradient-to-r ${getRarityColor(card.rarity)} text-white shadow-lg`}>
              {getRarityIcon(card.rarity)}
              <span className="ml-1">{card.rarity}</span>
            </Badge>
          )}
        </div>
        <h1 className="text-4xl font-bold text-white text-balance leading-tight bg-gradient-to-r from-white to-zinc-300 bg-clip-text text-transparent">
          {card.title}
        </h1>
      </div>

      {/* Enhanced Rating and Reviews */}
      {(card.rating && card.rating > 0) && (
        <Card className="bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 transition-colors ${
                        i < Math.floor(card.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-zinc-600"
                      }`}
                    />
                  ))}
                </div>
                <span className="text-lg font-semibold text-white">{card.rating}</span>
                <span className="text-zinc-400">({card.reviews || 0} отзывов)</span>
              </div>
              <Badge className="bg-green-600/20 text-green-400 border-green-600/30">
                Высокий рейтинг
              </Badge>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Price Section */}
      <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border-zinc-700/50 shadow-2xl backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-white">{card.price.toLocaleString()} BYN</span>
              {card.originalPrice && (
                <>
                  <span className="text-xl text-zinc-500 line-through">
                    {card.originalPrice.toLocaleString()} BYN
                  </span>
                  <Badge className="bg-gradient-to-r from-red-600 to-red-500 text-white shadow-lg animate-pulse">
                    -{Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%
                  </Badge>
                </>
              )}
            </div>
            {card.originalPrice && (
              <div className="p-3 bg-green-600/10 border border-green-600/30 rounded-lg">
                <p className="text-green-400 font-medium">
                  💰 Вы экономите {(card.originalPrice - card.price).toLocaleString()} BYN
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Stock Information */}
      <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full mb-3 ${
                card.inStock ? 'bg-green-600/20 text-green-400' : 'bg-red-600/20 text-red-400'
              }`}>
                {card.inStock ? '✓' : '✗'}
              </div>
              <p className="text-sm text-zinc-400 mb-1">Наличие</p>
              <p className={`font-semibold ${card.inStock ? "text-green-400" : "text-red-400"}`}>
                {card.inStock ? (card.stockCount ? `${card.stockCount} шт.` : "В наличии") : "Нет в наличии"}
              </p>
            </div>
            <div className="text-center p-4 rounded-xl bg-zinc-800/50 border border-zinc-700/50">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-blue-600/20 text-blue-400 mb-3">
                <Shield className="w-6 h-6" />
              </div>
              <p className="text-sm text-zinc-400 mb-1">Гарантия</p>
              <p className="font-semibold text-blue-400">Оригинал</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enhanced Quantity and Cart Section */}
      {card.inStock && (
        <Card className="bg-gradient-to-br from-zinc-900/80 to-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center justify-between">
              <span className="text-lg font-medium text-white">Количество:</span>
              <div className="flex items-center border border-zinc-600 rounded-xl bg-zinc-800/50 overflow-hidden">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={decreaseQuantity}
                  disabled={quantity <= 1}
                  className="h-12 w-12 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <span className="px-6 py-3 text-center min-w-[4rem] text-white font-semibold bg-zinc-900/50">
                  {quantity}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={increaseQuantity}
                  disabled={quantity >= (card.stockCount || 999)}
                  className="h-12 w-12 text-zinc-400 hover:text-white hover:bg-zinc-700/50"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                size="lg"
                className="flex-1 bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white shadow-lg shadow-primary/25 transition-all duration-300 transform hover:scale-105"
                onClick={handleAddToCart}
                disabled={addingToCart}
              >
                {addingToCart ? (
                  <div className="flex items-center">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Добавление...
                  </div>
                ) : (
                  <>
                    <ShoppingCart className="w-5 h-5 mr-2" />
                    Добавить в корзину
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                size="lg"
                onClick={() => setIsWishlisted(!isWishlisted)}
                className={`border-zinc-600 transition-all duration-300 transform hover:scale-105 ${
                  isWishlisted
                    ? "bg-red-600/20 border-red-600/50 text-red-400 hover:bg-red-600/30"
                    : "hover:bg-zinc-800/50 text-zinc-400 hover:text-white"
                }`}
              >
                <Heart className={`w-5 h-5 ${isWishlisted ? "fill-current" : ""}`} />
              </Button>

              <Button
                variant="outline"
                size="lg"
                className="border-zinc-600 hover:bg-zinc-800/50 text-zinc-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                onClick={handleShare}
              >
                {copied ? <Check className="w-5 h-5" /> : <Share2 className="w-5 h-5" />}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Description */}
      <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-primary to-primary/50 rounded-full" />
            Описание
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-zinc-300 leading-relaxed text-pretty text-lg">{card.description}</p>
        </CardContent>
      </Card>

      {/* Enhanced Features */}
      {card.features && card.features.length > 0 && (
        <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-xl text-white flex items-center gap-3">
              <div className="w-1 h-8 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full" />
              Особенности
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {card.features.map((feature, index) => (
                <div key={index} className="flex items-start space-x-4 p-3 rounded-lg bg-zinc-800/30 border border-zinc-700/50">
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full mt-3 flex-shrink-0" />
                  <span className="text-zinc-300 leading-relaxed">{feature}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Enhanced Guarantees */}
      <Card className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/50 border-zinc-700/50 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-xl text-white flex items-center gap-3">
            <div className="w-1 h-8 bg-gradient-to-b from-green-500 to-green-400 rounded-full" />
            Гарантии и сервис
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-green-600/10 to-green-700/5 border border-green-600/20 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-600/20 to-green-700/10 flex items-center justify-center shadow-lg">
                <Shield className="w-6 h-6 text-green-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Гарантия качества</p>
                <p className="text-sm text-green-400">100% оригинал</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-blue-600/10 to-blue-700/5 border border-blue-600/20 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/20 to-blue-700/10 flex items-center justify-center shadow-lg">
                <Truck className="w-6 h-6 text-blue-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Быстрая доставка</p>
                <p className="text-sm text-blue-400">1-3 рабочих дня</p>
              </div>
            </div>

            <div className="flex items-center space-x-4 p-4 rounded-xl bg-gradient-to-br from-purple-600/10 to-purple-700/5 border border-purple-600/20 transition-all duration-300 hover:scale-105">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600/20 to-purple-700/10 flex items-center justify-center shadow-lg">
                <RotateCcw className="w-6 h-6 text-purple-400" />
              </div>
              <div>
                <p className="font-semibold text-white mb-1">Возврат 14 дней</p>
                <p className="text-sm text-purple-400">Без вопросов</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
