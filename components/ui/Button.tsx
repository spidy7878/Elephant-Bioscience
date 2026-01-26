'use client'

import { forwardRef, ButtonHTMLAttributes } from 'react'
import { cn } from '../../lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  children: React.ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', className, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center gap-3 md:gap-4 font-bold text-sm md:text-base transition-all duration-400',
          variant === 'primary' && [
            'px-6 md:px-10 py-4 md:py-5 bg-gradient-to-r from-accent-red to-accent-orange rounded-xl md:rounded-2xl text-white relative overflow-hidden',
            'hover:-translate-y-1 hover:scale-[1.02] hover:shadow-[0_20px_40px_rgba(255,45,85,0.3),0_0_60px_rgba(255,107,44,0.2)]',
            'before:absolute before:inset-0 before:bg-gradient-to-r before:from-accent-orange before:to-accent-gold before:opacity-0 before:transition-opacity hover:before:opacity-100',
            '[&>*]:relative [&>*]:z-10',
          ],
          variant === 'secondary' && [
            'px-5 md:px-8 py-4 md:py-5 bg-white/5 border border-border rounded-xl md:rounded-2xl backdrop-blur-lg',
            'hover:bg-white/10 hover:border-white/20 hover:-translate-y-0.5',
          ],
          className
        )}
        {...props}
      >
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button