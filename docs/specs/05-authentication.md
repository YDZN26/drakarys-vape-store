# Spec 05 — Authentication

> **DEFERRED — out of scope for the v1 launch.** Not needed for the v1 cart + WhatsApp flow. This spec is kept as a reference for a future phase and should not be implemented yet.
>
> When this spec is reactivated, Spec 03 (Shopping Cart) must be extended to add cart persistence and synchronization tied to the customer account.
>
> Note: the detailed content of this document (inputs, outputs, business rules) may still reference concepts already discarded in active specs (product variants, payment checkout, synced customer accounts). It must be reviewed and updated together when this spec is reactivated, not before.

## Purpose

Allow customers to create an account, access it securely, recover it if credentials are lost, and keep their personal details up to date. Authentication unlocks order history, a persistent cart tied to the account, and a saved shipping address.

---

## User Inputs

### Registration

| ID | Input | Description |
|----|-------|-------------|
| I-01 | Enter full name | The customer's display name for the account |
| I-02 | Enter email address | Used as the unique account identifier and for all communications |
| I-03 | Enter password | Must meet the minimum strength requirements shown on screen |
| I-04 | Submit registration form | Sends the registration request |
| I-05 | Tap email verification link | Clicks the link sent to the provided email address to confirm ownership |

### Login

| ID | Input | Description |
|----|-------|-------------|
| I-06 | Enter email address | The address associated with the account |
| I-07 | Enter password | The password set during registration |
| I-08 | Tap "Log in" | Submits the credentials |
| I-09 | Tap "Continue with Google" | Initiates login via the customer's Google account |

### Logout

| ID | Input | Description |
|----|-------|-------------|
| I-10 | Tap "Log out" | Ends the current session from the account menu |

### Password Recovery

| ID | Input | Description |
|----|-------|-------------|
| I-11 | Tap "Forgot password?" | Opens the password recovery flow from the login screen |
| I-12 | Enter registered email | Submits the address to receive a reset link |
| I-13 | Tap reset link in email | Opens the password reset form |
| I-14 | Enter new password | Types and confirms the new password |
| I-15 | Submit new password | Saves the new password and closes the reset flow |

### Profile Editing

| ID | Input | Description |
|----|-------|-------------|
| I-16 | Open profile settings | Navigates to the account profile section |
| I-17 | Edit full name | Updates the display name on the account |
| I-18 | Edit phone number | Adds or changes the contact phone number |
| I-19 | Edit default shipping address | Updates the address pre-filled at checkout |
| I-20 | Save profile changes | Confirms and persists all edits |

---

## System Outputs

### Registration

| ID | Output | Description |
|----|--------|-------------|
| O-01 | Registration form | Fields for name, email, and password with inline validation feedback |
| O-02 | Password strength indicator | Visual indicator shown as the customer types the password |
| O-03 | Duplicate email error | Inline message if the entered email is already associated with an existing account |
| O-04 | Verification email sent notice | Confirmation message on screen instructing the customer to check their inbox |
| O-05 | Verification email | Email containing a one-time link to confirm the account |
| O-06 | Account activated confirmation | Screen or message shown after the verification link is successfully clicked |

### Login

| ID | Output | Description |
|----|--------|-------------|
| O-07 | Login form | Fields for email and password; Google login option |
| O-08 | Invalid credentials error | Generic message shown when email or password is incorrect (does not specify which is wrong) |
| O-09 | Unverified account notice | Message prompting the customer to verify their email before logging in, with an option to resend the verification email |
| O-10 | Authenticated session | The customer is logged in; the interface updates to reflect their account (name shown, order history accessible) |
| O-11 | Cart merge notice | Brief notice confirming that the local cart has been merged with the account's saved cart |

### Logout

| ID | Output | Description |
|----|--------|-------------|
| O-12 | Session ended | The customer is returned to the home screen in a guest state; all personal data is cleared from the current view |

### Password Recovery

| ID | Output | Description |
|----|--------|-------------|
| O-13 | Recovery form | Single field for the registered email address |
| O-14 | Recovery email sent notice | On-screen confirmation that the link has been sent (shown regardless of whether the email exists, to prevent account enumeration) |
| O-15 | Password reset email | Email containing a secure, time-limited link to reset the password |
| O-16 | Expired link error | Message shown if the customer uses a reset link after it has expired, with an option to request a new one |
| O-17 | Password reset confirmation | Message confirming the password was changed successfully; customer is redirected to the login screen |

### Profile Editing

| ID | Output | Description |
|----|--------|-------------|
| O-18 | Profile form | Pre-filled with the current values for name, phone, and default address |
| O-19 | Validation errors | Inline messages for any field that fails validation (e.g. invalid phone format) |
| O-20 | Save confirmation | Brief notice confirming the profile was updated successfully |

---

## Functional States

| State | Condition | Behavior |
|-------|-----------|----------|
| Guest | No active session | Customer can browse and add to cart; order history and profile are not accessible |
| Pending verification | Account created but email not yet confirmed | Customer cannot log in; a prompt to verify the email is shown on the login screen |
| Authenticated | Valid session active | Full access to order history, persistent cart, saved address, and profile settings |
| Session expired | The session has exceeded its validity period | Customer is redirected to the login screen; a message explains the session ended |
| Reset link valid | Customer opened the link within the allowed time window | Password reset form is shown |
| Reset link expired | Customer opened the link after the time window closed | Error message shown with an option to request a new link |
| Profile unsaved | Customer made edits but has not yet saved | Changes are not applied; leaving the page without saving prompts a discard warning |

---

## Business Rules

- An email address can only be associated with one account. Attempting to register with an already-used email shows an error without revealing whether the account was created via Google or directly.
- Email verification is required before the first login. The customer cannot access their account until the link is clicked.
- The verification email link expires after 24 hours. The customer can request a new one from the login screen.
- Login errors do not distinguish between an unrecognised email and a wrong password. Both show the same generic message.
- Password reset links expire after 1 hour and can only be used once.
- When a guest customer logs in, their local cart is merged with the account's saved cart. If the same product variant exists in both, the quantities are combined up to the available stock limit.
- Logging out clears the active session immediately. The cart is saved to the account before the session ends; a guest cart starts fresh.
- Profile changes take effect immediately after saving and are reflected at the next checkout without requiring the customer to re-enter them.
