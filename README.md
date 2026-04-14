# Bittersweet Lemonade Association

Website for the Bittersweet Lemonade Association — a student-led nonprofit in Richmond, BC that raises funds for the Richmond Hospital Foundation through annual charity concerts.

**Live site:** https://www.bittersweet-lemonade.com

## Stack

| Layer | Tech |
|-------|------|
| Frontend | React 18, TypeScript, Vite 5 |
| Styling | Tailwind CSS v3 |
| Routing | React Router v6 |
| Backend | Express 4, TypeScript (`tsx` runner) |
| API (prod) | Vercel serverless function (`api/index.ts`) |
| Images | Cloudinary CDN (`f_auto,q_auto`) |
| Email | Resend API |
| Deployment | Vercel |

## Project Structure

```
bittersweet-lemonade/
├── client/                   React + Vite frontend
│   ├── src/
│   │   ├── components/       Layout, Header, TopBar, Footer, Meta
│   │   ├── pages/            Home, About, Blog, BlogPost, Team, Contact, NotFound, Gallery
│   │   ├── types.ts          Shared TypeScript interfaces (Post, Member)
│   │   ├── global.css        Tailwind directives + custom utilities
│   │   └── App.tsx           Router setup
│   ├── tailwind.config.js    Custom palette (lemon/cream/ink), fonts, breakpoints
│   └── public/               robots.txt, sitemap.xml, favicon
├── server/                   Express dev server (local only)
│   ├── data/                 JSON data files
│   │   ├── posts.json
│   │   ├── members.json
│   │   └── gallery.json
│   └── index.ts              Express app with all API routes
├── api/
│   └── index.ts              Vercel serverless entry point (same routes as server/)
├── scripts/                  One-off Cloudinary upload utilities
└── vercel.json               Build + rewrite config
```

## Local Development

### 1. Install dependencies

```bash
npm install --prefix client
npm install --prefix server
```

### 2. Start dev server (Express API + Vite proxy)

```bash
# Terminal 1 — API on port 3001
npm run dev:server

# Terminal 2 — Vite on port 5173 (proxies /api → 3001)
npm run dev:client
```

Open http://localhost:5173

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/posts` | All blog posts |
| GET | `/api/posts/:slug` | Single post by slug |
| GET | `/api/members` | All team members |
| GET | `/api/gallery` | Gallery images |
| POST | `/api/contact` | Submit contact form (sends email via Resend) |

## Environment Variables

Set these in Vercel project settings (not committed):

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Sends contact form emails via Resend |

## Content Management

All content is stored as JSON in `server/data/`:

- **`posts.json`** — Blog posts with title, slug, excerpt, content (HTML), date, featuredImage (Cloudinary URL), category
- **`members.json`** — Team members with name, role, bio, image (Cloudinary URL), type (`executive` | `advisory`)
- **`gallery.json`** — Gallery images with src, alt, category

To update content, edit the JSON files and commit. Vercel redeploys automatically.

## Images

All images are hosted on Cloudinary. URLs are transformed at render time:

```
/upload/ → /upload/f_auto,q_auto/
```

This auto-serves WebP/AVIF and applies quality compression. Use the scripts in `scripts/` to upload new images to Cloudinary.
