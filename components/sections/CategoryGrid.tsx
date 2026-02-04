"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Product } from "app/types/product";
import { PRODUCT_CATEGORIES } from "app/constants";

interface CategoryGridProps {
    products: Product[];
    categories: string[];
    onCategorySelect: (category: string) => void;
}

export default function CategoryGrid({ products, categories = [], onCategorySelect }: CategoryGridProps) {
    // Helper to find image for category
    const getCategoryTheme = (category: string) => {
        // 1. Filter products for this category using the logic from ProductList (simplified)
        const normalizedActiveCat = category.replace(/[-\s]+/g, "").toLowerCase();

        const categoryProducts = products.filter((product) => {
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

            // Check if ANY of the product's categories match the active category
            return productCategoryNames.some(name => {
                const normalizedProductCat = name.replace(/[-\s]+/g, "").toLowerCase();
                return normalizedProductCat === normalizedActiveCat;
            });
        });

        if (categoryProducts.length > 0) {
            // Use the first product's image
            const product = categoryProducts[0];
            const mediaUrl = product.productVideo?.[0]?.url;
            const isVideo = mediaUrl && /\.(mp4|webm|ogg|mov)$/i.test(mediaUrl);

            if (mediaUrl && !isVideo) {
                return { type: 'image', url: mediaUrl.startsWith("http") ? mediaUrl : `${process.env.NEXT_PUBLIC_API_URL}${mediaUrl}` };
            }

            const chemicalImg = product.chemicalFormulaImg?.[0]?.url;
            if (chemicalImg) {
                return { type: 'image', url: chemicalImg.startsWith("http") ? chemicalImg : `${process.env.NEXT_PUBLIC_API_URL}${chemicalImg}` };
            }
        }

        // Default Fallback
        return { type: 'none', url: '' };
    };

    // Filter out "All Peptides" for the grid view as it's redundant
    const displayCategories = categories.filter(c => c !== "All Peptides");

    return (
        <div className="w-full max-w-7xl mx-auto px-4 py-20 min-h-screen flex flex-col items-center justify-center">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-light text-white mb-16 text-center"
            >
                Explore Our Categories
            </motion.h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
                {displayCategories.map((category, index) => {
                    const theme = getCategoryTheme(category);

                    return (
                        <motion.div
                            key={category}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => onCategorySelect(category)}
                            className="group relative h-64 md:h-80 rounded-3xl overflow-hidden cursor-pointer bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 hover:scale-[1.02]"
                        >
                            {/* Background / Image */}
                            <div className="absolute inset-0 flex items-center justify-center opacity-40 group-hover:opacity-60 transition-opacity duration-500">
                                {theme.type === 'image' ? (
                                    <div className="relative w-2/3 h-2/3">
                                        <Image
                                            src={theme.url}
                                            alt={category}
                                            fill
                                            className="object-contain filter grayscale group-hover:grayscale-0 transition-all duration-500"
                                        />
                                    </div>
                                ) : (
                                    // Fallback abstract gradient or icon
                                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent" />
                                )}
                            </div>

                            {/* Text Overlay */}
                            <div className="absolute inset-0 flex flex-col items-center justify-center p-6 z-10">
                                <h3 className="text-2xl font-medium text-white group-hover:scale-110 transition-transform duration-500 tracking-wide text-center">
                                    {category}
                                </h3>
                                <div className="w-12 h-[1px] bg-white/50 mt-4 group-hover:w-24 transition-all duration-500" />
                            </div>

                            {/* Hover Glow */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                        </motion.div>
                    )
                })}
            </div>
        </div>
    );
}
