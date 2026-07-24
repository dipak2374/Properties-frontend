import { useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import '../../styles/home.css';
import '../../styles/pages.css';

const entries = [
  { question: 'How quickly can I schedule a viewing?', answer: 'Most listings support a same-day or next-day viewing request, subject to availability.' },
  { question: 'Do you offer support for first-time buyers?', answer: 'Yes. Our team can guide you through pricing, documents, and the purchase journey from start to finish.' },
  { question: 'Can I save properties to my wishlist?', answer: 'Absolutely. You can bookmark any property and return to it later from your wishlist.' },
  { question: 'Is the mortgage calculator accurate?', answer: 'The calculator provides an estimate for planning purposes; final terms depend on your lender and profile.' },
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="page-shell">
      <main className="page-content">
        <motion.section className="page-head" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
          <div>
            <p className="breadcrumb">Home / FAQ</p>
            <h1>Frequently Asked Questions</h1>
            <p>Browse the most common answers about searching, scheduling, and managing your real estate experience.</p>
          </div>
        </motion.section>

        <div className="faq-list">
          {entries.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <motion.div key={item.question} className={`faq-item${isOpen ? ' open' : ''}`} initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.3 }}>
                <button type="button" className="faq-question" onClick={() => setOpenIndex(isOpen ? -1 : index)}>
                  <span>{item.question}</span>
                  <span>{isOpen ? '−' : '+'}</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen ? (
                    <motion.div initial={shouldReduceMotion ? false : { height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.24 }}>
                      <p className="faq-answer">{item.answer}</p>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
