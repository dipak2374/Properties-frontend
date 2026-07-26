import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function Footer() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.footer
      className="site-footer modern-footer"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="footer-brand-top">
            <img src="/images/f-logo.png" alt="PropertyHub" className="footer-logo" />
            <p>Your trusted real estate partner. We help you buy, sell, and rent properties with ease.</p>
          </div>
          <div className="footer-social">
            <motion.a whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: -6 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }} href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
              <img src="/images/facebook.png" alt="Facebook" width="40" height="40" />
            </motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: 6 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }} href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <img src="/images/twitter.png" alt="Twitter" width="40" height="40" />
            </motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: -6 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }} href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <img src="/images/linkdin.png" alt="LinkedIn" width="40" height="40" />
            </motion.a>
            <motion.a whileHover={shouldReduceMotion ? undefined : { scale: 1.1, rotate: 6 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }} href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
              <img src="/images/instagram.png" alt="Instagram" width="40" height="40" />
            </motion.a>
          </div>
        </div>

        <div className="footer-column">
          <h4>Explore</h4>
          <Link to="/properties?listingType=For+Sale">Buy Properties</Link>
          <Link to="/properties?listingType=For+Rent">Rent Properties</Link>
          <Link to="/properties?type=Office">Commercial</Link>
          <Link to="/properties">New Projects</Link>
          <Link to="/properties">Luxury Homes</Link>
        </div>

        <div className="footer-column">
          <h4>Company</h4>
          <Link to="/about">About Us</Link>
          <Link to="/agents">Our Agents</Link>
          <Link to="/contact">Contact Us</Link>
          <Link to="/contact">Careers</Link>
          <Link to="/blog">News & Blog</Link>
        </div>

        <div className="footer-column">
          <h4>Support</h4>
          <Link to="/faqs">FAQs</Link>
          <Link to="/privacy">Privacy Policy</Link>
          <Link to="/terms">Terms of Use</Link>
          <Link to="/help">Help Center</Link>
          <Link to="/sitemap">Sitemap</Link>
        </div>

        <div className="footer-contact">
          <h4>Contact Us</h4>
          <div className="contact-item">
            <span>📍</span>
            <p>123 Real Estate St, New York, NY 10001, USA</p>
          </div>
          <div className="contact-item">
            <span>📞</span>
            <p>+1 (212) 555-0189</p>
          </div>
          <div className="contact-item">
            <span>✉️</span>
            <p>info@propertyhub.com</p>
          </div>
          <div className="contact-item">
            <span>⏰</span>
            <p>Mon - Sat: 9:00 AM - 6:00 PM</p>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2025 PropertyHub. All rights reserved.</p>
      </div>
    </motion.footer>
  );
}
