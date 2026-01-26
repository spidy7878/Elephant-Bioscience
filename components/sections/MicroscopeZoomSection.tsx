// src/components/sections/MicroscopeZoomSection.tsx (Alternative - More Performant Version)
"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValueEvent,
  useMotionTemplate,
} from "framer-motion";

// Generate array of image paths from 0001 to 0120
const generateImagePaths = () => {
  const images: string[] = [];
  for (let i = 1; i <= 120; i++) {
    const paddedNumber = i.toString().padStart(4, "0");
    images.push(`/images2/${paddedNumber}_converted.avif`);
  }
  return images;
};

const MICROSCOPE_IMAGES = generateImagePaths();
const TOTAL_FRAMES = MICROSCOPE_IMAGES.length;

export default function MicroscopeZoomSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number>();

  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isLoaded, setIsLoaded] = useState(false);

  // Refs for direct DOM updates to avoid re-renders
  const magnificationRef = useRef<HTMLSpanElement>(null);
  const frameNumberRef = useRef<HTMLSpanElement>(null);
  const focusRef = useRef<HTMLSpanElement>(null);
  const zoomPercentRef = useRef<HTMLSpanElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Perspective transforms for depth
  const backgroundScale = useTransform(smoothProgress, [0, 0.85], [1, 1.15]);
  const canvasScale = useTransform(smoothProgress, [0, 0.85, 1], [1, 1.2, 1.4]);
  const backgroundBlur = useTransform(smoothProgress, [0.7, 0.95], [0, 10]);

  // UI transforms
  const reticleOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const videoOpacity = useTransform(smoothProgress, [0.88, 0.96], [0, 1]);
  const videoScale = useTransform(smoothProgress, [0.88, 1], [0.92, 1]);
  const contentOpacity = useTransform(smoothProgress, [0.75, 0.88], [0, 1]);
  const contentY = useTransform(smoothProgress, [0.75, 0.88], [40, 0]);

  // Preload images
  useEffect(() => {
    let isMounted = true;
    const images: HTMLImageElement[] = [];
    let loaded = 0;

    const loadImage = (index: number): Promise<void> => {
      return new Promise((resolve) => {
        const img = new window.Image();
        img.src = MICROSCOPE_IMAGES[index];
        img.onload = () => {
          if (isMounted) {
            images[index] = img;
            loaded++;
            setLoadingProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
          }
          resolve();
        };
        img.onerror = () => {
          loaded++;
          if (isMounted) {
            setLoadingProgress(Math.round((loaded / TOTAL_FRAMES) * 100));
          }
          resolve();
        };
      });
    };

    // Load images in parallel batches
    const loadAllImages = async () => {
      const batchSize = 12;
      for (let i = 0; i < TOTAL_FRAMES; i += batchSize) {
        const batch = [];
        for (let j = i; j < Math.min(i + batchSize, TOTAL_FRAMES); j++) {
          batch.push(loadImage(j));
        }
        await Promise.all(batch);
      }

      if (isMounted) {
        imagesRef.current = images;
        setIsLoaded(true);
      }
    };

    loadAllImages();

    return () => {
      isMounted = false;
    };
  }, []);

  // Render frame to canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    const img = imagesRef.current[frameIndex];

    if (!canvas || !ctx || !img) return;

    // Set canvas size on first render or if size changed
    if (
      canvas.width !== img.naturalWidth ||
      canvas.height !== img.naturalHeight
    ) {
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(img, 0, 0);
  }, []);

  // Animation loop for smooth frame updates
  useEffect(() => {
    if (!isLoaded) return;

    const animate = () => {
      const currentFrame = frameRef.current;
      if (imagesRef.current[currentFrame]) {
        renderFrame(currentFrame);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isLoaded, renderFrame]);

  // Update frame based on scroll with a realistic acceleration curve
  useMotionValueEvent(smoothProgress, "change", (latest) => {
    // Math.pow(latest, 1.5) provides a nice slow-to-fast acceleration
    const acceleratedProgress = Math.pow(latest, 1.5);
    const newFrame = Math.min(
      Math.floor(acceleratedProgress * TOTAL_FRAMES),
      TOTAL_FRAMES - 1
    );
    frameRef.current = newFrame;

    // Direct DOM updates
    if (magnificationRef.current) {
      const mag = Math.round(1 + acceleratedProgress * 499);
      magnificationRef.current.textContent = `${mag}x`;
    }

    if (frameNumberRef.current) {
      const fNum = (newFrame + 1).toString().padStart(4, "0");
      frameNumberRef.current.textContent = fNum;
    }

    if (focusRef.current) {
      const focus = (acceleratedProgress * 5).toFixed(2);
      focusRef.current.textContent = `${focus}μm`;
    }

    if (zoomPercentRef.current) {
      const percent = Math.round(acceleratedProgress * 100);
      zoomPercentRef.current.textContent = `${percent}%`;
    }
  });

  const maskSizeValue = useTransform(
    smoothProgress,
    [0, 0.9, 1],
    [38, 49.5, 500]
  );
  const maskPercentage = useMotionTemplate`circle(${maskSizeValue}vmin at 50% 50%)`;

  return (
    <section ref={containerRef} className="relative h-[400vh]">
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-[#050505]">
        {/* Loading Screen */}
        {!isLoaded && (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]">
            <div className="flex flex-col items-center gap-6">
              <div className="relative w-28 h-28">
                {/* Outer rotating ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  className="absolute inset-0"
                >
                  <svg className="w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="46"
                      stroke="rgba(249,115,22,0.2)"
                      strokeWidth="1"
                      fill="none"
                      strokeDasharray="8,4"
                    />
                  </svg>
                </motion.div>

                {/* Progress ring */}
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="rgba(255,255,255,0.05)"
                    strokeWidth="2"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="url(#progressGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${loadingProgress * 2.51} 251`}
                    className="transition-all duration-200"
                  />
                  <defs>
                    <linearGradient
                      id="progressGradient"
                      x1="0%"
                      y1="0%"
                      x2="100%"
                      y2="0%"
                    >
                      <stop offset="0%" stopColor="#f97316" />
                      <stop offset="100%" stopColor="#ef4444" />
                    </linearGradient>
                  </defs>
                </svg>

                {/* Center percentage */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-light text-white tabular-nums">
                    {loadingProgress}
                  </span>
                </div>
              </div>

              <div className="text-center space-y-2">
                <p className="text-[11px] text-neutral-400 tracking-wider">
                  LOADING MICROSCOPE SEQUENCE
                </p>
                <div className="flex items-center justify-center gap-2 text-[10px] text-neutral-600">
                  <span className="tabular-nums">
                    {Math.round((loadingProgress / 100) * TOTAL_FRAMES)}
                  </span>
                  <span>/</span>
                  <span>{TOTAL_FRAMES} frames</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main canvas container */}
        <motion.div className="absolute inset-0" style={{ scale: canvasScale }}>
          <canvas
            ref={canvasRef}
            className="w-full h-full object-cover transition-opacity duration-500"
            style={{ opacity: isLoaded ? 1 : 0 }}
          />
        </motion.div>

        {/* Microscope UI Overlay */}
        <motion.div
          style={{ opacity: reticleOpacity }}
          className="absolute inset-0 z-20 pointer-events-none"
        >
          {/* Vignette */}
          <div
            className="absolute inset-0"
            style={{
              background: `
                radial-gradient(circle at center, 
                  transparent 30%, 
                  rgba(0,0,0,0.4) 55%, 
                  rgba(0,0,0,0.85) 80%, 
                  rgba(0,0,0,0.98) 100%
                )
              `,
            }}
          />

          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
              `,
              backgroundSize: "50px 50px",
            }}
          />

          {/* Reticle */}
          <svg className="absolute inset-0 w-full h-full">
            {/* Crosshairs */}
            <line
              x1="50%"
              y1="0"
              x2="50%"
              y2="100%"
              stroke="rgba(249,115,22,0.12)"
              strokeWidth="1"
              strokeDasharray="6,6"
            />
            <line
              x1="0"
              y1="50%"
              x2="100%"
              y2="50%"
              stroke="rgba(249,115,22,0.12)"
              strokeWidth="1"
              strokeDasharray="6,6"
            />

            {/* Center circles */}
            <circle
              cx="50%"
              cy="50%"
              r="60"
              fill="none"
              stroke="rgba(249,115,22,0.2)"
              strokeWidth="1"
            />
            <circle
              cx="50%"
              cy="50%"
              r="120"
              fill="none"
              stroke="rgba(255,255,255,0.06)"
              strokeWidth="0.5"
            />
            <circle
              cx="50%"
              cy="50%"
              r="180"
              fill="none"
              stroke="rgba(255,255,255,0.04)"
              strokeWidth="0.5"
              strokeDasharray="4,4"
            />

            {/* Focus indicators */}
            {[0, 90, 180, 270].map((angle) => (
              <g key={angle} transform={`rotate(${angle} 50% 50%)`}>
                <line
                  x1="50%"
                  y1="calc(50% - 55px)"
                  x2="50%"
                  y2="calc(50% - 65px)"
                  stroke="rgba(249,115,22,0.5)"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </g>
            ))}
          </svg>

          {/* Corner brackets */}
          <div className="absolute top-6 left-6 w-12 h-12 border-l-2 border-t-2 border-orange-500/25 rounded-tl-sm" />
          <div className="absolute top-6 right-6 w-12 h-12 border-r-2 border-t-2 border-orange-500/25 rounded-tr-sm" />
          <div className="absolute bottom-6 left-6 w-12 h-12 border-l-2 border-b-2 border-orange-500/25 rounded-bl-sm" />
          <div className="absolute bottom-6 right-6 w-12 h-12 border-r-2 border-b-2 border-orange-500/25 rounded-br-sm" />
        </motion.div>

        {/* Left Data Panels */}
        <motion.div
          style={{ opacity: reticleOpacity }}
          className="absolute top-6 left-6 z-30 space-y-2"
        >
          <MicroscopeDataPanel label="MAGNIFICATION">
            <span ref={magnificationRef} className="text-lg font-mono text-orange-400 tabular-nums">
              1x
            </span>
          </MicroscopeDataPanel>

          <MicroscopeDataPanel label="FRAME">
            <span ref={frameNumberRef} className="text-sm font-mono text-neutral-300 tabular-nums">
              0001
            </span>
            <span className="text-[9px] text-neutral-600 ml-1">/ 0120</span>
          </MicroscopeDataPanel>

          <MicroscopeDataPanel label="FOCUS">
            <span ref={focusRef} className="text-sm font-mono text-neutral-300 tabular-nums">
              0.00μm
            </span>
          </MicroscopeDataPanel>

          <MicroscopeDataPanel label="SPECIMEN">
            <span className="text-sm text-white">NXB-7749</span>
          </MicroscopeDataPanel>
        </motion.div>

        {/* Right Data Panels */}
        <motion.div
          style={{ opacity: reticleOpacity }}
          className="absolute top-6 right-6 z-30 space-y-2"
        >
          <MicroscopeDataPanel label="DATE" align="right">
            <span className="text-sm font-mono text-neutral-300">
              {new Date().toLocaleDateString("en-CA")}
            </span>
          </MicroscopeDataPanel>

          <MicroscopeDataPanel label="TEMP" align="right">
            <span className="text-sm font-mono text-neutral-300">37.0°C</span>
          </MicroscopeDataPanel>

          <MicroscopeDataPanel label="EXPOSURE" align="right">
            <span className="text-sm font-mono text-neutral-300">1/250s</span>
          </MicroscopeDataPanel>

          <MicroscopeDataPanel label="LENS" align="right">
            <span className="text-sm font-mono text-neutral-300">100x Oil</span>
          </MicroscopeDataPanel>
        </motion.div>

        {/* Bottom Progress */}
        <motion.div
          style={{ opacity: reticleOpacity }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30"
        >
          <div className="glass rounded-xl px-5 py-3 flex items-center gap-4">
            <span className="text-[9px] text-neutral-500 tracking-wider">
              ZOOM
            </span>
            <div className="w-40 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full"
                style={{ scaleX: smoothProgress, transformOrigin: "left" }}
              />
            </div>
            <span ref={zoomPercentRef} className="text-[11px] font-mono text-orange-400 tabular-nums w-8">
              0%
            </span>
          </div>

          <motion.div
            animate={{ y: [0, 5, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            className="flex flex-col items-center mt-3"
          >
            <span className="text-[8px] text-neutral-600 tracking-widest mb-1">
              SCROLL
            </span>
            <svg
              width="14"
              height="20"
              viewBox="0 0 14 20"
              className="text-neutral-600"
            >
              <rect
                x="1"
                y="1"
                width="12"
                height="18"
                rx="6"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
              />
              <circle cx="7" cy="6" r="1.5" fill="currentColor" />
            </svg>
          </motion.div>
        </motion.div>

        {/* Video Reveal */}
        <motion.div
          style={{ opacity: videoOpacity, scale: videoScale }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="relative w-full h-full">
            <video
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src="/videos/hero-video.mp4" type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-gradient-radial from-transparent via-transparent to-[#0a0a0b] pointer-events-none" />
          </div>
        </motion.div>

        {/* Content Reveal */}
        <motion.div
          style={{ opacity: contentOpacity, y: contentY }}
          className="absolute inset-x-0 bottom-0 z-30 pb-8 pt-32 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/90 to-transparent"
        >
          <div className="max-w-4xl mx-auto text-center px-6">
            <span className="text-[10px] text-orange-400 tracking-widest">
              COMPOUND IDENTIFIED
            </span>
            <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-light mt-2 text-white">
              Synaptic Modulator <span className="gradient-text">NXB-7749</span>
            </h2>
            <p className="text-neutral-500 text-sm md:text-base mt-3 max-w-xl mx-auto">
              Novel peptide-based compound for targeted neural pathway research
            </p>

            <div className="flex items-center justify-center gap-3 mt-5">
              <StatBadge label="PURITY" value="99.7%" />
              <StatBadge label="Ki" value="4.2 nM" highlight />
              <StatBadge label="SELECT." value=">100x" />
            </div>
          </div>
        </motion.div>

        {/* Bottom progress bar */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-white/5 z-40">
          <motion.div
            className="h-full bg-gradient-to-r from-orange-500 to-red-500"
            style={{ scaleX: smoothProgress, transformOrigin: "left" }}
          />
        </div>
      </div>
    </section>
  );
}

// Microscope Data Panel Component
function MicroscopeDataPanel({
  label,
  children,
  align = "left",
}: {
  label: string;
  children: React.ReactNode;
  align?: "left" | "right";
}) {
  return (
    <div
      className={`glass rounded-lg px-3 py-1.5 min-w-[100px] ${align === "right" ? "text-right" : ""
        }`}
    >
      <span className="text-[8px] text-neutral-600 tracking-wider block">
        {label}
      </span>
      <div
        className={`flex items-baseline gap-1 ${align === "right" ? "justify-end" : ""}`}
      >
        {children}
      </div>
    </div>
  );
}

// Stat Badge Component
function StatBadge({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="glass rounded-lg px-4 py-2">
      <span className="text-[9px] text-neutral-600 block">{label}</span>
      <span
        className={`text-base font-light ${highlight ? "text-orange-400" : "text-white"}`}
      >
        {value}
      </span>
    </div>
  );
}
