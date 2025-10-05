"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import GradualBlur from "@/components/GradualBlur";
import { ReviewCard } from "@/components/reviews/ReviewCard"; // Импортируем новую карточку

// Обновленный интерфейс, теперь включая createdAt для передачи в компонент
interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  createdAt?: any; // Добавляем поле для даты
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showReviews, setShowReviews] = useState(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        const q = query(
          collection(db, "reviews"),
          where("isVisible", "==", true)
        );
        const querySnapshot = await getDocs(q);
        const reviewsData: Review[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        } as Review));

        // Сортировка по дате, если она есть
        reviewsData.sort((a: any, b: any) =>
          b.createdAt?.toMillis() - a.createdAt?.toMillis()
        );

        setReviews(reviewsData);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
      } finally {
        setLoading(false);
        // Запускаем анимацию появления карточек
        setTimeout(() => setShowReviews(true), 100);
      }
    };

    loadReviews();
  }, []);

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
            Истории наших{" "}
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              коллекционеров
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-zinc-400 max-w-3xl mx-auto mb-8 leading-relaxed">
            Каждая карточка — это не просто покупка, а начало новой страницы в коллекции мечты
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="spinner center">
              {[...Array(12)].map((_, i) => <div key={i} className="spinner-blade"></div>)}
            </div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-zinc-400 text-lg">
              Отзывы пока не добавлены
            </div>
          </div>
        ) : (
          <>
            {/* Обновленная сетка с новым компонентом ReviewCard */}
            <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
              {reviews.map((review, index) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  className={`transition-all duration-500 ${
                    showReviews
                      ? 'opacity-100 translate-y-0'
                      : 'opacity-0 translate-y-8'
                  }`}
                  style={{
                    transitionDelay: `${index * 80}ms`
                  }}
                />
              ))}
            </div>

            {/* Bottom CTA */}
            <div className={`text-center mt-16 pt-16 border-t border-zinc-800 transition-all duration-700 ${
              showReviews
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-8'
            }`}
            style={{
              transitionDelay: `${reviews.length * 80 + 200}ms`
            }}>
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
