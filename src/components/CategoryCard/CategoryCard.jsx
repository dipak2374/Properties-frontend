import { motion, useReducedMotion } from 'framer-motion';

export default function CategoryCard({ icon, label, count }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="category-card"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 22 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.98 }}
    >
      <div className="category-icon">{icon}</div>
      <div>
        <h4>{label}</h4>
        <p>{count} properties</p>
      </div>
    </motion.div>
  );
}
