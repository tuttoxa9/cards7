"use client"

import { useState, useEffect } from "react"
import { ChevronLeft, ChevronRight, ZoomIn, Maximize2, RotateCw, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface CardGalleryProps {
  images: string[]
  title: string
}

export function CardGallery({ images, title }: CardGalleryProps) {
  const [currentImage, setCurrentImage] = useState(0)
  const [isZoomed, setIsZoomed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [rotation, setRotation] = useState(0)
  const [imageLoaded, setImageLoaded] = useState(false)

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length)
    setImageLoaded(false)
    setRotation(0)
  }

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length)
    setImageLoaded(false)
    setRotation(0)
  }

  const rotateImage = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const downloadImage = () => {
    const link = document.createElement('a')
    link.href = images[currentImage]
    link.download = `${title}-${currentImage + 1}.jpg`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  useEffect(() => {
    setImageLoaded(false)
    setRotation(0)
  }, [currentImage])

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (isFullscreen) {
        if (e.key === 'ArrowLeft') prevImage()
        if (e.key === 'ArrowRight') nextImage()
        if (e.key === 'Escape') setIsFullscreen(false)
      }
    }

    window.addEventListener('keydown', handleKeyPress)
    return () => window.removeEventListener('keydown', handleKeyPress)
  }, [isFullscreen])

  return (
    <>
      <div className="space-y-6 flex flex-col items-center">
        {/* Main Image */}
        <div className="relative overflow-visible bg-transparent border-0 shadow-none flex justify-center w-full">
          <div className="relative group overflow-visible aspect-auto inline-block max-w-full">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-zinc-800/20 animate-pulse rounded-xl" />
            )}

            <img
              src={images[currentImage] || "/placeholder.svg"}
              alt={`${title} - изображение ${currentImage + 1}`}
              className={`max-w-full h-auto object-contain max-h-[70vh] drop-shadow-2xl transition-all duration-300 transform hover:scale-[1.02] ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ filter: 'drop-shadow(0 25px 25px rgb(0 0 0 / 0.5))' }}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Navigation Arrows */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </>
            )}

            {/* Action buttons */}
            <div className="absolute top-4 right-4 flex space-x-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm shadow-lg"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
            </div>

            {/* Image Counter */}
            {images.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-sm text-white font-medium shadow-lg">
                {currentImage + 1} / {images.length}
              </div>
            )}

            {/* Progress dots */}
            {images.length > 1 && (
              <div className="absolute bottom-4 right-4 flex space-x-1">
                {images.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImage(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      index === currentImage
                        ? 'bg-white shadow-lg'
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>
        </div>

        {/* Enhanced Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="space-y-3 w-full">
            <h3 className="text-sm font-medium text-zinc-400 px-1 text-center">Дополнительные изображения</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2 justify-center scrollbar-hide">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImage(index)}
                  className={`relative flex-shrink-0 w-24 h-30 rounded-2xl border-2 overflow-hidden transition-all duration-500 cursor-pointer transform hover:scale-110 hover:-translate-y-1 ${
                    currentImage === index
                      ? "border-primary shadow-2xl shadow-primary/50 ring-4 ring-primary/30 scale-105"
                      : "border-zinc-700/50 hover:border-primary/50 opacity-70 hover:opacity-100"
                  }`}
                >
                  <img
                    src={image || "/placeholder.svg"}
                    alt={`${title} - миниатюра ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-300"
                    loading="lazy"
                  />

                  {/* Active indicator */}
                  {currentImage === index && (
                    <div className="absolute inset-0 bg-gradient-to-t from-primary/30 to-transparent" />
                  )}

                  {/* Glow effect for active thumbnail */}
                  {currentImage === index && (
                    <div className="absolute -inset-1 bg-gradient-to-r from-primary/50 to-purple-500/50 rounded-2xl blur-sm -z-10" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <Dialog open={isFullscreen} onOpenChange={setIsFullscreen}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-zinc-800 z-[100]">
          <div className="relative w-full h-[90vh] flex items-center justify-center">
            <img
              src={images[currentImage] || "/placeholder.svg"}
              alt={`${title} - полноэкранное изображение ${currentImage + 1}`}
              className="max-w-full max-h-full object-contain transition-transform duration-300"
              style={{ transform: `rotate(${rotation}deg)` }}
            />

            {/* Fullscreen controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white border-0"
                onClick={rotateImage}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white border-0"
                onClick={downloadImage}
              >
                <Download className="w-4 h-4" />
              </Button>
            </div>

            {/* Fullscreen navigation */}
            {images.length > 1 && (
              <>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0"
                  onClick={prevImage}
                >
                  <ChevronLeft className="w-6 h-6" />
                </Button>
                <Button
                  variant="secondary"
                  size="icon"
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-black/70 hover:bg-black/90 text-white border-0"
                  onClick={nextImage}
                >
                  <ChevronRight className="w-6 h-6" />
                </Button>

                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/80 backdrop-blur-sm px-4 py-2 rounded-full text-white">
                  {currentImage + 1} / {images.length}
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
