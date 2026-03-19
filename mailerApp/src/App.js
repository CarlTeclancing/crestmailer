import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Layout from "./components/Layout";

// Auth Pages
import Login from "./pages/auth/login";
import Register from "./pages/auth/Register";

// Mail Pages
import ComposeMail from "./pages/mail/ComposeMail";
import Contacts from "./pages/mail/Contacts";
import SendMails from "./pages/mail/SendMails";

function App() {
  return (
    <Router>
      <Routes>

        {/* Public Routes (NO layout) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* App Routes (WITH layout) */}
        <Route element={<Layout />}>
          {/* Default route */}
          <Route path="/" element={<Navigate to="/compose" replace />} />
          <Route path="/settings" element={<div>Settings Page</div>} />

          {/* Mail routes */}
          <Route path="/compose" element={<ComposeMail />} />
          <Route path="/contacts" element={<Contacts />} />
          <Route path="/send" element={<SendMails />} />
        </Route>

      </Routes>
    </Router>
  );
}

export default App;