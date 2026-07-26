import api from './api';

/**
 * Sign in with email + password.
 * Calls POST /api/auth/login on the real server.
 * Throws a clear error if credentials are wrong — NO fake fallback.
 */
export const signIn = async (credentials) => {
  try {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      (error?.code === 'ERR_NETWORK'
        ? 'Unable to connect to the server. Please check your internet connection and try again.'
        : 'Login failed. Please try again.');
    throw new Error(message);
  }
};

/**
 * Register a new account.
 * Calls POST /api/auth/register and saves the user in MongoDB.
 * Throws a clear error if email is already taken — NO fake fallback.
 */
export const signUp = async (payload) => {
  try {
    const config = payload instanceof FormData
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : undefined;
    const response = await api.post('/auth/register', payload, config);
    return response.data;
  } catch (error) {
    const message =
      error?.response?.data?.message ||
      (error?.code === 'ERR_NETWORK'
        ? 'Unable to connect to the server. Please check your internet connection and try again.'
        : 'Registration failed. Please try again.');
    throw new Error(message);
  }
};
