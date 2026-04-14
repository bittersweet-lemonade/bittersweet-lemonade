import express, { Request, Response } from 'express';
import cors from 'cors';
import path from 'path';
import fs from 'fs';

interface Post {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  date: string;
  featuredImage: string | null;
  category: string;
}

interface Member {
  id: number;
  name: string;
  role: string;
  image: string | null;
  bio: string;
  type: 'executive' | 'advisory';
}

interface GalleryImage {
  id: number;
  src: string;
  alt: string;
  category: string;
}

interface ContactBody {
  name?: string;
  email?: string;
  message?: string;
}

interface NewsletterBody {
  email?: string;
}

const app = express();

app.use(cors());
app.use(express.json());

const readData = <T>(filename: string): T => {
  const filePath = path.join(__dirname, '../server/data', filename);
  return JSON.parse(fs.readFileSync(filePath, 'utf8')) as T;
};

// ── Posts ──────────────────────────────────────────────
app.get('/api/posts', (_req: Request, res: Response) => {
  const posts = readData<Post[]>('posts.json');
  res.json(posts);
});

app.get('/api/posts/:slug', (req: Request, res: Response) => {
  const posts = readData<Post[]>('posts.json');
  const post = posts.find(p => p.slug === req.params.slug);
  if (!post) return res.status(404).json({ error: 'Post not found' });
  res.json(post);
});

// ── Gallery ────────────────────────────────────────────
app.get('/api/gallery', (req: Request, res: Response) => {
  const gallery = readData<GalleryImage[]>('gallery.json');
  const { category } = req.query;
  if (category && category !== 'all') {
    return res.json(gallery.filter(img => img.category === category));
  }
  res.json(gallery);
});

// ── Members ────────────────────────────────────────────
app.get('/api/members', (_req: Request, res: Response) => {
  const members = readData<Member[]>('members.json');
  res.json(members);
});

// ── Contact ────────────────────────────────────────────
app.post('/api/contact', async (req: Request<object, object, ContactBody>, res: Response) => {
  const { name, email, message } = req.body;
  if (!name || !email || !message) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
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
    console.log('Contact form submission:', { name, email, message });
  }

  res.json({ success: true, message: 'Your message has been received!' });
});

// ── Newsletter ─────────────────────────────────────────
app.post('/api/newsletter', async (req: Request<object, object, NewsletterBody>, res: Response) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required.' });

  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: 'Bittersweet Lemonade <noreply@bittersweet-lemonade.com>',
          to: ['info@bittersweet-lemonade.com'],
          subject: 'New Newsletter Subscriber',
          text: `New subscriber: ${email}`,
          html: `<p>New newsletter subscriber: <strong>${email}</strong></p>`,
        }),
      });
      if (!response.ok) {
        const err = await response.text();
        console.error('Resend error:', err);
        return res.status(500).json({ error: 'Failed to process subscription.' });
      }
    } catch (err) {
      console.error('Newsletter error:', err);
      return res.status(500).json({ error: 'Failed to process subscription.' });
    }
  } else {
    console.log('Newsletter signup:', email);
  }

  res.json({ success: true });
});

// ── Health ─────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default app;
