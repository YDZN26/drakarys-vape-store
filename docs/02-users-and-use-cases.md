# 02 — Users and Use Cases

## System Roles

| Role | Description | Access level |
|------|-------------|--------------|
| **Guest customer** | Browses the catalog and adds to cart without an account | Read-only + temporary cart |
| **Registered customer** | Has an account, order history, and persistent cart | Read + purchases + own profile |
| **Administrator** | Manages catalog, stock, and orders from the admin panel | Full access |

---

## Primary User Profile: Customer

### Context
- Bolivian user, primarily in Cochabamba or Santa Cruz.
- Accesses the app mainly from mobile (Android).
- Familiar with basic delivery and online shopping apps.
- Searches for products by brand name or flavor, not by technical specification.

### Motivations
- Already knows the product they want and wants to buy it without going to the store.
- Wants to check stock availability before making the trip.
- Looking for the best price or new flavor options.

### Frustrations
- Catalogs with low-quality photos or no visible pricing.
- Long checkout processes with too many steps.
- Not knowing whether or when the product will arrive.

---

## Use Cases

### UC-01: Browse the Catalog

**Actor:** Customer (guest or registered)
**Precondition:** The customer opens the application.

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Opens the app | Displays the home screen with featured categories and offers |
| 2 | Selects a category (e.g. "Disposables") | Displays a product grid for that category with image, name, and price |
| 3 | Scrolls through the listing | Pagination or infinite scroll; scroll position is preserved on back navigation |

**Postcondition:** The customer can see the available products.

---

### UC-02: Search for a Specific Product

**Actor:** Customer (guest or registered)
**Precondition:** The customer is on any screen of the app.

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Taps the search icon | Displays an active search bar |
| 2 | Types a name, brand, or characteristic | Shows real-time results (300 ms debounce) |
| 3 | Applies optional filters (type, flavor, nicotine, price) | Refines results without reloading the page |
| 4 | Selects a product | Navigates to the product page |

**Postcondition:** The customer found the product they were looking for.
**Alternative flow:** No results → displays "We couldn't find that product" with category suggestions.

---

### UC-03: View Product Detail

**Actor:** Customer (guest or registered)
**Precondition:** The customer selected a product from the catalog or search.

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Opens the product page | Displays image gallery, name, brand, and full description |
| 2 | Reviews variants | Shows flavor, nicotine level, and available size selectors |
| 3 | Selects a variant | Updates price, image, and stock status for that combination |
| 4 | Checks stock | Displays badge: "Available", "Low stock" (≤5), or "Out of stock" |

**Postcondition:** The customer has all the information needed to decide whether to buy.

---

### UC-04: Add to Cart

**Actor:** Customer (guest or registered)
**Precondition:** The customer is on the page of an available product.

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Selects required variants | Enables the "Add to cart" button |
| 2 | Adjusts the quantity | Validates that quantity does not exceed available stock |
| 3 | Taps "Add to cart" | Shows a confirmation toast; updates the cart icon counter |
| 4 | Continues shopping or goes to cart | The item persists in the cart |

**Postcondition:** The product is in the cart; the cart persists even if the browser is closed.
**Alternative flow:** If the variant runs out of stock between steps → button is disabled and the system notifies the user.

---

### UC-05: Complete Payment

**Actor:** Customer (guest or registered)
**Precondition:** The cart has at least one product.

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Goes to cart and taps "Checkout" | Verifies current stock for each item |
| 2 | Logs in or continues as guest | Authenticates or creates a temporary session |
| 3 | Enters shipping details | Validates required fields (name, address, phone) |
| 4 | Selects payment method | Displays available options |
| 5 | Applies discount code (optional) | Validates the code and updates the total |
| 6 | Reviews summary and confirms | Shows breakdown: subtotal, discount, shipping, total |
| 7 | Taps "Place order" | Processes payment, decrements stock, creates the order |
| 8 | Payment successful | Shows confirmation screen with order number; sends confirmation email |

**Postcondition:** The order is recorded with status "pending".

---

### UC-06: Track an Order

**Actor:** Registered customer
**Precondition:** The customer has at least one previous order.

| Step | User action | System response |
|------|-------------|-----------------|
| 1 | Goes to "My orders" in their profile | Displays a list of orders sorted by date |
| 2 | Selects an order | Shows detail: products, quantities, total, and current status |
| 3 | Reviews the status | Visual status timeline: Pending → Preparing → Shipped → Delivered |
| 4 | If confirmation email was not received | Can resend it from this screen |

**Postcondition:** The customer knows the up-to-date status of their order.
