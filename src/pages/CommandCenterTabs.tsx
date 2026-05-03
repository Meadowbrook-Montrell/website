/**
 * Command Center v2 — Admin Tab Components
 * Financial Dashboard, Merch Store, Email Campaigns, Contracts,
 * Tasks, Podcast RSS, Analytics, Brand Kit, Notifications
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  DollarSign, TrendingUp, TrendingDown, ShoppingBag, Package,
  Mail, Send, FileText, FolderOpen, CheckSquare, Square, Clock,
  Podcast, BarChart3, Palette, Bell, Plus, Trash2, Edit, Eye,
  ArrowUp, ArrowDown, AlertTriangle, CheckCircle, XCircle, MessageSquare,
} from "lucide-react";

// ─── Shared helpers ─────────────────────────────────────────

function StatCard({ icon: Icon, label, value, sub, color = "gold" }: {
  icon: any; label: string; value: string | number; sub?: string;
  color?: "gold" | "green" | "red" | "blue" | "purple" | "gray";
}) {
  const colors = {
    gold: "border-[#D4A843]/20 text-[#D4A843]",
    green: "border-green-500/20 text-green-400",
    red: "border-red-500/20 text-red-400",
    blue: "border-blue-500/20 text-blue-400",
    purple: "border-purple-500/20 text-purple-400",
    gray: "border-[#555]/20 text-[#888078]",
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

function SectionHeader({ title, onAdd }: { title: string; onAdd?: () => void }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">{title}</h3>
      {onAdd && (
        <button onClick={onAdd} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
          <Plus className="size-3" /> Add
        </button>
      )}
    </div>
  );
}

function Badge({ text, color = "gold" }: { text: string; color?: string }) {
  const c: Record<string, string> = {
    gold: "bg-[#D4A843]/20 text-[#D4A843]",
    green: "bg-green-500/20 text-green-400",
    red: "bg-red-500/20 text-red-400",
    blue: "bg-blue-500/20 text-blue-400",
    purple: "bg-purple-500/20 text-purple-400",
    gray: "bg-[#333] text-[#888078]",
    orange: "bg-orange-500/20 text-orange-400",
  };
  return <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded ${c[color] || c.gray}`}>{text}</span>;
}

function statusColor(s: string): string {
  const map: Record<string, string> = {
    paid: "green", received: "green", signed: "green", done: "green", sent: "green",
    delivered: "green", active: "green", published: "green", confirmed: "green", shipped: "blue",
    pending: "orange", draft: "gray", "in-progress": "blue", review: "purple", planned: "blue",
    overdue: "red", expired: "red", cancelled: "red", declined: "red",
    todo: "gray", negotiating: "purple", inquiry: "blue",
  };
  return map[s] || "gray";
}

function TableWrapper({ children }: { children: React.ReactNode }) {
  return (
    <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 overflow-hidden">
      <div className="divide-y divide-[#D4A843]/5 max-h-[500px] overflow-y-auto">
        {children}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-6 py-12 text-center text-[#888078] text-sm">{message}</div>
  );
}

// ═══════════════════════════════════════════════════════════
//  11. FINANCIAL DASHBOARD
// ═══════════════════════════════════════════════════════════

export function FinancialTab() {
  const stats = useQuery(api.commandCenter.getFinancialStats);
  const finances = useQuery(api.commandCenter.getFinances, {});
  const addFinance = useMutation(api.commandCenter.addFinance);
  const deleteFinance = useMutation(api.commandCenter.deleteFinance);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ type: "income", category: "sponsorship", amount: "", description: "", date: new Date().toISOString().slice(0, 10), status: "paid" });

  const handleAdd = async () => {
    if (!form.description || !form.amount) return;
    await addFinance({ ...form, amount: parseFloat(form.amount) });
    setForm({ type: "income", category: "sponsorship", amount: "", description: "", date: new Date().toISOString().slice(0, 10), status: "paid" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={TrendingUp} label="Total Income" value={`$${(stats?.totalIncome || 0).toLocaleString()}`} color="green" />
        <StatCard icon={TrendingDown} label="Total Expenses" value={`$${(stats?.totalExpenses || 0).toLocaleString()}`} color="red" />
        <StatCard icon={DollarSign} label="Net Profit" value={`$${(stats?.netProfit || 0).toLocaleString()}`} color={stats?.netProfit && stats.netProfit >= 0 ? "gold" : "red"} />
        <StatCard icon={FileText} label="Pending Invoices" value={stats?.pendingInvoiceCount || 0} sub={`$${(stats?.pendingAmount || 0).toLocaleString()} outstanding`} color="blue" />
      </div>

      {/* Monthly Chart */}
      {stats?.monthly && (
        <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-4">
          <h4 className="text-xs text-[#888078] uppercase tracking-wider mb-3">6-Month Overview</h4>
          <div className="flex items-end gap-2 h-32">
            {stats.monthly.map((m) => {
              const max = Math.max(...stats.monthly.map((x) => Math.max(x.income, x.expenses)), 1);
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex gap-0.5 items-end" style={{ height: "100px" }}>
                    <div className="flex-1 bg-green-500/40 rounded-t" style={{ height: `${(m.income / max) * 100}%`, minHeight: m.income > 0 ? "4px" : "0" }} />
                    <div className="flex-1 bg-red-500/40 rounded-t" style={{ height: `${(m.expenses / max) * 100}%`, minHeight: m.expenses > 0 ? "4px" : "0" }} />
                  </div>
                  <span className="text-[9px] text-[#888078]">{m.month.slice(5)}</span>
                </div>
              );
            })}
          </div>
          <div className="flex gap-4 mt-2 justify-center">
            <span className="flex items-center gap-1 text-[10px] text-[#888078]"><span className="w-2 h-2 bg-green-500/40 rounded" /> Income</span>
            <span className="flex items-center gap-1 text-[10px] text-[#888078]"><span className="w-2 h-2 bg-red-500/40 rounded" /> Expenses</span>
          </div>
        </div>
      )}

      <SectionHeader title="Transactions" onAdd={() => setShowForm(!showForm)} />

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="income">Income</option><option value="expense">Expense</option><option value="invoice">Invoice</option>
            </select>
            <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="sponsorship">Sponsorship</option><option value="merch">Merch</option><option value="ad-revenue">Ad Revenue</option>
              <option value="brand-deal">Brand Deal</option><option value="equipment">Equipment</option><option value="software">Software</option>
              <option value="travel">Travel</option><option value="marketing">Marketing</option><option value="other">Other</option>
            </select>
            <input type="number" placeholder="Amount" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          <div className="flex gap-2">
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="paid">Paid</option><option value="pending">Pending</option><option value="overdue">Overdue</option>
            </select>
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767] transition-all">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      <TableWrapper>
        {finances && finances.length > 0 ? finances.map((f: any) => (
          <div key={f._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-3">
              {f.type === "income" ? <ArrowUp className="size-4 text-green-400" /> : f.type === "expense" ? <ArrowDown className="size-4 text-red-400" /> : <FileText className="size-4 text-blue-400" />}
              <div>
                <p className="text-sm text-[#f0ece4]">{f.description}</p>
                <p className="text-[10px] text-[#888078]">{f.date} · {f.category}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className={`text-sm font-bold ${f.type === "expense" ? "text-red-400" : "text-green-400"}`}>
                {f.type === "expense" ? "-" : "+"}${f.amount.toLocaleString()}
              </span>
              <Badge text={f.status} color={statusColor(f.status)} />
              <button onClick={() => deleteFinance({ id: f._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        )) : <EmptyState message="No transactions yet. Add income, expenses, or invoices to track your finances." />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  12. MERCH STORE MANAGER
// ═══════════════════════════════════════════════════════════

export function MerchTab() {
  const products = useQuery(api.commandCenter.getMerchProducts, {});
  const orders = useQuery(api.commandCenter.getMerchOrders, {});
  const addProduct = useMutation(api.commandCenter.addMerchProduct);
  const deleteProduct = useMutation(api.commandCenter.deleteMerchProduct);
  const updateOrder = useMutation(api.commandCenter.updateMerchOrder);
  const deleteOrder = useMutation(api.commandCenter.deleteMerchOrder);
  const [tab, setTab] = useState<"products" | "orders">("products");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", price: "", category: "hoodie", description: "", stock: "0", isActive: true, imageUrl: "", externalUrl: "" });

  const handleAddProduct = async () => {
    if (!form.name || !form.price) return;
    await addProduct({ name: form.name, price: parseFloat(form.price), category: form.category, description: form.description || undefined, stock: parseInt(form.stock) || 0, isActive: form.isActive, imageUrl: form.imageUrl || undefined, externalUrl: form.externalUrl || undefined });
    setForm({ name: "", price: "", category: "hoodie", description: "", stock: "0", isActive: true, imageUrl: "", externalUrl: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={ShoppingBag} label="Products" value={products?.length || 0} sub={`${products?.filter((p: any) => p.isActive).length || 0} active`} color="gold" />
        <StatCard icon={Package} label="Pending Orders" value={orders?.filter((o: any) => o.status === "pending").length || 0} color="blue" />
        <StatCard icon={DollarSign} label="Revenue" value={`$${(orders?.reduce((s: number, o: any) => s + o.total, 0) || 0).toLocaleString()}`} color="green" />
        <StatCard icon={TrendingUp} label="Total Orders" value={orders?.length || 0} color="purple" />
      </div>

      <div className="flex gap-2">
        {(["products", "orders"] as const).map((t) => (
          <button key={t} onClick={() => setTab(t)} className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all ${tab === t ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] hover:text-[#f0ece4] border border-[#333]"}`}>
            {t}
          </button>
        ))}
      </div>

      {tab === "products" && (
        <>
          <SectionHeader title="Products" onAdd={() => setShowForm(!showForm)} />
          {showForm && (
            <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <input placeholder="Product name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <input type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
                  <option value="hoodie">Hoodie</option><option value="tshirt">T-Shirt</option><option value="hat">Hat</option><option value="accessory">Accessory</option><option value="other">Other</option>
                </select>
              </div>
              <input placeholder="Image URL (optional)" value={form.imageUrl} onChange={(e) => setForm({ ...form, imageUrl: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              <input placeholder="Purchase link (optional)" value={form.externalUrl} onChange={(e) => setForm({ ...form, externalUrl: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
              <div className="flex gap-2">
                <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-24 bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
                <button onClick={handleAddProduct} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767] transition-all">Save</button>
                <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
              </div>
            </div>
          )}
          <TableWrapper>
            {products && products.length > 0 ? products.map((p: any) => (
              <div key={p._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
                <div className="flex items-center gap-3">
                  {p.imageUrl ? <img src={p.imageUrl} alt="" className="w-10 h-10 rounded object-cover" /> : <ShoppingBag className="size-10 text-[#333] p-2 bg-[#1a1a1a] rounded" />}
                  <div>
                    <p className="text-sm text-[#f0ece4]">{p.name}</p>
                    <p className="text-[10px] text-[#888078]">{p.category} · Stock: {p.stock ?? "∞"}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-[#D4A843]">${p.price}</span>
                  <Badge text={p.isActive ? "Active" : "Inactive"} color={p.isActive ? "green" : "gray"} />
                  <button onClick={() => deleteProduct({ id: p._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
            )) : <EmptyState message="No products yet. Add your first merch item!" />}
          </TableWrapper>
        </>
      )}

      {tab === "orders" && (
        <TableWrapper>
          {orders && orders.length > 0 ? orders.map((o: any) => (
            <div key={o._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div>
                <p className="text-sm text-[#f0ece4]">{o.customerName} — {o.items.length} item(s)</p>
                <p className="text-[10px] text-[#888078]">{o.customerEmail} · {new Date(o.createdAt).toLocaleDateString()}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm font-bold text-[#D4A843]">${o.total}</span>
                <select value={o.status} onChange={(e) => updateOrder({ id: o._id, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-2 py-1 text-[10px] text-[#f0ece4]">
                  <option value="pending">Pending</option><option value="confirmed">Confirmed</option><option value="shipped">Shipped</option><option value="delivered">Delivered</option><option value="cancelled">Cancelled</option>
                </select>
                <button onClick={() => deleteOrder({ id: o._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          )) : <EmptyState message="No orders yet." />}
        </TableWrapper>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  13. EMAIL CAMPAIGN BUILDER
// ═══════════════════════════════════════════════════════════

export function EmailCampaignTab() {
  const campaigns = useQuery(api.commandCenter.getEmailCampaigns, {});
  const subscribers = useQuery(api.admin.listSubscribers);
  const addCampaign = useMutation(api.commandCenter.addEmailCampaign);
  const sendCampaign = useMutation(api.commandCenter.sendEmailCampaign);
  const deleteCampaign = useMutation(api.commandCenter.deleteEmailCampaign);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", subject: "", body: "", template: "newsletter" });

  const handleAdd = async () => {
    if (!form.name || !form.subject) return;
    await addCampaign({ ...form, status: "draft" });
    setForm({ name: "", subject: "", body: "", template: "newsletter" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Mail} label="Total Campaigns" value={campaigns?.length || 0} color="gold" />
        <StatCard icon={Send} label="Sent" value={campaigns?.filter((c: any) => c.status === "sent").length || 0} color="green" />
        <StatCard icon={Edit} label="Drafts" value={campaigns?.filter((c: any) => c.status === "draft").length || 0} color="gray" />
        <StatCard icon={Bell} label="Subscribers" value={subscribers?.length || 0} sub="Total audience" color="blue" />
      </div>

      <SectionHeader title="Campaigns" onAdd={() => setShowForm(!showForm)} />

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Campaign name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.template} onChange={(e) => setForm({ ...form, template: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="new-episode">New Episode</option><option value="live-alert">Live Alert</option><option value="merch-drop">Merch Drop</option><option value="newsletter">Newsletter</option><option value="custom">Custom</option>
            </select>
          </div>
          <input placeholder="Email subject line" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          <textarea placeholder="Email body..." rows={4} value={form.body} onChange={(e) => setForm({ ...form, body: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4] resize-none" />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767] transition-all">Save Draft</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      <TableWrapper>
        {campaigns && campaigns.length > 0 ? campaigns.map((c: any) => (
          <div key={c._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
            <div>
              <p className="text-sm text-[#f0ece4]">{c.name}</p>
              <p className="text-[10px] text-[#888078]">Subject: {c.subject} · {c.template}</p>
            </div>
            <div className="flex items-center gap-2">
              {c.recipientCount && <span className="text-[10px] text-[#888078]">{c.recipientCount} recipients</span>}
              <Badge text={c.status} color={statusColor(c.status)} />
              {c.status === "draft" && (
                <button onClick={() => sendCampaign({ id: c._id })} className="px-2 py-1 bg-green-600/20 text-green-400 text-[10px] font-bold uppercase rounded hover:bg-green-600/30 transition-all">
                  <Send className="size-3 inline mr-1" />Send
                </button>
              )}
              <button onClick={() => deleteCampaign({ id: c._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        )) : <EmptyState message="No campaigns yet. Create your first email blast!" />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  14. CONTRACTS & DOCUMENT VAULT
// ═══════════════════════════════════════════════════════════

export function DocumentsTab() {
  const documents = useQuery(api.commandCenter.getDocuments, {});
  const addDocument = useMutation(api.commandCenter.addDocument);
  const updateDocument = useMutation(api.commandCenter.updateDocument);
  const deleteDocument = useMutation(api.commandCenter.deleteDocument);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", type: "contract", status: "draft", partyName: "", description: "", expiresAt: "" });

  const handleAdd = async () => {
    if (!form.title) return;
    await addDocument({ title: form.title, type: form.type, status: form.status, partyName: form.partyName || undefined, description: form.description || undefined, expiresAt: form.expiresAt || undefined });
    setForm({ title: "", type: "contract", status: "draft", partyName: "", description: "", expiresAt: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={FolderOpen} label="Total Documents" value={documents?.length || 0} color="gold" />
        <StatCard icon={CheckCircle} label="Signed" value={documents?.filter((d: any) => d.status === "signed").length || 0} color="green" />
        <StatCard icon={Clock} label="Pending" value={documents?.filter((d: any) => d.status === "sent" || d.status === "draft").length || 0} color="blue" />
        <StatCard icon={AlertTriangle} label="Expired" value={documents?.filter((d: any) => d.status === "expired").length || 0} color="red" />
      </div>

      <SectionHeader title="Documents" onAdd={() => setShowForm(!showForm)} />

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <input placeholder="Document title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="contract">Contract</option><option value="agreement">Agreement</option><option value="release">Release</option>
              <option value="nda">NDA</option><option value="invoice">Invoice</option><option value="receipt">Receipt</option><option value="other">Other</option>
            </select>
            <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="draft">Draft</option><option value="sent">Sent</option><option value="signed">Signed</option><option value="expired">Expired</option>
            </select>
          </div>
          <input placeholder="Party name (guest, sponsor, etc)" value={form.partyName} onChange={(e) => setForm({ ...form, partyName: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          <textarea placeholder="Description / notes" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4] resize-none" />
          <div className="flex gap-2">
            <input type="date" placeholder="Expires" value={form.expiresAt} onChange={(e) => setForm({ ...form, expiresAt: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767] transition-all">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      <TableWrapper>
        {documents && documents.length > 0 ? documents.map((d: any) => (
          <div key={d._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-3">
              <FileText className="size-5 text-[#D4A843]/60" />
              <div>
                <p className="text-sm text-[#f0ece4]">{d.title}</p>
                <p className="text-[10px] text-[#888078]">{d.type} {d.partyName ? `· ${d.partyName}` : ""} · {new Date(d.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {d.expiresAt && <span className="text-[10px] text-[#888078]">Exp: {d.expiresAt}</span>}
              <select value={d.status} onChange={(e) => updateDocument({ id: d._id, status: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-2 py-1 text-[10px] text-[#f0ece4]">
                <option value="draft">Draft</option><option value="sent">Sent</option><option value="signed">Signed</option><option value="expired">Expired</option><option value="cancelled">Cancelled</option>
              </select>
              <button onClick={() => deleteDocument({ id: d._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        )) : <EmptyState message="No documents yet. Add contracts, agreements, or releases." />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  15. TASK & PROJECT BOARD
// ═══════════════════════════════════════════════════════════

export function TasksTab() {
  const tasks = useQuery(api.commandCenter.getTasks, {});
  void useQuery(api.commandCenter.getProjects);
  const addTask = useMutation(api.commandCenter.addTask);
  const updateTask = useMutation(api.commandCenter.updateTask);
  const deleteTask = useMutation(api.commandCenter.deleteTask);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", project: "", priority: "medium", dueDate: "" });
  const [viewMode, setViewMode] = useState<"board" | "list">("board");

  const handleAdd = async () => {
    if (!form.title) return;
    await addTask({ title: form.title, description: form.description || undefined, project: form.project || undefined, status: "todo", priority: form.priority, dueDate: form.dueDate || undefined });
    setForm({ title: "", description: "", project: "", priority: "medium", dueDate: "" });
    setShowForm(false);
  };

  const columns = ["todo", "in-progress", "review", "done"];
  const columnLabels: Record<string, string> = { "todo": "To Do", "in-progress": "In Progress", "review": "Review", "done": "Done" };
  const columnColors: Record<string, string> = { "todo": "border-[#555]", "in-progress": "border-blue-500/40", "review": "border-purple-500/40", "done": "border-green-500/40" };
  const priorityColors: Record<string, string> = { urgent: "red", high: "orange", medium: "gold", low: "gray" };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={CheckSquare} label="Completed" value={tasks?.filter((t: any) => t.status === "done").length || 0} color="green" />
        <StatCard icon={Clock} label="In Progress" value={tasks?.filter((t: any) => t.status === "in-progress").length || 0} color="blue" />
        <StatCard icon={Square} label="To Do" value={tasks?.filter((t: any) => t.status === "todo").length || 0} color="gold" />
        <StatCard icon={AlertTriangle} label="Urgent" value={tasks?.filter((t: any) => t.priority === "urgent").length || 0} color="red" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex gap-2">
          <button onClick={() => setViewMode("board")} className={`px-3 py-1.5 text-xs font-bold uppercase rounded ${viewMode === "board" ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>Board</button>
          <button onClick={() => setViewMode("list")} className={`px-3 py-1.5 text-xs font-bold uppercase rounded ${viewMode === "list" ? "bg-[#D4A843] text-[#0a0a0a]" : "bg-[#141414] text-[#888078] border border-[#333]"}`}>List</button>
        </div>
        <button onClick={() => setShowForm(!showForm)} className="flex items-center gap-1.5 px-3 py-1.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
          <Plus className="size-3" /> Add Task
        </button>
      </div>

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <input placeholder="Task title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Project (optional)" value={form.project} onChange={(e) => setForm({ ...form, project: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="low">Low</option><option value="medium">Medium</option><option value="high">High</option><option value="urgent">Urgent</option>
            </select>
            <input type="date" value={form.dueDate} onChange={(e) => setForm({ ...form, dueDate: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      {viewMode === "board" ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {columns.map((col) => (
            <div key={col} className={`border-t-2 ${columnColors[col]} bg-[#141414]/60 rounded-lg p-3 min-h-[200px]`}>
              <h4 className="text-xs font-bold text-[#888078] uppercase tracking-wider mb-3">{columnLabels[col]} ({tasks?.filter((t: any) => t.status === col).length || 0})</h4>
              <div className="space-y-2">
                {tasks?.filter((t: any) => t.status === col).map((t: any) => (
                  <div key={t._id} className="bg-[#0a0a0a] border border-[#D4A843]/10 rounded p-3 space-y-2">
                    <p className="text-sm text-[#f0ece4]">{t.title}</p>
                    <div className="flex items-center justify-between">
                      <Badge text={t.priority} color={priorityColors[t.priority]} />
                      <div className="flex gap-1">
                        {col !== "done" && (
                          <button onClick={() => updateTask({ id: t._id, status: columns[columns.indexOf(col) + 1] })} className="text-[10px] text-[#D4A843] hover:text-[#E8C767]">→</button>
                        )}
                        <button onClick={() => deleteTask({ id: t._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3" /></button>
                      </div>
                    </div>
                    {t.dueDate && <p className="text-[9px] text-[#555]">Due: {t.dueDate}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <TableWrapper>
          {tasks && tasks.length > 0 ? tasks.map((t: any) => (
            <div key={t._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-center gap-3">
                <button onClick={() => updateTask({ id: t._id, status: t.status === "done" ? "todo" : "done" })} className={t.status === "done" ? "text-green-400" : "text-[#555]"}>
                  {t.status === "done" ? <CheckSquare className="size-4" /> : <Square className="size-4" />}
                </button>
                <div>
                  <p className={`text-sm ${t.status === "done" ? "line-through text-[#555]" : "text-[#f0ece4]"}`}>{t.title}</p>
                  <p className="text-[10px] text-[#888078]">{t.project || "No project"} {t.dueDate ? `· Due: ${t.dueDate}` : ""}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge text={t.priority} color={priorityColors[t.priority]} />
                <Badge text={t.status} color={statusColor(t.status)} />
                <button onClick={() => deleteTask({ id: t._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
              </div>
            </div>
          )) : <EmptyState message="No tasks yet. Start organizing!" />}
        </TableWrapper>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  16. PODCAST RSS MANAGER
// ═══════════════════════════════════════════════════════════

export function PodcastRSSTab() {
  const episodes = useQuery(api.commandCenter.getPodcastEpisodes, {});
  const addEpisode = useMutation(api.commandCenter.addPodcastEpisode);
  const updateEpisode = useMutation(api.commandCenter.updatePodcastEpisode);
  const deleteEpisode = useMutation(api.commandCenter.deletePodcastEpisode);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", episodeNumber: "", youtubeId: "", audioUrl: "", duration: "" });

  const handleAdd = async () => {
    if (!form.title) return;
    await addEpisode({
      title: form.title, description: form.description || "No description",
      episodeNumber: form.episodeNumber ? parseInt(form.episodeNumber) : undefined,
      youtubeId: form.youtubeId || undefined, audioUrl: form.audioUrl || undefined,
      duration: form.duration || undefined, isPublished: false,
    });
    setForm({ title: "", description: "", episodeNumber: "", youtubeId: "", audioUrl: "", duration: "" });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Podcast} label="Total Episodes" value={episodes?.length || 0} color="gold" />
        <StatCard icon={Eye} label="Published" value={episodes?.filter((e: any) => e.isPublished).length || 0} color="green" />
        <StatCard icon={Edit} label="Drafts" value={episodes?.filter((e: any) => !e.isPublished).length || 0} color="gray" />
        <StatCard icon={TrendingUp} label="Total Downloads" value={episodes?.reduce((s: number, e: any) => s + (e.downloads || 0), 0) || 0} color="blue" />
      </div>

      <SectionHeader title="Episodes" onAdd={() => setShowForm(!showForm)} />

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="Episode title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Episode # (optional)" type="number" value={form.episodeNumber} onChange={(e) => setForm({ ...form, episodeNumber: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <textarea placeholder="Description" rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4] resize-none" />
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="YouTube ID (optional)" value={form.youtubeId} onChange={(e) => setForm({ ...form, youtubeId: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <input placeholder="Audio URL (optional)" value={form.audioUrl} onChange={(e) => setForm({ ...form, audioUrl: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      <TableWrapper>
        {episodes && episodes.length > 0 ? episodes.map((e: any) => (
          <div key={e._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
            <div className="flex items-center gap-3">
              <Podcast className="size-5 text-[#D4A843]/60" />
              <div>
                <p className="text-sm text-[#f0ece4]">{e.episodeNumber ? `Ep ${e.episodeNumber}: ` : ""}{e.title}</p>
                <p className="text-[10px] text-[#888078]">{e.duration || "No duration"} · {e.downloads || 0} downloads</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={() => updateEpisode({ id: e._id, isPublished: !e.isPublished })} className={`px-2 py-1 text-[10px] font-bold uppercase rounded transition-all ${e.isPublished ? "bg-green-600/20 text-green-400" : "bg-[#333] text-[#888078]"}`}>
                {e.isPublished ? "Published" : "Draft"}
              </button>
              <button onClick={() => deleteEpisode({ id: e._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          </div>
        )) : <EmptyState message="No episodes yet. Add your first podcast episode!" />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  17. SITE ANALYTICS
// ═══════════════════════════════════════════════════════════

export function AnalyticsTab() {
  const stats = useQuery(api.commandCenter.getAnalyticsStats, { days: 30 });

  const topPages = stats?.byPage ? Object.entries(stats.byPage).sort(([, a], [, b]) => b - a).slice(0, 10) : [];
  const dailyData = stats?.byDay ? Object.entries(stats.byDay).sort(([a], [b]) => a.localeCompare(b)).slice(-14) : [];
  const maxDaily = Math.max(...dailyData.map(([, v]) => v), 1);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Eye} label="Page Views (30d)" value={stats?.pageViews || 0} color="gold" />
        <StatCard icon={BarChart3} label="Total Events" value={stats?.totalEvents || 0} color="blue" />
        <StatCard icon={TrendingUp} label="Video Plays" value={stats?.videoPlays || 0} color="green" />
        <StatCard icon={Bell} label="Signups" value={stats?.signups || 0} color="purple" />
      </div>

      {/* Daily Chart */}
      {dailyData.length > 0 && (
        <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-4">
          <h4 className="text-xs text-[#888078] uppercase tracking-wider mb-3">Daily Traffic (14 days)</h4>
          <div className="flex items-end gap-1 h-24">
            {dailyData.map(([day, count]) => (
              <div key={day} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full bg-[#D4A843]/40 rounded-t transition-all" style={{ height: `${(count / maxDaily) * 80}px`, minHeight: "4px" }} />
                <span className="text-[8px] text-[#555] rotate-45">{day.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Pages */}
      <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-4">
        <h4 className="text-xs text-[#888078] uppercase tracking-wider mb-3">Top Pages</h4>
        {topPages.length > 0 ? (
          <div className="space-y-2">
            {topPages.map(([page, count]) => (
              <div key={page} className="flex items-center justify-between">
                <span className="text-sm text-[#f0ece4]">{page}</span>
                <div className="flex items-center gap-2">
                  <div className="w-24 h-2 bg-[#0a0a0a] rounded overflow-hidden">
                    <div className="h-full bg-[#D4A843]/60 rounded" style={{ width: `${(count / (topPages[0]?.[1] || 1)) * 100}%` }} />
                  </div>
                  <span className="text-xs text-[#888078] w-8 text-right">{count}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-[#888078]">No page view data yet. Analytics will populate as visitors browse the site.</p>
        )}
      </div>

      {/* Device Breakdown */}
      {stats?.byDevice && Object.keys(stats.byDevice).length > 0 && (
        <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-4">
          <h4 className="text-xs text-[#888078] uppercase tracking-wider mb-3">Devices</h4>
          <div className="flex gap-4">
            {Object.entries(stats.byDevice).map(([device, count]) => (
              <div key={device} className="flex items-center gap-2">
                <span className="text-sm text-[#f0ece4] capitalize">{device}</span>
                <Badge text={String(count)} color="gold" />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  18. BRAND KIT
// ═══════════════════════════════════════════════════════════

export function BrandKitTab() {
  const assets = useQuery(api.commandCenter.getBrandAssets, {});
  const addAsset = useMutation(api.commandCenter.addBrandAsset);
  const deleteAsset = useMutation(api.commandCenter.deleteBrandAsset);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", type: "color", value: "", description: "", category: "primary" });

  const handleAdd = async () => {
    if (!form.name) return;
    await addAsset({ name: form.name, type: form.type, value: form.value || undefined, description: form.description || undefined, category: form.category });
    setForm({ name: "", type: "color", value: "", description: "", category: "primary" });
    setShowForm(false);
  };

  // Pre-loaded brand colors
  const brandColors = [
    { name: "3GMG Gold", value: "#D4A843" },
    { name: "Background Black", value: "#0a0a0a" },
    { name: "Dark Surface", value: "#141414" },
    { name: "Light Text", value: "#f0ece4" },
    { name: "Muted Text", value: "#888078" },
    { name: "Gold Hover", value: "#E8C767" },
  ];

  const typeIcons: Record<string, any> = { logo: Palette, color: Palette, font: FileText, template: FolderOpen, photo: Eye, guideline: FileText };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <StatCard icon={Palette} label="Brand Assets" value={assets?.length || 0} color="gold" />
        <StatCard icon={Eye} label="Logos" value={assets?.filter((a: any) => a.type === "logo").length || 0} color="blue" />
        <StatCard icon={Palette} label="Colors" value={(assets?.filter((a: any) => a.type === "color").length || 0) + brandColors.length} color="purple" />
        <StatCard icon={FileText} label="Guidelines" value={assets?.filter((a: any) => a.type === "guideline").length || 0} color="green" />
      </div>

      {/* Brand Colors */}
      <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-4">
        <h4 className="text-xs text-[#888078] uppercase tracking-wider mb-3">Brand Colors</h4>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {brandColors.map((c) => (
            <div key={c.value} className="text-center">
              <div className="w-full aspect-square rounded-lg border border-[#333] mb-1" style={{ backgroundColor: c.value }} />
              <p className="text-[10px] text-[#f0ece4]">{c.name}</p>
              <p className="text-[9px] text-[#888078] font-mono">{c.value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Brand Fonts */}
      <div className="border border-[#D4A843]/15 rounded-lg bg-[#141414]/80 p-4">
        <h4 className="text-xs text-[#888078] uppercase tracking-wider mb-3">Typography</h4>
        <div className="space-y-3">
          <div>
            <p className="font-display text-2xl text-[#f0ece4] tracking-wider">Oswald — Display / Headings</p>
            <p className="text-xs text-[#888078]">Used for headlines, navigation, section titles</p>
          </div>
          <div>
            <p className="text-lg text-[#f0ece4]" style={{ fontFamily: "Inter, sans-serif" }}>Inter — Body Text</p>
            <p className="text-xs text-[#888078]">Used for paragraphs, descriptions, UI elements</p>
          </div>
        </div>
      </div>

      <SectionHeader title="Custom Assets" onAdd={() => setShowForm(!showForm)} />

      {showForm && (
        <div className="border border-[#D4A843]/20 rounded-lg bg-[#0a0a0a] p-4 space-y-3">
          <div className="grid grid-cols-3 gap-3">
            <input placeholder="Asset name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
            <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]">
              <option value="logo">Logo</option><option value="color">Color</option><option value="font">Font</option>
              <option value="template">Template</option><option value="photo">Photo</option><option value="guideline">Guideline</option>
            </select>
            <input placeholder="Value (hex, url, etc)" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} className="bg-[#141414] border border-[#333] rounded px-3 py-2 text-sm text-[#f0ece4]" />
          </div>
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs uppercase rounded hover:bg-[#E8C767]">Save</button>
            <button onClick={() => setShowForm(false)} className="px-4 py-2 text-[#888078] text-xs uppercase">Cancel</button>
          </div>
        </div>
      )}

      <TableWrapper>
        {assets && assets.length > 0 ? assets.map((a: any) => {
          const Icon = typeIcons[a.type] || Palette;
          return (
            <div key={a._id} className="flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-center gap-3">
                {a.type === "color" && a.value ? (
                  <div className="w-8 h-8 rounded border border-[#333]" style={{ backgroundColor: a.value }} />
                ) : (
                  <Icon className="size-5 text-[#D4A843]/60" />
                )}
                <div>
                  <p className="text-sm text-[#f0ece4]">{a.name}</p>
                  <p className="text-[10px] text-[#888078]">{a.type} {a.value ? `· ${a.value}` : ""}</p>
                </div>
              </div>
              <button onClick={() => deleteAsset({ id: a._id })} className="text-[#555] hover:text-red-400"><Trash2 className="size-3.5" /></button>
            </div>
          );
        }) : <EmptyState message="No custom assets yet. Add logos, photos, or guidelines." />}
      </TableWrapper>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
//  19. NOTIFICATION CENTER
// ═══════════════════════════════════════════════════════════

export function NotificationsTab() {
  const notifications = useQuery(api.commandCenter.getNotifications, {});
  const unreadCount = useQuery(api.commandCenter.getUnreadCount);
  const markRead = useMutation(api.commandCenter.markNotificationRead);
  const markAllRead = useMutation(api.commandCenter.markAllNotificationsRead);
  const deleteNotification = useMutation(api.commandCenter.deleteNotification);

  const typeIcons: Record<string, any> = { booking: Package, subscriber: Bell, community: MessageSquare, sponsor: DollarSign, order: ShoppingBag, system: BarChart3 };
  const typeColors: Record<string, string> = { booking: "blue", subscriber: "green", community: "purple", sponsor: "gold", order: "orange", system: "gray" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Notifications</h3>
          {(unreadCount ?? 0) > 0 && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full">{unreadCount}</span>
          )}
        </div>
        {(unreadCount ?? 0) > 0 && (
          <button onClick={() => markAllRead()} className="text-xs text-[#D4A843] hover:text-[#E8C767] transition-colors">Mark all read</button>
        )}
      </div>

      <TableWrapper>
        {notifications && notifications.length > 0 ? notifications.map((n: any) => {
          const Icon = typeIcons[n.type] || Bell;
          return (
            <div key={n._id} className={`flex items-center justify-between px-4 py-3 hover:bg-[#1a1a1a] transition-colors ${!n.isRead ? "bg-[#D4A843]/5 border-l-2 border-l-[#D4A843]" : ""}`}>
              <div className="flex items-center gap-3" onClick={() => !n.isRead && markRead({ id: n._id })} style={{ cursor: !n.isRead ? "pointer" : "default" }}>
                <div className={`p-1.5 rounded bg-${typeColors[n.type] || "gray"}-500/10`}>
                  <Icon className="size-4 text-[#D4A843]" />
                </div>
                <div>
                  <p className={`text-sm ${!n.isRead ? "text-[#f0ece4] font-medium" : "text-[#888078]"}`}>{n.title}</p>
                  <p className="text-[10px] text-[#888078]">{n.message}</p>
                  <p className="text-[9px] text-[#555]">{new Date(n.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <button onClick={() => deleteNotification({ id: n._id })} className="text-[#555] hover:text-red-400"><XCircle className="size-3.5" /></button>
            </div>
          );
        }) : <EmptyState message="No notifications yet. They'll appear here as activity happens." />}
      </TableWrapper>
    </div>
  );
}
