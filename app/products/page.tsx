"use client";
import { useState, useRef, useEffect } from "react";
import { Product } from "../types/product";
import Image from "next/image";
import NavigationBar from "components/sections/NavigationBar";
import Link from "next/link";
import { AnimatePresence } from "framer-motion";
import LoadingSection from "components/sections/LoadingSection";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(0);

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
  const isImagesLoaded = true;

  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        // Remove trailing slash from API URL if present to avoid double slashes
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
        const res = await fetch(
          `${apiUrl}/api/products?populate=*`
        );
        const json = await res.json();
        setProducts(Array.isArray(json.data) ? json.data : []);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setDataReady(true);
      }
    }

    fetchProducts();
  }, []);

  // Sync progress bar with data loading
  useEffect(() => {
    let progressInterval: NodeJS.Timeout;

    if (loading) {
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          // If data isn't ready, cap at 90%
          if (!dataReady) {
            return prev >= 0.9 ? 0.9 : prev + 0.05;
          }

          // Data is ready, move to 100%
          if (prev >= 1) {
            clearInterval(progressInterval);
            // Small delay for the 100% to be seen
            setTimeout(() => setLoading(false), 300);
            return 1;
          }

          return prev + 0.1;
        });
      }, 100);
    }

    return () => {
      if (progressInterval) clearInterval(progressInterval);
    };
  }, [loading, dataReady]);

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

  // Robust product matching
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "All Peptides") return true;

    // Enhanced category resolution
    let rawCategory = (product as any).catorgory || (product as any).category;

    if (!rawCategory) {
      const catKey = Object.keys(product).find((k) =>
        k.toLowerCase().includes("categor")
      );
      if (catKey) rawCategory = (product as any)[catKey];
    }

    let productCategoryName = "";

    if (typeof rawCategory === "string") {
      productCategoryName = rawCategory;
    } else if (rawCategory && typeof rawCategory === "object") {
      productCategoryName =
        rawCategory.name ||
        rawCategory.title ||
        rawCategory.attributes?.name ||
        rawCategory.attributes?.title ||
        rawCategory.data?.attributes?.name ||
        rawCategory.data?.attributes?.title ||
        "";
    }

    if (!productCategoryName) return false;

    const normalizedProductCat = productCategoryName
      .replace(/[-\s]+/g, "")
      .toLowerCase();
    const normalizedActiveCat = activeCategory
      .replace(/[-\s]+/g, "")
      .toLowerCase();

    return normalizedProductCat === normalizedActiveCat;
  });

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingSection loadingProgress={loadingProgress} />}
      </AnimatePresence>

      <div className="min-h-[100dvh] bg-black text-white py-12 px-4 relative overflow-hidden">
        {/* Background Video */}
        <video
          className="fixed top-0 left-0 w-full h-full object-cover z-0"
          src="/videos/mov1.mp4"
          autoPlay
          loop
          muted
          playsInline
          style={{ pointerEvents: "none" }}
        />
        {/* Overlay for readability */}
        <div className="fixed top-0 left-0 w-full h-full bg-black/60 z-10 pointer-events-none" />

        {/* All content above the video */}
        <div className="relative z-20">
          <NavigationBar isImagesLoaded={isImagesLoaded} />

          <div className="mt-2 sm:mt-8" style={{ height: "20px" }} />

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
                    const categorySlug = category
                      .replace(/\s+/g, "-")
                      .toLowerCase();
                    const newUrl = `/products${categorySlug === "all-peptides" ? "" : "/" + categorySlug}`;
                    window.history.replaceState(null, "", newUrl);
                  }}
                  className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded transition-all duration-300 text-xs sm:text-sm ${activeCategory === category
                    ? "bg-[#8c2224] text-white"
                    : "bg-transparent text-white hover:bg-[#8c2224] hover:text-white"
                    }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Section Title */}
            {/* <h2 className="text-3xl font-semibold mb-8">{activeCategory}</h2> */}

            {/* Products Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product, index) => (
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
                  <div className="absolute inset-0 flex items-center justify-center p-4 pb-20">
                    <div className="relative w-full h-full flex items-center justify-center product-media-responsive">
                      <style jsx>{`
                        .product-media-responsive {
                          max-width: 70%;
                          max-height: 70%;
                          margin-top: 2.5rem; /* 40px, shifts down on desktop */
                        }
                        @media (max-width: 600px) {
                          .product-media-responsive {
                            max-width: 100%;
                            max-height: 100%;
                            margin-top: 1.25rem; /* 20px, shifts down on mobile */
                          }
                        }
                      `}</style>
                      {(() => {
                        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

                        // Helper to build full URL
                        const buildUrl = (url: string | undefined): string | undefined => {
                          if (!url) return undefined;
                          return url.startsWith("http") ? url : `${apiUrl}${url}`;
                        };

                        // Get Safari .mov URL (ProRes 4444 with alpha) - only if it exists AND is a .mov file
                        const safariRaw = product.productVideoSafari?.[0]?.url;
                        const safariUrl = safariRaw && /\.mov$/i.test(safariRaw) ? buildUrl(safariRaw) : undefined;

                        // Get Chrome .webm URL (VP9 with alpha) - check productVideo for .webm files
                        const chromeRaw = product.productVideo?.[0]?.url;
                        const chromeUrl = chromeRaw && /\.webm$/i.test(chromeRaw) ? buildUrl(chromeRaw) : undefined;

                        // Get fallback PNG URL from chemicalFormulaImg OR productVideo (if it's an image)
                        const fallbackFromFormula = product.chemicalFormulaImg?.[0]?.url;
                        const fallbackFromVideo = chromeRaw && /\.(png|jpg|jpeg|gif|webp)$/i.test(chromeRaw) ? chromeRaw : undefined;
                        const fallbackUrl = buildUrl(fallbackFromFormula || fallbackFromVideo);

                        // Check if we have valid video sources
                        const hasVideoSources = safariUrl || chromeUrl;

                        if (hasVideoSources) {
                          // Render video with multiple sources for cross-browser support
                          return (
                            <video
                              autoPlay
                              loop
                              muted
                              playsInline
                              controls={false}
                              poster={fallbackUrl}
                              style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "contain",
                                display: "block",
                                willChange: "transform",
                              }}
                            >
                              {/* Safari: ProRes 4444 .mov with alpha */}
                              {safariUrl && (
                                <source src={safariUrl} type="video/mp4; codecs=hvc1" />
                              )}
                              {/* Chrome/Firefox: VP9 .webm with alpha */}
                              {chromeUrl && (
                                <source src={chromeUrl} type="video/webm" />
                              )}
                            </video>
                          );
                        } else if (fallbackUrl) {
                          // No video sources - render fallback PNG
                          return (
                            <Image
                              src={fallbackUrl}
                              alt={product.name}
                              fill
                              className="object-contain"
                            />
                          );
                        }
                        return null;
                      })()}
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="absolute bottom-0 left-0 w-full text-center z-10 ">
                    <h3
                      className="text-lg sm:text-xl font-medium text-white mb-4 truncate mx-auto px-4"
                      style={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        display: "block",
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
    </>
  );
}
