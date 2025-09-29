import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

// Типы для структурирования логов
type ActionType = "CREATE" | "UPDATE" | "DELETE" | "LOGIN" | "LOGOUT";
type EntityType = "Карточка" | "Отзыв" | "Изображение" | "Категория" | "Заказ" | "Пользователь" | "Настройки";

interface LogEntry {
  timestamp: any; // Будет заменено на serverTimestamp()
  userId: string;
  userName: string;
  actionType: ActionType;
  entityType: EntityType;
  entityId?: string;
  description: string;
}

/**
 * Записывает действие пользователя в журнал.
 * @param entry - Объект с данными для записи в лог.
 */
export const logActivity = async (entry: Omit<LogEntry, "timestamp">) => {
  try {
    await addDoc(collection(db, "activity_log"), {
      ...entry,
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error("Ошибка при записи в журнал действий:", error);
    // В реальном приложении здесь можно добавить более надежную обработку ошибок,
    // например, отправку отчета в систему мониторинга.
  }
};