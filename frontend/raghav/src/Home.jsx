import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Home() {
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const navigate = useNavigate();

  const categories = [
    { icon: "💻", name: "Development", jobs: "1,200+ Jobs" },
    { icon: "📊", name: "Data Science", jobs: "850+ Jobs" },
    { icon: "🎨", name: "Design", jobs: "600+ Jobs" },
    { icon: "📢", name: "Marketing", jobs: "450+ Jobs" },
    { icon: "💰", name: "Finance", jobs: "500+ Jobs" },
    { icon: "🤝", name: "Human Resources", jobs: "300+ Jobs" },
  ];

  const handleSearch = (e) => {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());

    navigate(`/jobs?${params.toString()}`);
  };

  return (
    <div className="min-h-screen overflow-hidden bg-[#faf7f2] text-[#292824] transition-colors duration-300 dark:bg-gray-950 dark:text-white">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[#eee5d9] bg-[#faf7f2]/95 backdrop-blur-xl dark:border-gray-800 dark:bg-gray-950/95">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#292824] text-2xl font-extrabold text-[#f5a15d] shadow-md">
              H
            </div>

            <span className="text-2xl font-extrabold tracking-tight dark:text-white">
              Hire<span className="text-[#d97736]">Hub</span>
            </span>
          </Link>

          <div className="hidden items-center gap-9 text-sm font-semibold text-[#777168] dark:text-gray-300 md:flex">
            <Link to="/" className="text-[#d97736]">
              Home
            </Link>

            <Link to="/jobs" className="transition hover:text-[#d97736]">
              Find Jobs
            </Link>

            <a href="#companies" className="transition hover:text-[#d97736]">
              Companies
            </a>

            <a href="#about" className="transition hover:text-[#d97736]">
              About Us
            </a>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <ThemeToggle />

            <Link
              to="/login"
              className="hidden rounded-xl px-4 py-3 text-sm font-bold transition hover:bg-[#eee5d9] dark:text-gray-200 dark:hover:bg-gray-800 sm:block"
            >
              Login
            </Link>

            <Link
              to="/user-signup"
              className="rounded-xl bg-[#d97736] px-5 py-3 text-sm font-bold text-white shadow-md shadow-orange-900/15 transition duration-300 hover:-translate-y-0.5 hover:bg-[#bd632c] hover:shadow-lg"
            >
              Get Started →
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-[#f3e7d9] via-[#faf7f2] to-[#f8e5d4] dark:from-gray-900 dark:via-gray-950 dark:to-gray-900">
        <div className="absolute -right-20 top-10 h-80 w-80 rounded-full bg-orange-300/20 blur-3xl" />
        <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-amber-200/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-28">
          <div>
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-orange-200 bg-white/80 px-4 py-2 text-xs font-bold tracking-wide text-[#a85c2b] shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-orange-300">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#d97736]" />
              YOUR NEXT OPPORTUNITY STARTS HERE
            </div>

            <h1 className="max-w-2xl text-5xl font-black leading-[1.15] tracking-tight sm:text-6xl lg:text-7xl">
              Find a job that
              <span className="mt-2 block text-[#d97736]">
                fits your future.
              </span>
            </h1>

            <p className="mt-7 max-w-xl text-base leading-8 text-[#777168] dark:text-gray-300 sm:text-lg">
              Discover opportunities, connect with professionals and take the
              next big step in your career with HireHub.
            </p>

            {/* Search */}
            <form
              onSubmit={handleSearch}
              className="mt-10 flex flex-col gap-2 rounded-2xl border border-[#eee2d4] bg-white p-3 shadow-xl shadow-[#292824]/10 transition duration-300 focus-within:border-[#d97736]/50 dark:border-gray-700 dark:bg-gray-900 sm:flex-row sm:items-center"
            >
              <div className="flex flex-1 items-center gap-3 rounded-xl px-3">
                <span className="text-2xl text-[#d97736]">⌕</span>

                <input
                  type="text"
                  placeholder="Job title or keyword"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aaa398] dark:text-white"
                />
              </div>

              <div className="hidden h-10 w-px bg-[#eee5d9] dark:bg-gray-700 sm:block" />

              <div className="flex flex-1 items-center gap-3 rounded-xl px-3">
                <span className="text-lg">📍</span>

                <input
                  type="text"
                  placeholder="City or location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full bg-transparent py-3 text-sm outline-none placeholder:text-[#aaa398] dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="rounded-xl bg-[#d97736] px-8 py-4 text-sm font-bold text-white shadow-md transition duration-300 hover:bg-[#bd632c] hover:shadow-lg"
              >
                Search Jobs →
              </button>
            </form>

            <p className="mt-5 text-sm text-[#777168] dark:text-gray-400">
              Popular:
              <span className="ml-2 font-semibold text-[#a85c2b]">
                React Developer
              </span>
              ,
              <span className="ml-2 font-semibold text-[#a85c2b]">
                UI Designer
              </span>
              ,
              <span className="ml-2 font-semibold text-[#a85c2b]">
                Marketing
              </span>
            </p>
          </div>

          {/* Hero Visual */}
          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute inset-8 rounded-full bg-orange-200/40 blur-3xl dark:bg-orange-900/10" />

            <div className="relative rounded-[2rem] border border-white/80 bg-white/90 p-6 shadow-2xl shadow-[#292824]/10 backdrop-blur dark:border-gray-700 dark:bg-gray-900 sm:p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-[#8c8376] dark:text-gray-400">
                    Career Dashboard
                  </p>

                  <h3 className="mt-1 text-2xl font-extrabold dark:text-white">
                    Explore Opportunities
                  </h3>
                </div>

                <div className="rounded-2xl bg-[#f6eee4] p-4 text-3xl dark:bg-gray-800">
                  💼
                </div>
              </div>

              <div className="mt-8 overflow-hidden rounded-2xl bg-gradient-to-br from-[#292824] to-[#554637] p-7 text-white">
                <p className="text-sm font-medium text-orange-200">
                  Your next opportunity
                </p>

                <h3 className="mt-3 text-3xl font-extrabold leading-tight">
                  A better career starts today.
                </h3>

                <p className="mt-4 text-sm leading-6 text-gray-300">
                  Find opportunities that match your skills.
                </p>

                <Link
                  to="/jobs"
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#d97736] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#bd632c]"
                >
                  Explore Jobs →
                </Link>
              </div>

              <div className="mt-6 grid grid-cols-2 gap-4">
                <div className="rounded-2xl bg-[#faf4ec] p-5 dark:bg-gray-800">
                  <p className="text-3xl font-black text-[#d97736]">10K+</p>

                  <p className="mt-2 text-xs font-medium text-[#777168] dark:text-gray-400">
                    Job Opportunities
                  </p>
                </div>

                <div className="rounded-2xl bg-[#faf4ec] p-5 dark:bg-gray-800">
                  <p className="text-3xl font-black dark:text-white">500+</p>

                  <p className="mt-2 text-xs font-medium text-[#777168] dark:text-gray-400">
                    Top Companies
                  </p>
                </div>
              </div>

              <div className="mt-5 flex items-center gap-3 rounded-2xl border border-[#eee9e1] p-4 dark:border-gray-700">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-xl text-green-600">
                  ✓
                </div>

                <div>
                  <p className="text-sm font-bold dark:text-white">
                    Your dream job awaits
                  </p>

                  <p className="mt-1 text-xs text-[#8c8376] dark:text-gray-400">
                    Take the first step today
                  </p>
                </div>
              </div>
            </div>

            <div className="absolute -left-6 top-24 hidden rounded-2xl border border-[#eee5d9] bg-white p-4 shadow-xl dark:border-gray-700 dark:bg-gray-900 sm:block">
              <p className="text-xs text-[#8c8376] dark:text-gray-400">
                New opportunities
              </p>

              <p className="mt-2 font-bold text-[#d97736]">Available Now ✨</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-[#eee5d9] bg-white dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-12 text-center md:grid-cols-4 lg:px-8">
          {[
            ["10K+", "Active Jobs"],
            ["500+", "Companies"],
            ["25K+", "Job Seekers"],
            ["1K+", "Successful Hires"],
          ].map(([number, label]) => (
            <div
              key={label}
              className="group rounded-2xl px-3 py-4 transition duration-300 hover:bg-[#faf7f2] dark:hover:bg-gray-800"
            >
              <h3 className="text-3xl font-black text-[#d97736] transition group-hover:scale-105 sm:text-4xl">
                {number}
              </h3>

              <p className="mt-2 text-sm font-medium text-[#777168] dark:text-gray-400">
                {label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-extrabold uppercase tracking-[0.2em] text-[#d97736]">
              Browse Categories
            </p>

            <h2 className="mt-3 text-3xl font-black tracking-tight dark:text-white sm:text-4xl">
              Explore by category
            </h2>

            <p className="mt-3 text-[#777168] dark:text-gray-400">
              Find the right opportunity in your field.
            </p>
          </div>

          <Link
            to="/jobs"
            className="rounded-xl border border-[#d97736] px-5 py-3 text-sm font-bold text-[#a85c2b] transition duration-300 hover:bg-[#d97736] hover:text-white"
          >
            View All Jobs →
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              to={`/jobs?category=${encodeURIComponent(category.name)}`}
              key={category.name}
              className="group rounded-2xl border border-[#eee5d9] bg-white p-7 transition duration-300 hover:-translate-y-2 hover:border-[#d97736]/50 hover:shadow-xl hover:shadow-orange-900/5 dark:border-gray-800 dark:bg-gray-900"
            >
              <div className="flex items-center justify-between">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-[#faf0e5] text-3xl transition duration-300 group-hover:rotate-3 group-hover:scale-110 dark:bg-gray-800">
                  {category.icon}
                </div>

                <span className="text-2xl text-[#c7bcae] transition group-hover:translate-x-1 group-hover:text-[#d97736]">
                  ↗
                </span>
              </div>

              <h3 className="mt-6 text-xl font-extrabold dark:text-white">
                {category.name}
              </h3>

              <p className="mt-2 text-sm text-[#8c8376] dark:text-gray-400">
                {category.jobs}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* Why Choose HireHub */}
      <section className="relative overflow-hidden bg-gradient-to-b from-[#f1e9de] to-[#faf7f2] py-24 dark:from-gray-900 dark:to-gray-950">
        <div className="absolute -right-24 top-10 h-72 w-72 rounded-full bg-orange-300/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
          <div className="mx-auto mb-16 max-w-2xl text-center">
            <span className="inline-block rounded-full border border-orange-200 bg-white px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#d97736] dark:border-gray-700 dark:bg-gray-900">
              Why Choose HireHub
            </span>

            <h2 className="mt-6 text-3xl font-black leading-tight text-[#292824] dark:text-white sm:text-5xl">
              Your Career. Your Goals.
              <span className="block text-[#d97736]">Our Platform.</span>
            </h2>

            <p className="mt-5 text-base leading-8 text-[#777168] dark:text-gray-400">
              Everything you need to make your job search simple, organized and
              focused on your future.
            </p>
          </div>

          <div className="grid gap-7 md:grid-cols-3">
            {[
              {
                icon: "🔍",
                number: "01",
                title: "Smart Job Search",
                desc: "Explore career opportunities by role, skills and location to find the right direction.",
              },
              {
                icon: "📄",
                number: "02",
                title: "Easy Applications",
                desc: "Create your professional profile and make your application journey easier.",
              },
              {
                icon: "🚀",
                number: "03",
                title: "Career Growth",
                desc: "Discover new possibilities, improve your skills and move closer to your career goals.",
              },
            ].map((item) => (
              <div
                key={item.number}
                className="group relative overflow-hidden rounded-3xl border border-[#eadfd1] bg-white p-8 shadow-sm transition-all duration-300 hover:-translate-y-3 hover:border-[#d97736]/50 hover:shadow-2xl hover:shadow-orange-900/10 dark:border-gray-700 dark:bg-gray-900"
              >
                <div className="absolute right-6 top-5 text-5xl font-black text-[#f7f1e9] transition group-hover:text-orange-100 dark:text-gray-800 dark:group-hover:text-gray-700">
                  {item.number}
                </div>

                <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-[#fff1e2] to-[#f6dfc8] text-3xl shadow-sm transition duration-300 group-hover:rotate-6 group-hover:scale-110 dark:from-gray-800 dark:to-gray-700">
                  {item.icon}
                </div>

                <h3 className="relative mt-8 text-xl font-extrabold text-[#292824] dark:text-white">
                  {item.title}
                </h3>

                <p className="relative mt-4 text-sm leading-7 text-[#777168] dark:text-gray-400">
                  {item.desc}
                </p>

                <div className="mt-7 h-1 w-12 rounded-full bg-[#d97736] transition-all duration-300 group-hover:w-24" />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Build Your Career */}
      <section
        id="companies"
        className="relative overflow-hidden bg-white py-24 dark:bg-gray-950"
      >
        <div className="mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-2 lg:px-8">
          <div>
            <span className="inline-block rounded-full bg-[#fff0e3] px-5 py-2 text-xs font-bold uppercase tracking-widest text-[#d97736] dark:bg-gray-800">
              Your Career Journey
            </span>

            <h2 className="mt-7 text-3xl font-black leading-tight text-[#292824] dark:text-white sm:text-5xl">
              Build a career that
              <span className="block text-[#d97736]">you are proud of.</span>
            </h2>

            <p className="mt-6 max-w-lg text-base leading-8 text-[#777168] dark:text-gray-400">
              Your next big opportunity begins with one small step. Create your
              profile, discover your potential and take charge of your
              professional journey with HireHub.
            </p>

            <Link
              to="/user-signup"
              className="mt-9 inline-flex items-center gap-3 rounded-xl bg-[#d97736] px-7 py-4 text-sm font-bold text-white shadow-lg shadow-orange-900/20 transition duration-300 hover:-translate-y-1 hover:bg-[#b85d27]"
            >
              Get Started Now
              <span className="text-lg">→</span>
            </Link>

            <div className="mt-10 flex flex-wrap gap-6 text-sm font-semibold text-[#777168] dark:text-gray-400">
              <span>✓ Easy Registration</span>
              <span>✓ Simple Process</span>
            </div>
          </div>

          <div className="relative">
            <div className="absolute inset-8 rounded-full bg-[#f5e3d1] blur-3xl dark:bg-orange-900/10" />

            <div className="relative grid grid-cols-2 gap-5">
              {[
                {
                  icon: "👤",
                  title: "Build Your Profile",
                  desc: "Showcase your skills and experience.",
                },
                {
                  icon: "🎯",
                  title: "Find Your Direction",
                  desc: "Explore career paths that suit you.",
                },
                {
                  icon: "📋",
                  title: "Track Applications",
                  desc: "Keep your job search organized.",
                },
                {
                  icon: "🌱",
                  title: "Grow Your Skills",
                  desc: "Keep learning and improving.",
                },
              ].map((item, index) => (
                <div
                  key={item.title}
                  className={`relative rounded-3xl border border-[#eee5d9] bg-[#faf7f2] p-6 shadow-sm transition duration-300 hover:-translate-y-2 hover:border-[#d97736]/40 hover:shadow-xl dark:border-gray-700 dark:bg-gray-900 ${
                    index % 2 === 1 ? "translate-y-7" : ""
                  }`}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm dark:bg-gray-800">
                    {item.icon}
                  </div>

                  <h3 className="mt-6 text-base font-extrabold text-[#292824] dark:text-white">
                    {item.title}
                  </h3>

                  <p className="mt-3 text-xs leading-6 text-[#777168] dark:text-gray-400">
                    {item.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section
        id="about"
        className="mx-auto max-w-7xl px-5 pb-24 pt-10 lg:px-8"
      >
        <div className="grid gap-6 md:grid-cols-2">
          <div className="group relative overflow-hidden rounded-3xl bg-[#292824] p-9 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-11">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/5 transition group-hover:scale-150" />

            <div className="relative">
              <div className="text-4xl">👨‍💻</div>

              <h2 className="mt-7 text-3xl font-black">Looking for a job?</h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-[#d5c9bb]">
                Create your profile, explore opportunities and find a career
                that matches your skills.
              </p>

              <Link
                to="/user-signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-[#d97736] px-6 py-4 text-sm font-bold text-white transition hover:bg-[#bd632c]"
              >
                Join as Job Seeker →
              </Link>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#d97736] to-[#b85d27] p-9 text-white shadow-xl transition duration-300 hover:-translate-y-1 hover:shadow-2xl sm:p-11">
            <div className="absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10 transition group-hover:scale-150" />

            <div className="relative">
              <div className="text-4xl">🏢</div>

              <h2 className="mt-7 text-3xl font-black">Hiring new talent?</h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-white/85">
                Register your company, publish job openings and connect with
                talented professionals.
              </p>

              <Link
                to="/company-signup"
                className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-4 text-sm font-bold text-[#a85c2b] transition hover:bg-[#f5f1e9]"
              >
                Register Your Company →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-[#292824] px-5 py-14 text-white lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-12 md:grid-cols-3">
          <div>
            <h2 className="text-3xl font-black">
              Hire<span className="text-[#f5a15d]">Hub</span>
            </h2>

            <p className="mt-5 max-w-sm text-sm leading-7 text-[#b9b0a4]">
              Connecting talented people with great opportunities. Build your
              future with HireHub.
            </p>
          </div>

          <div>
            <h3 className="text-lg font-bold">Quick Links</h3>

            <div className="mt-5 flex flex-col gap-4 text-sm text-[#b9b0a4]">
              <Link
                to="/"
                className="transition hover:translate-x-1 hover:text-[#f5a15d]"
              >
                Home
              </Link>

              <Link
                to="/jobs"
                className="transition hover:translate-x-1 hover:text-[#f5a15d]"
              >
                Find Jobs
              </Link>

              <Link
                to="/login"
                className="transition hover:translate-x-1 hover:text-[#f5a15d]"
              >
                Login
              </Link>

              <Link
                to="/user-signup"
                className="transition hover:translate-x-1 hover:text-[#f5a15d]"
              >
                Sign Up
              </Link>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold">For Companies</h3>

            <div className="mt-5 flex flex-col gap-4 text-sm text-[#b9b0a4]">
              <Link
                to="/company-signup"
                className="transition hover:translate-x-1 hover:text-[#f5a15d]"
              >
                Company Registration
              </Link>

              <Link
                to="/login"
                className="transition hover:translate-x-1 hover:text-[#f5a15d]"
              >
                Recruiter Login
              </Link>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-12 max-w-7xl border-t border-white/10 pt-7 text-center text-xs text-[#8c8376]">
          © 2026 HireHub. All rights reserved.
        </div>
      </footer>
    </div>
  );
}

export default Home;
