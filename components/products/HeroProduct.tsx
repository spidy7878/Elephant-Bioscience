"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { createPortal } from "react-dom";
import { Product } from "app/types/product";
import Stat from "./Stat";
import ProductVideo from "./ProductVideo";

interface Props {
  product: Product;
  skipAnimation?: boolean;
  hideFloatingVideo?: boolean;
}

const HeroProduct = ({
  product,
  skipAnimation = false,
  hideFloatingVideo = false,
}: Props) => {
  const [quantity, setQuantity] = useState(1);


  const incrementQuantity = () => setQuantity((q) => q + 1);
  const decrementQuantity = () => setQuantity((q) => Math.max(1, q - 1));

  // Track global page scroll (not a local container)
  const { scrollYProgress } = useScroll({ layoutEffect: false });

  // Transition: center → bottom-right
  const x = useTransform(
    scrollYProgress,
    [0, 1],
    ["-50%", "calc(100vw - 360px)"]
  );
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    ["-50%", "calc(100vh - 200px)"]
  );
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.78]);

  const videoUrl =
    product?.productVideo?.length && product.productVideo[0]?.url
      ? `${process.env.NEXT_PUBLIC_API_URL}${product.productVideo[0].url}`
      : null;

  const structureImg = product?.chemicalFormulaImg?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.chemicalFormulaImg[0].url}`
    : "/163360068.webp";
  //console.log(structureImg)

  return (
    <section className="relative w-full min-h-[100dvh] overflow-hidden">
      {/* FLOATING VIDEO - Only render if not hidden */}
      {!hideFloatingVideo && (
        <ProductVideo product={product} />
      )}

      {/* MAIN CONTENT */}
      <div className="w-full px-4 sm:px-8 md:px-[2vw] md:py-12 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
          {/* LEFT CONTENT */}
          <motion.div
            initial={skipAnimation ? false : { opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="col-span-1 lg:col-span-4 space-y-5 z-10"
          >
            <motion.h1
              initial={skipAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05, duration: 0.3 }}
              className="text-3xl sm:text-4xl md:text-[42px] leading-tight font-extrabold tracking-tight text-black"
            >
              {product.name}
            </motion.h1>

            <motion.p
              initial={skipAnimation ? false : { opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08, duration: 0.3 }}
              className="text-black font-light leading-relaxed max-w-md text-base sm:text-lg"
            >
              {product.description?.[0]?.children?.[0]?.text}
            </motion.p>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-8 mt-2 pb-6 w-full">


              <div className="flex w-full items-center gap-4 mt-4 sm:mt-0">
                {/* Quantity Selector */}
                <motion.div
                  initial={skipAnimation ? false : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.11, duration: 0.3 }}
                  className="flex items-center rounded-2xl border border-white/10 shadow-lg backdrop-blur-lg overflow-hidden h-[54px]" // Height matches button roughly
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                >
                  <button
                    onClick={decrementQuantity}
                    className="w-12 h-full flex items-center justify-center text-black/70 hover:text-black hover:bg-white/10 transition-colors text-xl font-medium"
                  >
                    −
                  </button>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={quantity}
                    onChange={(e) => {
                      const val = e.target.value;
                      if (val === "") {
                        // Allow empty temporarily while typing
                        setQuantity(val as any);
                        return;
                      }
                      const num = parseInt(val, 10);
                      if (!isNaN(num) && num >= 0) {
                        setQuantity(num);
                      }
                    }}
                    onBlur={() => {
                      if (!quantity || quantity < 1) {
                        setQuantity(1);
                      }
                    }}
                    className="w-12 h-full bg-transparent text-center border-x border-white/10 text-black font-semibold text-lg focus:outline-none appearance-none m-0 p-0"
                  />
                  <button
                    onClick={incrementQuantity}
                    className="w-12 h-full flex items-center justify-center text-black/70 hover:text-black hover:bg-white/10 transition-colors text-xl font-medium"
                  >
                    +
                  </button>
                </motion.div>

                <motion.button
                  initial={skipAnimation ? false : { opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12, duration: 0.3 }}
                  className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-2xl border border-white/10 shadow-lg font-medium text-black backdrop-blur-lg transition-all duration-300 hover:shadow-2xl text-base sm:text-lg h-[54px] whitespace-nowrap"
                  style={{
                    background: "rgba(255,255,255,0.08)",
                    backdropFilter: "blur(10px)",
                    WebkitBackdropFilter: "blur(10px)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.18)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                  }}
                >
                  Order →
                </motion.button>
              </div>
            </div>

            {/* STATS ROW BELOW BUTTON */}
            <motion.div
              initial={skipAnimation ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
              className="flex flex-row gap-3 sm:gap-8 mt-6 items-center justify-between"
            >
              <Stat
                big
                label="Purity (HPLC)"
                value={product.purity == null ? "-" : product.purity}
              />
              <Stat big label="Package Quantity" value={product.quantity} />
              <Stat
                big
                label="APLC"
                value={product.aplc == null ? "-" : product.aplc}
              />
            </motion.div>


            {/* Reference Panel for small screens */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.3 }}
              className="block lg:hidden mt-8 rounded-2xl border border-white/10 shadow-lg space-y-5 w-full h-auto p-3 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl"
              style={{
                background: "rgba(255,255,255,0.08)",
                backdropFilter: "blur(10px)",
                WebkitBackdropFilter: "blur(10px)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,255,255,0.18)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.background =
                  "rgba(255,255,255,0.08)";
              }}
            >
              <div className="rounded-2xl overflow-hidden flex items-center justify-center">
                <img
                  src={structureImg}
                  alt="Structure"
                  className="w-full h-[320px] sm:h-[380px] object-contain"
                />
              </div>
              <div>
                <h4 className="font-bold text-xl sm:text-2xl text-black m-0 ml-2">
                  References:
                </h4>
                {product.references?.map((r, i) => (
                  <p
                    key={i}
                    className="text-[13px] sm:text-[14px] text-black font-light leading-[1.6] ml-2"
                  >
                    {r.children?.[0]?.text}
                  </p>
                ))}
              </div>
              <p className="text-xl sm:text-2xl font-semibold text-gray-800 m-0 ml-2">
                For Research Use Only
              </p>
            </motion.div>
          </motion.div>

          {/* RIGHT REFERENCE PANEL */}

          {/* Desktop/Tablet Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15, duration: 0.3 }}
            className="hidden lg:block absolute top-0 right-0 rounded-2xl border border-white/10 shadow-lg space-y-5 w-80 h-auto p-3 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(255,255,255,0.18)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.background =
                "rgba(255,255,255,0.08)";
            }}
          >
            <div className="rounded-2xl overflow-hidden bg-white/50 flex items-center justify-center">
              <img
                src={structureImg}
                alt="Structure"
                className="w-full h-[220px] sm:h-[260px] lg:h-[300px] object-contain"
              />
            </div>

            <div>
              <h4 className="font-bold text-xl sm:text-2xl text-black m-0 ml-2">
                References:
              </h4>
              {product.references?.map((r, i) => (
                <p
                  key={i}
                  className="text-[13px] sm:text-[14px] text-black font-light leading-[1.6] ml-2"
                >
                  {r.children?.[0]?.text}
                </p>
              ))}
            </div>

            <p className="text-xl sm:text-2xl font-semibold text-gray-800 m-0 ml-2">
              For Research Use Only
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroProduct;
