"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ImageUploader } from "../ui/image-uploader";
import { toast } from "sonner";

const reviewSchema = z.object({
  authorName: z.string().min(1, "Имя автора обязательно"),
  authorAvatar: z.string().url("Некорректный URL").optional().or(z.literal('')),
  rating: z.preprocess(
    (a) => parseInt(z.string().parse(a), 10),
    z.number().min(1, "Рейтинг не может быть ниже 1").max(5, "Рейтинг не может быть выше 5")
  ),
  text: z.string().min(10, "Отзыв должен содержать минимум 10 символов"),
});

type FormValues = z.infer<typeof reviewSchema>;

interface ReviewFormProps {
  onSave: (data: FormValues) => void;
  onCancel: () => void;
  editingReview?: FormValues;
}

export function ReviewForm({ onSave, onCancel, editingReview }: ReviewFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: editingReview || {
      authorName: "",
      authorAvatar: "",
      rating: 5,
      text: "",
    },
  });

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('type', 'avatar');

      const response = await fetch('/api/upload', { method: 'POST', body });
      if (!response.ok) throw new Error("Ошибка сервера");

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Ошибка загрузки");

      toast.success("Аватар успешно загружен!");
      form.setValue("authorAvatar", result.url, { shouldValidate: true });
      return result.url;
    } catch (error: any) {
      toast.error(error.message || "Не удалось загрузить аватар.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSave)} className="space-y-4">
        <FormField
          control={form.control}
          name="authorName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Имя автора</FormLabel>
              <FormControl><Input placeholder="Иван Иванов" {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="rating"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Рейтинг</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                <SelectContent>
                  {[5, 4, 3, 2, 1].map(r => <SelectItem key={r} value={String(r)}>{r} звезд</SelectItem>)}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="text"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Текст отзыва</FormLabel>
              <FormControl><Textarea placeholder="Ваш отзыв..." {...field} /></FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="authorAvatar"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Аватар</FormLabel>
              <FormControl>
                <ImageUploader
                  label="Загрузить аватар"
                  imageUrl={field.value || null}
                  onUpload={handleImageUpload}
                  onRemove={() => form.setValue("authorAvatar", "", { shouldValidate: true })}
                  setFormValue={(url) => form.setValue("authorAvatar", url, { shouldValidate: true })}
                  clearFormValue={() => form.setValue("authorAvatar", "", { shouldValidate: true })}
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-zinc-700">
          <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
          <Button type="submit" disabled={isUploading || !form.formState.isValid}>
            {isUploading ? "Загрузка..." : (editingReview ? "Сохранить изменения" : "Сохранить отзыв")}
          </Button>
        </div>
      </form>
    </Form>
  );
}