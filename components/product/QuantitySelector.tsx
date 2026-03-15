// ============================================
// components/product/QuantitySelector.tsx (Client Component)
// ============================================

'use client';

import React from 'react';

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  stockLeft
}: {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  stockLeft: number;
}) {
  return (
    <div className="space-y-3">
      <label className="text-lg font-semibold text-gray-900">Quantity</label>
      <div className="flex items-center space-x-4">
        <button
          onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
          className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-amber-600 hover:text-amber-600 transition-colors font-semibold text-xl"
          aria-label="Decrease quantity"
        >
          −
        </button>
        <span className="text-2xl font-bold text-gray-900 w-12 text-center">
          {quantity}
        </span>
        <button
          onClick={() => onQuantityChange(Math.min(stockLeft, quantity + 1))}
          className="w-12 h-12 border-2 border-gray-300 rounded-lg hover:border-amber-600 hover:text-amber-600 transition-colors font-semibold text-xl"
          aria-label="Increase quantity"
        >
          +
        </button>
        <span className="text-gray-500 ml-4">Only {stockLeft} items left in stock</span>
      </div>
    </div>
  );
}
