import { Card, CardContent } from "@/components/ui/card";
import { Star, Quote } from "lucide-react";

// Определяем тип для отзыва, чтобы компонент знал, какие данные ожидать.
export interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  isVisible: boolean; // Добавил это поле, так как оно есть в page.tsx
  createdAt?: any;
}

interface ReviewCardProps {
  review: Review;
}

// Вспомогательная функция для отрисовки звезд рейтинга.
const renderStars = (rating: number) => {
  return [...Array(5)].map((_, i) => (
    <Star
      key={i}
      className={`h-5 w-5 ${
        i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-600"
      }`}
    />
  ));
};

// Вспомогательная функция для форматирования даты.
const formatDate = (timestamp: any) => {
  if (!timestamp) return "";
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  return new Intl.DateTimeFormat("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
};

// Основной экспорт компонента карточки отзыва.
export function ReviewCard({ review }: ReviewCardProps) {
  return (
    <Card
      className="bg-zinc-800/40 backdrop-blur-lg border border-zinc-700 rounded-xl h-full flex flex-col transition-all duration-300 hover:scale-[1.02] hover:border-zinc-500 hover:shadow-lg hover:shadow-blue-600/10"
    >
      <CardContent className="p-6 flex flex-col flex-grow">
        <div className="flex items-center space-x-4 mb-4">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold text-lg flex-shrink-0">
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
            <h3 className="font-semibold text-white text-lg">{review.name}</h3>
            <div className="flex items-center space-x-1">{renderStars(review.rating)}</div>
          </div>
        </div>

        <div className="flex-grow mb-4">
          <p className="text-zinc-200 text-base leading-relaxed italic">
            <Quote className="inline-block h-5 w-5 -mt-1 mr-2 text-zinc-600 transform scale-x-[-1]" />
            {review.text}
          </p>
        </div>

        <div className="text-right text-xs text-zinc-400 pt-4 mt-auto border-t border-zinc-800">
          {formatDate(review.createdAt)}
        </div>
      </CardContent>
    </Card>
  );
}