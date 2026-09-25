import { useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'framer-motion';

/**
 * SurrealScrollReveal — Dream Parallax Float & Blur Reveal
 * ─────────────────────────────────────────────────────────────
 * Adds smooth floating dynamics, parallax displacement, and soft
 * blur-to-focus reveal as elements scroll into the viewport.
 *
 * Props:
 *   children    — React node to wrap
 *   delay       — Stagger delay in seconds
 *   parallaxY   — Vertical parallax displacement range in px
 *   rotateZ     — Subtle angle roll
 *   className   — Additional CSS classes
 */
const SurrealScrollReveal = ({
  children,
  delay = 0,
  parallaxY = 20,
  rotateZ = 0.8,
  className = '',
}) => {
  const ref = useRef(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  // Smooth out scroll progression using physics spring
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  // Parallax dream float
  const y = useTransform(smoothProgress, [0, 1], [parallaxY, -parallaxY]);
  const rotate = useTransform(smoothProgress, [0, 0.5, 1], [rotateZ, 0, -rotateZ]);
  const scale = useTransform(smoothProgress, [0, 0.5, 1], [0.98, 1, 0.98]);

  return (
    <motion.div
      ref={ref}
      style={{ y, rotate, scale }}
      initial={{ opacity: 0, y: 30, filter: 'blur(6px)' }}
      whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: 0.8,
        delay,
        ease: [0.16, 1, 0.3, 1],
      }}
      className={`relative ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default SurrealScrollReveal;
