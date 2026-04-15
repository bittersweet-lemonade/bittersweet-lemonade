import { useEffect } from 'react';

const SITE = 'Bittersweet Lemonade';
const SITE_URL = 'https://www.bittersweet-lemonade.com';
const DEFAULT_DESC =
  'Student-led nonprofit in Vancouver, BC — uniting the community through annual charity concerts and donating all proceeds to the Richmond Hospital Foundation.';
// Wide concert shot used as the default social preview
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto,w_1200,h_630,c_fill,g_auto/v1776052836/bittersweet-lemonade/2026/03/DSC_6354.jpg';

interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
  breadcrumb?: string; // human-readable page name for BreadcrumbList
}

export default function Meta({ title, description, image, path = '/', breadcrumb }: MetaProps) {
  const fullTitle = title
    ? `${title} | ${SITE}`
    : `${SITE} — Student-Led Nonprofit Music Association`;
  const desc = description ?? DEFAULT_DESC;
  const img = image ?? DEFAULT_IMAGE;
  const url = `${SITE_URL}${path}`;

  useEffect(() => {
    document.title = fullTitle;
    set('name', 'description', desc);
    set('property', 'og:title', fullTitle);
    set('property', 'og:description', desc);
    set('property', 'og:image', img);
    set('property', 'og:image:width', '1200');
    set('property', 'og:image:height', '630');
    set('property', 'og:url', url);
    set('property', 'og:type', 'website');
    set('property', 'og:site_name', SITE);
    set('name', 'twitter:card', 'summary_large_image');
    set('name', 'twitter:title', fullTitle);
    set('name', 'twitter:description', desc);
    set('name', 'twitter:image', img);

    // Canonical
    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = url;

    // BreadcrumbList for inner pages
    const SCRIPT_ID = 'schema-breadcrumb';
    document.getElementById(SCRIPT_ID)?.remove();
    if (breadcrumb) {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.id = SCRIPT_ID;
      script.text = JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: breadcrumb, item: url },
        ],
      });
      document.head.appendChild(script);
    }

    return () => { document.getElementById(SCRIPT_ID)?.remove(); };
  }, [fullTitle, desc, img, url, breadcrumb]);

  return null;
}

function set(attr: string, name: string, content: string) {
  let el = document.querySelector<HTMLMetaElement>(`meta[${attr}="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}
