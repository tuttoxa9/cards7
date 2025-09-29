"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import { ReviewCard, Review } from "@/components/reviews/review-card";

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState<"newest" | "rating_high">("newest");
  const [filterRating, setFilterRating] = useState<number | "all">("all");

  const REVIEWS_PER_PAGE = 9;

  useEffect(() => {
    fetchReviews(true);
  }, [sortBy, filterRating]);

  const fetchReviews = async (reset = false) => {
    if (reset) {
      setLoading(true);
      setReviews([]);
      setLastDoc(null);
    } else {
      setLoadingMore(true);
    }

    try {
      let q = query(collection(db, "reviews"), where("isVisible", "==", true));

      if (filterRating !== "all") {
        q = query(q, where("rating", "==", filterRating));
      }

      if (sortBy === "newest") {
        q = query(q, orderBy("createdAt", "desc"));
      } else if (sortBy === "rating_high") {
        q = query(q, orderBy("rating", "desc"), orderBy("createdAt", "desc"));
      }

      q = query(q, limit(REVIEWS_PER_PAGE));

      if (!reset && lastDoc) {
        q = query(q, startAfter(lastDoc));
      }

      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Review));

      setReviews(prev => (reset ? reviewsData : [...prev, ...reviewsData]));
      setLastDoc(querySnapshot.docs[querySnapshot.docs.length - 1] || null);
      setHasMore(querySnapshot.docs.length === REVIEWS_PER_PAGE);
    } catch (error) {
      console.error("Ошибка загрузки отзывов:", error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-900 text-white">
      <Header />
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-10">
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 mb-2">
            Отзывы наших клиентов
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Что говорят о нас те, кто уже получил свои заказы.
          </p>
        </div>

        <div className="mb-8 p-4 bg-zinc-800/30 border border-zinc-700 rounded-lg">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-2 text-zinc-300">
              <Filter className="h-5 w-5" />
              <span className="font-medium">Фильтры и сортировка</span>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                <SelectTrigger className="w-full sm:w-[180px] bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="newest">Сначала новые</SelectItem>
                  <SelectItem value="rating_high">Высокий рейтинг</SelectItem>
                </SelectContent>
              </Select>
              <Select
                value={filterRating.toString()}
                onValueChange={(value) => setFilterRating(value === "all" ? "all" : Number(value))}
              >
                <SelectTrigger className="w-full sm:w-[160px] bg-zinc-800 border-zinc-700">
                  <SelectValue placeholder="Рейтинг" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Все оценки</SelectItem>
                  <SelectItem value="5">★★★★★</SelectItem>
                  <SelectItem value="4">★★★★☆</SelectItem>
                  <SelectItem value="3">★★★☆☆</SelectItem>
                  <SelectItem value="2">★★☆☆☆</SelectItem>
                  <SelectItem value="1">★☆☆☆☆</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading && reviews.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-zinc-800/40 rounded-xl p-6 h-64 animate-pulse"></div>
            ))}
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
            {hasMore && (
              <div className="text-center mt-12">
                <Button
                  onClick={() => fetchReviews(false)}
                  disabled={loadingMore}
                  variant="outline"
                  className="bg-zinc-800 border-zinc-700 text-zinc-300 hover:bg-zinc-700 hover:text-white px-8 py-3"
                >
                  {loadingMore ? "Загрузка..." : "Показать ещё"}
                </Button>
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-16">
            <p className="text-xl text-zinc-500">По вашему запросу отзывы не найдены.</p>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}