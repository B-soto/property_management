import React, { useState } from 'react';

const METHODS = [
  { id: 'zelle', icon: '⚡', label: 'Zelle' },
  { id: 'card',  icon: '💳', label: 'Card/ACH' },
  { id: 'cash',  icon: '💵', label: 'Cash' },
  { id: 'mo',    icon: '📋', label: 'Money Order' },
];

const PAYMENT_TYPES = ['Rent', 'Security Deposit', 'Late Fee', 'Maintenance Fee', 'Other'];

const inp = {
  width: '100%', background: '#21262d',
  border: '1px solid rgba(255,255,255,0.14)',
  borderRadius: 8, padding: '12px 14px',
  fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#e6edf3',
  outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none',
  appearance: 'none',
};
const lbl = {
  display: 'block', fontSize: 12, fontWeight: 500,
  color: '#8b949e', marginBottom: 7,
};
const goldBtn = (disabled) => ({
  width: '100%', padding: 15, border: 'none', borderRadius: 10,
  background: disabled
    ? 'rgba(212,168,67,0.4)'
    : 'linear-gradient(135deg,#d4a843,#b8860b)',
  color: '#0d1117', fontFamily: 'Inter, sans-serif',
  fontSize: 15, fontWeight: 700, cursor: disabled ? 'not-allowed' : 'pointer',
  minHeight: 52, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
});

