import { useTheme } from "./ThemeContext";

function ThemeToggle() {
  const { darkMode, toggleTheme, isAuthPage } = useTheme();

  if (isAuthPage) return null;

  return (
    <button
      onClick={toggleTheme}
      className="inline-flex items-center gap-2 rounded-full border border-[#eee4d8] bg-white px-4 py-2 text-sm font-medium text-[#292824] shadow-sm transition-all duration-200 hover:bg-[#fff0e2] dark:border-[#38332e] dark:bg-[#222222] dark:text-gray-200 dark:hover:bg-[#302c28]"
    >
      {darkMode ? (
        <>
          <span className="text-[#d97736]">☀</span>
          Light Mode
        </>
      ) : (
        <>
          <span className="text-[#d97736]">☾</span>
          Dark Mode
        </>
      )}
    </button>
  );
}

export default ThemeToggle;
