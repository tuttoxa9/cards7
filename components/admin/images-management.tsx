"use client";

import { useState, useEffect } from "react";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, Plus, Trash2 } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useDrawer } from "@/hooks/use-drawer";
import { BackgroundImageForm } from "./background-image-form";

// --- Типы данных ---
interface BackgroundImage {
  id: string;
  name: string;
  imageUrl: string;
  isActive: boolean;
}

// --- Компонент для подтверждения удаления ---
function DeleteConfirmation({ onConfirm, onCancel }: { onConfirm: () => void, onCancel: () => void }) {
  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-zinc-300">
        Вы уверены, что хотите удалить этот задник?
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="destructive" onClick={onConfirm}>
          Удалить
        </Button>
      </div>
    </div>
  );
}

// --- Основной компонент ---
export function ImagesManagement() {
  const [images, setImages] = useState<BackgroundImage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { openDrawer, closeDrawer } = useDrawer();

  const loadImages = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, "backgroundImages"));
      const data: BackgroundImage[] = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      } as BackgroundImage));
      setImages(data);
    } catch (error) {
      console.error("Ошибка загрузки задников:", error);
      toast.error("Не удалось загрузить задники");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadImages();
  }, []);

  const handleSave = async (data: Omit<BackgroundImage, "id">) => {
    try {
      await addDoc(collection(db, "backgroundImages"), data);
      toast.success("Задник успешно добавлен");
      closeDrawer();
      loadImages(); // Перезагружаем список
    } catch (error) {
      console.error("Ошибка сохранения задника:", error);
      toast.error("Не удалось сохранить задник");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteDoc(doc(db, "backgroundImages", id));
      toast.success("Задник успешно удален");
      closeDrawer();
      loadImages(); // Перезагружаем список
    } catch (error) {
      console.error("Ошибка удаления задника:", error);
      toast.error("Не удалось удалить задник");
    }
  };

  const openAddForm = () => {
    openDrawer(
      BackgroundImageForm,
      { onSave: handleSave, onCancel: closeDrawer },
      { size: "default", title: "Добавить новый задник" }
    );
  };

  const openDeleteConfirmation = (image: BackgroundImage) => {
    openDrawer(
      DeleteConfirmation,
      {
        onConfirm: () => handleDelete(image.id),
        onCancel: closeDrawer,
      },
      { size: "default", title: "Подтверждение удаления" }
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Управление задниками карточек</h2>
        <Button onClick={openAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Добавить задник
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <Skeleton key={i} className="h-16 w-full bg-zinc-700" />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-700 bg-[#18181B]/50">
          <Table>
            <TableHeader>
              <TableRow className="border-b-zinc-700 hover:bg-transparent">
                <TableHead className="w-[100px]">Превью</TableHead>
                <TableHead>Название</TableHead>
                <TableHead className="text-right w-[80px]">Действия</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {images.map((image) => (
                <TableRow key={image.id} className="border-zinc-800 hover:bg-[#27272A]/50">
                  <TableCell className="p-2">
                    <img src={image.imageUrl} alt={image.name} className="h-12 w-20 object-cover rounded-sm" />
                  </TableCell>
                  <TableCell className="font-medium text-white">{image.name}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 p-0 hover:bg-zinc-700"
                      onClick={() => openDeleteConfirmation(image)}
                    >
                      <Trash2 className="h-4 w-4 text-red-400" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      {!isLoading && images.length === 0 && (
         <div className="text-center text-zinc-400 py-20">
          Задников пока нет. Нажмите "Добавить", чтобы загрузить первый.
        </div>
      )}
    </div>
  );
}