"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
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
      setLoading(false);
    } catch (error) {
      console.error("Ошибка загрузки отзывов:", error);
      setLoading(false);
    }
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "text-[#FBBF24] fill-[#FBBF24]" : "text-zinc-600"
        }`}
      />
    ));
  };

  return (
    <div className="min-h-screen bg-zinc-950">
      <Header />
      <GradualBlur
        preset="page-header"
        strength={2}
        divCount={5}
        height="8rem"
        animated={false}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />
      <main className="container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Отзывы наших клиентов
          </h1>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
            Что говорят о нас наши покупатели.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : reviews.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg">
              Отзывов пока нет.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card
                key={review.id}
                className="bg-[#1C1C24] border-0 rounded-[12px] shadow-none"
              >
                <CardContent className="p-6">
                  <div className="flex items-center mb-5">
                    <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center text-xl font-bold text-zinc-400">
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
                    <div className="ml-4 flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-[600] text-base text-white">
                          {review.name}
                        </h3>
                        <div className="flex items-center text-green-500 gap-1 bg-green-500/10 px-1.5 py-0.5 rounded text-[10px] font-medium tracking-wide">
                          <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-check"><path d="M20 6 9 17l-5-5"/></svg>
                          Проверенный
                        </div>
                      </div>
                      <div className="flex mt-1.5 gap-0.5">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <p className="text-[#9CA3AF] leading-[1.5] text-[15px]">
                    {review.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}