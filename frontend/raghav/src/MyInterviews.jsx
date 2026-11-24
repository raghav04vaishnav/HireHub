import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080";

function MyInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(`${API}/api/interview/my-interviews`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterviews(response.data.interviews || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to fetch interviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInterviews();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-[#1E1E1E] text-gray-800 dark:text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">My Interviews</h1>
            <p className="text-gray-500 dark:text-gray-400">
              Check your interview schedule and results
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => navigate("/user/dashboard")}
              className="px-4 py-2 rounded-lg bg-[#E99545] text-white"
            >
              Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <p className="text-center py-10">Loading interviews...</p>
        ) : interviews.length === 0 ? (
          <div className="bg-white dark:bg-[#2B2B2B] rounded-xl p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">
              No Interviews Scheduled
            </h2>
            <p className="text-gray-500 dark:text-gray-400">
              Your interview schedules will appear here once a company schedules
              one.
            </p>
          </div>
        ) : (
          <div className="grid gap-5">
            {interviews.map((interview) => {
              const application = interview.jobApplyId;
              const job = application?.jobId;

              return (
                <div
                  key={interview._id}
                  className="bg-white dark:bg-[#2B2B2B] rounded-xl shadow p-6"
                >
                  <div className="flex flex-wrap justify-between gap-3 mb-5">
                    <div>
                      <h2 className="text-xl font-bold">
                        {job?.title || interview.jobDescription}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {job?.location || "Location not available"}
                      </p>
                    </div>

                    <span className="h-fit px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm capitalize">
                      {interview.status.replace("_", " ")}
                    </span>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4 mb-5">
                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Interview Date
                      </p>
                      <p>
                        {new Date(interview.interviewDate).toLocaleDateString()}
                      </p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Interview Time
                      </p>
                      <p>{interview.interviewTime}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Interview Mode
                      </p>
                      <p className="capitalize">{interview.interviewMode}</p>
                    </div>

                    {interview.interviewMode === "online" && (
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Google Meet
                        </p>
                        <a
                          href={interview.meetLink}
                          target="_blank"
                          rel="noreferrer"
                          className="text-orange-500 underline break-all"
                        >
                          Join Meeting
                        </a>
                      </div>
                    )}
                  </div>

                  <div className="border-t dark:border-gray-600 pt-4">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Job Description
                    </p>
                    <p>{interview.jobDescription}</p>

                    <div className="mt-4">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Interview Feedback
                      </p>
                      <p>{interview.feedback || "Feedback is pending"}</p>
                    </div>

                    <div className="mt-3">
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Feedback Status
                      </p>
                      <p className="capitalize">{interview.feedbackStatus}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default MyInterviews;
