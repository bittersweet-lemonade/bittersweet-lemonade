import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const HERO_IMAGES = [
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052807/bittersweet-lemonade/2025/10/DSC07724.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052809/bittersweet-lemonade/2025/10/DSC07731.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052811/bittersweet-lemonade/2025/10/DSC07740.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052812/bittersweet-lemonade/2025/10/DSC07742.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052964/bittersweet-lemonade/2026/03/DSC_6347.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052828/bittersweet-lemonade/2026/03/DSC_6349.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052831/bittersweet-lemonade/2026/03/DSC_6351.jpg',
];

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const timer = useRef(null);

  const goTo = (idx) => {
    clearInterval(timer.current);
    setCurrent(idx);
    startTimer();
  };

  const startTimer = () => {
    timer.current = setInterval(() => {
      setCurrent(c => (c + 1) % HERO_IMAGES.length);
    }, 5000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timer.current);
  }, []);

  return (
    <>
      {/* All slides stacked — CSS opacity crossfade */}
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="hero-slide"
          style={{ backgroundImage: `url(${src})`, opacity: i === current ? 1 : 0 }}
        />
      ))}
      {/* Dark overlay on top of slides */}
      <div className="hero-overlay" />
      {/* Dot indicators */}
      <div className="hero-dots">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`hero-dot${i === current ? ' active' : ''}`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [gallery, setGallery] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch('/api/posts').then(r => r.json()),
      fetch('/api/gallery').then(r => r.json()),
    ])
      .then(([postsData, galleryData]) => {
        setPosts(postsData.slice(0, 3));
        setGallery(galleryData.slice(0, 6));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading…</div>;

  return (
    <>
      {/* Hero */}
      <section className="hero">
        <HeroSlideshow />
        <div className="hero-content">
          <img
            src="https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png"
            alt="Bittersweet Lemonade Association"
            style={{ height: 90, width: 'auto', marginBottom: '1.5rem' }}
          />
          <h1>Bittersweet Lemonade Association</h1>
          <p>
            A registered student-led non-profit dedicated to bringing young people together through a shared love of music. We believe music has the power to connect hearts, inspire kindness, and strengthen our community.
          </p>
          <div className="hero-cta">
            <Link to="/about" className="btn btn-primary">About Us</Link>
            <Link to="/contact" className="btn btn-secondary">Get Involved</Link>
          </div>
        </div>
      </section>

      {/* Mission Banner */}
      <div style={{ background: 'var(--lemon)', padding: '1.5rem var(--side-padding)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', letterSpacing: '0.03em', color: 'var(--text)' }}>
          🎵 &nbsp; Student-Led · Non-Profit · Community Driven &nbsp; 🎵
        </p>
      </div>

      {/* Feature Strip */}
      {gallery.length >= 3 && (
        <div className="feature-strip">
          {gallery.slice(0, 3).map(img => (
            <Link to="/gallery" key={img.id} className="feature-item">
              <img src={img.src} alt={img.alt} loading="lazy" />
              <div className="feature-overlay">
                <span>View Gallery</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Mission Section */}
      <section className="section section-gray">
        <div className="container" style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
          <div className="section-header">
            <h2>Our Mission</h2>
          </div>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.8, color: 'var(--text-mid)' }}>
            The Bittersweet Lemonade Association is a registered student-led non-profit organization dedicated to bringing young people together through a shared love of music. We believe that music has the power to connect hearts, inspire kindness, and strengthen our community.
          </p>
          <div style={{ marginTop: '2.5rem', display: 'flex', gap: '2rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            {[
              { icon: '🎵', label: 'Community Events' },
              { icon: '🤝', label: 'Youth Outreach' },
              { icon: '🎓', label: 'Music Education' },
              { icon: '💛', label: 'Student-Led' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center', minWidth: 120 }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.icon}</div>
                <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'var(--lemon-dark)' }}>{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Latest News */}
      <section className="section">
        <div className="container">
          <div className="section-header">
            <h2>Latest News</h2>
            <p>Stay up to date with everything happening at the Bittersweet Lemonade Association.</p>
          </div>

          <div className="posts-grid">
            {posts.map(post => (
              <article key={post.id} className="post-card">
                {post.featuredImage && (
                  <div className="post-card-image">
                    <img src={post.featuredImage} alt={post.title} loading="lazy" />
                  </div>
                )}
                <div className="post-card-body">
                  <div className="post-card-meta">{post.category} · {new Date(post.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  <h3>{post.title}</h3>
                  <p>{post.excerpt}</p>
                  <Link to={`/blog/${post.slug}`} className="post-card-link">Read More →</Link>
                </div>
              </article>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginTop: '3rem' }}>
            <Link to="/blog" className="btn btn-primary">All Posts</Link>
          </div>
        </div>
      </section>

      {/* Gallery Teaser */}
      {gallery.length >= 6 && (
        <section className="section section-dark">
          <div className="container">
            <div className="section-header">
              <h2>Gallery</h2>
              <p>Moments from our events, performances, and community programs.</p>
            </div>
            <div className="gallery-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)' }}>
              {gallery.slice(0, 6).map(img => (
                <Link to="/gallery" key={img.id} className="gallery-item">
                  <img src={img.src} alt={img.alt} loading="lazy" />
                </Link>
              ))}
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <Link to="/gallery" className="btn btn-secondary">View All Photos</Link>
            </div>
          </div>
        </section>
      )}

      {/* Get Involved CTA */}
      <section className="section section-gray">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Get Involved</h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: 520, margin: '0 auto 2rem' }}>
            Whether you're a musician, music lover, or just want to be part of something meaningful — there's a place for you in our community.
          </p>
          <Link to="/contact" className="btn btn-primary">Contact Us</Link>
        </div>
      </section>
    </>
  );
}
