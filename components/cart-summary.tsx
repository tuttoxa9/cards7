"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, RotateCcw } from "lucide-react"

interface CartSummaryProps {
  subtotal: number
  discount: number
  shipping: number
  total: number
  itemCount: number
}

export function CartSummary({ subtotal, discount, shipping, total, itemCount }: CartSummaryProps) {
  return (
    <div className="space-y-6">
      {/* Order Summary */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="text-lg text-card-foreground">Итого к оплате</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Товары ({itemCount}):</span>
            <span className="text-foreground">{subtotal.toLocaleString()} ₽</span>
          </div>

          {discount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Скидка:</span>
              <span className="text-green-600">-{discount.toLocaleString()} ₽</span>
            </div>
          )}

          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Доставка:</span>
            <span className="text-foreground">{shipping === 0 ? "Бесплатно" : `${shipping.toLocaleString()} ₽`}</span>
          </div>

          <Separator />

          <div className="flex justify-between text-lg font-bold">
            <span className="text-foreground">Итого:</span>
            <span className="text-foreground">{total.toLocaleString()} ₽</span>
          </div>

          <Button size="lg" className="w-full bg-primary hover:bg-primary/90">
            Оформить заказ
          </Button>

          <Button variant="outline" size="lg" className="w-full border-border bg-transparent">
            Продолжить покупки
          </Button>
        </CardContent>
      </Card>

      {/* Delivery Info */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Truck className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Быстрая доставка</p>
                <p className="text-xs text-muted-foreground">1-3 рабочих дня по России</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Гарантия качества</p>
                <p className="text-xs text-muted-foreground">100% оригинальные карточки</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <RotateCcw className="w-5 h-5 text-primary" />
              <div>
                <p className="text-sm font-medium text-card-foreground">Возврат 14 дней</p>
                <p className="text-xs text-muted-foreground">Без лишних вопросов</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Promo Code */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="space-y-3">
            <p className="text-sm font-medium text-card-foreground">Промокод</p>
            <div className="flex space-x-2">
              <input
                type="text"
                placeholder="Введите промокод"
                className="flex-1 px-3 py-2 text-sm bg-background border border-border rounded-md text-foreground placeholder:text-muted-foreground"
              />
              <Button variant="outline" size="sm" className="border-border bg-transparent">
                Применить
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Free Shipping Banner */}
      {subtotal < 3000 && (
        <Card className="bg-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <Badge className="bg-primary text-primary-foreground">Бесплатная доставка</Badge>
              <p className="text-sm text-foreground">
                Добавьте товаров на {(3000 - subtotal).toLocaleString()} ₽ для бесплатной доставки
              </p>
              <div className="w-full bg-border rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${Math.min((subtotal / 3000) * 100, 100)}%` }}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
