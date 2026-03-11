// src/services/api.js

const BASE_URL = "http://localhost/MailerApp/backend/api";

// ─── Helper ──────────────────────────────────────────────────────────────────
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}/${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: { "Content-Type": "application/json" },
      ...options,
    });
    const data = await res.json();
    if (!data.success) {
      throw new Error(data.message || "An error occurred.");
    }
    return data;
  } catch (err) {
    
    throw new Error(err.message || "Network error. Is XAMPP running?");
  }
}

// ─── Users ───────────────────────────────────────────────────────────────────

/** Register a new user */
export async function createUser({ name, email, phone }) {
  return request("create_user.php", {
    method: "POST",
    body: JSON.stringify({ name, email, phone }),
  });
}

/** Fetch all users (with optional search & pagination) */
export async function getUsers({ search = "", page = 1, limit = 50 } = {}) {
  const params = new URLSearchParams({ search, page, limit });
  return request(`get_users.php?${params}`);
}

// ─── Email ────────────────────────────────────────────────────────────────────

/**
 * Send emails to selected users or all users
 * @param {string}   subject     - Email subject
 * @param {string}   body        - HTML email body (supports {{name}} placeholder)
 * @param {number[]} recipients  - Array of user IDs (ignored if sendToAll is true)
 * @param {boolean}  sendToAll   - If true, send to every user in DB
 */
export async function sendEmail({ subject, body, recipients = [], sendToAll = false }) {
  return request("send_email.php", {
    method: "POST",
    body: JSON.stringify({ subject, body, recipients, sendToAll }),
  });
}
