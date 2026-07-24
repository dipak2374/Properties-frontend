import api from './api';

export const fetchReviews = async () => {
  const response = await api.get('/reviews');
  return response.data?.reviews || response.data || [];
};

export const fetchPropertyReviews = async (propertyId) => {
  const response = await api.get('/reviews');
  const allReviews = response.data?.reviews || response.data || [];
  return allReviews.filter(review => {
    const id = review.property?._id || review.property;
    return String(id) === String(propertyId);
  });
};
