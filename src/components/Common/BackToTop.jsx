import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';

export default function BackToTop() {
  const [visible, setVisible] = useState(false);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const handleScroll = () => setVisible(window.scrollY > 360);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  if (!visible) return null;

  return (
    <motion.button
      type="button"
      className="back-to-top"
      onClick={() => window.scrollTo({ top: 0, left: 0, behavior: shouldReduceMotion ? 'auto' : 'smooth' })}
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }}
      aria-label="Back to top"
    >
      ↑
    </motion.button>
  );
}
