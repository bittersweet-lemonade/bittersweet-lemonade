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

// Public Drive thumbnails keep the gallery fast while preserving the full-resolution
// photo when a visitor opens it in the lightbox. Repeated file names in the first
// shared folder were removed before this list was added.
const RECENT_CONCERT_PHOTO_IDS = [
  ...'1YI3yf6dtFv5eSISJdDWvYSB5Mv7fDKBw 17BK-2Cl7XApkSF1voD_53AnySaKuqj28 1n76RMfJBM7TNU8sR80poOtUAjc2rgo5G 1qGGUl7sdjXPcvoHYgg9NP33a9uJIs1za 1E4IJutsJe90ixEcZH4zYSPyHyOmFTSV7 1gcUlFUNaTXsqicgPRDsmZWLPXhXQNV9f 16AcFNfntsKdo0Y0HMdHxHC1Iw5v2ge0d 1Au68T5JUIq00uduMx5DumlRjeseYdRIA 1PcECLqr0EZdicdLSPeqYq8D1RXLVKcLT 1iSd-ioo52fAHkY1_zjPn9MgvhSpZw6Md 1DBMmu7EHqEzONNsoH44XDvcNPTOfU6CE 1YJZoixLC4Z0cff_OXRMdIM7wlodsOZFx 1VzCs6DaEFWg_yNx8fodUG8qZKmEyLlvI 1ZPiF1f3yfPsiH3ZjVV59Y_jpffWtkq68 1d3xmJPzY6AWYaRRUcoBkEqMnuVCZULNe 1EzeoeQras3kxNXHMJ8DjcQDwJuyEnTSW 1H8GkQoIBzuY1IWoXRG_fkE2j9swlZkq4 1IXTVd9SCrrDeUUwBGLtd0eYuxfpn0nrw 1LDNIO-z8fU9D8zRFMpendGoMbrwYnvf6 1ystRPIehcroNFZfsAU5Euf0E2t92wkOI 18xpKlZJTTgZDaH75Ew3wRZt3F02XC5K3 1Yz_85VcE5luDjXaUGIa6mIolyVN6VBMu 1X8Hird-OoP8RSVeevguaAkdY_OF94aho 1d6yhJkiygDngHytM2_TI_xbwW2c7jnvn 1FUQCkgPuZvCwsLCUhRsnIMd_1n8UORGt 11nbuqNlkSP5GeuZA_arx7MPbbb5cmVzr 1Fbz6DnQ-lDOL_9CDVCTSmSjucZCAHTM5 1tynQRyKVC5Q3Lqy-4FaXnzZJivCd7QQX 1lz2kDdxK-0OYVd7T8AWNH763IY31Nnlp 1_IPKd9nijAXTRi67CfVK0l6b38g6EpWW 1H19MVj_eFgHy61qigcJWRu_WR7fEgYiG 1f34QsdPXLGBeFR1Jv2vcHsTAdawNfDxr 12fWMTAmE79yrzJ356HyHmnBmQEaXkLnZ 1nlh0yhDk82avb8sXDwGHONOCofc0jLQu 1syxqzbsKV12qUSs5sCXFjiDVy_QAIPOj 1QzLWrl2FAXNl1EkN5KQZ4epHUebGoREl 1sIT6bkKeBuQzhwG61eoVpmzPvTuFXfXJ 1UUpMZtpsPl1nNrHhRsW7_AWgrQI5Jge2 1clGPVPwS0Jb8gXN__RKkcGyG01PDzv6Z 1bpL0roCUk8841P5Vuo6t76M0xJd_oUT3 1mQixvcQMYUAW-vKtwxCiG0pOqtid0iwH 1fcSWVC_R5xW2z3IJpCiJnD1pVoAYEbAL 1vLtk4X07GyLlL6LcuA7jif1pwnesTIeO 1zNNgIE1UM65Ef2ezvG46kJsssRiR7yLL'.split(' '),
  ...'1JQ1fES0jlIqCnl8Tqw2aOBfdWTSL-Tsu 1c7QK-1w1k0lV16dxJcyx9lr3a5uR88xB 16_cMPKUo0MIV16afaq3M5plHj1Y6sUSJ 1cj2eCus32WYWuQtQWYk5lmVupC1iwFIa 1XGet-XDrXKj0nAQNIWz2mleATjD-5ave 1iIX90jQ1t6R0-t-YopTpCvaAFs8tLNil 1wTAbTyFofvOosY6HH0W71AvhEk9LTMBH 1O06VgPnAOKRoIEuFgpupli65nHf-lzQt 1U3KKHXGVX33NVHuDnYbbxvoPENx0QNBM 10Dslb8846byvzBRoco7-Y8m848NrL_ct 1uNsplQkard6WWu__WbEyheZzU1KisZe9 1chn_44Vw_NYy0IVvKwsVpltdR0wSoDQr 1tP4Q41VYJxGrm2QmgxnCJSQNNovMz9Vk 1QfYsUs2C5Mt5YYAz-fCqT_JFFkFgWX5H 1v3aDdwhj3_MFX6a5k5R2Cv_Hq8rdGabB 1TvAYOcZ_GX3UhkdqfRF5_hHl2pfJqUBd 1oByJ7aFMxBvgLNNG4LQrL7y4CG7gyNtR 1r5NflxnAlTwzdllyUjRJEPGMDPlNUWGw 1-AIhGDF3B8aVRCYkl-7PRwuP2MARYTaJ 16jW9jhhPLP_5diLqXWZid6CE8o3hNExS 1bm0iTb6a6OsWA2immkcv6zDzTWNWkZwJ 1FUZNZrVAvayLR91eHsyFQV6YCx1LsZww 1W0ZFTBASdVk3t0AAtUYHIXy2POeCmsFI 1rSd-fklYtiNX3bILFWv-TJbBN3CaqUla 1pNXT9L6XKapeDIDHNrJdTxm3j9Z1eTkv 1JDu6NTffNi45rSSpjqd2QH6uNJ-5SKMI 16ZbJodYHoEs4gdcDtkPG9O2YmPEve4S- 1Dy8thfl-k5J2o3MA8fBkqPjY_dOCH_95 1w5hj0CqgV5c4cVwc0OFNPj_XUfqo1JpF 17KkEcrbMGNfw1idO3HAjJr_YR_bzhlsY 1OCpIxVYiLitG1M94sQQ0Bm8wE8iHhGUz 1ZJFdkqTjyF1uq0EazYgBkCWMluPCVk6n 1mZFIOBmtZ-ENmpiYDYYEwe6BvB366KXB 1KFVuSCixvdJdTZgOXJHzzthr-rcE2L3m 1muVQydnUvqLRFsrtVunjMXzGk8VcPoDG 16FmmiQVMzp7yULnsj3gDqhpamR9KXjqf 1cNV2Io-t__udErpJW-Z3EQl375qgMDIw 16MvTLWVXVHs_Ul82LBp_l3jmvsSse30x 1d6xocAT-cgNcFzQqmvM05C9UasDbMaOO 15XArq9-Xg_Bcmv6WA7frqkJYYy6utS0n 1dIXzKWR_q3SDGoOM-AF2DXs-d-768d6t 1MR2-_Y-cnkWwDDBEhq63eccD6BA3uvRD 1XHKPWdl_hkjQ8hVQCwXn2_xnvvYQaCCX 1pPFE1jXxtAkCBbQ7mK2xw_-FYmk0I5ke 1G5GjKrrsLJMKiEq7_o1hhSCQV65Cm-wW 1xnroASbn47EtS2iCxOywrS5mb2HIRzUx'.split(' '),
];

