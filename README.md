# Venky's — Authentic Organic Spices

A premium e-commerce storefront and admin dashboard for Venky's, built with React, TypeScript, Vite, Tailwind CSS, Framer Motion and Supabase.

---

## 1. Tech Stack

- **Frontend:** React 18 + TypeScript + Vite
- **Styling:** Tailwind CSS (custom maroon / cream / gold brand palette lifted from the product packaging)
- **Animation:** Framer Motion
- **Backend:** Supabase (PostgreSQL, Auth, Storage, Row Level Security)
- **Hosting:** Netlify

---

## 2. Project Structure

```
venkys-store/
├── src/
│   ├── assets/            # Bundled images (logo, hero photography)
│   ├── components/        # Shared UI (Navbar, Footer, ProductCard, SEO, etc.)
│   ├── lib/                # Supabase client, hooks, cart context, auth context, types
│   ├── pages/              # Public pages (Home, Shop, Cart, Checkout, ...)
│   │   └── admin/          # Admin dashboard pages
│   ├── App.tsx              # Route definitions
│   └── main.tsx             # App entry point
├── public/
│   ├── images/              # Static product images referenced by the DB seed
│   ├── robots.txt
│   └── sitemap.xml
├── supabase/
│   └── migrations/
│       ├── 0001_init.sql     # Tables, RLS policies, create_order() RPC
│       ├── 0002_seed.sql     # Seeds the two initial products + site settings
│       └── 0003_storage.sql  # Storage buckets for product/offer images
├── netlify.toml
├── .env.example
└── package.json
```

---

## 3. Local Setup

### 3.1 Install dependencies

```bash
npm install
```

### 3.2 Create a Supabase project

1. Go to [supabase.com](https://supabase.com) and create a new project.
2. Open the **SQL Editor** and run the three migration files in order:
   - `supabase/migrations/0001_init.sql`
   - `supabase/migrations/0002_seed.sql`
   - `supabase/migrations/0003_storage.sql`
3. Go to **Settings → API** and copy your **Project URL** and **anon/public key**.

### 3.3 Configure environment variables

```bash
cp .env.example .env
```

Fill in:

```
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-public-key
```

**Never** put your Supabase `service_role` key in this file or anywhere in frontend code — the anon key combined with Row Level Security is all the client needs.

### 3.4 Create your admin account

1. In Supabase, go to **Authentication → Users → Add user** and create yourself an account with an email and password.
2. Copy the new user's UUID.
3. In the **SQL Editor**, run:

```sql
insert into public.admin_users (user_id, full_name)
values ('<paste-the-user-uuid-here>', 'Your Name');
```

You can now log in at `/admin/login` with that email and password.

### 3.5 Run the dev server

```bash
npm run dev
```

Visit `http://localhost:5173`.

---

## 4. Product Images

The seed migration references images at `/images/product-500g.jpg` and `/images/product-1kg.jpg`, which are served as static files from the `public/images/` folder for local development and initial deployment.

**For production, we recommend moving these into Supabase Storage:**

1. Log into `/admin`, go to **Products**, edit each product, and upload a new cover image via the **Upload Cover Image** button. This stores the file in the `product-images` Storage bucket and updates the product's `cover_image` URL automatically.
2. You can then remove the files from `public/images/` if you like (they're only there as a working default).

---

## 5. Admin Dashboard

Visit `/admin` (redirects to `/admin/login` if not signed in).

- **Orders** — search/filter by status, view full customer + item details in a slide-over panel, update order status (New → Confirmed → Processing → Packed → Shipped → Delivered, or Cancelled).
- **Products** — add, edit, deactivate, or delete products. Upload cover + gallery images directly to Supabase Storage. Control price, weight, stock status, featured flag, and badge (Bestseller / New / Limited).
- **Offers** — create a homepage banner with desktop + mobile images, a CTA, and optional start/end dates. Only one active offer shows at a time; the homepage banner is hidden entirely until you activate one.
- **Settings** — edit brand name, tagline, phone, WhatsApp, Instagram, email, address, homepage headline/subheadline, and footer text — all reflected live on the storefront.

Admin routes are protected by Supabase Auth on the client, and by Row Level Security (`is_admin()`) on every table on the server — a user without a row in `admin_users` cannot read or write orders, products, offers, or settings, even if they somehow reach the admin UI.

---

## 6. How Orders Work

Checkout does **not** insert directly into the `orders` table from the browser. Instead, it calls a Postgres function, `create_order()`, via `supabase.rpc(...)`:

- Re-prices every line item server-side from the current `products` table (the browser can never dictate what price it pays).
- Atomically allocates the next sequence number for the day using a `order_number_counters` table, producing order numbers like `VK-20260821-0001`.
- Inserts the order and its line items in a single transaction.

This means anonymous customers can place orders without ever having direct `INSERT` access to the `orders` table — RLS only grants that to admins.

---

## 7. Deploying to Netlify

### Option A — Netlify UI

1. Push this project to a GitHub/GitLab/Bitbucket repo.
2. In Netlify, **Add new site → Import an existing project**, and select the repo.
3. Build command: `npm run build` — Publish directory: `dist` (already set in `netlify.toml`).
4. Under **Site settings → Environment variables**, add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`.
5. Deploy.

### Option B — Netlify CLI

```bash
npm install -g netlify-cli
netlify login
netlify init
netlify env:set VITE_SUPABASE_URL "https://your-project-ref.supabase.co"
netlify env:set VITE_SUPABASE_ANON_KEY "your-anon-public-key"
netlify deploy --prod
```

`netlify.toml` already includes the SPA redirect rule (`/* -> /index.html`) needed for React Router to work on refresh/deep links.

---

## 8. Editing Brand Content

Almost everything customer-facing is either:
- **Database-driven** (products, offers, contact details, homepage headline) → edit via `/admin`, or
- **Code-level copy** (Our Story, Why Venky's, Recipes page content) → edit directly in `src/pages/OurStory.tsx`, `src/pages/WhyVenkys.tsx`, `src/pages/Recipes.tsx`.

The brand color system lives in `tailwind.config.ts` under `theme.extend.colors` (`maroon`, `cream`, `brown`, `gold`, `chili`) if you ever need to adjust the palette.

---

## 9. A Note on This Build Environment

This project was authored in a sandboxed environment without npm registry access, so `npm install` / `npm run build` could not be executed here to produce a live build log. The code has been manually reviewed for:

- Consistent imports/exports across all files
- Balanced JSX/TypeScript syntax
- Type consistency between the Supabase schema, shared types (`src/lib/types.ts`), and every component that consumes them

Still, **please run `npm install && npm run build` locally (or let Netlify build it) before considering this production-verified**, and open an issue/fix forward if the build surfaces anything — most likely candidates would be minor dependency version drift, easily fixed by bumping the relevant package in `package.json`.

---

## 10. Product Photography

The two product images bundled in this project (`public/images/product-500g.jpg`, `public/images/product-1kg.jpg`) both currently use the same 1kg pack photo provided during development — only one product photo was supplied. Upload the real 500g pack photo via **Admin → Products → Edit → Upload Cover Image** once you have it.
