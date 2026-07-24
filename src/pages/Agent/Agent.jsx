import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { featuredProperties } from '../../data/featuredProperties';
import '../../styles/pages.css';

const agent = {
  name: 'Michael Johnson',
  title: 'Senior Property Consultant',
  location: 'New York, USA',
  experience: '8+ Years Experience',
  sold: '320+ Properties Sold',
  rating: '98% Client Satisfaction',
  clients: '450+ Happy Clients',
  email: 'michael.johnson@propertyhub.com',
  phone: '+1 (212) 555-0189',
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=800&q=80',
  description:
    'Michael Johnson is a dedicated real estate professional with a passion for helping clients navigate the property market. He specializes in residential and investment properties, offering expert advice and personalized solutions.',
};

export default function Agent() {
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
                  <strong>8+</strong>
                  <span>Years Experience</span>
                </div>
                <div className="agent-stat">
                  <strong>320+</strong>
                  <span>Properties Sold</span>
                </div>
                <div className="agent-stat">
                  <strong>98%</strong>
                  <span>Client Satisfaction</span>
                </div>
                <div className="agent-stat">
                  <strong>450+</strong>
                  <span>Happy Clients</span>
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
              <p><strong>Email</strong></p>
              <p>{agent.email}</p>
              <p><strong>Phone</strong></p>
              <p>{agent.phone}</p>
            </div>
          </aside>
        </section>

        <section className="agent-properties">
          <div className="section-headline">
            <h2>Properties Listed by Michael</h2>
            <a href="/properties">View All Properties</a>
          </div>
          <div className="properties-grid">
            {featuredProperties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
