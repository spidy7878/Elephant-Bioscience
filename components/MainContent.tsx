"use client";

import { useRef, useState, useEffect } from "react";
import { useScrollProgress } from "@/hooks/useScrollProgress";
import { useMousePosition } from "@/hooks/useMousePosition";
import { useIsMobile } from "@/hooks/useMediaQuery";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ScrollIndicator from "@/components/layout/ScrollIndicator";
import HeroSection from "@/components/sections/HeroSection";
import MorphSection from "@/components/sections/MorphSection";
import FeaturesSection from "@/components/sections/FeaturesSection";
import StatsSection from "@/components/sections/StatsSection";
import ReferencesSection from "@/components/sections/ReferencesSection";
import VideoBackground from "@/components/video/VideoBackground";
import PortalRing from "@/components/video/PortalRing";
import CustomCursor from "@/components/effects/CustomCursor";
import Noise from "@/components/effects/Noise";
import Scanlines from "@/components/effects/Scanlines";
import LoadingScreen from "@/components/effects/LoadingScreen";

export default function MainContent() {
  const heroRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [heroProgress, setHeroProgress] = useState(0);
  const [isImagesLoaded, setIsImagesLoaded] = useState(false);

  const { scrollY, scrollProgress, scrollDirection, isScrolled } =
    useScrollProgress();
  const mousePosition = useMousePosition(0.05);
  const isMobile = useIsMobile();

  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const rect = hero.getBoundingClientRect();
    const progress = Math.max(0, Math.min(1, -rect.top / (rect.height * 0.8)));
    setHeroProgress(progress);
  }, [scrollY]);

  const handleVideoLoad = () => {
    setTimeout(() => setIsLoading(false), 500);
  };

  // Dummy handler for onProgressChange
  const handleProgressChange = () => {};

  return (
    <>
      <LoadingScreen isLoading={isLoading} />

      {!isMobile && <CustomCursor mousePosition={mousePosition} />}

      <div
        className="fixed top-0 left-0 h-[3px] bg-gradient-to-r from-accent-red via-accent-orange to-accent-gold z-[1000] origin-left"
        style={{ transform: `scaleX(${scrollProgress})` }}
      />

      <VideoBackground
        ref={videoRef}
        heroProgress={heroProgress}
        mousePosition={mousePosition}
        onLoad={handleVideoLoad}
      />

      <PortalRing heroProgress={heroProgress} />

      <Noise />
      <Scanlines />

      <Navbar
        isScrolled={isScrolled}
        isHidden={scrollDirection === "down" && heroProgress > 0.5}
      />

      <ScrollIndicator isHidden={isScrolled} />

      <main className="relative z-10">
        <HeroSection
          ref={heroRef}
          canvasRef={canvasRef}
          isImagesLoaded={isImagesLoaded}
          frameRef={frameRef}
          onProgressChange={handleProgressChange}
        />
        <StatsSection />
        <MorphSection heroProgress={heroProgress} />
        <FeaturesSection />
        <ReferencesSection />
        <Footer />
      </main>
    </>
  );
}
