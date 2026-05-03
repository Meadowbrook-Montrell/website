# Meadowbrook Montrell — 3GMG Official Site

The official website for **Meadowbrook Montrell** aka *The Hood's Paparazzi* — content creator, podcaster, songwriter, and street reporter from Fort Worth, Texas.

## 🔗 Live Preview
[https://preview-meadowbrook-montrell-55dec75d.viktor.space/v2](https://preview-meadowbrook-montrell-55dec75d.viktor.space/v2)

## Features

- **Landing Page** — Dark/gold street theme with real Fort Worth Stock Yards photography & 3GMG graffiti branding
- **Content Library** — 40+ embedded YouTube videos (full episodes + shorts) with category filters
- **Photo Gallery** — Masonry layout with lightbox viewer, sourced from YouTube thumbnails
- **Live Sessions** — Banner promoting upcoming live interview sessions
- **Merch Section** — Coming soon merchandise showcase
- **Connect** — Links to YouTube, Facebook, Instagram, TikTok
- **Convex Backend** — Content management with `content` and `liveSessions` tables

## Tech Stack

- **Frontend**: React + TypeScript + Tailwind CSS + Vite
- **Backend**: [Convex](https://convex.dev) (real-time database)
- **Hosting**: Vercel (via Viktor Spaces)

## Pages

| Route | Page |
|-------|------|
| `/` | Original landing page (clean version) |
| `/v2` | Main landing page (graffiti/street version) |
| `/library` | Full content library with all videos |
| `/gallery` | Photo gallery with lightbox |

## Setup

### 1. Clone the repo
```bash
git clone https://github.com/Meadowbrook-Montrell/website.git
cd website
```

### 2. Install dependencies
```bash
npm install
# or
bun install
```

### 3. Set up Convex
Create a `.env.local` file from the example:
```bash
cp .env.example .env.local
```

Edit `.env.local` and add your Convex deploy key:
```
VITE_CONVEX_URL=https://effervescent-parrot-556.convex.cloud
CONVEX_DEPLOY_KEY=dev:effervescent-parrot-556|<your-token>
CONVEX_DEPLOYMENT=dev:effervescent-parrot-556
```

### 4. Deploy Convex functions
```bash
npx convex deploy --cmd 'echo skip' --cmd-url-env-var-name VITE_CONVEX_URL -y
```

### 5. Run locally
```bash
npm run dev
```

## Project Structure

```
├── convex/              # Convex backend (schema, queries, mutations)
│   ├── schema.ts        # Database schema (content, liveSessions, users)
│   ├── contentLib.ts    # Content library queries/mutations
│   └── ...
├── public/
│   └── images/          # Site assets (hero, logos, avatars, icons)
├── src/
│   ├── pages/
│   │   ├── GraffitiLandingPage.tsx   # Main page (v2)
│   │   ├── LandingPage.tsx           # Original page
│   │   ├── LibraryPage.tsx           # Content library
│   │   └── GalleryPage.tsx           # Photo gallery
│   ├── App.tsx           # Routes
│   └── main.tsx          # Entry point
└── index.html
```

## Credits

Built by [Viktor AI](https://getviktor.com) for Meadowbrook Montrell / 3GMG.

---

*3GMG • Fort Worth, TX • The Hood's Paparazzi*