function ConfirmForm({ method, onSuccess }) {
  const [form, setForm] = useState({ name: '', amount: '', type: 'Rent', ref: '', date: '', moNum: '' });
  const [cardNum, setCardNum] = useState('');
  const [cardExp, setCardExp] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(p => ({ ...p, [k]: e.target.value }));

  function handleSubmit() {
    setLoading(true);
    setTimeout(() => {
      onSuccess(parseFloat(form.amount || 0), {
        zelle: 'Zelle payment submitted',
        card:  'Card payment submitted',
        cash:  'Visit scheduled',
        mo:    'Notification sent',
      }[method]);
      setLoading(false);
    }, 1600);
  }

  const btnLabel = { zelle: 'Confirm Zelle Payment', card: `Pay $${parseFloat(form.amount||0).toFixed(2)}`, cash: 'Schedule Visit', mo: 'Send Notification' }[method];

  return (
    <div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>
        <div>
          <label style={lbl}>Your name *</label>
          <input style={inp} value={form.name} onChange={set('name')} placeholder="Full name" autoComplete="name" />
        </div>
        <div>
          <label style={lbl}>Amount</label>
          <input style={inp} type="number" value={form.amount} onChange={set('amount')} placeholder="0.00" inputMode="decimal" />
        </div>
        {(method === 'zelle' || method === 'card') && (
          <div>
            <label style={lbl}>Payment type</label>
            <select style={inp} value={form.type} onChange={set('type')}>
              {PAYMENT_TYPES.map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
        )}
        {method === 'zelle' && (
          <div>
            <label style={lbl}>Zelle confirmation # (optional)</label>
            <input style={inp} value={form.ref} onChange={set('ref')} placeholder="e.g. ZE123456789" />
          </div>
        )}
        {method === 'cash' && (
          <div>
            <label style={lbl}>Preferred date</label>
            <input style={inp} type="date" value={form.date} onChange={set('date')} />
          </div>
        )}
        {method === 'mo' && (
          <div>
            <label style={lbl}>Money order #</label>
            <input style={inp} value={form.moNum} onChange={set('moNum')} placeholder="e.g. MO-123456" />
          </div>
        )}
      </div>

      {method === 'card' && (
        <div style={{ marginBottom: 12 }}>
          <label style={lbl}>Card details</label>
          <div style={{ background: '#21262d', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, overflow: 'hidden' }}>
            <input
              value={cardNum} onChange={e => setCardNum(e.target.value)}
              placeholder="Card number"
              inputMode="numeric"
              style={{ ...inp, borderRadius: 0, borderBottom: '1px solid rgba(255,255,255,0.08)', fontFamily: 'JetBrains Mono, monospace' }}
            />
            <div style={{ display: 'flex' }}>
              <input
                value={cardExp} onChange={e => setCardExp(e.target.value)}
                placeholder="MM / YY"
                inputMode="numeric"
                style={{ ...inp, borderRadius: 0, flex: 1, fontFamily: 'JetBrains Mono, monospace' }}
              />
              <div style={{ width: 1, background: 'rgba(255,255,255,0.08)' }} />
              <input
                value={cardCvc} onChange={e => setCardCvc(e.target.value)}
                placeholder="CVC"
                inputMode="numeric"
                style={{ ...inp, borderRadius: 0, flex: 1, fontFamily: 'JetBrains Mono, monospace' }}
              />
            </div>
          </div>
        </div>
      )}

      <button style={goldBtn(loading || !form.name)} onClick={handleSubmit} disabled={loading || !form.name}>
        {loading ? 'Submitting…' : btnLabel}
      </button>
    </div>
  );
}

const panelHeader = (icon, iconBg, title, sub, badge, badgeStyle) => (
  <div style={{ padding: '18px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 46, height: 46, borderRadius: 12, background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22 }}>{icon}</div>
      <div>
        <div style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>{title}</div>
        <div style={{ fontSize: 12, color: '#8b949e' }}>{sub}</div>
      </div>
    </div>
    <span style={{ padding: '5px 12px', borderRadius: 999, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', ...badgeStyle }}>{badge}</span>
  </div>
);

const infoBox = (text) => (
  <div style={{ margin: '16px 20px', padding: '14px 16px', background: 'rgba(210,153,34,0.15)', border: '1px solid rgba(210,153,34,0.25)', borderRadius: 10 }}>
    <span style={{ fontSize: 13, color: '#e3b341' }}>ℹ️ {text}</span>
  </div>
);

const detailRow = (key, val, last = false) => (
  <div key={key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0', borderBottom: last ? 'none' : '1px solid rgba(255,255,255,0.08)', gap: 12 }}>
    <span style={{ fontSize: 13, color: '#8b949e', flexShrink: 0 }}>{key}</span>
    <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3', overflow: 'hidden', textOverflow: 'ellipsis' }}>{val}</span>
  </div>
);

const secureLine = () => (
  <div style={{ padding: '12px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', textAlign: 'center', fontSize: 11, color: '#484f58', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}>
    <svg width="11" height="11" fill="none" viewBox="0 0 16 16"><path d="M8 1L2 4v4c0 3.31 2.69 6.95 6 8 3.31-1.05 6-4.69 6-8V4L8 1z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round"/></svg>
    All submissions encrypted and verified by VSR Property Management
  </div>
);

export default function TenantPaymentPortal() {
  const [activeMethod, setActiveMethod] = useState('zelle');
  const [success, setSuccess] = useState(null);

  function handleSuccess(amount, label) {
    const ref = 'VSR-' + new Date().toISOString().slice(0, 10).replace(/-/g, '') + '-' + Math.floor(Math.random() * 9000 + 1000);
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
          <button style={{ ...goldBtn(false), maxWidth: 240, margin: '0 auto' }} onClick={() => setSuccess(null)}>
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
          <span style={{ flex: 1, maxWidth: 32, height: 1, background: 'rgba(212,168,67,0.3)', display: 'block' }} />
          SECURE · INSTANT · VERIFIED
          <span style={{ flex: 1, maxWidth: 32, height: 1, background: 'rgba(212,168,67,0.3)', display: 'block' }} />
        </div>
        <h1 style={{ fontSize: 28, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.6px', marginBottom: 8 }}>Resident Payment Portal</h1>
        <p style={{ fontSize: 13, color: '#8b949e', maxWidth: 380, margin: '0 auto' }}>
          Choose your preferred payment method. All submissions confirmed within one business day.
        </p>
      </div>

      {/* Method grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
        {METHODS.map(m => (
          <div
            key={m.id}
            onClick={() => setActiveMethod(m.id)}
            style={{
              background: activeMethod === m.id ? 'rgba(59,125,216,0.15)' : '#1c2333',
              border: `1px solid ${activeMethod === m.id ? '#3b7dd8' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: 14, padding: '16px 8px', cursor: 'pointer',
              textAlign: 'center', transition: 'all 0.2s', userSelect: 'none',
            }}
          >
            <div style={{ fontSize: 26, marginBottom: 8 }}>{m.icon}</div>
            <div style={{ fontSize: 13, fontWeight: 500, color: '#e6edf3' }}>{m.label}</div>
            <div style={{ height: 2, borderRadius: 1, background: '#3b7dd8', marginTop: 10, opacity: activeMethod === m.id ? 1 : 0, transition: 'opacity 0.2s' }} />
          </div>
        ))}
      </div>

      {/* Payment panel */}
      <div style={{ background: '#1c2333', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>

        {activeMethod === 'zelle' && (
          <>
            {panelHeader('⚡', 'linear-gradient(135deg,#6c35de,#4b1fa8)', 'Zelle', 'Instant · No fees', 'Instant · Free',
              { background: 'rgba(59,125,216,0.15)', color: '#79c0ff', border: '1px solid rgba(59,125,216,0.4)' })}
            {infoBox('Send to our Zelle account below, then complete the form so we can match your payment.')}
            <div style={{ padding: '0 20px 16px' }}>
              {detailRow('Phone', '+1 (239) 555-0182')}
              {detailRow('Email', 'vsr.prop.mgmt@gmail.com')}
              {detailRow('Name', 'VSR Property Management', true)}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <ConfirmForm method="zelle" onSuccess={handleSuccess} />
            </div>
          </>
        )}

        {activeMethod === 'card' && (
          <>
            {panelHeader('💳', 'linear-gradient(135deg,#8b1a1a,#c0392b)', 'Card / ACH / EFT', 'Credit, debit, or direct bank transfer', 'Stripe Secured',
              { background: 'rgba(248,81,73,0.12)', color: '#ff7b72', border: '1px solid rgba(248,81,73,0.3)' })}
            <div style={{ padding: '16px 20px' }}>
              <ConfirmForm method="card" onSuccess={handleSuccess} />
            </div>
          </>
        )}

        {activeMethod === 'cash' && (
          <>
            {panelHeader('💵', 'linear-gradient(135deg,#1a5c2a,#27ae60)', 'Cash', 'In-person · Receipt issued immediately', 'In-Person Only',
              { background: 'rgba(63,185,80,0.12)', color: '#56d364', border: '1px solid rgba(63,185,80,0.3)' })}
            {infoBox('Cash payments must be made in person during business hours. A signed receipt will be issued on the spot.')}
            <div style={{ padding: '0 20px 16px' }}>
              {detailRow('Mon – Fri', '9:00 AM – 5:00 PM')}
              {detailRow('Saturday', '10:00 AM – 2:00 PM')}
              {detailRow('Sunday', 'Closed', true)}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <ConfirmForm method="cash" onSuccess={handleSuccess} />
            </div>
          </>
        )}

        {activeMethod === 'mo' && (
          <>
            {panelHeader('📋', 'linear-gradient(135deg,#1a3a5c,#2980b9)', 'Money Order', 'Mail or drop off payable to VSR', 'Mail / Drop-off',
              { background: 'rgba(210,153,34,0.15)', color: '#e3b341', border: '1px solid rgba(210,153,34,0.3)' })}
            {infoBox('Make payable to VSR Property Management. Write your unit number and phone number on the memo line.')}
            <div style={{ padding: '0 20px 16px' }}>
              {detailRow('Payable to', 'VSR Property Management')}
              {detailRow('Memo line', 'Unit # + Phone number')}
              {detailRow('Location', 'Dallas, TX', true)}
            </div>
            <div style={{ padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <ConfirmForm method="mo" onSuccess={handleSuccess} />
            </div>
          </>
        )}

        {secureLine()}
      </div>
    </div>
  );
}
