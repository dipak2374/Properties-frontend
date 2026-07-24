import api from './api';

export const fetchPayments = async () => {
  const response = await api.get('/payments');
  return response.data;
};

export const createPayment = async (payload) => {
  const response = await api.post('/payments', payload);
  return response.data;
};
