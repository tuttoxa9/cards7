"use client";

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Upload,
  X,
  Tag
} from 'lucide-react';
import Link from 'next/link';
import { Category } from '@/lib/types';
import { CategoryService } from '@/lib/firestore';
import { uploadToR2 } from '@/lib/r2';

export default function CategoriesAdminPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    isActive: true,
  });

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const categoriesData = await CategoryService.getAll();
      setCategories(categoriesData);
    } catch (error) {
      console.error('Ошибка загрузки категорий:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingCategory(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      description: category.description || '',
      isActive: category.isActive,
    });
    setImagePreview(category.image || '');
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = editingCategory?.image || '';

      // Загружаем новое изображение если выбрано
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `categories/${Date.now()}.${fileExtension}`;
        imageUrl = await uploadToR2(imageFile, fileName);
      }

      const categoryData = {
        ...formData,
        image: imageUrl || undefined,
      };

      if (editingCategory) {
        await CategoryService.update(editingCategory.id, categoryData);
      } else {
        await CategoryService.create(categoryData);
      }

      await loadCategories();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка сохранения категории:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту категорию?')) {
      try {
        await CategoryService.delete(categoryId);
        await loadCategories();
      } catch (error) {
        console.error('Ошибка удаления категории:', error);
      }
    }
  };

  const toggleCategoryStatus = async (category: Category) => {
    try {
      await CategoryService.update(category.id, { isActive: !category.isActive });
      await loadCategories();
    } catch (error) {
      console.error('Ошибка изменения статуса категории:', error);
    }
  };

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
        {/* Header */}
        <header className="bg-gray-900/50 border-b border-gray-700 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link href="/admin">
                  <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Назад
                  </Button>
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-white">Управление категориями</h1>
                  <p className="text-sm text-gray-400">Создание и редактирование категорий товаров</p>
                </div>
              </div>

              <Button onClick={openCreateDialog} className="bg-green-600 hover:bg-green-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить категорию
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Search and Info */}
          <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Поиск категорий</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск по названию категории..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Info Card */}
          <Card className="mb-6 bg-blue-900/20 border-blue-700">
            <CardContent className="pt-6">
              <div className="flex items-start space-x-3">
                <Tag className="w-5 h-5 text-blue-400 mt-0.5" />
                <div>
                  <h3 className="text-blue-300 font-medium mb-1">О категориях</h3>
                  <p className="text-blue-200/80 text-sm">
                    Категории используются для группировки карточек и облегчения навигации пользователей.
                    Активные категории отображаются в фильтрах каталога и на главной странице.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Table */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Категории ({filteredCategories.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto"></div>
                  <p className="text-gray-400 mt-2">Загрузка...</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow className="border-gray-700">
                      <TableHead className="text-gray-300">Изображение</TableHead>
                      <TableHead className="text-gray-300">Название</TableHead>
                      <TableHead className="text-gray-300">Описание</TableHead>
                      <TableHead className="text-gray-300">Статус</TableHead>
                      <TableHead className="text-gray-300">Создана</TableHead>
                      <TableHead className="text-gray-300">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCategories.map((category) => (
                      <TableRow key={category.id} className="border-gray-700">
                        <TableCell>
                          <div className="w-12 h-12 bg-gray-800 rounded-lg overflow-hidden">
                            {category.image ? (
                              <img
                                src={category.image}
                                alt={category.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Tag className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {category.name}
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          {category.description || 'Нет описания'}
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={category.isActive ? 'default' : 'secondary'}
                            onClick={() => toggleCategoryStatus(category)}
                            className={category.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
                          >
                            {category.isActive ? 'Активна' : 'Неактивна'}
                          </Button>
                        </TableCell>
                        <TableCell className="text-gray-400">
                          {category.createdAt.toLocaleDateString('ru-RU')}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(category)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(category.id)}
                              className="text-red-400 hover:text-red-300"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </main>

        {/* Create/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="bg-gray-900 border-gray-700 max-w-lg">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingCategory ? 'Редактировать категорию' : 'Создать категорию'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingCategory ? 'Изменить данные категории' : 'Добавить новую категорию товаров'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white">Изображение категории (необязательно)</Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Предпросмотр"
                        className="w-full h-32 object-cover rounded-lg"
                      />
                      <Button
                        type="button"
                        size="sm"
                        variant="destructive"
                        className="absolute top-2 right-2"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview('');
                        }}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400 text-sm">Выберите изображение</p>
                    </div>
                  )}
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="mt-2 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-2">
                <Label className="text-white">Название категории</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Например: Pokemon, Magic: The Gathering"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Краткое описание категории"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="isActive"
                  checked={formData.isActive}
                  onChange={(e) => setFormData(prev => ({ ...prev, isActive: e.target.checked }))}
                  className="w-4 h-4"
                />
                <Label htmlFor="isActive" className="text-white">
                  Активна (отображается в каталоге)
                </Label>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                  className="border-gray-600 text-gray-300 hover:bg-gray-800"
                >
                  Отмена
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isSubmitting ? 'Сохранение...' : (editingCategory ? 'Обновить' : 'Создать')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
