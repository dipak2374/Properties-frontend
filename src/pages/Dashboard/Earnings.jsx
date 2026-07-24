import { motion, useReducedMotion } from 'framer-motion';

export default function Earnings() {
  const shouldReduceMotion = useReducedMotion();

  const mockPayouts = [
    { id: 'pay-1', date: 'Jul 15, 2026', amount: '$3,200', status: 'Completed', method: 'Direct Deposit' },
    { id: 'pay-2', date: 'Jun 15, 2026', amount: '$2,850', status: 'Completed', method: 'Direct Deposit' },
    { id: 'pay-3', date: 'May 15, 2026', amount: '$2,400', status: 'Completed', method: 'Direct Deposit' },
  ];

  return (
    <div className="agent-earnings-view">
      <motion.section
        className="dashboard-page-header"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
      >
        <div>
          <p className="dashboard-breadcrumb">Dashboard &gt; Earnings</p>
          <h1>Earnings</h1>
        </div>
      </motion.section>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginTop: '2rem' }}>
        
        {/* Earnings Summary Card */}
        <motion.div
          className="wizard-card"
          style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '600' }}>Balance Available</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', color: '#0f172a', margin: '0.5rem 0' }}>$8,450.00</h2>
          <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: '500' }}>Next payout on Aug 15, 2026</span>
          <button className="button button-primary" style={{ marginTop: '1.5rem', width: '100%' }}>Request Early Payout</button>
        </motion.div>

        {/* Payout History Card */}
        <motion.div
          className="wizard-card"
          style={{ padding: '2rem', background: '#fff', borderRadius: '16px', border: '1px solid #e2e8f0' }}
          initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: '0 0 1rem 0', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.5rem' }}>Payout History</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mockPayouts.map((payout) => (
              <div key={payout.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.9rem' }}>
                <div>
                  <strong style={{ display: 'block', color: '#0f172a' }}>{payout.amount}</strong>
                  <span style={{ fontSize: '0.75rem', color: '#64748b' }}>{payout.date} · {payout.method}</span>
                </div>
                <span style={{ background: '#d1fae5', color: '#065f46', fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.5rem', borderRadius: '999px' }}>
                  {payout.status}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>
    </div>
  );
}
