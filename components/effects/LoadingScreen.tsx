'use client'

import { cn } from '@/lib/utils'

interface LoadingScreenProps {
  isLoading: boolean
}

export default function LoadingScreen({ isLoading }: LoadingScreenProps) {
  return (
    <div
      className={cn(
        'fixed inset-0 bg-primary z-[10000] flex flex-col items-center justify-center gap-8 transition-all duration-700',
        !isLoading && 'opacity-0 invisible pointer-events-none'
      )}
    >
      <div className="w-20 h-20 bg-gradient-to-br from-accent-red to-accent-orange rounded-2xl flex items-center justify-center animate-pulse-glow">
        <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
          <path
            d="M12 2C8.5 2 5 4 4 7C3 10 4 13 6 15L4 22L8 20L12 22L16 20L20 22L18 15C20 13 21 10 20 7C19 4 15.5 2 12 2Z"
            fill="white"
          />
        </svg>
      </div>

      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="h-full w-full bg-gradient-to-r from-accent-red to-accent-orange rounded-full animate-pulse origin-left" />
      </div>

      <p className="font-mono text-xs text-text-muted tracking-widest">
        Loading experience...
      </p>
    </div>
  )
}