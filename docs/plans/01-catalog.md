# Plan 01 — Product Catalog

> Status: **Draft — pending tech lead review**
> Spec reference: [docs/specs/01-catalog.md](../specs/01-catalog.md)
> Architecture reference: [docs/02-architecture.md](../02-architecture.md)
> Scope: frontend (Angular/Ionic) + Supabase read-side queries only. No checkout, no auth, no admin logic.

This plan breaks Feature 1 (Catalog) into small, independently reviewable technical steps. No source code is written as part of this plan — implementation starts only after sign-off.

---

## 1. Scope

**In scope** (maps to spec inputs/outputs):

- Age verification gate (I-01, I-02, O-01)
- Store-open/closed banner (O-02)
- Home screen with categories + featured products (I-03, I-04, O-03)
- Category browsing, search, filters, sort, pagination (I-05–I-12, O-04–O-10)
- Navigation to product detail route (I-13) — route target only; the detail page itself is Spec 02 and is out of scope here.

**Out of scope:** cart, checkout, authentication, admin CRUD (Specs 03–06).

---

## 2. New dependencies

| Package | Purpose |
|---|---|
| `@supabase/supabase-js` | Official Supabase client SDK, per architecture doc |

No other new dependencies — filtering/sorting/search UI is built with stock Ionic components (`ion-searchbar`, `ion-range`, `ion-select`, `ion-chip`, `ion-infinite-scroll`, `ion-badge`).

---

## 3. Target file/folder structure

```
src/app/
├── core/
│   ├── supabase/
│   │   └── supabase.service.ts
│   ├── models/
│   │   ├── category.model.ts
│   │   ├── product.model.ts
│   │   ├── product-variant.model.ts
│   │   ├── stock-status.model.ts
│   │   ├── product-filters.model.ts
│   │   ├── sort-option.model.ts
│   │   └── store-settings.model.ts
│   ├── age-gate/
│   │   ├── age-verification.service.ts
│   │   ├── age.guard.ts
│   │   └── age-verification-modal/
│   │       └── age-verification-modal.component.(ts|html|scss)
│   └── store-hours/
│       ├── store-hours.service.ts
│       └── store-closed-banner/
│           └── store-closed-banner.component.(ts|html|scss)
└── catalog/
    ├── catalog.module.ts
    ├── catalog-routing.module.ts
    ├── catalog.page.(ts|html|scss)
    ├── services/
    │   ├── category.service.ts
    │   ├── product.service.ts
    │   └── catalog-state.service.ts
    └── components/
        ├── category-list/
        ├── search-bar/
        ├── filter-panel/
        ├── active-filter-chips/
        ├── sort-selector/
        ├── product-card/
        ├── product-grid/
        └── empty-state/
```

`core/` holds cross-cutting concerns (Supabase client, age gate, store hours) since they apply app-wide, not only to the catalog screen. `catalog/` is a lazy-loaded feature module, consistent with the `home` module already scaffolded in Feature 0.

---

## 4. Atomic steps

### Phase A — Supabase foundation

**Step 1. Install and configure the Supabase client**
- Add `@supabase/supabase-js` to `package.json`.
- Add `supabaseUrl` and `supabaseAnonKey` fields to `src/environments/environment.ts` and `environment.prod.ts` (placeholder values; real keys via Netlify env vars later).

**Step 2. Create `SupabaseService`**
- File: `src/app/core/supabase/supabase.service.ts`.
- Single responsibility: instantiate and expose one `SupabaseClient` instance (`createClient(environment.supabaseUrl, environment.supabaseAnonKey)`) as an injectable Angular singleton (`providedIn: 'root'`).
- No query logic here — only the raw client, consumed by feature services.

**Step 3. Define TypeScript data models**
- `category.model.ts`: `id, name, slug, imageUrl`.
- `product.model.ts`: `id, categoryId, name, brand, description, basePrice, images: string[], status, createdAt`.
- `product-variant.model.ts`: `id, productId, flavor, nicotineMg, sizeMl, priceOverride, stock, sku`.
- `stock-status.model.ts`: enum `Available | LowStock | OutOfStock`, plus a pure function mapping `stock: number` → status (threshold for "low stock" to be confirmed with tech lead — not specified in spec).
- `product-filters.model.ts`: shape `{ categoryId?, searchTerm?, type?, flavors?: string[], nicotineLevels?: number[], minPrice?, maxPrice? }`.
- `sort-option.model.ts`: enum `Relevance | PriceLowToHigh | PriceHighToLow | Newest`.
- `store-settings.model.ts`: matches the `store_settings` table defined in the architecture doc's Database Schema section.

