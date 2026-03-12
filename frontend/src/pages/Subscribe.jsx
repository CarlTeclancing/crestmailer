import { useState } from 'react';
import { contactsApi } from '../utils/api';

export default function Subscribe() {
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [status, setStatus] = useState('idle'); // idle, loading, success, error
  const [error, setError] = useState('');

  const update = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;
    setStatus('loading');
    try {
      await contactsApi.create(form);
      setStatus('success');
    } catch (err) {
      setError(err.message);
      setStatus('error');
    }
  };

  const inputStyle = {
    width: '100%',
    padding: '11px 14px',
    background: '#fff',
    border: '1.5px solid #e2e8f0',
    borderRadius: 10,
    color: '#1a202c',
    fontSize: '0.95rem',
    outline: 'none',
    fontFamily: 'inherit',
    boxSizing: 'border-box',
    transition: 'border-color 0.2s, box-shadow 0.2s',
  };

  const labelStyle = {
    display: 'block',
    fontSize: '0.8rem',
    fontWeight: 600,
    color: '#64748b',
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        .sub-wrap * { font-family: 'Plus Jakarta Sans', sans-serif; box-sizing: border-box; }
        .sub-input:focus { border-color: #6366f1 !important; box-shadow: 0 0 0 3px rgba(99,102,241,0.12) !important; }
        .sub-btn:hover:not(:disabled) { background: #4f46e5 !important; transform: translateY(-1px); box-shadow: 0 8px 24px rgba(99,102,241,0.35) !important; }
        .sub-btn:disabled { opacity: 0.7; cursor: not-allowed; }
        .sub-card { animation: fadeUp 0.4s ease both; }
        .sub-field { animation: fadeUp 0.4s ease both; }
        .sub-field:nth-child(1) { animation-delay: 0.08s; }
        .sub-field:nth-child(2) { animation-delay: 0.16s; }
        .sub-field:nth-child(3) { animation-delay: 0.24s; }
        .sub-field:nth-child(4) { animation-delay: 0.32s; }
        @keyframes fadeUp { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
        .sub-back-btn:hover { border-color: #6366f1 !important; color: #6366f1 !important; }
      `}</style>

      <div className="sub-wrap" style={{
        minHeight: '100vh',
        background: 'linear-gradient(150deg, #eef2ff 0%, #fafafa 45%, #fdf4ff 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        position: 'relative',
        overflow: 'hidden',
      }}>

        {/* Background shapes */}
        <div style={{ position: 'absolute', width: 560, height: 560, borderRadius: '50%', background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 65%)', top: '-180px', right: '-80px', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(168,85,247,0.07) 0%, transparent 65%)', bottom: '-120px', left: '-60px', pointerEvents: 'none' }} />

        <div className="sub-card" style={{
          width: '100%',
          maxWidth: 420,
          background: '#ffffff',
          borderRadius: 20,
          padding: '40px 36px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.04), 0 16px 48px rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.1)',
          position: 'relative',
          zIndex: 1,
        }}>

          {status === 'success' ? (
            <div style={{ textAlign: 'center', padding: '12px 0' }}>
              <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '1.8rem', color: '#fff' }}>✓</div>
              <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#1a202c', marginBottom: 10 }}>You're subscribed!</h2>
              <p style={{ color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem' }}>
                Welcome, <strong style={{ color: '#6366f1' }}>{form.name}</strong>!<br />
                You'll receive our latest updates in your inbox.
              </p>
              <button
                className="sub-back-btn"
                onClick={() => { setStatus('idle'); setForm({ name: '', email: '', phone: '' }); }}
                style={{ marginTop: 24, padding: '10px 22px', background: 'transparent', border: '1.5px solid #e2e8f0', borderRadius: 8, color: '#64748b', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600, transition: 'all 0.2s' }}
              >
                Subscribe another →
              </button>
            </div>
          ) : (
            <>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 52, height: 52, borderRadius: 14, background: 'linear-gradient(135deg, #6366f1, #a855f7)', marginBottom: 16, fontSize: '1.4rem' }}>✉️</div>
                <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#1a202c', marginBottom: 8, lineHeight: 1.2 }}>Stay in the Loop</h1>
                <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6 }}>
                  Subscribe for updates, news, and exclusive content.
                </p>
              </div>

              <form onSubmit={handleSubmit}>
                <div className="sub-field" style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Full Name <span style={{ color: '#6366f1' }}>*</span></label>
                  <input
                    className="sub-input"
                    required
                    value={form.name}
                    onChange={e => update('name', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div className="sub-field" style={{ marginBottom: 14 }}>
                  <label style={labelStyle}>Email Address <span style={{ color: '#6366f1' }}>*</span></label>
                  <input
                    className="sub-input"
                    required
                    type="email"
                    value={form.email}
                    onChange={e => update('email', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                <div className="sub-field" style={{ marginBottom: 22 }}>
                  <label style={labelStyle}>
                    Phone Number{' '}
                    <span style={{ color: '#94a3b8', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}></span>
                  </label>
                  <input
                    className="sub-input"
                    type="tel"
                    value={form.phone}
                    onChange={e => update('phone', e.target.value)}
                    style={inputStyle}
                  />
                </div>

                {status === 'error' && (
                  <div style={{ padding: '10px 14px', background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 8, color: '#dc2626', fontSize: '0.85rem', marginBottom: 14 }}>
                    {error}
                  </div>
                )}

                <div className="sub-field">
                  <button
                    className="sub-btn"
                    type="submit"
                    disabled={status === 'loading'}
                    style={{
                      width: '100%',
                      padding: '13px',
                      borderRadius: 10,
                      border: 'none',
                      cursor: 'pointer',
                      background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                      color: '#fff',
                      fontSize: '0.95rem',
                      fontWeight: 700,
                      transition: 'all 0.2s',
                      boxShadow: '0 4px 16px rgba(99,102,241,0.3)',
                      letterSpacing: '0.01em',
                    }}
                  >
                    {status === 'loading' ? 'Subscribing...' : 'Subscribe Now →'}
                  </button>
                </div>
              </form>

              <p style={{ textAlign: 'center', fontSize: '0.78rem', color: '#94a3b8', marginTop: 18, lineHeight: 1.5 }}>
                🔒 We respect your privacy. Unsubscribe at any time.
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
