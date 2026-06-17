# 06 — Non-Functional Requirements

## Performance

| Requirement | Target | How it is met |
|-------------|--------|---------------|
| Initial load time | < 3 s on a standard mobile connection (4G) | Angular route lazy loading, Netlify CDN, WebP images |
| Catalog render after search/filter | < 1.5 s | 300 ms debounce on search, server-side pagination via PostgREST |
| Supported concurrent users | ≥ 500 (initial phase) | Supabase infrastructure + CDN; scale the plan if the limit is exceeded |
| Catalog images | < 150 KB per image | WebP compression + max dimensions 800×800 px on upload to Supabase Storage |

### Loading strategy

- **Skeleton screens** while product lists load (avoid blank pages).
- **Infinite scroll or pagination** of 20 products per page to avoid heavy queries.
- **Local cache** for categories and store configuration (rarely change).

---

## Languages and Internationalization

| Requirement | Detail |
|-------------|--------|
| Primary language | Spanish (Bolivia) — `es-BO` |
| Currency format | Bolivian boliviano (Bs.) — `BOB` |
| English readiness | Use `@angular/localize` from the start; all strings in `.xlf` files |
| Date format | `DD/MM/YYYY` per regional convention |

---

## Compatibility

### Web browsers

| Browser | Supported versions |
|---------|--------------------|
| Chrome | Last 2 versions |
| Firefox | Last 2 versions |
| Safari | Last 2 versions |
| Edge | Last 2 versions |

### Mobile devices

| Platform | Minimum version |
|----------|----------------|
| Android | 8.0 (API level 26) |
| iOS | 13.0 |

### Screens

- **Mobile-first:** designed from 320 px width.
- Responsive breakpoints: 320 px / 768 px / 1024 px / 1440 px.
- No separate desktop version — same app adapted.

---

## Security

| Requirement | Implementation |
|-------------|---------------|
| Authentication | Supabase Auth with JWT tokens; 1-hour sessions + refresh token |
| Authorization | Row Level Security on PostgreSQL — each user only accesses their own data |
| Encrypted communication | HTTPS mandatory on all endpoints; HSTS enabled |
| Payment data | Not stored in the app's own database; delegated 100% to the payment gateway |
| API keys | `SUPABASE_SERVICE_ROLE_KEY` and payment keys only in Edge Functions (server-side) |
| Input validation | Validated on the frontend (Angular Reactive Forms) and in the database (constraints) |
| Rate limiting | Supabase Auth has native rate limiting; apply in Edge Functions if needed |
| XSS protection | Angular escapes by default; avoid `bypassSecurityTrust*` without justification |
| CSRF protection | JWT tokens in `Authorization` header (not cookies); mitigates CSRF by design |

---

## Availability and Reliability

| Requirement | Target | Responsible |
|-------------|--------|-------------|
| Monthly uptime | ≥ 99.5 % | Supabase SLA + Netlify SLA |
| Recovery from Supabase failure | Frontend shows clear error messages instead of blank screens | Error handling in Angular services |
| Request timeout | 10 s maximum before showing an error to the user | Configured in the Supabase client |
| Stock hold during checkout | 15 minutes before automatic release | Edge Function + Supabase cron job or pg_cron |

### Error handling strategy

- Every API call has a `try/catch` block with a user-friendly error toast.
- Network errors are differentiated from business errors in the user-facing message.
- Critical errors (payment failure, insufficient stock) are logged in Supabase for review.

---

## Accessibility

Minimum compliance with **WCAG 2.1 Level AA**.

| Area | Requirement |
|------|-------------|
| Color contrast | Minimum ratio 4.5:1 for normal text, 3:1 for large text |
| Images | Descriptive `alt` attribute on all product images |
| Forms | Labels correctly associated with each input; accessible error messages |
| Keyboard navigation | The entire purchase flow is navigable without a mouse |
| Visible focus | Focus indicator visible on all interactive elements |
| Ionic components | Ionic components include ARIA roles by default; verify during testing |

---

## Observability

| Tool | Use | Status |
|------|-----|--------|
| Supabase Dashboard | Query logs, auth errors, storage usage | Included in the plan |
| Netlify Analytics | Web traffic, most visited pages | [TBD: free vs paid plan] |
| Error tracking | JS error capture in production | [TBD: Sentry or similar] |

---

## SLO Summary v1.0

| Indicator | Target |
|-----------|--------|
| Availability | ≥ 99.5 % monthly |
| Initial load time | < 3 s (P90, mobile 4G) |
| Catalog response time | < 1.5 s (P90) |
| Checkout error rate | < 1 % |
| Out-of-stock sales | 0 incidents |


## Maintainability

| Area | Strategy |
|------|----------|
| **Modular Code** | Components and architecture built using highly reusable Angular/Ionic structures. |
| **Environments** | Dedicated, separate environment variables configuration for Development, Staging, and Production. |
| **Onboarding** | Minimum technical documentation guidelines to ensure seamless integration of new developers. |

---

## Legal and Regulatory Restrictions

| Requirement | Implementation | Regulation / Law |
|-------------|----------------|------------------|
| **Age Gate** | Verification popup dialog upon entry; vaping items are strictly age-restricted to 18+. | Bolivian Regulations (Minor protection) |
| **Privacy Policy** | Explicit, user-visible privacy statement during sign-up and checkout processes. | Bolivia's Law N° 164 (Telecommunications and ICT) |