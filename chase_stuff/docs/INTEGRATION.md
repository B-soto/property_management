# Integration Instructions
## Adding the Payment Portal to the existing React + Django app

---

## Step 1 — Copy the component files

Copy these 3 files into `frontend/src/components/`:
- `PaymentLayout.jsx`
- `PaymentPortal.jsx`
- `PaymentLedger.jsx`

---

## Step 2 — Install Stripe packages

```bash
cd frontend
npm install @stripe/react-stripe-js @stripe/stripe-js
```

---

## Step 3 — Add the route in App.jsx

Find where your routes are defined and add:

```jsx
import PaymentLayout from './components/PaymentLayout';

// Inside your <Routes> block:
<Route path="/payments" element={<PaymentLayout />} />

// Or if it's a protected route (recommended):
<Route path="/payments" element={
  <ProtectedRoute>
    <PaymentLayout />
  </ProtectedRoute>
} />
```

---

## Step 4 — Add nav link

In your NavBar or sidebar, add a link to `/payments`:

```jsx
<NavLink to="/payments">Payments</NavLink>
```

---

## Step 5 — Add Stripe publishable key

In `PaymentPortal.jsx`, line 10, replace:
```js
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');
```
With your actual Stripe test key from dashboard.stripe.com

---

## Step 6 — Backend migrations (if not already done)

```bash
conda activate property_management
cd backend
python manage.py makemigrations
python manage.py migrate
```

---

## Step 7 — Run both servers

Terminal 1 (backend):
```bash
conda activate property_management
cd backend
python manage.py runserver
```

Terminal 2 (frontend):
```bash
cd frontend
npm run dev
```

Open: http://localhost:3000/payments

---

## Notes

- The ledger falls back to demo data if the API isn't reachable
- Manager credentials are hardcoded in PaymentLayout.jsx — move to env vars before production
- The raw HTML file (VSR-Payment-Portal.html) is the source of truth for the UI — open it in any browser to reference
- Card/ACH tab uses test mode Stripe by default — no real charges until you swap to live keys
