"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { CardGallery } from "@/components/card-gallery"
import { CardDetails } from "@/components/card-details"
import { RelatedCards } from "@/components/related-cards"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"
import GradualBlur from "@/components/GradualBlur"
import { doc, getDoc, collection, getDocs, query, where, limit } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

interface CardData {
  id: string;
  title: string;
  name?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  category: string;
  rarity?: string;
  year?: string;
  description: string;
  features?: string[];
  inStock: boolean;
  stockCount?: number;
  imageUrl?: string;
  image?: string;
  images?: string[];
  galleryImages?: string[];
  bannerImageUrl?: string;
  carouselImageUrl?: string;
}

interface PageProps {
  params: {
    id: string
  }
}

function CardPageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <Header />

      <GradualBlur
        preset="page-header"
        strength={2}
        divCount={5}
        height="8rem"
        animated={false}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />

      <div className="relative overflow-hidden">
        <main className="relative max-w-6xl mx-auto px-4 py-8">
          {/* Breadcrumb Skeleton */}
          <div className="flex items-center space-x-2 mb-8">
            <Skeleton className="h-9 w-40 bg-zinc-800/50" />
          </div>

          {/* Main Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
            {/* Image Gallery Skeleton */}
            <div className="relative lg:col-span-5 w-full max-w-md mx-auto">
              <div className="aspect-[3/4] relative rounded-xl overflow-hidden bg-zinc-900/50 border border-zinc-800/50">
                <Skeleton className="w-full h-full bg-zinc-800/50" />
              </div>
              <div className="flex space-x-4 mt-6">
                {[...Array(3)].map((_, i) => (
                  <Skeleton key={i} className="w-24 h-32 rounded-xl bg-zinc-800/50" />
                ))}
              </div>
            </div>

            {/* Card Details Skeleton */}
            <div className="relative lg:col-span-7 space-y-8">
              <div className="space-y-4">
                <div className="flex gap-3">
                  <Skeleton className="h-7 w-24 bg-zinc-800/50" />
                  <Skeleton className="h-7 w-28 bg-zinc-800/50" />
                </div>
                <Skeleton className="h-12 w-3/4 bg-zinc-800/50" />
                <div className="flex gap-4">
                  <Skeleton className="h-6 w-32 bg-zinc-800/50" />
                  <Skeleton className="h-6 w-24 bg-zinc-800/50" />
                </div>
              </div>

              <Skeleton className="h-px w-full bg-zinc-800" />

              <div className="space-y-6">
                <Skeleton className="h-10 w-48 bg-zinc-800/50" />
                <div className="flex gap-4">
                  <Skeleton className="h-14 w-36 rounded-xl bg-zinc-800/50" />
                  <Skeleton className="h-14 flex-1 rounded-xl bg-zinc-800/50" />
                  <Skeleton className="h-14 w-14 rounded-xl bg-zinc-800/50" />
                  <Skeleton className="h-14 w-14 rounded-xl bg-zinc-800/50" />
                </div>
              </div>

              <Skeleton className="h-px w-full bg-zinc-800" />

              <div className="space-y-4">
                <Skeleton className="h-7 w-32 bg-zinc-800/50" />
                <Skeleton className="h-24 w-full bg-zinc-800/50" />
              </div>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  )
}

