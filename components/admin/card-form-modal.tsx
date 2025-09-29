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

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Основная информация */}
          <div className="bg-[#222222] rounded-lg p-6 space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="w-2 h-5 bg-blue-500 rounded"></div>
              Основная информация
            </h3>

            {/* Название карточки на всю ширину */}
            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium text-zinc-300">Название карточки</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value, name: e.target.value }))}
                className="bg-[#1a1a1a] border-zinc-600 text-white h-12 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base"
                placeholder="Введите название карточки"
                required
              />
            </div>

            {/* Категория на всю ширину */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Категория</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
                <SelectTrigger className="bg-[#1a1a1a] border-zinc-600 text-white h-12 focus:border-blue-500 text-base">
                  <SelectValue placeholder={categories.length === 0 ? "Сначала создайте категорию" : "Выберите категорию"} />
                </SelectTrigger>
                <SelectContent className="bg-[#222222] border-zinc-600">
                  {categories.length === 0 ? (
                    <SelectItem value="no-categories" disabled className="text-zinc-400 hover:bg-[#1a1a1a]">
                      Категории не найдены
                    </SelectItem>
                  ) : (
                    categories.map((category) => (
                      <SelectItem key={category.id} value={category.name} className="text-white hover:bg-[#1a1a1a]">
                        {category.name}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Описание на всю ширину с автоматическим изменением высоты */}
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-zinc-300">Описание</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="bg-[#1a1a1a] border-zinc-600 text-white min-h-[100px] focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-base resize-none"
                placeholder="Введите описание карточки"
                required
                rows={4}
              />
            </div>
          </div>

          {/* Цены и атрибуты */}
          <div className="bg-[#222222] rounded-lg p-6 space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="w-2 h-5 bg-green-500 rounded"></div>
              Цены и атрибуты
            </h3>

            {/* Цены в одну строку */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium text-zinc-300">Цена (BYN)</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) => setFormData(prev => ({ ...prev, price: e.target.value }))}
                  className="bg-[#1a1a1a] border-zinc-600 text-white h-12 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-base"
                  placeholder="0.00"
                  required
                  min="0"
                  step="0.01"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="originalPrice" className="text-sm font-medium text-zinc-300">Старая цена (BYN)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  value={formData.originalPrice}
                  onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: e.target.value }))}
                  className="bg-[#1a1a1a] border-zinc-600 text-white h-12 focus:border-green-500 focus:ring-1 focus:ring-green-500 text-base"
                  placeholder="0.00"
                  min="0"
                  step="0.01"
                />
              </div>
            </div>

            {/* Редкость под полями цен */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-zinc-300">Редкость</Label>
              <Select value={formData.rarity} onValueChange={(value: any) => setFormData(prev => ({ ...prev, rarity: value }))}>
                <SelectTrigger className="bg-[#1a1a1a] border-zinc-600 text-white h-12 focus:border-green-500 text-base max-w-xs">
                  <SelectValue placeholder="Выберите редкость" />
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

            {/* Чекбоксы в одну строку */}
            <div className="pt-4 border-t border-zinc-700">
              <Label className="text-sm font-medium text-zinc-300 mb-3 block">Дополнительные параметры</Label>
              <div className="flex flex-wrap gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="inStock"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="w-5 h-5 rounded bg-[#1a1a1a] border-zinc-600 text-green-500 focus:ring-green-500 focus:ring-2"
                  />
                  <Label htmlFor="inStock" className="text-sm font-medium text-white cursor-pointer">В наличии</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isHot"
                    checked={formData.isHot}
                    onChange={(e) => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
                    className="w-5 h-5 rounded bg-[#1a1a1a] border-zinc-600 text-orange-500 focus:ring-orange-500 focus:ring-2"
                  />
                  <Label htmlFor="isHot" className="text-sm font-medium text-white cursor-pointer">Хит продаж</Label>
                </div>
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-5 h-5 rounded bg-[#1a1a1a] border-zinc-600 text-blue-500 focus:ring-blue-500 focus:ring-2"
                  />
                  <Label htmlFor="isFeatured" className="text-sm font-medium text-white cursor-pointer">На главной</Label>
                </div>
              </div>
            </div>
          </div>




          {/* Изображения */}
          <div className="bg-[#222222] rounded-lg p-6 space-y-5">
            <h3 className="text-lg font-semibold text-white flex items-center gap-3">
              <div className="w-2 h-5 bg-purple-500 rounded"></div>
              Изображения
            </h3>

            {/* Сетка из блоков для загрузки изображений */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

              {/* Основное изображение */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-300 block">Основное изображение</Label>
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 bg-[#1a1a1a] min-h-[160px] flex flex-col justify-center hover:border-purple-500 transition-colors group">
                  {isUploading ? (
                    <div className="space-y-3 text-center">
                      <Upload className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                      <p className="text-xs text-zinc-300">Загрузка...</p>
                      <Progress value={uploadProgress} className="w-full h-2 bg-zinc-700" />
                      <p className="text-xs text-zinc-400">{uploadProgress}%</p>
                    </div>
                  ) : (formData.imageUrl || formData.image) ? (
                    <div className="space-y-3 text-center">
                      <img
                        src={formData.imageUrl || formData.image}
                        alt="Основное изображение"
                        className="w-20 h-24 object-cover rounded mx-auto border border-zinc-600"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement).files;
                              if (files && files[0]) {
                                handleCardImageUpload(files[0]);
                              }
                            };
                            input.click();
                          }}
                          className="text-purple-400 hover:text-purple-300 border-purple-600 hover:border-purple-500 text-xs h-8 px-3"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Заменить
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, image: "", imageUrl: "" }))}
                          className="text-red-400 hover:text-red-300 border-red-600 hover:border-red-500 text-xs h-8 px-3"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-center cursor-pointer" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files[0]) {
                          handleCardImageUpload(files[0]);
                        }
                      };
                      input.click();
                    }}>
                      <Upload className="w-8 h-8 text-zinc-400 mx-auto group-hover:text-purple-400 transition-colors" />
                      <p className="text-sm text-zinc-400 group-hover:text-zinc-300">Нажмите для выбора файла</p>
                      <p className="text-xs text-zinc-500">Макс. 10 МБ, JPG/PNG</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Баннер для главной */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-300 block">Баннер для главной</Label>
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 bg-[#1a1a1a] min-h-[160px] flex flex-col justify-center hover:border-purple-500 transition-colors group">
                  {isUploadingBanner ? (
                    <div className="space-y-3 text-center">
                      <Upload className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                      <p className="text-xs text-zinc-300">Загрузка...</p>
                      <Progress value={bannerUploadProgress} className="w-full h-2 bg-zinc-700" />
                      <p className="text-xs text-zinc-400">{bannerUploadProgress}%</p>
                    </div>
                  ) : formData.bannerImageUrl ? (
                    <div className="space-y-3 text-center">
                      <img
                        src={formData.bannerImageUrl}
                        alt="Баннер"
                        className="w-20 h-24 object-cover rounded mx-auto border border-zinc-600"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement).files;
                              if (files && files[0]) {
                                handleBannerImageUpload(files[0]);
                              }
                            };
                            input.click();
                          }}
                          className="text-purple-400 hover:text-purple-300 border-purple-600 hover:border-purple-500 text-xs h-8 px-3"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Заменить
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, bannerImageUrl: "" }))}
                          className="text-red-400 hover:text-red-300 border-red-600 hover:border-red-500 text-xs h-8 px-3"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-center cursor-pointer" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files[0]) {
                          handleBannerImageUpload(files[0]);
                        }
                      };
                      input.click();
                    }}>
                      <Upload className="w-8 h-8 text-zinc-400 mx-auto group-hover:text-purple-400 transition-colors" />
                      <p className="text-sm text-zinc-400 group-hover:text-zinc-300">Нажмите для выбора файла</p>
                      <p className="text-xs text-zinc-500">Макс. 10 МБ, JPG/PNG</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Картинка карусели */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-300 block">Картинка карусели</Label>
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 bg-[#1a1a1a] min-h-[160px] flex flex-col justify-center hover:border-purple-500 transition-colors group">
                  {isUploadingCarousel ? (
                    <div className="space-y-3 text-center">
                      <Upload className="w-8 h-8 text-purple-400 mx-auto animate-pulse" />
                      <p className="text-xs text-zinc-300">Загрузка...</p>
                      <Progress value={carouselUploadProgress} className="w-full h-2 bg-zinc-700" />
                      <p className="text-xs text-zinc-400">{carouselUploadProgress}%</p>
                    </div>
                  ) : formData.carouselImageUrl ? (
                    <div className="space-y-3 text-center">
                      <img
                        src={formData.carouselImageUrl}
                        alt="Карусель"
                        className="w-20 h-24 object-cover rounded mx-auto border border-zinc-600"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <div className="flex gap-2 justify-center">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const input = document.createElement('input');
                            input.type = 'file';
                            input.accept = 'image/*';
                            input.onchange = (e) => {
                              const files = (e.target as HTMLInputElement).files;
                              if (files && files[0]) {
                                handleCarouselImageUpload(files[0]);
                              }
                            };
                            input.click();
                          }}
                          className="text-purple-400 hover:text-purple-300 border-purple-600 hover:border-purple-500 text-xs h-8 px-3"
                        >
                          <Upload className="h-3 w-3 mr-1" />
                          Заменить
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, carouselImageUrl: "" }))}
                          className="text-red-400 hover:text-red-300 border-red-600 hover:border-red-500 text-xs h-8 px-3"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Удалить
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3 text-center cursor-pointer" onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const files = (e.target as HTMLInputElement).files;
                        if (files && files[0]) {
                          handleCarouselImageUpload(files[0]);
                        }
                      };
                      input.click();
                    }}>
                      <Upload className="w-8 h-8 text-zinc-400 mx-auto group-hover:text-purple-400 transition-colors" />
                      <p className="text-sm text-zinc-400 group-hover:text-zinc-300">Нажмите для выбора файла</p>
                      <p className="text-xs text-zinc-500">Макс. 10 МБ, JPG/PNG</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Задник карточки */}
              <div className="space-y-3">
                <Label className="text-sm font-medium text-zinc-300 block">Задник карточки</Label>
                <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 bg-[#1a1a1a] min-h-[160px] flex flex-col justify-center hover:border-purple-500 transition-colors">
                  {formData.cardBackImageUrl && formData.cardBackImageUrl !== "none" ? (
                    <div className="space-y-3 text-center">
                      <img
                        src={formData.cardBackImageUrl}
                        alt="Задник карточки"
                        className="w-20 h-24 object-cover rounded mx-auto border border-zinc-600"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => setFormData(prev => ({ ...prev, cardBackImageUrl: "none" }))}
                        className="text-red-400 hover:text-red-300 border-red-600 hover:border-red-500 text-xs h-8 px-3"
                      >
                        <X className="h-3 w-3 mr-1" />
                        Убрать
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-3 text-center">
                      <Upload className="w-8 h-8 text-zinc-400 mx-auto" />
                      <p className="text-sm text-zinc-400">Выбрать задник</p>
                      <Select value={formData.cardBackImageUrl} onValueChange={(value) => setFormData(prev => ({ ...prev, cardBackImageUrl: value }))}>
                        <SelectTrigger className="bg-[#1a1a1a] border-zinc-600 text-white h-10 text-sm focus:border-purple-500">
                          <SelectValue placeholder="Без задника" />
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
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-8 border-t border-zinc-700">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 hover:bg-zinc-800 h-12 px-8 w-full sm:w-auto font-medium text-base transition-all"
            >
              Отмена
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 h-12 px-8 w-full sm:w-auto font-medium text-white shadow-lg text-base transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isUploading || isUploadingBanner || isUploadingCarousel || !formData.title || !formData.category || !formData.price}
            >
              {isUploading || isUploadingBanner || isUploadingCarousel ? (
                <>
                  <Upload className="w-4 h-4 mr-2 animate-spin" />
                  Загрузка...
                </>
              ) : (
                editingCard ? "Сохранить изменения" : "Добавить карточку"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
