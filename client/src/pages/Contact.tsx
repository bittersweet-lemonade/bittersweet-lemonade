import { useState, ChangeEvent, FormEvent } from 'react';
import Meta from '../components/Meta';

interface FormState {
  name: string;
  email: string;
  message: string;
}

export default function Contact() {
  const [form, setForm] = useState<FormState>({ name: '', email: '', message: '' });
  const [status, setStatus] = useState<'success' | 'error' | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json() as { success?: boolean };
      if (res.ok && data.success) {
        setStatus('success');
        setForm({ name: '', email: '', message: '' });
      } else {
        setStatus('error');
      }
    } catch {
      setStatus('error');
    }
    setSubmitting(false);
  };

  return (
    <>
      <Meta
        title="Contact Us"
        description="Get in touch with Bittersweet Lemonade. Questions about membership, partnerships, events, or just want to say hello — we'd love to hear from you."
        path="/contact"
      />

      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Questions, partnerships, membership, or just to say hello</p>
      </div>

      <section className="py-20 px-[4vw]">
        <div className="max-w-[1200px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">

            {/* Info */}
            <div>
              <h3 className="mb-4">Get in Touch</h3>
              <p className="text-ink-muted mb-8">
                Whether you're interested in joining the association, partnering with us on an event, have a general inquiry, or just want to connect — we'd love to hear from you.
              </p>
              <div className="mb-4">
                <strong className="block text-[0.78rem] uppercase tracking-[0.06em] text-lemon-dark font-bold mb-1">
                  General Inquiries
                </strong>
                <a href="mailto:info@bittersweet-lemonade.com" className="text-ink-mid">
                  info@bittersweet-lemonade.com
                </a>
              </div>
              <div className="mt-8">
                <strong className="block text-[0.78rem] uppercase tracking-[0.06em] text-lemon-dark font-bold mb-2">
                  Follow Us
                </strong>
                <a
                  href="https://www.instagram.com/bittersweetlemonade.official/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[0.85rem] uppercase tracking-[0.05em] font-bold text-lemon-dark hover:text-ink transition-colors duration-200"
                >
                  Instagram →
                </a>
              </div>
            </div>

            {/* Form */}
            <div>
              <h3 className="mb-6">Send a Message</h3>

              {status === 'success' && (
                <div className="form-success mb-6">
                  Message sent! We'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="form-error mb-6">
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="name"
                    placeholder="Your Name"
                    value={form.name}
                    onChange={handleChange}
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Email Address"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Your message…"
                  value={form.message}
                  onChange={handleChange}
                  required
                  className="resize-y min-h-[150px]"
                />
                <div>
                  <button type="submit" className="btn-primary" disabled={submitting}>
                    {submitting ? 'Sending…' : 'Send Message'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
