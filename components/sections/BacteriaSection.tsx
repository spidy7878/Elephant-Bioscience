// src/components/sections/BacteriaSection.tsx
"use client";

import { useRef } from "react";
import dynamic from "next/dynamic";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";

// Dynamic import for Three.js component (client-side only)
const BacteriaScene = dynamic(() => import("../three/BacteriaScene"), {
  ssr: false,
  loading: () => null,
});

interface BacteriaSectionProps {
  mouseX: number;
  mouseY: number;
  microscopeProgress: MotionValue<number>;
}

export default function BacteriaSection({
  mouseX,
  mouseY,
  microscopeProgress: _microscopeProgress,
}: BacteriaSectionProps) {
  const bacteriaRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for bacteria phase
  const { scrollYProgress: bacteriaProgress } = useScroll({
    target: bacteriaRef,
    offset: ["start start", "end end"],
  });

  const smoothBacteriaProgress = useSpring(bacteriaProgress, {
    stiffness: 80,
    damping: 25,
  });

  // Bacteria scene transforms
  const bacteriaScale = useTransform(
    smoothBacteriaProgress,
    [0, 0.5, 1],
    [1, 1.5, 3]
  );
  const bacteriaBlur = useTransform(smoothBacteriaProgress, [0.8, 1], [0, 0]);
  const contentRevealOpacity = useTransform(
    smoothBacteriaProgress,
    [0.7, 0.9],
    [0, 1]
  );
  const contentRevealY = useTransform(
    smoothBacteriaProgress,
    [0.7, 0.9],
    [100, 0]
  );

  return (
    <section
      ref={bacteriaRef}
      style={{
        height: "400vh",
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
        }}
      >
        {/* 3D Bacteria Scene */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            scale: bacteriaScale,
            filter: `blur(${bacteriaBlur.get()}px)`,
          }}
        >
          <BacteriaScene
            scrollProgress={smoothBacteriaProgress.get()}
            mouseX={mouseX}
            mouseY={mouseY}
          />
        </motion.div>

        {/* Scanning overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 10,
            pointerEvents: "none",
            opacity: useTransform(
              smoothBacteriaProgress,
              [0, 0.1, 0.7, 0.9],
              [0, 1, 1, 0]
            ),
          }}
        >
          {/* Animated scan line */}
          <motion.div
            animate={{ y: ["-100%", "100%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
            style={{
              position: "absolute",
              left: 0,
              right: 0,
              height: "2px",
              background:
                "linear-gradient(90deg, transparent, rgba(255,107,44,0.5), transparent)",
              boxShadow: "0 0 20px rgba(255,107,44,0.3)",
            }}
          />

          {/* Corner frame elements */}
          <div
            style={{
              position: "absolute",
              top: "40px",
              left: "40px",
              width: "60px",
              height: "60px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "2px",
                background:
                  "linear-gradient(90deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "2px",
                height: "100%",
                background:
                  "linear-gradient(180deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              top: "40px",
              right: "40px",
              width: "60px",
              height: "60px",
            }}
          >
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "100%",
                height: "2px",
                background:
                  "linear-gradient(270deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: "2px",
                height: "100%",
                background:
                  "linear-gradient(180deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              left: "40px",
              width: "60px",
              height: "60px",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "100%",
                height: "2px",
                background:
                  "linear-gradient(90deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                width: "2px",
                height: "100%",
                background:
                  "linear-gradient(0deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
          </div>
          <div
            style={{
              position: "absolute",
              bottom: "40px",
              right: "40px",
              width: "60px",
              height: "60px",
            }}
          >
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "100%",
                height: "2px",
                background:
                  "linear-gradient(270deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
            <div
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                width: "2px",
                height: "100%",
                background:
                  "linear-gradient(0deg, rgba(255,107,44,0.8), transparent)",
              }}
            />
          </div>

          {/* Analysis label */}
          <div style={{ position: "absolute", bottom: "40px", left: "40px" }}>
            <div
              style={{
                background: "rgba(0,0,0,0.7)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,107,44,0.3)",
                borderRadius: "6px",
                padding: "8px 16px",
              }}
            >
              <p
                style={{
                  fontSize: "10px",
                  color: "#ff6b2c",
                  letterSpacing: "0.15em",
                  margin: 0,
                }}
              >
                ANALYZING CELLULAR STRUCTURE
              </p>
            </div>
          </div>
        </motion.div>

        {/* Content reveal at the end */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 30,
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            paddingBottom: "40px",
            opacity: contentRevealOpacity,
            y: contentRevealY,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(0,0,0,0.98) 0%, rgba(0,0,0,0.8) 40%, transparent 100%)",
              pointerEvents: "none",
            }}
          />
          <div
            style={{
              position: "relative",
              textAlign: "center",
              maxWidth: "800px",
              padding: "0 20px",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(32px, 6vw, 64px)",
                fontWeight: 900,
                color: "#fff",
                marginBottom: "16px",
                letterSpacing: "-0.03em",
              }}
            >
              Precision at the Molecular Level
            </h2>
            <p
              style={{
                fontSize: "18px",
                color: "#888",
                lineHeight: 1.6,
                marginBottom: "32px",
              }}
            >
              Our compound targets specific cellular markers with unprecedented
              accuracy, revolutionizing research in metabolic science.
            </p>
            <button
              style={{
                padding: "16px 32px",
                background: "linear-gradient(135deg, #ff2d55, #ff6b2c)",
                border: "none",
                borderRadius: "100px",
                color: "#fff",
                fontSize: "16px",
                fontWeight: 600,
                cursor: "pointer",
                boxShadow: "0 8px 32px rgba(255,45,85,0.4)",
                transition: "transform 0.3s, box-shadow 0.3s",
              }}
            >
              Explore the Science
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
