import { useState } from 'react';
import { Save } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const { can } = useAuth();
  const [tab, setTab] = useState('general');
  const [saving, setSaving] = useState(false);

  const [general, setGeneral] = useState({ app_name: 'MailFlow', from_name: 'MailFlow Team', from_email: 'noreply@mailflow.com', reply_to: '' });
  const [smtp, setSmtp] = useState({ host: 'smtp.mailtrap.io', port: '587', user: '', pass: '', encryption: 'tls' });
  const [branding, setBranding] = useState({ primary_color: '#c2410c', footer_text: 'You are receiving this because you subscribed.', logo_url: '' });

  const save = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 700));
    setSaving(false);
    toast.success('Settings saved');
  };

  const setG = (k, v) => setGeneral(p => ({ ...p, [k]: v }));
  const setS = (k, v) => setSmtp(p => ({ ...p, [k]: v }));
  const setB = (k, v) => setBranding(p => ({ ...p, [k]: v }));

  return (
    <>
      <div className="topbar">
        <div><div className="topbar-title">Settings</div></div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>

      <div className="page" style={{ maxWidth: 680 }}>
        <div className="tabs">
          {[['general', 'General'], ['smtp', 'Email / SMTP'], ['branding', 'Branding']].map(([id, label]) => (
            <button key={id} className={`tab-btn ${tab === id ? 'active' : ''}`} onClick={() => setTab(id)}>{label}</button>
          ))}
        </div>

        {tab === 'general' && (
          <div className="card">
            <div className="form-row">
              <div className="field"><label>App name</label><input value={general.app_name} onChange={e => setG('app_name', e.target.value)} /></div>
              <div className="field"><label>From name</label><input value={general.from_name} onChange={e => setG('from_name', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="field"><label>From email</label><input type="email" value={general.from_email} onChange={e => setG('from_email', e.target.value)} /></div>
              <div className="field"><label>Reply-to email</label><input type="email" value={general.reply_to} onChange={e => setG('reply_to', e.target.value)}  /></div>
            </div>
          </div>
        )}

        {tab === 'smtp' && (
          <div className="card">
            <div style={{ background: 'var(--rust-light)', border: '1px solid var(--rust-mid)', borderRadius: 6, padding: '10px 14px', marginBottom: 18, fontSize: '0.82rem', color: 'var(--rust)' }}>
              SMTP credentials are used to send emails. Use Mailtrap for testing.
            </div>
            <div className="form-row">
              <div className="field"><label>SMTP host</label><input value={smtp.host} onChange={e => setS('host', e.target.value)} placeholder="smtp.gmail.com" /></div>
              <div className="field"><label>Port</label><input value={smtp.port} onChange={e => setS('port', e.target.value)} /></div>
            </div>
            <div className="form-row">
              <div className="field"><label>Username</label><input value={smtp.user} onChange={e => setS('user', e.target.value)} /></div>
              <div className="field"><label>Password</label><input type="password" value={smtp.pass} onChange={e => setS('pass', e.target.value)} /></div>
            </div>
            <div className="field" style={{ maxWidth: 200 }}>
              <label>Encryption</label>
              <select value={smtp.encryption} onChange={e => setS('encryption', e.target.value)}>
                <option value="tls">TLS</option>
                <option value="ssl">SSL</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
        )}

        {tab === 'branding' && (
          <div className="card">
            <div className="field">
              <label>Primary / brand colour</label>
              <div className="color-row">
                <input type="color" value={branding.primary_color} onChange={e => setB('primary_color', e.target.value)} style={{ width: 40, height: 36, padding: 2, cursor: 'pointer', borderRadius: 6, border: '1px solid var(--border2)' }} />
                <input value={branding.primary_color} onChange={e => setB('primary_color', e.target.value)} style={{ width: 130 }} />
              </div>
            </div>
            <div className="field">
              <label>Logo URL</label>
              <input value={branding.logo_url} onChange={e => setB('logo_url', e.target.value)} placeholder="https://yoursite.com/logo.png" />
              <div className="field-hint">Used in email headers. Leave blank to show app name instead.</div>
            </div>
            <div className="field">
              <label>Email footer text</label>
              <textarea value={branding.footer_text} onChange={e => setB('footer_text', e.target.value)} rows={3} />
            </div>
            <div style={{ marginTop: 16, border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden' }}>
              <div style={{ height: 6, background: branding.primary_color }} />
              <div style={{ padding: '16px 20px', background: '#fff', fontSize: '0.85rem' }}>
                <strong>Email preview with your branding</strong><br />
                <span style={{ color: 'var(--ink3)', fontSize: '0.8rem' }}>This is how the header colour will appear in emails.</span>
              </div>
              <div style={{ padding: '8px 20px', background: 'var(--cream)', fontSize: '0.75rem', color: 'var(--ink4)' }}>{branding.footer_text}</div>
            </div>
          </div>
        )}

        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
          <button className="btn btn-primary" onClick={save} disabled={saving}><Save size={14} /> {saving ? 'Saving...' : 'Save changes'}</button>
        </div>
      </div>
    </>
  );
}
