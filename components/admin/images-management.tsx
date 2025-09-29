"use client";

import { useState, useEffect } from "react";
import { Plus, Edit, Trash2, Search, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Progress } from "@/components/ui/progress";
import { DragDropUpload } from "@/components/ui/drag-drop-upload";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";

interface BackgroundImage {
  id: string;
  name: string;
  description?: string;
  imageUrl: string;
  isActive: boolean;
  createdAt?: Date;
}

export function ImagesManagement() {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<BackgroundImage | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    imageUrl: "",
    isActive: true
  });

  // Загрузка изображений из Firestore
  const loadImages = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "backgroundImages"));
      const imagesData: BackgroundImage[] = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        imagesData.push({
          id: doc.id,
          ...data,
        } as BackgroundImage);
      });

      setImages(imagesData);
    } catch (error) {
      console.error("Ошибка загрузки изображений:", error);
      toast.error("Ошибка загрузки изображений");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const filteredImages = images.filter(image =>
    image.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageUpload = async (file: File) => {

    setIsUploading(true);
    setUploadProgress(0);

    try {
      setUploadProgress(20);

      const formDataUpload = new FormData();
      formDataUpload.append('file', file);
      formDataUpload.append('type', 'background');

      setUploadProgress(40);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formDataUpload,
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
        imageUrl: result.url
      }));

      setIsUploading(false);

    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
      setIsUploading(false);
      setUploadProgress(0);
      toast.error('Ошибка загрузки файла');
    }
  };

  const handleEdit = (image: BackgroundImage) => {
    setEditingImage(image);
    setFormData({
      name: image.name,
      description: image.description || "",
      imageUrl: image.imageUrl,
      isActive: image.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (imageId: string) => {
    if (window.confirm("Вы уверены, что хотите удалить это изображение?")) {
      try {
        await deleteDoc(doc(db, "backgroundImages", imageId));
        setImages(images.filter(image => image.id !== imageId));
        toast.success("Изображение успешно удалено");
      } catch (error) {
        console.error("Ошибка удаления изображения:", error);
        toast.error("Ошибка удаления изображения");
      }
    }
  };

  const handleAdd = () => {
    setEditingImage(null);
    setFormData({
      name: "",
      description: "",
      imageUrl: "",
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleSaveImage = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.imageUrl) {
      toast.error("Заполните обязательные поля");
      return;
    }

    try {
      const imageData = {
        name: formData.name,
        description: formData.description || "",
        imageUrl: formData.imageUrl,
        isActive: formData.isActive,
        createdAt: new Date()
      };

      if (editingImage) {
        // Редактирование
        await updateDoc(doc(db, "backgroundImages", editingImage.id), imageData);
        setImages(images.map(image =>
          image.id === editingImage.id
            ? { ...imageData, id: editingImage.id }
            : image
        ));
        toast.success("Изображение успешно обновлено");
      } else {
        // Добавление
        const docRef = await addDoc(collection(db, "backgroundImages"), imageData);
        const newImage: BackgroundImage = {
          ...imageData,
          id: docRef.id
        };
        setImages([...images, newImage]);
        toast.success("Изображение успешно добавлено");
      }
      setIsModalOpen(false);
      setEditingImage(null);
    } catch (error) {
      console.error("Ошибка сохранения изображения:", error);
      toast.error("Ошибка сохранения изображения");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <Skeleton className="h-10 w-64 bg-zinc-700" />
          <Skeleton className="h-10 w-32 bg-zinc-700" />
        </div>
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-zinc-700" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Заголовок и поиск */}
      <div className="flex justify-between items-center">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 h-4 w-4" />
          <Input
            placeholder="Поиск изображений..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-64 bg-[#18181B] border-zinc-600 text-white"
          />
        </div>
        <Button onClick={handleAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          Добавить изображение
        </Button>
      </div>

      {/* Таблица изображений */}
      <div className="rounded-lg border border-zinc-700 bg-[#18181B]">
        <Table>
          <TableHeader>
            <TableRow className="border-zinc-700">
              <TableHead className="text-zinc-300">Превью</TableHead>
              <TableHead className="text-zinc-300">Название</TableHead>
              <TableHead className="text-zinc-300">Описание</TableHead>
              <TableHead className="text-zinc-300">Статус</TableHead>
              <TableHead className="text-zinc-300">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredImages.map((image) => (
              <TableRow key={image.id} className="border-zinc-700 hover:bg-[#27272A]">
                <TableCell>
                  <img
                    src={image.imageUrl}
                    alt={image.name}
                    className="w-16 h-12 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = "/placeholder.jpg";
                    }}
                  />
                </TableCell>
                <TableCell className="text-white font-medium">{image.name}</TableCell>
                <TableCell className="text-zinc-400 max-w-xs truncate">{image.description || "—"}</TableCell>
                <TableCell>
                  {image.isActive ? (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Активно
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                      Неактивно
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(image)}
                      className="text-zinc-400 hover:text-white"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(image.id)}
                      className="text-zinc-400 hover:text-red-400"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {filteredImages.length === 0 && !isLoading && (
        <div className="text-center text-zinc-400 py-20">
          {searchTerm ? "Изображения не найдены" : "Нет изображений для отображения"}
        </div>
      )}

      {/* Модальное окно для добавления/редактирования изображения */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="w-full max-w-3xl max-h-[95vh] mx-2 sm:mx-auto bg-[#1a1a1a] border-zinc-700 text-white overflow-y-auto shadow-2xl">
          <DialogHeader className="pb-4 border-b border-zinc-700">
            <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
              {editingImage ? "Редактировать изображение" : "Добавить изображение"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSaveImage} className="space-y-5">
            {/* Основная информация */}
            <div className="bg-[#222222] rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-500 rounded"></div>
                Информация об изображении
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="imageName" className="text-sm text-zinc-300">Название *</Label>
                  <Input
                    id="imageName"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-purple-500"
                    placeholder="Введите название изображения"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="imageDescription" className="text-sm text-zinc-300">Описание</Label>
                  <Input
                    id="imageDescription"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    className="bg-[#1a1a1a] border-zinc-600 text-white h-10 focus:border-purple-500"
                    placeholder="Описание изображения"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4 rounded bg-[#1a1a1a] border-zinc-600 text-purple-500 focus:ring-purple-500"
                />
                <Label htmlFor="isActive" className="text-sm text-white">Активно</Label>
              </div>
            </div>

            {/* Загрузка изображения */}
            <div className="bg-[#222222] rounded-lg p-4 space-y-4">
              <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <div className="w-1 h-4 bg-purple-500 rounded"></div>
                Загрузка изображения
              </h3>
              <DragDropUpload
                onUpload={handleImageUpload}
                currentFile={formData.imageUrl}
                onRemove={() => setFormData(prev => ({ ...prev, imageUrl: "" }))}
                isUploading={isUploading}
                uploadProgress={uploadProgress}
                placeholder="Выберите изображение"
                accept="image/*"
                maxSize={10}
              />
            </div>

            {/* Кнопки */}
            <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-zinc-700">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-zinc-600 text-zinc-300 hover:text-white hover:border-zinc-500 h-11 px-6 w-full sm:w-auto font-medium"
              >
                Отмена
              </Button>
              <Button
                type="submit"
                className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 h-11 px-6 w-full sm:w-auto font-medium text-white shadow-lg"
                disabled={isUploading}
              >
                {editingImage ? "Сохранить изменения" : "Добавить изображение"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
