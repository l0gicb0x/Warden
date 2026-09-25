import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';

/**
 * SurrealScrollReveal — High-Impact 3D Holographic Perspective Illusion
 * ──────────────────────────────────────────────────────────────────────────
 * Delivers a clearly visible, tactile 3D card tilt & spatial arrival:
 * - perspective(900px) with dynamic 20° rotateX and -80px translateZ depth
 * - Dynamic specular light reflection sweep across the card surface
 * - 100% crisp typography stability upon settling
 */
const SurrealScrollReveal = ({
  children,
  delay = 0,
  className = '',
}) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });

  return (
    <div style={{ perspective: '900px', transformStyle: 'preserve-3d' }} className="w-full">
      <motion.div
        ref={ref}
        initial={{
          opacity: 0,
          y: 55,
          rotateX: 20,
          z: -80,
          scale: 0.93,
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                y: 0,
                rotateX: 0,
                z: 0,
                scale: 1,
              }
            : {
                opacity: 0,
                y: 55,
                rotateX: 20,
                z: -80,
                scale: 0.93,
              }
        }
        transition={{
          type: 'spring',
          stiffness: 95,
          damping: 17,
          mass: 0.9,
          delay,
        }}
        className={`relative ${className}`}
      >
        {/* Dynamic 3D Specular Light Sweep Overlay */}
        <motion.div
          initial={{ opacity: 0.8, x: '-100%' }}
          animate={isInView ? { opacity: 0, x: '200%' } : { opacity: 0.8, x: '-100%' }}
          transition={{
            duration: 1.2,
            delay: delay + 0.1,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute inset-0 bg-gradient-to-r from-transparent via-warden-amber/20 to-transparent pointer-events-none z-30 rounded-2xl"
        />

        {/* Luminous Top Edge Laser Highlight */}
        <motion.div
          initial={{ scaleX: 0, opacity: 0 }}
          animate={isInView ? { scaleX: [0, 1, 0.3], opacity: [0, 0.9, 0] } : { scaleX: 0, opacity: 0 }}
          transition={{
            duration: 1.0,
            delay: delay + 0.15,
            ease: [0.16, 1, 0.3, 1],
          }}
          className="absolute -top-[1px] left-[5%] right-[5%] h-[2px] bg-gradient-to-r from-transparent via-warden-amber to-transparent pointer-events-none z-20"
        />

        {children}
      </motion.div>
    </div>
  );
};

export default SurrealScrollReveal;
