import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fetchReviews } from '../../services/reviewService';

export default function Reviews() {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([
    { id: 'rev-1', author: 'Robert Dow', rating: 5, date: 'Jul 20, 2026', comment: 'Excellent response time and professional guidance on the Modern Family Apartment tour.', property: 'Modern Family Apartment' },
    { id: 'rev-2', author: 'Linda K.', rating: 4, date: 'Jun 18, 2026', comment: 'Helpful and knowledgeable, although scheduling was slightly delayed.', property: 'Cozy House in Suburbs' },
  ]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const data = await fetchReviews();
        if (active && Array.isArray(data) && data.length > 0) {
          setReviews(data.map((r, i) => ({
            id: r._id || `rev-db-${i}`,
            author: r.user?.name || r.name || 'Anonymous User',
            rating: r.rating || 5,
            date: r.createdAt ? new Date(r.createdAt).toLocaleDateString() : 'Recent',
            comment: r.comment || r.reviewText || '',
            property: r.property?.title || 'Property Review'
          })));
        }
      } catch (err) {
        console.error('Failed to load reviews from API:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <div className="agent-reviews-view">
      <motion.section
        className="dashboard-page-header"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="dashboard-breadcrumb">Dashboard &gt; Reviews</p>
          <h1>Client Reviews</h1>
        </div>
      </motion.section>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', marginTop: '2rem', maxWidth: '800px' }}>
        {loading ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading reviews...</p>
        ) : reviews.length > 0 ? (
          reviews.map((rev) => (
            <motion.div
              key={rev.id}
              className="wizard-card"
              style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <div>
                  <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{rev.author}</strong>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', marginLeft: '0.5rem' }}>({rev.property})</span>
                </div>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>{rev.date}</span>
              </div>
              <div style={{ color: '#fbbf24', fontSize: '1rem', marginBottom: '0.5rem' }}>
                {'★'.repeat(rev.rating)}
                {'☆'.repeat(5 - rev.rating)}
              </div>
              <p style={{ margin: 0, fontSize: '0.9rem', color: '#334155', lineHeight: '1.5' }}>"{rev.comment}"</p>
            </motion.div>
          ))
        ) : (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>No reviews available yet.</p>
        )}
      </div>
    </div>
  );
}
