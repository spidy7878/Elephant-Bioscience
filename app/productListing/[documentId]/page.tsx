import { api } from "lib/api";
import HeroProduct from "components/products/HeroProduct";
import ProductTabs from "components/products/ProductTabs";
import { Product } from "app/types/product";
import NavigationBar from "@/components/sections/NavigationBar";

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
  // Always show NavigationBar, pass isImagesLoaded as true for SSR
  const isImagesLoaded = true;
  return (
    <>
      {/* Extra space after back button for small screens */}
      <div className="block sm:hidden h-8" />

      <NavigationBar isImagesLoaded={isImagesLoaded} />

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
