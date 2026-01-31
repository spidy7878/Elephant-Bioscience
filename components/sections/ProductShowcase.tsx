"use client";

import { useState, useRef, useEffect } from "react";
import { Product } from "app/types/product";
import Image from "next/image";
import Link from "next/link"; // Kept for import but not used in blurred items

// Placeholder data matching Product interface
const PLACEHOLDER_PRODUCTS: Product[] = [
    {
        id: 1,
        documentId: "placeholder-1",
        name: "BPC-157",
        description: [],
        price: 49.99,
        quantity: "5mg",
        purity: "99%",
        aplc: "",
        storage: "-20°C",
        references: [],
        productVideo: [],
        thirdpartytesting: [],
        category: "Peptide Capsules",
        chemicalProperties: {
            id: 1,
            molecularFormula: "",
            molecularWeight: 0,
            moinostropicMass: 0,
            polarArea: 0,
            complexity: 0,
            xLogP: 0,
            atomCount: 0,
            hydrogenBondCount: 0,
            hydrogenAcceptCount: 0,
            CID: 0,
            title1: "",
            title2: "",
            title3: "",
            IUPACname: "",
        },
        coa: [],
        chemicalFormulaImg: [
            {
                id: 101,
                url: "/163360068.webp",
            },
        ],
    },
    {
        id: 2,
        documentId: "placeholder-2",
        name: "TB-500",
        description: [],
        price: 54.99,
        quantity: "5mg",
        purity: "99.5%",
        aplc: "",
        storage: "-20°C",
        references: [],
        productVideo: [],
        thirdpartytesting: [],
        category: "Peptide Blends",
        chemicalProperties: {
            id: 2,
            molecularFormula: "",
            molecularWeight: 0,
            moinostropicMass: 0,
            polarArea: 0,
            complexity: 0,
            xLogP: 0,
            atomCount: 0,
            hydrogenBondCount: 0,
            hydrogenAcceptCount: 0,
            CID: 0,
            title1: "",
            title2: "",
            title3: "",
            IUPACname: "",
        },
        coa: [],
        chemicalFormulaImg: [
            {
                id: 102,
                url: "/163360068.webp",
            },
        ],
    },
    {
        id: 3,
        documentId: "placeholder-3",
        name: "GHK-Cu",
        description: [],
        price: 39.99,
        quantity: "100mg",
        purity: "98%",
        aplc: "",
        storage: "Room Temp",
        references: [],
        productVideo: [],
        thirdpartytesting: [],
        category: "Cosmetic Peptides",
        chemicalProperties: {
            id: 3,
            molecularFormula: "",
            molecularWeight: 0,
            moinostropicMass: 0,
            polarArea: 0,
            complexity: 0,
            xLogP: 0,
            atomCount: 0,
            hydrogenBondCount: 0,
            hydrogenAcceptCount: 0,
            CID: 0,
            title1: "",
            title2: "",
            title3: "",
            IUPACname: "",
        },
        coa: [],
        chemicalFormulaImg: [
            {
                id: 103,
                url: "/163360068.webp",
            },
        ],
    },
    {
        id: 4,
        documentId: "placeholder-4",
        name: "Semaglutide",
        description: [],
        price: 119.99,
        quantity: "5mg",
        purity: "99%",
        aplc: "",
        storage: "-20°C",
        references: [],
        productVideo: [],
        thirdpartytesting: [],
        category: "IGF-1 Proteins",
        chemicalProperties: {
            id: 4,
            molecularFormula: "",
            molecularWeight: 0,
            moinostropicMass: 0,
            polarArea: 0,
            complexity: 0,
            xLogP: 0,
            atomCount: 0,
            hydrogenBondCount: 0,
            hydrogenAcceptCount: 0,
            CID: 0,
            title1: "",
            title2: "",
            title3: "",
            IUPACname: "",
        },
        coa: [],
        chemicalFormulaImg: [
            {
                id: 104,
                url: "/163360068.webp",
            },
        ],
    },
];

export default function ProductShowcase() {
    const [products] = useState<Product[]>(PLACEHOLDER_PRODUCTS);

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
        <div id="product-showcase" className="min-h-[100dvh] bg-black text-white py-12 px-4 relative overflow-hidden">

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
            <div className="relative z-20">

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
                                onClick={() => setActiveCategory(category)}
                                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-md sm:rounded transition-all duration-300 text-xs sm:text-sm ${activeCategory === category
                                        ? "bg-[#8c2224] text-white"
                                        : "bg-transparent text-white hover:bg-[#8c2224] hover:text-white"
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Products Grid with Blur Effect */}
                    <div className="relative">
                        <div
                            className="grid grid-cols-2 lg:grid-cols-4 gap-6 blur-[6px] select-none pointer-events-none opacity-60 grayscale-[30%] transition-all duration-700"
                            aria-hidden="true"
                        >
                            {filteredProducts.map((product, index) => (
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
                                                const mediaUrl = product.productVideo?.[0]?.url
                                                    ? product.productVideo[0].url.startsWith("http")
                                                        ? product.productVideo[0].url
                                                        : `${process.env.NEXT_PUBLIC_API_URL}${product.productVideo[0].url}`
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
                                                    const imageUrl =
                                                        mediaUrl ||
                                                        (product.chemicalFormulaImg?.[0]?.url
                                                            ? product.chemicalFormulaImg[0].url.startsWith("http")
                                                                ? product.chemicalFormulaImg[0].url
                                                                : `${process.env.NEXT_PUBLIC_API_URL}${product.chemicalFormulaImg[0].url}`
                                                            : "/163360068.webp");

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
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}
