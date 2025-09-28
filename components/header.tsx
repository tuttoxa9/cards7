"use client"

import React, { useState, useEffect, useRef } from "react"
import { Search, ShoppingCart, Heart, Grid3X3, Folder, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { MobileNav } from "@/components/mobile-nav"
import { CartOverlay } from "@/components/cart-overlay"
import { useCart } from "@/lib/cart-context"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"
import { cn } from "@/lib/utils"

interface Card {
  id: string;
  title: string;
  name: string;
  category: string;
  price: number;
  originalPrice?: number;
  imageUrl?: string;
  image?: string;
}

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Card[]>([])
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [allCards, setAllCards] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const { totalItems } = useCart()

  // Загрузка всех карточек при первом открытии поиска
  const loadAllCards = async () => {
    if (allCards.length > 0) return;

    try {
      setIsLoading(true);
      const q = query(collection(db, "cards"), orderBy("title"));
      const querySnapshot = await getDocs(q);

      const cards: Card[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        cards.push({
          id: doc.id,
          title: data.title || data.name || "",
          name: data.name || data.title || "",
          category: data.category || "",
          price: data.price || 0,
          originalPrice: data.originalPrice,
          imageUrl: data.imageUrl,
          image: data.image
        });
      });

      setAllCards(cards);
    } catch (error) {
      console.error("Ошибка загрузки карточек:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Поиск карточек
  const performSearch = (query: string) => {
    if (!query.trim()) {
      setSearchResults([]);
      return;
    }

    const lowercaseQuery = query.toLowerCase();
    const filtered = allCards.filter(card =>
      card.title.toLowerCase().includes(lowercaseQuery) ||
      card.name.toLowerCase().includes(lowercaseQuery) ||
      card.category.toLowerCase().includes(lowercaseQuery)
    );
    setSearchResults(filtered.slice(0, 5)); // Ограничиваем результаты
  };

  // Обработка изменения поискового запроса
  useEffect(() => {
    performSearch(searchQuery);
  }, [searchQuery, allCards]);

  // Обработка скролла
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  // Закрытие поиска при клике вне
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
        setSearchQuery("");
        setSearchResults([]);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchFocus = () => {
    setIsSearchOpen(true);
    loadAllCards();
  };

  const handleClearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setIsSearchOpen(false);
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-[1200] transition-colors duration-300",
        isScrolled ? "bg-gradient-to-b from-black/95 to-transparent" : "bg-transparent"
      )}
    >
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-transparent pointer-events-none -z-10",
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
              <Link href="/reviews">
                <Button
                  variant="ghost"
                  className="text-white hover:text-white text-lg flex items-center space-x-2 px-4 py-2 rounded-3xl bg-black/20 hover:bg-white/10 transition-colors backdrop-blur-sm"
                >
                  <Heart className="w-5 h-5" />
                  <span>Отзывы</span>
                </Button>
              </Link>
            </nav>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden text-white hover:text-white w-12 h-12 rounded-3xl bg-white/10 hover:bg-white/20 backdrop-blur-sm"
              onClick={handleSearchFocus}
            >
              <Search className="w-5 h-5" />
            </Button>

            {/* Desktop Search */}
            <div className="relative hidden md:block" ref={searchRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5 pointer-events-none" />
                <Input
                  placeholder="Поиск карточек..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={handleSearchFocus}
                  className="pl-12 pr-12 h-12 w-80 border-white/20 rounded-3xl text-white placeholder:text-white/60 text-lg focus:border-white/40 bg-white/10 backdrop-blur-sm"
                />
                {searchQuery && (
                  <button
                    onClick={handleClearSearch}
                    className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/60 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl overflow-hidden z-50 max-h-96 overflow-y-auto">
                  {isLoading ? (
                    <div className="p-4 text-center">
                      <div className="spinner center">
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                        <div className="spinner-blade"></div>
                      </div>
                    </div>
                  ) : searchQuery.trim() === "" ? (
                    <div className="p-4 text-center">
                      <Search className="w-8 h-8 text-white/40 mx-auto mb-2" />
                      <p className="text-white/60 text-sm">Введите запрос для поиска</p>
                    </div>
                  ) : searchResults.length === 0 ? (
                    <div className="p-4 text-center">
                      <p className="text-white/60 text-sm">Ничего не найдено</p>
                    </div>
                  ) : (
                    <div className="py-2">
                      {searchResults.map((card) => (
                        <Link
                          key={card.id}
                          href={`/card/${card.id}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className="flex items-center gap-3 px-4 py-3 hover:bg-white/10 transition-colors"
                        >
                          <img
                            src={card.imageUrl || card.image || "/placeholder.svg"}
                            alt={card.title}
                            className="w-12 h-16 object-cover rounded-lg"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="text-white font-medium text-sm truncate">{card.title}</h4>
                            <p className="text-white/60 text-xs truncate">{card.category}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="text-white font-bold text-sm">{card.price.toLocaleString()} BYN</span>
                              {card.originalPrice && card.originalPrice > card.price && (
                                <span className="text-white/50 text-xs line-through">
                                  {card.originalPrice.toLocaleString()} BYN
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      ))}
                      {searchResults.length >= 5 && (
                        <Link
                          href={`/catalog?search=${encodeURIComponent(searchQuery)}`}
                          onClick={() => {
                            setIsSearchOpen(false);
                            setSearchQuery("");
                            setSearchResults([]);
                          }}
                          className="block px-4 py-3 text-center text-red-400 hover:text-red-300 text-sm font-medium border-t border-white/10"
                        >
                          Показать все результаты
                        </Link>
                      )}
                    </div>
                  )}
                </div>
              )}
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

      {/* Mobile Search Overlay */}
      {isSearchOpen && (
        <div className="md:hidden fixed inset-0 bg-black/90 backdrop-blur-xl z-[1300]">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/60 w-5 h-5" />
                <Input
                  placeholder="Поиск карточек..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-4 h-12 border-white/20 rounded-2xl text-white placeholder:text-white/60 bg-white/10 backdrop-blur-sm"
                  autoFocus
                />
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClearSearch}
                className="text-white hover:text-white w-12 h-12 rounded-2xl bg-white/10 hover:bg-white/20"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <div className="max-h-[60vh] overflow-y-auto">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="spinner center">
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                    <div className="spinner-blade"></div>
                  </div>
                </div>
              ) : searchQuery.trim() === "" ? (
                <div className="text-center py-8">
                  <Search className="w-12 h-12 text-white/40 mx-auto mb-4" />
                  <p className="text-white/60">Введите запрос для поиска</p>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-white/60">Ничего не найдено</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {searchResults.map((card) => (
                    <Link
                      key={card.id}
                      href={`/card/${card.id}`}
                      onClick={handleClearSearch}
                      className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                    >
                      <img
                        src={card.imageUrl || card.image || "/placeholder.svg"}
                        alt={card.title}
                        className="w-16 h-20 object-cover rounded-xl"
                      />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-white font-medium mb-1 line-clamp-1">{card.title}</h4>
                        <p className="text-white/60 text-sm mb-2">{card.category}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-white font-bold">{card.price.toLocaleString()} BYN</span>
                          {card.originalPrice && card.originalPrice > card.price && (
                            <span className="text-white/50 text-sm line-through">
                              {card.originalPrice.toLocaleString()} BYN
                            </span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                  {searchResults.length >= 5 && (
                    <Link
                      href={`/catalog?search=${encodeURIComponent(searchQuery)}`}
                      onClick={handleClearSearch}
                      className="block w-full p-4 text-center text-red-400 hover:text-red-300 font-medium bg-white/5 rounded-2xl hover:bg-white/10 transition-colors"
                    >
                      Показать все результаты
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <CartOverlay isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
      <MobileNav />
    </header>
  )
}
