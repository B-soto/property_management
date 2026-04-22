// src/components/PaymentPortal.jsx
// Resident-facing payment portal
// Requires: @stripe/react-stripe-js @stripe/stripe-js
// Install:  npm install @stripe/react-stripe-js @stripe/stripe-js

import React, { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import AxiosInstance from './Axios';

// ── Replace with your Stripe publishable key ──
const stripePromise = loadStripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE');

const METHODS = [
  { id: 'zelle', icon: '⚡', label: 'Zelle' },
  { id: 'card',  icon: '💳', label: 'Card/ACH' },
  { id: 'cash',  icon: '💵', label: 'Cash' },
  { id: 'mo',    icon: '📋', label: 'Money Order' },
];

const PROPERTIES = ['7972 Bristol Circle', '4401 Maple Ave #2B', '1130 Oak Street'];
const PAYMENT_TYPES = ['Rent', 'Security Deposit', 'Late Fee', 'Maintenance Fee', 'Other'];

// ── Shared field styles ──
const input = {
  width: '100%', background: '#21262d',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 8, padding: '12px 14px',
  fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#e6edf3',
  outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none',
};
const label = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: '#8b949e', marginBottom: 7,
};
const submitBtn = (disabled) => ({
  width: '100%', padding: 15, border: 'none', borderRadius: 10,
  background: disabled ? 'rgba(212,168,67,0.4)' : 'linear-gradient(135deg,#d4a843,#b8860b)',
  color: '#0d1117', fontFamily: 'Inter, sans-serif',
  fontSize: 15, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
  minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
});

// ── Stripe checkout form (Card/ACH) ──
function CardForm({ propertyId, onSuccess }) {
  const stripe = useStripe();
  const elements = useElements();
  const [form, setForm] = useState({ name: '', amount: '', property: '', type: 'Rent' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e) {
    e.preventDefault();
    if (!stripe || !elements || !form.amount) return;
    setLoading(true); setError('');
    try {
      const { data } = await AxiosInstance.post(
        `/project/${propertyId || 1}/payments/create-intent/`,
        { amount: form.amount, payment_type: form.type.toLowerCase().replace(' ', '_'), description: form.type }
      );
      const { error: stripeErr, paymentIntent } = await stripe.confirmCardPayment(
        data.client_secret,
        { payment_method: { card: elements.getElement(CardElement) } }
      );
      if (stripeErr) { setError(stripeErr.message); setLoading(false); return; }
      if (paymentIntent.status === 'succeeded') {
        await AxiosInstance.post(`/project/${propertyId || 1}/payments/confirm/`, {
          payment_intent_id: data.payment_intent_id
        });
        onSuccess(parseFloat(form.amount), 'Card payment processed');
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Payment failed. Please try again.');
    }
    setLoading(false);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label style={label}>Full name *</label>
          <input style={input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Name on card" autoComplete="cc-name"/></div>
        <div><label style={label}>Amount *</label>
          <input style={input} type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" inputMode="decimal"/></div>
        <div><label style={label}>Property</label>
          <select style={input} value={form.property} onChange={e => setForm({...form, property: e.target.value})}>
            <option value="">Select property</option>
            {PROPERTIES.map(p => <option key={p}>{p}</option>)}
          </select></div>
        <div><label style={label}>Payment type</label>
          <select style={input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
            {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
          </select></div>
      </div>
      <div style={{ marginBottom: 12 }}>
        <label style={label}>Card details</label>
        <div style={{ background: '#21262d', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, padding: '14px' }}>
          <CardElement options={{ style: { base: { fontSize: '16px', color: '#e6edf3', '::placeholder': { color: '#484f58' } } } }} />
        </div>
      </div>
      {error && <div style={{ background: 'rgba(248,81,73,0.12)', border: '1px solid rgba(248,81,73,0.3)', borderRadius: 8, padding: '10px 14px', fontSize: 13, color: '#ff7b72', marginBottom: 12 }}>{error}</div>}
      <button type="submit" style={submitBtn(!stripe || loading || !form.amount)} disabled={!stripe || loading || !form.amount}>
        {loading ? 'Processing…' : `Pay $${parseFloat(form.amount || 0).toFixed(2)}`}
      </button>
    </form>
  );
}

// ── Generic confirmation form (Zelle / Cash / Money Order) ──
function ConfirmForm({ method, onSuccess }) {
  const [form, setForm] = useState({ name: '', amount: '', property: '', type: 'Rent', ref: '', date: '', moNum: '' });
  const [loading, setLoading] = useState(false);

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      onSuccess(parseFloat(form.amount || 0), {
        zelle: 'Zelle payment submitted',
        cash: 'Visit scheduled',
        mo: 'Notification sent',
      }[method]);
      setLoading(false);
    }, 1600);
  }

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div><label style={label}>Your name *</label>
          <input style={input} value={form.name} onChange={e => setForm({...form, name: e.target.value})} placeholder="Full name" autoComplete="name"/></div>
        <div><label style={label}>Amount</label>
          <input style={input} type="number" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} placeholder="0.00" inputMode="decimal"/></div>
        <div><label style={label}>Property</label>
          <select style={input} value={form.property} onChange={e => setForm({...form, property: e.target.value})}>
            <option value="">Select property</option>
            {PROPERTIES.map(p => <option key={p}>{p}</option>)}
          </select></div>
        {method === 'zelle' && (
          <div><label style={label}>Payment type</label>
            <select style={input} value={form.type} onChange={e => setForm({...form, type: e.target.value})}>
              {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select></div>
        )}
        {method === 'zelle' && (
          <div style={{ gridColumn: '1 / -1' }}><label style={label}>Zelle confirmation # (optional)</label>
            <input style={input} value={form.ref} onChange={e => setForm({...form, ref: e.target.value})} placeholder="e.g. ZE123456789"/></div>
        )}
        {method === 'cash' && (
          <div><label style={label}>Preferred date</label>
            <input style={input} type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})}/></div>
        )}
        {method === 'mo' && (
          <div><label style={label}>Money order #</label>
            <input style={input} value={form.moNum} onChange={e => setForm({...form, moNum: e.target.value})} placeholder="e.g. MO-123456"/></div>
        )}
      </div>
      <button style={submitBtn(loading || !form.name)} onClick={handleSubmit} disabled={loading || !form.name}>
        {loading ? 'Submitting…' : { zelle: 'Confirm Zelle Payment', cash: 'Schedule Visit', mo: 'Send Notification' }[method]}
      </button>
    </div>
  );
}

