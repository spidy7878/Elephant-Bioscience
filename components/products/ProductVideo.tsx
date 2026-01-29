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
    isMobile ? ["-5%", "80%"] : ["-45%", "70%"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, isMobile ? 1 : 8],
    isMobile ? ["10%", "55%"] : ["-50%", "55%"]
  );
  const scale = useTransform(
    scrollYProgress,
    [0, 1],
    isMobile ? [1, 0.2] : [1, 0.75]
  );

  const rawVideo =
    typeof product?.productVideo === "string"
      ? product.productVideo
      : product?.productVideo?.[0]?.url;

  const videoUrl = rawVideo || null;

  if (!videoUrl) return null;

  console.log("PRODUCT VIDEO RAW:", product?.productVideo);
  console.log("VIDEO URL:", videoUrl);

  return (
    <>
      <motion.div
        style={{ x, y, scale }}
        className="fixed top-1/2 left-1/2 z-[40] pointer-events-none"
      >
        <div className="relative flex flex-col items-center">
          <video
            src={videoUrl}
            autoPlay
            muted
            loop
            playsInline
            className="w-[480px] xl:w-[720px] object-contain drop-shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
          />
        </div>
      </motion.div>
    </>
  );
}

export default ProductVideo;
