import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

const API = "http://localhost:8080/api/notification";

function UserDashboard() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");
  const [unreadCount, setUnreadCount] = useState(0);
  const [showProfile, setShowProfile] = useState(false);

  let user = {};

  try {
    user = JSON.parse(localStorage.getItem("user") || "{}");
  } catch {
    user = {};
  }

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
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

        if (response.ok) {
          const unread = (data.notifications || []).filter(
            (notification) => !notification.isRead,
          ).length;

          setUnreadCount(unread);
        }
      } catch (error) {
        console.log("Notification error:", error.message);
      }
    };

    fetchUnreadCount();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleSearch = () => {
    navigate(`/jobs?search=${encodeURIComponent(search.trim())}`);
  };

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#292824] transition-colors duration-300 dark:bg-[#171717] dark:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-[#eee4d8] bg-white/95 px-5 py-4 backdrop-blur-md dark:border-[#38332e] dark:bg-[#222222]/95 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4">
          <h1
            onClick={() => navigate("/user/dashboard")}
            className="cursor-pointer text-2xl font-extrabold tracking-tight text-[#292824] dark:text-white"
          >
            Hire<span className="text-[#d97736]">Hub.</span>
          </h1>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* Profile */}
            <div className="relative">
              <button
                onClick={() => setShowProfile(!showProfile)}
                className="flex items-center gap-2 rounded-full border border-[#eadfd1] bg-[#faf7f2] py-1.5 pl-2 pr-3 transition hover:border-[#d97736] dark:border-[#494039] dark:bg-[#302c28]"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#fce7d5] text-sm font-bold uppercase text-[#d97736] dark:bg-[#493426]">
                  {user.name?.charAt(0) || "U"}
                </span>

                <span className="text-sm font-semibold text-[#51483e] dark:text-white">
                  Profile
                </span>

                <span className="text-xs text-[#958779]">
                  {showProfile ? "▲" : "▼"}
                </span>
              </button>

              {showProfile && (
                <div className="absolute right-0 top-14 z-50 w-64 overflow-hidden rounded-2xl border border-[#eadfd1] bg-white shadow-xl dark:border-[#494039] dark:bg-[#252525]">
                  <div className="bg-[#faf7f2] p-4 dark:bg-[#302c28]">
                    <div className="flex items-center gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#d97736] text-lg font-bold uppercase text-white">
                        {user.name?.charAt(0) || "U"}
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-bold text-[#292824] dark:text-white">
                          {user.name || "User"}
                        </p>

                        <p className="truncate text-xs text-[#958779] dark:text-gray-400">
                          {user.email || "Email not available"}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-2">
                    <button
                      onClick={() => {
                        setShowProfile(false);
                        navigate("/user/change-password");
                      }}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-medium text-[#51483e] transition hover:bg-[#fff3e8] hover:text-[#d97736] dark:text-gray-200 dark:hover:bg-[#493426]"
                    >
                      <span>🔒</span>
                      Change Password
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Notifications */}
            <button
              onClick={() => navigate("/user/notifications")}
              className="relative rounded-xl border border-[#eadfd1] bg-white p-2.5 text-xl transition hover:border-[#d97736] hover:bg-[#fff8f1] dark:border-[#494039] dark:bg-[#302c28] dark:hover:bg-[#493426]"
              title="Notifications"
            >
              🔔
              {unreadCount > 0 && (
                <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* My Applications */}
            <button
              onClick={() => navigate("/user/my-applications")}
              className="rounded-xl border border-[#eadfd1] bg-white px-3 py-2.5 text-sm font-semibold text-[#51483e] transition hover:border-[#d97736] hover:text-[#d97736] dark:border-[#494039] dark:bg-[#302c28] dark:text-gray-200"
            >
              My Applications
            </button>

            {/* My Interviews */}
            <button
              onClick={() => navigate("/user/my-interviews")}
              className="rounded-xl border border-[#eadfd1] bg-white px-3 py-2.5 text-sm font-semibold text-[#51483e] transition hover:border-[#d97736] hover:text-[#d97736] dark:border-[#494039] dark:bg-[#302c28] dark:text-gray-200"
            >
              My Interviews
            </button>

            <ThemeToggle />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="rounded-xl bg-[#292824] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d97736] dark:bg-[#d97736] dark:hover:bg-[#bd642d]"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-5 py-9 md:px-10 md:py-12 lg:px-14">
        {/* Welcome Section */}
        <section className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#e99545] via-[#df873e] to-[#c96b2e] px-7 py-12 text-white shadow-lg shadow-[#d97736]/10 md:px-12 md:py-16">
          <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/20" />
          <div className="absolute -right-5 -top-12 h-52 w-52 rounded-full border border-white/20" />
          <div className="absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-white/10 blur-2xl" />

          <div className="relative z-10 max-w-2xl">
            <p className="mb-4 text-sm font-bold tracking-[0.2em] text-orange-50">
              YOUR CAREER JOURNEY
            </p>

            <h2 className="text-3xl font-extrabold leading-tight md:text-5xl">
              Hello, {user.name || "User"}!
            </h2>

            <p className="mt-5 max-w-xl text-sm leading-7 text-orange-50 md:text-base">
              Find opportunities that match your skills and interests. Your next
              career opportunity starts here.
            </p>

            <button
              onClick={() => navigate("/jobs")}
              className="mt-8 rounded-xl bg-white px-7 py-3.5 font-bold text-[#c96b2e] shadow-md transition hover:-translate-y-0.5 hover:bg-[#fff4e8]"
            >
              Explore Jobs →
            </button>
          </div>

          <div className="absolute bottom-8 right-12 hidden text-8xl opacity-20 lg:block">
            💼
          </div>
        </section>

        {/* Dashboard Cards */}
        <section className="mt-12">
          <div className="mb-6">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#d97736]">
              Quick Access
            </p>

            <h3 className="mt-2 text-2xl font-extrabold text-[#292824] dark:text-white">
              Your Dashboard
            </h3>

            <p className="mt-2 text-sm text-[#958779] dark:text-gray-400">
              Manage your job search and stay updated.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {/* Explore Jobs */}
            <button
              onClick={() => navigate("/jobs")}
              className="group rounded-2xl border border-[#eee4d8] bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9b88e] hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e2] text-2xl transition group-hover:bg-[#fce0c8] dark:bg-[#493426]">
                💼
              </div>

              <h4 className="font-bold text-[#292824] dark:text-white">
                Explore Jobs
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#958779] dark:text-gray-400">
                Browse available job opportunities.
              </p>

              <p className="mt-5 text-sm font-bold text-[#d97736]">
                Find Jobs →
              </p>
            </button>

            {/* My Applications */}
            <button
              onClick={() => navigate("/user/my-applications")}
              className="group rounded-2xl border border-[#eee4d8] bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9b88e] hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e2] text-2xl transition group-hover:bg-[#fce0c8] dark:bg-[#493426]">
                📄
              </div>

              <h4 className="font-bold text-[#292824] dark:text-white">
                My Applications
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#958779] dark:text-gray-400">
                Track your submitted job applications.
              </p>

              <p className="mt-5 text-sm font-bold text-[#d97736]">
                View Applications →
              </p>
            </button>

            {/* Notifications */}
            <button
              onClick={() => navigate("/user/notifications")}
              className="group rounded-2xl border border-[#eee4d8] bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9b88e] hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e2] text-2xl transition group-hover:bg-[#fce0c8] dark:bg-[#493426]">
                🔔
              </div>

              <h4 className="font-bold text-[#292824] dark:text-white">
                Notifications
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#958779] dark:text-gray-400">
                Check your latest application updates.
              </p>

              <p className="mt-5 text-sm font-bold text-[#d97736]">
                {unreadCount > 0
                  ? `${unreadCount} Unread Notifications →`
                  : "View Notifications →"}
              </p>
            </button>

            {/* My Interviews */}
            <button
              onClick={() => navigate("/user/my-interviews")}
              className="group rounded-2xl border border-[#eee4d8] bg-white p-6 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9b88e] hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]"
            >
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#fff0e2] text-2xl transition group-hover:bg-[#fce0c8] dark:bg-[#493426]">
                📅
              </div>

              <h4 className="font-bold text-[#292824] dark:text-white">
                My Interviews
              </h4>

              <p className="mt-2 text-sm leading-6 text-[#958779] dark:text-gray-400">
                View your scheduled interviews and results.
              </p>

              <p className="mt-5 text-sm font-bold text-[#d97736]">
                View Interviews →
              </p>
            </button>
          </div>
        </section>

        {/* Search Jobs */}
        <section className="mt-10 rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm dark:border-[#38332e] dark:bg-[#222222] md:p-9">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#d97736]">
              Find Your Next Opportunity
            </p>

            <h3 className="text-2xl font-extrabold text-[#292824] dark:text-white">
              Search for Jobs
            </h3>

            <p className="text-sm text-[#958779] dark:text-gray-400">
              Search jobs by title, skills or keywords.
            </p>
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <input
              type="text"
              placeholder="Search job title or skills..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
              className="min-w-0 flex-1 rounded-xl border border-[#eadfd1] bg-[#faf7f2] px-5 py-3.5 text-[#292824] outline-none transition placeholder:text-[#aa9f93] focus:border-[#d97736] focus:ring-4 focus:ring-[#d97736]/10 dark:border-[#494039] dark:bg-[#302c28] dark:text-white dark:placeholder:text-gray-500"
            />

            <button
              onClick={handleSearch}
              className="rounded-xl bg-[#d97736] px-8 py-3.5 font-bold text-white transition hover:bg-[#c5682e]"
            >
              Search Jobs →
            </button>
          </div>
        </section>

        {/* Bottom Message */}
        <section className="mt-8 rounded-2xl border border-dashed border-[#e8c9ad] bg-[#fff8f1] px-6 py-6 dark:border-[#60442f] dark:bg-[#30251d]">
          <div className="flex items-start gap-4">
            <span className="text-2xl">✨</span>
            <div>
              <h4 className="font-bold text-[#51402f] dark:text-[#ffca9c]">
                Keep moving forward!
              </h4>
              <p className="mt-1 text-sm leading-6 text-[#8b7865] dark:text-gray-400">
                Explore opportunities, manage your applications and take the
                next step in your career journey.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export default UserDashboard;
