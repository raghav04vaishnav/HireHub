import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080/api/admin";

function AdminDashboard() {
  const navigate = useNavigate();

  // SAFE USER DATA
  let admin = {};

  try {
    admin = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    admin = {};
  }

  const adminName = admin.name || "Admin";

  const [activeTab, setActiveTab] = useState("Overview");
  const [search, setSearch] = useState("");

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCompanies: 0,
    totalJobs: 0,
    totalApplications: 0,
  });

  const [users, setUsers] = useState([]);
  const [companies, setCompanies] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const tabs = [
    { name: "Overview", icon: "📊" },
    { name: "Users", icon: "👥" },
    { name: "Companies", icon: "🏢" },
    { name: "Vacancies", icon: "💼" },
    { name: "Applications", icon: "📄" },
  ];

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // FETCH DASHBOARD DATA
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/login");
        return;
      }

      if (role !== "admin") {
        navigate("/");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const [statsRes, usersRes, companiesRes, jobsRes, applicationsRes] =
        await Promise.all([
          axios.get(`${API}/stats`, config),
          axios.get(`${API}/users`, config),
          axios.get(`${API}/companies`, config),
          axios.get(`${API}/jobs`, config),
          axios.get(`${API}/applications`, config),
        ]);

      setStats({
        totalUsers: statsRes.data.stats?.totalUsers || 0,
        totalCompanies: statsRes.data.stats?.totalCompanies || 0,
        totalJobs: statsRes.data.stats?.totalJobs || 0,
        totalApplications: statsRes.data.stats?.totalApplications || 0,
      });

      setUsers(usersRes.data.users || []);
      setCompanies(companiesRes.data.companies || []);
      setJobs(jobsRes.data.jobs || []);
      setApplications(applicationsRes.data.applications || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      } else {
        setError(
          err.response?.data?.message || "Unable to load dashboard data",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // SEARCH FILTERS
  const filteredUsers = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return users.filter((user) =>
      `${user.name || ""} ${user.email || ""} ${user.phoneNumber || ""}`
        .toLowerCase()
        .includes(searchText),
    );
  }, [users, search]);

  const filteredCompanies = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return companies.filter((company) =>
      `${company.companyName || ""} ${
        company.industry || ""
      } ${company.user?.email || ""}`
        .toLowerCase()
        .includes(searchText),
    );
  }, [companies, search]);

  const filteredJobs = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return jobs.filter((job) =>
      `${job.title || ""} ${
        job.company?.companyName || ""
      } ${job.location || ""}`
        .toLowerCase()
        .includes(searchText),
    );
  }, [jobs, search]);

  const filteredApplications = useMemo(() => {
    const searchText = search.trim().toLowerCase();

    return applications.filter((application) => {
      const applicant = application.userId?.name || "";
      const email = application.userId?.email || "";
      const jobTitle = application.jobId?.title || "";
      const companyName = application.jobId?.company?.companyName || "";
      const status = application.status || "";

      return `${applicant} ${email} ${jobTitle} ${companyName} ${status}`
        .toLowerCase()
        .includes(searchText);
    });
  }, [applications, search]);

  const changeTab = (tab) => {
    setActiveTab(tab);
    setSearch("");
  };

  const formatDate = (date) => {
    if (!date) return "-";
    return new Date(date).toLocaleDateString("en-IN");
  };

  const currency = (amount) => {
    if (amount === undefined || amount === null) return "-";
    return `₹${Number(amount).toLocaleString("en-IN")}`;
  };

  const recentJobs = [...jobs].slice(0, 5);
  const recentUsers = [...users].slice(0, 5);
  const recentCompanies = [...companies].slice(0, 5);

  const statCards = [
    {
      title: "Total Users",
      value: stats.totalUsers,
      icon: "👥",
      description: "Registered candidates",
      color: "bg-[#fff0e2] dark:bg-[#493426]",
      accent: "border-l-[#d97736]",
    },
    {
      title: "Companies",
      value: stats.totalCompanies,
      icon: "🏢",
      description: "Registered companies",
      color: "bg-[#fff0e2] dark:bg-[#493426]",
      accent: "border-l-[#d97736]",
    },
    {
      title: "Total Jobs",
      value: stats.totalJobs,
      icon: "💼",
      description: "Published vacancies",
      color: "bg-[#fff0e2] dark:bg-[#493426]",
      accent: "border-l-[#d97736]",
    },
    {
      title: "Applications",
      value: stats.totalApplications,
      icon: "📄",
      description: "Total applications",
      color: "bg-[#fff0e2] dark:bg-[#493426]",
      accent: "border-l-[#d97736]",
    },
  ];

  const tableClass = "w-full min-w-[650px] text-left text-sm";

  const thClass =
    "bg-[#faf7f2] px-5 py-4 text-xs font-bold uppercase tracking-wider text-[#958779] dark:bg-[#302c28] dark:text-gray-400";

  const tdClass =
    "border-t border-[#eee4d8] px-5 py-4 text-[#71685f] dark:border-[#38332e] dark:text-gray-300";

  const cardClass =
    "rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm transition-colors duration-300 dark:border-[#38332e] dark:bg-[#222222]";

  const headingClass = "text-lg font-bold text-[#292824] dark:text-white";

  // STATUS BADGE
  const getStatusStyle = (status) => {
    return status?.toLowerCase() === "active"
      ? "bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300"
      : "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#292824] transition-colors duration-300 dark:bg-[#171717] dark:text-white">
      <div className="flex min-h-screen">
        {/* SIDEBAR */}
        <aside className="hidden w-64 shrink-0 flex-col border-r border-[#eee4d8] bg-white px-5 py-7 dark:border-[#38332e] dark:bg-[#222222] lg:flex">
          <div className="mb-12 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d97736] text-xl font-black text-white shadow-md">
              H
            </div>

            <div>
              <h1 className="text-xl font-black text-[#292824] dark:text-white">
                HireHub<span className="text-[#d97736]">.</span>
              </h1>

              <p className="text-[10px] font-bold uppercase tracking-[2px] text-[#958779] dark:text-gray-400">
                Admin Panel
              </p>
            </div>
          </div>

          <p className="mb-4 px-3 text-xs font-bold uppercase tracking-widest text-[#958779] dark:text-gray-500">
            Main Menu
          </p>

          <div className="flex flex-col gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.name}
                onClick={() => changeTab(tab.name)}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-200 ${
                  activeTab === tab.name
                    ? "bg-[#fff0e2] text-[#bd632c] dark:bg-[#493426] dark:text-[#ffca9c]"
                    : "text-[#71685f] hover:bg-[#faf7f2] hover:text-[#d97736] dark:text-gray-300 dark:hover:bg-[#302c28] dark:hover:text-[#ffca9c]"
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.name === "Vacancies" ? "Manage Jobs" : tab.name}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigate("/admin/users")}
            className="mt-2 flex items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold text-[#71685f] transition hover:bg-[#faf7f2] hover:text-[#d97736] dark:text-gray-300 dark:hover:bg-[#302c28] dark:hover:text-[#ffca9c]"
          >
            <span className="text-lg">👥</span>
            Manage Users
          </button>

          <div className="mt-auto rounded-2xl border border-[#eee4d8] bg-[#faf7f2] p-5 dark:border-[#38332e] dark:bg-[#302c28]">
            <div className="mb-3 text-2xl">🚀</div>

            <h3 className="font-bold text-[#292824] dark:text-white">
              HireHub Admin
            </h3>

            <p className="mt-2 text-xs leading-5 text-[#958779] dark:text-gray-400">
              Manage your job portal and monitor platform activities.
            </p>
          </div>

          <button
            onClick={logout}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#eee4d8] px-4 py-3 text-sm font-bold text-[#71685f] transition hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-[#38332e] dark:text-gray-300 dark:hover:border-red-900/50 dark:hover:bg-red-900/20 dark:hover:text-red-300"
          >
            <span>↗</span>
            Logout
          </button>
        </aside>

        {/* MAIN AREA */}
        <div className="min-w-0 flex-1">
          {/* TOP NAVBAR */}
          <header className="sticky top-0 z-20 border-b border-[#eee4d8] bg-white/95 px-5 py-4 backdrop-blur-xl dark:border-[#38332e] dark:bg-[#222222]/95 lg:px-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h1 className="text-xl font-black text-[#292824] dark:text-white">
                  {activeTab === "Overview"
                    ? "Dashboard"
                    : activeTab === "Users"
                      ? "Manage Users"
                      : activeTab === "Vacancies"
                        ? "Manage Jobs"
                        : "Manage Applications"}
                </h1>

                <p className="hidden text-xs text-[#958779] dark:text-gray-400 sm:block">
                  Welcome to HireHub Administration
                </p>
              </div>

              <div className="flex items-center gap-3">
                <ThemeToggle />

                <div className="hidden items-center gap-2 rounded-xl bg-[#faf7f2] px-3 py-2 dark:bg-[#302c28] sm:flex">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#fce7d5] font-bold text-[#bd632c] dark:bg-[#493426] dark:text-[#ffca9c]">
                    {adminName.charAt(0).toUpperCase()}
                  </div>

                  <div>
                    <p className="text-xs font-bold text-[#292824] dark:text-white">
                      {adminName}
                    </p>

                    <p className="text-[10px] text-[#958779] dark:text-gray-400">
                      Administrator
                    </p>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="rounded-xl bg-[#d97736] px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-[#bd632c] hover:shadow-md lg:hidden"
                >
                  Logout ↗
                </button>
              </div>
            </div>

            {/* MOBILE NAVIGATION */}
            <div className="mt-4 flex gap-2 overflow-x-auto pb-1 lg:hidden">
              {tabs.map((tab) => (
                <button
                  key={tab.name}
                  onClick={() => changeTab(tab.name)}
                  className={`whitespace-nowrap rounded-full px-4 py-2 text-xs font-semibold transition ${
                    activeTab === tab.name
                      ? "bg-[#d97736] text-white"
                      : "bg-[#faf7f2] text-[#71685f] dark:bg-[#302c28] dark:text-gray-300"
                  }`}
                >
                  {tab.icon} {tab.name}
                </button>
              ))}
            </div>
          </header>

          {/* CONTENT */}
          <main className="mx-auto max-w-7xl px-5 py-8 lg:px-8">
            {/* WELCOME SECTION */}
            <section className="relative mb-8 flex flex-col justify-between gap-5 overflow-hidden rounded-3xl border border-[#eee4d8] bg-gradient-to-r from-[#fff8f1] via-[#faf7f2] to-[#f6eee4] p-7 shadow-sm dark:border-[#38332e] dark:bg-gradient-to-r dark:from-[#222222] dark:via-[#29231e] dark:to-[#30251d] md:flex-row md:items-center md:p-9">
              <div className="pointer-events-none absolute -right-10 -top-20 h-64 w-64 rounded-full bg-[#d97736]/10 blur-3xl"></div>

              <div className="relative z-10">
                <p className="mb-3 text-xs font-bold uppercase tracking-[3px] text-[#d97736]">
                  Administration
                </p>

                <h2 className="text-3xl font-black text-[#292824] dark:text-white md:text-4xl">
                  Welcome back,{" "}
                  <span className="text-[#d97736]">{adminName}!</span>
                </h2>

                <p className="mt-3 max-w-xl text-sm leading-6 text-[#71685f] dark:text-gray-300">
                  Manage users, companies and job vacancies from one place.
                  Monitor your platform activity and stay in control.
                </p>
              </div>

              <div className="relative z-10 min-w-[190px] rounded-2xl border border-[#eee4d8] bg-white/80 p-5 shadow-sm backdrop-blur-sm dark:border-[#38332e] dark:bg-[#302c28]/80">
                <p className="text-xs text-[#958779] dark:text-gray-400">
                  Platform Status
                </p>

                <div className="mt-3 flex items-center gap-2">
                  <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-green-500"></span>

                  <span className="text-sm font-bold text-[#292824] dark:text-white">
                    Admin Control Active
                  </span>
                </div>

                <p className="mt-2 text-xs text-[#958779] dark:text-gray-400">
                  HireHub Management System
                </p>
              </div>
            </section>

            {/* LOADING */}
            {loading && (
              <div className={`${cardClass} py-16 text-center`}>
                <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#d97736]/20 border-t-[#d97736]"></div>

                <p className="font-semibold text-[#71685f] dark:text-gray-300">
                  Loading dashboard data...
                </p>
              </div>
            )}

            {/* ERROR */}
            {!loading && error && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 p-5 text-sm text-red-700 dark:border-red-900/50 dark:bg-red-900/20 dark:text-red-300">
                <p>{error}</p>

                <button
                  onClick={fetchDashboardData}
                  className="mt-3 font-bold underline"
                >
                  Retry
                </button>
              </div>
            )}

            {!loading && !error && (
              <>
                {/* STATISTICS CARDS */}
                <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {statCards.map((item) => (
                    <div
                      key={item.title}
                      className={`group rounded-2xl border border-[#eee4d8] border-l-4 ${item.accent} bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]`}
                    >
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-semibold text-[#958779] dark:text-gray-400">
                          {item.title}
                        </p>

                        <div
                          className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl transition duration-300 group-hover:scale-110 ${item.color}`}
                        >
                          {item.icon}
                        </div>
                      </div>

                      <h3 className="mt-5 text-3xl font-black text-[#292824] dark:text-white">
                        {item.value}
                      </h3>

                      <p className="mt-1 text-xs text-[#958779] dark:text-gray-500">
                        {item.description}
                      </p>
                    </div>
                  ))}
                </section>

                {/* OVERVIEW */}
                {activeTab === "Overview" && (
                  <>
                    <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                      <div>
                        <h2 className="text-2xl font-black text-[#292824] dark:text-white">
                          Platform Overview
                        </h2>

                        <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                          Latest users, companies and job vacancies.
                        </p>
                      </div>

                      <button
                        onClick={fetchDashboardData}
                        className="rounded-xl border border-[#eee4d8] bg-white px-4 py-2.5 text-sm font-bold text-[#71685f] transition hover:border-[#d97736] hover:bg-[#faf7f2] dark:border-[#38332e] dark:bg-[#222222] dark:text-gray-300 dark:hover:bg-[#302c28]"
                      >
                        ↻ Refresh Data
                      </button>
                    </div>

                    {/* RECENT USERS AND COMPANIES */}
                    <div className="mb-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
                      {/* RECENT USERS */}
                      <div className={cardClass}>
                        <div className="mb-5 flex items-center justify-between">
                          <div>
                            <h3 className={headingClass}>Recent Users</h3>

                            <p className="mt-1 text-xs text-[#958779] dark:text-gray-400">
                              Latest registered candidates
                            </p>
                          </div>

                          <button
                            onClick={() => navigate("/admin/users")}
                            className="text-sm font-bold text-[#d97736] hover:text-[#bd632c] hover:underline"
                          >
                            View All →
                          </button>
                        </div>

                        {recentUsers.length === 0 ? (
                          <p className="py-5 text-sm text-[#958779] dark:text-gray-400">
                            No users found.
                          </p>
                        ) : (
                          recentUsers.map((user) => (
                            <div
                              key={user._id}
                              className="flex items-center gap-3 border-b border-[#eee4d8] py-3 last:border-0 dark:border-[#38332e]"
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#fce7d5] font-bold text-[#bd632c] dark:bg-[#493426] dark:text-[#ffca9c]">
                                {user.name?.charAt(0)?.toUpperCase() || "U"}
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-[#292824] dark:text-white">
                                  {user.name || "Unnamed User"}
                                </p>

                                <p className="truncate text-xs text-[#958779] dark:text-gray-400">
                                  {user.email}
                                </p>
                              </div>

                              <span className="shrink-0 text-xs text-[#958779] dark:text-gray-500">
                                {formatDate(user.createdAt)}
                              </span>
                            </div>
                          ))
                        )}
                      </div>

                      {/* RECENT COMPANIES */}
                      <div className={cardClass}>
                        <div className="mb-5 flex items-center justify-between">
                          <div>
                            <h3 className={headingClass}>Recent Companies</h3>

                            <p className="mt-1 text-xs text-[#958779] dark:text-gray-400">
                              Latest registered companies
                            </p>
                          </div>

                          <button
                            onClick={() => changeTab("Companies")}
                            className="text-sm font-bold text-[#d97736] hover:text-[#bd632c] hover:underline"
                          >
                            View All →
                          </button>
                        </div>

                        {recentCompanies.length === 0 ? (
                          <p className="py-5 text-sm text-[#958779] dark:text-gray-400">
                            No companies found.
                          </p>
                        ) : (
                          recentCompanies.map((company) => (
                            <div
                              key={company._id}
                              className="flex items-center gap-3 border-b border-[#eee4d8] py-3 last:border-0 dark:border-[#38332e]"
                            >
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#fff0e2] text-xl dark:bg-[#493426]">
                                🏢
                              </div>

                              <div className="min-w-0 flex-1">
                                <p className="truncate text-sm font-bold text-[#292824] dark:text-white">
                                  {company.companyName}
                                </p>

                                <p className="truncate text-xs text-[#958779] dark:text-gray-400">
                                  {company.industry || "Industry not specified"}
                                </p>
                              </div>

                              <span className="shrink-0 text-xs font-semibold text-[#71685f] dark:text-gray-400">
                                {company.totalJobs || 0} Jobs
                              </span>
                            </div>
                          ))
                        )}
                      </div>
                    </div>

                    {/* LATEST VACANCIES */}
                    <div className={cardClass}>
                      <div className="mb-5 flex items-center justify-between">
                        <div>
                          <h3 className={headingClass}>Latest Vacancies</h3>

                          <p className="mt-1 text-xs text-[#958779] dark:text-gray-400">
                            Recently published job opportunities
                          </p>
                        </div>

                        <button
                          onClick={() => changeTab("Vacancies")}
                          className="text-sm font-bold text-[#d97736] hover:text-[#bd632c] hover:underline"
                        >
                          View All →
                        </button>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left text-sm">
                          <thead>
                            <tr>
                              <th className={thClass}>Job Title</th>
                              <th className={thClass}>Company</th>
                              <th className={thClass}>Location</th>
                              <th className={thClass}>Applicants</th>
                              <th className={thClass}>Status</th>
                            </tr>
                          </thead>

                          <tbody>
                            {recentJobs.map((job) => (
                              <tr
                                key={job._id}
                                className="transition hover:bg-[#faf7f2] dark:hover:bg-[#302c28]"
                              >
                                <td
                                  className={`${tdClass} font-bold dark:text-white`}
                                >
                                  {job.title}
                                </td>

                                <td className={tdClass}>
                                  {job.company?.companyName || "-"}
                                </td>

                                <td className={tdClass}>{job.location}</td>

                                <td className={`${tdClass} font-bold`}>
                                  {job.totalApplicants || 0}
                                </td>

                                <td className={tdClass}>
                                  <span
                                    className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(job.status)}`}
                                  >
                                    {job.status}
                                  </span>
                                </td>
                              </tr>
                            ))}

                            {recentJobs.length === 0 && (
                              <tr>
                                <td
                                  colSpan="5"
                                  className="p-8 text-center text-[#958779] dark:text-gray-400"
                                >
                                  No vacancies found.
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                )}

                {/* SEARCH AND FILTER */}
                {activeTab !== "Overview" && (
                  <section className="mb-6">
                    <div className="mb-5">
                      <h2 className="text-2xl font-black text-[#292824] dark:text-white">
                        {activeTab === "Users"
                          ? "Registered Users"
                          : activeTab === "Vacancies"
                            ? "All Job Vacancies"
                            : "All Applications"}
                      </h2>

                      <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                        Manage and view all platform records.
                      </p>
                    </div>

                    <div className="relative">
                      <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder={`Search ${activeTab.toLowerCase()}...`}
                        className="w-full rounded-xl border border-[#eadfd1] bg-white px-5 py-3 text-sm text-[#292824] outline-none transition placeholder:text-[#aa9f93] focus:border-[#d97736] focus:ring-2 focus:ring-[#d97736]/10 dark:border-[#494039] dark:bg-[#302c28] dark:text-white dark:placeholder:text-gray-500 md:max-w-md"
                      />
                    </div>
                  </section>
                )}

                {/* USERS TABLE */}
                {activeTab === "Users" && (
                  <div className={`${cardClass} !p-0`}>
                    <div className="border-b border-[#eee4d8] p-5 dark:border-[#38332e]">
                      <h3 className={headingClass}>
                        All Users ({filteredUsers.length})
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className={tableClass}>
                        <thead>
                          <tr>
                            <th className={thClass}>Name</th>
                            <th className={thClass}>Email</th>
                            <th className={thClass}>Phone</th>
                            <th className={thClass}>Joined Date</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredUsers.map((user) => (
                            <tr
                              key={user._id}
                              className="transition hover:bg-[#faf7f2] dark:hover:bg-[#302c28]"
                            >
                              <td
                                className={`${tdClass} font-bold dark:text-white`}
                              >
                                {user.name || "-"}
                              </td>

                              <td className={tdClass}>{user.email}</td>

                              <td className={tdClass}>
                                {user.phoneNumber || "-"}
                              </td>

                              <td className={tdClass}>
                                {formatDate(user.createdAt)}
                              </td>
                            </tr>
                          ))}

                          {filteredUsers.length === 0 && (
                            <tr>
                              <td
                                colSpan="4"
                                className="p-8 text-center text-[#958779] dark:text-gray-400"
                              >
                                No users found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* COMPANIES TABLE */}
                {activeTab === "Companies" && (
                  <div className={`${cardClass} !p-0`}>
                    <div className="border-b border-[#eee4d8] p-5 dark:border-[#38332e]">
                      <h3 className={headingClass}>
                        All Companies ({filteredCompanies.length})
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[850px] text-left text-sm">
                        <thead>
                          <tr>
                            <th className={thClass}>Company</th>
                            <th className={thClass}>Owner</th>
                            <th className={thClass}>Industry</th>
                            <th className={thClass}>Email</th>
                            <th className={thClass}>Total Jobs</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredCompanies.map((company) => (
                            <tr
                              key={company._id}
                              className="transition hover:bg-[#faf7f2] dark:hover:bg-[#302c28]"
                            >
                              <td
                                className={`${tdClass} font-bold dark:text-white`}
                              >
                                {company.companyName}
                              </td>

                              <td className={tdClass}>
                                {company.owner || "-"}
                              </td>

                              <td className={tdClass}>
                                {company.industry || "-"}
                              </td>

                              <td className={tdClass}>
                                {company.user?.email || "-"}
                              </td>

                              <td className={`${tdClass} font-bold`}>
                                {company.totalJobs || 0}
                              </td>
                            </tr>
                          ))}

                          {filteredCompanies.length === 0 && (
                            <tr>
                              <td
                                colSpan="5"
                                className="p-8 text-center text-[#958779] dark:text-gray-400"
                              >
                                No companies found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* VACANCIES TABLE */}
                {activeTab === "Vacancies" && (
                  <div className={`${cardClass} !p-0`}>
                    <div className="border-b border-[#eee4d8] p-5 dark:border-[#38332e]">
                      <h3 className={headingClass}>
                        All Vacancies ({filteredJobs.length})
                      </h3>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[950px] text-left text-sm">
                        <thead>
                          <tr>
                            <th className={thClass}>Job Title</th>
                            <th className={thClass}>Company</th>
                            <th className={thClass}>Location</th>
                            <th className={thClass}>Job Type</th>
                            <th className={thClass}>Salary</th>
                            <th className={thClass}>Applicants</th>
                            <th className={thClass}>Status</th>
                          </tr>
                        </thead>

                        <tbody>
                          {filteredJobs.map((job) => (
                            <tr
                              key={job._id}
                              className="transition hover:bg-[#faf7f2] dark:hover:bg-[#302c28]"
                            >
                              <td
                                className={`${tdClass} font-bold dark:text-white`}
                              >
                                {job.title}
                              </td>

                              <td className={tdClass}>
                                {job.company?.companyName || "-"}
                              </td>

                              <td className={tdClass}>{job.location}</td>

                              <td className={tdClass}>{job.jobType}</td>

                              <td className={tdClass}>
                                {currency(job.salary?.min)} -{" "}
                                {currency(job.salary?.max)}
                              </td>

                              <td className={`${tdClass} font-bold`}>
                                {job.totalApplicants || 0}
                              </td>

                              <td className={tdClass}>
                                <span
                                  className={`rounded-full px-3 py-1 text-xs font-bold ${getStatusStyle(job.status)}`}
                                >
                                  {job.status}
                                </span>
                              </td>
                            </tr>
                          ))}

                          {filteredJobs.length === 0 && (
                            <tr>
                              <td
                                colSpan="7"
                                className="p-8 text-center text-[#958779] dark:text-gray-400"
                              >
                                No vacancies found.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}

            {/* APPLICATIONS TABLE */}
            {activeTab === "Applications" && (
              <div className={`${cardClass} !p-0`}>
                <div className="border-b border-[#eee4d8] p-5 dark:border-[#38332e]">
                  <h3 className={headingClass}>
                    All Applications ({filteredApplications.length})
                  </h3>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px] text-left text-sm">
                    <thead>
                      <tr>
                        <th className={thClass}>Applicant</th>
                        <th className={thClass}>Email</th>
                        <th className={thClass}>Job Title</th>
                        <th className={thClass}>Company</th>
                        <th className={thClass}>Applied Date</th>
                        <th className={thClass}>Status</th>
                        <th className={thClass}>Resume</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredApplications.map((application) => (
                        <tr
                          key={application._id}
                          className="transition hover:bg-[#faf7f2] dark:hover:bg-[#302c28]"
                        >
                          <td
                            className={`${tdClass} font-bold dark:text-white`}
                          >
                            {application.userId?.name || "User not available"}
                          </td>

                          <td className={tdClass}>
                            {application.userId?.email || "-"}
                          </td>

                          <td className={tdClass}>
                            {application.jobId?.title || "Job not available"}
                          </td>

                          <td className={tdClass}>
                            {application.jobId?.company?.companyName || "-"}
                          </td>

                          <td className={tdClass}>
                            {formatDate(application.createdAt)}
                          </td>

                          <td className={tdClass}>
                            <span className="rounded-full bg-[#fff0e2] px-3 py-1 text-xs font-bold capitalize text-[#bd632c] dark:bg-[#493426] dark:text-[#ffca9c]">
                              {application.status || "pending"}
                            </span>
                          </td>

                          <td className={tdClass}>
                            {application.resume ? (
                              <a
                                href={application.resume}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="font-bold text-[#d97736] hover:underline"
                              >
                                View Resume ↗
                              </a>
                            ) : (
                              "-"
                            )}
                          </td>
                        </tr>
                      ))}

                      {filteredApplications.length === 0 && (
                        <tr>
                          <td
                            colSpan="7"
                            className="p-8 text-center text-[#958779] dark:text-gray-400"
                          >
                            No applications found.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* FOOTER */}
            <footer className="mt-10 border-t border-[#eee4d8] py-6 text-center text-xs text-[#958779] dark:border-[#38332e] dark:text-gray-500">
              © 2026 HireHub Admin Panel. All rights reserved.
            </footer>
          </main>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
