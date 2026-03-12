import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();
  const navigate = useNavigate();

  if (user) return <Navigate to="/" replace />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const u = login(email, password);
      toast.success(`Welcome back, ${u.name.split(' ')[0]}!`);
      navigate('/');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const fillDemo = (role) => {
    const demos = {
      superadmin: ['superadmin@mailflow.com', 'admin123'],
      admin: ['admin@mailflow.com', 'admin123'],
      user: ['user@mailflow.com', 'user123'],
    };
    setEmail(demos[role][0]);
    setPassword(demos[role][1]);
  };

  return (
    <div className="login-page">
      <div className="login-left">
        <div style={{ fontFamily: 'var(--font-head)', fontSize: '1.6rem', color: '#fff', marginBottom: 40 }}>MailFlow</div>
        <h2>Reach more people,<br />send better email.</h2>
        <p>
          A clean, straightforward platform to manage your contacts, run email campaigns and keep track of every message sent.
        </p>
        <div style={{ marginTop: 20 }}>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.35)', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Demo accounts</div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {['superadmin', 'admin', 'user'].map(r => (
              <button key={r} onClick={() => fillDemo(r)}
                style={{ padding: '5px 12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: 6, color: 'rgba(255,255,255,0.7)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: 'var(--font)' }}>
                {r}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="login-right">
        <div className="login-form-wrap">
          <h3>Sign in</h3>
          <div className="sub">Enter your credentials to continue</div>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label>Email address</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}  required />
            </div>
            <div className="field">
              <label>Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg" style={{ width: '100%', justifyContent: 'center', marginTop: 8 }} disabled={loading}>
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

        
        </div>
      </div>
    </div>
  );
}
