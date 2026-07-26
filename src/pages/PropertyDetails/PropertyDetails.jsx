import { motion, useReducedMotion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import PropertyCard from '../../components/PropertyCard/PropertyCard';
import { featuredProperties, getPropertyById } from '../../data/featuredProperties';
import { fetchPropertyById, fetchProperties } from '../../services/propertyService';
import { fetchPropertyReviews } from '../../services/reviewService';
import PageLoader from '../../components/Common/PageLoader';
import SEOHead from '../../components/Common/SEOHead';
import '../../styles/pages.css';

const galleryImages = [
  'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1460317442991-0ec209397118?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=1200&q=80',
];

const staticPlaceholderReviews = [
  { name: 'Nina R.', title: 'Great location', body: 'The home felt bright, well maintained, and easy to show to our family.' },
  { name: 'Chris P.', title: 'Excellent communication', body: 'The agent followed up promptly and helped us understand the market clearly.' },
];

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const shouldReduceMotion = useReducedMotion();
  const [copied, setCopied] = useState(false);
  const [property, setProperty] = useState(() => getPropertyById(id));
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [showAgentInfo, setShowAgentInfo] = useState(false);
  const [shared, setShared] = useState(false);
  const [activeReviews, setActiveReviews] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [similarProperties, setSimilarProperties] = useState([]);

  const allImages = useMemo(() => {
    const mainImg = property?.image;
    const extraImgs = property?.images?.length ? property.images : galleryImages;
    const combined = mainImg ? [mainImg, ...extraImgs] : extraImgs;
    return Array.from(new Set(combined));
  }, [property]);

  const activeMainImage = selectedImage || property?.image || allImages[0];

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      try {
        setLoading(true);
        let propData = getPropertyById(id);
        if (!propData) {
          propData = await fetchPropertyById(id);
        }
        
        if (!cancelled) {
          if (propData && propData.title) {
            setProperty(propData);
            const reviewData = await fetchPropertyReviews(id);
            if (!cancelled) {
              setActiveReviews(reviewData);
            }
          } else {
            setNotFound(true);
          }
        }
      } catch {
        if (!cancelled) setNotFound(true);
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    load();
    return () => { cancelled = true; };
  }, [id]);

  // Fetch similar properties from live API, fall back to static seed
  useEffect(() => {
    let cancelled = false;
    const loadSimilar = async () => {
      try {
        const allProps = await fetchProperties();
        const liveSimilar = allProps
          .filter((p) => String(p.id) !== String(id))
          .filter((p) => p.type === property?.type || p.location?.includes(property?.location?.split(',')[0]))
          .slice(0, 3);
        if (!cancelled) {
          setSimilarProperties(
            liveSimilar.length > 0
              ? liveSimilar
              : featuredProperties.filter((item) => String(item.id) !== String(id)).slice(0, 3)
          );
        }
      } catch {
        if (!cancelled) {
          setSimilarProperties(featuredProperties.filter((item) => String(item.id) !== String(id)).slice(0, 3));
        }
      }
    };
    if (property) loadSimilar();
    return () => { cancelled = true; };
  }, [id, property]);

  if (loading) {
    return <PageLoader label="Loading property…" />;
  }

  if (notFound || !property) {
    return (
      <div className="page-shell">
        <SEOHead title="Property Not Found" description="The requested property listing was not found." />
        <main className="page-content">
          <h1>Property not found</h1>
          <p>The listing you are looking for does not exist or has been removed.</p>
          <button className="button button-primary" type="button" onClick={() => navigate('/properties')}>
            Back to Listings
          </button>
        </main>
      </div>
    );
  }

  const shareListing = async () => {
    setShared(true);
    if (navigator.share) {
      await navigator.share({ title: property.title, text: `Check out ${property.title} at ${property.location}` });
      return;
    }
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1400);
    }
  };

  return (
    <div className="page-shell">
      <SEOHead
        title={`${property.title} - ${property.location}`}
        description={`${property.title} in ${property.location}. Price: ${property.price}. ${property.beds} Beds, ${property.baths} Baths.`}
        ogImage={property.image}
      />
      <main className="page-content">
        <section className="property-detail-grid">
          <div className="property-detail-gallery">
            <motion.div
              key={activeMainImage}
              className="property-detail-image"
              style={{ backgroundImage: `url(${activeMainImage})` }}
              initial={shouldReduceMotion ? false : { opacity: 0.7, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.25 }}
            />
            <div className="property-gallery-grid">
              {allImages.map((img, index) => (
                <img
                  key={`${img}-${index}`}
                  src={img}
                  alt={`Property gallery thumbnail ${index + 1}`}
                  loading="lazy"
                  className={img === activeMainImage ? 'active-thumbnail' : ''}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
            </div>
          </div>
          <div className="property-detail-info">
            <motion.div className="detail-header" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
              <div className="detail-agent-summary">
                <h1>{property.title}</h1>
                <p className="property-location">{property.location}</p>
              </div>
              <div className="detail-price">
                <strong>{property.price}</strong>
                <p>{property.beds} Beds · {property.baths} Baths · {property.area}</p>
              </div>
            </motion.div>

            <motion.div className="detail-description" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.06 }}>
              <h2>Property Overview</h2>
              <p>{property.description}</p>
            </motion.div>

            <motion.div className="detail-agent-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.12 }}>
              <div>
                <h3>Agent</h3>
                <p>{property.agent}</p>
                <p>{property.rating} ★</p>
              </div>
              {!showAgentInfo && (
                <div className="detail-actions">
                  {!shared && (
                    <button type="button" className="button button-secondary" onClick={shareListing}>{copied ? 'Copied' : 'Share'}</button>
                  )}
                  <button type="button" className="button button-primary" onClick={() => setShowAgentInfo(true)}>Contact Agent</button>
                  <Link
                    to={`/appointment?propertyId=${id}`}
                    className="button button-secondary detail-visit-button"
                  >
                    Book a Visit
                  </Link>
                </div>
              )}
              {showAgentInfo && (
                <div className="detail-agent-contact">
                  <p style={{ margin: '0 0 0.5rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span role="img" aria-label="email">📧</span> 
                    <a href={`mailto:${property.agentEmail}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{property.agentEmail}</a>
                  </p>
                  <p style={{ margin: '0', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span role="img" aria-label="phone">📞</span> 
                    <a href={`tel:${property.agentPhone}`} style={{ color: '#2563eb', textDecoration: 'none' }}>{property.agentPhone}</a>
                  </p>
                </div>
              )}
            </motion.div>

            <motion.div className="detail-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.24 }}>
              <h3>Mortgage Estimate</h3>
              <div className="mortgage-grid">
                <div className="mortgage-row"><span>Loan amount</span><strong>$8,40,000</strong></div>
                <div className="mortgage-row"><span>Interest</span><strong>7.2%</strong></div>
                <div className="mortgage-row"><span>Monthly estimate</span><strong>$58,400</strong></div>
              </div>
            </motion.div>
          </div>
        </section>

        <motion.section className="detail-card reviews-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35 }}>
          <div className="section-headline">
            <h2>Reviews & Ratings</h2>
            <span className="badge">{property.rating} ★ · {activeReviews.length > 0 ? activeReviews.length : staticPlaceholderReviews.length} Reviews</span>
          </div>
          <div className="review-grid">
            {activeReviews.length > 0 ? (
              activeReviews.map((review) => (
                <div key={review._id || review.id} className="review-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <h4 style={{ margin: 0 }}>{review.user?.name || 'Anonymous User'}</h4>
                    <span style={{ fontSize: '0.9rem', color: '#f5a623' }}>{review.rating} ★</span>
                  </div>
                  <p>{review.comment}</p>
                </div>
              ))
            ) : (
              staticPlaceholderReviews.map((review) => (
                <div key={review.name} className="review-card">
                  <h4>{review.name}</h4>
                  <p className="review-title">{review.title}</p>
                  <p>{review.body}</p>
                </div>
              ))
            )}
          </div>
        </motion.section>

        <motion.section className="detail-card similar-card" initial={shouldReduceMotion ? false : { opacity: 0, y: 18 }} whileInView={shouldReduceMotion ? undefined : { opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.35, delay: 0.05 }}>
          <div className="section-headline">
            <h2>Similar Properties</h2>
            <Link to="/properties" className="section-link">View listing</Link>
          </div>
          <div className="properties-grid featured-grid">
            {similarProperties.map((item) => (
              <PropertyCard key={item.id} {...item} />
            ))}
          </div>
        </motion.section>
      </main>
    </div>
  );
}
