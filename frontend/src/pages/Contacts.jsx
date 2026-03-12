import { useState } from 'react';
import { Plus, Search, Trash2, Edit2, Download, ChevronDown } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Confirm, Empty, ExportMenu } from '../components/UI';
import { exportCSV, exportExcel } from '../utils/export';

// Mock data can be insrted  
let NEXT_ID = 0;
const INIT = [
 
];

function ContactForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', email: '', phone: '', subscribed: true });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name || !form.email) return toast.error('Name and email required');
    onSave(form);
  };

  return (
    <Modal title={initial ? 'Edit contact' : 'Add contact'} onClose={onClose}
      footer={<><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={submit}>Save</button></>}>
      <div className="form-row">
        <div className="field"><label>Name <span>*</span></label><input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Full name" /></div>
        <div className="field"><label>Email <span>*</span></label><input type="email" value={form.email} onChange={e => set('email', e.target.value)}  /></div>
      </div>
      <div className="field"><label>Phone <span>*</span></label><input type="tel" value={form.phone} onChange={e => set('phone', e.target.value)}  /></div>
      <div className="cb-row">
        <input type="checkbox" id="sub" checked={form.subscribed} onChange={e => set('subscribed', e.target.checked)} />
        <label htmlFor="sub">Subscribed to mailing list</label>
      </div>
    </Modal>
  );
}

export default function Contacts() {
  const [contacts, setContacts] = useState(INIT);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [selected, setSelected] = useState([]);

  const filtered = contacts.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || (filter === 'subscribed' && c.subscribed) || (filter === 'unsubscribed' && !c.subscribed);
    return matchSearch && matchFilter;
  });

  const addContact = (form) => {
    setContacts(p => [...p, { ...form, id: NEXT_ID++, joined: new Date().toISOString().slice(0, 10) }]);
    toast.success('Contact added');
    setShowAdd(false);
  };

  const updateContact = (form) => {
    setContacts(p => p.map(c => c.id === editItem.id ? { ...c, ...form } : c));
    toast.success('Contact updated');
    setEditItem(null);
  };

  const deleteContact = () => {
    setContacts(p => p.filter(c => c.id !== deleteId));
    toast.success('Deleted');
    setDeleteId(null);
  };

  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map(c => c.id));
  const toggleOne = (id) => setSelected(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const bulkDelete = () => {
    setContacts(p => p.filter(c => !selected.includes(c.id)));
    setSelected([]);
    toast.success(`${selected.length} contacts deleted`);
  };

  const exportData = contacts.map(({ id, ...c }) => c);

  return (
    <>
      <div className="topbar">
        <div>
          <div className="topbar-title">Contacts</div>
          <div className="topbar-sub">{contacts.length} total · {contacts.filter(c => c.subscribed).length} subscribed</div>
        </div>
        <div className="topbar-actions">
          <ExportMenu onCSV={() => exportCSV(exportData, 'contacts')} onExcel={() => exportExcel(exportData, 'contacts')} />
          <button className="btn btn-primary btn-sm" onClick={() => setShowAdd(true)}><Plus size={14} /> Add contact</button>
        </div>
      </div>

      <div className="page">
        <div className="filter-bar">
          <div className="search-wrap">
            <Search /><input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search contacts..." />
          </div>
          <select value={filter} onChange={e => setFilter(e.target.value)} style={{ width: 160 }}>
            <option value="all">All contacts</option>
            <option value="subscribed">Subscribed</option>
            <option value="unsubscribed">Unsubscribed</option>
          </select>
          {selected.length > 0 && (
            <button className="btn btn-danger btn-sm" onClick={bulkDelete}>
              <Trash2 size={13} /> Delete {selected.length}
            </button>
          )}
        </div>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th style={{ width: 40 }}><input type="checkbox" onChange={toggleAll} checked={selected.length === filtered.length && filtered.length > 0} /></th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7}><Empty title="No contacts found" desc="Try a different search or add your first contact" /></td></tr>
                ) : filtered.map(c => (
                  <tr key={c.id}>
                    <td><input type="checkbox" checked={selected.includes(c.id)} onChange={() => toggleOne(c.id)} /></td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 9 }}>
                        <div style={{ width: 30, height: 30, borderRadius: '50%', background: 'var(--cream3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 600, fontSize: '0.82rem', color: 'var(--ink2)', flexShrink: 0 }}>
                          {c.name.charAt(0)}
                        </div>
                        <span style={{ fontWeight: 500, color: 'var(--ink)' }}>{c.name}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--ink3)' }}>{c.email}</td>
                    <td style={{ color: 'var(--ink3)' }}>{c.phone || '—'}</td>
                    <td>
                      <span className={`badge ${c.subscribed ? 'badge-green' : 'badge-gray'}`}>
                        {c.subscribed ? 'Subscribed' : 'Unsubscribed'}
                      </span>
                    </td>
                    <td style={{ color: 'var(--ink4)', fontSize: '0.82rem' }}>{c.joined}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => setEditItem(c)} title="Edit"><Edit2 size={13} /></button>
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

      {showAdd && <ContactForm onSave={addContact} onClose={() => setShowAdd(false)} />}
      {editItem && <ContactForm initial={editItem} onSave={updateContact} onClose={() => setEditItem(null)} />}
      {deleteId && <Confirm message="Delete this contact? This cannot be undone." onConfirm={deleteContact} onCancel={() => setDeleteId(null)} />}
    </>
  );
}
