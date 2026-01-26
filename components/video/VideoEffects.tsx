'use client'

import { cn } from '../../lib/utils'

interface VideoEffectsProps {
  isGlowActive: boolean
}

export default function VideoEffects({ isGlowActive }: VideoEffectsProps) {
  return (
    <div className="absolute inset-0 pointer-events-none z-[2]">
      <div
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 40%, rgba(3,3,4,0.7) 100%)',
        }}
      />

      <div
        className="absolute inset-0 mix-blend-overlay"
        style={{
          background: 'linear-gradient(135deg, rgba(255, 107, 44, 0.05) 0%, transparent 50%, rgba(255, 45, 85, 0.05) 100%)',
        }}
      />

      <div
        className={cn(
          'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70%] h-[70%] blur-[80px] transition-opacity duration-800',
          isGlowActive ? 'opacity-100' : 'opacity-0'
        )}
        style={{
          background: 'radial-gradient(ellipse, rgba(255, 107, 44, 0.2) 0%, transparent 70%)',
        }}
      />
    </div>
  )
}