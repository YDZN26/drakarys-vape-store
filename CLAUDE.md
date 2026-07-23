# CLAUDE.md

This file documents how AI tools were used throughout the development of this project, as requested for academic transparency.

## Tools used

- **Claude (claude.ai, web chat)** — acted as technical lead/architect. Used for: analyzing specs, making architecture decisions, designing the data model contract between this web app and the shared Supabase database (also used by a separate internal inventory/POS app), and producing exact prompts to be executed by Claude Code.
- **Claude Code (CLI, terminal)** — acted as the executor. Received specific, scoped prompts from the Claude web session and applied the actual file changes, ran builds/tests, and reported results back for review before proceeding to the next step.

## Workflow used throughout this project

1. **Spec-first.** All features are defined in `docs/` before any code is written. Scope changes update the relevant spec `.md` file first.
2. **Human-in-the-loop on every step.** Claude Code was never given open-ended autonomy — each change was scoped to a specific prompt, diffed and reviewed before moving to the next file. Design decisions with ambiguity were escalated back to the developer rather than assumed.
3. **Verification over trust.** Claims from either AI tool (e.g. "tests pass", "build is clean") were independently re-verified against raw command output before being accepted.

## Project-specific conventions Claude Code should follow

- **Code language:** English for all code — variable/function names, file names, commit messages, comments, and documentation (`docs/`).
- **UI language:** Spanish (Bolivia) for all customer-facing text, since this is a real storefront for Spanish-speaking customers in Bolivia. This is a deliberate localization decision (see `docs/03-non-functional-requirements.md`), not an inconsistency.
- **Currency:** Bolivian bolivianos (Bs.).
- **Database is shared and already in production.** A separate internal Ionic/Angular inventory app uses the same Supabase database. Any schema change must be strictly additive — never rename, drop, or modify existing columns/tables used by the internal app. All schema changes are written as versioned SQL files in `supabase/migrations/`, reviewed, and run manually by the developer.
- **This web app is read-only on `producto`/`categoria`.** All product/category/stock management happens exclusively in the internal app.
- **No checkout/payment gateway in v1.** The cart ends in a WhatsApp order button. Full checkout, customer authentication, and the admin panel (Specs 04–06) are explicitly deferred — see deferral notes at the top of those spec files.
