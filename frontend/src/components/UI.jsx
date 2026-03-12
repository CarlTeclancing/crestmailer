import { X } from 'lucide-react';

export function Modal({ title, children, footer, onClose, size = '' }) {
  return (
    <div className="overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${size}`}>
        <div className="modal-head">
          <h3>{title}</h3>
          <button className="btn btn-ghost btn-sm" onClick={onClose} style={{ padding: '4px' }}>
            <X size={18} />
          </button>
        </div>
        <div className="modal-body">{children}</div>
        {footer && <div className="modal-foot">{footer}</div>}
      </div>
    </div>
  );
}

export function Spinner() {
  return <div className="spinner-wrap"><div className="spinner" /></div>;
}

export function Empty({ icon: Icon, title, desc, action }) {
  return (
    <div className="empty">
      {Icon && <Icon />}
      <h4>{title}</h4>
      {desc && <p>{desc}</p>}
      {action && <div style={{ marginTop: 16 }}>{action}</div>}
    </div>
  );
}

export function Confirm({ message, onConfirm, onCancel }) {
  return (
    <div className="overlay" onClick={onCancel}>
      <div className="modal" style={{ maxWidth: 380 }}>
        <div className="modal-head"><h3>Confirm action</h3></div>
        <div className="modal-body">
          <p style={{ fontSize: '0.88rem', color: 'var(--ink2)' }}>{message}</p>
        </div>
        <div className="modal-foot">
          <button className="btn btn-outline" onClick={onCancel}>Cancel</button>
          <button className="btn btn-danger" onClick={onConfirm}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

export function ExportMenu({ onCSV, onExcel }) {
  return (
    <div style={{ display: 'flex', gap: 6 }}>
      <button className="btn btn-outline btn-sm" onClick={onCSV}>↓ CSV</button>
      <button className="btn btn-outline btn-sm" onClick={onExcel}>↓ Excel</button>
    </div>
  );
}

export function RoleBadge({ role }) {
  return <span className={`role-chip role-${role}`}>{role}</span>;
}

export function Switch({ checked, onChange }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="switch-slider" />
    </label>
  );
}
