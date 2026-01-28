"use client";
import { useState, useRef, useEffect } from "react";
import { Product } from "../types/product";
import type { MutableRefObject } from "react";
import Image from "next/image";
import NavigationBar from "components/sections/NavigationBar";

import Link from "next/link";
// import { useRouter, usePathname } from "next/navigation";

export default function ProductPage() {
  //For api call
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/products?populate=*`
        );
        const json = await res.json();
        setProducts(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // Drag-to-scroll for category row
  const categoryRowRef = useRef<HTMLDivElement>(null);
  const isDownRef = useRef(false);
  const startXRef = useRef(0);
  const scrollLeftRef = useRef(0);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    isDownRef.current = true;
    if (categoryRowRef.current) {
      categoryRowRef.current.classList.add("cursor-grabbing");
      startXRef.current = e.pageX - categoryRowRef.current.offsetLeft;
      scrollLeftRef.current = categoryRowRef.current.scrollLeft;
    }
  };

  const handleMouseLeave = () => {
    isDownRef.current = false;
    if (categoryRowRef.current) {
      categoryRowRef.current.classList.remove("cursor-grabbing");
    }
  };

  const handleMouseUp = () => {
    isDownRef.current = false;
    if (categoryRowRef.current) {
      categoryRowRef.current.classList.remove("cursor-grabbing");
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDownRef.current || !categoryRowRef.current) return;
    e.preventDefault();
    const x = e.pageX - categoryRowRef.current.offsetLeft;
    const walk = (x - startXRef.current) * 1.5;
    categoryRowRef.current.scrollLeft = scrollLeftRef.current - walk;
  };

  const categories = [
    "All Peptides",
    "Peptide Capsules",
    "Peptide Blends",
    "IGF-1 Proteins",
    "Melanotan Peptides",
    "Cosmetic Peptides",
    "Bioregulators",
  ];
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  // const router = useRouter();
  // const pathname = usePathname();

  // Track scroll position
  const [scrollY, setScrollY] = useState(0);
  const isImagesLoaded = true;

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (loading) return <p className="text-center py-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-white py-12 px-4 relative overflow-hidden">
      {/* Background Video */}
      <video
        className="fixed top-0 left-0 w-full h-full object-cover z-0"
        src="/videos/mov1.mp4"
        autoPlay
        loop
        muted
        playsInline
        style={{
          pointerEvents: "none",
        }}
      />
      {/* Overlay for readability */}
      <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-10 pointer-events-none" />

      {/* All content above the video */}
      <div className="relative z-20">
        {/* <div className="hidden md:block">
          <NavigationBar scrollY={scrollY} isImagesLoaded={isImagesLoaded} />
        </div> */}

        {/* Fade NavigationBar out as user scrolls down */}
        <div
          style={{
            transition: "opacity 0.7s cubic-bezier(.4,0,.2,1)",
            opacity:
              scrollY < 40 ? 1 : scrollY < 120 ? 1 - (scrollY - 40) / 80 : 0,
            pointerEvents: scrollY < 120 ? "auto" : "none",
          }}
        >
          <NavigationBar scrollY={scrollY} isImagesLoaded={isImagesLoaded} />
        </div>

        {/* Spacing after Navigation Bar */}
        {/* <div className="hidden md:block" style={{ height: "80px" }} /> */}
        <div style={{ height: "80px" }} />

        <div className="max-w-7xl mx-auto">
          {/* Category Filter Buttons */}
          <div
            ref={categoryRowRef}
            className="flex flex-nowrap gap-4 mb-12 overflow-x-auto scrollbar-hide whitespace-nowrap cursor-grab"
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            style={{ userSelect: "none" }}
          >
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => {
                  setActiveCategory(category);
                  // Update the URL with /{category} using history API (no navigation)
                  const categorySlug = category
                    .replace(/\s+/g, "-")
                    .toLowerCase();
                  const newUrl = `/products${categorySlug === "all-peptides" ? "" : "/" + categorySlug}`;
                  window.history.replaceState(null, "", newUrl);
                }}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded transition-all duration-300 text-xs sm:text-sm ${
                  activeCategory === category
                    ? "bg-[#8c2224] text-white"
                    : "bg-transparent text-white hover:bg-[#8c2224] hover:text-white"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Section Title */}
          <h2 className="text-3xl font-semibold mb-8">{activeCategory}</h2>

          {/* Products Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products
              .filter((product) => {
                if (activeCategory === "All Peptides") return true;
                // Match product.category to activeCategory (case-insensitive, ignore spaces/dashes)
                const prodCat = (product.category || "")
                  .replace(/[-\s]+/g, "")
                  .toLowerCase();
                const activeCat = activeCategory
                  .replace(/[-\s]+/g, "")
                  .toLowerCase();
                return prodCat === activeCat;
              })
              .map((product, index) => (
                <Link
                  key={index}
                  href={`/productListing/${product.documentId}`}
                  className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 block aspect-square"
                  style={{
                    background: "rgba(255, 255, 255, 0.03)",
                    backdropFilter: "blur(10px)",
                    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                    textDecoration: "none",
                    color: "inherit",
                  }}
                >
                  {/* Glass shimmer effect on hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)",
                    }}
                  />

                  {/* Product Media */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative w-1/2 h-1/2 flex items-center justify-center">
                      {product.productVideo?.length ? (
                        <video
                          src={
                            product.productVideo[0]?.url ||
                            `${process.env.NEXT_PUBLIC_API_URL}${product.productVideo[0].url}`
                          }
                          autoPlay
                          loop
                          muted
                          playsInline
                          controls={false}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "contain",
                            display: "block",
                          }}
                        />
                      ) : (
                        <Image
                          src={
                            product?.chemicalFormulaImg?.[0]?.url ||
                            `${process.env.NEXT_PUBLIC_API_URL}${product.chemicalFormulaImg[0].url}`
                          }
                          alt={product.name}
                          fill
                          className="object-contain"
                        />
                      )}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="absolute bottom-0 left-0 w-full pt-4 sm:pt-6 text-center z-10 ">
                    <h3
                      className="text-lg sm:text-xl font-medium mb-1 text-white mb-4 truncate mx-auto"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "70%",
                        display: "block",
                        marginLeft: "auto",
                        marginRight: "auto",
                      }}
                    >
                      {product.name}
                    </h3>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
