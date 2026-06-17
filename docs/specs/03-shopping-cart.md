# Spec 03 — Shopping Cart

## Purpose

Give the customer a persistent, accurate summary of the items they intend to buy, with controls to adjust quantities or remove items before proceeding to checkout.

---

## User Inputs

| ID | Input | Description |
|----|-------|-------------|
| I-01 | Open the cart | Taps the cart icon from any screen |
| I-02 | Increase item quantity | Taps the + control next to a line item |
| I-03 | Decrease item quantity | Taps the − control next to a line item |
| I-04 | Remove an item | Swipes the item row or taps the delete button |
| I-05 | Confirm item removal | Confirms the removal prompt (shown only for high-value items) |
| I-06 | Continue shopping | Navigates back to the catalog without losing cart contents |
| I-07 | Proceed to checkout | Taps the "Checkout" button to start the purchase flow |

---

## System Outputs

| ID | Output | Description |
|----|--------|-------------|
| O-01 | Cart icon counter | Shows the total number of items in the cart; updates in real time on every change |
| O-02 | Item list | Each row shows: product image, name, selected variant (flavor, nicotine, size), quantity, unit price, and line subtotal |
| O-03 | Grand total | Sum of all line subtotals; updates in real time as quantities change |
| O-04 | Empty cart state | Message and a prompt to go back to the catalog when no items are present |
| O-05 | Stock warning | Inline notice when the quantity of an item exceeds current available stock |
| O-06 | Removal confirmation prompt | Modal shown before deleting a high-value item, asking the customer to confirm |

---

## Functional States

| State | Condition | Behavior |
|-------|-----------|----------|
| Active | Cart contains at least one item | Full cart view shown with item list and total |
| Empty | No items in the cart | Empty state message shown; "Checkout" button is not available |
| Persistent (guest) | Customer is not logged in | Cart contents are saved locally on the device and survive page reloads and browser restarts |
| Persistent (registered) | Customer is logged in | Cart contents are saved to their account |
| Synced | Customer logs in while a local cart exists | Local cart items are merged with any items already saved to the account |
| Stock conflict | An item's quantity exceeds available stock at the time of checkout | The item is flagged with a warning; the customer must reduce the quantity before proceeding |

---

## Business Rules

- Cart contents are never lost when the customer navigates away, refreshes the page, or closes the browser.
- When a logged-in customer's cart is merged with a local cart, duplicate products are combined into a single line item.
- The grand total reflects only product prices; shipping and discounts are calculated at checkout.
- A removal confirmation prompt is only shown when the line subtotal of the item exceeds a threshold defined by the store admin.
- Tapping "Checkout" with an empty cart redirects the customer to the catalog instead of opening the checkout flow.
- Stock is not reserved when items are added to the cart; reservation happens only after the customer initiates checkout.
