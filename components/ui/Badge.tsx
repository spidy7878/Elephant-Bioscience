import { cn } from '../../lib/utils'
import { ReactNode } from 'react'

interface BadgeProps {
  children: ReactNode
  className?: string
}

export default function Badge({ children, className }: BadgeProps) {
  return (
    <div
      className={cn(
        'inline-flex items-center gap-3 bg-accent-orange/10 border border-accent-orange/25 px-4 md:px-5 py-2 rounded-full text-[10px] md:text-[11px] font-semibold text-accent-orange uppercase tracking-widest backdrop-blur-lg w-fit',
        className
      )}
    >
      {children}
    </div>
  )
}