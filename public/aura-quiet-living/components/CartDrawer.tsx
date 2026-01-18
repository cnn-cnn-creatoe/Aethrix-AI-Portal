
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { Product } from '../types';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  items: Product[];
  onRemoveItem: (index: number) => void;
  onCheckout: () => void;
}

const CartDrawer: React.FC<CartDrawerProps> = ({ isOpen, onClose, items, onRemoveItem, onCheckout }) => {
  const total = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <>
      <div 
        className={`fixed inset-0 bg-[#1A1A1A]/20 backdrop-blur-md z-[60] transition-opacity duration-1000 ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      <div 
        className={`fixed inset-y-0 right-0 w-full md:w-[500px] bg-[#FAF9F6] z-[70] transform transition-transform duration-1000 ease-in-out border-l border-[#1A1A1A]/5 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between p-10 border-b border-[#1A1A1A]/5">
          <h2 className="text-2xl font-serif text-[#1A1A1A] tracking-widest">购物车 ({items.length})</h2>
          <button onClick={onClose} className="text-[#A8A29E] hover:text-[#1A1A1A]">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-8 h-8">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-10 space-y-12">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6 opacity-30">
              <p className="font-light tracking-widest">您的收藏盒空无一物。</p>
            </div>
          ) : (
            items.map((item, idx) => (
              <div key={`${item.id}-${idx}`} className="flex gap-8 animate-fade-in-up">
                <div className="w-24 h-32 bg-[#EBE7DE] flex-shrink-0">
                  <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale" />
                </div>
                <div className="flex-1 flex flex-col justify-between py-2">
                  <div>
                    <div className="flex justify-between items-start">
                        <h3 className="font-serif text-xl text-[#1A1A1A] tracking-wider">{item.name}</h3>
                        <span className="text-sm font-light">¥{item.price}</span>
                    </div>
                    <p className="text-[10px] text-[#A8A29E] uppercase tracking-[0.3em] mt-2">{item.category}</p>
                  </div>
                  <button onClick={() => onRemoveItem(idx)} className="text-[10px] text-[#A8A29E] hover:text-[#1A1A1A] self-start border-b border-transparent hover:border-[#1A1A1A] transition-all">
                    移除
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="p-10 border-t border-[#1A1A1A]/5">
          <div className="flex justify-between items-center mb-10">
            <span className="text-xs font-bold uppercase tracking-[0.4em] text-[#5D5A53]">总计</span>
            <span className="text-2xl font-serif text-[#1A1A1A]">¥{total.toLocaleString()}</span>
          </div>
          <button 
            onClick={onCheckout}
            disabled={items.length === 0}
            className="w-full py-6 bg-[#1A1A1A] text-white text-xs font-bold uppercase tracking-[0.5em] hover:bg-opacity-90 disabled:opacity-20 transition-all"
          >
            前往结算
          </button>
        </div>
      </div>
    </>
  );
};

export default CartDrawer;
