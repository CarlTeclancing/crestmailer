import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Send, Mail, FileText,
  Settings, LogOut, UserCog, Megaphone
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Sidebar({ open, onClose }) {
  const { user, logout, can } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navItem = (to, Icon, label, exact = false) => (
    <NavLink
      key={to} to={to} end={exact}
      className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
      onClick={onClose}
    >
      <Icon /> {label}
    </NavLink>
  );

  return (
    <>
      <div className={`mobile-veil ${open ? 'show' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="sidebar-logo">
          <div className="wordmark">MailFlow</div>
          <div className="tagline">Email management platform</div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section">Main</div>
          {navItem('/', LayoutDashboard, 'Dashboard', true)}
          {navItem('/contacts', Users, 'Contacts')}
          {navItem('/campaigns', Megaphone, 'Campaigns')}
          {navItem('/compose', Send, 'Compose')}
          {navItem('/logs', Mail, 'Mail Logs')}

          {can(['admin', 'superadmin']) && (
            <>
              <div className="nav-section">Admin</div>
              {navItem('/templates', FileText, 'Templates')}
              {navItem('/settings', Settings, 'Settings')}
            </>
          )}

          {can(['superadmin']) && (
            <>
              <div className="nav-section">Super Admin</div>
              {navItem('/users', UserCog, 'Manage Users')}
            </>
          )}
        </nav>

        <div className="sidebar-bottom">
          <div className="user-chip">
            <div className="user-avatar">{user?.name?.charAt(0)}</div>
            <div className="user-info">
              <div className="name">{user?.name}</div>
              <div className="role">{user?.role}</div>
            </div>
          </div>
          <button className="nav-link" onClick={handleLogout} style={{ marginTop: 4, color: 'rgba(255,100,80,0.8)' }}>
            <LogOut /> Sign out
          </button>
        </div>
      </aside>
    </>
  );
}
