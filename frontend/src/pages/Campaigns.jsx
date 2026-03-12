import { useState, useRef } from 'react';
import { Plus, Trash2, Edit2, Send, Eye, Image, X } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Confirm, Empty } from '../components/UI';

let NEXT_ID = 4;
const INIT_CAMPAIGNS = [
]

function CampaignForm({ initial, contacts, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', subject: '', body: '', color: '#c2410c', image: null });
  const [imgPreview, setImgPreview] = useState(initial?.image || null);
  const [tab, setTab] = useState('content');
  const fileRef = useRef();
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 3 * 1024 * 1024) { toast.error('Image must be under 3MB'); return; }
    const reader = new FileReader();
    reader.onload = (ev) => { setImgPreview(ev.target.result); set('image', ev.target.result); };
    reader.readAsDataURL(file);
  };

  const removeImage = () => { setImgPreview(null); set('image', null); };

  const submit = () => {
    if (!form.name || !form.subject) return toast.error('Name and subject required');
    onSave(form);
  };

  return (
    <Modal title={initial ? 'Edit campaign' : 'New campaign'} onClose={onClose} size="modal-lg"
      footer={<><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={submit}>Save campaign</button></>}>

      <div className="tabs" style={{ marginBottom: 20 }}>
        {['content', 'design', 'preview'].map(t => (
          <button key={t} className={`tab-btn ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {tab === 'content' && (
        <>
          <div className="form-row">
            <div className="field"><label>Campaign name <span>*</span></label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. March Newsletter" /></div>
            <div className="field"><label>Subject line <span>*</span></label><input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Use {{name}} to personalise" /></div>
          </div>
          <div className="field">
            <label>Email body</label>
            <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={8} placeholder="Write your email here. Use {{name}} for personalisation." />
            <div className="field-hint">Variables: {'{{name}}'}, {'{{email}}'}</div>
          </div>
        </>
      )}

      {tab === 'design' && (
        <>
          <div className="field">
            <label>Header image</label>
            <div
              className={`img-drop ${imgPreview ? 'has-img' : ''}`}
              onClick={() => !imgPreview && fileRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={e => { e.preventDefault(); const f = e.dataTransfer.files[0]; if (f) { const inp = { files: [f] }; handleImage({ target: inp }); } }}
            >
              {imgPreview ? (
                <div style={{ position: 'relative' }}>
                  <img src={imgPreview} alt="Header" />
                  <button onClick={(e) => { e.stopPropagation(); removeImage(); }}
                    style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '50%', width: 28, height: 28, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <X size={14} color="#fff" />
                  </button>
                </div>
              ) : (
                <div>
                  <Image size={28} style={{ color: 'var(--ink4)', marginBottom: 8 }} />
                  <div style={{ fontSize: '0.85rem', color: 'var(--ink3)' }}>Click or drag image here</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--ink4)', marginTop: 4 }}>PNG, JPG up to 3MB</div>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={handleImage} />
          </div>

          <div className="field">
            <label>Brand colour</label>
            <div className="color-row">
              <input type="color" value={form.color} onChange={e => set('color', e.target.value)} style={{ width: 40, height: 36, padding: 2, cursor: 'pointer', borderRadius: 6 }} />
              <input value={form.color} onChange={e => set('color', e.target.value)} style={{ width: 120 }} placeholder="#c2410c" />
              <div style={{ display: 'flex', gap: 6 }}>
                {['#c2410c', '#1d4ed8', '#4a7c59', '#7c3aed', '#1c1917'].map(col => (
                  <div key={col} className="color-swatch" style={{ background: col, borderColor: form.color === col ? col : 'var(--border2)' }} onClick={() => set('color', col)} />
                ))}
              </div>
            </div>
          </div>
        </>
      )}

      {tab === 'preview' && (
        <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
          {imgPreview && <img src={imgPreview} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block', borderBottom: `4px solid ${form.color}` }} />}
          {!imgPreview && <div style={{ height: 8, background: form.color }} />}
          <div style={{ padding: '24px 28px', background: '#fff' }}>
            <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.4rem', color: 'var(--ink)', marginBottom: 4 }}>{form.subject || 'No subject set'}</h2>
            <div style={{ fontSize: '0.85rem', color: 'var(--ink3)', marginBottom: 16 }}>Campaign: {form.name || 'Untitled'}</div>
            <div style={{ fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: form.body || '<em>No content yet</em>' }} />
          </div>
          <div style={{ padding: '12px 28px', background: 'var(--cream2)', fontSize: '0.75rem', color: 'var(--ink4)' }}>
            Sent by MailFlow · Unsubscribe
          </div>
        </div>
      )}
    </Modal>
  );
}

export default function Campaigns() {
  const [campaigns, setCampaigns] = useState(INIT_CAMPAIGNS);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all' ? campaigns : campaigns.filter(c => c.status === filter);

  const saveCampaign = (form) => {
    if (editItem) {
      setCampaigns(p => p.map(c => c.id === editItem.id ? { ...c, ...form } : c));
      toast.success('Campaign updated');
      setEditItem(null);
    } else {
      setCampaigns(p => [...p, { ...form, id: NEXT_ID++, status: 'draft', recipients: 0, date: new Date().toISOString().slice(0, 10) }]);
      toast.success('Campaign created');
    }
    setShowForm(false);
  };

  const sendCampaign = (id) => {
    setCampaigns(p => p.map(c => c.id === id ? { ...c, status: 'sent', recipients: Math.floor(Math.random() * 100) + 50 } : c));
    toast.success('Campaign sent!');
  };

  const deleteCampaign = () => {
    setCampaigns(p => p.filter(c => c.id !== deleteId));
    toast.success('Deleted');
    setDeleteId(null);
  };

  const statusBadge = (s) => {
    const map = { sent: 'badge-green', draft: 'badge-gray', scheduled: 'badge-orange' };
    return <span className={`badge ${map[s] || 'badge-gray'}`}>{s}</span>;
  };

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Campaigns</div>
          <div className="topbar-sub">{campaigns.length} campaigns total</div>
        </div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus size={14} /> New campaign</button>
        </div>
      </div>

      <div className="page">
        <div className="filter-bar">
          {['all', 'draft', 'scheduled', 'sent'].map(f => (
            <button key={f} className={`btn ${filter === f ? 'btn-primary' : 'btn-outline'} btn-sm`} onClick={() => setFilter(f)} style={{ textTransform: 'capitalize' }}>
              {f}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Subject</th>
                  <th>Status</th>
                  <th>Recipients</th>
                  <th>Date</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={6}><Empty title="No campaigns here" desc="Create your first campaign to get started" /></td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <div style={{ width: 8, height: 32, borderRadius: 4, background: c.color || 'var(--rust)', flexShrink: 0 }} />
                        <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--ink3)', maxWidth: 240, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.subject}</td>
                    <td>{statusBadge(c.status)}</td>
                    <td>{c.recipients || '—'}</td>
                    <td style={{ color: 'var(--ink4)', fontSize: '0.82rem' }}>{c.date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setPreviewItem(c)} title="Preview"><Eye size={13} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditItem(c); setShowForm(true); }} title="Edit"><Edit2 size={13} /></button>
                        {c.status === 'draft' && (
                          <button className="btn btn-ghost btn-sm" onClick={() => sendCampaign(c.id)} title="Send" style={{ color: 'var(--sage)' }}><Send size={13} /></button>
                        )}
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(c.id)} title="Delete" style={{ color: 'var(--red)' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && <CampaignForm initial={editItem} onSave={saveCampaign} onClose={() => { setShowForm(false); setEditItem(null); }} />}

      {previewItem && (
        <Modal title="Campaign preview" onClose={() => setPreviewItem(null)} size="modal-lg"
          footer={<button className="btn btn-outline" onClick={() => setPreviewItem(null)}>Close</button>}>
          <div style={{ border: '1px solid var(--border)', borderRadius: 8, overflow: 'hidden' }}>
            {previewItem.image && <img src={previewItem.image} alt="" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', display: 'block', borderBottom: `4px solid ${previewItem.color}` }} />}
            {!previewItem.image && <div style={{ height: 6, background: previewItem.color || 'var(--rust)' }} />}
            <div style={{ padding: '24px', background: '#fff' }}>
              <h2 style={{ fontFamily: 'var(--font-head)', fontSize: '1.3rem', marginBottom: 12 }}>{previewItem.subject}</h2>
              <div style={{ fontSize: '0.9rem', color: 'var(--ink2)', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: previewItem.body }} />
            </div>
          </div>
        </Modal>
      )}

      {deleteId && <Confirm message="Delete this campaign? This cannot be undone." onConfirm={deleteCampaign} onCancel={() => setDeleteId(null)} />}
    </>
  );
}
