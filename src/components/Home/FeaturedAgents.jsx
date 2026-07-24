import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import AgentCard from '../AgentCard/AgentCard';
import { fetchAgents, resolveUserAssetUrl } from '../../services/userService';

const fallbackAgents = [
  { id: 'mock-1', name: 'David Smith', role: 'Senior Agent', image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=200&q=80' },
  { id: 'mock-2', name: 'Jessica Alba', role: 'Property Consultant', image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80' },
  { id: 'mock-3', name: 'Michael Jordan', role: 'Real Estate Broker', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=200&q=80' },
  { id: 'mock-4', name: 'Emily Blunt', role: 'Listing Specialist', image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80' },
];

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
        <a href="/agents">View All Agents</a>
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
