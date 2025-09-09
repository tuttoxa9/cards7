import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Clock, Zap, ShoppingCart, Flame, Heart } from "lucide-react"

const newReleases = [
  {
    id: 1,
    title: "Pokemon TCG Scarlet & Violet",
    image: "/futuristic-cyberpunk-car-trading-card-neon.jpg",
    price: 1173,
    originalPrice: 5479,
    discount: 79,
    endDate: "29.09.2025",
    category: "Покемон",
  },
  {
    id: 2,
    title: "Magic: The Gathering Foundations",
    image: "/avengers-team-trading-card-epic-composition.jpg",
    price: 2909,
    originalPrice: 4149,
    discount: 30,
    endDate: "29.09.2025",
    category: "MTG",
  },
  {
    id: 3,
    title: "Yu-Gi-Oh! Quarter Century",
    image: "/japanese-sports-car-trading-card-nissan-gtr.jpg",
    price: 969,
    originalPrice: 3489,
    discount: 72,
    endDate: "29.09.2025",
    category: "Yu-Gi-Oh!",
  },
  {
    id: 4,
    title: "Disney Lorcana",
    image: "/spider-man-multiverse-trading-card-web-design.jpg",
    price: 290,
    originalPrice: 595,
    discount: 52,
    endDate: "29.09.2025",
    category: "Disney",
  },
  {
    id: 5,
    title: "One Piece Card Game",
    image: "/batman-dark-knight-trading-card-gothic.jpg",
    price: 290,
    originalPrice: 550,
    discount: 47,
    endDate: "29.09.2025",
    category: "Аниме",
  },
]

const bestSellers = [
  {
    id: 1,
    title: "Pokemon Classic Collection",
    image: "/futuristic-cyberpunk-car-trading-card-neon.jpg",
    price: 484,
    originalPrice: 3559,
    discount: 86,
    tag: "Хит продаж",
  },
  {
    id: 2,
    title: "Magic Vintage Masters",
    image: "/formula-1-racing-car-trading-card-speed.jpg",
    price: 290,
    originalPrice: 1179,
    discount: 75,
    tag: "Хит продаж",
  },
  {
    id: 3,
    title: "Yu-Gi-Oh! 25th Anniversary",
    image: "/batman-dark-knight-trading-card-gothic.jpg",
    price: 57,
    originalPrice: 999,
    discount: 94,
    tag: "Хит продаж",
  },
]

const newInCatalog = [
  {
    id: 1,
    title: "God of War Collection",
    image: "/placeholder-2n0yc.png",
    price: 2036,
    originalPrice: 2989,
    discount: 32,
    tag: "Новинка",
  },
  {
    id: 2,
    title: "Medieval Fantasy Set",
    image: "/dark-fantasy-trading-card-background-with-mystical.jpg",
    price: 899,
    originalPrice: 999,
    discount: 10,
    tag: "Премиум скидка по подписке",
  },
  {
    id: 3,
    title: "Farming Simulator Pack",
    image: "/placeholder-47xbe.png",
    price: 809,
    originalPrice: 899,
    discount: 10,
    tag: "Премиум скидка по подписке",
  },
  {
    id: 4,
    title: "Knights & Crusades",
    image: "/placeholder-9ud78.png",
    price: 823,
    originalPrice: 849,
    discount: 3,
    tag: "Новинка",
  },
  {
    id: 5,
    title: "Chaos: The New Dawn",
    image: "/placeholder-cud1g.png",
    price: 3879,
    originalPrice: 5339,
    discount: 27,
    tag: "Новинка",
  },
]

export function FeaturedSections() {
  return (
    <div className="space-y-16">
      {/* Weekly Deals Section */}
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
                    className="w-full h-full object-cover"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

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
        </div>
      </section>

      {/* Best Sellers Section */}
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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {bestSellers.map((card) => (
            <Card
              key={card.id}
              className="group cursor-pointer bg-transparent border-2 border-transparent hover:border-orange-500/70 transition-all duration-300 overflow-hidden rounded-3xl aspect-square"
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-4 left-4">
                  <Badge className="bg-orange-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                    {card.tag}
                  </Badge>
                </div>

                <div className="absolute bottom-4 left-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-xl font-bold text-white">
                        {card.price} ₽
                      </span>
                      <span className="text-sm text-orange-400 line-through">
                        {card.originalPrice} ₽
                      </span>
                    </div>
                    <Badge className="bg-orange-600 text-white text-xs font-bold">
                      -{card.discount}%
                    </Badge>
                  </div>
                </div>

                {/* Hover icons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex space-x-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                    <ShoppingCart className="w-6 h-6" />
                  </Button>
                  <Button size="icon" className="w-12 h-12 bg-white/90 hover:bg-white text-black rounded-full">
                    <Heart className="w-6 h-6" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* New in Catalog Section */}
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
                    className="w-full h-full object-cover"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-4 left-4">
                    <Badge className={`font-bold text-sm px-3 py-1 rounded-full ${
                      card.tag === "Новинка"
                        ? "bg-gray-700 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {card.tag === "Новинка" ? "Новинка" : "Премиум скидка по подписке"}
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
        </div>
      </section>
    </div>
  )
}
