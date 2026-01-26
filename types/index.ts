export interface VideoConfig {
  scrubSensitivity: number
  smoothingFactor: number
  morphStartScroll: number
  morphEndScroll: number
  maxVideoScale: number
  maxBlur: number
  portalMaxSize: number
}

export interface MousePosition {
  x: number
  y: number
  normalizedX: number
  normalizedY: number
  smoothX: number
  smoothY: number
}

export interface ScrollData {
  scrollY: number
  scrollProgress: number
  scrollDirection: 'up' | 'down'
  isScrolled: boolean
}

export interface Feature {
  icon: string
  title: string
  description: string
}

export interface Stat {
  label: string
  value: string
  unit: string
}

export interface Reference {
  id: number
  authors: string
  year: string
  title: string
  journal: string
  volume: string
}

export interface ExpandableSectionData {
  title: string
  icon: string
  content: {
    label: string
    value: string
  }[]
}

export interface NavLink {
  href: string
  label: string
}