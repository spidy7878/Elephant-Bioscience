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
    <section
      className="hero-wrapper"
      style={{
        position: "relative",
        background: "transparent",
        minHeight: "400px",
        zIndex: 100,
        overflow: "visible",
      }}
    >
      {/* Hanging container - behind everything */}
      <div
        ref={containerRef}
        className="container-img"
        style={{
          position: "absolute",
          left: "50%",
          top: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 50,
          width: "700px",
          height: "700px",
          pointerEvents: "none",
        }}
      />

      {/* Red liquid */}
      <div
        className="liquid-img"
        style={{
          position: "relative",
          zIndex: 101,
          width: "350px",
          height: "350px",
        }}
      />

      {/* Text as image */}
      <div className="relative w-full max-w-5xl mx-auto px-6 pb-24 flex flex-col items-center justify-center">
        <img
          src="/text.PNG"
          alt="Text"
          style={{
            maxWidth: "100%",
            height: "auto",
            display: "block",
            margin: "-14rem auto 0 auto",
          }}
        />
      </div>

      {/* Hanging container moved inside liquid-img for overflow effect */}
    </section>
  );
}
