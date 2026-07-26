import api from './api';

// Normalize a MongoDB property document to match the shape PropertyCard expects
export const normalizeProperty = (p) => ({
  id: p._id,
  tag: p.listingType === 'For Rent' || p.listingType === 'Rent'
    ? 'For Rent'
    : p.listingType === 'PG'
      ? 'PG'
      : 'For Sale',
  title: p.title,
  location: p.location
    ? `${p.location.city || ''}, ${p.location.state || ''}`.replace(/^, |, $/, '')
    : '',
  price: p.price ? `$${Number(p.price).toLocaleString()}` : 'N/A',
  beds: p.bedrooms ?? 0,
  baths: p.bathrooms ?? 0,
  area: p.areaSqFt ? `${p.areaSqFt} Sq Ft` : '',
  agent: p.owner?.name || 'PropertyHub Agent',
  agentEmail: p.owner?.email || 'contact@propertyhub.com',
  agentPhone: p.owner?.phone || '+1 800-000-0000',
  ownerId: p.owner?._id || p.owner,
  rating: p.rating ?? 4.5,
  type: p.propertyType || '',
  listingType: p.listingType || 'Sale',
  image: p.images?.[0] || 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800',
  description: p.description || '',
});

// Fetch all properties (with optional query params)
export const fetchProperties = async (params = {}) => {
  const response = await api.get('/properties', { params });
  const raw = response.data?.properties || response.data || [];
  return raw.map(normalizeProperty);
};

// Fetch a single property by ID
export const fetchPropertyById = async (id) => {
  const response = await api.get(`/properties/${id}`);
  const raw = response.data?.property || response.data;
  return normalizeProperty(raw);
};

// Fetch featured / latest properties for the Home page
export const fetchFeaturedProperties = async (limit = 6) => {
  const response = await api.get('/properties', { params: { limit, sort: '-createdAt' } });
  const raw = response.data?.properties || response.data || [];
  return raw.slice(0, limit).map(normalizeProperty);
};

// Create a new property listing (agent/seller)
export const createProperty = async (payload) => {
  const response = await api.post('/properties', payload);
  return response.data;
};
