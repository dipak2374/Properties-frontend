export const WISHLIST_STORAGE_KEY = 'propertyhub-wishlist';

function dispatchWishlistUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('wishlist:updated'));
  }
}

export function getWishlistItems() {
  if (typeof window === 'undefined' || !window.localStorage) {
    return [];
  }

  try {
    const storedValue = window.localStorage.getItem(WISHLIST_STORAGE_KEY);
    return storedValue ? JSON.parse(storedValue) : [];
  } catch {
    return [];
  }
}

export function saveWishlistItems(items) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return items;
  }

  window.localStorage.setItem(WISHLIST_STORAGE_KEY, JSON.stringify(items));
  dispatchWishlistUpdate();
  return items;
}

export function toggleWishlistProperty(property) {
  const currentItems = getWishlistItems();
  const exists = currentItems.some((item) => item.id === property.id);

  const nextItems = exists
    ? currentItems.filter((item) => item.id !== property.id)
    : [...currentItems, property];

  saveWishlistItems(nextItems);
  return { isSaved: !exists, items: nextItems };
}

export function isPropertySaved(id) {
  return getWishlistItems().some((item) => item.id === Number(id));
}
