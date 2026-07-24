import { useState, useEffect } from 'react';
import AgentCard from '../../components/AgentCard/AgentCard';
import Breadcrumbs from '../../components/Common/Breadcrumbs';
import PageLoader from '../../components/Common/PageLoader';
import { fetchAgents, resolveUserAssetUrl } from '../../services/userService';
import SEOHead from '../../components/Common/SEOHead';
import '../../styles/pages.css';

const defaultAgents = [
  {
    id: 1,
    name: 'Michael Johnson',
    title: 'Senior Property Consultant',
    properties: '24 Properties',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 2,
    name: 'Sarah Williams',
    title: 'Luxury Home Specialist',
    properties: '18 Properties',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 3,
    name: 'David Brown',
    title: 'Commercial Property Agent',
    properties: '32 Properties',
    image: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 4,
    name: 'Alicia Williams',
    title: 'Rental Property Expert',
    properties: '20 Properties',
    image: 'https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 5,
    name: 'Christopher Lee',
    title: 'Investment Property Advisor',
    properties: '16 Properties',
    image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 6,
    name: 'Olivia Martinez',
    title: 'First-time Buyer Specialist',
    properties: '12 Properties',
    image: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=800&q=80',
  },
];

export default function Agents() {
  const [agentsList, setAgentsList] = useState(defaultAgents);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadAgentsData = async () => {
      setLoading(true);
      try {
        const liveAgents = await fetchAgents();
        if (active && liveAgents && liveAgents.length > 0) {
          const formatted = liveAgents.map((a, idx) => ({
            id: a._id || a.id || idx + 1,
            name: a.name || 'Property Agent',
            title: a.title || (a.role === 'seller' ? 'Certified Agent' : a.role ? a.role.charAt(0).toUpperCase() + a.role.slice(1) : 'Property Specialist'),
            properties: Number.isFinite(Number(a.propertyCount)) ? `${a.propertyCount} Properties` : '15+ Properties',
            image: resolveUserAssetUrl(a.profilePicture || a.avatar) || defaultAgents[idx % defaultAgents.length].image,
          }));
          setAgentsList(formatted);
        }
      } catch {
        // use default static seed on failure
      } finally {
        if (active) setLoading(false);
      }
    };

    loadAgentsData();
    return () => { active = false; };
  }, []);

  if (loading) {
    return <PageLoader label="Loading Agents…" />;
  }

  return (
    <div className="page-shell agents-page">
      <SEOHead title="Our Agents - Meet Real Estate Professionals" description="Connect with top real estate agents and specialists to buy, sell, or rent property." />
      <main className="page-content">
        <section className="agents-intro">
          <div className="section-headline">
            <div>
              <Breadcrumbs />
              <h1>Meet Our Agents</h1>
            </div>
            <p>Browse trusted agents who can help you find the right property and secure the best deal.</p>
          </div>
        </section>

        <section className="agents-grid">
          {agentsList.map((agent) => (
            <AgentCard key={agent.id} {...agent} />
          ))}
        </section>
      </main>
    </div>
  );
}
