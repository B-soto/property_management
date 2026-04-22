// src/components/PaymentLayout.jsx
// Drop into: frontend/src/components/PaymentLayout.jsx
// Add route in App.jsx:  <Route path="/payments" element={<PaymentLayout />} />

import React, { useState } from 'react';
import PaymentPortal from './PaymentPortal';
import PaymentLedger from './PaymentLedger';

const MANAGER_USER = 'vsrshitnocap';
const MANAGER_PASS = 'cardan0!';

const styles = {
  topbar: {
    background: '#161b22',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    padding: '0 28px',
    display: 'flex',
    alignItems: 'center',
    height: 56,
    position: 'sticky',
    top: 0,
    zIndex: 200,
    gap: 16,
  },
  logo: { display: 'flex', alignItems: 'center', gap: 10, flex: 1 },
  logoMark: {
    width: 34, height: 34, borderRadius: 9,
    background: 'linear-gradient(135deg,#d4a843,#b8860b)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 15, fontWeight: 700, color: '#0d1117', flexShrink: 0,
  },
  logoName: { fontSize: 14, fontWeight: 600, color: '#e6edf3' },
  logoSub: { fontSize: 10, color: '#8b949e', letterSpacing: '0.5px' },
  viewTabs: {
    display: 'flex', gap: 2,
    background: '#21262d', borderRadius: 8, padding: 3,
  },
  tab: (active) => ({
    padding: '7px 18px', borderRadius: 6, fontSize: 13, fontWeight: 500,
    cursor: 'pointer', border: 'none', fontFamily: 'Inter, sans-serif',
    background: active ? '#161b22' : 'none',
    color: active ? '#e6edf3' : '#8b949e',
    boxShadow: active ? '0 1px 4px rgba(0,0,0,0.4)' : 'none',
    transition: 'all 0.2s',
  }),
  loginOverlay: {
    position: 'fixed',
    top: 56, left: 0, right: 0, bottom: 0,
    background: '#0d1117',
    zIndex: 150,
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    padding: 24,
  },
  loginCard: {
    background: '#1c2333',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 18, width: '100%', maxWidth: 360, overflow: 'hidden',
  },
  loginHeader: {
    background: 'linear-gradient(135deg,#1a1f2e,#0d1117)',
    padding: '28px 24px 20px', textAlign: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
  },
  loginLogoMark: {
    width: 52, height: 52, borderRadius: 14,
    background: 'linear-gradient(135deg,#d4a843,#b8860b)',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: 22, fontWeight: 700, color: '#0d1117',
    margin: '0 auto 14px',
  },
  loginBody: { padding: '22px 24px' },
  loginFooter: { padding: '0 24px 22px' },
  fieldLabel: {
    display: 'block', fontSize: 12, fontWeight: 500,
    color: '#8b949e', marginBottom: 7,
  },
  fieldInput: {
    width: '100%', background: '#21262d',
    border: '1px solid rgba(255,255,255,0.14)',
    borderRadius: 8, padding: '12px 14px',
    fontFamily: 'Inter, sans-serif', fontSize: 16, color: '#e6edf3',
    outline: 'none', marginBottom: 12, boxSizing: 'border-box',
    WebkitAppearance: 'none',
  },
  loginBtn: {
    width: '100%', padding: 14, border: 'none', borderRadius: 10,
    background: 'linear-gradient(135deg,#d4a843,#b8860b)',
    color: '#0d1117', fontFamily: 'Inter, sans-serif',
    fontSize: 15, fontWeight: 700, cursor: 'pointer',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    minHeight: 50,
  },
  cancelBtn: {
    width: '100%', marginTop: 10, background: 'none', border: 'none',
    color: '#8b949e', fontFamily: 'Inter, sans-serif',
    fontSize: 13, cursor: 'pointer', padding: 10, minHeight: 44,
  },
  errorBox: {
    background: 'rgba(248,81,73,0.12)',
    border: '1px solid rgba(248,81,73,0.3)',
    borderRadius: 8, padding: '10px 14px',
    fontSize: 13, color: '#ff7b72', marginBottom: 14,
  },
};

export default function PaymentLayout() {
  const [view, setView] = useState('tenant');
  const [authed, setAuthed] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [loading, setLoading] = useState(false);

  function handleTabClick(v) {
    if (v === 'manager' && !authed) {
      setView('manager');
      setShowLogin(true);
      return;
    }
    setShowLogin(false);
    setView(v);
  }

  function handleLogin() {
    setLoading(true);
    setLoginError('');
    setTimeout(() => {
      if (username === MANAGER_USER && password === MANAGER_PASS) {
        setAuthed(true);
        setShowLogin(false);
        setView('manager');
        setPassword('');
        setUsername('');
      } else {
        setLoginError('Incorrect username or password.');
        setPassword('');
      }
      setLoading(false);
    }, 900);
  }

  function handleCancel() {
    setShowLogin(false);
    setView('tenant');
    setLoginError('');
    setUsername('');
    setPassword('');
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0d1117', fontFamily: 'Inter, sans-serif' }}>

      {/* Topbar */}
      <div style={styles.topbar}>
        <div style={styles.logo}>
          <div style={styles.logoMark}>V</div>
          <div>
            <div style={styles.logoName}>VSR Property Management</div>
            <div style={styles.logoSub}>PAYMENT PORTAL</div>
          </div>
        </div>
        <div style={styles.viewTabs}>
          <button style={styles.tab(view === 'tenant')} onClick={() => handleTabClick('tenant')}>
            Resident
          </button>
          <button style={styles.tab(view === 'manager')} onClick={() => handleTabClick('manager')}>
            Manager
          </button>
        </div>
      </div>

      {/* Login Gate — sits below topbar */}
      {showLogin && (
        <div style={styles.loginOverlay}>
          <div style={styles.loginCard}>
            <div style={styles.loginHeader}>
              <div style={styles.loginLogoMark}>V</div>
              <div style={{ fontSize: 17, fontWeight: 700, color: '#e6edf3', marginBottom: 4 }}>
                Manager Access
              </div>
              <div style={{ fontSize: 12, color: '#8b949e' }}>
                VSR Property Management · Staff Only
              </div>
            </div>
            <div style={styles.loginBody}>
              {loginError && <div style={styles.errorBox}>{loginError}</div>}
              <div>
                <label style={styles.fieldLabel}>Username</label>
                <input
                  style={styles.fieldInput}
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  autoCapitalize="none"
                  spellCheck={false}
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label style={styles.fieldLabel}>Password</label>
                <input
                  style={styles.fieldInput}
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="Enter password"
                  onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
              </div>
            </div>
            <div style={styles.loginFooter}>
              <button style={styles.loginBtn} onClick={handleLogin} disabled={loading}>
                {loading ? 'Verifying…' : 'Sign In'}
              </button>
              <button style={styles.cancelBtn} onClick={handleCancel}>
                Cancel — go back to Resident portal
              </button>
              <div style={{ textAlign: 'center', fontSize: 11, color: '#484f58', marginTop: 8 }}>
                Authorized personnel only
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      {!showLogin && view === 'tenant' && <PaymentPortal />}
      {!showLogin && view === 'manager' && <PaymentLedger />}

    </div>
  );
}
