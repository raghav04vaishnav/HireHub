import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function UserSignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    age: "",
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

    if (!/^[0-9]{10}$/.test(formData.phoneNumber)) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (Number(formData.age) < 18) {
      alert("Age must be at least 18 years");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/user/signup",
        {
          ...formData,
          age: Number(formData.age),
        },
      );

      alert(response.data.message || "Signup successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full bg-transparent px-4 py-4 text-sm text-white outline-none placeholder:text-gray-500";

  const fieldClass =
    "flex items-center rounded-2xl border border-[#35416b] bg-[#111a3b] px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-300";

  return (
    <div className="min-h-screen bg-[#070B1C] flex items-center justify-center p-4 sm:p-6">
      {/* Main Container */}
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#53649c] bg-[#090e29] shadow-[0_20px_80px_rgba(30,50,180,0.25)] lg:grid-cols-2">
        {/* LEFT PANEL */}
        <div className="relative hidden min-h-[750px] overflow-hidden bg-gradient-to-br from-[#2865f5] via-[#294bd5] to-[#6069ec] p-10 text-white lg:flex lg:flex-col xl:p-12">
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
              JOIN THE HIREHUB COMMUNITY
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.12] xl:text-6xl">
              Create your
              <br />
              future<span className="text-[#a9d7ff]">.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-blue-100">
              Your next career opportunity is waiting. Create your account,
              explore exciting jobs and connect with companies.
            </p>
          </div>

          {/* Benefits */}
          <div className="relative mt-10 space-y-5">
            {[
              "Discover exciting job opportunities",
              "Connect with leading companies",
              "Build your professional profile",
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
                🚀
              </div>

              <div>
                <h3 className="font-bold">Your journey begins here.</h3>
                <p className="mt-1 text-xs text-blue-100">
                  Discover. Connect. Grow. Succeed.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div className="relative flex min-h-[750px] items-center justify-center bg-[#090e29] px-6 py-12 sm:px-12">
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
            <div className="mb-8 flex items-center gap-3 lg:hidden">
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

            {/* Header */}
            <div className="mb-7">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                JOB SEEKER ACCOUNT
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white">
                Create account
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Join HireHub and start exploring new opportunities.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Name */}
              <div className="mb-4">
                <label className={labelClass}>Full Name</label>

                <div className={fieldClass}>
                  <span className="text-lg text-gray-400">👤</span>

                  <input
                    className={inputClass}
                    type="text"
                    name="name"
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className={labelClass}>Email Address</label>

                <div className={fieldClass}>
                  <span className="text-lg text-gray-400">✉</span>

                  <input
                    className={inputClass}
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              {/* Password */}
              <div className="mb-4">
                <label className={labelClass}>Password</label>

                <div className={fieldClass}>
                  <span className="text-lg text-gray-400">🔒</span>

                  <input
                    className={inputClass}
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    minLength={6}
                    required
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                  >
                    {showPassword ? "Hide" : "Show"}
                  </button>
                </div>

                <p className="mt-2 text-xs text-gray-500">
                  Password must contain at least 6 characters.
                </p>
              </div>

              {/* Phone and Age */}
              <div className="mb-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className={labelClass}>Phone Number</label>

                  <div className={fieldClass}>
                    <span className="text-gray-400">☎</span>

                    <input
                      className="w-full min-w-0 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-gray-500"
                      type="tel"
                      name="phoneNumber"
                      placeholder="10 digit number"
                      value={formData.phoneNumber}
                      onChange={handleChange}
                      pattern="[0-9]{10}"
                      maxLength={10}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className={labelClass}>Age</label>

                  <div className={fieldClass}>
                    <span className="text-gray-400">#</span>

                    <input
                      className="w-full min-w-0 bg-transparent px-3 py-4 text-sm text-white outline-none placeholder:text-gray-500"
                      type="number"
                      name="age"
                      placeholder="Your age"
                      value={formData.age}
                      onChange={handleChange}
                      min="18"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms */}
              <div className="mb-6 flex items-start gap-3 text-sm text-gray-400">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-blue-500"
                />

                <p className="leading-6">
                  I agree to the{" "}
                  <span className="font-semibold text-blue-400">
                    Terms & Conditions
                  </span>{" "}
                  and Privacy Policy.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2169f5] to-[#3855e9] px-5 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-[#1c5ee0] hover:to-[#3049d5] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Creating Account..." : "Create Account"}
                {!loading && <span className="text-lg">→</span>}
              </button>

              {/* Login Link */}
              <div className="mt-7 border-t border-[#273254] pt-6 text-center">
                <p className="text-sm text-gray-400">
                  Already have an account?{" "}
                  <Link
                    to="/login"
                    className="font-bold text-blue-400 transition hover:text-blue-300"
                  >
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Footer */}
              <p className="mt-7 text-center text-xs text-gray-500">
                © 2026 HireHub. All rights reserved.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserSignup;
