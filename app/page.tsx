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
import Modal from "components/ui/LoginModal";
import ConnectModal from "components/ui/ConnectModal";

export default function Home() {
  // Refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const frameRef = useRef(0);
  const rafRef = useRef<number>();

  // Ref for intersection observer
  const showcaseRef = useRef<HTMLDivElement>(null);

  // States
  const [scrollY, setScrollYState] = useState(0);
  const [windowHeight, setWindowHeight] = useState(1000);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);
  const [showStickyButton, setShowStickyButton] = useState(true);
  const router = useRouter();

  // Modal State
  const [isLoginOpen, setLoginOpen] = useState(false);
  const [isConnectOpen, setConnectOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [microscopeProgress, setMicroscopeProgress] =
    useState<MotionValue<number> | null>(null);

  const { scrollYProgress: totalProgress } = useScroll();

  // Opacity for the internal title (revealed via mask)
  const internalTitleOpacity = 1;


  // Preload microscope images
  useEffect(() => {
    let isMounted = true;

    // Initial window height set
    setWindowHeight(window.innerHeight);

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

  // General scroll handling with throttling to prevent update depth error
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const currentScrollY = window.scrollY;
          setScrollYState(currentScrollY);

          // Instant Sticky Button Logic using Direct Read
          // This avoids "stale closure" issues with cached heights and handles dynamic resizing instantly
          if (showcaseRef.current) {
            const rect = showcaseRef.current.getBoundingClientRect();
            const currentWindowHeight = window.innerHeight; // Read live height

            // Calculate center of showcase relative to viewport top
            // rect.top is already relative to viewport
            const showcaseCenterViewport = rect.top + (rect.height / 2);

            // Trigger when center is at bottom (minus visual offest)
            const triggerPoint = currentWindowHeight - 60;

            // If center is lower than trigger (offscreen or just entering bottom), Show.
            const shouldShow = showcaseCenterViewport > triggerPoint;

            setShowStickyButton(prev => prev === shouldShow ? prev : shouldShow);
          }

          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", () => setWindowHeight(window.innerHeight));

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", () => setWindowHeight(window.innerHeight));
    };
  }, []); // Empty dependency array - purely Ref based

  const totalScrollProgress = scrollY / (windowHeight * 5);

  // Stable callback to prevent infinite re-renders
  const handleProgressChange = useCallback((progress: MotionValue<number>) => {
    setMicroscopeProgress(progress);
  }, []);

  // Check for persisted login state
  useEffect(() => {
    const persistedLogin = localStorage.getItem("isLoggedIn");
    if (persistedLogin === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  // Modal handlers
  const handleModalClose = useCallback(() => {
    setLoginOpen(false);
  }, [setLoginOpen]);

  // Login handler
  const handleLogin = useCallback(() => {
    setLoginOpen(false); // Close modal
    setIsLoggedIn(true); // Update UI state to show products
    localStorage.setItem("isLoggedIn", "true"); // Persist state
    return true;
  }, [setLoginOpen, setIsLoggedIn]);



  const handleRequest = useCallback(async () => {
    return true;
  }, []);

  const handleExploreClick = () => {
    if (showcaseRef.current) {
      showcaseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      // Only open login modal if not logged in
      if (!isLoggedIn) {
        setTimeout(() => setLoginOpen(true), 800);
      }
    } else {
      if (!isLoggedIn) {
        setLoginOpen(true);
      }
    }
  };

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
        transparent={scrollY > windowHeight * 1.5}
        onConnectClick={() => setConnectOpen(true)}
      />

      {/* Microscope Zoom - Reveals Full Content through its lens */}
      <HeroSection
        canvasRef={canvasRef}
        isImagesLoaded={isImagesLoaded}
        frameRef={frameRef}
        onProgressChange={handleProgressChange} // Use the stable callback
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
        className="relative z-10 mt-24 md:-mt-32"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >

        <AboutBrandGrid />
        {/* GSAP Hanging Animation - after AboutBrandGrid */}
        <div
          style={{ position: "relative", zIndex: 20, overflow: "visible" }}
          className="flex justify-center w-full"
        >
          <HeroVisual />
        </div>

        {/* Wrap ProductShowcase in ref to detect intersection */}
        <div ref={showcaseRef}>
          <ProductShowcase
            onOpenLogin={() => setLoginOpen(true)}
            showButton={!showStickyButton && !isLoggedIn && !isLoginOpen}
            isLoggedIn={isLoggedIn}
          />
        </div>
      </motion.div>

      {/* Sticky Button managed by state */}
      <AnimatePresence>
        {isImagesLoaded && showStickyButton && !isLoginOpen && (
          <motion.div
            // initial and animate props removed to stop disappearance on scroll up
            style={{
              position: "fixed",
              left: "50%",
              bottom: "50px",
              x: "-50%", // transform translateX
              zIndex: 10001,
            }}
          >
            <motion.button
              onClick={handleExploreClick}
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
                letterSpacing: 0.5,
              }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              transition={{ duration: 0.3 }}
            >
              Explore Products
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <Modal
        isOpen={isLoginOpen}
        onClose={handleModalClose}
        onLogin={handleLogin}
        onRequest={handleRequest}
      />

      {/* Connect Modal */}
      <ConnectModal
        isOpen={isConnectOpen}
        onClose={() => setConnectOpen(false)}
        onRequest={handleRequest}
      />
    </div >
  );
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
