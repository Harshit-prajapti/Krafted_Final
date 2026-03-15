
'use client';

import React, { useState } from 'react';
import { Heart, ChevronLeft, ChevronRight } from 'lucide-react';

interface Image {
  id: string;
  imageUrl: string;
  altText: string;
  priority: number;
}

export default function ProductImageGallery({
  images,
  productName
}: {
  images: Image[];
  productName: string;
}) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const nextImage = () => {
    setImageLoaded(false);
    setSelectedImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setImageLoaded(false);
    setSelectedImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto lg:max-w-none">
      {/* Main Image */}
      <div className="relative bg-gray-50 rounded-2xl overflow-hidden aspect-square group max-h-[500px]">
        <img
          src={images[selectedImage].imageUrl}
          alt={images[selectedImage].altText}
          className={`w-full h-full object-cover transition-all duration-700 ${imageLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
            }`}
          onLoad={() => setImageLoaded(true)}
        />

        {/* Navigation Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={prevImage}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6 text-gray-800" />
            </button>
            <button
              onClick={nextImage}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6 text-gray-800" />
            </button>
          </>
        )}

        {/* Wishlist Button */}
        <button
          onClick={() => setIsWishlisted(!isWishlisted)}
          className="absolute top-4 right-4 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110"
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart
            className={`w-6 h-6 transition-colors ${isWishlisted ? 'fill-red-500 text-red-500' : 'text-gray-800'
              }`}
          />
        </button>

        {/* Image Indicator */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                setImageLoaded(false);
                setSelectedImage(idx);
              }}
              className={`h-2 rounded-full transition-all duration-300 ${idx === selectedImage
                  ? 'w-8 bg-amber-600'
                  : 'w-2 bg-white/60 hover:bg-white'
                }`}
              aria-label={`View image ${idx + 1}`}
            />
          ))}
        </div>
      </div>

      {/* Thumbnail Images */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={img.id}
            onClick={() => {
              setImageLoaded(false);
              setSelectedImage(idx);
            }}
            className={`relative aspect-square rounded-xl overflow-hidden transition-all duration-300 ${idx === selectedImage
                ? 'ring-4 ring-amber-600 scale-95'
                : 'hover:ring-2 ring-gray-300 hover:scale-95'
              }`}
          >
            <img
              src={img.imageUrl}
              alt={img.altText}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
}