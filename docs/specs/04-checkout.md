# Spec 04 — Checkout

> **DEFERRED — out of scope for the v1 launch.** The v1 purchase flow uses a WhatsApp button from the cart (see Spec 03), not the full checkout described in this document. This spec is kept as a reference for a future phase and should not be implemented yet.
>
> Note: the detailed content of this document (inputs, outputs, business rules) may still reference concepts already discarded in active specs (product variants, payment checkout, synced customer accounts). It must be reviewed and updated together when this spec is reactivated, not before.

## Purpose

Guide the customer through the final steps of the purchase: selecting a delivery method, confirming a shipping address or pickup preference, choosing a payment method, applying optional discounts, and placing the order. Checkout is only available during store operating hours.

---

## User Inputs

| ID | Input | Description |
|----|-------|-------------|
| I-01 | Tap "Checkout" | Initiates the checkout flow from the cart |
| I-02 | Log in or continue as guest | Authenticates with an existing account or proceeds without one |
| I-03 | Select Store Pickup as delivery method | The customer chooses to collect the order at the physical store |
| I-04 | Select Moto Delivery by Zone as delivery method | The customer chooses motorcycle courier delivery |
| I-05 | Select a delivery zone | The customer picks their zone from the list of available Moto Delivery zones |
| I-06 | Enter shipping address | Fills in full name, street address, city, and contact phone number |
| I-07 | Select credit/debit card as payment method | Chooses card payment; proceeds to enter card details |
| I-08 | Select bank transfer as payment method | Chooses bank transfer; proceeds to follow transfer instructions |
| I-09 | Select Cash on Delivery as payment method | The customer will pay in cash when the order is delivered |
| I-10 | Select Pay at Store as payment method | The customer will pay in cash when collecting the order at the physical store |
| I-11 | Enter payment details | Provides the information required by the selected card or transfer payment method |
| I-12 | Enter a discount code | Types a promo code into the discount field |
| I-13 | Apply the discount code | Confirms the code to have it validated and applied to the total |
| I-14 | Review order summary | Reads the final breakdown before confirming |
| I-15 | Tap "Place order" | Submits the order for processing |

---

## System Outputs

| ID | Output | Description |
|----|--------|-------------|
| O-01 | Stock check notification | If any item in the cart is now out of stock, the customer is notified before proceeding |
| O-02 | Store closed message | Displayed when the customer attempts to initiate checkout outside operating hours or when Holiday/Closed mode is active; checkout cannot proceed |
| O-03 | Delivery method selector | Presents the two available options: Store Pickup and Moto Delivery by Zone |
| O-04 | Zone selector | List of available Moto Delivery zones displayed after the customer selects Moto Delivery |
| O-05 | Delivery fee line item | The fee for the selected Moto Delivery zone is shown as a separate, labelled line in the order summary |
| O-06 | Shipping address form | Fields for full name, street address, city, and contact phone; required fields are marked; shown only when Moto Delivery is selected |
| O-07 | Address validation feedback | Inline errors shown next to fields that are missing or invalid |
| O-08 | Payment method list | All available payment options displayed for selection |
| O-09 | Discount code feedback | Shows one of: discount applied (amount deducted shown), invalid code, or expired code |
| O-10 | Order summary | Itemised breakdown: product subtotal, delivery fee, applied discount, and total to pay |
| O-11 | Confirmation screen | Shown after a successful order is placed: order number, purchase summary, and estimated delivery or pickup window |
| O-12 | Confirmation email | Sent to the customer's email address immediately after the order is placed, containing the order number and full detail |
| O-13 | "Confirm via WhatsApp" button | Shown on the confirmation screen for all cash-based orders; allows the customer to send the order summary directly to the store via WhatsApp |
| O-14 | WhatsApp support button | A floating button visible on every checkout screen; opens the store's WhatsApp contact for customer support |

---

## Functional States

| State | Condition | Behavior |
|-------|-----------|----------|
| Checkout blocked — store closed | Current time is outside Monday–Saturday, 10:30 AM – 9:00 PM, or admin has enabled Holiday/Closed mode | The checkout button is disabled; the "Store Closed" message is shown; browsing and cart management remain available |
| Checkout blocked — empty cart | Cart has no items | Customer is redirected to the catalog; checkout does not open |
| Stock conflict at checkout start | An item's stock dropped to 0 since it was added to the cart | Customer is notified and must remove or update the affected item before continuing |
| Guest checkout | Customer is not logged in | A temporary session is created; an account creation prompt is shown after order completion |
| Moto Delivery selected | Customer chose Moto Delivery by Zone | Zone selector and shipping address form are shown; a delivery fee is applied based on the selected zone |
| Store Pickup selected | Customer chose Store Pickup | Zone selector and address form are hidden; no delivery fee is applied |
| Address incomplete | Required fields are missing (Moto Delivery only) | Customer cannot advance past this step; inline error messages are shown |
| Discount code valid | Code exists, is active, and the cart meets its conditions | Discount amount is deducted from the subtotal and shown as a line in the summary |
| Discount code invalid | Code does not exist or has expired | Error message is shown; total is unchanged |
| Cash order pending | Customer selected Cash on Delivery or Pay at Store | Order is created immediately in Pending status; no payment gateway is involved; stock is reserved |
| Payment processing | Customer has tapped "Place order" with a card or transfer method | A loading indicator is shown; all inputs are locked to prevent double submission |
| Payment successful | Card or transfer payment is confirmed by the gateway | Order is created, stock is permanently decremented, confirmation screen is shown, confirmation email is sent |
| Payment failed | Card payment is declined or times out | Error message is shown; customer can retry or select a different payment method; stock hold is released |

---

## Business Rules

- Checkout can only be initiated during operating hours: Monday–Saturday, 10:30 AM to 9:00 PM. Outside these hours, or when the admin has enabled Holiday/Closed mode, the checkout flow is entirely blocked.
- Browsing the catalog and adding items to the cart is permitted outside operating hours. Only the checkout step is restricted.
- Stock availability is re-checked at the start of the checkout flow, not when items are added to the cart.
- The delivery fee for Moto Delivery is fixed per zone and is defined by the admin. It is shown to the customer before order confirmation.
- Store Pickup orders carry no delivery fee regardless of the payment method selected.
- Cash on Delivery and Pay at Store payments bypass the payment gateway. The order is created immediately in Pending status upon tapping "Place order."
- A Store Pickup order with a cash payment method that remains unclaimed by midnight of the order date is automatically cancelled and the reserved stock is released.
- For card and bank transfer orders, stock is temporarily reserved for 15 minutes while payment is processed. If the hold expires without payment confirmation, the reservation is released and the order is cancelled.
- A discount code can only be applied once per order. Combining multiple codes is not supported in v1.0.
- Guest customers receive the same confirmation email as registered customers.
- The "Confirm via WhatsApp" button is shown only on the confirmation screen for cash-based orders. It is not shown for card or bank transfer orders.
