import { useState, useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import CategoryCard from '../../components/CategoryCard/CategoryCard';
import PopularLocations from '../../components/Home/PopularLocations';
import PlatformStats from '../../components/Home/PlatformStats';
import WhyChooseUs from '../../components/Home/WhyChooseUs';
import Testimonials from '../../components/Home/Testimonials';
import PartnerLogos from '../../components/Home/PartnerLogos';
import BlogPreview from '../../components/Home/BlogPreview';
import NewsletterCTA from '../../components/Home/NewsletterCTA';
import DownloadApp from '../../components/Home/DownloadApp';
import FeaturedAgents from '../../components/Home/FeaturedAgents';
import { fetchFeaturedProperties } from '../../services/propertyService';
import { featuredProperties as propertySeed } from '../../data/featuredProperties';
import { staggerContainer, staggerItem } from '../../components/Common/AnimatedPrimitives';
import SEOHead from '../../components/Common/SEOHead';
import '../../styles/home.css';

const categories = [
  { icon: '🏢', label: 'Apartment', count: 1245 },
  { icon: '🏡', label: 'Villa', count: 842 },
  { icon: '🏠', label: 'House', count: 617 },
  { icon: '🏬', label: 'Office', count: 430 },
  { icon: '🛒', label: 'Shop', count: 316 },
  { icon: '🌳', label: 'Land', count: 298 },
];

const heroFeatures = [
  {
    icon: '👤',
    title: 'Trusted Agents',
    description: 'Connect with verified and trusted agents.',
  },
  {
    icon: '🏘️',
    title: 'Wide Range of Properties',
    description: 'Choose from thousands of properties across the city.',
  },
  {
    icon: '🔒',
    title: 'Easy & Safe Process',
    description: 'We make the process smooth, secure and transparent.',
  },
];

const tabs = [
  { id: 'buy', label: 'Buy' },
  { id: 'rent', label: 'Rent' },
  { id: 'pg', label: 'PG' },
];

export default function Home() {
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [activeTab, setActiveTab] = useState('buy');
  const [searchTerm, setSearchTerm] = useState('');
  const [propertyType, setPropertyType] = useState('All Type');
  const [minPrice, setMinPrice] = useState('$ Min');
  const [maxPrice, setMaxPrice] = useState('$ Max');
  const [properties, setProperties] = useState(propertySeed); // start with static seed
  const [loadingProperties, setLoadingProperties] = useState(true);

  // Fetch live data from MongoDB on mount
  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        const data = await fetchFeaturedProperties(6);
        if (!cancelled && data.length > 0) setProperties(data);
      } catch {
        // silently fall back to static seed data
      } finally {
        if (!cancelled) setLoadingProperties(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, []);

  const handleSearch = (event) => {
    event?.preventDefault();

    const params = new URLSearchParams();
    if (searchTerm.trim()) params.set('search', searchTerm.trim());
    if (propertyType !== 'All Type') params.set('type', propertyType);
    if (minPrice !== '$ Min') params.set('minPrice', minPrice.replace(/[₹$,]/g, ''));
    if (maxPrice !== '$ Max') params.set('maxPrice', maxPrice.replace(/[₹$,]/g, ''));

    if (activeTab === 'buy') params.set('listingType', 'For Sale');
    if (activeTab === 'rent') params.set('listingType', 'For Rent');
    if (activeTab === 'pg') params.set('listingType', 'PG');

    navigate(`/properties?${params.toString()}`);
  };

  // Filter live/seed properties by active tab
  const visibleProperties = properties.filter((property) => {
    if (activeTab === 'buy') return property.tag === 'For Sale';
    if (activeTab === 'rent') return property.tag === 'For Rent';
    return property.tag === 'PG' || property.listingType === 'PG' || property.type === 'PG';
  });

  return (
    <div className="page-shell home-page">
      <SEOHead title="PropertyHub - Find Your Dream Home & Luxury Real Estate" description="Explore luxury homes, modern apartments, villas, and prime real estate listings on PropertyHub." />
      <main className="main-hero home-hero">
        <motion.section
          className="hero-grid"
          initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="hero-copy" variants={staggerContainer} initial={shouldReduceMotion ? false : 'hidden'} animate={shouldReduceMotion ? undefined : 'visible'}>
            <motion.span className="badge" variants={staggerItem} transition={{ duration: 0.35 }}>✨ #1 Real Estate Platform</motion.span>
            <motion.h1 variants={staggerItem} transition={{ duration: 0.4 }}>Find Your Dream Property</motion.h1>
            <motion.p variants={staggerItem} transition={{ duration: 0.4 }}>Explore the best properties around you and find a place you’ll love to live.</motion.p>
            <motion.div className="hero-tab-bar" variants={staggerItem} transition={{ duration: 0.4 }}>
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  type="button"
                  className={`tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => {
                    setActiveTab(tab.id);
                  }}
                  whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }}
                  whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }}
                >
                  {tab.label}
                </motion.button>
              ))}
            </motion.div>
            <form className="hero-actions" onSubmit={handleSearch}>
              <motion.div className="search-panel hero-search-panel" variants={staggerItem} transition={{ duration: 0.45 }}>
                <div className="search-row">
                  <label htmlFor="hero-search-input" className="sr-only">Search by city, locality or property</label>
                  <motion.input
                    id="hero-search-input"
                    type="text"
                    placeholder="Search by city, locality or property"
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    initial={shouldReduceMotion ? false : { opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.24, duration: 0.4 }}
                  />
                  <motion.button type="submit" whileHover={shouldReduceMotion ? undefined : { scale: 1.04 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.96 }} transition={{ duration: 0.3 }}>Search</motion.button>
                </div>
                <div className="search-options">
                  <motion.div className="option-group" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.4 }}>
                    <label htmlFor="home-property-type-select">Property Type</label>
                    <select id="home-property-type-select" value={propertyType} onChange={(event) => setPropertyType(event.target.value)}>
                      <option>All Type</option>
                      <option>Apartment</option>
                      <option>Villa</option>
                      <option>House</option>
                      <option>Office</option>
                    </select>
                  </motion.div>
                  <motion.div className="option-group" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.32, duration: 0.4 }}>
                    <label htmlFor="home-min-price-select">Min Price</label>
                    <select id="home-min-price-select" value={minPrice} onChange={(event) => setMinPrice(event.target.value)}>
                      <option>$ Min</option>
                      <option>$500</option>
                      <option>$1,000</option>
                      <option>$2,000</option>
                    </select>
                  </motion.div>
                  <motion.div className="option-group" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.36, duration: 0.4 }}>
                    <label htmlFor="home-max-price-select">Max Price</label>
                    <select id="home-max-price-select" value={maxPrice} onChange={(event) => setMaxPrice(event.target.value)}>
                      <option>$ Max</option>
                      <option>$3,000</option>
                      <option>$5,000</option>
                      <option>$1,000,000</option>
                    </select>
                  </motion.div>
                </div>
              </motion.div>
            </form>
          </motion.div>

          <motion.div
            className="hero-preview hero-image-preview"
            initial={shouldReduceMotion ? false : { opacity: 0, x: 20, scale: 0.98 }}
            animate={shouldReduceMotion ? { opacity: 1, x: 0, scale: 1 } : { opacity: 1, x: 0, scale: [1, 1.01, 1], y: [0, -4, 0] }}
            transition={shouldReduceMotion ? { delay: 0.2, duration: 0.6 } : { delay: 0.2, duration: 0.6, repeat: Infinity, repeatType: 'mirror', ease: 'easeInOut' }}
          >
            <motion.div className="preview-overlay" initial={shouldReduceMotion ? false : { opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.28, duration: 0.45 }}>
              <span>Featured Listing</span>
              <h2>Modern Family Apartment</h2>
              <p>Located in the heart of the city with premium amenities and easy access.</p>
              <motion.button type="button" className="button button-primary" onClick={handleSearch} whileHover={shouldReduceMotion ? undefined : { scale: 1.05 }} whileTap={shouldReduceMotion ? undefined : { scale: 0.95 }} transition={{ duration: 0.3 }}>Search</motion.button>
            </motion.div>
          </motion.div>
        </motion.section>

        <section className="feature-grid">
          {heroFeatures.map((item, index) => (
            <motion.div key={item.title} className="feature-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: index * 0.06 }}>
              <div className="feature-icon">{item.icon}</div>
              <div>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
              </div>
            </motion.div>
          ))}
        </section>

        <section>
          <div className="section-headline">
            <h2>Popular Categories</h2>
            <Link to="/properties">View All</Link>
          </div>
          <div className="categories-grid">
            {categories.map((item) => (
              <CategoryCard key={item.label} icon={item.icon} label={item.label} count={item.count} />
            ))}
          </div>
        </section>

        <section>
          <div className="section-headline">
            <h2>Featured Properties</h2>
            <Link to="/properties">See All Properties</Link>
          </div>
          <div className="properties-grid featured-grid">
            {loadingProperties ? (
              [1,2,3].map((n) => (
                <div key={n} className="property-card skeleton-card" aria-hidden="true">
                  <div className="skeleton skeleton-img" />
                  <div className="skeleton skeleton-text" />
                  <div className="skeleton skeleton-text short" />
                </div>
              ))
            ) : visibleProperties.length > 0 ? (
              visibleProperties.slice(0, 3).map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))
            ) : (
              <p className="no-results">No properties found. Run the seed script to populate your database!</p>
            )}
          </div>
        </section>

        <WhyChooseUs />
        <PopularLocations />
        <FeaturedAgents />
        <PlatformStats />
        <Testimonials />
        <PartnerLogos />
        <BlogPreview />
        <DownloadApp />
        <NewsletterCTA />
      </main>
    </div>
  );
}
