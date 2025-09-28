"use client";

import { useState, useEffect } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { X, Plus, Save } from "lucide-react";

export function CategoriesManagement() {
  const [categories, setCategories] = useState<string[]>([]);
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // Загрузка категорий из Firestore
  useEffect(() => {
    const loadCategories = async () => {
      try {
        setIsLoading(true);
        const categoriesDoc = await getDoc(doc(db, "settings", "categories"));
        if (categoriesDoc.exists()) {
          const data = categoriesDoc.data();
          setCategories(data.list || []);
        }
      } catch (error) {
        console.error("Ошибка загрузки категорий:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCategories();
  }, []);

  // Добавить новую категорию
  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories([...categories, newCategory.trim()]);
      setNewCategory("");
    }
  };

  // Удалить категорию
  const removeCategory = (categoryToRemove: string) => {
    setCategories(categories.filter(cat => cat !== categoryToRemove));
  };

  // Сохранить изменения в Firestore
  const saveCategories = async () => {
    try {
      setIsSaving(true);
      await setDoc(doc(db, "settings", "categories"), {
        list: categories,
        updatedAt: new Date()
      });
      alert("Категории успешно сохранены!");
    } catch (error) {
      console.error("Ошибка сохранения категорий:", error);
      alert("Ошибка сохранения категорий");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-400">Загрузка категорий...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="bg-[#18181B] border-zinc-700">
        <CardHeader>
          <CardTitle className="text-white">Управление категориями</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Добавление новой категории */}
          <div className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="Введите название новой категории"
              className="bg-[#27272A] border-zinc-700 text-white"
              onKeyPress={(e) => e.key === "Enter" && addCategory()}
            />
            <Button
              onClick={addCategory}
              disabled={!newCategory.trim() || categories.includes(newCategory.trim())}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-1" />
              Добавить
            </Button>
          </div>

          {/* Список категорий */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium text-zinc-300">
              Текущие категории ({categories.length}):
            </h3>
            <div className="flex flex-wrap gap-2">
              {categories.length === 0 ? (
                <div className="text-zinc-500 text-sm">Нет добавленных категорий</div>
              ) : (
                categories.map((category, index) => (
                  <Badge
                    key={index}
                    variant="secondary"
                    className="bg-[#27272A] text-white border-zinc-700 px-3 py-1 text-sm"
                  >
                    {category}
                    <button
                      onClick={() => removeCategory(category)}
                      className="ml-2 text-zinc-400 hover:text-red-400 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Кнопка сохранения */}
          <div className="pt-4">
            <Button
              onClick={saveCategories}
              disabled={isSaving}
              className="bg-green-600 hover:bg-green-700"
            >
              <Save className="w-4 h-4 mr-1" />
              {isSaving ? "Сохранение..." : "Сохранить изменения"}
            </Button>
          </div>

          {/* Подсказка */}
          <div className="text-xs text-zinc-500 mt-4">
            <p>💡 <strong>Подсказка:</strong> Категории будут отображаться в качестве фильтров на главной странице в разделе "Лидеры продаж".</p>
            <p>• Нажмите Enter в поле ввода для быстрого добавления категории</p>
            <p>• Кликните по ✕ рядом с категорией для её удаления</p>
            <p>• Не забудьте сохранить изменения!</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
