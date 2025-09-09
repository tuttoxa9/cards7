"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, ShoppingBag, CreditCard, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

interface CartItem {
  id: number
  title: string
  image: string
  price: number
  originalPrice?: number
  discount?: number
  category: string
  rarity: string
  quantity: number
  inStock: boolean
}

interface CartOverlayProps {
  isOpen: boolean
  onClose: () => void
}

const mockCartItems: CartItem[] = [
  {
    id: 1,
    title: "Spider-Man Multiverse Legendary",
    image: "/spider-man-multiverse-trading-card-web-design.jpg",
    price: 2499,
    originalPrice: 3299,
    discount: 24,
    category: "Супергерои",
    rarity: "Легендарные",
    quantity: 1,
    inStock: true,
  },
  {
    id: 2,
    title: "Cyberpunk GT-R",
    image: "/futuristic-cyberpunk-car-trading-card-neon.jpg",
    price: 1899,
    originalPrice: null,
    discount: null,
    category: "Автомобили",
    rarity: "Эпические",
    quantity: 2,
    inStock: true,
  },
  {
    id: 3,
    title: "Batman Dark Knight",
    image: "/batman-dark-knight-trading-card-gothic.jpg",
    price: 2799,
    originalPrice: 3499,
    discount: 20,
    category: "Супергерои",
    rarity: "Легендарные",
    quantity: 1,
    inStock: true,
  },
]

export function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const [cartItems, setCartItems] = useState<CartItem[]>(mockCartItems)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      setCartItems(cartItems.filter(item => item.id !== id))
    } else {
      setCartItems(cartItems.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      ))
    }
  }

  const removeItem = (id: number) => {
    setCartItems(cartItems.filter(item => item.id !== id))
  }

  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.originalPrice && item.discount) {
      return sum + ((item.originalPrice - item.price) * item.quantity)
    }
    return sum
  }, 0)

  if (!isOpen) return null

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex transition-all duration-300",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible"
    )}>
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Cart Content */}
      <div className={cn(
        "relative w-full h-full flex flex-col bg-gradient-to-br from-slate-950/95 via-purple-950/30 to-slate-900/95 backdrop-blur-md transition-transform duration-500",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <ShoppingBag className="w-8 h-8 text-red-500" />
            <h2 className="text-2xl font-bold text-white">Корзина</h2>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {cartItems.length} товар{cartItems.length !== 1 ? (cartItems.length < 5 ? 'а' : 'ов') : ''}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:text-red-400 hover:bg-white/10 w-12 h-12 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <ShoppingBag className="w-24 h-24 text-white/20 mb-4" />
              <h3 className="text-2xl font-semibold text-white mb-2">Корзина пуста</h3>
              <p className="text-white/60 mb-6">Добавьте карточки в корзину, чтобы продолжить покупки</p>
              <Button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
              >
                Перейти к каталогу
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-all duration-300 rounded-2xl overflow-hidden">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div>
                          <h3 className="text-lg font-semibold text-white line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs">
                              {item.category}
                            </Badge>
                            <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-xs">
                              {item.rarity}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => removeItem(item.id)}
                          className="text-white/60 hover:text-red-400 hover:bg-red-500/20 w-8 h-8 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-white">
                          {item.price.toLocaleString()} ₽
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-sm text-white/50 line-through">
                              {item.originalPrice.toLocaleString()} ₽
                            </span>
                            <Badge variant="destructive" className="bg-red-600 text-xs">
                              -{item.discount}%
                            </Badge>
                          </>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold text-white">
                            {(item.price * item.quantity).toLocaleString()} ₽
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-6 space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-white/70">
                <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                <span>{(totalPrice + totalDiscount).toLocaleString()} ₽</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Скидка</span>
                  <span>-{totalDiscount.toLocaleString()} ₽</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold text-white border-t border-white/10 pt-2">
                <span>Итого</span>
                <span>{totalPrice.toLocaleString()} ₽</span>
              </div>
            </div>

            <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Оформить заказ</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
