/**
 * Music Production Advanced — 17 New Feature Tab Components
 * Enterprise-grade UI with "Pro Tools meets Bloomberg Terminal" aesthetic
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Plus, Trash2, Music, Mic, Headphones, FileText, Tag, Zap,
  CheckCircle, XCircle, BarChart3, Play, Volume2, Star,
  DollarSign, Target, Award, TrendingUp, Edit, Save, X,
  Layers, Image, Palette, PenTool, Upload, Download,
  Globe, Radio, Video, Film, Users, Search, BookOpen,
  ArrowRight, ChevronDown, ChevronRight, Eye, ExternalLink,
  Shield, Clock, Hash, AlertTriangle, Send, Copy, Sliders,
  Activity, GitBranch, Disc3, Calendar,
} from "lucide-react";

// ─── Shared Components ──────────────────────────────────────
function SectionHeader({ title, count, onAdd, addLabel }: { title: string; count?: number; onAdd?: () => void; addLabel?: string }) {
  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">{title}</h3>
        {count !== undefined && <span className="text-[10px] px-2 py-0.5 bg-[#D4A843]/10 text-[#D4A843] rounded-full font-medium">{count} items</span>}
      </div>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1.5 text-xs font-medium text-[#0a0a0a] bg-[#D4A843] hover:bg-[#E8C767] px-3 py-1.5 rounded-lg transition-all">
          <Plus className="size-3.5" /> {addLabel || "Add New"}
        </button>
      )}
    </div>
  );
}

function StatusBadge({ status, colorMap }: { status: string; colorMap?: Record<string, string> }) {
  const defaultColors: Record<string, string> = {
    pending: "bg-yellow-500/15 text-yellow-400", "in-progress": "bg-blue-500/15 text-blue-400",
    completed: "bg-green-500/15 text-green-400", active: "bg-green-500/15 text-green-400",
    approved: "bg-green-500/15 text-green-400", denied: "bg-red-500/15 text-red-400",
    rejected: "bg-red-500/15 text-red-400", draft: "bg-gray-500/15 text-gray-400",
    live: "bg-green-500/15 text-green-400", passed: "bg-green-500/15 text-green-400",
    failed: "bg-red-500/15 text-red-400", new: "bg-blue-500/15 text-blue-400",
    negotiating: "bg-purple-500/15 text-purple-400", submitted: "bg-blue-500/15 text-blue-400",
    processing: "bg-orange-500/15 text-orange-400", generating: "bg-purple-500/15 text-purple-400 animate-pulse",
    saved: "bg-green-500/15 text-green-400", inquiry: "bg-yellow-500/15 text-yellow-400",
    "in-review": "bg-blue-500/15 text-blue-400", "under-review": "bg-blue-500/15 text-blue-400",
    reviewing: "bg-blue-500/15 text-blue-400", meeting: "bg-purple-500/15 text-purple-400",
    signed: "bg-green-500/15 text-green-400", "revision-needed": "bg-orange-500/15 text-orange-400",
    final: "bg-green-500/15 text-green-400", recorded: "bg-green-500/15 text-green-400",
    pitched: "bg-blue-500/15 text-blue-400", accepted: "bg-green-500/15 text-green-400",
    available: "bg-green-500/15 text-green-400", booked: "bg-purple-500/15 text-purple-400",
    expired: "bg-red-500/15 text-red-400", concept: "bg-gray-500/15 text-gray-400",
    "pre-production": "bg-yellow-500/15 text-yellow-400", filming: "bg-blue-500/15 text-blue-400",
    editing: "bg-purple-500/15 text-purple-400", review: "bg-orange-500/15 text-orange-400",
    published: "bg-green-500/15 text-green-400", upcoming: "bg-blue-500/15 text-blue-400",
    skipped: "bg-gray-500/15 text-gray-400", complete: "bg-green-500/15 text-green-400",
    analyzing: "bg-purple-500/15 text-purple-400 animate-pulse", applied: "bg-green-500/15 text-green-400",
    contacted: "bg-blue-500/15 text-blue-400", "in-session": "bg-purple-500/15 text-purple-400",
    takedown: "bg-red-500/15 text-red-400", drafted: "bg-gray-500/15 text-gray-400",
  };
  const colors = { ...defaultColors, ...colorMap };
  const c = colors[status] || "bg-gray-500/15 text-gray-400";
  return <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${c}`}>{status.replace(/-/g, " ")}</span>;
}

function EmptyState({ message, icon: Icon = Music }: { message: string; icon?: any }) {
  return (
    <div className="text-center py-16">
      <div className="w-16 h-16 rounded-2xl bg-[#1a1a1a] flex items-center justify-center mx-auto mb-4 border border-[#222]">
        <Icon className="size-7 text-[#333]" />
      </div>
      <p className="text-[#555] text-sm">{message}</p>
    </div>
  );
}

function CardGrid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">{children}</div>;
}

function MetricCard({ label, value, icon: Icon, color = "#D4A843" }: { label: string; value: string | number; icon: any; color?: string }) {
  return (
    <div className="bg-[#111] border border-[#222] rounded-xl p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4" style={{ color }} />
        <span className="text-[10px] text-[#555] uppercase tracking-wider">{label}</span>
      </div>
      <p className="font-display text-2xl text-[#f0ece4] tracking-wider">{value}</p>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  1. AUDIO FILE MANAGER
// ═══════════════════════════════════════════════════════════
export function AudioFileManagerTab() {
  const files = useQuery(api.musicAdvanced.listAudioFiles, {});
  const addFile = useMutation(api.musicAdvanced.addAudioFile);
  const deleteFile = useMutation(api.musicAdvanced.deleteAudioFile);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title: "", fileName: "", format: "mp3", category: "master", artist: "", project: "", bpm: "", key: "", duration: "", tags: "" });

  const categories = ["all", "master", "rough-mix", "stem", "beat", "sample", "vocal", "instrumental"];
  const formats = ["mp3", "wav", "flac", "aiff", "stem"];
  const filtered = files?.filter((f: any) => filter === "all" || f.category === filter) ?? [];

  const formatIcons: Record<string, string> = { mp3: "🎵", wav: "📀", flac: "💎", aiff: "🎹", stem: "🎛️" };

  return (
    <div className="space-y-6">
      <SectionHeader title="Audio File Manager" count={files?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Upload File" />

      {/* Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Files" value={files?.length ?? 0} icon={Music} />
        <MetricCard label="Masters" value={files?.filter((f: any) => f.category === "master").length ?? 0} icon={Disc3} color="#22c55e" />
        <MetricCard label="Stems" value={files?.filter((f: any) => f.category === "stem").length ?? 0} icon={Layers} color="#a855f7" />
        <MetricCard label="Beats" value={files?.filter((f: any) => f.category === "beat").length ?? 0} icon={Headphones} color="#3b82f6" />
      </div>

      {/* Filter bar */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button key={cat} onClick={() => setFilter(cat)} className={`px-3 py-1.5 text-[10px] font-medium rounded-lg transition-all whitespace-nowrap ${filter === cat ? "bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/30" : "bg-[#111] text-[#888] border border-[#222] hover:border-[#333]"}`}>
            {cat === "all" ? "All Files" : cat.replace(/-/g, " ")}
          </button>
        ))}
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Track Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4] col-span-2" />
            <input placeholder="File Name *" value={form.fileName} onChange={(e) => setForm({ ...form, fileName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4] col-span-2" />
            <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {formats.map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
            </select>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {categories.filter((c) => c !== "all").map((c) => <option key={c} value={c}>{c.replace(/-/g, " ")}</option>)}
            </select>
            <input placeholder="Artist" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="BPM" type="number" value={form.bpm} onChange={(e) => setForm({ ...form, bpm: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Key (e.g. Am)" value={form.key} onChange={(e) => setForm({ ...form, key: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Duration (e.g. 3:45)" value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Tags (comma-separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4] col-span-2 md:col-span-3" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.title && form.fileName) { addFile({ ...form, bpm: form.bpm ? Number(form.bpm) : undefined, key: form.key || undefined, artist: form.artist || undefined, project: form.project || undefined, duration: form.duration || undefined, tags: form.tags || undefined }); setForm({ title: "", fileName: "", format: "mp3", category: "master", artist: "", project: "", bpm: "", key: "", duration: "", tags: "" }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium hover:bg-[#E8C767]">Add File</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333] hover:bg-[#1a1a1a]">Cancel</button>
          </div>
        </div>
      )}

      {/* File list */}
      <div className="space-y-2">
        {filtered.length > 0 ? filtered.map((f: any) => (
          <div key={f._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-[#1a1a1a] flex items-center justify-center text-xl shrink-0">{formatIcons[f.format] || "🎵"}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-[#f0ece4] truncate">{f.title}</p>
                  <span className="text-[9px] px-1.5 py-0.5 bg-[#D4A843]/10 text-[#D4A843] rounded font-mono">{f.format.toUpperCase()}</span>
                  <StatusBadge status={f.category} />
                </div>
                <div className="flex items-center gap-3 mt-1 text-[10px] text-[#666]">
                  <span>{f.fileName}</span>
                  {f.artist && <span>• {f.artist}</span>}
                  {f.project && <span>• {f.project}</span>}
                  {f.bpm && <span>• {f.bpm} BPM</span>}
                  {f.key && <span>• {f.key}</span>}
                  {f.duration && <span>• {f.duration}</span>}
                </div>
                {f.tags && <div className="flex gap-1 mt-1.5">{f.tags.split(",").map((t: string, i: number) => <span key={i} className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#888] rounded">{t.trim()}</span>)}</div>}
              </div>
              <button onClick={() => deleteFile({ id: f._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100 transition-all"><Trash2 className="size-4" /></button>
            </div>
          </div>
        )) : <EmptyState message="No audio files yet. Upload your first track!" icon={Music} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  2. AI ARTWORK GENERATOR
// ═══════════════════════════════════════════════════════════
export function AiArtworkTab() {
  const artwork = useQuery(api.musicAdvanced.listAiArtwork, {});
  const addArt = useMutation(api.musicAdvanced.addAiArtwork);
  const updateArt = useMutation(api.musicAdvanced.updateAiArtwork);
  const deleteArt = useMutation(api.musicAdvanced.deleteAiArtwork);
  const [showGen, setShowGen] = useState(false);
  const [form, setForm] = useState({ title: "", prompt: "", style: "graffiti", artworkType: "album-cover", artist: "", project: "" });

  const styles = ["graffiti", "minimalist", "cinematic", "retro", "abstract", "photorealistic", "comic", "neon"];
  const types = ["album-cover", "single-cover", "social-post", "banner", "poster"];
  const styleEmojis: Record<string, string> = { graffiti: "🎨", minimalist: "◻️", cinematic: "🎬", retro: "📼", abstract: "🌀", photorealistic: "📷", comic: "💥", neon: "💡" };

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Artwork Generator" count={artwork?.length} onAdd={() => setShowGen(!showGen)} addLabel="Generate Art" />

      {/* Generator form */}
      {showGen && (
        <div className="bg-gradient-to-br from-purple-500/5 to-[#D4A843]/5 border border-purple-500/20 rounded-xl p-5 space-y-4">
          <div className="flex items-center gap-2 mb-1">
            <Palette className="size-5 text-purple-400" />
            <h4 className="text-sm font-medium text-[#f0ece4]">Create New Artwork</h4>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <textarea placeholder="Describe the artwork you want... (e.g., 'Dark alley in Fort Worth with neon signs, graffiti walls, artist silhouette under streetlight')" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <div>
            <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Style</p>
            <div className="flex gap-2 flex-wrap">
              {styles.map((s) => (
                <button key={s} onClick={() => setForm({ ...form, style: s })} className={`flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-medium rounded-lg transition-all ${form.style === s ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" : "bg-[#111] text-[#888] border border-[#222] hover:border-[#333]"}`}>
                  {styleEmojis[s]} {s}
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Type</p>
            <div className="flex gap-2 flex-wrap">
              {types.map((t) => (
                <button key={t} onClick={() => setForm({ ...form, artworkType: t })} className={`px-3 py-1.5 text-[10px] font-medium rounded-lg transition-all ${form.artworkType === t ? "bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/30" : "bg-[#111] text-[#888] border border-[#222] hover:border-[#333]"}`}>
                  {t.replace(/-/g, " ")}
                </button>
              ))}
            </div>
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.title && form.prompt) { addArt({ ...form, artist: form.artist || undefined, project: form.project || undefined }); setForm({ title: "", prompt: "", style: "graffiti", artworkType: "album-cover", artist: "", project: "" }); setShowGen(false); } }} className="flex items-center gap-1.5 text-xs bg-purple-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-purple-400">
              <Zap className="size-3.5" /> Generate
            </button>
            <button onClick={() => setShowGen(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}

      {/* Gallery */}
      <CardGrid>
        {artwork && artwork.length > 0 ? artwork.map((a: any) => (
          <div key={a._id} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#333] transition-all group">
            <div className="h-48 bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center">
              {a.imageUrl ? <img src={a.imageUrl} alt={a.title} className="w-full h-full object-cover" /> : (
                <div className="text-center">
                  <div className="text-4xl mb-2">{styleEmojis[a.style] || "🎨"}</div>
                  <StatusBadge status={a.status} />
                </div>
              )}
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-[#f0ece4] truncate">{a.title}</p>
                <button onClick={() => updateArt({ id: a._id, isFavorite: !a.isFavorite })} className={a.isFavorite ? "text-yellow-400" : "text-[#444] hover:text-yellow-400"}><Star className="size-4" fill={a.isFavorite ? "currentColor" : "none"} /></button>
              </div>
              <p className="text-[10px] text-[#666] mt-1 line-clamp-2">{a.prompt}</p>
              <div className="flex items-center gap-2 mt-2">
                <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded">{a.style}</span>
                <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#888] rounded">{a.artworkType?.replace(/-/g, " ")}</span>
                {a.artist && <span className="text-[9px] text-[#555]">• {a.artist}</span>}
              </div>
              <div className="flex items-center gap-1 mt-3 opacity-0 group-hover:opacity-100 transition-all">
                <button onClick={() => deleteArt({ id: a._id })} className="text-[10px] text-[#555] hover:text-red-400 px-2 py-1 border border-[#222] rounded hover:border-red-500/20"><Trash2 className="size-3 inline mr-1" />Delete</button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No artwork yet. Generate your first piece!" icon={Palette} />}
      </CardGrid>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  3. LYRICS & SONGWRITING PAD
// ═══════════════════════════════════════════════════════════
export function LyricsPadTab() {
  const lyrics = useQuery(api.musicAdvanced.listLyrics, {});
  const addLyrics = useMutation(api.musicAdvanced.addLyrics);
  const updateLyrics = useMutation(api.musicAdvanced.updateLyrics);
  const deleteLyrics = useMutation(api.musicAdvanced.deleteLyrics);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: "", content: "", status: "draft", artist: "", project: "", mood: "", beat: "", collaborators: "" });

  const moods = ["hype", "chill", "emotional", "dark", "uplifting", "aggressive", "melodic"];
  const statuses = ["draft", "in-progress", "final", "recorded"];
  const moodEmojis: Record<string, string> = { hype: "🔥", chill: "🌊", emotional: "💔", dark: "🌑", uplifting: "☀️", aggressive: "⚡", melodic: "🎶" };

  return (
    <div className="space-y-6">
      <SectionHeader title="Lyrics & Songwriting Pad" count={lyrics?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="New Lyrics" />

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Songs" value={lyrics?.length ?? 0} icon={PenTool} />
        <MetricCard label="Drafts" value={lyrics?.filter((l: any) => l.status === "draft").length ?? 0} icon={Edit} color="#f97316" />
        <MetricCard label="Finalized" value={lyrics?.filter((l: any) => l.status === "final").length ?? 0} icon={CheckCircle} color="#22c55e" />
        <MetricCard label="Recorded" value={lyrics?.filter((l: any) => l.status === "recorded").length ?? 0} icon={Mic} color="#a855f7" />
      </div>

      {/* Add form */}
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-5 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Song Title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4] col-span-2" />
            <input placeholder="Artist" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Project / Album" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Beat / Instrumental" value={form.beat} onChange={(e) => setForm({ ...form, beat: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Collaborators" value={form.collaborators} onChange={(e) => setForm({ ...form, collaborators: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            <select value={form.mood} onChange={(e) => setForm({ ...form, mood: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              <option value="">Mood...</option>
              {moods.map((m) => <option key={m} value={m}>{moodEmojis[m]} {m}</option>)}
            </select>
          </div>
          <textarea placeholder="Write your lyrics here..." value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={10} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-sm text-[#f0ece4] font-mono leading-relaxed" />
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#555]">{form.content.split(/\s+/).filter(Boolean).length} words</span>
            <div className="flex gap-2">
              <button onClick={() => { if (form.title && form.content) { addLyrics({ ...form, artist: form.artist || undefined, project: form.project || undefined, beat: form.beat || undefined, mood: form.mood || undefined, collaborators: form.collaborators || undefined }); setForm({ title: "", content: "", status: "draft", artist: "", project: "", mood: "", beat: "", collaborators: "" }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium hover:bg-[#E8C767]">Save Lyrics</button>
              <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Lyrics cards */}
      <div className="space-y-3">
        {lyrics && lyrics.length > 0 ? lyrics.map((l: any) => (
          <div key={l._id} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#333] transition-all">
            <div className="px-5 py-4 cursor-pointer" onClick={() => setEditId(editId === l._id ? null : l._id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="text-xl">{l.mood ? (moodEmojis[l.mood] || "🎵") : "🎵"}</div>
                  <div>
                    <p className="text-sm font-medium text-[#f0ece4]">{l.title}</p>
                    <div className="flex items-center gap-2 mt-0.5">
                      {l.artist && <span className="text-[10px] text-[#666]">{l.artist}</span>}
                      {l.project && <span className="text-[10px] text-[#555]">• {l.project}</span>}
                      <span className="text-[10px] text-[#444]">• {l.wordCount || 0} words</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={l.status} />
                  {l.mood && <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#888] rounded">{l.mood}</span>}
                  <ChevronDown className={`size-4 text-[#555] transition-transform ${editId === l._id ? "rotate-180" : ""}`} />
                </div>
              </div>
            </div>
            {editId === l._id && (
              <div className="px-5 pb-4 border-t border-[#222]">
                <pre className="text-sm text-[#ccc] font-mono whitespace-pre-wrap leading-relaxed mt-3 p-4 bg-[#0a0a0a] rounded-lg max-h-80 overflow-y-auto">{l.content}</pre>
                <div className="flex items-center gap-2 mt-3">
                  <button onClick={() => deleteLyrics({ id: l._id })} className="text-[10px] text-[#555] hover:text-red-400 px-2 py-1 border border-[#222] rounded"><Trash2 className="size-3 inline mr-1" />Delete</button>
                </div>
              </div>
            )}
          </div>
        )) : <EmptyState message="No lyrics yet. Start writing!" icon={PenTool} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  4. SAMPLE CLEARANCE TRACKER
// ═══════════════════════════════════════════════════════════
export function SampleClearanceTab() {
  const samples = useQuery(api.musicAdvanced.listSampleClearances, {});
  const addSample = useMutation(api.musicAdvanced.addSampleClearance);
  const deleteSample = useMutation(api.musicAdvanced.deleteSampleClearance);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ sampleTitle: "", originalArtist: "", originalSong: "", usedIn: "", sampleType: "direct-sample", status: "pending", licenseFee: "", publisherLabel: "" });

  const types = ["interpolation", "direct-sample", "replay", "loop"];

  return (
    <div className="space-y-6">
      <SectionHeader title="Sample Clearance Tracker" count={samples?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Add Sample" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Samples" value={samples?.length ?? 0} icon={Music} />
        <MetricCard label="Pending" value={samples?.filter((s: any) => s.status === "pending").length ?? 0} icon={Clock} color="#f97316" />
        <MetricCard label="Approved" value={samples?.filter((s: any) => s.status === "approved").length ?? 0} icon={CheckCircle} color="#22c55e" />
        <MetricCard label="Total Fees" value={`$${(samples?.reduce((sum: number, s: any) => sum + (s.licenseFee || 0), 0) ?? 0).toLocaleString()}`} icon={DollarSign} color="#D4A843" />
      </div>

      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Sample Title *" value={form.sampleTitle} onChange={(e) => setForm({ ...form, sampleTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Original Artist *" value={form.originalArtist} onChange={(e) => setForm({ ...form, originalArtist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Original Song *" value={form.originalSong} onChange={(e) => setForm({ ...form, originalSong: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Used in (your track) *" value={form.usedIn} onChange={(e) => setForm({ ...form, usedIn: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.sampleType} onChange={(e) => setForm({ ...form, sampleType: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {types.map((t) => <option key={t} value={t}>{t.replace(/-/g, " ")}</option>)}
            </select>
            <input placeholder="Publisher / Label" value={form.publisherLabel} onChange={(e) => setForm({ ...form, publisherLabel: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="License Fee $" type="number" value={form.licenseFee} onChange={(e) => setForm({ ...form, licenseFee: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.sampleTitle && form.originalArtist && form.originalSong && form.usedIn) { addSample({ ...form, licenseFee: form.licenseFee ? Number(form.licenseFee) : undefined, publisherLabel: form.publisherLabel || undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Add Sample</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {samples && samples.length > 0 ? samples.map((s: any) => (
          <div key={s._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center"><AlertTriangle className="size-4 text-orange-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">"{s.sampleTitle}" → {s.usedIn}</p>
                  <p className="text-[10px] text-[#666] mt-0.5">Original: {s.originalArtist} — "{s.originalSong}" {s.publisherLabel && `(${s.publisherLabel})`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {s.licenseFee && <span className="text-xs font-medium text-[#D4A843]">${s.licenseFee.toLocaleString()}</span>}
                <StatusBadge status={s.status} />
                <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#888] rounded">{s.sampleType?.replace(/-/g, " ")}</span>
                <button onClick={() => deleteSample({ id: s._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No samples tracked. Add samples to manage clearances." icon={Shield} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  5. STEMS & MASTERS VAULT
// ═══════════════════════════════════════════════════════════
export function StemsVaultTab() {
  const stems = useQuery(api.musicAdvanced.listStemsVault, {});
  const addStem = useMutation(api.musicAdvanced.addStemEntry);
  const deleteStem = useMutation(api.musicAdvanced.deleteStemEntry);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ projectName: "", trackTitle: "", versionLabel: "v1-rough", versionNumber: "1", stemType: "full-mix", format: "wav", artist: "", bitDepth: "24", sampleRate: "48000" });

  const stemTypes = ["full-mix", "vocals", "drums", "bass", "keys", "fx", "master"];

  return (
    <div className="space-y-6">
      <SectionHeader title="Stems & Masters Vault" count={stems?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Add Entry" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Files" value={stems?.length ?? 0} icon={Layers} />
        <MetricCard label="Projects" value={new Set(stems?.map((s: any) => s.projectName)).size} icon={Music} color="#a855f7" />
        <MetricCard label="Masters" value={stems?.filter((s: any) => s.stemType === "master").length ?? 0} icon={Disc3} color="#22c55e" />
        <MetricCard label="Latest" value={stems?.filter((s: any) => s.isLatest).length ?? 0} icon={Star} color="#D4A843" />
      </div>

      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Project Name *" value={form.projectName} onChange={(e) => setForm({ ...form, projectName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Track Title *" value={form.trackTitle} onChange={(e) => setForm({ ...form, trackTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Version Label" value={form.versionLabel} onChange={(e) => setForm({ ...form, versionLabel: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Version #" type="number" value={form.versionNumber} onChange={(e) => setForm({ ...form, versionNumber: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.stemType} onChange={(e) => setForm({ ...form, stemType: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {stemTypes.map((t) => <option key={t} value={t}>{t.replace(/-/g, " ")}</option>)}
            </select>
            <select value={form.format} onChange={(e) => setForm({ ...form, format: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {["wav", "flac", "mp3"].map((f) => <option key={f} value={f}>{f.toUpperCase()}</option>)}
            </select>
            <input placeholder="Artist" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Bit Depth" value={form.bitDepth} onChange={(e) => setForm({ ...form, bitDepth: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.projectName && form.trackTitle) { addStem({ ...form, versionNumber: Number(form.versionNumber), artist: form.artist || undefined, bitDepth: form.bitDepth || undefined, sampleRate: form.sampleRate || undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Add Entry</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {stems && stems.length > 0 ? stems.map((s: any) => (
          <div key={s._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Layers className="size-4 text-purple-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">{s.trackTitle} <span className="text-[#D4A843] text-xs">({s.versionLabel})</span></p>
                  <p className="text-[10px] text-[#666] mt-0.5">{s.projectName} {s.artist && `• ${s.artist}`} • {s.format.toUpperCase()} {s.bitDepth && `• ${s.bitDepth}bit`} {s.sampleRate && `• ${Number(s.sampleRate) / 1000}kHz`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#888] rounded">{s.stemType?.replace(/-/g, " ")}</span>
                {s.isLatest && <span className="text-[9px] px-1.5 py-0.5 bg-green-500/10 text-green-400 rounded">Latest</span>}
                <button onClick={() => deleteStem({ id: s._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No stems tracked. Start organizing your audio files!" icon={Layers} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  6. MASTERING & QC CHECKLIST
// ═══════════════════════════════════════════════════════════
export function MasteringQCTab() {
  const checks = useQuery(api.musicAdvanced.listMasteringQC, {});
  const addCheck = useMutation(api.musicAdvanced.addMasteringQC);
  const updateCheck = useMutation(api.musicAdvanced.updateMasteringQC);
  const deleteCheck = useMutation(api.musicAdvanced.deleteMasteringQC);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ trackTitle: "", artist: "", project: "", engineer: "", lufs: "", truePeak: "", referenceTrack: "" });

  return (
    <div className="space-y-6">
      <SectionHeader title="Mastering & QC Checklist" count={checks?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="New QC Check" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Checks" value={checks?.length ?? 0} icon={CheckCircle} />
        <MetricCard label="Passed" value={checks?.filter((c: any) => c.status === "passed").length ?? 0} icon={CheckCircle} color="#22c55e" />
        <MetricCard label="Failed" value={checks?.filter((c: any) => c.status === "failed").length ?? 0} icon={XCircle} color="#ef4444" />
        <MetricCard label="In Review" value={checks?.filter((c: any) => c.status === "in-review").length ?? 0} icon={Clock} color="#3b82f6" />
      </div>

      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Track Title *" value={form.trackTitle} onChange={(e) => setForm({ ...form, trackTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Engineer" value={form.engineer} onChange={(e) => setForm({ ...form, engineer: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="LUFS (e.g. -14)" type="number" value={form.lufs} onChange={(e) => setForm({ ...form, lufs: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="True Peak (e.g. -1)" type="number" value={form.truePeak} onChange={(e) => setForm({ ...form, truePeak: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Reference Track" value={form.referenceTrack} onChange={(e) => setForm({ ...form, referenceTrack: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4] col-span-2" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.trackTitle) { addCheck({ trackTitle: form.trackTitle, status: "pending", artist: form.artist || undefined, project: form.project || undefined, engineer: form.engineer || undefined, lufsIntegrated: form.lufs ? Number(form.lufs) : undefined, truePeak: form.truePeak ? Number(form.truePeak) : undefined, referenceTrack: form.referenceTrack || undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Create QC Check</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {checks && checks.length > 0 ? checks.map((c: any) => (
          <div key={c._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.status === "passed" ? "bg-green-500/10" : c.status === "failed" ? "bg-red-500/10" : "bg-blue-500/10"}`}>
                  {c.status === "passed" ? <CheckCircle className="size-4 text-green-400" /> : c.status === "failed" ? <XCircle className="size-4 text-red-400" /> : <Sliders className="size-4 text-blue-400" />}
                </div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">{c.trackTitle}</p>
                  <p className="text-[10px] text-[#666]">{c.artist && `${c.artist} • `}{c.project || ""} {c.engineer && `• Eng: ${c.engineer}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={c.status} />
                <button onClick={() => deleteCheck({ id: c._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            {/* QC Checklist items */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
              {[
                { label: "Format", checked: c.formatCheck, key: "formatCheck" },
                { label: "Metadata", checked: c.metadataCheck, key: "metadataCheck" },
                { label: "No Clipping", checked: c.clippingCheck, key: "clippingCheck" },
                { label: "Phase OK", checked: c.phaseCheck, key: "phaseCheck" },
              ].map((item) => (
                <button key={item.key} onClick={() => updateCheck({ id: c._id, [item.key]: !item.checked })} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-[10px] font-medium transition-all ${item.checked ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-[#0a0a0a] text-[#555] border border-[#222] hover:border-[#333]"}`}>
                  {item.checked ? <CheckCircle className="size-3.5" /> : <div className="w-3.5 h-3.5 rounded-full border border-[#444]" />}
                  {item.label}
                </button>
              ))}
            </div>
            {c.lufsIntegrated && (
              <div className="flex items-center gap-4 mt-2 text-[10px] text-[#666]">
                <span>LUFS: <span className="text-[#D4A843]">{c.lufsIntegrated} dB</span></span>
                {c.truePeak && <span>True Peak: <span className="text-[#D4A843]">{c.truePeak} dB</span></span>}
                {c.referenceTrack && <span>Ref: {c.referenceTrack}</span>}
              </div>
            )}
          </div>
        )) : <EmptyState message="No QC checks yet. Start mastering!" icon={Sliders} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  7. DISTRIBUTION HUB
// ═══════════════════════════════════════════════════════════
export function DistributionHubTab() {
  const dists = useQuery(api.musicAdvanced.listDistributions, {});
  const addDist = useMutation(api.musicAdvanced.addDistribution);
  const deleteDist = useMutation(api.musicAdvanced.deleteDistribution);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ releaseTitle: "", artist: "", distributor: "DistroKid", platforms: "Spotify,Apple Music,Tidal,Amazon,YouTube Music", status: "draft", releaseDate: "", upc: "", isrc: "" });

  const distributors = ["DistroKid", "TuneCore", "CD Baby", "AWAL", "UnitedMasters", "Amuse", "Ditto"];
  const platformEmojis: Record<string, string> = { Spotify: "🟢", "Apple Music": "🍎", Tidal: "🌊", Amazon: "📦", "YouTube Music": "▶️", Deezer: "🎧" };

  return (
    <div className="space-y-6">
      <SectionHeader title="Distribution Hub" count={dists?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="New Release" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Releases" value={dists?.length ?? 0} icon={Globe} />
        <MetricCard label="Live" value={dists?.filter((d: any) => d.status === "live").length ?? 0} icon={Radio} color="#22c55e" />
        <MetricCard label="Processing" value={dists?.filter((d: any) => d.status === "processing").length ?? 0} icon={Clock} color="#f97316" />
        <MetricCard label="Draft" value={dists?.filter((d: any) => d.status === "draft").length ?? 0} icon={Edit} color="#6b7280" />
      </div>

      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Release Title *" value={form.releaseTitle} onChange={(e) => setForm({ ...form, releaseTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist *" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.distributor} onChange={(e) => setForm({ ...form, distributor: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {distributors.map((d) => <option key={d} value={d}>{d}</option>)}
            </select>
            <input placeholder="Release Date" type="date" value={form.releaseDate} onChange={(e) => setForm({ ...form, releaseDate: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="UPC" value={form.upc} onChange={(e) => setForm({ ...form, upc: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="ISRC" value={form.isrc} onChange={(e) => setForm({ ...form, isrc: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.releaseTitle && form.artist) { addDist({ ...form, releaseDate: form.releaseDate || undefined, upc: form.upc || undefined, isrc: form.isrc || undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Submit Release</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {dists && dists.length > 0 ? dists.map((d: any) => (
          <div key={d._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Globe className="size-4 text-blue-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">{d.releaseTitle} <span className="text-xs text-[#666]">by {d.artist}</span></p>
                  <div className="flex items-center gap-2 mt-0.5 text-[10px] text-[#666]">
                    <span>via {d.distributor}</span>
                    {d.releaseDate && <span>• {d.releaseDate}</span>}
                    {d.upc && <span>• UPC: {d.upc}</span>}
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  {d.platforms?.split(",").map((p: string) => <span key={p} className="text-xs" title={p.trim()}>{platformEmojis[p.trim()] || "🎵"}</span>)}
                </div>
                <StatusBadge status={d.status} />
                <button onClick={() => deleteDist({ id: d._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No distributions yet. Submit your first release!" icon={Globe} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  8. ROYALTY CALCULATOR
// ═══════════════════════════════════════════════════════════
export function RoyaltyCalculatorTab() {
  const royalties = useQuery(api.musicAdvanced.listRoyalties, {});
  const addRoyalty = useMutation(api.musicAdvanced.addRoyaltyEntry);
  const deleteRoyalty = useMutation(api.musicAdvanced.deleteRoyaltyEntry);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ trackTitle: "", artist: "", platform: "Spotify", streams: "", ratePerStream: "0.004", splitPercent: "100", period: "2026-Q2", advance: "" });

  const totalGross = royalties?.reduce((s: number, r: any) => s + r.grossRevenue, 0) ?? 0;
  const totalNet = royalties?.reduce((s: number, r: any) => s + r.netRevenue, 0) ?? 0;
  const totalStreams = royalties?.reduce((s: number, r: any) => s + r.streams, 0) ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader title="Royalty Calculator" count={royalties?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Add Entry" />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Streams" value={totalStreams.toLocaleString()} icon={Play} />
        <MetricCard label="Gross Revenue" value={`$${totalGross.toFixed(2)}`} icon={DollarSign} color="#22c55e" />
        <MetricCard label="Net Revenue" value={`$${totalNet.toFixed(2)}`} icon={TrendingUp} color="#D4A843" />
        <MetricCard label="Entries" value={royalties?.length ?? 0} icon={BarChart3} color="#3b82f6" />
      </div>

      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <input placeholder="Track Title *" value={form.trackTitle} onChange={(e) => setForm({ ...form, trackTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist *" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">
              {["Spotify", "Apple Music", "Tidal", "YouTube", "Amazon"].map((p) => <option key={p}>{p}</option>)}
            </select>
            <input placeholder="Streams" type="number" value={form.streams} onChange={(e) => setForm({ ...form, streams: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Rate/stream" type="number" step="0.001" value={form.ratePerStream} onChange={(e) => setForm({ ...form, ratePerStream: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Split %" type="number" value={form.splitPercent} onChange={(e) => setForm({ ...form, splitPercent: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Period (e.g. 2026-Q2)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Advance Balance $" type="number" value={form.advance} onChange={(e) => setForm({ ...form, advance: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.trackTitle && form.artist && form.streams) { addRoyalty({ trackTitle: form.trackTitle, artist: form.artist, platform: form.platform, streams: Number(form.streams), ratePerStream: Number(form.ratePerStream), splitPercent: Number(form.splitPercent), period: form.period, advanceBalance: form.advance ? Number(form.advance) : undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Calculate & Add</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {royalties && royalties.length > 0 ? royalties.map((r: any) => (
          <div key={r._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><DollarSign className="size-4 text-green-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">{r.trackTitle} <span className="text-xs text-[#666]">• {r.artist}</span></p>
                  <div className="flex items-center gap-3 mt-0.5 text-[10px] text-[#666]">
                    <span>{r.platform}</span>
                    <span>{r.streams.toLocaleString()} streams</span>
                    <span>${r.ratePerStream}/stream</span>
                    <span>{r.splitPercent}% split</span>
                    <span>{r.period}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="text-right">
                  <p className="text-sm font-medium text-[#D4A843]">${r.netRevenue.toFixed(2)}</p>
                  <p className="text-[9px] text-[#555]">gross: ${r.grossRevenue.toFixed(2)}</p>
                </div>
                {r.recouped !== undefined && (
                  <span className={`text-[9px] px-1.5 py-0.5 rounded ${r.recouped ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>{r.recouped ? "Recouped" : "Not Recouped"}</span>
                )}
                <button onClick={() => deleteRoyalty({ id: r._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No royalty entries yet. Start tracking your revenue!" icon={DollarSign} />}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  9–17: Remaining tabs (Sync, Playlists, Videos, Rollout, EPK, Producers, A&R, AI Lyrics, AI Mastering)
// ═══════════════════════════════════════════════════════════

export function SyncLicensingTab() {
  const licenses = useQuery(api.musicAdvanced.listSyncLicenses, {});
  const addLicense = useMutation(api.musicAdvanced.addSyncLicense);
  const deleteLicense = useMutation(api.musicAdvanced.deleteSyncLicense);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ trackTitle: "", artist: "", licensee: "", mediaType: "tv", usageType: "background", status: "inquiry", showTitle: "", fee: "" });
  const mediaTypes = ["tv", "film", "commercial", "video-game", "podcast", "trailer"];
  const totalFees = licenses?.reduce((s: number, l: any) => s + (l.fee || 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader title="Sync Licensing Manager" count={licenses?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Add License" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Deals" value={licenses?.length ?? 0} icon={Film} />
        <MetricCard label="Active" value={licenses?.filter((l: any) => l.status === "active").length ?? 0} icon={CheckCircle} color="#22c55e" />
        <MetricCard label="Revenue" value={`$${totalFees.toLocaleString()}`} icon={DollarSign} color="#D4A843" />
        <MetricCard label="Inquiries" value={licenses?.filter((l: any) => l.status === "inquiry").length ?? 0} icon={Send} color="#3b82f6" />
      </div>
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Track *" value={form.trackTitle} onChange={(e) => setForm({ ...form, trackTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist *" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Licensee *" value={form.licensee} onChange={(e) => setForm({ ...form, licensee: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.mediaType} onChange={(e) => setForm({ ...form, mediaType: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">{mediaTypes.map((t) => <option key={t} value={t}>{t}</option>)}</select>
            <input placeholder="Show/Film Title" value={form.showTitle} onChange={(e) => setForm({ ...form, showTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Fee $" type="number" value={form.fee} onChange={(e) => setForm({ ...form, fee: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.trackTitle && form.artist && form.licensee) { addLicense({ ...form, showTitle: form.showTitle || undefined, fee: form.fee ? Number(form.fee) : undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Add License</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {licenses && licenses.length > 0 ? licenses.map((l: any) => (
          <div key={l._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center"><Film className="size-4 text-yellow-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">"{l.trackTitle}" → {l.licensee} {l.showTitle && `(${l.showTitle})`}</p>
                  <p className="text-[10px] text-[#666]">{l.artist} • {l.mediaType} • {l.usageType} {l.territory && `• ${l.territory}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {l.fee && <span className="text-sm font-medium text-[#D4A843]">${l.fee.toLocaleString()}</span>}
                <StatusBadge status={l.status} />
                <button onClick={() => deleteLicense({ id: l._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No sync licenses yet." icon={Film} />}
      </div>
    </div>
  );
}

export function PlaylistPitchTab() {
  const pitches = useQuery(api.musicAdvanced.listPlaylistPitches, {});
  const addPitch = useMutation(api.musicAdvanced.addPlaylistPitch);
  const deletePitch = useMutation(api.musicAdvanced.deletePlaylistPitch);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ trackTitle: "", artist: "", playlistName: "", platform: "Spotify", status: "drafted", curatorName: "", playlistFollowers: "" });

  return (
    <div className="space-y-6">
      <SectionHeader title="Playlist Pitch Tracker" count={pitches?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="New Pitch" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Pitches" value={pitches?.length ?? 0} icon={Radio} />
        <MetricCard label="Accepted" value={pitches?.filter((p: any) => p.status === "accepted").length ?? 0} icon={CheckCircle} color="#22c55e" />
        <MetricCard label="Under Review" value={pitches?.filter((p: any) => p.status === "under-review" || p.status === "pitched").length ?? 0} icon={Clock} color="#3b82f6" />
        <MetricCard label="Success Rate" value={pitches?.length ? `${Math.round((pitches.filter((p: any) => p.status === "accepted").length / pitches.length) * 100)}%` : "0%"} icon={Target} color="#D4A843" />
      </div>
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Track *" value={form.trackTitle} onChange={(e) => setForm({ ...form, trackTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist *" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Playlist Name *" value={form.playlistName} onChange={(e) => setForm({ ...form, playlistName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">{["Spotify", "Apple Music", "Tidal", "YouTube Music", "Deezer"].map((p) => <option key={p}>{p}</option>)}</select>
            <input placeholder="Curator Name" value={form.curatorName} onChange={(e) => setForm({ ...form, curatorName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Playlist Followers" type="number" value={form.playlistFollowers} onChange={(e) => setForm({ ...form, playlistFollowers: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.trackTitle && form.artist && form.playlistName) { addPitch({ ...form, pitchDate: new Date().toISOString().split("T")[0], curatorName: form.curatorName || undefined, playlistFollowers: form.playlistFollowers ? Number(form.playlistFollowers) : undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Submit Pitch</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {pitches && pitches.length > 0 ? pitches.map((p: any) => (
          <div key={p._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center"><Radio className="size-4 text-green-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">"{p.trackTitle}" → {p.playlistName}</p>
                  <p className="text-[10px] text-[#666]">{p.artist} • {p.platform} {p.curatorName && `• ${p.curatorName}`} {p.playlistFollowers && `• ${p.playlistFollowers.toLocaleString()} followers`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={p.status} />
                <button onClick={() => deletePitch({ id: p._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No playlist pitches yet." icon={Radio} />}
      </div>
    </div>
  );
}

export function MusicVideoPlannerTab() {
  const videos = useQuery(api.musicAdvanced.listMusicVideos, {});
  const addVideo = useMutation(api.musicAdvanced.addMusicVideo);
  const deleteVideo = useMutation(api.musicAdvanced.deleteMusicVideo);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ trackTitle: "", artist: "", director: "", concept: "", location: "", shootDate: "", budget: "", status: "concept" });
  const totalBudget = videos?.reduce((s: number, v: any) => s + (v.budget || 0), 0) ?? 0;

  return (
    <div className="space-y-6">
      <SectionHeader title="Music Video Planner" count={videos?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="New Video" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Videos" value={videos?.length ?? 0} icon={Video} />
        <MetricCard label="In Production" value={videos?.filter((v: any) => ["filming", "editing", "pre-production"].includes(v.status)).length ?? 0} icon={Film} color="#a855f7" />
        <MetricCard label="Published" value={videos?.filter((v: any) => v.status === "published").length ?? 0} icon={CheckCircle} color="#22c55e" />
        <MetricCard label="Total Budget" value={`$${totalBudget.toLocaleString()}`} icon={DollarSign} color="#D4A843" />
      </div>
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Track *" value={form.trackTitle} onChange={(e) => setForm({ ...form, trackTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist *" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Director" value={form.director} onChange={(e) => setForm({ ...form, director: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Shoot Date" type="date" value={form.shootDate} onChange={(e) => setForm({ ...form, shootDate: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Budget $" type="number" value={form.budget} onChange={(e) => setForm({ ...form, budget: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <textarea placeholder="Concept / Treatment" value={form.concept} onChange={(e) => setForm({ ...form, concept: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <div className="flex gap-2">
            <button onClick={() => { if (form.trackTitle && form.artist) { addVideo({ ...form, director: form.director || undefined, concept: form.concept || undefined, location: form.location || undefined, shootDate: form.shootDate || undefined, budget: form.budget ? Number(form.budget) : undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Add Video</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {videos && videos.length > 0 ? videos.map((v: any) => (
          <div key={v._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center"><Video className="size-4 text-purple-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">{v.trackTitle} <span className="text-xs text-[#666]">by {v.artist}</span></p>
                  <p className="text-[10px] text-[#666]">{v.director && `Dir: ${v.director} •`} {v.location || ""} {v.shootDate && `• ${v.shootDate}`}</p>
                  {v.concept && <p className="text-[10px] text-[#555] mt-0.5 line-clamp-1">{v.concept}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {v.budget && <span className="text-xs text-[#D4A843]">${v.budget.toLocaleString()}</span>}
                <StatusBadge status={v.status} />
                <button onClick={() => deleteVideo({ id: v._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No music videos planned yet." icon={Video} />}
      </div>
    </div>
  );
}

export function RolloutPlannerTab() {
  const steps = useQuery(api.musicAdvanced.listRolloutSteps, {});
  const addStep = useMutation(api.musicAdvanced.addRolloutStep);
  const updateStep = useMutation(api.musicAdvanced.updateRolloutStep);
  const deleteStep = useMutation(api.musicAdvanced.deleteRolloutStep);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ releaseTitle: "", artist: "", stepName: "", stepType: "single-drop", startDate: "", status: "upcoming" });
  const stepTypes = ["single-drop", "pre-save", "release", "playlist-pitch", "social-push", "press", "video", "promo", "radio"];
  const releases = [...new Set(steps?.map((s: any) => s.releaseTitle) ?? [])];
  const stepColors: Record<string, string> = { "single-drop": "#a855f7", "pre-save": "#3b82f6", release: "#22c55e", "playlist-pitch": "#06b6d4", "social-push": "#ec4899", press: "#f97316", video: "#ef4444", promo: "#D4A843", radio: "#8b5cf6" };

  return (
    <div className="space-y-6">
      <SectionHeader title="Release Rollout Planner" count={steps?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Add Step" />
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Release Title *" value={form.releaseTitle} onChange={(e) => setForm({ ...form, releaseTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Artist *" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Step Name *" value={form.stepName} onChange={(e) => setForm({ ...form, stepName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.stepType} onChange={(e) => setForm({ ...form, stepType: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">{stepTypes.map((t) => <option key={t} value={t}>{t.replace(/-/g, " ")}</option>)}</select>
            <input placeholder="Start Date" type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.releaseTitle && form.artist && form.stepName && form.startDate) { addStep({ ...form, sortOrder: (steps?.length ?? 0) + 1 }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Add Step</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}
      {releases.map((release) => {
        const releaseSteps = steps?.filter((s: any) => s.releaseTitle === release).sort((a: any, b: any) => a.sortOrder - b.sortOrder) ?? [];
        return (
          <div key={release} className="space-y-2">
            <h4 className="text-sm font-medium text-[#D4A843] flex items-center gap-2"><Calendar className="size-4" /> {release} <span className="text-[10px] text-[#555]">({releaseSteps.length} steps)</span></h4>
            <div className="space-y-1 ml-2 border-l-2 border-[#222] pl-4">
              {releaseSteps.map((s: any) => (
                <div key={s._id} className="flex items-center gap-3 py-2 group">
                  <div className="w-3 h-3 rounded-full border-2 shrink-0" style={{ borderColor: stepColors[s.stepType] || "#555", backgroundColor: s.status === "completed" ? stepColors[s.stepType] || "#555" : "transparent" }} />
                  <div className="flex-1">
                    <p className={`text-sm ${s.status === "completed" ? "text-[#666] line-through" : "text-[#f0ece4]"}`}>{s.stepName}</p>
                    <p className="text-[10px] text-[#555]">{s.startDate} • {s.stepType.replace(/-/g, " ")} {s.assignee && `• ${s.assignee}`}</p>
                  </div>
                  <StatusBadge status={s.status} />
                  {s.status !== "completed" && <button onClick={() => updateStep({ id: s._id, status: "completed" })} className="text-[10px] text-[#555] hover:text-green-400 opacity-0 group-hover:opacity-100">✓ Done</button>}
                  <button onClick={() => deleteStep({ id: s._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3" /></button>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {(!steps || steps.length === 0) && <EmptyState message="No rollout plans yet. Create your first release rollout!" icon={Calendar} />}
    </div>
  );
}

export function PressKitTab() {
  const kits = useQuery(api.musicAdvanced.listPressKits, {});
  const addKit = useMutation(api.musicAdvanced.addPressKit);
  const deleteKit = useMutation(api.musicAdvanced.deletePressKit);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ artistName: "", bio: "", genre: "", hometown: "", achievements: "", contactEmail: "" });
  const [expandedId, setExpandedId] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <SectionHeader title="Press Kit / EPK Generator" count={kits?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="New EPK" />
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Artist Name *" value={form.artistName} onChange={(e) => setForm({ ...form, artistName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Hometown" value={form.hometown} onChange={(e) => setForm({ ...form, hometown: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Contact Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <textarea placeholder="Artist bio..." value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={4} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <textarea placeholder="Key achievements (one per line)" value={form.achievements} onChange={(e) => setForm({ ...form, achievements: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <div className="flex gap-2">
            <button onClick={() => { if (form.artistName && form.bio) { addKit({ ...form, status: "draft", genre: form.genre || undefined, hometown: form.hometown || undefined, achievements: form.achievements || undefined, contactEmail: form.contactEmail || undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Create EPK</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-3">
        {kits && kits.length > 0 ? kits.map((k: any) => (
          <div key={k._id} className="bg-[#111] border border-[#222] rounded-xl overflow-hidden hover:border-[#333] transition-all">
            <div className="p-4 cursor-pointer" onClick={() => setExpandedId(expandedId === k._id ? null : k._id)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#D4A843]/20 to-purple-500/20 flex items-center justify-center text-lg">📋</div>
                  <div>
                    <p className="text-sm font-medium text-[#f0ece4]">{k.artistName}</p>
                    <p className="text-[10px] text-[#666]">{k.genre && `${k.genre} • `}{k.hometown || ""} {k.contactEmail && `• ${k.contactEmail}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={k.status} />
                  <ChevronDown className={`size-4 text-[#555] transition-transform ${expandedId === k._id ? "rotate-180" : ""}`} />
                </div>
              </div>
            </div>
            {expandedId === k._id && (
              <div className="px-4 pb-4 border-t border-[#222] space-y-3">
                <div className="bg-[#0a0a0a] rounded-lg p-4 mt-3">
                  <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Bio</p>
                  <p className="text-sm text-[#ccc] leading-relaxed">{k.bio}</p>
                </div>
                {k.achievements && (
                  <div className="bg-[#0a0a0a] rounded-lg p-4">
                    <p className="text-[10px] text-[#555] uppercase tracking-wider mb-2">Achievements</p>
                    <p className="text-sm text-[#ccc] whitespace-pre-wrap">{k.achievements}</p>
                  </div>
                )}
                <button onClick={() => deleteKit({ id: k._id })} className="text-[10px] text-[#555] hover:text-red-400 px-2 py-1 border border-[#222] rounded"><Trash2 className="size-3 inline mr-1" />Delete</button>
              </div>
            )}
          </div>
        )) : <EmptyState message="No press kits yet. Create your first EPK!" icon={BookOpen} />}
      </div>
    </div>
  );
}

export function ProducerCollabTab() {
  const collabs = useQuery(api.musicAdvanced.listProducerCollabs, {});
  const addCollab = useMutation(api.musicAdvanced.addProducerCollab);
  const deleteCollab = useMutation(api.musicAdvanced.deleteProducerCollab);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ producerName: "", specialty: "beats", genre: "", rate: "", producerEmail: "", portfolio: "", status: "available" });

  return (
    <div className="space-y-6">
      <SectionHeader title="Producer Marketplace" count={collabs?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Add Producer" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MetricCard label="Total Producers" value={collabs?.length ?? 0} icon={Users} />
        <MetricCard label="Available" value={collabs?.filter((c: any) => c.status === "available").length ?? 0} icon={CheckCircle} color="#22c55e" />
        <MetricCard label="Booked" value={collabs?.filter((c: any) => c.status === "booked").length ?? 0} icon={Star} color="#a855f7" />
        <MetricCard label="In Session" value={collabs?.filter((c: any) => c.status === "in-session").length ?? 0} icon={Headphones} color="#3b82f6" />
      </div>
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Producer Name *" value={form.producerName} onChange={(e) => setForm({ ...form, producerName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Email" value={form.producerEmail} onChange={(e) => setForm({ ...form, producerEmail: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.specialty} onChange={(e) => setForm({ ...form, specialty: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">{["beats", "mixing", "mastering", "vocals", "songwriting"].map((s) => <option key={s}>{s}</option>)}</select>
            <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Rate (e.g. $500/beat)" value={form.rate} onChange={(e) => setForm({ ...form, rate: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Portfolio URL" value={form.portfolio} onChange={(e) => setForm({ ...form, portfolio: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={() => { if (form.producerName) { addCollab({ ...form, specialty: form.specialty || undefined, genre: form.genre || undefined, rate: form.rate || undefined, producerEmail: form.producerEmail || undefined, portfolio: form.portfolio || undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Add Producer</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}
      <CardGrid>
        {collabs && collabs.length > 0 ? collabs.map((c: any) => (
          <div key={c._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm font-medium text-[#f0ece4]">{c.producerName}</p>
              <StatusBadge status={c.status} />
            </div>
            <div className="space-y-1 text-[10px] text-[#666]">
              {c.specialty && <p>Specialty: <span className="text-[#ccc]">{c.specialty}</span></p>}
              {c.genre && <p>Genre: <span className="text-[#ccc]">{c.genre}</span></p>}
              {c.rate && <p>Rate: <span className="text-[#D4A843]">{c.rate}</span></p>}
              {c.producerEmail && <p>{c.producerEmail}</p>}
            </div>
            <div className="flex items-center gap-1 mt-3">
              {c.rating > 0 && <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, i) => <Star key={i} className={`size-3 ${i < c.rating ? "text-yellow-400 fill-yellow-400" : "text-[#333]"}`} />)}</div>}
              <button onClick={() => deleteCollab({ id: c._id })} className="ml-auto text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        )) : <EmptyState message="No producers in marketplace yet." icon={Users} />}
      </CardGrid>
    </div>
  );
}

export function ARPipelineTab() {
  const entries = useQuery(api.musicAdvanced.listArPipeline, {});
  const addEntry = useMutation(api.musicAdvanced.addArEntry);
  const updateEntry = useMutation(api.musicAdvanced.updateArEntry);
  const deleteEntry = useMutation(api.musicAdvanced.deleteArEntry);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ artistName: "", submissionType: "demo", stage: "new", genre: "", city: "", contactEmail: "", demoUrl: "", monthlyListeners: "", scoutNotes: "", priority: "medium" });
  const stages = ["new", "reviewing", "meeting", "negotiating", "signed", "passed"];
  const stageColors: Record<string, string> = { new: "#3b82f6", reviewing: "#f97316", meeting: "#a855f7", negotiating: "#D4A843", signed: "#22c55e", passed: "#6b7280" };

  return (
    <div className="space-y-6">
      <SectionHeader title="A&R Pipeline" count={entries?.length} onAdd={() => setShowAdd(!showAdd)} addLabel="Add Artist" />
      <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map((stage) => (
          <MetricCard key={stage} label={stage} value={entries?.filter((e: any) => e.stage === stage).length ?? 0} icon={Target} color={stageColors[stage]} />
        ))}
      </div>
      {showAdd && (
        <div className="bg-[#111] border border-[#D4A843]/20 rounded-xl p-4 space-y-3">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <input placeholder="Artist Name *" value={form.artistName} onChange={(e) => setForm({ ...form, artistName: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.submissionType} onChange={(e) => setForm({ ...form, submissionType: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">{["demo", "referral", "scouted", "self-submit"].map((t) => <option key={t}>{t}</option>)}</select>
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">{["low", "medium", "high", "urgent"].map((p) => <option key={p}>{p}</option>)}</select>
            <input placeholder="Genre" value={form.genre} onChange={(e) => setForm({ ...form, genre: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Demo URL" value={form.demoUrl} onChange={(e) => setForm({ ...form, demoUrl: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Monthly Listeners" type="number" value={form.monthlyListeners} onChange={(e) => setForm({ ...form, monthlyListeners: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <textarea placeholder="Scout notes..." value={form.scoutNotes} onChange={(e) => setForm({ ...form, scoutNotes: e.target.value })} rows={2} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <div className="flex gap-2">
            <button onClick={() => { if (form.artistName) { addEntry({ ...form, genre: form.genre || undefined, city: form.city || undefined, contactEmail: form.contactEmail || undefined, demoUrl: form.demoUrl || undefined, monthlyListeners: form.monthlyListeners ? Number(form.monthlyListeners) : undefined, scoutNotes: form.scoutNotes || undefined, socialLinks: undefined }); setShowAdd(false); } }} className="text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium">Add to Pipeline</button>
            <button onClick={() => setShowAdd(false)} className="text-xs text-[#888] px-4 py-2 rounded-lg border border-[#333]">Cancel</button>
          </div>
        </div>
      )}
      <div className="space-y-2">
        {entries && entries.length > 0 ? entries.map((e: any) => (
          <div key={e._id} className="bg-[#111] border border-[#222] rounded-xl p-4 hover:border-[#333] transition-all group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${stageColors[e.stage] || "#555"}15` }}><Target className="size-4" style={{ color: stageColors[e.stage] || "#555" }} /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">{e.artistName}</p>
                  <p className="text-[10px] text-[#666]">{e.genre && `${e.genre} • `}{e.city || ""} {e.monthlyListeners && `• ${e.monthlyListeners.toLocaleString()} monthly listeners`}</p>
                  {e.scoutNotes && <p className="text-[10px] text-[#555] mt-0.5 line-clamp-1">{e.scoutNotes}</p>}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={e.stage} />
                {e.priority && <span className={`text-[9px] px-1.5 py-0.5 rounded ${e.priority === "urgent" ? "bg-red-500/15 text-red-400" : e.priority === "high" ? "bg-orange-500/15 text-orange-400" : "bg-gray-500/15 text-gray-400"}`}>{e.priority}</span>}
                <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#888] rounded">{e.submissionType}</span>
                <button onClick={() => deleteEntry({ id: e._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          </div>
        )) : <EmptyState message="No A&R entries yet. Start building your pipeline!" icon={Target} />}
      </div>
    </div>
  );
}

export function AiLyricsAssistantTab() {
  const logs = useQuery(api.musicAdvanced.listAiLyricsLogs, {});
  const addLog = useMutation(api.musicAdvanced.addAiLyricsLog);
  const toggleSaved = useMutation(api.musicAdvanced.toggleAiLyricsSaved);
  const deleteLog = useMutation(api.musicAdvanced.deleteAiLyricsLog);
  const [form, setForm] = useState({ prompt: "", mood: "hype", style: "hip-hop" });
  const moods = ["hype", "chill", "emotional", "dark", "uplifting", "aggressive"];
  const styles = ["hip-hop", "r&b", "pop", "trap", "soul", "drill", "afrobeats"];

  const generateLyrics = () => {
    if (!form.prompt) return;
    // Simulated AI output — in production this would call an AI API
    const simulated = `[Verse 1]\n${form.prompt}\nWords flow like water through the streets of the city\nEvery bar I write is another chapter in history\n\n[Hook]\nRise up, rise up, we built for this\nEvery beat drops and we don't miss\n\n[Verse 2]\nFrom the block to the booth, turning pain into art\nEvery verse from the heart, tearing the charts apart`;
    addLog({ prompt: form.prompt, generatedText: simulated, mood: form.mood || undefined, style: form.style || undefined });
    setForm({ prompt: "", mood: "hype", style: "hip-hop" });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Lyrics Assistant" count={logs?.length} />

      <div className="bg-gradient-to-br from-[#D4A843]/5 to-purple-500/5 border border-[#D4A843]/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2"><Zap className="size-5 text-[#D4A843]" /><h4 className="text-sm font-medium text-[#f0ece4]">Generate Lyrics</h4></div>
        <textarea placeholder="Describe what you want to write about... (e.g., 'growing up in Fort Worth, overcoming obstacles, making it to the top')" value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} rows={3} className="w-full bg-[#0a0a0a] border border-[#333] rounded-lg px-4 py-3 text-sm text-[#f0ece4]" />
        <div className="flex gap-4">
          <div>
            <p className="text-[10px] text-[#555] mb-1.5">Mood</p>
            <div className="flex gap-1.5">{moods.map((m) => <button key={m} onClick={() => setForm({ ...form, mood: m })} className={`px-2 py-1 text-[9px] rounded ${form.mood === m ? "bg-[#D4A843]/20 text-[#D4A843]" : "bg-[#111] text-[#888]"}`}>{m}</button>)}</div>
          </div>
          <div>
            <p className="text-[10px] text-[#555] mb-1.5">Style</p>
            <div className="flex gap-1.5">{styles.map((s) => <button key={s} onClick={() => setForm({ ...form, style: s })} className={`px-2 py-1 text-[9px] rounded ${form.style === s ? "bg-purple-500/20 text-purple-300" : "bg-[#111] text-[#888]"}`}>{s}</button>)}</div>
          </div>
        </div>
        <button onClick={generateLyrics} className="flex items-center gap-1.5 text-xs bg-[#D4A843] text-[#0a0a0a] px-4 py-2 rounded-lg font-medium hover:bg-[#E8C767]"><Zap className="size-3.5" /> Generate</button>
      </div>

      <div className="space-y-3">
        {logs && logs.length > 0 ? logs.map((l: any) => (
          <div key={l._id} className="bg-[#111] border border-[#222] rounded-xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <p className="text-xs text-[#888]">Prompt: <span className="text-[#ccc]">{l.prompt}</span></p>
                {l.mood && <span className="text-[9px] px-1.5 py-0.5 bg-[#1a1a1a] text-[#888] rounded">{l.mood}</span>}
                {l.style && <span className="text-[9px] px-1.5 py-0.5 bg-purple-500/10 text-purple-400 rounded">{l.style}</span>}
              </div>
              <div className="flex items-center gap-1">
                <button onClick={() => toggleSaved({ id: l._id })} className={l.isSaved ? "text-[#D4A843]" : "text-[#444] hover:text-[#D4A843]"}><Star className="size-3.5" fill={l.isSaved ? "currentColor" : "none"} /></button>
                <button onClick={() => deleteLog({ id: l._id })} className="text-[#444] hover:text-red-400"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            <pre className="text-sm text-[#ccc] font-mono whitespace-pre-wrap leading-relaxed p-3 bg-[#0a0a0a] rounded-lg">{l.generatedText}</pre>
          </div>
        )) : <EmptyState message="No lyrics generated yet. Try the AI assistant!" icon={PenTool} />}
      </div>
    </div>
  );
}

export function AiMasteringTab() {
  const logs = useQuery(api.musicAdvanced.listAiMasteringLogs, {});
  const addLog = useMutation(api.musicAdvanced.addAiMasteringLog);
  const deleteLog = useMutation(api.musicAdvanced.deleteAiMasteringLog);
  const [form, setForm] = useState({ trackTitle: "", artist: "", inputFormat: "wav", lufsTarget: "-14", referenceTrack: "" });

  const analyze = () => {
    if (!form.trackTitle) return;
    addLog({
      trackTitle: form.trackTitle, status: "complete", artist: form.artist || undefined,
      inputFormat: form.inputFormat || undefined, lufsTarget: form.lufsTarget ? Number(form.lufsTarget) : undefined,
      referenceTrack: form.referenceTrack || undefined,
      suggestedEQ: "Low shelf +1.5dB @ 80Hz, High shelf -0.5dB @ 12kHz, Notch -2dB @ 400Hz",
      suggestedCompression: "Ratio 3:1, Attack 10ms, Release 100ms, Threshold -18dB, Knee: Soft",
      suggestedLimiter: "Ceiling -1.0dB True Peak, Release 50ms",
      loudnessAnalysis: `Integrated: ${form.lufsTarget || -14} LUFS, Short-term peak: ${Number(form.lufsTarget || -14) + 3} LUFS, LRA: 8 LU, True Peak: -0.8 dBTP`,
    });
    setForm({ trackTitle: "", artist: "", inputFormat: "wav", lufsTarget: "-14", referenceTrack: "" });
  };

  return (
    <div className="space-y-6">
      <SectionHeader title="AI Mastering Preview" count={logs?.length} />

      <div className="bg-gradient-to-br from-blue-500/5 to-[#D4A843]/5 border border-blue-500/20 rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2"><Sliders className="size-5 text-blue-400" /><h4 className="text-sm font-medium text-[#f0ece4]">Analyze Track</h4></div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <input placeholder="Track Title *" value={form.trackTitle} onChange={(e) => setForm({ ...form, trackTitle: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <input placeholder="Artist" value={form.artist} onChange={(e) => setForm({ ...form, artist: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <select value={form.inputFormat} onChange={(e) => setForm({ ...form, inputFormat: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]">{["wav", "flac", "mp3", "aiff"].map((f) => <option key={f}>{f.toUpperCase()}</option>)}</select>
          <input placeholder="LUFS Target (e.g. -14)" type="number" value={form.lufsTarget} onChange={(e) => setForm({ ...form, lufsTarget: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4]" />
          <input placeholder="Reference Track" value={form.referenceTrack} onChange={(e) => setForm({ ...form, referenceTrack: e.target.value })} className="bg-[#0a0a0a] border border-[#333] rounded-lg px-3 py-2 text-sm text-[#f0ece4] col-span-2" />
        </div>
        <button onClick={analyze} className="flex items-center gap-1.5 text-xs bg-blue-500 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-400"><Activity className="size-3.5" /> Analyze & Get Suggestions</button>
      </div>

      <div className="space-y-3">
        {logs && logs.length > 0 ? logs.map((l: any) => (
          <div key={l._id} className="bg-[#111] border border-[#222] rounded-xl p-5 space-y-3 group">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center"><Activity className="size-4 text-blue-400" /></div>
                <div>
                  <p className="text-sm font-medium text-[#f0ece4]">{l.trackTitle} {l.artist && <span className="text-xs text-[#666]">by {l.artist}</span>}</p>
                  <p className="text-[10px] text-[#666]">{l.inputFormat?.toUpperCase()} • Target: {l.lufsTarget} LUFS {l.referenceTrack && `• Ref: ${l.referenceTrack}`}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={l.status} />
                <button onClick={() => deleteLog({ id: l._id })} className="text-[#444] hover:text-red-400 opacity-0 group-hover:opacity-100"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {l.loudnessAnalysis && <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#222]"><p className="text-[9px] text-[#555] uppercase tracking-wider mb-1">Loudness</p><p className="text-xs text-[#ccc]">{l.loudnessAnalysis}</p></div>}
              {l.suggestedEQ && <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#222]"><p className="text-[9px] text-[#555] uppercase tracking-wider mb-1">EQ</p><p className="text-xs text-[#ccc]">{l.suggestedEQ}</p></div>}
              {l.suggestedCompression && <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#222]"><p className="text-[9px] text-[#555] uppercase tracking-wider mb-1">Compression</p><p className="text-xs text-[#ccc]">{l.suggestedCompression}</p></div>}
              {l.suggestedLimiter && <div className="bg-[#0a0a0a] rounded-lg p-3 border border-[#222]"><p className="text-[9px] text-[#555] uppercase tracking-wider mb-1">Limiter</p><p className="text-xs text-[#ccc]">{l.suggestedLimiter}</p></div>}
            </div>
          </div>
        )) : <EmptyState message="No mastering analyses yet. Submit a track!" icon={Sliders} />}
      </div>
    </div>
  );
}
