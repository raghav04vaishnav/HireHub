import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const response = await axios.get(`${API}/api/job/${id}`);

        const jobData =
          response.data.job || response.data.data || response.data;

        setJob(jobData);
      } catch (error) {
        setError(error.response?.data?.message || "Unable to load job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id]);

  const formatDate = (date) => {
    if (!date) return "Not specified";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#faf7f2] text-[#292824] dark:bg-[#171717] dark:text-white">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-[#f1d8c3] border-t-[#d97736] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="font-medium">Loading job details...</p>
        </div>
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf7f2] dark:bg-[#171717] px-5">
        <div className="bg-white dark:bg-[#222222] border border-[#eee5da] dark:border-[#38332e] rounded-2xl p-10 text-center max-w-md w-full shadow-sm">
          <div className="text-5xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-[#292824] dark:text-white mb-3">
            Job Not Found
          </h2>
          <p className="text-red-600 mb-6">{error || "Job not found"}</p>

          <button
            onClick={() => navigate("/jobs")}
            className="bg-[#d97736] hover:bg-[#c96b2e] text-white px-6 py-3 rounded-xl font-semibold transition"
          >
            Back to Jobs
          </button>
        </div>
      </div>
    );
  }

  const companyName =
    job.company?.companyName || job.companyDetails?.companyName || "Company";

  const cardClass =
    "bg-white border border-[#eee5da] rounded-2xl p-6 md:p-8 shadow-sm dark:bg-[#222222] dark:border-[#38332e]";

  const headingClass = "text-xl font-bold text-[#292824] mb-5 dark:text-white";

  const textClass = "text-[#81776c] dark:text-gray-300";

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
            className="bg-[#fff3e8] text-[#c96b2e] hover:bg-[#fce6d4] px-4 py-2 rounded-lg font-semibold transition dark:bg-[#38291f] dark:text-[#f0a36c]"
          >
            All Jobs
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-5 py-8 md:py-10">
        <button
          onClick={() => navigate("/jobs")}
          className="text-[#81776c] hover:text-[#d97736] mb-6 font-medium transition dark:text-gray-300"
        >
          ← Back to Jobs
        </button>

        {/* Job Header */}
        <div className={cardClass}>
          <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
            <div className="flex-1">
              <span className="inline-block bg-[#fff3e8] text-[#c96b2e] text-xs font-bold px-3 py-1.5 rounded-full mb-4 dark:bg-[#38291f] dark:text-[#f0a36c]">
                JOB DETAILS
              </span>

              <h2 className="text-2xl md:text-3xl font-bold text-[#292824] dark:text-white">
                {job.title}
              </h2>

              <p className={`${textClass} mt-2 text-lg font-medium`}>
                {companyName}
              </p>

              <div className={`flex flex-wrap gap-3 mt-5 text-sm ${textClass}`}>
                <span className="bg-[#faf7f2] px-4 py-2 rounded-lg border border-[#eee5da] dark:bg-[#303030] dark:border-[#45403a]">
                  📍 {job.location}
                </span>

                <span className="bg-[#faf7f2] px-4 py-2 rounded-lg border border-[#eee5da] dark:bg-[#303030] dark:border-[#45403a]">
                  💼 {job.jobType}
                </span>

                <span className="bg-[#faf7f2] px-4 py-2 rounded-lg border border-[#eee5da] dark:bg-[#303030] dark:border-[#45403a]">
                  ✨ {job.experience} experience
                </span>
              </div>
            </div>

            <div className="bg-[#fff8f1] border border-[#f5e3d3] rounded-xl p-5 min-w-[180px] dark:bg-[#30251e] dark:border-[#493729]">
              <p className="text-2xl font-bold text-[#d97736]">
                ₹{job.salary?.min} - ₹{job.salary?.max}
              </p>

              <p className="text-sm text-[#958779] mt-1 dark:text-gray-400">
                Salary
              </p>
            </div>
          </div>

          {job.status?.toLowerCase() === "active" ? (
            <button
              onClick={() => navigate(`/job/${job._id}/apply`)}
              className="mt-8 bg-[#d97736] hover:bg-[#c96b2e] text-white px-8 py-3 rounded-xl font-semibold transition shadow-sm"
            >
              Apply Now →
            </button>
          ) : (
            <p className="mt-8 bg-red-50 text-red-600 px-4 py-3 rounded-xl font-semibold dark:bg-red-950/30">
              Applications are closed for this job.
            </p>
          )}
        </div>

        {/* Job Description */}
        <div className={`${cardClass} mt-6`}>
          <h3 className={headingClass}>Job Description</h3>

          <p className={`${textClass} leading-8 whitespace-pre-line`}>
            {job.description}
          </p>
        </div>

        {/* Requirements */}
        <div className={`${cardClass} mt-6`}>
          <h3 className={headingClass}>Requirements</h3>

          {job.requirements?.length > 0 ? (
            <ul className={`list-disc pl-6 ${textClass} space-y-3`}>
              {job.requirements.map((item, index) => (
                <li key={index} className="pl-1 leading-7">
                  {item}
                </li>
              ))}
            </ul>
          ) : (
            <p className={textClass}>No requirements specified.</p>
          )}
        </div>

        {/* Skills */}
        <div className={`${cardClass} mt-6`}>
          <h3 className={headingClass}>Required Skills</h3>

          <div className="flex flex-wrap gap-3">
            {job.skills?.length > 0 ? (
              job.skills.map((skill, index) => (
                <span
                  key={index}
                  className="bg-[#fff3e8] text-[#bd642d] px-4 py-2 rounded-lg text-sm font-semibold border border-[#f3dfce] dark:bg-[#38291f] dark:text-[#f0a36c] dark:border-[#493729]"
                >
                  {skill}
                </span>
              ))
            ) : (
              <p className={textClass}>No skills specified.</p>
            )}
          </div>
        </div>

        {/* Other Details */}
        <div className={`${cardClass} mt-6`}>
          <h3 className={headingClass}>Additional Details</h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="bg-[#faf7f2] rounded-xl p-4 dark:bg-[#303030]">
              <p className="text-sm text-[#958779] mb-2">Qualification</p>
              <p className="font-semibold text-[#292824] dark:text-white">
                {job.qualification}
              </p>
            </div>

            <div className="bg-[#faf7f2] rounded-xl p-4 dark:bg-[#303030]">
              <p className="text-sm text-[#958779] mb-2">Vacancies</p>
              <p className="font-semibold text-[#292824] dark:text-white">
                {job.vacancies}
              </p>
            </div>

            <div className="bg-[#faf7f2] rounded-xl p-4 dark:bg-[#303030]">
              <p className="text-sm text-[#958779] mb-2">Last Date</p>
              <p className="font-semibold text-[#292824] dark:text-white">
                {formatDate(job.lastDate)}
              </p>
            </div>

            <div className="bg-[#faf7f2] rounded-xl p-4 dark:bg-[#303030]">
              <p className="text-sm text-[#958779] mb-2">Status</p>
              <p className="font-semibold text-[#292824] dark:text-white">
                {job.status}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
