import { useEffect, useState } from 'react';

export default function About() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then(setMembers)
      .catch(() => {});
  }, []);

  const executive = members.filter(m => m.type === 'executive');
  const advisory = members.filter(m => m.type === 'advisory');

  return (
    <>
      <div className="page-header">
        <h1>Our Story</h1>
        <p>Since 2021</p>
      </div>

      {/* Story */}
      <section className="section">
        <div className="container" style={{ maxWidth: 860, margin: '0 auto' }}>
          <p style={{ fontSize: '1.15rem', lineHeight: 1.9, color: 'var(--text-mid)', marginBottom: '1.5rem' }}>
            It began with a simple idea – to bring people together through the power of music.
          </p>
          <p style={{ lineHeight: 1.9, color: 'var(--text-mid)', marginBottom: '1.5rem' }}>
            The Bittersweet Lemonade Association is a youth-led non-profit organization. We aim to unite our community, bring people together, and use music and our voices to share warmth and kindness. During the pandemic, which left many people feeling distant from one another, we wanted to create opportunities to reconnect. Hosting summer lawn concerts became our way to do that.
          </p>
          <p style={{ lineHeight: 1.9, color: 'var(--text-mid)', marginBottom: '1.5rem' }}>
            Since 2021, we have held an annual summer lawn concert. Through our events, people come together to enjoy music outdoors and strengthen their connection to the community. The music concerts showcase the talents of youth, and all proceeds are donated to the Richmond Hospital Foundation. Through this work, Bittersweet Lemonade raises funds and awareness for healthcare needs in our community.
          </p>
          <p style={{ lineHeight: 1.9, color: 'var(--text-mid)' }}>
            From a small idea to becoming a part of the community, Bittersweet Lemonade has always worked to bring people together through music. Every song, every smile, and every note reflects the effort of our team. We hope to keep sharing music as a way to strengthen connections and create a positive impact in our community.
          </p>
        </div>
      </section>

      {/* Executive Team */}
      {executive.length > 0 && (
        <section className="section section-gray">
          <div className="container">
            <div className="section-header">
              <h2>Meet Our Team</h2>
            </div>
            <div className="members-grid">
              {executive.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    {member.image
                      ? <img src={member.image} alt={member.name} />
                      : <div style={{ width: '100%', height: '100%', background: 'var(--lemon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'var(--text)' }}>{member.name.charAt(0)}</div>
                    }
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

      {/* Advisory Board */}
      {advisory.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Advisory Board</h2>
            </div>
            <div className="members-grid">
              {advisory.map(member => (
                <div key={member.id} className="member-card">
                  <div className="member-avatar">
                    <div style={{ width: '100%', height: '100%', background: 'var(--lemon)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', fontWeight: 900, color: 'var(--text)' }}>{member.name.charAt(0)}</div>
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
    </>
  );
}
