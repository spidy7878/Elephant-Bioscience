"use client";

import { useState, useRef, useEffect, memo, useCallback } from "react";
import { Product } from "app/types/product";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Image from "next/image";

// Pre-compute API URL once at module level
const API_URL = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";

// Static styles to avoid recreating on each render
const cardStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.03)",
    backdropFilter: "blur(10px)",
    boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
    textDecoration: "none",
    color: "inherit",
};

const videoStyle: React.CSSProperties = {
    width: "100%",
    height: "100%",
    objectFit: "contain",
    display: "block",
    mixBlendMode: "screen",
    willChange: "transform",
    pointerEvents: "none",
};

// Helper function to get media URL
function getMediaUrl(product: Product): { url: string | null; isVideo: boolean } {
    const mediaUrl = product.productVideo?.[0]?.url
        ? product.productVideo[0].url.startsWith("http")
            ? product.productVideo[0].url
            : `${API_URL}${product.productVideo[0].url}`
        : null;

    const isVideo = mediaUrl ? /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl) : false;

    return { url: mediaUrl, isVideo };
}

// Helper function to get fallback image URL
function getFallbackImageUrl(product: Product, mediaUrl: string | null): string {
    if (mediaUrl) return mediaUrl;

    const imgUrl = product.chemicalFormulaImg?.[0]?.url;
    if (!imgUrl) return "";

    return imgUrl.startsWith("http") ? imgUrl : `${API_URL}${imgUrl}`;
}

// Memoized ProductCard component to prevent unnecessary re-renders
interface ProductCardProps {
    product: Product;
    index: number;
}

