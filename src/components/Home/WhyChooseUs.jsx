import { motion } from 'framer-motion';
import { whyChooseUs } from '../../data/homeMockData';

export default function WhyChooseUs() {
  return (
    <section className="why-us-section">
      <div className="section-headline text-center">
        <h2>Why Choose PropertyHub?</h2>
        <p>We provide a seamless and premium experience for buyers, sellers, and renters.</p>
      </div>
      <div className="why-us-grid">
        {whyChooseUs.map((feature, i) => (
          <motion.div 
            key={feature.id} 
            className="why-us-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
          >
            <div className="icon-wrapper">{feature.icon}</div>
            <h4>{feature.title}</h4>
            <p>{feature.description}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
