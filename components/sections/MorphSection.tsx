'use client'

import { cn } from '@/lib/utils'

interface MorphSectionProps {
  heroProgress: number
}

export default function MorphSection({ heroProgress }: MorphSectionProps) {
  const isVisible = heroProgress > 0.3 && heroProgress < 0.7

  return (
    <section className="min-h-[400vh] relative">
      <div className="sticky top-0 h-screen flex items-center justify-center overflow-hidden">
        <div
          className={cn(
            'text-center z-20 px-6 transition-all duration-800',
            isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-90'
          )}
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tighter leading-tight mb-6">
            <span className="gradient-text">Precision at the</span>
            <br />
            Molecular Level
          </h2>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl mx-auto leading-relaxed">
            Experience cutting-edge synthesis technology and rigorous quality control that defines our research-grade compounds.
          </p>
        </div>
      </div>
    </section>
  )
}