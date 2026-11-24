import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const API = "http://localhost:8080/api/auth";

function ChangePassword() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters");
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError("New password and confirm password do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await axios.put(
        `${API}/change-password`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setMessage(response.data.message || "Password changed successfully");

      setFormData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F3F0E9] dark:bg-[#202A35] flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-2xl bg-white dark:bg-gray-800 p-8 shadow-lg">
        <h2 className="text-2xl font-bold text-[#202A35] dark:text-white mb-2">
          Change Password
        </h2>

        <p className="text-gray-500 dark:text-gray-400 mb-6">
          Enter your current password and choose a new one.
        </p>

        {message && <p className="text-green-600 mb-4">{message}</p>}

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="password"
            name="currentPassword"
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          <input
            type="password"
            name="newPassword"
            placeholder="New Password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full rounded-lg border p-3 dark:bg-gray-700 dark:text-white"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-[#E99545] py-3 font-semibold text-white hover:bg-[#d78332] disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>

        <button
          onClick={() => navigate("/user/dashboard")}
          className="mt-4 w-full text-sm text-gray-500 hover:text-[#E99545]"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ChangePassword;
