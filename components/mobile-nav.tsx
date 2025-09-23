"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingCart, User, Heart, Home, Grid3X3, Star, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart-context"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()
  const { totalItems } = useCart()

  return (
    <>
      {/* Hamburger menu for header */}
      <div className="md:hidden">
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="text-white">
              <Menu className="w-5 h-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 bg-background border-border">
            <div className="space-y-6 py-6">
              {/* Logo */}
              <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
                <img
                  src="/logocards.png"
                  alt="CARD.GG"
                  className="h-8 w-auto"
                />
                <span className="text-xl font-bold text-foreground">CARD.GG</span>
              </Link>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input placeholder="Поиск карточек..." className="pl-10 bg-card border-border" />
              </div>

              {/* Navigation Links */}
              <nav className="space-y-2">
                <Link href="/" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                    <Home className="w-4 h-4 mr-3" />
                    Главная
                  </Button>
                </Link>

                <Link href="/catalog" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                    <Grid3X3 className="w-4 h-4 mr-3" />
                    Каталог
                  </Button>
                </Link>

                <Link href="/media" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                    <svg className="w-4 h-4 mr-3" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M4 6V4h16v2H4zm0 14v-6H3v-2h1V8h16v4h1v2h-1v6H4zm2-10v8h12V10H6z"/>
                    </svg>
                    Медиа
                  </Button>
                </Link>

                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                  <Star className="w-4 h-4 mr-3" />
                  Коллекции
                </Button>

                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                  <Star className="w-4 h-4 mr-3" />
                  Новинки
                </Button>

                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                  <Info className="w-4 h-4 mr-3" />О нас
                </Button>
              </nav>

              {/* User Actions */}
              <div className="space-y-2 pt-4 border-t border-border">
                <Link href="/cart" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart-fill w-5 h-5 mr-3" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                    <span className="flex-1 text-left">Корзина</span>
                    {totalItems > 0 && (
                      <Badge className="bg-primary text-primary-foreground text-xs">{totalItems}</Badge>
                    )}
                  </Button>
                </Link>

                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                  <User className="w-4 h-4 mr-3" />
                  Войти
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Bottom Navigation Bar - Only on Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gray-800">
        <div className="flex items-center justify-around py-2">
          <Link href="/" className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            pathname === "/" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-full ${pathname === "/" ? "bg-white/20" : ""}`}>
              <Home className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1 font-medium">Главная</span>
          </Link>

          <Link href="/catalog" className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            pathname === "/catalog" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-full ${pathname === "/catalog" ? "bg-white/20" : ""}`}>
              <Grid3X3 className="w-5 h-5" />
            </div>
            <span className="text-xs mt-1 font-medium">Каталог</span>
          </Link>

          <Link href="/media" className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors ${
            pathname === "/media" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-full ${pathname === "/media" ? "bg-white/20" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M4 6V4h16v2H4zm0 14v-6H3v-2h1V8h16v4h1v2h-1v6H4zm2-10v8h12V10H6z"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Медиа</span>
          </Link>

          <Link href="/cart" className={`flex flex-col items-center py-2 px-4 rounded-lg transition-colors relative ${
            pathname === "/cart" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-full ${pathname === "/cart" ? "bg-white/20" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M7 4V2C7 1.45 7.45 1 8 1h8c.55 0 1 .45 1 1v2h5c.55 0 1 .45 1 1s-.45 1-1 1h-1v14c0 1.1-.9 2-2 2H5c-1.1 0-2-.9-2-2V6H2c-.55 0-1-.45-1-1s.45-1 1-1h5zm2-1v1h6V3H9zm-1 3v12h8V6H8z"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Корзина</span>
            {totalItems > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {totalItems}
              </div>
            )}
          </Link>
        </div>
      </div>
    </>
  )
}
