import { useEffect, useState, useCallback } from 'react';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

interface Category {
  key: string;
  label: string;
}

const CATEGORIES: Category[] = [
  { key: 'all',                label: 'All' },
  { key: 'performance',        label: 'Performances' },
  { key: 'band',               label: 'Band' },
  { key: 'events',             label: 'Events' },
  { key: 'behind-the-scenes',  label: 'Behind the Scenes' },
];

export default function Gallery() {
  const [images, setImages]           = useState<GalleryImage[]>([]);
  const [filtered, setFiltered]       = useState<GalleryImage[]>([]);
  const [category, setCategory]       = useState('all');
  const [loading, setLoading]         = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then((data: GalleryImage[]) => { setImages(data); setFiltered(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    setFiltered(category === 'all' ? images : images.filter(img => img.category === category));
    setLightboxIdx(null);
  }, [category, images]);

  const openLightbox  = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = useCallback(() => setLightboxIdx(i => i === null ? null : (i - 1 + filtered.length) % filtered.length), [filtered.length]);
  const nextImage = useCallback(() => setLightboxIdx(i => i === null ? null : (i + 1) % filtered.length), [filtered.length]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape')     closeLightbox();
      if (e.key === 'ArrowLeft')  prevImage();
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

      <section className="py-20 px-[4vw]">
        <div className="max-w-[1200px] mx-auto">

          {/* Filters */}
          <div className="flex gap-2 flex-wrap justify-center mb-10">
            {CATEGORIES.map(cat => (
              <button
                key={cat.key}
                onClick={() => setCategory(cat.key)}
                className={`py-[0.5em] px-[1.4em] text-[0.78rem] font-bold uppercase tracking-[0.08em] border-2 cursor-pointer transition-all duration-200 ${
                  category === cat.key
                    ? 'bg-lemon text-ink border-lemon-dark'
                    : 'bg-transparent text-ink-muted border-brand-border hover:bg-lemon-mid hover:border-lemon-dark hover:text-ink'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="loading">Loading gallery…</div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
              {filtered.map((img, idx) => (
                <div
                  key={img.id}
                  className="overflow-hidden aspect-square cursor-pointer bg-lemon-mid border-[1.5px] border-brand-border group"
                  onClick={() => openLightbox(idx)}
                >
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover transition-all duration-300 group-hover:scale-[1.08] group-hover:opacity-90"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      {lightboxIdx !== null && filtered[lightboxIdx] && (
        <div
          className="fixed inset-0 bg-[rgba(26,20,0,0.97)] z-[1000] flex items-center justify-center"
          onClick={closeLightbox}
        >
          <button
            className="absolute top-6 right-6 text-lemon bg-transparent border-none text-[2rem] cursor-pointer leading-none"
            onClick={closeLightbox}
          >
            ✕
          </button>
          <button
            className="absolute top-1/2 left-4 -translate-y-1/2 text-lemon bg-[rgba(245,200,0,0.1)] border-none text-[2rem] py-2 px-4 cursor-pointer leading-none"
            onClick={e => { e.stopPropagation(); prevImage(); }}
          >
            ‹
          </button>
          <img
            className="max-w-[90vw] max-h-[90vh] object-contain border-2 border-lemon"
            src={filtered[lightboxIdx].src}
            alt={filtered[lightboxIdx].alt}
            onClick={e => e.stopPropagation()}
          />
          <button
            className="absolute top-1/2 right-4 -translate-y-1/2 text-lemon bg-[rgba(245,200,0,0.1)] border-none text-[2rem] py-2 px-4 cursor-pointer leading-none"
            onClick={e => { e.stopPropagation(); nextImage(); }}
          >
            ›
          </button>
        </div>
      )}
    </>
  );
}
