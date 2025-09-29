"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardsManagement } from "./cards-management";
import { SectionsManagement } from "./sections-management";
import { ImagesManagement } from "./images-management";
import { CategoriesManagement } from "./categories-management";
import { ReviewsManagement } from "./reviews-management";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type ActiveTab = "cards" | "sections" | "images" | "categories" | "reviews" | "offers" | "orders";

interface AdminDashboardProps {
  onLogout: () => void;
}

export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<ActiveTab>("cards");

  const renderTabContent = () => {
    switch (activeTab) {
      case "cards":
        return <CardsManagement />;
      case "sections":
        return <SectionsManagement />;
      case "images":
        return <ImagesManagement />;
      case "categories":
        return <CategoriesManagement />;
      case "reviews":
        return <ReviewsManagement />;
      case "offers":
        return (
          <div className="text-center text-zinc-400 py-20">
            Раздел "Предложения" будет добавлен в будущих версиях
          </div>
        );
      case "orders":
        return (
          <div className="text-center text-zinc-400 py-20">
            Раздел "Заказы" будет добавлен в будущих версиях
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#18181B] flex items-start justify-center p-2 sm:p-4 sm:items-center">
      <div className="w-full max-w-7xl min-h-[calc(100vh-16px)] sm:min-h-0 sm:h-[680px] bg-[#27272A] rounded-lg sm:rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex-shrink-0 min-h-[64px] px-3 sm:px-6 py-3 sm:py-0 flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-zinc-700 gap-3 sm:gap-4">
          <h1 className="text-lg sm:text-xl font-bold text-white truncate">
            {activeTab === "cards" && "Карточки"}
            {activeTab === "sections" && "Секции"}
            {activeTab === "images" && "Изображения"}
            {activeTab === "categories" && "Категории"}
            {activeTab === "reviews" && "Отзывы"}
            {activeTab === "offers" && "Предложения"}
            {activeTab === "orders" && "Заказы"}
          </h1>

          <div className="flex items-center gap-2 sm:gap-4 w-full sm:w-auto">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as ActiveTab)} className="w-full sm:w-auto">
              <TabsList className="grid grid-cols-4 sm:grid-cols-7 w-full sm:w-auto bg-[#18181B] p-1 h-auto">
                <TabsTrigger value="cards" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5">Карточки</TabsTrigger>
                <TabsTrigger value="sections" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5">Секции</TabsTrigger>
                <TabsTrigger value="images" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5">Изображения</TabsTrigger>
                <TabsTrigger value="categories" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5">Категории</TabsTrigger>
                <TabsTrigger value="reviews" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5">Отзывы</TabsTrigger>
                <TabsTrigger value="offers" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5">Предложения</TabsTrigger>
                <TabsTrigger value="orders" className="text-xs sm:text-sm whitespace-nowrap px-2 sm:px-3 py-1.5">Заказы</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-zinc-400 hover:text-white flex-shrink-0"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-3 sm:p-6 overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
