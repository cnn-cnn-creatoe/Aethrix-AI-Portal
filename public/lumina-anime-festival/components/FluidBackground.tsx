
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

const PetalsField = () => {
  const petals = useMemo(() => {
    return Array.from({ length: 40 }).map((_, i) => ({
      id: i,
      size: Math.random() * 10 + 5,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 10,
      rotate: Math.random() * 360,
    }));
  }, []);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      {petals.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full bg-[#ff7eb9]/20 blur-[1px]"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size * 1.5,
            transform: `rotate(${p.rotate}deg)`,
          }}
          animate={{
            y: [0, 400, 800],
            x: [0, 100, -100, 0],
            rotate: [p.rotate, p.rotate + 360],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: p.duration,
            repeat: Infinity,
            ease: "linear",
            delay: p.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#0a0514]">
      
      {/* 樱花粒子 */}
      <PetalsField />

      {/* 动漫网格底纹 */}
      <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(#ffffff 1px, transparent 1px), linear-gradient(90deg, #ffffff 1px, transparent 1px)`, backgroundSize: '40px 40px' }} />

      {/* 巨大的梦幻色块 */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[80vw] h-[80vw] bg-[#ff7eb9]/10 rounded-full blur-[150px]"
        animate={{ x: [0, 100, 0], y: [0, 50, 0] }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[-10%] right-[-10%] w-[70vw] h-[70vw] bg-[#7afbff]/10 rounded-full blur-[150px]"
        animate={{ x: [0, -100, 0], y: [0, -50, 0] }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
};

export default FluidBackground;
