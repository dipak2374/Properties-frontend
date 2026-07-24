import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import SEOHead from '../../components/Common/SEOHead';
import '../../styles/home.css';
import '../../styles/pages.css';

const featureCards = [
  { icon: '🏡', title: 'Customer First', description: 'We put your needs first and work to exceed expectations at every step.' },
  { icon: '🔒', title: 'Trusted & Transparent', description: 'Honest listings, clear information, and no hidden surprises.' },
  { icon: '🚀', title: 'Expert Guidance', description: 'Experienced agents provide the best advice and support throughout the process.' },
  { icon: '🤝', title: 'Local Knowledge', description: 'We know the neighborhoods, trends, and opportunities that matter most.' },
];

const values = [
  { icon: '✅', title: 'Integrity', description: 'We believe in doing what’s right, always. Honesty and integrity are at the core of everything we do.' },
  { icon: '🤝', title: 'Commitment', description: 'We are committed to our clients and work hard to deliver the best results.' },
  { icon: '💡', title: 'Innovation', description: 'We embrace technology and innovative solutions to enhance your real estate experience.' },
  { icon: '🌍', title: 'Community', description: 'We care about the communities we serve and strive to make a positive impact.' },
];

const stats = [
  { label: 'Listings delivered', value: '12k+' },
  { label: 'Happy clients', value: '8k+' },
  { label: 'Neighborhoods covered', value: '35' },
];

export default function About() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell about-page">
      <SEOHead title="About Us - Our Mission & Vision" description="Learn more about PropertyHub, our story, mission, team, and commitment to luxury real estate." />
      <main className="main-hero">
        <motion.section className="hero-grid" initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.45 }}>
          <motion.div className="hero-copy" initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.4 }}>
            <span className="badge">About Us</span>
            <h1>Finding Spaces. Creating Futures.</h1>
            <p>
              PropertyHub is more than just a property listing platform. We connect people with places that truly feel like home. Whether you're buying, selling, or renting, we’re here to make your journey smooth, transparent, and successful.
            </p>
            <div className="hero-actions">
              <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}>
                <Link to="/properties" className="button button-primary">Our Properties</Link>
              </motion.div>
              <motion.div whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}>
                <Link to="/contact" className="button button-secondary">Contact Us</Link>
              </motion.div>
            </div>
          </motion.div>

          <motion.div
            className="hero-preview hero-image-preview"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }}
            whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.45 }}
            style={{
              backgroundImage: 'url(https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80)',
              minHeight: '420px',
            }}
          >
            <motion.div className="preview-overlay" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: 0.08, duration: 0.35 }}>
              <span>10+ Years of Experience</span>
              <h2>Building trust and delivering value across every property search.</h2>
              <p>Our team provides expert guidance, honest advice, and exceptional service to help you find the perfect home.</p>
            </motion.div>
          </motion.div>
        </motion.section>

        <motion.section className="about-stats" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}>
          {stats.map((stat) => (
            <div key={stat.label} className="about-stat-card">
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </motion.section>

        <motion.section className="feature-grid" initial={shouldReduceMotion ? false : { opacity: 0 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}>
          {featureCards.map((item, index) => (
            <motion.div key={item.title} className="feature-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.06 }}>
              <div className="feature-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>

        <motion.section className="about-story" initial={shouldReduceMotion ? false : { opacity: 0, y: 14 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}>
          <div className="section-headline">
            <div>
              <h2>Building Trust. Delivering Value.</h2>
              <p>
                Founded with a simple mission — to make real estate easier for everyone. We believe in transparency, honesty, and building long-term relationships with our clients.
              </p>
            </div>
          </div>
          <div className="about-story-panel">
            <p>From first-time buyers to seasoned investors, our team supports every stage of the journey with clear communication, tailored advice, and a strong local network.</p>
            <p>Every listing is presented with care, every client interaction is handled with attention, and every decision is made with long-term value in mind.</p>
          </div>
        </motion.section>

        <motion.section className="categories-grid" initial={shouldReduceMotion ? false : { opacity: 0 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}>
          {values.map((item, index) => (
            <motion.div key={item.title} className="category-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
              <div className="category-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </motion.section>
      </main>
    </div>
  );
}
