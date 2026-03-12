// src/components/UserForm.jsx
import { useState } from "react";
import { createUser } from "../services/api";

export default function UserForm({ onUserAdded }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [status, setStatus] = useState(null); // { type: "success"|"error", text: "" }
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setStatus(null);
  };

  const validate = () => {
    if (!form.name.trim() || form.name.trim().length < 2)
      return "Name must be at least 2 characters.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      return "Please enter a valid email address.";
    if (!/^[\+\d\s\-\(\)]{7,20}$/.test(form.phone))
      return "Please enter a valid phone number (7–20 digits).";
    return null;
  };

  const handleSubmit = async () => {
    const error = validate();
    if (error) return setStatus({ type: "error", text: error });

    setLoading(true);
    try {
      await createUser(form);
      setStatus({ type: "success", text: "User registered successfully! 🎉" });
      setForm({ name: "", email: "", phone: "" });
      if (onUserAdded) onUserAdded();
    } catch (err) {
      setStatus({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <div className="form-header">
        <span className="form-icon">✦</span>
        <h2>Register New User</h2>
        <p>Add contacts to your mailing list</p>
      </div>

      <div className="form-body">
        <div className="field-group">
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            value={form.name}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="field-group">
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        <div className="field-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            id="phone"
            name="phone"
            type="tel"
            placeholder="+237"
            value={form.phone}
            onChange={handleChange}
            disabled={loading}
          />
        </div>

        {status && (
          <div className={`alert alert-${status.type}`}>{status.text}</div>
        )}

        <button
          className="btn-primary"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <span className="btn-loader">
              <span className="spinner" /> Registering…
            </span>
          ) : (
            "Register User →"
          )}
        </button>
      </div>
    </div>
  );
}
