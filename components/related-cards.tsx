import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star } from "lucide-react"

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
            className="group cursor-pointer bg-card border-border hover:border-primary/50 transition-all duration-300 overflow-hidden"
          >
            <div className="aspect-[3/4] relative overflow-hidden">
              <img
                src={card.image || "/placeholder.svg"}
                alt={card.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-2 left-2">
                <Badge className="bg-primary text-primary-foreground text-xs">{card.category}</Badge>
              </div>
              {card.discount && (
                <div className="absolute top-2 right-2">
                  <Badge variant="destructive" className="bg-red-600 text-xs">
                    -{card.discount}%
                  </Badge>
                </div>
              )}
            </div>

            <CardContent className="p-4">
              <h3 className="font-semibold text-card-foreground mb-2 text-balance line-clamp-2">{card.title}</h3>

              <p className="text-xs text-muted-foreground mb-2">{card.rarity}</p>

              <div className="flex items-center space-x-1 mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-3 h-3 ${i < Math.floor(card.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                  />
                ))}
                <span className="text-xs text-muted-foreground ml-1">({card.rating})</span>
              </div>

              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-foreground">{card.price} ₽</span>
                  {card.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{card.originalPrice} ₽</span>
                  )}
                </div>
              </div>

              <Button size="sm" className="w-full bg-primary hover:bg-primary/90">
                Подробнее
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
}
