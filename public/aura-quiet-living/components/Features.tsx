
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';

const Features: React.FC = () => {
  return (
    <section className="bg-[#FAF9F6]">
      {/* 模块 1 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="order-2 lg:order-1 relative h-[500px] lg:h-auto overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200" 
             alt="Natural Stone Texture" 
             className="absolute inset-0 w-full h-full object-cover grayscale brightness-110 hover:scale-105 transition-transform duration-[3s]"
           />
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center p-12 lg:p-24 bg-[#FAF9F6]">
           <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#A8A29E] mb-6">品牌哲学</span>
           <h3 className="text-4xl md:text-5xl font-serif mb-8 text-[#1A1A1A] leading-tight tracking-widest">
             随岁月老去的<br/>优雅。
           </h3>
           <p className="text-lg text-[#5D5A53] font-light leading-relaxed mb-12 max-w-md tracking-wide">
             我们拒绝廉价的一次性消耗。每一件 Aura 作品都选材于砂岩、未经打磨的铝材和有机织物，它们会在使用中留下独特的印迹。
           </p>
           <a href="#about" className="inline-block text-[10px] font-bold uppercase tracking-[0.4em] border-b border-[#1A1A1A] pb-2 hover:opacity-50 transition-all">探索材质之源</a>
        </div>
      </div>

      {/* 模块 2 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[80vh]">
        <div className="flex flex-col justify-center p-12 lg:p-24 bg-[#1A1A1A] text-[#FAF9F6]">
           <span className="text-xs font-bold uppercase tracking-[0.5em] text-white/40 mb-6">生态体验</span>
           <h3 className="text-4xl md:text-5xl font-serif mb-8 text-white leading-tight tracking-widest">
             静谧，是默认值。
           </h3>
           <p className="text-lg text-white/60 font-light leading-relaxed mb-12 max-w-md tracking-wide">
             我们的设备尊重您的注意力。没有闪烁的指示灯，没有侵入性的通知。当您需要时，它是安静且高效的工具；当您独处时，它是优美的陈设。
           </p>
        </div>
        <div className="relative h-[500px] lg:h-auto overflow-hidden">
           <img 
             src="https://images.pexels.com/photos/6801917/pexels-photo-6801917.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
             alt="Woman sitting on wooden floor reading" 
             className="absolute inset-0 w-full h-full object-cover grayscale brightness-75 hover:scale-105 transition-transform duration-[3s]"
           />
        </div>
      </div>
    </section>
  );
};

export default Features;
