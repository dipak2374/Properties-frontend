import { motion, useReducedMotion } from 'framer-motion';
import '../../styles/home.css';
import '../../styles/pages.css';

const plans = [
  { name: 'Starter', price: '$49', description: 'Perfect for first-time buyers wanting curated listings and wishlist tools.', perks: ['Up to 5 saved searches', 'Basic support', 'Property alerts'] },
  { name: 'Growth', price: '$99', description: 'Ideal for active buyers who need deeper visibility and stronger guidance.', perks: ['Unlimited saved searches', 'Priority scheduling', 'Agent consultation'] },
  { name: 'Premium', price: '$199', description: 'Best for investors and professionals wanting advanced planning and concierge support.', perks: ['Everything in Growth', 'Advanced analytics', 'Dedicated account manager'] },
];

export default function Pricing() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Pricing</p>
            <h1>Flexible Plans</h1>
            <p>Choose a plan that fits your real estate journey, whether you’re buying your first home or managing multiple investments.</p>
          </div>
        </motion.section>

        <div className="pricing-grid">
          {plans.map((plan, index) => (
            <motion.article key={plan.name} className="pricing-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3, delay: index * 0.06 }}>
              <h3>{plan.name}</h3>
              <p className="pricing-description">{plan.description}</p>
              <div className="pricing-price">{plan.price}<span>/month</span></div>
              <ul>
                {plan.perks.map((perk) => <li key={perk}>{perk}</li>)}
              </ul>
              <button type="button" className="button button-primary">Get Started</button>
            </motion.article>
          ))}
        </div>
      </main>
    </div>
  );
}
