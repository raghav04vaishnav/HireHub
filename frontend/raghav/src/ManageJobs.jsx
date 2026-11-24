import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080";

function ManageJobs() {
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editJob, setEditJob] = useState(null);
  const [saving, setSaving] = useState(false);

  const handleAuthError = (err) => {
    if (err.response?.status === 401 || err.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      navigate("/login");
      return true;
    }
    return false;
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API}/api/job/my-jobs`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs(response.data.jobs || []);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.response?.data?.message || "Failed to load jobs");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // OPEN EDIT FORM
  const openEditForm = (job) => {
    setEditJob({
      _id: job._id,
      title: job.title || "",
      description: job.description || "",
      location: job.location || "",
      jobType: job.jobType || "",
      salary: {
        min: job.salary?.min ?? "",
        max: job.salary?.max ?? "",
      },
      status: job.status || "Active",
    });
  };

  // HANDLE INPUT CHANGE
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "min" || name === "max") {
      setEditJob((prev) => ({
        ...prev,
        salary: {
          ...prev.salary,
          [name]: value,
        },
      }));
    } else {
      setEditJob((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  // UPDATE JOB
  const updateJob = async (e) => {
    e.preventDefault();

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API}/api/job/update/${editJob._id}`,
        {
          title: editJob.title,
          description: editJob.description,
          location: editJob.location,
          jobType: editJob.jobType,
          salary: {
            min: Number(editJob.salary.min),
            max: Number(editJob.salary.max),
          },
          status: editJob.status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message || "Job updated successfully");
      setEditJob(null);
      fetchJobs();
    } catch (err) {
      if (!handleAuthError(err)) {
        alert(err.response?.data?.message || "Failed to update job");
      }
    } finally {
      setSaving(false);
    }
  };

  // DELETE JOB
  const deleteJob = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this job?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");

      const response = await axios.delete(`${API}/api/job/delete/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setJobs((prevJobs) => prevJobs.filter((job) => job._id !== id));

      alert(response.data.message || "Job deleted successfully");
    } catch (err) {
      if (!handleAuthError(err)) {
        alert(err.response?.data?.message || "Failed to delete job");
      }
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#eadfd1] bg-[#faf7f2] px-4 py-3 text-sm text-[#292824] outline-none transition duration-200 placeholder:text-[#aa9f93] focus:border-[#d97736] focus:ring-2 focus:ring-[#d97736]/10 dark:border-[#494039] dark:bg-[#302c28] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#d97736]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#51483e] dark:text-gray-200";

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#292824] transition-colors duration-300 dark:bg-[#171717] dark:text-white">
      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#eee4d8] bg-white/95 backdrop-blur-xl dark:border-[#38332e] dark:bg-[#222222]/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          <h1 className="text-2xl font-extrabold tracking-tight text-[#292824] dark:text-white">
            hirehub<span className="text-[#d97736]">.</span>
          </h1>

          <div className="flex items-center gap-4">
            <ThemeToggle />

            <button
              onClick={() => navigate("/company/dashboard")}
              className="text-sm font-semibold text-[#958779] transition hover:text-[#d97736] dark:text-gray-300 dark:hover:text-[#ffca9c]"
            >
              ← Dashboard
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-5 py-10 sm:px-8">
        {/* PAGE HEADING */}
        <div className="mb-9 flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d97736]/20 bg-[#fff0e2] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a85c2b] dark:border-[#d97736]/20 dark:bg-[#493426] dark:text-[#ffca9c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97736]"></span>
              Company Workspace
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#292824] dark:text-white">
              Manage Jobs
            </h2>

            <p className="mt-2 text-sm text-[#958779] dark:text-gray-400">
              Manage all your published job vacancies.
            </p>
          </div>

          <button
            onClick={() => navigate("/company/create-job")}
            className="rounded-xl bg-[#d97736] px-5 py-3 text-sm font-bold text-white shadow-md shadow-[#d97736]/15 transition duration-300 hover:bg-[#bd632c] hover:shadow-lg"
          >
            + Post New Job
          </button>
        </div>

        {/* LOADING */}
        {loading ? (
          <div className="rounded-2xl border border-[#eee4d8] bg-white py-16 text-center dark:border-[#38332e] dark:bg-[#222222]">
            <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#d97736]/20 border-t-[#d97736]"></div>
            <p className="text-sm font-medium text-[#958779] dark:text-gray-400">
              Loading jobs...
            </p>
          </div>
        ) : error ? (
          <div className="rounded-2xl border border-red-200 bg-white px-6 py-12 text-center dark:border-red-900/50 dark:bg-[#222222]">
            <p className="mb-4 text-sm font-medium text-red-500">{error}</p>

            <button
              onClick={fetchJobs}
              className="rounded-lg border border-[#d97736]/30 px-5 py-2 text-sm font-semibold text-[#a85c2b] transition hover:bg-[#fff0e2] dark:text-[#ffca9c] dark:hover:bg-[#302c28]"
            >
              Try Again
            </button>
          </div>
        ) : jobs.length === 0 ? (
          <div className="rounded-2xl border border-[#eee4d8] bg-white px-6 py-16 text-center shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0e2] text-3xl dark:bg-[#493426]">
              💼
            </div>

            <h3 className="text-xl font-bold text-[#292824] dark:text-white">
              No jobs posted yet
            </h3>

            <p className="mt-2 text-sm text-[#958779] dark:text-gray-400">
              Create your first job vacancy.
            </p>

            <button
              onClick={() => navigate("/company/create-job")}
              className="mt-6 rounded-xl bg-[#d97736] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#bd632c]"
            >
              + Create Job
            </button>
          </div>
        ) : (
          /* JOBS TABLE */
          <div className="overflow-hidden rounded-2xl border border-[#eee4d8] bg-white shadow-[0_10px_35px_rgba(41,40,36,0.04)] dark:border-[#38332e] dark:bg-[#222222]">
            <div className="flex items-center justify-between border-b border-[#eee4d8] px-6 py-5 dark:border-[#38332e]">
              <div>
                <h3 className="font-bold text-[#292824] dark:text-white">
                  Published Vacancies
                </h3>
                <p className="mt-1 text-xs text-[#958779] dark:text-gray-400">
                  Your current job listings
                </p>
              </div>

              <span className="rounded-full border border-[#d97736]/20 bg-[#fff0e2] px-3 py-1.5 text-xs font-bold text-[#a85c2b] dark:bg-[#493426] dark:text-[#ffca9c]">
                {jobs.length} Jobs
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full whitespace-nowrap text-left">
                <thead className="bg-[#faf7f2] text-xs uppercase tracking-wider text-[#958779] dark:bg-[#302c28] dark:text-gray-400">
                  <tr>
                    <th className="px-6 py-4 font-bold">Job Title</th>
                    <th className="px-6 py-4 font-bold">Location</th>
                    <th className="px-6 py-4 font-bold">Job Type</th>
                    <th className="px-6 py-4 font-bold">Salary</th>
                    <th className="px-6 py-4 font-bold">Status</th>
                    <th className="px-6 py-4 font-bold">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {jobs.map((job) => (
                    <tr
                      key={job._id}
                      className="border-t border-[#eee4d8] transition hover:bg-[#faf7f2] dark:border-[#38332e] dark:hover:bg-[#302c28]/70"
                    >
                      <td className="px-6 py-5">
                        <span className="font-bold text-[#292824] dark:text-white">
                          {job.title}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-sm text-[#958779] dark:text-gray-400">
                        {job.location}
                      </td>

                      <td className="px-6 py-5 text-sm text-[#958779] dark:text-gray-400">
                        {job.jobType}
                      </td>

                      <td className="px-6 py-5 text-sm font-medium text-[#51483e] dark:text-gray-300">
                        ₹{job.salary?.min} - ₹{job.salary?.max}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={`inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-xs font-bold ${
                            job.status?.toLowerCase() === "active"
                              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                              : "bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-300"
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              job.status?.toLowerCase() === "active"
                                ? "bg-emerald-500"
                                : "bg-red-500"
                            }`}
                          ></span>
                          {job.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          <button
                            onClick={() => openEditForm(job)}
                            className="text-sm font-bold text-[#d97736] transition hover:text-[#bd632c] dark:text-[#ffca9c] dark:hover:text-[#f4a66e]"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => deleteJob(job._id)}
                            className="text-sm font-bold text-red-500 transition hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* EDIT JOB MODAL */}
      {editJob && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[#171717]/75 p-4 backdrop-blur-sm">
          <form
            onSubmit={updateJob}
            className="my-8 w-full max-w-2xl rounded-3xl border border-[#eee4d8] bg-white p-6 shadow-2xl dark:border-[#38332e] dark:bg-[#222222] sm:p-8"
          >
            {/* MODAL HEADER */}
            <div className="mb-7 flex items-center justify-between border-b border-[#eee4d8] pb-5 dark:border-[#38332e]">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#d97736] dark:text-[#ffca9c]">
                  Job Management
                </span>

                <h2 className="mt-1 text-2xl font-bold text-[#292824] dark:text-white">
                  Edit Job
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setEditJob(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-[#faf7f2] text-2xl text-[#958779] transition hover:bg-[#fff0e2] hover:text-[#d97736] dark:bg-[#302c28] dark:text-gray-300 dark:hover:bg-[#493426]"
              >
                ×
              </button>
            </div>

            {/* EDIT FORM */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
              <div>
                <label className={labelClass}>Job Title</label>
                <input
                  name="title"
                  value={editJob.title}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Location</label>
                <input
                  name="location"
                  value={editJob.location}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Job Type</label>
                <select
                  name="jobType"
                  value={editJob.jobType}
                  onChange={handleChange}
                  required
                  className={inputClass}
                >
                  <option value="">Select Job Type</option>
                  <option value="Full Time">Full Time</option>
                  <option value="Part Time">Part Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Contract">Contract</option>
                  <option value="Remote">Remote</option>
                </select>
              </div>

              <div>
                <label className={labelClass}>Minimum Salary</label>
                <input
                  type="number"
                  name="min"
                  value={editJob.salary.min}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Maximum Salary</label>
                <input
                  type="number"
                  name="max"
                  value={editJob.salary.max}
                  onChange={handleChange}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className={labelClass}>Status</label>
                <select
                  name="status"
                  value={editJob.status}
                  onChange={handleChange}
                  className={inputClass}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="mt-5">
              <label className={labelClass}>Job Description</label>

              <textarea
                name="description"
                value={editJob.description}
                onChange={handleChange}
                required
                rows="5"
                className={`${inputClass} resize-y`}
              />
            </div>

            {/* MODAL ACTIONS */}
            <div className="mt-8 flex flex-col-reverse gap-3 border-t border-[#eee4d8] pt-6 dark:border-[#38332e] sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setEditJob(null)}
                className="rounded-xl border border-[#eadfd1] px-6 py-3 text-sm font-semibold text-[#51483e] transition hover:bg-[#faf7f2] dark:border-[#494039] dark:text-gray-300 dark:hover:bg-[#302c28]"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-[#d97736] px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-[#bd632c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving ? "Updating..." : "Update Job"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

export default ManageJobs;
