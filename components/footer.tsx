import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Phone, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-black/30 border-t border-white/10 mt-16 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold">
                <span className="text-red-500">GOLO</span>
                <span className="text-white"> CARDS</span>
              </span>
            </div>
            <p className="text-sm text-white/60 leading-relaxed">
              Широкий выбор качественных коллекционных карточек. Находите редкие экземпляры и пополняйте свою коллекцию.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-red-400 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-white/60 hover:text-red-400 w-10 h-10 rounded-full bg-white/5 hover:bg-white/10">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Каталог</h3>
            <nav className="space-y-2">
              <Link
                href="/catalog"
                className="block text-sm text-white/60 hover:text-red-400 transition-colors"
              >
                Весь каталог
              </Link>
              <Link href="/media" className="block text-sm text-white/60 hover:text-red-400 transition-colors">
                Медиа
              </Link>
              <Link href="#" className="block text-sm text-white/60 hover:text-red-400 transition-colors">
                Новинки
              </Link>
              <Link href="#" className="block text-sm text-white/60 hover:text-red-400 transition-colors">
                Популярные
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Поддержка</h3>
            <nav className="space-y-2">
              <Link href="#" className="block text-sm text-white/60 hover:text-red-400 transition-colors">
                Помощь
              </Link>
              <Link href="#" className="block text-sm text-white/60 hover:text-red-400 transition-colors">
                Доставка и оплата
              </Link>
              <Link href="#" className="block text-sm text-white/60 hover:text-red-400 transition-colors">
                Возврат товара
              </Link>
              <Link href="#" className="block text-sm text-white/60 hover:text-red-400 transition-colors">
                Контакты
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-white">Новости и скидки</h3>
            <p className="text-sm text-white/60">
              Подпишитесь на рассылку и получайте уведомления о новых коллекциях и специальных предложениях.
            </p>
            <div className="space-y-2">
              <Input placeholder="Ваш email" className="bg-white/5 border-white/20 text-white placeholder:text-white/40" />
              <Button className="w-full bg-red-500 hover:bg-red-600 text-white">Подписаться</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8 bg-white/10" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-white/60">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+375 (29) 123-45-67</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-white/60">
            <Link href="#" className="hover:text-red-400 transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="hover:text-red-400 transition-colors">
              Условия использования
            </Link>
            <span>&copy; Все права защищены.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
