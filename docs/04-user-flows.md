# 04 — User Flows

## Main flow: Complete purchase (happy path)

```
[Start]
   │
   ▼
1. Home screen
   • Featured catalog, offers, category access
   │
   ▼
2. Browse / Search product
   • Navigate by category or use the search bar
   • Apply optional filters (flavor, nicotine, price)
   │
   ▼
3. Product page
   • View images, description, available variants, and price
   • Select flavor, nicotine level, and size
   │
   ▼
4. Add to cart
   • Adjust quantity
   • Tap "Add to cart" → confirmation toast
   │
   ▼
5. Review cart
   • View summary: products, quantities, subtotal, and total
   • Can modify quantities or remove items
   │
   ▼
6. Authentication
   • Log in with existing account
   • ─── OR ─── register
   • ─── OR ─── continue as guest
   │
   ▼
7. Shipping details
   • Name, address, city, phone
   • Can use saved address if account exists
   │
   ▼
8. Payment method selection
   • Credit/debit card
   • Bank transfer [others TBD]
   │
   ▼
9. Final summary
   • Order detail: products, shipping, discount, total
   • Optional discount code field
   • "Place order" button
   │
   ▼
10. Payment processing
    • System holds the stock
    • Validates transaction with the payment gateway
    • Permanently decrements stock
    │
    ▼
11. Confirmation
    • Success screen with order number
    • Confirmation email sent automatically
    │
    ▼
12. Order tracking
    • User can check status from "My orders"
    • Receives email notifications on status changes

[End]
```

---

## Alternative flows (something goes wrong)

| Step | Situation | System response | Action available to user |
|:----:|-----------|-----------------|--------------------------|
| **3** | Product is out of stock | "Out of stock" badge, "Add" button disabled | View related products |
| **4** | Selected variant has no stock | Inline warning: "This variant is out of stock" | Choose another available variant |
| **5** | Cart is empty when attempting checkout | Warning message: "Your cart is empty" | Redirected to the catalog |
| **6** | Login error (wrong credentials) | Clear error message below the form | Retry or recover password |
| **6** | Network error during authentication | Error toast; local cart is preserved | Retry when connection is restored |
| **10** | Payment rejected by the gateway | On-screen notification: "Payment declined" | Try a different payment method |
| **10** | Connection error during payment | Order stays in "pending" status; warning email sent | Check in "My orders" and retry |
| **10** | Stock hold expired (15 min) | Warning before processing: "Your hold has expired" | Return to cart and verify availability |
| **11** | Confirmation email not received | — | Resend from "My orders" → order detail |

---

## Flow: Password Recovery

```
[User on login screen]
   │
   ▼
Taps "Forgot your password?"
   │
   ▼
Enters email address
   │
   ▼
System sends email with reset link (valid for 1 hour)
   │
   ▼
User opens the link → screen to enter new password
   │
   ▼
Password updated → redirected to login
```

---

## Flow: Order Management (Administrator)

```
[Admin panel]
   │
   ▼
1. View order list
   • Filter by status: pending / paid / preparing / shipped / delivered
   │
   ▼
2. Select an order
   • View detail: customer, products, address, payment method, total
   │
   ▼
3. Update status
   • Pending → Paid (confirm manual payment if applicable)
   • Paid → Preparing
   • Preparing → Shipped (enter tracking info [TBD])
   • Shipped → Delivered
   │
   ▼
4. System notifies the customer by email on each status change
```

---

## Order State Transition Diagram

```
[pending] ──payment confirmed──► [paid] ──admin──► [preparing]
                                                        │
                                                  admin confirms shipment
                                                        │
                                                        ▼
[cancelled] ◄──cancel (any state)──────────── [shipped] ──admin──► [delivered]
```
