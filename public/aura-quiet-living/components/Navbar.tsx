
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useState, useEffect } from 'react';
import { BRAND_NAME } from '../constants';

interface NavbarProps {
  onNavClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
  cartCount: number;
  onOpenCart: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ onNavClick, cartCount, onOpenCart }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    setMobileMenuOpen(false);
    onNavClick(e, targetId);
  };

  const textColorClass = (scrolled || mobileMenuOpen) ? 'text-[#1A1A1A]' : 'text-[#FAF9F6]';

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-1000 ease-in-out ${
          scrolled || mobileMenuOpen ? 'bg-[#FAF9F6]/80 backdrop-blur-xl py-4 border-b border-[#1A1A1A]/5' : 'bg-transparent py-8'
        }`}
      >
        <div className="max-w-[1800px] mx-auto px-8 flex items-center justify-between">
          <a 
            href="#" 
            onClick={(e) => {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                onNavClick(e, '');
            }}
            className={`text-2xl font-serif tracking-widest z-50 relative transition-colors duration-500 ${textColorClass}`}
          >
            {BRAND_NAME}
          </a>
          
          <div className={`hidden md:flex items-center gap-12 text-xs font-medium tracking-[0.3em] transition-colors duration-500 ${textColorClass}`}>
            <a href="#products" onClick={(e) => handleLinkClick(e, 'products')} className="hover:opacity-50 transition-opacity">典藏系列</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')} className="hover:opacity-50 transition-opacity">溯源</a>
            <a href="#journal" onClick={(e) => handleLinkClick(e, 'journal')} className="hover:opacity-50 transition-opacity">生活志</a>
          </div>

          <div className={`flex items-center gap-6 z-50 relative transition-colors duration-500 ${textColorClass}`}>
            <button 
              onClick={(e) => { e.preventDefault(); onOpenCart(); }}
              className="text-xs font-medium tracking-widest hover:opacity-50 transition-opacity hidden sm:block"
            >
              购物车 ({cartCount})
            </button>
            
            <button 
              className={`block md:hidden focus:outline-none transition-colors duration-500 ${textColorClass}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
               {mobileMenuOpen ? (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                 </svg>
               ) : (
                 <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-6 h-6">
                   <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                 </svg>
               )}
            </button>
          </div>
        </div>
      </nav>

      <div className={`fixed inset-0 bg-[#FAF9F6] z-40 flex flex-col justify-center items-center transition-all duration-700 ease-in-out ${
          mobileMenuOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-full pointer-events-none'
      }`}>
          <div className="flex flex-col items-center space-y-12 text-2xl font-serif text-[#1A1A1A]">
            <a href="#products" onClick={(e) => handleLinkClick(e, 'products')}>典藏系列</a>
            <a href="#about" onClick={(e) => handleLinkClick(e, 'about')}>品牌溯源</a>
            <a href="#journal" onClick={(e) => handleLinkClick(e, 'journal')}>生活志</a>
            <button 
                onClick={(e) => { e.preventDefault(); onOpenCart(); }} 
                className="text-xs tracking-[0.4em] font-sans mt-12 border-b border-[#1A1A1A]"
            >
                购物车 ({cartCount})
            </button>
          </div>
      </div>
    </>
  );
};

export default Navbar;
