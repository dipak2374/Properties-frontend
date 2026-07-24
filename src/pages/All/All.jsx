import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { featuredProperties } from '../../data/featuredProperties';
import '../../styles/pages.css';

const highlights = [
  { title: 'Modern Listings', description: 'Browse curated homes and workspaces from top-rated agents.' },
  { title: 'Smart Filters', description: 'Refine by type, bedrooms, and price in seconds.' },
  { title: 'Instant Viewing', description: 'Jump straight to a detailed view with a single click.' },
];

export default function All() {
  const animatedProperties = useMemo(() => featuredProperties.map((property, index) => ({ ...property, index })), []);

  return (
    <div className="page-shell">
      <main className="main-hero">
        <section className="page-head all-page-head">
          <div>
            <p className="breadcrumb">Home / All</p>
            <h1>Explore Everything</h1>
            <p>Discover a complete view of all featured properties, from homes to premium offices, with smooth animated presentation.</p>
          </div>
          <Link to="/properties" className="button button-primary">Go to Properties</Link>
        </section>

        <section className="all-hero-card">
          <div className="all-hero-copy">
            <span className="badge">Animated Experience</span>
            <h2>Browse all options with a polished, responsive layout.</h2>
            <p>Find your next opportunity using a full-screen view of premium listings and quick highlights.</p>
          </div>
          <div className="all-highlight-grid">
            {highlights.map((item) => (
              <div key={item.title} className="all-highlight-card">
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="all-listing-section">
          <div className="section-headline">
            <h2>All Featured Properties</h2>
            <a href="/properties">View Filters</a>
          </div>
          <div className="properties-grid featured-grid">
            {animatedProperties.map((property) => (
              <div key={property.id} className={`animated-property-card delay-${(property.index % 3) + 1}`}>
                <PropertyCard {...property} />
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}
