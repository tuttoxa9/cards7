"use client";

import { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { MoreVertical, Upload } from "lucide-react";

// --- Типы данных ---
interface ImageAsset {
  id: string;
  name: string;
  url: string;
  size: number; // in bytes
  createdAt: any; // Firestore timestamp
}

// --- Основной компонент ---
export function ImagesManagement() {
  const [images, setImages] = useState<ImageAsset[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        setIsLoading(true);
        // Предполагаем, что изображения хранятся в коллекции 'images'
        const imagesQuerySnapshot = await getDocs(collection(db, "images"));
        const imagesData: ImageAsset[] = imagesQuerySnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate(),
          } as ImageAsset;
        });
        setImages(imagesData);
      } catch (error) {
        console.error("Ошибка загрузки изображений:", error);
        toast.error("Не удалось загрузить изображения");
      } finally {
        setIsLoading(false);
      }
    };

    loadImages();
  }, []);

  const formatBytes = (bytes: number, decimals = 2) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-white">Управление изображениями</h2>
        <Button>
          <Upload className="h-4 w-4 mr-2" />
          Загрузить
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {[...Array(12)].map((_, i) => (
            <Skeleton key={i} className="aspect-square w-full bg-zinc-700" />
          ))}
        </div>
      ) : images.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {images.map((image) => (
            <Card key={image.id} className="overflow-hidden group relative aspect-square">
              <img src={image.url} alt={image.name} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-2">
                <div className="text-xs text-white truncate">
                  <p className="font-bold">{image.name}</p>
                  <p>{formatBytes(image.size)}</p>
                </div>
                 <Button size="icon" variant="ghost" className="absolute top-1 right-1 h-7 w-7">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
              </div>
            </Card>
          ))}
        </div>
      ) : (
         <div className="text-center text-zinc-400 py-20">
          Изображений пока нет.
        </div>
      )}
    </div>
  );
}