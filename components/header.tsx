"use client"

import React, { useState, useEffect } from "react"
import { Search, ShoppingCart, Heart, Grid3X3, Folder, ArrowUp, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import Link from "next/link"
import { cn } from "@/lib/utils"

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)

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
        isScrolled ? "bg-gradient-to-b from-black/80 to-transparent" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/50 via-black/20 to-transparent pointer-events-none",
          isScrolled && "opacity-0"
        )}
      />

      <div className="relative container mx-auto px-6">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-8">
            <MobileNav />

            <Link href="/" className="flex items-center">
              <span className="text-3xl font-bold">
                <span className="text-red-500">CARD</span>
                <span className="text-white">.GG</span>
              </span>
            </Link>

            <nav className="hidden md:flex items-center space-x-8">
              <Link href="/catalog">
                <Button
                  variant="ghost"
                  className="text-white hover:text-red-400 text-lg flex items-center space-x-2 px-4 py-2"
                >
                  <Grid3X3 className="w-5 h-5" />
                  <span>Каталог</span>
                </Button>
              </Link>
              <Button
                variant="ghost"
                className="text-white hover:text-red-400 text-lg flex items-center space-x-2 px-4 py-2"
              >
                <Folder className="w-5 h-5" />
                <span>Медиа</span>
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-red-400 text-lg flex items-center space-x-2 px-4 py-2"
              >
                <ArrowUp className="w-5 h-5" />
                <span>Пополнение</span>
              </Button>
              <Button
                variant="ghost"
                className="text-white hover:text-red-400 text-lg flex items-center space-x-2 px-4 py-2"
              >
                <Gift className="w-5 h-5" />
                <span>Донат</span>
              </Button>
            </nav>
          </div>

          <div className="flex items-center space-x-6">
            <Button variant="ghost" size="icon" className="text-white hover:text-red-400 w-12 h-12 rounded-full">
              <Heart className="w-6 h-6" />
            </Button>

            <Link href="/cart">
              <Button
                variant="ghost"
                size="icon"
                className="relative text-white hover:text-red-400 w-12 h-12 rounded-full"
              >
                <ShoppingCart className="w-6 h-6" />
                <Badge className="absolute -top-1 -right-1 w-6 h-6 flex items-center justify-center p-0 bg-red-500 text-white text-sm rounded-full">
                  1
                </Badge>
              </Button>
            </Link>

            <div className="relative hidden md:block">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
              <Input
                placeholder="Поиск"
                className="pl-12 pr-4 py-3 w-80 border-white/20 rounded-full text-white placeholder:text-white/60 text-lg focus:border-white/40 bg-transparent"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
