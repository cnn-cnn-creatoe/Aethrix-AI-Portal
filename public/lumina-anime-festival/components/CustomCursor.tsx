
/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/

import React, { useEffect, useState } from 'react';
import { motion, useSpring, useMotionValue } from 'framer-motion';

const CustomCursor: React.FC = () => {
  const [isHovering, setIsHovering] = useState(false);
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);
  const springConfig = { damping: 25, stiffness: 400, mass: 0.1 }; 
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      const target = e.target as HTMLElement;
      setIsHovering(!!(target.closest('button') || target.closest('a') || target.closest('[data-hover="true"]')));
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, [mouseX, mouseY]);

  return (
    <motion.div className="fixed top-0 left-0 z-[9999] pointer-events-none flex items-center justify-center hidden md:flex" style={{ x, y, translateX: '-50%', translateY: '-50%' }}>
      <motion.div className="relative rounded-2xl border-2 border-[#ff7eb9] flex items-center justify-center backdrop-blur-md rotate-45" style={{ width: 60, height: 60 }} animate={{ scale: isHovering ? 1.4 : 1, backgroundColor: isHovering ? 'rgba(255, 126, 185, 0.4)' : 'rgba(255, 255, 255, 0.05)' }}>
        <motion.span className="z-10 text-white font-black italic -rotate-45 text-[10px]" initial={{ opacity: 0 }} animate={{ opacity: isHovering ? 1 : 0 }}>传送</motion.span>
      </motion.div>
    </motion.div>
  );
};

export default CustomCursor;
