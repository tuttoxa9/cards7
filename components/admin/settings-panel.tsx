"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useDrawer } from "@/hooks/use-drawer";

// --- Вложенный компонент для подтверждения ---
function ClearCacheConfirmation({ onCancel }: { onCancel: () => void }) {
  const handleClearCache = () => {
    // Здесь должна быть логика очистки кэша, например, localStorage.clear()
    localStorage.clear();
    toast.success("Локальный кэш очищен.", {
      description: "Может потребоваться повторная авторизация.",
    });
    // Можно принудительно перезагрузить страницу
    window.location.reload();
  };

  return (
    <div className="space-y-4 text-center">
      <p className="text-sm text-zinc-300">
        Вы уверены? Это действие необратимо и может потребовать повторной авторизации.
      </p>
      <div className="flex justify-center gap-3">
        <Button variant="outline" onClick={onCancel}>
          Отмена
        </Button>
        <Button variant="destructive" onClick={handleClearCache}>
          Очистить
        </Button>
      </div>
    </div>
  );
}


// --- Основная панель настроек ---
export function SettingsPanel() {
  const { setTheme, theme } = useTheme();
  const [isChecking, setIsChecking] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<{
    status: "Успешно" | "Ошибка" | null;
    latency: number | null;
    projectId: string | null;
    lastChecked: string | null;
  }>({
    status: null,
    latency: null,
    projectId: "your-project-id", // Можно получить из конфигурации Firebase
    lastChecked: null,
  });

  const { openDrawer } = useDrawer();

  const handleCheckConnection = () => {
    setIsChecking(true);
    setConnectionStatus({ ...connectionStatus, status: null });

    // Симуляция проверки соединения
    setTimeout(() => {
      const isSuccess = Math.random() > 0.2; // 80% шанс успеха
      const latency = Math.floor(Math.random() * (150 - 40 + 1)) + 40;

      setConnectionStatus({
        ...connectionStatus,
        status: isSuccess ? "Успешно" : "Ошибка",
        latency: isSuccess ? latency : null,
        lastChecked: new Date().toLocaleString(),
      });
      setIsChecking(false);
      toast.info(`Проверка соединения завершена. Статус: ${isSuccess ? "Успешно" : "Ошибка"}`);
    }, 1500);
  };

  const openClearCacheConfirmation = () => {
     openDrawer(
      ClearCacheConfirmation,
      { onCancel: () => openDrawer(SettingsPanel, {}, { size: "default", title: "Настройки" }) },
      { size: "default", title: "Подтверждение" }
    );
  }

  return (
    <div className="space-y-8 text-white">
      {/* Блок 1: Статус подключения */}
      <div className="space-y-4">
        <h3 className="font-semibold text-zinc-300 border-b border-zinc-700 pb-2">Подключение к Firestore</h3>
        <div className="flex items-center gap-2 text-sm">
          <span className={`h-2 w-2 rounded-full ${connectionStatus.status === "Успешно" ? 'bg-green-500' : 'bg-gray-500'}`}></span>
          <span>{connectionStatus.status ?? "Неизвестно"}</span>
        </div>
        <Button onClick={handleCheckConnection} disabled={isChecking} className="w-full">
          {isChecking ? "Проверка..." : "Проверить соединение"}
        </Button>
        {isChecking && <Progress value={50} className="w-full h-1 bg-blue-600 animate-pulse" />}

        {connectionStatus.status && !isChecking && (
          <div className="text-xs text-zinc-400 space-y-1 bg-zinc-800/50 p-3 rounded-md">
            <p>Статус: <span className="font-mono">{connectionStatus.status}</span></p>
            {connectionStatus.latency && <p>Задержка: <span className="font-mono">{connectionStatus.latency} ms</span></p>}
            <p>Project ID: <span className="font-mono">{connectionStatus.projectId}</span></p>
            <p>Последняя проверка: <span className="font-mono">{connectionStatus.lastChecked}</span></p>
          </div>
        )}
      </div>

      {/* Блок 2: Интерфейс */}
      <div className="space-y-4">
        <h3 className="font-semibold text-zinc-300 border-b border-zinc-700 pb-2">Настройки интерфейса</h3>
        <div className="flex items-center justify-between">
          <Label htmlFor="theme-switch">Темная тема</Label>
          <Switch
            id="theme-switch"
            checked={theme === 'dark'}
            onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
          />
        </div>
      </div>

      {/* Блок 3: Системные действия */}
      <div className="space-y-4">
        <h3 className="font-semibold text-zinc-300 border-b border-zinc-700 pb-2">Обслуживание</h3>
        <Button variant="outline" className="w-full" onClick={openClearCacheConfirmation}>
          Очистить локальный кэш
        </Button>
      </div>
    </div>
  );
}