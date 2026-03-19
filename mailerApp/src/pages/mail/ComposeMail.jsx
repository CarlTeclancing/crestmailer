import { Send } from "lucide-react";
import { useState } from "react";

export default function ComposeMail() {

  // Sample contacts (later you fetch from backend)
  const contacts = [
    { name: "John Doe", email: "john.doe@example.com" },
    { name: "Jane Smith", email: "jane.smith@example.com" },
    { name: "Michael Wright", email: "m.wright@example.com" },
  ];

  const [form, setForm] = useState({
    subject: "",
    body: ""
  });

  const [selectedEmails, setSelectedEmails] = useState([]);

  // Handle checkbox toggle
  const toggleEmail = (email) => {
    setSelectedEmails((prev) =>
      prev.includes(email)
        ? prev.filter((e) => e !== email)
        : [...prev, email]
    );
  };

  // Select all
  const handleSelectAll = () => {
    if (selectedEmails.length === contacts.length) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(contacts.map((c) => c.email));
    }
  };

  const set = (field) => (e) =>
    setForm({ ...form, [field]: e.target.value });

  // Send mail
  const handleSend = () => {
    if (selectedEmails.length === 0) {
      alert("Please select at least one recipient.");
      return;
    }

    const payload = {
      to: selectedEmails,
      subject: form.subject,
      body: form.body,
    };

    console.log("Sending:", payload);

    // TODO: Send to backend API
  };

  return (
    <div className="flex-1 bg-slate-50 p-10">

      <h1 className="text-2xl font-bold text-slate-800 mb-8">
        Compose New Email
      </h1>

      <div className="flex flex-col gap-7 max-w-4xl">

        {/*  CONTACT SELECTION */}
        <div className="bg-white p-5 rounded-lg border border-slate-200">

          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700">
              Select Recipients
            </h2>

            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={selectedEmails.length === contacts.length}
                onChange={handleSelectAll}
              />
              Select All
            </label>
          </div>

          <div className="space-y-3 max-h-40 overflow-y-auto">

            {contacts.map((c, i) => (
              <label
                key={i}
                className="flex items-center gap-3 text-sm text-slate-700"
              >
                <input
                  type="checkbox"
                  checked={selectedEmails.includes(c.email)}
                  onChange={() => toggleEmail(c.email)}
                />
                <span>{c.name} ({c.email})</span>
              </label>
            ))}

          </div>

        </div>
        {/*  SUBJECT */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Subject
          </label>
          <input
            type="text"
            placeholder="Enter email subject..."
            value={form.subject}
            onChange={set("subject")}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm"
          />
        </div>

        {/*  MESSAGE */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Message Body
          </label>
          <textarea
            rows={8}
            placeholder="Type your message here..."
            value={form.body}
            onChange={set("body")}
            className="w-full border border-slate-300 rounded-lg px-4 py-3 text-sm resize-none"
          />
        </div>

        {/* SEND BUTTON */}
        <button
          onClick={handleSend}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-4 rounded-lg"
        >
          <Send size={15} />
          Send Email ({selectedEmails.length})
        </button>

      </div>
    </div>
  );
}