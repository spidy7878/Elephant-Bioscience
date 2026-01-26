'use client'

import { useState, useEffect, useRef, RefObject } from 'react'
import { VIDEO_CONFIG } from '@/lib/constants'
import { clamp, lerp, easeInOutCubic } from '@/lib/utils'

interface VideoScrubState {
  currentTime: number
  targetTime: number
  duration: number
  isReady: boolean
  progress: number
  scale: number
  blur: number
}

export function useVideoScrub(
  videoRef: RefObject<HTMLVideoElement>,
  heroProgress: number
): VideoScrubState {
  const [state, setState] = useState<VideoScrubState>({
    currentTime: 0,
    targetTime: 0,
    duration: 0,
    isReady: false,
    progress: 0,
    scale: 1,
    blur: 0,
  })

  const animationRef = useRef<number | null>(null)
  const currentTimeRef = useRef(0)

  // Handle video metadata loaded
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleLoadedMetadata = () => {
      setState((prev) => ({
        ...prev,
        duration: video.duration,
        isReady: true,
      }))
    }

    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    if (video.readyState >= 1) {
      handleLoadedMetadata()
    }

    return () => video.removeEventListener('loadedmetadata', handleLoadedMetadata)
  }, [videoRef])

  // Calculate target time and effects based on scroll
  useEffect(() => {
    if (!state.isReady || state.duration === 0) return

    const targetTime = clamp(
      heroProgress * state.duration * VIDEO_CONFIG.scrubSensitivity,
      0,
      state.duration
    )

    const scaleProgress = clamp(
      (heroProgress - VIDEO_CONFIG.morphStartScroll) /
        (VIDEO_CONFIG.morphEndScroll - VIDEO_CONFIG.morphStartScroll),
      0,
      1
    )

    const t = easeInOutCubic(scaleProgress)
    const scale = 1 + t * (VIDEO_CONFIG.maxVideoScale - 1)
    const blur = t * VIDEO_CONFIG.maxBlur

    setState((prev) => ({
      ...prev,
      targetTime,
      progress: targetTime / state.duration,
      scale,
      blur,
    }))
  }, [heroProgress, state.isReady, state.duration])

  // Animate video time smoothly
  useEffect(() => {
    const video = videoRef.current
    if (!video || !state.isReady) return

    const animate = () => {
      currentTimeRef.current = lerp(
        currentTimeRef.current,
        state.targetTime,
        VIDEO_CONFIG.smoothingFactor
      )

      if (Math.abs(video.currentTime - currentTimeRef.current) > 0.03) {
        video.currentTime = currentTimeRef.current
      }

      setState((prev) => ({
        ...prev,
        currentTime: currentTimeRef.current,
      }))

      animationRef.current = requestAnimationFrame(animate)
    }

    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [videoRef, state.isReady, state.targetTime])

  return state
}