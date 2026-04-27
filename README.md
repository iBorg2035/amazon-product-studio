# Amazon Product Studio

AI-powered product photography SaaS for Amazon sellers. Upload a product image, pick a scene, get professional listing photos generated in seconds.

## What's Different

- **25 Amazon-optimized scene categories** — Whitebox, Lifestyle Kitchen, Studio Ambient, Tech Glow, Luxury Marble, and more
- **Amazon aspect ratios built in** — 1:1, 3:4, 4:3, 16:9
- **MuAPI-powered generation** — fast, reliable AI product scene synthesis
- **Stripe billing with credits** — $19/$45/$99 subscription tiers
- **PostgreSQL + Prisma** — persistent creation history per user

## Tech Stack

Next.js App Router · Prisma + Supabase PostgreSQL · Stripe subscriptions · MuAPI · Google OAuth · Vercel

## Setup

```bash
npm install
cp .env.example .env.local
npx prisma generate
npx prisma db push
npm run dev
```

## Environment Variables

| Service | Variable |
|---------|----------|
| Database | `DATABASE_URL`, `DIRECT_URL` |
| Auth | `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` |
| Stripe | `STRIPE_SECRET_KEY`, `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` |
| MuAPI | `MUAPI_API_KEY`, `AI_CREDIT_COST=65` |

## Deployment

Deploy to Vercel. Set all env vars in Vercel project settings before deploying.

## Stripe Webhook

dashboard.stripe.com → Events → `checkout.session.completed` + `invoice.paid` → URL: `https://yourdomain.com/api/webhook/stripe`

## MuAPI Webhook

Set to: `https://yourdomain.com/api/webhook/muapi` for completion callbacks.

---

Built with MuAPI · Powered by Hermes Agent
