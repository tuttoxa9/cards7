import { Header } from "@/components/header"
import { CatalogFilters } from "@/components/catalog-filters"
import { CatalogGrid } from "@/components/catalog-grid"
import { Footer } from "@/components/footer"

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-2 text-white/60 text-sm mb-2">
            <span>Главная</span>
            <span>/</span>
            <span className="text-red-400">Каталог</span>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Каталог <span className="text-red-500">карточек</span>
              </h1>
              <p className="text-white/70">3 293 товара</p>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Sidebar Filters */}
          <aside className="hidden lg:block flex-shrink-0">
            <CatalogFilters />
          </aside>

          {/* Main Content */}
          <CatalogGrid />
        </div>
      </main>

      <Footer />
    </div>
  )
}
