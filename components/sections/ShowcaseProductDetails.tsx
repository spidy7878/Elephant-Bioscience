"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "app/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

interface ShowcaseProductDetailsProps {
    isLoggedIn: boolean;
    onOpenLogin: () => void;
    showButton: boolean;
}

export default function ShowcaseProductDetails({
    isLoggedIn,
    onOpenLogin,
    showButton
}: ShowcaseProductDetailsProps) {
    const [products, setProducts] = useState<Product[]>([]);
    const showcaseRef = useRef<HTMLDivElement>(null);

    // Categories
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

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
                const res = await fetch(`${apiUrl}/api/products?populate=*`);
                const json = await res.json();
                const fetchedProducts = Array.isArray(json.data) ? json.data : [];
                setProducts(fetchedProducts);
            } catch (err) {
                console.warn("Fetch error (Strapi might be down):", err);
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

    // Filter Logic
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

        const normalizedProductCat = productCategoryName.replace(/[-\s]+/g, "").toLowerCase();
        const normalizedActiveCat = activeCategory.replace(/[-\s]+/g, "").toLowerCase();

        return normalizedProductCat === normalizedActiveCat;
    });

    return (
        <div
            id="product-showcase"
            ref={showcaseRef}
            className={`relative w-full max-w-7xl mx-auto px-4 py-8 ${!isLoggedIn ? 'h-screen overflow-hidden' : 'min-h-screen'}`}
        >
            {/* Full blur overlay when not logged in */}
            <div className={`relative z-20 ${!isLoggedIn ? "blur-[12px] select-none pointer-events-none opacity-60 grayscale-[30%]" : ""}`}>

                {/* Category Filter Buttons */}
                <div
                    ref={categoryRowRef}
                    className="flex flex-nowrap gap-4 mb-8 overflow-x-auto scrollbar-hide whitespace-nowrap cursor-grab"
                    onMouseDown={handleMouseDown}
                    onMouseLeave={handleMouseLeave}
                    onMouseUp={handleMouseUp}
                    onMouseMove={handleMouseMove}
                    style={{ userSelect: "none" }}
                >
                    {categories.map((category) => (
                        <button
                            key={category}
                            onClick={() => setActiveCategory(category)}
                            className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded transition-all duration-300 text-xs sm:text-sm ${activeCategory === category
                                ? "bg-[#8c2224] text-white"
                                : "bg-transparent text-white hover:bg-[#8c2224] hover:text-white border border-white/20"
                                }`}
                        >
                            {category}
                        </button>
                    ))}
                </div>

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
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
                                        // Get the media URL from productVideo field
                                        const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
                                        const mediaUrl = product.productVideo?.[0]?.url
                                            ? product.productVideo[0].url.startsWith("http")
                                                ? product.productVideo[0].url
                                                : `${apiUrl}${product.productVideo[0].url}`
                                            : null;

                                        // Check if the URL is actually a video file by extension
                                        const isVideo =
                                            mediaUrl && /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

                                        if (mediaUrl && isVideo) {
                                            // Render video
                                            return (
                                                <video
                                                    src={mediaUrl}
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
                                                        mixBlendMode: "screen",
                                                        willChange: "transform",
                                                    }}
                                                />
                                            );
                                        } else {
                                            // Render image - try productVideo first (in case it's an image), then chemicalFormulaImg
                                            const imageUrl =
                                                mediaUrl ||
                                                (product.chemicalFormulaImg?.[0]?.url
                                                    ? product.chemicalFormulaImg[0].url.startsWith(
                                                        "http"
                                                    )
                                                        ? product.chemicalFormulaImg[0].url
                                                        : `${apiUrl}${product.chemicalFormulaImg[0].url}`
                                                    : "");

                                            return imageUrl ? (
                                                <Image
                                                    src={imageUrl}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            ) : null;
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
                        </Link>
                    ))}
                </div>
            </div>

            {/* Centered Explore Product Button Overlay */}
            <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
                <AnimatePresence>
                    {showButton && (
                        <motion.button
                            onClick={onOpenLogin}
                            className="pointer-events-auto"
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
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ type: "spring", stiffness: 100, damping: 20 }}
                        >
                            Explore Products
                        </motion.button>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}
