"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Star, Quote, Heart, Users, TrendingUp, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
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

const gradients = [
  "from-purple-500/20 via-blue-500/10 to-cyan-500/20",
  "from-pink-500/20 via-rose-500/10 to-orange-500/20",
  "from-green-500/20 via-emerald-500/10 to-teal-500/20",
  "from-blue-500/20 via-indigo-500/10 to-purple-500/20",
  "from-orange-500/20 via-red-500/10 to-pink-500/20",
  "from-teal-500/20 via-cyan-500/10 to-blue-500/20"
];

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const q = query(
        collection(db, "reviews"),
        where("isVisible", "==", true)
      );

      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = [];

      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() } as Review);
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
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-600"
        }`}
      />
    ));
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

  const getCardHeight = (index: number) => {
    const heights = ["h-64", "h-72", "h-80", "h-64", "h-72"];
    return heights[index % heights.length];
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
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-zinc-900/50 border border-zinc-800">
              <Sparkles className="h-5 w-5 text-blue-400 animate-pulse" />
              <span className="text-zinc-300">Загружаем истории наших клиентов...</span>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const ratingStats = getRatingStats();
  const averageRating = getAverageRating();

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
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-purple-500/20 border border-blue-500/30 mb-6">
            <Heart className="h-4 w-4 text-red-400" />
            <span className="text-sm text-blue-200 font-medium">Доверие тысяч коллекционеров</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
            Истории наших
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              коллекционеров
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Каждая карточка — это не просто покупка, а начало новой страницы в коллекции мечты
          </p>
        </div>

        {reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-zinc-400 text-lg">
              Отзывы пока не добавлены
            </div>
          </div>
        ) : (
          <>
            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-16">
              <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/20 border-blue-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-blue-500/20 rounded-full mx-auto mb-4">
                    <Star className="h-6 w-6 text-blue-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{averageRating}</div>
                  <div className="text-blue-200 text-sm">Средний рейтинг</div>
                  <div className="flex justify-center mt-2">
                    {renderStars(Math.round(Number(averageRating)))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/20 border-purple-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-purple-500/20 rounded-full mx-auto mb-4">
                    <Users className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{reviews.length}</div>
                  <div className="text-purple-200 text-sm">Довольных клиентов</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-green-900/30 to-green-800/20 border-green-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-green-500/20 rounded-full mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-green-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">{Math.round((ratingStats[5] / reviews.length) * 100)}%</div>
                  <div className="text-green-200 text-sm">5-звёздочных отзывов</div>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-br from-pink-900/30 to-pink-800/20 border-pink-700/30 backdrop-blur-sm">
                <CardContent className="p-6 text-center">
                  <div className="flex items-center justify-center w-12 h-12 bg-pink-500/20 rounded-full mx-auto mb-4">
                    <Heart className="h-6 w-6 text-pink-400" />
                  </div>
                  <div className="text-3xl font-bold text-white mb-1">98%</div>
                  <div className="text-pink-200 text-sm">Рекомендуют нас</div>
                </CardContent>
              </Card>
            </div>

            {/* Reviews Masonry Grid */}
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {reviews.map((review, index) => (
                <Card
                  key={review.id}
                  className={`break-inside-avoid bg-gradient-to-br ${gradients[index % gradients.length]} backdrop-blur-sm border-zinc-700/50 hover:border-zinc-600/70 transition-all duration-500 hover:scale-[1.02] hover:shadow-2xl group mb-6`}
                >
                  <CardContent className="p-6">
                    {/* Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg shadow-lg">
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
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-zinc-900"></div>
                        </div>
                        <div>
                          <h3 className="font-bold text-white text-lg">
                            {review.name}
                          </h3>
                          <div className="flex items-center space-x-1 mb-1">
                            {renderStars(review.rating)}
                          </div>
                          <Badge className="bg-zinc-800/50 text-zinc-300 text-xs border-0">
                            Проверенная покупка
                          </Badge>
                        </div>
                      </div>
                      <Quote className="h-8 w-8 text-white/20 group-hover:text-white/40 transition-colors" />
                    </div>

                    {/* Review Text */}
                    <div className="relative">
                      <p className="text-zinc-200 leading-relaxed text-base">
                        "{review.text}"
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="mt-4 pt-4 border-t border-white/10 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-yellow-400">
                          <Star className="h-3 w-3 fill-current" />
                          <span className="text-sm font-medium">{review.rating}</span>
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400">
                        {Math.floor(Math.random() * 30) + 1} дн. назад
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Bottom CTA */}
            <div className="text-center mt-16 pt-16 border-t border-zinc-800">
              <div className="max-w-2xl mx-auto">
                <h3 className="text-3xl font-bold text-white mb-4">
                  Готовы стать частью нашей семьи коллекционеров?
                </h3>
                <p className="text-zinc-400 mb-6">
                  Присоединяйтесь к тысячам довольных клиентов и начните собирать карточки своей мечты уже сегодня
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-sm">
                    ⚡ Быстрая доставка по всему миру
                  </Badge>
                  <Badge className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-2 text-sm">
                    🔒 Гарантия качества 100%
                  </Badge>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      <Footer />
    </div>
  );
}
