import { useEffect, useState } from 'react';

export default function Team() {
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
        <h1>Our Team</h1>
        <p>The people behind Bittersweet Lemonade</p>
      </div>

      {executive.length > 0 && (
        <section className="section section-gray">
          <div className="container">
            <div className="section-header">
              <h2>Executive Team</h2>
            </div>
            <div className="members-grid">
              {executive.map(member => (
                <div key={member.id} className="member-card">
                  <div className="hex-frame">
                    <div className="hex-inner">
                      {member.image
                        ? <img src={member.image} alt={member.name} />
                        : <span className="hex-initial">{member.name.charAt(0)}</span>
                      }
                    </div>
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

      {advisory.length > 0 && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Advisory Board</h2>
            </div>
            <div className="members-grid">
              {advisory.map(member => (
                <div key={member.id} className="member-card">
                  <div className="hex-frame">
                    <div className="hex-inner">
                      {member.image
                        ? <img src={member.image} alt={member.name} />
                        : <span className="hex-initial">{member.name.charAt(0)}</span>
                      }
                    </div>
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
