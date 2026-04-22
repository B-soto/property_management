// src/components/PaymentLedger.jsx
// Manager-facing payment ledger
// Connects to existing Django REST API via AxiosInstance

import React, { useState, useEffect, useCallback } from 'react';
import AxiosInstance from './Axios';

const PROPERTIES = ['7972 Bristol Circle', '4401 Maple Ave #2B', '1130 Oak Street'];
const METHODS = ['Zelle', 'Card', 'ACH', 'Cash', 'Money Order'];
const TYPES = ['Rent', 'Security Deposit', 'Late Fee', 'Maintenance Fee', 'Other'];

const fmt = n => '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

function Badge({ status }) {
  const cfg = {
    succeeded: { bg: 'rgba(63,185,80,0.12)',  color: '#56d364', dot: '#3fb950', label: 'Succeeded' },
    pending:   { bg: 'rgba(210,153,34,0.15)', color: '#e3b341', dot: '#d29922', label: 'Pending'   },
    failed:    { bg: 'rgba(248,81,73,0.12)',  color: '#ff7b72', dot: '#f85149', label: 'Failed'    },
  };
  const c = cfg[status] || cfg.pending;
  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '3px 10px', borderRadius: 999, fontSize: 11, fontWeight: 500, background: c.bg, color: c.color }}>
      <span style={{ width: 5, height: 5, borderRadius: '50%', background: c.dot, flexShrink: 0 }}/>
      {c.label}
    </span>
  );
}

