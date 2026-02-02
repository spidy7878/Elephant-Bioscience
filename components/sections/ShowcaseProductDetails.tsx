"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Product } from "app/types/product";
import HeroProduct from "../products/HeroProduct";
import ProductTabs from "../products/ProductTabs";
import ProductList from "../products/ProductList";
import ShowcaseProductVideo from "./ShowcaseProductVideo";
import { motion, AnimatePresence } from "framer-motion";

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
    const [currentProduct, setCurrentProduct] = useState<Product | null>(null);
    const showcaseRef = useRef<HTMLDivElement>(null);

    // Fetch products from API
    useEffect(() => {
        async function fetchProducts() {
            try {
                const apiUrl = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "";
                const res = await fetch(`${apiUrl}/api/products?populate=*`);
                const json = await res.json();
                const fetchedProducts = Array.isArray(json.data) ? json.data : [];
                setProducts(fetchedProducts);
                // Set first product as current
                if (fetchedProducts.length > 0) {
                    setCurrentProduct(fetchedProducts[0]);
                }
            } catch (err) {
                console.warn("Fetch error (Strapi might be down):", err);
            }
        }
        fetchProducts();
    }, []);

    const handleProductSelect = useCallback((product: Product) => {
        setCurrentProduct(product);
        // Scroll to top of showcase section
        if (showcaseRef.current) {
            showcaseRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
        }
    }, []);

    if (!currentProduct) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-white">Loading...</div>
            </div>
        );
    }

    return (
        <div
            id="product-showcase"
            ref={showcaseRef}
            className={`relative ${!isLoggedIn ? 'h-screen overflow-hidden' : 'min-h-screen'}`}
        >
            {/* Floating Product Video - Only show when logged in */}
            {isLoggedIn && <ShowcaseProductVideo product={currentProduct} containerRef={showcaseRef} />}

            {/* Full blur overlay when not logged in */}
            <div className={`relative z-20 ${!isLoggedIn ? "blur-[12px] select-none pointer-events-none opacity-60 grayscale-[30%]" : ""}`}>
                {/* Hero Product Section */}
                <div className="min-h-screen w-full">
                    <HeroProduct product={currentProduct} skipAnimation={false} hideFloatingVideo={true} />
                </div>

                {/* Product Tabs Section - Only show when logged in */}
                {isLoggedIn && (
                    <div className="w-full">
                        <ProductTabs product={currentProduct} skipAnimation={false} />
                    </div>
                )}

                {/* Product List Section - Only show when logged in */}
                {isLoggedIn && (
                    <div className="w-full px-4 py-10 mt-0">
                        <ProductList
                            showLoading={false}
                            currentProductId={currentProduct.documentId}
                            onProductSelect={handleProductSelect}
                            products={products}
                        />
                    </div>
                )}
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
