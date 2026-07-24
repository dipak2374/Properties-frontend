import { motion, useReducedMotion } from 'framer-motion';
import '../../styles/home.css';
import '../../styles/pages.css';

export default function Terms() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / Terms & Conditions</p>
            <h1>Terms & Conditions</h1>
            <p>These terms outline your responsibilities when using PropertyHub and the services we provide.</p>
          </div>
        </motion.section>

        <motion.article className="policy-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <p>By accessing or using PropertyHub, you agree to comply with these terms and uphold the community standards expected of our users.</p>
          <p>You may use the platform for lawful purposes only and agree not to misuse listings, personal data, or account access. PropertyHub reserves the right to remove content or accounts that violate these terms.</p>
          <p>We may update these terms from time to time, and continued use of the platform means you accept the latest version.</p>
        </motion.article>
      </main>
    </div>
  );
}
