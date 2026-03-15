// ============================================
// components/product/ColorSelector.tsx (Client Component)
// ============================================

'use client';

import React from 'react';

interface Color {
  id: string;
  name: string;
  hexCode: string;
}

interface ColorData {
  color: Color;
}

export default function ColorSelector({
  colors,
  selectedColor,
  onColorChange
}: {
  colors: ColorData[];
  selectedColor: Color | null;
  onColorChange: (color: Color) => void;
}) {
  return (
    <div className="space-y-3">
      <label className="text-lg font-semibold text-gray-900">
        Select Color: <span className="text-amber-600">{selectedColor?.name}</span>
      </label>
      
      <div className="flex space-x-3 mt-4">
        {colors.map(({ color }) => (
          <button
            key={color.id}
            onClick={() => onColorChange(color)}
            className={`relative w-14 h-14 rounded-full transition-all duration-300 hover:scale-110 ${
              selectedColor?.id === color.id
                ? 'ring-4 ring-amber-600 ring-offset-2 scale-95'
                : 'ring-2 ring-gray-300'
            }`}
            style={{ backgroundColor: color.hexCode }}
            title={color.name}
            aria-label={`Select ${color.name} color`}
          >
            {selectedColor?.id === color.id && (
              <div className="absolute inset-0 flex items-center justify-center">
                <svg
                  className="w-6 h-6 text-white drop-shadow-lg"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={3}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
