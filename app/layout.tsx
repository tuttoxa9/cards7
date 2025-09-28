import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Nunito } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Suspense } from "react"
import { Toaster } from "@/components/ui/sonner"
import { CartProvider } from "@/lib/cart-context"
import "./globals.css"

const nunito = Nunito({
  subsets: ["latin", "cyrillic"],
  variable: "--font-nunito",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
})

export const metadata: Metadata = {
  title: "CardVault - Коллекционные карточки премиум качества",
  description:
    "Эксклюзивные коллекционные карточки супергероев и автомобилей. Редкие и уникальные экземпляры для истинных коллекционеров.",
  generator: "v0.app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru" className="dark">
      <body
        className={`bg-[#06080A] font-sans ${GeistSans.variable} ${GeistMono.variable} ${nunito.variable}`}
      >
        <CartProvider>
          <Suspense fallback={null}>{children}</Suspense>
          <Analytics />
          <Toaster />
        </CartProvider>
      </body>
    </html>
  )
}