export default function CardPage({ params }: PageProps) {
  const [card, setCard] = useState<CardData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    const loadCard = async () => {
      try {
        setIsLoading(true)
        const cardDoc = await getDoc(doc(db, "cards", params.id))

        if (cardDoc.exists()) {
          const cardData = cardDoc.data() as CardData
          setCard({
            id: cardDoc.id,
            ...cardData,
            title: cardData.title || cardData.name || "",
            name: cardData.name || cardData.title || "",
            images: cardData.galleryImages || cardData.images || [cardData.imageUrl || cardData.image || "/placeholder.svg"],
            features: cardData.features || [],
            stockCount: cardData.stockCount || 0,
            rating: cardData.rating || 4.5,
            reviews: cardData.reviews || 0,
            year: cardData.year || "2024"
          })
        } else {
          setNotFound(true)
        }
      } catch (error) {
        console.error("Ошибка загрузки карточки:", error)
        setNotFound(true)
      } finally {
        setIsLoading(false)
      }
    }

    loadCard()
  }, [params.id])

  if (isLoading) {
    return <CardPageSkeleton />
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <GradualBlur
          preset="page-header"
          strength={2}
          divCount={5}
          height="8rem"
          animated={false}
          curve="bezier"
          exponential={true}
          opacity={1}
          zIndex={40}
        />

        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center space-x-2 mb-8">
            <Link href="/catalog">
              <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
                <ChevronLeft className="w-4 h-4 mr-1" />
                Назад к каталогу
              </Button>
            </Link>
          </div>

          <div className="text-center py-20">
            <h1 className="text-4xl font-bold text-foreground mb-4">Карточка не найдена</h1>
            <p className="text-muted-foreground mb-8">К сожалению, запрашиваемая карточка не существует или была удалена.</p>
            <Link href="/catalog">
              <Button>Вернуться к каталогу</Button>
            </Link>
          </div>
        </main>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-950 via-zinc-900 to-zinc-950">
      <Header />

      <GradualBlur
        preset="page-header"
        strength={2}
        divCount={5}
        height="8rem"
        animated={false}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />

      {/* Hero Section */}
      <div className="relative overflow-hidden">
        {/* Static subtle background elements */}
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full blur-3xl" />
          <div className="absolute top-3/4 left-1/3 w-48 h-48 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full blur-3xl" />
        </div>

        <main className="relative max-w-6xl mx-auto px-4 py-8">
          {/* Enhanced Breadcrumb */}
          <div className="flex items-center space-x-2 mb-8">
            <Link href="/catalog">
              <Button
                variant="ghost"
                size="sm"
                className="text-zinc-400 hover:text-white hover:bg-zinc-800/50 transition-all duration-300 backdrop-blur-sm border border-zinc-700/50"
              >
                <ChevronLeft className="w-4 h-4 mr-1" />
                Назад к каталогу
              </Button>
            </Link>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-400">{card.category}</span>
            <span className="text-zinc-600">/</span>
            <span className="text-zinc-300 font-medium truncate max-w-[200px]">{card.title}</span>
          </div>

          {/* Main Content with enhanced spacing and effects */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-20 items-start">
            {/* Image Gallery */}
            <div className="relative lg:col-span-5 w-full max-w-md mx-auto">
              <div className="relative">
                <CardGallery
                  images={card.images || [card.imageUrl || card.image || "/placeholder.svg"]}
                  title={card.title}
                />
              </div>
            </div>

            {/* Card Details */}
            <div className="relative lg:col-span-7">
              {/* Subtle glow effect */}
              <div className="absolute -inset-4 bg-gradient-to-l from-primary/10 to-transparent rounded-3xl blur-xl opacity-50" />
              <div className="relative">
                <CardDetails card={card} />
              </div>
            </div>
          </div>

          {/* Enhanced Related Cards Section */}
          <div className="relative">
            {/* Section background with subtle pattern */}
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-900/50 to-zinc-800/50 rounded-3xl blur-3xl" />
            <div className="relative bg-zinc-900/20 rounded-3xl border border-zinc-700/50 backdrop-blur-sm p-8">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold text-white mb-4">Похожие карточки</h2>
                <div className="w-24 h-1 bg-gradient-to-r from-primary to-purple-500 rounded-full mx-auto" />
              </div>
              <RelatedCards currentCardId={card.id} category={card.category} />
            </div>
          </div>
        </main>
      </div>

      {/* Enhanced Footer */}
      <div className="relative mt-20">
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 to-transparent" />
        <Footer />
      </div>
    </div>
  )
}
