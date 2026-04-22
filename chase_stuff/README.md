# VSR Payment Portal — Integration Guide
## For: B. Soto (Frontend Dev)
## Live demo: https://vsr-swfl-propertymanagement.netlify.app

---

## What this is

A fully working payment portal built in vanilla HTML/CSS/JS.
Needs to be converted into React components and integrated into the existing
React + Vite frontend at `/payments` route.

---

## Current stack (existing app)
- React 18 + Vite
- Material UI (MUI)
- Axios for API calls (frontend/src/components/Axios.jsx)
- JWT auth (stored in localStorage, auto-refreshed)
- Django REST Framework backend

---

## Files in this package

| File | Description |
|------|-------------|
| `VSR-Payment-Portal.html` | Complete working portal — source of truth for UI/UX |
| `src/components/PaymentPortal.jsx` | React component — Resident Portal |
| `src/components/PaymentLedger.jsx` | React component — Manager Ledger |
| `src/components/PaymentLayout.jsx` | React component — Tab switcher wrapping both |
| `docs/INTEGRATION.md` | Step by step integration instructions |

---

## Manager login credentials (demo only — move to env before production)
- Username: `vsrshitnocap`
- Password: `cardan0!`

---

## Design tokens (match existing app theme)
```
--navy:     #0d1117   (backgrounds)
--gold:     #d4a843   (primary accent / CTAs)
--blue:     #3b7dd8   (active states)
--green:    #3fb950   (success)
--red:      #f85149   (error/failed)
--amber:    #d29922   (warning/pending)
Font:       Inter (body), JetBrains Mono (amounts/refs)
```

---

## Payment methods supported
1. **Zelle** — copy-to-clipboard account details + confirmation form
2. **Card/ACH** — Stripe card element (needs live Stripe publishable key)
3. **Cash** — office hours display + visit scheduler
4. **Money Order** — mailing details + notification form

---

## Backend endpoints needed (already built in Django)
```
POST /api/token/                          — Login
POST /api/register/                       — Register
GET  /project/{id}/payments/              — List payments
POST /project/{id}/payments/create-intent/ — Create Stripe intent
POST /project/{id}/payments/confirm/      — Confirm payment
POST /api/stripe/webhook/                 — Stripe webhook
```

---

## Stripe setup (Card/ACH tab)
1. Create account at dashboard.stripe.com
2. Get test keys (sk_test_ and pk_test_)
3. Add to backend settings.py:
   ```python
   STRIPE_SECRET_KEY = 'sk_test_...'
   STRIPE_PUBLISHABLE_KEY = 'pk_test_...'
   STRIPE_WEBHOOK_SECRET = 'whsec_...'
   ```
4. Install: `pip install stripe`
5. Install frontend: `npm install @stripe/react-stripe-js @stripe/stripe-js`
6. Replace publishable key in PaymentPortal.jsx

---

## Quick start — run portal standalone
Just open `VSR-Payment-Portal.html` in any browser. No server needed.
