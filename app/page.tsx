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
        preset="page-header"
        target="parent"
        strength={3}
        height="8rem"
        animated="scroll"
        curve="bezier"
        exponential={true}
        opacity={0.9}
        zIndex={500}
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
