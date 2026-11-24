import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080/api/job-apply";

function MyApplications() {
  const navigate = useNavigate();

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          navigate("/login");
          return;
        }

        const response = await fetch(`${API}/my-applications`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || "Unable to fetch applications");
        }

        setApplications(data.applications || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, [navigate]);

  const formatDate = (date) => {
    if (!date) return "N/A";

    return new Date(date).toLocaleDateString("en-IN");
  };

  return (
    <div className="min-h-screen bg-[#F3F0E9] text-[#202A35] dark:bg-gray-950 dark:text-white">
      <nav className="flex items-center justify-between bg-white px-6 py-5 shadow-sm dark:bg-gray-900 md:px-12">
        <h1 className="text-2xl font-bold">
          Hire<span className="text-[#E99545]">Hub</span>
        </h1>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => navigate("/user/dashboard")}
            className="rounded-lg border border-[#202A35] px-4 py-2 text-sm font-semibold dark:border-gray-500"
          >
            Back
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-10">
        <h2 className="text-3xl font-bold">My Applications</h2>

        {loading ? (
          <p className="mt-6">Loading applications...</p>
        ) : error ? (
          <p className="mt-6 text-red-500">{error}</p>
        ) : applications.length === 0 ? (
          <p className="mt-6">You have not applied for any jobs yet.</p>
        ) : (
          <div className="mt-8 space-y-4">
            {applications.map((application) => {
              const job = application.jobId;

              const companyName =
                job?.company?.companyName ||
                job?.companyDetails?.companyName ||
                "N/A";

              return (
                <div
                  key={application._id}
                  className="rounded-xl border border-[#E5DED2] bg-white p-6 shadow-sm dark:border-gray-700 dark:bg-gray-900"
                >
                  <h3 className="text-xl font-bold">
                    {job?.title || "Job not available"}
                  </h3>

                  <p className="mt-2 text-gray-600 dark:text-gray-300">
                    Company: {companyName}
                  </p>

                  <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                    Applied on: {formatDate(application.createdAt)}
                  </p>

                  <p className="mt-3 text-sm font-semibold">
                    Status:{" "}
                    <span className="capitalize text-[#E99545]">
                      {application.status}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}

export default MyApplications;
