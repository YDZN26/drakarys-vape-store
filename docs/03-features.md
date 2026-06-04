# 03 — Features

Complete specification of what the user can do (inputs), what the system displays (outputs), and the states the system manages.

---

## Inputs — What the user does

### Catalog and search

| ID | Feature | Detail |
|----|---------|--------|
| F-01 | Search by name | Free-text field; searches product name and brand |
| F-02 | Browse by category | Category menu: Disposables, Pods, Liquids, Accessories, Other |
| F-03 | Filter by type | Single-select filter by product type |
| F-04 | Filter by flavor | Multi-select filter by available flavors (e.g. mint, fruit, tobacco) |
| F-05 | Filter by nicotine | Range filter: 0mg, 3mg, 6mg, 12mg, 20mg, 50mg |
| F-06 | Filter by price | Slider for minimum and maximum price range |
| F-07 | Sort results | By relevance, price ascending/descending, newest first |

### Product

| ID | Feature | Detail |
|----|---------|--------|
| F-08 | View product detail | Opens the full product page from the catalog or search |
| F-09 | Select flavor variant | Selection buttons; only shows flavors with available stock |
| F-10 | Select nicotine level | Selection buttons by available mg for the variant |
| F-11 | Select size / presentation | As applicable to the product (ml, units, etc.) |
| F-12 | View image gallery | Swipe between images; pinch or tap to zoom |

### Cart

| ID | Feature | Detail |
|----|---------|--------|
| F-13 | Add to cart | Validates selected variants before enabling the button |
| F-14 | Modify quantity in cart | +/− controls with real-time stock validation |
| F-15 | Remove item from cart | Swipe or delete button; asks for confirmation on high-value items |
| F-16 | View cart summary | Per-item subtotal and grand total updated in real time |

### Account and session

| ID | Feature | Detail |
|----|---------|--------|
| F-17 | Register | Name, email, password; email verification |
| F-18 | Log in | Email + password or Google OAuth |
| F-19 | Log out | Invalidates the local session; cart is synced to the account |
| F-20 | Recover password | Password reset flow via email |
| F-21 | Edit profile | Name, phone, default shipping address |

### Checkout

| ID | Feature | Detail |
|----|---------|--------|
| F-22 | Enter shipping address | Form with name, street, city, and contact phone |
| F-23 | Select payment method | Credit/debit card, bank transfer [TBD: specific gateway] |
| F-24 | Apply discount code | Text field; system validates and applies discount to the total |
| F-25 | Confirm order | Final review before processing payment |

---

## Outputs — What the system displays

### Catalog

| ID | Output | Detail |
|----|--------|--------|
| O-01 | Product grid | Main image, name, price, status badge (Available / Out of stock) |
| O-02 | Search results | Same format as the catalog, with result count indicator |
| O-03 | Active filters | Visible chips or tags for applied filters with a clear option |

### Product

| ID | Output | Detail |
|----|--------|--------|
| O-04 | Product page | Gallery, name, brand, description, variants, price, stock |
| O-05 | Stock badge | "Available" (green), "Low stock ≤5" (yellow), "Out of stock" (red/grey), "Coming soon" |
| O-06 | Related products | Section at the bottom of the page: same category or brand |

### Cart and checkout

| ID | Output | Detail |
|----|--------|--------|
| O-07 | Cart counter | Number on the cart icon updated when items are added or removed |
| O-08 | Cart summary | Item list with image, variant, quantity, unit price, and subtotal |
| O-09 | Checkout total | Subtotal + shipping + applied discount = Total to pay |
| O-10 | Confirmation screen | Order number, purchase summary, estimated delivery time [TBD] |

### Orders

| ID | Output | Detail |
|----|--------|--------|
| O-11 | Order history | Date-sorted list with visual status for each order |
| O-12 | Order detail | Products, quantities, total, shipping address, status timeline |
| O-13 | Confirmation email | Sent automatically on purchase completion (order number, detail) |
| O-14 | Status update email | Sent when the order status changes (shipped, delivered) |

---

## States — What the system manages

### Product states

| State | Condition | UI behavior |
|-------|-----------|-------------|
| `available` | Stock > 0 | "Add to cart" button enabled |
| `low_stock` | 1 ≤ Stock ≤ 5 | Yellow badge; button enabled |
| `out_of_stock` | Stock = 0 | Red badge; button disabled; excluded from availability filters |
| `coming_soon` | Set manually by admin | Grey badge; no purchase button; notification option [TBD] |
| `inactive` | Disabled by admin | Not shown in the catalog |

### Cart states

| State | Description |
|-------|-------------|
| `active` | The user has items in the cart |
| `empty` | No items; redirects to catalog if the user attempts checkout |
| `persistent` | Cart is saved in `localStorage` for guests and in the database for registered users |
| `synced` | On login, the local cart is merged with the account's saved cart |

### Order states

| State | Description | System action |
|-------|-------------|---------------|
| `pending` | Order created, payment not confirmed | Temporarily reserves stock (15 min) |
| `paid` | Payment confirmed by the gateway | Permanently decrements stock; sends email |
| `preparing` | Admin updates manually | Notifies the customer by email |
| `shipped` | Admin marks as shipped | Notifies the customer with tracking info [TBD] |
| `delivered` | Admin or customer confirms delivery | Final state; prompts for a review [TBD] |
| `cancelled` | Cancelled by customer or admin | Releases stock; initiates refund if applicable [TBD] |

### Stock management

- Stock is decremented in real time when payment is confirmed.
- A 15-minute temporary hold protects stock during the checkout process.
- If the hold expires without payment, the stock is released automatically.
