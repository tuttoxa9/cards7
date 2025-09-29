"use client";

import { useState, useEffect } from "react";
import { onAuthStateChanged, signOut, User } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { AdminLogin } from "@/components/admin/admin-login";
import { AdminDashboard } from "@/components/admin/admin-dashboard";
import { logActivity } from "@/lib/activity-logger";

export default function AdminPage() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (newUser) => {
      if (newUser && !user && isLoggingIn) {
        await logActivity({
          userId: newUser.uid,
          userName: newUser.email || "Неизвестный пользователь",
          actionType: "LOGIN",
          entityType: "Пользователь",
          description: `Пользователь ${newUser.email || newUser.uid} вошел в систему.`,
        });
        setIsLoggingIn(false); // Сбрасываем флаг после логирования
      }
      setUser(newUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, isLoggingIn]);

  const handleLogin = () => {
    setIsLoggingIn(true);
  };

  const handleLogout = async () => {
    if (auth.currentUser) {
      const currentUser = auth.currentUser;
      try {
        await logActivity({
          userId: currentUser.uid,
          userName: currentUser.email || "Неизвестный пользователь",
          actionType: "LOGOUT",
          entityType: "Пользователь",
          description: `Пользователь ${currentUser.email || currentUser.uid} вышел из системы.`,
        });
        await signOut(auth);
        setUser(null);
      } catch (error) {
        console.error("Ошибка выхода:", error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#18181B] flex items-center justify-center">
        <div className="text-white">Загрузка...</div>
      </div>
    );
  }

  if (!user) {
    return <AdminLogin onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen">
      <AdminDashboard user={user} onLogout={handleLogout} />
    </div>
  );
}
