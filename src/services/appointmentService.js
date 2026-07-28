import api from './api';

export const fetchAppointments = async () => {
  const response = await api.get('/appointments');
  return response.data;
};

export const bookAppointment = async (payload) => {
  const response = await api.post('/appointments', payload);
  return response.data;
};

export const updateAppointmentStatus = async (appointmentId, status) => {
  const response = await api.patch(`/appointments/${appointmentId}/status`, { status });
  return response.data;
};
