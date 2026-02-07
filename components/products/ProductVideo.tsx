"use client";
import { Product } from "app/types/product";
import { motion, useScroll, useMotionValue } from "framer-motion";
import { useState, useRef, useCallback, useLayoutEffect, useEffect } from "react";
import { createPortal } from "react-dom";

function lerp(start: number, end: number, t: number) {
  return start + (end - start) * t;
}

// Detect Safari once at module level (runs on client only)
// Uses feature detection + user agent to handle Chrome mobile emulation
const getIsSafari = () => {
  if (typeof window === "undefined") return false;
  // Chrome always has window.chrome, even in device emulation mode
  if ((window as any).chrome) return false;
  const ua = navigator.userAgent.toLowerCase();
  return ua.includes("safari") && !ua.includes("android");
};

function ProductVideo({ product }: { product: Product }) {
  // Use state to trigger re-render after hydration, but use module-level detection
  const [isClient, setIsClient] = useState(false);
  const [isVideoReady, setIsVideoReady] = useState(false);
  const { scrollY } = useScroll();

  // Set isClient after mount to ensure we're on the client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Detect Safari - only valid on client
  const isSafari = isClient ? getIsSafari() : false;



  // Cache viewport dimensions to handle mobile browser address bar behavior
  const viewportRef = useRef({ vw: 0, vh: 0 });

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const scale = useMotionValue(1);
  const opacity = useMotionValue(1);
  const mobileLockRef = useRef({ locked: false, x: 0, y: 0, scale: 1 });
  const lockTargetRef = useRef<HTMLElement | null>(null);
  const [isMobileLocked, setIsMobileLocked] = useState(false);
  const [lockTargetEl, setLockTargetEl] = useState<HTMLElement | null>(null);

  // Track if the target card exists in the DOM
  const [isTargetVisible, setIsTargetVisible] = useState(true);

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
    const prevX = x.get();
    const prevY = y.get();
    const prevScale = scale.get();

    if (isMobile) {
      // ========== MOBILE ANIMATION ==========

      // Phase 1: Beside Place Order button
      const mobileStartX = currentVw * 0.05;
      // Shifted upward on mobile for better visual alignment
      const mobileStartY = -(vh * 0.04);
      const mobileStartScale = 1.125;

      // Phase 2: Slide to right
      const mobileRightX = currentVw * 0.05; // Move right for 2nd card
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
          const qSmooth = q * q * (3 - 2 * q);

          if (qSmooth > 0) {
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

            // Delayed scale for mobile too
            const scaleQ = qSmooth * qSmooth;

            const lock = mobileLockRef.current;

            if (lock.locked) {
              // Hard lock to card position each frame (no damping)
              currentX = targetX;
              currentY = targetY;
              currentScale = targetScaleRaw;

              if (lockTargetRef.current !== targetCard) {
                lockTargetRef.current = targetCard as HTMLElement;
                setLockTargetEl(targetCard as HTMLElement);
              }

              if (qSmooth < 0.75) {
                lock.locked = false;
                setIsMobileLocked(false);
                setLockTargetEl(null);
              }
            } else {
              currentX = lerp(currentX, targetX, qSmooth);
              currentY = lerp(currentY, targetY, qSmooth);
              currentScale = lerp(currentScale, targetScaleRaw, scaleQ);

              if (qSmooth > 0.92) {
                lock.locked = true;
                lock.x = targetX;
                lock.y = targetY;
                lock.scale = targetScaleRaw;
                setIsMobileLocked(true);
                lockTargetRef.current = targetCard as HTMLElement;
                setLockTargetEl(targetCard as HTMLElement);
              }
            }
          }
        }
      }

      if (heroProgress < 0.45) {
        mobileLockRef.current.locked = false;
        setIsMobileLocked(false);
        setLockTargetEl(null);
      }

    } else {
      // ========== DESKTOP ANIMATION ==========

      // Phase 1: Centered - REDUCED starting scale to 0.7
      // Added left margin (shift right) by 10% of viewport width
      const startX = -videoWidth / 2 + (vw * 0.01);
      // Revert to original desktop positioning (centered / slightly raised)
      const startY = -videoHeight / 2 - (vh * 0.1);
      const startScale = 0.7; // Reduced from 1 to make video smaller at start

      // Phase 2: Right Side
      const rightCenterX = vw * 0.80;
      const rightCenterY = vh * 0.50;
      const rightSideX = (rightCenterX - vw / 2) - videoWidth / 2;
      const rightSideY = (rightCenterY - vh / 2) - videoHeight / 2;
      const rightSideScale = 0.7; // Kept small to match start scale

      currentX = lerp(startX, rightSideX, heroProgress);
      currentY = lerp(startY, rightSideY, heroProgress);
      currentScale = lerp(startScale, rightSideScale, heroProgress);

      // Phase 3: Lock to Grid Card
      const targetCard = document.getElementById("target-product-card");

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
            const targetScaleRaw = (rect.width * 0.5) / videoWidth; // Reduced from 0.8 to 0.6

            // If fully locked (q close to 1), STOP animating and lock to target
            // Lowered threshold to 0.95 to ensure it SNAPS and STAYS easier
            if (q > 0.95) {
              currentX = targetX;
              currentY = targetY;
              currentScale = targetScaleRaw;
            } else {
              // Delayed scale: Keep size equal (Phase 2 size) for longer, then reduce (q*q*q)
              const scaleQ = q * q * q * q;

              currentX = lerp(currentX, targetX, q);
              currentY = lerp(currentY, targetY, q);
              currentScale = lerp(currentScale, targetScaleRaw, scaleQ);
            }
          }
        }
      }
    }

    x.set(currentX);
    y.set(currentY);
    scale.set(currentScale);
  }, [x, y, scale]);

  // Synchronously update position to prevent bouncing/jitter during scroll locking
  useLayoutEffect(() => {
    return scrollY.on("change", handleScroll);
  }, [scrollY, handleScroll]);

  useLayoutEffect(() => {
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

  // Periodic check for target card visibility (handles category changes without scroll)
  useEffect(() => {
    const checkTargetVisibility = () => {
      const targetCard = document.getElementById("target-product-card");
      const isVisible = targetCard !== null && targetCard.offsetParent !== null;

      if (isVisible !== isTargetVisible) {
        setIsTargetVisible(isVisible);
      }

      // Also update the opacity motion value for smooth transition
      opacity.set(isVisible ? 1 : 0);

      // Recalculate position when target changes
      if (isVisible) {
        handleScroll(scrollY.get());
      }
    };

    // Check immediately
    checkTargetVisibility();

    // Check periodically to catch category changes
    const interval = setInterval(checkTargetVisibility, 150);

    return () => clearInterval(interval);
  }, [isTargetVisible, handleScroll, scrollY, opacity]);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  // Helper to build full URL
  const buildUrl = (url: string | undefined): string | undefined => {
    if (!url) return undefined;
    return url.startsWith("http") ? url : `${apiUrl}${url}`;
  };

  // Get Safari .mov URL (ProRes 4444 with alpha) - only if it exists AND is a .mov file
  const safariRaw = product?.productVideoSafari?.[0]?.url;
  const safariUrl = safariRaw && /\.mov$/i.test(safariRaw) ? buildUrl(safariRaw) : undefined;

  // Get Chrome .webm URL (VP9 with alpha) - check productVideo for .webm files
  const chromeRaw = product?.productVideo?.[0]?.url;
  const chromeUrl = chromeRaw && /\.webm$/i.test(chromeRaw) ? buildUrl(chromeRaw) : undefined;

  // Get fallback PNG URL from chemicalFormulaImg OR productVideo (if it's an image)
  const fallbackFromFormula = product?.chemicalFormulaImg?.[0]?.url;
  const fallbackFromVideo = chromeRaw && /\.(png|jpg|jpeg|gif|webp)$/i.test(chromeRaw) ? chromeRaw : undefined;
  const fallbackUrl = buildUrl(fallbackFromFormula || fallbackFromVideo);

  // Check if we have valid video sources
  const hasVideoSources = safariUrl || chromeUrl;

  useLayoutEffect(() => {
    setIsVideoReady(false);
  }, [isSafari, safariUrl, chromeUrl]);

  // Wait until we're on the client
  if (!isClient) {
    return null;
  }
  if (!hasVideoSources && !fallbackUrl) {
    console.warn("ProductVideo: No media URL found for product:", product?.name);
    return null;
  }

  const mediaNode = (
    <div className="relative flex flex-col items-center">
      {/* Fallback image — always rendered, hidden only once video is confirmed playing */}
      {fallbackUrl && (
        <img
          src={fallbackUrl}
          alt={product.name}
          className="w-[400px] sm:w-[480px] xl:w-[720px] object-contain pointer-events-none"
          style={{
            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.25))",
            opacity: isVideoReady ? 0 : 1,
            transition: "opacity 300ms ease",
          }}
        />
      )}

      {/* Video — sits in a 0×0 clipped box until first frame renders, then
          absolutely positioned on top of the fallback image. This guarantees
          the browser never paints a black rectangle visible to the user. */}
      {hasVideoSources && (
        <div
          style={
            isVideoReady
              ? { position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }
              : { position: "absolute", width: 1, height: 1, overflow: "hidden", opacity: 0, pointerEvents: "none" as const }
          }
          aria-hidden={!isVideoReady}
        >
          <video
            key={isSafari ? "safari" : "chrome"}
            autoPlay
            muted
            loop
            playsInline
            controls={false}
            onTimeUpdate={(e) => {
              if (!isVideoReady && e.currentTarget.currentTime > 0.05) {
                setIsVideoReady(true);
              }
            }}
            onError={() => setIsVideoReady(false)}
            style={{
              pointerEvents: "none",
              backgroundColor: "transparent",
              filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.25))",
            }}
            className="w-[400px] sm:w-[480px] xl:w-[720px] object-contain"
          >
            {isSafari && safariUrl && (
              <source src={safariUrl} type="video/quicktime" />
            )}
            {!isSafari && chromeUrl && (
              <source src={chromeUrl} type="video/webm" />
            )}
            {isSafari && !safariUrl && chromeUrl && (
              <source src={chromeUrl} type="video/webm" />
            )}
            {!isSafari && !chromeUrl && safariUrl && (
              <source src={safariUrl} type="video/quicktime" />
            )}
          </video>
        </div>
      )}
    </div>
  );

  return (
    <>
      {isMobileLocked && lockTargetEl
        ? createPortal(
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div style={{ transform: "scale(0.5) translateY(-40px)" }}>
              {mediaNode}
            </div>
          </div>,
          lockTargetEl
        )
        : null}

      <motion.div
        style={{
          x,
          y,
          scale,
          opacity: isMobileLocked ? 0 : opacity,
          willChange: "transform, opacity",
        }}
        className="fixed top-1/2 left-1/2 z-[40] pointer-events-none transition-opacity duration-300"
      >
        {mediaNode}
      </motion.div>
    </>
  );
}

export default ProductVideo;
