import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, ExternalLink, ShoppingCart } from 'lucide-react';

const ProductCarousel = ({ products }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);

  if (!products?.length) return null;

  const currentProduct = products[currentIndex];

  const handleNext = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev === products.length - 1 ? 0 : prev + 1);
  };

  const handlePrev = () => {
    setIsTransitioning(true);
    setCurrentIndex(prev => prev === 0 ? products.length - 1 : prev - 1);
  };

  return (
    <div className="relative flex items-center justify-center w-full max-w-2xl mx-auto">
      {/* Left Arrow */}
      {products.length > 1 && (
        <button
          onClick={handlePrev}
          className="absolute -left-4 z-10 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white hover:shadow-lg transition-all"
          aria-label="Previous product"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}

      {/* Main Content */}
      <div className="bg-white rounded-lg shadow-lg p-4 my-4 w-full mx-8">
        <div className="flex space-x-4">
          {/* Image Container */}
          <div className="relative w-48 h-48 overflow-hidden rounded-lg bg-gray-50">
            <img
              src={currentProduct.image_url}
              alt={currentProduct.name}
              className={`w-full h-full object-contain transition-opacity duration-300 ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
              loading="lazy"
              onLoad={() => setIsTransitioning(false)}
              onError={(e) => {
                e.target.src = 'https://placehold.co/400x400?text=No+Image';
              }}
            />
          </div>

          {/* Product Info and Buttons */}
          <div className="flex-1 flex flex-col justify-between">
            {/* Product Name and Price */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
                {currentProduct.name}
              </h3>
              {/*<p className="text-sm text-gray-500 mt-0.5">{currentProduct.category}</p>*/}
              <span className="text-xl font-bold text-green-600 mt-1 block">{currentProduct.price}</span>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => window.open(currentProduct.url, '_blank')}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm"
              >
                <ExternalLink className="w-4 h-4" />
                დეტალები
              </button>

              <button
                className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-3 py-2 rounded-lg hover:bg-green-700 transition-colors text-sm"
              >
                <ShoppingCart className="w-4 h-4" />
                დამატება
              </button>
            </div>
          </div>
        </div>

        {products.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-3">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${
                  index === currentIndex 
                    ? 'bg-blue-600 w-3' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to product ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>

      {products.length > 1 && (
        <button
          onClick={handleNext}
          className="absolute -right-4 z-10 bg-white/90 text-gray-800 p-2 rounded-full hover:bg-white hover:shadow-lg transition-all"
          aria-label="Next product"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
};

export default ProductCarousel;