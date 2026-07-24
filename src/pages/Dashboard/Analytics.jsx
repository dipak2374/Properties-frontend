import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { fetchProperties } from '../../services/propertyService';

export default function Analytics() {
  const shouldReduceMotion = useReducedMotion();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState([
    { label: 'Total Page Views', value: '1,420', change: '+12% this week' },
    { label: 'Live Listings', value: '0', change: 'Published properties' },
    { label: 'Pending Approval', value: '0', change: 'Reviewing' },
  ]);

  useEffect(() => {
    let active = true;
    const load = async () => {
      try {
        const properties = await fetchProperties();
        if (active) {
          const liveCount = properties.length;
          const pendingCount = properties.filter(p => p.status === 'Pending').length;
          
          setMetrics([
            { label: 'Total Page Views', value: '2,840', change: '+24% this month' },
            { label: 'Live Listings', value: String(liveCount), change: 'Active properties' },
            { label: 'Pending Approval', value: String(pendingCount), change: 'Awaiting moderation' },
          ]);
        }
      } catch (err) {
        console.error('Failed to load live properties analytics:', err);
      } finally {
        if (active) setLoading(false);
      }
    };
    load();
    return () => { active = false; };
  }, []);

  return (
    <div className="agent-analytics-view">
      <motion.section
        className="dashboard-page-header"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="dashboard-breadcrumb">Dashboard &gt; Analytics</p>
          <h1>Analytics Overview</h1>
        </div>
      </motion.section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        {loading ? (
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Loading metrics...</p>
        ) : (
          metrics.map((metric, i) => (
            <motion.div
              key={metric.label}
              className="wizard-card"
              style={{ padding: '1.5rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: 'var(--shadow-sm)' }}
              initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: i * 0.08 }}
            >
              <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>{metric.label}</span>
              <h2 style={{ fontSize: '2rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0' }}>{metric.value}</h2>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '500' }}>{metric.change}</span>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
