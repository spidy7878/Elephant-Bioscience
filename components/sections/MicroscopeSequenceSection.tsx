// src/components/sections/MicroscopeSequenceSection.tsx
"use client";

import { useRef } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
  useMotionTemplate,
} from "framer-motion";
import DataPanel from "../ui/DataPanel";
import { TOTAL_FRAMES } from "../../lib/imageUtils";

interface MicroscopeSequenceSectionProps {
  canvasRef: React.RefObject<HTMLCanvasElement>;
  isImagesLoaded: boolean;
  currentFrame: number;
  onProgressChange: (progress: MotionValue<number>) => void;
  canvasStyle?: React.CSSProperties; // <-- NEW
}

export default function MicroscopeSequenceSection({
  canvasRef,
  isImagesLoaded,
  currentFrame,
  onProgressChange,
  canvasStyle, // <-- NEW
}: MicroscopeSequenceSectionProps) {
  const microscopeRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for microscope phase
  const { scrollYProgress: microscopeProgress } = useScroll({
    target: microscopeRef,
    offset: ["start start", "end end"],
  });

  const smoothMicroscopeProgress = useSpring(microscopeProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Pass progress to parent
  onProgressChange(smoothMicroscopeProgress);

  // Microscope UI transforms
  const microscopeUIOpacity = useTransform(
    smoothMicroscopeProgress,
    [0, 0.05, 0.85, 0.95],
    [0, 1, 1, 0]
  );
  const reticleOpacity = useTransform(
    smoothMicroscopeProgress,
    [0, 0.1, 0.7, 0.85],
    [0, 1, 1, 0]
  );

  // Calculations
  const magnification = Math.round(1 + (currentFrame / TOTAL_FRAMES) * 499);
  const focusDepth = ((currentFrame / TOTAL_FRAMES) * 5).toFixed(2);
  const frameNumber = (currentFrame + 1).toString().padStart(4, "0");

  // Adjusted for smaller canvas (50vw x 50vh, max 800x600)
  const maskSizeValue = useTransform(
    smoothMicroscopeProgress,
    [0, 0.9, 1],
    [10, 40, 80]
  );
  const maskPercentage = useMotionTemplate`circle(${maskSizeValue}vmin at 50% 50%)`;

  return (
    <section
      ref={microscopeRef}
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
        {/* Canvas for microscope images */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <canvas
            ref={canvasRef}
            style={{
              width: "50vw",
              height: "50vh",
              maxWidth: "800px",
              maxHeight: "600px",
              objectFit: "contain",
              background: "transparent",
              opacity: isImagesLoaded ? 1 : 0,
              ...canvasStyle,
            }}
          />
        </div>
        {/* Microscope UI overlay */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 20,
            pointerEvents: "none",
            opacity: microscopeUIOpacity,
          }}
        >
          {/* Vignette effect */}
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: `radial-gradient(circle at center, 
                transparent 25%, 
                rgba(0,0,0,0.3) 50%, 
                rgba(0,0,0,0.7) 75%, 
                rgba(0,0,0,0.95) 100%
              )`,
            }}
          />

          {/* Reticle/crosshair */}
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: reticleOpacity,
            }}
          >
            <svg
              width="200"
              height="200"
              viewBox="0 0 200 200"
              style={{
                filter: "drop-shadow(0 0 8px rgba(255,107,44,0.3))",
              }}
            >
              {/* Center circle */}
              <circle
                cx="100"
                cy="100"
                r="80"
                fill="none"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="1"
              />
              <circle
                cx="100"
                cy="100"
                r="60"
                fill="none"
                stroke="rgba(255,107,44,0.3)"
                strokeWidth="1"
              />
              <circle
                cx="100"
                cy="100"
                r="40"
                fill="none"
                stroke="rgba(255,107,44,0.2)"
                strokeWidth="1"
              />

              {/* Crosshair lines */}
              <line
                x1="100"
                y1="0"
                x2="100"
                y2="200"
                stroke="rgba(255,107,44,0.3)"
                strokeWidth="1"
              />
              <line
                x1="0"
                y1="100"
                x2="200"
                y2="100"
                stroke="rgba(255,107,44,0.3)"
                strokeWidth="1"
              />

              {/* Corner markers */}
              <line
                x1="20"
                y1="20"
                x2="40"
                y2="20"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
              <line
                x1="20"
                y1="20"
                x2="20"
                y2="40"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
              <line
                x1="180"
                y1="20"
                x2="160"
                y2="20"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
              <line
                x1="180"
                y1="20"
                x2="180"
                y2="40"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
              <line
                x1="20"
                y1="180"
                x2="40"
                y2="180"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
              <line
                x1="20"
                y1="180"
                x2="20"
                y2="160"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
              <line
                x1="180"
                y1="180"
                x2="160"
                y2="180"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
              <line
                x1="180"
                y1="180"
                x2="180"
                y2="160"
                stroke="rgba(255,107,44,0.4)"
                strokeWidth="2"
              />
            </svg>
          </motion.div>

          {/* Top HUD */}
          <div
            style={{
              position: "absolute",
              top: "20px",
              left: "20px",
              display: "flex",
              gap: "12px",
            }}
          >
            <DataPanel
              label="MAGNIFICATION"
              value={`${magnification}×`}
              accent
            />
            <DataPanel label="FOCUS DEPTH" value={focusDepth} suffix="μm" />
          </div>

          {/* Bottom HUD */}
          <div
            style={{
              position: "absolute",
              bottom: "20px",
              right: "20px",
              display: "flex",
              gap: "12px",
            }}
          >
            <DataPanel label="FRAME" value={frameNumber} align="right" />
            <DataPanel
              label="PROGRESS"
              value={`${Math.round((currentFrame / TOTAL_FRAMES) * 100)}%`}
              align="right"
            />
          </div>

          {/* Side info */}
          <div
            style={{
              position: "absolute",
              right: "20px",
              top: "50%",
              transform: "translateY(-50%)",
              display: "flex",
              flexDirection: "column",
              gap: "24px",
            }}
          >
            <div
              style={{
                background: "rgba(0,0,0,0.6)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "6px",
                padding: "12px",
                minWidth: "140px",
              }}
            >
              <p
                style={{
                  fontSize: "9px",
                  color: "#555",
                  letterSpacing: "0.1em",
                  margin: 0,
                  marginBottom: "8px",
                }}
              >
                DETECTION
              </p>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  marginBottom: "6px",
                }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#00ff88",
                    boxShadow: "0 0 8px #00ff88",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "#ccc",
                    fontFamily: "monospace",
                  }}
                >
                  ACTIVE
                </span>
              </div>
              <div
                style={{ display: "flex", alignItems: "center", gap: "8px" }}
              >
                <div
                  style={{
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: "#ff6b2c",
                    boxShadow: "0 0 8px #ff6b2c",
                  }}
                />
                <span
                  style={{
                    fontSize: "11px",
                    color: "#ccc",
                    fontFamily: "monospace",
                  }}
                >
                  TRACKING
                </span>
              </div>
            </div>
          </div>
        </motion.div>
        {/* Fade to black transition */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            backgroundColor: "#000",
            opacity: useTransform(smoothMicroscopeProgress, [0.9, 1], [0, 1]),
            zIndex: 25,
          }}
        />
      </div>
    </section>
  );
}
