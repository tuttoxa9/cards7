import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Star, TrendingUp, Clock, Zap, ShoppingCart, Fire } from "lucide-react"

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
            <Fire className="w-8 h-8 text-red-500" />
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
                className="group cursor-pointer flex-shrink-0 w-80 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-red-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 rounded-2xl"
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  {/* Discount badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-red-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                      Акция
                    </Badge>
                  </div>

                  {/* End date */}
                  <div className="absolute top-3 right-3">
                    <div className="bg-black/70 text-white text-xs px-2 py-1 rounded-lg backdrop-blur-sm">
                      {card.endDate}
                    </div>
                  </div>

                  {/* Price overlay */}
                  <div className="absolute bottom-3 left-3">
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
                </div>

                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-white mb-1 line-clamp-1 group-hover:text-red-400 transition-colors">
                    {card.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-3">{card.category}</p>

                  <Button className="w-full bg-red-500 hover:bg-red-600 text-white rounded-xl transition-all duration-300 hover:scale-105">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    В корзину
                  </Button>
                </CardContent>
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
              className="group cursor-pointer bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-orange-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:scale-105 hover:shadow-2xl hover:shadow-orange-500/20 rounded-2xl"
            >
              <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                <div className="absolute top-3 left-3">
                  <Badge className="bg-orange-500 text-white font-bold text-sm px-3 py-1 rounded-full">
                    {card.tag}
                  </Badge>
                </div>

                <div className="absolute bottom-3 left-3">
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
              </div>

              <CardContent className="p-4">
                <h3 className="text-lg font-bold text-white mb-3 line-clamp-1 group-hover:text-orange-400 transition-colors">
                  {card.title}
                </h3>

                <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white rounded-xl transition-all duration-300 hover:scale-105">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  В корзину
                </Button>
              </CardContent>
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
                className="group cursor-pointer flex-shrink-0 w-80 bg-gradient-to-br from-slate-800/50 to-slate-900/50 border-slate-700/50 hover:border-blue-500/50 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:scale-105 hover:shadow-2xl hover:shadow-blue-500/20 rounded-2xl"
              >
                <div className="relative h-48 overflow-hidden rounded-t-2xl">
                  <img
                    src={card.image}
                    alt={card.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

                  <div className="absolute top-3 left-3">
                    <Badge className={`font-bold text-sm px-3 py-1 rounded-full ${
                      card.tag === "Новинка"
                        ? "bg-gray-700 text-white"
                        : "bg-blue-500 text-white"
                    }`}>
                      {card.tag === "Новинка" ? "Новинка" : "Премиум скидка по подписке"}
                    </Badge>
                  </div>

                  <div className="absolute bottom-3 left-3">
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
                </div>

                <CardContent className="p-4">
                  <h3 className="text-lg font-bold text-white mb-3 line-clamp-1 group-hover:text-blue-400 transition-colors">
                    {card.title}
                  </h3>

                  <Button className="w-full bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-all duration-300 hover:scale-105">
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    В корзину
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
