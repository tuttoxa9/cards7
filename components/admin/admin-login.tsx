"use client";

import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { toast } from "sonner";

interface AdminLoginProps {
  onLogin: () => void;
}

export function AdminLogin({ onLogin }: AdminLoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success("Успешный вход в систему");
      onLogin();
    } catch (error: any) {
      console.error("Ошибка аутентификации:", error);

      // Обработка различных ошибок Firebase
      let errorMessage = "Неверные учетные данные";
      if (error.code === "auth/user-not-found") {
        errorMessage = "Пользователь не найден";
      } else if (error.code === "auth/wrong-password") {
        errorMessage = "Неверный пароль";
      } else if (error.code === "auth/invalid-email") {
        errorMessage = "Неверный формат email";
      } else if (error.code === "auth/too-many-requests") {
        errorMessage = "Слишком много попыток входа. Попробуйте позже";
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#18181B] flex items-center justify-center p-4">
      <Card className="w-full max-w-md p-8 bg-[#27272A] border-zinc-700">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white">Админ-панель</h1>
            <p className="text-zinc-400 mt-2">Войдите в систему управления</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-white">
                Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-[#18181B] border-zinc-600 text-white"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-white">
                Пароль
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-[#18181B] border-zinc-600 text-white"
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={isLoading}
            >
              {isLoading ? "Загрузка..." : "Войти"}
            </Button>
          </form>
        </div>
      </Card>
    </div>
  );
}
