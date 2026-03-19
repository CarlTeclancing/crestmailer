import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import logo from "../../assets/logo1.png";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (field) => (e) => {
    setForm({ ...form, [field]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Please enter both email and password.");
      return;
    }

    // Mock authentication (you will replace later)
    if (form.email === "test@example.com" && form.password === "123456") {
      login(form.email); // 🔥 save user globally
      setError("");
      navigate("/compose");
    } else {
      setError("Invalid email or password.");
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-6">
          <img src={logo} alt="logo" className="w-12 h-12 object-contain" />
          <h1 className="text-xl font-bold text-blue-500 tracking-wide">
            CRESTLANCING
          </h1>
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Login</h2>

          <form onSubmit={handleLogin} className="space-y-5">

            {error && (
              <p className="text-red-500 text-sm">{error}</p>
            )}

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Email Address
              </label>
              <input
                type="email"
                value={form.email}
                onChange={handleChange("email")}
                placeholder="you@example.com"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>
              <input
                type="password"
                value={form.password}
                onChange={handleChange("password")}
                placeholder="Enter your password"
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition"
            >
              Login
            </button>
          </form>

          {/* Register link */}
          <p className="mt-4 text-sm text-center text-gray-600">
            Don’t have an account?{" "}
            <span
              className="text-blue-600 cursor-pointer hover:underline"
              onClick={() => navigate("/register")}
            >
              Register
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}