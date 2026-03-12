import { useState } from 'react';
import { Plus, Trash2, Edit2, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Confirm, Empty } from '../components/UI';

let NEXT_ID = 4;
const INIT = [
  { id: 1, name: 'Welcome email', subject: 'Welcome to {{app_name}}, {{name}}!', body: '<p>Hi {{name}},</p><p>Welcome! We\'re so glad you\'re here.</p>' },
  { id: 2, name: 'Monthly newsletter', subject: 'Your monthly update from us 📬', body: '<p>Hi {{name}},</p><p>Here\'s what happened this month...</p>' },
  { id: 3, name: 'Re-engagement', subject: 'We miss you, {{name}}', body: '<p>Hi {{name}},</p><p>It\'s been a while! Come back and see what\'s new.</p>' },
];

function TemplateForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', subject: '', body: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name || !form.subject || !form.body) return toast.error('All fields required');
    onSave(form);
  };

  return (
    <Modal title={initial ? 'Edit template' : 'New template'} onClose={onClose}
      footer={<><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={submit}>Save</button></>}>
      <div className="field"><label>Template name <span>*</span></label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="e.g. Welcome email" /></div>
      <div className="field"><label>Subject line <span>*</span></label><input value={form.subject} onChange={e => set('subject', e.target.value)} placeholder="Use {{name}} to personalise" /></div>
      <div className="field">
        <label>Body <span>*</span></label>
        <textarea value={form.body} onChange={e => set('body', e.target.value)} rows={8} placeholder="Email body HTML..." />
        <div className="field-hint">Variables: {'{{name}}'}, {'{{email}}'}, {'{{app_name}}'}</div>
      </div>
    </Modal>
  );
}

export default function Templates() {
  const [templates, setTemplates] = useState(INIT);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [previewItem, setPreviewItem] = useState(null);

  const save = (form) => {
    if (editItem) {
      setTemplates(p => p.map(t => t.id === editItem.id ? { ...t, ...form } : t));
      toast.success('Template updated');
      setEditItem(null);
    } else {
      setTemplates(p => [...p, { ...form, id: NEXT_ID++ }]);
      toast.success('Template created');
    }
    setShowForm(false);
  };

  const del = () => {
    setTemplates(p => p.filter(t => t.id !== deleteId));
    toast.success('Deleted');
    setDeleteId(null);
  };

  return (
    <>
      <div className="topbar">
        <div><div className="topbar-title">Templates</div><div className="topbar-sub">{templates.length} saved templates</div></div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus size={14} /> New template</button>
        </div>
      </div>

      <div className="page">
        {templates.length === 0 ? (
          <div className="card"><Empty title="No templates yet" desc="Save time by creating reusable email templates" action={<button className="btn btn-primary" onClick={() => setShowForm(true)}>Create first template</button>} /></div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 14 }}>
            {templates.map(t => (
              <div key={t.id} className="card">
                <div style={{ fontWeight: 600, color: 'var(--ink)', marginBottom: 4 }}>{t.name}</div>
                <div style={{ fontSize: '0.82rem', color: 'var(--ink3)', marginBottom: 10 }}>{t.subject}</div>
                <div style={{ fontSize: '0.8rem', color: 'var(--ink4)', height: 44, overflow: 'hidden', position: 'relative', marginBottom: 14 }}>
                  <div dangerouslySetInnerHTML={{ __html: t.body }} style={{ pointerEvents: 'none' }} />
                  <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 20, background: 'linear-gradient(transparent, #fff)' }} />
                </div>
                <div style={{ display: 'flex', gap: 6 }}>
                  <button className="btn btn-outline btn-sm" onClick={() => setPreviewItem(t)}><Eye size={12} /> Preview</button>
                  <button className="btn btn-ghost btn-sm" onClick={() => { setEditItem(t); setShowForm(true); }}><Edit2 size={12} /></button>
                  <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(t.id)} style={{ color: 'var(--red)' }}><Trash2 size={12} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showForm && <TemplateForm initial={editItem} onSave={save} onClose={() => { setShowForm(false); setEditItem(null); }} />}
      {previewItem && (
        <Modal title={`Preview: ${previewItem.name}`} onClose={() => setPreviewItem(null)}
          footer={<button className="btn btn-outline" onClick={() => setPreviewItem(null)}>Close</button>}>
          <div style={{ marginBottom: 8, fontSize: '0.83rem' }}><span style={{ color: 'var(--ink3)' }}>Subject: </span><strong>{previewItem.subject}</strong></div>
          <div style={{ background: '#fff', border: '1px solid var(--border)', borderRadius: 6, padding: 16, fontSize: '0.9rem', lineHeight: 1.7 }} dangerouslySetInnerHTML={{ __html: previewItem.body }} />
        </Modal>
      )}
      {deleteId && <Confirm message="Delete this template?" onConfirm={del} onCancel={() => setDeleteId(null)} />}
    </>
  );
}
