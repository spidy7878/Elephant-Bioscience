'use client'

import { cn } from '../../lib/utils'
import { formatTime } from '../../lib/utils'
import { ChevronDown } from 'lucide-react'

interface VideoProgressProps {
  currentTime: number
  duration: number
  progress: number
  isVisible: boolean
}

export default function VideoProgress({
  currentTime,
  duration,
  progress,
  isVisible,
}: VideoProgressProps) {
  return (
    <>
      <div
        className={cn(
          'fixed bottom-24 left-1/2 -translate-x-1/2 flex items-center gap-2 text-xs text-text-muted uppercase tracking-widest z-[100] transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <ChevronDown className="w-4 h-4 text-accent-orange animate-bounce" />
        Scroll to scrub video
      </div>

      <div
        className={cn(
          'fixed bottom-16 left-1/2 -translate-x-1/2 font-mono text-xs text-text-muted tracking-widest z-[100] transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>

      <div
        className={cn(
          'fixed bottom-12 left-1/2 -translate-x-1/2 w-72 h-1 bg-white/10 rounded-full overflow-hidden backdrop-blur-sm z-[100] transition-opacity duration-500',
          isVisible ? 'opacity-100' : 'opacity-0'
        )}
      >
        <div
          className="h-full bg-gradient-to-r from-accent-red via-accent-orange to-accent-gold rounded-full transition-[width] duration-100"
          style={{ 
            width: `${progress * 100}%`,
            boxShadow: '0 0 10px var(--accent-orange)',
          }}
        />
      </div>
    </>
  )
}