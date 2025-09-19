"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { Card as CardType, Banner } from "@/lib/types"
import { CardService, BannerService } from "@/lib/firestore"

export function HeroBanner() {
  const [activeCard, setActiveCard] = useState(0)
  const [featuredCards, setFeaturedCards] = useState<CardType[]>([])
  const [heroBanners, setHeroBanners] = useState<Banner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadHeroData()
  }, [])

  const loadHeroData = async () => {
    try {
      setLoading(true)

      // Загружаем hero баннеры
      const banners = await BannerService.getActive()
      const herobanners = banners.filter(banner => banner.position === 'hero')
      setHeroBanners(herobanners)

      // Загружаем карточки для hero (пока берем из best-sellers)
      const cards = await CardService.getBySection('best-sellers')
      setFeaturedCards(cards.slice(0, 4)) // Берем первые 4 карточки

    } catch (error) {
      console.error('Ошибка загрузки данных hero баннера:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    )
  }

  if (featuredCards.length === 0) {
    return (
      <div className="h-screen flex items-center justify-center bg-black">
        <p className="text-white">Нет карточек для отображения</p>
      </div>
    )
  }

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
          alt={currentCard.title}
          className="w-full h-full object-cover animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-transparent to-red-900/20" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06080A]/60 to-transparent" />
      </div>

      <div className="absolute inset-x-0 top-32 z-10">
        <div className="container mx-auto px-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center justify-start gap-2 h-32 overflow-visible">
              {featuredCards.map((card, index) => (
                <button
                  key={card.id}
                  onClick={() => setActiveCard(index)}
                  className={`relative flex-shrink-0 w-28 h-28 rounded-2xl overflow-hidden transition-all duration-700 ease-out ${
                    index === activeCard
                      ? "ring-2 ring-purple-400 shadow-2xl shadow-purple-500/40 z-10"
                      : ""
                  }`}
                  style={{
                    transform: index === activeCard ? "scale(1.5)" : "scale(1)",
                    marginLeft: index > 0 && (index === activeCard || index - 1 === activeCard) ? "8px" : "0px",
                    marginRight:
                      index < featuredCards.length - 1 && (index === activeCard || index + 1 === activeCard)
                        ? "8px"
                        : "0px",
                  }}
                >
                  <img
                    src={card.image || "/placeholder.svg"}
                    alt={card.title}
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

      <div className="absolute bottom-10 left-0 right-0 z-10 pointer-events-none">
        <div className="container mx-auto px-8">
          <div className="max-w-2xl pointer-events-auto">
            <div className="flex items-center gap-3 mb-4">
              <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 px-4 py-2 text-sm font-medium rounded-full">
                {currentCard.category}
              </Badge>
              {currentCard.isHot && (
                <Badge className="bg-gradient-to-r from-orange-500 to-red-600 text-white border-0 px-3 py-1 text-xs font-bold rounded-full">
                  Хит продаж
                </Badge>
              )}
            </div>

            <div key={`content-${activeCard}`} className="animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="text-4xl font-bold text-white mb-4 leading-tight text-balance">{currentCard.title}</h1>

              <p className="text-gray-300 mb-6 text-lg leading-relaxed max-w-lg text-pretty">
                {currentCard.description || "Описание карточки"}
              </p>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-white">{currentCard.price.toLocaleString()} ₽</span>
                  {currentCard.originalPrice && currentCard.originalPrice > currentCard.price && (
                    <>
                      <span className="text-lg text-gray-400 line-through">
                        {currentCard.originalPrice.toLocaleString()} ₽
                      </span>
                      <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-3 py-1 text-sm font-bold rounded-full">
                        -{currentCard.discount}%
                      </Badge>
                    </>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-8 py-3 text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-5 h-5 mr-2" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                  </svg>
                  Купить
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-gray-600 bg-gray-800/50 backdrop-blur-sm text-white hover:bg-gray-700/50 px-6 py-3 text-lg rounded-full"
                >
                  <Info className="w-5 h-5 mr-2" />
                  Подробнее
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-300 hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full w-12 h-12"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill w-6 h-6" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                  </svg>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
