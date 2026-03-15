"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { ProductBreadcrumb } from "@/components/product/ProductBreadcrumb";
import ProductImageGallery from "@/components/product/ProductImageGallery";
import ProductInfo from "@/components/product/ProductInfo";
import ProductSpecifications from "@/components/product/ProductSpecifications";
import TrustBadges from "@/components/product/TrustBadges";
import { ProductResponse } from "@/types/product";

const fetchProduct = async (slug: string): Promise<ProductResponse> => {
  const res = await fetch(
    `/api/products/search/${slug}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error('Failed to fetch product');
  }

  const data: ProductResponse = await res.json();
  return data;
};

import { Suspense } from "react";

function ProductPageContent() {
  const searchParams = useSearchParams();
  const slug = searchParams.get('slug');

  const [product, setProduct] = useState<ProductResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setError("Product not found");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    fetchProduct(slug)
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching product:", err);
        setError("Failed to load product");
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen mt-24 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading product...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen mt-24 bg-white flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading font-bold mb-4">Product Not Found</h2>
          <p className="text-muted-foreground mb-6">{error || "The product you're looking for doesn't exist."}</p>
          <a href="/shop" className="text-gold hover:underline">
            Continue Shopping
          </a>
        </div>
      </div>
    );
  }

  // Map API response to Component props
  const productColors = product.variants
    .filter(v => v.color && v.isActive)
    .map(v => ({
      color: {
        id: v.color!.id,
        name: v.color!.name,
        hexCode: v.color!.hexCode || '#000000' // Default to black if no hex
      }
    }));

  // Filter unique colors
  const uniqueColors = productColors.filter((v, i, a) => a.findIndex(t => t.color.id === v.color.id) === i);

  return (
    <div className="min-h-screen mt-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <ProductBreadcrumb
          categories={product.categories.map(c => ({
            category: { name: c.name, slug: c.slug }
          }))}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <ProductImageGallery
            images={product.images.map(img => ({
              id: img.id,
              imageUrl: img.imageUrl,
              altText: img.altText || product.name,
              priority: img.priority,
              isPrimary: img.isPrimary
            }))}
            productName={product.name}
          />

          <div className="space-y-6">
            <ProductInfo
              name={product.name}
              price={product.basePrice}
              description={product.description}
              colors={uniqueColors}
              productId={product.id}
            />

            <ProductSpecifications
              material={product.material || "N/A"}
              dimensions={product.dimensions || "N/A"}
            />

            <TrustBadges />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ProductPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen mt-24 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gold mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    }>
      <ProductPageContent />
    </Suspense>
  );
}
