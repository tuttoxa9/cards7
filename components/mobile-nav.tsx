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
                <Heart className="w-4 h-4 mr-3" />
                Избранное
              </Button>

              <Link href="/cart" onClick={() => setIsOpen(false)}>
                <Button variant="ghost" className="w-full justify-start text-foreground hover:text-primary">
                  <ShoppingCart className="w-4 h-4 mr-3" />
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
