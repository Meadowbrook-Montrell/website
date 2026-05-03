/**
 * Admin Operations Dashboard — Calendar, Guest CRM, Bookings,
 * Revenue, Sponsors, Newsletters, Show Notes, Link-in-Bio, Community, Social Metrics
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Calendar, Users, Handshake, DollarSign, Mail,
  FileText, Link2, MessageSquare, BarChart3, Plus, Trash2,
  Check, X, Eye, Clock, ChevronLeft, ChevronRight, Pin,
  TrendingUp, Mic, Edit, ExternalLink,
} from "lucide-react";

type Tab = "overview" | "calendar" | "guests" | "bookings" | "sponsors" | "revenue" | "newsletters" | "shownotes" | "links" | "community" | "metrics";

const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
  { id: "overview", label: "Overview", icon: BarChart3 },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "guests", label: "Guest CRM", icon: Users },
  { id: "bookings", label: "Bookings", icon: Mic },
  { id: "sponsors", label: "Sponsors", icon: Handshake },
  { id: "revenue", label: "Revenue", icon: DollarSign },
  { id: "newsletters", label: "Newsletters", icon: Mail },
  { id: "shownotes", label: "Show Notes", icon: FileText },
  { id: "links", label: "Link-in-Bio", icon: Link2 },
  { id: "community", label: "Community", icon: MessageSquare },
  { id: "metrics", label: "Social Metrics", icon: TrendingUp },
];

const statusColors: Record<string, string> = {
  pitched: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  confirmed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  recorded: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  published: "bg-green-500/20 text-green-400 border-green-500/30",
  declined: "bg-red-500/20 text-red-400 border-red-500/30",
  pending: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  approved: "bg-green-500/20 text-green-400 border-green-500/30",
  active: "bg-green-500/20 text-green-400 border-green-500/30",
  completed: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  inquiry: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  negotiating: "bg-purple-500/20 text-purple-400 border-purple-500/30",
  received: "bg-green-500/20 text-green-400 border-green-500/30",
  invoiced: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  planned: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  "in-progress": "bg-amber-500/20 text-amber-400 border-amber-500/30",
  cancelled: "bg-red-500/20 text-red-400 border-red-500/30",
  draft: "bg-slate-500/20 text-slate-400 border-slate-500/30",
  scheduled: "bg-blue-500/20 text-blue-400 border-blue-500/30",
  sent: "bg-green-500/20 text-green-400 border-green-500/30",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${statusColors[status] || "bg-[#333] text-[#888] border-[#444]"}`}>
      {status}
    </span>
  );
}

function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/10 rounded-sm p-5 ${className}`}>
      {children}
    </div>
  );
}

export function AdminOpsPage() {
  const [activeTab, setActiveTab] = useState<Tab>("overview");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Header */}
      <div className="border-b border-[#D4A843]/10 bg-[#0a0a0a]/95 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link to="/admin" className="text-[#D4A843] hover:text-[#E8C767] transition-colors">
              <ArrowLeft className="size-5" />
            </Link>
            <div>
              <h1 className="font-display text-xl tracking-wider">OPERATIONS HUB</h1>
              <p className="text-xs text-[#888078]">Business management dashboard</p>
            </div>
          </div>
          <Link to="/" className="text-xs text-[#D4A843] hover:text-[#E8C767] flex items-center gap-1">
            <ExternalLink className="size-3" /> View Site
          </Link>
        </div>

        {/* Tabs */}
        <div className="max-w-7xl mx-auto px-4 flex gap-1 overflow-x-auto pb-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs font-bold tracking-wider uppercase rounded-sm whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? "bg-[#D4A843] text-[#0a0a0a]"
                  : "text-[#888078] hover:text-[#f0ece4] hover:bg-[#1a1a1a]"
              }`}
            >
              <tab.icon className="size-3.5" /> {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        {activeTab === "overview" && <OpsOverviewTab />}
        {activeTab === "calendar" && <CalendarTab />}
        {activeTab === "guests" && <GuestCRMTab />}
        {activeTab === "bookings" && <BookingsTab />}
        {activeTab === "sponsors" && <SponsorsTab />}
        {activeTab === "revenue" && <RevenueTab />}
        {activeTab === "newsletters" && <NewslettersTab />}
        {activeTab === "shownotes" && <ShowNotesTab />}
        {activeTab === "links" && <LinksTab />}
        {activeTab === "community" && <CommunityTab />}
        {activeTab === "metrics" && <MetricsTab />}
      </div>
    </div>
  );
}

/* ─── OVERVIEW TAB ────────────────────────────────────────── */
export function OpsOverviewTab() {
  const stats = useQuery(api.operations.getOperationsStats);
  const revenueStats = useQuery(api.operations.getRevenueStats);

  if (!stats) return <div className="text-center py-12 text-[#555]">Loading...</div>;

  const cards = [
    { label: "Total Guests", value: stats.totalGuests, icon: Users, color: "#D4A843" },
    { label: "Pending Bookings", value: stats.pendingBookings, icon: Clock, color: "#f59e0b" },
    { label: "Active Sponsors", value: stats.activeSponsors, icon: Handshake, color: "#22c55e" },
    { label: "Total Revenue", value: `$${(revenueStats?.total || 0).toLocaleString()}`, icon: DollarSign, color: "#22c55e" },
    { label: "Subscribers", value: stats.totalSubscribers, icon: Mail, color: "#3b82f6" },
    { label: "Content Items", value: stats.totalContent, icon: FileText, color: "#a855f7" },
    { label: "Pending Reviews", value: stats.pendingCommunity, icon: MessageSquare, color: "#ef4444" },
    { label: "Newsletters Sent", value: stats.sentNewsletters, icon: Mail, color: "#D4A843" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.label}>
            <c.icon className="size-5 mb-2" style={{ color: c.color }} />
            <div className="font-display text-2xl tracking-wider">{c.value}</div>
            <div className="text-xs text-[#888078] tracking-widest uppercase mt-1">{c.label}</div>
          </Card>
        ))}
      </div>

      {/* Guest Pipeline */}
      <Card>
        <h3 className="font-display text-lg tracking-wider text-[#D4A843] mb-4">GUEST PIPELINE</h3>
        <div className="grid grid-cols-4 gap-4">
          {(["pitched", "confirmed", "recorded", "published"] as const).map((s) => (
            <div key={s} className="text-center">
              <div className="font-display text-3xl">{stats.guestsByStatus[s]}</div>
              <StatusBadge status={s} />
            </div>
          ))}
        </div>
      </Card>

      {/* Revenue by Source */}
      {revenueStats && revenueStats.count > 0 && (
        <Card>
          <h3 className="font-display text-lg tracking-wider text-[#D4A843] mb-4">REVENUE BY SOURCE</h3>
          <div className="space-y-2">
            {Object.entries(revenueStats.bySource).map(([source, amount]) => (
              <div key={source} className="flex items-center justify-between">
                <span className="text-sm text-[#888078] capitalize">{source.replace("-", " ")}</span>
                <span className="font-bold text-[#D4A843]">${(amount as number).toLocaleString()}</span>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─── CALENDAR TAB ───────────────────────────────────────── */
export function CalendarTab() {
  const [currentMonth, setCurrentMonth] = useState(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const events = useQuery(api.operations.getCalendarEvents, { month: currentMonth });
  const addEvent = useMutation(api.operations.addCalendarEvent);
  const deleteEvent = useMutation(api.operations.deleteCalendarEvent);
  const updateEvent = useMutation(api.operations.updateCalendarEvent);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", type: "episode", date: "", time: "", description: "" });

  const year = parseInt(currentMonth.split("-")[0]);
  const month = parseInt(currentMonth.split("-")[1]);
  const daysInMonth = new Date(year, month, 0).getDate();
  const firstDayOfWeek = new Date(year, month - 1, 1).getDay();
  const monthName = new Date(year, month - 1).toLocaleString("default", { month: "long", year: "numeric" });

  const prevMonth = () => {
    const d = new Date(year, month - 2, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };
  const nextMonth = () => {
    const d = new Date(year, month, 1);
    setCurrentMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`);
  };

  const typeColors: Record<string, string> = {
    episode: "#D4A843",
    interview: "#3b82f6",
    "street-report": "#ef4444",
    "social-post": "#a855f7",
    "live-session": "#22c55e",
    other: "#888078",
  };

  const handleAdd = async () => {
    if (!form.title || !form.date) return;
    await addEvent({
      title: form.title,
      type: form.type,
      date: form.date,
      time: form.time || undefined,
      description: form.description || undefined,
      status: "planned",
      color: typeColors[form.type],
    });
    setForm({ title: "", type: "episode", date: "", time: "", description: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"><ChevronLeft className="size-5 text-[#D4A843]" /></button>
          <h2 className="font-display text-xl tracking-wider">{monthName.toUpperCase()}</h2>
          <button onClick={nextMonth} className="p-2 hover:bg-[#1a1a1a] rounded transition-colors"><ChevronRight className="size-5 text-[#D4A843]" /></button>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
          <Plus className="size-3" /> Add Event
        </button>
      </div>

      {showAdd && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Event title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <select value={form.type} onChange={(e) => setForm({...form, type: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none">
              <option value="episode">📼 Episode</option>
              <option value="interview">🎙 Interview</option>
              <option value="street-report">📍 Street Report</option>
              <option value="social-post">📱 Social Post</option>
              <option value="live-session">🔴 Live Session</option>
              <option value="other">📌 Other</option>
            </select>
            <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input type="time" value={form.time} onChange={(e) => setForm({...form, time: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
          </div>
          <textarea placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="w-full mt-3 bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none resize-none" rows={2} />
          <button onClick={handleAdd} className="mt-3 px-6 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">Save</button>
        </Card>
      )}

      {/* Calendar Grid */}
      <Card>
        <div className="grid grid-cols-7 gap-px">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="text-center text-xs font-bold tracking-widest uppercase text-[#D4A843] py-2">{d}</div>
          ))}
          {Array.from({ length: firstDayOfWeek }).map((_, i) => (
            <div key={`empty-${i}`} className="min-h-[80px] bg-[#0a0a0a]/30" />
          ))}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${currentMonth}-${String(day).padStart(2, "0")}`;
            const dayEvents = events?.filter((e) => e.date === dateStr) || [];
            const isToday = dateStr === new Date().toISOString().split("T")[0];

            return (
              <div key={day} className={`min-h-[80px] p-1 border border-[#1a1a1a] ${isToday ? "bg-[#D4A843]/5 border-[#D4A843]/30" : "bg-[#0a0a0a]/30"}`}>
                <div className={`text-xs font-bold mb-1 ${isToday ? "text-[#D4A843]" : "text-[#888078]"}`}>{day}</div>
                {dayEvents.slice(0, 3).map((ev) => (
                  <div
                    key={ev._id}
                    className="text-[9px] px-1 py-0.5 rounded mb-0.5 truncate cursor-pointer group relative"
                    style={{ backgroundColor: (ev.color || "#D4A843") + "20", color: ev.color || "#D4A843" }}
                  >
                    {ev.title}
                    <button onClick={() => deleteEvent({ id: ev._id })} className="absolute right-0 top-0 hidden group-hover:block text-red-400 px-1">×</button>
                  </div>
                ))}
                {dayEvents.length > 3 && <div className="text-[9px] text-[#555]">+{dayEvents.length - 3} more</div>}
              </div>
            );
          })}
        </div>
      </Card>

      {/* Events List */}
      {events && events.length > 0 && (
        <Card>
          <h3 className="font-display text-sm tracking-wider text-[#D4A843] mb-3">EVENTS THIS MONTH</h3>
          <div className="space-y-2">
            {events.sort((a, b) => a.date.localeCompare(b.date)).map((ev) => (
              <div key={ev._id} className="flex items-center gap-3 p-2 bg-[#0a0a0a]/40 rounded-sm">
                <div className="w-1 h-8 rounded-full" style={{ backgroundColor: ev.color || "#D4A843" }} />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-bold truncate">{ev.title}</div>
                  <div className="text-xs text-[#888078]">{ev.date} {ev.time && `at ${ev.time}`}</div>
                </div>
                <StatusBadge status={ev.status} />
                <select
                  value={ev.status}
                  onChange={(e) => updateEvent({ id: ev._id, status: e.target.value })}
                  className="bg-transparent border border-[#333] rounded text-[10px] text-[#888] px-1 py-0.5"
                >
                  {["planned", "in-progress", "recorded", "published", "cancelled"].map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <button onClick={() => deleteEvent({ id: ev._id })} className="text-red-400/50 hover:text-red-400 transition-colors">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

/* ─── GUEST CRM TAB ──────────────────────────────────────── */
export function GuestCRMTab() {
  const guests = useQuery(api.operations.getGuestCRM, {});
  const addGuest = useMutation(api.operations.addGuestCRM);
  const updateGuest = useMutation(api.operations.updateGuestCRM);
  const deleteGuest = useMutation(api.operations.deleteGuestCRM);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", instagram: "", bio: "", status: "pitched" as string, notes: "" });
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = guests?.filter((g) => filterStatus === "all" || g.status === filterStatus) || [];

  const handleAdd = async () => {
    if (!form.name) return;
    await addGuest({
      name: form.name,
      email: form.email || undefined,
      phone: form.phone || undefined,
      instagram: form.instagram || undefined,
      bio: form.bio || undefined,
      status: form.status,
      notes: form.notes || undefined,
    });
    setForm({ name: "", email: "", phone: "", instagram: "", bio: "", status: "pitched", notes: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2 overflow-x-auto">
          {["all", "pitched", "confirmed", "recorded", "published", "declined"].map((s) => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm transition-all ${filterStatus === s ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>
              {s} {s !== "all" && `(${guests?.filter((g) => g.status === s).length || 0})`}
            </button>
          ))}
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
          <Plus className="size-3" /> Add Guest
        </button>
      </div>

      {showAdd && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <input type="text" placeholder="Guest name *" value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input type="email" placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input type="tel" placeholder="Phone" value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input type="text" placeholder="@instagram" value={form.instagram} onChange={(e) => setForm({...form, instagram: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none">
              {["pitched", "confirmed", "recorded", "published", "declined"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <textarea placeholder="Notes" value={form.notes} onChange={(e) => setForm({...form, notes: e.target.value})} className="w-full mt-3 bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none resize-none" rows={2} />
          <button onClick={handleAdd} className="mt-3 px-6 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save</button>
        </Card>
      )}

      <div className="space-y-3">
        {filtered.map((guest) => (
          <Card key={guest._id} className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center shrink-0">
              <Users className="size-5 text-[#D4A843]" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold">{guest.name}</span>
                <StatusBadge status={guest.status} />
              </div>
              <div className="text-xs text-[#888078] mt-1 space-x-3">
                {guest.email && <span>📧 {guest.email}</span>}
                {guest.phone && <span>📱 {guest.phone}</span>}
                {guest.instagram && <span>📸 {guest.instagram}</span>}
              </div>
              {guest.notes && <p className="text-xs text-[#666] mt-1">{guest.notes}</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <select
                value={guest.status}
                onChange={(e) => updateGuest({ id: guest._id, status: e.target.value })}
                className="bg-[#0a0a0a] border border-[#333] rounded text-xs text-[#888] px-2 py-1"
              >
                {["pitched", "confirmed", "recorded", "published", "declined"].map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
              <button onClick={() => deleteGuest({ id: guest._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </Card>
        ))}
        {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No guests yet. Add your first guest above.</div>}
      </div>
    </div>
  );
}

/* ─── BOOKINGS TAB ───────────────────────────────────────── */
export function BookingsTab() {
  const bookings = useQuery(api.operations.getBookings, {});
  const updateStatus = useMutation(api.operations.updateBookingStatus);
  const deleteBooking = useMutation(api.operations.deleteBooking);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">BOOKING REQUESTS</h2>
        <a href="/booking" target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4A843] flex items-center gap-1">
          <ExternalLink className="size-3" /> View Public Form
        </a>
      </div>

      {bookings?.map((b) => (
        <Card key={b._id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{b.guestName}</span>
                <StatusBadge status={b.status} />
              </div>
              <div className="text-xs text-[#888078] mt-1">
                📧 {b.email} {b.phone && `• 📱 ${b.phone}`} {b.socialHandle && `• ${b.socialHandle}`}
              </div>
              <div className="text-sm text-[#ccc] mt-2"><strong>Topic:</strong> {b.topic}</div>
              <div className="text-xs text-[#888078] mt-1">📅 {b.preferredDate} {b.preferredTime && `at ${b.preferredTime}`}</div>
              {b.message && <p className="text-xs text-[#666] mt-2 italic">"{b.message}"</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {b.status === "pending" && (
                <>
                  <button onClick={() => updateStatus({ id: b._id, status: "approved" })} className="p-2 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30"><Check className="size-4" /></button>
                  <button onClick={() => updateStatus({ id: b._id, status: "declined" })} className="p-2 bg-red-500/20 text-red-400 rounded-sm hover:bg-red-500/30"><X className="size-4" /></button>
                </>
              )}
              <button onClick={() => deleteBooking({ id: b._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      {(!bookings || bookings.length === 0) && <div className="text-center py-12 text-[#555]">No booking requests yet. Share your booking page to start receiving inquiries.</div>}
    </div>
  );
}

/* ─── SPONSORS TAB ───────────────────────────────────────── */
export function SponsorsTab() {
  const sponsors = useQuery(api.operations.getSponsors, {});
  const addSponsor = useMutation(api.operations.addSponsor);
  const updateSponsor = useMutation(api.operations.updateSponsor);
  const deleteSponsor = useMutation(api.operations.deleteSponsor);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ companyName: "", contactName: "", email: "", dealType: "sponsorship", amount: "", status: "inquiry", notes: "" });

  const handleAdd = async () => {
    if (!form.companyName) return;
    await addSponsor({
      companyName: form.companyName,
      contactName: form.contactName || undefined,
      email: form.email || undefined,
      dealType: form.dealType,
      amount: form.amount ? parseFloat(form.amount) : undefined,
      status: form.status,
      notes: form.notes || undefined,
    });
    setForm({ companyName: "", contactName: "", email: "", dealType: "sponsorship", amount: "", status: "inquiry", notes: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">SPONSORS & DEALS</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-3" /> Add Sponsor
        </button>
      </div>

      {showAdd && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <input placeholder="Company name *" value={form.companyName} onChange={(e) => setForm({...form, companyName: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input placeholder="Contact name" value={form.contactName} onChange={(e) => setForm({...form, contactName: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input placeholder="Email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input placeholder="Deal amount ($)" type="number" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <select value={form.dealType} onChange={(e) => setForm({...form, dealType: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4]">
              {["sponsorship", "ad-read", "brand-deal", "affiliate"].map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
            <select value={form.status} onChange={(e) => setForm({...form, status: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4]">
              {["inquiry", "negotiating", "active", "completed", "declined"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} className="mt-3 px-6 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save</button>
        </Card>
      )}

      {sponsors?.map((s) => (
        <Card key={s._id} className="flex items-center gap-4">
          <Handshake className="size-6 text-[#D4A843] shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2"><span className="font-bold">{s.companyName}</span><StatusBadge status={s.status} /></div>
            <div className="text-xs text-[#888078]">{s.dealType} {s.amount && `• $${s.amount.toLocaleString()}`} {s.contactName && `• ${s.contactName}`}</div>
          </div>
          <select value={s.status} onChange={(e) => updateSponsor({ id: s._id, status: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded text-xs text-[#888] px-2 py-1">
            {["inquiry", "negotiating", "active", "completed", "declined"].map((st) => <option key={st} value={st}>{st}</option>)}
          </select>
          <button onClick={() => deleteSponsor({ id: s._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
        </Card>
      ))}
      {(!sponsors || sponsors.length === 0) && <div className="text-center py-12 text-[#555]">No sponsors yet. Share your Media Kit to attract partners.</div>}
    </div>
  );
}

/* ─── REVENUE TAB ────────────────────────────────────────── */
export function RevenueTab() {
  const revenue = useQuery(api.operations.getRevenue, {});
  const stats = useQuery(api.operations.getRevenueStats);
  const addRevenue = useMutation(api.operations.addRevenue);
  const deleteRevenue = useMutation(api.operations.deleteRevenue);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ source: "sponsorship", amount: "", description: "", date: "", status: "pending" });

  const handleAdd = async () => {
    if (!form.amount || !form.description || !form.date) return;
    await addRevenue({ source: form.source, amount: parseFloat(form.amount), description: form.description, date: form.date, status: form.status });
    setForm({ source: "sponsorship", amount: "", description: "", date: "", status: "pending" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-3 gap-4">
          <Card>
            <div className="text-xs text-[#888078] tracking-widest uppercase">Total Revenue</div>
            <div className="font-display text-3xl text-[#D4A843]">${stats.total.toLocaleString()}</div>
          </Card>
          <Card>
            <div className="text-xs text-[#888078] tracking-widest uppercase">Received</div>
            <div className="font-display text-3xl text-green-400">${stats.received.toLocaleString()}</div>
          </Card>
          <Card>
            <div className="text-xs text-[#888078] tracking-widest uppercase">Pending</div>
            <div className="font-display text-3xl text-yellow-400">${stats.pending.toLocaleString()}</div>
          </Card>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">TRANSACTIONS</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-3" /> Add Revenue
        </button>
      </div>

      {showAdd && (
        <Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <select value={form.source} onChange={(e) => setForm({...form, source: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4]">
              {["sponsorship", "merch", "ad-revenue", "brand-deal", "affiliate", "donation", "other"].map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <input type="number" placeholder="Amount ($)" value={form.amount} onChange={(e) => setForm({...form, amount: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input placeholder="Description" value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input type="date" value={form.date} onChange={(e) => setForm({...form, date: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
          </div>
          <button onClick={handleAdd} className="mt-3 px-6 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save</button>
        </Card>
      )}

      {revenue?.map((r) => (
        <Card key={r._id} className="flex items-center gap-4">
          <DollarSign className="size-5 text-[#D4A843] shrink-0" />
          <div className="flex-1">
            <div className="flex items-center gap-2"><span className="font-bold">${r.amount.toLocaleString()}</span><StatusBadge status={r.status} /></div>
            <div className="text-xs text-[#888078]">{r.description} • {r.source} • {r.date}</div>
          </div>
          <button onClick={() => deleteRevenue({ id: r._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
        </Card>
      ))}
      {(!revenue || revenue.length === 0) && <div className="text-center py-12 text-[#555]">No revenue tracked yet.</div>}
    </div>
  );
}

/* ─── NEWSLETTERS TAB ────────────────────────────────────── */
export function NewslettersTab() {
  const newsletters = useQuery(api.operations.getNewsletters);
  const subscribers = useQuery(api.admin.listSubscribers);
  const addNewsletter = useMutation(api.operations.addNewsletter);
  const sendNewsletter = useMutation(api.operations.sendNewsletter);
  const deleteNewsletter = useMutation(api.operations.deleteNewsletter);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ subject: "", body: "" });

  const handleAdd = async () => {
    if (!form.subject || !form.body) return;
    await addNewsletter({ subject: form.subject, body: form.body, status: "draft" });
    setForm({ subject: "", body: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg tracking-wider">NEWSLETTERS</h2>
          <p className="text-xs text-[#888078]">{subscribers?.length || 0} subscribers</p>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-3" /> New Newsletter
        </button>
      </div>

      {showAdd && (
        <Card>
          <input placeholder="Subject line" value={form.subject} onChange={(e) => setForm({...form, subject: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] mb-3 focus:border-[#D4A843] focus:outline-none" />
          <textarea placeholder="Newsletter body..." value={form.body} onChange={(e) => setForm({...form, body: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none resize-none" rows={6} />
          <button onClick={handleAdd} className="mt-3 px-6 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save Draft</button>
        </Card>
      )}

      {newsletters?.map((n) => (
        <Card key={n._id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2"><span className="font-bold">{n.subject}</span><StatusBadge status={n.status} /></div>
              <p className="text-xs text-[#888078] mt-1 line-clamp-2">{n.body}</p>
              {n.sentAt && <p className="text-xs text-[#555] mt-1">Sent {new Date(n.sentAt).toLocaleDateString()} to {n.recipientCount} subscribers</p>}
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {n.status === "draft" && (
                <button onClick={() => sendNewsletter({ id: n._id })} className="px-3 py-1.5 bg-green-500/20 text-green-400 text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-green-500/30">Send</button>
              )}
              <button onClick={() => deleteNewsletter({ id: n._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      {(!newsletters || newsletters.length === 0) && <div className="text-center py-12 text-[#555]">No newsletters created yet.</div>}
    </div>
  );
}

/* ─── SHOW NOTES TAB ─────────────────────────────────────── */
export function ShowNotesTab() {
  const notes = useQuery(api.operations.getShowNotes);
  const addNotes = useMutation(api.operations.addShowNotes);
  const deleteNotes = useMutation(api.operations.deleteShowNotes);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ episodeTitle: "", summary: "", keyQuotes: "" });

  const handleAdd = async () => {
    if (!form.episodeTitle) return;
    await addNotes({
      episodeTitle: form.episodeTitle,
      summary: form.summary || undefined,
      keyQuotes: form.keyQuotes ? form.keyQuotes.split("\n").filter(Boolean) : undefined,
      published: false,
    });
    setForm({ episodeTitle: "", summary: "", keyQuotes: "" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">SHOW NOTES</h2>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-3" /> Add Notes
        </button>
      </div>

      {showAdd && (
        <Card>
          <input placeholder="Episode title" value={form.episodeTitle} onChange={(e) => setForm({...form, episodeTitle: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] mb-3 focus:border-[#D4A843] focus:outline-none" />
          <textarea placeholder="Episode summary..." value={form.summary} onChange={(e) => setForm({...form, summary: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] mb-3 focus:border-[#D4A843] focus:outline-none resize-none" rows={3} />
          <textarea placeholder="Key quotes (one per line)" value={form.keyQuotes} onChange={(e) => setForm({...form, keyQuotes: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none resize-none" rows={3} />
          <button onClick={handleAdd} className="mt-3 px-6 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save</button>
        </Card>
      )}

      {notes?.map((n) => (
        <Card key={n._id}>
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2">
                <FileText className="size-4 text-[#D4A843]" />
                <span className="font-bold">{n.episodeTitle}</span>
                {n.published && <StatusBadge status="published" />}
              </div>
              {n.summary && <p className="text-sm text-[#888078] mt-2">{n.summary}</p>}
              {n.keyQuotes && n.keyQuotes.length > 0 && (
                <div className="mt-2 space-y-1">
                  {n.keyQuotes.map((q, i) => (
                    <p key={i} className="text-xs text-[#D4A843] italic">"{q}"</p>
                  ))}
                </div>
              )}
            </div>
            <button onClick={() => deleteNotes({ id: n._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
          </div>
        </Card>
      ))}
      {(!notes || notes.length === 0) && <div className="text-center py-12 text-[#555]">No show notes yet.</div>}
    </div>
  );
}

/* ─── LINKS TAB ──────────────────────────────────────────── */
export function LinksTab() {
  const links = useQuery(api.operations.getLinkBioItems, {});
  const addLink = useMutation(api.operations.addLinkBioItem);
  const updateLink = useMutation(api.operations.updateLinkBioItem);
  const deleteLink = useMutation(api.operations.deleteLinkBioItem);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ title: "", url: "", icon: "default" });

  const handleAdd = async () => {
    if (!form.title || !form.url) return;
    const maxOrder = links?.reduce((max, l) => Math.max(max, l.order), 0) || 0;
    await addLink({ title: form.title, url: form.url, icon: form.icon, isActive: true, order: maxOrder + 1 });
    setForm({ title: "", url: "", icon: "default" });
    setShowAdd(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-lg tracking-wider">LINK-IN-BIO</h2>
          <a href="/link" target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4A843] flex items-center gap-1 mt-1">
            <ExternalLink className="size-3" /> View Public Page
          </a>
        </div>
        <button onClick={() => setShowAdd(!showAdd)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-3" /> Add Link
        </button>
      </div>

      {showAdd && (
        <Card>
          <div className="grid sm:grid-cols-3 gap-4">
            <input placeholder="Link title" value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <input placeholder="URL" value={form.url} onChange={(e) => setForm({...form, url: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none" />
            <select value={form.icon} onChange={(e) => setForm({...form, icon: e.target.value})} className="bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4]">
              {["default", "youtube", "music", "podcast", "merch", "live"].map((i) => <option key={i} value={i}>{i}</option>)}
            </select>
          </div>
          <button onClick={handleAdd} className="mt-3 px-6 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Add</button>
        </Card>
      )}

      {links?.map((link) => (
        <Card key={link._id} className="flex items-center gap-4">
          <div className="text-xs font-bold text-[#D4A843] w-6 text-center">#{link.order}</div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-sm truncate">{link.title}</div>
            <div className="text-xs text-[#888078] truncate">{link.url}</div>
          </div>
          <div className="text-xs text-[#555]">{link.clicks || 0} clicks</div>
          <button
            onClick={() => updateLink({ id: link._id, isActive: !link.isActive })}
            className={`px-2 py-1 text-[10px] font-bold tracking-widest uppercase rounded ${link.isActive ? "bg-green-500/20 text-green-400" : "bg-red-500/20 text-red-400"}`}
          >
            {link.isActive ? "Active" : "Hidden"}
          </button>
          <button onClick={() => deleteLink({ id: link._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
        </Card>
      ))}
      {(!links || links.length === 0) && <div className="text-center py-12 text-[#555]">No links yet. Add your first link above.</div>}
    </div>
  );
}

/* ─── COMMUNITY TAB ──────────────────────────────────────── */
export function CommunityTab() {
  const posts = useQuery(api.operations.getCommunityPosts, {});
  const approve = useMutation(api.operations.approveCommunityPost);
  const pin = useMutation(api.operations.pinCommunityPost);
  const deletePost = useMutation(api.operations.deleteCommunityPost);
  const [filter, setFilter] = useState<string>("pending");

  const filtered = posts?.filter((p) => {
    if (filter === "pending") return !p.isApproved;
    if (filter === "approved") return p.isApproved;
    return true;
  }) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">COMMUNITY MODERATION</h2>
        <a href="/community" target="_blank" rel="noopener noreferrer" className="text-xs text-[#D4A843] flex items-center gap-1">
          <ExternalLink className="size-3" /> View Public Wall
        </a>
      </div>

      <div className="flex gap-2">
        {["pending", "approved", "all"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm ${filter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>
            {f} ({f === "pending" ? posts?.filter((p) => !p.isApproved).length || 0 : f === "approved" ? posts?.filter((p) => p.isApproved).length || 0 : posts?.length || 0})
          </button>
        ))}
      </div>

      {filtered.map((post) => (
        <Card key={post._id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold">{post.authorName}</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-[#333] text-[#888]">{post.type}</span>
                {post.isPinned && <Pin className="size-3 text-[#D4A843]" />}
                {!post.isApproved && <span className="text-[10px] px-1.5 py-0.5 rounded bg-yellow-500/20 text-yellow-400">PENDING</span>}
              </div>
              <p className="text-sm text-[#ccc] mt-2">{post.message}</p>
              <div className="text-xs text-[#555] mt-1">❤️ {post.likes || 0} • {new Date(post.createdAt).toLocaleDateString()}</div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {!post.isApproved ? (
                <button onClick={() => approve({ id: post._id, isApproved: true })} className="p-1.5 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30"><Check className="size-4" /></button>
              ) : (
                <button onClick={() => approve({ id: post._id, isApproved: false })} className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-sm hover:bg-yellow-500/30"><Eye className="size-4" /></button>
              )}
              <button onClick={() => pin({ id: post._id, isPinned: !post.isPinned })} className={`p-1.5 rounded-sm ${post.isPinned ? "bg-[#D4A843]/20 text-[#D4A843]" : "bg-[#333]/50 text-[#555]"}`}><Pin className="size-4" /></button>
              <button onClick={() => deletePost({ id: post._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No posts to review.</div>}
    </div>
  );
}

/* ─── METRICS TAB ────────────────────────────────────────── */
export function MetricsTab() {
  const metrics = useQuery(api.operations.getSocialMetrics);
  const upsert = useMutation(api.operations.upsertSocialMetrics);
  const [editing, setEditing] = useState<string | null>(null);
  const [form, setForm] = useState({ followers: "", totalViews: "", totalLikes: "", totalVideos: "" });

  const platforms = [
    { id: "youtube", name: "YouTube", color: "#FF0000", icon: "▶" },
    { id: "facebook", name: "Facebook", color: "#4267B2", icon: "📘" },
    { id: "tiktok", name: "TikTok", color: "#ff0050", icon: "🎵" },
    { id: "instagram", name: "Instagram", color: "#E4405F", icon: "📸" },
  ];

  const startEdit = (platformId: string) => {
    const m = metrics?.find((m) => m.platform === platformId);
    setForm({
      followers: m?.followers?.toString() || "",
      totalViews: m?.totalViews?.toString() || "",
      totalLikes: m?.totalLikes?.toString() || "",
      totalVideos: m?.totalVideos?.toString() || "",
    });
    setEditing(platformId);
  };

  const saveEdit = async () => {
    if (!editing) return;
    await upsert({
      platform: editing,
      followers: form.followers ? parseInt(form.followers) : undefined,
      totalViews: form.totalViews ? parseInt(form.totalViews) : undefined,
      totalLikes: form.totalLikes ? parseInt(form.totalLikes) : undefined,
      totalVideos: form.totalVideos ? parseInt(form.totalVideos) : undefined,
    });
    setEditing(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">SOCIAL MEDIA METRICS</h2>
        <p className="text-xs text-[#888078]">Update manually or connect APIs</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {platforms.map((p) => {
          const m = metrics?.find((met) => met.platform === p.id);
          return (
            <Card key={p.id}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{p.icon}</span>
                  <span className="font-display tracking-wider" style={{ color: p.color }}>{p.name.toUpperCase()}</span>
                </div>
                <button onClick={() => startEdit(p.id)} className="text-xs text-[#D4A843] hover:text-[#E8C767]">
                  <Edit className="size-4" />
                </button>
              </div>

              {editing === p.id ? (
                <div className="space-y-2">
                  <input type="number" placeholder="Followers" value={form.followers} onChange={(e) => setForm({...form, followers: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-1.5 text-sm text-[#f0ece4]" />
                  <input type="number" placeholder="Total Views" value={form.totalViews} onChange={(e) => setForm({...form, totalViews: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-1.5 text-sm text-[#f0ece4]" />
                  <input type="number" placeholder="Total Likes" value={form.totalLikes} onChange={(e) => setForm({...form, totalLikes: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-1.5 text-sm text-[#f0ece4]" />
                  <input type="number" placeholder="Total Videos" value={form.totalVideos} onChange={(e) => setForm({...form, totalVideos: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] rounded-sm px-3 py-1.5 text-sm text-[#f0ece4]" />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="px-4 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs rounded-sm">Save</button>
                    <button onClick={() => setEditing(null)} className="px-4 py-1.5 bg-[#333] text-[#888] font-bold text-xs rounded-sm">Cancel</button>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <div className="font-display text-xl">{m?.followers?.toLocaleString() || "—"}</div>
                    <div className="text-[10px] text-[#888078] tracking-widest uppercase">Followers</div>
                  </div>
                  <div>
                    <div className="font-display text-xl">{m?.totalViews?.toLocaleString() || "—"}</div>
                    <div className="text-[10px] text-[#888078] tracking-widest uppercase">Views</div>
                  </div>
                  <div>
                    <div className="font-display text-xl">{m?.totalLikes?.toLocaleString() || "—"}</div>
                    <div className="text-[10px] text-[#888078] tracking-widest uppercase">Likes</div>
                  </div>
                  <div>
                    <div className="font-display text-xl">{m?.totalVideos?.toLocaleString() || "—"}</div>
                    <div className="text-[10px] text-[#888078] tracking-widest uppercase">Videos</div>
                  </div>
                </div>
              )}
              {m?.lastUpdated && <div className="text-[10px] text-[#555] mt-3">Updated: {new Date(m.lastUpdated).toLocaleDateString()}</div>}
            </Card>
          );
        })}
      </div>
    </div>
  );
}
