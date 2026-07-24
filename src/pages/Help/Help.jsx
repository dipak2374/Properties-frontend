import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';
import '../../styles/pages.css';

const topics = [
  {
    question: 'How do I contact an agent?',
    answer: 'Open any property detail page and use the contact form to send a message directly to the listed agent.',
  },
  {
    question: 'How can I save properties?',
    answer: 'Click the heart icon on any property card to add it to your wishlist for easy reference later.',
  },
  {
    question: 'How do I schedule a viewing?',
    answer: 'Visit the appointment page or message the agent through the property details to request a viewing date.',
  },
  {
    question: 'How can I change my account information?',
    answer: 'Go to your profile page and update your name, email, or preferences from the account settings section.',
  },
];

export default function Help() {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell help-page">
      <main className="page-content">
        <motion.section
          className="page-head"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35 }}
        >
          <div>
            <p className="breadcrumb">Home / Help Center</p>
            <h1>Help Center</h1>
            <p>Find answers to common questions, learn how PropertyHub works, and get support fast.</p>
          </div>
        </motion.section>

        <section className="help-topics">
          {topics.map((topic) => (
            <motion.div
              key={topic.question}
              className="help-topic-card"
              initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.32 }}
            >
              <h3>{topic.question}</h3>
              <p>{topic.answer}</p>
            </motion.div>
          ))}
        </section>

        <section className="help-actions">
          <h2>Still need help?</h2>
          <p>Send us a message or browse our FAQs for more details.</p>
          <div className="help-action-buttons">
            <Link to="/contact" className="button button-primary">Contact Support</Link>
            <Link to="/faqs" className="button button-secondary">View FAQs</Link>
          </div>
        </section>
      </main>
    </div>
  );
}
