'use client';

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/app/lib/utils';

export const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isReady, setIsReady] = useState(false);
  const [showBrand, setShowBrand] = useState(false);
  const brandRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    // 1. Particles System
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];
    const particleCount = 100;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      opacity: number;

      constructor() {
        this.x = Math.random() * canvas!.width;
        this.y = Math.random() * canvas!.height;
        this.size = Math.random() * 2 + 1;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.2;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x > canvas!.width) this.x = 0;
        if (this.x < 0) this.x = canvas!.width;
        if (this.y > canvas!.height) this.y = 0;
        if (this.y < 0) this.y = canvas!.height;
      }

      draw() {
        ctx!.fillStyle = `rgba(168, 85, 247, ${this.opacity})`;
        ctx!.beginPath();
        ctx!.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx!.fill();
      }
    }

    const initParticles = () => {
      particles = [];
      for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
      }
    };

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animateParticles);
    };

    window.addEventListener('resize', resize);
    resize();
    initParticles();
    animateParticles();

    // 2. Cinematic Sequence
    const timer1 = setTimeout(() => setIsReady(true), 500);
    const timer2 = setTimeout(() => setShowBrand(true), 1500);
    const timer3 = setTimeout(() => onComplete(), 5500); // Total splash time

    // 3. Magnetic Effect
    const handleMouseMove = (e: MouseEvent) => {
      if (!brandRef.current) return;
      const letters = brandRef.current.querySelectorAll('span');
      const { clientX, clientY } = e;

      letters.forEach((letter: any) => {
        const rect = letter.getBoundingClientRect();
        const letterX = rect.left + rect.width / 2;
        const letterY = rect.top + rect.height / 2;
        const distanceX = clientX - letterX;
        const distanceY = clientY - letterY;
        const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);
        const maxDistance = 300;

        if (distance < maxDistance) {
          const power = (maxDistance - distance) / maxDistance;
          const x = distanceX * power * 0.3;
          const y = distanceY * power * 0.3;
          letter.style.transform = `translate(${x}px, ${y}px) scale(${1 + power * 0.2})`;
        } else {
          letter.style.transform = `translate(0, 0) scale(1)`;
        }
      });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  return (
    <motion.div 
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="fixed inset-0 z-[9999] overflow-hidden bg-[#0a0a0f] flex items-center justify-center"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0f] to-[#220235] opacity-100" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#0a0a0f_100%)] opacity-60 pointer-events-none z-[1]" />
      
      <canvas ref={canvasRef} className="absolute inset-0 z-0" />

      {/* Futuristic Man (Branded Reveal) */}
      <motion.div 
        initial={{ x: -200, opacity: 0 }}
        animate={isReady ? { x: 0, opacity: 1 } : {}}
        transition={{ duration: 2, ease: [0.19, 1, 0.22, 1] }}
        className="absolute bottom-0 left-[-300px] md:left-[-100px] h-full z-[2] pointer-events-none filter drop-shadow-[0_0_50px_rgba(168,85,247,0.4)]"
      >
        <img 
          src="https://images.unsplash.com/photo-1549416878-b9ca35c2d47b?q=80&w=2000&auto=format&fit=crop" 
          alt="" 
          className="h-full object-contain [mask-image:linear-gradient(to_bottom,black_85%,transparent_100%)]"
        />
      </motion.div>

      {/* Brand Reveal */}
      <AnimatePresence>
        {showBrand && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative z-[3] text-center"
          >
            <h1 
              ref={brandRef}
              className="text-[5rem] md:text-[10rem] font-bold text-[#a855f7] flex gap-2 md:gap-4 tracking-[-0.05em]"
              style={{ perspective: '1000px' }}
            >
              {"CLARITAS".split("").map((letter, i) => (
                <motion.span
                  key={i}
                  initial={{ 
                    opacity: 0, 
                    x: Math.random() * 100 - 50, 
                    y: Math.random() * 100 - 50,
                    rotate: Math.random() * 40 - 20,
                    scale: 0.5
                  }}
                  animate={{ opacity: 1, x: 0, y: 0, rotate: 0, scale: 1 }}
                  transition={{ 
                    delay: 0.1 * i, 
                    duration: 1.2, 
                    type: "spring",
                    stiffness: 100,
                    damping: 15
                  }}
                  className="inline-block hover:text-white transition-colors cursor-default drop-shadow-[0_0_20px_rgba(168,85,247,0.5)]"
                >
                  {letter}
                </motion.span>
              ))}
            </h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="text-white/60 text-xl md:text-2xl tracking-[0.5em] font-light mt-[-1rem] md:mt-[-2rem] uppercase"
            >
              Intelligence Redefined
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        @keyframes magnetic-snap {
          0% {
            opacity: 0;
            transform: translate(var(--rx, 50px), var(--ry, 50px)) scale(0.5) rotate(var(--ra, 20deg));
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: translate(0, 0) scale(1) rotate(0deg);
            filter: blur(0);
          }
        }
      `}</style>
    </motion.div>
  );
};
