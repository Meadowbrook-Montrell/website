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
        <div className="text-center py-16">
          <AlertTriangle className="size-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#f0ece4] mb-2">
            {this.props.name} hit an error
          </h3>
          <p className="text-sm text-[#888] max-w-md mx-auto mb-4">
            {this.state.error?.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false })}
            className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-5 py-2.5"
          >
            Try Again
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

// ─── Shared Components ──────────────────────────────────────
const Card = ({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) => (
  <div
    className={`bg-[#1a1816]/80 border border-[#2a2622] rounded-xl p-5 ${className}`}
  >
    {children}
  </div>
);

const Btn = ({
  children,
  onClick,
  variant = "gold",
  disabled,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: string;
  disabled?: boolean;
  className?: string;
}) => {
  const styles: Record<string, string> = {
    gold: "bg-[#D4A843] text-[#0a0a0a] hover:bg-[#E8C767]",
    danger:
      "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30",
    ghost:
      "bg-[#2a2622]/50 text-[#888] border border-[#2a2622] hover:text-[#f0ece4]",
    green:
      "bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30",
    purple:
      "bg-purple-600/20 text-purple-400 border border-purple-600/30 hover:bg-purple-600/30",
  };
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`font-bold text-sm rounded-lg px-4 py-2.5 transition-all disabled:opacity-40 ${styles[variant] || styles.gold} ${className}`}
    >
      {children}
    </button>
  );
};

