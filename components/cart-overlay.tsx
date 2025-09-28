"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { X, Plus, Minus, CreditCard, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"

interface CartOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart()

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

  const handleUpdateQuantity = (id: string, newQuantity: number) => {
    updateQuantity(id, newQuantity)
  }

  const handleRemoveItem = (id: string) => {
    removeFromCart(id)
  }

  const totalDiscount = cartItems.reduce((sum, item) => {
    if (item.originalPrice && item.originalPrice > item.price) {
      return sum + ((item.originalPrice - item.price) * item.quantity)
    }
    return sum
  }, 0)

  return (
    <div className={cn(
      "fixed inset-0 z-50 flex transition-all duration-300",
      isOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
    )}>
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Desktop Cart Content - slide from right */}
      <div className={cn(
        "relative hidden md:flex ml-auto w-1/3 h-full flex-col bg-slate-900 transform transition-transform duration-300 ease-out",
        isOpen ? "translate-x-0" : "translate-x-full"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-8 h-8 text-red-500" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            <h2 className="text-2xl font-bold text-white">Корзина</h2>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
              {cartItems.length} товар{cartItems.length !== 1 ? (cartItems.length < 5 ? 'а' : 'ов') : ''}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:text-red-400 hover:bg-slate-700 w-12 h-12 rounded-full transition-all duration-300 hover:scale-110"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-24 h-24 text-white/20 mb-4" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
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
              <Card key={item.id} className="bg-slate-800 border-slate-600 hover:bg-slate-700 transition-all duration-300 rounded-2xl overflow-hidden shadow-lg">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-32 rounded-xl overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || item.image}
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
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-400 hover:bg-red-600 w-8 h-8 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-xl font-bold text-white">
                          {item.price.toLocaleString()} BYN
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-sm text-white/50 line-through">
                              {item.originalPrice.toLocaleString()} BYN
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
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </Button>

                          <span className="text-white font-semibold w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-8 h-8 rounded-full bg-slate-600 hover:bg-slate-500 text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <span className="text-lg font-bold text-white">
                            {(item.price * item.quantity).toLocaleString()} BYN
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
                <span>{(totalPrice + totalDiscount).toLocaleString()} BYN</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Скидка</span>
                  <span>-{totalDiscount.toLocaleString()} BYN</span>
                </div>
              )}

              <div className="flex justify-between text-xl font-bold text-white border-t border-white/10 pt-2">
                <span>Итого</span>
                <span>{totalPrice.toLocaleString()} BYN</span>
              </div>
            </div>

            <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2">
              <CreditCard className="w-5 h-5" />
              <span>Оформить заказ</span>
            </Button>
          </div>
        )}
      </div>

      {/* Mobile Cart Content - slide from bottom */}
      <div className={cn(
        "relative md:hidden flex flex-col w-full h-full bg-slate-900 transform transition-transform duration-300 ease-out",
        isOpen ? "translate-y-0" : "translate-y-full"
      )}>
        {/* Mobile Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-slate-900/95 backdrop-blur-sm">
          <div className="flex items-center space-x-3">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-6 h-6 text-red-500" viewBox="0 0 16 16">
              <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
            </svg>
            <h2 className="text-xl font-bold text-white">Корзина</h2>
            <Badge className="bg-red-500/20 text-red-400 border-red-500/30 text-xs">
              {cartItems.length}
            </Badge>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:text-red-400 hover:bg-slate-700 w-10 h-10 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center px-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-16 h-16 text-white/20 mb-4" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              <h3 className="text-xl font-semibold text-white mb-2">Корзина пуста</h3>
              <p className="text-white/60 mb-6 text-sm">Добавьте карточки в корзину, чтобы продолжить покупки</p>
              <Button
                onClick={onClose}
                className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
              >
                Перейти к каталогу
              </Button>
            </div>
          ) : (
            cartItems.map((item) => (
              <Card key={item.id} className="bg-slate-800 border-slate-600 rounded-xl overflow-hidden">
                <CardContent className="p-3">
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-16 h-20 rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.imageUrl || item.image}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1 space-y-2">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 pr-2">
                          <h3 className="text-sm font-semibold text-white line-clamp-2">
                            {item.title}
                          </h3>
                          <div className="flex items-center space-x-1 mt-1">
                            <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/30 text-xs px-1 py-0">
                              {item.category}
                            </Badge>
                          </div>
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveItem(item.id)}
                          className="text-gray-400 hover:text-red-400 w-6 h-6 rounded-lg flex-shrink-0"
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>

                      {/* Price */}
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-bold text-white">
                          {item.price.toLocaleString()} BYN
                        </span>
                        {item.originalPrice && (
                          <>
                            <span className="text-xs text-white/50 line-through">
                              {item.originalPrice.toLocaleString()} BYN
                            </span>
                          </>
                        )}
                      </div>

                      {/* Quantity Controls */}
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-full bg-slate-600 hover:bg-slate-500 text-white"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="text-white font-semibold text-sm w-6 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-6 h-6 rounded-full bg-slate-600 hover:bg-slate-500 text-white"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        <div className="text-right">
                          <span className="text-sm font-bold text-white">
                            {(item.price * item.quantity).toLocaleString()} BYN
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

        {/* Mobile Summary */}
        {cartItems.length > 0 && (
          <div className="border-t border-white/10 p-4 space-y-3 bg-slate-900/95 backdrop-blur-sm">
            <div className="space-y-2">
              <div className="flex justify-between text-white/70 text-sm">
                <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                <span>{(totalPrice + totalDiscount).toLocaleString()} BYN</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-green-400 text-sm">
                  <span>Скидка</span>
                  <span>-{totalDiscount.toLocaleString()} BYN</span>
                </div>
              )}

              <div className="flex justify-between text-lg font-bold text-white border-t border-white/10 pt-2">
                <span>Итого</span>
                <span>{totalPrice.toLocaleString()} BYN</span>
              </div>
            </div>

            <Button className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-base font-semibold flex items-center justify-center space-x-2">
              <CreditCard className="w-4 h-4" />
              <span>Оформить заказ</span>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
