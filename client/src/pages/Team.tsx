import { useEffect, useState } from 'react';
import Meta from '../components/Meta';
import { Member } from '../types';

function SkeletonMember() {
  return (
    <div className="text-center py-8 px-6 bg-white clip-card shadow-[0_4px_24px_rgba(196,154,0,0.12)]">
      <div className="skeleton-hex" />
      <div className="skeleton h-[14px] w-[60%] mx-auto mb-2 mt-4 rounded-sm" />
      <div className="skeleton h-[12px] w-[45%] mx-auto mb-2 rounded-sm" />
      <div className="skeleton h-[12px] w-[80%] mx-auto rounded-sm" />
    </div>
  );
}

function MemberCard({ member }: { member: Member }) {
  return (
    <div className="text-center py-8 px-6 bg-white clip-card shadow-[0_4px_24px_rgba(196,154,0,0.12)] transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(196,154,0,0.22)]">
      <div className="hex-frame">
        <div className="hex-inner">
          {member.image
            ? <img
                src={member.image.replace('/upload/', '/upload/f_auto,q_auto/')}
                alt={member.name}
                className="w-full h-full object-cover block"
              />
            : <span className="text-[3.5rem] font-black text-ink">{member.name.charAt(0)}</span>
          }
        </div>
      </div>
      <h3 className="text-[1.15rem] mb-1 text-ink">{member.name}</h3>
      <div className="text-[0.82rem] uppercase tracking-[0.06em] text-lemon-dark font-bold mb-3">{member.role}</div>
      <p className="text-[0.88rem] text-ink-muted leading-[1.6] mb-0">{member.bio}</p>
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

      <section className="py-20 px-[4vw] bg-lemon-pale">
        <div className="max-w-[1200px] mx-auto">
          <div className="section-header">
            <h2>Executive Team</h2>
          </div>
          <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-8 gap-y-12">
            {loading
              ? [1, 2, 3, 4, 5, 6].map(i => <SkeletonMember key={i} />)
              : executive.map(m => <MemberCard key={m.id} member={m} />)
            }
          </div>
        </div>
      </section>

      {(loading || advisory.length > 0) && (
        <section className="py-20 px-[4vw]">
          <div className="max-w-[1200px] mx-auto">
            <div className="section-header">
              <h2>Advisory Board</h2>
            </div>
            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-x-8 gap-y-12">
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
