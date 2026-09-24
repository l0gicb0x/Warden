import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * SmoothScroll — initialises Lenis smooth-scroll globally.
 * Wrap your app (or a section) with this component.
 *
 * Usage:
 *   <SmoothScroll>
 *     <App />
 *   </SmoothScroll>
 */
const SmoothScroll = ({ children }) => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      smoothWheel: true,
    });

    const raf = (time) => {
      lenis.raf(time);
      requestAnimationFrame(raf);
    };
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
};

export default SmoothScroll;
