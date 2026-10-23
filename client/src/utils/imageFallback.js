// Graceful image fallback utility for Sree Sarees
export const FALLBACK_SAREE_IMAGE = '/images/saree-fallback.svg';

export const handleImageError = (e) => {
  if (e.target && !e.target.src.endsWith('/images/saree-fallback.svg')) {
    e.target.onerror = null; // Prevent infinite loop
    e.target.src = FALLBACK_SAREE_IMAGE;
  }
};
