"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { CartItem } from "@/components/cart-item"
import { CartSummary } from "@/components/cart-summary"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"

// Mock cart data
const initialCartItems = [
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

export default function CartPage() {
  const [cartItems, setCartItems] = useState(initialCartItems)

  const handleUpdateQuantity = (id: number, quantity: number) => {
    setCartItems((items) => items.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const handleRemoveItem = (id: number) => {
    setCartItems((items) => items.filter((item) => item.id !== id))
  }

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discount = cartItems.reduce((sum, item) => {
    if (item.originalPrice) {
      return sum + (item.originalPrice - item.price) * item.quantity
    }
    return sum
  }, 0)
  const shipping = subtotal >= 3000 ? 0 : 299
  const total = subtotal + shipping
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Header />

        <main className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <div className="w-24 h-24 mx-auto bg-muted rounded-full flex items-center justify-center">
              <ShoppingBag className="w-12 h-12 text-muted-foreground" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground mb-2">Ваша корзина пуста</h1>
              <p className="text-muted-foreground">Добавьте карточки в корзину, чтобы продолжить покупки</p>
            </div>
            <Link href="/catalog">
              <Button size="lg" className="bg-primary hover:bg-primary/90">
                Перейти к каталогу
              </Button>
            </Link>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Продолжить покупки
            </Button>
          </Link>
        </div>

        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Корзина</h1>
          <p className="text-muted-foreground">
            {itemCount} {itemCount === 1 ? "товар" : itemCount < 5 ? "товара" : "товаров"} в корзине
          </p>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem key={item.id} item={item} onUpdateQuantity={handleUpdateQuantity} onRemove={handleRemoveItem} />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              itemCount={itemCount}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
