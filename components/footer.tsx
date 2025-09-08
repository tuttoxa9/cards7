import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from "lucide-react"
import Link from "next/link"

export function Footer() {
  return (
    <footer className="bg-card border-t border-border mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">CV</span>
              </div>
              <span className="text-xl font-bold text-card-foreground">CardVault</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Премиальные коллекционные карточки супергероев и автомобилей. Эксклюзивные тиражи для истинных
              коллекционеров.
            </p>
            <div className="flex space-x-3">
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Facebook className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Twitter className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Instagram className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary">
                <Youtube className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Быстрые ссылки</h3>
            <nav className="space-y-2">
              <Link
                href="/catalog"
                className="block text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                Каталог
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Новинки
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Популярные коллекции
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Ограниченные тиражи
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                О нас
              </Link>
            </nav>
          </div>

          {/* Customer Service */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Поддержка</h3>
            <nav className="space-y-2">
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Помощь
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Доставка и оплата
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Возврат товара
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Гарантии
              </Link>
              <Link href="#" className="block text-sm text-muted-foreground hover:text-primary transition-colors">
                Контакты
              </Link>
            </nav>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="font-semibold text-card-foreground">Новости и скидки</h3>
            <p className="text-sm text-muted-foreground">
              Подпишитесь на рассылку и получайте уведомления о новых коллекциях и специальных предложениях.
            </p>
            <div className="space-y-2">
              <Input placeholder="Ваш email" className="bg-background border-border text-foreground" />
              <Button className="w-full bg-primary hover:bg-primary/90">Подписаться</Button>
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <Phone className="w-4 h-4" />
              <span>+7 (800) 123-45-67</span>
            </div>
            <div className="flex items-center space-x-2">
              <Mail className="w-4 h-4" />
              <span>info@cardvault.ru</span>
            </div>
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Москва, Россия</span>
            </div>
          </div>

          <div className="flex items-center space-x-6 text-sm text-muted-foreground">
            <Link href="#" className="hover:text-primary transition-colors">
              Политика конфиденциальности
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              Условия использования
            </Link>
            <span>&copy; 2024 CardVault. Все права защищены.</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