const RECENT_CONCERT_IMAGES: GalleryImage[] = RECENT_CONCERT_PHOTO_IDS.map((id, index) => ({
  id: 100 + index,
  src: `https://drive.google.com/thumbnail?id=${id}&sz=w1600`,
  alt: `6th Summer Lawn Concert photo ${index + 1}`,
  category: '2026-concert',
}));

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors());
app.use(express.json());

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const readData = <T>(filename: string): T => {
  const filePath = path.join(__dirname, 'data', filename);
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
  const gallery = [...RECENT_CONCERT_IMAGES, ...readData<GalleryImage[]>('gallery.json')];
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
        <tr><td style="background:#F5C800;padding:32px 40px;text-align:center;border-radius:12px 12px 0 0;">
          <div style="font-size:28px;font-weight:900;color:#1A1400;letter-spacing:2px;">BITTERSWEET LEMONADE</div>
        </td></tr>
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
        <tr><td style="background:#1A1400;padding:24px 40px;text-align:center;border-radius:0 0 12px 12px;">
          <div style="font-size:12px;color:#7A6B1A;">Sent via <a href="https://bittersweet-lemonade.com" style="color:#F5C800;text-decoration:none;">bittersweet-lemonade.com</a></div>
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
        <tr><td style="background:#F5C800;padding:40px;text-align:center;border-radius:12px 12px 0 0;">
          <div style="font-size:32px;font-weight:900;color:#1A1400;letter-spacing:3px;">BITTERSWEET LEMONADE</div>
          <div style="font-size:13px;color:#4A3F00;letter-spacing:2px;text-transform:uppercase;margin-top:6px;">Youth Music Society</div>
        </td></tr>
        <tr><td style="padding:0;">
          <img src="https://res.cloudinary.com/dx8zth9lo/image/upload/f_auto,q_auto,w_600/v1776052836/bittersweet-lemonade/2026/03/DSC_6354.jpg" alt="Concert" width="600" style="display:block;width:100%;max-width:600px;"/>
        </td></tr>
        <tr><td style="background:#FFFDF0;padding:48px 40px;text-align:center;">
          <h1 style="margin:0 0 16px;font-size:32px;color:#1A1400;font-weight:900;letter-spacing:2px;text-transform:uppercase;line-height:1.1;">You're In!</h1>
          <p style="margin:0 0 24px;font-size:16px;color:#4A3F00;line-height:1.7;max-width:440px;display:inline-block;">Thanks for joining the Bittersweet Lemonade newsletter. You'll be the first to hear about our upcoming concerts, events, and everything in between.</p>
          <div style="margin:32px 0;height:2px;background:linear-gradient(to right,#F5C800,#EDD96A,#F5C800);border-radius:2px;"></div>
          <p style="margin:0 0 32px;font-size:14px;color:#7A6B1A;line-height:1.7;">We're a youth-led concert organization raising funds for local charities through the power of music. Every event, every note, every dollar counts.</p>
          <a href="https://bittersweet-lemonade.com" style="display:inline-block;background:#F5C800;color:#1A1400;font-weight:700;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:14px;letter-spacing:2px;text-transform:uppercase;">Visit Our Website</a>
        </td></tr>
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

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Bittersweet Lemonade API running on http://localhost:${PORT}`);
  });
}

export default app;
