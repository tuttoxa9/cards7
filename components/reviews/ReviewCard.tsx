"use client";

import { Star, Quote } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDistanceToNow } from 'date-fns';
import { ru } from 'date-fns/locale';

// Обновленный тип, чтобы включить дату
interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  createdAt?: any; // Firestore Timestamp
}

interface ReviewCardProps {
  review: Review;
  className?: string;
  style?: React.CSSProperties;
}

// Функция для отрисовки звезд рейтинга (без изменений)
const renderStars = (rating: number) => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`h-4 w-4 ${
        i < rating ? "fill-yellow-400 text-yellow-400" : "text-zinc-500"
      }`}
    />
  ));
};

// Функция для форматирования даты
const formatDate = (date: any) => {
  if (!date) return null;
  // Firestore Timestamps нужно конвертировать в JS Date
  const jsDate = date.toDate ? date.toDate() : new Date(date);
  return formatDistanceToNow(jsDate, { addSuffix: true, locale: ru });
};

export function ReviewCard({ review, className, style }: ReviewCardProps) {
  const timeAgo = formatDate(review.createdAt);

  return (
    <Card
      className={`break-inside-avoid bg-zinc-900/50 border border-zinc-800/80 backdrop-blur-sm transition-all duration-300 hover:border-zinc-700 hover:shadow-2xl hover:shadow-purple-500/10 group ${className}`}
      style={style}
    >
      <CardContent className="p-6">
        {/* Хедер карточки: Аватар, Имя, Рейтинг */}
        <div className="flex items-start justify-between mb-5">
          <div className="flex items-center space-x-4">
            <Avatar className="w-14 h-14 border-2 border-zinc-700/80 group-hover:border-purple-500/60 transition-colors">
              <AvatarImage src={review.avatar} alt={review.name} className="object-cover" />
              <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold text-lg">
                {review.name.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-bold text-white text-lg leading-tight">
                {review.name}
              </h3>
              <div className="flex items-center mt-1">
                {renderStars(review.rating)}
              </div>
            </div>
          </div>
          <Quote className="h-10 w-10 text-zinc-700/80 group-hover:text-purple-400/50 transition-colors" />
        </div>

        {/* Текст отзыва */}
        <div className="relative">
          <p className="text-zinc-300 leading-relaxed text-base">
            {review.text}
          </p>
        </div>

        {/* Футер карточки: значок и дата */}
        <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between">
          <Badge className="bg-green-800/30 text-green-300 border-green-500/30 text-xs font-medium">
            Проверенный покупатель
          </Badge>
          {timeAgo && (
            <div className="text-xs text-zinc-500">
              {timeAgo}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}