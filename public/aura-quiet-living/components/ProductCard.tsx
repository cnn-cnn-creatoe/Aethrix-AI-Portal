
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onClick: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onClick }) => {
  return (
    <div className="group flex flex-col gap-10 cursor-pointer" onClick={() => onClick(product)}>
      <div className="relative w-full aspect-[4/5] overflow-hidden bg-[#EBE7DE] shadow-sm group-hover:shadow-2xl transition-all duration-1000">
        <img 
          src={product.imageUrl} 
          alt={product.name} 
          className="w-full h-full object-cover transition-transform duration-[2s] ease-out group-hover:scale-105"
        />
        
        <div className="absolute inset-0 bg-[#1A1A1A]/0 group-hover:bg-[#1A1A1A]/10 transition-colors duration-1000 flex items-center justify-center">
            <div className="opacity-0 group-hover:opacity-100 transition-all duration-1000 translate-y-6 group-hover:translate-y-0">
                <span className="bg-white text-[#1A1A1A] px-8 py-4 text-[10px] uppercase tracking-[0.4em] font-bold">
                    品鉴详情
                </span>
            </div>
        </div>
      </div>
      
      <div className="text-center">
        <h3 className="text-3xl font-serif text-[#1A1A1A] mb-3 group-hover:opacity-60 transition-opacity tracking-widest">{product.name}</h3>
        <p className="text-xs font-light text-[#A8A29E] mb-4 tracking-[0.3em] uppercase">{product.tagline}</p>
        <span className="text-sm font-light text-[#1A1A1A] block tracking-widest">¥ {product.price.toLocaleString()}</span>
      </div>
    </div>
  );
};

export default ProductCard;
