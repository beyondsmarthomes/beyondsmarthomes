# Beyond Smart Homes — Website Blueprint + Starter Code

> Single-file planning doc with an initial Next.js (App Router + TypeScript) scaffold, Prisma schema, and key API routes. Copy sections into a repo to start coding immediately.

---

## 0) Goals Recap
- Showcase services and allow immediate purchase.
- Display previous projects (portfolio/case studies).
- Capture visitor intent fast and route them to the right place (guided intake + AI concierge).
- Frontend + Backend auth (Admin & Customer).
- Admin can manage products/services with cost, profit, attributes; segment by category/area and render on different pages.
- Email marketing subscriptions.
- Cart tied to account; checkout via KNET (through provider) and scheduling installation based on available time slots.

---

## 1) Recommended Stack
- **Framework:** Next.js 15 (App Router) + React Server Components + TypeScript.
- **DB:** PostgreSQL with **Prisma** ORM.
- **Auth:** NextAuth.js (email/password + OAuth later). Roles: `ADMIN`, `CUSTOMER`.
- **Payments:** Abstraction via `/api/checkout` using provider adapters for **Tap Payments (KNET)** or **MyFatoorah**; webhook handling at `/api/webhooks/{provider}`.
- **Email:** Resend/Mailgun via `/lib/email` (subscribe, order confirmations, abandoned carts).
- **Storage:** Image uploads to S3-compatible bucket (e.g., Supabase Storage). 
- **Scheduling:** Availability table + booking API with conflict checks; optional Google Calendar sync later.
- **AI Concierge:** Rules-first intake flow + optional LLM handoff (can be toggled). 
- **Deployment:** Vercel (frontend + serverless) or Docker on VPS; Postgres via Neon/Supabase.
- **i18n & RTL:** English + Arabic (RTL) with `next-intl` and logical CSS.

---

## 2) Sitemap & UX
- `/` Hero, quick-intake modal, featured services, top projects, CTA to Shop.
- `/shop` filterable catalog (areas: Lighting, Security, Climate, Media, Networking, Energy, Services).
- `/service/[slug]` service/product detail + add-to-cart + upsells.
- `/projects` grid + filters (type, budget, location); 
- `/projects/[slug]` case study (problem/solution/stack/gallery/testimonial).
- `/intake` guided questionnaire (routes to relevant collections + captures lead).
- `/contact` form + WhatsApp deep link.
- `/about` team + credentials + partners.
- `/account` orders, bookings, saved carts, subscriptions.
- `/checkout` address -> schedule -> pay.
- `/admin` dashboard (role-gated) with subpages: Products, Projects, Orders, Slots, Users, Marketing.

---

