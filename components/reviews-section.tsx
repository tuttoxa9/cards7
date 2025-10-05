"use client";

import { useState, useEffect } from "react";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
} from "firebase/firestore";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  isVisible: boolean;
  createdAt?: any;
}

export function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("isVisible", "==", true),
        limit(20)
      );
      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        reviewsData.push({
          id: doc.id,
          name: data.name,
          rating: data.rating,
          text: data.text,
          avatar: data.avatar,
          isVisible: data.isVisible,
          createdAt: data.createdAt
        } as Review);
      });
      setReviews(reviewsData);
    } catch (error) {
      console.error("Ошибка загрузки отзывов:", error);
    } finally {
      setLoading(false);
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

  const displayedReviews = showAll ? reviews : reviews.slice(0, 6);

  if (loading) {
    return (
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="text-zinc-400">Загрузка отзывов...</div>
          </div>
        </div>
      </section>
    );
  }

  if (reviews.length === 0) {
    return null;
  }

  return (
    <section className="py-16 md:py-24 relative">
      {/* Background image with overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-transparent">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-30"
          style={{
            backgroundImage: "url('/spidyandhalkk.png')",
            maskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
            WebkitMaskImage: "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)"
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/40" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4">
            Отзывы наших клиентов
          </h2>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto">
            Узнайте, что говорят о нас коллекционеры со всего мира
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {displayedReviews.map((review) => (
            <Card
              key={review.id}
              className="group cursor-pointer bg-transparent border-2 border-transparent hover:border-primary/70 transition-all duration-300 overflow-hidden rounded-3xl h-80 relative"
            >
              <div className="relative w-full h-full overflow-hidden rounded-3xl bg-gradient-to-br from-zinc-900/80 via-zinc-800/60 to-zinc-700/40 backdrop-blur-sm">

                {/* Background pattern/gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-transparent" />

                {/* Content */}
                <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between">
                  {/* Header with user info */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-xl border-2 border-white/20">
                        {review.avatar ? (
                          <img
                            src={review.avatar}
                            alt={review.name}
                            className="w-14 h-14 rounded-full object-cover"
                          />
                        ) : (
                          review.name.charAt(0).toUpperCase()
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-white text-lg">
                          {review.name}
                        </h3>
                        <div className="flex items-center space-x-1 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                    <Quote className="h-8 w-8 text-white/30" />
                  </div>

                  {/* Review text */}
                  <div className="flex-1 flex items-center">
                    <p className="text-zinc-200 leading-relaxed text-sm font-medium">
                      "{review.text}"
                    </p>
                  </div>

                  {/* Bottom decoration */}
                  <div className="mt-4 pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <Badge className="bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white text-xs px-3 py-1 rounded-full border border-white/20">
                        ⭐ {review.rating}/5
                      </Badge>
                      <div className="text-xs text-zinc-400">
                        Проверенный отзыв
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Hover glow effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl" />
              </div>
            </Card>
          ))}
        </div>

        {reviews.length > 6 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => setShowAll(!showAll)}
              variant="outline"
              className="bg-transparent border-zinc-600 text-zinc-300 hover:bg-zinc-800 hover:text-white hover:border-zinc-500 px-8 py-3"
            >
              {showAll ? "Показать меньше" : `Показать все ${reviews.length} отзывов`}
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
