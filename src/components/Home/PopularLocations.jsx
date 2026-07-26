import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { popularLocations } from '../../data/homeMockData';

export default function PopularLocations() {
  return (
    <section className="locations-section">
      <div className="section-headline">
        <h2>Popular Locations</h2>
        <Link to="/properties">Explore More Cities</Link>
      </div>
      <div className="locations-grid">
        {popularLocations.map((loc, i) => (
          <motion.div 
            key={loc.id} 
            className="location-card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            whileHover={{ y: -5, scale: 1.02 }}
          >
            <Link to={`/properties?search=${encodeURIComponent(loc.city)}`} style={{ textDecoration: 'none', color: 'inherit', display: 'block', height: '100%' }}>
              <img
                src={loc.image}
                alt={loc.city}
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="location-overlay">
                <h3>{loc.city}</h3>
                <p>{loc.properties} Properties</p>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
