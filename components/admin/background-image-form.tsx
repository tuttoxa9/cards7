"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "../ui/image-uploader";
import { toast } from "sonner";

const formSchema = z.object({
  name: z.string().min(1, "Название обязательно"),
  imageUrl: z.string().url("Требуется загрузить изображение"),
});

type FormValues = z.infer<typeof formSchema>;

interface BackgroundImageFormProps {
  onSave: (data: FormValues & { isActive: boolean }) => void;
  onCancel: () => void;
}

export function BackgroundImageForm({ onSave, onCancel }: BackgroundImageFormProps) {
  const [isUploading, setIsUploading] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", imageUrl: "" },
  });

  const handleImageUpload = async (file: File): Promise<string | null> => {
    setIsUploading(true);
    try {
      const body = new FormData();
      body.append('file', file);
      body.append('type', 'background');

      const response = await fetch('/api/upload', { method: 'POST', body });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Не удалось получить детали ошибки' }));
        throw new Error(errorData.error || `Ошибка сервера: ${response.status}`);
      }

      const result = await response.json();
      if (!result.success) throw new Error(result.error || "Ошибка загрузки");

      toast.success("Изображение успешно загружено!");
      form.setValue("imageUrl", result.url, { shouldValidate: true });
      return result.url;
    } catch (error: any) {
      toast.error(error.message || "Не удалось загрузить изображение.");
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  function onSubmit(data: FormValues) {
    onSave({ ...data, isActive: true });
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Название задника</FormLabel>
              <FormControl>
                <Input placeholder="Например, 'Огненный фон'" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="imageUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Изображение</FormLabel>
              <FormControl>
                <ImageUploader
                  label="Загрузить задник"
                  imageUrl={field.value || null}
                  onUpload={(file) => handleImageUpload(file)}
                  onRemove={() => form.setValue("imageUrl", "", { shouldValidate: true })}
                  setFormValue={(url) => form.setValue("imageUrl", url, { shouldValidate: true })}
                  clearFormValue={() => form.setValue("imageUrl", "", { shouldValidate: true })}
                />
              </FormControl>
               <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-3 pt-4 mt-4 border-t border-zinc-700">
          <Button type="button" variant="outline" onClick={onCancel}>Отмена</Button>
          <Button type="submit" disabled={isUploading || !form.formState.isValid}>
            {isUploading ? "Загрузка..." : "Сохранить"}
          </Button>
        </div>
      </form>
    </Form>
  );
}