import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import ThemeToggle from "./ThemeToggle";

function AllJobs() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState(searchParams.get("search") || "");
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [category, setCategory] = useState(searchParams.get("category") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/job/all");

        setJobs(response.data.jobs || []);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to fetch jobs");
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter((job) => {
    const companyName = job.companyDetails?.companyName || "";

    const searchText = search.trim().toLowerCase();
    const locationText = location.trim().toLowerCase();
    const categoryText = category.trim().toLowerCase();

    const matchesSearch =
      !searchText ||
      job.title?.toLowerCase().includes(searchText) ||
      companyName.toLowerCase().includes(searchText) ||
      job.skills?.some((skill) =>
        String(skill).toLowerCase().includes(searchText),
      );

    const matchesLocation =
      !locationText || job.location?.toLowerCase().includes(locationText);

    const matchesCategory =
      !categoryText ||
      job.title?.toLowerCase().includes(categoryText) ||
      job.category?.toLowerCase().includes(categoryText) ||
      job.skills?.some((skill) =>
        String(skill).toLowerCase().includes(categoryText),
      );

    return matchesSearch && matchesLocation && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#faf7f2] text-[#292824] transition-colors duration-300 dark:bg-[#171717] dark:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-40 border-b border-[#eee4d8] bg-white/95 px-5 py-4 backdrop-blur-md dark:border-[#38332e] dark:bg-[#222222]/95 md:px-10 lg:px-14">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
          <h1
            onClick={() => navigate("/")}
            className="cursor-pointer text-2xl font-extrabold tracking-tight text-[#292824] dark:text-white"
          >
            Hire<span className="text-[#d97736]">Hub.</span>
          </h1>

          <div className="flex items-center gap-3">
            <ThemeToggle />

            <button
              onClick={() => navigate("/")}
              className="rounded-xl bg-[#292824] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#d97736] dark:bg-[#d97736] dark:hover:bg-[#bd642d]"
            >
              Home
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="mx-auto max-w-7xl px-5 py-10 md:px-10 md:py-12 lg:px-14">
        {/* Heading */}
        <section className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-[#d97736]">
            Career Opportunities
          </p>

          <h2 className="mt-3 text-3xl font-extrabold tracking-tight text-[#292824] md:text-4xl dark:text-white">
            Explore Jobs
          </h2>

          <p className="mt-3 text-sm leading-6 text-[#958779] dark:text-gray-400 md:text-base">
            Find the right opportunity and take the next step in your career.
          </p>
        </section>

        {/* Search */}
        <section className="rounded-2xl border border-[#eee4d8] bg-white p-4 shadow-sm dark:border-[#38332e] dark:bg-[#222222] md:p-5">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-center gap-3 rounded-xl border border-[#eee4d8] px-3 dark:border-[#38332e]">
              <span className="text-xl text-[#d97736]">⌕</span>

              <input
                type="text"
                placeholder="Search job title, company or skills..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aa9f93] dark:text-white dark:placeholder:text-gray-500"
              />
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#eee4d8] px-3 dark:border-[#38332e]">
              <span className="text-lg">📍</span>

              <input
                type="text"
                placeholder="Search city or location..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aa9f93] dark:text-white dark:placeholder:text-gray-500"
              />
            </div>
          </div>

          {(search || location || category) && (
            <button
              onClick={() => {
                setSearch("");
                setLocation("");
                setCategory("");
                navigate("/jobs", { replace: true });
              }}
              className="mt-4 text-sm font-semibold text-[#d97736] hover:underline"
            >
              Clear Search ✕
            </button>
          )}
        </section>

        {/* Jobs */}
        <div className="mt-9">
          {loading ? (
            <div className="rounded-2xl border border-[#eee4d8] bg-white py-16 text-center dark:border-[#38332e] dark:bg-[#222222]">
              <div className="mx-auto mb-4 h-10 w-10 animate-spin rounded-full border-4 border-[#f5dfcc] border-t-[#d97736]" />

              <p className="font-medium text-[#958779] dark:text-gray-400">
                Loading jobs...
              </p>
            </div>
          ) : error ? (
            <div className="rounded-2xl border border-red-200 bg-white p-10 text-center dark:border-red-900 dark:bg-[#222222]">
              <p className="text-lg font-semibold text-red-600">{error}</p>
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="rounded-2xl border border-[#eee4d8] bg-white px-6 py-16 text-center shadow-sm dark:border-[#38332e] dark:bg-[#222222]">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-[#fff0e2] text-3xl dark:bg-[#493426]">
                🔍
              </div>

              <h3 className="mt-5 text-xl font-bold text-[#292824] dark:text-white">
                No Jobs Found
              </h3>

              <p className="mt-2 text-sm text-[#958779] dark:text-gray-400">
                Try searching with another keyword or location.
              </p>
            </div>
          ) : (
            <>
              {/* Results Count */}
              <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h3 className="text-xl font-bold text-[#292824] dark:text-white">
                    Available Opportunities
                  </h3>

                  <p className="mt-1 text-sm text-[#958779] dark:text-gray-400">
                    {filteredJobs.length} Jobs Found
                  </p>
                </div>

                <span className="rounded-full bg-[#fff0e2] px-4 py-2 text-xs font-bold text-[#c76a2d] dark:bg-[#493426] dark:text-[#ffb477]">
                  Latest Listings
                </span>
              </div>

              {/* Job Cards */}
              <div className="grid gap-6 md:grid-cols-2">
                {filteredJobs.map((job) => (
                  <div
                    key={job._id}
                    className="group flex flex-col rounded-2xl border border-[#eee4d8] bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#e9b88e] hover:shadow-lg dark:border-[#38332e] dark:bg-[#222222]"
                  >
                    {/* Card Header */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#fff0e2] text-xl dark:bg-[#493426]">
                          💼
                        </div>

                        <div className="min-w-0">
                          <h3 className="text-lg font-extrabold text-[#292824] transition group-hover:text-[#d97736] dark:text-white">
                            {job.title}
                          </h3>

                          <p className="mt-1 text-sm font-medium text-[#958779] dark:text-gray-400">
                            {job.companyDetails?.companyName || "Company"}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 rounded-full border border-[#f1d7c0] bg-[#fff8f1] px-3 py-1.5 text-xs font-bold text-[#c76a2d] dark:border-[#60442f] dark:bg-[#493426] dark:text-[#ffb477]">
                        {job.jobType}
                      </span>
                    </div>

                    {/* Job Details */}
                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="rounded-xl bg-[#faf7f2] p-3 dark:bg-[#302c28]">
                        <p className="text-xs font-medium text-[#958779] dark:text-gray-400">
                          Location
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#51483e] dark:text-gray-200">
                          📍 {job.location}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#faf7f2] p-3 dark:bg-[#302c28]">
                        <p className="text-xs font-medium text-[#958779] dark:text-gray-400">
                          Experience
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#51483e] dark:text-gray-200">
                          💼 {job.experience}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#faf7f2] p-3 dark:bg-[#302c28]">
                        <p className="text-xs font-medium text-[#958779] dark:text-gray-400">
                          Salary
                        </p>

                        <p className="mt-1 text-sm font-bold text-[#d97736]">
                          ₹{job.salary?.min} - ₹{job.salary?.max}
                        </p>
                      </div>

                      <div className="rounded-xl bg-[#faf7f2] p-3 dark:bg-[#302c28]">
                        <p className="text-xs font-medium text-[#958779] dark:text-gray-400">
                          Vacancies
                        </p>

                        <p className="mt-1 text-sm font-semibold text-[#51483e] dark:text-gray-200">
                          {job.vacancies}
                        </p>
                      </div>
                    </div>

                    {/* Skills */}
                    {job.skills?.length > 0 && (
                      <div className="mt-6">
                        <p className="mb-3 text-xs font-bold uppercase tracking-wider text-[#958779] dark:text-gray-400">
                          Required Skills
                        </p>

                        <div className="flex flex-wrap gap-2">
                          {job.skills.map((skill, index) => (
                            <span
                              key={index}
                              className="rounded-lg border border-[#f1e2d3] bg-[#fff8f1] px-3 py-1.5 text-xs font-semibold text-[#9b633d] dark:border-[#60442f] dark:bg-[#493426] dark:text-[#ffbd8b]"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Last Date */}
                    <div className="mt-6 border-t border-[#eee4d8] pt-4 dark:border-[#38332e]">
                      <p className="text-xs text-[#958779] dark:text-gray-400">
                        Application Deadline
                      </p>

                      <p className="mt-1 text-sm font-semibold text-[#51483e] dark:text-gray-200">
                        {job.lastDate
                          ? new Date(job.lastDate).toLocaleDateString("en-IN")
                          : "Not specified"}
                      </p>
                    </div>

                    {/* View Details */}
                    <button
                      onClick={() => navigate(`/job/${job._id}`)}
                      className="mt-5 w-full rounded-xl bg-[#292824] py-3.5 font-bold text-white transition hover:bg-[#d97736] dark:bg-[#d97736] dark:hover:bg-[#bd642d]"
                    >
                      View Details →
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}

export default AllJobs;
