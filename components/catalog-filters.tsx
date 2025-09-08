"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { X, Filter } from "lucide-react"

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  rarity: string[]
  productType: string[]
  year: string[]
  inStock: boolean
}

const categories = ["Супергерои", "Автомобили", "Аниме", "Фэнтези", "Спорт"]

const rarityLevels = ["Обычные", "Редкие", "Эпические", "Легендарные", "Уникальные"]

const productTypes = ["Одиночные карточки", "Стартовые наборы", "Бустер-паки", "Коллекционные боксы"]

const years = ["2024", "2023", "2022", "2021", "2020"]

export function CatalogFilters() {
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 5000],
    categories: [],
    rarity: [],
    productType: [],
    year: [],
    inStock: false,
  })

  const [activeFiltersCount, setActiveFiltersCount] = useState(0)

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category),
    }))
  }

  const handleRarityChange = (rarity: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      rarity: checked ? [...prev.rarity, rarity] : prev.rarity.filter((r) => r !== rarity),
    }))
  }

  const handleProductTypeChange = (type: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      productType: checked ? [...prev.productType, type] : prev.productType.filter((t) => t !== type),
    }))
  }

  const handleYearChange = (year: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      year: checked ? [...prev.year, year] : prev.year.filter((y) => y !== year),
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      categories: [],
      rarity: [],
      productType: [],
      year: [],
      inStock: false,
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
            <span>от {filters.priceRange[0]} ₽</span>
            <span>до {filters.priceRange[1]} ₽</span>
          </div>
        </CardContent>
      </Card>

      {/* Categories */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">Категории</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {categories.map((category) => (
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
          ))}
        </CardContent>
      </Card>

      {/* Rarity */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">Редкость</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {rarityLevels.map((rarity) => (
            <div key={rarity} className="flex items-center space-x-2">
              <Checkbox
                id={rarity}
                checked={filters.rarity.includes(rarity)}
                onCheckedChange={(checked) => handleRarityChange(rarity, checked as boolean)}
              />
              <label htmlFor={rarity} className="text-sm text-card-foreground cursor-pointer flex-1">
                {rarity}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Product Type */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">Тип продукта</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {productTypes.map((type) => (
            <div key={type} className="flex items-center space-x-2">
              <Checkbox
                id={type}
                checked={filters.productType.includes(type)}
                onCheckedChange={(checked) => handleProductTypeChange(type, checked as boolean)}
              />
              <label htmlFor={type} className="text-sm text-card-foreground cursor-pointer flex-1">
                {type}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Year */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-card-foreground">Год выпуска</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {years.map((year) => (
            <div key={year} className="flex items-center space-x-2">
              <Checkbox
                id={year}
                checked={filters.year.includes(year)}
                onCheckedChange={(checked) => handleYearChange(year, checked as boolean)}
              />
              <label htmlFor={year} className="text-sm text-card-foreground cursor-pointer flex-1">
                {year}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* In Stock */}
      <Card className="bg-card border-border">
        <CardContent className="pt-6">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="inStock"
              checked={filters.inStock}
              onCheckedChange={(checked) => setFilters((prev) => ({ ...prev, inStock: checked as boolean }))}
            />
            <label htmlFor="inStock" className="text-sm text-card-foreground cursor-pointer flex-1">
              Только в наличии
            </label>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
