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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Eye,
  ArrowLeft,
  Upload,
  X
} from 'lucide-react';
import Link from 'next/link';
import { Card as CardType } from '@/lib/types';
import { CardService } from '@/lib/firestore';
import { uploadToR2 } from '@/lib/r2';

export default function CardsAdminPage() {
  const [cards, setCards] = useState<CardType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCard, setEditingCard] = useState<CardType | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');

  const [formData, setFormData] = useState({
    title: '',
    price: 0,
    originalPrice: 0,
    category: '',
    section: 'catalog' as const,
    status: 'active' as const,
    description: '',
    rarity: '',
    inStock: true,
    isHot: false,
  });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    try {
      setLoading(true);
      const cardsData = await CardService.getAll();
      setCards(cardsData);
    } catch (error) {
      console.error('Ошибка загрузки карточек:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCards = cards.filter(card =>
    card.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.category.toLowerCase().includes(searchTerm.toLowerCase())
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
      price: 0,
      originalPrice: 0,
      category: '',
      section: 'catalog',
      status: 'active',
      description: '',
      rarity: '',
      inStock: true,
      isHot: false,
    });
    setImageFile(null);
    setImagePreview('');
    setEditingCard(null);
  };

  const openCreateDialog = () => {
    resetForm();
    setIsDialogOpen(true);
  };

  const openEditDialog = (card: CardType) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      price: card.price,
      originalPrice: card.originalPrice || 0,
      category: card.category,
      section: card.section,
      status: card.status,
      description: card.description || '',
      rarity: card.rarity || '',
      inStock: card.inStock,
      isHot: card.isHot || false,
    });
    setImagePreview(card.image);
    setIsDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = editingCard?.image || '';

      // Загружаем новое изображение если выбрано
      if (imageFile) {
        const fileExtension = imageFile.name.split('.').pop();
        const fileName = `cards/${Date.now()}.${fileExtension}`;
        imageUrl = await uploadToR2(imageFile, fileName);
      }

      const cardData = {
        ...formData,
        image: imageUrl,
        discount: formData.originalPrice > formData.price ?
          Math.round(((formData.originalPrice - formData.price) / formData.originalPrice) * 100) :
          undefined,
      };

      if (editingCard) {
        await CardService.update(editingCard.id, cardData);
      } else {
        await CardService.create(cardData);
      }

      await loadCards();
      setIsDialogOpen(false);
      resetForm();
    } catch (error) {
      console.error('Ошибка сохранения карточки:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (cardId: string) => {
    if (confirm('Вы уверены, что хотите удалить эту карточку?')) {
      try {
        await CardService.delete(cardId);
        await loadCards();
      } catch (error) {
        console.error('Ошибка удаления карточки:', error);
      }
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
                  <h1 className="text-2xl font-bold text-white">Управление карточками</h1>
                  <p className="text-sm text-gray-400">Создание, редактирование и удаление карточек</p>
                </div>
              </div>

              <Button onClick={openCreateDialog} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Добавить карточку
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Search and Filter */}
          <Card className="mb-6 bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Поиск и фильтры</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    placeholder="Поиск по названию или категории..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Cards Table */}
          <Card className="bg-gray-900 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">
                Карточки ({filteredCards.length})
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
                      <TableHead className="text-gray-300">Категория</TableHead>
                      <TableHead className="text-gray-300">Цена</TableHead>
                      <TableHead className="text-gray-300">Раздел</TableHead>
                      <TableHead className="text-gray-300">Статус</TableHead>
                      <TableHead className="text-gray-300">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredCards.map((card) => (
                      <TableRow key={card.id} className="border-gray-700">
                        <TableCell>
                          <img
                            src={card.image}
                            alt={card.title}
                            className="w-12 h-12 object-cover rounded-lg"
                          />
                        </TableCell>
                        <TableCell className="text-white font-medium">
                          {card.title}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-gray-600 text-gray-300">
                            {card.category}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-green-400">
                          {card.price.toLocaleString()} ₽
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={card.section === 'new-releases' ? 'destructive' : 'default'}
                            className="capitalize"
                          >
                            {card.section}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={card.status === 'active' ? 'default' : 'secondary'}
                            className={card.status === 'active' ? 'bg-green-600' : 'bg-gray-600'}
                          >
                            {card.status === 'active' ? 'Активна' : 'Неактивна'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openEditDialog(card)}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDelete(card.id)}
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
                {editingCard ? 'Редактировать карточку' : 'Создать карточку'}
              </DialogTitle>
              <DialogDescription className="text-gray-400">
                {editingCard ? 'Изменить данные карточки' : 'Добавить новую карточку в каталог'}
              </DialogDescription>
            </DialogHeader>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Image Upload */}
              <div className="space-y-2">
                <Label className="text-white">Изображение</Label>
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
                      <p className="text-gray-400">Выберите изображение</p>
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
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Название</Label>
                  <Input
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Категория</Label>
                  <Input
                    value={formData.category}
                    onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Цена</Label>
                  <Input
                    type="number"
                    value={formData.price}
                    onChange={(e) => setFormData(prev => ({ ...prev, price: Number(e.target.value) }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Оригинальная цена</Label>
                  <Input
                    type="number"
                    value={formData.originalPrice}
                    onChange={(e) => setFormData(prev => ({ ...prev, originalPrice: Number(e.target.value) }))}
                    className="bg-gray-800 border-gray-600 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-white">Раздел</Label>
                  <Select
                    value={formData.section}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, section: value as any }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="new-releases">Предложения недели</SelectItem>
                      <SelectItem value="best-sellers">Лидеры продаж</SelectItem>
                      <SelectItem value="new-in-catalog">Новое в каталоге</SelectItem>
                      <SelectItem value="catalog">Каталог</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Статус</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, status: value as any }))}
                  >
                    <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border-gray-600">
                      <SelectItem value="active">Активна</SelectItem>
                      <SelectItem value="inactive">Неактивна</SelectItem>
                      <SelectItem value="draft">Черновик</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-white">Редкость</Label>
                <Input
                  value={formData.rarity}
                  onChange={(e) => setFormData(prev => ({ ...prev, rarity: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  placeholder="Например: Бустерпак, Коллекционный набор"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-white">Описание</Label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="bg-gray-800 border-gray-600 text-white"
                  rows={3}
                />
              </div>

              <div className="flex items-center space-x-4">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.inStock}
                    onChange={(e) => setFormData(prev => ({ ...prev, inStock: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-white">В наличии</span>
                </label>

                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.isHot}
                    onChange={(e) => setFormData(prev => ({ ...prev, isHot: e.target.checked }))}
                    className="w-4 h-4"
                  />
                  <span className="text-white">Хит продаж</span>
                </label>
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
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Сохранение...' : (editingCard ? 'Обновить' : 'Создать')}
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </AdminGuard>
  );
}
