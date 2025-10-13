"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, Info } from "lucide-react"
import { collection, getDocs, query, where } from "firebase/firestore"
import { db } from "@/lib/firebase"

// URL для оборотной стороны карточек (глобальная переменная)
const CARD_BACK_IMAGE_URL = "/placeholder-card-back.jpg"

interface FeaturedCard {
  id: string;
  name: string;
  title: string;
  category: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  imageUrl: string;
  bannerImageUrl?: string;
  cardBackImageUrl?: string;
  carouselImageUrl?: string;
}

export function HeroBanner() {
  const [featuredCards, setFeaturedCards] = useState<FeaturedCard[]>([])
  const [activeCard, setActiveCard] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  const currentCard = featuredCards[activeCard]

  // Загрузка избранных карточек из Firebase
  useEffect(() => {
    const loadFeaturedCards = async () => {
      try {
        setIsLoading(true)
        const q = query(collection(db, "cards"), where("isFeatured", "==", true))
        const querySnapshot = await getDocs(q)

        const cards: FeaturedCard[] = []
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
            discount: data.discount,
            imageUrl: data.imageUrl || data.image,
            bannerImageUrl: data.bannerImageUrl,
            cardBackImageUrl: data.cardBackImageUrl,
            carouselImageUrl: data.carouselImageUrl
          })
        })

        setFeaturedCards(cards)
        if (cards.length > 0) {
          setActiveCard(0)
        }
      } catch (error) {
        console.error("Ошибка загрузки избранных карточек:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFeaturedCards()
  }, [])

  const nextCard = () => {
    setActiveCard((prev) => (prev + 1) % featuredCards.length)
  }

  const prevCard = () => {
    setActiveCard((prev) => (prev - 1 + featuredCards.length) % featuredCards.length)
  }

  // Показать сообщение если нет избранных карточек
  if (!isLoading && featuredCards.length === 0) {
    return (
      <div className="relative h-screen overflow-hidden -mt-20 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Нет избранных карточек</h2>
          <p className="text-gray-400">Добавьте карточки в избранное через админ-панель</p>
        </div>
      </div>
    )
  }

  // Показать загрузку
  if (isLoading || !currentCard) {
    return (
      <div className="relative h-screen overflow-hidden -mt-20 flex items-center justify-center bg-gradient-to-br from-gray-900 to-black">
        <div className="text-center">
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
      </div>
    )
  }

  return (
    <div className="relative h-screen overflow-hidden -mt-20">
      <div className="absolute inset-0 bg-black">
        <img
          key={activeCard}
          src={currentCard.bannerImageUrl || currentCard.imageUrl || "/placeholder.svg"}
          alt={currentCard.name}
          className="w-full h-full object-cover object-top animate-in fade-in duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/30 via-transparent to-red-900/30" />
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-[#06080A] to-transparent" />
      </div>

      {/* Card Selector - Desktop */}
      <div className="absolute inset-x-0 top-36 z-10 hidden md:block">
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
                    src={card.carouselImageUrl || card.imageUrl || "/placeholder.svg"}
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

      {/* Card Selector - Mobile (Top) */}
      <div className="absolute inset-x-0 top-28 z-10 md:hidden">
        <div className="px-4 py-4 carousel-container">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide carousel-item">
            {featuredCards.map((card, index) => (
              <button
                key={card.id}
                onClick={() => setActiveCard(index)}
                className={`relative flex-shrink-0 transition-all duration-300 ${
                  index === activeCard
                    ? "w-20 h-24 ring-2 ring-blue-500 shadow-lg scale-110 z-10"
                    : "w-16 h-20 opacity-60"
                } rounded-xl overflow-hidden`}
                style={{
                  boxShadow: index === activeCard
                    ? '0 0 0 2px transparent, 0 0 0 4px rgba(59, 130, 246, 0.5), 0 8px 25px -5px rgba(59, 130, 246, 0.3)'
                    : ''
                }}
                style={{
                  marginLeft: index > 0 && index === activeCard ? "4px" : "0px",
                  marginRight: index < featuredCards.length - 1 && index === activeCard ? "4px" : "0px",
                }}
              >
                <img
                  src={card.carouselImageUrl || card.imageUrl || "/placeholder.svg"}
                  alt={card.name}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Анимированные карточки в правом нижнем углу - только на десктопе */}
      <div className="absolute bottom-24 right-1/4 z-10 pointer-events-none hidden md:block">
        <div
          key={`animated-cards-${activeCard}`}
          className="relative w-96 h-[32rem] animate-in slide-in-from-bottom-8 fade-in duration-1000"
        >
          {/* Оборотная сторона карточки (задняя, под наклоном влево) */}
          <div
            className="absolute w-80 h-[28rem] rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000"
            style={{
              transform: 'rotate(-12deg) translate(-60px, 30px)',
              zIndex: 1
            }}
          >
            <img
              src={currentCard.cardBackImageUrl || CARD_BACK_IMAGE_URL}
              alt="Оборотная сторона карточки"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Лицевая сторона карточки (основная, ровная) */}
          <div
            className="absolute w-80 h-[28rem] rounded-3xl overflow-hidden shadow-2xl transition-all duration-1000"
            style={{
              transform: 'rotate(0deg) translate(0px, 0px)',
              zIndex: 2,
              boxShadow: '0 40px 100px -10px rgba(0, 0, 0, 0.9), 0 20px 60px -5px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <img
              src={currentCard.imageUrl || currentCard.bannerImageUrl || "/placeholder.svg"}
              alt={currentCard.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      {/* Анимированные карточки справа по центру - только на мобильных */}
      <div className="absolute top-2/5 -translate-y-2/5 right-8 z-10 pointer-events-none md:hidden">
        <div
          key={`animated-cards-mobile-${activeCard}`}
          className="relative w-38 h-52 animate-in slide-in-from-right-4 fade-in duration-1000"
        >
          {/* Оборотная сторона карточки (задняя, под наклоном влево) */}
          <div
            className="absolute w-34 h-48 rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000"
            style={{
              transform: 'rotate(-8deg) translate(-24px, 12px)',
              zIndex: 1
            }}
          >
            <img
              src={currentCard.cardBackImageUrl || CARD_BACK_IMAGE_URL}
              alt="Оборотная сторона карточки"
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.src = "/placeholder.svg";
              }}
            />
          </div>

          {/* Лицевая сторона карточки (основная, ровная) */}
          <div
            className="absolute w-34 h-48 rounded-2xl overflow-hidden shadow-2xl transition-all duration-1000"
            style={{
              transform: 'rotate(0deg) translate(0px, 0px)',
              zIndex: 2,
              boxShadow: '0 20px 50px -5px rgba(0, 0, 0, 0.9), 0 10px 30px -3px rgba(0, 0, 0, 0.7), 0 0 0 1px rgba(255, 255, 255, 0.1)'
            }}
          >
            <img
              src={currentCard.imageUrl || currentCard.bannerImageUrl || "/placeholder.svg"}
              alt={currentCard.name}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>

      <div className="absolute bottom-48 md:bottom-32 left-0 right-0 z-10 pointer-events-none">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-2xl pointer-events-auto">
            <div className="flex items-center gap-3 mb-4">
              {/* Новинка бейдж на мобильных */}
              <div className="md:hidden bg-white/20 backdrop-blur-sm rounded-full px-3 py-1">
                <span className="text-white text-sm font-medium">Новинка</span>
              </div>

              {/* Бейджи на десктопе */}
              <div className="hidden md:flex items-center gap-3">
                <Badge className="bg-gradient-to-r from-purple-600 to-purple-700 text-white border-0 px-4 py-2 text-sm font-medium rounded-full">
                  {currentCard.category}
                </Badge>
              </div>
            </div>

            <div key={`content-${activeCard}`} className="animate-in fade-in slide-in-from-left-4 duration-700">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 md:mb-4 leading-tight text-balance">{currentCard.name}</h1>

              <p className="text-gray-300 mb-4 md:mb-6 text-sm md:text-lg leading-relaxed max-w-lg text-pretty">
                {currentCard.description}
              </p>

              <div className="flex items-center gap-2 md:gap-4 mb-4 md:mb-6">
                <div className="flex items-center gap-2 md:gap-3">
                  <span className="text-xl md:text-3xl font-bold text-white">{currentCard.price.toLocaleString()} BYN</span>
                  {currentCard.originalPrice && (
                    <span className="text-sm md:text-lg text-gray-400 line-through">
                      {currentCard.originalPrice.toLocaleString()} BYN
                    </span>
                  )}
                  {currentCard.originalPrice && currentCard.originalPrice > currentCard.price && (
                    <Badge className="bg-gradient-to-r from-pink-500 to-purple-600 text-white border-0 px-2 md:px-3 py-1 text-xs md:text-sm font-bold rounded-full">
                      -{Math.round(((currentCard.originalPrice - currentCard.price) / currentCard.originalPrice) * 100)}%
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-3 md:gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 px-6 md:px-8 py-2 md:py-3 text-base md:text-lg font-semibold rounded-full shadow-lg hover:shadow-xl transition-all duration-300 flex-1 md:flex-none"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-4 h-4 md:w-5 md:h-5 mr-2" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                  </svg>
                  Купить
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-white/30 bg-white/10 backdrop-blur-lg text-white hover:bg-white/20 px-4 md:px-6 py-2 md:py-3 text-base md:text-lg rounded-full"
                >
                  Подробнее
                </Button>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
