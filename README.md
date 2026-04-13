# Bittersweet Lemonade — React + Node.js

A rebuild of the Bittersweet Lemonade WordPress site using React (Vite) frontend and Node.js (Express) backend.

## Project Structure

```
bittersweet-app/
├── backend/          Node.js + Express API
│   ├── data/         JSON data files (posts, gallery, members)
│   ├── routes/       API route handlers
│   └── server.js     Express server
└── frontend/         React + Vite app
    └── src/
        ├── components/  TopBar, Header, Footer, Layout
        └── pages/       Home, About, Blog, Gallery, Contact
```

## Setup & Run

### 1. Install dependencies

```bash
cd bittersweet-app
npm run install:all
```

### 2. Start the backend (port 3001)

```bash
npm run dev:backend
```

### 3. Start the frontend (port 3000)

```bash
npm run dev:frontend
```

Open http://localhost:3000

## How images work

The backend serves images directly from the existing WordPress uploads directory at `../public_html/wp-content/uploads`. No files need to be copied — they're served at `/uploads/...` through the Express static middleware.

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| GET | /api/posts | All blog posts |
| GET | /api/posts/:slug | Single post |
| GET | /api/gallery | All gallery images (optional ?category=) |
| GET | /api/members | Band members |
| POST | /api/contact | Submit contact form |
