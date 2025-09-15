"use client";

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { Banner } from '@/lib/types';
import { BannerService } from '@/lib/firestore';
import { uploadToR2 } from '@/lib/r2';

export default function BannersAdminPage() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    buttonText: '',
    buttonLink: '',
    position: 'hero' as const,
    isActive: true,
  });

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    try {
      setLoading(true);
      const bannersData = await BannerService.getAll();
      setBanners(bannersData);
    } catch (error) {
      console.error('Ошибка загрузки баннеров:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredBanners = banners.filter(banner =>
    banner.title.toLowerCase().includes(searchTerm.toLowerCase())
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
      title: '',
      description: '',
      buttonText: '',
      buttonLink: '',
      position: 'hero',
      isActive: true,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingBanner(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || '',
      buttonText: banner.buttonText || '',
      buttonLink: banner.buttonLink || '',
      position: banner.position,
      isActive: banner.isActive,
    });
    setImagePreview(banner.image);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = editingBanner?.image || '';

      // Загружаем новое изображение если выбрано
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `banners/${Date.now()}.${fileExtension}`;
        imageUrl = await uploadToR2(imageFile, fileName);
      }

      const bannerData = {
        ...formData,
        image: imageUrl,
      };

      if (editingBanner) {
        await BannerService.update(editingBanner.id, bannerData);
      } else {
        await BannerService.create(bannerData);
      }

      await loadBanners();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка сохранения баннера:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (bannerId: string) => {
    if (confirm('Вы уверены, что хотите удалить этот баннер?')) {
      try {
        await BannerService.delete(bannerId);
        await loadBanners();
      } catch (error) {
        console.error('Ошибка удаления баннера:', error);
      }
    }
  };

  const toggleBannerStatus = async (banner: Banner) => {
    try {
      await BannerService.update(banner.id, { isActive: !banner.isActive });
      await loadBanners();
    } catch (error) {
      console.error('Ошибка изменения статуса баннера:', error);
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
                  <h1 className="text-2xl font-bold text-white">Управление баннерами</h1>
                  <p className="text-sm text-gray-400">Создание и редактирование баннеров для сайта</p>
                </div>
              </div>

              <Button onClick={openCreateDialog} className="bg-purple-600 hover:bg-purple-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить баннер
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Search and Filter */}
          <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Поиск баннеров</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Поиск по названию баннера..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-gray-800 border-gray-600 text-white"
                />
              </div>
            </CardContent>
          </Card>

          {/* Banners Table */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Баннеры ({filteredBanners.length})
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
                      <TableHead className="text-gray-300">Позиция</TableHead>
                      <TableHead className="text-gray-300">Статус</TableHead>
                      <TableHead className="text-gray-300">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredBanners.map((banner) => (
                      <TableRow key={banner.id} className="border-gray-700">
                        <TableCell>
                          <div className="w-16 h-12 bg-gray-800 rounded-lg overflow-hidden">
                            {banner.image ? (
                              <img
                                src={banner.image}
                                alt={banner.title}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="w-6 h-6 text-gray-400" />
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {banner.title}
                        </TableCell>
                        <TableCell className="text-gray-300 max-w-xs truncate">
                          {banner.description || 'Нет описания'}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={banner.position === 'hero' ? 'default' : 'secondary'}
                            className={banner.position === 'hero' ? 'bg-purple-600' : 'bg-gray-600'}
                          >
                            {banner.position === 'hero' ? 'Главный' : 'Вторичный'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            size="sm"
                            variant={banner.isActive ? 'default' : 'secondary'}
                            onClick={() => toggleBannerStatus(banner)}
                            className={banner.isActive ? 'bg-green-600 hover:bg-green-700' : 'bg-gray-600 hover:bg-gray-700'}
                          >
                            {banner.isActive ? 'Активен' : 'Неактивен'}
                          </Button>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(banner)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(banner.id)}
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
          <DialogContent className="bg-gray-900 border-gray-700 max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-white">
                {editingBanner ? 'Редактировать баннер' : 'Создать баннер'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingBanner ? 'Изменить данные баннера' : 'Добавить новый баннер на сайт'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white">Изображение баннера</Label>
                <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Предпросмотр"
                        className="w-full h-48 object-cover rounded-lg"
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
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-400">Выберите изображение для баннера</p>
                      <p className="text-sm text-gray-500">Рекомендуемый размер: 1920x600px</p>
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
                <Label className="text-white">Заголовок баннера</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Введите заголовок баннера"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Краткое описание баннера"
                  rows={3}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Текст кнопки</Label>
                  <Input
                    value={formData.buttonText}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonText: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Например: Смотреть каталог"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Ссылка кнопки</Label>
                  <Input
                    value={formData.buttonLink}
                    onChange={(e) => setFormData(prev => ({ ...prev, buttonLink: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="/catalog"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Позиция баннера</Label>
                <Select
                  value={formData.position}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, position: value as any }))}
                >
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="hero">Главный баннер</SelectItem>
                    <SelectItem value="secondary">Вторичный баннер</SelectItem>
                  </SelectContent>
                </Select>
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
                  Активен (отображается на сайте)
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
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {isSubmitting ? 'Сохранение...' : (editingBanner ? 'Обновить' : 'Создать')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
