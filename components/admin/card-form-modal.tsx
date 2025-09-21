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
  price: number;
  rarity: "common" | "rare" | "epic" | "legendary";
  image: string;
  category: string;
  description: string;
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
    price: "",
    rarity: "common" as const,
    image: "",
    category: "",
    description: ""
  });
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    if (editingCard) {
      setFormData({
        name: editingCard.name,
        price: editingCard.price.toString(),
        rarity: editingCard.rarity,
        image: editingCard.image,
        category: editingCard.category,
        description: editingCard.description
      });
    } else {
      setFormData({
        name: "",
        price: "",
        rarity: "common",
        image: "",
        category: "",
        description: ""
      });
    }
  }, [editingCard, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const cardData = {
      name: formData.name,
      price: Number(formData.price),
      rarity: formData.rarity,
      image: formData.image || "/placeholder.jpg",
      category: formData.category,
      description: formData.description
    };

    onSave(cardData);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    // Имитация загрузки файла
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          // В реальном приложении здесь будет URL загруженного файла
          setFormData(prev => ({ ...prev, image: `/placeholder-${Date.now()}.jpg` }));
          return 100;
        }
        return prev + 10;
      });
    }, 200);
  };

  const categories = [
    "Супергерои",
    "Автомобили",
    "Аниме",
    "Покемоны",
    "Спорт",
    "Фантастика"
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
          <div className="grid grid-cols-2 gap-4">
            {/* Название */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Название карточки
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
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

          {/* Загрузка изображения */}
          <div className="space-y-2">
            <Label className="text-white">Изображение</Label>
            <div className="border-2 border-dashed border-zinc-600 rounded-lg p-6 text-center">
              {isUploading ? (
                <div className="space-y-2">
                  <Progress value={uploadProgress} className="w-full" />
                  <p className="text-sm text-zinc-400">Загрузка... {uploadProgress}%</p>
                </div>
              ) : formData.image ? (
                <div className="space-y-2">
                  <img
                    src={formData.image}
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
                    onClick={() => setFormData(prev => ({ ...prev, image: "" }))}
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
