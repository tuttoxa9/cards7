"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

// --- Вспомогательный компонент для отображения звезд ---
function StarRating({ rating }: { rating: number }) {
  const totalStars = 5;
  return (
    <div className="flex items-center">
      {[...Array(totalStars)].map((_, i) => (
        <svg
          key={i}
          className={`w-4 h-4 ${i < rating ? "text-yellow-400" : "text-gray-500"}`}
          fill="currentColor"
          viewBox="0 0 20 20"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.368-2.448a1 1 0 00-1.176 0l-3.368 2.448c-.784.57-1.838-.197-1.539-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.05 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z" />
        </svg>
      ))}
    </div>
  );
}

// --- Типы данных ---
type ReviewStatus = "Опубликован" | "Ожидает модерации" | "Отклонен";

interface Review {
  id: string;
  authorName: string;
  authorEmail: string;
  authorAvatar?: string;
  rating: number;
  text: string;
  createdAt: any; // Firestore timestamp
  status: ReviewStatus;
}

// --- Основной компонент ---
export function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const reviewsQuerySnapshot = await getDocs(collection(db, "reviews"));
        const reviewsData: Review[] = reviewsQuerySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(), // Конвертируем Timestamp в Date
          } as Review;
        });
        // Сортируем по дате, новые вверху
        reviewsData.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setReviews(reviewsData);
      } catch (error) {
        console.error("Ошибка загрузки отзывов:", error);
        toast.error("Не удалось загрузить отзывы");
      } finally {
        setIsLoading(false);
      }
    };

    loadReviews();
  }, []);

  const getStatusBadgeVariant = (status: ReviewStatus) => {
    switch (status) {
      case "Опубликован":
        return "default"; // Зеленый
      case "Ожидает модерации":
        return "secondary"; // Желтый/Серый
      case "Отклонен":
        return "destructive"; // Красный
      default:
        return "outline";
    }
  };

  const getStatusBadgeClassName = (status: ReviewStatus) => {
     switch (status) {
      case "Опубликован":
        return "bg-green-600/80 border-green-600";
      case "Ожидает модерации":
        return "bg-yellow-500/80 border-yellow-500 text-yellow-950";
      case "Отклонен":
        return "bg-red-600/80 border-red-600";
      default:
        return "";
    }
  }

  if (isLoading) {
    return (
       <div className="space-y-4">
        {[...Array(7)].map((_, i) => (
          <Skeleton key={i} className="h-16 w-full bg-zinc-700" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
       <h2 className="text-2xl font-bold text-white">Управление отзывами</h2>
      <div className="rounded-lg border border-zinc-700 bg-[#18181B]/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b-zinc-700 hover:bg-transparent">
              <TableHead className="w-[150px] text-zinc-300 px-4 py-3">Статус</TableHead>
              <TableHead className="min-w-[200px] text-zinc-300 px-4 py-3">Автор</TableHead>
              <TableHead className="w-[120px] text-zinc-300 px-4 py-3">Рейтинг</TableHead>
              <TableHead className="text-zinc-300 px-4 py-3">Отзыв</TableHead>
              <TableHead className="w-[180px] text-zinc-300 px-4 py-3">Дата</TableHead>
              <TableHead className="w-[80px] text-right text-zinc-300 px-4 py-3">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review.id} className="border-zinc-800 hover:bg-[#27272A]/50">
                <TableCell className="px-4 py-3">
                  <Badge variant={getStatusBadgeVariant(review.status)} className={getStatusBadgeClassName(review.status)}>
                    {review.status}
                  </Badge>
                </TableCell>
                <TableCell className="px-4 py-3 font-medium text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={review.authorAvatar} alt={review.authorName} />
                      <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{review.authorName}</div>
                      <div className="text-xs text-zinc-400">{review.authorEmail}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StarRating rating={review.rating} />
                </TableCell>
                <TableCell className="px-4 py-3 text-zinc-300">
                  <p className="truncate max-w-sm">{review.text}</p>
                </TableCell>
                <TableCell className="px-4 py-3 text-zinc-400">
                  {new Date(review.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-700">
                    <span className="sr-only">Открыть меню</span>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
       {reviews.length === 0 && !isLoading && (
        <div className="text-center text-zinc-400 py-20">
          Отзывов пока нет.
        </div>
      )}
    </div>
  );
}