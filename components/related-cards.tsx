"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Star, Heart, ShoppingCart } from "lucide-react"
import { collection, getDocs, query, where, limit, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import Link from "next/link"

interface RelatedCard {
  id: string;
  title: string;
  name?: string;
  imageUrl?: string;
  image?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  category: string;
  rarity?: string;
  inStock: boolean;
}

interface RelatedCardsProps {
  currentCardId: string;
  category: string;
}

function RelatedCardsSkeleton() {
  return (
    <section className="space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="bg-transparent border-border aspect-square">
            <Skeleton className="w-full h-full rounded-3xl" />
          </Card>
        ))}
      </div>
    </section>
  )
}

export function RelatedCards({ currentCardId, category }: RelatedCardsProps) {
  const [relatedCards, setRelatedCards] = useState<RelatedCard[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadRelatedCards = async () => {
      try {
        setIsLoading(true)

        // Сначала попробуем найти карточки той же категории
        let q = query(
          collection(db, "cards"),
          where("category", "==", category),
          where("inStock", "==", true),
          limit(8)
        )

        let querySnapshot = await getDocs(q)
        let cards: RelatedCard[] = []

        querySnapshot.forEach((doc) => {
          const data = doc.data()
          if (doc.id !== currentCardId) {
            cards.push({
              id: doc.id,
              title: data.title || data.name || "",
              name: data.name || data.title || "",
              imageUrl: data.imageUrl,
              image: data.image,
              price: data.price || 0,
              originalPrice: data.originalPrice,
              discount: data.discount,
              rating: data.rating,
              category: data.category || "",
              rarity: data.rarity,
              inStock: data.inStock || false
            })
          }
        })

        // Если недостаточно карточек из той же категории, добавим любые в наличии
        if (cards.length < 4) {
          const additionalQuery = query(
            collection(db, "cards"),
            where("inStock", "==", true),
            limit(8)
          )

          const additionalSnapshot = await getDocs(additionalQuery)
          additionalSnapshot.forEach((doc) => {
            const data = doc.data()
            if (doc.id !== currentCardId && !cards.find(card => card.id === doc.id)) {
              cards.push({
                id: doc.id,
                title: data.title || data.name || "",
                name: data.name || data.title || "",
                imageUrl: data.imageUrl,
                image: data.image,
                price: data.price || 0,
                originalPrice: data.originalPrice,
                discount: data.discount,
                rating: data.rating,
                category: data.category || "",
                rarity: data.rarity,
                inStock: data.inStock || false
              })
            }
          })
        }

        // Ограничиваем до 4 карточек
        setRelatedCards(cards.slice(0, 4))
      } catch (error) {
        console.error("Ошибка загрузки похожих карточек:", error)
      } finally {
        setIsLoading(false)
      }
    }

    loadRelatedCards()
  }, [currentCardId, category])

  if (isLoading) {
    return <RelatedCardsSkeleton />
  }

  if (relatedCards.length === 0) {
    return null
  }

  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground flex items-center gap-3">
        <div className="w-1 h-6 bg-primary rounded-full" />
        Похожие карточки
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedCards.map((card) => (
          <Link key={card.id} href={`/card/${card.id}`}>
            <Card className="group cursor-pointer bg-transparent border-2 border-transparent hover:border-primary/70 transition-all duration-300 overflow-hidden rounded-3xl aspect-square hover:shadow-xl hover:shadow-primary/20">
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <img
                  src={card.imageUrl || card.image || "/placeholder.svg"}
                  alt={card.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full shadow-lg">
                    {card.category}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4 right-4">
                  <div className="space-y-2">
                    <h3 className="text-white font-semibold text-sm line-clamp-2 leading-tight">{card.title}</h3>
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2">
                          <span className="text-lg font-bold text-white">{card.price.toLocaleString()} BYN</span>
                          {card.originalPrice && card.originalPrice > card.price && (
                            <span className="text-sm text-gray-400 line-through">{card.originalPrice.toLocaleString()} BYN</span>
                          )}
                        </div>
                        {card.originalPrice && card.originalPrice > card.price && (
                          <Badge variant="destructive" className="bg-red-600 text-white text-xs">
                            -{Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100)}%
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-4 py-2 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-black font-medium text-sm">Посмотреть</span>
                  </div>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  )
}
