import { api } from "lib/api";
import HeroProduct from "components/products/HeroProduct";
import ProductTabs from "components/products/ProductTabs";
import { Product } from "app/types/product";
import { a, div, video } from "framer-motion/client";
import src from "gsap/src";
import style from "styled-jsx/style";

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

export default async function Page({ params }: Props) {
  const { documentId } = await params;
  const product = await getProduct(documentId);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#dedada]">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Product not found</h1>
          <p className="text-gray-600 mt-2">The product you are looking for does not exist or has been removed.</p>
        </div>
      </div>
    );
  }
  return (
    <>
      {/* Back Button */}
      <div className="fixed top-6 left-6 z-30">
        <a
          href="/products"
          className="relative flex items-center justify-center rounded-full font-semibold text-white text-xl shadow-lg backdrop-blur-lg border border-white/10 transition-all duration-300 hover:shadow-2xl group"
          style={{
            width: "3.6rem",
            height: "2.1rem",
            borderRadius: "999px",
            background: "rgba(255,255,255,0.08)",
            WebkitBackdropFilter: "blur(10px)",
            backdropFilter: "blur(10px)",
          }}
        >
          {/* Glass shimmer effect on hover */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none rounded-full"
            style={{
              background:
                "linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, transparent 50%, rgba(255, 255, 255, 0.05) 100%)",
              borderRadius: "999px",
            }}
          />
          <span className="relative z-10 flex items-center justify-center w-full h-full text-black text-base">
            &#8592;
          </span>
        </a>
      </div>
      {/* Extra space after back button for small screens */}
      <div className="block sm:hidden h-8" />
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
        <section className="relative w-full min-h-screen flex flex-col">
          {/* Hero Section */}
          <div className="snap-start w-full min-h-[60vh] md:min-h-[80vh] flex items-center justify-center px-2 sm:px-4 md:px-8">
            <HeroProduct product={product} />
          </div>

          {/* Tabs Section */}
          <div className="snap-start w-full flex-1 px-2 sm:px-4 md:px-8">
            <ProductTabs product={product} />
          </div>

          {/* Overlay strip with background */}
          {/* <div className="absolute bottom-0 right-0 w-full h-[56px] overflow-hidden">
            <div className="absolute right-6 bottom-[-18px]">
              <span
                className="inline-block text-2xl sm:text-3xl lg:text-4xl 
                     font-extrabold tracking-[0.15em] 
                     text-gray-900 opacity-70 
                     scale-x-[-1]"
              >
                {product.name}
              </span>
            </div>
          </div> */}
        </section>
      </div>
    </>
  );
}
