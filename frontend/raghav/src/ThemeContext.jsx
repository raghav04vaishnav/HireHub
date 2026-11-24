import { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

function getAccountKey() {
  try {
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!user) return "hirehub-theme-guest";

    const id = user._id || user.id || user.email || user.role;

    return `hirehub-theme-${id}`;
  } catch {
    return "hirehub-theme-guest";
  }
}

export function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false);
  const location = useLocation();

  const authPages = [
    "/login",
    "/user-signup",
    "/company-signup",
    "/forgot-password",
    "/reset-password",
  ];

  const isAuthPage = authPages.includes(location.pathname);

  useEffect(() => {
    const key = getAccountKey();
    const savedTheme = localStorage.getItem(key);
    const isDark = savedTheme === "dark";

    setDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, [location.pathname]);

  const toggleTheme = () => {
    const newTheme = !darkMode;
    const key = getAccountKey();

    setDarkMode(newTheme);
    localStorage.setItem(key, newTheme ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleTheme, isAuthPage }}>
      {children}
    </ThemeContext.Provider>
  );
}
