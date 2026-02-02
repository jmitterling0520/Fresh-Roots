# Fresh Roots Website

A Next.js website for Fresh Roots - Process and Technology Efficiency Consulting.

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Project Structure

```
Website/
├── app/
│   ├── layout.tsx      # Root layout with metadata
│   ├── page.tsx         # Home page
│   └── globals.css      # Global styles
├── components/
│   ├── Navigation.tsx   # Navigation component
│   ├── Hero.tsx         # Hero section
│   ├── About.tsx        # About section
│   ├── Services.tsx     # Services section
│   ├── Expertise.tsx   # Expertise section
│   ├── Contact.tsx      # Contact section
│   └── Footer.tsx       # Footer component
├── package.json         # Dependencies and scripts
├── next.config.js       # Next.js configuration
└── tsconfig.json        # TypeScript configuration
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Deploy to freshrootsconsulting.us (Vercel)

**Full steps:** See **[Plans/Deployment - freshrootsconsulting.us.md](../Plans/Deployment%20-%20freshrootsconsulting.us.md)** in the repo root.

Summary:

1. Push the repo to GitHub (Vercel imports from GitHub).
2. In [Vercel](https://vercel.com): **Add New → Project** → import the repo.
3. Set **Root Directory** to `Website`, then Deploy.
4. In the project: **Settings → Domains** → add `freshrootsconsulting.us` (and optionally `www.freshrootsconsulting.us`).
5. At your domain registrar, add the A/CNAME records Vercel shows. HTTPS is automatic once DNS propagates.

`vercel.json` redirects `www.freshrootsconsulting.us` to `freshrootsconsulting.us`.

### Deploy to Other Platforms

The site can be deployed to any platform that supports Node.js:
- Netlify
- AWS Amplify
- Railway
- DigitalOcean App Platform

## Features

- ✅ Modern Next.js 14 with App Router
- ✅ TypeScript support
- ✅ Responsive design
- ✅ SEO optimized with metadata
- ✅ Component-based architecture
- ✅ Fast performance with static generation

## Customization

- Edit components in the `components/` directory
- Modify styles in `app/globals.css`
- Update metadata in `app/layout.tsx`
- Change content in individual component files

