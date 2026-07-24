import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useState } from 'react';
import '../../styles/home.css';
import '../../styles/pages.css';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { getWishlistItems, saveWishlistItems } from '../../utils/wishlist';

const savedSearches = [
  { title: 'New York Apartments', count: 20 },
  { title: 'Luxury Homes', count: 15 },
  { title: 'Downtown Rentals', count: 18 },
  { title: 'Family Houses', count: 22 },
];

export default function Favorites() {
  const [savedProperties, setSavedProperties] = useState(() => getWishlistItems());
  const [feedback, setFeedback] = useState('');
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    const updateSavedProperties = () => setSavedProperties(getWishlistItems());
    window.addEventListener('wishlist:updated', updateSavedProperties);
    return () => window.removeEventListener('wishlist:updated', updateSavedProperties);
  }, []);

  const copyWishlistText = async (text) => {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }

    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.setAttribute('readonly', '');
    textArea.style.position = 'fixed';
    textArea.style.left = '-9999px';
    document.body.appendChild(textArea);
    textArea.select();

    try {
      return document.execCommand('copy');
    } finally {
      document.body.removeChild(textArea);
    }
  };

  const handleShareWishlist = async () => {
    const shareText = savedProperties.length
      ? `Check out my wishlist: ${savedProperties.map((property) => property.title).join(', ')}`
      : 'My wishlist is empty right now.';

    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Wishlist',
          text: shareText,
        });
        setFeedback('Wishlist shared successfully.');
        return;
      } catch {
        setFeedback('Sharing was cancelled. Copying the list instead.');
      }
    }

    try {
      const copied = await copyWishlistText(shareText);
      setFeedback(copied ? 'Wishlist copied to clipboard.' : 'Copy failed. Please try again.');
    } catch {
      setFeedback('Sharing is not available in this browser.');
    }
  };

  const handleClearAll = () => {
    if (savedProperties.length === 0) {
      setFeedback('Wishlist is already empty.');
      return;
    }

    saveWishlistItems([]);
    setSavedProperties([]);
    setFeedback('Wishlist cleared.');
  };

  return (
    <div className="page-shell wishlist-page">
      <main className="page-content wishlist-shell">
        <motion.div className="wishlist-header" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <div>
            <p className="breadcrumb">Home &gt; Wishlist</p>
            <div className="wishlist-title-row">
              <motion.span className="wishlist-icon" animate={shouldReduceMotion ? undefined : { scale: [1, 1.06, 1] }} transition={{ duration: 0.85, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}>♡</motion.span>
              <div>
                <h1>My Wishlist</h1>
                <p className="wishlist-summary">You have {savedProperties.length} properties in your wishlist</p>
              </div>
            </div>
          </div>

          <div className="wishlist-actions">
            <motion.button type="button" className="button button-secondary" onClick={handleShareWishlist} whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}>Share List</motion.button>
            <motion.button type="button" className="button button-danger" onClick={handleClearAll} whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}>Clear All</motion.button>
          </div>
        </motion.div>

        {feedback ? <motion.p className="wishlist-feedback" initial={shouldReduceMotion ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>{feedback}</motion.p> : null}

        <div className="wishlist-grid">
          <section className="wishlist-properties">
            {savedProperties.length === 0 ? (
              <motion.div className="empty-state" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36 }}>Your wishlist is empty.</motion.div>
            ) : (
              <div className="properties-grid featured-grid">
                {savedProperties.map((property, index) => (
                  <motion.div key={property.id} initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.04 }}>
                    <PropertyCard {...property} />
                  </motion.div>
                ))}
              </div>
            )}
          </section>

          <aside className="wishlist-sidebar">
            <motion.div className="card-panel saved-searches" initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}>
              <div className="sidebar-heading">
                <h2>Saved Searches</h2>
                <span className="sidebar-action">See all</span>
              </div>
              <div className="saved-search-list">
                {savedSearches.map((search) => (
                  <button key={search.title} type="button" className="saved-search">
                    <span>🔍</span>
                    <div>
                      <strong>{search.title}</strong>
                      <span>{search.count} Properties</span>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            <motion.div className="card-panel wishlist-alert" initial={shouldReduceMotion ? false : { opacity: 0, x: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: 0.08 }}>
              <div className="alert-icon">🔔</div>
              <div>
                <p className="alert-title">Never Miss a Property!</p>
                <p className="alert-copy">Save your searches and get notified when new properties match your preferences.</p>
                <motion.button type="button" className="button button-primary" whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}>Create Alert</motion.button>
              </div>
            </motion.div>
          </aside>
        </div>
      </main>
    </div>
  );
}
