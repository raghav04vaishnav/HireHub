import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080";

function ManageApplicants() {
  const navigate = useNavigate();

  const [applicants, setApplicants] = useState([]);
  const [blockedUsers, setBlockedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [updatingId, setUpdatingId] = useState("");
  const [blockingId, setBlockingId] = useState("");
  const [unblockingId, setUnblockingId] = useState("");
  const [showBlockedUsers, setShowBlockedUsers] = useState(false);
  const [resumePreview, setResumePreview] = useState("");
  const [previewLoading, setPreviewLoading] = useState("");

  const token = localStorage.getItem("token");

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

  const fetchApplicants = async () => {
    try {
      setLoading(true);
      setError("");

      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get(
        `${API}/api/job-apply/company-applicants`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      );

      setApplicants(response.data.applicants || []);
    } catch (err) {
      if (!handleAuthError(err)) {
        setError(err.response?.data?.message || "Failed to fetch applicants");
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchBlockedUsers = async () => {
    try {
      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API}/api/job-apply/blocked-users`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      setBlockedUsers(response.data.blockedUsers || []);
    } catch (err) {
      if (!handleAuthError(err)) {
        console.log(
          "Blocked users error:",
          err.response?.data?.message || err.message,
        );
      }
    }
  };

  useEffect(() => {
    fetchApplicants();
    fetchBlockedUsers();
  }, []);

  useEffect(() => {
    return () => {
      if (resumePreview) {
        URL.revokeObjectURL(resumePreview);
      }
    };
  }, [resumePreview]);

  const viewResume = async (id) => {
    try {
      setPreviewLoading(id);

      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        navigate("/login");
        return;
      }

      const response = await axios.get(`${API}/api/job-apply/resume/${id}`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
        responseType: "blob",
      });

      const pdfBlob = new Blob([response.data], {
        type: "application/pdf",
      });

      const previewUrl = URL.createObjectURL(pdfBlob);

      setResumePreview(previewUrl);
    } catch (err) {
      if (!handleAuthError(err)) {
        alert(err.response?.data?.message || "Unable to preview resume");
      }
    } finally {
      setPreviewLoading("");
    }
  };

  const closePreview = () => {
    setResumePreview("");
  };

  // UPDATE APPLICATION STATUS
  const updateStatus = async (id, status) => {
    try {
      setUpdatingId(id);

      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        navigate("/login");
        return;
      }

      await axios.put(
        `${API}/api/job-apply/status/${id}`,
        { status },
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      );

      setApplicants((prev) =>
        prev.map((applicant) =>
          applicant._id === id ? { ...applicant, status } : applicant,
        ),
      );
    } catch (err) {
      if (!handleAuthError(err)) {
        alert(err.response?.data?.message || "Status update failed");
      }
    } finally {
      setUpdatingId("");
    }
  };

  const goToScheduleInterview = (applicant) => {
    navigate("/company/schedule-interview", {
      state: {
        jobApplyId: applicant._id,
        applicantName: applicant.userId?.name || "Candidate",
        jobTitle: applicant.jobId?.title || "Job",
      },
    });
  };

  // BLOCK USER
  const blockUser = async (userId, userName) => {
    if (!userId) return;

    const confirmBlock = window.confirm(
      `Are you sure you want to block ${userName}? This user will not be able to apply for any of your company's jobs.`,
    );

    if (!confirmBlock) return;

    try {
      setBlockingId(userId);

      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        navigate("/login");
        return;
      }

      const response = await axios.post(
        `${API}/api/job-apply/block-user/${userId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      );

      alert(response.data.message || "User blocked successfully");

      await fetchBlockedUsers();
    } catch (err) {
      if (!handleAuthError(err)) {
        alert(err.response?.data?.message || "Unable to block user");
      }
    } finally {
      setBlockingId("");
    }
  };

  // UNBLOCK USER
  const unblockUser = async (userId, userName) => {
    if (!userId) return;

    const confirmUnblock = window.confirm(
      `Are you sure you want to unblock ${userName}?`,
    );

    if (!confirmUnblock) return;

    try {
      setUnblockingId(userId);

      const currentToken = localStorage.getItem("token");

      if (!currentToken) {
        navigate("/login");
        return;
      }

      const response = await axios.delete(
        `${API}/api/job-apply/unblock-user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        },
      );

      alert(response.data.message || "User unblocked successfully");

      await fetchBlockedUsers();
    } catch (err) {
      if (!handleAuthError(err)) {
        alert(err.response?.data?.message || "Unable to unblock user");
      }
    } finally {
      setUnblockingId("");
    }
  };

  // CHECK IF USER IS BLOCKED
  const isUserBlocked = (userId) => {
    return blockedUsers.some((item) => item.userId?._id === userId);
  };

  const getStatusColor = (status) => {
    if (status === "accepted")
      return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300";

    if (status === "shortlisted")
      return "bg-[#fff0e2] text-[#a85c2b] dark:bg-[#493426] dark:text-[#ffca9c]";

    if (status === "rejected")
      return "bg-red-50 text-red-700 dark:bg-red-900/30 dark:text-red-300";

    return "bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300";
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] text-[#292824] dark:bg-[#171717] dark:text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-4 border-[#d97736]/20 border-t-[#d97736]"></div>
          <p className="text-sm font-medium text-[#958779] dark:text-gray-400">
            Loading applicants...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf7f2] p-5 text-[#292824] transition-colors duration-300 dark:bg-[#171717] dark:text-white md:p-10">
      <div className="mx-auto max-w-6xl">
        {/* HEADER */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-[#d97736]/20 bg-[#fff0e2] px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-[#a85c2b] dark:bg-[#493426] dark:text-[#ffca9c]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d97736]"></span>
              Company Workspace
            </div>

            <h1 className="text-3xl font-bold text-[#292824] dark:text-white">
              Manage Applicants
            </h1>

            <p className="mt-2 text-sm text-[#958779] dark:text-gray-400">
              View applications and manage candidate status.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => navigate("/company/dashboard")}
              className="rounded-xl border border-[#eee4d8] bg-white px-4 py-2.5 text-sm font-semibold text-[#51483e] transition hover:border-[#d97736]/40 hover:text-[#d97736] dark:border-[#38332e] dark:bg-[#222222] dark:text-gray-300 dark:hover:text-[#ffca9c]"
            >
              ← Dashboard
            </button>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="mb-6 grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#958779] dark:text-gray-400">
                  Total Applicants
                </p>

                <h2 className="mt-2 text-3xl font-bold text-[#292824] dark:text-white">
                  {applicants.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fff0e2] text-2xl dark:bg-[#493426]">
                👥
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#958779] dark:text-gray-400">
                  Blocked Users
                </p>

                <h2 className="mt-2 text-3xl font-bold text-red-600 dark:text-red-400">
                  {blockedUsers.length}
                </h2>
              </div>

              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-red-50 text-2xl dark:bg-red-900/20">
                🚫
              </div>
            </div>
          </div>
        </div>

        {/* ERROR */}
        {error && (
          <div className="mb-5 rounded-xl border border-red-200 bg-red-50 p-4 text-red-700 dark:border-red-900/40 dark:bg-red-900/20 dark:text-red-300">
            {error}

            <button
              onClick={fetchApplicants}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* BLOCKED USERS */}
        <div className="mb-6 rounded-2xl border border-[#eee4d8] bg-white p-5 shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-[#292824] dark:text-white">
                Blocked Users
              </h2>

              <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                Manage users who cannot apply to your company's jobs.
              </p>
            </div>

            <button
              onClick={() => setShowBlockedUsers(!showBlockedUsers)}
              className="rounded-xl bg-[#d97736] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#bd632c]"
            >
              {showBlockedUsers ? "Hide Blocked Users" : "View Blocked Users"}
            </button>
          </div>

          {showBlockedUsers && (
            <div className="mt-5 border-t border-[#eee4d8] pt-5 dark:border-[#38332e]">
              {blockedUsers.length === 0 ? (
                <p className="py-6 text-center text-sm text-[#958779] dark:text-gray-400">
                  No blocked users found.
                </p>
              ) : (
                <div className="space-y-3">
                  {blockedUsers.map((item) => (
                    <div
                      key={item._id}
                      className="flex flex-col gap-4 rounded-xl border border-red-100 bg-red-50/70 p-4 sm:flex-row sm:items-center sm:justify-between dark:border-red-900/40 dark:bg-red-900/10"
                    >
                      <div>
                        <h3 className="font-bold text-[#292824] dark:text-white">
                          {item.userId?.name || "Unknown User"}
                        </h3>

                        <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                          {item.userId?.email || "Email unavailable"}
                        </p>

                        <span className="mt-2 inline-block rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                          Blocked
                        </span>
                      </div>

                      <button
                        onClick={() =>
                          unblockUser(
                            item.userId?._id,
                            item.userId?.name || "this user",
                          )
                        }
                        disabled={unblockingId === item.userId?._id}
                        className="rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        {unblockingId === item.userId?._id
                          ? "Unblocking..."
                          : "Unblock User"}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* APPLICANTS */}
        {applicants.length === 0 ? (
          <div className="rounded-2xl border border-[#eee4d8] bg-white p-10 text-center shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
            <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0e2] text-3xl dark:bg-[#493426]">
              📄
            </div>

            <h2 className="text-xl font-semibold text-[#292824] dark:text-white">
              No Applications Yet
            </h2>

            <p className="mt-2 text-sm text-[#958779] dark:text-gray-400">
              Applications for your jobs will appear here.
            </p>
          </div>
        ) : (
          <div className="space-y-5">
            {applicants.map((applicant) => {
              const userId = applicant.userId?._id;
              const blocked = userId ? isUserBlocked(userId) : false;

              return (
                <div
                  key={applicant._id}
                  className="rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm transition hover:shadow-md dark:border-[#38332e] dark:bg-[#222222]"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:justify-between">
                    <div>
                      <h2 className="text-xl font-bold text-[#292824] dark:text-white">
                        {applicant.userId?.name || "Candidate"}
                      </h2>

                      <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                        {applicant.userId?.email}
                      </p>

                      <p className="mt-3 font-semibold text-[#51483e] dark:text-gray-200">
                        Job: {applicant.jobId?.title || "Job"}
                      </p>

                      <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                        Location: {applicant.jobId?.location || "Not specified"}
                      </p>

                      <p className="mt-3 text-sm leading-relaxed text-[#51483e] dark:text-gray-300">
                        <b>Cover Letter:</b>{" "}
                        {applicant.coverLetter || "Not provided"}
                      </p>
                    </div>

                    <div className="flex flex-col items-start gap-3 md:items-end">
                      <span
                        className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${getStatusColor(applicant.status)}`}
                      >
                        {applicant.status}
                      </span>

                      {blocked && (
                        <span className="rounded-full bg-red-100 px-4 py-2 text-sm font-semibold text-red-700 dark:bg-red-900/40 dark:text-red-300">
                          User Blocked
                        </span>
                      )}

                      {applicant.resume && (
                        <button
                          onClick={() => viewResume(applicant._id)}
                          disabled={previewLoading !== ""}
                          className="font-semibold text-[#d97736] transition hover:text-[#bd632c] hover:underline disabled:opacity-50 dark:text-[#ffca9c]"
                        >
                          {previewLoading === applicant._id
                            ? "Loading Resume..."
                            : "View Resume"}
                        </button>
                      )}
                    </div>
                  </div>

                  {/* UPDATE STATUS */}
                  <div className="mt-5 border-t border-[#eee4d8] pt-5 dark:border-[#38332e]">
                    <p className="mb-3 font-semibold text-[#292824] dark:text-white">
                      Update Application Status
                    </p>

                    <div className="flex flex-wrap gap-3">
                      <button
                        disabled={updatingId === applicant._id}
                        onClick={() =>
                          updateStatus(applicant._id, "shortlisted")
                        }
                        className="rounded-xl bg-[#fff0e2] px-4 py-2 text-sm font-semibold text-[#a85c2b] transition hover:bg-[#fce2c9] disabled:opacity-50 dark:bg-[#493426] dark:text-[#ffca9c] dark:hover:bg-[#5a3d2b]"
                      >
                        {updatingId === applicant._id
                          ? "Updating..."
                          : "Shortlist"}
                      </button>

                      <button
                        disabled={updatingId === applicant._id}
                        onClick={() => updateStatus(applicant._id, "accepted")}
                        className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:opacity-50"
                      >
                        Accept
                      </button>

                      <button
                        disabled={updatingId === applicant._id}
                        onClick={() => updateStatus(applicant._id, "rejected")}
                        className="rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                      >
                        Reject
                      </button>

                      {applicant.status === "accepted" && (
                        <button
                          onClick={() => goToScheduleInterview(applicant)}
                          className="rounded-xl bg-[#d97736] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#bd632c]"
                        >
                          Schedule Interview
                        </button>
                      )}
                    </div>
                  </div>

                  {/* BLOCK USER */}
                  <div className="mt-5 border-t border-[#eee4d8] pt-5 dark:border-[#38332e]">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <p className="font-semibold text-[#292824] dark:text-white">
                          Candidate Restrictions
                        </p>

                        <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                          Prevent this user from applying to your company's
                          jobs.
                        </p>
                      </div>

                      {blocked ? (
                        <button
                          disabled
                          className="cursor-not-allowed rounded-xl bg-[#f0ece6] px-5 py-2.5 text-sm font-semibold text-[#958779] dark:bg-[#302c28] dark:text-gray-400"
                        >
                          Already Blocked
                        </button>
                      ) : (
                        <button
                          onClick={() =>
                            blockUser(
                              userId,
                              applicant.userId?.name || "this user",
                            )
                          }
                          disabled={!userId || blockingId === userId}
                          className="rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 disabled:opacity-50"
                        >
                          {blockingId === userId ? "Blocking..." : "Block User"}
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* RESUME PREVIEW MODAL */}
      {resumePreview && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#171717]/75 p-3 backdrop-blur-sm md:p-6">
          <div className="flex h-[90vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl border border-[#eee4d8] bg-white shadow-2xl dark:border-[#38332e] dark:bg-[#222222]">
            <div className="flex items-center justify-between border-b border-[#eee4d8] p-4 dark:border-[#38332e]">
              <h2 className="text-lg font-bold text-[#292824] dark:text-white">
                Resume Preview
              </h2>

              <button
                onClick={closePreview}
                className="rounded-xl bg-red-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-600"
              >
                Close
              </button>
            </div>

            <iframe
              src={resumePreview}
              title="Resume Preview"
              className="h-full w-full"
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageApplicants;
