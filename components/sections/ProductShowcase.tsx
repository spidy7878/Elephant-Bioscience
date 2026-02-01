"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "app/types/product";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface ProductShowcaseProps {
    onOpenLogin?: () => void;
    showButton?: boolean;
}

export default function ProductShowcase({ onOpenLogin, showButton = true }: ProductShowcaseProps) {
    const [products, setProducts] = useState<Product[]>([]);

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                // Remove trailing slash from API URL if present
                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
                const res = await fetch(
                    `${apiUrl}/api/products?populate=*`
                );
                const json = await res.json();
                setProducts(Array.isArray(json.data) ? json.data : []);
            } catch (err) {
                console.error("Fetch error:", err);
            }
        }
        fetchProducts();
    }, []);

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
        <div id="product-showcase" className="h-screen bg-black text-white py-12 px-4 relative overflow-hidden flex flex-col justify-center">

            {/* Background Video */}
            <video
                className="absolute top-0 left-0 w-full h-full object-cover z-0"
                src="/videos/mov1.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{ pointerEvents: "none" }}
            />

            {/* Overlay for readability */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/60 z-10 pointer-events-none" />

            {/* All content above the video */}
            <div className="relative z-20 w-full">

                <div className="max-w-7xl mx-auto relative">
                    {/* Category Filter Buttons - BLURRED */}
                    <div
                        ref={categoryRowRef}
                        className="flex flex-nowrap gap-4 mb-12 mt-24 overflow-x-auto scrollbar-hide whitespace-nowrap cursor-grab blur-[4px] opacity-70 pointer-events-none"
                        onMouseDown={handleMouseDown}
                        onMouseLeave={handleMouseLeave}
                        onMouseUp={handleMouseUp}
                        onMouseMove={handleMouseMove}
                        style={{ userSelect: "none" }}
                    >
                        {categories.map((category) => (
                            <button
                                key={category}
                                disabled
                                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded transition-all duration-300 text-xs sm:text-sm ${activeCategory === category
                                    ? "bg-[#8c2224] text-white"
                                    : "bg-transparent text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid - BLURRED */}
                    <div className="relative">
                        <div
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6 blur-[12px] select-none pointer-events-none opacity-60 grayscale-[30%]"
                            aria-hidden="true"
                        >
                            {/* LIMIT to 8 items to ensure it fits in the screen (2 rows) */}
                            {filteredProducts.length > 0 ? (
                                filteredProducts.slice(0, 8).map((product, index) => (
                                    <div
                                        key={index}
                                        className="group relative rounded-3xl overflow-hidden block aspect-square"
                                        style={{
                                            background: "rgba(255, 255, 255, 0.03)",
                                            backdropFilter: "blur(10px)",
                                            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
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
                          margin-top: 2.5rem;
                        }
                        @media (max-width: 600px) {
                          .product-media-responsive {
                            max-width: 100%;
                            max-height: 100%;
                            margin-top: 1.25rem;
                          }
                        }
                      `}</style>
                                                {(() => {
                                                    // Media rendering logic (matching logic from Product page with env var)
                                                    const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
                                                    const mediaUrl = product.productVideo?.[0]?.url
                                                        ? product.productVideo[0].url.startsWith("http")
                                                            ? product.productVideo[0].url
                                                            : `${apiUrl}${product.productVideo[0].url}`
                                                        : null;

                                                    const isVideo =
                                                        mediaUrl && /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

                                                    if (mediaUrl && isVideo) {
                                                        return (
                                                            <video
                                                                src={mediaUrl}
                                                                autoPlay
                                                                loop
                                                                muted
                                                                playsInline
                                                                controls={false}
                                                                style={{ width: "100%", height: "100%", objectFit: "contain", display: "block", mixBlendMode: "screen", willChange: "transform" }}
                                                            />
                                                        );
                                                    } else {
                                                        // Fix double slash issue for fallback or chemicalFormulaImg
                                                        const rawUrl = product.chemicalFormulaImg?.[0]?.url || "";
                                                        // If rawUrl is absolute (http), use it.
                                                        // If relative (starts with /), ensure apiUrl doesn't trail with /.
                                                        // Fallback to placeholder.
                                                        const fullUrl = rawUrl.startsWith("http") ? rawUrl : (rawUrl ? `${apiUrl}${rawUrl}` : "/163360068.webp");
                                                        return <Image src={fullUrl} alt={product.name} fill className="object-contain" />;
                                                    }
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
                                    </div>
                                ))
                            ) : (
                                /* Placeholder/Loading skeleton items */
                                Array.from({ length: 4 }).map((_, i) => (
                                    <div key={i} className="group relative rounded-3xl overflow-hidden block aspect-square bg-white/5 animate-pulse" />
                                ))
                            )}
                        </div>

                        {/* Centered Explore Product Button */}
                        <div className="absolute inset-0 flex items-center justify-center z-50">
                            <AnimatePresence>
                                {showButton && (
                                    <motion.button
                                        onClick={onOpenLogin}
                                        style={{
                                            padding: "12px 24px",
                                            background: "#8C2224",
                                            border: "none",
                                            borderRadius: "100px",
                                            color: "#fff",
                                            fontSize: "15px",
                                            fontWeight: 700,
                                            cursor: "pointer",
                                            boxShadow: "0 4px 20px rgba(140, 34, 36, 0.15)",
                                            letterSpacing: 0.5,
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        transition={{ type: "spring", stiffness: 100, damping: 20 }}
                                    >
                                        Explore Products
                                    </motion.button>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
