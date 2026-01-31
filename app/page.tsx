"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  motion,
  AnimatePresence,
  MotionValue,
  useScroll,
  useTransform,
} from "framer-motion";
import HeroSection from "components/sections/HeroSection";
import LoadingSection from "components/sections/LoadingSection";
import NavigationBar from "components/sections/NavigationBar";
import {
  loadMicroscopeImages,
  renderFrameToCanvas,
  TOTAL_FRAMES,
} from "../lib/imageUtils";
import AboutBrandGrid from "../components/sections/AboutBrandGrid";
import AboutSection from "../components/sections/AboutSection";
import Hero from "components/sections/Hero";
import HangingContainer from "../components/sections/HangingContainer";
import { useRouter } from "next/navigation";
import HeroVisual from "@/components/sections/HeroVisual";
import ProductShowcase from "components/sections/ProductShowcase";
import Modal from "components/ui/LoginModal"; // Restored

export default function Home() {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number>();

  // States
  const [scrollY, setScrollYState] = useState(0);
  const [windowHeight, setWindowHeight] = useState(1000);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const router = useRouter();

  // Modal State
  const [isLoginOpen, setLoginOpen] = useState(false);

  const [microscopeProgress, setMicroscopeProgress] =
    useState<MotionValue<number> | null>(null);

  const { scrollYProgress: totalProgress } = useScroll();

  // Opacity for the internal title (revealed via mask)
  const internalTitleOpacity = 1;

  // Preload microscope images
  useEffect(() => {
    let isMounted = true;

    loadMicroscopeImages((progress: number) => {
      if (isMounted) {
        setLoadingProgress(progress);
      }
    }).then((images: HTMLImageElement[]) => {
      if (isMounted) {
        imagesRef.current = images;
        setIsImagesLoaded(true);
      }
    });

    return () => {
      isMounted = false;
    };
  }, []);

  // Render frame to canvas
  const renderFrame = useCallback((frameIndex: number) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[frameIndex];
    if (canvas && img) {
      renderFrameToCanvas(canvas, img);
    }
  }, []);

  // Animation loop for canvas
  useEffect(() => {
    if (!isImagesLoaded) return;

    const animate = () => {
      const frame = frameRef.current;
      if (imagesRef.current[frame]) {
        renderFrame(frame);
      }
      rafRef.current = requestAnimationFrame(animate);
    };

    rafRef.current = requestAnimationFrame(animate);

    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, [isImagesLoaded, renderFrame]);

  // Update frame based on microscope scroll
  useEffect(() => {
    if (!microscopeProgress) return;

    const unsubscribe = microscopeProgress.on("change", (latest) => {
      if (!isImagesLoaded) return;
      // Adjusted power curve for a more fluid frame progression
      const easedProgress = Math.pow(latest, 2.0);
      const newFrame = Math.min(
        Math.floor(easedProgress * TOTAL_FRAMES),
        TOTAL_FRAMES - 1
      );
      frameRef.current = Math.max(0, newFrame);
    });

    return unsubscribe;
  }, [microscopeProgress, isImagesLoaded]);

  // General scroll handling
  useEffect(() => {
    const handleScroll = () => {
      setScrollYState(window.scrollY);
    };

    const handleResize = () => {
      setWindowHeight(window.innerHeight);
    };

    handleResize();

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const totalScrollProgress = scrollY / (windowHeight * 11);

  // Handlers for Login Modal
  const handleModalClose = () => setLoginOpen(false);
  const handleLogin = async () => {
    // Logic for login handled in modal, but we can close it here on success if needed
    // returning boolean as expected by Modal's interface
    return true;
  };
  const handleRequest = async () => {
    return true;
  }

  return (
    <div className="bg-transparent">
      {/* Loading Screen */}
      <AnimatePresence>
        {!isImagesLoaded && (
          <LoadingSection loadingProgress={loadingProgress} />
        )}
      </AnimatePresence>

      {/* Progress Bar */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          height: "2px",
          background: "linear-gradient(90deg, #ff2d55, #ff6b2c, #ffb800)",
          zIndex: 9998,
          width: `${totalScrollProgress * 100}%`,
          opacity: isImagesLoaded ? 1 : 0,
          transition: "opacity 0.5s",
        }}
      />

      {/* Navigation */}
      <NavigationBar
        scrollY={scrollY}
        isImagesLoaded={isImagesLoaded}
        transparent={scrollY > windowHeight * 5.5}
      />

      {/* Microscope Zoom - Reveals Full Content through its lens */}
      <HeroSection
        canvasRef={canvasRef}
        isImagesLoaded={isImagesLoaded}
        frameRef={frameRef}
        onProgressChange={(progress: MotionValue<number>) =>
          setMicroscopeProgress(progress)
        }
      >
        {/* Inlined HomePage content (without video) */}
        <div className="relative w-full bg-transparent">
          {/* Content Sections */}
          <div className="relative z-10">
            <Hero opacity={internalTitleOpacity} />
          </div>
        </div>
      </HeroSection>

      {/* Persist video across remaining sections */}
      {microscopeProgress && <BackgroundVideo progress={microscopeProgress} />}

      <motion.div
        className="relative z-10"
        style={{ opacity: useTransform(totalProgress, [0.45, 0.52], [0, 1]) }}
      >
        <AboutSection />
        <AboutBrandGrid />
        {/* GSAP Hanging Animation - after AboutBrandGrid */}
        <div
          style={{ position: "relative", zIndex: 20, overflow: "visible" }}
          className="flex justify-center w-full"
        >
          <HeroVisual />
        </div>
        <ProductShowcase />
      </motion.div>

      {isImagesLoaded && (
        <div
          style={{
            position: "fixed",
            left: "50%",
            bottom: "40px",
            transform: "translateX(-50%)",
            zIndex: 10001,
            opacity: 1,
            transition: "opacity 200ms ease",
          }}
        >
          <button
            onClick={() => setLoginOpen(true)} // Open Login Modal
            style={{
              padding: "12px 24px",
              background: "#8C2224",
              border: "none",
              borderRadius: "100px",
              color: "#fff",
              fontSize: "15px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 4px 20px rgba(140, 34, 36, 0.15)",
              transition: "transform 0.3s, box-shadow 0.3s",
              letterSpacing: 0.5,
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.transform = "scale(1.05)")
            }
            onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
          >
            Explore Products
          </button>
        </div>
      )}

      {/* Restored Modal */}
      <Modal
        isOpen={isLoginOpen}
        onClose={handleModalClose}
        onLogin={handleLogin}
        onRequest={handleRequest}
      />
    </div>
  );
}

// Helper component to handle opacity transform based on specific progress
function SectionsContainer({
  progress,
  children,
}: {
  progress: MotionValue<number>;
  children: React.ReactNode;
}) {
  // We trigger the fade-in only at the very end of the zoom (0.95 to 1.0),
  // matching the mask expansion in HeroSection.
  const opacity = useTransform(progress, [0.95, 1], [0, 1]);

  return <motion.div style={{ opacity }}>{children}</motion.div>;
}

function BackgroundVideo({ progress }: { progress: MotionValue<number> }) {
  // Sync background video appearance with the start of the zoom (0.8)
  // Matching the microscope fade-out for a smooth cross-fade.
  const opacity = useTransform(progress, [0.8, 0.9], [0, 1]);

  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <motion.video
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover"
        style={{ opacity }}
      >
        <source src="/videos/movement.mp4" type="video/mp4" />
      </motion.video>
    </div>
  );
}
