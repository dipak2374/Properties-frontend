import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { fetchProperties } from '../../services/propertyService';
import '../../styles/dashboard.css';

const dashboardCards = [
  { title: 'Saved Searches', body: 'Three searches are active and ready to alert you.', href: '/properties' },
  { title: 'Recent Activity', body: 'You recently viewed a luxury villa and two city apartments.', href: '/wishlist' },
  { title: 'Upcoming Tours', body: 'One appointment is confirmed for this week.', href: '/appointment' },
];

export default function Dashboard() {
  const shouldReduceMotion = useReducedMotion();
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadProperties = async () => {
      try {
        const data = await fetchProperties();
        if (active) {
          setProperties(data);
        }
      } catch {
        // Fallback
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };
    loadProperties();
    return () => { active = false; };
  }, []);

  const totalCount = properties.length;
  const publishedCount = properties.filter(p => p.tag === 'For Sale' || p.tag === 'For Rent' || p.status === 'For Sale' || p.status === 'For Rent').length;
  const pendingCount = properties.filter(p => p.status === 'Pending').length;
  const draftCount = properties.filter(p => p.status === 'Draft' || p.tag === 'Draft').length;

  const statsWidgets = [
    { title: 'Total Properties', value: loading ? '...' : String(totalCount), icon: '🏢', change: 'Total listings' },
    { title: 'Published Properties', value: loading ? '...' : String(publishedCount), icon: '✅', change: 'Live listings' },
    { title: 'Pending Approval', value: loading ? '...' : String(pendingCount), icon: '⏳', change: 'Reviewing' },
    { title: 'Draft Listings', value: loading ? '...' : String(draftCount), icon: '📝', change: 'Unpublished' },
    { title: 'Listing Views', value: '1,420', icon: '👁️', change: '+18% weekly' },
    { title: 'Appointments', value: '5', icon: '📅', change: '3 confirmed' },
    { title: 'Total Revenue', value: '$8,450', icon: '💰', change: 'Monthly payout' },
    { title: 'Total Favorites', value: '84', icon: '❤️', change: '+12 saves' },
  ];

  return (
    <div className="agent-dashboard-home">
      <motion.section
        className="dashboard-page-header"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
      >
        <div>
          <p className="dashboard-breadcrumb">Dashboard &gt; Home</p>
          <h1>Agent Dashboard</h1>
        </div>
        <Link to="/dashboard/add-property" className="button button-primary">➕ Add Property</Link>
      </motion.section>

      {/* Stats Widgets Grid */}
      <motion.div
        className="stats-widgets-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem',
        }}
        initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08, duration: 0.4 }}
      >
        {statsWidgets.map((stat, index) => (
          <motion.div
            key={stat.title}
            className="wizard-card"
            style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', position: 'relative' }}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + index * 0.04, duration: 0.3 }}
            whileHover={shouldReduceMotion ? undefined : { y: -2, scale: 1.01 }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{stat.title}</span>
              <span style={{ fontSize: '1.5rem' }}>{stat.icon}</span>
            </div>
            <strong style={{ fontSize: '1.75rem', fontWeight: '700', color: '#0f172a' }}>{stat.value}</strong>
            <span style={{ fontSize: '0.75rem', color: '#10b981', fontWeight: '500' }}>{stat.change}</span>
          </motion.div>
        ))}
      </motion.div>

      {/* Quick Actions Grid */}
      <h2 style={{ fontSize: '1.25rem', fontWeight: '700', color: '#0f172a', marginBottom: '1.25rem' }}>Quick Shortcuts</h2>
      <motion.div
        className="feature-grid"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15, duration: 0.45 }}
      >
        {dashboardCards.map((item, index) => (
          <motion.div
            key={item.title}
            className="wizard-card"
            initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18 + index * 0.06, duration: 0.4 }}
            whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
          >
            <h4 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>{item.title}</h4>
            <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '1.25rem', lineHeight: '1.4' }}>{item.body}</p>
            <Link to={item.href} className="button button-secondary" style={{ display: 'inline-block', fontSize: '0.85rem', padding: '0.4rem 1rem' }}>Open</Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
