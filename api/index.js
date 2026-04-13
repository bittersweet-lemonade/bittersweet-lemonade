const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();

app.use(cors());
app.use(express.json());

// Helper to read JSON data files
const readData = (filename) => {
  const filePath = path.join(__dirname, '../server/data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
};

// ── Posts ──────────────────────────────────────────────
app.get('/api/posts', (req, res) => {
  const posts = readData('posts.json');
  res.json(posts);
});

app.get('/api/posts/:slug', (req, res) => {
  const posts = readData('posts.json');
  const post = posts.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// ── Gallery ────────────────────────────────────────────
app.get('/api/gallery', (req, res) => {
  const gallery = readData('gallery.json');
  const { category } = req.query;
  if (category && category !== 'all') {
    return res.json(gallery.filter(img => img.category === category));
  }
  res.json(gallery);
});

// ── Members ────────────────────────────────────────────
app.get('/api/members', (req, res) => {
  const members = readData('members.json');
  res.json(members);
});

// ── Contact ────────────────────────────────────────────
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  // Send email via Resend if API key is configured
  // To enable: add RESEND_API_KEY to your Vercel environment variables
  // Get a free key at https://resend.com
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Bittersweet Lemonade <noreply@bittersweet-lemonade.com>',
          to: ['info@bittersweet-lemonade.com'],
          reply_to: email,
          subject: `Contact Form: Message from ${name}`,
          text: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
          html: `<p><strong>Name:</strong> ${name}</p><p><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p><hr/><p>${message.replace(/\n/g, '<br/>')}</p>`,
        }),
      });

      if (!response.ok) {
        const err = await response.text();
        console.error('Resend error:', err);
        return res.status(500).json({ error: 'Failed to send email.' });
      }
    } catch (err) {
      console.error('Email send error:', err);
      return res.status(500).json({ error: 'Failed to send email.' });
    }
  } else {
    // Fallback: log to console (development / before Resend key is set)
    console.log('Contact form submission:', { name, email, message });
  }

  res.json({ success: true, message: 'Your message has been received!' });
});

// ── Health ─────────────────────────────────────────────
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

module.exports = app;
