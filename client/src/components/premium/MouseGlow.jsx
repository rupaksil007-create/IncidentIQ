import React, { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';

const MouseGlow = () => {
  const mouseX = useSpring(0, { stiffness: 50, damping: 20 });
  const mouseY = useSpring(0, { stiffness: 50, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      mouseX.set(e.clientX - 300);
      mouseY.set(e.clientY - 300);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  return (
    <>
      <div className="bg-mesh" />
      <div className="bg-grid" />
      <motion.div 
        className="bg-glow-orb"
        style={{
          x: mouseX,
          y: mouseY,
        }}
      />
    </>
  );
};

export default MouseGlow;
