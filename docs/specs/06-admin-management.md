# Spec 06 — Admin Management

## Purpose

Give the store administrator a dedicated panel to manage the product catalog, monitor and adjust inventory levels, configure store settings, and move orders through their lifecycle. All actions in this area are restricted to accounts with the Administrator role.

---

## User Inputs

### Product Management

| ID | Input | Description |
|----|-------|-------------|
| I-01 | Open the admin panel | Navigates to the management area from the admin account menu |
| I-02 | Add a new product | Opens a blank product form to create a new catalog entry |
| I-03 | Enter product name | The display name shown to customers in the catalog |
| I-04 | Enter brand | The brand associated with the product |
| I-05 | Enter description | Full text description of the product |
| I-06 | Upload product images | One or more photos; the first image is used as the main catalog thumbnail |
| I-07 | Set category | Assigns the product to one of: Disposables, Pods, Liquids, Accessories, Other |
| I-08 | Add a variant | Defines a combination of flavor, nicotine level, and size with its own stock count and price |
| I-09 | Set stock per variant | Enters the available quantity for each individual variant |
| I-10 | Set price per variant | Enters the sale price for each variant |
| I-11 | Tag product as Own Brand / Drakarys Exclusive | Marks a product as proprietary; the "Drakarys Exclusive" badge is shown on the catalog card and product detail page |
| I-12 | Mark product as "Coming soon" | Sets the product's visibility state without making it purchasable |
| I-13 | Deactivate a product | Hides the product from the customer-facing catalog without deleting it |
| I-14 | Reactivate a product | Restores a previously hidden product to the catalog |
| I-15 | Edit an existing product | Opens the product form pre-filled with current values for any field |
| I-16 | Save product changes | Confirms and publishes all edits immediately |
| I-17 | Delete a product | Permanently removes a product that has no associated orders |

### Inventory Management

| ID | Input | Description |
|----|-------|-------------|
| I-18 | Open inventory view | Displays all products and their per-variant stock counts |
| I-19 | Adjust stock for a variant | Manually enters a new stock quantity for a specific variant |
| I-20 | Confirm stock adjustment | Saves the updated stock count |
| I-21 | Filter inventory by stock status | Narrows the list to: All, Low stock, or Out of stock |

### Store Configuration

| ID | Input | Description |
|----|-------|-------------|
| I-22 | Set delivery fee for a zone | Enters or updates the delivery fee amount for a specific Moto Delivery zone |
| I-23 | Enable Holiday / Closed mode | Manually marks the store as closed; checkout is blocked for all customers regardless of the current time |
| I-24 | Disable Holiday / Closed mode | Restores normal operating hours behavior; checkout becomes available again during scheduled hours |

### Order Management

| ID | Input | Description |
|----|-------|-------------|
| I-25 | Open order list | Displays all orders across all customers |
| I-26 | Filter orders by status | Narrows the list by: Pending, Paid, Preparing, Shipped, Delivered, or Cancelled |
| I-27 | Search orders | Searches by order number or customer name |
| I-28 | Open an order | Views the full detail of a specific order |
| I-29 | Mark a cash order as Paid | Manually transitions a Pending cash order to Paid status after confirming receipt of physical payment |
| I-30 | Advance order to "Preparing" | Manually marks a paid order as being prepared |
| I-31 | Advance order to "Shipped" | Marks an order as shipped; optionally enters tracking information |
| I-32 | Advance order to "Delivered" | Marks an order as delivered |
| I-33 | Cancel an order | Cancels an order that has not yet been shipped |
| I-34 | Confirm cancellation | Confirms the cancellation action before it takes effect |

---

## System Outputs

### Product Management

| ID | Output | Description |
|----|--------|-------------|
| O-01 | Product list | Table of all products (active and inactive) with name, category, stock summary, Own Brand tag, and current status |
| O-02 | Product form | Fields for all product attributes; variant rows can be added or removed; Own Brand toggle is included |
| O-03 | Image upload preview | Thumbnail shown immediately after an image is uploaded; admin can reorder or remove images |
| O-04 | Validation errors | Inline messages for missing required fields (name, category, at least one variant with price and stock) |
| O-05 | Save confirmation | Brief notice confirming the product was created or updated and is live in the catalog |
| O-06 | Deactivation confirmation | Prompt asking the admin to confirm before hiding a product from the catalog |
| O-07 | Delete blocked notice | Message explaining a product cannot be deleted because it has associated order history; deactivation is offered as an alternative |

### Inventory Management

| ID | Output | Description |
|----|--------|-------------|
| O-08 | Inventory table | Each row shows: product name, variant (flavor, nicotine, size), current stock count, and stock status badge |
| O-09 | Low stock badge | Yellow indicator on any variant with ≤ 5 units remaining |
| O-10 | Out of stock badge | Red indicator on any variant with 0 units |
| O-11 | Adjustment confirmation | Brief notice confirming the new stock count was saved |

### Store Configuration

| ID | Output | Description |
|----|--------|-------------|
| O-12 | Zone delivery fee table | List of all configured Moto Delivery zones with their current fee amounts; each row is editable |
| O-13 | Holiday mode status indicator | Shows whether Holiday/Closed mode is currently active or inactive; displays the date and time it was last toggled |

