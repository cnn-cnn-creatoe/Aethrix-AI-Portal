
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { Product } from '../types';

interface CheckoutProps {
  items: Product[];
  onBack: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ items, onBack }) => {
  const subtotal = items.reduce((sum, item) => sum + item.price, 0);
  const shipping = 0; // 免费配送
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen pt-24 pb-24 px-6 bg-[#FAF9F6] animate-fade-in-up">
      <div className="max-w-6xl mx-auto">
        <button 
          onClick={onBack}
          className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#A8A29E] hover:text-[#1A1A1A] transition-all mb-12"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          返回商店
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">
          
          {/* 左侧：表单 */}
          <div>
            <h1 className="text-4xl font-serif text-[#1A1A1A] mb-4 tracking-widest">结账结算</h1>
            <p className="text-sm text-[#5D5A53] mb-12 font-light">此页面仅供演示。支付功能暂未开启。</p>
            
            <div className="space-y-12">
              {/* 联系信息 */}
              <div>
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 tracking-wider">联系信息</h2>
                <div className="space-y-4">
                   <input type="email" placeholder="电子邮箱地址" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                   <div className="flex items-center gap-2">
                     <input type="checkbox" id="newsletter" className="accent-[#1A1A1A] cursor-not-allowed" disabled />
                     <label htmlFor="newsletter" className="text-sm text-[#5D5A53] cursor-not-allowed font-light">订阅我们的灵感周刊与新品资讯</label>
                   </div>
                </div>
              </div>

              {/* 配送信息 */}
              <div>
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 tracking-wider">配送地址</h2>
                <div className="space-y-4">
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="姓氏" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                      <input type="text" placeholder="名字" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                   </div>
                   <input type="text" placeholder="详细地址" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                   <input type="text" placeholder="公寓、套房等（可选）" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="城市" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                      <input type="text" placeholder="邮政编码" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                   </div>
                </div>
              </div>

               {/* 支付（模拟） */}
              <div>
                <h2 className="text-xl font-serif text-[#1A1A1A] mb-6 tracking-wider">支付方式</h2>
                <div className="p-8 border border-[#1A1A1A]/5 bg-white/50 space-y-4">
                   <p className="text-sm text-[#5D5A53] mb-2 font-light">所有交易均已加密且安全。</p>
                   <input type="text" placeholder="卡号" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                   <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="有效期 (月/年)" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                      <input type="text" placeholder="安全码" className="w-full bg-transparent border-b border-[#1A1A1A]/10 py-3 text-[#1A1A1A] placeholder-[#A8A29E] outline-none focus:border-[#1A1A1A] transition-colors cursor-not-allowed" disabled />
                   </div>
                </div>
              </div>

              <div>
                <button 
                    disabled
                    className="w-full py-6 bg-[#A8A29E] text-white uppercase tracking-[0.5em] text-[10px] font-bold cursor-not-allowed opacity-50"
                >
                    立即支付 — ¥ {total.toLocaleString()}
                </button>
              </div>
            </div>
          </div>

          {/* 右侧：订单摘要 */}
          <div className="lg:pl-12 lg:border-l border-[#1A1A1A]/5">
            <h2 className="text-xl font-serif text-[#1A1A1A] mb-8 tracking-wider">订单摘要</h2>
            
            <div className="space-y-8 mb-8">
               {items.map((item, idx) => (
                 <div key={idx} className="flex gap-6">
                    <div className="w-16 h-20 bg-[#EBE7DE] relative overflow-hidden">
                       <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover grayscale" />
                       <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#1A1A1A] text-white text-[8px] flex items-center justify-center rounded-full">1</span>
                    </div>
                    <div className="flex-1">
                       <h3 className="font-serif text-[#1A1A1A] text-base tracking-wider">{item.name}</h3>
                       <p className="text-[10px] text-[#A8A29E] uppercase tracking-[0.2em]">{item.category}</p>
                    </div>
                    <span className="text-sm font-light text-[#5D5A53]">¥{item.price.toLocaleString()}</span>
                 </div>
               ))}
            </div>

            <div className="border-t border-[#1A1A1A]/5 pt-8 space-y-4">
              <div className="flex justify-between text-sm text-[#5D5A53] font-light tracking-widest">
                 <span>小计</span>
                 <span>¥{subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm text-[#5D5A53] font-light tracking-widest">
                 <span>配送</span>
                 <span>免费</span>
              </div>
            </div>
            
            <div className="border-t border-[#1A1A1A]/5 mt-8 pt-8">
               <div className="flex justify-between items-center">
                 <span className="font-serif text-2xl text-[#1A1A1A] tracking-widest">总计</span>
                 <div className="flex items-end gap-2">
                   <span className="text-[10px] text-[#A8A29E] mb-1 tracking-widest font-bold">CNY</span>
                   <span className="font-serif text-3xl text-[#1A1A1A]">¥{total.toLocaleString()}</span>
                 </div>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
