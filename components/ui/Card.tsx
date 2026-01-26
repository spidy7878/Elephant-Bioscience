import { cn } from '../../lib/utils'
import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className }: CardProps) {
  return (
    <div
      className={cn(
        'glass-card p-6 md:p-8 relative overflow-hidden',
        'before:absolute before:top-0 before:left-0 before:right-0 before:h-px before:bg-gradient-to-r before:from-transparent before:via-white/15 before:to-transparent',
        'after:absolute after:-top-1/2 after:-right-1/2 after:w-full after:h-full after:bg-accent-orange/[0.08] after:rounded-full after:blur-3xl after:pointer-events-none',
        className
      )}
    >
      <div className="relative z-10">{children}</div>
    </div>
  )
}