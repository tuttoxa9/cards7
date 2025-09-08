import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { FeaturedSections } from "@/components/featured-sections"
import { Footer } from "@/components/footer"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <HeroBanner />

        <div className="container mx-auto px-4 py-16">
          <FeaturedSections />
        </div>
      </main>

      <Footer />
    </div>
  )
}
