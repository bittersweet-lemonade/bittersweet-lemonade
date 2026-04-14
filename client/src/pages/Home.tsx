import { useEffect, useRef, useState, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import Meta from '../components/Meta';

const cl = (url: string) => url.replace('/upload/', '/upload/f_auto,q_auto/');

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

// Set to null to hide the banner when no upcoming event
const UPCOMING_EVENT = {
  label: 'Coming Soon',
  name: 'Our Next Event is in the Works',
  date: 'Details to be announced',
  cta: 'Stay Tuned',
  link: null as string | null, // set to ticket/RSVP URL once available
};

interface Stat { value: string; label: string; }
interface WhatWeDo { image: string; title: string; desc: string; }

const STATS: Stat[] = [
  { value: '$22,000+', label: 'Funds Raised & Donated' },
  { value: '40+',      label: 'Volunteer Members' },
  { value: '20+',      label: 'Sponsorships' },
  { value: '300+',     label: 'Attendees' },
];

const WHAT_WE_DO: WhatWeDo[] = [
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

function HeroSlideshow() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<Set<number>>(new Set([0]));
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    timer.current = setInterval(() => {
      setCurrent(c => {
        const next = (c + 1) % HERO_IMAGES.length;
        setLoaded(s => new Set([...s, next]));
        return next;
      });
    }, 4000);
  };

  const goTo = (idx: number) => {
    if (timer.current) clearInterval(timer.current);
    setCurrent(idx);
    setLoaded(s => new Set([...s, idx]));
    startTimer();
  };

  useEffect(() => {
    startTimer();
    return () => { if (timer.current) clearInterval(timer.current); };
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
      <div className="absolute inset-0 bg-ink/55 pointer-events-none" />
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-[2]">
        {HERO_IMAGES.map((_, i) => (
          <button
            key={i}
            className={`w-[10px] h-[10px] rounded-full border-2 p-0 cursor-pointer transition-all duration-200 ${
              i === current
                ? 'bg-lemon border-lemon'
                : 'bg-transparent border-white/70 hover:border-white'
            }`}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
          />
        ))}
      </div>
    </>
  );
}

interface RevealProps {
  children: ReactNode;
  delay?: number;
  className?: string;
}

function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
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
    document.getElementById('schema-org-org')?.remove();
    document.head.appendChild(script);
    return () => { document.getElementById('schema-org-org')?.remove(); };
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
      <section className="relative min-h-[80vh] flex items-center overflow-hidden bg-ink">
        <HeroSlideshow />
        <div className="relative z-[1] py-16 px-[4vw] max-w-[900px]">
          <img
            src={cl('https://res.cloudinary.com/dx8zth9lo/image/upload/v1776052842/bittersweet-lemonade/2025/02/BittersweetLemonadeLogopng.png')}
            alt="Bittersweet Lemonade Association"
            className="h-[90px] w-auto mb-6"
          />
          <h1 className="text-lemon-bright mb-4 [text-shadow:0_2px_12px_rgba(0,0,0,0.6)]">
            Life is Full of Colours
          </h1>
          <p className="text-[rgba(255,243,163,0.9)] text-[1.1rem] max-w-[600px] mb-8">
            The Bittersweet Lemonade Association is a registered student led nonprofit organization dedicated to bringing young people together through a shared love of music. We believe that music has the power to connect hearts, inspire kindness, and strengthen our community.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link to="/blog" className="btn-primary">See What's New</Link>
            <Link to="/team" className="btn-secondary">Meet Our Team</Link>
          </div>
        </div>
      </section>

      {/* Upcoming event banner */}
      {UPCOMING_EVENT && (
        <div className="bg-ink border-b-[3px] border-lemon px-[4vw] py-5">
          <div className="max-w-[1200px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4 text-center sm:text-left">
              <span className="hidden sm:block text-[0.7rem] font-bold uppercase tracking-[0.12em] text-lemon bg-lemon/15 px-3 py-1 rounded-sm shrink-0">
                {UPCOMING_EVENT.label}
              </span>
              <div>
                <p className="font-bold text-lemon-bright text-[1rem] mb-0 leading-tight">{UPCOMING_EVENT.name}</p>
                <p className="text-[0.82rem] text-[rgba(255,243,163,0.7)] mb-0 mt-0.5">{UPCOMING_EVENT.date}</p>
              </div>
            </div>
            {UPCOMING_EVENT.link
              ? <a href={UPCOMING_EVENT.link} target="_blank" rel="noopener noreferrer" className="btn-primary shrink-0">{UPCOMING_EVENT.cta}</a>
              : <span className="text-[0.78rem] uppercase tracking-[0.08em] font-bold text-lemon/60 shrink-0">{UPCOMING_EVENT.cta} →</span>
            }
          </div>
        </div>
      )}

      {/* Strip */}
      <div className="bg-lemon py-6 px-[4vw] text-center">
        <p className="m-0 font-bold text-[1rem] tracking-[0.03em] text-ink">
          🎵 &nbsp; Student Led · Nonprofit · Community Driven · Since 2021 &nbsp; 🎵
        </p>
      </div>

      {/* What We Do */}
      <section className="py-20 px-[4vw] bg-lemon-pale">
        <div className="max-w-[1200px] mx-auto">
          <div className="section-header">
            <h2>What We Do</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {WHAT_WE_DO.map((item, i) => (
              <Reveal key={item.title} delay={i * 80}>
                <div className="bg-white border-[1.5px] border-brand-border overflow-hidden">
                  <div className="w-full aspect-[16/9] overflow-hidden">
                    <img
                      src={cl(item.image)}
                      alt={item.title}
                      loading="lazy"
                      className="w-full h-full object-cover block"
                    />
                  </div>
                  <div className="p-5 pb-6">
                    <h3 className="mb-2">{item.title}</h3>
                    <p className="text-ink-muted text-[0.95rem] mb-0">{item.desc}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-[4vw] bg-ink">
        <div className="max-w-[1200px] mx-auto">
          <Reveal>
            <p className="text-center font-bold text-[1rem] tracking-[0.08em] uppercase text-lemon mb-10">
              Since 2021, we have been actively involved in performances, community events, and meaningful initiatives that reflect our passion for music and service.
            </p>
          </Reveal>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map((stat, i) => (
              <Reveal key={stat.label} delay={i * 100}>
                <div>
                  <div className="text-[2.5rem] font-black text-lemon mb-[0.4rem]">{stat.value}</div>
                  <div className="text-[0.82rem] font-bold uppercase tracking-[0.06em] text-white/70">{stat.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Join us */}
      <section className="py-20 px-[4vw] bg-lemon-pale">
        <div className="max-w-[700px] mx-auto text-center">
          <Reveal>
            <h2>We Would Love to Have You Join Us</h2>
            <p className="text-ink-muted mx-auto mb-8 leading-[1.8]">
              Whether you play an instrument, sing, dance, enjoy public speaking, help with event organization, or have other talents to share, there is a place for you here. We would love for you to join us and become part of our community.
            </p>
            <Link to="/contact" className="btn-primary">Get in Touch</Link>
          </Reveal>
        </div>
      </section>
    </>
  );
}
