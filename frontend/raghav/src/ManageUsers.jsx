import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080/api/admin";

function ManageUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deletingId, setDeletingId] = useState(null);

  // LOGOUT
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/login");
        return;
      }

      if (role !== "admin") {
        navigate("/");
        return;
      }

      const response = await axios.get(`${API}/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUsers(response.data.users || []);
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      } else {
        setError(err.response?.data?.message || "Failed to fetch users");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // DELETE USER
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?",
    );

    if (!confirmDelete) return;

    try {
      const token = localStorage.getItem("token");
      const role = localStorage.getItem("role");

      if (!token) {
        navigate("/login");
        return;
      }

      if (role !== "admin") {
        navigate("/");
        return;
      }

      setDeletingId(id);

      const response = await axios.delete(`${API}/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert(response.data.message || "User deleted successfully");

      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
    } catch (err) {
      if (err.response?.status === 401 || err.response?.status === 403) {
        logout();
      } else {
        alert(err.response?.data?.message || "Failed to delete user");
      }
    } finally {
      setDeletingId(null);
    }
  };

  // SEARCH FILTER
  const filteredUsers = users.filter((user) =>
    `${user.name || ""} ${user.email || ""} ${user.phoneNumber || ""}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-[#F3F0E9] text-[#202A35] dark:bg-gray-950 dark:text-white">
      {/* Navbar */}
      <nav className="border-b border-gray-200 bg-white px-6 py-4 dark:border-gray-700 dark:bg-gray-900">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <h1 className="text-2xl font-bold">
            hirehub<span className="text-orange-500">.</span>
          </h1>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => navigate("/admin/dashboard")}
              className="rounded-lg bg-[#202A35] px-4 py-2 text-white hover:bg-gray-700"
            >
              Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-6 py-10">
        <div className="mb-8">
          <p className="text-sm font-semibold text-orange-500">ADMIN PANEL</p>

          <h2 className="mt-2 text-3xl font-bold">Manage Users</h2>

          <p className="mt-2 text-gray-500 dark:text-gray-400">
            View and manage all registered users.
          </p>
        </div>

        {/* Stats */}
        <div className="mb-7 rounded-2xl border border-gray-200 bg-white p-6 dark:border-gray-700 dark:bg-gray-900">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Registered Users
          </p>

          <h3 className="mt-2 text-3xl font-bold">{users.length}</h3>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by name, email or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-xl border border-gray-300 bg-white p-3 text-gray-900 outline-none focus:border-orange-500 md:w-96 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
          />
        </div>

        {/* Loading */}
        {loading && (
          <p className="py-10 text-center text-gray-500">Loading users...</p>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="rounded-xl bg-red-100 p-4 text-red-700 dark:bg-red-950 dark:text-red-300">
            {error}

            <button
              onClick={fetchUsers}
              className="ml-3 font-semibold underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Users Table */}
        {!loading && !error && (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-900">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-gray-100 dark:bg-gray-800">
                  <tr>
                    <th className="p-4">User</th>
                    <th className="p-4">Email</th>
                    <th className="p-4">Phone</th>
                    <th className="p-4">Joined</th>
                    <th className="p-4">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr
                      key={user._id}
                      className="border-t border-gray-200 dark:border-gray-700"
                    >
                      <td className="p-4 font-semibold">
                        {user.name || "N/A"}
                      </td>

                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {user.email}
                      </td>

                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {user.phoneNumber || "N/A"}
                      </td>

                      <td className="p-4 text-gray-600 dark:text-gray-300">
                        {user.createdAt
                          ? new Date(user.createdAt).toLocaleDateString("en-IN")
                          : "N/A"}
                      </td>

                      <td className="p-4">
                        <button
                          onClick={() => handleDelete(user._id)}
                          disabled={deletingId === user._id}
                          className="rounded-lg bg-red-500 px-4 py-2 text-white hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          {deletingId === user._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredUsers.length === 0 && (
              <p className="py-10 text-center text-gray-500 dark:text-gray-400">
                No users found.
              </p>
            )}
          </div>
        )}
      </main>
    </div>
  );
}

export default ManageUsers;
