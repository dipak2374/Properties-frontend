import { motion, useReducedMotion } from 'framer-motion';

export default function AgentCard({ id, name, title, properties, image, phone, email }) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <motion.div
      className="agent-card"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.35 }}
      whileHover={shouldReduceMotion ? undefined : { y: -4, scale: 1.01 }}
      whileTap={shouldReduceMotion ? undefined : { scale: 0.985 }}
    >
      <motion.div className="agent-image" style={{ backgroundImage: `url(${image})` }} whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} transition={{ duration: 0.3 }} />
      <div>
        <h4>{name}</h4>
        <p>{title}</p>
        <div className="agent-contact">
          {email && <a className="agent-email" href={`mailto:${email}`} aria-label={`Email ${name}`}>{email}</a>}
          {phone && <a className="agent-phone" href={`tel:${phone}`} aria-label={`Call ${name}`}>{phone}</a>}
        </div>
      </div>
      <span>{properties}</span>
      <div className="agent-actions">
        {email ? (
          <a className="btn btn-small" href={`mailto:${email}?subject=Inquiry%20about%20property`} rel="noopener noreferrer">Contact</a>
        ) : (
          <a className="btn btn-small" href={`/agents/${id}`} rel="noopener noreferrer">Contact</a>
        )}
      </div>
    </motion.div>
  );
}
