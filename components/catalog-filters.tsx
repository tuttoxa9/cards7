"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface FilterState {
  priceRange: [number, number]
  categories: string[]
}

export function CatalogFilters() {
  const [categories, setCategories] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    categories: [],
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  // Загрузка данных фильтров из Firestore
  useEffect(() => {
    const loadFilterData = async () => {
      try {
        setIsLoading(true)

        // Загрузка категорий
        const categoriesDoc = await getDoc(doc(db, "settings", "categories"))
        if (categoriesDoc.exists()) {
          const data = categoriesDoc.data()
          setCategories(data.list || [])
        }

      } catch (error) {
        console.error("Ошибка загрузки данных фильтров:", error)
        // Fallback к базовым значениям при ошибке
        setCategories([])
      } finally {
        setIsLoading(false)
      }
    }

    loadFilterData()
  }, [])

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category),
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      categories: [],
    })
    setActiveFiltersCount(0)
  }

  return (
    <div className="w-80 space-y-6">
      {/* Filter Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Filter className="w-5 h-5 text-primary" />
          <h2 className="text-lg font-semibold text-foreground">Фильтры</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary" className="bg-primary text-primary-foreground">
              {activeFiltersCount}
            </Badge>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="w-4 h-4 mr-1" />
            Очистить
          </Button>
        )}
      </div>

      {/* Price Range */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">Цена</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
            max={5000}
            min={0}
            step={100}
            className="w-full"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>от {filters.priceRange[0]} Br</span>
            <span>до {filters.priceRange[1]} Br</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">Категории</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center space-x-2">
                <div className="w-4 h-4 bg-gray-300 rounded animate-pulse" />
                <div className="h-4 bg-gray-300 rounded animate-pulse flex-1" />
              </div>
            ))
          ) : (
            categories.map((category) => (
              <div key={category} className="flex items-center space-x-2">
                <Checkbox
                  id={category}
                  checked={filters.categories.includes(category)}
                  onCheckedChange={(checked) => handleCategoryChange(category, checked as boolean)}
                />
                <label htmlFor={category} className="text-sm text-card-foreground cursor-pointer flex-1">
                  {category}
                </label>
              </div>
            ))
          )}
        </CardContent>
      </Card>


    </div>
  )
}
