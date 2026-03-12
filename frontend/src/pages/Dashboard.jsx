import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Send, Megaphone, TrendingUp } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Spinner } from '../components/UI';

// Mock data - can be replaced with real API
const MOCK_STATS = { contacts: 0, campaigns: 0,  sent: 0, openRate: 0 };
const MOCK_RECENT = [

];

export default function Dashboard() {
  const { user, can } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  }, []);

  if (loading) return <><div className="topbar"><div className="topbar-title">Dashboard</div></div><Spinner /></>;

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Dashboard</div>
          <div className="topbar-sub">Good to have you back, {user.name.split(' ')[0]}</div>
        </div>
        <div className="topbar-actions">
          <Link to="/compose" className="btn btn-primary btn-sm"><Send size={14} /> Compose</Link>
        </div>
      </div>

      <div className="page">
        <div className="stats-row">
          {[
            { label: 'Total contacts', val: MOCK_STATS.contacts, icon: Users, color: 'var(--rust)' },
            { label: 'Campaigns run', val: MOCK_STATS.campaigns, icon: Megaphone, color: 'var(--sage)' },
            { label: 'Emails sent', val: MOCK_STATS.sent.toLocaleString(), icon: Send, color: 'var(--blue)' },
            { label: 'Avg open rate', val: `${MOCK_STATS.openRate}%`, icon: TrendingUp, color: '#7c3aed' },
          ].map(s => (
            <div key={s.label} className="stat">
              <div className="stat-label">{s.label}</div>
              <div className="stat-val" style={{ color: s.color }}>{s.val}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 16 }}>
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontFamily: 'var(--font-head)', fontSize: '1rem' }}>Recent campaigns</h3>
              <Link to="/campaigns" className="btn btn-ghost btn-sm">View all</Link>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Recipients</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_RECENT.map(r => (
                  <tr key={r.id}>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{r.subject}</td>
                    <td>{r.recipients}</td>
                    <td style={{ color: 'var(--ink3)' }}>{r.date}</td>
                    <td><span className="badge badge-green">{r.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card card-sm">
              <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginBottom: 8, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick actions</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <Link to="/contacts" className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>Manage contacts</Link>
                <Link to="/campaigns" className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>New campaign</Link>
                {can(['admin', 'superadmin']) && (
                  <Link to="/settings" className="btn btn-outline btn-sm" style={{ justifyContent: 'center' }}>Settings</Link>
                )}
              </div>
            </div>

            <div className="card card-sm">
              <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginBottom: 10, fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Delivery health</div>
              {[
                { label: 'Delivered', pct: 0 },
                { label: 'Opened', pct: 0 },
                { label: 'Clicked', pct: 0 },
              ].map(m => (
                <div key={m.label} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', marginBottom: 4 }}>
                    <span style={{ color: 'var(--ink2)' }}>{m.label}</span>
                    <span style={{ fontWeight: 600 }}>{m.pct}%</span>
                  </div>
                  <div className="progress-bar"><div className="progress-fill" style={{ width: `${m.pct}%` }} /></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
