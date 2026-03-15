// ============================================
// components/product/TrustBadges.tsx (Server Component)
// ============================================

import React from 'react';
import { Truck, RotateCcw, Shield } from 'lucide-react';

export default function TrustBadges() {
  return (
    <div className="grid grid-cols-3 gap-4 pt-6">
      <div className="text-center space-y-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
        <Truck className="w-8 h-8 mx-auto text-amber-600" />
        <p className="text-sm font-semibold text-gray-900">Free Delivery</p>
        <p className="text-xs text-gray-500">On orders over $200</p>
      </div>
      <div className="text-center space-y-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
        <RotateCcw className="w-8 h-8 mx-auto text-amber-600" />
        <p className="text-sm font-semibold text-gray-900">30-Day Returns</p>
        <p className="text-xs text-gray-500">Hassle-free returns</p>
      </div>
      <div className="text-center space-y-2 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
        <Shield className="w-8 h-8 mx-auto text-amber-600" />
        <p className="text-sm font-semibold text-gray-900">2-Year Warranty</p>
        <p className="text-xs text-gray-500">Quality guaranteed</p>
      </div>
    </div>
  );
}