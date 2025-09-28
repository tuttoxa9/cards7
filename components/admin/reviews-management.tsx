"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Star, Plus, Trash2, Edit, Eye, EyeOff } from "lucide-react";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { db } from "@/lib/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  updateDoc,
  orderBy,
  query,
  serverTimestamp,
} from "firebase/firestore";
import { toast } from "sonner";

interface Review {
  id: string;
  name: string;
  rating: number;
  text: string;
  avatar?: string;
  images?: string[];
  isVisible: boolean;
  createdAt?: any;
}

export function ReviewsManagement() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingReview, setEditingReview] = useState<Review | null>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarUploadProgress, setAvatarUploadProgress] = useState(0);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    rating: 5,
    text: "",
    avatar: "",
    images: [] as string[],
    isVisible: true,
  });

  useEffect(() => {
    loadReviews();
  }, []);

  const loadReviews = async () => {
    try {
      const q = query(collection(db, "reviews"), orderBy("createdAt", "desc"));
      const querySnapshot = await getDocs(q);
      const reviewsData: Review[] = [];
      querySnapshot.forEach((doc) => {
        reviewsData.push({ id: doc.id, ...doc.data() } as Review);
      });
      setReviews(reviewsData);
    } catch (error) {
      console.error("Ошибка загрузки отзывов:", error);
      toast.error("Ошибка загрузки отзывов");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.text.trim()) {
      toast.error("Заполните все обязательные поля");
      return;
    }

    try {
      if (editingReview) {
        await updateDoc(doc(db, "reviews", editingReview.id), {
          ...formData,
          rating: Number(formData.rating),
        });
        toast.success("Отзыв обновлен");
      } else {
        await addDoc(collection(db, "reviews"), {
          ...formData,
          rating: Number(formData.rating),
          createdAt: serverTimestamp(),
        });
        toast.success("Отзыв добавлен");
      }

      setIsDialogOpen(false);
      setEditingReview(null);
      resetForm();
      loadReviews();
    } catch (error) {
      console.error("Ошибка сохранения отзыва:", error);
      toast.error("Ошибка сохранения отзыва");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reviews", id));
      toast.success("Отзыв удален");
      loadReviews();
    } catch (error) {
      console.error("Ошибка удаления отзыва:", error);
      toast.error("Ошибка удаления отзыва");
    }
  };

  const toggleVisibility = async (review: Review) => {
    try {
      await updateDoc(doc(db, "reviews", review.id), {
        isVisible: !review.isVisible,
      });
      toast.success(review.isVisible ? "Отзыв скрыт" : "Отзыв показан");
      loadReviews();
    } catch (error) {
      console.error("Ошибка изменения видимости:", error);
      toast.error("Ошибка изменения видимости");
    }
  };

  const handleAvatarUpload = async (file: File) => {
    setIsUploadingAvatar(true);
    setAvatarUploadProgress(0);

    try {
      setAvatarUploadProgress(20);

      // Создаем FormData для отправки файла
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'avatar');

      setAvatarUploadProgress(40);

      // Отправляем файл на наш API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      setAvatarUploadProgress(80);

      if (!response.ok) {
        throw new Error('Ошибка при загрузке аватарки');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Ошибка при загрузке аватарки');
      }

      setAvatarUploadProgress(100);

      setFormData(prev => ({
        ...prev,
        avatar: result.url
      }));

      toast.success("Аватарка загружена");
      setIsUploadingAvatar(false);

    } catch (error) {
      console.error('Ошибка загрузки аватарки:', error);
      setIsUploadingAvatar(false);
      setAvatarUploadProgress(0);
      toast.error('Ошибка загрузки аватарки');
    }
  };

  const handleImageUpload = async (file: File) => {
    setIsUploadingImage(true);
    setImageUploadProgress(0);

    try {
      setImageUploadProgress(20);

      // Создаем FormData для отправки файла
      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'review');

      setImageUploadProgress(40);

      // Отправляем файл на наш API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
      });

      setImageUploadProgress(80);

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Ошибка при загрузке изображения');
      }

      setImageUploadProgress(100);

      setFormData(prev => ({
        ...prev,
        images: [...prev.images, result.url]
      }));

      toast.success("Изображение загружено");
      setIsUploadingImage(false);

    } catch (error) {
      console.error('Ошибка загрузки изображения:', error);
      setIsUploadingImage(false);
      setImageUploadProgress(0);
      toast.error('Ошибка загрузки изображения');
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const resetForm = () => {
    setFormData({
      name: "",
      rating: 5,
      text: "",
      avatar: "",
      images: [],
      isVisible: true,
    });
  };

  const openEditDialog = (review: Review) => {
    setEditingReview(review);
    setFormData({
      name: review.name,
      rating: review.rating,
      text: review.text,
      avatar: review.avatar || "",
      images: review.images || [],
      isVisible: review.isVisible,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingReview(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const renderStars = (rating: number) => {
    return [...Array(5)].map((_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-zinc-400">Загрузка отзывов...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление отзывами</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
              <Plus className="h-4 w-4 mr-2" />
              Добавить отзыв
            </Button>
          </DialogTrigger>
          <DialogContent className="w-full max-w-[600px] max-h-[95vh] sm:max-h-[90vh] mx-2 sm:mx-auto overflow-y-auto bg-[#27272A] border-zinc-700">
            <DialogHeader>
              <DialogTitle className="text-lg sm:text-xl text-white">
                {editingReview ? "Редактировать отзыв" : "Добавить отзыв"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400 text-sm">
                Заполните информацию об отзыве
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
              <div>
                <Label htmlFor="name" className="text-white text-sm">
                  Имя автора *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-[#18181B] border-zinc-600 text-white h-9 sm:h-8"
                  placeholder="Введите имя автора"
                  required
                />
              </div>
              <div>
                <Label htmlFor="rating" className="text-white text-sm">
                  Рейтинг *
                </Label>
                <select
                  id="rating"
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                  className="w-full px-3 py-2 h-9 sm:h-8 bg-[#18181B] border border-zinc-600 rounded-md text-white"
                >
                  {[5, 4, 3, 2, 1].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating} {rating === 1 ? "звезда" : rating < 5 ? "звезды" : "звёзд"}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="text" className="text-white text-sm">
                  Текст отзыва *
                </Label>
                <Textarea
                  id="text"
                  value={formData.text}
                  onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                  className="bg-[#18181B] border-zinc-600 text-white min-h-[80px] sm:min-h-[60px]"
                  placeholder="Введите текст отзыва"
                  rows={4}
                  required
                />
              </div>
              <div>
                <Label className="text-white text-sm">
                  Аватарка
                </Label>
                <DragDropUpload
                  onUpload={handleAvatarUpload}
                  currentFile={formData.avatar}
                  onRemove={() => setFormData(prev => ({ ...prev, avatar: "" }))}
                  isUploading={isUploadingAvatar}
                  uploadProgress={avatarUploadProgress}
                  placeholder="Перетащите аватарку"
                  accept="image/*"
                  maxSize={5}
                />
              </div>
              <div>
                <Label className="text-white text-sm">
                  Изображения к отзыву
                </Label>
                <div className="space-y-3">
                  <DragDropUpload
                    onUpload={handleImageUpload}
                    isUploading={isUploadingImage}
                    uploadProgress={imageUploadProgress}
                    placeholder="Перетащите изображение"
                    accept="image/*"
                    maxSize={10}
                    disabled={formData.images.length >= 3}
                  />
                  {formData.images.length > 0 && (
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {formData.images.map((image, index) => (
                        <div key={index} className="relative group">
                          <img
                            src={image}
                            alt={`Изображение ${index + 1}`}
                            className="w-full h-20 object-cover rounded border border-zinc-600"
                          />
                          <Button
                            type="button"
                            size="sm"
                            variant="destructive"
                            className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => removeImage(index)}
                          >
                            ×
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                  {formData.images.length >= 3 && (
                    <p className="text-xs text-zinc-400">Максимум 3 изображения</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isVisible"
                  checked={formData.isVisible}
                  onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                  className="rounded"
                />
                <Label htmlFor="isVisible" className="text-white">
                  Показывать на сайте
                </Label>
              </div>
              <DialogFooter className="flex flex-col sm:flex-row gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-zinc-600 text-zinc-400 h-9 sm:h-8 w-full sm:w-auto"
                >
                  Отмена
                </Button>
                <Button type="submit" className="bg-blue-600 hover:bg-blue-700 h-9 sm:h-8 w-full sm:w-auto">
                  {editingReview ? "Обновить" : "Создать"}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {reviews.length === 0 ? (
          <Card className="bg-[#18181B] border-zinc-700">
            <CardContent className="py-8">
              <div className="text-center text-zinc-400">
                Отзывы не найдены. Добавьте первый отзыв.
              </div>
            </CardContent>
          </Card>
        ) : (
          reviews.map((review) => (
            <Card key={review.id} className="bg-[#18181B] border-zinc-700">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {review.avatar ? (
                        <img
                          src={review.avatar}
                          alt={review.name}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                      ) : (
                        review.name.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{review.name}</h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(review.rating)}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge variant={review.isVisible ? "default" : "secondary"}>
                      {review.isVisible ? "Видимый" : "Скрытый"}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => toggleVisibility(review)}
                      className="text-zinc-400 hover:text-white"
                    >
                      {review.isVisible ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => openEditDialog(review)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-red-400 hover:text-red-300"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-[#27272A] border-zinc-700">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Удалить отзыв?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">
                            Это действие нельзя отменить. Отзыв будет удален навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel className="border-zinc-600 text-zinc-400">
                            Отмена
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(review.id)}
                            className="bg-red-600 hover:bg-red-700"
                          >
                            Удалить
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-300 leading-relaxed mb-4">{review.text}</p>
                {review.images && review.images.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {review.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Изображение к отзыву ${index + 1}`}
                        className="w-16 h-16 object-cover rounded border border-zinc-600"
                      />
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
