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

  /* DYNAMIC CATEGORY FETCHING */
  const [categories, setCategories] = useState<string[]>(["All Peptides"]);
  const [activeCategory, setActiveCategory] = useState(categories[0]);
  const isImagesLoaded = true;

  const [dataReady, setDataReady] = useState(false);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

        // Parallel fetch: Products + Categories
        const [prodRes, catRes] = await Promise.all([
          fetch(`${apiUrl}/api/products?populate[0]=productVideo&populate[1]=productVideoSafari&populate[2]=chemicalFormulaImg&populate[3]=category&pagination[pageSize]=500`),
          fetch(`${apiUrl}/api/categories`)
        ]);

        const prodJson = await prodRes.json();
        const catJson = await catRes.json();

        setProducts(Array.isArray(prodJson.data) ? prodJson.data : []);

        // Populate Categories if successful
        if (catJson.data && Array.isArray(catJson.data)) {
          // We extract the 'name' from each category. 
          // Assuming response structure: { data: [ { id: 1, attributes: { name: "..." }, ... } ] } 
          // or flattened: { data: [ { id: 1, name: "...", ... } ] }
          const fetchedNames = catJson.data.map((c: any) =>
            c.name || c.attributes?.name || ""
          ).filter(Boolean);

          // Ensure unique and prepend "All Peptides"
          setCategories(["All Peptides", ...Array.from(new Set(fetchedNames)) as string[]]);
        }

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
    let progressInterval: NodeJS.Timeout | undefined;

    if (loading && !dataReady) {
      progressInterval = setInterval(() => {
        setLoadingProgress((prev) => {
          // If data isn't ready, cap at 90%
          return prev >= 0.9 ? 0.9 : prev + 0.05;
        });
      }, 100);
    }

    if (loading && dataReady) {
      setLoadingProgress(1);
      // Hide loader on the next frame to ensure content is rendered
      requestAnimationFrame(() => setLoading(false));
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

    // DEBUG: Log the raw category data for the first few products to see structure
    // console.log(`Product: ${product.name}, Category:`, rawCategory);

    let productCategoryNames: string[] = [];

    if (Array.isArray(rawCategory)) {
      // Handle array of categories (Many-to-Many)
      productCategoryNames = rawCategory.map(cat => {
        if (typeof cat === 'string') return cat;
        return cat.name || cat.title || cat.attributes?.name || cat.attributes?.title || "";
      });
    } else if (typeof rawCategory === "string") {
      productCategoryNames = [rawCategory];
    } else if (rawCategory && typeof rawCategory === "object") {
      // Handle single object (One-to-One / One-to-Many)
      // Handle both flattened and nested (attributes) structures
      const name =
        rawCategory.name ||
        rawCategory.title ||
        rawCategory.attributes?.name ||
        rawCategory.attributes?.title ||
        rawCategory.data?.attributes?.name ||
        rawCategory.data?.attributes?.title ||
        "";
      if (name) productCategoryNames = [name];
    }

    if (productCategoryNames.length === 0) return false;

    const normalizedActiveCat = activeCategory
      .replace(/[-\s]+/g, "")
      .toLowerCase();

    // Check if ANY of the product's categories match the active category
    return productCategoryNames.some(name => {
      const normalizedProductCat = name.replace(/[-\s]+/g, "").toLowerCase();
      return normalizedProductCat === normalizedActiveCat;
    });


  });

  return (
    <>
      <AnimatePresence>
        {loading && <LoadingSection loadingProgress={loadingProgress} percentagePosition="above" />}
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-12">
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
                  className={`w-full px-2 py-2.5 rounded-md transition-all duration-300 text-xs sm:text-sm font-medium border border-white/10 ${activeCategory === category
                    ? "bg-[#8c2224] text-white border-[#8c2224]"
                    : "bg-transparent text-white/70 hover:bg-[#8c2224] hover:text-white hover:border-[#8c2224]"
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
                  key={product.documentId || index}
                  href={`/productListing/${product.documentId}`}
                  prefetch={true}
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
                                <source src={safariUrl} type="video/quicktime" />
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
