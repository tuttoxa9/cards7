"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Play, Eye, Calendar, Clock } from "lucide-react"

const mediaContent = [
  {
    id: 1,
    title: "Обзор новой коллекции Pokemon",
    description: "Детальный разбор карточек из последнего набора Pokemon TCG",
    thumbnail: "/placeholder-2n0yc.png",
    duration: "12:34",
    views: 15420,
    date: "2024-01-15",
    type: "video",
    category: "Обзоры"
  },
  {
    id: 2,
    title: "История Magic: The Gathering",
    description: "Рассказываем о самых дорогих и редких картах в истории MTG",
    thumbnail: "/placeholder-47xbe.png",
    duration: "18:22",
    views: 8930,
    date: "2024-01-12",
    type: "video",
    category: "История"
  },
  {
    id: 3,
    title: "Турнир по Yu-Gi-Oh!",
    description: "Прямая трансляция турнира чемпионата по Yu-Gi-Oh!",
    thumbnail: "/placeholder-9ud78.png",
    duration: "LIVE",
    views: 2340,
    date: "2024-01-20",
    type: "live",
    category: "Турниры"
  },
  {
    id: 4,
    title: "Галерея редких карточек",
    description: "Коллекция самых красивых и редких карточек разных эпох",
    thumbnail: "/placeholder-cud1g.png",
    views: 5670,
    date: "2024-01-18",
    type: "gallery",
    category: "Галереи"
  },
  {
    id: 5,
    title: "Советы для начинающих",
    description: "Как начать коллекционировать карточки: полное руководство",
    thumbnail: "/placeholder-fdm1l.png",
    duration: "25:15",
    views: 12580,
    date: "2024-01-10",
    type: "video",
    category: "Обучение"
  },
  {
    id: 6,
    title: "Раритеты недели",
    description: "Еженедельная подборка самых интересных находок",
    thumbnail: "/placeholder-glgtj.png",
    views: 9240,
    date: "2024-01-19",
    type: "gallery",
    category: "Подборки"
  }
]

const categories = ["Все", "Обзоры", "История", "Турниры", "Галереи", "Обучение", "Подборки"]

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
            Медиа <span className="text-red-500">Центр</span>
          </h1>
          <p className="text-xl text-white/70 max-w-2xl mx-auto">
            Видеообзоры, галереи и всё самое интересное из мира коллекционных карточек
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              className="rounded-full bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105"
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Media Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {mediaContent.map((item) => (
            <Card
              key={item.id}
              className="group cursor-pointer bg-white/5 border-white/10 hover:border-white/30 transition-all duration-500 overflow-hidden backdrop-blur-sm hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20 rounded-2xl"
            >
              <CardContent className="p-0">
                {/* Thumbnail */}
                <div className="relative aspect-video overflow-hidden rounded-t-2xl">
                  <img
                    src={item.thumbnail}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Play Button */}
                  {(item.type === "video" || item.type === "live") && (
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="w-16 h-16 bg-red-500/90 rounded-full flex items-center justify-center backdrop-blur-sm hover:bg-red-500 transition-colors">
                        <Play className="w-6 h-6 text-white ml-1" />
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  <div className="absolute top-3 left-3">
                    <Badge className={`rounded-full backdrop-blur-sm ${
                      item.type === "live"
                        ? "bg-red-500/90 text-white animate-pulse"
                        : "bg-black/50 text-white border-white/20"
                    }`}>
                      {item.category}
                    </Badge>
                  </div>

                  {/* Duration/Type */}
                  {item.duration && (
                    <div className="absolute bottom-3 right-3">
                      <div className="bg-black/70 text-white text-sm px-2 py-1 rounded-lg backdrop-blur-sm">
                        {item.duration}
                      </div>
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <h3 className="text-xl font-semibold text-white group-hover:text-red-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>

                  <p className="text-white/70 text-sm line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>

                  {/* Meta Information */}
                  <div className="flex items-center justify-between text-white/50 text-sm pt-2">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center space-x-1">
                        <Eye className="w-4 h-4" />
                        <span>{item.views.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar className="w-4 h-4" />
                        <span>{new Date(item.date).toLocaleDateString('ru-RU')}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Load More Button */}
        <div className="text-center mt-12">
          <Button className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full text-lg transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-500/30">
            Загрузить ещё
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
