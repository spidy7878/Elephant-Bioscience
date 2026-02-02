"use client";
import { Product } from "app/types/product";
import { motion, useScroll, useMotionValue, useMotionValueEvent } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

function ProductVideo({ product }: { product: Product }) {
  const [isSafari, setIsSafari] = useState(false);
  const { scrollY } = useScroll();

  // Cache the target card reference
  const targetCardRef = useRef<HTMLElement | null>(null);

  // Cache viewport dimensions to handle mobile browser address bar behavior
  const viewportRef = useRef({ vw: 0, vh: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);

  const handleScroll = useCallback((latest: number) => {
    if (typeof window === "undefined") return;

    // Use cached dimensions to avoid layout thrashing and instability on mobile
    const { vw, vh } = viewportRef.current;

    // Fallback if ref is empty (first render)
    const currentVw = vw || window.innerWidth;
    const currentVh = vh || window.innerHeight;

    const isMobile = currentVw < 640;

    // Mobile uses LARGER video now - doubled size
    const videoWidth = isMobile ? 400 : (currentVw >= 1280 ? 720 : 480);
    const videoHeight = isMobile ? 400 : (currentVw >= 1280 ? 600 : 400);

    // Slower progression for mobile so video doesn't disappear too quickly
    const heroProgress = isMobile
      ? Math.min(Math.max(latest / (currentVh * 2), 0), 1)
      : Math.min(Math.max(latest / currentVh, 0), 1);

    let currentX: number;
    let currentY: number;
    let currentScale: number;

    if (isMobile) {
      // ========== MOBILE ANIMATION ==========

      // Phase 1: Beside Place Order button
      const mobileStartX = currentVw * 0.05;
      const mobileStartY = -videoHeight * 0.1;
      const mobileStartScale = 1.125;

      // Phase 2: Slide to right
      const mobileRightX = currentVw * 0.25; // Move right for 2nd card
      const mobileRightY = currentVh * 0.05; // Move down
      const mobileRightScale = 0.5;

      currentX = lerp(mobileStartX, mobileRightX, heroProgress);
      currentY = lerp(mobileStartY, mobileRightY, heroProgress);
      currentScale = lerp(mobileStartScale, mobileRightScale, heroProgress);

      // Phase 3: Lock to second card
      const targetCard = document.getElementById("target-product-card");

      if (targetCard && heroProgress >= 0.5) {
        const rect = targetCard.getBoundingClientRect();

        // Ensure rect is valid (rendering complete)
        if (rect.width > 0 && rect.height > 0) {
          const startTrigger = currentVh * 1.5;
          const endTrigger = currentVh * 0.5;

          let q = (startTrigger - rect.top) / (startTrigger - endTrigger);
          q = Math.min(Math.max(q, 0), 1);
          q = q * q * (3 - 2 * q);

          if (q > 0) {
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + rect.height / 2;

            // Target scale: 1.35x card width
            const targetScaleRaw = (rect.width * 1.35) / videoWidth;

            // EMPIRICAL CORRECTION:
            // -100 (W/4) -> Center
            let targetX = (cardCenterX - currentVw / 2) - (videoWidth / 4);
            let targetY = (cardCenterY - currentVh / 2) - (videoHeight / 4);

            // CLAMPING: Prevent off-screen
            const maxX = currentVw / 2;
            targetX = Math.max(-maxX, Math.min(targetX, maxX));

            currentX = lerp(currentX, targetX, q);
            currentY = lerp(currentY, targetY, q);
            currentScale = lerp(currentScale, targetScaleRaw, q);
          }
        }
      }

    } else {
      // ========== DESKTOP ANIMATION ==========

      // Phase 1: Centered
      const startX = -videoWidth / 2;
      const startY = -videoHeight / 2;
      const startScale = 1;

      // Phase 2: Right Side
      const rightCenterX = vw * 0.80;
      const rightCenterY = vh * 0.50;
      const rightSideX = (rightCenterX - vw / 2) - videoWidth / 2;
      const rightSideY = (rightCenterY - vh / 2) - videoHeight / 2;
      const rightSideScale = 1;

      currentX = lerp(startX, rightSideX, heroProgress);
      currentY = lerp(startY, rightSideY, heroProgress);
      currentScale = lerp(startScale, rightSideScale, heroProgress);

      // Phase 3: Lock to Grid Card
      if (!targetCardRef.current) {
        targetCardRef.current = document.getElementById("target-product-card");
      }
      const targetCard = targetCardRef.current;

      if (targetCard && heroProgress >= 0.8) {
        const rect = targetCard.getBoundingClientRect();

        // Ensure rect is valid
        if (rect.width > 0 && rect.height > 0) {
          const startTrigger = vh * 1.5;
          const endTrigger = vh * 0.4;

          let q = (startTrigger - rect.top) / (startTrigger - endTrigger);
          q = Math.min(Math.max(q, 0), 1);
          q = q * q * (3 - 2 * q);

          if (q > 0) {
            const cardCenterX = rect.left + rect.width / 2;
            const cardCenterY = rect.top + (rect.height / 2) - 60;

            const targetX = (cardCenterX - vw / 2) - videoWidth / 2;
            const targetY = (cardCenterY - vh / 2) - videoHeight / 2;
            const targetScaleRaw = (rect.width * 0.8) / videoWidth;

            currentX = lerp(currentX, targetX, q);
            currentY = lerp(currentY, targetY, q);
            currentScale = lerp(currentScale, targetScaleRaw, q);
          }
        }
      }
    }

    x.set(currentX);
    y.set(currentY);
    scale.set(currentScale);
  }, [x, y, scale]);

  useMotionValueEvent(scrollY, "change", handleScroll);

  useEffect(() => {
    const ua = navigator.userAgent.toLowerCase();
    const safari = ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android");
    setIsSafari(safari);

    const updateViewport = () => {
      if (typeof window !== "undefined") {
        viewportRef.current = {
          vw: window.innerWidth,
          vh: window.innerHeight,
        };
        // Force update position immediately on resize/load using current scroll
        handleScroll(scrollY.get());
      }
    };

    updateViewport();
    window.addEventListener("resize", updateViewport);

    // Safety check for mobile load race conditions
    const safetyTimer = setTimeout(() => {
      if (typeof window !== "undefined") handleScroll(scrollY.get());
    }, 100);

    return () => {
      window.removeEventListener("resize", updateViewport);
      clearTimeout(safetyTimer);
    };
  }, [handleScroll, scrollY]);

  const rawMedia =
    typeof product?.productVideo === "string"
      ? product.productVideo
      : product?.productVideo?.[0]?.url;

  // Fallback to chemicalFormulaImg if productVideo is not available
  const fallbackMedia =
    typeof product?.chemicalFormulaImg === "string"
      ? product.chemicalFormulaImg
      : product?.chemicalFormulaImg?.[0]?.url;

  const mediaUrl = rawMedia || fallbackMedia || null;



  // Debug: Log when media is missing
  if (!mediaUrl) {
    console.warn("ProductVideo: No media URL found for product:", product?.name);
    return null;
  }

  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);
  // Default to standard video player for all browsers (Modern Safari supports WebM/MP4)
  // Removed flaxy GIF fallback that caused 403 errors

  return (
    <>
      <motion.div
        style={{
          x,
          y,
          scale,
          willChange: "transform",
        }}
        className="fixed top-1/2 left-1/2 z-[40] pointer-events-none"
      >
        <div className="relative flex flex-col items-center">
          {isVideo ? (
            <video
              autoPlay
              muted
              loop
              playsInline
              style={{ backgroundColor: "transparent", filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.25))" }}
              className="w-[400px] sm:w-[480px] xl:w-[720px] object-contain"
            >
              <source src={mediaUrl} type={/\.webm$/i.test(mediaUrl) ? "video/webm" : "video/mp4"} />
            </video>
          ) : (
            <img
              src={mediaUrl}
              alt={product.name}
              className="w-[400px] sm:w-[480px] xl:w-[720px] object-contain"
              style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.25))" }}
            />
          )}
        </div>
      </motion.div>
    </>
  );
}

export default ProductVideo;
