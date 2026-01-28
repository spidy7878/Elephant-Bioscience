"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HeroVisual() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Hanging swing animation
    gsap.to(containerRef.current, {
      rotation: 1.8,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
      transformOrigin: "top center",
    });

    // Very subtle vibration
    gsap.to(containerRef.current, {
      x: 0.5,
      duration: 0.15,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <section className="hero-visual-section">
      {/* Hanging container - behind everything */}
      <div ref={containerRef} className="container-img-wrapper">
        <img src="/container.png" alt="Container" />
      </div>

      {/* Red liquid */}
      <div className="liquid-img-wrapper">
        <img src="/liquid.png" alt="Liquid" />
      </div>

      {/* Text as image */}
      <div className="text-img-container">
        <img src="/text.png" alt="Text" className="text-img" />
      </div>
    </section>
  );
}
