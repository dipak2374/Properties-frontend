import { useEffect } from 'react';

/**
 * SEOHead Component for dynamically managing document title, meta descriptions, and Open Graph tags.
 * 
 * @param {Object} props
 * @param {string} props.title - Title of the page
 * @param {string} [props.description] - Description for meta tag
 * @param {string} [props.ogType] - Open Graph type (e.g. 'website', 'article')
 * @param {string} [props.ogImage] - Open Graph image URL
 */
export default function SEOHead({
  title = 'PropertyHub - Find Your Dream Home',
  description = 'PropertyHub is the premier platform to buy, sell, and rent luxury homes, modern apartments, and prime real estate.',
  ogType = 'website',
  ogImage = '/images/hero-bg.jpg',
}) {
  useEffect(() => {
    const fullTitle = title.includes('PropertyHub') ? title : `${title} | PropertyHub`;
    document.title = fullTitle;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.setAttribute('name', 'description');
      document.head.appendChild(metaDesc);
    }
    metaDesc.setAttribute('content', description);

    // Update OG Title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', fullTitle);

    // Update OG Description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description);

    // Update OG Type
    let ogTypeMeta = document.querySelector('meta[property="og:type"]');
    if (!ogTypeMeta) {
      ogTypeMeta = document.createElement('meta');
      ogTypeMeta.setAttribute('property', 'og:type');
      document.head.appendChild(ogTypeMeta);
    }
    ogTypeMeta.setAttribute('content', ogType);

    // Update OG Image
    let ogImgMeta = document.querySelector('meta[property="og:image"]');
    if (!ogImgMeta) {
      ogImgMeta = document.createElement('meta');
      ogImgMeta.setAttribute('property', 'og:image');
      document.head.appendChild(ogImgMeta);
    }
    ogImgMeta.setAttribute('content', ogImage);
  }, [title, description, ogType, ogImage]);

  return null;
}
