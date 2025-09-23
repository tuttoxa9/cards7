"use client"

import React, { useState, useEffect } from "react"
import { Search, ShoppingCart, Heart, Grid3X3, Folder } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { CartOverlay } from "@/components/cart-overlay"
import { useCart } from "@/lib/cart-context"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const { totalItems } = useCart()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 transition-colors duration-300",
        isScrolled ? "bg-gradient-to-b from-black/95 to-transparent" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none",
          isScrolled && "opacity-0"
        )}
      />

      <div className="relative container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <Link href="/" className="flex items-center">
              <img
                src="/logocards.png"
                alt="GOLO CARDS"
                className="h-28 w-auto scale-x-125"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.style.setProperty('display', 'block');
                }}
              />
              <span className="text-3xl font-bold hidden">
                <span className="text-red-500">GOLO</span>
                <span className="text-white"> CARDS</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-2">
              <Link href="/catalog">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white text-lg flex items-center space-x-2 px-4 py-2 rounded-3xl bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span>Каталог</span>
                </Button>
              </Link>
              <Link href="/media">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white text-lg flex items-center space-x-2 px-4 py-2 rounded-3xl bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  <Folder className="w-5 h-5" />
                  <span>Медиа</span>
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <Button variant="ghost" size="icon" className="md:hidden text-white hover:text-white w-12 h-12 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-sm">
              <Search className="w-5 h-5" />
            </Button>

            {/* Desktop Search */}
            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />
              <Input
                placeholder="Поиск"
                className="pl-12 pr-4 h-12 w-80 border-white/20 rounded-3xl text-white placeholder:text-white/60 text-lg focus:border-white/40 bg-white/10 backdrop-blur-sm"
              />
            </div>

            {/* Cart Button */}
            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:text-white w-12 h-12 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-sm relative"
              onClick={() => setIsCartOpen(true)}
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-red-500 text-white border-none">
                  {totalItems}
                </Badge>
              )}
            </Button>
          </div>
        </div>
      </div>

      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileNav />
    </header>
  )
}
