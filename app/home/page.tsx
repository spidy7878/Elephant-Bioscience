// src/app/home/page.tsx
"use client";

import Hero from "components/sections/Hero";
import AboutSection from "components/sections/AboutSection";
import AboutBrandGrid from "components/sections/AboutBrandGrid";
import { motion } from "framer-motion";

export default function HomePage({
  titleOpacity = 1,
  sectionsOpacity = 1,
  showVideo = true,
  showSections = true,
}: {
  titleOpacity?: any;
  sectionsOpacity?: any;
  showVideo?: boolean;
  showSections?: boolean;
}) {
  return (
    <div className="relative w-full bg-transparent">
      {/* Background Video - positioned to cover all content */}
      {showVideo && (
        <div className="fixed inset-0 z-0">
          <video
            autoPlay
            loop
            muted
            playsInline
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
