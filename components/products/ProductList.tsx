"use client";
import { useState, useRef, useEffect } from "react";
import { Product } from "app/types/product";
import Link from "next/link";
import Image from "next/image";
import { AnimatePresence } from "framer-motion";
import LoadingSection from "components/sections/LoadingSection";
import Pagination from "components/ui/Pagination";

const ITEMS_PER_PAGE = 25;

interface ProductListProps {
    showLoading?: boolean;
    currentProductId?: string;
    onProductSelect?: (product: Product) => void;
    products?: Product[];
}

export default function ProductList({
    showLoading = true,
    currentProductId,
    onProductSelect,
    products: providedProducts,
}: ProductListProps) {
    const [products, setProducts] = useState<Product[]>(providedProducts || []);
    const [loading, setLoading] = useState(true);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    const [categories, setCategories] = useState<string[]>(["All Peptides"]);
    const [activeCategory, setActiveCategory] = useState("All Peptides");
    const [currentPage, setCurrentPage] = useState(1);
    const [dataReady, setDataReady] = useState(false);

    useEffect(() => {
        // Skip fetch if products were provided via props, BUT still fetch categories if needed
        // For simplicity, let's just fetch everything if we need to.

        async function fetchData() {
            try {
                // If providedProducts exist, we might skip product fetch, but we still need categories.
                // However, to keep it simple and robust, let's fetch categories separately if logic allows,
                // or just do parallel fetch if we are in "fetch everything" mode.

                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

                const promises: Promise<Response>[] = [
                    fetch(`${apiUrl}/api/categories`)
                ];

                // If no provided products, fetch them too
                const shouldFetchProducts = !providedProducts || providedProducts.length === 0;
                if (shouldFetchProducts) {
                    promises.push(fetch(`${apiUrl}/api/products?populate[0]=productVideo&populate[1]=productVideoSafari&populate[2]=chemicalFormulaImg&populate[3]=category&pagination[pageSize]=500`));
                }

                const results = await Promise.all(promises);
                const catJson = await results[0].json();

                // Categories
                if (catJson.data && Array.isArray(catJson.data)) {
                    const fetchedNames = catJson.data.map((c: any) =>
                        c.name || c.attributes?.name || ""
                    ).filter(Boolean);
                    setCategories(["All Peptides", ...Array.from(new Set(fetchedNames)) as string[]]);
                }

                // Products
                if (shouldFetchProducts && results[1]) {
                    const prodJson = await results[1].json();
                    setProducts(Array.isArray(prodJson.data) ? prodJson.data : []);
                } else if (providedProducts) {
                    setProducts(providedProducts);
                }

            } catch (err) {
                console.error("Fetch error:", err);
            } finally {
                setDataReady(true);
            }
        }

        fetchData();
    }, [providedProducts]);

    // Detect mobile on mount
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 640);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Sync progress bar with data loading
    useEffect(() => {
        let progressInterval: NodeJS.Timeout | undefined;

        if (loading && showLoading && !dataReady) {
            progressInterval = setInterval(() => {
                setLoadingProgress((prev) => {
                    // If data isn't ready, cap at 90%
                    return prev >= 0.9 ? 0.9 : prev + 0.05;
                });
            }, 100);
        }

        if (loading && showLoading && dataReady) {
            setLoadingProgress(1);
            requestAnimationFrame(() => setLoading(false));
        } else if (!showLoading && dataReady) {
            setLoading(false);
        }

        return () => {
            if (progressInterval) clearInterval(progressInterval);
        };
    }, [loading, dataReady, showLoading]);

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
    let filteredProducts = products.filter((product) => {
        if (activeCategory === "All Peptides") return true;

        // Enhanced category resolution with array support
        let rawCategory = (product as any).catorgory || (product as any).category;

        if (!rawCategory) {
            const catKey = Object.keys(product).find((k) =>
                k.toLowerCase().includes("categor")
            );
            if (catKey) rawCategory = (product as any)[catKey];
        }

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

        const normalizedActiveCat = activeCategory.replace(/[-\s]+/g, "").toLowerCase();

        // Check if ANY of the product's categories match the active category
        return productCategoryNames.some(name => {
            const normalizedProductCat = name.replace(/[-\s]+/g, "").toLowerCase();
            return normalizedProductCat === normalizedActiveCat;
        });
    });

    // Reorder: Place current product at 1st position on mobile, 4th position on desktop
    if (currentProductId) {
        let currentProductIndex = filteredProducts.findIndex(p => p.documentId === currentProductId);
        let currentProduct: Product | undefined;

        if (currentProductIndex !== -1) {
            // Found in filtered list - remove it to reinsert
            [currentProduct] = filteredProducts.splice(currentProductIndex, 1);
        } else {
            // Not in filtered list - find in full list
            currentProduct = products.find(p => p.documentId === currentProductId);
        }

        if (currentProduct) {
            // Insert at index 1 for mobile (2nd position - right side), index 3 for desktop (4th position)
            const targetIndex = isMobile ? 1 : 3;
            // Ensure we don't go out of bounds if list is short
            const safeIndex = Math.min(targetIndex, filteredProducts.length);
            filteredProducts.splice(safeIndex, 0, currentProduct);
        }
    }

    // Pagination Logic
    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    // Reset page when category changes
    useEffect(() => {
        setCurrentPage(1);
    }, [activeCategory]);

    return (
        <div className="w-full">
            <AnimatePresence>
                {loading && showLoading && <LoadingSection loadingProgress={loadingProgress} percentagePosition="above" />}
            </AnimatePresence>

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
                                setCurrentPage(1);
                                // Optional: Update URL? Maybe check if we are on the products page
                                // For now, let's keep it simple and just update state
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

                {/* Products Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                    {paginatedProducts.map((product, index) => {
                        // Check if this product is the current one
                        const isCurrent = product.documentId === currentProductId;

                        const cardClasses = "group relative rounded-3xl overflow-hidden transition-all duration-500 hover:scale-105 block aspect-square cursor-pointer";
                        const cardStyles = {
                            background: "rgba(255, 255, 255, 0.03)",
                            backdropFilter: "blur(10px)",
                            boxShadow: "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
                            textDecoration: "none",
                            color: "inherit",
                        };

                        const cardContent = (
                            <>
                                {/* Glass shimmer effect on hover */}
                                <div
                                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                                    style={{
                                        background:
                                            "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)",
                                    }}
                                />

                                {/* Product Media - Hide if current product */}
                                {!isCurrent && (
                                    <div className="absolute inset-0 flex items-center justify-center p-4 pb-20 pointer-events-none">
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
                                                const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

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
                                                            poster={fallbackUrl || undefined}
                                                            style={{
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "contain",
                                                                display: "block",
                                                                willChange: "transform",
                                                                pointerEvents: "none",
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
                                                            className="object-contain pointer-events-none"
                                                        />
                                                    );
                                                }
                                                return null;
                                            })()}
                                        </div>
                                    </div>
                                )}

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
                            </>
                        );

                        // If onProductSelect is provided, render a clickable div
                        if (onProductSelect) {
                            return (
                                <div
                                    key={product.documentId || index}
                                    id={isCurrent ? "target-product-card" : undefined}
                                    onClick={() => onProductSelect(product)}
                                    className={cardClasses}
                                    style={cardStyles}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter' || e.key === ' ') {
                                            onProductSelect(product);
                                        }
                                    }}
                                >
                                    {cardContent}
                                </div>
                            );
                        }

                        // Otherwise, render the original Link
                        return (
                            <Link
                                key={product.documentId || index}
                                id={isCurrent ? "target-product-card" : undefined}
                                href={`/productListing/${product.documentId}`}
                                prefetch={true}
                                className={cardClasses}
                                style={cardStyles}
                            >
                                {cardContent}
                            </Link>
                        );
                    })}
                </div>

                {/* Pagination Controls */}
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={(page) => {
                        setCurrentPage(page);
                        // Scroll up slightly? Usually not needed if grid is small, 
                        // but let's scroll to top of list for UX
                        categoryRowRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }}
                />
            </div>
        </div>
    );
}
