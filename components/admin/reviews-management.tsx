"use client";

import { useState, useEffect } from "react";
import { User } from "firebase/auth";
import { collection, getDocs, doc, updateDoc, addDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { logActivity } from "@/lib/activity-logger";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Edit, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDrawer } from "@/hooks/use-drawer";
import { ReviewForm } from "./review-form";
import { DrawerCardActions } from "./drawer-card-actions";

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
interface Review {
  id: string;
  authorName: string;
  authorAvatar?: string;
  rating: number;
  text: string;
  createdAt: any; // Firestore timestamp
  status: "Опубликован"; // Статус теперь всегда такой
}

interface ReviewsManagementProps {
  user: User;
}

// --- Основной компонент ---
export function ReviewsManagement({ user }: ReviewsManagementProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openDrawer, closeDrawer } = useDrawer();

  const loadReviews = async () => {
    try {
      setIsLoading(true);
      const reviewsQuerySnapshot = await getDocs(collection(db, "reviews"));
      const reviewsData: Review[] = reviewsQuerySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          authorName: data.name || data.authorName,
          authorAvatar: data.avatar || data.authorAvatar,
          rating: data.rating,
          text: data.text,
          createdAt: data.createdAt?.toDate(), // Конвертируем Timestamp в Date
          status: data.status || "Опубликован",
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

  useEffect(() => {
    loadReviews();
  }, []);

  const handleSave = async (data: any, reviewId?: string) => {
    try {
      if (reviewId) {
        // Обновление
        const originalReview = reviews.find(r => r.id === reviewId);
        await updateDoc(doc(db, "reviews", reviewId), {
          name: data.authorName,
          avatar: data.authorAvatar,
          rating: data.rating,
          text: data.text,
          isVisible: true,
        });
        toast.success("Отзыв успешно обновлен");

        await logActivity({
          userId: user.uid,
          userName: user.email || "Неизвестный",
          actionType: "UPDATE",
          entityType: "Отзыв",
          entityId: reviewId,
          description: `Обновил отзыв от "${data.authorName}".`,
        });

      } else {
        // Создание
        const docRef = await addDoc(collection(db, "reviews"), {
          name: data.authorName,
          avatar: data.authorAvatar,
          rating: data.rating,
          text: data.text,
          isVisible: true,
          status: "Опубликован",
          createdAt: new Date(),
        });
        toast.success("Отзыв успешно добавлен");

        await logActivity({
          userId: user.uid,
          userName: user.email || "Неизвестный",
          actionType: "CREATE",
          entityType: "Отзыв",
          entityId: docRef.id,
          description: `Создал новый отзыв от "${data.authorName}".`,
        });
      }
      closeDrawer();
      loadReviews(); // Перезагружаем список в обоих случаях
    } catch (error) {
      console.error("Ошибка сохранения отзыва:", error);
      toast.error("Не удалось сохранить отзыв");
    }
  };

  const handleEdit = (review: Review) => {
    openDrawer(
      ReviewForm,
      {
        editingReview: {
          authorName: review.authorName,
          authorAvatar: review.authorAvatar || "",
          rating: review.rating,
          text: review.text
        },
        onSave: (data: any) => handleSave(data, review.id),
        onCancel: closeDrawer
      },
      { size: "wide", title: "Редактирование отзыва" }
    );
  };

  const handleDelete = async (reviewId: string) => {
    const reviewToDelete = reviews.find(r => r.id === reviewId);
    if (!reviewToDelete) {
      toast.error("Отзыв для удаления не найден.");
      return;
    }
    try {
      await deleteDoc(doc(db, "reviews", reviewId));
      toast.success("Отзыв удален");

      await logActivity({
        userId: user.uid,
        userName: user.email || "Неизвестный",
        actionType: "DELETE",
        entityType: "Отзыв",
        entityId: reviewId,
        description: `Удалил отзыв от "${reviewToDelete.authorName}".`,
      });

      closeDrawer();
      loadReviews();
    } catch (error) {
      console.error("Ошибка удаления отзыва:", error);
      toast.error("Не удалось удалить отзыв");
    }
  };

  const openDeleteConfirmation = (review: Review) => {
    openDrawer(
      () => (
        <div className="text-center space-y-4">
          <p>Вы уверены, что хотите удалить отзыв от <span className="font-bold">{review.authorName}</span>?</p>
          <div className="flex justify-center gap-3">
            <Button variant="outline" onClick={() => openActionsDrawer(review)}>Отмена</Button>
            <Button variant="destructive" onClick={() => handleDelete(review.id)}>Удалить</Button>
          </div>
        </div>
      ),
      {},
      { size: "default", title: "Подтверждение удаления" }
    );
  };

  const openActionsDrawer = (review: Review) => {
    openDrawer(
      DrawerCardActions,
      {
        onEdit: () => handleEdit(review),
        onDelete: () => openDeleteConfirmation(review),
      },
      { size: "default", title: `Действия с отзывом` }
    );
  };

  const openAddForm = () => {
    openDrawer(
      ReviewForm,
      { onSave: handleSave, onCancel: closeDrawer },
      { size: "wide", title: "Добавить новый отзыв" }
    );
  };


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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Управление отзывами</h2>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить отзыв
        </Button>
      </div>
      <div className="rounded-lg border border-zinc-700 bg-[#18181B]/50">
        <Table>
          <TableHeader>
            <TableRow className="border-b-zinc-700 hover:bg-transparent">
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
                <TableCell className="px-4 py-3 font-medium text-white">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={review.authorAvatar} alt={review.authorName} />
                      <AvatarFallback>{review.authorName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div>{review.authorName}</div>
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
                  <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-zinc-700" onClick={() => openActionsDrawer(review)}>
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
