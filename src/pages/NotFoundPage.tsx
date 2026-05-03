/**
 * 404 — Branded "Not Found" page
 * Keeps the 3GMG aesthetic with a graffiti-style message
 */
import { useNavigate } from "react-router-dom";
import { Home, ArrowLeft, Search } from "lucide-react";

export function NotFoundPage() {
  const navigate = useNavigate();

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center px-4 relative overflow-hidden"
      style={{
        backgroundImage: "url(/images/hero-graffiti.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

      {/* Content */}
      <div className="relative z-10 text-center max-w-lg">
        {/* 404 number */}
        <h1 className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter">
          <span className="text-[#D4A843] drop-shadow-[0_0_30px_rgba(212,168,67,0.4)]">4</span>
          <span className="text-red-500 drop-shadow-[0_0_30px_rgba(239,68,68,0.4)]">0</span>
          <span className="text-[#D4A843] drop-shadow-[0_0_30px_rgba(212,168,67,0.4)]">4</span>
        </h1>

        {/* Message */}
        <p className="text-2xl sm:text-3xl font-bold text-[#f0ece4] mt-2 tracking-wide">
          WRONG BLOCK, HOMIE
        </p>
        <p className="text-[#888078] mt-3 text-sm sm:text-base leading-relaxed">
          This page doesn't exist — but the rest of the site is still lit.
          <br />
          Head back home or search for what you need.
        </p>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row gap-3 mt-8 justify-center">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#D4A843] text-black font-bold rounded-sm hover:bg-[#E8C05A] transition-colors tracking-wider text-sm"
          >
            <Home className="size-4" />
            BACK TO HOME
          </button>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-[#D4A843]/40 text-[#D4A843] font-bold rounded-sm hover:border-[#D4A843] hover:bg-[#D4A843]/10 transition-colors tracking-wider text-sm"
          >
            <ArrowLeft className="size-4" />
            GO BACK
          </button>
          <button
            onClick={() => navigate("/search")}
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-transparent border border-[#888078]/30 text-[#888078] font-bold rounded-sm hover:border-[#888078] hover:text-[#f0ece4] transition-colors tracking-wider text-sm"
          >
            <Search className="size-4" />
            SEARCH
          </button>
        </div>

        {/* Branding */}
        <div className="mt-12 text-[#888078]/50 text-xs tracking-widest uppercase">
          3GMG Media • Meadowbrook Montrell
        </div>
      </div>
    </div>
  );
}
