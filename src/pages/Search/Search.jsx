import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../styles/pages.css';

const searchHints = ['Location', 'Price range', 'Bedrooms', 'Property type'];

export default function Search() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Search</p>
            <h1>Search Properties</h1>
            <p>Use the search tools to find your ideal home by location, price, and property type.</p>
          </div>
          <Link to="/properties" className="button button-primary">View Listings</Link>
        </motion.section>

        <motion.div className="empty-state" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
          <h2>Smart search is ready</h2>
          <p>Refine your search with location, price, bedrooms, and property type filters for faster results.</p>
          <div className="empty-actions">
            {searchHints.map((hint) => <span key={hint} className="badge">{hint}</span>)}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