## 3) Data Model (Prisma)
```prisma
// /prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Role { ADMIN CUSTOMER }

enum AvailabilityStatus { AVAILABLE BLOCKED }

enum OrderStatus { PENDING PAID FAILED CANCELED REFUNDED }

enum PaymentProvider { TAP MYFATOORAH }

enum FulfillmentType { INSTALLATION DELIVERY DIGITAL }

enum ProductType { HARDWARE SERVICE BUNDLE }

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      Role     @default(CUSTOMER)
  phone     String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  orders    Order[]
  cartItems CartItem[]
  bookings  Booking[]
  leads     Lead[]
}

model Category {
  id    String   @id @default(cuid())
  slug  String   @unique
  name  String
  desc  String?
  products Product[]
}

model Product {
  id          String      @id @default(cuid())
  slug        String      @unique
  name        String
  type        ProductType @default(HARDWARE)
  sku         String?     @unique
  price       Decimal     @db.Numeric(10,2) // retail (KWD)
  cost        Decimal?    @db.Numeric(10,2)
  profit      Decimal?    @db.Numeric(10,2) // optional explicit margin
  attributes  Json?
  excerpt     String?
  description String?
  images      Json?
  categoryId  String?
  category    Category?   @relation(fields: [categoryId], references: [id])
  createdAt   DateTime    @default(now())
  updatedAt   DateTime    @updatedAt
}

model ProjectCase {
  id          String   @id @default(cuid())
  slug        String   @unique
  title       String
  summary     String
  body        String    // markdown
  gallery     Json?
  tags        String[]
  published   Boolean   @default(false)
  createdAt   DateTime  @default(now())
  updatedAt   DateTime  @updatedAt
}

model Lead {
  id        String   @id @default(cuid())
  source    String?  // intake, chat, contact
  answers   Json
  email     String?
  phone     String?
  name      String?
  notes     String?
  createdAt DateTime @default(now())
  userId    String?
  user      User?    @relation(fields: [userId], references: [id])
}

model CartItem {
  id        String   @id @default(cuid())
  qty       Int      @default(1)
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  addedAt   DateTime @default(now())
}

model Order {
  id           String         @id @default(cuid())
  userId       String
  user         User           @relation(fields: [userId], references: [id])
  status       OrderStatus    @default(PENDING)
  provider     PaymentProvider?
  providerId   String?        // charge/invoice id from provider
  currency     String         @default("KWD")
  total        Decimal        @db.Numeric(10,2)
  items        OrderItem[]
  bookingId    String?
  booking      Booking?       @relation(fields: [bookingId], references: [id])
  metadata     Json?
  createdAt    DateTime       @default(now())
  updatedAt    DateTime       @updatedAt
}

model OrderItem {
  id        String   @id @default(cuid())
  orderId   String
  order     Order    @relation(fields: [orderId], references: [id])
  productId String
  product   Product  @relation(fields: [productId], references: [id])
  qty       Int
  price     Decimal  @db.Numeric(10,2)
}

model AvailabilitySlot {
  id        String              @id @default(cuid())
  start     DateTime
  end       DateTime
  status    AvailabilityStatus @default(AVAILABLE)
  capacity  Int                @default(1)
  notes     String?
  createdAt DateTime           @default(now())
}

model Booking {
  id        String   @id @default(cuid())
  userId    String
  user      User     @relation(fields: [userId], references: [id])
  slotId    String
  slot      AvailabilitySlot @relation(fields: [slotId], references: [id])
  address   String?
  notes     String?
  createdAt DateTime @default(now())
}

model Subscriber {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  tags      String[]
}
```

---

## 4) API Surface (routes and snippets)

**Auth**
- `POST /api/auth/register` — create user
- `POST /api/auth/login` — issue session
- `GET /api/auth/session` — whoami

**Catalog**
- `GET /api/products?category=lighting&search=bulb` — list
- `POST /api/admin/products` (ADMIN)
- `PATCH /api/admin/products/:id` (ADMIN)

**Cart**
- `POST /api/cart` `{ productId, qty }`
- `GET /api/cart`
- `DELETE /api/cart/:id`

**Checkout**
- `POST /api/checkout` `{ provider }` -> returns redirection URL for KNET via adapter
- Webhooks: `/api/webhooks/tap`, `/api/webhooks/myfatoorah`

**Scheduling**
- `GET /api/slots?from=...&to=...`
- `POST /api/bookings` `{ slotId, address }`

**Leads & Intake**
- `POST /api/leads` (answers from guided intake)

**Subscriptions**
- `POST /api/subscribe` `{ email, name }`

---

## 5) Provider Adapters (KNET via Tap/MyFatoorah)
```ts
// /lib/payments/index.ts
export type CheckoutResult = { redirectUrl: string; provider: string; payload?: any };
export interface ProviderAdapter {
  name: string;
  createCheckout: (params: { amount: number; currency: string; orderId: string; customer: { email?: string; phone?: string; name?: string } }) => Promise<CheckoutResult>;
  verifyWebhook: (req: Request) => Promise<{ orderId: string; success: boolean; providerRef: string; raw: any }>;
}

export const adapters: Record<string, ProviderAdapter> = {};
```

