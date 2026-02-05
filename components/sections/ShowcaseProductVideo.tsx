"use client";
import { Product } from "app/types/product";
import { motion, useScroll, useMotionValue, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";

function lerp(start: number, end: number, t: number) {
    return start + (end - start) * t;
}

// Detect Safari once at module level (runs on client only)
const getIsSafari = () => {
    if (typeof window === "undefined") return false;
    const ua = navigator.userAgent.toLowerCase();
    return ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android");
};

interface ShowcaseProductVideoProps {
    product: Product;
    containerRef: React.RefObject<HTMLDivElement>;
}

function ShowcaseProductVideo({ product, containerRef }: ShowcaseProductVideoProps) {
    // Use state to trigger re-render after hydration
    const [isClient, setIsClient] = useState(false);
    const { scrollY } = useScroll();

    // Set isClient after mount
    useEffect(() => {
        setIsClient(true);
    }, []);

    // Detect Safari - only valid on client
    const isSafari = isClient ? getIsSafari() : false;

    // Track scroll within container bounds
    const targetCardRef = useRef<HTMLElement | null>(null);
    const viewportRef = useRef({ vw: 0, vh: 0 });
    const containerBoundsRef = useRef({ top: 0, bottom: 0 });
    const isLockedRef = useRef(false);

    const x = useMotionValue(0);
    const y = useMotionValue(0);
    const scale = useMotionValue(1);
    const opacity = useMotionValue(1);

    const handleScroll = useCallback((latest: number) => {
        if (typeof window === "undefined" || !containerRef.current) return;

        // Get container bounds
        const containerRect = containerRef.current.getBoundingClientRect();
        const containerTop = window.scrollY + containerRect.top;
        const containerBottom = containerTop + containerRect.height;



        // Show video always (even before container starts) to keep it visible
        // When scrollY < containerTop, heroProgress will be 0, effectively clamping it to start position
        opacity.set(1);

        const { vw, vh } = viewportRef.current;
        const currentVw = vw || window.innerWidth;
        const currentVh = vh || window.innerHeight;
        const isMobile = currentVw < 640;

        // EXACT same dimensions as ProductVideo
        const videoWidth = isMobile ? 400 : (currentVw >= 1280 ? 720 : 480);
        const videoHeight = isMobile ? 400 : (currentVw >= 1280 ? 600 : 400);

        // Calculate scroll relative to container start
        const scrollRelativeToContainer = latest - containerTop;

        // EXACT same progression calculation as ProductVideo
        const heroProgress = isMobile
            ? Math.min(Math.max(scrollRelativeToContainer / (currentVh * 2), 0), 1)
            : Math.min(Math.max(scrollRelativeToContainer / currentVh, 0), 1);

        let currentX: number;
        let currentY: number;
        let currentScale: number;

        if (isMobile) {
            // EXACT same mobile animation as ProductVideo
            const mobileStartX = currentVw * 0.05;
            const mobileStartY = -videoHeight * 0.1;
            const mobileStartScale = 1.125;

            // Adjusted to keep video within screen: uses 0.15 instead of 0.25 to shift LEFT
            const mobileRightX = currentVw * 0.05; // Synced to 0.05 matching ProductVideo
            const mobileRightY = currentVh * 0.05;
            const mobileRightScale = 0.5;

            currentX = lerp(mobileStartX, mobileRightX, heroProgress);
            currentY = lerp(mobileStartY, mobileRightY, heroProgress);
            currentScale = lerp(mobileStartScale, mobileRightScale, heroProgress);

            // Lock to target card
            const targetCard = document.getElementById("target-product-card");
            if (targetCard && heroProgress >= 0.5) {
                const rect = targetCard.getBoundingClientRect();
                if (rect.width > 0 && rect.height > 0) {
                    const startTrigger = currentVh * 1.5;
                    const endTrigger = currentVh * 0.5;
                    let q = (startTrigger - rect.top) / (startTrigger - endTrigger);
                    q = Math.min(Math.max(q, 0), 1);
                    q = q * q * (3 - 2 * q);

                    if (q > 0) {
                        const cardCenterX = rect.left + rect.width / 2;
                        const cardCenterY = rect.top + rect.height / 2;
                        const targetScaleRaw = (rect.width * 1.35) / videoWidth;
                        let targetX = (cardCenterX - currentVw / 2) - (videoWidth / 4);
                        let targetY = (cardCenterY - currentVh / 2) - (videoHeight / 4);

                        const maxX = currentVw / 2;
                        targetX = Math.max(-maxX, Math.min(targetX, maxX));

                        // Delayed scale for mobile too
                        const scaleQ = q * q * q * q;

                        currentX = lerp(currentX, targetX, q);
                        currentY = lerp(currentY, targetY, q);
                        currentScale = lerp(currentScale, targetScaleRaw, scaleQ);
                    }
                }
            }
        } else {
            // EXACT same desktop animation as ProductVideo
            // Phase 1: Centered - REDUCED starting scale to 0.7
            // Added left margin (shift right) by 10% of viewport width
            const startX = -videoWidth / 2 + (vw * 0.01);
            const startY = -videoHeight / 2 - (vh * 0.1);
            const startScale = 0.7; // Reduced from 1 to make video smaller at start

            const rightCenterX = vw * 0.80;
            const rightCenterY = vh * 0.50;
            const rightSideX = (rightCenterX - vw / 2) - videoWidth / 2;
            const rightSideY = (rightCenterY - vh / 2) - videoHeight / 2;
            const rightSideScale = 0.7; // Kept small to match start scale

            currentX = lerp(startX, rightSideX, heroProgress);
            currentY = lerp(startY, rightSideY, heroProgress);
            currentScale = lerp(startScale, rightSideScale, heroProgress);

            // Phase 3: Lock to Grid Card
            // Check if ref is missing OR if it is stale (detached from DOM)
            if (!targetCardRef.current || !targetCardRef.current.isConnected) {
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
                    // Smoothstep for smoother approach
                    q = q * q * (3 - 2 * q);

                    if (q > 0) {
                        const cardCenterX = rect.left + rect.width / 2;
                        const cardCenterY = rect.top + (rect.height / 2) - 60;

                        const targetX = (cardCenterX - vw / 2) - videoWidth / 2;
                        const targetY = (cardCenterY - vh / 2) - videoHeight / 2;
                        const targetScaleRaw = (rect.width * 0.5) / videoWidth; // Reduced from 0.8 to 0.6

                        // --- SENIOR ENGINEER FIX: STRONG LATCHING HYSTERESIS ---
                        // Entry Threshold: High (0.95) - ensures we are aligned before snapping.
                        // Exit Threshold: Low (0.1) - ensures we STAY locked even if scrolling back up.
                        // This gives the "Strong Lock" feel. It won't detach unless you leave the section.

                        if (q > 0.95) {
                            isLockedRef.current = true;
                        } else if (q < 0.1) {
                            isLockedRef.current = false;
                        }

                        if (isLockedRef.current) {
                            // STRICT LOCK: Absolutely zero lerp. Glue it to the card.
                            currentX = targetX;
                            currentY = targetY;
                            currentScale = targetScaleRaw;
                        } else {
                            // Approach with lerp
                            // Delayed scale: Keep size equal (Phase 2 size) for longer, then reduce (q*q*q)
                            const scaleQ = q * q * q * q;

                            currentX = lerp(currentX, targetX, q);
                            currentY = lerp(currentY, targetY, q);
                            currentScale = lerp(currentScale, targetScaleRaw, scaleQ);
                        }
                    }
                }
            } else {
                // Reset lock if we are completely out of range (scrolling very fast)
                isLockedRef.current = false;
            }
        }

        // Fix: If we are scrolling ABOVE the container (scrolling up), 
        // move the video DOWN with the container so it doesn't overlap previous section
        if (latest < containerTop) {
            const offset = containerTop - latest;
            currentY += offset;
        }

        x.set(currentX);
        y.set(currentY);
        scale.set(currentScale);
    }, [x, y, scale, opacity, containerRef]);

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

        // Subscribe to scroll changes synchronously
        const cleanupScroll = scrollY.on("change", handleScroll);

        // Safety check for mobile load race conditions
        const safetyTimer = setTimeout(() => {
            if (typeof window !== "undefined") handleScroll(scrollY.get());
        }, 100);

        // Periodic check to ensuring we have the target card
        const checkInterval = setInterval(() => {
            if (!targetCardRef.current) {
                targetCardRef.current = document.getElementById("target-product-card");
                if (targetCardRef.current) handleScroll(scrollY.get());
            }
        }, 1000);

        return () => {
            window.removeEventListener("resize", updateViewport);
            cleanupScroll();
            clearTimeout(safetyTimer);
            clearInterval(checkInterval);
        };
    }, [handleScroll, scrollY]);

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

    // Wait until we're on the client
    if (!isClient) {
        return null;
    }

    if (!hasVideoSources && !fallbackUrl) {
        console.warn("ShowcaseProductVideo: No media URL found for product:", product?.name);
        return null;
    }

    return (
        <motion.div
            style={{
                x,
                y,
                scale,
                opacity,
                willChange: "transform",
            }}
            className="fixed top-1/2 left-1/2 z-[40] pointer-events-none"
        >
            <div className="relative flex flex-col items-center">
                {hasVideoSources ? (
                    <video
                        key={isSafari ? 'safari' : 'chrome'}
                        autoPlay
                        muted
                        loop
                        playsInline
                        // Don't use poster on Safari - it can cause black background overlay
                        poster={!isSafari ? (fallbackUrl || undefined) : undefined}
                        style={{ 
                            pointerEvents: "none",
                            filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.25))"
                        }}
                        className="w-[400px] sm:w-[480px] xl:w-[720px] object-contain"
                    >
                        {/* Safari: ProRes 4444 .mov with alpha - use video/quicktime for .mov files */}
                        {isSafari && safariUrl && (
                            <source src={safariUrl} type="video/quicktime" />
                        )}
                        {/* Chrome/Firefox: VP9 .webm with alpha */}
                        {!isSafari && chromeUrl && (
                            <source src={chromeUrl} type="video/webm" />
                        )}
                        {/* Fallback: if Safari but no Safari video, try Chrome video */}
                        {isSafari && !safariUrl && chromeUrl && (
                            <source src={chromeUrl} type="video/webm" />
                        )}
                        {/* Fallback: if Chrome but no Chrome video, try Safari video */}
                        {!isSafari && !chromeUrl && safariUrl && (
                            <source src={safariUrl} type="video/quicktime" />
                        )}
                    </video>
                ) : fallbackUrl ? (
                    <img
                        src={fallbackUrl}
                        alt={product.name}
                        className="w-[400px] sm:w-[480px] xl:w-[720px] object-contain"
                        style={{ filter: "drop-shadow(0 20px 60px rgba(0,0,0,0.25))" }}
                    />
                ) : null}
            </div>
        </motion.div>
    );
}

export default ShowcaseProductVideo;
