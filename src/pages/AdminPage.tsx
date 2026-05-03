import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  BarChart3,
  Users,
  Play,
  Radio,
  Eye,
  MessageSquare,
  Trash2,
  Plus,
  ArrowLeft,
  Activity,
  Globe,
  TrendingUp,
  Star,
  Clock,
  Mail,
} from "lucide-react";

/* ─── Stat Card ─── */
function StatCard({ icon: Icon, label, value, color = "gold", trend }: {
  icon: any; label: string; value: string | number; color?: string; trend?: string;
}) {
  const colors: Record<string, string> = {
    gold: "from-[#D4A843]/20 to-[#D4A843]/5 border-[#D4A843]/20 text-[#D4A843]",
    red: "from-red-500/20 to-red-500/5 border-red-500/20 text-red-400",
    blue: "from-blue-500/20 to-blue-500/5 border-blue-500/20 text-blue-400",
    green: "from-green-500/20 to-green-500/5 border-green-500/20 text-green-400",
    purple: "from-purple-500/20 to-purple-500/5 border-purple-500/20 text-purple-400",
  };
  const c = colors[color] || colors.gold;
  return (
    <div className={`bg-gradient-to-br ${c} border rounded-lg p-5`}>
      <div className="flex items-center justify-between mb-3">
        <Icon className="size-5 opacity-70" />
        {trend && <span className="text-xs font-medium text-green-400 flex items-center gap-0.5"><TrendingUp className="size-3" />{trend}</span>}
      </div>
      <p className="font-display text-3xl tracking-wider text-[#f0ece4]">{value}</p>
      <p className="text-xs text-[#888078] tracking-wider uppercase mt-1">{label}</p>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   ADMIN DASHBOARD PAGE
   ═══════════════════════════════════════════════════════════ */
export function AdminPage() {
  // All Convex queries
  const stats = useQuery(api.admin.getDashboardStats);
  const subscribers = useQuery(api.admin.listSubscribers);
  const tickerItems = useQuery(api.admin.listTickerItems);
  const guests = useQuery(api.admin.listGuests);
  const pageViewStats = useQuery(api.admin.getPageViewStats);
  const contentItems = useQuery(api.contentLib.listContent, {});
  const liveSessions = useQuery(api.contentLib.getAllLiveSessions);

  // Mutations
  const addTickerItem = useMutation(api.admin.addTickerItem);
  const deleteTickerItem = useMutation(api.admin.deleteTickerItem);
  const updateTickerItem = useMutation(api.admin.updateTickerItem);
  const addGuest = useMutation(api.admin.addGuest);
  const deleteGuest = useMutation(api.admin.deleteGuest);
  const deleteSubscriber = useMutation(api.admin.deleteSubscriber);
  const addContent = useMutation(api.contentLib.addContent);
  const deleteContent = useMutation(api.contentLib.deleteContent);
  const addLiveSession = useMutation(api.contentLib.addLiveSession);
  const deleteLiveSession = useMutation(api.contentLib.deleteLiveSession);

  // Form states
  const [newTicker, setNewTicker] = useState("");
  const [newGuestName, setNewGuestName] = useState("");
  const [newGuestTitle, setNewGuestTitle] = useState("");
  const [newGuestQuote, setNewGuestQuote] = useState("");
  const [newContentTitle, setNewContentTitle] = useState("");
  const [newContentCategory, setNewContentCategory] = useState("interview");
  const [newContentYoutubeId, setNewContentYoutubeId] = useState("");
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionDate, setNewSessionDate] = useState("");
  const [newSessionPlatform, setNewSessionPlatform] = useState("youtube");
  const [activeTab, setActiveTab] = useState<"overview" | "content" | "live" | "ticker" | "guests" | "subscribers">("overview");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#D4A843]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/v2" className="flex items-center gap-2 text-[#888078] hover:text-[#D4A843] transition-colors">
              <ArrowLeft className="size-4" /> <span className="text-sm hidden sm:inline">Back to Site</span>
            </a>
            <div className="h-6 w-px bg-[#D4A843]/20" />
            <h1 className="font-display text-xl tracking-wider">
              <span className="text-[#D4A843]">3GMG</span> ADMIN
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs text-[#888078]">Connected to Convex</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: "overview" as const, label: "Overview", icon: BarChart3 },
            { id: "content" as const, label: "Content", icon: Play },
            { id: "live" as const, label: "Live Sessions", icon: Radio },
            { id: "ticker" as const, label: "News Ticker", icon: MessageSquare },
            { id: "guests" as const, label: "Guests", icon: Star },
            { id: "subscribers" as const, label: "Subscribers", icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab.id
                  ? "bg-[#D4A843] text-[#0a0a0a]"
                  : "bg-[#141414] text-[#888078] hover:text-[#f0ece4] border border-[#D4A843]/10 hover:border-[#D4A843]/30"
              }`}
            >
              <tab.icon className="size-4" /> {tab.label}
            </button>
          ))}
        </div>

        {/* ─── Overview Tab ─── */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Play} label="Total Content" value={stats?.totalContent ?? 0} color="gold" />
              <StatCard icon={Radio} label="Live Sessions" value={stats?.totalSessions ?? 0} color="red" />
              <StatCard icon={Users} label="Subscribers" value={stats?.totalSubscribers ?? 0} color="blue" />
              <StatCard icon={Eye} label="Page Views" value={stats?.totalPageViews ?? 0} color="green" />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard icon={Activity} label="Views Today" value={stats?.todayPageViews ?? 0} color="purple" />
              <StatCard icon={Star} label="Featured Guests" value={stats?.totalGuests ?? 0} color="gold" />
              <StatCard icon={MessageSquare} label="Ticker Items" value={stats?.activeTickerItems ?? 0} color="blue" />
              <StatCard icon={Clock} label="Upcoming Lives" value={stats?.upcomingSessions ?? 0} color="red" />
            </div>

            {/* Page Views Chart (simple bar) */}
            {pageViewStats && pageViewStats.last7Days && (
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-6 flex items-center gap-2">
                  <Globe className="size-5 text-[#D4A843]" /> Page Views — Last 7 Days
                </h3>
                <div className="flex items-end gap-3 h-40">
                  {pageViewStats.last7Days.map((day: { date: string; views: number }) => {
                    const maxViews = Math.max(...pageViewStats.last7Days.map((d: { views: number }) => d.views), 1);
                    const height = Math.max((day.views / maxViews) * 100, 4);
                    return (
                      <div key={day.date} className="flex-1 flex flex-col items-center gap-2">
                        <span className="text-xs text-[#888078]">{day.views}</span>
                        <div
                          className="w-full bg-gradient-to-t from-[#D4A843] to-[#E8C767] rounded-t transition-all duration-500"
                          style={{ height: `${height}%` }}
                        />
                        <span className="text-[10px] text-[#888078]">{day.date.slice(5)}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Views by page */}
            {pageViewStats && pageViewStats.byPage && (
              <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                  <BarChart3 className="size-5 text-[#D4A843]" /> Views by Page
                </h3>
                <div className="space-y-3">
                  {Object.entries(pageViewStats.byPage).map(([page, count]) => (
                    <div key={page} className="flex items-center gap-4">
                      <span className="text-sm text-[#c8c0b0] w-24 truncate">{page}</span>
                      <div className="flex-1 h-3 bg-[#1a1a1a] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8C767] rounded-full transition-all duration-500"
                          style={{ width: `${Math.min(((count as number) / (pageViewStats.total || 1)) * 100, 100)}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-[#D4A843] w-12 text-right">{count as number}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Content Management Tab ─── */}
        {activeTab === "content" && (
          <div className="space-y-6">
            {/* Add content form */}
            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
              <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                <Plus className="size-5 text-[#D4A843]" /> Add Content
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newContentTitle}
                  onChange={(e) => setNewContentTitle(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none"
                />
                <select
                  value={newContentCategory}
                  onChange={(e) => setNewContentCategory(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] focus:border-[#D4A843]/40 focus:outline-none"
                >
                  <option value="interview">Interview</option>
                  <option value="street-reporting">Street Reporting</option>
                  <option value="podcast">Podcast</option>
                  <option value="music">Music</option>
                </select>
                <input
                  type="text"
                  placeholder="YouTube Video ID"
                  value={newContentYoutubeId}
                  onChange={(e) => setNewContentYoutubeId(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none"
                />
                <button
                  onClick={async () => {
                    if (!newContentTitle) return;
                    await addContent({
                      title: newContentTitle,
                      description: "",
                      category: newContentCategory,
                      youtubeId: newContentYoutubeId || undefined,
                    });
                    setNewContentTitle("");
                    setNewContentYoutubeId("");
                  }}
                  className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all"
                >
                  Add Content
                </button>
              </div>
            </div>

            {/* Content list */}
            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D4A843]/10">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">
                  All Content <span className="text-[#888078] text-sm">({contentItems?.length ?? 0})</span>
                </h3>
              </div>
              <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                {contentItems && contentItems.length > 0 ? contentItems.map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-center gap-4">
                      {item.youtubeId && (
                        <img src={`https://img.youtube.com/vi/${item.youtubeId}/default.jpg`} alt="" className="w-16 h-12 object-cover rounded" />
                      )}
                      <div>
                        <p className="text-sm text-[#f0ece4] font-medium">{item.title}</p>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4A843]">{item.category}</span>
                      </div>
                    </div>
                    <button onClick={() => deleteContent({ id: item._id })} className="text-[#888078] hover:text-red-400 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center text-[#888078] text-sm">
                    No content yet. Add your first piece above!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Live Sessions Tab ─── */}
        {activeTab === "live" && (
          <div className="space-y-6">
            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
              <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                <Plus className="size-5 text-[#D4A843]" /> Schedule Live Session
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input
                  type="text"
                  placeholder="Session Title"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none"
                />
                <input
                  type="datetime-local"
                  value={newSessionDate}
                  onChange={(e) => setNewSessionDate(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] focus:border-[#D4A843]/40 focus:outline-none"
                />
                <select
                  value={newSessionPlatform}
                  onChange={(e) => setNewSessionPlatform(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] focus:border-[#D4A843]/40 focus:outline-none"
                >
                  <option value="youtube">YouTube</option>
                  <option value="facebook">Facebook</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                </select>
                <button
                  onClick={async () => {
                    if (!newSessionTitle || !newSessionDate) return;
                    await addLiveSession({
                      title: newSessionTitle,
                      description: "",
                      scheduledAt: new Date(newSessionDate).toISOString(),
                      platform: newSessionPlatform,
                    });
                    setNewSessionTitle("");
                    setNewSessionDate("");
                  }}
                  className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all"
                >
                  Schedule
                </button>
              </div>
            </div>

            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D4A843]/10">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">
                  All Sessions <span className="text-[#888078] text-sm">({liveSessions?.length ?? 0})</span>
                </h3>
              </div>
              <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                {liveSessions && liveSessions.length > 0 ? liveSessions.map((session: any) => (
                  <div key={session._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${session.isLive ? "bg-red-500 animate-pulse" : session.isCompleted ? "bg-[#888078]" : "bg-green-400"}`} />
                      <div>
                        <p className="text-sm text-[#f0ece4] font-medium">{session.title}</p>
                        <p className="text-[10px] text-[#888078]">
                          {new Date(session.scheduledAt).toLocaleString()} — {session.platform}
                        </p>
                      </div>
                    </div>
                    <button onClick={() => deleteLiveSession({ id: session._id })} className="text-[#888078] hover:text-red-400 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center text-[#888078] text-sm">
                    No live sessions scheduled yet.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── News Ticker Tab ─── */}
        {activeTab === "ticker" && (
          <div className="space-y-6">
            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
              <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                <Plus className="size-5 text-[#D4A843]" /> Add Ticker Item
              </h3>
              <div className="flex gap-4">
                <input
                  type="text"
                  placeholder="e.g. 🔥 NEW EPISODE DROPPING FRIDAY"
                  value={newTicker}
                  onChange={(e) => setNewTicker(e.target.value)}
                  className="flex-1 bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none"
                />
                <button
                  onClick={async () => {
                    if (!newTicker) return;
                    await addTickerItem({ text: newTicker, isActive: true });
                    setNewTicker("");
                  }}
                  className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all whitespace-nowrap"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D4A843]/10">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">
                  Ticker Items <span className="text-[#888078] text-sm">({tickerItems?.length ?? 0})</span>
                </h3>
              </div>
              <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                {tickerItems && tickerItems.length > 0 ? tickerItems.map((item: any) => (
                  <div key={item._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => updateTickerItem({ id: item._id, isActive: !item.isActive })}
                        className={`w-3 h-3 rounded-full border-2 transition-all ${item.isActive ? "bg-green-400 border-green-400" : "bg-transparent border-[#888078]"}`}
                      />
                      <p className={`text-sm ${item.isActive ? "text-[#f0ece4]" : "text-[#888078] line-through"}`}>{item.text}</p>
                    </div>
                    <button onClick={() => deleteTickerItem({ id: item._id })} className="text-[#888078] hover:text-red-400 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center text-[#888078] text-sm">
                    No ticker items. Defaults will be used on the site.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Guests Tab ─── */}
        {activeTab === "guests" && (
          <div className="space-y-6">
            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-6">
              <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2">
                <Plus className="size-5 text-[#D4A843]" /> Add Guest
              </h3>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <input type="text" placeholder="Guest Name" value={newGuestName} onChange={(e) => setNewGuestName(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                <input type="text" placeholder="Title (e.g. Rapper)" value={newGuestTitle} onChange={(e) => setNewGuestTitle(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                <input type="text" placeholder="Quote" value={newGuestQuote} onChange={(e) => setNewGuestQuote(e.target.value)}
                  className="bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                <button
                  onClick={async () => {
                    if (!newGuestName) return;
                    await addGuest({
                      name: newGuestName,
                      title: newGuestTitle || undefined,
                      quote: newGuestQuote || undefined,
                      featured: true,
                    });
                    setNewGuestName(""); setNewGuestTitle(""); setNewGuestQuote("");
                  }}
                  className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-6 py-2.5 hover:bg-[#E8C767] transition-all"
                >
                  Add Guest
                </button>
              </div>
            </div>

            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D4A843]/10">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">
                  Guests <span className="text-[#888078] text-sm">({guests?.length ?? 0})</span>
                </h3>
              </div>
              <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                {guests && guests.length > 0 ? guests.map((g: any) => (
                  <div key={g._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4A843] to-[#B8922E] flex items-center justify-center text-[#0a0a0a] font-display text-sm">{g.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm text-[#f0ece4] font-medium">{g.name}</p>
                        <p className="text-[10px] text-[#888078]">{g.title || "Guest"}</p>
                      </div>
                    </div>
                    <button onClick={() => deleteGuest({ id: g._id })} className="text-[#888078] hover:text-red-400 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center text-[#888078] text-sm">
                    No guests added. Defaults are shown on the site.
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── Subscribers Tab ─── */}
        {activeTab === "subscribers" && (
          <div className="space-y-6">
            <div className="grid sm:grid-cols-3 gap-4">
              <StatCard icon={Users} label="Total Subscribers" value={subscribers?.length ?? 0} color="blue" />
              <StatCard icon={Mail} label="Email Subscribers" value={subscribers?.filter((s: any) => s.email).length ?? 0} color="gold" />
              <StatCard icon={Activity} label="This Month" value={subscribers?.filter((s: any) => s.subscribedAt?.startsWith(new Date().toISOString().slice(0, 7))).length ?? 0} color="green" />
            </div>

            <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
              <div className="px-6 py-4 border-b border-[#D4A843]/10">
                <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">
                  All Subscribers <span className="text-[#888078] text-sm">({subscribers?.length ?? 0})</span>
                </h3>
              </div>
              <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
                {subscribers && subscribers.length > 0 ? subscribers.map((sub: any) => (
                  <div key={sub._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
                    <div>
                      <p className="text-sm text-[#f0ece4]">{sub.email || sub.phone || "No contact"}</p>
                      <p className="text-[10px] text-[#888078]">
                        {new Date(sub.subscribedAt).toLocaleDateString()} — via {sub.source || "unknown"}
                      </p>
                    </div>
                    <button onClick={() => deleteSubscriber({ id: sub._id })} className="text-[#888078] hover:text-red-400 transition-colors">
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                )) : (
                  <div className="px-6 py-8 text-center text-[#888078] text-sm">
                    No subscribers yet. They'll appear here as people sign up!
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
