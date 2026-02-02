"use client";

import { useState, useCallback, useRef } from "react";
import { Product } from "app/types/product";
import HeroProduct from "./HeroProduct"; // Ensure this is a default export
import ProductTabs from "./ProductTabs"; // Ensure this is a default export
import ProductList from "./ProductList"; // Ensure this is a default export
import NavigationBar from "@/components/sections/NavigationBar";

interface ProductPageClientProps {
    initialProduct: Product;
    products: Product[];
}

export default function ProductPageClient({
    initialProduct,
    products,
}: ProductPageClientProps) {
    const [currentProduct, setCurrentProduct] = useState<Product>(initialProduct);
    const hasInteracted = useRef(false); // Track if user has switched products

    const handleProductSelect = useCallback(
        (product: Product) => {
            // Mark that user has interacted (switched products)
            hasInteracted.current = true;

            // Update the current product state
            setCurrentProduct(product);

            // Update URL without triggering Next.js routing (pure browser history update)
            window.history.replaceState(null, '', `/productListing/${product.documentId}`);

            // Smooth scroll to top
            window.scrollTo({ top: 0, behavior: "smooth" });
        },
        []
    );


    return (
        <>
            {/* Extra space after back button for small screens */}
            <div className="block sm:hidden h-8" />

            <NavigationBar isImagesLoaded={true} />

            <div className="mt-2 sm:mt-8" style={{ height: "20px" }} />

            {/* Background Video */}
            <video
                className="fixed top-0 left-0 w-full h-full object-cover z-0"
                src="/videos/movement.mp4"
                autoPlay
                loop
                muted
                playsInline
                style={{ pointerEvents: "none" }}
            />
            {/* Responsive overlay for readability */}
            <div className="fixed top-0 left-0 w-full h-full z-10 pointer-events-none" />

            <div className="relative z-20">
                <section className="relative w-full min-h-[100dvh] flex flex-col">
                    {/* Hero Section */}
                    <div className="snap-start w-full min-h-[50vh] md:min-h-[60vh] flex items-center justify-center px-2 sm:px-4 md:px-8">
                        <HeroProduct
                            product={currentProduct}
                            skipAnimation={hasInteracted.current}
                        />
                    </div>

                    {/* Tabs Section */}
                    <div className="snap-start w-full flex-1 px-2 sm:px-4 md:px-8">
                        <ProductTabs
                            product={currentProduct}
                            skipAnimation={hasInteracted.current}
                        />
                    </div>

                    {/* More Products Section */}
                    <div className="w-full px-4 py-20 mt-10">
                        <ProductList
                            showLoading={false}
                            currentProductId={currentProduct.documentId}
                            onProductSelect={handleProductSelect}
                            products={products}
                        />
                    </div>
                </section>
            </div>
        </>
    );
}
