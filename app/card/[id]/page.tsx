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
    <div className="min-h-screen bg-background">
      <Header />

      <GradualBlur
        preset="page-header"
        strength={2}
        divCount={5}
        height="8rem"
        animated="scroll"
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Skeleton className="h-10 w-40" />
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery Skeleton */}
          <div className="space-y-4">
            <Card className="bg-card border-border">
              <div className="aspect-[3/4] relative">
                <Skeleton className="w-full h-full rounded-lg" />
              </div>
            </Card>
            <div className="flex space-x-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="w-16 h-20 rounded" />
              ))}
            </div>
          </div>

          {/* Card Details Skeleton */}
          <div className="space-y-6">
            <div>
              <div className="flex gap-2 mb-4">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
              <Skeleton className="h-8 w-3/4 mb-4" />
            </div>

            <div className="flex items-center gap-4">
              <Skeleton className="h-5 w-24" />
              <Skeleton className="h-5 w-20" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-8 w-32" />
              <Skeleton className="h-5 w-40" />
            </div>

            <Card className="bg-card border-border">
              <CardContent className="pt-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Skeleton className="h-4 w-16 mb-2" />
                    <Skeleton className="h-5 w-20" />
                  </div>
                  <div>
                    <Skeleton className="h-4 w-20 mb-2" />
                    <Skeleton className="h-5 w-16" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Skeleton className="h-12 w-full" />
              <div className="flex gap-3">
                <Skeleton className="h-12 w-32" />
                <Skeleton className="h-12 w-12" />
                <Skeleton className="h-12 w-12" />
              </div>
            </div>
          </div>
        </div>

        {/* Related Cards Skeleton */}
        <div className="space-y-6">
          <Skeleton className="h-8 w-48" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="bg-transparent border-border aspect-square">
                <Skeleton className="w-full h-full rounded-3xl" />
              </Card>
            ))}
          </div>
        </div>
      </main>

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
          animated="scroll"
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
    <div className="min-h-screen bg-background">
      <Header />

      <GradualBlur
        preset="page-header"
        strength={2}
        divCount={5}
        height="8rem"
        animated="scroll"
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center space-x-2 mb-8">
          <Link href="/catalog">
            <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground">
              <ChevronLeft className="w-4 h-4 mr-1" />
              Назад к каталогу
            </Button>
          </Link>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div>
            <CardGallery
              images={card.images || [card.imageUrl || card.image || "/placeholder.svg"]}
              title={card.title}
            />
          </div>

          {/* Card Details */}
          <div>
            <CardDetails card={card} />
          </div>
        </div>

        {/* Related Cards */}
        <RelatedCards currentCardId={card.id} category={card.category} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
