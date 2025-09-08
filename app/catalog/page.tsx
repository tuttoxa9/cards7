import { Header } from "@/components/header"
import { CatalogFilters } from "@/components/catalog-filters"
import { CatalogGrid } from "@/components/catalog-grid"
import { Footer } from "@/components/footer"

export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
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
