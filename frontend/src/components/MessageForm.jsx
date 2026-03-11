// src/components/MessageForm.jsx
import { useState } from "react";
import { sendEmail } from "../services/api";

const DEFAULT_TEMPLATE = `<div style="font-family: 'Georgia', serif; max-width: 600px; margin: 0 auto; background: #fff;">
  <div style="background: #0a0a0a; padding: 40px; text-align: center;">
    <h1 style="color: #f5e6c8; margin: 0; font-size: 28px; letter-spacing: 2px;">MailerApp</h1>
  </div>
  <div style="padding: 40px;">
    <p style="font-size: 16px; color: #333;">Hello {{name}},</p>
    <p style="font-size: 15px; color: #555; line-height: 1.7;">
      Write your message here. You can use <strong>HTML formatting</strong> to style your email.
    </p>
    <div style="text-align: center; margin: 30px 0;">
      <a href="#" style="background: #0a0a0a; color: #f5e6c8; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-size: 14px; letter-spacing: 1px;">
        CALL TO ACTION
      </a>
    </div>
    <p style="font-size: 13px; color: #999; border-top: 1px solid #eee; padding-top: 20px; margin-top: 30px;">
      You're receiving this because you subscribed to our mailing list.
    </p>
  </div>
</div>`;

export default function MessageForm({ selectedUsers, sendToAll, onSendToAllChange }) {
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState(DEFAULT_TEMPLATE);
  const [previewMode, setPreviewMode] = useState(false);
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);

  const recipientCount = sendToAll ? "all" : selectedUsers.length;
  const canSend = subject.trim() && body.trim() && (sendToAll || selectedUsers.length > 0);

  const handleSend = async () => {
    if (!canSend) return;

    setLoading(true);
    setStatus(null);
    try {
      const res = await sendEmail({
        subject,
        body,
        recipients: selectedUsers,
        sendToAll,
      });
      setStatus({
        type: "success",
        text: res.message,
        detail: `Sent to ${res.data.totalSent} recipient(s).${res.data.totalFailed > 0 ? ` ${res.data.totalFailed} failed.` : ""}`,
      });
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="message-card">
      <div className="form-header">
        <span className="form-icon">✉</span>
        <h2>Compose Email</h2>
        <p>Craft and send your campaign</p>
      </div>

      <div className="form-body">
        {/* Recipient Toggle */}
        <div className="recipient-toggle">
          <label className="toggle-label">
            <input
              type="checkbox"
              checked={sendToAll}
              onChange={(e) => onSendToAllChange(e.target.checked)}
            />
            <span className="toggle-slider" />
            <span>Send to all users</span>
          </label>
          {!sendToAll && (
            <span className="recipient-count">
              {selectedUsers.length > 0
                ? `${selectedUsers.length} selected`
                : "⚠ Select users from the dashboard"}
            </span>
          )}
        </div>

        {/* Subject */}
        <div className="field-group">
          <label htmlFor="subject">Subject Line</label>
          <input
            id="subject"
            type="text"
            placeholder="Your compelling subject line…"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Body Editor / Preview Toggle */}
        <div className="editor-tabs">
          <button
            className={`tab-btn ${!previewMode ? "active" : ""}`}
            onClick={() => setPreviewMode(false)}
          >
            ✎ HTML Editor
          </button>
          <button
            className={`tab-btn ${previewMode ? "active" : ""}`}
            onClick={() => setPreviewMode(true)}
          >
            ◉ Preview
          </button>
        </div>

        {previewMode ? (
          <div
            className="email-preview"
            dangerouslySetInnerHTML={{ __html: body.replace(/\{\{name\}\}/g, "Jane Doe") }}
          />
        ) : (
          <div className="field-group">
            <label htmlFor="body">
              Email Body <span className="label-hint">(HTML supported · use {"{{name}}"} for personalization)</span>
            </label>
            <textarea
              id="body"
              rows={14}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={loading}
              spellCheck={false}
            />
          </div>
        )}

        {status && (
          <div className={`alert alert-${status.type}`}>
            <strong>{status.text}</strong>
            {status.detail && <div className="alert-detail">{status.detail}</div>}
          </div>
        )}

        <button
          className="btn-primary btn-send"
          onClick={handleSend}
          disabled={!canSend || loading}
        >
          {loading ? (
            <span className="btn-loader">
              <span className="spinner" /> Sending…
            </span>
          ) : (
            <>
              Send to {sendToAll ? "All Users" : `${recipientCount} User${recipientCount !== 1 ? "s" : ""}`} →
            </>
          )}
        </button>
      </div>
    </div>
  );
}
