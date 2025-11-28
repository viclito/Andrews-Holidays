## Andrews Holiday – Travel Agency Platform

Full-stack Next.js application for managing South India travel packages, enquiries, bookings, and Stripe-powered payments with an authenticated admin console.

### Tech Stack
- Next.js 16 (App Router) + TypeScript
- Tailwind CSS 3 + custom component library
- MongoDB + Mongoose models
- NextAuth (credentials) for agency login
- Stripe Checkout + webhook for payments
- SWR + API routes for admin CRUD
- Vitest for utility tests

---

## Default Credentials

To access the admin dashboard, use the following credentials (created via `npm run seed`):

- **Email**: `admin@andrewsholiday.com`
- **Password**: `Pass@123`

## Getting Started

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Environment variables**  
   Duplicate `env.example` → `.env.local` and populate:
   - `MONGODB_URI`, `MONGODB_DB`
   - `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_APP_URL`
   - `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
   - `RESEND_API_KEY`

3. **Seed demo data**
   ```bash
   npm run seed
   ```
   Seeds example packages and an admin user `admin@andrewsholiday.com / Pass@123`.

4. **Run dev server**
   ```bash
   npm run dev
   ```

5. **Stripe webhook (local)**
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

6. **Tests & lint**
   ```bash
   npm run lint
   npm run test
   ```

---

## Feature Map

### Public Experience
- Hero + regional highlight sections with CTA
- `/packages` listing with filters (region, duration, price)
- `/packages/[slug]` detail pages with itineraries and enquiry form
- Inquiry API persists leads and triggers Resend notification

### Booking & Payments
- `/booking` and `/booking/[slug]` multi-field booking forms
- `/api/checkout` creates Stripe Checkout sessions
- `/api/stripe/webhook` confirms sessions and stores bookings
- `/booking/confirmation` shows payment outcome

### Admin Console
- Protected `/dashboard` routes via NextAuth credentials + middleware
- Overview metrics (packages, bookings, inquiries, revenue)
- Packages manager with create/update/delete UI and APIs
- Bookings list with status updates
- Inquiry pipeline with status workflow

---

## Deployment Notes
1. **MongoDB Atlas** – create cluster, whitelist IP, update URI vars.
2. **Stripe** – set live keys & webhook secret for production URL.
3. **Vercel** – deploy Next.js app, add env vars (including `NEXT_PUBLIC_APP_URL` pointing to production domain).
4. **Webhook** – in Stripe dashboard, target `https://yourdomain.com/api/stripe/webhook`.
5. **Monitoring** – enable Vercel logging/analytics + Stripe dashboard alerts.

---

## Useful Scripts
| Script | Description |
| --- | --- |
| `npm run dev` | Start Next.js dev server |
| `npm run build && npm run start` | Production build & serve |
| `npm run lint` | ESLint with strict settings |
| `npm run test` | Vitest for utility coverage |
| `npm run seed` | Seed MongoDB with demo data |

---

## Directory Highlights
| Path | Purpose |
| --- | --- |
| `src/app` | App Router pages, layouts, API routes |
| `src/components` | UI kit, forms, dashboard widgets |
| `src/lib` | DB connection, SEO builder, Stripe helper, utilities |
| `src/models` | Mongoose schemas (Package, Booking, Inquiry, AgencyUser) |
| `src/data` | Navigation + fallback package data |
| `scripts/seed.ts` | MongoDB seeding script |
| `public/images` | SVG illustrations and placeholders |

Happy building! Adjust branding, assets, and copy to align with your agency identity.
