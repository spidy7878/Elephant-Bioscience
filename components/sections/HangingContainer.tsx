"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function HangingContainer() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Main swing animation
    // gsap.to(containerRef.current, {
    //   rotation: 2,
    //   duration: 2.8,
    //   ease: "sine.inOut",
    //   transformOrigin: "top center",
    //   yoyo: true,
    //   repeat: -1,
    // });

    gsap.to(containerRef.current, {
      rotation: 1.5,
      duration: 3.2,
      ease: "power1.inOut",
      transformOrigin: "top center",
      yoyo: true,
      repeat: -1,
    });

    // Small vibration for realism
    gsap.to(containerRef.current, {
      x: 0.6,
      duration: 0.15,
      ease: "power1.inOut",
      yoyo: true,
      repeat: -1,
    });
  }, []);

  return (
    <div className="hanging-wrapper">
      <div ref={containerRef} className="hanging-container" style={{ willChange: "transform" }} />
    </div>
  );
}