const StatusBadge = ({
  status,
  colorMap,
}: {
  status: string;
  colorMap: Record<string, string>;
}) => {
  const color = colorMap[status] || "text-[#888] bg-[#1a1a1a] border-[#333]";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${color}`}
    >
      {status}
    </span>
  );
};

const InputField = ({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) => (
  <div>
    <label className="text-xs text-[#888] uppercase mb-1 block tracking-wider">
      {label}
    </label>
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded-lg p-2.5 text-sm focus:border-[#D4A843]/50 focus:outline-none transition-colors"
    />
  </div>
);

const SelectField = ({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) => (
  <div>
    <label className="text-xs text-[#888] uppercase mb-1 block tracking-wider">
      {label}
    </label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded-lg p-2.5 text-sm focus:border-[#D4A843]/50 focus:outline-none"
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>
          {o.label}
        </option>
      ))}
    </select>
  </div>
);

// ═══════════════════════════════════════════════════════════
//  MUSIC PRODUCTION OVERVIEW TAB
// ═══════════════════════════════════════════════════════════

export function MusicProductionOverviewTab() {
  const stats = useQuery(api.musicProduction.getMusicProductionStats);
  const projects = useQuery(api.musicProduction.getProjects);
  const sessions = useQuery(api.musicProduction.getSessions);

  const statusFlow = [
    "concept",
    "writing",
    "recording",
    "mixing",
    "mastering",
    "review",
    "ready",
    "released",
  ];
  const statusEmoji: Record<string, string> = {
    concept: "💡",
    writing: "✍️",
    recording: "🎙️",
    mixing: "🎛️",
    mastering: "🔊",
    review: "👀",
    ready: "✅",
    released: "🚀",
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2.5 bg-gradient-to-br from-purple-500/20 to-[#D4A843]/20 rounded-xl border border-purple-500/20">
          <Headphones className="size-6 text-purple-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4] tracking-wider">
            Music Production Command Center
          </h2>
          <p className="text-xs text-[#888] tracking-wider">
            3rd Gate Music Group — Production Hub
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
          {[
            {
              icon: Users,
              label: "Roster",
              value: stats.activeArtists,
              sub: `/${stats.totalArtists} total`,
              color: "purple",
            },
            {
              icon: Music,
              label: "Active Projects",
              value: stats.activeProjects,
              sub: `/${stats.totalProjects} total`,
              color: "blue",
            },
            {
              icon: Calendar,
              label: "Upcoming Sessions",
              value: stats.upcomingSessions,
              sub: `/${stats.totalSessions} total`,
              color: "green",
            },
            {
              icon: Disc3,
              label: "Beats Available",
              value: stats.availableBeats,
              sub: `/${stats.totalBeats} total`,
              color: "gold",
            },
            {
              icon: Radio,
              label: "Upcoming Releases",
              value: stats.upcomingReleases,
              sub: `/${stats.totalReleases} total`,
              color: "red",
            },
            {
              icon: FileText,
              label: "Pending Splits",
              value: stats.pendingSplits,
              sub: `/${stats.totalSplits} total`,
              color: "cyan",
            },
          ].map((s) => {
            const colors: Record<string, string> = {
              purple:
                "from-purple-500/15 to-purple-500/5 border-purple-500/20 text-purple-400",
              blue: "from-blue-500/15 to-blue-500/5 border-blue-500/20 text-blue-400",
              green:
                "from-green-500/15 to-green-500/5 border-green-500/20 text-green-400",
              gold: "from-[#D4A843]/15 to-[#D4A843]/5 border-[#D4A843]/20 text-[#D4A843]",
              red: "from-red-500/15 to-red-500/5 border-red-500/20 text-red-400",
              cyan: "from-cyan-500/15 to-cyan-500/5 border-cyan-500/20 text-cyan-400",
            };
            return (
              <div
                key={s.label}
                className={`bg-gradient-to-br ${colors[s.color]} border rounded-xl p-4`}
              >
                <s.icon className="size-4 opacity-70 mb-2" />
                <p className="font-display text-2xl text-[#f0ece4]">
                  {s.value}
                </p>
                <p className="text-[10px] text-[#888] uppercase tracking-wider">
                  {s.label}
                </p>
                <p className="text-[10px] text-[#666]">{s.sub}</p>
              </div>
            );
          })}
        </div>
      )}

      {/* Production Pipeline */}
      <Card className="mb-6">
        <div className="flex items-center gap-2 mb-4">
          <Sliders className="size-4 text-purple-400" />
          <h3 className="font-bold text-[#f0ece4] tracking-wider">
            Production Pipeline
          </h3>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {statusFlow.map((status) => {
            const count = stats?.projectsByStatus[status] || 0;
            return (
              <div
                key={status}
                className="flex-shrink-0 min-w-[100px] bg-[#0a0a0a] border border-[#2a2622] rounded-lg p-3 text-center"
              >
                <span className="text-xl">{statusEmoji[status]}</span>
                <p className="font-display text-xl text-[#f0ece4] mt-1">
                  {count}
                </p>
                <p className="text-[9px] text-[#888] uppercase tracking-widest">
                  {status}
                </p>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Music className="size-4 text-blue-400" />
            <h3 className="font-bold text-[#f0ece4] tracking-wider text-sm">
              Recent Projects
            </h3>
          </div>
          {projects?.slice(0, 5).map((p) => (
            <div
              key={p._id}
              className="flex items-center justify-between py-2 border-b border-[#2a2622]/50 last:border-0"
            >
              <div>
                <p className="text-sm text-[#f0ece4]">{p.title}</p>
                <p className="text-[10px] text-[#888]">
                  {p.type} · {p.genre || "—"}
                </p>
              </div>
              <StatusBadge
                status={p.status}
                colorMap={{
                  concept: "text-gray-400 bg-gray-500/10 border-gray-500/20",
                  writing: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
                  recording: "text-blue-400 bg-blue-500/10 border-blue-500/20",
                  mixing: "text-purple-400 bg-purple-500/10 border-purple-500/20",
                  mastering: "text-orange-400 bg-orange-500/10 border-orange-500/20",
                  review: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
                  ready: "text-green-400 bg-green-500/10 border-green-500/20",
                  released: "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20",
                }}
              />
            </div>
          ))}
          {(!projects || projects.length === 0) && (
            <p className="text-sm text-[#666] text-center py-4">
              No projects yet
            </p>
          )}
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Calendar className="size-4 text-green-400" />
            <h3 className="font-bold text-[#f0ece4] tracking-wider text-sm">
              Upcoming Sessions
            </h3>
          </div>
          {sessions
            ?.filter((s) => s.status === "scheduled")
            .slice(0, 5)
            .map((s) => (
              <div
                key={s._id}
                className="flex items-center justify-between py-2 border-b border-[#2a2622]/50 last:border-0"
              >
                <div>
                  <p className="text-sm text-[#f0ece4]">{s.title}</p>
                  <p className="text-[10px] text-[#888]">
                    {s.date} · {s.startTime} · {s.sessionType}
                  </p>
                </div>
                <span className="text-[10px] text-green-400 bg-green-500/10 border border-green-500/20 px-2 py-0.5 rounded-full">
                  {s.studio || "TBD"}
                </span>
              </div>
            ))}
          {(!sessions ||
            sessions.filter((s) => s.status === "scheduled").length === 0) && (
            <p className="text-sm text-[#666] text-center py-4">
              No upcoming sessions
            </p>
          )}
        </Card>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  ARTIST ROSTER TAB
// ═══════════════════════════════════════════════════════════

export function ArtistRosterTab() {
  const artists = useQuery(api.musicProduction.getArtists);
  const addArtist = useMutation(api.musicProduction.addArtist);
  const deleteArtist = useMutation(api.musicProduction.deleteArtist);
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");

  // Form state
  const [name, setName] = useState("");
  const [role, setRole] = useState("artist");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("active");
  const [genresStr, setGenresStr] = useState("");

  const roleEmoji: Record<string, string> = {
    artist: "🎤",
    producer: "🎹",
    engineer: "🎛️",
    songwriter: "✍️",
    multi: "⭐",
  };

  const filtered =
    artists?.filter(
      (a) => filter === "all" || a.role === filter || a.status === filter
    ) || [];

  const resetForm = () => {
    setName("");
    setRole("artist");
    setBio("");
    setEmail("");
    setPhone("");
    setStatus("active");
    setGenresStr("");
    setShowForm(false);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Users className="size-5 text-purple-400" />
          <h2 className="text-lg font-bold text-[#f0ece4] tracking-wider">
            Artist Roster
          </h2>
          <span className="text-xs text-[#888]">
            {artists?.length || 0} total
          </span>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4 inline mr-1" />
          {showForm ? "Cancel" : "Add to Roster"}
        </Btn>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          "all",
          "artist",
          "producer",
          "engineer",
          "songwriter",
          "active",
          "development",
        ].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${filter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#1a1816] text-[#888] border border-[#2a2622] hover:text-[#f0ece4]"}`}
          >
            {f === "all" ? "All" : f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Name"
              value={name}
              onChange={setName}
              placeholder="Artist / Producer name"
            />
            <SelectField
              label="Role"
              value={role}
              onChange={setRole}
              options={[
                { value: "artist", label: "🎤 Artist" },
                { value: "producer", label: "🎹 Producer" },
                { value: "engineer", label: "🎛️ Engineer" },
                { value: "songwriter", label: "✍️ Songwriter" },
                { value: "multi", label: "⭐ Multi-Role" },
              ]}
            />
            <SelectField
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "active", label: "Active" },
                { value: "development", label: "In Development" },
                { value: "inactive", label: "Inactive" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Email"
              value={email}
              onChange={setEmail}
              placeholder="email@example.com"
            />
            <InputField
              label="Phone"
              value={phone}
              onChange={setPhone}
              placeholder="(xxx) xxx-xxxx"
            />
            <InputField
              label="Genres (comma separated)"
              value={genresStr}
              onChange={setGenresStr}
              placeholder="Hip-Hop, R&B, Trap"
            />
          </div>
          <div className="mb-4">
            <label className="text-xs text-[#888] uppercase mb-1 block tracking-wider">
              Bio
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded-lg p-2.5 text-sm focus:border-[#D4A843]/50 focus:outline-none"
              placeholder="Short bio..."
            />
          </div>
          <Btn
            onClick={async () => {
              if (!name) return;
              await addArtist({
                name,
                role,
                bio: bio || undefined,
                email: email || undefined,
                phone: phone || undefined,
                status,
                genres: genresStr
                  ? genresStr.split(",").map((g) => g.trim())
                  : undefined,
              });
              resetForm();
            }}
          >
            <Save className="size-4 inline mr-1" /> Save to Roster
          </Btn>
        </Card>
      )}

      {/* Roster Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((artist) => (
          <Card key={artist._id} className="relative group">
            <button
              onClick={() => deleteArtist({ id: artist._id })}
              className="absolute top-3 right-3 text-red-400/0 group-hover:text-red-400/60 hover:!text-red-400 transition-all"
            >
              <Trash2 className="size-4" />
            </button>
            <div className="flex items-start gap-3 mb-3">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500/20 to-[#D4A843]/20 border border-purple-500/20 flex items-center justify-center text-xl flex-shrink-0">
                {roleEmoji[artist.role] || "🎵"}
              </div>
              <div>
                <h3 className="font-bold text-[#f0ece4] tracking-wider">
                  {artist.name}
                </h3>
                <p className="text-[10px] text-[#888] uppercase tracking-widest">
                  {artist.role}
                </p>
              </div>
            </div>
            {artist.bio && (
              <p className="text-xs text-[#888] mb-3 line-clamp-2">
                {artist.bio}
              </p>
            )}
            {artist.genres && artist.genres.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {artist.genres.map((g) => (
                  <span
                    key={g}
                    className="text-[9px] bg-[#2a2622] text-[#888] px-2 py-0.5 rounded-full"
                  >
                    {g}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <StatusBadge
                status={artist.status}
                colorMap={{
                  active:
                    "text-green-400 bg-green-500/10 border-green-500/20",
                  development:
                    "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
                  inactive:
                    "text-gray-400 bg-gray-500/10 border-gray-500/20",
                }}
              />
              {artist.email && (
                <span className="text-[10px] text-[#666]">
                  {artist.email}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <p className="text-center text-[#666] py-8">
            No members on the roster yet. Click "Add to Roster" to get started.
          </p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  PROJECT TRACKER TAB
// ═══════════════════════════════════════════════════════════

export function ProjectTrackerTab() {
  const projects = useQuery(api.musicProduction.getProjects);
  const artists = useQuery(api.musicProduction.getArtists);
  const addProject = useMutation(api.musicProduction.addProject);
  const updateProject = useMutation(api.musicProduction.updateProject);
  const deleteProject = useMutation(api.musicProduction.deleteProject);
  const [showForm, setShowForm] = useState(false);
  const [statusFilter, setStatusFilter] = useState("all");

  // Form
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
    concept: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    writing: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    recording: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    mixing: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    mastering: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    review: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    ready: "text-green-400 bg-green-500/10 border-green-500/20",
    released: "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20",
  };

  const priorityColors: Record<string, string> = {
    low: "text-gray-400",
    medium: "text-blue-400",
    high: "text-orange-400",
    urgent: "text-red-400",
  };

  const filtered =
    projects?.filter(
      (p) => statusFilter === "all" || p.status === statusFilter
    ) || [];

  const statusOptions = [
    "concept",
    "writing",
    "recording",
    "mixing",
    "mastering",
    "review",
    "ready",
    "released",
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Music className="size-5 text-blue-400" />
          <h2 className="text-lg font-bold text-[#f0ece4] tracking-wider">
            Project Tracker
          </h2>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4 inline mr-1" />
          {showForm ? "Cancel" : "New Project"}
        </Btn>
      </div>

      {/* Status Filters */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", ...statusOptions].map((s) => (
          <button
            key={s}
            onClick={() => setStatusFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === s ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#1a1816] text-[#888] border border-[#2a2622] hover:text-[#f0ece4]"}`}
          >
            {s === "all" ? "All" : s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <InputField
              label="Project Title"
              value={title}
              onChange={setTitle}
              placeholder="Track / Album name"
            />
            <SelectField
              label="Type"
              value={type}
              onChange={setType}
              options={[
                { value: "single", label: "Single" },
                { value: "ep", label: "EP" },
                { value: "album", label: "Album" },
                { value: "mixtape", label: "Mixtape" },
                { value: "feature", label: "Feature" },
              ]}
            />
            <SelectField
              label="Status"
              value={status}
              onChange={setStatus}
              options={statusOptions.map((s) => ({
                value: s,
                label: s.charAt(0).toUpperCase() + s.slice(1),
              }))}
            />
            <SelectField
              label="Priority"
              value={priority}
              onChange={setPriority}
              options={[
                { value: "low", label: "🟢 Low" },
                { value: "medium", label: "🔵 Medium" },
                { value: "high", label: "🟠 High" },
                { value: "urgent", label: "🔴 Urgent" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <InputField
              label="Genre"
              value={genre}
              onChange={setGenre}
              placeholder="Hip-Hop, R&B..."
            />
            <InputField
              label="BPM"
              value={bpm}
              onChange={setBpm}
              type="number"
              placeholder="140"
            />
            <InputField
              label="Key"
              value={key}
              onChange={setKey}
              placeholder="C minor"
            />
            <InputField
              label="Target Release"
              value={targetDate}
              onChange={setTargetDate}
              type="date"
            />
          </div>
          <div className="mb-4">
            <label className="text-xs text-[#888] uppercase mb-1 block tracking-wider">
              Notes
            </label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={2}
              className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded-lg p-2.5 text-sm"
              placeholder="Production notes..."
            />
          </div>
          <Btn
            onClick={async () => {
              if (!title) return;
              await addProject({
                title,
                type,
                status,
                genre: genre || undefined,
                bpm: bpm ? Number(bpm) : undefined,
                key: key || undefined,
                mood: mood || undefined,
                priority,
                targetReleaseDate: targetDate || undefined,
                notes: notes || undefined,
              });
              setTitle("");
              setGenre("");
              setBpm("");
              setKey("");
              setMood("");
              setNotes("");
              setShowForm(false);
            }}
          >
            <Save className="size-4 inline mr-1" /> Create Project
          </Btn>
        </Card>
      )}

      {/* Project Cards */}
      <div className="space-y-3">
        {filtered.map((project) => (
          <Card key={project._id} className="group">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="font-bold text-[#f0ece4] tracking-wider">
                    {project.title}
                  </h3>
                  <span className="text-[10px] bg-[#2a2622] text-[#888] px-2 py-0.5 rounded-full uppercase">
                    {project.type}
                  </span>
                  <StatusBadge
                    status={project.status}
                    colorMap={statusColors}
                  />
                  {project.priority && (
                    <span
                      className={`text-[10px] font-bold uppercase ${priorityColors[project.priority] || ""}`}
                    >
                      ● {project.priority}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-4 text-xs text-[#888]">
                  {project.genre && (
                    <span>
                      <Tag className="size-3 inline mr-1" />
                      {project.genre}
                    </span>
                  )}
                  {project.bpm && (
                    <span>
                      <Clock className="size-3 inline mr-1" />
                      {project.bpm} BPM
                    </span>
                  )}
                  {project.key && (
                    <span>
                      <Music className="size-3 inline mr-1" />
                      {project.key}
                    </span>
                  )}
                  {project.targetReleaseDate && (
                    <span>
                      <Calendar className="size-3 inline mr-1" />
                      {project.targetReleaseDate}
                    </span>
                  )}
                </div>
                {project.notes && (
                  <p className="text-xs text-[#666] mt-2">{project.notes}</p>
                )}
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {/* Advance status */}
                {project.status !== "released" && (
                  <button
                    onClick={() => {
                      const idx = statusOptions.indexOf(project.status);
                      if (idx < statusOptions.length - 1) {
                        updateProject({
                          id: project._id,
                          status: statusOptions[idx + 1],
                        });
                      }
                    }}
                    className="text-green-400/60 hover:text-green-400 transition-colors"
                    title="Advance to next stage"
                  >
                    <ArrowRight className="size-4" />
                  </button>
                )}
                <button
                  onClick={() => deleteProject({ id: project._id })}
                  className="text-red-400/60 hover:text-red-400 transition-colors"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <p className="text-center text-[#666] py-8">
            No projects yet. Start creating!
          </p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  STUDIO SESSIONS TAB
// ═══════════════════════════════════════════════════════════

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

  const typeEmoji: Record<string, string> = {
    recording: "🎙️",
    mixing: "🎛️",
    mastering: "🔊",
    writing: "✍️",
    rehearsal: "🎸",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Mic className="size-5 text-green-400" />
          <h2 className="text-lg font-bold text-[#f0ece4] tracking-wider">
            Studio Sessions
          </h2>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4 inline mr-1" />
          {showForm ? "Cancel" : "Book Session"}
        </Btn>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Session Title"
              value={title}
              onChange={setTitle}
              placeholder="Recording — Track Name"
            />
            <InputField
              label="Date"
              value={date}
              onChange={setDate}
              type="date"
            />
            <SelectField
              label="Session Type"
              value={sessionType}
              onChange={setSessionType}
              options={[
                { value: "recording", label: "🎙️ Recording" },
                { value: "mixing", label: "🎛️ Mixing" },
                { value: "mastering", label: "🔊 Mastering" },
                { value: "writing", label: "✍️ Writing" },
                { value: "rehearsal", label: "🎸 Rehearsal" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <InputField
              label="Start Time"
              value={startTime}
              onChange={setStartTime}
              type="time"
            />
            <InputField
              label="End Time"
              value={endTime}
              onChange={setEndTime}
              type="time"
            />
            <InputField
              label="Studio"
              value={studio}
              onChange={setStudio}
              placeholder="Studio name / room"
            />
            <InputField
              label="Engineer"
              value={engineer}
              onChange={setEngineer}
              placeholder="Engineer name"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <InputField
              label="Session Cost ($)"
              value={cost}
              onChange={setCost}
              type="number"
              placeholder="0"
            />
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block tracking-wider">
                Notes
              </label>
              <input
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded-lg p-2.5 text-sm"
                placeholder="Session notes..."
              />
            </div>
          </div>
          <Btn
            onClick={async () => {
              if (!title || !date || !startTime) return;
              await addSession({
                title,
                date,
                startTime,
                endTime: endTime || undefined,
                studio: studio || undefined,
                engineerName: engineer || undefined,
                sessionType,
                notes: notes || undefined,
                cost: cost ? Number(cost) : undefined,
              });
              setTitle("");
              setDate("");
              setStartTime("");
              setEndTime("");
              setStudio("");
              setEngineer("");
              setNotes("");
              setCost("");
              setShowForm(false);
            }}
          >
            <Save className="size-4 inline mr-1" /> Book Session
          </Btn>
        </Card>
      )}

      {/* Sessions List */}
      <div className="space-y-3">
        {sessions?.map((session) => (
          <Card key={session._id} className="group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="text-2xl">
                  {typeEmoji[session.sessionType] || "🎵"}
                </div>
                <div>
                  <h3 className="font-bold text-[#f0ece4] text-sm">
                    {session.title}
                  </h3>
                  <div className="flex gap-3 text-xs text-[#888] mt-1">
                    <span>
                      <Calendar className="size-3 inline mr-1" />
                      {session.date}
                    </span>
                    <span>
                      <Clock className="size-3 inline mr-1" />
                      {session.startTime}
                      {session.endTime ? ` – ${session.endTime}` : ""}
                    </span>
                    {session.studio && (
                      <span>📍 {session.studio}</span>
                    )}
                    {session.engineerName && (
                      <span>🎛️ {session.engineerName}</span>
                    )}
                    {session.cost && (
                      <span className="text-green-400">
                        ${session.cost}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={session.status || "scheduled"}
                  colorMap={{
                    scheduled:
                      "text-blue-400 bg-blue-500/10 border-blue-500/20",
                    "in-progress":
                      "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
                    completed:
                      "text-green-400 bg-green-500/10 border-green-500/20",
                    cancelled:
                      "text-red-400 bg-red-500/10 border-red-500/20",
                  }}
                />
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {session.status !== "completed" && (
                    <button
                      onClick={() =>
                        updateSession({
                          id: session._id,
                          status: "completed",
                        })
                      }
                      className="text-green-400/60 hover:text-green-400"
                      title="Mark complete"
                    >
                      <CheckCircle className="size-4" />
                    </button>
                  )}
                  <button
                    onClick={() => deleteSession({ id: session._id })}
                    className="text-red-400/60 hover:text-red-400"
                  >
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {(!sessions || sessions.length === 0) && (
        <Card>
          <p className="text-center text-[#666] py-8">
            No sessions booked. Click "Book Session" to schedule one.
          </p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  BEAT LIBRARY TAB
// ═══════════════════════════════════════════════════════════

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
    available: "text-green-400 bg-green-500/10 border-green-500/20",
    "on-hold": "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    assigned: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    sold: "text-[#D4A843] bg-[#D4A843]/10 border-[#D4A843]/20",
    used: "text-purple-400 bg-purple-500/10 border-purple-500/20",
  };

  const filtered =
    beats?.filter(
      (b) => statusFilter === "all" || b.status === statusFilter
    ) || [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Disc3 className="size-5 text-[#D4A843]" />
          <h2 className="text-lg font-bold text-[#f0ece4] tracking-wider">
            Beat Library
          </h2>
          <span className="text-xs text-[#888]">
            {beats?.length || 0} beats
          </span>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4 inline mr-1" />
          {showForm ? "Cancel" : "Add Beat"}
        </Btn>
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        {["all", "available", "on-hold", "assigned", "sold", "used"].map(
          (f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${statusFilter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#1a1816] text-[#888] border border-[#2a2622] hover:text-[#f0ece4]"}`}
            >
              {f === "all"
                ? "All"
                : f.charAt(0).toUpperCase() + f.slice(1).replace("-", " ")}
            </button>
          )
        )}
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Beat Title"
              value={title}
              onChange={setTitle}
              placeholder="Beat name"
            />
            <InputField
              label="Producer"
              value={producer}
              onChange={setProducer}
              placeholder="Producer name"
            />
            <SelectField
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "available", label: "🟢 Available" },
                { value: "on-hold", label: "🟡 On Hold" },
                { value: "assigned", label: "🔵 Assigned" },
                { value: "sold", label: "🟡 Sold" },
                { value: "used", label: "🟣 Used" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <InputField
              label="Genre"
              value={genre}
              onChange={setGenre}
              placeholder="Trap"
            />
            <InputField
              label="BPM"
              value={bpm}
              onChange={setBpm}
              type="number"
              placeholder="140"
            />
            <InputField
              label="Key"
              value={key}
              onChange={setKey}
              placeholder="F# minor"
            />
            <InputField
              label="Mood"
              value={mood}
              onChange={setMood}
              placeholder="Dark, Melodic"
            />
            <InputField
              label="Price ($)"
              value={price}
              onChange={setPrice}
              type="number"
              placeholder="0"
            />
          </div>
          <div className="mb-4">
            <InputField
              label="Tags (comma separated)"
              value={tagsStr}
              onChange={setTagsStr}
              placeholder="808, dark, melodic, guitar"
            />
          </div>
          <Btn
            onClick={async () => {
              if (!title || !producer) return;
              await addBeat({
                title,
                producerName: producer,
                genre: genre || undefined,
                bpm: bpm ? Number(bpm) : undefined,
                key: key || undefined,
                mood: mood || undefined,
                tags: tagsStr
                  ? tagsStr.split(",").map((t) => t.trim())
                  : undefined,
                status,
                price: price ? Number(price) : undefined,
              });
              setTitle("");
              setProducer("");
              setGenre("");
              setBpm("");
              setKey("");
              setMood("");
              setTagsStr("");
              setPrice("");
              setShowForm(false);
            }}
          >
            <Save className="size-4 inline mr-1" /> Add Beat
          </Btn>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((beat) => (
          <Card key={beat._id} className="group relative">
            <button
              onClick={() => deleteBeat({ id: beat._id })}
              className="absolute top-3 right-3 text-red-400/0 group-hover:text-red-400/60 hover:!text-red-400 transition-all"
            >
              <Trash2 className="size-4" />
            </button>
            <div className="flex items-center gap-2 mb-2">
              <Disc3 className="size-4 text-[#D4A843]" />
              <h3 className="font-bold text-[#f0ece4] text-sm">
                {beat.title}
              </h3>
            </div>
            <p className="text-xs text-[#888] mb-3">
              Prod. {beat.producerName}
            </p>
            <div className="flex flex-wrap gap-2 text-[10px] text-[#888] mb-3">
              {beat.bpm && (
                <span className="bg-[#0a0a0a] px-2 py-0.5 rounded">
                  {beat.bpm} BPM
                </span>
              )}
              {beat.key && (
                <span className="bg-[#0a0a0a] px-2 py-0.5 rounded">
                  {beat.key}
                </span>
              )}
              {beat.genre && (
                <span className="bg-[#0a0a0a] px-2 py-0.5 rounded">
                  {beat.genre}
                </span>
              )}
              {beat.mood && (
                <span className="bg-[#0a0a0a] px-2 py-0.5 rounded">
                  {beat.mood}
                </span>
              )}
            </div>
            {beat.tags && beat.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mb-3">
                {beat.tags.map((t) => (
                  <span
                    key={t}
                    className="text-[9px] bg-purple-500/10 text-purple-400 px-2 py-0.5 rounded-full border border-purple-500/20"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            )}
            <div className="flex items-center justify-between">
              <StatusBadge status={beat.status} colorMap={statusColors} />
              {beat.price && (
                <span className="text-sm font-bold text-green-400">
                  ${beat.price}
                </span>
              )}
            </div>
          </Card>
        ))}
      </div>

      {filtered.length === 0 && (
        <Card>
          <p className="text-center text-[#666] py-8">
            No beats in the library yet.
          </p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  RELEASE MANAGER TAB
// ═══════════════════════════════════════════════════════════

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
    planning: "text-gray-400 bg-gray-500/10 border-gray-500/20",
    "pre-production":
      "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    production: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    "post-production":
      "text-purple-400 bg-purple-500/10 border-purple-500/20",
    submitted: "text-orange-400 bg-orange-500/10 border-orange-500/20",
    scheduled: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    released: "text-green-400 bg-green-500/10 border-green-500/20",
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Radio className="size-5 text-red-400" />
          <h2 className="text-lg font-bold text-[#f0ece4] tracking-wider">
            Release Manager
          </h2>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4 inline mr-1" />
          {showForm ? "Cancel" : "New Release"}
        </Btn>
      </div>

      {showForm && (
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <InputField
              label="Release Title"
              value={title}
              onChange={setTitle}
              placeholder="Title"
            />
            <InputField
              label="Artist"
              value={artistName}
              onChange={setArtistName}
              placeholder="Artist name"
            />
            <SelectField
              label="Type"
              value={type}
              onChange={setType}
              options={[
                { value: "single", label: "Single" },
                { value: "ep", label: "EP" },
                { value: "album", label: "Album" },
                { value: "mixtape", label: "Mixtape" },
              ]}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
            <InputField
              label="Release Date"
              value={releaseDate}
              onChange={setReleaseDate}
              type="date"
            />
            <SelectField
              label="Status"
              value={status}
              onChange={setStatus}
              options={[
                { value: "planning", label: "Planning" },
                { value: "pre-production", label: "Pre-Production" },
                { value: "production", label: "Production" },
                { value: "post-production", label: "Post-Production" },
                { value: "submitted", label: "Submitted" },
                { value: "scheduled", label: "Scheduled" },
                { value: "released", label: "Released" },
              ]}
            />
            <InputField
              label="Distributor"
              value={distributor}
              onChange={setDistributor}
              placeholder="DistroKid, TuneCore..."
            />
            <InputField
              label="ISRC"
              value={isrc}
              onChange={setIsrc}
              placeholder="US-XXX-XX-XXXXX"
            />
          </div>
          <Btn
            onClick={async () => {
              if (!title || !artistName) return;
              await addRelease({
                title,
                artistName,
                type,
                releaseDate: releaseDate || undefined,
                status,
                distributor: distributor || undefined,
                isrc: isrc || undefined,
                upc: upc || undefined,
              });
              setTitle("");
              setArtistName("");
              setReleaseDate("");
              setDistributor("");
              setIsrc("");
              setUpc("");
              setShowForm(false);
            }}
          >
            <Save className="size-4 inline mr-1" /> Create Release
          </Btn>
        </Card>
      )}

      <div className="space-y-3">
        {releases?.map((release) => {
          const checklist = [
            { label: "Mastered", done: release.mastered },
            { label: "Artwork", done: release.artworkStatus === "approved" || release.artworkStatus === "submitted" },
            { label: "Metadata", done: release.metadataComplete },
            { label: "Submitted", done: release.distributorSubmitted },
          ];
          return (
            <Card key={release._id} className="group">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-[#f0ece4] tracking-wider">
                      {release.title}
                    </h3>
                    <span className="text-xs text-[#888]">
                      by {release.artistName}
                    </span>
                    <span className="text-[10px] bg-[#2a2622] text-[#888] px-2 py-0.5 rounded-full uppercase">
                      {release.type}
                    </span>
                    <StatusBadge
                      status={release.status}
                      colorMap={statusColors}
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 text-xs text-[#888] mb-3">
                    {release.releaseDate && (
                      <span>
                        <Calendar className="size-3 inline mr-1" />
                        {release.releaseDate}
                      </span>
                    )}
                    {release.distributor && (
                      <span>📦 {release.distributor}</span>
                    )}
                    {release.isrc && <span>ISRC: {release.isrc}</span>}
                  </div>

                  {/* Release Checklist */}
                  <div className="flex gap-3">
                    {checklist.map((item) => (
                      <button
                        key={item.label}
                        onClick={() => {
                          const field =
                            item.label === "Mastered"
                              ? "mastered"
                              : item.label === "Metadata"
                                ? "metadataComplete"
                                : item.label === "Submitted"
                                  ? "distributorSubmitted"
                                  : null;
                          if (field) {
                            updateRelease({
                              id: release._id,
                              [field]: !item.done,
                            } as any);
                          }
                          if (item.label === "Artwork") {
                            updateRelease({
                              id: release._id,
                              artworkStatus: release.artworkStatus === "approved" ? "not-started" : "approved",
                            });
                          }
                        }}
                        className={`flex items-center gap-1 text-[10px] px-2 py-1 rounded border transition-all ${item.done ? "text-green-400 bg-green-500/10 border-green-500/20" : "text-[#666] bg-[#0a0a0a] border-[#2a2622] hover:text-[#888]"}`}
                      >
                        <CheckCircle className="size-3" />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
                <button
                  onClick={() => deleteRelease({ id: release._id })}
                  className="text-red-400/0 group-hover:text-red-400/60 hover:!text-red-400 transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </Card>
          );
        })}
      </div>

      {(!releases || releases.length === 0) && (
        <Card>
          <p className="text-center text-[#666] py-8">
            No releases planned yet.
          </p>
        </Card>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  SPLITS & CREDITS TAB
// ═══════════════════════════════════════════════════════════

export function SplitsCreditsTab() {
  const splits = useQuery(api.musicProduction.getSplits);
  const addSplit = useMutation(api.musicProduction.addSplit);
  const updateSplit = useMutation(api.musicProduction.updateSplit);
  const deleteSplit = useMutation(api.musicProduction.deleteSplit);
  const [showForm, setShowForm] = useState(false);

  const [trackTitle, setTrackTitle] = useState("");
  const [contributors, setContributors] = useState<
    {
      name: string;
      role: string;
      percentage: number;
      pro: string;
    }[]
  >([{ name: "", role: "songwriter", percentage: 100, pro: "" }]);

  const totalPct = contributors.reduce((s, c) => s + c.percentage, 0);

  const addContributor = () =>
    setContributors([
      ...contributors,
      { name: "", role: "songwriter", percentage: 0, pro: "" },
    ]);

  const removeContributor = (idx: number) =>
    setContributors(contributors.filter((_, i) => i !== idx));

  const updateContributor = (
    idx: number,
    field: string,
    value: string | number
  ) => {
    const updated = [...contributors];
    (updated[idx] as any)[field] = value;
    setContributors(updated);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <FileText className="size-5 text-cyan-400" />
          <h2 className="text-lg font-bold text-[#f0ece4] tracking-wider">
            Splits & Credits
          </h2>
        </div>
        <Btn onClick={() => setShowForm(!showForm)}>
          <Plus className="size-4 inline mr-1" />
          {showForm ? "Cancel" : "New Split Sheet"}
        </Btn>
      </div>

      {showForm && (
        <Card className="mb-6">
          <InputField
            label="Track Title"
            value={trackTitle}
            onChange={setTrackTitle}
            placeholder="Song name"
          />
          <div className="mt-4 mb-2">
            <div className="flex items-center justify-between">
              <label className="text-xs text-[#888] uppercase tracking-wider">
                Contributors
              </label>
              <span
                className={`text-xs font-bold ${totalPct === 100 ? "text-green-400" : "text-red-400"}`}
              >
                Total: {totalPct}%{" "}
                {totalPct === 100 ? "✓" : totalPct > 100 ? "⚠️ Over!" : ""}
              </span>
            </div>
          </div>
          {contributors.map((c, idx) => (
            <div
              key={idx}
              className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-3 items-end"
            >
              <InputField
                label={idx === 0 ? "Name" : ""}
                value={c.name}
                onChange={(v) => updateContributor(idx, "name", v)}
                placeholder="Name"
              />
              <SelectField
                label={idx === 0 ? "Role" : ""}
                value={c.role}
                onChange={(v) => updateContributor(idx, "role", v)}
                options={[
                  { value: "songwriter", label: "Songwriter" },
                  { value: "producer", label: "Producer" },
                  { value: "performer", label: "Performer" },
                  { value: "engineer", label: "Engineer" },
                  { value: "featured", label: "Featured" },
                ]}
              />
              <InputField
                label={idx === 0 ? "Split %" : ""}
                value={c.percentage}
                onChange={(v) =>
                  updateContributor(idx, "percentage", Number(v))
                }
                type="number"
                placeholder="50"
              />
              <SelectField
                label={idx === 0 ? "PRO" : ""}
                value={c.pro}
                onChange={(v) => updateContributor(idx, "pro", v)}
                options={[
                  { value: "", label: "—" },
                  { value: "ASCAP", label: "ASCAP" },
                  { value: "BMI", label: "BMI" },
                  { value: "SESAC", label: "SESAC" },
                ]}
              />
              <button
                onClick={() => removeContributor(idx)}
                className="text-red-400/60 hover:text-red-400 pb-2"
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
          <div className="flex gap-3 mt-4">
            <Btn variant="ghost" onClick={addContributor}>
              <Plus className="size-4 inline mr-1" /> Add Contributor
            </Btn>
            <Btn
              disabled={!trackTitle || totalPct !== 100}
              onClick={async () => {
                if (!trackTitle || totalPct !== 100) return;
                await addSplit({
                  trackTitle,
                  contributors: contributors.map((c) => ({
                    name: c.name,
                    role: c.role,
                    percentage: c.percentage,
                    pro: c.pro || undefined,
                  })),
                });
                setTrackTitle("");
                setContributors([
                  { name: "", role: "songwriter", percentage: 100, pro: "" },
                ]);
                setShowForm(false);
              }}
            >
              <Save className="size-4 inline mr-1" /> Save Split Sheet
            </Btn>
          </div>
        </Card>
      )}

      {/* Split Sheets List */}
      <div className="space-y-3">
        {splits?.map((split) => (
          <Card key={split._id} className="group">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-[#f0ece4] tracking-wider">
                  {split.trackTitle}
                </h3>
                <p className="text-[10px] text-[#888]">
                  {split.contributors.length} contributors
                </p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge
                  status={split.status || "draft"}
                  colorMap={{
                    draft:
                      "text-gray-400 bg-gray-500/10 border-gray-500/20",
                    pending:
                      "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
                    agreed:
                      "text-blue-400 bg-blue-500/10 border-blue-500/20",
                    signed:
                      "text-green-400 bg-green-500/10 border-green-500/20",
                  }}
                />
                <button
                  onClick={() => deleteSplit({ id: split._id })}
                  className="text-red-400/0 group-hover:text-red-400/60 hover:!text-red-400 transition-all"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>
            </div>

            {/* Contributors breakdown */}
            <div className="space-y-1">
              {split.contributors.map((c, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between py-1.5 px-3 bg-[#0a0a0a] rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-[#f0ece4]">{c.name}</span>
                    <span className="text-[10px] text-[#888] uppercase">
                      {c.role}
                    </span>
                    {c.pro && (
                      <span className="text-[9px] text-purple-400 bg-purple-500/10 px-1.5 py-0.5 rounded border border-purple-500/20">
                        {c.pro}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-[#2a2622] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#D4A843] rounded-full"
                        style={{ width: `${c.percentage}%` }}
                      />
                    </div>
                    <span className="text-sm font-bold text-[#D4A843] min-w-[3rem] text-right">
                      {c.percentage}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>

      {(!splits || splits.length === 0) && (
        <Card>
          <p className="text-center text-[#666] py-8">
            No split sheets created yet.
          </p>
        </Card>
      )}
    </div>
  );
}
