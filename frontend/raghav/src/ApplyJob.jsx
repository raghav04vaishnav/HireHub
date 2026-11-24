import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080";

function ApplyJob() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [resume, setResume] = useState(null);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      if (!resume) {
        setError("Please select your resume");
        return;
      }

      const formData = new FormData();
      formData.append("resume", resume);
      formData.append("coverLetter", coverLetter);

      const response = await axios.post(
        `${API}/api/job-apply/apply/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setSuccess(response.data.message);

      setTimeout(() => {
        navigate("/jobs");
      }, 1500);
    } catch (error) {
      setError(error.response?.data?.message || "Application failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResumeChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setResume(null);
      return;
    }

    if (file.type !== "application/pdf") {
      setError("Only PDF files are allowed");
      setResume(null);
      e.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Resume size must be less than 5 MB");
      setResume(null);
      e.target.value = "";
      return;
    }

    setError("");
    setResume(file);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] transition-colors duration-300 dark:bg-[#171717]">
      {/* Navbar */}
      <nav className="bg-white border-b border-[#eee5da] px-5 md:px-10 py-4 flex justify-between items-center dark:bg-[#222222] dark:border-[#38332e]">
        <h1
          onClick={() => navigate("/")}
          className="text-2xl font-bold text-[#292824] cursor-pointer dark:text-white"
        >
          Hire<span className="text-[#d97736]">Hub.</span>
        </h1>

        <div className="flex items-center gap-4">
          <ThemeToggle />

          <button
            onClick={() => navigate("/jobs")}
            className="bg-[#fff3e8] text-[#c96b2e] hover:bg-[#fce6d4] px-4 py-2 rounded-lg text-sm font-semibold transition dark:bg-[#38291f] dark:text-[#f0a36c]"
          >
            All Jobs
          </button>
        </div>
      </nav>

      <div className="max-w-2xl mx-auto px-5 py-10 md:py-14">
        <div className="bg-white border border-[#eee5da] rounded-2xl p-6 md:p-9 shadow-sm dark:bg-[#222222] dark:border-[#38332e]">
          <div className="mb-7">
            <span className="inline-block bg-[#fff3e8] text-[#c96b2e] text-xs font-bold px-3 py-1.5 rounded-full mb-4 dark:bg-[#38291f] dark:text-[#f0a36c]">
              JOB APPLICATION
            </span>

            <h2 className="text-2xl md:text-3xl font-bold text-[#292824] dark:text-white">
              Apply for Job
            </h2>

            <p className="text-[#958779] mt-2 dark:text-gray-400">
              Upload your resume and submit your application.
            </p>
          </div>

          {error && (
            <p className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-xl mb-5 dark:bg-red-950/30 dark:border-red-900 dark:text-red-300">
              {error}
            </p>
          )}

          {success && (
            <p className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl mb-5 dark:bg-green-950/30 dark:border-green-900 dark:text-green-300">
              {success}
            </p>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-7">
              <label className="block font-semibold text-[#292824] mb-3 dark:text-gray-200">
                Upload Resume (PDF) *
              </label>

              <div className="border-2 border-dashed border-[#e8d9c9] bg-[#fdfaf6] rounded-xl p-6 transition hover:border-[#d97736] dark:bg-[#303030] dark:border-[#51463c]">
                <div className="text-center">
                  <div className="w-14 h-14 bg-[#fff0e2] text-[#d97736] rounded-full flex items-center justify-center text-2xl mx-auto mb-3 dark:bg-[#38291f]">
                    📄
                  </div>

                  <p className="text-[#292824] font-medium dark:text-white">
                    Choose your resume file
                  </p>

                  <p className="text-sm text-[#958779] mt-1 dark:text-gray-400">
                    PDF format only
                  </p>

                  <input
                    type="file"
                    accept=".pdf,application/pdf"
                    onChange={handleResumeChange}
                    required
                    className="w-full mt-5 text-sm text-[#81776c] file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:bg-[#fff0e2] file:text-[#c96b2e] file:font-semibold hover:file:bg-[#fce6d4] cursor-pointer dark:text-gray-300 dark:file:bg-[#38291f] dark:file:text-[#f0a36c]"
                  />
                </div>
              </div>

              <p className="text-sm text-[#958779] mt-3 dark:text-gray-400">
                PDF only, maximum size 5 MB.
              </p>

              {resume && (
                <div className="flex items-center gap-2 bg-green-50 text-green-700 p-3 rounded-lg mt-3 dark:bg-green-950/30 dark:text-green-400">
                  <span>✓</span>
                  <p className="text-sm font-medium break-all">
                    Selected: {resume.name}
                  </p>
                </div>
              )}
            </div>

            <div className="mb-7">
              <label className="block font-semibold text-[#292824] mb-3 dark:text-gray-200">
                Cover Letter
              </label>

              <textarea
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                placeholder="Write something about yourself..."
                rows="6"
                className="w-full border border-[#e8dfd4] bg-[#fdfbf8] rounded-xl px-4 py-3 outline-none focus:border-[#d97736] focus:ring-2 focus:ring-[#d97736]/10 transition text-[#292824] placeholder-[#b0a69b] dark:border-[#45403a] dark:bg-[#303030] dark:text-white dark:placeholder-gray-500"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#d97736] hover:bg-[#c96b2e] text-white py-3.5 rounded-xl font-semibold transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Submitting..." : "Submit Application →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ApplyJob;
