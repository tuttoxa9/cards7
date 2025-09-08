"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const collections = [
  {
    id: 1,
    title: "Marvel Heroes",
    image: "/placeholder-lr4x8.png",
    category: "Супергерои",
    isActive: false,
  },
  {
    id: 2,
    title: "Speed Legends",
    image: "/placeholder-id3mm.png",
    category: "Автомобили",
    isActive: false,
  },
  {
    id: 3,
    title: "DC Universe",
    image: "/placeholder-fdm1l.png",
    category: "Супергерои",
    isActive: true, // добавил активную карточку
  },
  {
    id: 4,
    title: "Classic Cars",
    image: "/placeholder-glgtj.png",
    category: "Автомобили",
    isActive: false,
  },
  {
    id: 5,
    title: "Anime Heroes",
    image: "/placeholder-cud1g.png",
    category: "Аниме",
    isActive: false,
  },
  {
    id: 6,
    title: "Luxury Motors",
    image: "/placeholder-s6e8u.png",
    category: "Автомобили",
    isActive: false,
  },
  {
    id: 7,
    title: "Fantasy Realm",
    image: "/placeholder-o8nv6.png",
    category: "Фэнтези",
    isActive: false,
  },
  {
    id: 8,
    title: "Space Warriors",
    image: "/placeholder-mqa1m.png",
    category: "Фантастика",
    isActive: false,
  },
]

export function CardCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const itemsPerView = 6 // увеличил количество видимых карточек

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1 >= collections.length - itemsPerView + 1 ? 0 : prev + 1))
  }

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, collections.length - itemsPerView) : prev - 1))
  }

  return (
    <div className="relative mb-8">
      <div className="overflow-hidden">
        <div
          className="flex transition-transform duration-500 ease-out gap-3"
          style={{ transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)` }}
        >
          {collections.map((collection) => (
            <div key={collection.id} className="flex-shrink-0" style={{ width: `${100 / itemsPerView}%` }}>
              <div
                className={`
                  relative group cursor-pointer transition-all duration-300 hover:scale-105
                  ${collection.isActive ? "ring-2 ring-purple-500 ring-offset-2 ring-offset-background" : ""}
                `}
              >
                <div className="aspect-square relative overflow-hidden rounded-xl bg-gradient-to-br from-slate-800 to-slate-900">
                  <img
                    src={collection.image || "/placeholder.svg"}
                    alt={collection.title}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  <div className="absolute bottom-0 left-0 right-0 p-3">
                    <h3 className="font-semibold text-white text-sm text-center drop-shadow-lg">{collection.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute -top-12 right-0 flex space-x-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={prevSlide}
          className="bg-background/80 backdrop-blur-sm border border-border hover:bg-accent rounded-full w-10 h-10"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={nextSlide}
          className="bg-background/80 backdrop-blur-sm border border-border hover:bg-accent rounded-full w-10 h-10"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