```ts
// /lib/payments/tap.ts (KNET through Tap Payments)
import type { ProviderAdapter, CheckoutResult } from "./index";
export const TapAdapter: ProviderAdapter = {
  name: "tap",
  async createCheckout({ amount, currency, orderId, customer }) {
    // Create Tap charge with source `src_kw.knet` (KNET) and KWD currency
    // NOTE: Replace with real secret key usage on server side.
    const res = await fetch("https://api.tap.company/v2/charges", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.TAP_SECRET}` },
      body: JSON.stringify({
        amount,
        currency,
        customer: { first_name: customer.name, email: customer.email, phone: { country_code: "965", number: customer.phone } },
        source: { id: "src_kw.knet" },
        description: `Order ${orderId}`,
        redirect: { url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/return?provider=tap` },
        post: { url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/webhooks/tap` }
      })
    });
    const data = await res.json();
    return { redirectUrl: data.transaction?.url ?? data.redirect?.url, provider: "tap", payload: data } as CheckoutResult;
  },
  async verifyWebhook(req) {
    // Verify Tap webhook signature if configured, then map to orderId
    const raw = await req.json();
    const success = raw?.status === "CAPTURED" || raw?.status === "AUTHORIZED";
    const providerRef = raw?.id;
    const orderId = raw?.metadata?.order_id ?? raw?.reference?.order;
    return { orderId, success, providerRef, raw };
  }
};
```

```ts
// /lib/payments/myfatoorah.ts (KNET via MyFatoorah gateway)
import type { ProviderAdapter, CheckoutResult } from "./index";
export const MyFatoorahAdapter: ProviderAdapter = {
  name: "myfatoorah",
  async createCheckout({ amount, currency, orderId, customer }) {
    const init = await fetch(`${process.env.MF_BASE}/v2/InitiatePayment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.MF_TOKEN}` },
      body: JSON.stringify({ InvoiceAmount: amount, CurrencyIso: currency })
    }).then(r => r.json());

    const exec = await fetch(`${process.env.MF_BASE}/v2/ExecutePayment`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.MF_TOKEN}` },
      body: JSON.stringify({
        PaymentMethodId: 2, // example; KNET ID varies per account
        InvoiceValue: amount,
        CustomerName: customer.name,
        CustomerEmail: customer.email,
        CustomerMobile: customer.phone,
        CallBackUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/return?provider=myfatoorah`,
        ErrorUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout/return?provider=myfatoorah&status=error`,
        UserDefinedField: orderId
      })
    }).then(r => r.json());

    return { redirectUrl: exec?.Data?.PaymentURL, provider: "myfatoorah", payload: exec } as CheckoutResult;
  },
  async verifyWebhook(req) {
    const raw = await req.json();
    const success = raw?.EventType === "PAYMENT_SUCCEEDED";
    const providerRef = raw?.Data?.InvoiceId ?? raw?.Data?.PaymentId;
    const orderId = raw?.Data?.UserDefinedField;
    return { orderId, success, providerRef, raw };
  }
};
```

---

## 6) Next.js App Scaffold (minimal)
```tsx
// /app/layout.tsx
import "./globals.css";
export const metadata = { title: "Beyond Smart Homes", description: "Smart home services in Kuwait" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen antialiased">{children}</body>
    </html>
  );
}
```

```tsx
// /app/page.tsx (Home)
import Link from "next/link";
export default function Home() {
  return (
    <main className="mx-auto max-w-6xl p-6 space-y-8">
      <section className="text-center space-y-3">
        <h1 className="text-4xl font-bold">Beyond Smart Homes</h1>
        <p className="text-lg">Design, install, and maintain smart home systems across Kuwait.</p>
        <div className="flex justify-center gap-3">
          <Link href="/shop" className="px-4 py-2 rounded-xl border">Shop Services</Link>
          <Link href="/intake" className="px-4 py-2 rounded-xl border">Find Your Solution</Link>
        </div>
      </section>
      <section>
        <h2 className="text-2xl font-semibold mb-2">Featured Services</h2>
        {/* TODO: Fetch from /api/products?featured=true */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border rounded-xl p-4">Service card</div>
          ))}
        </div>
      </section>
    </main>
  );
}
```

