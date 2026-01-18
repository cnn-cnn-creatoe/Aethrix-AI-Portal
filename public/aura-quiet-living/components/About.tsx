
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

const About: React.FC = () => {
  return (
    <section id="about" className="bg-[#FAF9F6]">
      <div className="py-32 px-6 md:px-12 max-w-[1800px] mx-auto flex flex-col md:flex-row items-start gap-24">
        <div className="md:w-1/3">
          <h2 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] leading-tight tracking-widest">
            取法自然，<br/>归于内心。
          </h2>
        </div>
        <div className="md:w-2/3 max-w-2xl">
          <p className="text-xl text-[#5D5A53] font-light leading-relaxed mb-10 tracking-wider">
            Aura 创立于一个简单而坚定的信念：科技不应显得冷冰。它应当像被溪水打磨过的鹅卵石，或是书页翻动时的沙沙声。
          </p>
          <p className="text-xl text-[#5D5A53] font-light leading-relaxed mb-10 tracking-wider">
            在无限干扰的时代，我们设计尊重沉默的物件。我们选用随时间流逝而愈发迷人的材料——砂岩、原生铝材和有机棉——在数字世界与您的现实家园之间搭建一座触感的桥梁。
          </p>
          <img 
            src="https://images.pexels.com/photos/6583355/pexels-photo-6583355.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1" 
            alt="Aura Design Studio" 
            className="w-full h-[500px] object-cover grayscale brightness-110 mt-16"
          />
          <p className="text-xs font-medium uppercase tracking-[0.5em] text-[#A8A29E] mt-6">
            Aura 工作室 · 京都
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2">
        <div className="order-2 lg:order-1 relative h-[600px] lg:h-auto overflow-hidden">
           <img 
             src="https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&q=80&w=1200" 
             alt="Natural Stone" 
             className="absolute inset-0 w-full h-full object-cover transition-transform duration-[3s] hover:scale-110"
           />
        </div>
        <div className="order-1 lg:order-2 flex flex-col justify-center p-12 lg:p-32 bg-[#FAF9F6]">
           <span className="text-xs font-bold uppercase tracking-[0.5em] text-[#5D5A53] mb-8">物性 (Materiality)</span>
           <h3 className="text-4xl md:text-5xl font-serif mb-10 text-[#1A1A1A] leading-tight">
             随岁月老去的<br/>优雅。
           </h3>
           <p className="text-lg text-[#5D5A53] font-light leading-relaxed mb-12 max-w-md tracking-wide">
             我们拒绝廉价的一次性消耗。每一件 Aura 作品都选材于砂岩、未经打磨的铝材和有机织物。它们会在您的使用中留下独特的印迹，讲述属于您的故事。
           </p>
        </div>
      </div>
    </section>
  );
};

export default About;
