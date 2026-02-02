import { api } from "lib/api";
import { Product } from "app/types/product";
import ProductPageClient from "components/products/ProductPageClient";

interface Props {
  params: { documentId: string };
}

async function getProduct(documentId: string): Promise<Product | null> {
  try {
    const res = await api.get(`/api/products/${documentId}?populate=*`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch product:", error);
    return null;
  }
}

async function getAllProducts(): Promise<Product[]> {
  try {
    const res = await api.get(`/api/products?populate=*`);
    return Array.isArray(res.data.data) ? res.data.data : [];
  } catch (error) {
    console.error("Failed to fetch all products:", error);
    return [];
  }
}

export default async function Page({ params }: Props) {
  const { documentId } = await params;

  // Fetch current product and all products in parallel
  const [product, products] = await Promise.all([
    getProduct(documentId),
    getAllProducts(),
  ]);

  if (!product) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center bg-[#dedada]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">
            Product not found
          </h1>
          <p className="text-gray-600 mt-2">
            The product you are looking for does not exist or has been removed.
          </p>
        </div>
      </div>
    );
  }

  return <ProductPageClient initialProduct={product} products={products} />;
}
