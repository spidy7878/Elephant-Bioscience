'use client'

import { useState, useEffect } from 'react'
import { cn } from '@/lib/utils'
import type { MousePosition } from '@/types'

interface CustomCursorProps {
  mousePosition: MousePosition
}

export default function CustomCursor({ mousePosition }: CustomCursorProps) {
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest('a, button, [role="button"], .interactive')
      setIsHovering(!!isInteractive)
    }

    document.addEventListener('mouseover', handleMouseOver)
    return () => document.removeEventListener('mouseover', handleMouseOver)
  }, [])

  return (
    <>
      <div
        className={cn(
          'fixed w-5 h-5 border-2 border-accent-orange rounded-full pointer-events-none z-[10000] mix-blend-difference transition-all duration-150',
          isHovering && 'w-12 h-12 border-accent-red bg-accent-red/10'
        )}
        style={{
          left: mousePosition.x - (isHovering ? 24 : 10),
          top: mousePosition.y - (isHovering ? 24 : 10),
        }}
      />
      <div
        className="fixed w-1.5 h-1.5 bg-accent-red rounded-full pointer-events-none z-[10001]"
        style={{
          left: mousePosition.smoothX - 3,
          top: mousePosition.smoothY - 3,
        }}
      />
    </>
  )
}