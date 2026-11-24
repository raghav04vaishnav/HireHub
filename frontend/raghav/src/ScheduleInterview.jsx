import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080/api/interview";

function ScheduleInterview() {
  const { state } = useLocation();
  const navigate = useNavigate();

  const jobApplyId = state?.jobApplyId;

  const [formData, setFormData] = useState({
    interviewDate: "",
    interviewTime: "",
    jobDescription: state?.jobTitle || "",
    interviewMode: "online",
    meetLink: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!jobApplyId) {
      alert("Application ID not found");
      return;
    }

    if (formData.interviewMode === "online" && !formData.meetLink.trim()) {
      alert("Please enter Google Meet link");
      return;
    }

    try {
      setLoading(true);

      const token = localStorage.getItem("token");

      const response = await axios.post(
        `${API}/schedule`,
        {
          jobApplyId,
          interviewDate: formData.interviewDate,
          interviewTime: formData.interviewTime,
          jobDescription: formData.jobDescription,
          interviewMode: formData.interviewMode,
          meetLink:
            formData.interviewMode === "online" ? formData.meetLink : "",
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message || "Interview scheduled successfully");

      navigate("/company/manage-interviews");
    } catch (error) {
      console.log(error);
      alert(error.response?.data?.message || "Failed to schedule interview");
    } finally {
      setLoading(false);
    }
  };

  if (!jobApplyId) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#F8F5F0] dark:bg-gray-900 text-gray-800 dark:text-white">
        <h2 className="text-xl font-semibold mb-4">
          Application details not found
        </h2>

        <button
          onClick={() => navigate("/company/manage-applicants")}
          className="bg-[#E99545] text-white px-5 py-2 rounded-lg"
        >
          Back to Applicants
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-gray-900 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Schedule Interview
          </h1>

          <ThemeToggle />
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md">
          <div className="mb-6">
            <p className="text-gray-500 dark:text-gray-400 text-sm">
              Candidate
            </p>

            <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
              {state?.applicantName || "Candidate"}
            </h2>

            <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">
              {state?.jobTitle || "Job"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Interview Date
              </label>

              <input
                type="date"
                name="interviewDate"
                value={formData.interviewDate}
                onChange={handleChange}
                required
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Interview Time
              </label>

              <input
                type="text"
                name="interviewTime"
                value={formData.interviewTime}
                onChange={handleChange}
                placeholder="Example: 11:00 AM"
                required
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Job Description
              </label>

              <textarea
                name="jobDescription"
                value={formData.jobDescription}
                onChange={handleChange}
                rows="4"
                required
                placeholder="Enter interview details"
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              />
            </div>

            <div>
              <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                Interview Mode
              </label>

              <select
                name="interviewMode"
                value={formData.interviewMode}
                onChange={handleChange}
                className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>

            {formData.interviewMode === "online" && (
              <div>
                <label className="block mb-2 font-medium text-gray-700 dark:text-gray-200">
                  Google Meet Link
                </label>

                <input
                  type="url"
                  name="meetLink"
                  value={formData.meetLink}
                  onChange={handleChange}
                  required
                  placeholder="https://meet.google.com/..."
                  className="w-full p-3 border rounded-lg bg-white dark:bg-gray-700 dark:text-white dark:border-gray-600"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E99545] hover:bg-orange-600 text-white py-3 rounded-lg font-semibold disabled:opacity-60"
            >
              {loading ? "Scheduling..." : "Schedule Interview"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ScheduleInterview;