### Phase B — Age verification gate (I-01, I-02, O-01)

**Step 4. Create `AgeVerificationService`**
- File: `src/app/core/age-gate/age-verification.service.ts`.
- Reads/writes a single localStorage key (e.g. `drakarys_age_verified: 'true'`) per the business rule "popup shown once per device."
- Exposes `isVerified(): boolean`, `confirmAge(): void`, `declineAge(): void`.
- `declineAge()` does **not** clear or set the localStorage flag — it just signals decline so the guard can block access on this visit (per spec: declining blocks this session, it does not need to be remembered as a permanent block, since the popup must still be able to show on a future visit). Confirm this interpretation with tech lead if ambiguous.

**Step 5. Create `AgeGuard` (CanActivate / CanMatch)**
- File: `src/app/core/age-gate/age.guard.ts`.
- Blocks navigation into any catalog route when `AgeVerificationService.isVerified()` is false; redirects to a root "age gate" state that presents the modal.

**Step 6. Create `AgeVerificationModalComponent`**
- File: `src/app/core/age-gate/age-verification-modal/`.
- Presentational `ion-modal` (or full-screen overlay), non-dismissible by backdrop tap.
- Two actions wired to `confirmAge()` / `declineAge()` (I-01, I-02).
- On decline: render a blocking "store inaccessible" message (per spec, no redirect target is defined — confirm with tech lead whether this should redirect to an external URL or just show an in-app blocking screen).

**Step 7. Wire the age gate into root navigation**
- Modify `app.component.ts`/`.html` to show `AgeVerificationModalComponent` when `!isVerified()`, and `app-routing.module.ts` to apply `AgeGuard` to the catalog route.

### Phase C — Store hours / closed banner (O-02)

**Step 8. Create `StoreHoursService`**
- File: `src/app/core/store-hours/store-hours.service.ts`.
- Fetches the single row from `store_settings` via `SupabaseService`.
- Exposes `isOpen(): Observable<boolean>` computed from current time vs. `opens_at`/`closes_at`/`days_open`, OR `holiday_mode === true` forcing closed regardless of time.

**Step 9. Create `StoreClosedBannerComponent`**
- File: `src/app/core/store-hours/store-closed-banner/`.
- Pure presentational component; renders only when `StoreHoursService.isOpen()` emits `false`. Displays `closed_message` if set, otherwise a default string.

**Step 10. (Backend) Create the `store_settings` table + RLS policy**
- Not Angular code — a Supabase migration/SQL step implementing the `store_settings` table now confirmed in the architecture doc's Database Schema section.
- Public `SELECT` policy, no public `INSERT`/`UPDATE` (admin-only via Spec 06, later).

### Phase D — Catalog data services

**Step 11. Create `CategoryService`**
- File: `src/app/catalog/services/category.service.ts`.
- `getCategories(): Observable<Category[]>` — `supabase.from('categories').select()`.

**Step 12. Create `ProductService` — query builder**
- File: `src/app/catalog/services/product.service.ts`.
- `getProducts(filters: ProductFilters, sort: SortOption, page: number): Observable<Product[]>`.
- Translates filter object into chained Supabase query modifiers: `.ilike('name', ...)` for search (I-05, also matches brand per spec), `.eq('category_id', ...)` (I-04), `.in(...)` for flavor/nicotine (I-07, I-08, joined against `product_variants`), `.gte/.lte('base_price', ...)` (I-09), `.order(...)` per sort option (I-10), `.range(...)` for pagination (I-12).
- RLS on the Supabase side already restricts to active products with stock per the architecture doc's data-flow notes — service does not need to filter `status = inactive` client-side.

**Step 13. Create `ProductService` — featured/home query**
- Add `getFeaturedProducts(): Observable<Product[]>` for the home screen (O-03) — same service, separate method, no filters.

**Step 14. Create `CatalogStateService`**
- File: `src/app/catalog/services/catalog-state.service.ts`.
- Holds current filters, search term, sort option, and page as RxJS state (e.g. `BehaviorSubject`s or signals), debounces search input changes (business rule: "results update after a short pause while typing"), and re-triggers `ProductService.getProducts()` on any state change.
- Single source of truth consumed by `CatalogPage` and all filter/sort/search child components — keeps those components "dumb" (input/output only).

