import { useEffect, useState, useCallback } from 'react';

const CATEGORIES = [
  { key: 'all', label: 'All' },
  { key: 'performance', label: 'Performances' },
  { key: 'band', label: 'Band' },
  { key: 'events', label: 'Events' },
  { key: 'behind-the-scenes', label: 'Behind the Scenes' },
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [category, setCategory] = useState('all');
  const [loading, setLoading] = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then(data => { setImages(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (category === 'all') {
      setFiltered(images);
    } else {
      setFiltered(images.filter(img => img.category === category));
    }
    setLightboxIdx(null);
  }, [category, images]);

  const openLightbox = (idx) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = useCallback(() => setLightboxIdx(i => (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const nextImage = useCallback(() => setLightboxIdx(i => (i + 1) % filtered.length), [filtered.length]);

  useEffect(() => {
    const handler = (e) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowLeft') prevImage();
      if (e.key === 'ArrowRight') nextImage();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [lightboxIdx, prevImage, nextImage]);

  return (
    <>
      <div className="page-header">
        <h1>Gallery</h1>
        <p>Photos from our performances, events, and more</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="gallery-filters">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                className={`filter-btn${category === cat.key ? ' active' : ''}`}
                onClick={() => setCategory(cat.key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading gallery…</div>
          ) : (
            <div className="gallery-grid">
              {filtered.map((img, idx) => (
                <div key={img.id} className="gallery-item" onClick={() => openLightbox(idx)}>
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && filtered[lightboxIdx] && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>✕</button>
          <button className="lightbox-prev" onClick={e => { e.stopPropagation(); prevImage(); }}>‹</button>
          <img
            className="lightbox-img"
            src={filtered[lightboxIdx].src}
            alt={filtered[lightboxIdx].alt}
            onClick={e => e.stopPropagation()}
          />
          <button className="lightbox-next" onClick={e => { e.stopPropagation(); nextImage(); }}>›</button>
        </div>
      )}
    </>
  );
}
