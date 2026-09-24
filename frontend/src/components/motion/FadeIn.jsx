import { motion } from 'framer-motion';

/**
 * FadeIn — animate children into view with a fade + optional vertical shift.
 *
 * Props:
 *   delay    — seconds before animation starts (default 0)
 *   duration — animation duration in seconds (default 0.5)
 *   y        — vertical offset in px to animate from (default 20)
 *   className — additional classes
 *
 * Usage:
 *   <FadeIn delay={0.1}>
 *     <Card />
 *   </FadeIn>
 */
const FadeIn = ({ children, delay = 0, duration = 0.5, y = 20, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration,
        delay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default FadeIn;
