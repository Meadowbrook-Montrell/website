import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";
import {
  Plus, Trash2, Music, ShoppingBag, DollarSign, Play,
  Eye, EyeOff, Star, ExternalLink, Edit, Save, X,
  BarChart3, TrendingUp, Download, Disc3, Clock, Hash,
} from "lucide-react";

// ─── Shared Components ──────────────────────────────────────
const Card = ({ children, className = "" }: { children: React.ReactNode; className?: string }) => (
  <div className={`bg-[#1a1816]/80 border border-[#2a2622] rounded-xl p-5 ${className}`}>{children}</div>
);

const Badge = ({ children, color = "gold" }: { children: React.ReactNode; color?: string }) => {
  const colors: Record<string, string> = {
    gold: "bg-[#D4A843]/10 text-[#D4A843] border-[#D4A843]/20",
    green: "bg-green-500/10 text-green-400 border-green-500/20",
    red: "bg-red-500/10 text-red-400 border-red-500/20",
    blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
    gray: "bg-[#2a2622] text-[#888] border-[#333]",
  };
  return (
    <span className={`text-[9px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-full border ${colors[color] || colors.gold}`}>
      {children}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════
//  MUSIC STORE ADMIN TAB
// ═══════════════════════════════════════════════════════════
export function MusicStoreAdminTab() {
  const items = useQuery(api.musicStore.getAllStoreItems);
  const stats = useQuery(api.musicStore.getStoreStats);
  const purchases = useQuery(api.musicStore.getPurchases);
  const addItem = useMutation(api.musicStore.addStoreItem);
  const updateItem = useMutation(api.musicStore.updateStoreItem);
  const deleteItem = useMutation(api.musicStore.deleteStoreItem);

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<Id<"musicStoreItems"> | null>(null);
  const [view, setView] = useState<"items" | "purchases">("items");

  // Form state
  const [title, setTitle] = useState("");
  const [artistName, setArtistName] = useState("");
  const [itemType, setItemType] = useState("single");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [genre, setGenre] = useState("");
  const [coverArtUrl, setCoverArtUrl] = useState("");
  const [previewAudioUrl, setPreviewAudioUrl] = useState("");
  const [fullAudioUrl, setFullAudioUrl] = useState("");
  const [downloadUrl, setDownloadUrl] = useState("");
  const [duration, setDuration] = useState("");
  const [bpm, setBpm] = useState("");
  const [musicalKey, setMusicalKey] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [trackNumber, setTrackNumber] = useState("");
  const [albumId, setAlbumId] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [isFeatured, setIsFeatured] = useState(false);
  const [tags, setTags] = useState("");
  const [spotifyUrl, setSpotifyUrl] = useState("");
  const [appleMusicUrl, setAppleMusicUrl] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const resetForm = () => {
    setTitle(""); setArtistName(""); setItemType("single"); setPrice("");
    setDescription(""); setGenre(""); setCoverArtUrl(""); setPreviewAudioUrl("");
    setFullAudioUrl(""); setDownloadUrl(""); setDuration(""); setBpm("");
    setMusicalKey(""); setReleaseDate(""); setTrackNumber(""); setAlbumId("");
    setIsActive(true); setIsFeatured(false); setTags("");
    setSpotifyUrl(""); setAppleMusicUrl(""); setYoutubeUrl("");
    setEditingId(null); setShowForm(false);
  };

  const handleEdit = (item: any) => {
    setTitle(item.title); setArtistName(item.artistName); setItemType(item.itemType);
    setPrice(item.price.toString()); setDescription(item.description || "");
    setGenre(item.genre || ""); setCoverArtUrl(item.coverArtUrl || "");
    setPreviewAudioUrl(item.previewAudioUrl || ""); setFullAudioUrl(item.fullAudioUrl || "");
    setDownloadUrl(item.downloadUrl || ""); setDuration(item.duration || "");
    setBpm(item.bpm?.toString() || ""); setMusicalKey(item.key || "");
    setReleaseDate(item.releaseDate || ""); setTrackNumber(item.trackNumber?.toString() || "");
    setAlbumId(item.albumId || ""); setIsActive(item.isActive);
    setIsFeatured(item.isFeatured || false); setTags(item.tags?.join(", ") || "");
    setSpotifyUrl(item.streamingLinks?.spotify || "");
    setAppleMusicUrl(item.streamingLinks?.appleMusic || "");
    setYoutubeUrl(item.streamingLinks?.youtube || "");
    setEditingId(item._id); setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !artistName.trim() || !price) return;

    const data: any = {
      title: title.trim(),
      artistName: artistName.trim(),
      itemType,
      price: parseFloat(price),
      isActive,
    };
    if (description) data.description = description;
    if (genre) data.genre = genre;
    if (coverArtUrl) data.coverArtUrl = coverArtUrl;
    if (previewAudioUrl) data.previewAudioUrl = previewAudioUrl;
    if (fullAudioUrl) data.fullAudioUrl = fullAudioUrl;
    if (downloadUrl) data.downloadUrl = downloadUrl;
    if (duration) data.duration = duration;
    if (bpm) data.bpm = parseInt(bpm);
    if (musicalKey) data.key = musicalKey;
    if (releaseDate) data.releaseDate = releaseDate;
    if (trackNumber) data.trackNumber = parseInt(trackNumber);
    if (albumId) data.albumId = albumId as Id<"musicStoreItems">;
    if (isFeatured) data.isFeatured = true;
    if (tags) data.tags = tags.split(",").map((t: string) => t.trim()).filter(Boolean);
    if (spotifyUrl || appleMusicUrl || youtubeUrl) {
      data.streamingLinks = {};
      if (spotifyUrl) data.streamingLinks.spotify = spotifyUrl;
      if (appleMusicUrl) data.streamingLinks.appleMusic = appleMusicUrl;
      if (youtubeUrl) data.streamingLinks.youtube = youtubeUrl;
    }

    if (editingId) {
      await updateItem({ id: editingId, ...data });
    } else {
      await addItem(data);
    }
    resetForm();
  };

  const albums = (items ?? []).filter(i => i.itemType === "album" || i.itemType === "ep");

  const inputCls = "w-full bg-[#0d0c0b] border border-[#2a2622] rounded-lg px-3 py-2.5 text-sm text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843]/50 focus:outline-none transition-colors";
  const labelCls = "text-[10px] font-bold tracking-widest uppercase text-[#888] mb-1.5 block";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl tracking-wider text-[#f0ece4]">Music Store</h2>
          <p className="text-xs text-[#888078] mt-1">Manage digital downloads, previews & sales</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/music" target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-xs text-[#D4A843] hover:text-[#E8C767] transition-colors">
            <ExternalLink className="size-3.5" /> View Store
          </a>
          <button onClick={() => { resetForm(); setShowForm(true); }}
            className="flex items-center gap-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs px-4 py-2.5 rounded-lg hover:bg-[#E8C767] transition-colors">
            <Plus className="size-4" /> Add Item
          </button>
        </div>
      </div>

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Music, label: "Active Items", value: stats.activeItems, color: "text-[#D4A843]" },
            { icon: Disc3, label: "Albums", value: stats.albums, color: "text-purple-400" },
            { icon: DollarSign, label: "Revenue", value: `$${stats.totalRevenue.toFixed(2)}`, color: "text-green-400" },
            { icon: Download, label: "Sales", value: stats.totalSales, color: "text-blue-400" },
          ].map((s, i) => (
            <Card key={i}>
              <div className="flex items-center gap-3">
                <s.icon className={`size-5 ${s.color}`} />
                <div>
                  <p className="font-display text-2xl text-[#f0ece4]">{s.value}</p>
                  <p className="text-[10px] text-[#888] tracking-widest uppercase">{s.label}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* View Toggle */}
      <div className="flex gap-2">
        {(["items", "purchases"] as const).map(v => (
          <button key={v} onClick={() => setView(v)}
            className={`text-xs font-bold tracking-wider uppercase px-4 py-2 rounded-lg transition-colors ${
              view === v ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#1a1816] text-[#888] hover:text-[#f0ece4] border border-[#2a2622]"
            }`}>
            {v === "items" ? "Store Items" : "Purchases"}
          </button>
        ))}
      </div>

      {/* Add/Edit Form */}
      {showForm && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">
              {editingId ? "Edit Item" : "Add New Item"}
            </h3>
            <button onClick={resetForm} className="text-[#888] hover:text-red-400"><X className="size-5" /></button>
          </div>

          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className={labelCls}>Title *</label>
              <input className={inputCls} value={title} onChange={e => setTitle(e.target.value)} placeholder="Track or Album name" />
            </div>
            <div>
              <label className={labelCls}>Artist *</label>
              <input className={inputCls} value={artistName} onChange={e => setArtistName(e.target.value)} placeholder="Artist name" />
            </div>
            <div>
              <label className={labelCls}>Type</label>
              <select className={inputCls} value={itemType} onChange={e => setItemType(e.target.value)}>
                <option value="single">Single</option>
                <option value="album">Album</option>
                <option value="ep">EP</option>
                <option value="beat">Beat</option>
              </select>
            </div>
            <div>
              <label className={labelCls}>Price ($) *</label>
              <input className={inputCls} type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} placeholder="0.99" />
            </div>
            <div>
              <label className={labelCls}>Genre</label>
              <input className={inputCls} value={genre} onChange={e => setGenre(e.target.value)} placeholder="Hip-Hop, R&B..." />
            </div>
            <div>
              <label className={labelCls}>Duration</label>
              <input className={inputCls} value={duration} onChange={e => setDuration(e.target.value)} placeholder="3:42" />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelCls}>Description</label>
            <textarea className={`${inputCls} h-20 resize-none`} value={description} onChange={e => setDescription(e.target.value)} placeholder="About this track/album..." />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelCls}>Cover Art URL</label>
              <input className={inputCls} value={coverArtUrl} onChange={e => setCoverArtUrl(e.target.value)} placeholder="https://..." />
            </div>
            <div>
              <label className={labelCls}>30s Preview Audio URL</label>
              <input className={inputCls} value={previewAudioUrl} onChange={e => setPreviewAudioUrl(e.target.value)} placeholder="https://...preview.mp3" />
            </div>
            <div>
              <label className={labelCls}>Full Audio URL</label>
              <input className={inputCls} value={fullAudioUrl} onChange={e => setFullAudioUrl(e.target.value)} placeholder="https://...full.mp3" />
            </div>
            <div>
              <label className={labelCls}>Download/Purchase URL</label>
              <input className={inputCls} value={downloadUrl} onChange={e => setDownloadUrl(e.target.value)} placeholder="https://...purchase-link" />
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className={labelCls}>BPM</label>
              <input className={inputCls} type="number" value={bpm} onChange={e => setBpm(e.target.value)} placeholder="120" />
            </div>
            <div>
              <label className={labelCls}>Key</label>
              <input className={inputCls} value={musicalKey} onChange={e => setMusicalKey(e.target.value)} placeholder="C minor" />
            </div>
            <div>
              <label className={labelCls}>Release Date</label>
              <input className={inputCls} type="date" value={releaseDate} onChange={e => setReleaseDate(e.target.value)} />
            </div>
          </div>

          {/* Album linking */}
          {(itemType === "single" || itemType === "beat") && albums.length > 0 && (
            <div className="grid md:grid-cols-2 gap-4 mt-4">
              <div>
                <label className={labelCls}>Parent Album (optional)</label>
                <select className={inputCls} value={albumId} onChange={e => setAlbumId(e.target.value)}>
                  <option value="">— Standalone —</option>
                  {albums.map(a => <option key={a._id} value={a._id}>{a.title} ({a.artistName})</option>)}
                </select>
              </div>
              <div>
                <label className={labelCls}>Track Number</label>
                <input className={inputCls} type="number" value={trackNumber} onChange={e => setTrackNumber(e.target.value)} placeholder="1" />
              </div>
            </div>
          )}

          {/* Streaming links */}
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div>
              <label className={labelCls}>Spotify URL</label>
              <input className={inputCls} value={spotifyUrl} onChange={e => setSpotifyUrl(e.target.value)} placeholder="https://open.spotify.com/..." />
            </div>
            <div>
              <label className={labelCls}>Apple Music URL</label>
              <input className={inputCls} value={appleMusicUrl} onChange={e => setAppleMusicUrl(e.target.value)} placeholder="https://music.apple.com/..." />
            </div>
            <div>
              <label className={labelCls}>YouTube URL</label>
              <input className={inputCls} value={youtubeUrl} onChange={e => setYoutubeUrl(e.target.value)} placeholder="https://youtube.com/..." />
            </div>
          </div>

          <div className="mt-4">
            <label className={labelCls}>Tags (comma-separated)</label>
            <input className={inputCls} value={tags} onChange={e => setTags(e.target.value)} placeholder="#hiphop, #trap, #808, #dark" />
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-6 mt-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isActive} onChange={e => setIsActive(e.target.checked)}
                className="accent-[#D4A843] size-4" />
              <span className="text-sm text-[#f0ece4]">Active in store</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)}
                className="accent-[#D4A843] size-4" />
              <span className="text-sm text-[#f0ece4]">Featured</span>
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-6">
            <button onClick={resetForm}
              className="text-sm text-[#888] hover:text-[#f0ece4] px-4 py-2 transition-colors">Cancel</button>
            <button onClick={handleSubmit}
              className="flex items-center gap-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm px-6 py-2.5 rounded-lg hover:bg-[#E8C767] transition-colors">
              <Save className="size-4" /> {editingId ? "Update" : "Add to Store"}
            </button>
          </div>
        </Card>
      )}

      {/* Items List */}
      {view === "items" && (
        <div className="space-y-3">
          {!items && (
            <div className="text-center py-12 text-[#888]">
              <Disc3 className="size-8 mx-auto mb-3 animate-spin text-[#D4A843]/30" style={{ animationDuration: "2s" }} />
              Loading...
            </div>
          )}
          {items && items.length === 0 && (
            <Card className="text-center py-12">
              <Music className="size-12 text-[#D4A843]/20 mx-auto mb-3" />
              <p className="text-[#888] text-sm">No items in the store yet</p>
              <p className="text-[#555] text-xs mt-1">Click "Add Item" to list your first track or album</p>
            </Card>
          )}
          {items && items.map((item) => (
            <Card key={item._id} className={`${!item.isActive ? "opacity-60" : ""}`}>
              <div className="flex items-center gap-4">
                {/* Cover */}
                <div className="size-16 shrink-0 rounded-lg overflow-hidden bg-[#0d0c0b]">
                  {item.coverArtUrl ? (
                    <img src={item.coverArtUrl} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="size-6 text-[#D4A843]/20" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="font-display text-base text-[#f0ece4] tracking-wider">{item.title}</h4>
                    <Badge color={item.itemType === "album" ? "purple" : item.itemType === "ep" ? "blue" : item.itemType === "beat" ? "gold" : "green"}>
                      {item.itemType}
                    </Badge>
                    {item.isFeatured && <Badge color="gold"><Star className="size-2.5 inline mr-0.5" />Featured</Badge>}
                    {!item.isActive && <Badge color="red">Hidden</Badge>}
                  </div>
                  <p className="text-xs text-[#888] mt-0.5">{item.artistName}</p>
                  <div className="flex items-center gap-4 mt-1 text-[10px] text-[#666]">
                    {item.genre && <span>{item.genre}</span>}
                    {item.duration && <span className="flex items-center gap-1"><Clock className="size-2.5" />{item.duration}</span>}
                    {item.previewAudioUrl && <span className="text-green-400">✓ Preview</span>}
                    {item.downloadUrl && <span className="text-blue-400">✓ Download</span>}
                    {(item.playCount ?? 0) > 0 && <span className="flex items-center gap-1"><Play className="size-2.5" />{item.playCount} plays</span>}
                    {(item.purchaseCount ?? 0) > 0 && <span className="flex items-center gap-1"><Download className="size-2.5" />{item.purchaseCount} sold</span>}
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <p className="font-display text-xl text-[#D4A843]">${item.price.toFixed(2)}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <button onClick={() => updateItem({ id: item._id, isActive: !item.isActive })}
                    className="p-2 text-[#888] hover:text-[#D4A843] transition-colors" title={item.isActive ? "Hide" : "Show"}>
                    {item.isActive ? <Eye className="size-4" /> : <EyeOff className="size-4" />}
                  </button>
                  <button onClick={() => handleEdit(item)}
                    className="p-2 text-[#888] hover:text-[#D4A843] transition-colors">
                    <Edit className="size-4" />
                  </button>
                  <button onClick={() => { if (confirm(`Delete "${item.title}"?`)) deleteItem({ id: item._id }); }}
                    className="p-2 text-[#888] hover:text-red-400 transition-colors">
                    <Trash2 className="size-4" />
                  </button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Purchases List */}
      {view === "purchases" && (
        <div className="space-y-3">
          {!purchases && <div className="text-center py-12 text-[#888]">Loading...</div>}
          {purchases && purchases.length === 0 && (
            <Card className="text-center py-12">
              <ShoppingBag className="size-12 text-[#D4A843]/20 mx-auto mb-3" />
              <p className="text-[#888] text-sm">No purchases yet</p>
            </Card>
          )}
          {purchases && purchases.map((p) => (
            <Card key={p._id}>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-medium text-[#f0ece4]">{p.itemTitle}</h4>
                  <p className="text-xs text-[#888] mt-0.5">{p.artistName} • {p.customerEmail}</p>
                  {p.customerName && <p className="text-xs text-[#666]">{p.customerName}</p>}
                </div>
                <div className="text-right">
                  <p className="font-display text-lg text-green-400">${p.amount.toFixed(2)}</p>
                  <Badge color={p.status === "completed" ? "green" : p.status === "refunded" ? "red" : "gold"}>
                    {p.status}
                  </Badge>
                </div>
              </div>
              <p className="text-[10px] text-[#555] mt-2">{new Date(p.createdAt).toLocaleString()}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
