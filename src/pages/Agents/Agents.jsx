import { useState, useEffect } from 'react';
import AgentCard from '../../components/AgentCard/AgentCard';
import Breadcrumbs from '../../components/Common/Breadcrumbs';
import PageLoader from '../../components/Common/PageLoader';
import { fetchAgents, resolveUserAssetUrl } from '../../services/userService';
import SEOHead from '../../components/Common/SEOHead';
import { defaultAgents } from '../../data/agentsData';
import '../../styles/pages.css';

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