```tsx
// /app/intake/page.tsx — guided intake (rules-first)
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
const Q = [
  { id: "area", label: "Which area are you smartifying first?", options: ["Lighting", "Security", "Climate", "Media", "Networking", "Energy"] },
  { id: "budget", label: "Approximate budget (KWD)?", options: ["<100", "100-300", "300-700", ">700"] },
  { id: "timeline", label: "When do you want it done?", options: ["ASAP", "This month", "This quarter"] }
];
export default function Intake() {
  const [answers, setAnswers] = useState<Record<string,string>>({});
  const router = useRouter();
  const submit = async () => {
    await fetch("/api/leads", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ answers }) });
    // Route based on area
    const area = answers["area"]?.toLowerCase();
    if (area) router.push(`/shop?category=${encodeURIComponent(area)}`);
    else router.push("/shop");
  };
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-6">
      <h1 className="text-3xl font-bold">Tell us what you need</h1>
      {Q.map(q => (
        <div key={q.id} className="space-y-2">
          <div className="font-medium">{q.label}</div>
          <div className="flex flex-wrap gap-2">
            {q.options.map(opt => (
              <button key={opt} onClick={() => setAnswers(a => ({ ...a, [q.id]: opt }))} className={`px-3 py-1 rounded-xl border ${answers[q.id]===opt?"bg-gray-100":""}`}>{opt}</button>
            ))}
          </div>
        </div>
      ))}
      <button onClick={submit} className="px-4 py-2 rounded-xl border">Continue</button>
    </main>
  );
}
```

```ts
// /app/api/checkout/route.ts — unified checkout
import { NextRequest, NextResponse } from "next/server";
import { adapters } from "@/lib/payments";
import { TapAdapter } from "@/lib/payments/tap";
import { MyFatoorahAdapter } from "@/lib/payments/myfatoorah";
import { prisma } from "@/lib/prisma";

adapters["tap"] = TapAdapter;
adapters["myfatoorah"] = MyFatoorahAdapter;

export async function POST(req: NextRequest) {
  const body = await req.json();
  const { provider = "tap" } = body;
  const userId = body.userId; // pull from session in real app
  // Sum cart
  const items = await prisma.cartItem.findMany({ where: { userId }, include: { product: true } });
  const amount = items.reduce((sum, it) => sum + Number(it.product.price) * it.qty, 0);
  // Create order skeleton
  const order = await prisma.order.create({ data: { userId, total: amount, provider: provider.toUpperCase() as any, status: "PENDING" as any } });
  const adapter = adapters[provider];
  const res = await adapter.createCheckout({ amount, currency: "KWD", orderId: order.id, customer: { name: body.name, email: body.email, phone: body.phone } });
  return NextResponse.json(res);
}
```

```ts
// /app/api/leads/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { answers, email, phone, name } = await req.json();
  await prisma.lead.create({ data: { answers, email, phone, name, source: "intake" } });
  return NextResponse.json({ ok: true });
}
```

```ts
// /app/api/slots/route.ts — list availability
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const from = new Date(searchParams.get("from") ?? Date.now());
  const to = new Date(searchParams.get("to") ?? Date.now() + 1000*60*60*24*30);
  const slots = await prisma.availabilitySlot.findMany({ where: { start: { gte: from }, end: { lte: to }, status: "AVAILABLE" }, orderBy: { start: "asc" } });
  return NextResponse.json(slots);
}
```

```ts
// /app/api/bookings/route.ts — reserve a slot (simple, no overlap)
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function POST(req: Request) {
  const { slotId, address, userId } = await req.json();
  const slot = await prisma.availabilitySlot.findUnique({ where: { id: slotId } });
  if (!slot || slot.status !== "AVAILABLE") return NextResponse.json({ ok:false, error:"Slot not available" }, { status: 400 });
  const booking = await prisma.booking.create({ data: { slotId, userId, address } });
  await prisma.availabilitySlot.update({ where: { id: slotId }, data: { status: "BLOCKED" } });
  return NextResponse.json({ ok:true, booking });
}
```

```ts
// /lib/prisma.ts
import { PrismaClient } from "@prisma/client";
export const prisma = globalThis.prisma || new PrismaClient();
if (process.env.NODE_ENV !== "production") (globalThis as any).prisma = prisma;
```

---

## 7) Admin (MVP)
- `/admin` (protected): summary cards (Revenue, Orders, Bookings), quick links.
- `/admin/products` CRUD with price/cost/profit; CSV import/export.
- `/admin/projects` case study editor (Markdown + gallery upload).
- `/admin/slots` calendar editor for availability (drag to add blocks).
- `/admin/marketing` subscribers export, email blast composer.

