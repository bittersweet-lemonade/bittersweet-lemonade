import { useEffect, useState } from 'react';

export default function About() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(setMembers)
      .catch(() => {});
  }, []);

  return (
    <>
      <div className="page-header">
        <h1>About Us</h1>
        <p>Who we are and why we do what we do</p>
      </div>

      {/* Mission */}
      <section className="section section-gray">
        <div className="container" style={{ textAlign: 'center', maxWidth: 860, margin: '0 auto' }}>
          <div className="section-header">
            <h2>Our Mission</h2>
          </div>
          <p style={{ fontSize: '1.2rem', lineHeight: 1.9, color: 'var(--text-mid)', fontStyle: 'italic' }}>
            "The Bittersweet Lemonade Association is a registered student-led non-profit organization dedicated to bringing young people together through a shared love of music. We believe that music has the power to connect hearts, inspire kindness, and strengthen our community."
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="section">
        <div className="container">
          <div className="about-hero">
            <img
              src="/uploads/2025/02/Bittersweet-Lemonade-Oct-2024-Update.jpg"
              alt="Bittersweet Lemonade Association"
            />
            <div className="about-text">
              <h2>Our Story</h2>
              <p>
                The Bittersweet Lemonade Association was founded by students who believed that music deserved more than a classroom — it deserved a community. What began as a small gathering of music-loving students has grown into a registered non-profit organization with a growing membership and an ever-expanding impact.
              </p>
              <p>
                We bring together young people from diverse backgrounds, united by a shared passion for music in all its forms. Through events, workshops, open mic nights, and community outreach, we create spaces where connection happens naturally.
              </p>
              <p>
                Our name reflects both the complexity of the journey and the sweetness of what we're building together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Do */}
      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2>What We Do</h2>
            <p>Programs and initiatives driven by our members, for our community.</p>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '1.5rem' }}>
            {[
              { icon: '🎤', title: 'Open Mic Nights', desc: 'We host regular open mic events that give young musicians a platform to share their music in a supportive, welcoming environment.' },
              { icon: '🏫', title: 'Music Education', desc: 'Partnering with local schools and community centers to make music education accessible to young people regardless of background.' },
              { icon: '🤝', title: 'Community Outreach', desc: 'Charity events, fundraisers, and partnerships that use music as a vehicle for positive community impact.' },
              { icon: '👥', title: 'Student Network', desc: 'Building a network of student musicians, organizers, and music lovers who support and inspire one another.' },
            ].map(item => (
              <div key={item.title} style={{ background: 'var(--white)', border: '1.5px solid var(--border)', padding: '2rem 1.5rem' }}>
                <div style={{ fontSize: '2.2rem', marginBottom: '1rem' }}>{item.icon}</div>
                <h3 style={{ marginBottom: '0.75rem' }}>{item.title}</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Executive Team */}
      {members.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Executive Team</h2>
              <p>The student leaders driving our mission forward.</p>
            </div>
            <div className="members-grid">
              {members.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    <img src={member.image} alt={member.name} />
                  </div>
                  <h3>{member.name}</h3>
                  <div className="role">{member.role}</div>
                  <p>{member.bio}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Photo */}
      <section className="section section-dark">
        <div className="container" style={{ textAlign: 'center' }}>
          <h2>Together in Music</h2>
          <p style={{ color: 'rgba(255,243,163,0.75)', marginBottom: '2rem', maxWidth: 600, margin: '0 auto 2rem' }}>
            Every event, every performance, every moment of connection — that's why we're here.
          </p>
          <img
            src="/uploads/2025/10/DSC07724.jpg"
            alt="Bittersweet Lemonade Association event"
            style={{ width: '100%', maxWidth: 900, margin: '0 auto', display: 'block', aspectRatio: '16/9', objectFit: 'cover', border: '2px solid var(--lemon)' }}
          />
        </div>
      </section>
    </>
  );
}
