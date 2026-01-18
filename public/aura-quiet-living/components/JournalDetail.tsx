
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { JournalArticle } from '../types';

interface JournalDetailProps {
  article: JournalArticle;
  onBack: () => void;
}

const JournalDetail: React.FC<JournalDetailProps> = ({ article, onBack }) => {
  return (
    <div className="min-h-screen bg-[#FAF9F6] animate-fade-in-up">
       <div className="w-full h-[60vh] relative overflow-hidden">
          <img 
             src={article.image} 
             alt={article.title} 
             className="w-full h-full object-cover grayscale brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FAF9F6] to-transparent"></div>
       </div>

       <div className="max-w-4xl mx-auto px-6 md:px-12 -mt-40 relative z-10 pb-32">
          <div className="bg-[#FAF9F6] p-12 md:p-24 shadow-2xl">
             <div className="flex justify-between items-center mb-16 border-b border-[#1A1A1A]/5 pb-12">
                <button 
                  onClick={onBack}
                  className="group flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-[#A8A29E] hover:text-[#1A1A1A] transition-all"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 group-hover:-translate-x-1 transition-transform">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                  </svg>
                  返回列表
                </button>
                <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A8A29E]">{article.date}</span>
             </div>

             <h1 className="text-4xl md:text-7xl font-serif text-[#1A1A1A] mb-16 leading-tight text-center tracking-widest">
               {article.title}
             </h1>

             <div className="prose prose-neutral prose-lg mx-auto font-light leading-loose text-[#5D5A53] tracking-wide">
               {article.content}
             </div>
             
             <div className="mt-24 pt-16 border-t border-[#1A1A1A]/5 flex justify-center">
                 <span className="text-3xl font-serif italic text-[#1A1A1A] tracking-[0.3em]">Aura</span>
             </div>
          </div>
       </div>
    </div>
  );
};

export default JournalDetail;
