# Spec 01 — Product Catalog

## Purpose

Allow any visitor to browse, search, and filter the store's product catalog without requiring an account. Age verification is enforced on first visit. Browsing is always available, but checkout is restricted to operating hours.

---

## User Inputs

| ID | Input | Description |
|----|-------|-------------|
| I-01 | Confirm age on the verification popup | The visitor taps "I am 18 or older" to confirm their age and access the catalog |
| I-02 | Decline age on the verification popup | The visitor taps "I am under 18"; the store becomes inaccessible |
| I-03 | Open the app | The visitor lands on the home screen after age is verified |
| I-04 | Select a category | Taps one of the main categories: Disposables, Pods, Liquids, Accessories, Other |
| I-05 | Type in the search bar | Free-text entry; searches by product name and brand |
| I-06 | Apply type filter | Single-select; narrows results by product type |
| I-07 | Apply flavor filter | Multi-select; narrows results by one or more available flavors (e.g. mint, fruit, tobacco) |
| I-08 | Apply nicotine filter | Selects one or more nicotine levels: 0 mg, 3 mg, 6 mg, 12 mg, 20 mg, 50 mg |
| I-09 | Apply price filter | Sets a minimum and maximum price range using a slider |
| I-10 | Change sort order | Selects one of: Relevance, Price low–high, Price high–low, Newest first |
| I-11 | Clear a filter | Removes a single active filter or clears all at once |
| I-12 | Scroll through results | Browses further down the product grid |
| I-13 | Select a product | Taps a product card to open its detail page |

---

## System Outputs

| ID | Output | Description |
|----|--------|-------------|
| O-01 | Age verification popup | A mandatory "+18" confirmation overlay shown on the customer's first visit; all catalog content is blocked until age is confirmed |
| O-02 | Store closed banner | A persistent banner shown at the top of the catalog when the current time is outside operating hours (Monday–Saturday, 10:30 AM – 9:00 PM) or when Holiday/Closed mode is active; browsing remains possible |
| O-03 | Home screen | Featured categories and highlighted products shown on arrival |
| O-04 | Product grid | Each card shows: main image, product name, brand, price, and stock badge |
| O-05 | Stock badge on card | One of: **Available** (green), **Low stock** (yellow), **Out of stock** (grey) |
| O-06 | Own Brand badge | A "Drakarys Exclusive" visual badge shown on product cards for products tagged as proprietary by the admin |
| O-07 | Search results | Same grid format as the catalog; includes a result count (e.g. "12 results") |
| O-08 | Empty search state | Message "We couldn't find that product" with category suggestions |
| O-09 | Active filter chips | Each applied filter is shown as a removable tag above the grid |
| O-10 | Result count | Updates in real time as filters are applied or removed |

---

## Functional States

| State | Condition | Behavior |
|-------|-----------|----------|
| Age not verified | Customer's first visit; age popup not yet confirmed | All catalog content is hidden behind the age verification popup; no browsing or interaction is possible |
| Age declined | Customer tapped "I am under 18" | The customer is redirected away from the store; the catalog is inaccessible |
| Store closed | Outside operating hours or Holiday/Closed mode is active | Full catalog is browsable; the "Store Closed" banner is displayed; checkout is blocked |
| Default catalog | Age verified; store open; no filters or search active | Shows all active products sorted by relevance |
| Filtered catalog | One or more filters active | Grid narrows to matching products; chips show applied filters |
| Search active | User has typed in the search bar | Grid shows matching results; filters still apply on top |
| No results | Search and filters return zero products | Empty state message is shown; grid is hidden |
| Out-of-stock product | Stock = 0 | Card shows grey badge; product is still visible but excluded from the "in stock" filter |
| Inactive product | Disabled by the store admin | Not shown in the catalog at all |

---

## Business Rules

- The age verification popup is shown once per device. Once the customer confirms their age, the popup does not appear again on future visits.
- If the customer declines age verification, they cannot access the catalog. No content is shown.
- The "Store Closed" banner is informational for the catalog. Customers may browse products and add items to their cart while the store is closed; only checkout is blocked.
- Search results update after a short pause while the user types (no need to press a button).
- Scroll position is preserved when the user navigates back from a product detail page.
- Filters accumulate (each new filter further narrows results); clearing a filter expands results again.
- Out-of-stock products remain visible in the catalog unless the admin explicitly deactivates them.
- The "Drakarys Exclusive" badge is set per product by the admin and reflects products manufactured or distributed exclusively by the store.
