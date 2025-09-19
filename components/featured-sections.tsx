"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Clock, Zap, ShoppingCart, Flame, Heart } from "lucide-react"
import { Card as CardType } from "@/lib/types"
import { CardService } from "@/lib/firestore"

export function FeaturedSections() {
  const [newReleases, setNewReleases] = useState<CardType[]>([])
  const [bestSellers, setBestSellers] = useState<CardType[]>([])
  const [newInCatalog, setNewInCatalog] = useState<CardType[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadFeaturedData()
  }, [])

  const loadFeaturedData = async () => {
    try {
      setLoading(true)

      // Загружаем карточки по разделам
      const [newReleasesData, bestSellersData, newInCatalogData] = await Promise.all([
        CardService.getBySection('new-releases'),
        CardService.getBySection('best-sellers'),
        CardService.getBySection('new-in-catalog')
      ])

      setNewReleases(newReleasesData)
      setBestSellers(bestSellersData)
      setNewInCatalog(newInCatalogData)

    } catch (error) {
      console.error('Ошибка загрузки данных разделов:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-16">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
          <p className="text-gray-400 mt-2">Загрузка...</p>
        </div>
      </div>
    )
  }
  return (
    <div className="space-y-16">
      {/* Weekly Deals Section */}
      {newReleases.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Flame className="w-8 h-8 text-red-500" />
              <h2 className="text-4xl font-bold text-white">Предложения недели</h2>
            </div>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 text-lg font-semibold"
            >
              Смотреть все
            </Button>
          </div>

          <div className="relative">
            <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
              {newReleases.map((card) => (
              <Card
                key={card.id}
                className="group cursor-pointer flex-shrink-0 w-80 h-80 bg-transparent border-2 border-transparent hover:border-red-500/70 transition-all duration-300 overflow-hidden rounded-3xl"
              >
                <div className="relative w-full h-full overflow-hidden rounded-3xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Discount badge */}
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                      Акция
                    </Badge>
                  </div>

                  {/* Price at bottom */}
                  <div className="absolute bottom-4 left-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                          {card.price.toLocaleString()} ₽
                        </span>
                        <span className="text-sm text-red-400 line-through">
                          {card.originalPrice?.toLocaleString()} ₽
                        </span>
                      </div>
                      <Badge className="bg-red-600 text-white text-xs font-bold">
                        -{card.discount}%
                      </Badge>
                    </div>
                  </div>

                  {/* Hover icons with glass blur effect */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button size="icon" className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 text-white rounded-full shadow-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-fill w-7 h-7" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                      </svg>
                    </Button>
                    <Button size="icon" className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 text-white rounded-full shadow-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-heart-fill w-7 h-7" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Best Sellers Section */}
      {bestSellers.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-orange-500" />
              <h2 className="text-4xl font-bold text-white">Лидеры продаж</h2>
            </div>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 text-lg font-semibold"
            >
              Смотреть все
            </Button>
          </div>

        {/* Category filters */}
        <div className="flex flex-wrap gap-3 mb-8">
          {["Все", "Покемон", "MTG", "Yu-Gi-Oh!", "Аниме", "Disney", "Marvel"].map((category) => (
            <Button
              key={category}
              variant={category === "Все" ? "default" : "ghost"}
              className={`rounded-full px-6 py-2 transition-all duration-300 ${
                category === "Все"
                  ? "bg-white text-black hover:bg-gray-200"
                  : "bg-gray-800 text-white hover:bg-gray-700 border-gray-600"
              }`}
            >
              {category}
            </Button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {bestSellers.map((card) => (
            <Card
              key={card.id}
              className="group cursor-pointer bg-transparent border-2 border-transparent hover:border-orange-500/70 transition-all duration-300 overflow-hidden rounded-3xl aspect-square h-64"
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute top-3 left-3">
                  <Badge className="bg-orange-500 text-white font-bold text-xs px-2 py-1 rounded-full">
                    {card.isHot ? "Хит продаж" : "Популярно"}
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-bold text-white">
                        {card.price.toLocaleString()} ₽
                      </span>
                      {card.originalPrice && card.originalPrice > card.price && (
                        <span className="text-xs text-orange-400 line-through">
                          {card.originalPrice.toLocaleString()} ₽
                        </span>
                      )}
                    </div>
                    {card.discount && (
                      <Badge className="bg-orange-600 text-white text-xs font-bold px-2 py-1">
                        -{card.discount}%
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Hover icons with glass blur effect */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-3 opacity-0 group-hover:opacity-100 transition-all duration-300">
                  <Button size="icon" className="w-10 h-10 bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 text-white rounded-full shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-cart-fill w-6 h-6" viewBox="0 0 16 16">
                      <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                    </svg>
                  </Button>
                  <Button size="icon" className="w-10 h-10 bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 text-white rounded-full shadow-2xl">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" className="bi bi-heart-fill w-6 h-6" viewBox="0 0 16 16">
                      <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                    </svg>
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
        </section>
      )}

      {/* New in Catalog Section */}
      {newInCatalog.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-blue-500" />
              <h2 className="text-4xl font-bold text-white">Новое в каталоге</h2>
            </div>
            <Button
              variant="ghost"
              className="text-red-400 hover:text-red-300 text-lg font-semibold"
            >
              Смотреть все
            </Button>
          </div>

        <div className="relative">
          <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-hide">
            {newInCatalog.map((card) => (
              <Card
                key={card.id}
                className="group cursor-pointer flex-shrink-0 w-80 h-80 bg-transparent border-2 border-transparent hover:border-blue-500/70 transition-all duration-300 overflow-hidden rounded-3xl"
              >
                <div className="relative w-full h-full overflow-hidden rounded-3xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-105"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                      Новинка
                    </Badge>
                  </div>

                  <div className="absolute bottom-4 left-4">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-2xl font-bold text-white">
                          {card.price.toLocaleString()} ₽
                        </span>
                        <span className="text-sm text-blue-400 line-through">
                          {card.originalPrice?.toLocaleString()} ₽
                        </span>
                      </div>
                      <Badge className="bg-blue-600 text-white text-xs font-bold">
                        -{card.discount}%
                      </Badge>
                    </div>
                  </div>

                  {/* Hover icons with glass blur effect */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4 opacity-0 group-hover:opacity-100 transition-all duration-300">
                    <Button size="icon" className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 text-white rounded-full shadow-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-cart-fill w-7 h-7" viewBox="0 0 16 16">
                        <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                      </svg>
                    </Button>
                    <Button size="icon" className="w-12 h-12 bg-white/10 backdrop-blur-2xl border border-white/20 hover:bg-white/20 text-white rounded-full shadow-2xl">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" className="bi bi-heart-fill w-7 h-7" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                      </svg>
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
        </section>
      )}
    </div>
  )
}
