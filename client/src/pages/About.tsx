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
  { year: '2026', title: '6th Summer Lawn Concert', venue: 'Richmond, BC', raised: null, upcoming: true },
];

export default function About() {
  return (
    <>
      <Meta
        title="Our Story"
        description="Bittersweet Lemonade was founded in 2021 to bring people together through music. Learn about our journey from a pandemic-era idea to a community nonprofit raising funds for the Richmond Hospital Foundation."
        path="/our-story"
      />

      <div className="page-header">
        <h1>Our Story</h1>
        <p>Since 2021</p>
      </div>

      {/* Story text */}
      <section className="py-20 px-[4vw]">
        <div className="max-w-[860px] mx-auto">
          <p className="text-[1.15rem] leading-[1.9] text-ink-mid mb-6">
            It began with a simple idea: to bring people together through the power of music.
          </p>
          <p className="leading-[1.9] text-ink-mid mb-6">
            The Bittersweet Lemonade Association is a youth led nonprofit organization. We aim to unite our community, bring people together, and use music and our voices to share warmth and kindness. During the pandemic, which left many people feeling distant from one another, we wanted to create opportunities to reconnect. Hosting summer lawn concerts became our way to do that.
          </p>
          <p className="leading-[1.9] text-ink-mid mb-6">
            Since 2021, we have held an annual summer lawn concert. Through our events, people come together to enjoy music outdoors and strengthen their connection to the community. The music concerts showcase the talents of youth, and all proceeds are donated to the Richmond Hospital Foundation. Through this work, Bittersweet Lemonade raises funds and awareness for healthcare needs in our community.
          </p>
          <p className="leading-[1.9] text-ink-mid mb-0">
            From a small idea to becoming a part of the community, Bittersweet Lemonade has always worked to bring people together through music. Every song, every smile, and every note reflects the effort of our team. We hope to keep sharing music as a way to strengthen connections and create a positive impact in our community.
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
