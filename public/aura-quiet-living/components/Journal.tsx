
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React from 'react';
import { JOURNAL_ARTICLES } from '../constants';
import { JournalArticle } from '../types';

interface JournalProps {
  onArticleClick: (article: JournalArticle) => void;
}

const Journal: React.FC<JournalProps> = ({ onArticleClick }) => {
  return (
    <section id="journal" className="bg-[#FAF9F6] py-32 px-6 md:px-12">
      <div className="max-w-[1800px] mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 pb-8 border-b border-[#1A1A1A]/10">
            <div>
                <span className="block text-xs font-bold uppercase tracking-[0.5em] text-[#A8A29E] mb-4">编者按</span>
                <h2 className="text-4xl md:text-6xl font-serif text-[#1A1A1A] tracking-widest">生活志 (Journal)</h2>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-24">
            {JOURNAL_ARTICLES.map((article) => (
                <div key={article.id} className="group cursor-pointer flex flex-col text-left" onClick={() => onArticleClick(article)}>
                    <div className="w-full aspect-[16/9] overflow-hidden mb-10 bg-[#EBE7DE]">
                        <img 
                            src={article.image} 
                            alt={article.title} 
                            className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 grayscale brightness-110"
                        />
                    </div>
                    <div className="flex flex-col flex-1 text-left">
                        <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A8A29E] mb-4">{article.date}</span>
                        <h3 className="text-3xl font-serif text-[#1A1A1A] mb-6 leading-tight tracking-widest group-hover:opacity-60 transition-opacity">{article.title}</h3>
                        <p className="text-[#5D5A53] font-light leading-loose tracking-wide max-w-xl">{article.excerpt}</p>
                    </div>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
};

export default Journal;
