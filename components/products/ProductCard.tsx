"use client";
import { Product } from "app/types/product";
import Link from "next/link";

interface ProductCardProps {
  product: Product;
}
const ProductCard = ({ product }: ProductCardProps) => {
  const videoUrl =
    product?.productVideo?.length && product.productVideo[0]?.url
      ? `${process.env.NEXT_PUBLIC_API_URL}${product.productVideo[0].url}`
      : null;

  return (
    <div className="bg-white rounded-xl shadow p-6 flex flex-col">
      {videoUrl && (
        <video
          src={videoUrl}
          controls={false}
          autoPlay={false}
          loop
          muted
          className="w-full rounded-lg"
        />
      )}

      <h2 className="text-xl font-bold">{product.name}</h2>

      <p className="text-gray-600 line-clamp-2">
        {product.description?.[0]?.children?.[0]?.text}
      </p>

      <div className="mt-auto flex justify-between items-center">
        <span className="text-xl text-red-500 font-semibold">
          ${product.price}
        </span>

        <Link href={`/productListing/${product.documentId}`}>
          <button className="px-4 py-2 bg-gradient-to-r from-pink-500 to-yellow-400 rounded-lg text-white">
            View Product
          </button>
        </Link>
      </div>
    </div>
  );
};

export default ProductCard;
