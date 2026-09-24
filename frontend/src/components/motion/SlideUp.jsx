import { motion } from 'framer-motion';

/**
 * SlideUp — viewport-triggered slide-up entrance animation.
 * Uses `whileInView` so the animation fires when the element scrolls into view.
 *
 * Props:
 *   delay    — seconds before animation starts (default 0)
 *   duration — animation duration in seconds (default 0.6)
 *   y        — vertical offset in px to animate from (default 40)
 *   once     — animate only on first entry (default true)
 *   className — additional classes
 *
 * Usage:
 *   <SlideUp delay={0.2}>
 *     <Section />
 *   </SlideUp>
 */
const SlideUp = ({ children, delay = 0, duration = 0.6, y = 40, once = true, className = '' }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once, margin: '-50px' }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export default SlideUp;
