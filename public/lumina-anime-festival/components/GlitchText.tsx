
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';

interface GradientTextProps {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}

const GradientText: React.FC<GradientTextProps> = ({ text, as: Component = 'span', className = '' }) => {
  return (
    <Component className={`relative inline-block font-black tracking-tighter isolate pt-16 pb-20 px-10 overflow-visible ${className}`}>
      {/* 渐变主文字层 - 极端行高确保复杂笔画完整展示 */}
      <motion.span
        className="relative z-10 block bg-gradient-to-r from-[#ff7eb9] via-[#ffffff] via-[#7afbff] via-[#ffffff] to-[#ff7eb9] bg-[length:200%_auto] bg-clip-text text-transparent will-change-[background-position] leading-[1.5] skew-x-[-5deg]"
        animate={{
          backgroundPosition: ['0% center', '200% center'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear",
        }}
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backfaceVisibility: 'hidden',
          display: 'block'
        }}
      >
        {text}
      </motion.span>
      
      {/* 描边阴影层 */}
      <span 
        className="absolute inset-0 block text-transparent bg-clip-text bg-gradient-to-r from-white/20 to-transparent pointer-events-none pt-16 pb-20 px-10 skew-x-[-5deg] leading-[1.5]"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          zIndex: 5
        }}
      >
        {text}
      </span>
      
      {/* 动漫发光辉光层 - 增强辉光范围 */}
      <span
        className="absolute inset-0 -z-10 block bg-gradient-to-r from-[#ff7eb9] to-[#7afbff] bg-clip-text text-transparent blur-3xl opacity-60 pointer-events-none pt-16 pb-20 px-10 skew-x-[-5deg] leading-[1.5]"
        style={{ 
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          transform: 'translateZ(0)' 
        }}
      >
        {text}
      </span>
    </Component>
  );
};

export default GradientText;
