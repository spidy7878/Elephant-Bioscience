'use client'

import { forwardRef, useState, useEffect } from 'react'
import { useVideoScrub } from '@/hooks/useVideoScrub'
import { easeOutCubic } from '@/lib/utils'
import VideoEffects from './VideoEffects'
import VideoProgress from './VideoProgress'
import type { MousePosition } from '@/types'

interface VideoBackgroundProps {
  heroProgress: number
  mousePosition: MousePosition
  onLoad?: () => void
}

const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(
  ({ heroProgress, mousePosition, onLoad }, ref) => {
    const [hasError, setHasError] = useState(false)
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 })
    const videoState = useVideoScrub(ref as React.RefObject<HTMLVideoElement>, heroProgress)

    useEffect(() => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      const handleResize = () => {
        setWindowSize({ width: window.innerWidth, height: window.innerHeight })
      }
      window.addEventListener('resize', handleResize)
      return () => window.removeEventListener('resize', handleResize)
    }, [])

    const parallaxX = mousePosition.normalizedX * 15
    const parallaxY = -mousePosition.normalizedY * 15

    const maskProgress = Math.max(0, (heroProgress - 0.15) / 0.85)
    const maskSize = easeOutCubic(maskProgress) * Math.max(windowSize.height, windowSize.width) * 1.5

    const showProgress = heroProgress > 0.05 && heroProgress < 0.95

    return (
      <div className="fixed inset-0 z-[1] overflow-hidden bg-primary">
        <div
          className="absolute flex items-center justify-center"
          style={{
            width: '100%',
            height: '100%',
            left: '50%',
            top: '50%',
            transform: `translate(calc(-50% + ${parallaxX}px), calc(-50% + ${parallaxY}px))`,
          }}
        >
          {/* ====================================
              YOUR VIDEO SOURCE - UPDATED TO mov1
              ==================================== */}
          <video
            ref={ref}
            className="min-w-full min-h-full w-auto h-auto object-cover origin-center transition-[filter] duration-300"
            muted
            playsInline
            preload="auto"
            onLoadedMetadata={onLoad}
            onError={() => setHasError(true)}
            style={{
              transform: `scale(${videoState.scale})`,
              filter: `blur(${videoState.blur}px)`,
            }}
          >
            {/* ✅ UPDATED: Your video file name */}
            <source src="/videos/mov1.mp4" type="video/mp4" />
            
            {/* Optional: Add WebM version for better browser support */}
            {/* <source src="/videos/mov1.webm" type="video/webm" /> */}
          </video>
        </div>

        <VideoEffects isGlowActive={heroProgress > 0.2} />

        {/* Circular Mask */}
        <div
          className="absolute inset-0 z-[4] pointer-events-none bg-primary"
          style={{
            WebkitMask: `radial-gradient(circle at 50% 50%, transparent ${maskSize}px, black ${maskSize + 100}px)`,
            mask: `radial-gradient(circle at 50% 50%, transparent ${maskSize}px, black ${maskSize + 100}px)`,
          }}
        />

        {/* Letterbox Top */}
        <div
          className={`fixed left-0 right-0 top-0 bg-primary z-[6] transition-all duration-1000 ${
            heroProgress > 0.3 ? 'h-[10%]' : 'h-0'
          }`}
        />
        
        {/* Letterbox Bottom */}
        <div
          className={`fixed left-0 right-0 bottom-0 bg-primary z-[6] transition-all duration-1000 ${
            heroProgress > 0.3 ? 'h-[10%]' : 'h-0'
          }`}
        />

        {/* Video Progress UI */}
        {videoState.isReady && (
          <VideoProgress
            currentTime={videoState.currentTime}
            duration={videoState.duration}
            progress={videoState.progress}
            isVisible={showProgress}
          />
        )}

        {/* Error Fallback */}
        {hasError && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-6 bg-gradient-to-br from-primary via-secondary to-primary">
            <div className="w-20 h-20 border-2 border-accent-orange rounded-full flex items-center justify-center animate-spin">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#ff6b2c" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3" />
              </svg>
            </div>
            <div className="text-center text-text-muted text-sm max-w-md px-4">
              <p className="font-semibold mb-2">Video not found</p>
              <p>
                Make sure your video is at:{' '}
                <code className="bg-accent-orange/10 text-accent-orange px-2 py-1 rounded text-xs">
                  public/videos/mov1.mp4
                </code>
              </p>
            </div>
          </div>
        )}
      </div>
    )
  }
)

VideoBackground.displayName = 'VideoBackground'

export default VideoBackground