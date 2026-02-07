// src/app/home/page.tsx
"use client";

import Hero from "components/sections/Hero";
import AboutSection from "components/sections/AboutSection";
import AboutBrandGrid from "components/sections/AboutBrandGrid";
import { motion } from "framer-motion";
import { useEffect, useRef } from "react";

export default function HomePage() {
  // Set default values here
  const titleOpacity = 1;
  const sectionsOpacity = 1;
  const showVideo = true;
  const showSections = true;

  // Ref to video for manual play trigger
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const attemptPlay = () => {
      const playPromise = video.play();
      if (playPromise !== undefined) {
        playPromise.catch((error) => {
          console.log("Autoplay failed:", error);
        });
      }
    };

    attemptPlay();

    const handleInteraction = () => {
      if (video.paused) {
        attemptPlay();
      }
    };

    window.addEventListener('touchstart', handleInteraction, { passive: true });
    window.addEventListener('click', handleInteraction);

    return () => {
      window.removeEventListener('touchstart', handleInteraction);
      window.removeEventListener('click', handleInteraction);
    };
  }, []);

  return (
    <div className="relative w-full bg-transparent">
      {/* Background Video - positioned to cover all content */}
      {showVideo && (
        <div className="fixed inset-0 z-0">
          <video
            ref={videoRef}
            autoPlay
            loop
            muted
            playsInline
            controls={false}
            className="w-full h-full object-cover"
          >
            <source src="/videos/movement.mp4" type="video/mp4" />
          </video>
        </div>
      )}

      {/* Content Sections */}
      <div className="relative z-10">
        <Hero opacity={titleOpacity} />
      </div>


      {showSections && (
        <motion.div style={{ opacity: sectionsOpacity }}>
          <AboutSection />
          <AboutBrandGrid />
        </motion.div>
      )}
    </div>
  );
}
