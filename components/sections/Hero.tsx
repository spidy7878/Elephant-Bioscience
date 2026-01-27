"use client";

import { motion } from "framer-motion";
import { useState } from "react";

export default function Hero({ opacity = 1 }: { opacity?: any }) {
  const [zoomOver, setZoomOver] = useState(false);
  return (
    <div className="relative w-full">
      {zoomOver && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 20 }} // Large enough to cover the screen
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className="fixed top-1/2 left-1/2 w-32 h-32 bg-white rounded-full z-50"
          style={{ x: "-50%", y: "-50%" }}
        />
      )}
      {/* Main Title Section */}
      <section className="relative h-screen w-full flex flex-col items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className="flex flex-col items-center justify-center w-full"
        >
          <motion.h1
            style={{ opacity }}
            className="text-white text-2xl md:text-5xl lg:text-7xl font-bold tracking-wide whitespace-nowrap text-center"
          >
            Elephant Biosciences
          </motion.h1>
          {/* <motion.div
            style={{ opacity }}
            className="w-24 h-[2px] bg-white/40 mt-2"
          /> */}
        </motion.div>
      </section>
    </div>
  );
}
