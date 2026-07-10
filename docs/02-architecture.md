# 05 — Architecture

## Tech Stack

| Layer | Technology | Target version | Rationale |
|-------|-----------|----------------|-----------|
| Frontend framework | Angular | 18+ | Mature ecosystem, strong TypeScript typing, native i18n |
| UI components | Ionic | 7+ | Mobile-first components, native gestures, Angular-compatible |
| Backend / BaaS | Supabase | Latest stable | REST and realtime API, auth, storage — no own server needed |
| Database | PostgreSQL | (managed by Supabase) | Relational, native RLS, team familiarity |
| Authentication | Supabase Auth | — | JWT, secure sessions, Google OAuth ready |
| Frontend hosting | Netlify | — | Git-based CI/CD, global CDN, free PR previews |
| Transactional email | [TBD] | — | Options: Resend, SendGrid, or Supabase Edge Functions + SMTP |
| Payment gateway | [TBD] | — | Options for the Bolivian market: Tigo Money, QR Simple, Stripe |

---

## Layer Diagram

```
┌─────────────────────────────────────────┐
│         Client (Browser / Ionic)        │
│                                         │
│  Angular SPA                            │
│  ├── Pages (Home, Catalog, Product)     │
│  ├── Ionic Components (UI)              │
│  ├── Angular Services (business logic)  │
│  └── Supabase JS Client (SDK)           │
└───────────────────┬─────────────────────┘
                    │ HTTPS / WebSocket
                    ▼
┌─────────────────────────────────────────┐
│              Supabase (BaaS)            │
│                                         │
│  ├── Auth (JWT, OAuth)                  │
│  ├── PostgREST (auto REST API)          │
│  ├── Realtime (subscriptions)           │
│  ├── Storage (product images)           │
│  └── Edge Functions (serverless logic)  │
└───────────────────┬─────────────────────┘
                    │
                    ▼
┌─────────────────────────────────────────┐
│           PostgreSQL (Supabase)         │
│                                         │
│  Tables: producto, orders, order_items, │
│  categories, profiles, discount_codes,  │
│  usuario (internal only)                │
│  Row Level Security enabled             │
└─────────────────────────────────────────┘
```

---

## Data Flows

### Catalog query

```
User opens catalog
       │
       ▼
Angular calls supabase.from('products').select()
       │
       ▼
PostgREST executes the query on PostgreSQL
(RLS enforces: only active products with stock > 0)
       │
       ▼
JSON response → Angular updates the view
```

### Purchase flow

```
User confirms purchase
       │
       ▼
Angular invokes Edge Function: create-order
       │
       ▼
Edge Function:
  1. Validates user JWT session
  2. Checks stock for each item (SELECT FOR UPDATE)
  3. Calls the payment gateway
  4. If payment OK → INSERT order + order_items, UPDATE stock
  5. Triggers confirmation email
       │
       ▼
Response → Angular shows success screen
```

---

## Database Schema (draft)

```sql
-- Product categories
categories (id, name, slug, image_url, created_at)

-- Base products
-- Real Supabase table name is "producto" (Spanish), shared with the in-store
-- POS/inventory app. Each row is already a complete sellable unit (e.g. one
-- flavor + nicotine strength combination) — there is no separate variants
-- table and none is planned. The Angular product service maps this table to
-- the TypeScript "Product" model (English field names).
producto (
  producto_id, codigo_barras, imagen, nombre, precio, costo, stock,
  descripcion, categoria_id, estado,       -- estado: available | out_of_stock | coming_soon | inactive
  flavor character varying NULL,             -- additive migration, nullable
  nicotine_mg numeric NULL,                  -- additive migration, nullable
  product_type character varying NULL,       -- additive migration, nullable
  featured boolean NOT NULL DEFAULT false,   -- additive migration
  images jsonb NULL                          -- additive migration, nullable
)

-- Users (extends Supabase auth.users)
-- Customer authentication uses Supabase Auth (auth.users) natively.
-- This "profiles" table is exclusively for web store customers and is
-- unrelated to the internal "usuario" table (plaintext-password staff
-- login used only by the internal POS/inventory app).
profiles (
  id references auth.users, full_name, phone,
  default_address jsonb, created_at
)

-- Orders
orders (
  id, user_id, status, shipping_address jsonb,
  payment_method, subtotal, discount, shipping_cost, total,
  discount_code_id, created_at, updated_at
)

-- Items per order
order_items (
  id, order_id, product_id, quantity, unit_price, subtotal
)

-- Discount codes
discount_codes (
  id, code, type,  -- percentage | fixed
  value, max_uses, uses_count, valid_until, active
)

-- Store operating hours / holiday mode (single row)
store_settings (
  id uuid PK, opens_at time, closes_at time, days_open int[],
  holiday_mode boolean, closed_message text
)
```

---

## Row Level Security (RLS) Policies

| Table | Policy | Description |
|-------|--------|-------------|
| `producto` | Public SELECT | Anyone can read active products; maps directly to the `Product` model — no variants table involved |
| `profiles` | Own SELECT / UPDATE | User can only read and edit their own profile |
| `orders` | Own SELECT / INSERT | User can only see their own orders |
| `order_items` | SELECT via orders | Inherited from the user's order |
| `discount_codes` | Authenticated SELECT | Only users with an active session can query |
| `usuario` | No public policy | Internal-only table for staff POS/inventory login; never exposed to the web store |

---

## Architecture Decisions

| Decision | Discarded alternative | Reason |
|----------|-----------------------|--------|
| Supabase as BaaS | Custom backend (Node/Express) | Reduces development time; auth and storage included out of the box |
| Angular + Ionic | React Native, Next.js | Angular dominates the team's stack; Ionic provides mobile support without an app store for v1 |
| Netlify hosting | Vercel, AWS S3 | Simple Angular integration, free CI/CD, PR preview links |
| PostgreSQL (Supabase) | Firebase Firestore | Relational model required for inventory and orders; more expressive RLS |
| Edge Functions for checkout | External API | Keeps payment logic server-side without exposing keys to the client |

---

## Required Environment Variables

```
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=     # Edge Functions only — never in the client
PAYMENT_GATEWAY_API_KEY=       # [TBD]
SMTP_API_KEY=                  # [TBD]
```
