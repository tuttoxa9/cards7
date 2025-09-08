import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Clock, Zap } from "lucide-react"

const newReleases = [
  {
    id: 1,
    title: "Cyberpunk Cars 2077",
    image: "/futuristic-cyberpunk-car-trading-card-neon.jpg",
    price: 1299,
    originalPrice: 1599,
    discount: 19,
    rating: 4.8,
    category: "Автомобили",
  },
  {
    id: 2,
    title: "Avengers Assemble",
    image: "/avengers-team-trading-card-epic-composition.jpg",
    price: 1899,
    originalPrice: null,
    discount: null,
    rating: 4.9,
    category: "Супергерои",
  },
  {
    id: 3,
    title: "JDM Legends",
    image: "/japanese-sports-car-trading-card-nissan-gtr.jpg",
    price: 999,
    originalPrice: 1299,
    discount: 23,
    rating: 4.7,
    category: "Автомобили",
  },
]

const popularCards = [
  {
    id: 1,
    title: "Spider-Man Multiverse",
    image: "/spider-man-multiverse-trading-card-web-design.jpg",
    price: 2199,
    sales: 1247,
    category: "Супергерои",
  },
  {
    id: 2,
    title: "Formula 1 Champions",
    image: "/formula-1-racing-car-trading-card-speed.jpg",
    price: 1799,
    sales: 892,
    category: "Автомобили",
  },
  {
    id: 3,
    title: "DC Dark Knights",
    image: "/batman-dark-knight-trading-card-gothic.jpg",
    price: 2499,
    sales: 756,
    category: "Супергерои",
  },
]

export function FeaturedSections() {
  return (
    <div className="space-y-12">
      {/* New Releases Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <Zap className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Новые релизы</h2>
          </div>
          <Button variant="outline" className="border-border hover:bg-accent bg-transparent">
            Смотреть все
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {newReleases.map((card) => (
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
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">{card.category}</Badge>
                </div>
                {card.discount && (
                  <div className="absolute top-3 right-3">
                    <Badge variant="destructive" className="bg-red-600">
                      -{card.discount}%
                    </Badge>
                  </div>
                )}
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-green-600 text-white">
                    <Clock className="w-3 h-3 mr-1" />
                    Новинка
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-card-foreground mb-2 text-balance">{card.title}</h3>

                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(card.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                    />
                  ))}
                  <span className="text-xs text-muted-foreground ml-1">({card.rating})</span>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-lg font-bold text-foreground">{card.price} ₽</span>
                  {card.originalPrice && (
                    <span className="text-sm text-muted-foreground line-through">{card.originalPrice} ₽</span>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Popular Cards Section */}
      <section>
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <h2 className="text-3xl font-bold text-foreground">Популярные коллекции</h2>
          </div>
          <Button variant="outline" className="border-border hover:bg-accent bg-transparent">
            Смотреть все
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {popularCards.map((card) => (
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
                <div className="absolute top-3 left-3">
                  <Badge className="bg-primary text-primary-foreground">{card.category}</Badge>
                </div>
                <div className="absolute bottom-3 left-3">
                  <Badge className="bg-orange-600 text-white">
                    <TrendingUp className="w-3 h-3 mr-1" />
                    Хит продаж
                  </Badge>
                </div>
              </div>

              <CardContent className="p-4">
                <h3 className="font-semibold text-card-foreground mb-2 text-balance">{card.title}</h3>

                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-muted-foreground">Продано: {card.sales}</span>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-lg font-bold text-foreground">{card.price} ₽</span>
                  <Button size="sm" className="bg-primary hover:bg-primary/90">
                    В корзину
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    </div>
  )
}
