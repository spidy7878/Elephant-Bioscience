'use client'

import { cn } from '@/lib/utils'
import { NAV_LINKS } from '@/lib/constants'

interface NavbarProps {
  isScrolled: boolean
  isHidden: boolean
}

export default function Navbar({ isScrolled, isHidden }: NavbarProps) {
  return (
    <nav
      className={cn(
        'fixed top-0 left-0 right-0 z-[100] flex justify-between items-center px-6 md:px-16 py-6 transition-all duration-500',
        isScrolled && 'py-4 bg-primary/90 backdrop-blur-xl border-b border-border',
        isHidden && '-translate-y-full'
      )}
    >
      <a href="#" className="flex items-center gap-4 group interactive">
        <div className="relative w-11 h-11 bg-gradient-to-br from-accent-red to-accent-orange rounded-xl flex items-center justify-center overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent -translate-x-full rotate-45 group-hover:translate-x-full transition-transform duration-700" />
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C8.5 2 5 4 4 7C3 10 4 13 6 15L4 22L8 20L12 22L16 20L20 22L18 15C20 13 21 10 20 7C19 4 15.5 2 12 2Z"
              fill="white"
            />
            <circle cx="8" cy="9" r="2" fill="#ff2d55" />
            <circle cx="16" cy="9" r="2" fill="#ff2d55" />
          </svg>
        </div>
        <span className="font-extrabold text-lg tracking-wide hidden sm:block">RED ELEPHANT</span>
      </a>

      <div className="hidden lg:flex items-center gap-12">
        {NAV_LINKS.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="relative text-text-secondary text-sm font-medium hover:text-white transition-colors group interactive"
          >
            {link.label}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-accent-red to-accent-orange group-hover:w-full transition-all duration-300" />
          </a>
        ))}
        <button className="px-6 py-3 bg-gradient-to-r from-accent-red to-accent-orange rounded-full text-sm font-semibold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent-red/30 transition-all interactive">
          Get Started
        </button>
      </div>

      <button className="lg:hidden flex flex-col gap-1.5 p-2 interactive">
        <span className="w-6 h-0.5 bg-white rounded-full" />
        <span className="w-6 h-0.5 bg-white rounded-full" />
        <span className="w-4 h-0.5 bg-white rounded-full" />
      </button>
    </nav>
  )
}