// ── Main PaymentPortal component ──
export default function PaymentPortal() {
  const [activeMethod, setActiveMethod] = useState('zelle');
  const [success, setSuccess] = useState(null);

  function handleSuccess(amount, label) {
    const ref = 'VSR-' + new Date().toISOString().slice(0,10).replace(/-/g,'') + '-' + Math.floor(Math.random()*9000+1000);
    setSuccess({ amount, label, ref });
  }

  if (success) {
    return (
      <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 16px' }}>
        <div style={{ background: '#1c2333', border: '1px solid rgba(63,185,80,0.3)', borderRadius: 14, padding: '40px 24px', textAlign: 'center' }}>
          <div style={{ width: 68, height: 68, borderRadius: '50%', border: '2px solid #3fb950', background: 'rgba(63,185,80,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <svg width="32" height="32" fill="none" viewBox="0 0 24 24"><path d="M5 13l4 4L19 7" stroke="#3fb950" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <div style={{ fontSize: 36, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#3fb950', letterSpacing: '-1px', marginBottom: 6 }}>
            {success.amount > 0 ? `$${success.amount.toFixed(2)}` : 'Submitted'}
          </div>
          <div style={{ fontSize: 14, color: '#8b949e', marginBottom: 4 }}>{success.label}</div>
          <div style={{ fontSize: 11, color: '#484f58', fontFamily: 'JetBrains Mono, monospace', marginBottom: 28 }}>REF #{success.ref} · Pending confirmation</div>
          <button style={{ ...submitBtn(false), maxWidth: 240, margin: '0 auto' }} onClick={() => setSuccess(null)}>
            Submit another payment
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '40px 16px 80px' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 2, color: '#d4a843', marginBottom: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
          <span style={{ flex: 1, maxWidth: 32, height: 1, background: 'rgba(212,168,67,0.3)', display: 'block' }}/>
          SECURE · INSTANT · VERIFIED
          <span style={{ flex: 1, maxWidth: 32, height: 1, background: 'rgba(212,168,67,0.3)', display: 'block' }}/>
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.6px', marginBottom: 8 }}>Resident Payment Portal</h1>
        <p style={{ fontSize: 13, color: '#8b949e', maxWidth: 380, margin: '0 auto' }}>Choose your preferred payment method. All submissions confirmed within one business day.</p>
      </div>

      {/* Method grid - 2x2 on mobile, 4-col on desktop */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {METHODS.map(m => (
          <div key={m.id}
            onClick={() => setActiveMethod(m.id)}
            style={{
              background: activeMethod === m.id ? 'rgba(59,125,216,0.15)' : '#1c2333',
              border: `1px solid ${activeMethod === m.id ? '#3b7dd8' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14, padding: '16px 8px', cursor: 'pointer',
              textAlign: 'center', transition: 'all 0.2s',
            }}>
            <div style={{ fontSize: 26, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#e6edf3' }}>{m.label}</div>
            <div style={{ height: 2, borderRadius: 1, background: '#3b7dd8', marginTop: 10, opacity: activeMethod === m.id ? 1 : 0, transition: 'opacity 0.2s' }}/>
          </div>
        ))}
      </div>

      {/* Payment panel */}
      <div style={{ background: '#1c2333', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>

        {/* Zelle */}
        {activeMethod === 'zelle' && (
          <>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#6c35de,#4b1fa8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>⚡</div>
                <div><div style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>Zelle</div><div style={{ fontSize: 12, color: '#8b949e' }}>Instant · No fees</div></div>
              </div>
              <span style={{ padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: 'rgba(59,125,216,0.15)', color: '#79c0ff', border: '1px solid rgba(59,125,216,0.4)' }}>Instant · Free</span>
            </div>
            <div style={{ margin: '16px 20px', padding: '14px 16px', background: 'rgba(210,153,34,0.15)', border: '1px solid rgba(210,153,34,0.25)', borderRadius: 10 }}>
              <span style={{ fontSize: 13, color: '#e3b341' }}>ℹ️ Send to our Zelle account below, then complete the form so we can match your payment.</span>
            </div>
            <div style={{ padding: '0 20px 16px' }}>
              {[['Phone', '+1 (239) 555-0182'], ['Email', 'vsr.prop.mgmt@gmail.com'], ['Name', 'VSR Property Management']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: 13, color: '#8b949e' }}>{k}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{v}</span>
                    {k !== 'Name' && (
                      <button onClick={() => navigator.clipboard.writeText(v)}
                        style={{ background: '#21262d', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 6, padding: '5px 12px', fontSize: 11, color: '#8b949e', cursor: 'pointer' }}>
                        Copy
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <ConfirmForm method="zelle" onSuccess={handleSuccess} />
            </div>
          </>
        )}

        {/* Card/ACH */}
        {activeMethod === 'card' && (
          <>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#8b1a1a,#c0392b)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💳</div>
                <div><div style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>Card / ACH / EFT</div><div style={{ fontSize: 12, color: '#8b949e' }}>Credit, debit, or direct bank transfer</div></div>
              </div>
              <span style={{ padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: 'rgba(248,81,73,0.12)', color: '#ff7b72', border: '1px solid rgba(248,81,73,0.3)' }}>Stripe Secured</span>
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <Elements stripe={stripePromise}>
                <CardForm onSuccess={handleSuccess} />
              </Elements>
            </div>
          </>
        )}

        {/* Cash */}
        {activeMethod === 'cash' && (
          <>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#1a5c2a,#27ae60)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>💵</div>
                <div><div style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>Cash</div><div style={{ fontSize: 12, color: '#8b949e' }}>In-person · Receipt issued immediately</div></div>
              </div>
              <span style={{ padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: 'rgba(63,185,80,0.12)', color: '#56d364', border: '1px solid rgba(63,185,80,0.3)' }}>In-Person Only</span>
            </div>
            <div style={{ padding: '0 20px 16px' }}>
              {[['Mon – Fri', '9:00 AM – 5:00 PM'], ['Saturday', '10:00 AM – 2:00 PM'], ['Sunday', 'Closed']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: 13, color: '#8b949e' }}>{k}</span>
                  <span style={{ fontSize: 13, fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <ConfirmForm method="cash" onSuccess={handleSuccess} />
            </div>
          </>
        )}

        {/* Money Order */}
        {activeMethod === 'mo' && (
          <>
            <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 12, background: 'linear-gradient(135deg,#1a3a5c,#2980b9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>📋</div>
                <div><div style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>Money Order</div><div style={{ fontSize: 12, color: '#8b949e' }}>Mail or drop off payable to VSR</div></div>
              </div>
              <span style={{ padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: 'rgba(210,153,34,0.15)', color: '#e3b341', border: '1px solid rgba(210,153,34,0.3)' }}>Mail / Drop-off</span>
            </div>
            <div style={{ padding: '0 20px 16px' }}>
              {[['Payable to', 'VSR Property Management'], ['Memo line', 'Unit # + Phone number'], ['Location', 'Dallas, TX']].map(([k, v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: 13, color: '#8b949e' }}>{k}</span>
                  <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{v}</span>
                </div>
              ))}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <ConfirmForm method="mo" onSuccess={handleSuccess} />
            </div>
          </>
        )}

        {/* Secure note */}
        <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: 11, color: '#484f58', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 16 16"><path d="M8 1L2 4v4c0 3.31 2.69 6.95 6 8 3.31-1.05 6-4.69 6-8V4L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
          All submissions encrypted and verified by VSR Property Management
        </div>
      </div>
    </div>
  );
}
