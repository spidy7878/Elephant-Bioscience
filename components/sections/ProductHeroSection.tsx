// src/components/sections/ProductHeroSection.tsx
"use client";

export default function ProductHeroSection() {
  return (
    <section
      style={{
        position: "relative",
        zIndex: 10,
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "100px 20px",
        background: "transparent",
      }}
    >
      <div style={{ maxWidth: "900px" }}>
        {/* Status badge */}
        <div
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: "12px",
            background: "rgba(255, 107, 44, 0.1)",
            border: "1px solid rgba(255, 107, 44, 0.3)",
            padding: "10px 20px",
            borderRadius: "100px",
            marginBottom: "32px",
          }}
        >
          <span
            style={{
              width: "8px",
              height: "8px",
              background: "#ff6b2c",
              borderRadius: "50%",
              animation: "pulse 2s infinite",
            }}
          />
          <span
            style={{
              fontSize: "12px",
              fontWeight: 600,
              color: "#ff6b2c",
              letterSpacing: "0.1em",
            }}
          >
            IN STOCK · READY TO SHIP
          </span>
        </div>

        {/* Main title */}
        <h1
          style={{
            fontSize: "clamp(60px, 12vw, 140px)",
            fontWeight: 900,
            color: "#fff",
            margin: "0 0 16px 0",
            letterSpacing: "-0.04em",
            lineHeight: 0.95,
          }}
        >
          Adipotide
        </h1>

        {/* Chemical formula */}
        <p
          style={{
            fontFamily: "monospace",
            fontSize: "14px",
            color: "#666",
            letterSpacing: "0.1em",
            marginBottom: "32px",
          }}
        >
          C₂₄H₃₈N₈O₆ · MW: 538.61 · FTPP
        </p>

        {/* Description */}
        <p
          style={{
            fontSize: "18px",
            color: "#888",
            lineHeight: 1.8,
            maxWidth: "600px",
            margin: "0 auto 48px auto",
          }}
        >
          A revolutionary{" "}
          <span style={{ color: "#ff6b2c", fontWeight: 600 }}>
            peptidomimetic
          </span>{" "}
          designed to target and ablate blood vessels feeding white adipose
          tissue.
        </p>

        {/* Pricing and action */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "center",
            gap: "16px",
            marginBottom: "48px",
            paddingBottom: "48px",
            borderBottom: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <div>
            <p style={{ fontSize: "14px", color: "#666", margin: 0 }}>from</p>
            <p
              style={{
                fontSize: "48px",
                fontWeight: 900,
                color: "#fff",
                margin: 0,
                lineHeight: 1,
              }}
            >
              $89
            </p>
          </div>
          <p style={{ fontSize: "16px", color: "#888", marginBottom: "8px" }}>
            per 50mg vial
          </p>
        </div>

        {/* Action buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "16px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              padding: "18px 36px",
              background: "linear-gradient(135deg, #ff2d55, #ff6b2c)",
              border: "none",
              borderRadius: "100px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: "0 8px 32px rgba(255,45,85,0.4)",
              transition: "transform 0.3s, box-shadow 0.3s",
            }}
          >
            Add to Cart
          </button>
          <button
            style={{
              padding: "18px 36px",
              background: "transparent",
              border: "2px solid rgba(255,255,255,0.2)",
              borderRadius: "100px",
              color: "#fff",
              fontSize: "16px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.3s",
            }}
          >
            View Technical Specs
          </button>
        </div>
      </div>

      {/* Keyframes for pulse animation */}
      <style jsx>{`
        @keyframes pulse {
          0%,
          100% {
            opacity: 1;
            transform: scale(1);
          }
          50% {
            opacity: 0.5;
            transform: scale(1.2);
          }
        }
      `}</style>
    </section>
  );
}
