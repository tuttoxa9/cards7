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
import { ExternalLink, ImageIcon } from "lucide-react"

interface CustomRequest {
  id: string
  name: string
  contact: string
  description: string
  referenceImagesUrls?: string[]
  status: 'new' | 'in_progress' | 'completed' | 'rejected'
  createdAt: any
}

interface CustomRequestsManagementProps {
  user: User
}

const statusMap = {
  new: { label: "Новая", color: "bg-violet-500/10 text-violet-400 border-violet-500/20" },
  in_progress: { label: "В работе", color: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  completed: { label: "Готово", color: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  rejected: { label: "Отклонена", color: "bg-red-500/10 text-red-500 border-red-500/20" },
}

export function CustomRequestsManagement({ user }: CustomRequestsManagementProps) {
  const [requests, setRequests] = useState<CustomRequest[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const q = query(collection(db, "custom_requests"), orderBy("createdAt", "desc"))

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedRequests: CustomRequest[] = []
      snapshot.forEach((doc) => {
        fetchedRequests.push({ id: doc.id, ...doc.data() } as CustomRequest)
      })
      setRequests(fetchedRequests)
      setIsLoading(false)
    }, (error) => {
      console.error("Ошибка при получении кастомных заявок:", error)
      toast.error("Не удалось загрузить кастомные заявки")
      setIsLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const handleStatusChange = async (requestId: string, newStatus: string) => {
    try {
      const requestRef = doc(db, "custom_requests", requestId)
      await updateDoc(requestRef, {
        status: newStatus
      })
      toast.success("Статус заявки обновлен")
    } catch (error) {
      console.error("Ошибка при обновлении статуса:", error)
      toast.error("Не удалось обновить статус")
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-500"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Кастомные заявки</h2>
        <Badge variant="outline" className="text-violet-400 border-violet-900 bg-violet-900/10">
          Всего заявок: {requests.length}
        </Badge>
      </div>

      {requests.length === 0 ? (
        <div className="text-center text-zinc-500 py-12 bg-[#1C1C24] rounded-lg border border-zinc-800">
          Кастомных заявок пока нет
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((req) => (
            <div key={req.id} className="bg-[#1C1C24] p-5 rounded-xl border border-zinc-800 flex flex-col lg:flex-row gap-6">

              {/* Левая колонка: Основная инфа */}
              <div className="flex-[2] space-y-4">
                <div className="flex flex-wrap items-center gap-3">
                  <span className="font-mono text-zinc-400 text-sm">#{req.id.slice(-6).toUpperCase()}</span>
                  <Badge className={`border font-medium ${statusMap[req.status]?.color || 'bg-zinc-800 text-zinc-300 border-zinc-700'}`}>
                    {statusMap[req.status]?.label || req.status}
                  </Badge>
                  <span className="text-sm text-zinc-500 ml-auto">
                    {req.createdAt ? format(req.createdAt.toDate(), "d MMM yyyy, HH:mm", { locale: ru }) : "Нет даты"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Имя (Никнейм)</label>
                    <p className="text-white font-medium">{req.name || "Без имени"}</p>
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-1">Контакт для связи</label>
                    <p className="text-white font-medium">{req.contact || "Без контакта"}</p>
                  </div>
                </div>

                <div>
                  <label className="text-xs text-zinc-500 uppercase tracking-wider block mb-2">Описание идеи</label>
                  <p className="text-zinc-300 text-sm whitespace-pre-wrap leading-relaxed bg-zinc-900/50 p-3 rounded-lg border border-zinc-800">
                    {req.description}
                  </p>
                </div>
              </div>

              {/* Центральная колонка: Референсы */}
              <div className="flex-1 min-w-[200px] flex flex-col justify-start border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-6">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-3 block">
                  Референсы
                </label>
                {req.referenceImagesUrls && req.referenceImagesUrls.length > 0 ? (
                  <div className="grid grid-cols-2 gap-2">
                    {req.referenceImagesUrls.map((url, idx) => (
                      <a
                        key={idx}
                        href={url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative aspect-square rounded-md overflow-hidden border border-zinc-700 group flex items-center justify-center bg-zinc-900"
                      >
                        <img
                          src={url}
                          alt={`Референс ${idx + 1}`}
                          className="w-full h-full object-cover group-hover:opacity-50 transition-opacity"
                        />
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <ExternalLink className="w-6 h-6 text-white" />
                        </div>
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6 px-4 bg-zinc-900/50 rounded-lg border border-zinc-800 border-dashed text-zinc-500">
                    <ImageIcon className="w-8 h-8 mb-2 opacity-50" />
                    <p className="text-xs text-center">Референсы не прикреплены</p>
                  </div>
                )}
              </div>

              {/* Правая колонка: Действия */}
              <div className="flex-shrink-0 w-full lg:w-48 flex flex-col justify-start border-t lg:border-t-0 lg:border-l border-zinc-800 pt-4 lg:pt-0 lg:pl-6">
                <label className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2 block">
                  Изменить статус
                </label>
                <Select
                  value={req.status}
                  onValueChange={(value) => handleStatusChange(req.id, value)}
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
