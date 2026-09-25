import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';

/**
 * ShieldAuraBackground — Ambient Cybernetic & Wabi-Sabi Kinetic Background
 * Features:
 * 1. Animated Swimming Pool Caustics & Flowing Grid Light Mesh
 * 2. Subtle Radial Plasma Aurora in Kintsugi Gold & Imperial Emerald
 * 3. Soft Scanline & Washi Texture Overlays
 */
const ShieldAuraBackground = () => {
  const { isDark } = useTheme();
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.3 });

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({
        x: e.clientX / window.innerWidth,
        y: e.clientY / window.innerHeight,
      });
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden -z-10 select-none">
      {/* ── 1. Cybernetic Grid Mesh with Swimming Pool Caustic Wave ── */}
      <div
        className={`absolute inset-0 transition-opacity duration-700 ${
          isDark ? 'opacity-[0.07]' : 'opacity-[0.05]'
        }`}
        style={{
          backgroundImage: `linear-gradient(to right, ${isDark ? '#d97706' : '#1e1a17'} 1px, transparent 1px), linear-gradient(to bottom, ${isDark ? '#d97706' : '#1e1a17'} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
        }}
      />

      {/* ── 2. Fluid Ambient Plasma Aurora Blobs ── */}
      <motion.div
        animate={{
          x: mousePos.x * 60 - 30,
          y: mousePos.y * 60 - 30,
          scale: [1, 1.15, 1],
        }}
        transition={{
          x: { duration: 0.8, ease: 'easeOut' },
          y: { duration: 0.8, ease: 'easeOut' },
          scale: { duration: 8, repeat: Infinity, ease: 'easeInOut' },
        }}
        className={`absolute -top-32 left-1/4 w-[550px] h-[550px] rounded-full blur-[110px] transition-colors duration-700 ${
          isDark
            ? 'bg-gradient-to-br from-warden-amber/20 via-warden-emerald/10 to-transparent'
            : 'bg-gradient-to-br from-amber-500/15 via-emerald-600/10 to-transparent'
        }`}
      />

      <motion.div
        animate={{
          x: -mousePos.x * 40 + 20,
          y: -mousePos.y * 40 + 20,
          scale: [1.1, 0.95, 1.1],
        }}
        transition={{
          x: { duration: 1.2, ease: 'easeOut' },
          y: { duration: 1.2, ease: 'easeOut' },
          scale: { duration: 10, repeat: Infinity, ease: 'easeInOut' },
        }}
        className={`absolute top-1/3 -right-24 w-[480px] h-[480px] rounded-full blur-[120px] transition-colors duration-700 ${
          isDark
            ? 'bg-gradient-to-br from-warden-violet/15 via-warden-primary/10 to-transparent'
            : 'bg-gradient-to-br from-purple-500/10 via-amber-600/10 to-transparent'
        }`}
      />

      {/* ── 3. Subtle Washi Noise Texture ── */}
      <div
        className="absolute inset-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          backgroundRepeat: 'repeat',
          backgroundSize: '160px 160px',
        }}
      />
    </div>
  );
};

export default ShieldAuraBackground;
