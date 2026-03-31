"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useCart } from "@/lib/cart-context"

export function MobileNav() {
  const pathname = usePathname()
  const { totalItems } = useCart()

  return (
    <>
      {/* Bottom Navigation Bar - Only on Mobile */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-t border-gray-800">
        <div className="flex items-center justify-between w-full px-4 py-2">
          <Link href="/" className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors flex-1 ${
            pathname === "/" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-xl ${pathname === "/" ? "bg-white/20" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9,22 9,12 15,12 15,22"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Главная</span>
          </Link>

          <Link href="/catalog" className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors flex-1 ${
            pathname === "/catalog" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-xl ${pathname === "/catalog" ? "bg-white/20" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="7" height="7"/>
                <rect x="14" y="3" width="7" height="7"/>
                <rect x="14" y="14" width="7" height="7"/>
                <rect x="3" y="14" width="7" height="7"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Каталог</span>
          </Link>

          <Link href="/custom" className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors flex-1 ${
            pathname === "/custom" ? "text-violet-400" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-xl ${pathname === "/custom" ? "bg-violet-900/40 text-violet-400 shadow-[0_0_10px_rgba(109,40,217,0.3)]" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="13.5" cy="6.5" r=".5" fill="currentColor"/>
                <circle cx="17.5" cy="10.5" r=".5" fill="currentColor"/>
                <circle cx="8.5" cy="7.5" r=".5" fill="currentColor"/>
                <circle cx="6.5" cy="12.5" r=".5" fill="currentColor"/>
                <path d="M12 2C6.5 2 2 6.5 2 12s4.5 10 10 10c.926 0 1.648-.746 1.648-1.688 0-.437-.18-.835-.437-1.125-.29-.289-.438-.652-.438-1.125a1.64 1.64 0 0 1 1.668-1.668h1.996c3.051 0 5.555-2.503 5.555-5.554C21.965 6.012 17.461 2 12 2z"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Свой дизайн</span>
          </Link>

          <Link href="/media" className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors flex-1 hidden sm:flex ${
            pathname === "/media" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-xl ${pathname === "/media" ? "bg-white/20" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <circle cx="9" cy="9" r="2"/>
                <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Медиа</span>
          </Link>

          <Link href="/reviews" className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors flex-1 ${
            pathname === "/reviews" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-xl ${pathname === "/reviews" ? "bg-white/20" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Отзывы</span>
          </Link>

        </div>
      </div>
    </>
  )
}
