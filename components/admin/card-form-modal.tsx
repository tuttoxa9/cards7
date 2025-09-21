"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";

interface Card {
  id: string;
  name: string;
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
  imageUrl: string;
  bannerImageUrl?: string;
  isFeatured: boolean;
  category: string;
  description: string;
  inStock: boolean;
  isHot: boolean;
  rating?: number;
  reviews?: number;
  tag?: string;
}

interface CardFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (card: Omit<Card, "id">) => void;
  editingCard?: Card | null;
}

export function CardFormModal({ isOpen, onClose, onSave, editingCard }: CardFormModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    title: "",
    price: "",
    originalPrice: "",
    discount: "",
    rarity: "common" as const,
    image: "",
    imageUrl: "",
    bannerImageUrl: "",
    isFeatured: false,
    category: "",
    description: "",
    inStock: true,
    isHot: false,
    rating: "",
    reviews: "",
    tag: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bannerUploadProgress, setBannerUploadProgress] = useState(0);

  useEffect(() => {
    if (editingCard) {
      setFormData({
        name: editingCard.name || "",
        title: editingCard.title || "",
        price: editingCard.price.toString(),
        originalPrice: editingCard.originalPrice?.toString() || "",
        discount: editingCard.discount?.toString() || "",
        rarity: editingCard.rarity,
        image: editingCard.image || "",
        imageUrl: editingCard.imageUrl || "",
        bannerImageUrl: editingCard.bannerImageUrl || "",
        isFeatured: editingCard.isFeatured || false,
        category: editingCard.category,
        description: editingCard.description,
        inStock: editingCard.inStock,
        isHot: editingCard.isHot,
        rating: editingCard.rating?.toString() || "",
        reviews: editingCard.reviews?.toString() || "",
        tag: editingCard.tag || ""
      });
    } else {
      setFormData({
        name: "",
        title: "",
        price: "",
        originalPrice: "",
        discount: "",
        rarity: "common",
        image: "",
        imageUrl: "",
        bannerImageUrl: "",
        isFeatured: false,
        category: "",
        description: "",
        inStock: true,
        isHot: false,
        rating: "",
        reviews: "",
        tag: ""
      });
    }
  }, [editingCard, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardData = {
      name: formData.name,
      title: formData.title,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      discount: formData.discount ? Number(formData.discount) : undefined,
      rarity: formData.rarity,
      image: formData.image,
      imageUrl: formData.imageUrl || formData.image || "/placeholder.jpg",
      bannerImageUrl: formData.bannerImageUrl || undefined,
      isFeatured: formData.isFeatured,
      category: formData.category,
      description: formData.description,
      inStock: formData.inStock,
      isHot: formData.isHot,
      rating: formData.rating ? Number(formData.rating) : undefined,
      reviews: formData.reviews ? Number(formData.reviews) : undefined,
      tag: formData.tag || undefined
    };

    onSave(cardData);
  };

  const uploadToCloudflare = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('https://api.cloudflare.com/client/v4/accounts/2d16ebaf34d96e6d891d5b0a20364b20/r2/buckets/cards/objects', {
      method: 'PUT',
      headers: {
        'Authorization': 'Bearer fd954b6ca17169911bff1616221e162f:d8e9945f178c5c5ea7e27965d62194ba5209bb56fa5d4c2be8e44397f5218305',
        'Content-Type': file.type,
      },
      body: file,
    });

    if (!response.ok) {
      throw new Error('Ошибка загрузки файла');
    }

    const fileName = `card-${Date.now()}-${file.name}`;
    return `https://pub-f4c677382cef430f9372c49ceb7d3535.r2.dev/${fileName}`;
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Имитация прогресса загрузки
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Простая реализация загрузки на Cloudflare R2
      const fileName = `card-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const imageUrl = `https://pub-f4c677382cef430f9372c49ceb7d3535.r2.dev/${fileName}`;

      // В реальном проекте здесь была бы загрузка на Cloudflare R2
      // Пока используем временную реализацию
      setTimeout(() => {
        clearInterval(progressInterval);
        setUploadProgress(100);
        setFormData(prev => ({
          ...prev,
          image: imageUrl,
          imageUrl: imageUrl
        }));
        setIsUploading(false);
      }, 1500);

    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Ошибка загрузки файла');
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploadingBanner(true);
    setBannerUploadProgress(0);

    try {
      // Имитация прогресса загрузки
      const progressInterval = setInterval(() => {
        setBannerUploadProgress(prev => Math.min(prev + 10, 90));
      }, 100);

      // Простая реализация загрузки на Cloudflare R2
      const fileName = `banner-${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const bannerUrl = `https://pub-f4c677382cef430f9372c49ceb7d3535.r2.dev/${fileName}`;

      // В реальном проекте здесь была бы загрузка на Cloudflare R2
      // Пока используем временную реализацию
      setTimeout(() => {
        clearInterval(progressInterval);
        setBannerUploadProgress(100);
        setFormData(prev => ({
          ...prev,
          bannerImageUrl: bannerUrl
        }));
        setIsUploadingBanner(false);
      }, 1500);

    } catch (error) {
      console.error('Ошибка загрузки баннера:', error);
      setIsUploadingBanner(false);
      setBannerUploadProgress(0);
      alert('Ошибка загрузки баннера');
    }
  };

  const categories = [
    "Покемон",
    "MTG",
    "Yu-Gi-Oh!",
    "Аниме",
    "Disney",
    "Marvel",
    "Фэнтези",
    "Автомобили",
    "Супергерои",
    "Спорт"
  ];

  const rarities = [
    { value: "common", label: "Обычная" },
    { value: "rare", label: "Редкая" },
    { value: "epic", label: "Эпическая" },
    { value: "legendary", label: "Легендарная" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-[#27272A] border-zinc-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingCard ? "Редактировать карточку" : "Добавить новую карточку"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-3 gap-4">
            {/* Название */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-white">
                Название карточки
              </Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, name: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white"
                placeholder="Введите название"
                required
              />
            </div>

            {/* Цена */}
            <div className="space-y-2">
              <Label htmlFor="price" className="text-white">
                Цена (₽)
              </Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white"
                placeholder="0"
                required
                min="0"
              />
            </div>

            {/* Оригинальная цена */}
            <div className="space-y-2">
              <Label htmlFor="originalPrice" className="text-white">
                Оригинальная цена (₽)
              </Label>
              <Input
                id="originalPrice"
                type="number"
                value={formData.originalPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white"
                placeholder="0"
                min="0"
              />
            </div>

            {/* Скидка */}
            <div className="space-y-2">
              <Label htmlFor="discount" className="text-white">
                Скидка (%)
              </Label>
              <Input
                id="discount"
                type="number"
                value={formData.discount}
                onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white"
                placeholder="0"
                min="0"
                max="100"
              />
            </div>

            {/* Категория */}
            <div className="space-y-2">
              <Label className="text-white">Категория</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger className="bg-[#18181B] border-zinc-600 text-white">
                  <SelectValue placeholder="Выберите категорию" />
                </SelectTrigger>
                <SelectContent className="bg-[#27272A] border-zinc-600">
                  {categories.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-[#18181B]">
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Редкость */}
            <div className="space-y-2">
              <Label className="text-white">Редкость</Label>
              <Select
                value={formData.rarity}
                onValueChange={(value: any) => setFormData(prev => ({ ...prev, rarity: value }))}
              >
                <SelectTrigger className="bg-[#18181B] border-zinc-600 text-white">
                  <SelectValue placeholder="Выберите редкость" />
                </SelectTrigger>
                <SelectContent className="bg-[#27272A] border-zinc-600">
                  {rarities.map((rarity) => (
                    <SelectItem key={rarity.value} value={rarity.value} className="text-white hover:bg-[#18181B]">
                      {rarity.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Дополнительные поля */}
          <div className="grid grid-cols-2 gap-4">
            {/* Тег */}
            <div className="space-y-2">
              <Label htmlFor="tag" className="text-white">
                Тег
              </Label>
              <Input
                id="tag"
                value={formData.tag}
                onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white"
                placeholder="Хит продаж, Новинка"
              />
            </div>

            {/* Рейтинг */}
            <div className="space-y-2">
              <Label htmlFor="rating" className="text-white">
                Рейтинг (1-5)
              </Label>
              <Input
                id="rating"
                type="number"
                value={formData.rating}
                onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white"
                placeholder="4.8"
                min="1"
                max="5"
                step="0.1"
              />
            </div>

            {/* Количество отзывов */}
            <div className="space-y-2">
              <Label htmlFor="reviews" className="text-white">
                Количество отзывов
              </Label>
              <Input
                id="reviews"
                type="number"
                value={formData.reviews}
                onChange={(e) => setFormData(prev => ({ ...prev, reviews: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white"
                placeholder="150"
                min="0"
              />
            </div>

            {/* Чекбоксы */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="inStock" className="text-white">
                  В наличии
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isHot"
                  checked={formData.isHot}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isHot" className="text-white">
                  Хит продаж
                </Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isFeatured" className="text-white">
                  Показывать на главной странице
                </Label>
              </div>
            </div>
          </div>

          {/* Описание */}
          <div className="space-y-2">
            <Label htmlFor="description" className="text-white">
              Описание
            </Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-[#18181B] border-zinc-600 text-white min-h-[100px]"
              placeholder="Введите описание карточки"
              required
            />
          </div>

          {/* Загрузка изображения карточки */}
          <div className="space-y-2">
            <Label className="text-white">Загрузить изображение карточки</Label>
            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center">
              {isUploading ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-zinc-400">Загрузка... {uploadProgress}%</p>
                </div>
              ) : (formData.imageUrl || formData.image) ? (
                <div className="space-y-2">
                  <img
                    src={formData.imageUrl || formData.image}
                    alt="Preview"
                    className="w-24 h-32 object-cover rounded mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, image: "", imageUrl: "" }))}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Удалить
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-zinc-400">Загрузите изображение карточки</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="bg-[#18181B] border-zinc-600 text-white file:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Загрузка изображения для баннера */}
          <div className="space-y-2">
            <Label className="text-white">Загрузить изображение для баннера (для главной)</Label>
            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center">
              {isUploadingBanner ? (
                <div className="space-y-2">
                  <Progress value={bannerUploadProgress} className="w-full" />
                  <p className="text-sm text-zinc-400">Загрузка баннера... {bannerUploadProgress}%</p>
                </div>
              ) : formData.bannerImageUrl ? (
                <div className="space-y-2">
                  <img
                    src={formData.bannerImageUrl}
                    alt="Banner Preview"
                    className="w-32 h-20 object-cover rounded mx-auto"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => setFormData(prev => ({ ...prev, bannerImageUrl: "" }))}
                    className="text-zinc-400 hover:text-white"
                  >
                    <X className="h-4 w-4 mr-1" />
                    Удалить баннер
                  </Button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                  <p className="text-zinc-400">Загрузите изображение для баннера (опционально)</p>
                  <p className="text-xs text-zinc-500">Будет использоваться как фон на главной странице</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleBannerUpload}
                    className="bg-[#18181B] border-zinc-600 text-white file:text-white"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-zinc-400 hover:text-white"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700"
              disabled={isUploading}
            >
              {editingCard ? "Сохранить изменения" : "Добавить карточку"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