const ProductCard = memo(function ProductCard({ product, index }: ProductCardProps) {
    const videoRef = useRef<HTMLVideoElement>(null);
    const cardRef = useRef<HTMLAnchorElement>(null);
    const [isVisible, setIsVisible] = useState(false);

    // Pre-compute media info once per product
    const { url: mediaUrl, isVideo } = getMediaUrl(product);
    const imageUrl = !isVideo ? getFallbackImageUrl(product, mediaUrl) : "";

    // Intersection Observer for lazy video loading
    useEffect(() => {
        const card = cardRef.current;
        if (!card || !isVideo) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    setIsVisible(entry.isIntersecting);
                });
            },
            {
                rootMargin: "50px",
                threshold: 0.1
            }
        );

        observer.observe(card);
        return () => observer.disconnect();
    }, [isVideo]);

    // Control video playback based on visibility
    useEffect(() => {
        const video = videoRef.current;
        if (!video) return;

        if (isVisible) {
            video.play().catch(() => {
                // Ignore autoplay errors (browser policy)
            });
        } else {
            video.pause();
        }
    }, [isVisible]);

    return (
        <Link
            ref={cardRef}
            key={product.documentId || index}
            href={`/productListing/${product.documentId}`}
            prefetch={true}
            className="group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 block aspect-square"
            style={cardStyle}
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
            <div className="absolute inset-0 flex items-center justify-center p-4 pb-20 pointer-events-none">
                <div className="relative w-full h-full flex items-center justify-center max-w-[70%] max-h-[70%] mt-10 sm:max-w-full sm:max-h-full sm:mt-5">
                    {isVideo && mediaUrl ? (
                        <video
                            ref={videoRef}
                            src={isVisible ? mediaUrl : undefined}
                            autoPlay={false}
                            loop
                            muted
                            playsInline
                            controls={false}
                            preload="none"
                            style={videoStyle}
                        />
                    ) : imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={product.name}
                            fill
                            className="object-contain pointer-events-none"
                            loading="lazy"
                        />
                    ) : null}
                </div>
            </div>

            {/* Product Info */}
            <div className="absolute bottom-0 left-0 w-full text-center z-10 pointer-events-none">
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
    );
});

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
    const [isLoading, setIsLoading] = useState(false);
    const [showLoader, setShowLoader] = useState(false);
    const [progress, setProgress] = useState(0);
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

    // Fetch products from API - only once
    useEffect(() => {
        let isMounted = true;
        let progressInterval: NodeJS.Timeout;
        let autoHideTimeout: NodeJS.Timeout;

        async function fetchProducts() {
            setProgress(0);
            setIsLoading(true);
            setShowLoader(true);

            // Auto-hide loader after 5 seconds regardless of loading state
            autoHideTimeout = setTimeout(() => {
                if (isMounted) {
                    setShowLoader(false);
                }
            }, 5000);

            // Simulate progress
            progressInterval = setInterval(() => {
                setProgress((prev) => {
                    if (prev < 90) {
                        return prev + Math.random() * 30;
                    }
                    return prev;
                });
            }, 200);

            try {
                const res = await fetch(`${API_URL}/api/products?populate=*`);
                const json = await res.json();
                const fetchedProducts = Array.isArray(json.data) ? json.data : [];
                if (isMounted) {
                    setProgress(100);
                    clearTimeout(autoHideTimeout);
                    setTimeout(() => {
                        setProducts(fetchedProducts);
                        setIsLoading(false);
                        setShowLoader(false);
                        setProgress(0);
                    }, 300);
                }
            } catch (err) {
                console.warn("Fetch error (Strapi might be down):", err);
                if (isMounted) {
                    setProgress(100);
                    clearTimeout(autoHideTimeout);
                    setTimeout(() => {
                        setIsLoading(false);
                        setShowLoader(false);
                        setProgress(0);
                    }, 300);
                }
            }
        }
        fetchProducts();

        return () => {
            isMounted = false;
            clearInterval(progressInterval);
            clearTimeout(autoHideTimeout);
        };
    }, []);

    // Drag-to-scroll for category row
    const categoryRowRef = useRef<HTMLDivElement>(null);
    const isDownRef = useRef(false);
    const startXRef = useRef(0);
    const scrollLeftRef = useRef(0);

    const handleMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        isDownRef.current = true;
        if (categoryRowRef.current) {
            categoryRowRef.current.classList.add("cursor-grabbing");
            startXRef.current = e.pageX - categoryRowRef.current.offsetLeft;
            scrollLeftRef.current = categoryRowRef.current.scrollLeft;
        }
    }, []);

    const handleMouseLeave = useCallback(() => {
        isDownRef.current = false;
        if (categoryRowRef.current) {
            categoryRowRef.current.classList.remove("cursor-grabbing");
        }
    }, []);

    const handleMouseUp = useCallback(() => {
        isDownRef.current = false;
        if (categoryRowRef.current) {
            categoryRowRef.current.classList.remove("cursor-grabbing");
        }
    }, []);

    const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
        if (!isDownRef.current || !categoryRowRef.current) return;
        e.preventDefault();
        const x = e.pageX - categoryRowRef.current.offsetLeft;
        const walk = (x - startXRef.current) * 1.5;
        categoryRowRef.current.scrollLeft = scrollLeftRef.current - walk;
    }, []);

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
            {/* Loading Progress Bar - Single Line 0-100% */}
            <AnimatePresence>
                {showLoader && (
                    <motion.div
                        initial={{ scaleX: 0, originX: 0 }}
                        animate={{ scaleX: 1, originX: 0 }}
                        exit={{ scaleX: 0, originX: 0 }}
                        transition={{ duration: 0.5, ease: "easeInOut" }}
                        className="fixed top-0 left-0 right-0 z-50 h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600"
                        style={{
                            width: `${Math.min(progress, 100)}%`,
                            boxShadow: `0 0 20px rgba(59, 130, 246, 0.8), 0 0 10px rgba(34, 197, 94, 0.6)`,
                            transition: 'width 0.3s ease-out'
                        }}
                    />
                )}
            </AnimatePresence>

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

                {/* Products Grid - Now uses memoized ProductCard */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 pb-20">
                    {filteredProducts.map((product, index) => (
                        <ProductCard
                            key={product.documentId || index}
                            product={product}
                            index={index}
                        />
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
