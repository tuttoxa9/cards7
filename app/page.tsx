import { Header } from "@/components/header"
import { HeroBanner } from "@/components/hero-banner"
import { FeaturedSections } from "@/components/featured-sections"
import { ReviewsSection } from "@/components/reviews-section"
import { Footer } from "@/components/footer"
import GradualBlur from "@/components/GradualBlur"

export default function HomePage() {
  return (
    <div className="min-h-screen">
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

      <main>
        <HeroBanner />

        <div className="container mx-auto px-4 py-16 pb-24 md:pb-16">
          <FeaturedSections />
        </div>

        <ReviewsSection />
      </main>

      <Footer />
    </div>
  )
}
