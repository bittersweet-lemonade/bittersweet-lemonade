import { useEffect, useState } from 'react';
import Meta from '../components/Meta';
import { Member } from '../types';

function SkeletonMember() {
  return (
    <div className="member-card">
      <div className="skeleton-hex" />
      <div className="skeleton-line short" style={{ margin: '1rem auto 0.5rem', width: '60%' }} />
      <div className="skeleton-line" style={{ margin: '0 auto 0.5rem', width: '45%' }} />
      <div className="skeleton-line" style={{ margin: '0 auto', width: '80%' }} />
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="member-card">
      <div className="hex-frame">
        <div className="hex-inner">
          {member.image
            ? <img
                src={member.image.replace('/upload/', '/upload/f_auto,q_auto/')}
                alt={member.name}
              />
            : <span className="hex-initial">{member.name.charAt(0)}</span>
          }
        </div>
      </div>
      <h3>{member.name}</h3>
      <div className="role">{member.role}</div>
      <p>{member.bio}</p>
    </div>
  );
}

export default function Team() {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/members')
      .then(r => r.json())
      .then((data: Member[]) => { setMembers(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const executive = members.filter(m => m.type === 'executive');
  const advisory = members.filter(m => m.type === 'advisory');

  return (
    <>
      <Meta
        title="Our Team"
        description="Meet the student leaders and advisors behind Bittersweet Lemonade — a passionate group dedicated to music, community, and charity in Richmond, BC."
        path="/team"
      />

      <div className="page-header">
        <h1>Our Team</h1>
        <p>The people behind Bittersweet Lemonade</p>
      </div>

      <section className="section section-gray">
        <div className="container">
          <div className="section-header">
            <h2>Executive Team</h2>
          </div>
          <div className="members-grid">
            {loading
              ? [1, 2, 3, 4, 5, 6].map(i => <SkeletonMember key={i} />)
              : executive.map(m => <MemberCard key={m.id} member={m} />)
            }
          </div>
        </div>
      </section>

      {(loading || advisory.length > 0) && (
        <section className="section">
          <div className="container">
            <div className="section-header">
              <h2>Advisory Board</h2>
            </div>
            <div className="members-grid">
              {loading
                ? [1, 2, 3, 4].map(i => <SkeletonMember key={i} />)
                : advisory.map(m => <MemberCard key={m.id} member={m} />)
              }
            </div>
          </div>
        </section>
      )}
    </>
  );
}
