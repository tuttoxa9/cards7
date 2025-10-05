"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Quote } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  isApproved: boolean;
  createdAt?: any;
  productId?: string;
  productImageUrl?: string;
}

export const ReviewCard = ({ review }: { review: Review }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const TEXT_LIMIT = 150;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

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

  return (
    <Card
      className="bg-gradient-to-br from-zinc-900/50 to-zinc-800/30 border-zinc-700/50 backdrop-blur-sm transition-all duration-300 mb-6"
    >
      <CardContent className="p-6">
        {review.productImageUrl && review.productId && (
           <Link href={`/product/${review.productId}`} className="block mb-4">
            <img
              src={review.productImageUrl}
              alt="Product"
              className="rounded-lg w-full object-cover aspect-square transition-transform duration-300 hover:scale-105"
            />
          </Link>
        )}
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
          {review.text.length > TEXT_LIMIT && !isExpanded
            ? `${review.text.substring(0, TEXT_LIMIT)}...`
            : review.text}
        </p>
        {review.text.length > TEXT_LIMIT && (
          <Button
            onClick={toggleExpanded}
            variant="link"
            className="text-blue-400 px-0 pt-2"
          >
            {isExpanded ? "Свернуть" : "Показать полностью"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};