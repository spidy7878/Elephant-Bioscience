"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { Product } from "app/types/product";
import Stat from "./Stat";
import ProductVideo from "./ProductVideo";

interface Props {
  product: Product;
}

const HeroProduct = ({ product }: Props) => {
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

  // const structureImg = product?.chemicalFormulaImg?.[0]?.url
  //   ? `${process.env.NEXT_PUBLIC_API_URL}${product.chemicalFormulaImg[0].url}`
  //   : "";
  const structureImg = "/163360068.webp";
  //console.log(structureImg)

  return (
    <section className="relative w-full min-h-screen overflow-hidden">
      {/* FLOATING VIDEO */}
      <ProductVideo product={product} />

      {/* MAIN CONTENT */}
      <div className="w-full px-4 sm:px-8 md:px-[2vw] py-10 md:py-16 relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start relative">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="col-span-1 lg:col-span-4 space-y-5 z-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-3xl sm:text-4xl md:text-[42px] leading-tight font-extrabold tracking-tight text-black"
            >
              {product.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-black font-bold leading-relaxed max-w-md text-base sm:text-lg"
            >
              {product.description?.[0]?.children?.[0]?.text}
            </motion.p>

            <div className="flex flex-row items-center gap-8 mt-2 pb-6">
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black"
              >
                ${product.price}
              </motion.div>
              <motion.button
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.35, duration: 0.6 }}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-2xl border border-white/10 shadow-lg font-medium text-black backdrop-blur-lg transition-all duration-300 hover:shadow-2xl text-base sm:text-lg"
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
                Place Order →
              </motion.button>
            </div>

            {/* STATS ROW BELOW BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="flex flex-row gap-6 sm:gap-10 mt-6 w-full"
            >
              <Stat
                big
                label="Purity (HPLC)"
                value={product.purity == null ? "-" : product.purity}
              />
              <Stat big label="Quantity" value={product.quantity} />
              <Stat
                big
                label="APLC"
                value={product.aplc == null ? "-" : product.aplc}
              />
            </motion.div>
          </motion.div>

          {/* RIGHT REFERENCE PANEL */}

          {/* Desktop/Tablet Panel */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="hidden lg:block absolute top-0 right-8 rounded-2xl border border-white/10 shadow-lg space-y-5 w-80 h-auto py-6 backdrop-blur-lg transition-all duration-300 hover:shadow-2xl"
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
            <img
              src={structureImg}
              alt="Structure"
              className="w-full h-[180px] sm:h-[220px] lg:h-[260px] object-contain rounded-2xl"
            />

            <div className="space-y-2 ml-10">
              <h4 className="font-bold text-xl sm:text-2xl text-black">
                References:
              </h4>
              {product.references?.map((r, i) => (
                <p
                  key={i}
                  className="text-[13px] sm:text-[14px] text-black font-semibold leading-[1.6]"
                >
                  {r.children?.[0]?.text}
                </p>
              ))}
            </div>

            <p className="text-xl sm:text-2xl font-semibold text-gray-800 pt-2 mb-4 ml-10">
              For Research Use Only
            </p>
          </motion.div>

          {/* Mobile Panel (below content) */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="block lg:hidden col-span-1 w-full mt-8"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              borderRadius: "1rem",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              padding: "1.5rem 0",
            }}
          >
            <img
              src={structureImg}
              alt="Structure"
              className="w-full h-[160px] sm:h-[180px] object-contain rounded-2xl"
            />

            <div className="space-y-2 px-6 mt-4">
              <h4 className="font-bold text-lg sm:text-xl text-black">
                References:
              </h4>
              {product.references?.map((r, i) => (
                <p
                  key={i}
                  className="text-[13px] sm:text-[14px] text-black font-semibold leading-[1.6]"
                >
                  {r.children?.[0]?.text}
                </p>
              ))}
            </div>

            <p className="text-lg sm:text-xl font-semibold text-gray-800 pt-2 mb-4 px-6">
              For Research Use Only
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroProduct;
