"use client";

import { useState, useEffect } from 'react';
import { AdminGuard } from '@/components/admin-guard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image as ImageIcon
} from 'lucide-react';
import Link from 'next/link';
import { SiteSettings } from '@/lib/types';
import { SiteSettingsService } from '@/lib/firestore';
import { uploadToR2 } from '@/lib/r2';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function SettingsAdminPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [faviconPreview, setFaviconPreview] = useState<string>('');

  const [formData, setFormData] = useState({
    siteName: '',
    siteDescription: '',
    contactEmail: '',
    phone: '',
    address: '',
    socialLinks: {
      vk: '',
      telegram: '',
      instagram: '',
      youtube: '',
    },
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      setLoading(true);
      const settings = await SiteSettingsService.get();
      if (settings) {
        setFormData({
          siteName: settings.siteName,
          siteDescription: settings.siteDescription,
          contactEmail: settings.contactEmail,
          phone: settings.phone || '',
          address: settings.address || '',
          socialLinks: settings.socialLinks || {
            vk: '',
            telegram: '',
            instagram: '',
            youtube: '',
          },
        });
        setLogoPreview(settings.logo || '');
        setFaviconPreview(settings.favicon || '');
      }
    } catch (error) {
      console.error('Ошибка загрузки настроек:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFaviconChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFaviconFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setFaviconPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      let logoUrl = logoPreview;
      let faviconUrl = faviconPreview;

      // Загружаем новый логотип если выбран
      if (logoFile) {
        const fileExtension = logoFile.name.split('.').pop();
        const fileName = `site/logo.${fileExtension}`;
        logoUrl = await uploadToR2(logoFile, fileName);
      }

      // Загружаем новый favicon если выбран
      if (faviconFile) {
        const fileExtension = faviconFile.name.split('.').pop();
        const fileName = `site/favicon.${fileExtension}`;
        faviconUrl = await uploadToR2(faviconFile, fileName);
      }

      const settingsData = {
        ...formData,
        logo: logoUrl || undefined,
        favicon: faviconUrl || undefined,
      };

      await SiteSettingsService.createOrUpdate(settingsData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Ошибка сохранения настроек:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleSocialChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: {
        ...prev.socialLinks,
        [platform]: value,
      },
    }));
  };

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
        </div>
      </AdminGuard>
    );
  }

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
                  <h1 className="text-2xl font-bold text-white">Настройки сайта</h1>
                  <p className="text-sm text-gray-400">Общие настройки и информация о сайте</p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8 max-w-4xl">
          {showSuccess && (
            <Alert className="mb-6 border-green-600 bg-green-900/20">
              <AlertDescription className="text-green-400">
                Настройки успешно сохранены!
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Site Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Globe className="w-5 h-5 mr-2" />
                  Основная информация
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Основные данные о вашем сайте
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">Название сайта</Label>
                    <Input
                      value={formData.siteName}
                      onChange={(e) => setFormData(prev => ({ ...prev, siteName: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="CardVault"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Email для связи</Label>
                    <Input
                      type="email"
                      value={formData.contactEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="info@cardvault.ru"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-white">Описание сайта</Label>
                  <Textarea
                    value={formData.siteDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, siteDescription: e.target.value }))}
                    className="bg-gray-800 border-gray-600 text-white"
                    placeholder="Эксклюзивные коллекционные карточки премиум качества"
                    rows={3}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            {/* Visual Assets */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2" />
                  Визуальные элементы
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Логотип и favicon сайта
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Logo Upload */}
                <div className="space-y-2">
                  <Label className="text-white">Логотип сайта</Label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                    {logoPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={logoPreview}
                          alt="Логотип"
                          className="h-16 object-contain bg-gray-800 rounded-lg"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2"
                          onClick={() => {
                            setLogoFile(null);
                            setLogoPreview('');
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Выберите логотип</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoChange}
                      className="mt-2 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>

                {/* Favicon Upload */}
                <div className="space-y-2">
                  <Label className="text-white">Favicon (иконка сайта)</Label>
                  <div className="border-2 border-dashed border-gray-600 rounded-lg p-4">
                    {faviconPreview ? (
                      <div className="relative inline-block">
                        <img
                          src={faviconPreview}
                          alt="Favicon"
                          className="w-8 h-8 object-contain bg-gray-800 rounded"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="destructive"
                          className="absolute -top-2 -right-2"
                          onClick={() => {
                            setFaviconFile(null);
                            setFaviconPreview('');
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <div className="text-center">
                        <Upload className="w-6 h-6 text-gray-400 mx-auto mb-2" />
                        <p className="text-gray-400 text-sm">Выберите favicon (16x16 или 32x32 px)</p>
                      </div>
                    )}
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFaviconChange}
                      className="mt-2 bg-gray-800 border-gray-600 text-white"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Mail className="w-5 h-5 mr-2" />
                  Контактная информация
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Дополнительная контактная информация
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <Phone className="w-4 h-4 mr-2" />
                      Телефон
                    </Label>
                    <Input
                      value={formData.phone}
                      onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="+7 (999) 123-45-67"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      Адрес
                    </Label>
                    <Input
                      value={formData.address}
                      onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="г. Москва, ул. Примерная, д. 123"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Социальные сети</CardTitle>
                <CardDescription className="text-gray-400">
                  Ссылки на ваши социальные сети
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-white">ВКонтакте</Label>
                    <Input
                      value={formData.socialLinks.vk}
                      onChange={(e) => handleSocialChange('vk', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://vk.com/your_page"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Telegram</Label>
                    <Input
                      value={formData.socialLinks.telegram}
                      onChange={(e) => handleSocialChange('telegram', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://t.me/your_channel"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">Instagram</Label>
                    <Input
                      value={formData.socialLinks.instagram}
                      onChange={(e) => handleSocialChange('instagram', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://instagram.com/your_account"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-white">YouTube</Label>
                    <Input
                      value={formData.socialLinks.youtube}
                      onChange={(e) => handleSocialChange('youtube', e.target.value)}
                      className="bg-gray-800 border-gray-600 text-white"
                      placeholder="https://youtube.com/@your_channel"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button
                type="submit"
                disabled={saving}
                className="bg-orange-600 hover:bg-orange-700 min-w-32"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Сохранение...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Сохранить настройки
                  </>
                )}
              </Button>
            </div>
          </form>
        </main>
      </div>
    </AdminGuard>
  );
}
