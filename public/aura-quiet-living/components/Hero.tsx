
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';

const Hero: React.FC = () => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault();
    const element = document.getElementById(targetId);
    if (element) {
      const headerOffset = 85;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.scrollY - headerOffset;

      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
      try { window.history.pushState(null, '', `#${targetId}`); } catch (err) {}
    }
  };

  return (
    <section className="relative w-full h-screen min-h-[800px] overflow-hidden bg-[#1A1A1A]">
      <div className="absolute inset-0 w-full h-full">
        <img 
            src="https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&q=80&w=2000" 
            alt="Misty landscape" 
            className="w-full h-full object-cover grayscale brightness-[0.6] scale-105 animate-[pulse_20s_ease-in-out_infinite_alternate]"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#1A1A1A]/60"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col justify-center items-center text-center px-6">
        <div className="animate-fade-in-up">
          <span className="block text-xs font-medium tracking-[0.5em] text-white/60 mb-8">
            二零二五 春季系列
          </span>
          <h1 className="text-6xl md:text-9xl font-serif text-white tracking-widest mb-10 text-shadow-sm">
            静谧<span className="italic font-light opacity-80">而生</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-white/70 font-light leading-relaxed mb-16 tracking-widest">
            旨在消失于生活中的技术。<br/>
            温润材质，静谧运转，取法自然。
          </p>
          
          <a 
            href="#products" 
            onClick={(e) => handleNavClick(e, 'products')}
            className="px-12 py-5 bg-white text-[#1A1A1A] text-xs font-bold tracking-[0.3em] hover:bg-opacity-90 transition-all duration-500 shadow-2xl"
          >
            探索系列
          </a>
        </div>
      </div>

      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 opacity-30">
        <div className="w-[1px] h-24 bg-gradient-to-b from-white to-transparent animate-bounce"></div>
      </div>
    </section>
  );
};

export default Hero;
