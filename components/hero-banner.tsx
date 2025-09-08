"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight } from "lucide-react"

const featuredCards = [
  {
    id: 1,
    name: "Dark Phoenix",
    collection: "Marvel Heroes",
    description: "Легендарная карточка с силой Темного Феникса. Редкость: Мифическая.",
    price: 2499,
    originalPrice: 3499,
    discount: 29,
    image: "/dark-phoenix-marvel-card-background.jpg",
    thumbnail: "/dark-phoenix-card.jpg",
  },
  {
    id: 2,
    name: "Lamborghini Aventador",
    collection: "Speed Legends",
    description: "Эксклюзивная карточка суперкара с голографическим эффектом.",
    price: 1899,
    originalPrice: 2299,
    discount: 17,
    image: "/lamborghini-aventador-card-background.jpg",
    thumbnail: "/lamborghini-card.jpg",
  },
  {
    id: 3,
    name: "Goku Ultra Instinct",
    collection: "Anime Masters",
    description: "Ультра редкая карточка с анимированным эффектом трансформации.",
    price: 3299,
    originalPrice: 4199,
    discount: 21,
    image: "/goku-ultra-instinct-card-background.jpg",
    thumbnail: "/goku-card.jpg",
  },
]

export function HeroBanner() {
  const [activeCard, setActiveCard] = useState(0)
  const currentCard = featuredCards[activeCard]

  const nextCard = () => {
    setActiveCard((prev) => (prev + 1) % featuredCards.length)
  }

  const prevCard = () => {
    setActiveCard((prev) => (prev - 1 + featuredCards.length) % featuredCards.length)
  }

  return (
    <div className="relative h-screen overflow-hidden -mt-20">
      <div className="absolute inset-0 bg-black">
        <img
          key={activeCard}
          src={currentCard.image || "/placeholder.svg"}
          alt={currentCard.name}
          className="w-full h-full object-cover animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-red-900/30" />
      </div>

      <div className="relative z-10 pt-20">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center justify-start gap-2 h-32 overflow-visible">
              {featuredCards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => setActiveCard(index)}
                  className={`relative flex-shrink-0 rounded-2xl overflow-hidden transition-all duration-700 ease-out ${
                    index === activeCard
                      ? "w-24 h-24 ring-4 ring-purple-400 shadow-2xl shadow-purple-500/40 z-10"
                      : "w-16 h-16"
                  }`}
                  style={{
                    transform: index === activeCard ? "scale(1.4)" : "scale(1)",
                    marginLeft: index > 0 && (index === activeCard || index - 1 === activeCard) ? "8px" : "0px",
                    marginRight:
                      index < featuredCards.length - 1 && (index === activeCard || index + 1 === activeCard)
                        ? "8px"
                        : "0px",
                  }}
                >
                  <img
                    src={card.thumbnail || "/placeholder.svg"}
                    alt={card.name}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevCard}
                className="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-12 h-12 backdrop-blur-sm border border-white/20"
              >
                <ChevronLeft className="w-6 h-6" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextCard}
                className="text-white/60 hover:text-white hover:bg-white/20 rounded-full w-12 h-12 backdrop-blur-sm border border-white/20"
              >
                <ChevronRight className="w-6 h-6" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-10 h-full flex items-center">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl">
            <div className="flex items-center gap-3 mb-6">
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 px-4 py-2 text-sm font-medium rounded-full">
                {currentCard.collection}
              </Badge>
              <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 px-3 py-1 text-xs font-bold rounded-full">
                Новинка
              </Badge>
            </div>

            <div key={`content-${activeCard}`} className="animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="text-7xl font-bold text-white mb-6 leading-tight text-balance">{currentCard.name}</h1>

              <p className="text-gray-300 mb-8 text-xl leading-relaxed max-w-lg text-pretty">
                {currentCard.description}
              </p>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center gap-3">
                  <span className="text-4xl font-bold text-white">{currentCard.price.toLocaleString()} ₽</span>
                  <span className="text-xl text-gray-400 line-through">
                    {currentCard.originalPrice.toLocaleString()} ₽
                  </span>
                  <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 py-1 text-sm font-bold rounded-full">
                    -{currentCard.discount}%
                  </Badge>
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white border-0 px-8 py-3 text-lg font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Купить
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 px-6 py-3 text-lg rounded-xl"
                >
                  Подробнее
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white hover:bg-white/10 rounded-xl w-12 h-12"
                >
                  <Heart className="w-6 h-6" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
