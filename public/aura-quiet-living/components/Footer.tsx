
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useState } from 'react';

interface FooterProps {
  onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => void;
}

const Footer: React.FC<FooterProps> = ({ onLinkClick }) => {
  const [subscribeStatus, setSubscribeStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [email, setEmail] = useState('');

  const handleSubscribe = () => {
    if (!email) return;
    setSubscribeStatus('loading');
    setTimeout(() => {
      setSubscribeStatus('success');
      setEmail('');
    }, 1500);
  };

  return (
    <footer className="bg-[#FAF9F6] pt-40 pb-20 px-8 border-t border-[#1A1A1A]/5 text-[#5D5A53]">
      <div className="max-w-[1800px] mx-auto grid grid-cols-1 md:grid-cols-12 gap-20">
        
        <div className="md:col-span-4">
          <h4 className="text-3xl font-serif text-[#1A1A1A] mb-8 tracking-widest">Aura</h4>
          <p className="max-w-xs font-light leading-loose tracking-wider">
            设计如自然般纯粹的技术。
            取法自然，归于内心。
          </p>
        </div>

        <div className="md:col-span-2">
          <h4 className="font-bold text-[#1A1A1A] mb-8 tracking-[0.4em] text-[10px] uppercase">典藏</h4>
          <ul className="space-y-6 font-light text-sm tracking-widest">
            <li><a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:opacity-50">全部作品</a></li>
            <li><a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:opacity-50">新品上市</a></li>
            <li><a href="#products" onClick={(e) => onLinkClick(e, 'products')} className="hover:opacity-50">声学艺术</a></li>
          </ul>
        </div>
        
        <div className="md:col-span-2">
          <h4 className="font-bold text-[#1A1A1A] mb-8 tracking-[0.4em] text-[10px] uppercase">品牌</h4>
          <ul className="space-y-6 font-light text-sm tracking-widest">
            <li><a href="#about" onClick={(e) => onLinkClick(e, 'about')} className="hover:opacity-50">品牌溯源</a></li>
            <li><a href="#about" onClick={(e) => onLinkClick(e, 'about')} className="hover:opacity-50">可持续性</a></li>
            <li><a href="#journal" onClick={(e) => onLinkClick(e, 'journal')} className="hover:opacity-50">生活志</a></li>
          </ul>
        </div>

        <div className="md:col-span-4">
          <h4 className="font-bold text-[#1A1A1A] mb-8 tracking-[0.4em] text-[10px] uppercase">订阅周刊</h4>
          <div className="flex flex-col gap-6">
            <input 
              type="email" 
              placeholder="您的电子邮箱" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-transparent border-b border-[#1A1A1A]/10 py-3 text-lg outline-none focus:border-[#1A1A1A] transition-colors" 
            />
            <button 
              onClick={handleSubscribe}
              className="self-start text-[10px] font-bold uppercase tracking-[0.4em] hover:opacity-50 transition-opacity"
            >
              {subscribeStatus === 'idle' && '订阅灵感'}
              {subscribeStatus === 'loading' && '发送中...'}
              {subscribeStatus === 'success' && '订阅成功'}
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-[1800px] mx-auto mt-40 pt-10 border-t border-[#1A1A1A]/5 flex flex-col md:flex-row justify-between items-center text-[10px] uppercase tracking-[0.5em] opacity-40">
        <p>© 2025 AURA 灵感空间</p>
        <p>静谧·自然·技术</p>
      </div>
    </footer>
  );
};

export default Footer;
