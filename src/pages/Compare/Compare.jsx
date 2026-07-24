import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { clearCompareItems, getCompareItems } from '../../utils/featureState';
import '../../styles/pages.css';

export default function Compare() {
  const shouldReduceMotion = useReducedMotion();
  const [items, setItems] = useState(() => getCompareItems());

  useEffect(() => {
    const handleStorageChange = () => setItems(getCompareItems());
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('wishlist:updated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('wishlist:updated', handleStorageChange);
    };
  }, []);

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Compare</p>
            <h1>Compare Listings</h1>
            <p>Review up to four homes side-by-side and choose the match that feels right for your lifestyle.</p>
          </div>
          {items.length > 0 ? <button type="button" className="button button-secondary" onClick={() => { clearCompareItems(); setItems([]); }}>Clear Compare</button> : null}
        </motion.section>

        {items.length === 0 ? (
          <motion.div className="empty-state" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            Pick a few properties to compare and build a shortlist faster.
            <div className="empty-actions"><Link to="/properties" className="button button-primary">Browse properties</Link></div>
          </motion.div>
        ) : (
          <div className="properties-grid featured-grid">
            {items.map((property, index) => (
              <motion.div key={property.id} initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: index * 0.04 }}>
                <PropertyCard {...property} />
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
