"use client";
import { Product } from "app/types/product";
import { motion, useScroll, useMotionValue, useMotionValueEvent, useTransform } from "framer-motion";
import { useState, useEffect, useRef, useCallback } from "react";

function lerp(start: number, end: number, t: number) {
    return start + (end - start) * t;
}

interface ShowcaseProductVideoProps {
    product: Product;
    containerRef: React.RefObject<HTMLDivElement>;
}

function ShowcaseProductVideo({ product, containerRef }: ShowcaseProductVideoProps) {
    const [isSafari, setIsSafari] = useState(false);
    const { scrollY } = useScroll();

    // Track scroll within container bounds
    const targetCardRef = useRef<HTMLElement | null>(null);
    const viewportRef = useRef({ vw: 0, vh: 0 });
    const containerBoundsRef = useRef({ top: 0, bottom: 0 });

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

        // Check if scrolled past container - if so, FREEZE at last position
        if (window.scrollY > containerBottom) {
            // Don't update position - stay frozen at last position
            return;
        }

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

            const mobileRightX = currentVw * 0.25;
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

                        currentX = lerp(currentX, targetX, q);
                        currentY = lerp(currentY, targetY, q);
                        currentScale = lerp(currentScale, targetScaleRaw, q);
                    }
                }
            }
        } else {
            // EXACT same desktop animation as ProductVideo
            // Phase 1: Centered - REDUCED starting scale to 0.7
            // Added left margin (shift right) by 10% of viewport width
            const startX = -videoWidth / 2 + (vw * 0.01);
            const startY = -videoHeight / 2 - (vh * 0.2);
            const startScale = 0.7; // Reduced from 1 to make video smaller at start

            const rightCenterX = vw * 0.80;
            const rightCenterY = vh * 0.50;
            const rightSideX = (rightCenterX - vw / 2) - videoWidth / 2;
            const rightSideY = (rightCenterY - vh / 2) - videoHeight / 2;
            const rightSideScale = 0.7; // Kept small to match start scale

            currentX = lerp(startX, rightSideX, heroProgress);
            currentY = lerp(startY, rightSideY, heroProgress);
            currentScale = lerp(startScale, rightSideScale, heroProgress);

            // Lock to Grid Card
            if (!targetCardRef.current) {
                targetCardRef.current = document.getElementById("target-product-card");
            }
            const targetCard = targetCardRef.current;

            if (targetCard && heroProgress >= 0.8) {
                const rect = targetCard.getBoundingClientRect();
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
                        const targetScaleRaw = (rect.width * 0.6) / videoWidth;

                        currentX = lerp(currentX, targetX, q);
                        currentY = lerp(currentY, targetY, q);
                        currentScale = lerp(currentScale, targetScaleRaw, q);
                    }
                }
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
                handleScroll(scrollY.get());
            }
        };

        updateViewport();
        window.addEventListener("resize", updateViewport);

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

    const fallbackMedia =
        typeof product?.chemicalFormulaImg === "string"
            ? product.chemicalFormulaImg
            : product?.chemicalFormulaImg?.[0]?.url;

    const mediaUrl = rawMedia || fallbackMedia || null;

    if (!mediaUrl) {
        console.warn("ShowcaseProductVideo: No media URL found for product:", product?.name);
        return null;
    }

    const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

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
    );
}

export default ShowcaseProductVideo;
