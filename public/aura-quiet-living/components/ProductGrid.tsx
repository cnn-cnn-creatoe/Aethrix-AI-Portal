
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState, useMemo } from 'react';
import { PRODUCTS } from '../constants';
import { Product } from '../types';
import ProductCard from './ProductCard';

const categories = [
  { label: '全部', value: 'All' },
  { label: '声学', value: 'Audio' },
  { label: '穿戴', value: 'Wearable' },
  { label: '数字', value: 'Mobile' },
  { label: '家居', value: 'Home' }
];

interface ProductGridProps {
  onProductClick: (product: Product) => void;
}

const ProductGrid: React.FC<ProductGridProps> = ({ onProductClick }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredProducts = useMemo(() => {
    if (activeCategory === 'All') return PRODUCTS;
    return PRODUCTS.filter(p => p.category === activeCategory);
  }, [activeCategory]);

  return (
    <section id="products" className="py-40 px-6 md:px-12 bg-[#FAF9F6]">
      <div className="max-w-[1800px] mx-auto">
        
        <div className="flex flex-col items-center text-center mb-32 space-y-10">
          <h2 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] tracking-widest">典藏系列</h2>
          
          <div className="flex flex-wrap justify-center gap-12 pt-6 border-t border-[#1A1A1A]/10 w-full max-w-3xl">
            {categories.map(cat => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={`text-xs uppercase tracking-[0.4em] pb-2 border-b transition-all duration-500 ${
                  activeCategory === cat.value 
                    ? 'border-[#1A1A1A] text-[#1A1A1A]' 
                    : 'border-transparent text-[#A8A29E] hover:text-[#1A1A1A]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-32">
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} onClick={onProductClick} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductGrid;
