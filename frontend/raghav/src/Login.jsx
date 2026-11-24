import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: formData.email,
          password: formData.password,
        },
      );

      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      localStorage.setItem("role", user.role);

      if (user.role === "admin") {
        navigate("/admin/dashboard");
      } else if (user.role === "company") {
        navigate("/company/dashboard");
      } else {
        navigate("/user/dashboard");
      }
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B1C] flex items-center justify-center p-4 sm:p-6">
      {/* Main Container */}
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#53649c] bg-[#090e29] shadow-[0_20px_80px_rgba(30,50,180,0.25)] lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="relative hidden min-h-[650px] overflow-hidden bg-gradient-to-br from-[#2865f5] via-[#294bd5] to-[#6069ec] p-10 text-white lg:flex lg:flex-col xl:p-12">
          {/* Background Effects */}
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/20" />
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-2xl" />

          {/* Logo */}
          <div className="relative flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl font-black text-[#2855df] shadow-lg">
              H
            </div>

            <div>
              <h2 className="text-3xl font-extrabold tracking-tight">
                HireHub<span className="text-[#a9d7ff]">.</span>
              </h2>
              <p className="text-[11px] font-medium tracking-wide text-blue-100">
                CONNECT · GROW · SUCCEED
              </p>
            </div>
          </div>

          {/* Welcome Content */}
          <div className="relative mt-24">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold backdrop-blur-sm">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              YOUR CAREER JOURNEY STARTS HERE
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.12] xl:text-6xl">
              Welcome
              <br />
              back<span className="text-[#a9d7ff]">.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-blue-100">
              Pick up right where you left off. Discover new opportunities,
              connect with great companies and take your career forward.
            </p>
          </div>

          {/* Features */}
          <div className="relative mt-8 space-y-5">
            {[
              "Discover exciting career opportunities",
              "Connect with top companies",
              "Build your professional future",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
                  ✓
                </div>
                <p className="text-sm font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>

          {/* Bottom Card */}
          <div className="relative mt-auto rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white/20 text-2xl">
                ✨
              </div>

              <div>
                <h3 className="font-bold">Your future starts today.</h3>
                <p className="mt-1 text-xs text-blue-100">
                  Find opportunities. Make connections. Grow together.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative flex min-h-[650px] items-center justify-center bg-[#090e29] px-6 py-12 sm:px-12">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#35416b] bg-[#192144] text-2xl text-gray-300 transition hover:bg-[#26345f] hover:text-white"
            aria-label="Go to home"
          >
            ×
          </button>

          <div className="w-full max-w-md">
            {/* Mobile Logo */}
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-2xl font-black text-white">
                H
              </div>
              <div>
                <h2 className="text-2xl font-extrabold text-white">HireHub.</h2>
                <p className="text-xs text-gray-400">
                  CONNECT · GROW · SUCCEED
                </p>
              </div>
            </div>

            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Sign in
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Welcome back! Enter your details to access your account.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Role Selection */}
              <div className="mb-6">
                <label className="mb-3 block text-sm font-semibold text-gray-300">
                  Login As
                </label>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, role: "user" })}
                    className={`rounded-xl border px-4 py-3.5 text-sm font-semibold transition ${
                      formData.role === "user"
                        ? "border-blue-500 bg-blue-600/20 text-blue-300"
                        : "border-[#303b65] bg-[#111936] text-gray-400 hover:border-blue-500"
                    }`}
                  >
                    👤 Job Seeker
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      setFormData({ ...formData, role: "company" })
                    }
                    className={`rounded-xl border px-4 py-3.5 text-sm font-semibold transition ${
                      formData.role === "company"
                        ? "border-blue-500 bg-blue-600/20 text-blue-300"
                        : "border-[#303b65] bg-[#111936] text-gray-400 hover:border-blue-500"
                    }`}
                  >
                    🏢 Company
                  </button>
                </div>
              </div>

              {/* Email */}
              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-gray-300">
                  Email Address
                </label>

                <div className="flex items-center rounded-2xl border border-[#35416b] bg-[#111a3b] px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <span className="text-lg text-gray-400">✉</span>

                  <input
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-sm font-semibold text-gray-300">
                    Password
                  </label>

                  <Link
                    to="/forgot-password"
                    className="text-sm font-semibold text-blue-400 transition hover:text-blue-300"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="flex items-center rounded-2xl border border-[#35416b] bg-[#111a3b] px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10">
                  <span className="text-lg text-gray-400">🔒</span>

                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Enter your password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="w-full bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-sm text-gray-400 hover:text-white"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                disabled={loading}
                className="mt-5 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2169f5] to-[#3855e9] px-5 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-[#1c5ee0] hover:to-[#3049d5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
                {!loading && <span className="text-lg">→</span>}
              </button>

              {/* Signup Links */}
              <div className="mt-8 text-center">
                <p className="text-sm text-gray-400">Don't have an account?</p>

                <div className="mt-4 flex flex-col gap-3">
                  <Link
                    to="/user-signup"
                    className="rounded-xl border border-[#35416b] bg-[#111936] px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-blue-500 hover:bg-blue-600/10 hover:text-blue-300"
                  >
                    Register as Job Seeker
                  </Link>

                  <Link
                    to="/company-signup"
                    className="rounded-xl border border-[#35416b] bg-[#111936] px-4 py-3 text-sm font-semibold text-gray-200 transition hover:border-blue-500 hover:bg-blue-600/10 hover:text-blue-300"
                  >
                    Register as Company
                  </Link>
                </div>
              </div>

              {/* Footer */}
              <p className="mt-9 text-center text-xs text-gray-500">
                © 2026 HireHub. All rights reserved.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
