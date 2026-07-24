import { motion, useReducedMotion } from 'framer-motion';

// Shared easing and timing values keep motion consistent across the app.
export const motionEase = [0.22, 1, 0.36, 1];
export const motionTransition = { duration: 0.45, ease: motionEase };

// Reusable fade-up motion for content that appears as the user scrolls in.
export const fadeUpVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0 },
};

// Staggered container used for grids and stacked content blocks.
export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.04,
    },
  },
};

// Item-level animation applied to individual cards, rows, or text elements.
export const staggerItem = {
  hidden: { opacity: 0, y: 18 },
  visible: { opacity: 1, y: 0 },
};

// Gentle button feedback for hover and tap states without overstating motion.
export const buttonMotion = {
  whileHover: { scale: 1.05, y: -1 },
  whileTap: { scale: 0.95 },
};

// Smooth image hover motion that keeps the card layout intact.
export const imageMotion = {
  whileHover: { scale: 1.04 },
  transition: { duration: 0.3, ease: motionEase },
};

// Scroll-reveal section wrapper used where content should fade in once.
export function MotionSection({ children, className, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.section
      initial={shouldReduceMotion ? false : 'hidden'}
      whileInView={shouldReduceMotion ? undefined : 'visible'}
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUpVariant}
      transition={motionTransition}
      className={className}
      {...props}
    >
      {children}
    </motion.section>
  );
}

export function MotionCard({ children, className, ...props }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={motionTransition}
      whileHover={shouldReduceMotion ? undefined : { y: -5, scale: 1.01, boxShadow: '0 24px 50px rgba(15, 23, 42, 0.12)' }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PageTransition({ children }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={shouldReduceMotion ? undefined : { opacity: 0, y: -8 }}
      transition={motionTransition}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
}

export function LoadingSpinner({ label = 'Loading' }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="loading-shell">
      <motion.div
        className="loading-spinner"
        animate={shouldReduceMotion ? undefined : { rotate: 360 }}
        transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 1.1, repeat: Infinity, ease: 'linear' }}
      />
      <span>{label}</span>
    </div>
  );
}

export function SkeletonBlock({ className = '', style = {} }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className={`skeleton-block ${className}`.trim()}
      style={style}
      animate={shouldReduceMotion ? undefined : { opacity: [0.7, 1, 0.7] }}
      transition={shouldReduceMotion ? { duration: 0.01 } : { duration: 1.2, repeat: Infinity, ease: 'linear' }}
    />
  );
}
