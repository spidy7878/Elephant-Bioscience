"use client";
import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import { Product } from "app/types/product";

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "https://appetizing-cabbage-e4ead111c1.strapiapp.com").replace(/\/$/, "");
const CACHE_KEY = "elephant_products_cache";
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

interface CachedData {
    data: Product[];
    timestamp: number;
}

interface ProductsContextType {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    refetch: () => Promise<void>;
}

const ProductsContext = createContext<ProductsContextType | null>(null);

// Helper to get cached products from localStorage
function getCachedProducts(): Product[] | null {
    if (typeof window === "undefined") return null;

    try {
        const cached = localStorage.getItem(CACHE_KEY);
        if (cached) {
            const { data, timestamp }: CachedData = JSON.parse(cached);
            // Check if cache is still valid
            if (Date.now() - timestamp < CACHE_TTL) {
                return data;
            }
        }
    } catch {
        // Ignore cache errors
    }
    return null;
}

// Helper to set cached products in localStorage
function setCachedProducts(products: Product[]): void {
    if (typeof window === "undefined") return;

    try {
        const cacheData: CachedData = {
            data: products,
            timestamp: Date.now(),
        };
        localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    } catch {
        // Ignore cache errors (e.g., localStorage full)
    }
}

interface ProductsProviderProps {
    children: ReactNode;
    initialProducts?: Product[];
}

export function ProductsProvider({ children, initialProducts }: ProductsProviderProps) {
    // Initialize with cached products or initialProducts
    const [products, setProducts] = useState<Product[]>(() => {
        // If server passed initial products, use those
        if (initialProducts && initialProducts.length > 0) {
            return initialProducts;
        }
        // Otherwise try to use cached products
        return getCachedProducts() || [];
    });

    const [isLoading, setIsLoading] = useState(() => {
        // Only loading if we don't have any products
        const cached = getCachedProducts();
        return !initialProducts?.length && !cached?.length;
    });

    const [error, setError] = useState<string | null>(null);

    const fetchProducts = useCallback(async (force = false) => {
        // Skip fetch if we already have products and not forcing refresh
        if (!force && products.length > 0) {
            return;
        }

        // Check cache first (unless forcing refresh)
        if (!force) {
            const cached = getCachedProducts();
            if (cached && cached.length > 0) {
                setProducts(cached);
                setIsLoading(false);
                return;
            }
        }

        setIsLoading(true);
        setError(null);

        try {
            const res = await fetch(`${API_URL}/api/products?populate=*`);
            if (!res.ok) {
                throw new Error(`HTTP error! status: ${res.status}`);
            }
            const json = await res.json();
            const fetchedProducts = Array.isArray(json.data) ? json.data : [];

            setProducts(fetchedProducts);
            setCachedProducts(fetchedProducts);
        } catch (err) {
            console.error("Products fetch error:", err);
            setError(err instanceof Error ? err.message : "Failed to fetch products");
        } finally {
            setIsLoading(false);
        }
    }, [products.length]);

    // Fetch products on mount if not already loaded
    useEffect(() => {
        if (products.length === 0) {
            fetchProducts();
        } else if (initialProducts && initialProducts.length > 0) {
            // Update cache with server-provided products
            setCachedProducts(initialProducts);
        }
    }, []); // Only run once on mount

    const refetch = useCallback(async () => {
        await fetchProducts(true);
    }, [fetchProducts]);

    return (
        <ProductsContext.Provider value={{ products, isLoading, error, refetch }}>
            {children}
        </ProductsContext.Provider>
    );
}

export function useProducts(): ProductsContextType {
    const context = useContext(ProductsContext);
    if (!context) {
        throw new Error("useProducts must be used within a ProductsProvider");
    }
    return context;
}

// Export for components that need to check if context exists
export function useProductsOptional(): ProductsContextType | null {
    return useContext(ProductsContext);
}
