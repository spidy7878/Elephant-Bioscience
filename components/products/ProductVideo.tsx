"use client";
import { Product } from "app/types/product";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ProductVideo({ product }: { product: Product }) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  // Responsive transforms
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? ["-5%", "100%"] : ["-45%", "90%"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, isMobile ? 1 : 8],
    isMobile ? ["10%", "55%"] : ["-50%", "55%"]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [1.3, 0.35] : [1, 0.75]
  );

  const rawMedia =
    typeof product?.productVideo === "string"
      ? product.productVideo
      : product?.productVideo?.[0]?.url;

  const mediaUrl = rawMedia || null;
  if (!mediaUrl) return null;

  // Check if the URL is a video file by extension
  const isVideo = /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

  // Animation applies to both video and image
  return (
    <>
      <motion.div
        style={{ x, y, scale }}
        className="fixed top-1/2 left-1/2 z-[40] pointer-events-none"
      >
        <div className="relative flex flex-col items-center">
          {isVideo ? (
            <video
              src={mediaUrl}
              autoPlay
              muted
              loop
              playsInline
              className="w-[480px] xl:w-[720px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            />
          ) : (
            <img
              src={mediaUrl}
              alt={product.name}
              className="w-[480px] xl:w-[720px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
            />
          )}
        </div>
      </motion.div>
    </>
  );
}

export default ProductVideo;
