"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

interface CardGalleryProps {
  images: string[]
  title: string
}

export function CardGallery({ images, title }: CardGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
  }

  return (
    <div className="space-y-4">
      {/* Main Image */}
      <Card className="relative overflow-hidden bg-gradient-to-br from-card to-card/50 border-border shadow-xl">
        <div className="aspect-[3/4] relative group">
          <img
            src={images[currentImage] || "/placeholder.svg"}
            alt={`${title} - изображение ${currentImage + 1}`}
            className={`w-full h-full object-cover transition-all duration-500 ${
              isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in hover:scale-105"
            }`}
            onClick={() => setIsZoomed(!isZoomed)}
            loading="lazy"
          />

          {/* Navigation Arrows */}
          {images.length > 1 && (
            <>
              <Button
                variant="secondary"
                size="icon"
                className="absolute left-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={prevImage}
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
                onClick={nextImage}
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </>
          )}

          {/* Zoom Icon */}
          <div className="absolute top-3 right-3">
            <Button
              variant="secondary"
              size="icon"
              className="bg-black/60 hover:bg-black/80 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300"
              onClick={() => setIsZoomed(!isZoomed)}
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>

          {/* Image Counter */}
          {images.length > 1 && (
            <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm text-white font-medium">
              {currentImage + 1} / {images.length}
            </div>
          )}

          {/* Gradient overlay for better readability */}
          <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />
        </div>
      </Card>

      {/* Thumbnail Gallery */}
      {images.length > 1 && (
        <div className="flex space-x-3 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setCurrentImage(index)}
              className={`flex-shrink-0 w-20 h-24 rounded-xl border-3 overflow-hidden transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                currentImage === index
                  ? "border-primary shadow-lg shadow-primary/50 ring-2 ring-primary/30"
                  : "border-border hover:border-primary/50 opacity-70 hover:opacity-100"
              }`}
            >
              <img
                src={image || "/placeholder.svg"}
                alt={`${title} - миниатюра ${index + 1}`}
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
