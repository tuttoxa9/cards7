"use client"

import { useState, useEffect } from "react"
import { User } from "firebase/auth"
import { collection, query, orderBy, onSnapshot, doc, updateDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { format } from "date-fns"
import { ru } from "date-fns/locale"

interface OrderItem {
  cardId: string
  title: string
  price: number
  quantity: number
}

interface Order {
  id: string
  customer: {
    name: string
    phone: string
  }
  items: OrderItem[]
  totals: {
    totalAmount: number
    discountAmount: number
  }
  status: 'pending' | 'processing' | 'shipped' | 'completed' | 'cancelled'
  createdAt: any // Firestore Timestamp
}

interface OrdersManagementProps {
  user: User
}

const statusMap = {
  pending: { label: "Новый", color: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" },
  processing: { label: "В обработке", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  shipped: { label: "Отправлен", color: "bg-purple-500/10 text-purple-500 border-purple-500/20" },
  completed: { label: "Выполнен", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  cancelled: { label: "Отменен", color: "bg-red-500/10 text-red-500 border-red-500/20" },
}

export function OrdersManagement({ user }: OrdersManagementProps) {
  const [orders, setOrders] = useState<Order[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedOrders: Order[] = []
      snapshot.forEach((doc) => {
        fetchedOrders.push({ id: doc.id, ...doc.data() } as Order)
      })
      setOrders(fetchedOrders)
      setIsLoading(false)
    }, (error) => {
      console.error("Ошибка при получении заказов:", error)
      toast.error("Не удалось загрузить заказы")
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      const orderRef = doc(db, "orders", orderId)
      await updateDoc(orderRef, {
        status: newStatus
      })
      toast.success("Статус заказа обновлен")
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error)
      toast.error("Не удалось обновить статус")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Управление заказами</h2>
        <Badge variant="outline" className="text-zinc-400 border-zinc-700">
          Всего заказов: {orders.length}
        </Badge>
      </div>

      {orders.length === 0 ? (
        <div className="text-center text-zinc-500 py-12 bg-[#1C1C24] rounded-lg border border-zinc-800">
          Заказов пока нет
        </div>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-[#1C1C24] p-5 rounded-xl border border-zinc-800 flex flex-col lg:flex-row gap-6">

              {/* Левая колонка: Основная инфа */}
              <div className="flex-1 space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-zinc-400 text-sm">#{order.id.slice(-6).toUpperCase()}</span>
                  <Badge className={`border font-medium ${statusMap[order.status]?.color || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                    {statusMap[order.status]?.label || order.status}
                  </Badge>
                  <span className="text-sm text-zinc-500 ml-auto">
                    {order.createdAt ? format(order.createdAt.toDate(), "d MMM yyyy, HH:mm", { locale: ru }) : "Нет даты"}
                  </span>
                </div>

                <div>
                  <h3 className="text-white font-medium text-lg">{order.customer?.name || "Без имени"}</h3>
                  <p className="text-zinc-400 text-sm">{order.customer?.phone || "Без телефона"}</p>
                </div>
              </div>

              {/* Центральная колонка: Состав заказа */}
              <div className="flex-1 bg-zinc-900/50 p-4 rounded-lg border border-zinc-800/50">
                <h4 className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3">Состав заказа</h4>
                <ul className="space-y-2">
                  {order.items?.map((item, idx) => (
                    <li key={idx} className="flex justify-between text-sm">
                      <span className="text-zinc-300">
                        {item.title} <span className="text-zinc-500 ml-1">x{item.quantity}</span>
                      </span>
                      <span className="text-white font-medium ml-4">
                        {(item.price * item.quantity).toLocaleString()} BYN
                      </span>
                    </li>
                  ))}
                </ul>
                <div className="mt-4 pt-3 border-t border-zinc-800 flex justify-between items-center">
                  <span className="text-zinc-400 text-sm">Итого:</span>
                  <span className="text-lg font-bold text-primary">
                    {order.totals?.totalAmount?.toLocaleString()} BYN
                  </span>
                </div>
              </div>

              {/* Правая колонка: Действия */}
              <div className="flex-shrink-0 w-full lg:w-48 flex flex-col justify-start">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                  Изменить статус
                </label>
                <Select
                  value={order.status}
                  onValueChange={(value) => handleStatusChange(order.id, value)}
                >
                  <SelectTrigger className="w-full bg-zinc-900 border-zinc-700 text-white">
                    <SelectValue placeholder="Статус" />
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-900 border-zinc-800 text-white">
                    {Object.entries(statusMap).map(([key, { label }]) => (
                      <SelectItem key={key} value={key} className="focus:bg-zinc-800 cursor-pointer">
                        {label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  )
}
