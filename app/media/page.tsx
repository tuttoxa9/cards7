import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import GradualBlur from "@/components/GradualBlur"

export default function MediaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950/20 to-slate-900">
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

      <main className="container mx-auto px-4 py-8">
        <div className="text-center py-16">
          <h1 className="text-5xl font-bold text-white mb-8 tracking-tight">
            Медиа <span className="text-red-500">Центр</span>
          </h1>
          <p className="text-2xl text-white/70">
            Даник, что будет тут решим вместе)
          </p>
        </div>
      </main>

      <Footer />
    </div>
  )
}
