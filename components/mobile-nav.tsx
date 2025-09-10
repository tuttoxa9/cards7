"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, ShoppingCart, User, Heart, Home, Grid3X3, Star, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import Link from "next/link"

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="md:hidden">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-foreground">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 bg-background border-border">
          <div className="space-y-6 py-6">
            {/* Logo */}
            <Link href="/" onClick={() => setIsOpen(false)} className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-foreground">CardVault</span>
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
              <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-heart-fill w-5 h-5 mr-3" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                </svg>
                Избранное
              </Button>

              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className="bi bi-cart-fill w-5 h-5 mr-3" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                  </svg>
                  <span className="flex-1 text-left">Корзина</span>
                  <Badge className="bg-primary text-primary-foreground text-xs">3</Badge>
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
  )
}
