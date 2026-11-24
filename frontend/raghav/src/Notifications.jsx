import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080/api/notification";

function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchNotifications = async () => {
    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API}/my-notifications`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to fetch notifications");
      }

      setNotifications(data.notifications || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleRead = async (notification) => {
    if (notification.isRead) return;

    try {
      setError("");

      const token = localStorage.getItem("token");

      if (!token) {
        navigate("/login");
        return;
      }

      const response = await fetch(`${API}/read/${notification._id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Unable to update notification");
      }

      setNotifications((prev) =>
        prev.map((item) =>
          item._id === notification._id ? { ...item, isRead: true } : item,
        ),
      );
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0E9] text-[#202A35] transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      <nav className="flex items-center justify-between bg-white px-6 py-5 shadow-sm dark:bg-gray-900 md:px-12">
        <h1
          onClick={() => navigate("/user/dashboard")}
          className="cursor-pointer text-2xl font-bold text-[#202A35] dark:text-white"
        >
          Hire<span className="text-[#E99545]">Hub</span>
        </h1>

        <div className="flex items-center gap-3">
          <ThemeToggle />

          <button
            onClick={() => navigate("/user/dashboard")}
            className="rounded-lg border border-[#202A35] px-4 py-2 text-sm font-semibold dark:border-gray-500"
          >
            Back to Dashboard
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <h2 className="text-3xl font-bold">Notifications</h2>

        <p className="mt-2 text-gray-600 dark:text-gray-400">
          Stay updated about your job applications.
        </p>

        {loading ? (
          <p className="mt-8">Loading notifications...</p>
        ) : error ? (
          <p className="mt-8 text-red-500">{error}</p>
        ) : notifications.length === 0 ? (
          <div className="mt-8 rounded-xl bg-white p-8 text-center shadow-sm dark:bg-gray-900">
            <p className="text-lg font-semibold">No notifications yet</p>

            <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
              Your application status updates will appear here.
            </p>
          </div>
        ) : (
          <div className="mt-8 space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification._id}
                onClick={() => handleRead(notification)}
                className={`cursor-pointer rounded-xl border p-5 shadow-sm transition ${
                  notification.isRead
                    ? "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900"
                    : "border-[#E99545] bg-orange-50 dark:bg-gray-800"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <h3 className="font-bold">{notification.title}</h3>

                  {!notification.isRead && (
                    <span className="h-3 w-3 shrink-0 rounded-full bg-[#E99545]" />
                  )}
                </div>

                <p className="mt-2 text-sm text-gray-700 dark:text-gray-300">
                  {notification.message}
                </p>

                <p className="mt-3 text-xs text-gray-500 dark:text-gray-400">
                  {notification.createdAt
                    ? new Date(notification.createdAt).toLocaleString("en-IN")
                    : "Date not available"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Notifications;
