import { motion, useReducedMotion } from 'framer-motion';
import '../../styles/home.css';
import '../../styles/pages.css';

export default function Privacy() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Privacy Policy</p>
            <h1>Privacy Policy</h1>
            <p>We respect your privacy and explain how we collect, use, and protect your information.</p>
          </div>
        </motion.section>

        <motion.article className="policy-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p>PropertyHub collects information necessary to provide the property search, booking, and communication services available on this website. We use the data to improve your experience, personalize recommendations, and protect the platform from abuse.</p>
          <p>We do not sell personal information to third parties. Some service providers may process data on our behalf for analytics, hosting, support, and communications.</p>
          <p>You can contact us at any time if you would like to review, update, or delete your account information.</p>
        </motion.article>
      </main>
    </div>
  );
}
