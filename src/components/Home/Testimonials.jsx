import { motion } from 'framer-motion';
import { testimonials } from '../../data/homeMockData';

export default function Testimonials() {
  return (
    <section className="testimonials-section">
      <div className="section-headline">
        <h2>What Our Clients Say</h2>
        <a href="/about">View All Stories</a>
      </div>
      <div className="testimonials-grid">
        {testimonials.map((test, i) => (
          <motion.div 
            key={test.id} 
            className="testimonial-card glass-panel"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.5, delay: i * 0.15 }}
          >
            <div className="rating">{'★'.repeat(test.rating)}</div>
            <p className="quote">"{test.text}"</p>
            <div className="client-info">
              <img src={test.avatar} alt={test.name} />
              <div>
                <h4>{test.name}</h4>
                <span>{test.role}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
