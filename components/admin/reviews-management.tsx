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
          <DialogContent className="w-full max-w-4xl max-h-[95vh] mx-2 sm:mx-auto overflow-y-auto bg-[#1a1a1a] border-zinc-700 shadow-2xl">
            <DialogHeader className="pb-4 border-b border-zinc-700">
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                {editingReview ? "Редактировать отзыв" : "Добавить отзыв"}
              </DialogTitle>
              <DialogDescription className="text-zinc-400">
                Заполните информацию об отзыве
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Основная информация */}
              <div className="bg-[#222222] rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <div className="w-1 h-4 bg-yellow-500 rounded"></div>
                  Информация об авторе
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm text-zinc-300">
                      Имя автора *
                    </Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-yellow-500"
                      placeholder="Введите имя автора"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="rating" className="text-sm text-zinc-300">
                      Рейтинг *
                    </Label>
                    <select
                      id="rating"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                      className="w-full px-3 py-2 h-10 bg-[#1a1a1a] border border-zinc-600 rounded-md text-white focus:border-yellow-500"
                    >
                      {[5, 4, 3, 2, 1].map((rating) => (
                        <option key={rating} value={rating}>
                          {rating} {rating === 1 ? "звезда" : rating < 5 ? "звезды" : "звёзд"}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="text" className="text-sm text-zinc-300">
                    Текст отзыва *
                  </Label>
                  <Textarea
                    id="text"
                    value={formData.text}
                    onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                    className="bg-[#1a1a1a] border-zinc-600 text-white min-h-[100px] focus:border-yellow-500"
                    placeholder="Введите текст отзыва"
                    rows={4}
                    required
                  />
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isVisible"
                    checked={formData.isVisible}
                    onChange={(e) => setFormData({ ...formData, isVisible: e.target.checked })}
                    className="w-4 h-4 rounded bg-[#1a1a1a] border-zinc-600 text-yellow-500 focus:ring-yellow-500"
                  />
                  <Label htmlFor="isVisible" className="text-sm text-white">
                    Показывать на сайте
                  </Label>
                </div>
              </div>

              {/* Изображения */}
              <div className="bg-[#222222] rounded-lg p-4 space-y-4">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <div className="w-1 h-4 bg-yellow-500 rounded"></div>
                  Изображения
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm text-zinc-300 font-medium">
                      Аватарка
                    </Label>
                    <DragDropUpload
                      onUpload={handleAvatarUpload}
                      currentFile={formData.avatar}
                      onRemove={() => setFormData(prev => ({ ...prev, avatar: "" }))}
                      isUploading={isUploadingAvatar}
                      uploadProgress={avatarUploadProgress}
                      placeholder="Аватарка пользователя"
                      accept="image/*"
                      maxSize={5}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm text-zinc-300 font-medium">
                      Изображения к отзыву
                    </Label>
                    <DragDropUpload
                      onUpload={handleImageUpload}
                      isUploading={isUploadingImage}
                      uploadProgress={imageUploadProgress}
                      placeholder="Дополнительные изображения"
                      accept="image/*"
                      maxSize={10}
                      disabled={formData.images.length >= 3}
                    />
                    {formData.images.length >= 3 && (
                      <p className="text-xs text-zinc-400">Максимум 3 изображения</p>
                    )}
                  </div>
                </div>

                {formData.images.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 border-t border-zinc-700">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Изображение ${index + 1}`}
                          className="w-full h-24 object-cover rounded border border-zinc-600"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          className="absolute top-1 right-1 h-7 w-7 p-0 bg-red-600 border-red-600 text-white hover:bg-red-700 opacity-90"
                          onClick={() => removeImage(index)}
                        >
                          ×
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-zinc-700">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 h-11 px-6 w-full sm:w-auto font-medium"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  className="bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-700 hover:to-yellow-800 h-11 px-6 w-full sm:w-auto font-medium text-white shadow-lg"
                >
                  {editingReview ? "Сохранить изменения" : "Добавить отзыв"}
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
                      <AlertDialogContent className="bg-[#1a1a1a] border-zinc-700 shadow-2xl">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white text-lg font-bold">
                            Удалить отзыв?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-zinc-400">
                            Это действие нельзя отменить. Отзыв будет удален навсегда.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter className="gap-3">
                          <AlertDialogCancel className="border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 h-10 px-6">
                            Отмена
                          </AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(review.id)}
                            className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 h-10 px-6 text-white font-medium"
                          >
                            Удалить отзыв
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
