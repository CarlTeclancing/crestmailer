import { Link } from 'react-router-dom';

export default function Landing() {
  return (
    <div className="landing">
      <nav className="landing-nav">
        <div className="landing-logo">MailFlow</div>
        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/login" className="btn btn-outline" style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.2)' }}>
            Sign in
          </Link>
        </div>
      </nav>

      <div className="landing-hero">
        <h1>Email campaigns that <em>actually</em> get delivered</h1>
        <p>
          Manage contacts, build campaigns, and track results — all in one clean dashboard built for teams of every size.
        </p>
        <div className="landing-cta">
          <Link to="/login" className="btn btn-primary btn-lg">
            Get started →
          </Link>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>
            No credit card required
          </span>
        </div>
      </div>

      <div className="landing-features">
        {[
          { icon: '📋', title: 'Contact management', desc: 'Import, organise and segment your contacts. Export to CSV or Excel anytime.' },
          { icon: '📣', title: 'Campaign builder', desc: 'Create targeted campaigns with custom branding, images and personalised content.' },
          { icon: '👥', title: 'Role-based access', desc: 'Super admin, admin, and user roles so your team works at the right level.' },
          { icon: '📊', title: 'Analytics & logs', desc: 'Track every email sent. See open stats, delivery logs and campaign performance.' },
        ].map(f => (
          <div key={f.title} className="feat">
            <div className="feat-icon">{f.icon}</div>
            <h4>{f.title}</h4>
            <p>{f.desc}</p>
          </div>
        ))}
      </div>

      <div className="landing-footer">
        &copy; {new Date().getFullYear()} MailFlow. Built for teams.
      </div>
    </div>
  );
}
