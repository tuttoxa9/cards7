"use client"

import { useState, useEffect } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ChevronLeft, Star, ShieldCheck, Truck, Plus, Minus, ShoppingCart, Heart } from "lucide-react"
import Link from "next/link"
import GradualBlur from "@/components/GradualBlur"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { cn } from "@/lib/utils"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"
import { RelatedCards } from "@/components/related-cards"

interface CardData {
  id: string;
  title: string;
  name?: string;
  price: number;
  originalPrice?: number;
  category: string;
  rarity?: string;
  description: string;
  inStock: boolean;
  imageUrl?: string;
  image?: string;
  images?: string[];
}

interface PageProps {
  params: {
    id: string
  }
}

function CardPageSkeleton() {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <GradualBlur preset="page-header" strength={2} divCount={5} height="8rem" animated={false} curve="bezier" exponential={true} opacity={1} zIndex={40} />
      <main className="container mx-auto px-4 py-8">
        <div className="w-full max-w-5xl mx-auto">
          {/* Breadcrumb Skeleton */}
          <div className="h-5 w-48 bg-gray-200 dark:bg-gray-700/50 rounded-md mb-8 animate-pulse shimmer" />

          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery Skeleton */}
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-gray-200 dark:bg-gray-800/80 rounded-2xl animate-pulse shimmer" />
              <div className="grid grid-cols-4 gap-4">
                <div className="aspect-square bg-gray-200 dark:bg-gray-800/80 rounded-lg animate-pulse shimmer" />
                <div className="aspect-square bg-gray-200 dark:bg-gray-800/80 rounded-lg animate-pulse shimmer" />
                <div className="aspect-square bg-gray-200 dark:bg-gray-800/80 rounded-lg animate-pulse shimmer" />
              </div>
            </div>

            {/* Details Skeleton */}
            <div className="py-4">
              <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700/50 rounded-md mb-3 animate-pulse shimmer" />
              <div className="h-8 w-3/4 bg-gray-300 dark:bg-gray-700 rounded-md mb-6 animate-pulse shimmer" />

              <div className="h-12 w-48 bg-gray-300 dark:bg-gray-700 rounded-md mb-8 animate-pulse shimmer" />

              <div className="h-24 w-full bg-gray-200 dark:bg-gray-700/50 rounded-md mb-8 animate-pulse shimmer" />

              <div className="h-14 w-full bg-gray-300 dark:bg-gray-700 rounded-full animate-pulse shimmer" />
            </div>
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
  const [activeImage, setActiveImage] = useState("")
  const [quantity, setQuantity] = useState(1)
  const { addToCart: addToCartContext } = useCart()

  useEffect(() => {
    const loadCard = async () => {
      if (!params.id) return
      try {
        setIsLoading(true)
        const cardDoc = await getDoc(doc(db, "cards", params.id))

        if (cardDoc.exists()) {
          const cardData = cardDoc.data() as CardData
          const images = cardData.images || [cardData.imageUrl || cardData.image || "/placeholder.svg"]
          setCard({ id: cardDoc.id, ...cardData, images })
          setActiveImage(images[0])
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

  const handleAddToCart = () => {
    if (!card) return
    addToCartContext({ ...card, quantity })
    toast.success(`${card.title} (x${quantity}) добавлена в корзину!`)
  }

  if (isLoading) {
    return <CardPageSkeleton />
  }

  if (notFound || !card) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />
        <main className="container mx-auto px-4 py-20 text-center">
          <h1 className="text-4xl font-bold mb-4">Карточка не найдена</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-8">Запрашиваемая карточка не существует.</p>
          <Link href="/catalog">
            <Button>Вернуться в каталог</Button>
          </Link>
        </main>
        <Footer />
      </div>
    )
  }

  const discountPercent = card.originalPrice && card.price ? Math.round(((card.originalPrice - card.price) / card.originalPrice) * 100) : 0

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen">
      <Header />
      <GradualBlur preset="page-header" strength={2} divCount={5} height="8rem" animated={false} curve="bezier" exponential={true} opacity={1} zIndex={40} />

      <main className="container mx-auto px-4 py-8">
        <div className="w-full max-w-6xl mx-auto">
          {/* Breadcrumbs */}
          <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-8">
            <Link href="/catalog" className="hover:text-red-500 transition-colors">Каталог</Link>
            <ChevronLeft className="w-4 h-4 transform rotate-180 mx-2" />
            <span className="font-medium text-gray-800 dark:text-gray-200">{card.title}</span>
          </div>

          <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div className="aspect-[4/5] bg-white dark:bg-gray-800/50 rounded-2xl overflow-hidden shadow-sm flex items-center justify-center border border-gray-200 dark:border-gray-800">
                <img src={activeImage} alt={card.title} className="w-full h-full object-contain" />
              </div>
              <div className="grid grid-cols-4 gap-4">
                {card.images?.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(img)}
                    className={cn(
                      "aspect-square bg-white dark:bg-gray-800/50 rounded-lg overflow-hidden transition-all duration-200 flex items-center justify-center border",
                      activeImage === img ? "border-red-500 ring-2 ring-red-500/50" : "border-gray-200 dark:border-gray-800 hover:border-red-400"
                    )}
                  >
                    <img src={img} alt={`${card.title} thumbnail ${idx + 1}`} className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            </div>

            {/* Card Details */}
            <div className="py-4">
              <Badge variant="outline" className="mb-3 text-red-500 border-red-500/50">{card.category}</Badge>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4">{card.title}</h1>

              <div className="flex items-baseline gap-3 mb-6">
                <span className="text-3xl font-bold text-red-500">{card.price.toLocaleString('ru-RU')} BYN</span>
                {card.originalPrice && (
                  <span className="text-xl text-gray-400 dark:text-gray-500 line-through">{card.originalPrice.toLocaleString('ru-RU')} BYN</span>
                )}
                {discountPercent > 0 && (
                  <Badge className="bg-red-500/10 text-red-600 dark:bg-red-500/20 dark:text-red-400 border-red-500/20 text-md font-semibold">
                    -{discountPercent}%
                  </Badge>
                )}
              </div>

              <div className="mb-8">
                <h3 className="text-lg font-semibold mb-3 text-gray-800 dark:text-gray-200">Описание</h3>
                <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{card.description}</p>
              </div>

              <div className="flex items-center gap-4 mb-8">
                <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-full">
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus className="w-4 h-4" />
                  </Button>
                  <span className="font-bold w-10 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" className="rounded-full" onClick={() => setQuantity(q => q + 1)}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <Button size="lg" className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-full text-lg font-bold" onClick={handleAddToCart}>
                  <ShoppingCart className="w-5 h-5 mr-2" />
                  Добавить в корзину
                </Button>
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <ShieldCheck className="w-5 h-5 text-green-500" />
                  <span className="text-gray-600 dark:text-gray-300">Гарантия подлинности и качества</span>
                </div>
                <div className="flex items-center gap-3">
                  <Truck className="w-5 h-5 text-blue-500" />
                  <span className="text-gray-600 dark:text-gray-300">Быстрая доставка по всему миру</span>
                </div>
              </div>
            </div>
          </div>

          {/* Related Cards Section */}
          <div className="mt-20 lg:mt-28">
            <h2 className="text-2xl lg:text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">Похожие карточки</h2>
            <RelatedCards currentCardId={card.id} category={card.category} />
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}