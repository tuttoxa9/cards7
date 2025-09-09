"use client"

import { createContext, useContext, useState, ReactNode } from "react"

interface CartItem {
  id: number
  title: string
  image: string
  price: number
  quantity: number
}

interface WishlistItem {
  id: number
}

interface CartContextType {
  cartItems: CartItem[]
  wishlistItems: WishlistItem[]
  addToCart: (item: Omit<CartItem, "quantity">, quantity?: number) => void
  removeFromCart: (id: number) => void
  updateCartQuantity: (id: number, quantity: number) => void
  toggleWishlist: (id: number) => void
  isInWishlist: (id: number) => boolean
  cartItemCount: number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [wishlistItems, setWishlistItems] = useState<WishlistItem[]>([])

  const addToCart = (item: Omit<CartItem, "quantity">, quantity = 1) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id)
      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + quantity } : i
        )
      }
      return [...prevItems, { ...item, quantity }]
    })
  }

  const removeFromCart = (id: number) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== id))
  }

  const updateCartQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCartItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    )
  }

  const toggleWishlist = (id: number) => {
    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === id)
      if (existingItem) {
        return prevItems.filter((i) => i.id !== id)
      }
      return [...prevItems, { id }]
    })
  }

  const isInWishlist = (id: number) => {
    return wishlistItems.some((i) => i.id === id)
  }

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <CartContext.Provider
      value={{
        cartItems,
        wishlistItems,
        addToCart,
        removeFromCart,
        updateCartQuantity,
        toggleWishlist,
        isInWishlist,
        cartItemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
