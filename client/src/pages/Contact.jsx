import { useState } from 'react';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [status, setStatus] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus(null);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
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
      <div className="page-header">
        <h1>Contact Us</h1>
        <p>Questions, partnerships, membership, or just to say hello</p>
      </div>

      <section className="section">
        <div className="container">
          <div className="contact-grid">
            <div className="contact-info">
              <h3>Get in Touch</h3>
              <p>
                Whether you're interested in joining the association, partnering with us on an event, have a general inquiry, or just want to connect — we'd love to hear from you.
              </p>
              <div className="contact-detail">
                <strong>General Inquiries</strong>
                info@bittersweet-lemonade.com
              </div>
              <div className="contact-detail" style={{ marginTop: '2rem' }}>
                <strong>Follow Us</strong>
                <div style={{ marginTop: '0.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <a href="#" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--lemon-dark)' }}>Instagram</a>
                  <a href="#" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--lemon-dark)' }}>Facebook</a>
                  <a href="#" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--lemon-dark)' }}>TikTok</a>
                  <a href="#" style={{ fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700, color: 'var(--lemon-dark)' }}>Discord</a>
                </div>
              </div>
            </div>

            <div>
              <h3 style={{ marginBottom: '1.5rem' }}>Send a Message</h3>

              {status === 'success' && (
                <div className="form-success" style={{ marginBottom: '1.5rem' }}>
                  Message sent! We'll get back to you soon.
                </div>
              )}
              {status === 'error' && (
                <div className="form-error" style={{ marginBottom: '1.5rem' }}>
                  Something went wrong. Please try again or email us directly.
                </div>
              )}

              <form className="contact-form" onSubmit={handleSubmit}>
                <div className="form-row">
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
                />
                <div>
                  <button type="submit" className="btn btn-primary" disabled={submitting}>
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
