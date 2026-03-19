import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      setSuccess(false);
      return;
    }

    setError("");
    setSuccess(true);
    setEmail("");

    // TODO: Replace with actual API call to subscribe email
    console.log("Subscribed:", email);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-md p-8 text-center">
      <h2 className="text-2xl font-bold text-blue-500 mb-2">Subscribe to our Newsletter</h2>
      <p className="text-gray-600 mb-6">Get the latest updates and offers directly in your inbox.</p>

      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
        <input
          type="email"
          placeholder="Your email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
        >
          Subscribe
        </button>
      </form>

      {error && <p className="text-red-500 text-sm mt-3">{error}</p>}
      {success && <p className="text-green-500 text-sm mt-3">Thank you for subscribing!</p>}
    </div>
  );
}