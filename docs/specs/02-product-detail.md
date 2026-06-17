# Spec 02 — Product Detail

## Purpose

Give the customer all the information they need to make a purchase decision for a specific product, including variant selection and real-time stock status. Age verification and store operating hours rules apply on this page in the same way as the catalog.

---

## User Inputs

| ID | Input | Description |
|----|-------|-------------|
| I-01 | Open product page | Arrives from a catalog card, search result, or direct link |
| I-02 | Browse image gallery | Swipes left/right between product images |
| I-03 | Zoom into an image | Taps or pinches to enlarge a photo |
| I-04 | Select a flavor | Taps one of the available flavor buttons |
| I-05 | Select a nicotine level | Taps one of the available mg buttons for the chosen flavor |
| I-06 | Select a size or presentation | Taps one of the available sizes (e.g. ml, unit count) when applicable |
| I-07 | Adjust quantity | Uses the +/− controls to set how many units to add |
| I-08 | Tap "Add to cart" | Adds the selected variant and quantity to the cart |
| I-09 | Tap a related product | Navigates to that product's detail page |

---

## System Outputs

| ID | Output | Description |
|----|--------|-------------|
| O-01 | Age verification popup | A mandatory "+18" confirmation overlay shown on first visit if not yet confirmed; all page content is blocked until age is confirmed |
| O-02 | Store closed banner | A persistent banner shown at the top of the page when the store is outside operating hours (Monday–Saturday, 10:30 AM – 9:00 PM) or Holiday/Closed mode is active; adding to cart remains available |
| O-03 | Own Brand badge | A "Drakarys Exclusive" badge displayed prominently on the page for products tagged as proprietary by the admin |
| O-04 | Image gallery | Scrollable set of product photos; active photo is highlighted |
| O-05 | Product name and brand | Displayed prominently at the top of the page |
| O-06 | Full description | Detailed text about the product, its characteristics, and usage |
| O-07 | Variant selectors | Buttons for flavor, nicotine level, and size; unavailable options are greyed out |
| O-08 | Price | Updates to reflect the selected variant combination |
| O-09 | Stock badge | **Available** (green), **Low stock ≤5** (yellow), **Out of stock** (red/grey), **Coming soon** (grey) |
| O-10 | "Add to cart" button | Enabled only when all required variants are selected and stock > 0 |
| O-11 | Cart counter update | The cart icon badge increments immediately after adding |
| O-12 | Confirmation feedback | A brief toast or banner confirms the item was added |
| O-13 | Related products section | A row of products from the same category or brand, shown at the bottom |

---

## Functional States

| State | Condition | Behavior |
|-------|-----------|----------|
| Age not verified | First visit; age popup not yet confirmed | All page content is hidden; the age verification popup is shown |
| Store closed | Outside operating hours or Holiday/Closed mode is active | The "Store Closed" banner is displayed; product information and the "Add to cart" button remain available; checkout is blocked at the cart level |
| No variant selected | Customer has not yet chosen all required options | "Add to cart" button is disabled |
| Variant available | Selected combination is in stock | Button is enabled; price and badge update |
| Variant low stock | Selected combination has ≤ 5 units remaining | Yellow badge shown; button remains enabled |
| Variant out of stock | Selected combination has 0 units | Button is disabled; red/grey badge shown |
| Variant coming soon | Admin has marked it as coming soon | Button hidden; grey badge shown; no purchase possible |
| Gallery single image | Product has only one photo | Swipe gesture is inactive; no navigation dots |

---

## Business Rules

- The age verification popup and the "Store Closed" banner follow the same rules defined in Spec 01 — Product Catalog. Behavior is consistent across all pages.
- Adding an item to the cart while the store is closed is permitted. The customer may proceed to checkout once the store reopens.
- Only variant options that have at least one unit in stock are shown as selectable. Unavailable options are visible but disabled.
- Selecting a variant automatically updates the price, image, and stock badge without reloading the page.
- The quantity selector cannot exceed the available stock for the selected variant.
- If a variant goes out of stock between page load and the moment the customer taps "Add to cart," the system blocks the action and informs the customer.
- The "Drakarys Exclusive" badge is set at the product level by the admin. If a product is tagged, the badge appears on both the catalog card and the product detail page.
- The related products section shows a minimum of 4 items when available.
