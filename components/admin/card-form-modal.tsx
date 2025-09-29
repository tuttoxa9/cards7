"use client";

import { useState, useEffect } from "react";
import { Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { Progress } from "@/components/ui/progress";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";


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
  cardBackImageUrl?: string;
  carouselImageUrl?: string;
  isFeatured: boolean;
  category: string;
  description: string;
  inStock: boolean;
  isHot: boolean;
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
    rarity: "common" as const,
    image: "",
    imageUrl: "",
    bannerImageUrl: "",
    cardBackImageUrl: "none",
    carouselImageUrl: "",
    isFeatured: false,
    category: "",
    description: "",
    inStock: true,
    isHot: false
  });
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingBanner, setIsUploadingBanner] = useState(false);
  const [isUploadingCarousel, setIsUploadingCarousel] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [bannerUploadProgress, setBannerUploadProgress] = useState(0);
  const [carouselUploadProgress, setCarouselUploadProgress] = useState(0);
  const [backgroundImages, setBackgroundImages] = useState<Array<{id: string, name: string, imageUrl: string}>>([]);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    if (editingCard) {
      setFormData({
        name: editingCard.name || "",
        title: editingCard.title || "",
        price: editingCard.price.toString(),
        originalPrice: editingCard.originalPrice?.toString() || "",
        rarity: editingCard.rarity,
        image: editingCard.image || "",
        imageUrl: editingCard.imageUrl || "",
        bannerImageUrl: editingCard.bannerImageUrl || "",
        cardBackImageUrl: editingCard.cardBackImageUrl || "none",
        carouselImageUrl: editingCard.carouselImageUrl || "",
        isFeatured: editingCard.isFeatured || false,
        category: editingCard.category,
        description: editingCard.description,
        inStock: editingCard.inStock,
        isHot: editingCard.isHot
      });
    } else {
      setFormData({
        name: "",
        title: "",
        price: "",
        originalPrice: "",
        rarity: "common",
        image: "",
        imageUrl: "",
        bannerImageUrl: "",
        cardBackImageUrl: "none",
        carouselImageUrl: "",
        isFeatured: false,
        category: "",
        description: "",
        inStock: true,
        isHot: false
      });
    }
  }, [editingCard, isOpen]);

  // Загрузка фоновых изображений и категорий
  useEffect(() => {
    const loadBackgroundImages = async () => {
      try {
        const q = query(collection(db, "backgroundImages"), where("isActive", "==", true));
        const querySnapshot = await getDocs(q);
        const images: Array<{id: string, name: string, imageUrl: string}> = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          images.push({
            id: doc.id,
            name: data.name,
            imageUrl: data.imageUrl
          });
        });

        setBackgroundImages(images);
      } catch (error) {
        console.error("Ошибка загрузки фоновых изображений:", error);
      }
    };

    const loadCategories = async () => {
      try {
        const q = query(collection(db, "categories"));
        const querySnapshot = await getDocs(q);
        const categoriesData: Array<{id: string, name: string}> = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          categoriesData.push({
            id: doc.id,
            name: data.name
          });
        });

        setCategories(categoriesData);
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    if (isOpen) {
      loadBackgroundImages();
      loadCategories();
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardData = {
      name: formData.name,
      title: formData.title,
      price: Number(formData.price),
      originalPrice: formData.originalPrice ? Number(formData.originalPrice) : undefined,
      rarity: formData.rarity,
      image: formData.image,
      imageUrl: formData.imageUrl || formData.image || "/placeholder.jpg",
      bannerImageUrl: formData.bannerImageUrl || undefined,
      cardBackImageUrl: formData.cardBackImageUrl === "none" ? undefined : formData.cardBackImageUrl,
      carouselImageUrl: formData.carouselImageUrl || undefined,
      isFeatured: formData.isFeatured,
      category: formData.category,
      description: formData.description,
      inStock: formData.inStock,
      isHot: formData.isHot
    };

    onSave(cardData);
  };



  const handleCardImageUpload = async (file: File) => {

    setIsUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(20);

      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'card');

      setUploadProgress(40);

      // Отправляем файл на наш API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(80);

      if (!response.ok) {
        throw new Error('Ошибка при загрузке файла');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Ошибка при загрузке файла');
      }

      setUploadProgress(100);

      setFormData(prev => ({
        ...prev,
        image: result.url,
        imageUrl: result.url
      }));

      setIsUploading(false);

    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      setIsUploading(false);
      setUploadProgress(0);
      alert('Ошибка загрузки файла');
    }
  };

  const handleBannerImageUpload = async (file: File) => {

    setIsUploadingBanner(true);
    setBannerUploadProgress(0);

    try {
      setBannerUploadProgress(20);

      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'banner');

      setBannerUploadProgress(40);

      // Отправляем файл на наш API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setBannerUploadProgress(80);

      if (!response.ok) {
        throw new Error('Ошибка при загрузке баннера');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Ошибка при загрузке баннера');
      }

      setBannerUploadProgress(100);

      setFormData(prev => ({
        ...prev,
        bannerImageUrl: result.url
      }));

      setIsUploadingBanner(false);

    } catch (error) {
      console.error('Ошибка загрузки баннера:', error);
      setIsUploadingBanner(false);
      setBannerUploadProgress(0);
      alert('Ошибка загрузки баннера');
    }
  };

  const handleCarouselImageUpload = async (file: File) => {

    setIsUploadingCarousel(true);
    setCarouselUploadProgress(0);

    try {
      setCarouselUploadProgress(20);

      // Создаем FormData для отправки файла
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', 'carousel');

      setCarouselUploadProgress(40);

      // Отправляем файл на наш API
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      setCarouselUploadProgress(80);

      if (!response.ok) {
        throw new Error('Ошибка при загрузке изображения карусели');
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Ошибка при загрузке изображения карусели');
      }

      setCarouselUploadProgress(100);

      setFormData(prev => ({
        ...prev,
        carouselImageUrl: result.url
      }));

      setIsUploadingCarousel(false);

    } catch (error) {
      console.error('Ошибка загрузки изображения карусели:', error);
      setIsUploadingCarousel(false);
      setCarouselUploadProgress(0);
      alert('Ошибка загрузки изображения карусели');
    }
  };



  const rarities = [
    { value: "common", label: "Обычная" },
    { value: "rare", label: "Редкая" },
    { value: "epic", label: "Эпическая" },
    { value: "legendary", label: "Легендарная" }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="w-full max-w-5xl max-h-[95vh] mx-2 sm:mx-auto bg-[#1a1a1a] border-zinc-700 text-white overflow-y-auto shadow-2xl">
        <DialogHeader className="pb-4 border-b border-zinc-700">
          <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            {editingCard ? "Редактировать карточку" : "Добавить карточку"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Основная информация */}
          <div className="bg-[#222222] rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-blue-500 rounded"></div>
              Основная информация
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm text-zinc-300">Название карточки</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, name: e.target.value }))}
                  className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-blue-500"
                  placeholder="Введите название"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300">Категория</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                  <SelectTrigger className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-blue-500">
                    <SelectValue placeholder="Выберите категорию" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222222] border-zinc-600">
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.name} className="text-white hover:bg-[#1a1a1a]">
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm text-zinc-300">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1a1a] border-zinc-600 text-white min-h-[80px] focus:border-blue-500"
                placeholder="Введите описание карточки"
                required
              />
            </div>
          </div>

          {/* Цены и настройки */}
          <div className="bg-[#222222] rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-green-500 rounded"></div>
              Цены и настройки
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm text-zinc-300">Цена (BYN)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-green-500"
                  placeholder="0"
                  required
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice" className="text-sm text-zinc-300">Старая цена (BYN)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-green-500"
                  placeholder="0"
                  min="0"
                />
              </div>
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300">Редкость</Label>
                <Select value={formData.rarity} onValueChange={(value: any) => setFormData(prev => ({ ...prev, rarity: value }))}>
                  <SelectTrigger className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-green-500">
                    <SelectValue placeholder="Редкость" />
                  </SelectTrigger>
                  <SelectContent className="bg-[#222222] border-zinc-600">
                    {rarities.map((rarity) => (
                      <SelectItem key={rarity.value} value={rarity.value} className="text-white hover:bg-[#1a1a1a]">
                        {rarity.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Настройки переносим сюда */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 pt-2 border-t border-zinc-700">
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="inStock"
                  checked={formData.inStock}
                  onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                  className="w-4 h-4 rounded bg-[#1a1a1a] border-zinc-600 text-green-500 focus:ring-green-500"
                />
                <Label htmlFor="inStock" className="text-sm text-white">В наличии</Label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isHot"
                  checked={formData.isHot}
                  onChange={(e) => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
                  className="w-4 h-4 rounded bg-[#1a1a1a] border-zinc-600 text-orange-500 focus:ring-orange-500"
                />
                <Label htmlFor="isHot" className="text-sm text-white">Хит продаж</Label>
              </div>
              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isFeatured"
                  checked={formData.isFeatured}
                  onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                  className="w-4 h-4 rounded bg-[#1a1a1a] border-zinc-600 text-blue-500 focus:ring-blue-500"
                />
                <Label htmlFor="isFeatured" className="text-sm text-white">На главной</Label>
              </div>
            </div>
          </div>




          {/* Изображения */}
          <div className="bg-[#222222] rounded-lg p-4 space-y-4">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <div className="w-1 h-4 bg-purple-500 rounded"></div>
              Изображения
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Изображение карточки */}
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300 font-medium">Изображение карточки</Label>
                <DragDropUpload
                  onUpload={handleCardImageUpload}
                  currentFile={formData.imageUrl || formData.image}
                  onRemove={() => setFormData(prev => ({ ...prev, image: "", imageUrl: "" }))}
                  isUploading={isUploading}
                  uploadProgress={uploadProgress}
                  placeholder="Основное изображение"
                  accept="image/*"
                  maxSize={10}
                />
              </div>

              {/* Изображение баннера */}
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300 font-medium">Баннер главной</Label>
                <DragDropUpload
                  onUpload={handleBannerImageUpload}
                  currentFile={formData.bannerImageUrl}
                  onRemove={() => setFormData(prev => ({ ...prev, bannerImageUrl: "" }))}
                  isUploading={isUploadingBanner}
                  uploadProgress={bannerUploadProgress}
                  placeholder="Баннер для главной"
                  accept="image/*"
                  maxSize={10}
                />
              </div>

              {/* Изображение для карусели */}
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300 font-medium">Картинка карусели</Label>
                <DragDropUpload
                  onUpload={handleCarouselImageUpload}
                  currentFile={formData.carouselImageUrl}
                  onRemove={() => setFormData(prev => ({ ...prev, carouselImageUrl: "" }))}
                  isUploading={isUploadingCarousel}
                  uploadProgress={carouselUploadProgress}
                  placeholder="Изображение карусели"
                  accept="image/*"
                  maxSize={10}
                />
              </div>

              {/* Задник карточки */}
              <div className="space-y-2">
                <Label className="text-sm text-zinc-300 font-medium">Задник карточки</Label>
                <div className="border border-zinc-600 rounded-lg p-3 bg-[#1a1a1a] min-h-[120px] flex flex-col justify-center">
                  {formData.cardBackImageUrl && formData.cardBackImageUrl !== "none" ? (
                    <div className="space-y-2 text-center">
                      <img
                        src={formData.cardBackImageUrl}
                        alt="Card Back Preview"
                        className="w-16 h-20 object-cover rounded mx-auto"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, cardBackImageUrl: "none" }))}
                        className="text-red-400 hover:text-red-300 border-red-600 hover:border-red-500 text-xs h-7 px-3"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Убрать
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-center">
                      <p className="text-xs text-zinc-400">Выбрать задник</p>
                      <Select value={formData.cardBackImageUrl} onValueChange={(value) => setFormData(prev => ({ ...prev, cardBackImageUrl: value }))}>
                        <SelectTrigger className="bg-[#1a1a1a] border-zinc-600 text-white h-9 text-sm focus:border-purple-500">
                          <SelectValue placeholder="Выберите задник" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#222222] border-zinc-600">
                          <SelectItem value="none" className="text-white hover:bg-[#1a1a1a]">
                            Без задника
                          </SelectItem>
                          {backgroundImages.map((image) => (
                            <SelectItem key={image.id} value={image.imageUrl} className="text-white hover:bg-[#1a1a1a]">
                              {image.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Кнопки */}
          <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-zinc-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 h-11 px-6 w-full sm:w-auto font-medium"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-11 px-6 w-full sm:w-auto font-medium text-white shadow-lg"
              disabled={isUploading || isUploadingBanner || isUploadingCarousel}
            >
              {editingCard ? "Сохранить изменения" : "Добавить карточку"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
