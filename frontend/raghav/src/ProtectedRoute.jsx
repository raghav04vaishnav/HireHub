import { useEffect, useState } from "react";
import { Navigate, Link } from "react-router-dom";
import axios from "axios";

function ProtectedRoute({ children, role, showLoginPrompt = false }) {
  const [status, setStatus] = useState("loading");

  const verifyUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      localStorage.removeItem("user");
      localStorage.removeItem("role");
      setStatus("unauthorized");
      return;
    }

    try {
      setStatus("loading");
      const res = await axios.get("http://localhost:8080/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const actualUser = res.data.user;

      if (!actualUser) {
        throw new Error("User not found");
      }

      localStorage.setItem("user", JSON.stringify(actualUser));
      localStorage.setItem("role", actualUser.role);

      if (role && actualUser.role !== role) {
        setStatus("forbidden");
        return;
      }

      setStatus("authorized");
    } catch (error) {
      if (error.response?.status === 401 || error.response?.status === 403) {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        setStatus("unauthorized");
      } else {
        setStatus("error");
      }
    }
  };

  useEffect(() => {
    verifyUser();
  }, [role]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] dark:bg-[#171717]">
        <div className="text-center">
          <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#eee4d8] border-t-[#d97736] dark:border-[#38332e] dark:border-t-[#d97736]" />

          <p className="text-sm text-[#958779] dark:text-gray-400">
            Verifying your account...
          </p>
        </div>
      </div>
    );
  }

  if (status === "unauthorized") {
    if (showLoginPrompt) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 dark:bg-[#171717]">
          <div className="w-full max-w-md rounded-2xl border border-[#eee4d8] bg-white p-8 text-center shadow-lg dark:border-[#38332e] dark:bg-[#222222]">
            <div className="mb-4 text-5xl">🔒</div>

            <h2 className="mb-3 text-2xl font-bold text-[#292824] dark:text-white">
              Login Required
            </h2>

            <p className="mb-6 text-sm leading-6 text-[#958779] dark:text-gray-400">
              Please login or signup first to apply for this job.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-[#d97736] px-5 py-3 font-semibold text-white transition hover:bg-[#bd632c]"
              >
                Login Now
              </Link>

              <Link
                to="/user-signup"
                className="rounded-xl border border-[#eee4d8] bg-[#faf7f2] px-5 py-3 font-semibold text-[#292824] transition hover:bg-[#fff0e2] dark:border-[#38332e] dark:bg-[#302c28] dark:text-white dark:hover:bg-[#493426]"
              >
                Create Account
              </Link>

              <Link
                to="/jobs"
                className="mt-2 text-sm font-medium text-[#d97736] hover:underline"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      );
    }

    return <Navigate to="/login" replace />;
  }

  if (status === "forbidden") {
    if (showLoginPrompt) {
      return (
        <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 dark:bg-[#171717]">
          <div className="w-full max-w-md rounded-2xl border border-[#eee4d8] bg-white p-8 text-center shadow-lg dark:border-[#38332e] dark:bg-[#222222]">
            <div className="mb-4 text-5xl">🔒</div>

            <h2 className="mb-3 text-2xl font-bold text-[#292824] dark:text-white">
              Job Seeker Account Required
            </h2>

            <p className="mb-6 text-sm leading-6 text-[#958779] dark:text-gray-400">
              Only job seekers can apply for jobs. Please login with a Job
              Seeker account or create a new one.
            </p>

            <div className="flex flex-col gap-3">
              <Link
                to="/login"
                className="rounded-xl bg-[#d97736] px-5 py-3 font-semibold text-white transition hover:bg-[#bd632c]"
              >
                Login as Job Seeker
              </Link>

              <Link
                to="/user-signup"
                className="rounded-xl border border-[#eee4d8] bg-[#faf7f2] px-5 py-3 font-semibold text-[#292824] transition hover:bg-[#fff0e2] dark:border-[#38332e] dark:bg-[#302c28] dark:text-white dark:hover:bg-[#493426]"
              >
                Create Job Seeker Account
              </Link>

              <Link
                to="/jobs"
                className="mt-2 text-sm font-medium text-[#d97736] hover:underline"
              >
                Back to Jobs
              </Link>
            </div>
          </div>
        </div>
      );
    }

    const userRole = localStorage.getItem("role");

    if (userRole === "admin") {
      return <Navigate to="/admin/dashboard" replace />;
    }

    if (userRole === "company") {
      return <Navigate to="/company/dashboard" replace />;
    }

    if (userRole === "user") {
      return <Navigate to="/user/dashboard" replace />;
    }

    return <Navigate to="/login" replace />;
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#faf7f2] px-4 dark:bg-[#171717]">
        <div className="w-full max-w-md rounded-2xl border border-[#eee4d8] bg-white p-8 text-center shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
          <h2 className="mb-2 text-xl font-semibold text-[#292824] dark:text-white">
            Unable to verify account
          </h2>

          <p className="mb-6 text-sm text-[#958779] dark:text-gray-400">
            Something went wrong while connecting to the server.
          </p>

          <button
            onClick={verifyUser}
            className="rounded-xl bg-[#d97736] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#bd632c]"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return children;
}

export default ProtectedRoute;
