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
            <MobileNav />

            <Link href="/" className="flex items-center">
              <img
                src="/logocards.png"
                alt="GOLO CARDS"
                className="h-20 w-auto"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.currentTarget.style.display = 'none';
                  e.currentTarget.nextElementSibling?.style.setProperty('display', 'block');
                }}
              />
              <span className="text-3xl font-bold hidden">
                <span className="text-red-500">CARD</span>
                <span className="text-white">.GG</span>
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
            <Button variant="ghost" size="icon" className="text-white hover:text-white w-12 h-12 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart-fill w-5 h-5" viewBox="0 0 16 16">
                <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
              </svg>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCartOpen(true)}
              className="relative text-white hover:text-white w-12 h-12 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-fill w-5 h-5" viewBox="0 0 16 16">
                <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
              </svg>
              {totalItems > 0 && (
                <Badge className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center p-0 bg-red-500 text-white text-sm rounded-full">
                  {totalItems}
                </Badge>
              )}
            </Button>

            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />
              <Input
                placeholder="Поиск"
                className="pl-12 pr-4 h-12 w-80 border-white/20 rounded-3xl text-white placeholder:text-white/60 text-lg focus:border-white/40 bg-white/10 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>
      </div>

      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  )
}
