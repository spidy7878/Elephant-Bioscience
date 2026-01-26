// src/components/sections/WindowZoomSection.tsx
"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

interface WindowZoomSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isImagesLoaded: boolean;
}

export default function WindowZoomSection({
  canvasRef,
  isImagesLoaded,
}: WindowZoomSectionProps) {
  const windowZoomRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for window zoom phase
  const { scrollYProgress: windowZoomProgress } = useScroll({
    target: windowZoomRef,
    offset: ["start start", "end end"],
  });

  const smoothWindowProgress = useSpring(windowZoomProgress, {
    stiffness: 50,
    damping: 20,
  });

  // Window/aperture transforms
  const apertureScale = useTransform(
    smoothWindowProgress,
    [0, 0.3, 1],
    [0.1, 0.3, 15]
  );
  const apertureOpacity = useTransform(smoothWindowProgress, [0, 0.1], [1, 1]);
  const outerDarkness = useTransform(
    smoothWindowProgress,
    [0, 0.5, 1],
    [1, 0.8, 0]
  );
  const windowBlur = useTransform(smoothWindowProgress, [0.7, 1], [0, 0]);
  const initialTextOpacity = useTransform(
    smoothWindowProgress,
    [0, 0.15],
    [1, 0]
  );

  return (
    <section
      ref={windowZoomRef}
      style={{
        height: "200vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          width: "100%",
          overflow: "hidden",
          backgroundColor: "transparent",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* Outer darkness overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#030303",
            opacity: outerDarkness,
            zIndex: 5,
            pointerEvents: "none",
          }}
        />

        {/* Aperture/window effect */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 10,
            pointerEvents: "none",
          }}
        >
          <motion.div
            style={{
              width: "100vmax",
              height: "100vmax",
              borderRadius: "50%",
              scale: apertureScale,
              opacity: apertureOpacity,
              background: "transparent",
              boxShadow: `
                inset 0 0 0 3px rgba(255,107,44,0.3),
                inset 0 0 100px 50px rgba(0,0,0,0.9),
                0 0 0 100vmax #000
              `,
              filter: `blur(${windowBlur.get()}px)`,
            }}
          />
        </div>

        {/* Decorative rings */}
        <motion.div
          style={{
            position: "absolute",
            width: "300px",
            height: "300px",
            borderRadius: "50%",
            border: "1px solid rgba(255,107,44,0.2)",
            scale: apertureScale,
            opacity: useTransform(
              smoothWindowProgress,
              [0, 0.3, 0.8],
              [1, 0.5, 0]
            ),
            zIndex: 11,
          }}
        />
        <motion.div
          style={{
            position: "absolute",
            width: "320px",
            height: "320px",
            borderRadius: "50%",
            border: "1px solid rgba(255,45,85,0.15)",
            scale: apertureScale,
            opacity: useTransform(
              smoothWindowProgress,
              [0, 0.3, 0.7],
              [0.8, 0.3, 0]
            ),
            zIndex: 11,
          }}
        />

        {/* Initial text */}
        <motion.div
          style={{
            position: "absolute",
            zIndex: 20,
            textAlign: "center",
            opacity: initialTextOpacity,
          }}
        >
          <h1
            style={{
              fontSize: "clamp(40px, 8vw, 80px)",
              fontWeight: 900,
              color: "#fff",
              marginBottom: "16px",
              letterSpacing: "-0.03em",
            }}
          >
            Journey Into the Microscopic
          </h1>
          <p style={{ fontSize: "18px", color: "#888", maxWidth: "600px" }}>
            Witness cellular precision at 500× magnification
          </p>
        </motion.div>

        {/* Canvas for microscope images */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1,
            opacity: useTransform(smoothWindowProgress, [0.1, 0.3], [0, 1]),
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              opacity: isImagesLoaded ? 1 : 0,
            }}
          />
        </motion.div>
      </div>
    </section>
  );
}
