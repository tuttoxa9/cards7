"use client"

import { useState, useEffect } from "react"
import { Search, X } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { collection, getDocs, query, where, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

interface Card {
  id: string;
  name: string;
  title: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  imageUrl: string;
  rarity: "common" | "rare" | "epic" | "legendary";
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<Card[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [allCards, setAllCards] = useState<Card[]>([])

  // Загрузка всех карточек при открытии модального окна
  useEffect(() => {
    if (isOpen && allCards.length === 0) {
      loadAllCards()
    }
  }, [isOpen])

  // Поиск при изменении запроса
  useEffect(() => {
    if (searchQuery.trim()) {
      performSearch(searchQuery)
    } else {
      setSearchResults([])
    }
  }, [searchQuery, allCards])

  const loadAllCards = async () => {
    try {
      setIsLoading(true)
      const q = query(collection(db, "cards"), orderBy("name"))
      const querySnapshot = await getDocs(q)

      const cards: Card[] = []
      querySnapshot.forEach((doc) => {
        const data = doc.data()
        cards.push({
          id: doc.id,
          name: data.name || data.title,
          title: data.title || data.name,
          category: data.category,
          description: data.description,
          price: data.price,
          originalPrice: data.originalPrice,
          imageUrl: data.imageUrl,
          rarity: data.rarity
        })
      })

      setAllCards(cards)
    } catch (error) {
      console.error("Ошибка загрузки карточек:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const performSearch = (query: string) => {
    const lowercaseQuery = query.toLowerCase()
    const filtered = allCards.filter(card =>
      card.name.toLowerCase().includes(lowercaseQuery) ||
      card.title.toLowerCase().includes(lowercaseQuery) ||
      card.category.toLowerCase().includes(lowercaseQuery) ||
      card.description.toLowerCase().includes(lowercaseQuery)
    )
    setSearchResults(filtered.slice(0, 20)) // Ограничиваем результаты
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common": return "bg-gray-500"
      case "rare": return "bg-blue-500"
      case "epic": return "bg-purple-500"
      case "legendary": return "bg-orange-500"
      default: return "bg-gray-500"
    }
  }

  const getRarityText = (rarity: string) => {
    switch (rarity) {
      case "common": return "Обычная"
      case "rare": return "Редкая"
      case "epic": return "Эпическая"
      case "legendary": return "Легендарная"
      default: return "Обычная"
    }
  }

  const handleClose = () => {
    setSearchQuery("")
    setSearchResults([])
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#18181B] border-zinc-700 text-white p-0 overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-3 p-6 border-b border-zinc-700">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-zinc-400 w-5 h-5" />
            <Input
              placeholder="Поиск карточек..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-4 h-12 border-zinc-600 bg-[#27272A] text-white placeholder:text-zinc-400 focus:border-purple-500"
              autoFocus
            />
          </div>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-zinc-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[70vh]">
          {isLoading ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-4"></div>
              <p className="text-zinc-400">Загрузка...</p>
            </div>
          ) : searchQuery.trim() === "" ? (
            <div className="text-center py-8">
              <Search className="w-12 h-12 text-zinc-600 mx-auto mb-4" />
              <p className="text-zinc-400">Введите запрос для поиска карточек</p>
            </div>
          ) : searchResults.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-zinc-400">По вашему запросу ничего не найдено</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {searchResults.map((card) => (
                <Link
                  key={card.id}
                  href={`/card/${card.id}`}
                  onClick={handleClose}
                  className="group block bg-[#27272A] rounded-lg overflow-hidden hover:bg-[#2F2F33] transition-colors"
                >
                  <div className="relative h-48">
                    <img
                      src={card.imageUrl || "/placeholder.svg"}
                      alt={card.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className={`${getRarityColor(card.rarity)} text-white border-0 text-xs`}>
                        {getRarityText(card.rarity)}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-white mb-1 line-clamp-1">{card.name}</h3>
                    <p className="text-sm text-zinc-400 mb-2 line-clamp-1">{card.category}</p>
                    <p className="text-xs text-zinc-500 mb-3 line-clamp-2">{card.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-lg font-bold text-white">{card.price.toLocaleString()} BYN</span>
                        {card.originalPrice && card.originalPrice > card.price && (
                          <span className="text-sm text-zinc-400 line-through">
                            {card.originalPrice.toLocaleString()} BYN
                          </span>
                        )}
                      </div>
                      {card.originalPrice && card.originalPrice > card.price && (
                        <Badge className="bg-red-500 text-white border-0 text-xs">
                          -{Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%
                        </Badge>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
