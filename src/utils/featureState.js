const STORAGE_KEYS = {
  compare: 'propertyhub-compare',
  recent: 'propertyhub-recently-viewed',
  searches: 'propertyhub-saved-searches',
  notifications: 'propertyhub-notifications',
};

const readStored = (key, fallback = []) => {
  if (typeof window === 'undefined') {
    return fallback;
  }

  try {
    const storedValue = window.localStorage.getItem(key);
    return storedValue ? JSON.parse(storedValue) : fallback;
  } catch {
    return fallback;
  }
};

const writeStored = (key, value) => {
  if (typeof window === 'undefined') {
    return value;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
  return value;
};

export const getCompareItems = () => readStored(STORAGE_KEYS.compare, []);
export const saveCompareItems = (items) => writeStored(STORAGE_KEYS.compare, items);
export const clearCompareItems = () => writeStored(STORAGE_KEYS.compare, []);
export const toggleCompareProperty = (property) => {
  const items = getCompareItems();
  const exists = items.some((item) => item.id === property.id);
  const nextItems = exists ? items.filter((item) => item.id !== property.id) : [...items, property].slice(0, 4);
  saveCompareItems(nextItems);
  return { isCompared: !exists, items: nextItems };
};
export const isPropertyCompared = (id) => getCompareItems().some((item) => item.id === Number(id));

export const getRecentlyViewed = () => readStored(STORAGE_KEYS.recent, []);
export const recordRecentlyViewed = (property) => {
  const existing = getRecentlyViewed().filter((item) => item.id !== property.id);
  const next = [property, ...existing].slice(0, 6);
  return writeStored(STORAGE_KEYS.recent, next);
};

export const getSavedSearches = () => readStored(STORAGE_KEYS.searches, []);
export const saveSavedSearch = (label, filters) => {
  const searches = getSavedSearches();
  const next = [{ id: Date.now(), label, filters }, ...searches].slice(0, 6);
  return writeStored(STORAGE_KEYS.searches, next);
};

export const getNotifications = () => readStored(STORAGE_KEYS.notifications, []);
export const addNotification = (notification) => {
  const notifications = getNotifications();
  const next = [{ id: Date.now(), createdAt: new Date().toISOString(), read: false, ...notification }, ...notifications].slice(0, 8);
  return writeStored(STORAGE_KEYS.notifications, next);
};
export const markNotificationRead = (id) => {
  const notifications = getNotifications().map((notification) => (notification.id === id ? { ...notification, read: true } : notification));
  return writeStored(STORAGE_KEYS.notifications, notifications);
};
export const clearNotifications = () => writeStored(STORAGE_KEYS.notifications, []);

export const showToast = (message, type = 'info') => {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent('propertyhub:toast', { detail: { message, type } }));
};
