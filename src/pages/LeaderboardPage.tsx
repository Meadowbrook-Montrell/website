import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Award, ArrowLeft, Crown, Star, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

export default function LeaderboardPage() {
  const board = useQuery(api.features2.getLeaderboard);
  const medals = ["🥇", "🥈", "🥉"];
  const levelStyles: Record<string, { bg: string; text: string; border: string }> = {
    legend: { bg: "from-[#D4A843]/20 to-[#D4A843]/5", text: "text-[#D4A843]", border: "border-[#D4A843]/30" },
    vip: { bg: "from-purple-500/20 to-purple-500/5", text: "text-purple-400", border: "border-purple-500/20" },
    regular: { bg: "from-blue-500/20 to-blue-500/5", text: "text-blue-400", border: "border-blue-500/20" },
    rookie: { bg: "from-gray-500/10 to-transparent", text: "text-[#888]", border: "border-[#333]" },
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      <div className="relative bg-gradient-to-b from-[#D4A843]/10 to-transparent">
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4A843] text-sm mb-8 hover:text-[#E8C767] transition-colors"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="flex items-center gap-3 mb-4">
            <Award className="size-5 text-[#D4A843]" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-[#D4A843] uppercase">Community</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-4">FAN <span className="text-[#D4A843]">LEADERBOARD</span></h1>
          <p className="text-[#888078] max-w-xl text-lg">The most engaged fans in the 3GMG community. Earn points by posting, asking questions, attending events, and supporting the brand.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Level Legend */}
        <div className="flex flex-wrap gap-3 mb-8">
          {[
            { level: "Legend", pts: "1000+", icon: Crown, color: "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20" },
            { level: "VIP", pts: "500+", icon: Star, color: "text-purple-400 bg-purple-500/10 border-purple-500/20" },
            { level: "Regular", pts: "100+", icon: Zap, color: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
            { level: "Rookie", pts: "0+", icon: Users, color: "text-[#888] bg-[#1a1a1a] border-[#333]" },
          ].map(l => (
            <div key={l.level} className={`inline-flex items-center gap-2 px-3 py-1.5 rounded border text-xs font-medium ${l.color}`}>
              <l.icon className="size-3.5" /> {l.level} ({l.pts})
            </div>
          ))}
        </div>

        {/* Top 3 Podium */}
        {(board?.length ?? 0) >= 3 && (
          <div className="grid grid-cols-3 gap-4 mb-10">
            {[1, 0, 2].map(idx => {
              const fan = board![idx];
              if (!fan) return null;
              const isFirst = idx === 0;
              return (
                <div key={fan._id} className={`text-center ${isFirst ? "order-2" : idx === 1 ? "order-1 mt-8" : "order-3 mt-8"}`}>
                  <div className={`bg-[#141414]/80 border rounded-lg p-6 ${isFirst ? "border-[#D4A843]/40 shadow-[0_0_30px_rgba(212,168,67,0.2)]" : "border-[#D4A843]/10"}`}>
                    <span className="text-4xl">{medals[idx]}</span>
                    <div className={`w-16 h-16 rounded-full mx-auto my-3 flex items-center justify-center font-display text-2xl ${isFirst ? "bg-gradient-to-br from-[#D4A843] to-[#B8922E] text-[#0a0a0a]" : "bg-[#1a1a1a] text-[#D4A843]"}`}>
                      {fan.fanName.charAt(0)}
                    </div>
                    <p className="font-display text-lg text-[#f0ece4] tracking-wider">{fan.fanName}</p>
                    <p className="text-[10px] text-[#D4A843] tracking-widest uppercase mt-1">{fan.level || "Rookie"}</p>
                    <p className="font-display text-2xl text-[#D4A843] mt-2">{fan.points.toLocaleString()}<span className="text-xs text-[#888] ml-1">pts</span></p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full Rankings */}
        <div className="bg-[#141414]/80 border border-[#D4A843]/10 rounded-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-[#D4A843]/10 flex items-center justify-between">
            <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">🏆 Full Rankings</h3>
            <span className="text-xs text-[#888]">{board?.length ?? 0} fans</span>
          </div>
          <div className="divide-y divide-[#D4A843]/5">
            {board?.map((fan, idx) => {
              const style = levelStyles[fan.level || "rookie"];
              return (
                <div key={fan._id} className={`flex items-center justify-between px-6 py-4 hover:bg-[#1a1a1a]/50 transition-colors ${idx < 3 ? "bg-gradient-to-r " + style.bg : ""}`}>
                  <div className="flex items-center gap-4">
                    <span className="text-lg w-10 text-center">{idx < 3 ? medals[idx] : <span className="text-[#555] font-display">#{idx + 1}</span>}</span>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-display ${idx < 3 ? "bg-[#D4A843]/20 text-[#D4A843]" : "bg-[#1a1a1a] text-[#888]"}`}>{fan.fanName.charAt(0)}</div>
                    <div>
                      <p className={`font-medium ${style.text}`}>{fan.fanName}</p>
                      <p className="text-[10px] text-[#555] tracking-widest uppercase">{fan.level || "Rookie"}</p>
                    </div>
                  </div>
                  <span className="font-display text-xl text-[#D4A843]">{fan.points.toLocaleString()}</span>
                </div>
              );
            })}
            {(!board || board.length === 0) && (
              <div className="text-center py-16 text-[#888]">
                <Award className="size-12 mx-auto mb-4 opacity-30" />
                <p>Leaderboard is empty. Start engaging to earn points!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
