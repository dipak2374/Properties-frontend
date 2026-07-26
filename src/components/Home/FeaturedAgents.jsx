import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import AgentCard from '../AgentCard/AgentCard';
import { fetchAgents, resolveUserAssetUrl } from '../../services/userService';
import { defaultAgents } from '../../data/agentsData';

const fallbackAgents = defaultAgents.slice(0, 4).map((a) => ({
  id: a.id,
  name: a.name,
  role: a.title,
  image: a.image,
  phone: a.phone,
  email: a.email,
}));

export default function FeaturedAgents() {
  const [agents, setAgents] = useState([]);

  useEffect(() => {
    let active = true;

    const loadAgents = async () => {
      try {
        const live = await fetchAgents();
        if (!active) return;
        const formatted = (live || []).slice(0, 4).map((a, idx) => ({
          id: a._id || a.id || `agent-${idx}`,
          name: a.name || a.username || `Agent ${idx + 1}`,
          role: a.title || a.role || 'Agent',
          image: resolveUserAssetUrl(a.profilePicture || a.avatar || a.image),
          phone: a.phone || a.mobile || a.contactNumber || '',
          email: a.email || a.username || '',
        }));

        if (formatted.length === 0) {
          setAgents(fallbackAgents);
        } else {
          setAgents(formatted);
        }
      } catch (err) {
        setAgents(fallbackAgents);
      }
    };

    loadAgents();
    return () => { active = false; };
  }, []);

  return (
    <section className="featured-agents-section">
      <div className="section-headline">
        <h2>Meet Our Top Agents</h2>
        <Link to="/agents">View All Agents</Link>
      </div>
      <div className="agents-grid">
        {agents.map((agent, i) => (
          <motion.div
            key={agent.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.08 }}
          >
            <AgentCard id={agent.id} name={agent.name} title={agent.role} properties={''} image={agent.image} phone={agent.phone} email={agent.email} />
          </motion.div>
        ))}
      </div>
    </section>
  );
}
