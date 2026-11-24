import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8080/api/auth";

function ForgotPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const inputClass =
    "w-full rounded-xl border border-[#35416b] bg-[#111a3b] px-4 py-3.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10";

  const handleSendOtp = async (e) => {
    if (e) e.preventDefault();

    try {
      setLoading(true);

      const response = await axios.post(`${API}/forget`, {
        email: email.trim().toLowerCase(),
      });

      alert(response.data.message);
      setStep(2);
      setOtp("");
    } catch (error) {
      alert(error.response?.data?.message || "Unable to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API}/verify-otp`, {
        email: email.trim().toLowerCase(),
        otp,
      });

      alert(response.data.message);
      setStep(3);
    } catch (error) {
      alert(error.response?.data?.message || "OTP verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(`${API}/reset`, {
        email: email.trim().toLowerCase(),
        newPassword,
        confirmPassword,
      });

      alert(response.data.message);
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#070B1C] flex items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-6xl overflow-hidden rounded-[28px] border border-[#53649c] bg-[#090e29] shadow-[0_20px_80px_rgba(30,50,180,0.25)] lg:grid-cols-2">
        {/* LEFT PANEL */}
        <aside className="relative hidden min-h-[680px] overflow-hidden bg-gradient-to-br from-[#2865f5] via-[#294bd5] to-[#6069ec] p-10 text-white lg:flex lg:flex-col xl:p-12">
          <div className="absolute -right-28 -top-28 h-96 w-96 rounded-full border border-white/20" />
          <div className="absolute -right-16 -top-16 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute -bottom-40 -left-20 h-96 w-96 rounded-full bg-white/10 blur-2xl" />

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

          <div className="relative mt-28">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold">
              <span className="h-2 w-2 rounded-full bg-green-300" />
              ACCOUNT RECOVERY
            </span>

            <div className="mt-10 flex h-16 w-16 items-center justify-center rounded-2xl border border-white/20 bg-white/10 text-3xl">
              🔐
            </div>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.12]">
              Don't worry!
              <br />
              We've got
              <span className="block text-[#a9d7ff]">you covered.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-blue-100">
              Recover your HireHub account securely with email verification and
              create a new password.
            </p>
          </div>

          <div className="relative mt-12 space-y-5">
            {[
              "Secure account recovery",
              "Email OTP verification",
              "Create a new password",
            ].map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/20 text-sm">
                  ✓
                </div>
                <p className="text-sm font-semibold text-white">{item}</p>
              </div>
            ))}
          </div>

          <div className="relative mt-auto rounded-2xl border border-white/20 bg-white/10 p-5">
            <h3 className="font-bold">Your security comes first.</h3>
            <p className="mt-1 text-xs text-blue-100">
              Never share your verification OTP with anyone.
            </p>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="relative flex min-h-[600px] items-center justify-center bg-[#090e29] p-6 sm:p-10 lg:p-12">
          <button
            type="button"
            onClick={() => navigate("/")}
            aria-label="Go to home"
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#35416b] bg-[#192144] text-2xl text-gray-300 transition hover:bg-[#26345f] hover:text-white"
          >
            ×
          </button>

          <div className="w-full max-w-md">
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

            <div className="mb-8">
              <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl border border-blue-500/20 bg-blue-500/10 text-3xl">
                {step === 1 ? "🔑" : step === 2 ? "📩" : "🔒"}
              </div>

              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                PASSWORD RECOVERY · STEP {step}/3
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                {step === 1
                  ? "Forgot Password?"
                  : step === 2
                    ? "Verify OTP"
                    : "Create New Password"}
              </h1>

              <p className="mt-4 text-sm leading-7 text-gray-400">
                {step === 1
                  ? "Enter your registered email address. We will send you a verification OTP."
                  : step === 2
                    ? `Enter the 6-digit OTP sent to ${email}. OTP is valid for 5 minutes.`
                    : "Your email has been verified. Enter your new password below."}
              </p>
            </div>

            {step === 1 && (
              <form onSubmit={handleSendOtp}>
                <div className="mb-7">
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Email Address
                  </label>
                  <input
                    className={inputClass}
                    type="email"
                    placeholder="Enter your registered email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2169f5] to-[#3855e9] px-5 py-4 font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                  {!loading && <span>→</span>}
                </button>
              </form>
            )}

            {step === 2 && (
              <form onSubmit={handleVerifyOtp}>
                <div className="mb-7">
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    6-Digit OTP
                  </label>
                  <input
                    className={inputClass}
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2169f5] to-[#3855e9] px-5 py-4 font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                  {!loading && <span>→</span>}
                </button>

                <button
                  type="button"
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="mt-4 w-full text-sm font-semibold text-blue-400 hover:text-blue-300 disabled:opacity-60"
                >
                  Resend OTP
                </button>
              </form>
            )}

            {step === 3 && (
              <form onSubmit={handleResetPassword}>
                <div className="mb-5">
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    New Password
                  </label>
                  <input
                    className={inputClass}
                    type="password"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                <div className="mb-7">
                  <label className="mb-2 block text-sm font-semibold text-gray-300">
                    Confirm Password
                  </label>
                  <input
                    className={inputClass}
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    minLength={6}
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2169f5] to-[#3855e9] px-5 py-4 font-bold text-white transition hover:-translate-y-0.5 disabled:opacity-60"
                >
                  {loading ? "Updating..." : "Reset Password"}
                  {!loading && <span>→</span>}
                </button>
              </form>
            )}

            <div className="mt-8 border-t border-[#273254] pt-7 text-center">
              <Link
                to="/login"
                className="text-sm font-bold text-blue-400 transition hover:text-blue-300"
              >
                ← Back to Login
              </Link>
            </div>

            <p className="mt-9 text-center text-xs text-gray-500">
              © 2026 HireHub. All rights reserved.
            </p>
          </div>
        </main>
      </div>
    </div>
  );
}

export default ForgotPassword;
