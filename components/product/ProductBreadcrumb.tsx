
import React from 'react';

interface Category {
  category: {
    name: string;
    slug: string;
  };
}

export function ProductBreadcrumb({ categories, productName }: { categories: Category[], productName?: string }) {
  return (
    <div className="flex items-center space-x-2 text-sm text-gray-500">
      <span className="hover:text-amber-600 cursor-pointer transition-colors">Home</span>
      <span>/</span>
      {categories?.map((cat, idx) => (
        <React.Fragment key={idx}>
          <span className="hover:text-amber-600 cursor-pointer transition-colors">
            {cat.category.name}
          </span>
          <span>/</span>
        </React.Fragment>
      ))}
      <span className="font-medium text-gray-900 line-clamp-1">{productName}</span>
    </div>
  );
}

// ============================================
// components/product/ProductImageGallery.tsx (Client Component)
// ============================================


