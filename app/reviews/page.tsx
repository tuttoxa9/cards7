"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Star, Quote, Filter, SortAsc, SortDesc } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  startAfter,
  DocumentSnapshot,
} from "firebase/firestore";
import GradualBlur from "@/components/GradualBlur";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  isVisible: boolean;
  createdAt?: any;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "rating_high" | "rating_low">("newest");
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  const REVIEWS_PER_PAGE = 12;

  useEffect(() => {
    loadReviews(true);
  }, [sortBy, filterRating]);

  const loadReviews = async (reset = false) => {
    try {
      if (reset) {
        setLoading(true);
        setReviews([]);
        setLastDoc(null);
        setHasMore(true);
      } else {
        setLoadingMore(true);
      }

      let q = query(
        collection(db, "reviews"),
        where("isVisible", "==", true)
      );

      if (filterRating !== "all") {
        q = query(q, where("rating", "==", filterRating));
      }

      // Сортировка
      switch (sortBy) {
        case "newest":
          q = query(q, orderBy("createdAt", "desc"));
          break;
        case "oldest":
          q = query(q, orderBy("createdAt", "asc"));
          break;
        case "rating_high":
          q = query(q, orderBy("rating", "desc"), orderBy("createdAt", "desc"));
          break;
        case "rating_low":
          q = query(q, orderBy("rating", "asc"), orderBy("createdAt", "desc"));
          break;
      }

      q = query(q, limit(REVIEWS_PER_PAGE));

      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = [];

      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() } as Review);
      });

      if (reset) {
        setReviews(reviewsData);
      } else {
        setReviews(prev => [...prev, ...reviewsData]);
      }

      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === REVIEWS_PER_PAGE);

    } catch (error) {
      console.error("Ошибка загрузки отзывов:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
        }`}
      />
    ));
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return new Intl.DateTimeFormat("ru-RU", {
      year: "numeric",
      month: "long",
      day: "numeric",
    }).format(date);
  };

  const getAverageRating = () => {
    if (reviews.length === 0) return 0;
    const sum = reviews.reduce((acc, review) => acc + review.rating, 0);
    return (sum / reviews.length).toFixed(1);
  };

  const getRatingStats = () => {
    const stats = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    reviews.forEach(review => {
      stats[review.rating as keyof typeof stats]++;
    });
    return stats;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#06080A]">
        <Header />
        <GradualBlur
          preset="page-header"
          strength={2}
          divCount={5}
          height="8rem"
          animated="scroll"
          curve="bezier"
          exponential={true}
          opacity={1}
          zIndex={40}
        />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center text-zinc-400">
            Загрузка отзывов...
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ratingStats = getRatingStats();

  return (
    <div className="min-h-screen bg-[#06080A]">
      <Header />

      <GradualBlur
        preset="page-header"
        strength={2}
        divCount={5}
        height="8rem"
        animated="scroll"
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />

      <main className="container mx-auto px-4 py-16">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4">
            Отзывы клиентов
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Честные отзывы от коллекционеров со всего мира
          </p>

          {reviews.length > 0 && (
            <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
              <div className="flex items-center gap-2">
                <div className="flex items-center">
                  {renderStars(Math.round(Number(getAverageRating())))}
                </div>
                <span className="text-2xl font-bold text-white">
                  {getAverageRating()}
                </span>
                <span className="text-zinc-400">
                  ({reviews.length} {reviews.length === 1 ? "отзыв" : reviews.length < 5 ? "отзыва" : "отзывов"})
                </span>
              </div>
            </div>
          )}
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-zinc-400 text-lg">
              Отзывы пока не добавлены
            </div>
          </div>
        ) : (
          <>
            {/* Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-8 p-6 bg-zinc-900/50 rounded-xl border border-zinc-800">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-zinc-400" />
                <span className="text-zinc-300 font-medium">Фильтры:</span>
              </div>

              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="flex flex-col gap-2">
                  <label className="text-sm text-zinc-400">Сортировка:</label>
                  <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                    <SelectTrigger className="w-full md:w-[200px] bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Сначала новые</SelectItem>
                      <SelectItem value="oldest">Сначала старые</SelectItem>
                      <SelectItem value="rating_high">По рейтингу ↓</SelectItem>
                      <SelectItem value="rating_low">По рейтингу ↑</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-sm text-zinc-400">Рейтинг:</label>
                  <Select
                    value={filterRating.toString()}
                    onValueChange={(value) => setFilterRating(value === "all" ? "all" : Number(value))}
                  >
                    <SelectTrigger className="w-full md:w-[150px] bg-zinc-800 border-zinc-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Все</SelectItem>
                      <SelectItem value="5">5 звёзд</SelectItem>
                      <SelectItem value="4">4 звезды</SelectItem>
                      <SelectItem value="3">3 звезды</SelectItem>
                      <SelectItem value="2">2 звезды</SelectItem>
                      <SelectItem value="1">1 звезда</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Reviews Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {reviews.map((review) => (
                <Card
                  key={review.id}
                  className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border-zinc-700/50 backdrop-blur-sm hover:bg-gradient-to-br hover:from-zinc-800/60 hover:to-zinc-700/40 transition-all duration-300 hover:scale-105 hover:shadow-xl hover:shadow-blue-500/10"
                >
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                          {review.avatar ? (
                            <img
                              src={review.avatar}
                              alt={review.name}
                              className="w-12 h-12 rounded-full object-cover"
                            />
                          ) : (
                            review.name.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white text-lg">
                            {review.name}
                          </h3>
                          <div className="flex items-center space-x-1 mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <div className="text-xs text-zinc-500">
                            {formatDate(review.createdAt)}
                          </div>
                        </div>
                      </div>
                      <Quote className="h-6 w-6 text-zinc-600" />
                    </div>
                    <p className="text-zinc-300 leading-relaxed">
                      {review.text}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center">
                <Button
                  onClick={() => loadReviews(false)}
                  disabled={loadingMore}
                  variant="outline"
                  className="bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500 px-8 py-3"
                >
                  {loadingMore ? "Загрузка..." : "Показать ещё"}
                </Button>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
