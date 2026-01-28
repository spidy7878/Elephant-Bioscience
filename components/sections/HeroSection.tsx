"use client";

import {
  motion,
  MotionValue,
  useScroll,
  useSpring,
  useTransform,
  useMotionTemplate,
} from "framer-motion";
import { forwardRef, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { TOTAL_FRAMES } from "../../lib/imageUtils";

interface HeroSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isImagesLoaded: boolean;
  frameRef: React.RefObject<number>;
  onProgressChange: (progress: MotionValue<number>) => void;
  children?: React.ReactNode;
}

const HeroSection = forwardRef<HTMLElement, HeroSectionProps>(
  (
    { canvasRef, isImagesLoaded, frameRef, onProgressChange, children },
    ref
  ) => {
    const sectionRef = useRef<HTMLElement>(null);
    const router = useRouter();

    // Scroll tracking for zoom animation
    const { scrollYProgress } = useScroll({
      target: sectionRef,
      offset: ["start start", "end end"],
    });

    const smoothProgress = useSpring(scrollYProgress, {
      stiffness: 400, // Increased for tighter sync with scroll
      damping: 30,
      mass: 0.5, // Reduced mass for snappier response
      restDelta: 0.001,
    });

    // Pass progress to parent for frame updates (in useEffect to avoid render issues)
    useEffect(() => {
      onProgressChange(smoothProgress);
    }, [smoothProgress, onProgressChange]);

    // Fade out text and UI as zoom progresses
    const textOpacity = useTransform(smoothProgress, [0, 0.3], [1, 0]);
    const textY = useTransform(smoothProgress, [0, 0.3], [0, -50]);

    // Child Content Animation
    // We stay at opacity 1 to ensure a seamless "punch through"
    // without a black flicker before the page content takes over.
    const contentOpacity = useTransform(
      smoothProgress,
      [0, 0.85, 0.9],
      [0, 0, 1]
    );

    // Scaling the sequence canvas to create a "magnification" effect before the content swap
    // Increased the peak scale for a more dramatic entrance into the lens
    const canvasScale = useTransform(
      smoothProgress,
      [0, 0.4, 0.7, 0.85, 0.9, 1],
      [1, 1.2, 1.8, 3.5, 8.5, 15]
    );

    // Initial content size stays small and static until the very end "burst"
    // Increased initial scale and mask for better title readability while scrolling down
    const contentScale = useTransform(
      smoothProgress,
      [0, 0.85, 0.98, 1],
      [0.4, 0.4, 1.0, 1.1]
    );

    // Using vmin to maintain a perfect circle relative to the smaller screen dimension
    const maskSizeValue = useTransform(
      smoothProgress,
      [0, 0.85, 0.98, 1],
      [14, 14, 150, 150]
    );
    const maskPercentage = useMotionTemplate`circle(${maskSizeValue}vmin at 50% 50%)`;

    // Fade out the microscope elements as we punch through
    // Timing synced with the mask expansion
    const microscopeOpacity = useTransform(smoothProgress, [0.8, 0.9], [1, 0]);

    const backgroundBodyOpacity = useTransform(
      smoothProgress,
      [0.75, 0.85],
      [1, 0]
    );

    // Background body animations
    const backgroundScale = useTransform(smoothProgress, [0, 0.96], [1, 1.6]);
    const backgroundBlur = useTransform(
      smoothProgress,
      [0, 0.5, 0.9],
      [0, 0, 0]
    );
    const backgroundBlurFilter = useMotionTemplate`blur(${backgroundBlur}px)`;

    // Dynamic vignette that stays tight while the microscope is "fixed"
    // Then expands rapidly during the punch-through
    const vignetteInner = useTransform(
      smoothProgress,
      [0, 0.9, 0.96, 1],
      [40, 40, 65, 110]
    );
    const vignetteOuter = useTransform(
      smoothProgress,
      [0, 0.9, 0.96, 1],
      [70, 70, 90, 160]
    );

    // Slowly increase the "blackness" as we zoom in for a more cinematic feel
    // But we keep it slightly transparent at the end to avoid a hard black "blink"
    const vignetteColor1 = useTransform(
      smoothProgress,
      [0, 0.85],
      ["rgba(0,0,0,0.15)", "rgba(0,0,0,0.35)"]
    );
    const vignetteColor2 = useTransform(
      smoothProgress,
      [0, 0.85],
      ["rgba(0,0,0,0.4)", "rgba(0,0,0,0.7)"]
    );
    const vignetteColor3 = useTransform(
      smoothProgress,
      [0, 0.85],
      ["rgba(0,0,0,0.65)", "rgba(0,0,0,0.95)"]
    );

    const vignetteOpacity = useTransform(smoothProgress, [0.8, 0.9], [1, 0]);
    const vignetteGradient = useMotionTemplate`radial-gradient(circle at 50% 50%, 
                  transparent ${vignetteInner}%, 
                  ${vignetteColor1} ${vignetteOuter}%, 
                  ${vignetteColor2} ${useTransform(
      smoothProgress,
      [0, 0.95],
      [45, 200]
    )}%, 
                  ${vignetteColor3} 100%
                )`;

    // Microscope UI data computed from frameRef
    // These are only calculated when the component renders (which is rare now)
    // The UI elements using these fade out early in the animation anyway
    const currentFrame = frameRef.current ?? 0;
    const magnification = Math.round(1 + (currentFrame / TOTAL_FRAMES) * 499);
    const focusDepth = ((currentFrame / TOTAL_FRAMES) * 5).toFixed(2);
    const frameNumber = (currentFrame + 1).toString().padStart(4, "0");

    const mobileVideoRef = useRef<HTMLVideoElement>(null);

    return (
      <section
        ref={sectionRef}
        // Force layout update: Reverted to original 67.5% positioning
        className="relative z-10"
        style={{
          height: "600vh", // Extended to ensure title reaches "atmost" before release
          backgroundColor: "transparent", // Enable background video reveal
        }}
      >
        <div className="sticky top-0 h-screen w-full flex items-center justify-center overflow-hidden">
          {/* Background Microscope Body - now a video, scales up as we zoom in */}
          <motion.div
            className="absolute inset-0 z-0"
            style={{
              scale: backgroundScale,
              filter: useMotionTemplate`blur(${backgroundBlur}px)`,
              opacity: backgroundBodyOpacity, // Dissolves early to clear clutter
              transformOrigin: "50% 50%",
            }}
          >
            {isImagesLoaded && (
              <>
                {/* Show video on medium and larger screens */}
                <motion.div
                  className="absolute inset-0 z-0 hidden md:block"
                  style={{
                    scale: backgroundScale,
                    filter: backgroundBlurFilter,
                    opacity: microscopeOpacity, // Dissolves as iris opens
                    transformOrigin: "50% 50%",
                  }}
                >
                  <video
                    autoPlay
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                      zIndex: -1,
                    }}
                  >
                    <source src="/videos/home_back.mp4" type="video/mp4" />
                  </video>
                </motion.div>
                {/* Show video on small screens */}
                <motion.div
                  className="absolute inset-0 z-0 block md:hidden"
                  style={{
                    scale: backgroundScale,
                    filter: backgroundBlurFilter,
                    opacity: microscopeOpacity,
                    transformOrigin: "50% 50%",
                  }}
                >
                  <video
                    ref={mobileVideoRef}
                    autoPlay
                    muted
                    playsInline
                    preload="auto"
                    className="w-full h-full object-cover"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      inset: 0,
                      zIndex: -1,
                    }}
                  >
                    <source src="/videos/mob2.mp4" type="video/mp4" />
                  </video>
                </motion.div>
              </>
            )}
            <canvas
              ref={canvasRef}
              style={{
                width: "40%",
                height: "65%",
                objectFit: "cover",
                // width: "50vw",
                // height: "50vh",
                // maxWidth: "800px",
                // maxHeight: "600px",
                // objectFit: "contain",
              }}
            />
          </motion.div>

          <motion.div
            className="absolute inset-0 z-[1]"
            style={{
              scale: canvasScale,
              opacity: microscopeOpacity, // Dissolves as iris opens
              transformOrigin: "50% 50%",
            }}
          >
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center w-full">
              <canvas
                ref={canvasRef}
                className="w-[80vw] md:w-[40%]"
                style={{
                  height: "80vh", // Adjusted for better aspect ratio coverage
                  objectFit: "cover",
                }}
              />
            </div>
          </motion.div>

          {/* Global Darkener - dims the microscope body as we zoom into the lens */}
          {/* Global Darkener - Removed to clarify video reveal */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-[2]"
            style={{
              backgroundColor: "#0a0a0b",
              opacity: 0,
            }}
          />

          {/* Child content revealed via microscope */}
          <motion.div
            className="absolute inset-0 z-[5] overflow-hidden w-full h-full"
            style={{
              opacity: contentOpacity,
              clipPath: maskPercentage,
              scale: contentScale,
              transformOrigin: "50% 67.5%",
            }}
          >
            {children}
          </motion.div>

          {/* Microscope UI Overlay */}
          <motion.div
            className="absolute inset-0 z-20 pointer-events-none"
            style={{
              opacity: useTransform(
                smoothProgress,
                [0, 0.1, 0.65, 0.75],
                [0, 1, 1, 0]
              ),
            }}
          >
            {/* Dynamic Vignette - expands with the zoom */}
            <motion.div
              className="absolute inset-0"
              style={{
                background: vignetteGradient,
                opacity: vignetteOpacity,
              }}
            />

            {/* Data Panels Hidden */}
          </motion.div>

          {/* Left Content - "We are precision" (hidden on small screens) */}
          <motion.div
            className="absolute bottom-20 -translate-y-1/2 z-[30] hidden md:block"
            style={{
              opacity: textOpacity,
              y: textY,
              x: -60, // 👈 THIS is the fix
            }}
          >
            <h1 className="font-bold mb-8">
              <div className="text-4xl md:text-5xl leading-tight text-[#8C2224] drop-shadow-lg">
                We are
              </div>
              <div className="text-4xl md:text-5xl leading-tight text-[#8C2224] drop-shadow-lg">
                Movement
              </div>
            </h1>
          </motion.div>

          {/* Right Content - "We are innovation" (hidden on small screens) */}
          <motion.div
            className="absolute right-8 md:right-20 top-1/2 -translate-y-1/2 max-w-md z-10 text-right hidden md:block"
            style={{ opacity: textOpacity, y: textY }}
          >
            <h1 className="font-bold">
              <div className="text-5xl md:text-7xl leading-tight text-[#8C2224] drop-shadow-lg">
                We are
              </div>
              <div className="text-5xl md:text-7xl leading-tight text-[#8C2224] drop-shadow-lg">
                innovation
              </div>
            </h1>
          </motion.div>
        </div>
      </section>
    );
  }
);

HeroSection.displayName = "HeroSection";

export default HeroSection;
