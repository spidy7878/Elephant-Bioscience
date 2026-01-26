"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

function ProductVideo({ product }: any) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const x = useTransform(scrollYProgress, [0, 1], ["-50%", "35%"]);
  const y = useTransform(scrollYProgress, [0, 8], ["-50%", "55%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.75]);

  const videoUrl =
    product?.productVideo?.[0]?.url
      ? `${process.env.NEXT_PUBLIC_API_URL}${product.productVideo[0].url}`
      : null;

  if (!videoUrl) return null;

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

        {/* Mirrored Product Name */}
       
      </div>
    </motion.div>
    </>
  );
}

export default ProductVideo;
