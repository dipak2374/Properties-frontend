import { motion, useReducedMotion } from 'framer-motion';
import { Link } from 'react-router-dom';

export default function AgentCard({ id, name, title, properties, image, phone, email }) {
  const shouldReduceMotion = useReducedMotion();

  const profilePath = id ? `/agent/${id}` : '/agents';

  return (
    <motion.div
      className="agent-card"
      initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
      whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={shouldReduceMotion ? undefined : { y: -8, boxShadow: '0 20px 40px rgba(15, 23, 42, 0.12)' }}
    >
      <div className="agent-card-image-wrapper">
        <motion.div 
          className="agent-image" 
          style={{ backgroundImage: `url(${image})` }} 
          whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }} 
          transition={{ duration: 0.3 }} 
        />
        {properties ? <div className="agent-properties-badge">{properties}</div> : null}
      </div>
      
      <div className="agent-card-info">
        <h4>{name}</h4>
        <p className="agent-title">{title}</p>
        
        <div className="agent-contact">
          {email && (
            <a className="agent-contact-link" href={`mailto:${email}`} aria-label={`Email ${name}`}>
              📧 {email}
            </a>
          )}
          {phone && (
            <a className="agent-contact-link" href={`tel:${phone}`} aria-label={`Call ${name}`}>
              📞 {phone}
            </a>
          )}
        </div>
      </div>
      
      <div className="agent-card-actions">
        <Link className="btn btn-primary btn-full" to={profilePath}>
          View Profile
        </Link>
      </div>
    </motion.div>
  );
}
