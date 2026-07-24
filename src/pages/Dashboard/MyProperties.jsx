import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, useReducedMotion } from 'framer-motion';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { fetchProperties } from '../../services/propertyService';
import { featuredProperties } from '../../data/featuredProperties';
import '../../styles/dashboard.css';

export default function MyProperties({ defaultFilter = 'all' }) {
  const shouldReduceMotion = useReducedMotion();
  const location = useLocation();
  const [properties, setProperties] = useState(featuredProperties);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(defaultFilter);
  const [searchQuery, setSearchQuery] = useState('');

  // Update active tab if URL path changes (e.g., /dashboard/drafts vs /dashboard/properties)
  useEffect(() => {
    if (location.pathname.includes('drafts')) setActiveTab('draft');
    else if (location.pathname.includes('pending')) setActiveTab('pending');
    else if (location.pathname.includes('sold')) setActiveTab('sold');
    else setActiveTab('all');
  }, [location.pathname]);

  useEffect(() => {
    let active = true;
    const loadProperties = async () => {
      setLoading(true);
      try {
        const data = await fetchProperties();
        if (active && data.length > 0) {
          setProperties(data);
        }
      } catch {
        // Fall back to seed properties
      } finally {
        if (active) setLoading(false);
      }
    };
    loadProperties();
    return () => { active = false; };
  }, []);

  const filteredProperties = properties.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (!matchesSearch) return false;
    if (activeTab === 'all') return true;
    if (activeTab === 'published' || activeTab === 'live') return p.status === 'For Sale' || p.status === 'For Rent';
    if (activeTab === 'draft') return p.status === 'Draft' || p.tag === 'Draft';
    if (activeTab === 'pending') return p.status === 'Pending';
    if (activeTab === 'sold') return p.status === 'Sold';
    return true;
  });

  return (
    <div className="agent-my-properties">
      <motion.section
        className="dashboard-page-header"
        initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}
      >
        <div>
          <p className="dashboard-breadcrumb">Dashboard &gt; My Properties</p>
          <h1>My Properties</h1>
        </div>
        <Link to="/dashboard/add-property" className="button button-primary">➕ Add New Property</Link>
      </motion.section>

      {/* Filter and Search Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div className="hero-tab-bar" style={{ background: 'white' }}>
          {[
            { id: 'all', label: 'All Listings' },
            { id: 'published', label: 'Live' },
            { id: 'draft', label: 'Drafts' },
            { id: 'pending', label: 'Pending' },
            { id: 'sold', label: 'Sold' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div style={{ minWidth: '240px' }}>
          <input
            type="text"
            placeholder="Filter properties..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              padding: '0.65rem 1rem',
              borderRadius: '999px',
              border: '1px solid #cbd5e1',
              width: '100%',
              outline: 'none',
              fontSize: '0.9rem'
            }}
          />
        </div>
      </div>

      {/* Properties Grid */}
      {loading ? (
        <p>Loading your properties...</p>
      ) : filteredProperties.length > 0 ? (
        <motion.div
          className="properties-grid featured-grid"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          {filteredProperties.map((property) => (
            <PropertyCard key={property.id} {...property} />
          ))}
        </motion.div>
      ) : (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', background: 'white', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
          <h3>No properties found</h3>
          <p style={{ color: '#64748b', margin: '0.5rem 0 1.5rem' }}>You don't have any properties matching this filter yet.</p>
          <Link to="/dashboard/add-property" className="button button-primary">List a Property Now</Link>
        </div>
      )}
    </div>
  );
}
