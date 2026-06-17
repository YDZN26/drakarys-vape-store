# Drakarys Vape Store — Specification Documentation

Index of all project specification documents. These files define the system **before** building it (spec-first).

## Core Documents

| # | Document | Description |
|---|----------|-------------|
| 1 | [Product vision](01-vision.md) | Purpose, scope, and value proposition |
| 2 | [Architecture](02-architecture.md) | Tech stack, data flow diagram, and decisions |
| 3 | [Non-functional requirements](03-non-functional-requirements.md) | Performance, security, accessibility, and more |

## Atomic Specifications (Features)

| # | Document | Description |
|---|----------|-------------|
| 1 | [Catalog](specs/01-catalog.md) | Browse, search, and filter the store's products |
| 2 | [Product Detail](specs/02-product-detail.md) | Product variants, images, and real-time stock |
| 3 | [Shopping Cart](specs/03-shopping-cart.md) | Persistent cart and item management |
| 4 | [Checkout](specs/04-checkout.md) | Delivery zones, payment, and order placement |
| 5 | [Authentication](specs/05-authentication.md) | Registration, login, password recovery, and profile |
| 6 | [Admin Management](specs/06-admin-management.md) | Store configuration, inventory, and order status updates |

## Conventions

- Each document is self-contained and can be read independently.
- Scope or requirement changes must update the documents here before touching any code.
- Fields marked `[TBD]` require a decision before development begins.
