"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Heart, ShoppingCart, Star, Grid3X3, List, ChevronLeft, ChevronRight, Loader2 } from "lucide-react"
import Link from "next/link"
import { collection, getDocs, query, where, limit, startAfter, orderBy, QueryConstraint, DocumentData } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useCart } from "@/lib/cart-context"
import { toast } from "sonner"

interface CardData {
  id: string;
  title: string;
  image?: string;
  imageUrl?: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rating?: number;
  reviews?: number;
  category: string;
  rarity?: string;
  inStock: boolean;
  isHot: boolean;
  tag?: string;
}

interface FilterState {
  priceRange: [number, number]
  categories: string[]
  universe: string[]
  foil: boolean
  condition: string[]
}

interface CatalogGridProps {
  filters: FilterState;
  onCardsCountChange?: (count: number) => void;
}

export function CatalogGrid({ filters, onCardsCountChange }: CatalogGridProps) {
  const [cards, setCards] = useState<CardData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState("popular")
  const [lastDoc, setLastDoc] = useState<DocumentData | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const ITEMS_PER_PAGE = 12;
  const { addToCart } = useCart()

  const buildQueryConstraints = (isLoadMore: boolean = false) => {
    const constraints: QueryConstraint[] = [];

    // --- Firestore Multiple 'in' Restriction Handling ---
    // Firestore only allows one `in`, `not-in`, or `array-contains-any` clause per query.
    // If we have multiple array filters active (e.g. categories AND universe), we can only push one to the DB query.
    // To ensure the DB returns EXACTLY ITEMS_PER_PAGE and we don't break pagination by filtering on the client,
    // we must only use ONE array filter in the query and disable the others, or redesign the schema (e.g. combined tags).
    // For this MVP, we prioritize `categories`, then `universe`, then `condition`.
    // Any secondary array filters will be IGNORED in the query to guarantee correct page sizes and `hasMore` states.

    let hasArrayFilter = false;

    if (filters.categories.length > 0) {
      constraints.push(where("category", "in", filters.categories));
      hasArrayFilter = true;
    }

    if (filters.universe.length > 0 && !hasArrayFilter) {
      constraints.push(where("universe", "in", filters.universe));
      hasArrayFilter = true;
    }

    if (filters.condition.length > 0 && !hasArrayFilter) {
      constraints.push(where("condition", "in", filters.condition));
      hasArrayFilter = true;
    }

    if (filters.foil) {
      constraints.push(where("foil", "==", true));
    }

    // Price range
    constraints.push(where("price", ">=", filters.priceRange[0]));
    constraints.push(where("price", "<=", filters.priceRange[1]));

    // Sorting
    // Note: To sort by a field, you must also filter on that field (or have a composite index).
    // Price sorting is safe since we have price filters.
    if (sortBy === "price-asc") {
      constraints.push(orderBy("price", "asc"));
    } else if (sortBy === "price-desc") {
      constraints.push(orderBy("price", "desc"));
    } else {
      // fallback for 'popular' or default (needs proper index setup)
      // for now, default to price asc since we have price filters active
      constraints.push(orderBy("price", "asc"));
    }

    if (isLoadMore && lastDoc) {
      constraints.push(startAfter(lastDoc));
    }

    constraints.push(limit(ITEMS_PER_PAGE));
    return constraints;
  };

  // Загрузка первой страницы карточек
  useEffect(() => {
    const loadInitialCards = async () => {
      try {
        setIsLoading(true);
        const constraints = buildQueryConstraints();
        const q = query(collection(db, "cards"), ...constraints);
        const querySnapshot = await getDocs(q);

        const cardsData: CardData[] = [];
        querySnapshot.forEach((doc) => {
          cardsData.push({ id: doc.id, ...doc.data() } as CardData);
        });

        setCards(cardsData);
        setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
        setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
        onCardsCountChange?.(cardsData.length); // Note: This now represents loaded count, not total count
      } catch (error) {
        console.error("Ошибка загрузки карточек:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadInitialCards();
  }, [filters, sortBy]); // Перезагружаем при смене фильтров или сортировки

  const loadMore = async () => {
    if (!hasMore || isLoadingMore) return;
    try {
      setIsLoadingMore(true);
      const constraints = buildQueryConstraints(true);
      const q = query(collection(db, "cards"), ...constraints);
      const querySnapshot = await getDocs(q);

      const newCardsData: CardData[] = [];
      querySnapshot.forEach((doc) => {
        newCardsData.push({ id: doc.id, ...doc.data() } as CardData);
      });

      setCards(prev => {
        const updated = [...prev, ...newCardsData];
        onCardsCountChange?.(updated.length);
        return updated;
      });
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === ITEMS_PER_PAGE);
    } catch (error) {
      console.error("Ошибка при дозагрузке карточек:", error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  return (
    <div className="flex-1 space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-muted-foreground">Найдено {cards.length} карточек</span>
          <div className="flex items-center space-x-2">
            <Button variant={viewMode === "grid" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("grid")}>
              <Grid3X3 className="w-4 h-4" />
            </Button>
            <Button variant={viewMode === "list" ? "default" : "ghost"} size="sm" onClick={() => setViewMode("list")}>
              <List className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48 bg-card border-border">
              <SelectValue placeholder="Сортировать по" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Популярности</SelectItem>
              <SelectItem value="price-asc">Цене: по возрастанию</SelectItem>
              <SelectItem value="price-desc">Цене: по убыванию</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="spinner center">
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
            <div className="spinner-blade"></div>
          </div>
        </div>
      ) : (
        <>
          {/* Cards Grid */}
          <div
            className={`grid gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}
          >
            {cards.map((card) => (
              <Link key={card.id} href={`/card/${card.id}`} className="block h-full group">
                <div className="flex flex-col h-full bg-transparent">
                  {/* Image Container (Transparent) */}
                  <div className="relative aspect-[4/5] w-full p-4 flex items-center justify-center">
                    <img
                      src={card.imageUrl || card.image || "/placeholder.svg"}
                      alt={card.title}
                      className="max-w-full max-h-full object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                      style={{ filter: 'drop-shadow(0 15px 15px rgb(0 0 0 / 0.5))' }}
                    />

                    {/* Single Clean Badge */}
                    <div className="absolute top-2 left-2 flex flex-col gap-2 z-10">
                      {card.isHot ? (
                        <Badge className="bg-gray-800 text-white text-[10px] px-2 py-0.5 rounded-md border-0 font-medium tracking-wide">
                          ХИТ ПРОДАЖ
                        </Badge>
                      ) : !card.inStock ? (
                        <Badge className="bg-zinc-900 text-zinc-500 text-[10px] px-2 py-0.5 rounded-md border border-zinc-800 font-medium">
                          НЕТ В НАЛИЧИИ
                        </Badge>
                      ) : card.tag ? (
                        <Badge className="bg-gray-800 text-zinc-300 text-[10px] px-2 py-0.5 rounded-md border-0 font-medium">
                          {card.tag}
                        </Badge>
                      ) : null}
                    </div>

                    {/* Floating Add to Cart Button */}
                    {card.inStock && (
                      <div className="absolute bottom-4 right-4 z-20">
                        <Button
                          size="icon"
                          className="h-10 w-10 rounded-full bg-primary/90 text-white shadow-lg shadow-black/50 hover:bg-primary transition-all opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0"
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart({
                              id: card.id,
                              title: card.title,
                              price: card.price,
                              image: card.imageUrl || card.image || "/placeholder.svg",
                              quantity: 1,
                              originalPrice: card.originalPrice,
                              discount: card.discount,
                            });
                            toast.success(`${card.title} добавлен в корзину`);
                          }}
                        >
                          <ShoppingCart className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Content Container (Directly below image, no boxes) */}
                  <div className="mt-4 flex flex-col flex-1 gap-1">
                    <p className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                      {card.category}
                    </p>
                    <h3 className="font-semibold text-white text-lg line-clamp-2 leading-tight group-hover:text-primary transition-colors">
                      {card.title}
                    </h3>

                    <div className="flex items-end gap-2 mt-auto pt-1">
                      <span className="text-xl font-bold text-white tracking-tight">
                        {card.price.toLocaleString()} <span className="text-sm text-zinc-500 font-medium">BYN</span>
                      </span>
                      {card.originalPrice && (
                        <span className="text-xs text-zinc-500 line-through decoration-zinc-600 mb-1">
                          {card.originalPrice.toLocaleString()} BYN
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Empty State */}
          {cards.length === 0 && (
            <div className="text-center text-muted-foreground py-20">
              По заданным фильтрам карточек не найдено.
            </div>
          )}

          {/* Load More Button */}
          {hasMore && cards.length > 0 && (
            <div className="flex justify-center pt-8">
              <Button
                variant="outline"
                size="lg"
                onClick={loadMore}
                disabled={isLoadingMore}
                className="bg-transparent border-zinc-700 text-white hover:bg-zinc-800"
              >
                {isLoadingMore ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Загрузка...
                  </>
                ) : (
                  "Показать еще"
                )}
              </Button>
            </div>
          )}
        </>
      )}

    </div>
  )
}
