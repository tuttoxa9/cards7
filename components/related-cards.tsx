import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, Heart, ShoppingCart } from "lucide-react"

const relatedCards = [
  {
    id: 2,
    title: "Iron Man Mark 85",
    image: "/avengers-team-trading-card-epic-composition.jpg",
    price: 2199,
    originalPrice: 2799,
    discount: 21,
    rating: 4.8,
    category: "Супергерои",
    rarity: "Легендарные",
  },
  {
    id: 3,
    title: "Captain America Shield",
    image: "/spider-man-multiverse-trading-card-web-design.jpg",
    price: 1899,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    category: "Супергерои",
    rarity: "Эпические",
  },
  {
    id: 4,
    title: "Thor Mjolnir",
    image: "/batman-dark-knight-trading-card-gothic.jpg",
    price: 2499,
    originalPrice: 3199,
    discount: 22,
    rating: 4.7,
    category: "Супергерои",
    rarity: "Легендарные",
  },
  {
    id: 5,
    title: "Hulk Smash",
    image: "/futuristic-cyberpunk-car-trading-card-neon.jpg",
    price: 1699,
    originalPrice: null,
    discount: null,
    rating: 4.6,
    category: "Супергерои",
    rarity: "Редкие",
  },
]

export function RelatedCards() {
  return (
    <section className="space-y-6">
      <h2 className="text-2xl font-bold text-foreground">Похожие карточки</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {relatedCards.map((card) => (
          <Card
            key={card.id}
            className="group cursor-pointer bg-transparent border-2 border-transparent hover:border-primary/70 transition-all duration-300 overflow-hidden rounded-3xl aspect-square"
          >
            <div className="relative w-full h-full overflow-hidden rounded-3xl">
              <img
                src={card.image || "/placeholder.svg"}
                alt={card.title}
                className="w-full h-full object-cover"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              <div className="absolute top-4 left-4">
                <Badge className="bg-primary text-primary-foreground text-sm px-3 py-1 rounded-full">{card.category}</Badge>
              </div>

              <div className="absolute bottom-4 left-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-bold text-white">{card.price} BYN</span>
                    {card.originalPrice && (
                      <span className="text-sm text-gray-400 line-through">{card.originalPrice} BYN</span>
                    )}
                  </div>
                  {card.discount && (
                    <Badge variant="destructive" className="bg-red-600 text-white text-xs">
                      -{card.discount}%
                    </Badge>
                  )}
                </div>
              </div>

              {/* Hover icons */}
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-cart-fill w-6 h-6" viewBox="0 0 16 16">
                    <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .491.592l-1.5 8A.5.5 0 0 1 13 12H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
                  </svg>
                </Button>
                <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-heart-fill w-6 h-6" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314"/>
                  </svg>
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </section>
  )
}
