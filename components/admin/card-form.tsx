"use client";

import { useState, useEffect } from "react";
import { X, ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { collection, getDocs, query, where, getDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { ImageUploader } from "../ui/image-uploader";
import { toast } from "sonner";

const cardSchema = z.object({
  title: z.string().min(1, "Название обязательно для заполнения"),
  name: z.string(),
  price: z.preprocess(
    (a) => parseFloat(z.string().parse(a)),
    z.number().positive("Цена должна быть положительным числом")
  ),
  originalPrice: z.preprocess(
    (a) => (a === "" || a === undefined) ? undefined : parseFloat(z.string().parse(a)),
    z.number().positive("Цена должна быть положительным числом").optional()
  ),
  category: z.string().min(1, "Категория обязательна для выбора"),
  description: z.string().optional(),
  rarity: z.enum(["common", "rare", "epic", "legendary"]),
  inStock: z.boolean(),
  isHot: z.boolean(),
  isFeatured: z.boolean(),
  imageUrl: z.string().url("Некорректный URL изображения").optional(),
  image: z.string().optional(),
  bannerImageUrl: z.string().url("Некорректный URL изображения").optional(),
  carouselImageUrl: z.string().url("Некорректный URL изображения").optional(),
  cardBackImageUrl: z.string().optional(),
});

type CardFormValues = z.infer<typeof cardSchema>;

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

interface CardFormProps {
  onCancel: () => void;
  onSave: (card: Omit<Card, "id">) => void;
  editingCard?: Card | null;
}

export function CardForm({ onCancel, onSave, editingCard }: CardFormProps) {
  const form = useForm<CardFormValues>({
    resolver: zodResolver(cardSchema),
    defaultValues: {
      title: "",
      name: "",
      price: 0,
      originalPrice: undefined,
      category: "",
      description: "",
      rarity: "common",
      inStock: true,
      isHot: false,
      isFeatured: false,
      imageUrl: "",
      image: "",
      bannerImageUrl: "",
      carouselImageUrl: "",
      cardBackImageUrl: "none",
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const [backgroundImages, setBackgroundImages] = useState<Array<{id: string, name: string, imageUrl: string}>>([]);
  const [categories, setCategories] = useState<Array<{id: string, name: string}>>([]);

  useEffect(() => {
    if (editingCard) {
      form.reset({
        ...editingCard,
        originalPrice: editingCard.originalPrice || undefined,
      });
    } else {
      form.reset({
        title: "",
        name: "",
        price: 0,
        originalPrice: undefined,
        category: "",
        description: "",
        rarity: "common",
        inStock: true,
        isHot: false,
        isFeatured: false,
        imageUrl: "",
        image: "",
        bannerImageUrl: "",
        carouselImageUrl: "",
        cardBackImageUrl: "none",
      });
    }
  }, [editingCard, form]);

  useEffect(() => {
    const loadBackgroundImages = async () => {
      try {
        const q = query(collection(db, "backgroundImages"), where("isActive", "==", true));
        const querySnapshot = await getDocs(q);
        const images: Array<{id: string, name: string, imageUrl: string}> = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          images.push({ id: doc.id, name: data.name, imageUrl: data.imageUrl });
        });
        setBackgroundImages(images);
      } catch (error) {
        console.error("Ошибка загрузки фоновых изображений:", error);
      }
    };

    const loadCategories = async () => {
      try {
        const categoriesDoc = await getDoc(doc(db, "settings", "categories"));
        if (categoriesDoc.exists()) {
          const data = categoriesDoc.data();
          const categoriesList = data.list || [];
          const categoriesData: Array<{id: string, name: string}> = categoriesList.map((name: string, index: number) => ({ id: `cat_${index}`, name: name }));
          setCategories(categoriesData);
        }
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      }
    };

    loadBackgroundImages();
    loadCategories();
  }, []);

  function onSubmit(data: CardFormValues) {
    const cardData = {
      ...data,
      name: data.title,
    };
    onSave(cardData as any);
  }

  const handleImageUpload = async (file: File, type: 'card' | 'banner' | 'carousel'): Promise<string | null> => {
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('type', type);
      const response = await fetch('/api/upload', { method: 'POST', body });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Не удалось получить детали ошибки' }));
        throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
      }
      const result = await response.json();
      if (!result.success) throw new Error(result.error || 'Произошла ошибка при загрузке');
      toast.success("Изображение успешно загружено!");
      return result.url;
    } catch (error: any) {
      console.error('Ошибка загрузки изображения:', error);
      toast.error(error.message || 'Не удалось загрузить изображение.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const rarities = [
    { value: "common", label: "Обычная" },
    { value: "rare", label: "Редкая" },
    { value: "epic", label: "Эпическая" },
    { value: "legendary", label: "Легендарная" }
  ];

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex flex-col h-full">
        <div className="flex-1 space-y-4">
          <Tabs defaultValue="main" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-[#18181B] p-1 h-auto mb-4">
              <TabsTrigger value="main">Основное</TabsTrigger>
              <TabsTrigger value="prices">Цены и атрибуты</TabsTrigger>
              <TabsTrigger value="images">Изображения</TabsTrigger>
            </TabsList>

            <TabsContent value="main" className="space-y-4">
              <FormField control={form.control} name="title" render={({ field }) => (
                <FormItem>
                  <FormLabel>Название карточки *</FormLabel>
                  <FormControl><Input placeholder="Введите название карточки" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="category" render={({ field }) => (
                <FormItem>
                  <FormLabel>Категория *</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder={categories.length === 0 ? "Загрузка..." : "Выберите категорию"} /></SelectTrigger></FormControl>
                    <SelectContent>{categories.map((cat) => (<SelectItem key={cat.id} value={cat.name}>{cat.name}</SelectItem>))}</SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />
              <FormField control={form.control} name="description" render={({ field }) => (
                <FormItem>
                  <FormLabel>Описание</FormLabel>
                  <FormControl><Textarea placeholder="Введите описание карточки" className="min-h-[120px] resize-y" {...field} /></FormControl>
                  <FormMessage />
                </FormItem>
              )} />
            </TabsContent>

            <TabsContent value="prices" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
                <FormField control={form.control} name="price" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Цена (BYN) *</FormLabel>
                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="originalPrice" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Старая цена (BYN)</FormLabel>
                    <FormControl><Input type="number" placeholder="0.00" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="space-y-2 pt-2">
                <FormField control={form.control} name="rarity" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Редкость</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl><SelectTrigger className="md:max-w-xs"><SelectValue placeholder="Выберите редкость" /></SelectTrigger></FormControl>
                      <SelectContent>{rarities.map((rarity) => (<SelectItem key={rarity.value} value={rarity.value}>{rarity.label}</SelectItem>))}</SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )} />
              </div>
              <div className="space-y-4 pt-4">
                <FormLabel>Дополнительные параметры</FormLabel>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <FormField control={form.control} name="inStock" render={({ field }) => (<FormItem className="flex items-center space-x-3 p-2 rounded-md bg-zinc-900/50"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="cursor-pointer !mt-0">В наличии</FormLabel></FormItem>)} />
                  <FormField control={form.control} name="isHot" render={({ field }) => (<FormItem className="flex items-center space-x-3 p-2 rounded-md bg-zinc-900/50"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="cursor-pointer !mt-0">Хит продаж</FormLabel></FormItem>)} />
                  <FormField control={form.control} name="isFeatured" render={({ field }) => (<FormItem className="flex items-center space-x-3 p-2 rounded-md bg-zinc-900/50"><FormControl><Switch checked={field.value} onCheckedChange={field.onChange} /></FormControl><FormLabel className="cursor-pointer !mt-0">На главной</FormLabel></FormItem>)} />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="images">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <FormField control={form.control} name="imageUrl" render={({ field }) => (<FormItem><ImageUploader label="Основное изображение" imageUrl={field.value || null} onUpload={(file) => handleImageUpload(file, 'card')} onRemove={() => field.onChange("")} setFormValue={(url) => { form.setValue("imageUrl", url); form.setValue("image", url); }} clearFormValue={() => { form.setValue("imageUrl", ""); form.setValue("image", ""); }} /></FormItem>)} />
                 <FormField control={form.control} name="bannerImageUrl" render={({ field }) => (<FormItem><ImageUploader label="Баннер для главной" imageUrl={field.value || null} onUpload={(file) => handleImageUpload(file, 'banner')} onRemove={() => field.onChange("")} setFormValue={(url) => form.setValue("bannerImageUrl", url)} clearFormValue={() => form.setValue("bannerImageUrl", "")} /></FormItem>)} />
                 <FormField control={form.control} name="carouselImageUrl" render={({ field }) => (<FormItem><ImageUploader label="Изображение для карусели" imageUrl={field.value || null} onUpload={(file) => handleImageUpload(file, 'carousel')} onRemove={() => field.onChange("")} setFormValue={(url) => form.setValue("carouselImageUrl", url)} clearFormValue={() => form.setValue("carouselImageUrl", "")} /></FormItem>)} />
                 <FormField control={form.control} name="cardBackImageUrl" render={({ field }) => (
                   <FormItem>
                     <FormLabel>Задник карточки</FormLabel>
                     <div className="border-2 border-dashed border-zinc-600 rounded-lg p-4 h-48 flex flex-col justify-center items-center text-center">
                       {field.value && field.value !== 'none' ? (
                         <div className="relative group w-full h-full">
                           <img src={field.value} alt="Задник" className="w-full h-full object-contain rounded-md" />
                           <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                              <Button size="sm" variant="destructive" onClick={() => field.onChange("none")}>
                                 <X className="w-4 h-4 mr-2" />
                                 Убрать
                               </Button>
                           </div>
                         </div>
                       ) : (
                         <div className="w-full space-y-2">
                            <ImageIcon className="w-8 h-8 mx-auto text-zinc-400" />
                            <p className="text-sm text-zinc-400">Выберите задник</p>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                             <FormControl><SelectTrigger><SelectValue placeholder="Без задника" /></SelectTrigger></FormControl>
                             <SelectContent>
                               <SelectItem value="none">Без задника</SelectItem>
                               {backgroundImages.map((image) => (<SelectItem key={image.id} value={image.imageUrl}>{image.name}</SelectItem>))}
                             </SelectContent>
                           </Select>
                         </div>
                       )}
                     </div>
                     <FormMessage />
                   </FormItem>
                 )} />
               </div>
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex-shrink-0 pt-6 border-t border-zinc-700 flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
          <Button type="submit" className="bg-blue-600 hover:bg-blue-700" disabled={isUploading || !form.formState.isValid}>
            {isUploading ? "Загрузка..." : (editingCard ? "Сохранить изменения" : "Добавить карточку")}
          </Button>
        </div>
      </form>
    </Form>
  );
}