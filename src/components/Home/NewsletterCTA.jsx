import { useState } from 'react';
import { motion } from 'framer-motion';

export default function NewsletterCTA() {
  const [email, setEmail] = useState('');
  const [feedback, setFeedback] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setFeedback('Please enter a valid email address.');
      return;
    }

    setFeedback('Thanks for subscribing! You’ll receive our next market update soon.');
    setEmail('');
  };

  return (
    <section className="newsletter-section">
      <motion.div 
        className="newsletter-card glass-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.5 }}
      >
        <div className="newsletter-content">
          <h2>Get the latest property deals directly in your inbox.</h2>
          <p>Join 25,000+ others who receive our weekly market updates.</p>
        </div>
        <form className="newsletter-form" onSubmit={handleSubmit} aria-live="polite">
          <input
            type="email"
            placeholder="Enter your email address"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
          <button type="submit" className="button button-primary">Subscribe</button>
        </form>
        {feedback ? <p className="newsletter-feedback">{feedback}</p> : null}
      </motion.div>
    </section>
  );
}
