import { useEffect } from 'react';

const SITE = 'Bittersweet Lemonade';
const SITE_URL = 'https://www.bittersweet-lemonade.com';
const DEFAULT_DESC =
  'Bittersweet Lemonade is a student-led nonprofit bringing youth together through music and charity concerts in Richmond, BC, donating to the Richmond Hospital Foundation.';
const DEFAULT_IMAGE =
  'https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png';

interface MetaProps {
  title?: string;
  description?: string;
  image?: string;
  path?: string;
}

export default function Meta({ title, description, image, path = '/' }: MetaProps) {
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
    set('property', 'og:url', url);
    set('property', 'og:type', 'website');
    set('property', 'og:site_name', SITE);
    set('name', 'twitter:card', 'summary_large_image');
    set('name', 'twitter:title', fullTitle);
    set('name', 'twitter:description', desc);
    set('name', 'twitter:image', img);
  }, [fullTitle, desc, img, url]);

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
