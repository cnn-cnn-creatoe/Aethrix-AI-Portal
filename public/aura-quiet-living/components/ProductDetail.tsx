
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';
import { Product } from '../types';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: Product) => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, onBack, onAddToCart }) => {
  return (
    <div className="pt-32 min-h-screen bg-[#FAF9F6] animate-fade-in-up">
      <div className="max-w-[1800px] mx-auto px-8 pb-32">
        
        <button 
          onClick={onBack}
          className="group flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-[#A8A29E] hover:text-[#1A1A1A] transition-all mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-2 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          返回典藏
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          <div className="w-full aspect-[4/5] bg-[#EBE7DE] overflow-hidden shadow-2xl">
            <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover scale-100 hover:scale-105 transition-transform duration-[3s]" />
          </div>

          <div className="flex flex-col max-w-xl">
             <span className="text-xs font-bold text-[#A8A29E] uppercase tracking-[0.5em] mb-4">{product.category}</span>
             <h1 className="text-5xl md:text-7xl font-serif text-[#1A1A1A] mb-6 tracking-widest">{product.name}</h1>
             <span className="text-3xl font-light text-[#1A1A1A] mb-12 tracking-wider">¥ {product.price.toLocaleString()}</span>
             
             <p className="text-[#5D5A53] leading-loose font-light text-xl mb-12 border-b border-[#1A1A1A]/5 pb-12 tracking-wide">
               {product.longDescription || product.description}
             </p>

             <div className="flex flex-col gap-8">
               <button 
                 onClick={() => onAddToCart(product)}
                 className="w-full py-6 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.5em] hover:bg-opacity-90 transition-all shadow-xl"
               >
                 加入收藏 — ¥ {product.price.toLocaleString()}
               </button>
               
               <div className="mt-8 space-y-6">
                 <h4 className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#1A1A1A]">核心特性</h4>
                 <ul className="space-y-4 text-sm text-[#5D5A53] font-light tracking-widest">
                   {product.features.map((feature, idx) => (
                     <li key={idx} className="flex items-center gap-4">
                       <span className="w-1.5 h-[1px] bg-[#1A1A1A]"></span>
                       {feature}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
