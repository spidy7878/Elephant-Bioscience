import { api } from "lib/api";
import HeroProduct from "components/products/HeroProduct";
import ProductTabs from "components/products/ProductTabs";
import { Product } from "app/types/product";

interface Props {
  params: { documentId: string };
}

async function getProduct(documentId: string): Promise<Product> {
  const res = await api.get(`/api/products/${documentId}?populate=*`);
  return res.data.data;
}

export default async function Page({ params }: Props) {
  const product = await getProduct(params.documentId);

  return (
    <section className="relative w-full min-h-screen bg-[#dedada]">
      {/* Hero Section */}
      <div className="snap-start h-screen w-full">
        <HeroProduct product={product} />
      </div>

      {/* Tabs Section */}
      <div className="snap-start min-h-screen w-full">
        <ProductTabs product={product} />
      </div>

      {/* Overlay strip with background */}
      <div className="absolute bottom-0 right-0 w-full bg-[#dedada] h-[56px] overflow-hidden">
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
      </div>
    </section>
  );
}
