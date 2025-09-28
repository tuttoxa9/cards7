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
      <div className="space-y-6">
        {/* Main Image */}
        <Card className="relative overflow-hidden bg-gradient-to-br from-zinc-900/50 to-zinc-950/50 border-zinc-700/50 shadow-2xl backdrop-blur-sm">
          <div className="aspect-[3/4] relative group bg-zinc-900/20">
            {/* Loading skeleton */}
            {!imageLoaded && (
              <div className="absolute inset-0 bg-gradient-to-br from-zinc-800/50 to-zinc-900/50 animate-pulse" />
            )}

            <img
              src={images[currentImage] || "/placeholder.svg"}
              alt={`${title} - изображение ${currentImage + 1}`}
              className={`w-full h-full object-cover transition-all duration-700 transform ${
                isZoomed ? "scale-150 cursor-zoom-out" : "cursor-zoom-in hover:scale-105"
              } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
              style={{ transform: `scale(${isZoomed ? 1.5 : 1}) rotate(${rotation}deg)` }}
              onClick={() => setIsZoomed(!isZoomed)}
              onLoad={() => setImageLoaded(true)}
              loading="lazy"
            />

            {/* Holographic effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 via-transparent to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-t from-primary/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

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
                onClick={() => setIsZoomed(!isZoomed)}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm shadow-lg"
                onClick={rotateImage}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm shadow-lg"
                onClick={() => setIsFullscreen(true)}
              >
                <Maximize2 className="w-4 h-4" />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                className="bg-black/70 hover:bg-black/90 text-white border-0 backdrop-blur-sm shadow-lg"
                onClick={downloadImage}
              >
                <Download className="w-4 h-4" />
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

            {/* Modern gradient overlay */}
            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black/40 via-black/10 to-transparent pointer-events-none" />
          </div>
        </Card>

        {/* Enhanced Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-zinc-400 px-1">Дополнительные изображения</h3>
            <div className="flex space-x-4 overflow-x-auto pb-2 scrollbar-hide">
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
        <DialogContent className="max-w-[95vw] max-h-[95vh] p-0 bg-black/95 border-zinc-800">
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
