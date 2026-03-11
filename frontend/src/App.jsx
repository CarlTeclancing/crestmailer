// src/App.jsx
import { useState } from "react";
import UserForm from "./components/UserForm";
import AdminDashboard from "./components/AdminDashboard";
import MessageForm from "./components/MessageForm";
import "./App.css";

const TABS = [
  { id: "register", label: "Register User", icon: "⊕" },
  { id: "dashboard", label: "Dashboard", icon: "⊞" },
  { id: "compose", label: "Compose Email", icon: "✉" },
];

export default function App() {
  const [activeTab, setActiveTab] = useState("register");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [sendToAll, setSendToAll] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleUserAdded = () => {
    setRefreshKey((k) => k + 1);
    setTimeout(() => setActiveTab("dashboard"), 1200);
  };

  return (
    <div className="app">
      { }
      <aside className="sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark">M</div>
          <div>
            <div className="brand-name">MailerApp</div>
            <div className="brand-sub">Email Campaign</div>
          </div>
        </div>

        <nav className="sidebar-nav">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`nav-item ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="nav-icon">{tab.icon}</span>
              <span>{tab.label}</span>
              {tab.id === "compose" && selectedUsers.length > 0 && !sendToAll && (
                <span className="nav-badge">{selectedUsers.length}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="sidebar-tip">
            <span>💡</span>
            <span>Select users in Dashboard, then switch to Compose Email.</span>
          </div>
        </div>
      </aside>

      {/* ── Main Content ─────────── */}
      <main className="main">
        <div className="main-inner">
          {activeTab === "register" && (
            <UserForm onUserAdded={handleUserAdded} />
          )}
          {activeTab === "dashboard" && (
            <AdminDashboard
              refreshKey={refreshKey}
              selectedUsers={selectedUsers}
              onSelectUsers={setSelectedUsers}
            />
          )}
          {activeTab === "compose" && (
            <MessageForm
              selectedUsers={selectedUsers}
              sendToAll={sendToAll}
              onSendToAllChange={setSendToAll}
            />
          )}
        </div>
      </main>
    </div>
  );
}
