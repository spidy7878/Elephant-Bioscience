"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useState } from "react";
import { Product } from "app/types/product";
import Stat from "./Stat";
import ProductVideo from "./ProductVideo";
import { X } from "lucide-react";

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
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(quantity.toString());

  const handleOpenModal = () => {
    setTempQuantity(quantity.toString());
    setShowQuantityModal(true);
  };

  const handleConfirmQuantity = () => {
    const newQuantity = parseInt(tempQuantity, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
      setShowQuantityModal(false);
    }
  };

  const handleCloseModal = () => {
    setShowQuantityModal(false);
  };

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
    <section className="relative w-full min-h-[100dvh] overflow-hidden">
      {/* FLOATING VIDEO - Only render if not hidden and modal is closed */}
      {!hideFloatingVideo && !showQuantityModal && <ProductVideo product={product} />}

      {/* MAIN CONTENT */}
      <div className="w-full px-4 sm:px-8 md:px-[2vw] md:py-12 mt-4 sm:mt-0 relative">
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
              <motion.div
                initial={skipAnimation ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.3 }}
                className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-black"
              >
                ${product.price}
              </motion.div>

              <motion.button
                initial={skipAnimation ? false : { opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.12, duration: 0.3 }}
                onClick={() => handleOpenModal()}
                className="inline-flex items-center gap-2 px-6 sm:px-8 py-3 rounded-2xl border border-white/10 shadow-lg font-medium text-black backdrop-blur-lg transition-all duration-300 hover:shadow-2xl text-base sm:text-lg mt-2 sm:mt-0"
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
              initial={skipAnimation ? false : { opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.3 }}
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

            {/* Quantity Modal */}
            {showQuantityModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xl">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 20 }}
                  transition={{ duration: 0.3, ease: "easeOut" }}
                  className="relative rounded-3xl shadow-2xl p-8 sm:p-10 max-w-md w-full mx-4 border-2 border-white/30"
                  style={{
                    background: "rgba(255,255,255,0.15)",
                    backdropFilter: "blur(40px) saturate(180%)",
                    WebkitBackdropFilter: "blur(40px) saturate(180%)",
                    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.4)",
                  }}
                >
                  {/* Glass shine effect */}
                  <div 
                    className="absolute inset-0 rounded-3xl pointer-events-none"
                    style={{
                      background: "linear-gradient(135deg, rgba(255,255,255,0.3) 0%, rgba(255,255,255,0) 50%)",
                    }}
                  />

                  {/* Close Button */}
                  <button
                    onClick={handleCloseModal}
                    className="absolute top-5 right-5 p-2.5 hover:bg-white/50 rounded-xl transition-all duration-200 z-10"
                    style={{
                      background: "rgba(255,255,255,0.25)",
                      backdropFilter: "blur(10px)",
                      WebkitBackdropFilter: "blur(10px)",
                      border: "1px solid rgba(255,255,255,0.3)",
                    }}
                  >
                    <X size={20} className="text-white drop-shadow-lg" />
                  </button>

                  <h3 className="text-2xl font-bold text-white mb-8 drop-shadow-lg relative z-10">Select Quantity</h3>

                  <div className="space-y-5 relative z-10">
                    <div>
                      <label className="block text-sm font-semibold text-white/90 mb-3 drop-shadow">
                        Number of Units
                      </label>
                      <input
                        type="number"
                        value={tempQuantity}
                        onChange={(e) => setTempQuantity(e.target.value)}
                        min="1"
                        className="w-full px-5 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold text-xl focus:outline-none focus:border-white/60 focus:ring-4 focus:ring-white/20 transition-all duration-200 placeholder-white/50"
                        style={{
                          background: "rgba(255,255,255,0.2)",
                          backdropFilter: "blur(20px)",
                          WebkitBackdropFilter: "blur(20px)",
                          boxShadow: "inset 0 2px 4px rgba(0,0,0,0.1)",
                        }}
                        placeholder="Enter quantity"
                        autoFocus
                      />
                    </div>

                    <div className="flex gap-4 mt-8">
                      <button
                        onClick={handleCloseModal}
                        className="flex-1 px-5 py-4 rounded-2xl border-2 border-white/40 text-white font-semibold hover:bg-white/30 transition-all duration-200 shadow-lg"
                        style={{
                          background: "rgba(255,255,255,0.15)",
                          backdropFilter: "blur(15px)",
                          WebkitBackdropFilter: "blur(15px)",
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleConfirmQuantity}
                        className="flex-1 px-5 py-4 rounded-2xl bg-white text-black font-bold hover:bg-white/95 hover:scale-105 active:scale-95 transition-all duration-200 shadow-2xl"
                      >
                        Confirm
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            )}
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
            <div className="rounded-2xl overflow-hidden bg-white flex items-center justify-center">
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
