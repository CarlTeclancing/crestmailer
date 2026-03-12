import { useState } from 'react';
import { Send, Users, X } from 'lucide-react';
import toast from 'react-hot-toast';

//constant contact can be inserted here
const CONTACTS = [
  
];

export default function Compose() {
  const [recipientType, setRecipientType] = useState('all');
  const [selected, setSelected] = useState([]);
  const [customEmail, setCustomEmail] = useState('');
  const [customList, setCustomList] = useState([]);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [contactSearch, setContactSearch] = useState('');

  const toggleContact = (c) => setSelected(p => p.find(x => x.id === c.id) ? p.filter(x => x.id !== c.id) : [...p, c]);

  const addCustom = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      const email = customEmail.trim().replace(/,$/, '');
      if (email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && !customList.includes(email)) {
        setCustomList(p => [...p, email]);
        setCustomEmail('');
      }
    }
  };

  const recipientCount = recipientType === 'all' ? CONTACTS.length : recipientType === 'select' ? selected.length : customList.length;

  const handleSend = async () => {
    if (!subject.trim()) return toast.error('Subject is required');
    if (!body.trim()) return toast.error('Email body is required');
    if (recipientType === 'select' && selected.length === 0) return toast.error('Select at least one contact');
    if (recipientType === 'custom' && customList.length === 0) return toast.error('Add at least one email');

    setSending(true);
    await new Promise(r => setTimeout(r, 1400));
    setSending(false);
    setSent(true);
    toast.success(`Email sent to ${recipientCount} recipient(s)!`);
  };

  const reset = () => { setSubject(''); setBody(''); setSelected([]); setCustomList([]); setSent(false); };

  const filteredContacts = CONTACTS.filter(c =>
    c.name.toLowerCase().includes(contactSearch.toLowerCase()) || c.email.toLowerCase().includes(contactSearch.toLowerCase())
  );

  if (sent) return (
    <>
      <div className="topbar"><div className="topbar-title">Compose</div></div>
      <div className="page" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <div style={{ textAlign: 'center', maxWidth: 380 }}>
          <div style={{ fontSize: '3rem', marginBottom: 16 }}>✉️</div>
          <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.5rem', marginBottom: 10 }}>Email sent!</h2>
          <p style={{ color: 'var(--ink3)', marginBottom: 24 }}>Your email was sent to {recipientCount} recipient(s). Check the mail logs to see delivery status.</p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center' }}>
            <button className="btn btn-outline" onClick={reset}>Compose another</button>
          </div>
        </div>
      </div>
    </>
  );

  return (
    <>
      <div className="topbar">
        <div><div className="topbar-title">Compose</div><div className="topbar-sub">Send an email to your contacts</div></div>
        <div className="topbar-actions">
          <button className="btn btn-primary" onClick={handleSend} disabled={sending}>
            <Send size={14} /> {sending ? 'Sending...' : 'Send email'}
          </button>
        </div>
      </div>

      <div className="page">
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 18, alignItems: 'start' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div className="card">
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Subject <span style={{ color: 'var(--rust)' }}>*</span></label>
                <input value={subject} onChange={e => setSubject(e.target.value)} placeholder="Your email subject — use {{name}} to personalise" />
              </div>
            </div>
            <div className="card">
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Body <span style={{ color: 'var(--rust)' }}>*</span></label>
                <textarea value={body} onChange={e => setBody(e.target.value)} rows={14} placeholder="Write your email content here...&#10;&#10;Use {{name}} to include the recipient's name." />
                <div className="field-hint">Tip: Use {'{{name}}'} and {'{{email}}'} for personalisation</div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--ink3)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              <Users size={13} style={{ marginRight: 5, verticalAlign: 'middle' }} />Recipients
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 16 }}>
              {[['all', 'All subscribers'], ['select', 'Pick contacts'], ['custom', 'Custom emails']].map(([val, label]) => (
                <label key={val} style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', padding: '7px 10px', borderRadius: 6, background: recipientType === val ? 'var(--rust-light)' : 'transparent', border: `1px solid ${recipientType === val ? 'var(--rust-mid)' : 'transparent'}` }}>
                  <input type="radio" name="rt" value={val} checked={recipientType === val} onChange={() => setRecipientType(val)} style={{ accentColor: 'var(--rust)' }} />
                  <span style={{ fontSize: '0.85rem', color: recipientType === val ? 'var(--rust)' : 'var(--ink2)', fontWeight: recipientType === val ? 600 : 400 }}>{label}</span>
                </label>
              ))}
            </div>

            {recipientType === 'all' && (
              <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 12px', fontSize: '0.85rem', color: 'var(--ink3)' }}>
                <strong style={{ color: 'var(--ink)', display: 'block' }}>{CONTACTS.length} contacts</strong>
                All subscribed contacts will receive this email
              </div>
            )}

            {recipientType === 'select' && (
              <div>
                <input value={contactSearch} onChange={e => setContactSearch(e.target.value)} placeholder="Search..." style={{ marginBottom: 8, fontSize: '0.82rem' }} />
                <div style={{ border: '1px solid var(--border)', borderRadius: 6, overflow: 'hidden', maxHeight: 220, overflowY: 'auto' }}>
                  {filteredContacts.map(c => (
                    <label key={c.id} style={{ display: 'flex', alignItems: 'center', gap: 9, padding: '8px 12px', cursor: 'pointer', borderBottom: '1px solid var(--border)', background: selected.find(x => x.id === c.id) ? 'var(--rust-light)' : '#fff' }}>
                      <input type="checkbox" checked={!!selected.find(x => x.id === c.id)} onChange={() => toggleContact(c)} style={{ accentColor: 'var(--rust)' }} />
                      <div>
                        <div style={{ fontSize: '0.83rem', fontWeight: 500 }}>{c.name}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--ink4)' }}>{c.email}</div>
                      </div>
                    </label>
                  ))}
                </div>
                {selected.length > 0 && <div style={{ fontSize: '0.78rem', color: 'var(--rust)', marginTop: 6 }}>{selected.length} selected</div>}
              </div>
            )}

            {recipientType === 'custom' && (
              <div>
                <div style={{ border: '1px solid var(--border2)', borderRadius: 6, padding: '6px 8px', minHeight: 48, display: 'flex', flexWrap: 'wrap', gap: 5, cursor: 'text', background: '#fff' }} onClick={() => document.getElementById('custominput').focus()}>
                  {customList.map(e => (
                    <span key={e} className="tag">{e}<button type="button" onClick={() => setCustomList(p => p.filter(x => x !== e))}>×</button></span>
                  ))}
                  <input id="custominput" value={customEmail} onChange={e => setCustomEmail(e.target.value)} onKeyDown={addCustom} placeholder={customList.length ? '' : 'Type email, press Enter'} style={{ border: 'none', outline: 'none', fontSize: '0.82rem', flex: 1, minWidth: 120, padding: '2px 4px' }} />
                </div>
                <div className="field-hint">Press Enter or comma to add</div>
              </div>
            )}

            <div style={{ marginTop: 14, padding: '10px 12px', background: 'var(--cream)', borderRadius: 6, border: '1px solid var(--border)', fontSize: '0.83rem' }}>
              <strong>{recipientCount}</strong> <span style={{ color: 'var(--ink3)' }}>recipient(s)</span>
            </div>

            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: 12 }} onClick={handleSend} disabled={sending}>
              <Send size={14} /> {sending ? 'Sending...' : 'Send now'}
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
