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
          html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>New Message</title></head>
<body style="margin:0;padding:0;background:#1A1400;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1400;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:#F5C800;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
          <img src="https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto/bittersweet-lemonade/logo" alt="Bittersweet Lemonade" height="48" style="max-height:48px;" onerror="this.style.display='none'"/>
          <div style="font-size:28px;font-weight:900;color:#1A1400;letter-spacing:2px;margin-top:8px;">BITTERSWEET LEMONADE</div>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:#FFFDF0;padding:40px;">
          <h2 style="margin:0 0 24px;font-size:20px;color:#1A1400;font-weight:700;letter-spacing:1px;text-transform:uppercase;">New Contact Message</h2>
          <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:24px;">
            <tr>
              <td style="padding:12px 16px;background:#FFFBE6;border-left:4px solid #F5C800;border-radius:4px;">
                <div style="font-size:11px;color:#7A6B1A;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">From</div>
                <div style="font-size:16px;color:#1A1400;font-weight:600;">${name}</div>
              </td>
            </tr>
            <tr><td style="height:12px;"></td></tr>
            <tr>
              <td style="padding:12px 16px;background:#FFFBE6;border-left:4px solid #F5C800;border-radius:4px;">
                <div style="font-size:11px;color:#7A6B1A;text-transform:uppercase;letter-spacing:1px;margin-bottom:4px;">Email</div>
                <div style="font-size:16px;"><a href="mailto:${email}" style="color:#C49A00;font-weight:600;text-decoration:none;">${email}</a></div>
              </td>
            </tr>
          </table>
          <div style="font-size:11px;color:#7A6B1A;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Message</div>
          <div style="background:#fff;border:1px solid #EDD96A;border-radius:8px;padding:20px;font-size:15px;color:#1A1400;line-height:1.7;white-space:pre-wrap;">${message.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</div>
          <div style="margin-top:32px;text-align:center;">
            <a href="mailto:${email}" style="display:inline-block;background:#F5C800;color:#1A1400;font-weight:700;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:14px;letter-spacing:1px;text-transform:uppercase;">Reply to ${name}</a>
          </div>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#1A1400;padding:24px 40px;text-align:center;border-radius:0 0 12px 12px;">
          <div style="font-size:12px;color:#7A6B1A;">This message was sent via the contact form at <a href="https://bittersweet-lemonade.com" style="color:#F5C800;text-decoration:none;">bittersweet-lemonade.com</a></div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
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

  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;

  if (apiKey && audienceId) {
    try {
      // Add contact to Resend Audience
      const response = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ email, unsubscribed: false }),
      });
      if (!response.ok) {
        const err = await response.text();
        console.error('Resend audience error:', err);
        return res.status(500).json({ error: 'Failed to subscribe.' });
      }

      // Send welcome email
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          from: 'Bittersweet Lemonade <noreply@bittersweet-lemonade.com>',
          to: [email],
          subject: 'Welcome to Bittersweet Lemonade',
          text: `Thanks for subscribing! You'll be the first to hear about our upcoming concerts and events. Visit us at bittersweet-lemonade.com`,
          html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Welcome</title></head>
<body style="margin:0;padding:0;background:#1A1400;font-family:Inter,system-ui,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#1A1400;padding:40px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr><td style="background:#F5C800;padding:40px;text-align:center;border-radius:12px 12px 0 0;">
          <img src="https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto/bittersweet-lemonade/logo" alt="Bittersweet Lemonade" height="56" style="max-height:56px;" onerror="this.style.display='none'"/>
          <div style="font-size:32px;font-weight:900;color:#1A1400;letter-spacing:3px;margin-top:12px;">BITTERSWEET LEMONADE</div>
          <div style="font-size:13px;color:#4A3F00;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Youth Music Society</div>
        </td></tr>
        <!-- Hero image -->
        <tr><td style="padding:0;">
          <img src="https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto,w_600/v1776052836/bittersweet-lemonade/2026/03/DSC_6354.jpg" alt="Concert" width="600" style="display:block;width:100%;max-width:600px;"/>
        </td></tr>
        <!-- Body -->
        <tr><td style="background:#FFFDF0;padding:48px 40px;text-align:center;">
          <h1 style="margin:0 0 16px;font-size:32px;color:#1A1400;font-weight:900;letter-spacing:2px;text-transform:uppercase;line-height:1.1;">You're In!</h1>
          <p style="margin:0 0 24px;font-size:16px;color:#4A3F00;line-height:1.7;max-width:440px;display:inline-block;">Thanks for joining the Bittersweet Lemonade newsletter. You'll be the first to hear about our upcoming concerts, events, and everything in between.</p>
          <div style="margin:32px 0;height:2px;background:linear-gradient(to right,#F5C800,#EDD96A,#F5C800);border-radius:2px;"></div>
          <p style="margin:0 0 32px;font-size:14px;color:#7A6B1A;line-height:1.7;">We're a youth-led concert organization raising funds for local charities through the power of music. Every event, every note, every dollar counts.</p>
          <a href="https://bittersweet-lemonade.com" style="display:inline-block;background:#F5C800;color:#1A1400;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Visit Our Website</a>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#1A1400;padding:28px 40px;text-align:center;border-radius:0 0 12px 12px;">
          <div style="font-size:12px;color:#7A6B1A;line-height:1.8;">
            <a href="https://bittersweet-lemonade.com" style="color:#F5C800;text-decoration:none;font-weight:600;">bittersweet-lemonade.com</a><br/>
            Richmond, BC &nbsp;·&nbsp; Youth Music Society<br/>
            <span style="font-size:11px;">You're receiving this because you subscribed at bittersweet-lemonade.com</span>
          </div>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
        }),
      });
    } catch (err) {
      console.error('Newsletter error:', err);
      return res.status(500).json({ error: 'Failed to subscribe.' });
    }
  } else {
    console.log('Newsletter signup (no Resend config):', email);
  }

  res.json({ success: true });
});

// ── Health ─────────────────────────────────────────────
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok' });
});

export default app;
