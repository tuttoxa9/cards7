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

          <Link href="/media" className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors flex-1 ${
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

          <Link href="/cart" className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors flex-1 relative ${
            pathname === "/cart" ? "text-white" : "text-gray-400"
          }`}>
            <div className={`p-2 rounded-xl ${pathname === "/cart" ? "bg-white/20" : ""}`}>
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 22C9.55228 22 10 21.5523 10 21C10 20.4477 9.55228 20 9 20C8.44772 20 8 20.4477 8 21C8 21.5523 8.44772 22 9 22Z"/>
                <path d="M20 22C20.5523 22 21 21.5523 21 21C21 20.4477 20.5523 20 20 20C19.4477 20 19 20.4477 19 21C19 21.5523 19.4477 22 20 22Z"/>
                <path d="M1 1H5L7.68 14.39C7.77144 14.8504 8.02191 15.264 8.38755 15.5583C8.75318 15.8526 9.2107 16.009 9.68 16H19.4C19.8693 16.009 20.3268 15.8526 20.6925 15.5583C21.0581 15.264 21.3086 14.8504 21.4 14.39L23 6H6"/>
              </svg>
            </div>
            <span className="text-xs mt-1 font-medium">Корзина</span>
            {totalItems > 0 && (
              <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </div>
            )}
          </Link>

        </div>
      </div>
    </>
  )
}