(Use a light UI kit like shadcn/ui; role-guard on server with Next middleware.)

---

## 8) AI Concierge (MVP)
- Client component that runs the same question tree as `/intake` inline in a chat-style UI.
- Optional LLM mode can summarize answers into a `Lead` and propose bundles; guardrails with system prompts.

---

## 9) Environment Variables
```
DATABASE_URL=
NEXTAUTH_SECRET=
NEXTAUTH_URL=
NEXT_PUBLIC_BASE_URL=
TAP_SECRET=
MF_BASE=https://apitest.myfatoorah.com
MF_TOKEN=
```

---

## 10) Roadmap
1. Stand up DB + Prisma, run `npx prisma migrate dev`.
2. Implement Auth + role gates.
3. Product catalog & categories; seed data.
4. Intake + lead capture + email subscription.
5. Cart + checkout (Tap or MyFatoorah sandbox) + webhooks.
6. Availability & booking in checkout.
7. Portfolio pages.
8. Admin dashboards.
9. Arabic i18n & RTL polish; SEO; analytics.
10. Uptime & logging.

---

## 11) Notes for Kuwait / KNET
- KNET redirection flow is required; currency KWD. KFAST supports saved cards (via provider). Set provider in `.env` and enable sandbox for tests.

---

## 12) Styling
- Tailwind preinstalled (not shown): neutral palette, rounded-2xl, shadows, spacing. Add Arabic font later.

---

## 13) Testing
- Unit: adapters + pricing.
- E2E: Playwright checkout (mock provider) + booking.

---

---

## 14) Your Choices Applied (KNET via Tap, Vercel, Branding, i18n)

### Payments — KNET (Tap)
- Default provider set to **Tap** (KNET source `src_kw.knet`).
- In `/lib/payments/index.ts`, ensure `adapters["tap"] = TapAdapter` remains the default and use `provider: "tap"` at checkout.
- ENV needed (sandbox to start):
```
TAP_SECRET=sk_test_xxx
NEXT_PUBLIC_BASE_URL=https://your-domain.vercel.app
```
- Webhook URL in Tap dashboard: `${NEXT_PUBLIC_BASE_URL}/api/webhooks/tap`