### Order Management

| ID | Output | Description |
|----|--------|-------------|
| O-14 | Order list | Each row shows: order number, customer name, date, item count, total, payment method, and current status |
| O-15 | Status badge | Visual label for the order's current state: Pending, Paid, Preparing, Shipped, Delivered, or Cancelled |
| O-16 | Order detail view | Full breakdown: ordered items with variants and quantities, customer name, delivery method, shipping address, payment method, totals, and status timeline |
| O-17 | Status timeline | Visual step-by-step progress showing completed and pending stages for the order |
| O-18 | "Mark as Paid" button | Available on the order detail view for any Pending order with a cash payment method; not shown for gateway-processed orders |
| O-19 | Allowed next-status actions | Only the valid next transitions are offered as buttons; invalid jumps are not shown |
| O-20 | Customer notification sent notice | Confirmation that an email was automatically sent to the customer after a status change |
| O-21 | Cancellation confirmation prompt | Modal asking the admin to confirm before cancelling; shows the order number and customer name |
| O-22 | Stock release notice | After a cancellation, a notice confirms that the reserved stock has been returned to the available inventory |

---

## Functional States

### Product States

| State | Condition | Customer-facing behavior |
|-------|-----------|--------------------------|
| Active | Published and in stock | Visible in catalog; purchasable |
| Active — Own Brand | Published and tagged as proprietary | Visible in catalog with "Drakarys Exclusive" badge; purchasable |
| Active — low stock | Published; stock ≤ 5 for a variant | Visible; yellow badge on that variant |
| Active — out of stock | Published; stock = 0 for a variant | Visible; variant is greyed out and cannot be added to cart |
| Coming soon | Manually set by admin | Visible in catalog; no purchase option; grey badge shown |
| Inactive | Deactivated by admin | Hidden from catalog entirely; not reachable by any customer |

### Store Configuration States

| State | Condition | Customer-facing behavior |
|-------|-----------|--------------------------|
| Store open | Current time is within Monday–Saturday 10:30 AM – 9:00 PM and Holiday mode is inactive | Checkout is available; no "Store Closed" banner |
| Store closed — schedule | Current time is outside operating hours; Holiday mode is inactive | Checkout is blocked; "Store Closed" banner is shown; browsing is still possible |
| Store closed — Holiday mode | Admin has enabled Holiday/Closed mode | Checkout is blocked regardless of the current time; "Store Closed" banner is shown; browsing is still possible |

### Order States

| State | Who triggers it | Description | Automatic actions |
|-------|----------------|-------------|-------------------|
| Pending | System (on order creation) | Order exists; payment has not yet been confirmed | Stock is temporarily reserved |
| Paid — gateway | Payment gateway confirmation | Card or transfer payment was received successfully | Stock is permanently decremented; confirmation email sent to customer |
| Paid — cash | Admin (manual) | Admin confirmed receipt of physical cash payment | Stock is permanently decremented; confirmation email sent to customer |
| Preparing | Admin (manual) | The store is assembling the order | Status update email sent to customer |
| Shipped | Admin (manual) | The order has left the store | Status update email with tracking information (if provided) sent to customer |
| Delivered | Admin or customer confirmation | The order reached the customer | Final state; customer is prompted to leave a review |
| Cancelled | Admin or customer (before shipping) | The order was cancelled | Stock reservation released; refund initiated if payment was already collected |

---

## Business Rules

- Only accounts with the Administrator role can access the admin panel. Attempting to access it as a customer results in a "not authorised" screen.
- Every product must have at least one variant with a price and a stock count before it can be published.
- A product cannot be permanently deleted if it appears in any order (past or present). The admin must deactivate it instead to preserve order history integrity.
- Stock counts can only be set to whole numbers greater than or equal to zero.
- Stock adjustments made manually in the inventory view take effect immediately and are reflected in the customer-facing catalog without delay.
- The "Own Brand / Drakarys Exclusive" tag is set at the product level. It applies to all variants of that product and cannot be set per variant.
- Delivery zones and their fees are defined and managed exclusively by the admin. Customers cannot see or modify zone boundaries; they only see the fee for the zone they select.
- Holiday/Closed mode overrides the operating hours schedule immediately upon activation and remains active until the admin manually disables it. There is no automatic expiration.
- The "Mark as Paid" action is only available for orders in the Pending state that were placed with a cash payment method (Cash on Delivery or Pay at Store). It is never shown for orders processed through the payment gateway.
- When the admin marks a cash order as Paid, stock is permanently decremented and a confirmation email is sent to the customer automatically.
- Order statuses can only move forward along the defined path: Pending → Paid → Preparing → Shipped → Delivered. Skipping steps or moving backwards is not permitted.
- The only exception to the forward-only rule is Cancelled, which can be applied to any order that has not yet reached the Shipped state.
- An order in the Shipped or Delivered state cannot be cancelled through the admin panel. The admin must handle these cases outside the platform.
- Every status change automatically triggers an email notification to the customer. The admin does not need to send this manually.
- A Store Pickup cash order that is not claimed by midnight of the order date is automatically cancelled and the reserved stock is released. The admin does not need to trigger this manually.
