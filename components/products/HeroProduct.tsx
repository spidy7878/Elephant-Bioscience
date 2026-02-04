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
  const [showQuantityModal, setShowQuantityModal] = useState(false);
  const [tempQuantity, setTempQuantity] = useState(quantity.toString());

  const handleOpenModal = () => {
    setTempQuantity(quantity.toString());
    setShowQuantityModal(true);
    document.body.style.overflow = "hidden";
  };

  const handleConfirmQuantity = () => {
    const newQuantity = parseInt(tempQuantity, 10);
    if (!isNaN(newQuantity) && newQuantity > 0) {
      setQuantity(newQuantity);
      setShowQuantityModal(false);
      document.body.style.overflow = "";
    }
  };

  const handleCloseModal = () => {
    setShowQuantityModal(false);
    document.body.style.overflow = "";
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
      {!hideFloatingVideo && !showQuantityModal && (
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
              className="flex flex-row gap-3 sm:gap-8 mt-6 items-center justify-between"
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

            {/* Quantity Modal - Rendered as Portal */}
            {showQuantityModal &&
              createPortal(
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="fixed inset-0 z-50 flex items-center justify-center"
                >
                  {/* Backdrop: static blur like LoginModal */}
                  <motion.div
                    className="absolute inset-0 bg-black/40"
                    onClick={handleCloseModal}
                    style={{
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                    }}
                  />

                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    role="dialog"
                    aria-modal="true"
                    className="relative flex rounded-xl w-[85vw] h-[70vw] max-w-[280px] max-h-[280px] sm:w-[300px] sm:h-[300px] md:w-[320px] md:h-[320px] px-3 py-4 shadow-none overflow-hidden items-center justify-center"
                    style={{
                      background: "transparent",
                      boxShadow: "none",
                      willChange: "transform, opacity",
                      transform: "translate3d(0, 0, 0)",
                      backfaceVisibility: "hidden",
                    }}
                  >
                    {/* Close Button - Top Right */}
                    <div className="absolute top-2 right-2 z-[100] pointer-events-auto">
                      <button
                        aria-label="Close modal"
                        onClick={handleCloseModal}
                        className="text-white/90 hover:text-white transition flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11 rounded-full bg-white/6 hover:bg-white/10 text-2xl sm:text-3xl"
                        type="button"
                      >
                        ×
                      </button>
                    </div>

                    {/* Content */}
                    <div className="relative z-10 w-full flex flex-col items-center gap-4">
                      {/* Quantity Input */}
                      <input
                        type="number"
                        value={tempQuantity}
                        onChange={(e) => setTempQuantity(e.target.value)}
                        min="1"
                        className="w-36 sm:w-44 px-4 py-3 rounded-lg text-[#8C2224] font-bold text-3xl sm:text-4xl text-center focus:outline-none placeholder-[#8C2224]/60 remove-spinner"
                        style={{
                          background: "rgba(255,255,255,0.95)",
                          boxShadow: "inset 0 1px 0 rgba(0,0,0,0.06)",
                        }}
                        placeholder="1"
                        autoFocus
                      />

                      {/* Confirm Button */}
                      <button
                        onClick={handleConfirmQuantity}
                        className="w-36 sm:w-44 py-2.5 rounded-xl bg-[#8C2224] text-white font-semibold text-lg shadow-md"
                        style={{ boxShadow: "0 8px 30px rgba(140,34,36,0.18)" }}
                      >
                        Confirm
                      </button>
                    </div>
                  </motion.div>
                </motion.div>,
                document.body
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
