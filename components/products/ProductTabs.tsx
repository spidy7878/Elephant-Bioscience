"use client";

import { useState } from "react";
import { Product } from "app/types/product";
import { motion, AnimatePresence } from "framer-motion";
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
    <section className="relative bg-[#dedada] py-14">
      <div className="max-w-[1400px] mx-auto px-6">
        {/* TAB HEADER */}
        <div className="bg-[#dedada] rounded-xl px-6 py-4 flex gap-3 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActive(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition ${
                active === tab
                  ? "bg-red-500 text-white shadow"
                  : "bg-[#dfe3e8] text-black hover:bg-[#d5d9de]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-12 gap-8 mt-8 items-start">
          {/* LEFT CONTENT */}
          <div className="col-span-12 lg:col-span-7 bg-white rounded-xl shadow p-8">
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
                      <p key={i} className="leading-relaxed text-gray-700">
                        {d.children?.[0]?.text}
                      </p>
                    ))}
                  </div>
                )}

                {/* CHEMICAL PROPERTIES */}
                {active === "Chemical Properties" && (
                  <div>
                    <h2 className="text-3xl font-semibold mb-6">
                      Biochemical Characteristics
                    </h2>
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
                    <h2 className="text-3xl font-semibold mb-4">Storage</h2>
                    <p className="leading-relaxed text-gray-700">
                      {product.storage}
                    </p>
                  </div>
                )}

                {/* Third party testing  */}
                {active === "3rd Party Testing" && (
                  <div>
                    <h2 className="text-3xl font-semibold mb-4">Storage</h2>
                    <img
                      src={thirdPartyTestingImage}
                      alt="Third party testing"
                      className="leading-relaxed text-gray-700"
                    ></img>
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