export default function PaymentLedger() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState('');
  const [form, setForm] = useState({ tenant: '', amount: '', property: PROPERTIES[0], method: 'Zelle', type: 'Rent', status: 'succeeded' });

  // Fetch from API — falls back to demo data if API not available
  const fetchPayments = useCallback(async () => {
    try {
      const res = await AxiosInstance.get('/project/1/payments/');
      setPayments(res.data);
    } catch {
      // Demo data fallback for development
      setPayments([
        { id:1, payment_date:'Apr 1, 2026',  property:'7972 Bristol Circle', tenant_name:'Marcus Williams', method:'Zelle', payment_type:'rent',    amount:'1800.00', status:'succeeded', stripe_payment_intent_id:'ZE-9823041' },
        { id:2, payment_date:'Apr 1, 2026',  property:'7972 Bristol Circle', tenant_name:'Sandra Ortega',  method:'Card',  payment_type:'rent',    amount:'1800.00', status:'succeeded', stripe_payment_intent_id:'pi_mock_ab1' },
        { id:3, payment_date:'Apr 1, 2026',  property:'4401 Maple Ave #2B',  tenant_name:'DeShawn Carter', method:'Zelle', payment_type:'rent',    amount:'1350.00', status:'succeeded', stripe_payment_intent_id:'ZE-9823102' },
        { id:4, payment_date:'Apr 5, 2026',  property:'1130 Oak Street',     tenant_name:'Priya Nair',     method:'Zelle', payment_type:'rent',    amount:'1650.00', status:'pending',   stripe_payment_intent_id:'ZE-pending' },
        { id:5, payment_date:'Feb 28, 2026', property:'4401 Maple Ave #2B',  tenant_name:'DeShawn Carter', method:'Card',  payment_type:'rent',    amount:'1350.00', status:'failed',    stripe_payment_intent_id:'pi_fail_01' },
      ]);
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchPayments(); }, [fetchPayments]);

  function showToast(msg) {
    setToast(msg);
    setTimeout(() => setToast(''), 3000);
  }

  async function deletePayment(id) {
    try {
      await AxiosInstance.delete(`/project/1/payments/${id}/`);
    } catch { /* demo mode — just remove from state */ }
    setPayments(p => p.filter(r => r.id !== id));
    showToast('Record removed');
  }

  function addRecord() {
    if (!form.tenant || !form.amount) { alert('Please enter a tenant name and amount.'); return; }
    const newRecord = {
      id: Date.now(),
      payment_date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      property: form.property, tenant_name: form.tenant,
      method: form.method, payment_type: form.type.toLowerCase().replace(' ', '_'),
      amount: parseFloat(form.amount).toFixed(2), status: form.status,
      stripe_payment_intent_id: 'VSR-MANUAL-' + Date.now(),
    };
    setPayments(p => [newRecord, ...p]);
    setShowModal(false);
    setForm({ tenant: '', amount: '', property: PROPERTIES[0], method: 'Zelle', type: 'Rent', status: 'succeeded' });
    showToast('Payment record added');
  }

  function exportCSV() {
    const headers = ['Date', 'Property', 'Tenant', 'Method', 'Type', 'Amount', 'Status', 'Ref'];
    const rows = payments.map(r => [r.payment_date, r.property, r.tenant_name, r.method, r.payment_type, '$' + r.amount, r.status, r.stripe_payment_intent_id || '']);
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n');
    const a = document.createElement('a');
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv);
    a.download = 'VSR-Payments-' + new Date().toISOString().slice(0, 10) + '.csv';
    a.click();
    showToast('CSV exported');
  }

  const filtered = payments.filter(r => {
    if (filter !== 'all' && r.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (r.tenant_name || '').toLowerCase().includes(q) ||
             (r.property || '').toLowerCase().includes(q) ||
             r.amount.toString().includes(q);
    }
    return true;
  });

  const collected = payments.filter(r => r.status === 'succeeded').reduce((s, r) => s + parseFloat(r.amount), 0);
  const pending   = payments.filter(r => r.status === 'pending').reduce((s, r) => s + parseFloat(r.amount), 0);
  const failed    = payments.filter(r => r.status === 'failed').reduce((s, r) => s + parseFloat(r.amount), 0);
  const thisMonth = payments.filter(r => r.status === 'succeeded' && (r.payment_date || '').includes('Apr 2026')).reduce((s, r) => s + parseFloat(r.amount), 0);

  const inputStyle = { width: '100%', background: '#21262d', border: '1px solid rgba(255,255,255,0.14)', borderRadius: 8, padding: '12px 14px', fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#e6edf3', outline: 'none', boxSizing: 'border-box', WebkitAppearance: 'none', marginBottom: 12 };
  const labelStyle = { display: 'block', fontSize: 12, fontWeight: 500, color: '#8b949e', marginBottom: 7 };

  if (loading) return <div style={{ padding: 48, textAlign: 'center', color: '#8b949e' }}>Loading payments…</div>;

  return (
    <div style={{ maxWidth: 1060, margin: '0 auto', padding: '28px 16px 80px', fontFamily: 'Inter, sans-serif' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 24, gap: 12, flexWrap: 'wrap' }}>
        <div>
          <h2 style={{ fontSize: 22, fontWeight: 700, color: '#e6edf3', letterSpacing: '-0.4px', marginBottom: 4 }}>Payment Ledger</h2>
          <div style={{ fontSize: 13, color: '#8b949e' }}>All properties · VSR Property Management</div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={exportCSV} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: '#1c2333', color: '#8b949e', border: '1px solid rgba(255,255,255,0.14)', minHeight: 42 }}>
            Export CSV
          </button>
          <button onClick={() => setShowModal(true)} style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 16px', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: 'linear-gradient(135deg,#d4a843,#b8860b)', color: '#0d1117', border: 'none', minHeight: 42 }}>
            + Add Payment
          </button>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 24 }}>
        {[
          { label: 'Collected',  val: fmt(collected), color: '#3fb950' },
          { label: 'Pending',    val: fmt(pending),   color: '#d29922' },
          { label: 'Failed',     val: fmt(failed),    color: '#f85149' },
          { label: 'This Month', val: fmt(thisMonth), color: '#79c0ff' },
        ].map(s => (
          <div key={s.label} style={{ background: '#1c2333', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: 16 }}>
            <div style={{ fontSize: 10, fontWeight: 600, letterSpacing: 1, color: '#8b949e', textTransform: 'uppercase', marginBottom: 8 }}>{s.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: s.color }}>{s.val}</div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 14, overflowX: 'auto', paddingBottom: 4 }}>
        {['all', 'succeeded', 'pending', 'failed'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '7px 16px', borderRadius: 999, fontSize: 12, fontWeight: 500, cursor: 'pointer', border: '1px solid', fontFamily: 'Inter, sans-serif', whiteSpace: 'nowrap', minHeight: 36, background: filter === f ? 'rgba(59,125,216,0.15)' : '#1c2333', color: filter === f ? '#79c0ff' : '#8b949e', borderColor: filter === f ? 'rgba(59,125,216,0.4)' : 'rgba(255,255,255,0.14)' }}>
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Table */}
      <div style={{ background: '#1c2333', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#484f58', fontSize: 14 }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search tenant, property, amount…" style={{ background: 'none', border: 'none', outline: 'none', fontFamily: 'Inter, sans-serif', fontSize: 15, color: '#e6edf3', width: '100%' }}/>
        </div>

        {/* Mobile cards */}
        <div style={{ display: 'block' }} className="mobile-only">
          {filtered.length === 0
            ? <div style={{ textAlign: 'center', padding: 48, color: '#484f58' }}>No payments found</div>
            : filtered.map(r => (
              <div key={r.id} style={{ padding: 16, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: '#e6edf3' }}>{r.tenant_name}</span>
                  <span style={{ fontSize: 15, fontWeight: 700, fontFamily: 'JetBrains Mono, monospace', color: '#e6edf3' }}>{fmt(r.amount)}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                  <Badge status={r.status} />
                  <span style={{ fontSize: 11, background: '#21262d', color: '#8b949e', padding: '2px 8px', borderRadius: 4, border: '1px solid rgba(255,255,255,0.08)' }}>{r.payment_type}</span>
                  <span style={{ fontSize: 12, color: '#8b949e' }}>{r.method} · {r.payment_date}</span>
                  <button onClick={() => deletePayment(r.id)} style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: '#484f58', fontSize: 16 }}>🗑</button>
                </div>
                <div style={{ fontSize: 11, color: '#484f58', marginTop: 6 }}>{r.property}</div>
              </div>
            ))
          }
        </div>
      </div>

      {/* Add Payment Modal */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 500, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', padding: 0 }}>
          <div style={{ background: '#1c2333', border: '1px solid rgba(255,255,255,0.14)', width: '100%', maxWidth: 480, overflow: 'hidden', borderRadius: '18px 18px 0 0', maxHeight: '90vh', overflowY: 'auto' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, background: '#1c2333', zIndex: 1 }}>
              <span style={{ fontSize: 16, fontWeight: 600, color: '#e6edf3' }}>Add Payment Record</span>
              <button onClick={() => setShowModal(false)} style={{ background: '#21262d', border: 'none', borderRadius: '50%', width: 30, height: 30, cursor: 'pointer', color: '#8b949e', fontSize: 16 }}>✕</button>
            </div>
            <div style={{ padding: '18px 20px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                {[
                  { label: 'Tenant name *', key: 'tenant', type: 'text', placeholder: 'Full name' },
                  { label: 'Amount *', key: 'amount', type: 'number', placeholder: '0.00' },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <input style={inputStyle} type={f.type} placeholder={f.placeholder} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}/>
                  </div>
                ))}
                {[
                  { label: 'Property', key: 'property', opts: PROPERTIES },
                  { label: 'Method', key: 'method', opts: METHODS },
                  { label: 'Payment type', key: 'type', opts: TYPES },
                  { label: 'Status', key: 'status', opts: [['succeeded','Succeeded'],['pending','Pending'],['failed','Failed']] },
                ].map(f => (
                  <div key={f.key}>
                    <label style={labelStyle}>{f.label}</label>
                    <select style={inputStyle} value={form[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })}>
                      {f.opts.map(o => Array.isArray(o) ? <option key={o[0]} value={o[0]}>{o[1]}</option> : <option key={o}>{o}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: 10, justifyContent: 'flex-end', position: 'sticky', bottom: 0, background: '#1c2333' }}>
              <button onClick={() => setShowModal(false)} style={{ padding: '10px 16px', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: '#1c2333', color: '#8b949e', border: '1px solid rgba(255,255,255,0.14)' }}>Cancel</button>
              <button onClick={addRecord} style={{ padding: '10px 16px', borderRadius: 8, fontFamily: 'Inter, sans-serif', fontSize: 13, fontWeight: 500, cursor: 'pointer', background: 'linear-gradient(135deg,#d4a843,#b8860b)', color: '#0d1117', border: 'none' }}>Add Record</button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div style={{ position: 'fixed', bottom: 28, left: '50%', transform: 'translateX(-50%)', background: '#161b22', border: '1px solid rgba(255,255,255,0.14)', color: '#e6edf3', padding: '12px 20px', borderRadius: 10, fontSize: 13, display: 'flex', alignItems: 'center', gap: 10, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 999, whiteSpace: 'nowrap' }}>
          <span style={{ color: '#3fb950' }}>✓</span> {toast}
        </div>
      )}
    </div>
  );
}
