"use client";

import { useState } from "react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardsManagement } from "./cards-management";
import { SectionsManagement } from "./sections-management";
import { ImagesManagement } from "./images-management";
import { CategoriesManagement } from "./categories-management";
import { Separator } from "@/components/ui/separator";

type ActiveTab = "cards" | "sections" | "images" | "categories" | "offers" | "orders";

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
    <div className="min-h-screen bg-[#18181B] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl h-[680px] bg-[#27272A] rounded-2xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-zinc-700">
          <h1 className="text-xl font-bold text-white">
            {activeTab === "cards" && "Карточки товаров"}
            {activeTab === "sections" && "Секции главной страницы"}
            {activeTab === "images" && "Изображения"}
            {activeTab === "categories" && "Категории"}
            {activeTab === "offers" && "Предложения"}
            {activeTab === "orders" && "Заказы"}
          </h1>

          <div className="flex items-center gap-4">
            {/* Сегментированная навигация */}
            <div className="flex bg-[#18181B] rounded-lg p-1">
              <button
                onClick={() => setActiveTab("cards")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "cards"
                    ? "bg-[#27272A] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Карточки
              </button>
              <button
                onClick={() => setActiveTab("sections")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "sections"
                    ? "bg-[#27272A] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Секции
              </button>
              <button
                onClick={() => setActiveTab("images")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "images"
                    ? "bg-[#27272A] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Изображения
              </button>
              <button
                onClick={() => setActiveTab("categories")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "categories"
                    ? "bg-[#27272A] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Категории
              </button>
              <button
                onClick={() => setActiveTab("offers")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "offers"
                    ? "bg-[#27272A] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Предложения
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "orders"
                    ? "bg-[#27272A] text-white"
                    : "text-zinc-400 hover:text-white"
                }`}
              >
                Заказы
              </button>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="text-zinc-400 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="p-6 h-[calc(680px-64px)] overflow-auto">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}
