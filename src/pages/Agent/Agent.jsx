import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import PageLoader from '../../components/Common/PageLoader';
import { featuredProperties } from '../../data/featuredProperties';
import { defaultAgents } from '../../data/agentsData';
import { fetchAgents, resolveUserAssetUrl } from '../../services/userService';
import { fetchProperties } from '../../services/propertyService';
import NotFound from '../NotFound/NotFound';
import '../../styles/pages.css';

export default function Agent() {
  const { id } = useParams();
  const [agent, setAgent] = useState(null);
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    const loadAgentAndProperties = async () => {
      setLoading(true);
      try {
        const numericId = parseInt(id, 10);
        if (Number.isInteger(numericId) && String(numericId) === id) {
          // STATIC AGENT FALLBACK
          const staticAgent = defaultAgents.find((a) => a.id === numericId);
          if (active) {
            setAgent(staticAgent || null);
            setProperties(featuredProperties.slice(0, 4));
          }
        } else {
          // LIVE DB AGENT FLOW
          const liveAgents = await fetchAgents();
          const found = liveAgents.find((a) => String(a._id || a.id) === id);
          
          if (found && active) {
            const formatted = {
              id: found._id || found.id,
              name: found.name || 'Property Agent',
              title: found.title || (found.role === 'seller' ? 'Certified Agent' : found.role ? found.role.charAt(0).toUpperCase() + found.role.slice(1) : 'Property Specialist'),
              properties: Number.isFinite(Number(found.propertyCount)) ? `${found.propertyCount} Properties` : '15+ Properties',
              experience: found.experience || '5+ Years Experience',
              sold: found.sold || '120+ Properties Sold',
              rating: found.rating || '98% Client Satisfaction',
              clients: found.clients || '180+ Happy Clients',
              location: found.location || 'United States',
              email: found.email || '',
              phone: found.phone || '+1 555-0100',
              image: resolveUserAssetUrl(found.profilePicture || found.avatar) || 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80',
              description: found.description || 'Verified real estate professional with a passion for helping clients navigate the property market and find their dream home.',
            };
            setAgent(formatted);

            // Fetch live properties from backend API and filter by this agent
            try {
              const allProperties = await fetchProperties();
              const agentProps = allProperties.filter((p) => String(p.ownerId) === String(found._id || found.id));
              setProperties(agentProps);
            } catch (propErr) {
              console.error('Error fetching agent properties', propErr);
            }
          }
        }
      } catch (err) {
        console.error('Error loading agent profile', err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadAgentAndProperties();
    return () => {
      active = false;
    };
  }, [id]);

  if (loading) {
    return <PageLoader label="Loading Agent Profile…" />;
  }

  if (!agent) {
    return <NotFound />;
  }

  return (
    <div className="page-shell agent-page">
      <main className="page-content">
        <section className="agent-hero">
          <div className="agent-profile-card">
            <div className="agent-profile-top">
              <div className="agent-profile-image" style={{ backgroundImage: `url(${agent.image})` }} />
              <div>
                <p className="agent-badge">Verified Agent</p>
                <h1>{agent.name}</h1>
                <p>{agent.title}</p>
                <p className="agent-location">{agent.location}</p>
              </div>
            </div>

            <div className="agent-details">
              <p>{agent.description}</p>

              <div className="agent-stats">
                <div className="agent-stat">
                  <strong>{agent.experience?.split(' ')[0] || '5+'}</strong>
                  <span>{agent.experience?.substring(agent.experience.indexOf(' ') + 1) || 'Years Experience'}</span>
                </div>
                <div className="agent-stat">
                  <strong>{agent.sold?.split(' ')[0] || '100+'}</strong>
                  <span>{agent.sold?.substring(agent.sold.indexOf(' ') + 1) || 'Properties Sold'}</span>
                </div>
                <div className="agent-stat">
                  <strong>{agent.rating?.split(' ')[0] || '98%'}</strong>
                  <span>{agent.rating?.substring(agent.rating.indexOf(' ') + 1) || 'Satisfaction'}</span>
                </div>
                <div className="agent-stat">
                  <strong>{agent.clients?.split(' ')[0] || '150+'}</strong>
                  <span>{agent.clients?.substring(agent.clients.indexOf(' ') + 1) || 'Happy Clients'}</span>
                </div>
              </div>
            </div>
          </div>

          <aside className="agent-contact-card">
            <h2>Contact Agent</h2>
            <div className="contact-form">
              <input type="text" placeholder="Your Name" aria-label="Your Name" />
              <input type="email" placeholder="Your Email" aria-label="Your Email" />
              <input type="tel" placeholder="Phone Number" aria-label="Phone Number" />
              <textarea placeholder="Your Message" aria-label="Your Message" />
              <button type="button" className="button button-primary">Send Message</button>
            </div>
            <div className="agent-contact-details">
              {agent.email && (
                <>
                  <p><strong>Email</strong></p>
                  <p>{agent.email}</p>
                </>
              )}
              {agent.phone && (
                <>
                  <p><strong>Phone</strong></p>
                  <p>{agent.phone}</p>
                </>
              )}
            </div>
          </aside>
        </section>

        <section className="agent-properties">
          <div className="section-headline">
            <h2>Properties Listed by {agent.name.split(' ')[0]}</h2>
            <a href="/properties">View All Properties</a>
          </div>
          <div className="properties-grid">
            {properties.length > 0 ? (
              properties.map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))
            ) : (
              <p style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: '#64748b', fontSize: '1.1rem' }}>
                This agent does not have any active property listings at the moment.
              </p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
}
