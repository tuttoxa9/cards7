"use client";

import { AdminGuard } from '@/components/admin-guard';
import { useAuth } from '@/components/auth-context';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  LayoutDashboard,
  CreditCard,
  Image,
  Tags,
  Settings,
  LogOut,
  Users,
  BarChart3,
  Plus,
  Eye
} from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect } from 'react';

export default function AdminPage() {
  const { user, signOut } = useAuth();
  const [stats, setStats] = useState({
    totalCards: 0,
    activeCards: 0,
    totalBanners: 0,
    activeBanners: 0,
  });

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Ошибка выхода:', error);
    }
  };

  const adminSections = [
    {
      title: 'Карточки',
      description: 'Управление коллекционными карточками',
      icon: CreditCard,
      href: '/admin/cards',
      color: 'bg-blue-600',
      stats: `${stats.activeCards} из ${stats.totalCards} активных`,
    },
    {
      title: 'Баннеры',
      description: 'Управление баннерами и рекламными блоками',
      icon: Image,
      href: '/admin/banners',
      color: 'bg-purple-600',
      stats: `${stats.activeBanners} из ${stats.totalBanners} активных`,
    },
    {
      title: 'Категории',
      description: 'Управление категориями товаров',
      icon: Tags,
      href: '/admin/categories',
      color: 'bg-green-600',
      stats: 'Настройка разделов',
    },
    {
      title: 'Настройки сайта',
      description: 'Общие настройки и информация о сайте',
      icon: Settings,
      href: '/admin/settings',
      color: 'bg-orange-600',
      stats: 'Конфигурация',
    },
    {
      title: 'Аналитика',
      description: 'Статистика и отчеты',
      icon: BarChart3,
      href: '/admin/analytics',
      color: 'bg-indigo-600',
      stats: 'Просмотр данных',
    },
  ];

  return (
    <AdminGuard>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
        {/* Header */}
        <header className="bg-gray-900/50 border-b border-gray-700 backdrop-blur-sm">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
                    <LayoutDashboard className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h1 className="text-xl font-bold text-white">CardVault Admin</h1>
                    <p className="text-sm text-gray-400">Панель администратора</p>
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <Link href="/" target="_blank">
                  <Button variant="outline" size="sm" className="border-gray-600 text-gray-300 hover:bg-gray-800">
                    <Eye className="w-4 h-4 mr-2" />
                    Посмотреть сайт
                  </Button>
                </Link>
                <div className="text-sm text-gray-300">
                  {user?.email}
                </div>
                <Button
                  onClick={handleSignOut}
                  variant="outline"
                  size="sm"
                  className="border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Выйти
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container mx-auto px-4 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              Добро пожаловать в админ-панель!
            </h2>
            <p className="text-gray-400">
              Управляйте контентом вашего сайта коллекционных карточек
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Карточки</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-400">{stats.totalCards}</div>
                <p className="text-sm text-gray-400">Всего карточек</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Активные</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-400">{stats.activeCards}</div>
                <p className="text-sm text-gray-400">Активных карточек</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Баннеры</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-purple-400">{stats.totalBanners}</div>
                <p className="text-sm text-gray-400">Всего баннеров</p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg text-white">Показ баннеров</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-400">{stats.activeBanners}</div>
                <p className="text-sm text-gray-400">Активных баннеров</p>
              </CardContent>
            </Card>
          </div>

          {/* Admin Sections */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {adminSections.map((section) => {
              const Icon = section.icon;
              return (
                <Link key={section.href} href={section.href}>
                  <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all duration-200 cursor-pointer group">
                    <CardHeader>
                      <div className="flex items-center space-x-3">
                        <div className={`w-12 h-12 ${section.color} rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}>
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-white group-hover:text-gray-200 transition-colors">
                            {section.title}
                          </CardTitle>
                          <CardDescription className="text-gray-400">
                            {section.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-500">{section.stats}</p>
                    </CardContent>
                  </Card>
                </Link>
              );
            })}
          </div>
        </main>
      </div>
    </AdminGuard>
  );
}
