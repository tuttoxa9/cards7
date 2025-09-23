import { Header } from "@/components/header"
import { CardGallery } from "@/components/card-gallery"
import { CardDetails } from "@/components/card-details"
import { RelatedCards } from "@/components/related-cards"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { ChevronLeft } from "lucide-react"
import Link from "next/link"

// Mock data for the card
const mockCard = {
  id: 1,
  title: "Spider-Man Multiverse Legendary Edition",
  price: 2499,
  originalPrice: 3299,
  discount: 24,
  rating: 4.9,
  reviews: 156,
  category: "Супергерои",
  rarity: "Легендарные",
  year: "2024",
  description:
    "Эксклюзивная карточка Spider-Man из коллекции Multiverse с уникальными голографическими эффектами. Карточка выполнена на премиальном картоне с фольгированными элементами и специальным защитным покрытием. Ограниченный тираж делает эту карточку особенно ценной для коллекционеров.",
  features: [
    "Голографические эффекты высокого качества",
    "Премиальный картон плотностью 350 г/м²",
    "Фольгированные элементы",
    "Защитное UV-покрытие",
    "Ограниченный тираж - 1000 экземпляров",
    "Сертификат подлинности",
    "Индивидуальная нумерация",
  ],
  inStock: true,
  stockCount: 23,
  images: [
    "/spider-man-multiverse-trading-card-web-design.jpg",
    "/avengers-team-trading-card-epic-composition.jpg",
    "/batman-dark-knight-trading-card-gothic.jpg",
  ],
}

interface PageProps {
  params: {
    id: string
  }
}

export default function CardPage({ params }: PageProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />

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
            <CardGallery images={mockCard.images} title={mockCard.title} />
          </div>

          {/* Card Details */}
          <div>
            <CardDetails card={mockCard} />
          </div>
        </div>

        {/* Related Cards */}
        <RelatedCards />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
