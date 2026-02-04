// src/components/sections/LoadingSection.tsx
"use client";

import { motion } from "framer-motion";
import Image from "next/image";

interface LoadingSectionProps {
  loadingProgress: number;
  position?: "fixed" | "absolute";
  variant?: "solid" | "transparent" | "glass";
  showBranding?: boolean;
  percentagePosition?: "above" | "below";
}

export default function LoadingSection({
  loadingProgress,
  position = "fixed",
  variant = "solid",
  showBranding = false,
  percentagePosition = "below",
}: LoadingSectionProps) {
  // Determine background style based on variant
  let backgroundStyle: React.CSSProperties = { backgroundColor: "#000" };

  if (variant === "transparent") {
    backgroundStyle = { backgroundColor: "transparent" };
  } else if (variant === "glass") {
    backgroundStyle = {
      backgroundColor: "rgba(0, 0, 0, 0.2)",
      backdropFilter: "blur(12px)",
      WebkitBackdropFilter: "blur(12px)", // Safari support
      border: "1px solid rgba(255, 255, 255, 0.05)"
    };
  }

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: position,
        inset: 0,
        zIndex: 2147483647,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        ...backgroundStyle
      }}
    >
      <div style={{ width: "100%", maxWidth: "500px", textAlign: "center" }}>
        {/* Logo and Brand Text Container - Only show if showBranding is true */}
        {showBranding && (
          <div style={{ 
            display: "flex", 
            flexDirection: "column",
            alignItems: "center", 
            justifyContent: "center",
            marginBottom: "32px",
            gap: "8px"
          }}>
            {/* Elephant Logo */}
            <Image
              src="/Elephant biosciences logos (1).svg"
              alt="Elephant Biosciences Logo"
              width={70}
              height={70}
              priority
            />
            
            {/* Brand Text */}
            <h1 style={{
              fontSize: "18px",
              fontWeight: 500,
              letterSpacing: "0.15em",
              color: "#8c2224",
              margin: 0,
              fontFamily: "Space Grotesk, sans-serif"
            }}>
              ELEPHANT BIOSCIENCES
            </h1>
          </div>
        )}

        {/* Percentage - Above if specified */}
        {percentagePosition === "above" && (
          <p style={{
            fontSize: "14px",
            color: "#888",
            fontFamily: "monospace",
            fontWeight: 400,
            marginBottom: "12px",
            margin: "0 auto 12px auto"
          }}>
            {Math.min(Math.round(loadingProgress * 100), 100)}%
          </p>
        )}

        {/* Progress bar */}
        <div
          style={{
            width: showBranding ? "80vw" : "100%",
            maxWidth: "400px",
            margin: "0 auto",
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "0px",
            overflow: "hidden",
            position: "relative"
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "#8c2224",
              width: `${loadingProgress * 100}%`,
              boxShadow: "0 0 10px rgba(140, 34, 36, 0.5)"
            }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>

        {/* Percentage - Below if specified (default) */}
        {percentagePosition === "below" && (
          <p style={{
            fontSize: "14px",
            color: "#888",
            fontFamily: "monospace",
            fontWeight: 400,
            margin: "12px auto 0 auto"
          }}>
            {Math.min(Math.round(loadingProgress * 100), 100)}%
          </p>
        )}
      </div>
    </motion.div>
  );
}
