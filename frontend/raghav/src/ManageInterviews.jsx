import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080";

function ManageInterviews() {
  const navigate = useNavigate();

  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [feedback, setFeedback] = useState({});
  const [result, setResult] = useState({});

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${API}/api/interview/company-interviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

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

  const updateResult = async (id) => {
    if (!result[id]) {
      alert("Please select interview result");
      return;
    }

    if (!feedback[id]?.trim()) {
      alert("Please enter feedback");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        `${API}/api/interview/result/${id}`,
        {
          status: result[id],
          feedback: feedback[id],
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      alert(response.data.message || "Interview result updated!");
      fetchInterviews();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update result");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F5F0] dark:bg-[#1E1E1E] text-gray-800 dark:text-white p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-2xl font-bold">Manage Interviews</h1>
            <p className="text-gray-500 dark:text-gray-400">
              View scheduled interviews and update results
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => navigate("/company/dashboard")}
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
            No interviews scheduled yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {interviews.map((interview) => {
              const application = interview.jobApplyId;
              const candidate = application?.userId;
              const job = application?.jobId;

              return (
                <div
                  key={interview._id}
                  className="bg-white dark:bg-[#2B2B2B] rounded-xl shadow p-6"
                >
                  <div className="flex flex-wrap justify-between gap-4 mb-5">
                    <div>
                      <h2 className="text-xl font-bold">
                        {candidate?.name || "Candidate"}
                      </h2>
                      <p className="text-gray-500 dark:text-gray-400">
                        {candidate?.email || "No email"}
                      </p>
                      <p className="mt-2 font-medium">
                        {job?.title || interview.jobDescription}
                      </p>
                    </div>

                    <div>
                      <span className="px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-sm">
                        {interview.status}
                      </span>
                    </div>
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

                  <div className="mb-5">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Job Description
                    </p>
                    <p>{interview.jobDescription}</p>
                  </div>

                  {interview.status === "pending" ? (
                    <div className="border-t dark:border-gray-600 pt-5">
                      <h3 className="font-semibold mb-3">
                        Update Interview Result
                      </h3>

                      <select
                        value={result[interview._id] || ""}
                        onChange={(e) =>
                          setResult({
                            ...result,
                            [interview._id]: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-lg border dark:bg-[#383838] dark:border-gray-600 mb-3"
                      >
                        <option value="">Select Result</option>
                        <option value="cleared">Cleared</option>
                        <option value="not_cleared">Not Cleared</option>
                      </select>

                      <textarea
                        rows="3"
                        placeholder="Enter candidate feedback"
                        value={feedback[interview._id] || ""}
                        onChange={(e) =>
                          setFeedback({
                            ...feedback,
                            [interview._id]: e.target.value,
                          })
                        }
                        className="w-full p-3 rounded-lg border dark:bg-[#383838] dark:border-gray-600 mb-3"
                      />

                      <button
                        onClick={() => updateResult(interview._id)}
                        className="bg-[#E99545] hover:bg-orange-600 text-white px-5 py-2 rounded-lg"
                      >
                        Submit Result
                      </button>
                    </div>
                  ) : (
                    <div className="border-t dark:border-gray-600 pt-4">
                      <p className="font-semibold">
                        Final Result:{" "}
                        <span className="capitalize">
                          {interview.status.replace("_", " ")}
                        </span>
                      </p>
                      <p className="text-gray-500 dark:text-gray-400 mt-2">
                        Feedback: {interview.feedback || "No feedback"}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default ManageInterviews;
