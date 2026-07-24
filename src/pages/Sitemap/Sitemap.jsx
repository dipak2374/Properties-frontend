import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../styles/pages.css';

const links = [
  { label: 'Home', to: '/' },
  { label: 'Properties', to: '/properties' },
  { label: 'All Listings', to: '/all' },
  { label: 'Agents', to: '/agents' },
  { label: 'About Us', to: '/about' },
  { label: 'Contact', to: '/contact' },
  { label: 'FAQs', to: '/faqs' },
  { label: 'Help Center', to: '/help' },
  { label: 'Privacy Policy', to: '/privacy' },
  { label: 'Terms of Use', to: '/terms' },
  { label: 'Blog', to: '/blog' },
];

export default function Sitemap() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell sitemap-page">
      <main className="page-content">
        <motion.section
          className="page-head"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <p className="breadcrumb">Home / Sitemap</p>
            <h1>Sitemap</h1>
            <p>Quickly navigate the main pages and sections of PropertyHub.</p>
          </div>
        </motion.section>

        <section className="sitemap-list">
          {links.map((link) => (
            <motion.div
              key={link.to}
              className="sitemap-item"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3 }}
            >
              <Link to={link.to}>{link.label}</Link>
            </motion.div>
          ))}
        </section>
      </main>
    </div>
  );
}