### Deployment — Vercel + GitHub
- Create a **GitHub repo** (great place to start; version control + CI). Push this code.
- Import the repo in **Vercel** → it auto-builds your Next.js app.
- Add ENV on Vercel: `DATABASE_URL`, `TAP_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `NEXT_PUBLIC_BASE_URL`.
- Postgres options: **Neon** or **Supabase** (paste their connection string into `DATABASE_URL`).
- Run migrations once via Vercel CLI or deploy hook: `npx prisma migrate deploy`.

### Branding — Colors & Theme (Tailwind)
- Add to `globals.css` or Tailwind theme tokens:
```css
:root{
  --brand-bg:#010823; /* deep navy */
  --brand-accent:#ffcd00; /* yellow */
  --brand-link:#008fe7; /* blue */
  --brand-fore:#ffffff; /* white */
}
html,body{ background:var(--brand-bg); color:var(--brand-fore); }
a{ color:var(--brand-link); }
.btn-primary{ background:var(--brand-accent); color:#010823; border-radius:1rem; padding:.6rem 1rem; }
.card{ background:#0b1333; border:1px solid rgba(255,255,255,.08); border-radius:1rem; }
```
- Update home/CTA buttons to `.btn-primary` and cards to `.card` for consistent styling.

### i18n — English default with Arabic switch on every page
- Add `next-intl` and locales structure:
```
/src/messages/en.json
/src/messages/ar.json
```
- Middleware for locale routing:
```ts
// /middleware.ts
import createMiddleware from 'next-intl/middleware';
export default createMiddleware({ locales:['en','ar'], defaultLocale:'en' });
export const config = { matcher: ['/', '/(en|ar)/:path*'] };
```
- App layout using locale segment:
```tsx
// /app/[locale]/layout.tsx
import '../globals.css';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
export default async function LocaleLayout({ children, params:{locale} }:{children:React.ReactNode, params:{locale:string}}){
  const messages = await getMessages();
  return (
    <html lang={locale} dir={locale==='ar'?'rtl':'ltr'}>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider messages={messages} locale={locale}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
```
- Language switcher component:
```tsx
// /components/LocaleSwitch.tsx
'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
function swapLocale(path:string, to:'en'|'ar'){ const parts=path.split('/'); parts[1] = (parts[1]==='en'||parts[1]==='ar')?to:to; return parts.join('/'); }
export default function LocaleSwitch(){
  const pathname = usePathname();
  return (
    <div className="flex gap-2">
      <Link className="px-3 py-1 rounded-xl border" href={swapLocale(pathname,'en')}>EN</Link>
      <Link className="px-3 py-1 rounded-xl border" href={swapLocale(pathname,'ar')}>AR</Link>
    </div>
  );
}
```
- Update pages to live under `/app/[locale]/...` and link with `href="/en/..."` or `href="/ar/..."` as needed. Home route `/` redirects to `/en`.

---

## 15) Categories & Seed Data
Create a seed script to pre-populate your catalog and portfolio.
```ts
// /prisma/seed.ts
import { prisma } from '../src/lib/prisma';
async function main(){
  const cats = [
    { slug:'lighting', name:'Lighting' },
    { slug:'security', name:'Security' },
    { slug:'climate', name:'Climate' },
    { slug:'media', name:'Media' },
    { slug:'networking', name:'Networking' },
    { slug:'energy', name:'Energy' },
    { slug:'services', name:'Services' },
  ];
  for(const c of cats){ await prisma.category.upsert({ where:{slug:c.slug}, update:{}, create:c }); }
  await prisma.product.upsert({
    where:{ slug:'nest-thermostat-pro-install' },
    update:{},
    create:{
      slug:'nest-thermostat-pro-install', name:'Nest Thermostat – Pro Install', type:'SERVICE',
      price:'45.00', cost:'15.00', profit:'30.00',
      excerpt:'Supply & configure, connect to Home Assistant',
      attributes:{ duration:'60-90 min', warranty:'90 days' },
      category:{ connect:{ slug:'climate' } }
    }
  });
  await prisma.projectCase.upsert({
    where:{ slug:'seaside-villa-hvac-zoning' },
    update:{},
    create:{
      slug:'seaside-villa-hvac-zoning', title:'Seaside Villa — HVAC Zoning & Energy',
      summary:'Zoned climate control with smart schedules; 18% energy savings',
      body:'# Overview
We installed multi-zone controls…', tags:['Climate','Energy','Kuwait City'], published:true
    }
  });
}
main().then(()=>process.exit(0)).catch((e)=>{console.error(e);process.exit(1)});
```
Run: `npx prisma db seed` (configure `package.json` → `"prisma": { "seed": "ts-node prisma/seed.ts" }`).

---

## 16) Checkout & Booking Flow (UX tweak)
- `/checkout` steps: **Address → Pick Slot → Pay (KNET)**.
- Disable slot selection until address is provided; after payment webhook confirms success, show booking confirmation and email the customer.

---

## 17) GitHub + Vercel Setup Steps (copy/paste)
1. **Create repo** on GitHub → push this project.
2. **Neon/Supabase**: create Postgres → copy `DATABASE_URL`.
3. **Vercel**: New Project → Import GitHub repo.
4. Set ENV: `DATABASE_URL`, `TAP_SECRET`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL=https://<vercel-app>.vercel.app`, `NEXT_PUBLIC_BASE_URL=https://<vercel-app>.vercel.app`.
5. Deploy → open Vercel shell to run `npx prisma migrate deploy && npx prisma db seed`.
6. In Tap dashboard, set webhook to `/api/webhooks/tap`.
7. Test checkout in sandbox; verify order status flips to PAID.

---

## 18) Next Steps
- I18n copy: add Arabic translations in `/src/messages/ar.json`.
- Add your **About** content, **team**, and **project photos** (upload to storage bucket).
- Enable **Admin** pages with role guard and CRUD for Products/Projects/Slots.
- Add **AI Concierge** bubble on every page, feeding into `/api/leads`.

_End of update._
