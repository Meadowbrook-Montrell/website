/**
 * Dark/Light Mode Toggle Button
 * Gold sun/moon icon that matches the 3GMG brand
 */
import { Sun, Moon } from "lucide-react";
import { useTheme } from "../contexts/ThemeContext";

export function ThemeToggle({ className = "" }: { className?: string }) {
  const { theme, toggleTheme, switchable } = useTheme();

  if (!switchable || !toggleTheme) return null;

  return (
    <button
      onClick={toggleTheme}
      className={`relative p-2 rounded-lg transition-all duration-300 hover:bg-[#D4A843]/10 group ${className}`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
    >
      <div className="relative size-5">
        {/* Sun icon — shown in dark mode (click to switch to light) */}
        <Sun
          className={`absolute inset-0 size-5 transition-all duration-300 ${
            theme === "dark"
              ? "opacity-100 rotate-0 scale-100 text-[#D4A843]"
              : "opacity-0 rotate-90 scale-50 text-[#D4A843]"
          }`}
        />
        {/* Moon icon — shown in light mode (click to switch to dark) */}
        <Moon
          className={`absolute inset-0 size-5 transition-all duration-300 ${
            theme === "light"
              ? "opacity-100 rotate-0 scale-100 text-[#D4A843]"
              : "opacity-0 -rotate-90 scale-50 text-[#D4A843]"
          }`}
        />
      </div>
    </button>
  );
}
