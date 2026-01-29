"use client";

import { useState } from "react";
import { Product } from "app/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import ChemicalTable from "./ChemicalTable";

const tabs = [
  "Chemical Properties",
  "Description",
  "COA / HPLC / MS",
  "3rd Party Testing",
  "Storage",
];

export default function ProductTabs({ product }: { product: Product }) {
  const [active, setActive] = useState("Description");

  const thirdPartyTestingImage = product?.thirdpartytesting?.[0]?.url
    ? `${process.env.NEXT_PUBLIC_API_URL}${product.thirdpartytesting[0].url}`
    : "";

  return (
    <section className="relative py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* TAB HEADER */}
        <div className="rounded-xl py-2 sm:py-4 flex gap-2 sm:gap-3 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded transition-all duration-300 text-xs sm:text-sm ${
                active === tab
                  ? "bg-[#8c2224] text-white"
                  : "bg-transparent text-white hover:bg-[#8c2224] hover:text-white"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-8 mt-6 lg:mt-8 items-start">
          {/* LEFT CONTENT */}
          <div
            className="col-span-1 lg:col-span-7 rounded-lg lg:rounded-2xl shadow p-4 sm:p-6 md:p-8"
            style={{
              background: "rgba(255,255,255,0.08)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255,255,255,0.1)",
              boxShadow: "0 4px 24px 0 rgba(0,0,0,0.08)",
              minHeight: "260px",
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, y: 18 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.45, ease: "easeOut" }}
              >
                {/* DESCRIPTION */}
                {active === "Description" && (
                  <div className="space-y-4 text-black">
                    <h2 className="text-3xl font-semibold">Overview</h2>
                    {product.description?.map((d, i) => (
                      <p
                        key={i}
                        className="leading-relaxed text-black font-light text-base md:text-lg lg:text-xl"
                      >
                        {d.children?.[0]?.text}
                      </p>
                    ))}
                  </div>
                )}

                {/* CHEMICAL PROPERTIES */}
                {active === "Chemical Properties" && (
                  <div>
                    <ChemicalTable product={product} />
                  </div>
                )}

                {/* COA */}
                {active === "COA / HPLC / MS" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {product.coa?.map((file, i) => (
                      <iframe
                        key={i}
                        src={`${process.env.NEXT_PUBLIC_API_URL}${file.url}`}
                        className="w-full h-[520px] border rounded-xl"
                      />
                    ))}
                  </div>
                )}

                {/* STORAGE */}
                {active === "Storage" && (
                  <div>
                    {/* <h2 className="text-3xl font-semibold mb-4">Storage</h2> */}
                    <p className="leading-relaxed text-gray-700">
                      {product.storage}
                    </p>
                  </div>
                )}

                {/* Third party testing  */}
                {active === "3rd Party Testing" && (
                  <div className="relative w-full h-[400px]">
                    {thirdPartyTestingImage && (
                      <Image
                        src={thirdPartyTestingImage}
                        alt="3rd Party Testing"
                        fill
                        className="object-contain"
                      />
                    )}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* RIGHT EMPTY SPACE (FOR FLOATING VIDEO PATH) */}
          <div className="hidden lg:block col-span-5"></div>
        </div>
      </div>
    </section>
  );
}
