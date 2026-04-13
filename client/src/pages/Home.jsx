import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

// Insert Cloudinary auto-format + auto-quality transforms
const cl = url => url.replace('/upload/', '/upload/f_auto,q_auto/');

const HERO_IMAGES = [
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052836/bittersweet-lemonade/2026/03/DSC_6354.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052809/bittersweet-lemonade/2025/10/DSC07731.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052811/bittersweet-lemonade/2025/10/DSC07740.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052812/bittersweet-lemonade/2025/10/DSC07742.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052964/bittersweet-lemonade/2026/03/DSC_6347.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052965/bittersweet-lemonade/2026/03/DSC_6348.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052828/bittersweet-lemonade/2026/03/DSC_6349.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052829/bittersweet-lemonade/2026/03/DSC_6350.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052831/bittersweet-lemonade/2026/03/DSC_6351.jpg',
  'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052832/bittersweet-lemonade/2026/03/DSC_6352.jpg',
];

const STATS = [
  { value: '$22,000+', label: 'Funds Raised & Donated' },
  { value: '40+',      label: 'Volunteer Members' },
  { value: '20+',      label: 'Sponsorships' },
  { value: '300+',     label: 'Attendees' },
];

const WHAT_WE_DO = [
  {
    image: 'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052807/bittersweet-lemonade/2025/10/DSC07724.jpg',
    title: 'Annual Charity Concert',
    desc: 'Every summer, we host a lawn concert showcasing youth performers from our community.',
  },
  {
    image: 'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052815/bittersweet-lemonade/2025/10/Bittersweet-Lemonade-Cheque-Presentation.jpg',
    title: 'Fundraising & Donation',
    desc: 'All proceeds go directly to the Richmond Hospital Foundation.',
  },
  {
    image: 'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052964/bittersweet-lemonade/2026/03/DSC_6347.jpg',
    title: 'Empowering Youth Musicians',
    desc: 'We give young musicians across Vancouver a stage to share their talents.',
  },
  {
    image: 'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052836/bittersweet-lemonade/2026/03/IMG_1554.jpg',
    title: 'Bringing Music to People',
    desc: 'From traditional to contemporary, our program celebrates music from around the world.',
  },
];

// Lazy-loaded hero slideshow — only loads images as they become active
function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(new Set([0]));
  const timer = useRef(null);

  const goTo = (idx) => {
    clearInterval(timer.current);
    setCurrent(idx);
    setLoaded(s => new Set([...s, idx]));
    startTimer();
  };

  const startTimer = () => {
    timer.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % HERO_IMAGES.length;
        setLoaded(s => new Set([...s, next]));
        return next;
      });
    }, 4000);
  };

  useEffect(() => {
    startTimer();
    return () => clearInterval(timer.current);
  }, []);

  return (
    <>
      {HERO_IMAGES.map((src, i) => (
        <div
          key={src}
          className="hero-slide"
          style={{
            backgroundImage: loaded.has(i) ? `url(${cl(src)})` : undefined,
            opacity: i === current ? 1 : 0,
          }}
        />
      ))}
      <div className="hero-overlay" />
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

// Reveal-on-scroll wrapper
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return (
    <div
      ref={ref}
      className={`reveal${visible ? ' revealed' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : {}}
    >
      {children}
    </div>
  );
}

// Schema.org JSON-LD for Organization
function SchemaOrg() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'schema-org-org';
    script.text = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'Bittersweet Lemonade Association',
      url: 'https://www.bittersweet-lemonade.com',
      logo: 'https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png',
      description:
        'A student-led nonprofit organization dedicated to bringing youth together through music and charity concerts, donating proceeds to the Richmond Hospital Foundation.',
      foundingDate: '2021',
      sameAs: ['https://www.instagram.com/bittersweetlemonade.official/'],
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Richmond',
        addressRegion: 'BC',
        addressCountry: 'CA',
      },
      email: 'info@bittersweet-lemonade.com',
      knowsAbout: ['Music', 'Charity', 'Youth Programs', 'Community Events', 'Concerts'],
    });
    const existing = document.getElementById('schema-org-org');
    if (existing) existing.remove();
    document.head.appendChild(script);
    return () => {
      const s = document.getElementById('schema-org-org');
      if (s) s.remove();
    };
  }, []);
  return null;
}

export default function Home() {
  return (
    <>
      <Meta
        description="Bittersweet Lemonade is a student-led nonprofit in Richmond, BC bringing youth together through charity concerts and music events, donating to the Richmond Hospital Foundation."
        path="/"
      />
      <SchemaOrg />

      {/* Hero */}
      <section className="hero">
        <HeroSlideshow />
        <div className="hero-content">
          <img
            src={cl('https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png')}
            alt="Bittersweet Lemonade Association"
            style={{ height: 90, width: 'auto', marginBottom: '1.5rem' }}
          />
          <h1>Life is Full of Colours</h1>
          <p>
            The Bittersweet Lemonade Association is a registered student led nonprofit organization dedicated to bringing young people together through a shared love of music. We believe that music has the power to connect hearts, inspire kindness, and strengthen our community.
          </p>
          <div className="hero-cta">
            <Link to="/blog" className="btn btn-primary">See What's New</Link>
            <Link to="/team" className="btn btn-secondary">Meet Our Team</Link>
          </div>
        </div>
      </section>

      {/* Mission Banner */}
      <div style={{ background: 'var(--lemon)', padding: '1.5rem var(--side-padding)', textAlign: 'center' }}>
        <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', letterSpacing: '0.03em', color: 'var(--text)' }}>
          🎵 &nbsp; Student Led · Nonprofit · Community Driven · Since 2021 &nbsp; 🎵
        </p>
      </div>

      {/* What We Do */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header" style={{ textAlign: 'center' }}>
            <h2>What We Do</h2>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1.5rem' }}>
            {WHAT_WE_DO.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div style={{ background: 'var(--white)', border: '1.5px solid var(--border)', overflow: 'hidden' }}>
                  <div style={{ width: '100%', aspectRatio: '16/9', overflow: 'hidden' }}>
                    <img
                      src={cl(item.image)}
                      alt={item.title}
                      loading="lazy"
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  </div>
                  <div style={{ padding: '1.25rem 1.5rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{item.title}</h3>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 0 }}>{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="section" style={{ background: 'var(--text)', color: 'var(--white)' }}>
        <div className="container">
          <Reveal>
            <p style={{ textAlign: 'center', fontWeight: 700, fontSize: '1rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--lemon)', marginBottom: '2.5rem' }}>
              Since 2021, we have been actively involved in performances, community events, and meaningful initiatives that reflect our passion for music and service.
            </p>
          </Reveal>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 900, color: 'var(--lemon)', marginBottom: '0.4rem' }}>{stat.value}</div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: 'rgba(255,255,255,0.7)' }}>{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Join Us */}
      <section className="section section-gray">
        <div className="container" style={{ textAlign: 'center', maxWidth: 700, margin: '0 auto' }}>
          <Reveal>
            <h2>We Would Love to Have You Join Us</h2>
            <p style={{ color: 'var(--text-muted)', margin: '1rem auto 2rem', lineHeight: 1.8 }}>
              Whether you play an instrument, sing, dance, enjoy public speaking, help with event organization, or have other talents to share, there is a place for you here. We would love for you to join us and become part of our community.
            </p>
            <Link to="/contact" className="btn btn-primary">
              Get in Touch
            </Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
