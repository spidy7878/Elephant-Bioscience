"use client";

import { useState, useEffect } from "react";

export default function HeroVisual() {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 600);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  return (
    <section className="hero-visual-section w-full overflow-hidden">
      {/* Red liquid - responsive sizing */}
      <div
        className="liquid-img-wrapper mx-auto"
        style={{
          width: isMobile ? "min(330px, 90vw)" : "min(800px, 90vw)",
          height: isMobile ? "min(330px, 90vw)" : "min(800px, 90vw)",
          maxWidth: "100%",
          marginTop: isMobile ? "-80px" : "-160px",
        }}
      >
        <img
          src="/ell (3).svg"
          alt="Liquid"
          style={{ width: "100%", height: "100%", objectFit: "contain" }}
        />
      </div>

      {/* Text as image - responsive positioning */}
      <div
        className="text-img-container w-full flex justify-center"
        style={{
          margin: 0,
          padding: 0,
          position: "relative",
          top: isMobile ? "-120px" : "-325px",
        }}
      >
        <img
          src="/ell (2).svg"
          alt="Text"
          className="text-img"
          style={{
            margin: 0,
            padding: 0,
            display: "block",
            maxWidth: "90vw",
            height: "auto",
          }}
        />
      </div>
    </section>
  );
}
