"use client";

import { useState, useEffect } from "react";
import Masonry from "react-masonry-css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import Link from "next/link";
import { ReviewCard } from "@/components/reviews/ReviewCard";


interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  isApproved: boolean; // Changed from isVisible
  createdAt?: any;
  productId?: string;
  productImageUrl?: string;
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [lastDoc, setLastDoc] = useState<DocumentSnapshot | null>(null);
  const [hasMore, setHasMore] = useState(true);

  const REVIEWS_PER_PAGE = 12;

  useEffect(() => {
    loadReviews(true);
  }, []);

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

      // The spec mentions isApproved, but the old code used isVisible.
      // I'll assume the field is isApproved based on the spec. If this fails, I'll revert to isVisible.
      let q = query(
        collection(db, "reviews"),
        where("isApproved", "==", true),
        orderBy("createdAt", "desc"),
        limit(REVIEWS_PER_PAGE)
      );

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

  const breakpointColumnsObj = {
    default: 3,
    1100: 2,
    700: 1
  };

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
            Отзывы наших коллекционеров
          </h1>
          <p className="text-lg md:text-xl text-zinc-400 max-w-2xl mx-auto mb-8">
            Зал славы наших лучших отзывов.
          </p>
        </div>

        {reviews.length === 0 && !loading ? (
          <div className="text-center py-20">
            <div className="text-zinc-400 text-lg">
              Отзывы пока не добавлены
            </div>
          </div>
        ) : (
          <>
            <style>{`
              .my-masonry-grid {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                margin-left: -30px; /* gutter size offset */
                width: auto;
              }
              .my-masonry-grid_column {
                padding-left: 30px; /* gutter size */
                background-clip: padding-box;
              }
            `}</style>
            <Masonry
              breakpointCols={breakpointColumnsObj}
              className="my-masonry-grid"
              columnClassName="my-masonry-grid_column"
            >
              {reviews.map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </Masonry>

            {/* Load More Button */}
            {hasMore && (
              <div className="text-center mt-8">
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