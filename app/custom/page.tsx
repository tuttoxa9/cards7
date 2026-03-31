"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import GradualBlur from "@/components/GradualBlur"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { toast } from "sonner"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { ImageUploader } from "@/components/ui/image-uploader"
import { Palette, Upload, Sparkles, Send } from "lucide-react"

const customRequestSchema = z.object({
  name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
  contact: z.string().min(5, "Укажите контакт для связи (Telegram, телефон, email)"),
  description: z.string().min(10, "Опишите вашу идею подробнее (минимум 10 символов)"),
  referenceImagesUrls: z.array(z.string()).optional(),
})

type CustomRequestValues = z.infer<typeof customRequestSchema>

export default function CustomPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [referenceUrl, setReferenceUrl] = useState<string>("")

  const form = useForm<CustomRequestValues>({
    resolver: zodResolver(customRequestSchema),
    defaultValues: {
      name: "",
      contact: "",
      description: "",
      referenceImagesUrls: [],
    },
  })

  const handleImageUpload = async (file: File): Promise<string | null> => {
    try {
      const body = new FormData()
      body.append("file", file)
      body.append("type", "card") // Используем тип card, чтобы сохранять в нужную папку
      const response = await fetch("/api/upload", { method: "POST", body })

      if (!response.ok) {
        throw new Error("Ошибка сервера при загрузке")
      }

      const result = await response.json()
      if (!result.success) throw new Error(result.error || "Произошла ошибка при загрузке")

      toast.success("Референс успешно загружен!")
      return result.url
    } catch (error: any) {
      console.error("Ошибка загрузки изображения:", error)
      toast.error(error.message || "Не удалось загрузить изображение.")
      return null
    }
  }

  const onSubmit = async (data: CustomRequestValues) => {
    setIsSubmitting(true)
    try {
      // Если есть загруженный референс, добавляем его в массив
      if (referenceUrl) {
        data.referenceImagesUrls = [referenceUrl]
      }

      const response = await fetch("/api/custom-request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Ошибка отправки заявки")
      }

      toast.success("Заявка успешно отправлена!", {
        description: "Мы свяжемся с вами в ближайшее время для обсуждения деталей.",
      })

      form.reset()
      setReferenceUrl("")
    } catch (error: any) {
      console.error("Error submitting custom request:", error)
      toast.error("Ошибка", {
        description: error.message || "Не удалось отправить заявку. Попробуйте позже.",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-[#0F0F13]">
      <Header />

      <GradualBlur
        preset="page-header"
        strength={2}
        divCount={5}
        height="8rem"
        animated={false}
        curve="bezier"
        exponential={true}
        opacity={1}
        zIndex={40}
      />

      <main className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
        <div className="text-center mb-16 max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center justify-center p-3 bg-violet-900/20 rounded-full mb-4">
            <Palette className="w-8 h-8 text-violet-500" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight text-pretty">
            Создай свою <span className="text-violet-500">уникальную</span> карточку
          </h1>
          <p className="text-zinc-400 text-lg md:text-xl leading-relaxed">
            У вас есть идея для собственной коллекционной карточки? Расскажите нам о ней, и наши дизайнеры воплотят её в жизнь. Эксклюзивный арт, уникальные характеристики и премиальное качество.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-start">

          {/* Form Section */}
          <div className="bg-[#1C1C24] p-8 md:p-10 rounded-2xl border border-zinc-800/50 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-6 flex items-center gap-3">
              <Sparkles className="w-6 h-6 text-violet-500" />
              Оформить заявку
            </h2>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Как к вам обращаться?</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Имя или никнейм"
                          className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-violet-700 h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="contact"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Контакт для связи</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="@telegram_username или номер телефона"
                          className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-violet-700 h-12"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-zinc-300">Описание идеи</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Опишите персонажа, стиль, желаемые характеристики (редкость, атака, защита) и любые другие детали..."
                          className="bg-zinc-900/50 border-zinc-800 focus-visible:ring-violet-700 min-h-[150px] resize-y"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-400" />
                    </FormItem>
                  )}
                />

                <div className="space-y-3">
                  <FormLabel className="text-zinc-300 block">Референс (опционально)</FormLabel>
                  <p className="text-xs text-zinc-500 mb-2">Загрузите набросок или пример стиля, который вам нравится.</p>
                  <ImageUploader
                    label="Загрузить референс"
                    imageUrl={referenceUrl || null}
                    onUpload={(file) => handleImageUpload(file)}
                    onRemove={() => setReferenceUrl("")}
                    setFormValue={(url) => setReferenceUrl(url)}
                    clearFormValue={() => setReferenceUrl("")}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-violet-700 hover:bg-violet-600 text-white h-14 text-lg font-medium rounded-xl transition-all shadow-[0_0_20px_rgba(109,40,217,0.3)] hover:shadow-[0_0_25px_rgba(109,40,217,0.5)]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Отправка...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      Отправить заявку
                      <Send className="w-5 h-5 ml-1" />
                    </div>
                  )}
                </Button>

                <p className="text-xs text-zinc-500 text-center mt-4">
                  Нажимая кнопку, вы соглашаетесь с политикой обработки персональных данных.
                </p>
              </form>
            </Form>
          </div>

          {/* Info Section */}
          <div className="space-y-10 lg:sticky lg:top-32">
            <div className="bg-[#1C1C24]/50 p-8 rounded-2xl border border-zinc-800/30">
              <h3 className="text-xl font-medium text-white mb-6">Как это работает?</h3>
              <ul className="space-y-6 relative before:absolute before:inset-y-0 before:left-[15px] before:w-[2px] before:bg-zinc-800">
                {[
                  { title: "Заявка", desc: "Вы подробно описываете свою идею и прикрепляете референсы, если они есть." },
                  { title: "Обсуждение", desc: "Мы связываемся с вами для уточнения деталей, стиля и финальной стоимости." },
                  { title: "Отрисовка", desc: "Наши художники создают уникальный арт и верстают дизайн карточки." },
                  { title: "Печать и доставка", desc: "После вашего утверждения макета, карточка отправляется в печать и доставляется вам." }
                ].map((step, idx) => (
                  <li key={idx} className="relative pl-10">
                    <div className="absolute left-0 top-1 w-[32px] h-[32px] bg-zinc-900 border border-zinc-700 rounded-full flex items-center justify-center text-sm font-bold text-violet-400 z-10">
                      {idx + 1}
                    </div>
                    <h4 className="text-white font-medium mb-1">{step.title}</h4>
                    <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                  </li>
                ))}
              </ul>
            </div>

            <div className="aspect-[4/5] bg-zinc-900/50 rounded-2xl border border-zinc-800 flex items-center justify-center relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-violet-900/20 to-transparent z-0"></div>
              <div className="text-center z-10 p-6">
                <Palette className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
                <p className="text-zinc-500 font-medium">Ваша карточка будет здесь</p>
              </div>
            </div>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  )
}
