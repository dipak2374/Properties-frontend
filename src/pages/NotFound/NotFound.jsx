import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../styles/pages.css';

export default function NotFound() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.div className="empty-state" initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <h1>404 · Page not found</h1>
          <p>The page you are looking for does not exist or may have moved. Let’s get you back to browsing listings.</p>
          <div className="empty-actions">
            <Link to="/" className="button button-primary">Return Home</Link>
            <Link to="/properties" className="button button-secondary">Browse Properties</Link>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
