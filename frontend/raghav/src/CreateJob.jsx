import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080";

function CreateJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    requirements: "",
    skills: "",
    qualification: "",
    experience: "",
    salaryMin: "",
    salaryMax: "",
    jobType: "",
    location: "",
    vacancies: 1,
    lastDate: "",
  });

  const [loading, setLoading] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAuthError = (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("role");

      navigate("/login");
      return true;
    }

    return false;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (Number(formData.salaryMin) > Number(formData.salaryMax)) {
      alert("Minimum salary cannot be greater than maximum salary");
      return;
    }

    if (Number(formData.vacancies) < 1) {
      alert("Number of vacancies must be at least 1");
      return;
    }

    if (formData.lastDate < getTodayDate()) {
      alert("Last date cannot be in the past");
      return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      setLoading(true);

      const jobData = {
        title: formData.title.trim(),
        description: formData.description.trim(),

        requirements: formData.requirements
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        skills: formData.skills
          .split(",")
          .map((item) => item.trim())
          .filter(Boolean),

        qualification: formData.qualification.trim(),
        experience: formData.experience.trim(),

        salary: {
          min: Number(formData.salaryMin),
          max: Number(formData.salaryMax),
        },

        jobType: formData.jobType,
        location: formData.location.trim(),
        vacancies: Number(formData.vacancies),
        lastDate: formData.lastDate,
      };

      const response = await axios.post(`${API}/api/job/create`, jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message || "Job created successfully");
      navigate("/company/dashboard");
    } catch (error) {
      if (!handleAuthError(error)) {
        alert(error.response?.data?.message || "Job creation failed");
      }
    } finally {
      setLoading(false);
    }
  };

  const inputClass =
    "w-full rounded-xl border border-[#eadfd1] bg-[#faf7f2] px-4 py-3 text-sm text-[#292824] outline-none transition duration-200 placeholder:text-[#aa9f93] focus:border-[#d97736] focus:ring-2 focus:ring-[#d97736]/10 dark:border-[#494039] dark:bg-[#302c28] dark:text-white dark:placeholder:text-gray-500 dark:focus:border-[#d97736]";

  const labelClass =
    "mb-2 block text-sm font-semibold text-[#51483e] dark:text-gray-200";

  return (
    <div className="min-h-screen bg-[#faf7f2] px-4 py-8 text-[#292824] transition-colors duration-300 dark:bg-[#171717] dark:text-white sm:px-6 lg:py-12">
      <div className="mx-auto max-w-4xl overflow-hidden rounded-3xl border border-[#eee4d8] bg-white shadow-sm transition-colors duration-300 dark:border-[#38332e] dark:bg-[#222222]">
        {/* TOP SECTION */}
        <div className="flex items-center justify-between border-b border-[#eee4d8] px-6 py-5 dark:border-[#38332e] sm:px-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-sm font-semibold text-[#958779] transition hover:text-[#d97736] dark:text-gray-400 dark:hover:text-[#d97736]"
          >
            <span className="text-lg">←</span>
            Back
          </button>

          <ThemeToggle />
        </div>

        <div className="p-6 sm:p-10">
          {/* HEADING */}
          <div className="mb-9">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#e9b88e] bg-[#fff0e2] px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a85c2b] dark:border-[#60442f] dark:bg-[#493426] dark:text-[#ffca9c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97736]"></span>
              Company Workspace
            </div>

            <h2 className="text-3xl font-bold tracking-tight text-[#292824] dark:text-white sm:text-4xl">
              Post a New Vacancy
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#958779] dark:text-gray-400">
              Enter the job details below to publish your vacancy and connect
              with potential candidates.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7">
            {/* BASIC DETAILS */}
            <div>
              <h3 className="mb-5 border-b border-[#eee4d8] pb-3 text-base font-bold text-[#292824] dark:border-[#38332e] dark:text-white">
                Basic Job Information
              </h3>

              <div className="space-y-5">
                <div>
                  <label className={labelClass}>Job Title</label>

                  <input
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="MERN Stack Developer"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Description</label>

                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter job description"
                    rows="4"
                    className={`${inputClass} resize-y`}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Requirements</label>

                  <input
                    name="requirements"
                    value={formData.requirements}
                    onChange={handleChange}
                    placeholder="Good communication, Problem solving"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-[#958779] dark:text-gray-500">
                    Separate multiple requirements with commas.
                  </p>
                </div>

                <div>
                  <label className={labelClass}>Skills</label>

                  <input
                    name="skills"
                    value={formData.skills}
                    onChange={handleChange}
                    placeholder="React, Node.js, MongoDB"
                    className={inputClass}
                  />

                  <p className="mt-2 text-xs text-[#958779] dark:text-gray-500">
                    Separate multiple skills with commas.
                  </p>
                </div>
              </div>
            </div>

            {/* JOB REQUIREMENTS */}
            <div>
              <h3 className="mb-5 border-b border-[#eee4d8] pb-3 text-base font-bold text-[#292824] dark:border-[#38332e] dark:text-white">
                Candidate Requirements
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Qualification</label>

                  <input
                    name="qualification"
                    value={formData.qualification}
                    onChange={handleChange}
                    placeholder="BCA / B.Tech"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Experience</label>

                  <input
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    placeholder="Fresher / 2 Years"
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            {/* JOB DETAILS */}
            <div>
              <h3 className="mb-5 border-b border-[#eee4d8] pb-3 text-base font-bold text-[#292824] dark:border-[#38332e] dark:text-white">
                Salary & Job Details
              </h3>

              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                <div>
                  <label className={labelClass}>Minimum Salary</label>

                  <input
                    type="number"
                    name="salaryMin"
                    value={formData.salaryMin}
                    onChange={handleChange}
                    placeholder="20000"
                    min="0"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Maximum Salary</label>

                  <input
                    type="number"
                    name="salaryMax"
                    value={formData.salaryMax}
                    onChange={handleChange}
                    placeholder="40000"
                    min="0"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Job Type</label>

                  <select
                    name="jobType"
                    value={formData.jobType}
                    onChange={handleChange}
                    className={inputClass}
                    required
                  >
                    <option value="">Select Job Type</option>
                    <option value="Full-time">Full-time</option>
                    <option value="Part-time">Part-time</option>
                    <option value="Internship">Internship</option>
                    <option value="Contract">Contract</option>
                  </select>
                </div>

                <div>
                  <label className={labelClass}>Location</label>

                  <input
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="Jaipur, Rajasthan"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Number of Vacancies</label>

                  <input
                    type="number"
                    name="vacancies"
                    value={formData.vacancies}
                    onChange={handleChange}
                    min="1"
                    className={inputClass}
                    required
                  />
                </div>

                <div>
                  <label className={labelClass}>Last Date to Apply</label>

                  <input
                    type="date"
                    name="lastDate"
                    value={formData.lastDate}
                    onChange={handleChange}
                    min={getTodayDate()}
                    className={inputClass}
                    required
                  />
                </div>
              </div>
            </div>

            {/* SUBMIT */}
            <div className="border-t border-[#eee4d8] pt-6 dark:border-[#38332e]">
              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-xl bg-[#d97736] py-3.5 font-bold text-white shadow-sm transition duration-300 hover:bg-[#bd632c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Publishing..." : "Publish Job"}
              </button>

              <p className="mt-3 text-center text-xs text-[#958779] dark:text-gray-500">
                Review your job details before publishing.
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateJob;
