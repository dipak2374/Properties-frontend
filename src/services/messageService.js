import api from './api';

export const fetchMessages = async () => {
  const response = await api.get('/messages');
  return response.data;
};

export const sendMessage = async (payload) => {
  const response = await api.post('/messages', payload);
  return response.data;
};
