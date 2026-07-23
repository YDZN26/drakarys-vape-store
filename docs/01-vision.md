# 01 — Product Vision

## Vision Statement

**Drakarys Vape Store** is the official online store of a physical vape shop, where customers can easily browse and purchase all available products, with clear and detailed information on each item to make the best buying decision.

## Problem It Solves

| Problem | Impact without the solution |
|---------|----------------------------|
| Customers don't know what products are available without visiting the store physically | Lost sales and unnecessary friction |
| Stock is managed manually with no real-time visibility | Sales of out-of-stock products, inventory errors |
| There is no way to buy outside of store opening hours | Revenue limited to physical store hours |
| No order history or tracking exists | Poor post-purchase experience, costly customer support |

## Value Proposition

- **For the customer:** browse the full catalog from their phone, compare products with real detail (flavors, nicotine, price), and buy in minutes without visiting the store.
- **For the business:** digitize inventory, automate orders, and build a professional online presence without owning any server infrastructure.

## Scope v1.0

### In scope

- Product catalog with categories, filters, and search.
- Product page with images and real-time stock status.
- Persistent cart (localStorage) with WhatsApp order button.
- Age verification gate on first visit (legal requirement).
- Store hours banner (informational, does not block browsing).

### Deferred to a future phase

- Customer authentication (registration, login, session management).
- Complete checkout flow with real online payment.
- Order management with statuses and tracking.
- Basic admin panel to manage products and orders.
- Transactional emails (order confirmation, status updates).

### Out of scope for v1.0

- Native app published on the App Store / Google Play.
- Loyalty or points program.
- Live chat or integrated support.
- Multiple stores or branches.
- Integration with a physical point-of-sale (POS) system.

## Success Metrics

| Metric | v1.0 Target |
|--------|-------------|
| Initial load time | < 3 s on a standard mobile connection |
| Checkout abandonment rate | < 40 % |
| Monthly uptime | ≥ 99.5 % |
| Stock errors (sale of out-of-stock product) | 0 |
