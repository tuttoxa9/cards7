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
import { Switch } from "@/components/ui/switch"

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  universe: string[]
  foil: boolean
  condition: string[]
}

interface CatalogFiltersProps {
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
}

// Предустановленные популярные вселенные для MVP (чтобы не скачивать всю базу)
const POPULAR_UNIVERSES = ["Marvel", "DC", "Star Wars", "Pokemon", "Yu-Gi-Oh!", "Magic: The Gathering", "Dragon Ball", "Other"];

export function CatalogFilters({ filters, setFilters }: CatalogFiltersProps) {
  const [categories, setCategories] = useState<string[]>([])
  const [universes, setUniverses] = useState<string[]>(POPULAR_UNIVERSES)
  const [isLoading, setIsLoading] = useState(true)

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

  useEffect(() => {
    let count = 0;
    if (filters.categories.length > 0) count += filters.categories.length;
    if (filters.universe.length > 0) count += filters.universe.length;
    if (filters.condition.length > 0) count += filters.condition.length;
    if (filters.foil) count += 1;
    // Price range is not counted to match typical UI behavior or we can count if it differs from default
    if (filters.priceRange[0] > 0 || filters.priceRange[1] < 5000) count += 1;

    setActiveFiltersCount(count);
  }, [filters]);

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      categories: checked ? [...prev.categories, category] : prev.categories.filter((c) => c !== category),
    }))
  }

  const handleUniverseChange = (uni: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      universe: checked ? [...prev.universe, uni] : prev.universe.filter((u) => u !== uni),
    }))
  }

  const handleConditionChange = (cond: string, checked: boolean) => {
    setFilters((prev) => ({
      ...prev,
      condition: checked ? [...prev.condition, cond] : prev.condition.filter((c) => c !== cond),
    }))
  }

  const clearAllFilters = () => {
    setFilters({
      priceRange: [0, 5000],
      categories: [],
      universe: [],
      foil: false,
      condition: [],
    })
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
      <div className="bg-transparent border-0 shadow-none">
        <div className="pb-3">
          <h3 className="text-sm font-semibold text-white">Цена</h3>
        </div>
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">от</span>
              <input
                type="number"
                value={filters.priceRange[0]}
                onChange={(e) => setFilters(prev => ({...prev, priceRange: [Number(e.target.value), prev.priceRange[1]]}))}
                className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-lg py-2 pl-8 pr-3 text-sm text-white outline-none focus:border-primary transition-colors"
              />
            </div>
            <div className="w-2 h-px bg-zinc-800" />
            <div className="flex-1 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500 text-sm">до</span>
              <input
                type="number"
                value={filters.priceRange[1]}
                onChange={(e) => setFilters(prev => ({...prev, priceRange: [prev.priceRange[0], Number(e.target.value)]}))}
                className="w-full bg-transparent border border-zinc-800 hover:border-zinc-700 rounded-lg py-2 pl-8 pr-3 text-sm text-white outline-none focus:border-primary transition-colors"
              />
            </div>
          </div>
          <Slider
            value={filters.priceRange}
            onValueChange={(value) => setFilters((prev) => ({ ...prev, priceRange: value as [number, number] }))}
            max={5000}
            min={0}
            step={100}
            className="w-full [&_[role=slider]]:bg-white [&_[role=slider]]:border-primary [&_[role=slider]]:w-4 [&_[role=slider]]:h-4 [&_.bg-primary]:bg-primary h-[2px] mt-6"
          />
        </div>
      </div>

      <div className="h-px bg-zinc-800/50 w-full" />

      {/* Categories as Chips */}
      <div className="bg-transparent border-0 shadow-none">
        <div className="px-0 pb-3">
          <h3 className="text-sm font-semibold text-white">Категории</h3>
        </div>
        <div className="px-0">
          {isLoading ? (
            <div className="flex flex-wrap gap-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-8 w-20 bg-zinc-800/50 rounded-full animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => {
                const isSelected = filters.categories.includes(category);
                return (
                  <button
                    key={category}
                    onClick={() => handleCategoryChange(category, !isSelected)}
                    className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors border ${
                      isSelected
                        ? 'bg-primary/10 text-primary border-primary/30'
                        : 'bg-transparent text-zinc-400 border-zinc-800 hover:border-zinc-600 hover:text-zinc-300'
                    }`}
                  >
                    {category}
                  </button>
                )
              })}
            </div>
          )}
        </div>
      </div>

      <div className="h-px bg-zinc-800/50 w-full" />

      {/* Universe Filters */}
      {universes.length > 0 && (
        <div className="bg-transparent border-0 shadow-none">
          <div className="px-0 pb-3">
            <h3 className="text-sm font-semibold text-white">Вселенная</h3>
          </div>
          <div className="px-0 space-y-3">
            {universes.map((uni) => (
              <div key={uni} className="flex items-center space-x-2">
                <Checkbox
                  id={`uni-${uni}`}
                  checked={filters.universe.includes(uni)}
                  onCheckedChange={(checked) => handleUniverseChange(uni, checked as boolean)}
                  className="border-zinc-700 data-[state=checked]:bg-primary"
                />
                <label htmlFor={`uni-${uni}`} className="text-sm font-medium text-zinc-300 leading-none cursor-pointer">
                  {uni}
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Foil Toggle */}
      <div className="bg-transparent border-0 shadow-none">
        <div className="flex items-center justify-between">
          <label htmlFor="foil-toggle" className="text-sm font-semibold text-white cursor-pointer">
            Только голограмма (Foil)
          </label>
          <Switch
            id="foil-toggle"
            checked={filters.foil}
            onCheckedChange={(checked) => setFilters(prev => ({...prev, foil: checked}))}
            className="data-[state=checked]:bg-primary"
          />
        </div>
      </div>

      <div className="h-px bg-zinc-800/50 w-full" />

      {/* Condition Filters */}
      <div className="bg-transparent border-0 shadow-none">
        <div className="px-0 pb-3">
          <h3 className="text-sm font-semibold text-white">Состояние</h3>
        </div>
        <div className="px-0 space-y-3">
          {[
            { id: "M", label: "Mint (M)" },
            { id: "NM", label: "Near Mint (NM)" },
            { id: "EX", label: "Excellent (EX)" },
            { id: "GD", label: "Good (GD)" },
          ].map((cond) => (
            <div key={cond.id} className="flex items-center space-x-2">
              <Checkbox
                id={`cond-${cond.id}`}
                checked={filters.condition.includes(cond.id)}
                onCheckedChange={(checked) => handleConditionChange(cond.id, checked as boolean)}
                className="border-zinc-700 data-[state=checked]:bg-primary"
              />
              <label htmlFor={`cond-${cond.id}`} className="text-sm font-medium text-zinc-300 leading-none cursor-pointer">
                {cond.label}
              </label>
            </div>
          ))}
        </div>
      </div>


    </div>
  )
}
