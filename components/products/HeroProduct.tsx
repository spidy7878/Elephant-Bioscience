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
  const { scrollYProgress } = useScroll();

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
    : "";
  //console.log(structureImg)

  return (
    <section className="relative w-full h-screen overflow-hidden bg-[#dedada]">
      {/* FLOATING VIDEO */}
      <ProductVideo product={product} />

      {/* MAIN CONTENT */}
      <div className="w-full px-[6vw] py-16 relative">
        <div className="grid grid-cols-12 gap-6 items-start relative">
          {/* LEFT CONTENT */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="col-span-12 lg:col-span-4 space-y-5 z-10"
          >
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.6 }}
              className="text-[42px] leading-tight font-extrabold tracking-tight text-black"
            >
              {product.name}
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-gray-700 leading-relaxed max-w-md"
            >
              {product.description?.[0]?.children?.[0]?.text}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.6 }}
              className="text-5xl font-extrabold text-black mt-2"
            >
              ${product.price}
            </motion.div>

            <motion.button
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, duration: 0.6 }}
              className="inline-flex items-center gap-2 px-6 py-3 mt-2 bg-gradient-to-b from-white to-[#d1d1d1] rounded-lg shadow-[0_6px_18px_rgba(0,0,0,0.15)] hover:shadow-[0_10px_28px_rgba(0,0,0,0.25)] transition-all duration-300 font-medium text-black"
            >
              Place Order →
            </motion.button>

            {/* STATS ROW BELOW BUTTON */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.7 }}
              className="grid grid-cols-3 gap-6 mt-6 w-full"
            >
              <Stat big label="Purity (HPLC)" value={product.purity} />
              <Stat big label="Quantity" value={product.quantity} />
              <Stat big label="APLC" value={product.aplc} />
            </motion.div>
          </motion.div>

          {/* RIGHT REFERENCE PANEL */}

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.7 }}
            className="col-span-12 lg:col-span-4 lg:col-start-9 bg-white/80 backdrop-blur-md rounded-[20px] px-6 sm:px-8 lg:px-10 py-6 sm:py-8 shadow-[0_8px_24px_rgba(0,0,0,0.12)] space-y-5 w-full h-auto lg:h-[640px]"
          >
            <img
              src={structureImg}
              alt="Structure"
              className="w-full h-[180px] sm:h-[220px] lg:h-[260px] object-contain rounded-xl"
            />

            <div className="space-y-2">
              <h4 className="font-semibold text-[16px] sm:text-[18px] text-black">
                References:
              </h4>
              {product.references?.map((r, i) => (
                <p
                  key={i}
                  className="text-[13px] sm:text-[14px] text-gray-700 leading-[1.6]"
                >
                  {r.children?.[0]?.text}
                </p>
              ))}
            </div>

            <p className="text-[13px] sm:text-[14px] font-semibold text-gray-800 pt-2 mb-4">
              For Research Use Only
            </p>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroProduct;
