'use client'

import { cn } from '@/lib/utils'

interface ScrollIndicatorProps {
  isHidden: boolean
}

export default function ScrollIndicator({ isHidden }: ScrollIndicatorProps) {
  return (
    <div
      className={cn(
        'fixed bottom-12 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-4 transition-all duration-600',
        isHidden && 'opacity-0 translate-y-5 pointer-events-none'
      )}
    >
      <div className="relative w-px h-16 bg-gradient-to-b from-accent-orange to-transparent">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent-orange rounded-full animate-scroll-dot" style={{ boxShadow: '0 0 10px var(--accent-orange)' }} />
      </div>
      <span className="text-[10px] uppercase tracking-[0.3em] text-text-muted font-medium">
        Scroll to Explore
      </span>
    </div>
  )
}