### Phase E — Routing & module scaffolding

**Step 15. Create `CatalogModule` + `CatalogRoutingModule`**
- Lazy-loaded feature module at route `/catalog`, mirroring the existing `home` module's structure from Feature 0.
- Route protected by `AgeGuard` (Step 5).

**Step 16. Update `AppRoutingModule`**
- Add the lazy `loadChildren` entry for `CatalogModule`.

**Step 17. Update `HomePage` (O-03)**
- Inject `CategoryService` and `ProductService.getFeaturedProducts()` to render categories + highlighted products; tapping a category navigates to `/catalog` with that category pre-applied as a filter (I-04).

### Phase F — Presentational UI components

Each is a small, independently testable Ionic component living under `src/app/catalog/components/`. None contain data-fetching logic — all receive data via `@Input()` and emit user actions via `@Output()`, consumed by `CatalogPage`/`CatalogStateService`.

**Step 18. `CategoryListComponent`** — horizontal scrollable list of categories (I-04).

**Step 19. `SearchBarComponent`** — wraps `ion-searchbar`; emits debounced text changes upward (I-05).

**Step 20. `FilterPanelComponent`** — type (single-select), flavor (multi-select), nicotine (multi-select), price range (`ion-range`) controls in one panel/modal (I-06–I-09).

**Step 21. `ActiveFilterChipsComponent`** — renders one `ion-chip` per active filter with a remove (×) action; "clear all" action (I-11, O-09).

**Step 22. `SortSelectorComponent`** — wraps `ion-select` with the four sort options (I-10).

**Step 23. `ProductCardComponent`** — image, name, brand, price, stock badge (O-05). Emits a tap event for navigation (I-13).

**Step 24. `ProductGridComponent`** — responsive grid of `ProductCardComponent`s + `ion-infinite-scroll` for pagination (I-12); shows result count (O-10).

**Step 25. `EmptyStateComponent`** — "We couldn't find that product" message + category suggestions (O-08), shown when the grid is empty (No-results functional state).

### Phase G — Page composition

**Step 26. Assemble `CatalogPage`**
- Composes: `StoreClosedBannerComponent`, `CategoryListComponent`, `SearchBarComponent`, `SortSelectorComponent`, `FilterPanelComponent` (trigger), `ActiveFilterChipsComponent`, `ProductGridComponent` / `EmptyStateComponent` (conditionally).
- Reads/writes state exclusively through `CatalogStateService` (Step 14) — the page itself holds no query logic.
- On product card tap, navigates to the (future) product detail route with the product id (I-13); scroll position restoration on back-navigation (business rule) — use Angular Router's `RouteReuseStrategy` or Ionic's built-in scroll restoration, to be confirmed at implementation time.

### Phase H — Tests

**Step 27. Unit tests for services**
- `CategoryService`, `ProductService`, `CatalogStateService`, `AgeVerificationService`, `StoreHoursService` — Supabase client mocked, no live network calls.

**Step 28. Unit tests for components**
- Focus on: badge rendering logic (`ProductCardComponent` per stock status), empty-state trigger condition, filter chip add/remove, age modal confirm/decline emitting the right service calls.

### Phase I — Acceptance checklist (manual QA, post-implementation)

To be checked off against the spec before marking the feature done:

- [ ] Age popup blocks all content until confirmed (O-01); does not reappear after confirmation on the same device.
- [ ] Declining age blocks catalog access.
- [ ] Closed banner appears outside Mon–Sat 10:30–21:00 or when holiday mode is on; browsing still works; checkout entry points are not present yet (out of scope, but verify nothing breaks).
- [ ] Category tap, search, all four filter types, sort, and clear-filter(s) each independently and correctly narrow/reorder the grid.
- [ ] Result count and empty state behave correctly at zero results.
- [ ] Stock badges render correctly for available/low/out-of-stock; out-of-stock products remain visible.
- [ ] Inactive products never appear.
- [ ] Scroll position is preserved on back-navigation from product detail.

---

## 5. Explicitly deferred

- Product detail page implementation (Spec 02) — only the navigation target/route param contract is defined here.
- Any write operations (cart, checkout, admin) — read-only catalog queries only.
- Image optimization/CDN strategy for `products.images` — out of scope for this plan.
