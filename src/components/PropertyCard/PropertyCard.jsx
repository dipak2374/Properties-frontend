import { useEffect, useMemo, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { isPropertyCompared, toggleCompareProperty } from '../../utils/featureState';
import { isPropertySaved, toggleWishlistProperty } from '../../utils/wishlist';
import { showToast } from '../../utils/featureState';

export default function PropertyCard({ id, tag, title, location, price, beds, baths, area, image, agent, rating, ...rest }) {
  const [saved, setSaved] = useState(() => isPropertySaved(id));
  const [compared, setCompared] = useState(() => isPropertyCompared(id));
  const shouldReduceMotion = useReducedMotion();
  const liked = useMemo(() => (saved ? 1.12 : 1), [saved]);

  useEffect(() => {
    const handleStorageUpdate = () => setSaved(isPropertySaved(id));
    window.addEventListener('wishlist:updated', handleStorageUpdate);
    return () => window.removeEventListener('wishlist:updated', handleStorageUpdate);
  }, [id]);

  const handleToggleWishlist = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const property = { id, tag, title, location, price, beds, baths, area, image, agent, rating, ...rest };
    const nextState = toggleWishlistProperty(property);
    setSaved(nextState.isSaved);
    showToast(nextState.isSaved ? `${title} added to your wishlist.` : `${title} removed from your wishlist.`, 'success');
  };

  const handleToggleCompare = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const property = { id, tag, title, location, price, beds, baths, area, image, agent, rating, ...rest };
    const nextState = toggleCompareProperty(property);
    setCompared(nextState.isCompared);
    showToast(nextState.isCompared ? `${title} added to compare.` : `${title} removed from compare.`, 'info');
  };

  return (
    <motion.article
      className="property-card"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      whileHover={shouldReduceMotion ? undefined : { y: -8, scale: 1.02 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
    >
      <div className="property-image">
        <motion.img src={image} alt={title} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }} transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }} />
        <div className={`property-label ${tag === 'For Sale' ? 'sale' : tag === 'PG' ? 'pg' : 'rent'}`}>{tag}</div>
        <div className="property-actions-overlay">
          <motion.button
            type="button"
            className={`property-favorite ${saved ? 'saved' : ''}`}
            aria-label={saved ? 'Remove from wishlist' : 'Save property'}
            onClick={handleToggleWishlist}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.12 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.9 }}
            animate={shouldReduceMotion ? undefined : { scale: liked }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          >
            ♥
          </motion.button>
          <motion.button
            type="button"
            className={`property-compare ${compared ? 'active' : ''}`}
            aria-label={compared ? 'Remove from compare' : 'Compare property'}
            onClick={handleToggleCompare}
            whileHover={shouldReduceMotion ? undefined : { scale: 1.08 }}
            whileTap={shouldReduceMotion ? undefined : { scale: 0.94 }}
          >
            ⇄
          </motion.button>
        </div>
      </div>
      <div className="property-card-body">
        <h3>{title}</h3>
        <p className="property-location">{location}</p>
        <div className="property-meta">
          <span>{beds} Beds</span>
          <span>{baths} Baths</span>
          <span>{area}</span>
        </div>
      </div>
      <div className="property-card-footer">
        <div>
          <strong>{price}</strong>
          <p className="property-agent">{agent} · {rating} ★</p>
        </div>
        <Link to={`/properties/${id}`} className="button button-primary">View Details</Link>
      </div>
    </motion.article>
  );
}
