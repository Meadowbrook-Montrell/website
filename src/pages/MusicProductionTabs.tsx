import { useState, Component, type ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  Plus, Trash2, Music, Mic, Headphones, Disc3, Radio,
  Users, Clock, Calendar, FileText, Tag, Hash, Zap,
  ChevronDown, ChevronRight, AlertTriangle, CheckCircle,
  BarChart3, Play, PenTool, Sliders, Volume2, Star,
  ArrowRight, ArrowUpDown, ExternalLink, DollarSign,
  BookOpen, Target, Award, TrendingUp, Edit, Save, X,
  Activity, Layers, GitBranch, CircleDot,
} from "lucide-react";

// ─── Error Boundary ─────────────────────────────────────────
export class MPSafe extends Component<
  { name: string; children: ReactNode },
  { hasError: boolean; error?: Error }
> {
  state = { hasError: false, error: undefined as Error | undefined };
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center py-20">
          <div className="size-16 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
            <AlertTriangle className="size-7 text-red-400" />
          </div>
          <h3 className="text-lg font-display tracking-wider text-[#f0ece4] mb-2">
            {this.props.name} Error
          </h3>
          <p className="text-sm text-[#666] max-w-md text-center mb-6">
            {this.state.error?.message || "An unexpected error occurred"}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded-lg px-6 py-2.5 hover:bg-[#E8C767] transition-colors"
          >
            Retry
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ═══════════════════════════════════════════════════════════
   ENTERPRISE DESIGN SYSTEM
   ═══════════════════════════════════════════════════════════ */

// ─── Glassmorphic Panel ─────────────────────────────────────
const Panel = ({ children, className = "", noPad = false }: {
  children: ReactNode; className?: string; noPad?: boolean;
}) => (
  <div className={`bg-gradient-to-b from-[#161412]/90 to-[#111010]/90 border border-[#2a2622]/60 rounded-2xl backdrop-blur-sm ${noPad ? "" : "p-6"} ${className}`}>
    {children}
  </div>
);

// ─── Metric Card ────────────────────────────────────────────
const MetricCard = ({ icon: Icon, label, value, sub, accent = "#D4A843", trend }: {
  icon: any; label: string; value: string | number; sub?: string; accent?: string;
  trend?: { value: string; up: boolean };
}) => (
  <div className="relative overflow-hidden bg-gradient-to-br from-[#161412] to-[#0f0e0d] border border-[#2a2622]/60 rounded-xl p-4 group hover:border-[#2a2622] transition-all">
    <div className="absolute -right-4 -top-4 size-20 rounded-full opacity-[0.04] group-hover:opacity-[0.08] transition-opacity" style={{ background: accent }} />
    <div className="flex items-start justify-between mb-3">
      <div className="size-9 rounded-lg flex items-center justify-center" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
        <Icon className="size-4" style={{ color: accent }} />
      </div>
      {trend && (
        <span className={`text-[10px] font-mono font-bold ${trend.up ? "text-green-400" : "text-red-400"}`}>
          {trend.up ? "↑" : "↓"} {trend.value}
        </span>
      )}
    </div>
    <p className="font-display text-2xl text-[#f0ece4] tracking-wide">{value}</p>
    <p className="text-[10px] text-[#777] tracking-[0.15em] uppercase mt-0.5">{label}</p>
    {sub && <p className="text-[10px] text-[#444] mt-0.5">{sub}</p>}
  </div>
);

// ─── Section Header ─────────────────────────────────────────
const SectionHeader = ({ icon: Icon, title, subtitle, accent = "#D4A843", count, action }: {
  icon: any; title: string; subtitle?: string; accent?: string; count?: number;
  action?: ReactNode;
}) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="size-10 rounded-xl flex items-center justify-center" style={{ background: `${accent}12`, border: `1px solid ${accent}25` }}>
        <Icon className="size-5" style={{ color: accent }} />
      </div>
      <div>
        <div className="flex items-center gap-2.5">
          <h2 className="font-display text-xl text-[#f0ece4] tracking-wider">{title}</h2>
          {count !== undefined && (
            <span className="text-[10px] font-mono text-[#555] bg-[#1a1816] px-2 py-0.5 rounded-full border border-[#2a2622]">
              {count}
            </span>
          )}
        </div>
        {subtitle && <p className="text-[11px] text-[#666] tracking-wide mt-0.5">{subtitle}</p>}
      </div>
    </div>
    {action}
  </div>
);

// ─── Enterprise Button ──────────────────────────────────────
const EBtn = ({ children, onClick, variant = "primary", disabled, size = "md", className = "" }: {
  children: ReactNode; onClick?: () => void; variant?: string; disabled?: boolean;
  size?: "sm" | "md"; className?: string;
}) => {
  const base = size === "sm" ? "text-[11px] px-3 py-1.5" : "text-xs px-4 py-2.5";
  const styles: Record<string, string> = {
    primary: "bg-[#D4A843] text-[#0a0a0a] hover:bg-[#E8C767] font-bold",
    danger: "bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 font-medium",
    ghost: "bg-[#1a1816] text-[#999] border border-[#2a2622] hover:text-[#f0ece4] hover:border-[#3a3632] font-medium",
    success: "bg-green-500/10 text-green-400 border border-green-500/20 hover:bg-green-500/20 font-medium",
    outline: "bg-transparent text-[#D4A843] border border-[#D4A843]/30 hover:bg-[#D4A843]/10 font-bold",
  };
  return (
    <button onClick={onClick} disabled={disabled}
      className={`rounded-lg transition-all disabled:opacity-30 disabled:pointer-events-none tracking-wide ${base} ${styles[variant] || styles.primary} ${className}`}>
      {children}
    </button>
  );
};

// ─── Status Pill (Enterprise) ───────────────────────────────
const StatusPill = ({ status, colorMap }: { status: string; colorMap: Record<string, string> }) => {
  const color = colorMap[status] || "text-[#888] bg-[#1a1a1a] border-[#333]";
  return (
    <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[9px] font-bold uppercase tracking-[0.15em] border ${color}`}>
      <span className="size-1.5 rounded-full bg-current opacity-70" />
      {status.replace("-", " ")}
    </span>
  );
};

// ─── Data Row (for lists) ───────────────────────────────────
const DataRow = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`flex items-center gap-4 px-5 py-4 border-b border-[#1e1c1a]/80 last:border-0 hover:bg-[#1a1816]/40 transition-colors group ${className}`}>
    {children}
  </div>
);

// ─── Input (Enterprise) ─────────────────────────────────────
const EInput = ({ label, value, onChange, type = "text", placeholder }: {
  label: string; value: string | number; onChange: (v: string) => void;
  type?: string; placeholder?: string;
}) => (
  <div>
    <label className="text-[9px] font-bold tracking-[0.2em] text-[#777] uppercase mb-1.5 block">{label}</label>
    <input type={type} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder}
      className="w-full bg-[#0d0c0b] text-[#f0ece4] border border-[#2a2622] rounded-lg px-3 py-2.5 text-sm focus:border-[#D4A843]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A843]/20 transition-all placeholder:text-[#444]" />
  </div>
);

// ─── Select (Enterprise) ────────────────────────────────────
const ESelect = ({ label, value, onChange, options }: {
  label: string; value: string; onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div>
    <label className="text-[9px] font-bold tracking-[0.2em] text-[#777] uppercase mb-1.5 block">{label}</label>
    <select value={value} onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0d0c0b] text-[#f0ece4] border border-[#2a2622] rounded-lg px-3 py-2.5 text-sm focus:border-[#D4A843]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A843]/20 transition-all">
      {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  </div>
);

// ─── Filter Chip Row ────────────────────────────────────────
const FilterChips = ({ active, onChange, options }: {
  active: string; onChange: (v: string) => void;
  options: { value: string; label: string; count?: number }[];
}) => (
  <div className="flex items-center gap-1.5 flex-wrap mb-6">
    {options.map((o) => (
      <button key={o.value} onClick={() => onChange(o.value)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-wider uppercase transition-all ${
          active === o.value
            ? "bg-[#D4A843] text-[#0a0a0a]"
            : "bg-[#141210] text-[#777] border border-[#2a2622]/60 hover:text-[#ccc] hover:border-[#3a3632]"
        }`}>
        {o.label}
        {o.count !== undefined && (
          <span className={`text-[9px] ${active === o.value ? "text-[#0a0a0a]/60" : "text-[#555]"}`}>{o.count}</span>
        )}
      </button>
    ))}
  </div>
);

// ─── Empty State ────────────────────────────────────────────
const EmptyState = ({ icon: Icon, title, sub, action }: {
  icon: any; title: string; sub: string; action?: ReactNode;
}) => (
  <Panel className="flex flex-col items-center justify-center py-16 text-center">
    <div className="size-16 rounded-2xl bg-[#D4A843]/5 border border-[#D4A843]/10 flex items-center justify-center mb-5">
      <Icon className="size-7 text-[#D4A843]/30" />
    </div>
    <h3 className="font-display text-lg text-[#888] tracking-wider mb-1">{title}</h3>
    <p className="text-xs text-[#555] max-w-xs mb-5">{sub}</p>
    {action}
  </Panel>
);


/* ═══════════════════════════════════════════════════════════
   TAB 1 — COMMAND CENTER OVERVIEW
   ═══════════════════════════════════════════════════════════ */

export function MusicProductionOverviewTab() {
  const stats = useQuery(api.musicProduction.getMusicProductionStats);
  const projects = useQuery(api.musicProduction.getProjects);
  const sessions = useQuery(api.musicProduction.getSessions);

  const statusFlow = ["concept","writing","recording","mixing","mastering","review","ready","released"];
  const statusIcons: Record<string, string> = {
    concept: "💡", writing: "✍️", recording: "🎙️", mixing: "🎛️",
    mastering: "🔊", review: "👀", ready: "✅", released: "🚀",
  };

  return (
    <div className="space-y-6">
      {/* Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#161412] via-[#12100f] to-[#0d0c0b] border border-[#2a2622]/40 rounded-2xl p-8">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(212,168,67,0.04),transparent_60%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,_rgba(168,85,247,0.03),transparent_60%)]" />
        <div className="relative flex items-center gap-4">
          <div className="size-14 rounded-2xl bg-gradient-to-br from-purple-500/20 to-[#D4A843]/20 border border-purple-500/15 flex items-center justify-center">
            <Headphones className="size-7 text-purple-400" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="size-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[9px] font-bold tracking-[0.3em] text-green-400/80 uppercase">Live System</span>
            </div>
            <h1 className="font-display text-2xl text-[#f0ece4] tracking-wider">
              Music Production Command Center
            </h1>
            <p className="text-xs text-[#666] tracking-wider mt-0.5">
              3rd Gate Music Group — Enterprise Production Hub
            </p>
          </div>
        </div>
      </div>

      {/* KPI Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          <MetricCard icon={Users} label="Active Roster" value={stats.activeArtists} sub={`of ${stats.totalArtists} total`} accent="#a855f7" />
          <MetricCard icon={Music} label="Active Projects" value={stats.activeProjects} sub={`of ${stats.totalProjects} total`} accent="#3b82f6" />
          <MetricCard icon={Calendar} label="Upcoming Sessions" value={stats.upcomingSessions} sub={`of ${stats.totalSessions} total`} accent="#22c55e" />
          <MetricCard icon={Disc3} label="Available Beats" value={stats.availableBeats} sub={`of ${stats.totalBeats} total`} accent="#D4A843" />
          <MetricCard icon={Radio} label="Upcoming Releases" value={stats.upcomingReleases} sub={`of ${stats.totalReleases} total`} accent="#ef4444" />
          <MetricCard icon={FileText} label="Pending Splits" value={stats.pendingSplits} sub={`of ${stats.totalSplits} total`} accent="#06b6d4" />
        </div>
      )}

      {/* Production Pipeline */}
      <Panel>
        <div className="flex items-center gap-2 mb-5">
          <Activity className="size-4 text-purple-400" />
          <h3 className="font-display text-sm text-[#f0ece4] tracking-wider uppercase">Production Pipeline</h3>
          <div className="flex-1 h-px bg-gradient-to-r from-[#2a2622] to-transparent ml-3" />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {statusFlow.map((status, idx) => {
            const count = stats?.projectsByStatus[status] || 0;
            const isLast = idx === statusFlow.length - 1;
            return (
              <div key={status} className="flex items-center flex-shrink-0">
                <div className={`min-w-[90px] bg-[#0d0c0b] border rounded-xl p-3 text-center transition-all ${
                  count > 0 ? "border-[#2a2622] hover:border-[#3a3632]" : "border-[#1a1816]"
                }`}>
                  <span className="text-lg">{statusIcons[status]}</span>
                  <p className={`font-display text-xl mt-1 ${count > 0 ? "text-[#f0ece4]" : "text-[#444]"}`}>{count}</p>
                  <p className="text-[8px] text-[#666] uppercase tracking-[0.15em] mt-0.5">{status}</p>
                </div>
                {!isLast && <ChevronRight className="size-3 text-[#333] mx-1 flex-shrink-0" />}
              </div>
            );
          })}
        </div>
      </Panel>

      {/* Two-Column Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent Projects */}
        <Panel noPad>
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#1e1c1a]">
            <Music className="size-4 text-blue-400" />
            <h3 className="font-display text-sm text-[#f0ece4] tracking-wider uppercase">Recent Projects</h3>
          </div>
          {projects?.slice(0, 6).map((p) => (
            <DataRow key={p._id}>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#f0ece4] font-medium truncate">{p.title}</p>
                <p className="text-[10px] text-[#666] mt-0.5">{p.type} {p.genre ? `· ${p.genre}` : ""}</p>
              </div>
              <StatusPill status={p.status} colorMap={{
                concept: "text-gray-400 bg-gray-500/8 border-gray-500/15",
                writing: "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
                recording: "text-blue-400 bg-blue-500/8 border-blue-500/15",
                mixing: "text-purple-400 bg-purple-500/8 border-purple-500/15",
                mastering: "text-orange-400 bg-orange-500/8 border-orange-500/15",
                review: "text-cyan-400 bg-cyan-500/8 border-cyan-500/15",
                ready: "text-green-400 bg-green-500/8 border-green-500/15",
                released: "text-[#D4A843] bg-[#D4A843]/8 border-[#D4A843]/15",
              }} />
            </DataRow>
          ))}
          {(!projects || projects.length === 0) && (
            <p className="text-sm text-[#555] text-center py-8">No projects yet</p>
          )}
        </Panel>

        {/* Upcoming Sessions */}
        <Panel noPad>
          <div className="flex items-center gap-2 px-6 py-4 border-b border-[#1e1c1a]">
            <Calendar className="size-4 text-green-400" />
            <h3 className="font-display text-sm text-[#f0ece4] tracking-wider uppercase">Upcoming Sessions</h3>
          </div>
          {sessions?.filter((s) => s.status === "scheduled").slice(0, 6).map((s) => (
            <DataRow key={s._id}>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-[#f0ece4] font-medium truncate">{s.title}</p>
                <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[#666]">
                  <span className="flex items-center gap-1"><Calendar className="size-2.5" />{s.date}</span>
                  <span className="flex items-center gap-1"><Clock className="size-2.5" />{s.startTime}</span>
                  <span>{s.sessionType}</span>
                </div>
              </div>
              <span className="text-[10px] text-green-400 bg-green-500/8 border border-green-500/15 px-2.5 py-1 rounded-full font-medium">
                {s.studio || "TBD"}
              </span>
            </DataRow>
          ))}
          {(!sessions || sessions.filter((s) => s.status === "scheduled").length === 0) && (
            <p className="text-sm text-[#555] text-center py-8">No upcoming sessions</p>
          )}
        </Panel>
      </div>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   TAB 2 — ARTIST ROSTER
   ═══════════════════════════════════════════════════════════ */

export function ArtistRosterTab() {
  const artists = useQuery(api.musicProduction.getArtists);
  const addArtist = useMutation(api.musicProduction.addArtist);
  const deleteArtist = useMutation(api.musicProduction.deleteArtist);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  const [name, setName] = useState("");
  const [role, setRole] = useState("artist");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");
  const [genresStr, setGenresStr] = useState("");

  const roleIcon: Record<string, ReactNode> = {
    artist: <Mic className="size-4 text-purple-400" />,
    producer: <Sliders className="size-4 text-blue-400" />,
    engineer: <Volume2 className="size-4 text-green-400" />,
    songwriter: <PenTool className="size-4 text-yellow-400" />,
    multi: <Star className="size-4 text-[#D4A843]" />,
  };

  const filtered = artists?.filter(
    (a) => filter === "all" || a.role === filter || a.status === filter
  ) || [];

  const resetForm = () => {
    setName(""); setRole("artist"); setBio(""); setEmail("");
    setPhone(""); setStatus("active"); setGenresStr(""); setShowForm(false);
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Users} title="Artist Roster" accent="#a855f7"
        subtitle="Manage your label's talent roster"
        count={artists?.length} action={
          <EBtn onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
            {showForm ? <><X className="size-3.5 inline mr-1.5" />Cancel</> : <><Plus className="size-3.5 inline mr-1.5" />Add to Roster</>}
          </EBtn>
        } />

      <FilterChips active={filter} onChange={setFilter} options={[
        { value: "all", label: "All", count: artists?.length },
        { value: "artist", label: "Artists" }, { value: "producer", label: "Producers" },
        { value: "engineer", label: "Engineers" }, { value: "songwriter", label: "Songwriters" },
        { value: "active", label: "Active" }, { value: "development", label: "Development" },
      ]} />

      {/* Add Form */}
      {showForm && (
        <Panel className="border-[#D4A843]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <EInput label="Name" value={name} onChange={setName} placeholder="Artist / Producer name" />
            <ESelect label="Role" value={role} onChange={setRole} options={[
              { value: "artist", label: "🎤 Artist" }, { value: "producer", label: "🎹 Producer" },
              { value: "engineer", label: "🎛️ Engineer" }, { value: "songwriter", label: "✍️ Songwriter" },
              { value: "multi", label: "⭐ Multi-Role" },
            ]} />
            <ESelect label="Status" value={status} onChange={setStatus} options={[
              { value: "active", label: "Active" }, { value: "development", label: "In Development" },
              { value: "inactive", label: "Inactive" },
            ]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <EInput label="Email" value={email} onChange={setEmail} placeholder="email@example.com" />
            <EInput label="Phone" value={phone} onChange={setPhone} placeholder="(xxx) xxx-xxxx" />
            <EInput label="Genres (comma separated)" value={genresStr} onChange={setGenresStr} placeholder="Hip-Hop, R&B, Trap" />
          </div>
          <div className="mb-4">
            <label className="text-[9px] font-bold tracking-[0.2em] text-[#777] uppercase mb-1.5 block">Bio</label>
            <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows={3} placeholder="Short bio..."
              className="w-full bg-[#0d0c0b] text-[#f0ece4] border border-[#2a2622] rounded-lg p-3 text-sm focus:border-[#D4A843]/40 focus:outline-none focus:ring-1 focus:ring-[#D4A843]/20 resize-none placeholder:text-[#444]" />
          </div>
          <div className="flex justify-end">
            <EBtn onClick={async () => {
              if (!name) return;
              await addArtist({ name, role, bio: bio || undefined, email: email || undefined, phone: phone || undefined, status, genres: genresStr ? genresStr.split(",").map((g) => g.trim()) : undefined });
              resetForm();
            }}><Save className="size-3.5 inline mr-1.5" /> Save to Roster</EBtn>
          </div>
        </Panel>
      )}

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((artist) => (
          <Panel key={artist._id} className="relative group hover:border-[#2a2622] transition-all">
            <button onClick={() => deleteArtist({ id: artist._id })}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#333] hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="size-3.5" />
            </button>
            <div className="flex items-start gap-3 mb-4">
              <div className="size-12 rounded-xl bg-gradient-to-br from-[#1a1816] to-[#0d0c0b] border border-[#2a2622] flex items-center justify-center">
                {roleIcon[artist.role] || <Music className="size-4 text-[#D4A843]" />}
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-base text-[#f0ece4] tracking-wider truncate">{artist.name}</h3>
                <p className="text-[9px] text-[#666] tracking-[0.2em] uppercase">{artist.role}</p>
              </div>
            </div>
            {artist.bio && <p className="text-xs text-[#666] mb-3 line-clamp-2 leading-relaxed">{artist.bio}</p>}
            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {artist.genres.map((g) => (
                  <span key={g} className="text-[9px] bg-[#0d0c0b] text-[#777] px-2 py-0.5 rounded-md border border-[#1e1c1a]">{g}</span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between pt-3 border-t border-[#1e1c1a]">
              <StatusPill status={artist.status} colorMap={{
                active: "text-green-400 bg-green-500/8 border-green-500/15",
                development: "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
                inactive: "text-gray-400 bg-gray-500/8 border-gray-500/15",
              }} />
              {artist.email && <span className="text-[10px] text-[#555] truncate ml-2">{artist.email}</span>}
            </div>
          </Panel>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState icon={Users} title="No roster members" sub="Add your first artist, producer, or engineer to get started." />}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   TAB 3 — PROJECT TRACKER
   ═══════════════════════════════════════════════════════════ */

export function ProjectTrackerTab() {
  const projects = useQuery(api.musicProduction.getProjects);
  const addProject = useMutation(api.musicProduction.addProject);
  const updateProject = useMutation(api.musicProduction.updateProject);
  const deleteProject = useMutation(api.musicProduction.deleteProject);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [type, setType] = useState("single");
  const [status, setStatus] = useState("concept");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [mood, setMood] = useState("");
  const [priority, setPriority] = useState("medium");
  const [targetDate, setTargetDate] = useState("");
  const [notes, setNotes] = useState("");

  const statusColors: Record<string, string> = {
    concept: "text-gray-400 bg-gray-500/8 border-gray-500/15",
    writing: "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
    recording: "text-blue-400 bg-blue-500/8 border-blue-500/15",
    mixing: "text-purple-400 bg-purple-500/8 border-purple-500/15",
    mastering: "text-orange-400 bg-orange-500/8 border-orange-500/15",
    review: "text-cyan-400 bg-cyan-500/8 border-cyan-500/15",
    ready: "text-green-400 bg-green-500/8 border-green-500/15",
    released: "text-[#D4A843] bg-[#D4A843]/8 border-[#D4A843]/15",
  };

  const priorityDot: Record<string, string> = {
    low: "bg-gray-400", medium: "bg-blue-400", high: "bg-orange-400", urgent: "bg-red-500 animate-pulse",
  };

  const statusOptions = ["concept","writing","recording","mixing","mastering","review","ready","released"];
  const filtered = projects?.filter((p) => statusFilter === "all" || p.status === statusFilter) || [];

  return (
    <div className="space-y-5">
      <SectionHeader icon={Layers} title="Project Tracker" accent="#3b82f6"
        subtitle="Track every project from concept to release"
        count={projects?.length} action={
          <EBtn onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
            {showForm ? <><X className="size-3.5 inline mr-1.5" />Cancel</> : <><Plus className="size-3.5 inline mr-1.5" />New Project</>}
          </EBtn>
        } />

      <FilterChips active={statusFilter} onChange={setStatusFilter} options={[
        { value: "all", label: "All", count: projects?.length },
        ...statusOptions.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) })),
      ]} />

      {showForm && (
        <Panel className="border-[#3b82f6]/20">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <EInput label="Project Title" value={title} onChange={setTitle} placeholder="Track / Album name" />
            <ESelect label="Type" value={type} onChange={setType} options={[
              { value: "single", label: "Single" }, { value: "ep", label: "EP" },
              { value: "album", label: "Album" }, { value: "mixtape", label: "Mixtape" },
              { value: "feature", label: "Feature" },
            ]} />
            <ESelect label="Status" value={status} onChange={setStatus}
              options={statusOptions.map((s) => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))} />
            <ESelect label="Priority" value={priority} onChange={setPriority} options={[
              { value: "low", label: "🟢 Low" }, { value: "medium", label: "🔵 Medium" },
              { value: "high", label: "🟠 High" }, { value: "urgent", label: "🔴 Urgent" },
            ]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <EInput label="Genre" value={genre} onChange={setGenre} placeholder="Hip-Hop, R&B..." />
            <EInput label="BPM" value={bpm} onChange={setBpm} type="number" placeholder="140" />
            <EInput label="Key" value={key} onChange={setKey} placeholder="C minor" />
            <EInput label="Target Release" value={targetDate} onChange={setTargetDate} type="date" />
          </div>
          <div className="mb-4">
            <label className="text-[9px] font-bold tracking-[0.2em] text-[#777] uppercase mb-1.5 block">Notes</label>
            <textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={2} placeholder="Production notes..."
              className="w-full bg-[#0d0c0b] text-[#f0ece4] border border-[#2a2622] rounded-lg p-3 text-sm focus:border-[#D4A843]/40 focus:outline-none resize-none placeholder:text-[#444]" />
          </div>
          <div className="flex justify-end">
            <EBtn onClick={async () => {
              if (!title) return;
              await addProject({ title, type, status, genre: genre || undefined, bpm: bpm ? Number(bpm) : undefined, key: key || undefined, mood: mood || undefined, priority, targetReleaseDate: targetDate || undefined, notes: notes || undefined });
              setTitle(""); setGenre(""); setBpm(""); setKey(""); setMood(""); setNotes(""); setShowForm(false);
            }}><Save className="size-3.5 inline mr-1.5" /> Create Project</EBtn>
          </div>
        </Panel>
      )}

      {/* Project Table */}
      <Panel noPad>
        {/* Table Header */}
        <div className="flex items-center gap-4 px-5 py-3 border-b border-[#1e1c1a] text-[9px] font-bold tracking-[0.2em] text-[#555] uppercase">
          <div className="w-6" />
          <div className="flex-1">Project</div>
          <div className="w-20 text-center">Type</div>
          <div className="w-24 text-center">Status</div>
          <div className="w-20 text-center">Priority</div>
          <div className="w-24 text-center hidden md:block">Target</div>
          <div className="w-20" />
        </div>
        {filtered.map((project) => (
          <DataRow key={project._id}>
            <div className="w-6 flex items-center justify-center">
              <div className={`size-2 rounded-full ${priorityDot[project.priority || "medium"]}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#f0ece4] font-medium truncate">{project.title}</p>
              <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[#555]">
                {project.genre && <span>{project.genre}</span>}
                {project.bpm && <span>{project.bpm} BPM</span>}
                {project.key && <span>{project.key}</span>}
              </div>
              {project.notes && <p className="text-[10px] text-[#444] mt-1 line-clamp-1">{project.notes}</p>}
            </div>
            <div className="w-20 text-center">
              <span className="text-[9px] font-bold tracking-wider uppercase text-[#777] bg-[#0d0c0b] px-2 py-0.5 rounded border border-[#1e1c1a]">{project.type}</span>
            </div>
            <div className="w-24 text-center">
              <StatusPill status={project.status} colorMap={statusColors} />
            </div>
            <div className="w-20 text-center">
              <span className={`text-[10px] font-bold uppercase tracking-wider ${
                { low: "text-gray-400", medium: "text-blue-400", high: "text-orange-400", urgent: "text-red-400" }[project.priority || "medium"]
              }`}>{project.priority || "medium"}</span>
            </div>
            <div className="w-24 text-center hidden md:block">
              <span className="text-[10px] text-[#555] font-mono">{project.targetReleaseDate || "—"}</span>
            </div>
            <div className="w-20 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {project.status !== "released" && (
                <button onClick={() => { const idx = statusOptions.indexOf(project.status); if (idx < statusOptions.length - 1) updateProject({ id: project._id, status: statusOptions[idx + 1] }); }}
                  className="p-1.5 rounded-lg text-[#555] hover:text-green-400 hover:bg-green-400/10 transition-all" title="Advance stage">
                  <ArrowRight className="size-3.5" />
                </button>
              )}
              <button onClick={() => deleteProject({ id: project._id })}
                className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-all">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </DataRow>
        ))}
        {filtered.length === 0 && <p className="text-sm text-[#555] text-center py-10">No projects found</p>}
      </Panel>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   TAB 4 — STUDIO SESSIONS
   ═══════════════════════════════════════════════════════════ */

export function StudioSessionsTab() {
  const sessions = useQuery(api.musicProduction.getSessions);
  const addSession = useMutation(api.musicProduction.addSession);
  const updateSession = useMutation(api.musicProduction.updateSession);
  const deleteSession = useMutation(api.musicProduction.deleteSession);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [studio, setStudio] = useState("");
  const [engineer, setEngineer] = useState("");
  const [sessionType, setSessionType] = useState("recording");
  const [notes, setNotes] = useState("");
  const [cost, setCost] = useState("");

  const typeIcon: Record<string, ReactNode> = {
    recording: <Mic className="size-4 text-red-400" />,
    mixing: <Sliders className="size-4 text-purple-400" />,
    mastering: <Volume2 className="size-4 text-orange-400" />,
    writing: <PenTool className="size-4 text-yellow-400" />,
    rehearsal: <Music className="size-4 text-green-400" />,
  };

  const statusColors: Record<string, string> = {
    scheduled: "text-blue-400 bg-blue-500/8 border-blue-500/15",
    "in-progress": "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
    completed: "text-green-400 bg-green-500/8 border-green-500/15",
    cancelled: "text-red-400 bg-red-500/8 border-red-500/15",
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Mic} title="Studio Sessions" accent="#22c55e"
        subtitle="Book, track, and manage all studio time"
        count={sessions?.length} action={
          <EBtn onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
            {showForm ? <><X className="size-3.5 inline mr-1.5" />Cancel</> : <><Plus className="size-3.5 inline mr-1.5" />Book Session</>}
          </EBtn>
        } />

      {showForm && (
        <Panel className="border-green-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <EInput label="Session Title" value={title} onChange={setTitle} placeholder="Recording — Track Name" />
            <EInput label="Date" value={date} onChange={setDate} type="date" />
            <ESelect label="Session Type" value={sessionType} onChange={setSessionType} options={[
              { value: "recording", label: "🎙️ Recording" }, { value: "mixing", label: "🎛️ Mixing" },
              { value: "mastering", label: "🔊 Mastering" }, { value: "writing", label: "✍️ Writing" },
              { value: "rehearsal", label: "🎸 Rehearsal" },
            ]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <EInput label="Start Time" value={startTime} onChange={setStartTime} type="time" />
            <EInput label="End Time" value={endTime} onChange={setEndTime} type="time" />
            <EInput label="Studio" value={studio} onChange={setStudio} placeholder="Studio name / room" />
            <EInput label="Engineer" value={engineer} onChange={setEngineer} placeholder="Engineer name" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <EInput label="Session Cost ($)" value={cost} onChange={setCost} type="number" placeholder="0" />
            <EInput label="Notes" value={notes} onChange={setNotes} placeholder="Session notes..." />
          </div>
          <div className="flex justify-end">
            <EBtn onClick={async () => {
              if (!title || !date || !startTime) return;
              await addSession({ title, date, startTime, endTime: endTime || undefined, studio: studio || undefined, engineerName: engineer || undefined, sessionType, notes: notes || undefined, cost: cost ? Number(cost) : undefined });
              setTitle(""); setDate(""); setStartTime(""); setEndTime(""); setStudio(""); setEngineer(""); setNotes(""); setCost(""); setShowForm(false);
            }}><Save className="size-3.5 inline mr-1.5" /> Book Session</EBtn>
          </div>
        </Panel>
      )}

      <Panel noPad>
        <div className="flex items-center gap-4 px-5 py-3 border-b border-[#1e1c1a] text-[9px] font-bold tracking-[0.2em] text-[#555] uppercase">
          <div className="w-10" />
          <div className="flex-1">Session</div>
          <div className="w-28 text-center hidden md:block">Date & Time</div>
          <div className="w-24 text-center hidden md:block">Studio</div>
          <div className="w-20 text-center">Status</div>
          <div className="w-20 text-right hidden md:block">Cost</div>
          <div className="w-16" />
        </div>
        {sessions?.map((session) => (
          <DataRow key={session._id}>
            <div className="w-10 flex items-center justify-center">
              <div className="size-9 rounded-lg bg-[#0d0c0b] border border-[#1e1c1a] flex items-center justify-center">
                {typeIcon[session.sessionType] || <Music className="size-4 text-[#888]" />}
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-[#f0ece4] font-medium truncate">{session.title}</p>
              <p className="text-[10px] text-[#555] mt-0.5">{session.sessionType}{session.engineerName ? ` · ${session.engineerName}` : ""}</p>
            </div>
            <div className="w-28 text-center hidden md:block">
              <p className="text-[11px] text-[#f0ece4] font-mono">{session.date}</p>
              <p className="text-[10px] text-[#555] font-mono">{session.startTime}{session.endTime ? ` – ${session.endTime}` : ""}</p>
            </div>
            <div className="w-24 text-center hidden md:block">
              <span className="text-[10px] text-[#888]">{session.studio || "—"}</span>
            </div>
            <div className="w-20 text-center">
              <StatusPill status={session.status || "scheduled"} colorMap={statusColors} />
            </div>
            <div className="w-20 text-right hidden md:block">
              {session.cost ? <span className="text-sm text-green-400 font-mono">${session.cost}</span> : <span className="text-[#444]">—</span>}
            </div>
            <div className="w-16 flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {session.status !== "completed" && (
                <button onClick={() => updateSession({ id: session._id, status: "completed" })}
                  className="p-1.5 rounded-lg text-[#555] hover:text-green-400 hover:bg-green-400/10 transition-all" title="Mark complete">
                  <CheckCircle className="size-3.5" />
                </button>
              )}
              <button onClick={() => deleteSession({ id: session._id })}
                className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-all">
                <Trash2 className="size-3.5" />
              </button>
            </div>
          </DataRow>
        ))}
        {(!sessions || sessions.length === 0) && <EmptyState icon={Mic} title="No sessions booked" sub="Book your first studio session to get started." />}
      </Panel>
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   TAB 5 — BEAT LIBRARY
   ═══════════════════════════════════════════════════════════ */

export function BeatLibraryTab() {
  const beats = useQuery(api.musicProduction.getBeats);
  const addBeat = useMutation(api.musicProduction.addBeat);
  const updateBeat = useMutation(api.musicProduction.updateBeat);
  const deleteBeat = useMutation(api.musicProduction.deleteBeat);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  const [title, setTitle] = useState("");
  const [producer, setProducer] = useState("");
  const [genre, setGenre] = useState("");
  const [bpm, setBpm] = useState("");
  const [key, setKey] = useState("");
  const [mood, setMood] = useState("");
  const [tagsStr, setTagsStr] = useState("");
  const [status, setStatus] = useState("available");
  const [price, setPrice] = useState("");

  const statusColors: Record<string, string> = {
    available: "text-green-400 bg-green-500/8 border-green-500/15",
    "on-hold": "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
    assigned: "text-blue-400 bg-blue-500/8 border-blue-500/15",
    sold: "text-[#D4A843] bg-[#D4A843]/8 border-[#D4A843]/15",
    used: "text-purple-400 bg-purple-500/8 border-purple-500/15",
  };

  const filtered = beats?.filter((b) => statusFilter === "all" || b.status === statusFilter) || [];

  return (
    <div className="space-y-5">
      <SectionHeader icon={Disc3} title="Beat Library" accent="#D4A843"
        subtitle="Browse and manage the full beat catalog"
        count={beats?.length} action={
          <EBtn onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
            {showForm ? <><X className="size-3.5 inline mr-1.5" />Cancel</> : <><Plus className="size-3.5 inline mr-1.5" />Add Beat</>}
          </EBtn>
        } />

      <FilterChips active={statusFilter} onChange={setStatusFilter} options={[
        { value: "all", label: "All", count: beats?.length },
        { value: "available", label: "Available" }, { value: "on-hold", label: "On Hold" },
        { value: "assigned", label: "Assigned" }, { value: "sold", label: "Sold" }, { value: "used", label: "Used" },
      ]} />

      {showForm && (
        <Panel className="border-[#D4A843]/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <EInput label="Beat Title" value={title} onChange={setTitle} placeholder="Beat name" />
            <EInput label="Producer" value={producer} onChange={setProducer} placeholder="Producer name" />
            <ESelect label="Status" value={status} onChange={setStatus} options={[
              { value: "available", label: "🟢 Available" }, { value: "on-hold", label: "🟡 On Hold" },
              { value: "assigned", label: "🔵 Assigned" }, { value: "sold", label: "💰 Sold" },
              { value: "used", label: "🟣 Used" },
            ]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <EInput label="Genre" value={genre} onChange={setGenre} placeholder="Trap" />
            <EInput label="BPM" value={bpm} onChange={setBpm} type="number" placeholder="140" />
            <EInput label="Key" value={key} onChange={setKey} placeholder="F# minor" />
            <EInput label="Mood" value={mood} onChange={setMood} placeholder="Dark, Melodic" />
            <EInput label="Price ($)" value={price} onChange={setPrice} type="number" placeholder="0" />
          </div>
          <div className="mb-4">
            <EInput label="Tags (comma separated)" value={tagsStr} onChange={setTagsStr} placeholder="808, dark, melodic, guitar" />
          </div>
          <div className="flex justify-end">
            <EBtn onClick={async () => {
              if (!title || !producer) return;
              await addBeat({ title, producerName: producer, genre: genre || undefined, bpm: bpm ? Number(bpm) : undefined, key: key || undefined, mood: mood || undefined, tags: tagsStr ? tagsStr.split(",").map((t) => t.trim()) : undefined, status, price: price ? Number(price) : undefined });
              setTitle(""); setProducer(""); setGenre(""); setBpm(""); setKey(""); setMood(""); setTagsStr(""); setPrice(""); setShowForm(false);
            }}><Save className="size-3.5 inline mr-1.5" /> Add Beat</EBtn>
          </div>
        </Panel>
      )}

      {/* Beat Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((beat) => (
          <Panel key={beat._id} className="relative group hover:border-[#2a2622] transition-all">
            <button onClick={() => deleteBeat({ id: beat._id })}
              className="absolute top-4 right-4 p-1.5 rounded-lg text-[#333] hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
              <Trash2 className="size-3.5" />
            </button>
            <div className="flex items-center gap-3 mb-3">
              <div className="size-10 rounded-lg bg-gradient-to-br from-[#D4A843]/10 to-purple-500/10 border border-[#D4A843]/15 flex items-center justify-center">
                <Disc3 className="size-4 text-[#D4A843]" />
              </div>
              <div className="min-w-0">
                <h3 className="font-display text-sm text-[#f0ece4] tracking-wider truncate">{beat.title}</h3>
                <p className="text-[10px] text-[#666]">Prod. {beat.producerName}</p>
              </div>
            </div>

            {/* Specs Row */}
            <div className="flex flex-wrap gap-1.5 mb-3">
              {beat.bpm && <span className="text-[9px] font-mono bg-[#0d0c0b] text-[#888] px-2 py-0.5 rounded border border-[#1e1c1a]">{beat.bpm} BPM</span>}
              {beat.key && <span className="text-[9px] font-mono bg-[#0d0c0b] text-[#888] px-2 py-0.5 rounded border border-[#1e1c1a]">{beat.key}</span>}
              {beat.genre && <span className="text-[9px] bg-[#0d0c0b] text-[#888] px-2 py-0.5 rounded border border-[#1e1c1a]">{beat.genre}</span>}
              {beat.mood && <span className="text-[9px] bg-[#0d0c0b] text-[#888] px-2 py-0.5 rounded border border-[#1e1c1a]">{beat.mood}</span>}
            </div>

            {beat.tags && beat.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {beat.tags.map((t) => (
                  <span key={t} className="text-[8px] text-purple-400/80 bg-purple-500/8 px-1.5 py-0.5 rounded border border-purple-500/15">#{t}</span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-between pt-3 border-t border-[#1e1c1a]">
              <StatusPill status={beat.status} colorMap={statusColors} />
              {beat.price ? <span className="font-display text-lg text-[#D4A843]">${beat.price}</span> : null}
            </div>
          </Panel>
        ))}
      </div>

      {filtered.length === 0 && <EmptyState icon={Disc3} title="No beats in library" sub="Upload your first beat to start building the catalog." />}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   TAB 6 — RELEASE MANAGER
   ═══════════════════════════════════════════════════════════ */

export function ReleaseManagerTab() {
  const releases = useQuery(api.musicProduction.getReleases);
  const addRelease = useMutation(api.musicProduction.addRelease);
  const updateRelease = useMutation(api.musicProduction.updateRelease);
  const deleteRelease = useMutation(api.musicProduction.deleteRelease);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [type, setType] = useState("single");
  const [releaseDate, setReleaseDate] = useState("");
  const [status, setStatus] = useState("planning");
  const [distributor, setDistributor] = useState("");
  const [isrc, setIsrc] = useState("");
  const [upc, setUpc] = useState("");

  const statusColors: Record<string, string> = {
    planning: "text-gray-400 bg-gray-500/8 border-gray-500/15",
    "pre-production": "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
    production: "text-blue-400 bg-blue-500/8 border-blue-500/15",
    "post-production": "text-purple-400 bg-purple-500/8 border-purple-500/15",
    submitted: "text-orange-400 bg-orange-500/8 border-orange-500/15",
    scheduled: "text-cyan-400 bg-cyan-500/8 border-cyan-500/15",
    released: "text-green-400 bg-green-500/8 border-green-500/15",
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={Radio} title="Release Manager" accent="#ef4444"
        subtitle="Plan, prepare, and track every release"
        count={releases?.length} action={
          <EBtn onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
            {showForm ? <><X className="size-3.5 inline mr-1.5" />Cancel</> : <><Plus className="size-3.5 inline mr-1.5" />New Release</>}
          </EBtn>
        } />

      {showForm && (
        <Panel className="border-red-500/20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <EInput label="Release Title" value={title} onChange={setTitle} placeholder="Title" />
            <EInput label="Artist" value={artistName} onChange={setArtistName} placeholder="Artist name" />
            <ESelect label="Type" value={type} onChange={setType} options={[
              { value: "single", label: "Single" }, { value: "ep", label: "EP" },
              { value: "album", label: "Album" }, { value: "mixtape", label: "Mixtape" },
            ]} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <EInput label="Release Date" value={releaseDate} onChange={setReleaseDate} type="date" />
            <ESelect label="Status" value={status} onChange={setStatus} options={[
              { value: "planning", label: "Planning" }, { value: "pre-production", label: "Pre-Production" },
              { value: "production", label: "Production" }, { value: "post-production", label: "Post-Production" },
              { value: "submitted", label: "Submitted" }, { value: "scheduled", label: "Scheduled" },
              { value: "released", label: "Released" },
            ]} />
            <EInput label="Distributor" value={distributor} onChange={setDistributor} placeholder="DistroKid, TuneCore..." />
            <EInput label="ISRC" value={isrc} onChange={setIsrc} placeholder="US-XXX-XX-XXXXX" />
          </div>
          <div className="flex justify-end">
            <EBtn onClick={async () => {
              if (!title || !artistName) return;
              await addRelease({ title, artistName, type, releaseDate: releaseDate || undefined, status, distributor: distributor || undefined, isrc: isrc || undefined, upc: upc || undefined });
              setTitle(""); setArtistName(""); setReleaseDate(""); setDistributor(""); setIsrc(""); setUpc(""); setShowForm(false);
            }}><Save className="size-3.5 inline mr-1.5" /> Create Release</EBtn>
          </div>
        </Panel>
      )}

      {/* Release Cards */}
      <div className="space-y-4">
        {releases?.map((release) => {
          const checklist = [
            { label: "Mastered", done: release.mastered, field: "mastered" },
            { label: "Artwork", done: release.artworkStatus === "approved" || release.artworkStatus === "submitted", field: "artwork" },
            { label: "Metadata", done: release.metadataComplete, field: "metadataComplete" },
            { label: "Submitted", done: release.distributorSubmitted, field: "distributorSubmitted" },
          ];
          const progress = checklist.filter((c) => c.done).length;

          return (
            <Panel key={release._id} className="group hover:border-[#2a2622] transition-all">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4">
                  <div className="size-12 rounded-xl bg-gradient-to-br from-red-500/10 to-orange-500/10 border border-red-500/15 flex items-center justify-center">
                    <Radio className="size-5 text-red-400" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2.5 mb-1">
                      <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">{release.title}</h3>
                      <span className="text-[9px] font-bold tracking-wider uppercase text-[#777] bg-[#0d0c0b] px-2 py-0.5 rounded border border-[#1e1c1a]">{release.type}</span>
                      <StatusPill status={release.status} colorMap={statusColors} />
                    </div>
                    <p className="text-xs text-[#888]">by {release.artistName}</p>
                    <div className="flex items-center gap-4 mt-2 text-[10px] text-[#555]">
                      {release.releaseDate && <span className="flex items-center gap-1"><Calendar className="size-3" />{release.releaseDate}</span>}
                      {release.distributor && <span>📦 {release.distributor}</span>}
                      {release.isrc && <span className="font-mono">ISRC: {release.isrc}</span>}
                    </div>
                  </div>
                </div>
                <button onClick={() => deleteRelease({ id: release._id })}
                  className="p-1.5 rounded-lg text-[#333] hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="size-3.5" />
                </button>
              </div>

              {/* Release Checklist */}
              <div className="pt-4 border-t border-[#1e1c1a]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold tracking-[0.2em] text-[#666] uppercase">Release Readiness</span>
                  <span className="text-[10px] font-mono text-[#D4A843]">{progress}/{checklist.length}</span>
                </div>
                {/* Progress bar */}
                <div className="h-1 bg-[#1a1816] rounded-full mb-3 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-[#D4A843] to-green-400 rounded-full transition-all" style={{ width: `${(progress / checklist.length) * 100}%` }} />
                </div>
                <div className="flex gap-2 flex-wrap">
                  {checklist.map((item) => (
                    <button key={item.label} onClick={() => {
                      if (item.field === "artwork") {
                        updateRelease({ id: release._id, artworkStatus: release.artworkStatus === "approved" ? "not-started" : "approved" });
                      } else {
                        updateRelease({ id: release._id, [item.field]: !item.done } as any);
                      }
                    }}
                      className={`flex items-center gap-1.5 text-[10px] px-3 py-1.5 rounded-lg border transition-all ${
                        item.done
                          ? "text-green-400 bg-green-500/8 border-green-500/15"
                          : "text-[#555] bg-[#0d0c0b] border-[#1e1c1a] hover:text-[#888] hover:border-[#2a2622]"
                      }`}>
                      <CheckCircle className="size-3" />
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </Panel>
          );
        })}
      </div>

      {(!releases || releases.length === 0) && <EmptyState icon={Radio} title="No releases planned" sub="Create your first release to start the rollout pipeline." />}
    </div>
  );
}


/* ═══════════════════════════════════════════════════════════
   TAB 7 — SPLITS & CREDITS
   ═══════════════════════════════════════════════════════════ */

export function SplitsCreditsTab() {
  const splits = useQuery(api.musicProduction.getSplits);
  const addSplit = useMutation(api.musicProduction.addSplit);
  const updateSplit = useMutation(api.musicProduction.updateSplit);
  const deleteSplit = useMutation(api.musicProduction.deleteSplit);
  const [showForm, setShowForm] = useState(false);

  const [trackTitle, setTrackTitle] = useState("");
  const [contributors, setContributors] = useState<{ name: string; role: string; percentage: number; pro: string }[]>(
    [{ name: "", role: "songwriter", percentage: 100, pro: "" }]
  );

  const totalPct = contributors.reduce((s, c) => s + c.percentage, 0);

  const addContributor = () => setContributors([...contributors, { name: "", role: "songwriter", percentage: 0, pro: "" }]);
  const removeContributor = (idx: number) => setContributors(contributors.filter((_, i) => i !== idx));
  const updateContributor = (idx: number, field: string, value: string | number) => {
    const updated = [...contributors];
    (updated[idx] as any)[field] = value;
    setContributors(updated);
  };

  return (
    <div className="space-y-5">
      <SectionHeader icon={GitBranch} title="Splits & Credits" accent="#06b6d4"
        subtitle="Manage ownership splits and contributor credits"
        count={splits?.length} action={
          <EBtn onClick={() => setShowForm(!showForm)} variant={showForm ? "ghost" : "primary"}>
            {showForm ? <><X className="size-3.5 inline mr-1.5" />Cancel</> : <><Plus className="size-3.5 inline mr-1.5" />New Split Sheet</>}
          </EBtn>
        } />

      {showForm && (
        <Panel className="border-cyan-500/20">
          <EInput label="Track Title" value={trackTitle} onChange={setTrackTitle} placeholder="Song name" />
          <div className="mt-5 mb-3 flex items-center justify-between">
            <span className="text-[9px] font-bold tracking-[0.2em] text-[#666] uppercase">Contributors</span>
            <span className={`text-xs font-bold font-mono ${totalPct === 100 ? "text-green-400" : totalPct > 100 ? "text-red-400" : "text-yellow-400"}`}>
              {totalPct}% {totalPct === 100 ? "✓" : totalPct > 100 ? "⚠️ Over" : ""}
            </span>
          </div>
          {/* Total bar */}
          <div className="h-1.5 bg-[#1a1816] rounded-full mb-4 overflow-hidden">
            <div className={`h-full rounded-full transition-all ${totalPct === 100 ? "bg-green-400" : totalPct > 100 ? "bg-red-400" : "bg-[#D4A843]"}`}
              style={{ width: `${Math.min(totalPct, 100)}%` }} />
          </div>
          {contributors.map((c, idx) => (
            <div key={idx} className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end">
              <EInput label={idx === 0 ? "Name" : ""} value={c.name} onChange={(v) => updateContributor(idx, "name", v)} placeholder="Name" />
              <ESelect label={idx === 0 ? "Role" : ""} value={c.role} onChange={(v) => updateContributor(idx, "role", v)} options={[
                { value: "songwriter", label: "Songwriter" }, { value: "producer", label: "Producer" },
                { value: "performer", label: "Performer" }, { value: "engineer", label: "Engineer" },
                { value: "featured", label: "Featured" },
              ]} />
              <EInput label={idx === 0 ? "Split %" : ""} value={c.percentage} onChange={(v) => updateContributor(idx, "percentage", Number(v))} type="number" placeholder="50" />
              <ESelect label={idx === 0 ? "PRO" : ""} value={c.pro} onChange={(v) => updateContributor(idx, "pro", v)} options={[
                { value: "", label: "—" }, { value: "ASCAP", label: "ASCAP" },
                { value: "BMI", label: "BMI" }, { value: "SESAC", label: "SESAC" },
              ]} />
              <button onClick={() => removeContributor(idx)}
                className="p-2 text-[#555] hover:text-red-400 transition-colors self-end mb-1">
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-3 mt-5">
            <EBtn variant="ghost" onClick={addContributor}><Plus className="size-3.5 inline mr-1" /> Add Contributor</EBtn>
            <EBtn disabled={!trackTitle || totalPct !== 100} onClick={async () => {
              if (!trackTitle || totalPct !== 100) return;
              await addSplit({ trackTitle, contributors: contributors.map((c) => ({ name: c.name, role: c.role, percentage: c.percentage, pro: c.pro || undefined })) });
              setTrackTitle(""); setContributors([{ name: "", role: "songwriter", percentage: 100, pro: "" }]); setShowForm(false);
            }}><Save className="size-3.5 inline mr-1.5" /> Save Split Sheet</EBtn>
          </div>
        </Panel>
      )}

      {/* Split Sheets */}
      <div className="space-y-4">
        {splits?.map((split) => (
          <Panel key={split._id} className="group hover:border-[#2a2622] transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="size-10 rounded-lg bg-gradient-to-br from-cyan-500/10 to-blue-500/10 border border-cyan-500/15 flex items-center justify-center">
                  <GitBranch className="size-4 text-cyan-400" />
                </div>
                <div>
                  <h3 className="font-display text-base text-[#f0ece4] tracking-wider">{split.trackTitle}</h3>
                  <p className="text-[10px] text-[#666]">{split.contributors.length} contributor{split.contributors.length !== 1 ? "s" : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusPill status={split.status || "draft"} colorMap={{
                  draft: "text-gray-400 bg-gray-500/8 border-gray-500/15",
                  pending: "text-yellow-400 bg-yellow-500/8 border-yellow-500/15",
                  agreed: "text-blue-400 bg-blue-500/8 border-blue-500/15",
                  signed: "text-green-400 bg-green-500/8 border-green-500/15",
                }} />
                <button onClick={() => deleteSplit({ id: split._id })}
                  className="p-1.5 rounded-lg text-[#333] hover:text-red-400 hover:bg-red-400/10 opacity-0 group-hover:opacity-100 transition-all">
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            </div>

            {/* Contributor Bars */}
            <div className="space-y-2">
              {split.contributors.map((c, idx) => (
                <div key={idx} className="flex items-center gap-3 bg-[#0d0c0b] rounded-lg px-4 py-2.5 border border-[#1a1816]">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="size-7 rounded-full bg-[#1a1816] border border-[#2a2622] flex items-center justify-center">
                      <span className="text-[10px] font-bold text-[#888]">{c.name.charAt(0).toUpperCase()}</span>
                    </div>
                    <div className="min-w-0">
                      <span className="text-sm text-[#f0ece4] font-medium">{c.name}</span>
                      <span className="text-[9px] text-[#666] uppercase tracking-wider ml-2">{c.role}</span>
                    </div>
                  </div>
                  {c.pro && (
                    <span className="text-[8px] font-bold text-purple-400 bg-purple-500/8 px-2 py-0.5 rounded border border-purple-500/15 tracking-wider">{c.pro}</span>
                  )}
                  <div className="flex items-center gap-3 w-40">
                    <div className="flex-1 h-1.5 bg-[#1a1816] rounded-full overflow-hidden">
                      <div className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8C767] rounded-full transition-all" style={{ width: `${c.percentage}%` }} />
                    </div>
                    <span className="text-sm font-display text-[#D4A843] min-w-[3rem] text-right">{c.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        ))}
      </div>

      {(!splits || splits.length === 0) && <EmptyState icon={GitBranch} title="No split sheets" sub="Create your first split sheet to track ownership and credits." />}
    </div>
  );
}
