import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api'}/contact`;

export const postContactMessage = async (contactData) => {
  try {
    const response = await axios.post(API_URL, contactData);
    return response.data;
  } catch (error) {
    // If backend endpoint is not set up, simulate success locally for demo purposes
    if (error.code === 'ERR_NETWORK' || error.response?.status === 404) {
      console.warn('Backend API endpoint not fully set up. Falling back to success simulation.', error);
      return { success: true, message: 'Simulated message transmission success.' };
    }
    throw error;
  }
};
