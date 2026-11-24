import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

function CompanySignup() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    registrationNumber: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    website: "",
    establishedDate: "",
    name: "",
    password: "",
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

    if (!/^[0-9]{10}$/.test(formData.phone)) {
      alert("Enter valid 10 digit phone number");
      return;
    }

    if (!/^[0-9]{6}$/.test(formData.pincode)) {
      alert("Enter valid 6 digit pincode");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.post(
        "http://localhost:8080/api/company/signup",
        formData,
      );

      alert(response.data.message || "Company registration successful");
      navigate("/login");
    } catch (error) {
      alert(error.response?.data?.message || "Company registration failed");
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full min-w-0 bg-transparent px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-500";

  const fieldClass =
    "flex items-center rounded-xl border border-[#35416b] bg-[#111a3b] px-4 transition focus-within:border-blue-500 focus-within:ring-4 focus-within:ring-blue-500/10";

  const labelClass = "mb-2 block text-sm font-semibold text-gray-300";

  const sectionClass = "mt-8 border-b border-[#273254] pb-8";

  const sectionHeading = "mb-5 flex items-center gap-3";

  const renderField = (
    label,
    name,
    placeholder,
    type = "text",
    required = true,
  ) => (
    <div>
      <label className={labelClass}>
        {label} {required && "*"}
      </label>

      <div className={fieldClass}>
        <input
          className={inputClass}
          type={type}
          name={name}
          placeholder={placeholder}
          value={formData[name]}
          onChange={handleChange}
          required={required}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070B1C] flex items-center justify-center p-4 sm:p-6">
      <div className="grid w-full max-w-7xl overflow-hidden rounded-[28px] border border-[#53649c] bg-[#090e29] shadow-[0_20px_80px_rgba(30,50,180,0.25)] lg:grid-cols-[0.85fr_1.15fr]">
        {/* LEFT PANEL */}
        <aside className="relative hidden min-h-full overflow-hidden bg-gradient-to-br from-[#2865f5] via-[#294bd5] to-[#6069ec] p-10 text-white lg:flex lg:flex-col xl:p-12">
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
              FOR EMPLOYERS
            </span>

            <h1 className="mt-8 text-5xl font-extrabold leading-[1.12] xl:text-6xl">
              Build your
              <br />
              dream team<span className="text-[#a9d7ff]">.</span>
            </h1>

            <p className="mt-6 max-w-md text-base leading-8 text-blue-100">
              Join HireHub as an employer. Connect with talented professionals,
              discover skilled candidates and build a team that makes a
              difference.
            </p>
          </div>

          {/* Benefits */}
          <div className="relative mt-10 space-y-5">
            {[
              "Connect with talented professionals",
              "Create and manage job openings",
              "Find the right people for your team",
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
                <h3 className="font-bold">
                  Great teams start with great hiring.
                </h3>
                <p className="mt-1 text-xs text-blue-100">
                  Discover talent. Build teams. Grow together.
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL */}
        <main className="relative min-w-0 bg-[#090e29] px-6 py-12 sm:px-10 lg:px-12">
          {/* Close Button */}
          <button
            type="button"
            onClick={() => navigate("/")}
            className="absolute right-6 top-6 flex h-11 w-11 items-center justify-center rounded-full border border-[#35416b] bg-[#192144] text-2xl text-gray-300 transition hover:bg-[#26345f] hover:text-white"
            aria-label="Go to home"
          >
            ×
          </button>

          <div className="mx-auto w-full max-w-2xl">
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
            <div className="mb-8">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-blue-500/10 px-3 py-1.5 text-xs font-semibold text-blue-400">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                EMPLOYER ACCOUNT
              </div>

              <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                Register your company
              </h1>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Create your company account and start discovering talented
                professionals.
              </p>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Company Information */}
              <section className={sectionClass}>
                <div className={sectionHeading}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl">
                    🏢
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Company Information
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Basic details about your organization
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {renderField(
                    "Company Name",
                    "companyName",
                    "Enter company name",
                  )}

                  <div>
                    <label className={labelClass}>Company Type *</label>

                    <div className={fieldClass}>
                      <select
                        className={`${inputClass} cursor-pointer`}
                        name="companyType"
                        value={formData.companyType}
                        onChange={handleChange}
                        required
                      >
                        <option className="bg-[#111a3b]" value="">
                          Select company type
                        </option>
                        <option
                          className="bg-[#111a3b]"
                          value="Private Limited"
                        >
                          Private Limited
                        </option>
                        <option className="bg-[#111a3b]" value="Public Limited">
                          Public Limited
                        </option>
                        <option className="bg-[#111a3b]" value="Partnership">
                          Partnership
                        </option>
                        <option className="bg-[#111a3b]" value="LLP">
                          LLP
                        </option>
                        <option className="bg-[#111a3b]" value="Startup">
                          Startup
                        </option>
                        <option className="bg-[#111a3b]" value="Other">
                          Other
                        </option>
                      </select>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    {renderField(
                      "Registration Number",
                      "registrationNumber",
                      "Enter registration number",
                    )}
                  </div>

                  {renderField(
                    "Established Date",
                    "establishedDate",
                    "",
                    "date",
                  )}

                  {renderField(
                    "Company Website",
                    "website",
                    "https://example.com",
                    "url",
                    false,
                  )}
                </div>
              </section>

              {/* Contact Information */}
              <section className={sectionClass}>
                <div className={sectionHeading}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl">
                    📍
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Contact Information
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Contact and company location details
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {renderField(
                    "Company Email",
                    "email",
                    "hr@company.com",
                    "email",
                  )}

                  {renderField(
                    "Phone Number",
                    "phone",
                    "10 digit phone number",
                    "tel",
                  )}

                  <div className="sm:col-span-2">
                    {renderField(
                      "Complete Address",
                      "address",
                      "Enter complete company address",
                    )}
                  </div>

                  {renderField("City", "city", "Enter city")}

                  {renderField("State", "state", "Enter state")}

                  <div className="sm:col-span-2">
                    {renderField("Pincode", "pincode", "Enter 6 digit pincode")}
                  </div>
                </div>
              </section>

              {/* Account Information */}
              <section className="mt-8">
                <div className={sectionHeading}>
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-500/15 text-xl">
                    🔐
                  </div>

                  <div>
                    <h3 className="font-bold text-white">
                      Account Information
                    </h3>
                    <p className="mt-1 text-xs text-gray-400">
                      Create your company login credentials
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  {renderField(
                    "Contact Person Name",
                    "name",
                    "Enter your name",
                  )}

                  <div>
                    <label className={labelClass}>Password *</label>

                    <div className={fieldClass}>
                      <input
                        className={inputClass}
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Create password"
                        value={formData.password}
                        onChange={handleChange}
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
                  </div>
                </div>
              </section>

              {/* Submit */}
              <div className="mt-10 border-t border-[#273254] pt-7">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-[#2169f5] to-[#3855e9] px-5 py-4 font-bold text-white shadow-lg shadow-blue-600/20 transition hover:-translate-y-0.5 hover:from-[#1c5ee0] hover:to-[#3049d5] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? "Registering Company..." : "Register Company"}
                  {!loading && <span className="text-lg">→</span>}
                </button>

                <div className="mt-7 text-center">
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

                <p className="mt-7 text-center text-xs leading-5 text-gray-500">
                  By registering, you agree to HireHub's Terms of Service and
                  Privacy Policy.
                </p>

                <p className="mt-5 text-center text-xs text-gray-500">
                  © 2026 HireHub. All rights reserved.
                </p>
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}

export default CompanySignup;
