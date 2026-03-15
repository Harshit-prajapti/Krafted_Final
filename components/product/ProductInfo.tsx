'use client';

import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import ColorSelector from './ColorSelector';
import QuantitySelector from './QuantitySelector';
import ProductRating from './ProductRating';
import LimitedTimeOffer from './LimitedTimeOffer';
import axios from 'axios';

interface Color {
  color: {
    id: string;
    name: string;
    hexCode: string;
  };
}

import { useTranslation } from 'react-i18next'

export default function ProductInfo({
  name,
  price,
  description,
  colors,
  productId
}: {
  name: string;
  price: string;
  description: string;
  colors: Color[];
  productId: string;
}) {
  const { t } = useTranslation('product')
  const { t: tCommon } = useTranslation('common')
  const [selectedColor, setSelectedColor] = useState(colors[0]?.color || null);
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);
  const [isAdding, setIsAdding] = useState(false);


  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);

    try {
      console.log('Adding to cart:', { productId, selectedColor, quantity });

      const res = await axios.post('/api/cart', {
        productId,
        selectedColor,
        quantity,
      });
      console.log(res.data);
      console.log('Added to cart:', { productId, selectedColor, quantity });
      setAddedToCart(true);
      setTimeout(() => setAddedToCart(false), 2000);
    } catch (error) {
      console.error('Failed to add to cart', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleBuyNow = () => {
    console.log('Buy now:', { productId, selectedColor, quantity });
  };

  const originalPrice = (parseFloat(price) * 1.3).toFixed(2);
  const discount = Math.round(((parseFloat(originalPrice) - parseFloat(price)) / parseFloat(originalPrice)) * 100);

  return (
    <div className="space-y-5">
      {/* Title and Price */}
      <div className="space-y-3">
        <h1 className="text-xl md:text-2xl font-heading font-bold text-gray-900 luxury-product-name leading-tight">
          {name}
        </h1>
        <div className="flex items-baseline gap-3 flex-wrap">
          <span className="text-3xl md:text-4xl font-heading font-bold luxury-price tracking-wide">
            ₹{parseFloat(price).toLocaleString('en-IN')}
          </span>
          <span className="text-base text-gray-400 line-through font-light">
            ₹{parseFloat(originalPrice).toLocaleString('en-IN')}
          </span>
          <span className="px-3 py-1 bg-gold/10 text-gold-dark text-xs font-bold rounded-full border border-gold/20 tracking-wide uppercase">
            {discount}% {tCommon('labels.discount', 'OFF')}
          </span>
        </div>
      </div>

      {/* Limited Time Offer & Stock - Moved to top for visibility */}
      <LimitedTimeOffer stockLeft={12} />

      <ProductRating />

      {/* Description */}
      <p className="text-gray-600 leading-relaxed text-sm md:text-base line-clamp-3">
        {description}
      </p>

      <ColorSelector
        colors={colors}
        selectedColor={selectedColor}
        onColorChange={setSelectedColor}
      />
      <QuantitySelector
        quantity={quantity}
        onQuantityChange={setQuantity}
        stockLeft={12}
      />

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2">
        <button
          onClick={handleAddToCart}
          disabled={isAdding}
          className={`flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl text-sm md:text-base transition-all duration-300 group ${isAdding
              ? 'bg-gray-100 border-2 border-gray-200 text-gray-400 cursor-not-allowed'
              : addedToCart
                ? 'bg-green-600 text-white border-2 border-green-600 font-semibold'
                : 'btn-luxury-outline rounded-xl'
            }`}
        >
          {isAdding ? (
            <div className="h-5 w-5 border-2 border-gold border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <ShoppingCart className={`w-5 h-5 transition-transform ${!addedToCart && 'group-hover:scale-110'}`} />
              <span>{addedToCart ? tCommon('messages.itemAddedToCart', 'Added!') : tCommon('buttons.addToCart', 'Add to Cart')}</span>
            </>
          )}
        </button>
        <button
          onClick={handleBuyNow}
          className="flex-1 btn-luxury-black py-3.5 px-4 rounded-xl text-sm md:text-base"
        >
          {tCommon('buttons.buyNow', 'Buy Now')}
        </button>
      </div>
    </div>
  );
}