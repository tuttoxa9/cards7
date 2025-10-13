"use client"

import { useEffect, useRef, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { X, Plus, Minus, CreditCard, Trash2, ArrowLeft, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface CartOverlayProps {
  isOpen: boolean
  onClose: () => void
}

export function CartOverlay({ isOpen, onClose }: CartOverlayProps) {
  const { cartItems, updateQuantity, removeFromCart, totalPrice, clearCart } = useCart()
  const router = useRouter()
  const [dragY, setDragY] = useState(0)
  const [isDragging, setIsDragging] = useState(false)
  const [view, setView] = useState<'cart' | 'form'>('cart')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      // Сброс состояния при закрытии
      setView('cart')
      setName('')
      setPhone('')
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

  const handleDragStart = (e: React.TouchEvent) => {
    setIsDragging(true)
  }

  const handleDragMove = (e: React.TouchEvent) => {
    if (isDragging) {
      const touch = e.touches[0]
      const deltaY = touch.clientY - (window.innerHeight * 0.1)
      if (deltaY > 0) {
        setDragY(deltaY)
      }
    }
  }

  const handleDragEnd = () => {
    if (isDragging) {
      if (dragY > 100) {
        onClose()
      }
      setDragY(0)
      setIsDragging(false)
    }
  }

  const handleCatalogClick = () => {
    onClose()
    router.push('/catalog')
  }

  const handleCheckout = () => {
    setView('form')
  }

  const handleBackToCart = () => {
    setView('cart')
  }

  const handleSubmitOrder = async () => {
    // Валидация
    if (!name.trim() || !phone.trim()) {
      toast.error('Пожалуйста, заполните все поля')
      return
    }

    setIsSubmitting(true)

    try {
      const orderData = {
        name: name.trim(),
        phone: phone.trim(),
        items: cartItems.map(item => ({
          title: item.title,
          quantity: item.quantity,
          price: item.price
        })),
        total: totalPrice,
        discount: totalDiscount
      }

      const response = await fetch('/api/send-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      })

      if (response.ok) {
        toast.success('Спасибо! Ваш заказ принят.')
        clearCart()
        onClose()
      } else {
        toast.error('Не удалось отправить заказ. Попробуйте снова.')
      }
    } catch (error) {
      console.error('Ошибка отправки заказа:', error)
      toast.error('Не удалось отправить заказ. Попробуйте снова.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop with blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />

          {/* Desktop Cart Content - slide from right */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: "0%" }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed top-0 right-0 h-full w-full md:w-[450px] hidden md:flex flex-col bg-black border-l border-t border-b border-[#555555] z-[60]"
            style={{ borderRadius: "16px 0 0 16px" }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-[#555555]">
          <div className="flex items-center space-x-3">
            {view === 'form' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToCart}
                className="text-white hover:text-red-400 hover:bg-white/10 w-12 h-12 rounded-full transition-all duration-300"
              >
                <ArrowLeft className="w-6 h-6" />
              </Button>
            )}
            <h2 className="text-2xl font-bold text-white">
              {view === 'cart' ? 'Корзина' : 'Оформление заказа'}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:text-red-400 hover:bg-white/10 w-12 h-12 rounded-full transition-all duration-300"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {view === 'cart' ? (
            // Cart Items View
            cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-24 h-24 text-gray-500 mb-4" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <h3 className="text-2xl font-semibold text-white mb-2">Корзина пуста</h3>
                <p className="text-gray-400 mb-6">Добавьте карточки в корзину, чтобы продолжить покупки</p>
                <Button
                  onClick={handleCatalogClick}
                  className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full"
                >
                  Перейти к каталогу
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="bg-[#0a0a0a] border-[#333333] hover:bg-[#111111] transition-all duration-300 rounded-xl overflow-hidden">
                  <CardContent className="p-4">
                    <div className="flex gap-4">
                      {/* Image */}
                      <div className="w-16 h-auto rounded-lg overflow-hidden flex-shrink-0">
                        <img
                          src={item.imageUrl || item.image}
                          alt={item.title}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Details */}
                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h3 className="text-base font-semibold text-white line-clamp-2">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs text-gray-400">{item.category}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400">{item.rarity}</span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-8 h-8 rounded-lg ml-2"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-7 h-7 rounded-md bg-[#222222] hover:bg-[#333333] text-white border border-[#444444]"
                          >
                            <Minus className="w-3 h-3" />
                          </Button>

                          <span className="text-white font-semibold text-sm w-8 text-center">
                            {item.quantity}
                          </span>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                            className="w-7 h-7 rounded-md bg-[#222222] hover:bg-[#333333] text-white border border-[#444444]"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {item.originalPrice && item.originalPrice > item.price ? (
                              <>
                                <span className="text-sm text-gray-500 line-through">
                                  {item.originalPrice.toLocaleString()} BYN
                                </span>
                                <span className="text-base font-bold text-red-500">
                                  {item.price.toLocaleString()} BYN
                                </span>
                              </>
                            ) : (
                              <span className="text-base font-bold text-white">
                                {item.price.toLocaleString()} BYN
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          ) : (
            // Order Form View
            <div className="space-y-6 h-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Ваше имя</label>
                  <Input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#0a0a0a] border-[#333333] text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Номер телефона</label>
                  <Input
                    type="tel"
                    placeholder="Номер телефона"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#0a0a0a] border-[#333333] text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-4 bg-[#0a0a0a] border border-[#333333] rounded-xl space-y-2">
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                  <span>{(totalPrice + totalDiscount).toLocaleString()} BYN</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-red-400 text-sm">
                    <span>Скидка</span>
                    <span>-{totalDiscount.toLocaleString()} BYN</span>
                  </div>
                )}

                <div className="h-[2px] bg-[#555555] my-2"></div>

                <div className="flex justify-between text-lg font-bold text-white">
                  <span>Итого</span>
                  <span>{totalPrice.toLocaleString()} BYN</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Summary */}
        {cartItems.length > 0 && view === 'cart' && (
          <div className="sticky bottom-0 border-t border-[#555555] p-6 space-y-4 bg-black">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                <span>{(totalPrice + totalDiscount).toLocaleString()} BYN</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-red-400 text-sm">
                  <span>Скидка</span>
                  <span>-{totalDiscount.toLocaleString()} BYN</span>
                </div>
              )}

              <div className="h-[2px] bg-[#555555] my-3"></div>

              <div className="flex justify-between text-xl font-bold text-white">
                <span>Итого</span>
                <span>{totalPrice.toLocaleString()} BYN</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-5 h-5" />
              <span>Оформить заказ</span>
            </Button>
          </div>
        )}
        {view === 'form' && (
          <div className="sticky bottom-0 border-t border-[#555555] p-6 bg-black">
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-4 rounded-xl text-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Отправка...</span>
                </>
              ) : (
                <span>Подтвердить заказ</span>
              )}
            </Button>
          </div>
        )}
          </motion.div>

          {/* Mobile Cart Content - slide from bottom */}
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: dragY }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed bottom-0 left-0 right-0 h-[90vh] md:hidden flex flex-col bg-black border-t border-l border-r border-[#555555] z-[60]"
            style={{
              borderRadius: "16px 16px 0 0",
              transform: isDragging ? `translateY(${dragY}px)` : undefined
            }}
            onTouchStart={handleDragStart}
            onTouchMove={handleDragMove}
            onTouchEnd={handleDragEnd}
          >
            {/* Grabber */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-[#555555] rounded-full"></div>
            </div>

            {/* Mobile Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-[#555555]">
          <div className="flex items-center space-x-3">
            {view === 'form' && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleBackToCart}
                className="text-white hover:text-red-400 hover:bg-white/10 w-10 h-10 rounded-full transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
            )}
            <h2 className="text-xl font-bold text-white">
              {view === 'cart' ? 'Корзина' : 'Оформление заказа'}
            </h2>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:text-red-400 hover:bg-white/10 w-10 h-10 rounded-full"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Mobile Content */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {view === 'cart' ? (
            // Mobile Cart Items View
            cartItems.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-16 h-16 text-gray-500 mb-4" viewBox="0 0 16 16">
                  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                </svg>
                <h3 className="text-xl font-semibold text-white mb-2">Корзина пуста</h3>
                <p className="text-gray-400 mb-6 text-sm">Добавьте карточки в корзину, чтобы продолжить покупки</p>
                <Button
                  onClick={handleCatalogClick}
                  className="bg-red-500 hover:bg-red-600 text-white px-6 py-2 rounded-full"
                >
                  Перейти к каталогу
                </Button>
              </div>
            ) : (
              cartItems.map((item) => (
                <Card key={item.id} className="bg-[#0a0a0a] border-[#333333] rounded-xl overflow-hidden">
                  <CardContent className="p-3">
                    <div className="flex gap-3">
                      {/* Image */}
                      <div className="w-16 h-auto rounded-lg overflow-hidden flex-shrink-0">
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
                              <span className="text-xs text-gray-400">{item.category}</span>
                              <span className="text-xs text-gray-500">•</span>
                              <span className="text-xs text-gray-400">{item.rarity}</span>
                            </div>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveItem(item.id)}
                            className="text-gray-400 hover:text-red-400 hover:bg-red-500/10 w-6 h-6 rounded-lg flex-shrink-0"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                            className="w-6 h-6 rounded-md bg-[#222222] hover:bg-[#333333] text-white border border-[#444444]"
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
                            className="w-6 h-6 rounded-md bg-[#222222] hover:bg-[#333333] text-white border border-[#444444]"
                          >
                            <Plus className="w-3 h-3" />
                          </Button>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            {item.originalPrice && item.originalPrice > item.price ? (
                              <>
                                <span className="text-xs text-gray-500 line-through">
                                  {item.originalPrice.toLocaleString()} BYN
                                </span>
                                <span className="text-sm font-bold text-red-500">
                                  {item.price.toLocaleString()} BYN
                                </span>
                              </>
                            ) : (
                              <span className="text-sm font-bold text-white">
                                {item.price.toLocaleString()} BYN
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )
          ) : (
            // Mobile Order Form View
            <div className="space-y-6 h-full">
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Ваше имя</label>
                  <Input
                    type="text"
                    placeholder="Ваше имя"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="bg-[#0a0a0a] border-[#333333] text-white placeholder:text-gray-500"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">Номер телефона</label>
                  <Input
                    type="tel"
                    placeholder="Номер телефона"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="bg-[#0a0a0a] border-[#333333] text-white placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Summary */}
              <div className="p-3 bg-[#0a0a0a] border border-[#333333] rounded-xl space-y-2">
                <div className="flex justify-between text-gray-300 text-sm">
                  <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                  <span>{(totalPrice + totalDiscount).toLocaleString()} BYN</span>
                </div>

                {totalDiscount > 0 && (
                  <div className="flex justify-between text-red-400 text-sm">
                    <span>Скидка</span>
                    <span>-{totalDiscount.toLocaleString()} BYN</span>
                  </div>
                )}

                <div className="h-[2px] bg-[#555555] my-2"></div>

                <div className="flex justify-between text-base font-bold text-white">
                  <span>Итого</span>
                  <span>{totalPrice.toLocaleString()} BYN</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Mobile Summary */}
        {cartItems.length > 0 && view === 'cart' && (
          <div className="sticky bottom-0 border-t border-[#555555] p-4 space-y-3 bg-black">
            <div className="space-y-2">
              <div className="flex justify-between text-gray-300 text-sm">
                <span>Товары ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
                <span>{(totalPrice + totalDiscount).toLocaleString()} BYN</span>
              </div>

              {totalDiscount > 0 && (
                <div className="flex justify-between text-red-400 text-sm">
                  <span>Скидка</span>
                  <span>-{totalDiscount.toLocaleString()} BYN</span>
                </div>
              )}

              <div className="h-[2px] bg-[#555555] my-2"></div>

              <div className="flex justify-between text-lg font-bold text-white">
                <span>Итого</span>
                <span>{totalPrice.toLocaleString()} BYN</span>
              </div>
            </div>

            <Button
              onClick={handleCheckout}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-base font-semibold flex items-center justify-center space-x-2"
            >
              <CreditCard className="w-4 h-4" />
              <span>Оформить заказ</span>
            </Button>
          </div>
        )}
        {view === 'form' && (
          <div className="sticky bottom-0 border-t border-[#555555] p-4 bg-black">
            <Button
              onClick={handleSubmitOrder}
              disabled={isSubmitting}
              className="w-full bg-red-500 hover:bg-red-600 text-white py-3 rounded-xl text-base font-semibold transition-all duration-300 flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Отправка...</span>
                </>
              ) : (
                <span>Подтвердить заказ</span>
              )}
            </Button>
          </div>
        )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
