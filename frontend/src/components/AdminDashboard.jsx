// src/components/AdminDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { getUsers } from "../services/api";

export default function AdminDashboard({ refreshKey, onSelectUsers, selectedUsers }) {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getUsers({ search });
      setUsers(res.data.users);
      setTotal(res.data.total);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers, refreshKey]);

  const toggleSelect = (id) => {
    const next = selectedUsers.includes(id)
      ? selectedUsers.filter((x) => x !== id)
      : [...selectedUsers, id];
    onSelectUsers(next);
  };

  const toggleAll = () => {
    if (selectedUsers.length === users.length) {
      onSelectUsers([]);
    } else {
      onSelectUsers(users.map((u) => u.id));
    }
  };

  const formatDate = (str) =>
    new Date(str).toLocaleDateString("en-US", {
      month: "short", day: "numeric", year: "numeric",
    });

  return (
    <div className="dashboard-card">
      <div className="dashboard-header">
        <div>
          <h2>User Directory</h2>
          <p>
            <strong>{total}</strong> {total === 1 ? "contact" : "contacts"} registered
            {selectedUsers.length > 0 && (
              <span className="selection-badge">
                {" "}· {selectedUsers.length} selected
              </span>
            )}
          </p>
        </div>

        <div className="search-box">
          <span className="search-icon">⌕</span>
          <input
            type="text"
            placeholder="Search users…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">
          <div className="spinner large" />
          <p>Loading contacts…</p>
        </div>
      ) : users.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">◎</span>
          <p>{search ? "No users match your search." : "No users registered yet."}</p>
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="user-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={selectedUsers.length === users.length && users.length > 0}
                    onChange={toggleAll}
                    title="Select all"
                  />
                </th>
                <th>Name</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user.id}
                  className={selectedUsers.includes(user.id) ? "selected" : ""}
                  onClick={() => toggleSelect(user.id)}
                >
                  <td onClick={(e) => e.stopPropagation()}>
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleSelect(user.id)}
                    />
                  </td>
                  <td className="user-name">{user.name}</td>
                  <td className="user-email">{user.email}</td>
                  <td className="user-phone">{user.phone}</td>
                  <td className="user-date">{formatDate(user.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
