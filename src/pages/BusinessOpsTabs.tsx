/**
 * Business Operations v2 — Admin Tab Components
 * Invoice Generator, Media Releases, Content Calendar, Team Management, Memberships
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  FileText, DollarSign, Users, Calendar, Crown, Plus, Trash2,
  CheckCircle, Clock, AlertTriangle, UserPlus, Star,
  Film, Youtube, Instagram, Facebook, Video, Globe,
} from "lucide-react";

/* ─── Shared helpers ─── */
function StatCard({ icon: Icon, label, value, sub, color = "gold" }: {
  icon: any; label: string; value: string | number; sub?: string;
  color?: "gold" | "green" | "red" | "blue" | "purple" | "gray";
}) {
  const colors: Record<string, string> = {
    gold: "border-[#D4A843]/20 text-[#D4A843]", green: "border-green-500/20 text-green-400",
    red: "border-red-500/20 text-red-400", blue: "border-blue-500/20 text-blue-400",
    purple: "border-purple-500/20 text-purple-400", gray: "border-[#555]/20 text-[#888078]",
  };
  return (
    <div className={`border rounded-lg bg-[#141414]/80 p-4 ${colors[color]}`}>
      <div className="flex items-center gap-2 mb-2">
        <Icon className="size-4 opacity-60" />
        <span className="text-xs text-[#888078] uppercase tracking-wider">{label}</span>
      </div>
      <p className="text-2xl font-bold text-[#f0ece4]">{value}</p>
      {sub && <p className="text-xs text-[#888078] mt-1">{sub}</p>}
    </div>
  );
}
function Badge({ text, color = "gold" }: { text: string; color?: string }) {
  const c: Record<string, string> = {
    gold: "bg-[#D4A843]/20 text-[#D4A843]", green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400", blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400", gray: "bg-[#333] text-[#888078]",
    orange: "bg-orange-500/20 text-orange-400",
  };
  return <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${c[color] || c.gray}`}>{text}</span>;
}
function EmptyState({ message }: { message: string }) {
  return <div className="px-6 py-12 text-center text-[#888078] text-sm">{message}</div>;
}
function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
      <div className="divide-y divide-[#D4A843]/5 max-h-[500px] overflow-y-auto">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  INVOICE GENERATOR
// ═══════════════════════════════════════════════════════════

export function InvoiceTab() {
  const invoices = useQuery(api.businessOps.getInvoices, {});
  const stats = useQuery(api.businessOps.getInvoiceStats);
  const nextNum = useQuery(api.businessOps.getNextInvoiceNumber);
  const addInvoice = useMutation(api.businessOps.addInvoice);
  const updateInvoice = useMutation(api.businessOps.updateInvoice);
  const deleteInvoice = useMutation(api.businessOps.deleteInvoice);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ clientName: "", clientEmail: "", clientCompany: "", notes: "", dueDate: "" });
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0, amount: 0 }]);

  const updateItem = (idx: number, field: string, val: string) => {
    const next = [...items];
    (next[idx] as any)[field] = field === "description" ? val : parseFloat(val) || 0;
    next[idx].amount = next[idx].quantity * next[idx].rate;
    setItems(next);
  };

  const handleAdd = async () => {
    if (!form.clientName || items.every((i) => !i.description)) return;
    const validItems = items.filter((i) => i.description);
    const subtotal = validItems.reduce((s, i) => s + i.amount, 0);
    await addInvoice({
      invoiceNumber: nextNum || `3GMG-${Date.now()}`,
      clientName: form.clientName,
      clientEmail: form.clientEmail || undefined,
      clientCompany: form.clientCompany || undefined,
      items: validItems, subtotal, total: subtotal,
      status: "draft",
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: form.dueDate || new Date(Date.now() + 30 * 86400000).toISOString().slice(0, 10),
      notes: form.notes || undefined,
    });
    setForm({ clientName: "", clientEmail: "", clientCompany: "", notes: "", dueDate: "" });
    setItems([{ description: "", quantity: 1, rate: 0, amount: 0 }]);
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Invoices" value={stats?.total || 0} color="gold" />
        <StatCard icon={DollarSign} label="Revenue Collected" value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} color="green" />
        <StatCard icon={Clock} label="Pending" value={`$${(stats?.pendingAmount || 0).toLocaleString()}`} sub={`${stats?.pendingCount || 0} invoices`} color="blue" />
        <StatCard icon={AlertTriangle} label="Overdue" value={`$${(stats?.overdueAmount || 0).toLocaleString()}`} sub={`${stats?.overdueCount || 0} invoices`} color="red" />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Invoices</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
          <Plus className="size-3" /> New Invoice
        </button>
      </div>

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <p className="text-xs text-[#D4A843] font-bold tracking-wider">INVOICE #{nextNum}</p>
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Client name *" value={form.clientName} onChange={(e) => setForm({ ...form, clientName: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Client email" value={form.clientEmail} onChange={(e) => setForm({ ...form, clientEmail: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Company" value={form.clientCompany} onChange={(e) => setForm({ ...form, clientCompany: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <p className="text-xs text-[#888078] uppercase tracking-wider">Line Items</p>
          {items.map((item, idx) => (
            <div key={idx} className="grid grid-cols-12 gap-2">
              <input placeholder="Description" value={item.description} onChange={(e) => updateItem(idx, "description", e.target.value)} className="col-span-5 bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              <input type="number" placeholder="Qty" value={item.quantity || ""} onChange={(e) => updateItem(idx, "quantity", e.target.value)} className="col-span-2 bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              <input type="number" placeholder="Rate" value={item.rate || ""} onChange={(e) => updateItem(idx, "rate", e.target.value)} className="col-span-2 bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              <span className="col-span-2 flex items-center text-sm text-[#D4A843] font-bold">${item.amount.toFixed(2)}</span>
              {items.length > 1 && (
                <button onClick={() => setItems(items.filter((_, i) => i !== idx))} className="col-span-1 text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
              )}
            </div>
          ))}
          <button onClick={() => setItems([...items, { description: "", quantity: 1, rate: 0, amount: 0 }])} className="text-xs text-[#D4A843] hover:text-[#E8C767]">+ Add line item</button>
          <div className="flex items-center justify-between border-t border-[#333] pt-3">
            <div className="flex gap-2">
              <input type="date" placeholder="Due date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              <input placeholder="Notes" value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            </div>
            <div className="flex items-center gap-3">
              <span className="text-lg font-bold text-[#D4A843]">Total: ${items.reduce((s, i) => s + i.amount, 0).toFixed(2)}</span>
              <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Create</button>
              <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
            </div>
          </div>
        </div>
      )}

      <TableWrapper>
        {invoices && invoices.length > 0 ? invoices.map((inv: any) => (
          <div key={inv._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
            <div>
              <p className="text-sm text-[#f0ece4]">{inv.invoiceNumber} — {inv.clientName} {inv.clientCompany ? `(${inv.clientCompany})` : ""}</p>
              <p className="text-[10px] text-[#888078]">{inv.items.length} items · Issued {inv.issueDate} · Due {inv.dueDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-[#D4A843]">${inv.total.toLocaleString()}</span>
              <select value={inv.status} onChange={(e) => updateInvoice({ id: inv._id, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-2 py-1 text-[10px] text-[#f0ece4]">
                <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => deleteInvoice({ id: inv._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        )) : <EmptyState message="No invoices yet. Create your first branded invoice!" />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MEDIA RELEASES / WAIVERS
// ═══════════════════════════════════════════════════════════

export function WaiversTab() {
  const waivers = useQuery(api.businessOps.getWaivers, {});
  const stats = useQuery(api.businessOps.getWaiverStats);
  const addWaiver = useMutation(api.businessOps.addWaiver);
  const updateWaiver = useMutation(api.businessOps.updateWaiver);
  const deleteWaiver = useMutation(api.businessOps.deleteWaiver);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "media-release", guestName: "", guestEmail: "", guestPhone: "", episodeTitle: "", locationFilmed: "", dateFilmed: "" });

  const handleAdd = async () => {
    if (!form.guestName) return;
    await addWaiver({
      type: form.type, guestName: form.guestName,
      guestEmail: form.guestEmail || undefined, guestPhone: form.guestPhone || undefined,
      episodeTitle: form.episodeTitle || undefined, locationFilmed: form.locationFilmed || undefined,
      dateFilmed: form.dateFilmed || undefined,
    });
    setForm({ type: "media-release", guestName: "", guestEmail: "", guestPhone: "", episodeTitle: "", locationFilmed: "", dateFilmed: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={FileText} label="Total Waivers" value={stats?.total || 0} color="gold" />
        <StatCard icon={CheckCircle} label="Signed" value={stats?.signed || 0} color="green" />
        <StatCard icon={Clock} label="Pending" value={stats?.pending || 0} color="blue" />
        <StatCard icon={AlertTriangle} label="Expired" value={stats?.expired || 0} color="red" />
      </div>

      <div className="flex items-center justify-between">
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Media Releases & Waivers</h3>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
          <Plus className="size-3" /> New Waiver
        </button>
      </div>

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="media-release">Media Release</option><option value="interview-consent">Interview Consent</option>
              <option value="filming-permit">Filming Permit</option><option value="liability-waiver">Liability Waiver</option>
              <option value="nda">NDA</option>
            </select>
            <input placeholder="Guest / Signee name *" value={form.guestName} onChange={(e) => setForm({ ...form, guestName: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Email" value={form.guestEmail} onChange={(e) => setForm({ ...form, guestEmail: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input placeholder="Episode title" value={form.episodeTitle} onChange={(e) => setForm({ ...form, episodeTitle: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Location filmed" value={form.locationFilmed} onChange={(e) => setForm({ ...form, locationFilmed: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input type="date" value={form.dateFilmed} onChange={(e) => setForm({ ...form, dateFilmed: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Create Waiver</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      <TableWrapper>
        {waivers && waivers.length > 0 ? waivers.map((w: any) => (
          <div key={w._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-[#D4A843]/60" />
              <div>
                <p className="text-sm text-[#f0ece4]">{w.guestName} — {w.type.replace(/-/g, " ")}</p>
                <p className="text-[10px] text-[#888078]">{w.episodeTitle || "No episode"} · {w.locationFilmed || "No location"} · {w.dateFilmed || "No date"}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {w.signedAt && <span className="text-[10px] text-[#888078]">Signed {new Date(w.signedAt).toLocaleDateString()}</span>}
              <select value={w.status} onChange={(e) => updateWaiver({ id: w._id, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-2 py-1 text-[10px] text-[#f0ece4]">
                <option value="pending">Pending</option><option value="signed">Signed</option><option value="expired">Expired</option><option value="revoked">Revoked</option>
              </select>
              <button onClick={() => deleteWaiver({ id: w._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        )) : <EmptyState message="No waivers yet. Create release forms for interviews and street reporting." />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  CONTENT SCHEDULE (Multi-Platform Calendar)
// ═══════════════════════════════════════════════════════════

export function ContentScheduleTab() {
  const [currentMonth, setCurrentMonth] = useState(new Date().toISOString().slice(0, 7));
  const schedule = useQuery(api.businessOps.getContentSchedule, { month: currentMonth });
  const stats = useQuery(api.businessOps.getContentScheduleStats);
  const addItem = useMutation(api.businessOps.addScheduleItem);
  const updateItem = useMutation(api.businessOps.updateScheduleItem);
  const deleteItem = useMutation(api.businessOps.deleteScheduleItem);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", platform: "youtube", contentType: "video", status: "idea", scheduledDate: "", scheduledTime: "", assignee: "", notes: "" });

  const handleAdd = async () => {
    if (!form.title || !form.scheduledDate) return;
    await addItem({ ...form, scheduledTime: form.scheduledTime || undefined, assignee: form.assignee || undefined, notes: form.notes || undefined });
    setForm({ title: "", platform: "youtube", contentType: "video", status: "idea", scheduledDate: "", scheduledTime: "", assignee: "", notes: "" });
    setShowForm(false);
  };

  const platformIcons: Record<string, any> = { youtube: Youtube, instagram: Instagram, facebook: Facebook, tiktok: Video, website: Globe, all: Globe };
  const platformColors: Record<string, string> = { youtube: "text-red-400", instagram: "text-pink-400", facebook: "text-blue-400", tiktok: "text-cyan-400", twitter: "text-sky-400", website: "text-[#D4A843]", all: "text-[#D4A843]" };

  // Build calendar grid
  const year = parseInt(currentMonth.slice(0, 4));
  const month = parseInt(currentMonth.slice(5, 7)) - 1;
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const days = Array.from({ length: 42 }, (_, i) => {
    const day = i - firstDay + 1;
    return day > 0 && day <= daysInMonth ? day : null;
  });

  const prevMonth = () => {
    const d = new Date(year, month - 1, 1);
    setCurrentMonth(d.toISOString().slice(0, 7));
  };
  const nextMonth = () => {
    const d = new Date(year, month + 1, 1);
    setCurrentMonth(d.toISOString().slice(0, 7));
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Calendar} label="Total Scheduled" value={stats?.total || 0} color="gold" />
        <StatCard icon={Clock} label="Upcoming" value={stats?.upcoming || 0} color="blue" />
        <StatCard icon={Film} label="Platforms" value={Object.keys(stats?.byPlatform || {}).length} color="purple" />
        <StatCard icon={CheckCircle} label="Posted" value={stats?.byStatus?.posted || 0} color="green" />
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button onClick={prevMonth} className="text-[#888078] hover:text-[#f0ece4] text-lg">‹</button>
          <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">
            {new Date(year, month).toLocaleDateString("en", { month: "long", year: "numeric" })}
          </h3>
          <button onClick={nextMonth} className="text-[#888078] hover:text-[#f0ece4] text-lg">›</button>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
          <Plus className="size-3" /> Add Content
        </button>
      </div>

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input placeholder="Content title *" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="col-span-2 bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.platform} onChange={(e) => setForm({ ...form, platform: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="youtube">YouTube</option><option value="tiktok">TikTok</option><option value="instagram">Instagram</option>
              <option value="facebook">Facebook</option><option value="twitter">Twitter</option><option value="website">Website</option><option value="all">All Platforms</option>
            </select>
            <select value={form.contentType} onChange={(e) => setForm({ ...form, contentType: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="video">Video</option><option value="short">Short</option><option value="reel">Reel</option><option value="story">Story</option>
              <option value="post">Post</option><option value="live">Live</option><option value="blog">Blog</option><option value="podcast">Podcast</option>
            </select>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <input type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input type="time" value={form.scheduledTime} onChange={(e) => setForm({ ...form, scheduledTime: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="idea">Idea</option><option value="filming">Filming</option><option value="editing">Editing</option><option value="scheduled">Scheduled</option><option value="posted">Posted</option>
            </select>
            <input placeholder="Assignee" value={form.assignee} onChange={(e) => setForm({ ...form, assignee: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      {/* Calendar Grid */}
      <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
        <div className="grid grid-cols-7 text-center text-[10px] text-[#888078] uppercase tracking-wider border-b border-[#D4A843]/10">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
            <div key={d} className="py-2">{d}</div>
          ))}
        </div>
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const dateStr = day ? `${currentMonth}-${String(day).padStart(2, "0")}` : "";
            const dayItems = schedule?.filter((s: any) => s.scheduledDate === dateStr) || [];
            const isToday = dateStr === new Date().toISOString().slice(0, 10);
            return (
              <div key={i} className={`min-h-[70px] border-b border-r border-[#D4A843]/5 p-1 ${!day ? "bg-[#0a0a0a]/50" : ""} ${isToday ? "bg-[#D4A843]/5" : ""}`}>
                {day && (
                  <>
                    <span className={`text-[10px] ${isToday ? "text-[#D4A843] font-bold" : "text-[#888078]"}`}>{day}</span>
                    <div className="space-y-0.5 mt-0.5">
                      {dayItems.slice(0, 3).map((item: any) => {
                        const PIcon = platformIcons[item.platform] || Globe;
                        return (
                          <div key={item._id} className="flex items-center gap-0.5 text-[8px] bg-[#0a0a0a] rounded px-1 py-0.5 truncate">
                            <PIcon className={`size-2.5 ${platformColors[item.platform] || "text-[#888078]"}`} />
                            <span className="text-[#f0ece4] truncate">{item.title}</span>
                          </div>
                        );
                      })}
                      {dayItems.length > 3 && <span className="text-[8px] text-[#888078]">+{dayItems.length - 3} more</span>}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* List view */}
      <TableWrapper>
        {schedule && schedule.length > 0 ? schedule.map((s: any) => {
          const PIcon = platformIcons[s.platform] || Globe;
          return (
            <div key={s._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-center gap-3">
                <PIcon className={`size-5 ${platformColors[s.platform] || "text-[#888078]"}`} />
                <div>
                  <p className="text-sm text-[#f0ece4]">{s.title}</p>
                  <p className="text-[10px] text-[#888078]">{s.contentType} · {s.scheduledDate} {s.scheduledTime || ""} {s.assignee ? `· ${s.assignee}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge text={s.platform} color={s.platform === "youtube" ? "red" : s.platform === "instagram" ? "purple" : "blue"} />
                <select value={s.status} onChange={(e) => updateItem({ id: s._id, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-2 py-1 text-[10px] text-[#f0ece4]">
                  <option value="idea">Idea</option><option value="filming">Filming</option><option value="editing">Editing</option><option value="scheduled">Scheduled</option><option value="posted">Posted</option><option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => deleteItem({ id: s._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          );
        }) : <EmptyState message="No content scheduled for this month." />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  TEAM / CREW MANAGEMENT
// ═══════════════════════════════════════════════════════════

export function TeamTab() {
  const members = useQuery(api.businessOps.getTeamMembers, {});
  const stats = useQuery(api.businessOps.getTeamStats);
  const entries = useQuery(api.businessOps.getTimeEntries, {});
  const addMember = useMutation(api.businessOps.addTeamMember);
  const deleteMember = useMutation(api.businessOps.deleteTeamMember);
  const addEntry = useMutation(api.businessOps.addTimeEntry);
  const updateEntry = useMutation(api.businessOps.updateTimeEntry);
  const deleteEntry = useMutation(api.businessOps.deleteTimeEntry);
  const [tab, setTab] = useState<"members" | "time">("members");
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [showTimeForm, setShowTimeForm] = useState(false);
  const [mForm, setMForm] = useState({ name: "", role: "editor", email: "", phone: "", rate: "", rateType: "hourly" });
  const [tForm, setTForm] = useState({ memberId: "", date: new Date().toISOString().slice(0, 10), hours: "", description: "", project: "" });

  const handleAddMember = async () => {
    if (!mForm.name) return;
    await addMember({ name: mForm.name, role: mForm.role, email: mForm.email || undefined, phone: mForm.phone || undefined, rate: mForm.rate ? parseFloat(mForm.rate) : undefined, rateType: mForm.rateType, isActive: true });
    setMForm({ name: "", role: "editor", email: "", phone: "", rate: "", rateType: "hourly" });
    setShowMemberForm(false);
  };

  const handleAddTime = async () => {
    if (!tForm.memberId || !tForm.hours || !tForm.description) return;
    const member = members?.find((m: any) => m._id === tForm.memberId);
    const hrs = parseFloat(tForm.hours);
    const amount = member?.rate ? member.rate * hrs : undefined;
    await addEntry({ teamMemberId: tForm.memberId as any, date: tForm.date, hours: hrs, description: tForm.description, project: tForm.project || undefined, amount });
    setTForm({ memberId: "", date: new Date().toISOString().slice(0, 10), hours: "", description: "", project: "" });
    setShowTimeForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Active Members" value={stats?.activeMembers || 0} sub={`${stats?.totalMembers || 0} total`} color="gold" />
        <StatCard icon={Clock} label="Total Hours" value={stats?.totalHours?.toFixed(1) || 0} color="blue" />
        <StatCard icon={DollarSign} label="Unpaid" value={`$${(stats?.unpaidAmount || 0).toLocaleString()}`} sub={`${stats?.unpaidEntries || 0} entries`} color="red" />
        <StatCard icon={Star} label="Roles" value={new Set(members?.map((m: any) => m.role) || []).size} color="purple" />
      </div>

      <div className="flex gap-2">
        {(["members", "time"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${tab === t ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] hover:text-[#f0ece4] border border-[#333]"}`}>
            {t === "members" ? "Crew" : "Time Log"}
          </button>
        ))}
      </div>

      {tab === "members" && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Crew Members</h3>
            <button onClick={() => setShowMemberForm(!showMemberForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
              <UserPlus className="size-3" /> Add
            </button>
          </div>
          {showMemberForm && (
            <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input placeholder="Name *" value={mForm.name} onChange={(e) => setMForm({ ...mForm, name: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <select value={mForm.role} onChange={(e) => setMForm({ ...mForm, role: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
                  <option value="editor">Editor</option><option value="cameraman">Cameraman</option><option value="producer">Producer</option>
                  <option value="social-manager">Social Manager</option><option value="designer">Designer</option><option value="writer">Writer</option><option value="other">Other</option>
                </select>
                <input placeholder="Email" value={mForm.email} onChange={(e) => setMForm({ ...mForm, email: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              </div>
              <div className="flex gap-3">
                <input type="number" placeholder="Rate ($)" value={mForm.rate} onChange={(e) => setMForm({ ...mForm, rate: e.target.value })} className="w-24 bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <select value={mForm.rateType} onChange={(e) => setMForm({ ...mForm, rateType: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
                  <option value="hourly">Per Hour</option><option value="per-project">Per Project</option><option value="salary">Salary</option>
                </select>
                <button onClick={handleAddMember} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Save</button>
                <button onClick={() => setShowMemberForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
              </div>
            </div>
          )}
          <TableWrapper>
            {members && members.length > 0 ? members.map((m: any) => (
              <div key={m._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4A843]/10 flex items-center justify-center text-[#D4A843] text-xs font-bold">{m.name.charAt(0)}</div>
                  <div>
                    <p className="text-sm text-[#f0ece4]">{m.name}</p>
                    <p className="text-[10px] text-[#888078]">{m.role} {m.rate ? `· $${m.rate}/${m.rateType === "hourly" ? "hr" : m.rateType}` : ""}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge text={m.isActive ? "Active" : "Inactive"} color={m.isActive ? "green" : "gray"} />
                  <button onClick={() => deleteMember({ id: m._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
            )) : <EmptyState message="No crew members yet." />}
          </TableWrapper>
        </>
      )}

      {tab === "time" && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Time Log</h3>
            <button onClick={() => setShowTimeForm(!showTimeForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
              <Plus className="size-3" /> Log Time
            </button>
          </div>
          {showTimeForm && (
            <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <select value={tForm.memberId} onChange={(e) => setTForm({ ...tForm, memberId: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
                  <option value="">Select crew member</option>
                  {members?.map((m: any) => <option key={m._id} value={m._id}>{m.name}</option>)}
                </select>
                <input type="date" value={tForm.date} onChange={(e) => setTForm({ ...tForm, date: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <input type="number" step="0.5" placeholder="Hours" value={tForm.hours} onChange={(e) => setTForm({ ...tForm, hours: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <input placeholder="Project" value={tForm.project} onChange={(e) => setTForm({ ...tForm, project: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              </div>
              <div className="flex gap-2">
                <input placeholder="Description *" value={tForm.description} onChange={(e) => setTForm({ ...tForm, description: e.target.value })} className="flex-1 bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <button onClick={handleAddTime} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Log</button>
              </div>
            </div>
          )}
          <TableWrapper>
            {entries && entries.length > 0 ? entries.map((e: any) => {
              const member = members?.find((m: any) => m._id === e.teamMemberId);
              return (
                <div key={e._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
                  <div>
                    <p className="text-sm text-[#f0ece4]">{member?.name || "Unknown"} — {e.description}</p>
                    <p className="text-[10px] text-[#888078]">{e.date} · {e.hours}h {e.project ? `· ${e.project}` : ""}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {e.amount && <span className="text-sm font-bold text-[#D4A843]">${e.amount.toFixed(2)}</span>}
                    <select value={e.status} onChange={(ev) => updateEntry({ id: e._id, status: ev.target.value })} className="bg-[#141414] border border-[#333] rounded px-2 py-1 text-[10px] text-[#f0ece4]">
                      <option value="logged">Logged</option><option value="approved">Approved</option><option value="paid">Paid</option>
                    </select>
                    <button onClick={() => deleteEntry({ id: e._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              );
            }) : <EmptyState message="No time entries yet." />}
          </TableWrapper>
        </>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  MEMBERSHIP / VIP TIER SYSTEM
// ═══════════════════════════════════════════════════════════

export function MembershipTab() {
  const tiers = useQuery(api.businessOps.getMembershipTiers, {});
  const allMembers = useQuery(api.businessOps.getMembers, {});
  const stats = useQuery(api.businessOps.getMembershipStats);
  const addTier = useMutation(api.businessOps.addMembershipTier);
  const deleteTier = useMutation(api.businessOps.deleteMembershipTier);
  const addMember = useMutation(api.businessOps.addMember);
  const updateMember = useMutation(api.businessOps.updateMember);
  const deleteMember = useMutation(api.businessOps.deleteMember);
  const [tab, setTab] = useState<"tiers" | "members">("tiers");
  const [showTierForm, setShowTierForm] = useState(false);
  const [showMemberForm, setShowMemberForm] = useState(false);
  const [tierForm, setTierForm] = useState({ name: "", price: "", description: "", perks: "", color: "#D4A843" });
  const [memForm, setMemForm] = useState({ name: "", email: "", tierId: "", startDate: new Date().toISOString().slice(0, 10) });

  const handleAddTier = async () => {
    if (!tierForm.name || !tierForm.price) return;
    const perks = tierForm.perks.split("\n").map((p) => p.trim()).filter(Boolean);
    await addTier({ name: tierForm.name, price: parseFloat(tierForm.price), description: tierForm.description, perks, color: tierForm.color, isActive: true, order: (tiers?.length || 0) + 1 });
    setTierForm({ name: "", price: "", description: "", perks: "", color: "#D4A843" });
    setShowTierForm(false);
  };

  const handleAddMember = async () => {
    if (!memForm.name || !memForm.email || !memForm.tierId) return;
    await addMember({ name: memForm.name, email: memForm.email, tierId: memForm.tierId as any, startDate: memForm.startDate });
    setMemForm({ name: "", email: "", tierId: "", startDate: new Date().toISOString().slice(0, 10) });
    setShowMemberForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Crown} label="Active Members" value={stats?.activeMembers || 0} sub={`${stats?.totalMembers || 0} total`} color="gold" />
        <StatCard icon={DollarSign} label="MRR" value={`$${(stats?.mrr || 0).toLocaleString()}`} sub="Monthly recurring" color="green" />
        <StatCard icon={Star} label="Active Tiers" value={stats?.totalTiers || 0} color="purple" />
        <StatCard icon={DollarSign} label="Total Revenue" value={`$${(stats?.totalRevenue || 0).toLocaleString()}`} color="blue" />
      </div>

      <div className="flex gap-2">
        {(["tiers", "members"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${tab === t ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] hover:text-[#f0ece4] border border-[#333]"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "tiers" && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Membership Tiers</h3>
            <button onClick={() => setShowTierForm(!showTierForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
              <Plus className="size-3" /> New Tier
            </button>
          </div>
          {showTierForm && (
            <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
              <div className="grid grid-cols-3 gap-3">
                <input placeholder="Tier name (e.g., Inner Circle)" value={tierForm.name} onChange={(e) => setTierForm({ ...tierForm, name: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <input type="number" placeholder="Monthly price ($)" value={tierForm.price} onChange={(e) => setTierForm({ ...tierForm, price: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <input type="color" value={tierForm.color} onChange={(e) => setTierForm({ ...tierForm, color: e.target.value })} className="bg-[#141414] border border-[#333] rounded h-10 w-full" />
              </div>
              <input placeholder="Description" value={tierForm.description} onChange={(e) => setTierForm({ ...tierForm, description: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              <textarea placeholder="Perks (one per line)" rows={3} value={tierForm.perks} onChange={(e) => setTierForm({ ...tierForm, perks: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4] resize-none" />
              <div className="flex gap-2">
                <button onClick={handleAddTier} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Create Tier</button>
                <button onClick={() => setShowTierForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tiers?.map((tier: any) => {
              const memberCount = allMembers?.filter((m: any) => m.tierId === tier._id && m.status === "active").length || 0;
              return (
                <div key={tier._id} className="border rounded-lg bg-[#0a0a0a] p-4 space-y-3" style={{ borderColor: tier.color + "40" }}>
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="w-3 h-3 rounded-full mb-2" style={{ backgroundColor: tier.color }} />
                      <h4 className="font-display text-lg text-[#f0ece4] tracking-wider">{tier.name}</h4>
                      <p className="text-2xl font-bold" style={{ color: tier.color }}>${tier.price}<span className="text-xs text-[#888078]">/mo</span></p>
                    </div>
                    <button onClick={() => deleteTier({ id: tier._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
                  </div>
                  <p className="text-xs text-[#888078]">{tier.description}</p>
                  <ul className="space-y-1">
                    {tier.perks.map((p: string, i: number) => (
                      <li key={i} className="flex items-center gap-2 text-xs text-[#f0ece4]">
                        <CheckCircle className="size-3 text-green-400" />{p}
                      </li>
                    ))}
                  </ul>
                  <p className="text-[10px] text-[#888078]">{memberCount} active member{memberCount !== 1 ? "s" : ""}</p>
                </div>
              );
            })}
            {(!tiers || tiers.length === 0) && (
              <div className="col-span-full text-center py-8 text-[#888078] text-sm">No tiers yet. Create your first membership tier!</div>
            )}
          </div>
        </>
      )}

      {tab === "members" && (
        <>
          <div className="flex items-center justify-between">
            <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Members</h3>
            <button onClick={() => setShowMemberForm(!showMemberForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767]">
              <Plus className="size-3" /> Add Member
            </button>
          </div>
          {showMemberForm && (
            <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <input placeholder="Name *" value={memForm.name} onChange={(e) => setMemForm({ ...memForm, name: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <input placeholder="Email *" value={memForm.email} onChange={(e) => setMemForm({ ...memForm, email: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <select value={memForm.tierId} onChange={(e) => setMemForm({ ...memForm, tierId: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
                  <option value="">Select tier</option>
                  {tiers?.map((t: any) => <option key={t._id} value={t._id}>{t.name} (${t.price}/mo)</option>)}
                </select>
                <input type="date" value={memForm.startDate} onChange={(e) => setMemForm({ ...memForm, startDate: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              </div>
              <div className="flex gap-2">
                <button onClick={handleAddMember} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Add</button>
                <button onClick={() => setShowMemberForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
              </div>
            </div>
          )}
          <TableWrapper>
            {allMembers && allMembers.length > 0 ? allMembers.map((m: any) => {
              const tier = tiers?.find((t: any) => t._id === m.tierId);
              return (
                <div key={m._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
                  <div className="flex items-center gap-3">
                    <Crown className="size-5" style={{ color: tier?.color || "#D4A843" }} />
                    <div>
                      <p className="text-sm text-[#f0ece4]">{m.name}</p>
                      <p className="text-[10px] text-[#888078]">{m.email} · {tier?.name || "Unknown tier"} · Since {m.startDate}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {m.totalPaid > 0 && <span className="text-xs text-[#D4A843]">${m.totalPaid} paid</span>}
                    <select value={m.status} onChange={(e) => updateMember({ id: m._id, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-2 py-1 text-[10px] text-[#f0ece4]">
                      <option value="active">Active</option><option value="paused">Paused</option><option value="cancelled">Cancelled</option><option value="expired">Expired</option>
                    </select>
                    <button onClick={() => deleteMember({ id: m._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
                  </div>
                </div>
              );
            }) : <EmptyState message="No members yet. They'll appear here as people join your membership program." />}
          </TableWrapper>
        </>
      )}
    </div>
  );
}
