import api from './api';

export const resolveUserAssetUrl = (url) => {
  if (!url || /^https?:\/\//i.test(url)) {
    return url;
  }

  const apiOrigin = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5005/api').replace(/\/api\/?$/, '');
  return `${apiOrigin}${url.startsWith('/') ? url : `/${url}`}`;
};

export const fetchUser = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const fetchUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const fetchAgents = async () => {
  try {
    const response = await api.get('/users', { params: { role: 'seller' } });
    const users = response.data?.users || response.data || [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

export const fetchAdmins = async () => {
  try {
    const response = await api.get('/users', { params: { role: 'admin' } });
    const users = response.data?.users || response.data || [];
    return Array.isArray(users) ? users : [];
  } catch {
    return [];
  }
};

export const updateUserProfilePicture = async (userId, profilePicture) => {
  const response = await api.patch(`/users/${userId}/profile-picture`, { profilePicture });
  return response.data;
};
