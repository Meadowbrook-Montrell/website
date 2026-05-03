/**
 * Password gate for admin pages.
 * Stores auth in sessionStorage so user stays logged in per browser session.
 */
import { useState } from "react";
import { Lock, Eye, EyeOff } from "lucide-react";

const ADMIN_PASSWORD = "3GMG817!";
const STORAGE_KEY = "3gmg_admin_auth";

export function AdminGate({ children }: { children: React.ReactNode }) {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem(STORAGE_KEY) === "true";
  });
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      sessionStorage.setItem(STORAGE_KEY, "true");
      setAuthenticated(true);
      setError(false);
    } else {
      setError(true);
      setPassword("");
    }
  };

  if (authenticated) {
    return <>{children}</>;
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-[#0a0a0a] text-[#f0ece4] relative"
      style={{
        backgroundImage: "url('/images/hero-graffiti.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/90" />
      <div className="relative z-10 w-full max-w-sm mx-4">
        <div className="bg-[#141414]/95 backdrop-blur-sm border border-[#D4A843]/20 rounded-sm p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center">
              <Lock className="size-7 text-[#D4A843]" />
            </div>
            <img src="/images/logo-3gmg-graffiti.png" alt="3GMG" className="h-8 mx-auto mb-3" />
            <h1 className="font-display text-xl tracking-wider">ADMIN ACCESS</h1>
            <p className="text-xs text-[#888078] mt-1">Enter password to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false); }}
                placeholder="Password"
                autoFocus
                className={`w-full bg-[#0a0a0a] border rounded-sm px-4 py-3 pr-10 text-[#f0ece4] placeholder-[#555] focus:outline-none transition-colors ${
                  error ? "border-red-500 focus:border-red-500" : "border-[#333] focus:border-[#D4A843]"
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#555] hover:text-[#888]"
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>

            {error && (
              <p className="text-red-400 text-xs text-center">Incorrect password. Try again.</p>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all"
            >
              Enter
            </button>
          </form>

          <p className="text-center text-[10px] text-[#555] mt-6">3GMG Media • Authorized Personnel Only</p>
        </div>
      </div>
    </div>
  );
}
