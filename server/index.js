const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Serve media files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Helper to read JSON data files
const readData = (filename) => {
  const filePath = path.join(__dirname, 'data', filename);
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
app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }
  // In production you'd send an email here
  console.log('Contact form submission:', { name, email, message });
  res.json({ success: true, message: 'Your message has been received!' });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Bittersweet Lemonade API running on http://localhost:${PORT}`);
  });
}

module.exports = app;
