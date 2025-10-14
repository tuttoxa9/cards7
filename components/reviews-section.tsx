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
              className="group cursor-pointer glass-strong border-white/10 hover-glow-purple transition-all duration-300 overflow-hidden rounded-2xl h-80 relative hover:scale-[1.02]"
            >
              <div className="relative w-full h-full overflow-hidden rounded-2xl">

                {/* Large decorative quote in background */}
                <Quote className="absolute top-4 right-4 h-32 w-32 text-white/5 z-0" />

                {/* Content */}
                <CardContent className="relative z-10 p-6 h-full flex flex-col justify-between">
                  {/* Header with user info */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-purple-700 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg border-2 border-purple-400/30 flex-shrink-0">
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
                        <h3 className="font-bold text-white text-base">
                          {review.name}
                        </h3>
                        <div className="flex items-center gap-0.5 mt-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Review text */}
                  <div className="flex-1 flex items-center my-4">
                    <p className="text-gray-200 leading-relaxed text-sm font-normal italic">
                      "{review.text}"
                    </p>
                  </div>

                  {/* Bottom decoration */}
                  <div className="mt-auto pt-4 border-t border-white/10">
                    <div className="flex justify-between items-center">
                      <Badge className="bg-gradient-to-r from-purple-600 to-purple-500 text-white text-xs px-3 py-1.5 rounded-full border border-purple-400/30 shadow-lg font-semibold">
                        ⭐ {review.rating}/5
                      </Badge>
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-gray-300 font-medium">
                          Проверено
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>

                {/* Hover gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl pointer-events-none" />
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
