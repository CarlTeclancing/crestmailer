import { useState } from 'react';
import { Eye, X } from 'lucide-react';
import { Modal, ExportMenu, Empty } from '../components/UI';
import { exportCSV, exportExcel } from '../utils/export';

const LOGS = [
  
];

export default function MailLogs() {
  const [logs] = useState(LOGS);
  const [viewLog, setViewLog] = useState(null);

  const exportData = logs.map(({ id, body, ...rest }) => rest);

  return (
    <>
      <div className="topbar">
        <div><div className="topbar-title">Mail logs</div><div className="topbar-sub">{logs.length} emails recorded</div></div>
        <div className="topbar-actions">
          <ExportMenu onCSV={() => exportCSV(exportData, 'mail-logs')} onExcel={() => exportExcel(exportData, 'mail-logs')} />
        </div>
      </div>

      <div className="page">
        <div className="card" style={{ padding: 0 }}>
          <div className="tbl-wrap">
            <table>
              <thead>
                <tr>
                  <th>Subject</th>
                  <th>Recipients</th>
                  <th>Status</th>
                  <th>Date sent</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {logs.length === 0 ? (
                  <tr><td colSpan={5}><Empty title="No logs yet" desc="Sent emails will appear here" /></td></tr>
                ) : logs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: 500, color: 'var(--ink)' }}>{log.subject}</td>
                    <td>{log.recipients}</td>
                    <td><span className="badge badge-green">{log.status}</span></td>
                    <td style={{ color: 'var(--ink3)', fontSize: '0.82rem' }}>{log.date}</td>
                    <td>
                      <button className="btn btn-ghost btn-sm" onClick={() => setViewLog(log)}><Eye size={13} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {viewLog && (
        <Modal title="Email details" onClose={() => setViewLog(null)}
          footer={<button className="btn btn-outline" onClick={() => setViewLog(null)}>Close</button>}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
            {[['Subject', viewLog.subject], ['Recipients', viewLog.recipients], ['Status', viewLog.status], ['Date', viewLog.date]].map(([l, v]) => (
              <div key={l}><div style={{ fontSize: '0.73rem', color: 'var(--ink4)', marginBottom: 3, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{l}</div><div style={{ fontSize: '0.88rem', fontWeight: 500 }}>{v}</div></div>
            ))}
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--ink3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Body preview</div>
          <div style={{ background: 'var(--cream)', border: '1px solid var(--border)', borderRadius: 6, padding: 16, fontSize: '0.88rem', color: 'var(--ink2)' }} dangerouslySetInnerHTML={{ __html: viewLog.body }} />
        </Modal>
      )}
    </>
  );
}
