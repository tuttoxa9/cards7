"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useTheme } from "next-themes";
import { toast } from "sonner";
import { useDrawer } from "@/hooks/use-drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { ActivityLogPanel } from "./activity-log-panel";


// --- Вложенный компонент для подтверждения ---
function ClearCacheConfirmation({ onCancel }: { onCancel: () => void }) {
  const handleClearCache = () => {
    localStorage.clear();
    toast.success("Локальный кэш очищен.", {
      description: "Может потребоваться повторная авторизация.",
    });
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
interface SettingsPanelProps {
  user: User;
}

export function SettingsPanel({ user }: SettingsPanelProps) {
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
    projectId: db.app.options.projectId || "unknown",
    lastChecked: null,
  });

  const { openDrawer } = useDrawer();

  const handleCheckConnection = async () => {
    setIsChecking(true);
    setConnectionStatus(prev => ({ ...prev, status: null }));
    const startTime = Date.now();

    try {
      await getDoc(doc(db, "__health-check__", "ping"));
      const endTime = Date.now();

      setConnectionStatus({
        ...connectionStatus,
        status: "Успешно",
        latency: endTime - startTime,
        lastChecked: new Date().toLocaleString(),
      });
      toast.success("Соединение с Firestore установлено.");

    } catch (error: any) {
      const endTime = Date.now();
      console.error("Firestore connection check failed:", error);
      setConnectionStatus({
        ...connectionStatus,
        status: "Ошибка",
        latency: endTime - startTime,
        lastChecked: new Date().toLocaleString(),
      });
      toast.error("Ошибка соединения с Firestore.", { description: error.message });
    } finally {
      setIsChecking(false);
    }
  };

  const openClearCacheConfirmation = () => {
     openDrawer(
      ClearCacheConfirmation,
      { onCancel: () => openDrawer(SettingsPanel, { user }, { size: "default", title: "Настройки" }) },
      { size: "default", title: "Подтверждение" }
    );
  }

  return (
    <Tabs defaultValue="settings" className="w-full">
      <TabsList className="grid w-full grid-cols-2 bg-[#18181B] p-1 h-auto mb-4">
        <TabsTrigger value="settings">Настройки</TabsTrigger>
        <TabsTrigger value="activity_log">Журнал действий</TabsTrigger>
      </TabsList>

      <TabsContent value="settings">
        <Tabs defaultValue="connection" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-[#18181B] p-1 h-auto mb-4">
            <TabsTrigger value="connection">Подключение</TabsTrigger>
            <TabsTrigger value="interface">Интерфейс</TabsTrigger>
            <TabsTrigger value="maintenance">Обслуживание</TabsTrigger>
          </TabsList>

          <TabsContent value="connection" className="space-y-6 p-1">
            <div className="flex items-center gap-2 text-sm">
              <span className={`h-2 w-2 rounded-full ${connectionStatus.status === "Успешно" ? 'bg-green-500 animate-pulse' : 'bg-gray-500'}`}></span>
              <span>Статус: {connectionStatus.status ?? "Неизвестно"}</span>
            </div>
            <Button onClick={handleCheckConnection} disabled={isChecking} className="w-full">
              {isChecking ? "Проверка..." : "Проверить соединение"}
            </Button>
            {isChecking && <Progress value={50} className="w-full h-1 bg-blue-600 animate-pulse" />}

            {connectionStatus.lastChecked && !isChecking && (
              <div className="text-xs text-zinc-400 space-y-1 bg-zinc-800/50 p-3 rounded-md">
                <p>Статус: <span className={`font-mono ${connectionStatus.status === 'Успешно' ? 'text-green-400' : 'text-red-400'}`}>{connectionStatus.status}</span></p>
                {connectionStatus.latency !== null && <p>Задержка: <span className="font-mono">{connectionStatus.latency} ms</span></p>}
                <p>Project ID: <span className="font-mono">{connectionStatus.projectId}</span></p>
                <p>Последняя проверка: <span className="font-mono">{connectionStatus.lastChecked}</span></p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="interface" className="space-y-4 p-1">
            <div className="flex items-center justify-between p-2 rounded-md hover:bg-zinc-800/50">
              <Label htmlFor="theme-switch" className="cursor-pointer">Темная тема</Label>
              <Switch
                id="theme-switch"
                checked={theme === 'dark'}
                onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
              />
            </div>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-4 p-1">
            <Button variant="outline" className="w-full" onClick={openClearCacheConfirmation}>
              Очистить локальный кэш
            </Button>
          </TabsContent>
        </Tabs>
      </TabsContent>

      <TabsContent value="activity_log">
        <ActivityLogPanel user={user} />
      </TabsContent>
    </Tabs>
  );
}