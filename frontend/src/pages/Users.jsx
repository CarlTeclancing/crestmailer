import { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { Modal, Confirm, RoleBadge } from '../components/UI';
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom';

//constant inserted users
let NEXT_ID = 10;
const INIT = [
  { id: 1, name: 'Samuel', email: 'superadmin@mailflow.com', role: 'superadmin', active: true, joined: '2026-01-01' },
  { id: 2, name: 'Grace', email: 'admin@mailflow.com', role: 'admin', active: true, joined: '2026-01-15' },
 
 
];

function UserForm({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || { name: '', email: '', role: 'user', active: true, password: '' });
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name || !form.email) return toast.error('Name and email required');
    if (!initial && !form.password) return toast.error('Password required for new users');
    onSave(form);
  };

  return (
    <Modal title={initial ? 'Edit user' : 'Add user'} onClose={onClose}
      footer={<><button className="btn btn-outline" onClick={onClose}>Cancel</button><button className="btn btn-primary" onClick={submit}>Save</button></>}>
      <div className="form-row">
        <div className="field"><label>Full name <span>*</span></label><input value={form.name} onChange={e => set('name', e.target.value)} /></div>
        <div className="field"><label>Email <span>*</span></label><input type="email" value={form.email} onChange={e => set('email', e.target.value)} /></div>
      </div>
      <div className="form-row">
        <div className="field">
          <label>Role</label>
          <select value={form.role} onChange={e => set('role', e.target.value)}>
            <option value="user">User</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
          </select>
        </div>
        <div className="field">
          <label>{initial ? 'New password' : 'Password'} {!initial && <span>*</span>}</label>
          <input type="password" value={form.password || ''} onChange={e => set('password', e.target.value)} placeholder={initial ? 'Leave blank to keep' : '••••••••'} />
        </div>
      </div>
      <div className="cb-row">
        <input type="checkbox" id="active" checked={form.active} onChange={e => set('active', e.target.checked)} />
        <label htmlFor="active">Account active</label>
      </div>
    </Modal>
  );
}

export default function Users() {
  const { can } = useAuth();
  if (!can(['superadmin'])) return <Navigate to="/" replace />;

  const [users, setUsers] = useState(INIT);
  const [showForm, setShowForm] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [deleteId, setDeleteId] = useState(null);

  const save = (form) => {
    if (editItem) {
      setUsers(p => p.map(u => u.id === editItem.id ? { ...u, ...form } : u));
      toast.success('User updated');
      setEditItem(null);
    } else {
      setUsers(p => [...p, { ...form, id: NEXT_ID++, joined: new Date().toISOString().slice(0, 10) }]);
      toast.success('User added');
    }
    setShowForm(false);
  };

  const del = () => {
    setUsers(p => p.filter(u => u.id !== deleteId));
    toast.success('User removed');
    setDeleteId(null);
  };

  return (
    <>
      <div className="topbar">
        <div><div className="topbar-title">Manage users</div><div className="topbar-sub">{users.length} accounts</div></div>
        <div className="topbar-actions">
          <button className="btn btn-primary btn-sm" onClick={() => { setEditItem(null); setShowForm(true); }}><Plus size={14} /> Add user</button>
        </div>
      </div>

      <div className="page">
        <div style={{ background: 'var(--cream2)', border: '1px solid var(--border)', borderRadius: 6, padding: '10px 14px', marginBottom: 18, fontSize: '0.82rem', color: 'var(--ink3)' }}>
          <strong style={{ color: 'var(--ink2)' }}>Super admin only.</strong> Manage all platform users and their access levels here.
        </div>

        <div className="card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Joined</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.id}>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{u.name}</td>
                    <td style={{ color: 'var(--ink3)' }}>{u.email}</td>
                    <td><RoleBadge role={u.role} /></td>
                    <td><span className={`badge ${u.active ? 'badge-green' : 'badge-gray'}`}>{u.active ? 'Active' : 'Inactive'}</span></td>
                    <td style={{ color: 'var(--ink4)', fontSize: '0.82rem' }}>{u.joined}</td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-sm" onClick={() => { setEditItem(u); setShowForm(true); }}><Edit2 size={13} /></button>
                        <button className="btn btn-ghost btn-sm" onClick={() => setDeleteId(u.id)} style={{ color: 'var(--red)' }}><Trash2 size={13} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showForm && <UserForm initial={editItem} onSave={save} onClose={() => { setShowForm(false); setEditItem(null); }} />}
      {deleteId && <Confirm message="Remove this user? They will lose all access." onConfirm={del} onCancel={() => setDeleteId(null)} />}
    </>
  );
}
