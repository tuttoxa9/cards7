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
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { r2Client, R2_BUCKET_NAME, R2_PUBLIC_URL } from "@/lib/r2";

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



  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    try {
      // Создаем уникальное имя файла
      const fileName = `cards/${Date.now()}_${file.name}`;

      setUploadProgress(30);

      // Загружаем файл в Cloudflare R2
      const putCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      });

      await r2Client.send(putCommand);

      setUploadProgress(80);

      // Формируем публичный URL для файла
      const downloadURL = `${R2_PUBLIC_URL}/${fileName}`;

      setUploadProgress(100);

      setFormData(prev => ({
        ...prev,
        image: downloadURL,
        imageUrl: downloadURL
      }));

      setIsUploading(false);

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
      // Создаем уникальное имя файла для баннера
      const fileName = `banners/${Date.now()}_${file.name}`;

      setBannerUploadProgress(30);

      // Загружаем файл в Cloudflare R2
      const putCommand = new PutObjectCommand({
        Bucket: R2_BUCKET_NAME,
        Key: fileName,
        Body: file,
        ContentType: file.type,
      });

      await r2Client.send(putCommand);

      setBannerUploadProgress(80);

      // Формируем публичный URL для файла
      const downloadURL = `${R2_PUBLIC_URL}/${fileName}`;

      setBannerUploadProgress(100);

      setFormData(prev => ({
        ...prev,
        bannerImageUrl: downloadURL
      }));

      setIsUploadingBanner(false);

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
      <DialogContent className="max-w-4xl max-h-[90vh] bg-[#27272A] border-zinc-700 text-white overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold">
            {editingCard ? "Редактировать карточку" : "Добавить новую карточку"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Основная информация */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-600 pb-1">Основная информация</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label htmlFor="title" className="text-xs text-zinc-300">Название карточки</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, name: e.target.value }))}
                  className="bg-[#18181B] border-zinc-600 text-white h-8"
                  placeholder="Введите название"
                  required
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Категория</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-[#18181B] border-zinc-600 text-white h-8">
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
            </div>

            <div className="space-y-1">
              <Label htmlFor="description" className="text-xs text-zinc-300">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#18181B] border-zinc-600 text-white min-h-[60px] text-sm"
                placeholder="Введите описание карточки"
                required
              />
            </div>
          </div>

          {/* Цены и скидки */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-600 pb-1">Цены и скидки</h3>
            <div className="grid grid-cols-4 gap-3">
              <div className="space-y-1">
                <Label htmlFor="price" className="text-xs text-zinc-300">Цена (₽)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-[#18181B] border-zinc-600 text-white h-8"
                  placeholder="0"
                  required
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="originalPrice" className="text-xs text-zinc-300">Старая цена (₽)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="bg-[#18181B] border-zinc-600 text-white h-8"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="discount" className="text-xs text-zinc-300">Скидка (%)</Label>
                <Input
                  id="discount"
                  type="number"
                  value={formData.discount}
                  onChange={(e) => setFormData(prev => ({ ...prev, discount: e.target.value }))}
                  className="bg-[#18181B] border-zinc-600 text-white h-8"
                  placeholder="0"
                  min="0"
                  max="100"
                />
              </div>
              <div className="space-y-1">
                <Label className="text-xs text-zinc-300">Редкость</Label>
                <Select value={formData.rarity} onValueChange={(value: any) => setFormData(prev => ({ ...prev, rarity: value }))}>
                  <SelectTrigger className="bg-[#18181B] border-zinc-600 text-white h-8">
                    <SelectValue placeholder="Редкость" />
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
          </div>

          {/* Дополнительные параметры */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-600 pb-1">Дополнительные параметры</h3>
            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <Label htmlFor="tag" className="text-xs text-zinc-300">Тег</Label>
                <Input
                  id="tag"
                  value={formData.tag}
                  onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                  className="bg-[#18181B] border-zinc-600 text-white h-8"
                  placeholder="Хит продаж, Новинка"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="rating" className="text-xs text-zinc-300">Рейтинг (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  value={formData.rating}
                  onChange={(e) => setFormData(prev => ({ ...prev, rating: e.target.value }))}
                  className="bg-[#18181B] border-zinc-600 text-white h-8"
                  placeholder="4.8"
                  min="1"
                  max="5"
                  step="0.1"
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="reviews" className="text-xs text-zinc-300">Отзывы</Label>
                <Input
                  id="reviews"
                  type="number"
                  value={formData.reviews}
                  onChange={(e) => setFormData(prev => ({ ...prev, reviews: e.target.value }))}
                  className="bg-[#18181B] border-zinc-600 text-white h-8"
                  placeholder="150"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Настройки отображения */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-600 pb-1">Настройки отображения</h3>
            <div className="grid grid-cols-3 gap-6">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="inStock" className="text-sm text-white">В наличии</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isHot"
                  checked={formData.isHot}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isHot" className="text-sm text-white">Хит продаж</Label>
              </div>
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                />
                <Label htmlFor="isFeatured" className="text-sm text-white">На главной</Label>
              </div>
            </div>
          </div>

          {/* Изображения */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-300 border-b border-zinc-600 pb-1">Изображения</h3>
            <div className="grid grid-cols-2 gap-4">
              {/* Изображение карточки */}
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Изображение карточки</Label>
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-3 text-center">
                  {isUploading ? (
                    <div className="space-y-1">
                      <Progress value={uploadProgress} className="w-full h-2" />
                      <p className="text-xs text-zinc-400">Загрузка... {uploadProgress}%</p>
                    </div>
                  ) : (formData.imageUrl || formData.image) ? (
                    <div className="space-y-2">
                      <img
                        src={formData.imageUrl || formData.image}
                        alt="Preview"
                        className="w-16 h-20 object-cover rounded mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, image: "", imageUrl: "" }))}
                        className="text-zinc-400 hover:text-white text-xs h-6"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
                      <p className="text-xs text-zinc-400">Загрузить карточку</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="bg-[#18181B] border-zinc-600 text-white file:text-white text-xs h-7"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Изображение баннера */}
              <div className="space-y-2">
                <Label className="text-xs text-zinc-300">Баннер для главной (опционально)</Label>
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-3 text-center">
                  {isUploadingBanner ? (
                    <div className="space-y-1">
                      <Progress value={bannerUploadProgress} className="w-full h-2" />
                      <p className="text-xs text-zinc-400">Загрузка... {bannerUploadProgress}%</p>
                    </div>
                  ) : formData.bannerImageUrl ? (
                    <div className="space-y-2">
                      <img
                        src={formData.bannerImageUrl}
                        alt="Banner Preview"
                        className="w-20 h-12 object-cover rounded mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, bannerImageUrl: "" }))}
                        className="text-zinc-400 hover:text-white text-xs h-6"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Удалить
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      <Upload className="w-6 h-6 text-zinc-400 mx-auto" />
                      <p className="text-xs text-zinc-400">Загрузить баннер</p>
                      <p className="text-xs text-zinc-500">Для фона главной</p>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="bg-[#18181B] border-zinc-600 text-white file:text-white text-xs h-7"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex justify-end gap-3 pt-4 border-t border-zinc-600">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-zinc-400 hover:text-white h-8 px-4"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 h-8 px-4"
              disabled={isUploading || isUploadingBanner}
            >
              {editingCard ? "Сохранить" : "Добавить"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
