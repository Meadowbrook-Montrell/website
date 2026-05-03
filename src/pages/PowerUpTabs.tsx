/**
 * Power-Up Feature Tabs — 10 new modules for the Admin Dashboard
 * Media Library, Donations, Live Streams, Clip Queue, Audience Analytics,
 * Workflows, Contacts, Stories, Merch Fulfillment, Promo Codes
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Plus, Trash2, Edit, Star, Search, Filter, ExternalLink,
  Image, Video, Music, FileText, Heart, DollarSign,
  Radio, Scissors, BarChart3, Zap, Users, BookOpen,
  Package, Tag, Eye, Check, X, Clock, MapPin,
  AlertTriangle, TrendingUp, ChevronRight, Play, Pause,
  Copy, Globe, Send, MessageSquare, ArrowUpDown,
} from "lucide-react";

/* ─── Reusable Card ─── */
function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`bg-[#141414] border border-[#D4A843]/10 rounded-lg p-5 ${className}`}>
      {children}
    </div>
  );
}

function StatMini({ label, value, icon: Icon, color = "#D4A843" }: { label: string; value: string | number; icon: any; color?: string }) {
  return (
    <div className="bg-[#0a0a0a]/60 border border-[#333]/50 rounded-lg p-4">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="size-4" style={{ color }} />
        <span className="text-xs text-[#888078] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-xl font-display text-[#f0ece4]">{value}</p>
    </div>
  );
}

function Input({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-1.5">{label}</label>
      <input {...props} className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none" />
    </div>
  );
}

function Select({ label, children, ...props }: { label: string; children: React.ReactNode } & React.SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div>
      <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-1.5">{label}</label>
      <select {...props} className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-3 py-2 text-sm text-[#f0ece4] focus:border-[#D4A843] focus:outline-none">
        {children}
      </select>
    </div>
  );
}

function Badge({ text, color = "gold" }: { text: string; color?: string }) {
  const colors: Record<string, string> = {
    gold: "bg-[#D4A843]/20 text-[#D4A843]",
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
    blue: "bg-blue-500/20 text-blue-400",
    yellow: "bg-yellow-500/20 text-yellow-400",
    purple: "bg-purple-500/20 text-purple-400",
    gray: "bg-[#333]/50 text-[#888]",
  };
  return <span className={`text-[10px] px-2 py-0.5 rounded font-bold tracking-wider uppercase ${colors[color] || colors.gold}`}>{text}</span>;
}

