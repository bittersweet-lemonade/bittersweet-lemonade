import { useEffect, useState, useCallback } from 'react';
import Meta from '../components/Meta';

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
}

export default function Gallery() {
  const [images, setImages]           = useState<GalleryImage[]>([]);
  const [loading, setLoading]         = useState(true);
  const [lightboxIdx, setLightboxIdx] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/gallery')
      .then(r => r.json())
      .then((data: GalleryImage[]) => { setImages(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const openLightbox  = (idx: number) => setLightboxIdx(idx);
  const closeLightbox = () => setLightboxIdx(null);
  const prevImage = useCallback(() => setLightboxIdx(i => i === null ? null : (i - 1 + images.length) % images.length), [images.length]);
  const nextImage = useCallback(() => setLightboxIdx(i => i === null ? null : (i + 1) % images.length), [images.length]);

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
      <Meta
        title="Gallery"
        description="Photos from Bittersweet Lemonade's annual charity concerts, performances, and community events in Vancouver, BC."
        image="https://drive.google.com/thumbnail?id=1YI3yf6dtFv5eSISJdDWvYSB5Mv7fDKBw&sz=w1600"
        path="/gallery"
        breadcrumb="Gallery"
      />
      <div className="page-header">
        <h1>Gallery</h1>
        <p>Photos from our performances, events, and more</p>
      </div>

      <section className="py-20 px-[4vw]">
        <div className="max-w-[1200px] mx-auto">

          {loading ? (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="aspect-square skeleton" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-3">
              {images.map((img, idx) => (
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
      {lightboxIdx !== null && images[lightboxIdx] && (
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
            src={images[lightboxIdx].src}
            alt={images[lightboxIdx].alt}
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
