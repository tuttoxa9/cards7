import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { FeaturedSections } from "@/components/featured-sections"
import { Footer } from "@/components/footer"
import GradualBlur from "@/components/GradualBlur"

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Header />

      <GradualBlur
        position="bottom"
        strength={2}
        height="4rem"
        zIndex={10}
        target="parent"
        opacity={0.7}
      />

      <main>
        <HeroBanner />

        <div className="container mx-auto px-4 py-16 pb-24 md:pb-16">
          <FeaturedSections />
        </div>
      </main>

      <Footer />
    </div>
  )
}