// ═══════════════════════════════════════════════════════════
//  21. MEDIA LIBRARY TAB
// ═══════════════════════════════════════════════════════════
export function MediaLibraryTab() {
  const assets = useQuery(api.powerups.getMediaAssets, {});
  const addAsset = useMutation(api.powerups.addMediaAsset);
  const deleteAsset = useMutation(api.powerups.deleteMediaAsset);
  const updateAsset = useMutation(api.powerups.updateMediaAsset);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ title: "", fileUrl: "", fileType: "image", description: "", tags: "", project: "" });

  const typeIcons: Record<string, any> = { image: Image, video: Video, audio: Music, document: FileText };
  const filtered = assets?.filter((a: any) => {
    if (filter !== "all" && a.fileType !== filter) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase()) && !(a.tags || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addAsset({ ...form, fileType: form.fileType });
    setForm({ title: "", fileUrl: "", fileType: "image", description: "", tags: "", project: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">MEDIA LIBRARY</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> Add Asset
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Total" value={assets?.length || 0} icon={Image} />
        <StatMini label="Images" value={assets?.filter((a: any) => a.fileType === "image").length || 0} icon={Image} color="#22c55e" />
        <StatMini label="Videos" value={assets?.filter((a: any) => a.fileType === "video").length || 0} icon={Video} color="#ef4444" />
        <StatMini label="Favorites" value={assets?.filter((a: any) => a.isFavorite).length || 0} icon={Star} color="#D4A843" />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Title *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Asset name" />
            <Input label="File URL *" required value={form.fileUrl} onChange={(e) => setForm({ ...form, fileUrl: e.target.value })} placeholder="https://..." />
            <Select label="Type" value={form.fileType} onChange={(e) => setForm({ ...form, fileType: e.target.value })}>
              <option value="image">📸 Image</option>
              <option value="video">🎬 Video</option>
              <option value="audio">🎵 Audio</option>
              <option value="document">📄 Document</option>
            </Select>
            <Input label="Project" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} placeholder="Episode name, event..." />
            <Input label="Tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Comma-separated tags" />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" />
            <div className="sm:col-span-2">
              <button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save Asset</button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 size-4 text-[#555]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm pl-9 pr-3 py-2 text-sm text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none" placeholder="Search assets..." />
        </div>
        {["all", "image", "video", "audio", "document"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm ${filter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>
            {f}
          </button>
        ))}
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {filtered.map((asset: any) => {
          const TypeIcon = typeIcons[asset.fileType] || FileText;
          return (
            <Card key={asset._id} className="group relative">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded bg-[#D4A843]/10 flex items-center justify-center shrink-0">
                  <TypeIcon className="size-5 text-[#D4A843]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm truncate">{asset.title}</p>
                    <button onClick={() => updateAsset({ id: asset._id, isFavorite: !asset.isFavorite })} className={asset.isFavorite ? "text-[#D4A843]" : "text-[#555] hover:text-[#D4A843]"}>
                      <Star className="size-3" fill={asset.isFavorite ? "#D4A843" : "none"} />
                    </button>
                  </div>
                  {asset.project && <p className="text-[10px] text-[#D4A843]">{asset.project}</p>}
                  {asset.tags && <p className="text-[10px] text-[#555] mt-0.5">{asset.tags}</p>}
                  <div className="flex items-center gap-2 mt-2">
                    <a href={asset.fileUrl} target="_blank" rel="noopener noreferrer" className="text-[10px] text-blue-400 hover:underline flex items-center gap-1"><ExternalLink className="size-3" />Open</a>
                    <button onClick={() => navigator.clipboard.writeText(asset.fileUrl)} className="text-[10px] text-[#888] hover:text-[#ccc] flex items-center gap-1"><Copy className="size-3" />Copy URL</button>
                    <button onClick={() => deleteAsset({ id: asset._id })} className="text-[10px] text-red-400/50 hover:text-red-400 ml-auto"><Trash2 className="size-3" /></button>
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>
      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No assets found. Upload your first one!</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  22. TIP JAR / DONATIONS TAB
// ═══════════════════════════════════════════════════════════
export function DonationsTab() {
  const donations = useQuery(api.powerups.getDonations);
  const addDonation = useMutation(api.powerups.addDonation);
  const deleteDonation = useMutation(api.powerups.deleteDonation);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ donorName: "", amount: "", platform: "cashapp", message: "", isAnonymous: false });

  const totalAmount = donations?.reduce((sum: number, d: any) => sum + d.amount, 0) || 0;
  const thisMonth = donations?.filter((d: any) => new Date(d.createdAt).getMonth() === new Date().getMonth()).reduce((sum: number, d: any) => sum + d.amount, 0) || 0;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addDonation({ donorName: form.donorName, amount: parseFloat(form.amount), platform: form.platform, message: form.message || undefined, isAnonymous: form.isAnonymous });
    setForm({ donorName: "", amount: "", platform: "cashapp", message: "", isAnonymous: false });
    setShowForm(false);
  };

  const platformColors: Record<string, string> = { cashapp: "#00D632", paypal: "#003087", venmo: "#3D95CE", stripe: "#635BFF", other: "#888" };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">TIP JAR / DONATIONS</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> Log Donation
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Total Raised" value={`$${totalAmount.toFixed(2)}`} icon={DollarSign} />
        <StatMini label="This Month" value={`$${thisMonth.toFixed(2)}`} icon={TrendingUp} color="#22c55e" />
        <StatMini label="Supporters" value={new Set(donations?.map((d: any) => d.donorName)).size || 0} icon={Heart} color="#ef4444" />
        <StatMini label="Total Tips" value={donations?.length || 0} icon={DollarSign} color="#3b82f6" />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Donor Name *" required value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} placeholder="Name" />
            <Input label="Amount ($) *" required type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} placeholder="0.00" />
            <Select label="Platform" value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })}>
              <option value="cashapp">💵 CashApp</option>
              <option value="paypal">💳 PayPal</option>
              <option value="venmo">💙 Venmo</option>
              <option value="stripe">💜 Stripe</option>
              <option value="other">Other</option>
            </Select>
            <Input label="Message" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Optional message" />
            <div className="sm:col-span-2 flex items-center gap-4">
              <button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save</button>
              <label className="flex items-center gap-2 text-xs text-[#888]">
                <input type="checkbox" checked={form.isAnonymous} onChange={(e) => setForm({ ...form, isAnonymous: e.target.checked })} /> Anonymous
              </label>
            </div>
          </form>
        </Card>
      )}

      {donations?.map((d: any) => (
        <Card key={d._id}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold" style={{ backgroundColor: (platformColors[d.platform] || "#888") + "20", color: platformColors[d.platform] || "#888" }}>
                ${d.amount}
              </div>
              <div>
                <p className="font-bold text-sm">{d.isAnonymous ? "Anonymous" : d.donorName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <Badge text={d.platform} color={d.platform === "cashapp" ? "green" : d.platform === "paypal" ? "blue" : "purple"} />
                  <span className="text-[10px] text-[#555]">{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
                {d.message && <p className="text-xs text-[#888] mt-1 italic">"{d.message}"</p>}
              </div>
            </div>
            <button onClick={() => deleteDonation({ id: d._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
          </div>
        </Card>
      ))}
      {(!donations || donations.length === 0) && <div className="text-center py-12 text-[#555]">No donations logged yet.</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  23. LIVE STREAM COMMAND CENTER TAB
// ═══════════════════════════════════════════════════════════
export function LiveStreamTab() {
  const streams = useQuery(api.powerups.getLiveStreams, {});
  const addStream = useMutation(api.powerups.addLiveStream);
  const updateStream = useMutation(api.powerups.updateLiveStream);
  const deleteStream = useMutation(api.powerups.deleteLiveStream);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ title: "", scheduledAt: "", platforms: "youtube", description: "", streamUrl: "" });

  const filtered = streams?.filter((s: any) => filter === "all" || s.status === filter) || [];

  const statusColors: Record<string, string> = { scheduled: "blue", live: "red", ended: "gray", cancelled: "yellow" };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStream({ ...form });
    setForm({ title: "", scheduledAt: "", platforms: "youtube", description: "", streamUrl: "" });
    setShowForm(false);
  };

  const defaultChecklist = [
    { item: "Camera + tripod set up", done: false },
    { item: "Audio/mic check", done: false },
    { item: "Lighting check", done: false },
    { item: "Stream title & description set", done: false },
    { item: "Thumbnail uploaded", done: false },
    { item: "Test stream connection", done: false },
    { item: "Notify audience (social post)", done: false },
    { item: "Water bottle ready", done: false },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">LIVE STREAM COMMAND CENTER</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> Schedule Stream
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Total Streams" value={streams?.length || 0} icon={Radio} />
        <StatMini label="Scheduled" value={streams?.filter((s: any) => s.status === "scheduled").length || 0} icon={Clock} color="#3b82f6" />
        <StatMini label="Completed" value={streams?.filter((s: any) => s.status === "ended").length || 0} icon={Check} color="#22c55e" />
        <StatMini label="Total Viewers" value={streams?.reduce((sum: number, s: any) => sum + (s.totalViewers || 0), 0) || 0} icon={Eye} color="#a855f7" />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Stream Title *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Episode title" />
            <Input label="Scheduled Date/Time *" required type="datetime-local" value={form.scheduledAt} onChange={(e) => setForm({ ...form, scheduledAt: e.target.value })} />
            <Input label="Platforms" value={form.platforms} onChange={(e) => setForm({ ...form, platforms: e.target.value })} placeholder="youtube,facebook,tiktok" />
            <Input label="Stream URL" value={form.streamUrl} onChange={(e) => setForm({ ...form, streamUrl: e.target.value })} placeholder="https://..." />
            <div className="sm:col-span-2">
              <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="What's this stream about?" />
            </div>
            <div className="sm:col-span-2">
              <button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Create Stream</button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2">
        {["all", "scheduled", "live", "ended"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm ${filter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>{f}</button>
        ))}
      </div>

      {filtered.map((stream: any) => {
        const checklist: { item: string; done: boolean }[] = stream.checklist ? JSON.parse(stream.checklist) : defaultChecklist;
        const checkDone = checklist.filter((c) => c.done).length;
        return (
          <Card key={stream._id}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold">{stream.title}</span>
                  <Badge text={stream.status} color={statusColors[stream.status] || "gray"} />
                  {stream.platforms?.split(",").map((p: string) => (
                    <Badge key={p} text={p.trim()} color="purple" />
                  ))}
                </div>
                <p className="text-xs text-[#888] mt-1">📅 {new Date(stream.scheduledAt).toLocaleString()}</p>
                {stream.description && <p className="text-xs text-[#ccc] mt-1">{stream.description}</p>}
                {stream.totalViewers && <p className="text-xs text-[#D4A843] mt-1">👁 {stream.totalViewers} viewers{stream.peakViewers ? ` (peak: ${stream.peakViewers})` : ""}</p>}

                {/* Checklist */}
                <div className="mt-3 space-y-1">
                  <p className="text-[10px] text-[#D4A843] uppercase tracking-widest font-bold">Go-Live Checklist ({checkDone}/{checklist.length})</p>
                  <div className="grid grid-cols-2 gap-1">
                    {checklist.map((c, i) => (
                      <button key={i} onClick={() => {
                        const updated = [...checklist];
                        updated[i] = { ...c, done: !c.done };
                        updateStream({ id: stream._id, checklist: JSON.stringify(updated) });
                      }} className={`flex items-center gap-1.5 text-[11px] px-2 py-1 rounded ${c.done ? "text-green-400 bg-green-500/10" : "text-[#888] bg-[#0a0a0a]/40"}`}>
                        {c.done ? <Check className="size-3" /> : <X className="size-3 opacity-30" />} {c.item}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-1.5 shrink-0">
                {stream.status === "scheduled" && (
                  <button onClick={() => updateStream({ id: stream._id, status: "live" })} className="p-1.5 bg-red-500/20 text-red-400 rounded-sm hover:bg-red-500/30" title="Go Live"><Play className="size-4" /></button>
                )}
                {stream.status === "live" && (
                  <button onClick={() => updateStream({ id: stream._id, status: "ended" })} className="p-1.5 bg-yellow-500/20 text-yellow-400 rounded-sm hover:bg-yellow-500/30" title="End Stream"><Pause className="size-4" /></button>
                )}
                <button onClick={() => deleteStream({ id: stream._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </Card>
        );
      })}
      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No streams yet. Schedule your first one!</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  24. CLIP GENERATOR QUEUE TAB
// ═══════════════════════════════════════════════════════════
export function ClipQueueTab() {
  const clips = useQuery(api.powerups.getClipQueue, {});
  const addClip = useMutation(api.powerups.addClip);
  const updateClip = useMutation(api.powerups.updateClip);
  const deleteClip = useMutation(api.powerups.deleteClip);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [form, setForm] = useState({ sourceTitle: "", sourceUrl: "", startTime: "", endTime: "", clipTitle: "", description: "", priority: "medium" });

  const filtered = clips?.filter((c: any) => filter === "all" || c.status === filter) || [];
  const statusColors: Record<string, string> = { queued: "yellow", editing: "blue", exported: "green", posted: "gold" };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addClip({ ...form, sourceUrl: form.sourceUrl || undefined, description: form.description || undefined });
    setForm({ sourceTitle: "", sourceUrl: "", startTime: "", endTime: "", clipTitle: "", description: "", priority: "medium" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">CLIP GENERATOR QUEUE</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> Add Clip
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Queued" value={clips?.filter((c: any) => c.status === "queued").length || 0} icon={Clock} color="#eab308" />
        <StatMini label="Editing" value={clips?.filter((c: any) => c.status === "editing").length || 0} icon={Scissors} color="#3b82f6" />
        <StatMini label="Exported" value={clips?.filter((c: any) => c.status === "exported").length || 0} icon={Check} color="#22c55e" />
        <StatMini label="Posted" value={clips?.filter((c: any) => c.status === "posted").length || 0} icon={Send} color="#D4A843" />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Source Title *" required value={form.sourceTitle} onChange={(e) => setForm({ ...form, sourceTitle: e.target.value })} placeholder="Original video title" />
            <Input label="Source URL" value={form.sourceUrl} onChange={(e) => setForm({ ...form, sourceUrl: e.target.value })} placeholder="YouTube link..." />
            <Input label="Start Time *" required value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} placeholder="01:23:45" />
            <Input label="End Time *" required value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} placeholder="01:25:30" />
            <Input label="Clip Title *" required value={form.clipTitle} onChange={(e) => setForm({ ...form, clipTitle: e.target.value })} placeholder="Short clip name" />
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="high">🔴 High</option>
              <option value="medium">🟡 Medium</option>
              <option value="low">🟢 Low</option>
            </Select>
            <div className="sm:col-span-2">
              <button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Add to Queue</button>
            </div>
          </form>
        </Card>
      )}

      <div className="flex gap-2">
        {["all", "queued", "editing", "exported", "posted"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm ${filter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>{f}</button>
        ))}
      </div>

      {filtered.map((clip: any) => (
        <Card key={clip._id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-sm">{clip.clipTitle}</span>
                <Badge text={clip.status} color={statusColors[clip.status] || "gray"} />
                {clip.priority && <Badge text={clip.priority} color={clip.priority === "high" ? "red" : clip.priority === "medium" ? "yellow" : "green"} />}
              </div>
              <p className="text-xs text-[#888] mt-1">From: {clip.sourceTitle}</p>
              <p className="text-xs text-[#D4A843] mt-0.5">⏱ {clip.startTime} → {clip.endTime}</p>
              {clip.platforms && <p className="text-xs text-green-400 mt-0.5">📱 Posted: {clip.platforms}</p>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              {clip.status === "queued" && <button onClick={() => updateClip({ id: clip._id, status: "editing" })} className="p-1.5 bg-blue-500/20 text-blue-400 rounded-sm hover:bg-blue-500/30" title="Start Editing"><Scissors className="size-4" /></button>}
              {clip.status === "editing" && <button onClick={() => updateClip({ id: clip._id, status: "exported" })} className="p-1.5 bg-green-500/20 text-green-400 rounded-sm hover:bg-green-500/30" title="Mark Exported"><Check className="size-4" /></button>}
              {clip.status === "exported" && <button onClick={() => updateClip({ id: clip._id, status: "posted" })} className="p-1.5 bg-[#D4A843]/20 text-[#D4A843] rounded-sm hover:bg-[#D4A843]/30" title="Mark Posted"><Send className="size-4" /></button>}
              <button onClick={() => deleteClip({ id: clip._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No clips in queue.</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  25. AUDIENCE ANALYTICS TAB
// ═══════════════════════════════════════════════════════════
export function AudienceAnalyticsTab() {
  const snapshots = useQuery(api.powerups.getAudienceSnapshots);
  const addSnapshot = useMutation(api.powerups.addAudienceSnapshot);
  const deleteSnapshot = useMutation(api.powerups.deleteAudienceSnapshot);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: new Date().toISOString().split("T")[0], totalVisitors: "", uniqueVisitors: "", topPage: "", topReferrer: "", subscriberCount: "", notes: "" });

  const latest = snapshots?.[0];
  const totalVisitors = snapshots?.reduce((sum: number, s: any) => sum + (s.totalVisitors || 0), 0) || 0;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addSnapshot({
      date: form.date,
      totalVisitors: form.totalVisitors ? parseInt(form.totalVisitors) : undefined,
      uniqueVisitors: form.uniqueVisitors ? parseInt(form.uniqueVisitors) : undefined,
      topPage: form.topPage || undefined,
      topReferrer: form.topReferrer || undefined,
      subscriberCount: form.subscriberCount ? parseInt(form.subscriberCount) : undefined,
      notes: form.notes || undefined,
    });
    setForm({ date: new Date().toISOString().split("T")[0], totalVisitors: "", uniqueVisitors: "", topPage: "", topReferrer: "", subscriberCount: "", notes: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">AUDIENCE ANALYTICS</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> Log Snapshot
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Total Visitors" value={totalVisitors} icon={Globe} />
        <StatMini label="Latest Visitors" value={latest?.totalVisitors || 0} icon={Eye} color="#3b82f6" />
        <StatMini label="Latest Subscribers" value={latest?.subscriberCount || "—"} icon={Users} color="#22c55e" />
        <StatMini label="Snapshots" value={snapshots?.length || 0} icon={BarChart3} color="#a855f7" />
      </div>

      {/* Simple trend chart */}
      {snapshots && snapshots.length > 1 && (
        <Card>
          <p className="text-xs text-[#D4A843] font-bold tracking-widest uppercase mb-3">Visitor Trend (last {Math.min(snapshots.length, 14)} days)</p>
          <div className="flex items-end gap-2 h-24">
            {snapshots.slice(0, 14).reverse().map((s: any, i: number) => {
              const max = Math.max(...snapshots.slice(0, 14).map((x: any) => x.totalVisitors || 0), 1);
              const h = Math.max(((s.totalVisitors || 0) / max) * 100, 4);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                  <span className="text-[9px] text-[#555]">{s.totalVisitors || 0}</span>
                  <div className="w-full bg-[#D4A843]/60 rounded-t" style={{ height: `${h}%` }} />
                  <span className="text-[8px] text-[#444]">{s.date?.slice(5)}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Date" type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            <Input label="Total Visitors" type="number" value={form.totalVisitors} onChange={(e) => setForm({ ...form, totalVisitors: e.target.value })} />
            <Input label="Unique Visitors" type="number" value={form.uniqueVisitors} onChange={(e) => setForm({ ...form, uniqueVisitors: e.target.value })} />
            <Input label="Top Page" value={form.topPage} onChange={(e) => setForm({ ...form, topPage: e.target.value })} placeholder="/community" />
            <Input label="Top Referrer" value={form.topReferrer} onChange={(e) => setForm({ ...form, topReferrer: e.target.value })} placeholder="instagram.com" />
            <Input label="Subscriber Count" type="number" value={form.subscriberCount} onChange={(e) => setForm({ ...form, subscriberCount: e.target.value })} />
            <div className="sm:col-span-2"><button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save Snapshot</button></div>
          </form>
        </Card>
      )}

      {snapshots?.map((s: any) => (
        <Card key={s._id}>
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm">{s.date}</span>
                <span className="text-xs text-[#D4A843]">{s.totalVisitors || 0} visitors</span>
                {s.uniqueVisitors && <span className="text-xs text-[#888]">({s.uniqueVisitors} unique)</span>}
              </div>
              <div className="flex gap-3 mt-1">
                {s.topPage && <span className="text-[10px] text-[#888]">📄 {s.topPage}</span>}
                {s.topReferrer && <span className="text-[10px] text-[#888]">🔗 {s.topReferrer}</span>}
                {s.subscriberCount && <span className="text-[10px] text-green-400">👥 {s.subscriberCount} subs</span>}
              </div>
            </div>
            <button onClick={() => deleteSnapshot({ id: s._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
          </div>
        </Card>
      ))}
      {(!snapshots || snapshots.length === 0) && <div className="text-center py-12 text-[#555]">No analytics snapshots yet. Log your first one!</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  26. AUTOMATED WORKFLOWS TAB
// ═══════════════════════════════════════════════════════════
export function WorkflowsTab() {
  const workflows = useQuery(api.powerups.getWorkflows);
  const addWorkflow = useMutation(api.powerups.addWorkflow);
  const updateWorkflow = useMutation(api.powerups.updateWorkflow);
  const deleteWorkflow = useMutation(api.powerups.deleteWorkflow);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", trigger: "new_subscriber", action: "send_email", config: "" });

  const triggers: Record<string, string> = {
    new_subscriber: "📧 New Subscriber",
    new_community_post: "💬 New Community Post",
    new_booking: "🎙 New Booking",
    new_donation: "💵 New Donation",
    scheduled: "⏰ Scheduled",
  };

  const actions: Record<string, string> = {
    send_email: "📧 Send Email",
    slack_notify: "💬 Slack Notification",
    auto_approve: "✅ Auto-Approve",
    send_waiver: "📄 Send Waiver",
    add_notification: "🔔 Create Notification",
  };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addWorkflow({ ...form, config: form.config || undefined });
    setForm({ name: "", trigger: "new_subscriber", action: "send_email", config: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">AUTOMATED WORKFLOWS</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> New Workflow
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <StatMini label="Total Workflows" value={workflows?.length || 0} icon={Zap} />
        <StatMini label="Active" value={workflows?.filter((w: any) => w.isActive).length || 0} icon={Check} color="#22c55e" />
        <StatMini label="Total Triggers" value={workflows?.reduce((sum: number, w: any) => sum + (w.triggerCount || 0), 0) || 0} icon={TrendingUp} color="#a855f7" />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Workflow Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Welcome new subscribers" />
            <Select label="When (Trigger)" value={form.trigger} onChange={(e) => setForm({ ...form, trigger: e.target.value })}>
              {Object.entries(triggers).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
            <Select label="Then (Action)" value={form.action} onChange={(e) => setForm({ ...form, action: e.target.value })}>
              {Object.entries(actions).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </Select>
            <Input label="Config (optional)" value={form.config} onChange={(e) => setForm({ ...form, config: e.target.value })} placeholder="Additional settings..." />
            <div className="sm:col-span-2"><button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Create Workflow</button></div>
          </form>
        </Card>
      )}

      {workflows?.map((w: any) => (
        <Card key={w._id}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className={`w-3 h-3 rounded-full ${w.isActive ? "bg-green-400 animate-pulse" : "bg-[#555]"}`} />
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{w.name}</span>
                  <Badge text={w.isActive ? "Active" : "Paused"} color={w.isActive ? "green" : "gray"} />
                </div>
                <p className="text-xs text-[#888] mt-0.5">
                  {triggers[w.trigger] || w.trigger} <ChevronRight className="inline size-3" /> {actions[w.action] || w.action}
                </p>
                <p className="text-[10px] text-[#555] mt-0.5">Triggered {w.triggerCount || 0} times{w.lastTriggered ? ` • Last: ${new Date(w.lastTriggered).toLocaleDateString()}` : ""}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button onClick={() => updateWorkflow({ id: w._id, isActive: !w.isActive })} className={`p-1.5 rounded-sm ${w.isActive ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                {w.isActive ? <Pause className="size-4" /> : <Play className="size-4" />}
              </button>
              <button onClick={() => deleteWorkflow({ id: w._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      {(!workflows || workflows.length === 0) && <div className="text-center py-12 text-[#555]">No workflows yet. Automate your first task!</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  27. CONTACTS / SOURCE DATABASE TAB
// ═══════════════════════════════════════════════════════════
export function ContactsTab() {
  const contacts = useQuery(api.powerups.getContacts, {});
  const addContact = useMutation(api.powerups.addContact);
  const updateContact = useMutation(api.powerups.updateContact);
  const deleteContact = useMutation(api.powerups.deleteContact);

  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "source", organization: "", notes: "", tags: "" });

  const roleIcons: Record<string, string> = { source: "🗣", collaborator: "🤝", videographer: "📹", sponsor: "💰", venue: "📍", media: "📰", other: "👤" };

  const filtered = contacts?.filter((c: any) => {
    if (filter !== "all" && c.role !== filter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase()) && !(c.organization || "").toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  }) || [];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addContact({ ...form, email: form.email || undefined, phone: form.phone || undefined, organization: form.organization || undefined, notes: form.notes || undefined, tags: form.tags || undefined });
    setForm({ name: "", email: "", phone: "", role: "source", organization: "", notes: "", tags: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">CONTACTS DATABASE</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> Add Contact
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Total" value={contacts?.length || 0} icon={Users} />
        <StatMini label="Sources" value={contacts?.filter((c: any) => c.role === "source").length || 0} icon={MessageSquare} color="#3b82f6" />
        <StatMini label="Sponsors" value={contacts?.filter((c: any) => c.role === "sponsor").length || 0} icon={DollarSign} color="#22c55e" />
        <StatMini label="Follow-ups" value={contacts?.filter((c: any) => c.followUpDate).length || 0} icon={Clock} color="#ef4444" />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Name *" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
            <Select label="Role" value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
              {Object.entries(roleIcons).map(([k, v]) => <option key={k} value={k}>{v} {k.charAt(0).toUpperCase() + k.slice(1)}</option>)}
            </Select>
            <Input label="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
            <Input label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="(817) 555-0123" />
            <Input label="Organization" value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="Company/outlet" />
            <Input label="Tags" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="Comma-separated" />
            <div className="sm:col-span-2"><Input label="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="How you know them, context..." /></div>
            <div className="sm:col-span-2"><button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Save Contact</button></div>
          </form>
        </Card>
      )}

      <div className="flex gap-2 items-center flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-2.5 size-4 text-[#555]" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm pl-9 pr-3 py-2 text-sm text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none" placeholder="Search contacts..." />
        </div>
        {["all", "source", "collaborator", "sponsor", "videographer", "venue"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm ${filter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>{f}</button>
        ))}
      </div>

      {filtered.map((c: any) => (
        <Card key={c._id}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg">{roleIcons[c.role] || "👤"}</span>
                <span className="font-bold text-sm">{c.name}</span>
                <Badge text={c.role} color={c.role === "sponsor" ? "green" : c.role === "source" ? "blue" : "gold"} />
                {c.isFavorite && <Star className="size-3 text-[#D4A843]" fill="#D4A843" />}
              </div>
              {c.organization && <p className="text-xs text-[#D4A843] mt-0.5">{c.organization}</p>}
              <div className="flex gap-3 mt-1">
                {c.email && <span className="text-[10px] text-[#888]">✉ {c.email}</span>}
                {c.phone && <span className="text-[10px] text-[#888]">📞 {c.phone}</span>}
              </div>
              {c.notes && <p className="text-xs text-[#666] mt-1 italic">{c.notes}</p>}
              {c.followUpDate && <p className="text-[10px] text-yellow-400 mt-1">⏰ Follow up: {c.followUpDate}</p>}
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => updateContact({ id: c._id, isFavorite: !c.isFavorite })} className={c.isFavorite ? "text-[#D4A843]" : "text-[#555]"}><Star className="size-4" fill={c.isFavorite ? "#D4A843" : "none"} /></button>
              <button onClick={() => deleteContact({ id: c._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No contacts yet. Build your network!</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  28. STORY / ASSIGNMENT TRACKER TAB
// ═══════════════════════════════════════════════════════════
export function StoryTrackerTab() {
  const stories = useQuery(api.powerups.getStories, {});
  const addStory = useMutation(api.powerups.addStory);
  const updateStory = useMutation(api.powerups.updateStory);
  const deleteStory = useMutation(api.powerups.deleteStory);

  const [showForm, setShowForm] = useState(false);
  const [view, setView] = useState<"board" | "list">("board");
  const [form, setForm] = useState({ title: "", description: "", priority: "medium", source: "", location: "", dueDate: "", notes: "" });

  const statuses = ["lead", "researching", "filming", "editing", "published"];
  const statusEmojis: Record<string, string> = { lead: "💡", researching: "🔍", filming: "🎬", editing: "✂️", published: "✅", killed: "❌" };
  const priorityColors: Record<string, string> = { urgent: "red", high: "yellow", medium: "blue", low: "green" };

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addStory({ ...form, description: form.description || undefined, source: form.source || undefined, location: form.location || undefined, dueDate: form.dueDate || undefined, notes: form.notes || undefined });
    setForm({ title: "", description: "", priority: "medium", source: "", location: "", dueDate: "", notes: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">STORY TRACKER</h2>
        <div className="flex gap-2">
          <button onClick={() => setView(view === "board" ? "list" : "board")} className="px-3 py-2 text-xs text-[#888] border border-[#333] rounded-sm hover:border-[#D4A843]/30">
            {view === "board" ? "📋 List" : "📊 Board"}
          </button>
          <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
            <Plus className="size-4" /> New Story
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        {statuses.map((s) => (
          <StatMini key={s} label={s} value={stories?.filter((st: any) => st.status === s).length || 0} icon={BookOpen} color={s === "published" ? "#22c55e" : s === "filming" ? "#ef4444" : "#D4A843"} />
        ))}
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Story Title *" required value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="What's the story?" />
            <Select label="Priority" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
              <option value="urgent">🔴 Urgent</option>
              <option value="high">🟡 High</option>
              <option value="medium">🔵 Medium</option>
              <option value="low">🟢 Low</option>
            </Select>
            <Input label="Source / Tip" value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Who tipped it?" />
            <Input label="Location" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Fort Worth, TX" />
            <Input label="Due Date" type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} />
            <Input label="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief summary" />
            <div className="sm:col-span-2"><button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Create Story</button></div>
          </form>
        </Card>
      )}

      {/* Kanban Board View */}
      {view === "board" ? (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {statuses.map((status) => (
            <div key={status} className="bg-[#0a0a0a]/60 border border-[#333]/50 rounded-lg p-3">
              <h3 className="text-[10px] font-bold tracking-widest uppercase text-[#D4A843] mb-3 flex items-center gap-1">
                {statusEmojis[status]} {status} ({stories?.filter((s: any) => s.status === status).length || 0})
              </h3>
              <div className="space-y-2">
                {stories?.filter((s: any) => s.status === status).map((story: any) => (
                  <div key={story._id} className="bg-[#141414] border border-[#333]/30 rounded p-2.5 group">
                    <p className="font-bold text-xs">{story.title}</p>
                    <Badge text={story.priority} color={priorityColors[story.priority] || "gray"} />
                    {story.location && <p className="text-[9px] text-[#666] mt-1">📍 {story.location}</p>}
                    <div className="flex gap-1 mt-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      {statuses.indexOf(status) < statuses.length - 1 && (
                        <button onClick={() => updateStory({ id: story._id, status: statuses[statuses.indexOf(status) + 1] })} className="text-[9px] px-2 py-0.5 bg-[#D4A843]/20 text-[#D4A843] rounded">→ Next</button>
                      )}
                      <button onClick={() => deleteStory({ id: story._id })} className="text-[9px] px-2 py-0.5 text-red-400/60 hover:text-red-400">×</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        stories?.map((story: any) => (
          <Card key={story._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-bold text-sm">{story.title}</span>
                  <Badge text={story.status} color={story.status === "published" ? "green" : "gold"} />
                  <Badge text={story.priority} color={priorityColors[story.priority] || "gray"} />
                </div>
                {story.description && <p className="text-xs text-[#888] mt-1">{story.description}</p>}
                <div className="flex gap-3 mt-1">
                  {story.source && <span className="text-[10px] text-[#888]">🗣 {story.source}</span>}
                  {story.location && <span className="text-[10px] text-[#888]">📍 {story.location}</span>}
                  {story.dueDate && <span className="text-[10px] text-yellow-400">📅 Due: {story.dueDate}</span>}
                </div>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {story.status !== "published" && (
                  <button onClick={() => updateStory({ id: story._id, status: statuses[Math.min(statuses.indexOf(story.status) + 1, statuses.length - 1)] })} className="p-1.5 bg-[#D4A843]/20 text-[#D4A843] rounded-sm"><ChevronRight className="size-4" /></button>
                )}
                <button onClick={() => deleteStory({ id: story._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </Card>
        ))
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  29. MERCH FULFILLMENT TAB
// ═══════════════════════════════════════════════════════════
export function MerchFulfillmentTab() {
  const orders = useQuery(api.powerups.getMerchOrdersByStatus, {});
  const stats = useQuery(api.powerups.getMerchProductStats);
  const updateOrder = useMutation(api.powerups.updateMerchOrderStatus);

  const [filter, setFilter] = useState("all");
  const statusFlow = ["pending", "processing", "shipped", "delivered"];
  const statusColors: Record<string, string> = { pending: "yellow", processing: "blue", shipped: "purple", delivered: "green", refunded: "red", cancelled: "gray" };

  const filtered = orders?.filter((o: any) => filter === "all" || o.status === filter) || [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">MERCH FULFILLMENT</h2>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Total Orders" value={stats?.totalOrders || 0} icon={Package} />
        <StatMini label="Pending" value={stats?.pendingOrders || 0} icon={Clock} color="#eab308" />
        <StatMini label="Shipped" value={stats?.shippedOrders || 0} icon={Send} color="#a855f7" />
        <StatMini label="Revenue" value={`$${(stats?.totalRevenue || 0).toFixed(2)}`} icon={DollarSign} color="#22c55e" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        <StatMini label="Products" value={stats?.totalProducts || 0} icon={Tag} />
        <StatMini label="Active" value={stats?.activeProducts || 0} icon={Check} color="#22c55e" />
        <StatMini label="Low Stock" value={stats?.lowStock || 0} icon={AlertTriangle} color="#ef4444" />
      </div>

      <div className="flex gap-2 flex-wrap">
        {["all", ...statusFlow, "refunded"].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm ${filter === f ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>
            {f} ({f === "all" ? orders?.length || 0 : orders?.filter((o: any) => o.status === f).length || 0})
          </button>
        ))}
      </div>

      {filtered.map((order: any) => {
        const items = Array.isArray(order.items) ? order.items : [];
        return (
          <Card key={order._id}>
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-sm">{order.customerName}</span>
                  <Badge text={order.status} color={statusColors[order.status] || "gray"} />
                  <span className="text-xs text-[#D4A843] font-bold">${order.total?.toFixed(2)}</span>
                </div>
                {order.customerEmail && <p className="text-[10px] text-[#888] mt-0.5">✉ {order.customerEmail}</p>}
                <div className="mt-1">
                  {items.map((item: any, i: number) => (
                    <span key={i} className="text-[10px] text-[#ccc] mr-2">
                      {item.productName || item.name} {item.size ? `(${item.size})` : ""} ×{item.quantity}
                    </span>
                  ))}
                </div>
                {order.trackingNumber && <p className="text-[10px] text-blue-400 mt-1">📦 {order.trackingNumber}</p>}
                <p className="text-[10px] text-[#555] mt-1">{new Date(order.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-1.5 shrink-0">
                {statusFlow.indexOf(order.status) >= 0 && statusFlow.indexOf(order.status) < statusFlow.length - 1 && (
                  <button
                    onClick={() => updateOrder({ id: order._id, status: statusFlow[statusFlow.indexOf(order.status) + 1] })}
                    className="p-1.5 bg-[#D4A843]/20 text-[#D4A843] rounded-sm hover:bg-[#D4A843]/30"
                    title={`Move to ${statusFlow[statusFlow.indexOf(order.status) + 1]}`}
                  >
                    <ChevronRight className="size-4" />
                  </button>
                )}
              </div>
            </div>
          </Card>
        );
      })}
      {filtered.length === 0 && <div className="text-center py-12 text-[#555]">No orders to fulfill.</div>}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  30. AFFILIATE & PROMO CODE MANAGER TAB
// ═══════════════════════════════════════════════════════════
export function PromoCodesTab() {
  const codes = useQuery(api.powerups.getPromoCodes);
  const addCode = useMutation(api.powerups.addPromoCode);
  const updateCode = useMutation(api.powerups.updatePromoCode);
  const deleteCode = useMutation(api.powerups.deletePromoCode);

  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ code: "", type: "discount", discountPercent: "", partner: "", commissionPercent: "", expiresAt: "" });

  const totalRevenue = codes?.reduce((sum: number, c: any) => sum + (c.totalRevenue || 0), 0) || 0;
  const totalCommission = codes?.reduce((sum: number, c: any) => sum + (c.totalCommission || 0), 0) || 0;

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    await addCode({
      code: form.code.toUpperCase(),
      type: form.type,
      discountPercent: form.discountPercent ? parseFloat(form.discountPercent) : undefined,
      partner: form.partner || undefined,
      commissionPercent: form.commissionPercent ? parseFloat(form.commissionPercent) : undefined,
      expiresAt: form.expiresAt || undefined,
    });
    setForm({ code: "", type: "discount", discountPercent: "", partner: "", commissionPercent: "", expiresAt: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-display text-lg tracking-wider">PROMO CODES & AFFILIATES</h2>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-2 px-4 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
          <Plus className="size-4" /> New Code
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <StatMini label="Active Codes" value={codes?.filter((c: any) => c.isActive).length || 0} icon={Tag} />
        <StatMini label="Total Uses" value={codes?.reduce((sum: number, c: any) => sum + (c.totalUses || 0), 0) || 0} icon={TrendingUp} color="#3b82f6" />
        <StatMini label="Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} color="#22c55e" />
        <StatMini label="Commissions" value={`$${totalCommission.toFixed(2)}`} icon={DollarSign} color="#a855f7" />
      </div>

      {showForm && (
        <Card>
          <form onSubmit={handleAdd} className="grid sm:grid-cols-2 gap-3">
            <Input label="Promo Code *" required value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="3GMG20" />
            <Select label="Type" value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}>
              <option value="discount">🏷 Discount</option>
              <option value="affiliate">🤝 Affiliate</option>
              <option value="referral">📣 Referral</option>
            </Select>
            <Input label="Discount %" type="number" value={form.discountPercent} onChange={(e) => setForm({ ...form, discountPercent: e.target.value })} placeholder="20" />
            <Input label="Partner / Affiliate" value={form.partner} onChange={(e) => setForm({ ...form, partner: e.target.value })} placeholder="Sponsor name" />
            <Input label="Commission %" type="number" value={form.commissionPercent} onChange={(e) => setForm({ ...form, commissionPercent: e.target.value })} placeholder="10" />
            <Input label="Expires" type="date" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} />
            <div className="sm:col-span-2"><button type="submit" className="px-6 py-2 bg-[#D4A843] text-[#0a0a0a] text-xs font-bold tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">Create Code</button></div>
          </form>
        </Card>
      )}

      {codes?.map((code: any) => (
        <Card key={code._id}>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-[#D4A843]/10 border border-[#D4A843]/20 rounded px-3 py-2">
                <span className="font-mono font-bold text-[#D4A843] tracking-wider">{code.code}</span>
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <Badge text={code.type} color={code.type === "affiliate" ? "purple" : code.type === "referral" ? "blue" : "gold"} />
                  <Badge text={code.isActive ? "Active" : "Inactive"} color={code.isActive ? "green" : "gray"} />
                  {code.discountPercent && <span className="text-xs text-[#D4A843]">{code.discountPercent}% off</span>}
                </div>
                <div className="flex gap-3 mt-1">
                  {code.partner && <span className="text-[10px] text-[#888]">🤝 {code.partner}</span>}
                  <span className="text-[10px] text-[#888]">Used {code.totalUses || 0}×</span>
                  {code.totalRevenue ? <span className="text-[10px] text-green-400">${code.totalRevenue.toFixed(2)} revenue</span> : null}
                  {code.commissionPercent ? <span className="text-[10px] text-purple-400">{code.commissionPercent}% commission</span> : null}
                  {code.expiresAt && <span className="text-[10px] text-yellow-400">Expires: {code.expiresAt}</span>}
                </div>
              </div>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => navigator.clipboard.writeText(code.code)} className="p-1.5 bg-[#333]/50 text-[#888] rounded-sm hover:text-[#ccc]" title="Copy code"><Copy className="size-4" /></button>
              <button onClick={() => updateCode({ id: code._id, isActive: !code.isActive })} className={`p-1.5 rounded-sm ${code.isActive ? "bg-yellow-500/20 text-yellow-400" : "bg-green-500/20 text-green-400"}`}>
                {code.isActive ? <Pause className="size-4" /> : <Play className="size-4" />}
              </button>
              <button onClick={() => deleteCode({ id: code._id })} className="text-red-400/50 hover:text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        </Card>
      ))}
      {(!codes || codes.length === 0) && <div className="text-center py-12 text-[#555]">No promo codes yet.</div>}
    </div>
  );
}
