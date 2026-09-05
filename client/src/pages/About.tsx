import Meta from '../components/Meta';

interface TimelineEvent {
  year: string;
  title: string;
  venue: string;
  raised: string | null;
  upcoming?: boolean;
}

const TIMELINE: TimelineEvent[] = [
  { year: '2021', title: '1st Summer Lawn Concert', venue: 'Southland Heritage Farm', raised: null },
  { year: '2022', title: '2nd Summer Lawn Concert', venue: 'Richmond City Square', raised: '$7,500' },
  { year: '2023', title: '3rd Summer Lawn Concert', venue: 'Southland Heritage Farm', raised: '$4,375' },
  { year: '2024', title: '4th Summer Lawn Concert', venue: 'West Point Grey Community Centre', raised: '$4,400' },
  { year: '2025', title: '5th Summer Lawn Concert', venue: 'Lavenderland', raised: '$4,600+' },
  { year: '2026', title: '6th Summer Lawn Concert', venue: 'Richmond, BC · August 2026', raised: null },
];

export default function About() {
  return (
    <>
      <Meta
        title="Our Story"
        description="Since 2021, Bittersweet Lemonade has brought youth musicians and neighbours together for annual summer concerts, raising over $27,000 for local causes."
        image="https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto,w_1200,h_630,c_fill,g_auto/v1776052964/bittersweet-lemonade/2026/03/DSC_6347.jpg"
        path="/our-story"
        breadcrumb="Our Story"
      />

      <div className="page-header">
        <h1>Our Story</h1>
        <p>Since 2021</p>
      </div>

      {/* Story text */}
      <section className="py-20 px-[4vw]">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[1.15rem] leading-[1.9] text-ink-mid mb-6">
            Bittersweet Lemonade started with a small group of students, a lawn, and a reason to get people out of the house again.
          </p>
          <p className="leading-[1.9] text-ink-mid mb-6">
            During the pandemic, a lot of people felt cut off from one another. We wanted to make something simple and welcoming: an afternoon where friends, families, and neighbours could sit together, hear young musicians play, and feel part of the same community. Summer lawn concerts became our way of doing that.
          </p>
          <p className="leading-[1.9] text-ink-mid mb-6">
            We have held a concert every summer since 2021. The program gives young performers a real audience and gives our community a reason to gather outdoors. Ticket sales and donations go to the Richmond Hospital Foundation, so every event also supports healthcare close to home.
          </p>
          <p className="leading-[1.9] text-ink-mid mb-0">
            It is still a student-run effort, with volunteers doing the less glamorous work behind every concert: planning, rehearsing, setting up, welcoming guests, and cleaning up at the end. We are proud of what a local concert can do when people show up for one another, and we are excited to keep it going.
          </p>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 px-[4vw] bg-lemon-pale">
        <div className="max-w-[860px] mx-auto">
          <div className="section-header">
            <h2>Our Journey</h2>
          </div>

          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-[39px] top-0 bottom-0 w-[2px] bg-brand-border sm:left-1/2 sm:-translate-x-px" />

            <div className="flex flex-col gap-10">
              {TIMELINE.map((event, i) => {
                const isRight = i % 2 === 1;
                return (
                  <div key={event.year} className={`relative flex items-start gap-6 sm:gap-0 ${isRight ? 'sm:flex-row-reverse' : ''}`}>
                    {/* Dot + year */}
                    <div className="relative z-10 flex flex-col items-center shrink-0 sm:absolute sm:left-1/2 sm:-translate-x-1/2">
                      <div className={`w-[20px] h-[20px] rounded-full border-[3px] border-lemon ${event.upcoming ? 'bg-lemon/30' : 'bg-lemon'}`} />
                      <span className="text-[0.72rem] font-black uppercase tracking-[0.08em] text-lemon-dark mt-1">{event.year}</span>
                    </div>

                    {/* Card */}
                    <div className={`ml-6 sm:ml-0 sm:w-[calc(50%-3rem)] bg-white border-[1.5px] p-5 ${event.upcoming ? 'border-lemon/40 opacity-60' : 'border-brand-border'} ${isRight ? 'sm:mr-auto sm:ml-12' : 'sm:ml-auto sm:mr-12'}`}>
                      {event.upcoming && (
                        <span className="inline-block text-[0.65rem] font-bold uppercase tracking-[0.1em] text-lemon-dark bg-lemon/20 px-2 py-0.5 mb-2">
                          Coming Soon
                        </span>
                      )}
                      <h3 className="text-[1rem] mb-1">{event.title}</h3>
                      <p className="text-[0.85rem] text-ink-muted mb-0">{event.venue}</p>
                      {event.raised && (
                        <p className="text-[0.82rem] font-bold text-lemon-dark mt-2 mb-0">
                          {event.raised} raised for Richmond Hospital Foundation
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
