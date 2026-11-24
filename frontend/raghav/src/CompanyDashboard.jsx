import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

function CompanyDashboard() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:8080/api/job/my-jobs",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setJobs(response.data.jobs || []);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to fetch your jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const activeJobs = jobs.filter((job) => job.status === "Active").length;

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#292824] transition-colors duration-300 dark:bg-[#171717] dark:text-white">
      {/* Navbar */}
      <header className="sticky top-0 z-30 border-b border-[#eee4d8] bg-white/95 backdrop-blur-md dark:border-[#38332e] dark:bg-[#222222]/95">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-4 px-5 md:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d97736] text-xl font-extrabold text-white">
              H
            </div>

            <h1 className="text-2xl font-extrabold tracking-tight text-[#292824] dark:text-white">
              Hire<span className="text-[#d97736]">Hub</span>
            </h1>
          </div>

          <nav className="hidden items-center gap-7 text-sm font-semibold text-[#777168] dark:text-gray-300 md:flex">
            <button className="h-[76px] border-b-2 border-[#d97736] font-bold text-[#d97736]">
              Dashboard
            </button>

            <button
              onClick={() => navigate("/company/manage-jobs")}
              className="transition hover:text-[#d97736]"
            >
              My Jobs
            </button>

            <button
              onClick={() => navigate("/company/manage-applicants")}
              className="transition hover:text-[#d97736]"
            >
              Candidates
            </button>

            <button
              onClick={() => navigate("/company/manage-applicants")}
              className="transition hover:text-[#d97736]"
            >
              Manage Applicants
            </button>

            <button
              onClick={() => navigate("/company/manage-interviews")}
              className="transition hover:text-[#d97736]"
            >
              Manage Interviews
            </button>
          </nav>

          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#fce7d5] font-bold text-[#d97736] dark:bg-[#493426] dark:text-orange-300">
              {(user.name || "C").charAt(0).toUpperCase()}
            </div>

            <div className="hidden sm:block">
              <p className="text-sm font-bold text-[#292824] dark:text-white">
                {user.name || "Company Admin"}
              </p>

              <p className="text-xs text-[#958779] dark:text-gray-400">
                Recruiter
              </p>
            </div>

            <ThemeToggle />

            <button
              onClick={logout}
              className="rounded-xl px-3 py-2 text-xs font-bold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/30"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1500px] px-5 py-8 md:px-8">
        {/* Welcome Section */}
        <section className="relative mb-8 overflow-hidden rounded-3xl border border-[#eee4d8] bg-gradient-to-br from-[#fff8f1] via-[#faf7f2] to-[#f6eee4] p-7 shadow-sm dark:border-[#38332e] dark:bg-gradient-to-br dark:from-[#222222] dark:via-[#222222] dark:to-[#30251d] md:p-10">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-[#e9b88e]/30" />
          <div className="absolute -right-5 -top-12 h-52 w-52 rounded-full border border-[#e9b88e]/30" />

          <div className="relative z-10 flex flex-col justify-between gap-7 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <span className="rounded-full border border-[#e9b88e] bg-[#fff0e2] px-4 py-2 text-[10px] font-bold tracking-[2px] text-[#a85c2b] dark:border-[#60442f] dark:bg-[#493426] dark:text-[#ffca9c]">
                COMPANY WORKSPACE
              </span>

              <h2 className="mt-6 text-3xl font-bold leading-tight text-[#292824] dark:text-white md:text-4xl">
                Welcome back,
                <span className="text-[#d97736]">
                  {" "}
                  {user.name || "Recruiter"}.
                </span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-7 text-[#958779] dark:text-gray-400">
                Manage your job vacancies and find the right people to grow your
                organization.
              </p>

              <button
                onClick={() => navigate("/company/create-job")}
                className="mt-7 rounded-xl bg-[#d97736] px-6 py-3.5 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#bd632c]"
              >
                + Post a Vacancy
              </button>
            </div>

            <div className="hidden h-52 w-64 items-center justify-center rounded-3xl border border-[#eee4d8] bg-white/80 lg:flex dark:border-[#38332e] dark:bg-[#302c28]">
              <div className="text-center">
                <div className="text-6xl text-[#d97736]">✦</div>

                <p className="mt-4 text-sm font-bold text-[#51483e] dark:text-[#ffca9c]">
                  Your next great hire
                </p>

                <p className="mt-1 text-xs text-[#958779] dark:text-gray-400">
                  Starts with HireHub
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Statistics */}
        <section className="mb-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <div className="group rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9b88e] hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0e2] text-xl text-[#d97736] dark:bg-[#493426]">
              ▣
            </div>

            <p className="mt-5 text-sm font-medium text-[#958779] dark:text-gray-400">
              Total Posted Jobs
            </p>

            <h3 className="mt-1 text-3xl font-extrabold text-[#292824] dark:text-white">
              {loading ? "..." : jobs.length}
            </h3>
          </div>

          <div className="group rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9b88e] hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0e2] text-xl text-[#d97736] dark:bg-[#493426]">
              ✓
            </div>

            <p className="mt-5 text-sm font-medium text-[#958779] dark:text-gray-400">
              Active Jobs
            </p>

            <h3 className="mt-1 text-3xl font-extrabold text-[#292824] dark:text-white">
              {loading ? "..." : activeJobs}
            </h3>
          </div>
        </section>

        {/* Jobs Section */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-[#eee4d8] bg-white shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
          <div className="flex flex-col justify-between gap-3 border-b border-[#eee4d8] p-6 sm:flex-row sm:items-center dark:border-[#38332e]">
            <div>
              <h3 className="text-xl font-bold text-[#292824] dark:text-white">
                Your Posted Vacancies
              </h3>

              <p className="mt-1 text-xs text-[#958779] dark:text-gray-400">
                Jobs posted by your company
              </p>
            </div>

            <button
              onClick={() => navigate("/company/manage-jobs")}
              className="text-sm font-bold text-[#d97736] transition hover:text-[#bd632c]"
            >
              Manage all jobs →
            </button>
          </div>

          {loading ? (
            <p className="py-10 text-center text-[#958779] dark:text-gray-400">
              Loading jobs...
            </p>
          ) : error ? (
            <p className="py-10 text-center text-red-500">{error}</p>
          ) : jobs.length === 0 ? (
            <div className="px-5 py-12 text-center">
              <h3 className="text-lg font-bold text-[#292824] dark:text-white">
                No jobs posted yet
              </h3>

              <p className="mt-2 text-sm text-[#958779] dark:text-gray-400">
                Your posted jobs will appear here.
              </p>

              <button
                onClick={() => navigate("/company/create-job")}
                className="mt-5 rounded-xl bg-[#d97736] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#bd632c]"
              >
                Post Your First Job
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left">
                <thead className="bg-[#faf7f2] text-[10px] uppercase tracking-wider text-[#958779] dark:bg-[#302c28] dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-bold">Job Position</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                    <th className="px-6 py-4 font-bold">Employment</th>
                    <th className="px-6 py-4 font-bold">Salary</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.slice(0, 5).map((job) => (
                    <tr
                      key={job._id}
                      className="border-t border-[#eee4d8] transition hover:bg-[#faf7f2] dark:border-[#38332e] dark:hover:bg-[#302c28]"
                    >
                      <td className="px-6 py-5 text-sm font-bold text-[#292824] dark:text-white">
                        {job.title}
                      </td>

                      <td className="px-6 py-5 text-xs text-[#958779] dark:text-gray-400">
                        {job.location}
                      </td>

                      <td className="px-6 py-5 text-xs text-[#958779] dark:text-gray-400">
                        {job.jobType}
                      </td>

                      <td className="px-6 py-5 text-sm font-bold text-[#292824] dark:text-white">
                        ₹{job.salary?.min} - ₹{job.salary?.max}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                            job.status === "Active"
                              ? "bg-green-50 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                          }`}
                        >
                          {job.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <button
                          onClick={() => navigate("/company/manage-jobs")}
                          className="text-xs font-bold text-[#d97736] transition hover:text-[#bd632c]"
                        >
                          Manage →
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>

        <footer className="py-5 text-center text-xs text-[#958779] dark:text-gray-500">
          © 2026 HireHub. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default CompanyDashboard;
