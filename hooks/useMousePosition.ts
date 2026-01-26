'use client'

import { useState, useEffect } from 'react'
import { lerp } from '@/lib/utils'
import type { MousePosition } from '@/types'

export function useMousePosition(smoothFactor: number = 0.1): MousePosition {
  const [position, setPosition] = useState<MousePosition>({
    x: 0,
    y: 0,
    normalizedX: 0,
    normalizedY: 0,
    smoothX: 0,
    smoothY: 0,
  })

  useEffect(() => {
    let animationId: number
    let targetX = 0
    let targetY = 0
    let currentX = 0
    let currentY = 0

    const handleMouseMove = (e: MouseEvent) => {
      targetX = e.clientX
      targetY = e.clientY

      setPosition((prev) => ({
        ...prev,
        x: e.clientX,
        y: e.clientY,
        normalizedX: (e.clientX / window.innerWidth) * 2 - 1,
        normalizedY: -(e.clientY / window.innerHeight) * 2 + 1,
      }))
    }

    const animate = () => {
      currentX = lerp(currentX, targetX, smoothFactor)
      currentY = lerp(currentY, targetY, smoothFactor)

      setPosition((prev) => ({
        ...prev,
        smoothX: currentX,
        smoothY: currentY,
      }))

      animationId = requestAnimationFrame(animate)
    }

    window.addEventListener('mousemove', handleMouseMove)
    animationId = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationId)
    }
  }, [smoothFactor])

  return position
}