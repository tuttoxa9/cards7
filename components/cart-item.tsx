"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Minus, Plus, Trash2, Heart } from "lucide-react"

interface CartItemProps {
  item: {
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
  onUpdateQuantity: (id: number, quantity: number) => void
  onRemove: (id: number) => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  const [quantity, setQuantity] = useState(item.quantity)

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1) {
      setQuantity(newQuantity)
      onUpdateQuantity(item.id, newQuantity)
    }
  }

  const totalPrice = item.price * quantity

  return (
    <Card className="bg-card border-border">
      <CardContent className="p-4">
        <div className="flex space-x-4">
          {/* Product Image */}
          <div className="flex-shrink-0">
            <div className="w-20 h-28 rounded-lg overflow-hidden bg-muted">
              <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-full object-cover" />
            </div>
          </div>

          {/* Product Details */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-card-foreground text-balance">{item.title}</h3>
                <div className="flex items-center space-x-2 mt-1">
                  <Badge className="bg-primary text-primary-foreground text-xs">{item.category}</Badge>
                  <span className="text-xs text-muted-foreground">{item.rarity}</span>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill w-4 h-4" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                  </svg>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onRemove(item.id)}
                  className="text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Price */}
            <div className="flex items-center space-x-2">
              <span className="text-lg font-bold text-foreground">{item.price.toLocaleString()} BYN</span>
              {item.originalPrice && (
                <>
                  <span className="text-sm text-muted-foreground line-through">
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
                <span className="text-sm text-muted-foreground">Количество:</span>
                <div className="flex items-center border border-border rounded-lg">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    className="h-8 w-8"
                  >
                    <Minus className="w-3 h-3" />
                  </Button>
                  <span className="px-3 py-1 text-center min-w-[2rem] text-sm text-foreground">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    className="h-8 w-8"
                  >
                    <Plus className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="text-right">
                <p className="text-sm text-muted-foreground">Итого:</p>
                <p className="text-lg font-bold text-foreground">{totalPrice.toLocaleString()} BYN</p>
              </div>
            </div>

            {/* Stock Status */}
            {!item.inStock && <div className="text-sm text-destructive">Товар временно отсутствует в наличии</div>}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
