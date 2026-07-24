import { motion } from 'framer-motion';
import { platformStats } from '../../data/homeMockData';

export default function PlatformStats() {
  return (
    <section className="stats-section">
      <motion.div 
        className="stats-grid"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6 }}
      >
        {platformStats.map((stat, i) => (
          <div key={i} className="stat-card">
            <h3>{stat.value}</h3>
            <p>{stat.label}</p>
          </div>
        ))}
      </motion.div>
    </section>
  );
}
