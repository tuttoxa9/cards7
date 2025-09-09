"use client"

import { useCart } from "@/context/cart-context"
import { Header } from "@/components/header"
import { CartItem } from "@/components/cart-item"
import { CartSummary } from "@/components/cart-summary"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"

export default function CartPage() {
  const { cartItems, updateCartQuantity, removeFromCart, cartItemCount } = useCart()

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  // Note: The discount calculation logic is not fully implemented in this mock scenario
  const discount = 0
  const shipping = subtotal >= 5000 ? 0 : 299
  const total = subtotal - discount + shipping

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
            {cartItemCount} {cartItemCount === 1 ? "товар" : cartItemCount < 5 ? "товара" : "товаров"} в
            корзине
          </p>
        </div>

        {/* Cart Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <CartItem
                key={item.id}
                item={item}
                onUpdateQuantity={updateCartQuantity}
                onRemove={removeFromCart}
              />
            ))}
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary
              subtotal={subtotal}
              discount={discount}
              shipping={shipping}
              total={total}
              itemCount={cartItemCount}
            />
          </div>
        </div>
      </main>
    </div>
  )
}
