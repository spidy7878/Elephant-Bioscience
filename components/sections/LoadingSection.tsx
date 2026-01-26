// src/components/sections/LoadingSection.tsx
"use client";

import { motion } from "framer-motion";

interface LoadingSectionProps {
  loadingProgress: number;
}

export default function LoadingSection({
  loadingProgress,
}: LoadingSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#000",
      }}
    >
      <div style={{ textAlign: "center" }}>
        {/* Logo */}
        <svg
          width="87.5"
          height="87.5"
          viewBox="0 0 500 500"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transition: "transform 0.3s ease",
            margin: "0 auto 24px auto",
            display: "block",
          }}
        >
          <defs>
            <linearGradient
              id="logo-gradient"
              x1="370.57"
              y1="198.83"
              x2="162.5"
              y2="373.43"
              gradientUnits="userSpaceOnUse"
            >
              <stop offset="0" stopColor="#640b10" />
              <stop offset=".36" stopColor="#640b0f" stopOpacity=".32" />
              <stop offset=".53" stopColor="#640b0f" stopOpacity=".04" />
            </linearGradient>
          </defs>
          <rect
            fill="#b41f24"
            x="310.19"
            y="279.6"
            width="57.01"
            height="117"
            rx="7.12"
            ry="7.12"
          />
          <path
            fill="#b41f24"
            d="M151.08,281.43h57.01v111.93c0,2.8-2.27,5.07-5.07,5.07h-46.87c-2.8,0-5.07-2.27-5.07-5.07v-111.93h0Z"
          />
          <rect
            fill="#ed2024"
            x="401.55"
            y="265.23"
            width="32.24"
            height="107.29"
            rx="7.12"
            ry="7.12"
          />
          <rect
            fill="#b41f24"
            x="408.91"
            y="262.68"
            width="55.04"
            height="15.52"
            rx="2.61"
            ry="2.61"
          />
          <path
            fill="#b41f24"
            d="M360.77,196.81c0-7.11,4.51-13.17,10.83-15.47v-21.69h-151.5c-52.66,0-95.35,42.69-95.35,95.35v88.74c0,1.13.91,2.04,2.04,2.04h11.85c1.13,0,2.04-.91,2.04-2.04v-65.55h10.4l.35,67.58h124.82c52.66,0,95.35-42.69,95.35-95.35v-38.15c-6.32-2.3-10.83-8.36-10.83-15.47Z"
          />
          <path
            fill="url(#logo-gradient)"
            d="M360.77,196.81c0-2.02.36-3.95,1.03-5.74-8.91-18.59-27.9-31.42-49.89-31.42h-96.83c-25.29,1.56-56.91,14.38-74.31,42.43-6.52,9.98-12.07,20.92-14.63,34.86l24.94,38.22v83.35c0,11.03,31.19-13.61,57.01-12.73,79.34,2.69,74.73.53,101.82-6.04,0,0,1.31,55,.29,56.86h57.01v-181.64c0-1.78-.09-3.55-.25-5.29-3.77-3.02-6.19-7.65-6.19-12.85Z"
          />
          <path
            fill="#ed2024"
            d="M368.78,132.05h-81.14v81.14c0,35.91,29.11,65.01,65.01,65.01h81.14v-81.14c0-35.91-29.11-65.01-65.01-65.01ZM377.23,213.27c-9.09,0-16.46-7.37-16.46-16.46s7.37-16.46,16.46-16.46,16.46,7.37,16.46,16.46-7.37,16.46-16.46,16.46Z"
          />
        </svg>

        {/* Loading text */}
        <p
          style={{
            fontSize: "14px",
            fontWeight: 600,
            color: "#8c2224",
            letterSpacing: "0.2em",
            marginBottom: "16px",
          }}
        >
          ELEPHANT BIOSCIENCES
        </p>

        {/* Progress bar */}
        <div
          style={{
            width: "280px",
            height: "2px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "2px",
            overflow: "hidden",
            margin: "0 auto 12px auto",
          }}
        >
          <motion.div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, #8c2224)",
              width: `${loadingProgress * 100}%`,
            }}
            transition={{ duration: 0.3 }}
          />
        </div>

        {/* Percentage */}
        <p style={{ fontSize: "12px", color: "#666", fontFamily: "monospace" }}>
          {Math.round(loadingProgress * 100)}%
        </p>
      </div>
    </motion.div>
  );
}
