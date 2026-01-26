'use client'

import { useState, useEffect, useCallback } from 'react'
import type { ScrollData } from '@/types'

export function useScrollProgress(): ScrollData {
  const [scrollData, setScrollData] = useState<ScrollData>({
    scrollY: 0,
    scrollProgress: 0,
    scrollDirection: 'down',
    isScrolled: false,
  })

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY
    const documentHeight = document.documentElement.scrollHeight - window.innerHeight
    const scrollProgress = documentHeight > 0 ? scrollY / documentHeight : 0

    setScrollData((prev) => ({
      scrollY,
      scrollProgress,
      scrollDirection: scrollY > prev.scrollY ? 'down' : 'up',
      isScrolled: scrollY > 100,
    }))
  }, [])

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [handleScroll])

  return scrollData
}