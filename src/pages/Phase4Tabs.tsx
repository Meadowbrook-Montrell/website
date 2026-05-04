import { useState, Component, type ReactNode } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Plus, Trash2, FileText, Zap, Clock, ArrowRight, CheckCircle,
  AlertTriangle, Star, Heart, Eye, Send, Copy, ChevronDown,
  TrendingUp, Award, MessageSquare, Shield, Sparkles, ExternalLink,
  Briefcase, Users, DollarSign, BarChart3, Image, PenTool, Calendar,
  Target, Megaphone, Globe, Radio, Play, Hash, Tag,
  ThumbsUp, Bookmark, XCircle,
} from "lucide-react";

export class P4Safe extends Component<{ name: string; children: ReactNode }, { hasError: boolean; error?: Error }> {
  state = { hasError: false, error: undefined as Error | undefined };
  static getDerivedStateFromError(error: Error) { return { hasError: true, error }; }
  render() {
    if (this.state.hasError) {
      return (
        <div className="text-center py-16">
          <AlertTriangle className="size-12 text-red-400 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-[#f0ece4] mb-2">{this.props.name} hit an error</h3>
          <p className="text-sm text-[#888] max-w-md mx-auto mb-4">{this.state.error?.message}</p>
          <button onClick={() => this.setState({ hasError: false })} className="bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-5 py-2.5">Try Again</button>
        </div>
      );
    }
    return this.props.children;
  }
}

const Section = ({ title, icon: Icon, children, color = "#D4A843" }: { title: string; icon: any; children: ReactNode; color?: string }) => (
  <div className="mb-8">
    <div className="flex items-center gap-2 mb-4">
      <Icon className="size-5" style={{ color }} />
      <h2 className="text-lg font-bold tracking-wider text-[#f0ece4]">{title}</h2>
    </div>
    {children}
  </div>
);

const Card = ({ children, className = "" }: { children: ReactNode; className?: string }) => (
  <div className={`bg-[#1a1816]/80 border border-[#2a2622] rounded-xl p-5 ${className}`}>{children}</div>
);

const Btn = ({ children, onClick, variant = "gold", disabled, className = "" }: { children: ReactNode; onClick?: () => void; variant?: string; disabled?: boolean; className?: string }) => {
  const styles: Record<string, string> = {
    gold: "bg-[#D4A843] text-[#0a0a0a] hover:bg-[#E8C767]",
    danger: "bg-red-600/20 text-red-400 border border-red-600/30 hover:bg-red-600/30",
    ghost: "bg-[#2a2622]/50 text-[#888] border border-[#2a2622] hover:text-[#f0ece4]",
    green: "bg-green-600/20 text-green-400 border border-green-600/30 hover:bg-green-600/30",
    blue: "bg-blue-600/20 text-blue-400 border border-blue-600/30 hover:bg-blue-600/30",
  };
  return (
    <button onClick={onClick} disabled={disabled} className={`font-bold text-sm rounded px-4 py-2 transition-all ${styles[variant] || styles.gold} disabled:opacity-30 ${className}`}>
      {children}
    </button>
  );
};

const Badge = ({ count, color = "#D4A843" }: { count: number; color?: string }) => count > 0 ? (
  <span className="ml-2 text-xs font-bold px-1.5 py-0.5 rounded-full" style={{ backgroundColor: `${color}30`, color }}>{count}</span>
) : null;

const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    draft: "bg-yellow-500/20 text-yellow-400", sent: "bg-blue-500/20 text-blue-400",
    signed: "bg-green-500/20 text-green-400", expired: "bg-red-500/20 text-red-400",
    paid: "bg-green-500/20 text-green-400", overdue: "bg-red-500/20 text-red-400",
    open: "bg-blue-500/20 text-blue-400", planned: "bg-purple-500/20 text-purple-400",
    "in-progress": "bg-yellow-500/20 text-yellow-400", completed: "bg-green-500/20 text-green-400",
    declined: "bg-red-500/20 text-red-400", pending: "bg-yellow-500/20 text-yellow-400",
    cancelled: "bg-gray-500/20 text-gray-400", active: "bg-green-500/20 text-green-400",
    hot: "bg-red-500/20 text-red-400", warm: "bg-yellow-500/20 text-yellow-400",
    cold: "bg-blue-500/20 text-blue-400", "at-risk": "bg-orange-500/20 text-orange-400",
  };
  return <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${colors[status] || "bg-gray-500/20 text-gray-400"}`}>{status}</span>;
};


/* ================================================================
   1. AI CONTRACT GENERATOR
   ================================================================ */
export function AIContractTab() {
  const contracts = useQuery(api.phase4.listContracts) || [];
  const templates = useQuery(api.phase4.getContractTemplates) || [];
  const generate = useMutation(api.phase4.generateContract);
  const updateStatus = useMutation(api.phase4.updateContractStatus);
  const del = useMutation(api.phase4.deleteContract);
  const [showForm, setShowForm] = useState(false);
  const [tpl, setTpl] = useState("sponsorship");
  const [title, setTitle] = useState("");
  const [p1, setP1] = useState("Meadowbrook Montrell / 3GMG");
  const [p2, setP2] = useState("");
  const [viewing, setViewing] = useState<string | null>(null);

  return (
    <div>
      <Section title="AI Contract Generator" icon={FileText} color="#D4A843">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "New Contract"}</Btn>
          <span className="text-sm text-[#888] self-center">{contracts.length} contracts</span>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Template</label>
                <select value={tpl} onChange={e => setTpl(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                  {templates.map(t => <option key={t.id} value={t.id}>{t.title} ({t.clauseCount} clauses)</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Contract Title</label>
                <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., Q3 Sponsorship Deal" />
              </div>
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Party 1 (You)</label>
                <input value={p1} onChange={e => setP1(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Party 2</label>
                <input value={p2} onChange={e => setP2(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Company / Person name" />
              </div>
            </div>
            <Btn onClick={async () => { if (!title || !p2) return; await generate({ templateType: tpl, title, party1: p1, party2: p2, fields: {} }); setShowForm(false); setTitle(""); setP2(""); }}>
              <Zap className="size-4 inline mr-1" />Generate Contract
            </Btn>
          </Card>
        )}

        <div className="space-y-3">
          {contracts.map((c: any) => (
            <Card key={c._id}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[#f0ece4]">{c.title}</h3>
                  <p className="text-xs text-[#888]">{c.parties.party1} &harr; {c.parties.party2} &middot; {c.templateType} &middot; {new Date(c.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={c.status} />
                  <select value={c.status} onChange={e => updateStatus({ id: c._id, status: e.target.value })} className="bg-[#0a0a0a] text-[#888] text-xs border border-[#2a2622] rounded p-1">
                    <option value="draft">Draft</option><option value="sent">Sent</option><option value="signed">Signed</option><option value="expired">Expired</option>
                  </select>
                </div>
              </div>
              <div className="flex gap-2">
                <Btn variant="ghost" onClick={() => setViewing(viewing === c._id ? null : c._id)}><Eye className="size-3 inline mr-1" />View</Btn>
                <Btn variant="ghost" onClick={() => { navigator.clipboard.writeText(c.generatedText); }}><Copy className="size-3 inline mr-1" />Copy</Btn>
                <Btn variant="danger" onClick={() => del({ id: c._id })}><Trash2 className="size-3" /></Btn>
              </div>
              {viewing === c._id && <pre className="mt-3 text-xs text-[#aaa] bg-[#0a0a0a] p-4 rounded overflow-auto max-h-96 whitespace-pre-wrap">{c.generatedText}</pre>}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   2. AI SOCIAL CAPTION GENERATOR
   ================================================================ */
export function AICaptionTab() {
  const captions = useQuery(api.phase4.listCaptions) || [];
  const generateAll = useMutation(api.phase4.generateAllCaptions);
  const toggleSave = useMutation(api.phase4.toggleCaptionSaved);
  const del = useMutation(api.phase4.deleteCaption);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");

  // Group by sourceTitle
  const grouped: Record<string, any[]> = {};
  captions.forEach(c => { (grouped[c.sourceTitle] = grouped[c.sourceTitle] || []).push(c); });

  const platformIcons: Record<string, string> = { instagram: "📸", tiktok: "🎵", youtube: "🎬", facebook: "📱", twitter: "🐦" };

  return (
    <div>
      <Section title="AI Social Caption Generator" icon={Megaphone} color="#a855f7">
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Content Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., Interview with Big Zay" />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Topic (optional)</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., Street culture" />
            </div>
          </div>
          <Btn onClick={async () => { if (!title) return; await generateAll({ sourceTitle: title, sourceTopic: topic || undefined }); setTitle(""); setTopic(""); }}>
            <Sparkles className="size-4 inline mr-1" />Generate for All 5 Platforms
          </Btn>
        </Card>

        {Object.entries(grouped).map(([sourceTitle, caps]) => (
          <Card key={sourceTitle} className="mb-4">
            <h3 className="font-bold text-[#f0ece4] mb-3">{sourceTitle}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {caps.map((c: any) => (
                <div key={c._id} className="bg-[#0a0a0a] border border-[#2a2622] rounded-lg p-3">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-bold text-[#f0ece4]">{platformIcons[c.platform] || "📱"} {c.platform}</span>
                    <div className="flex gap-1">
                      <button onClick={() => toggleSave({ id: c._id })} className={`p-1 rounded ${c.isSaved ? "text-[#D4A843]" : "text-[#555]"}`}>
                        <Bookmark className="size-3" />
                      </button>
                      <button onClick={() => navigator.clipboard.writeText(c.generatedCaption)} className="p-1 text-[#555] hover:text-[#f0ece4]">
                        <Copy className="size-3" />
                      </button>
                      <button onClick={() => del({ id: c._id })} className="p-1 text-[#555] hover:text-red-400">
                        <Trash2 className="size-3" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-[#aaa] whitespace-pre-wrap max-h-32 overflow-auto">{c.generatedCaption}</p>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </Section>
    </div>
  );
}


/* ================================================================
   3. AI EPISODE PREP KIT
   ================================================================ */
export function AIEpisodePrepTab() {
  const preps = useQuery(api.phase4.listEpisodePreps) || [];
  const generate = useMutation(api.phase4.generateEpisodePrep);
  const del = useMutation(api.phase4.deleteEpisodePrep);
  const markUsed = useMutation(api.phase4.markPrepUsed);
  const [guest, setGuest] = useState("");
  const [topic, setTopic] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div>
      <Section title="AI Episode Prep Kit" icon={PenTool} color="#3b82f6">
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Guest Name</label>
              <input value={guest} onChange={e => setGuest(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., Big Zay" />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Topic</label>
              <input value={topic} onChange={e => setTopic(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., Street entrepreneurship" />
            </div>
          </div>
          <Btn onClick={async () => { if (!guest || !topic) return; await generate({ guestName: guest, topic }); setGuest(""); setTopic(""); }}>
            <Zap className="size-4 inline mr-1" />Generate Prep Kit
          </Btn>
        </Card>

        <div className="space-y-3">
          {preps.map((p: any) => (
            <Card key={p._id}>
              <div className="flex items-center justify-between mb-2">
                <div>
                  <h3 className="font-bold text-[#f0ece4]">{p.guestName} — "{p.topic}"</h3>
                  <p className="text-xs text-[#888]">{new Date(p.createdAt).toLocaleDateString()} {p.isUsed && <span className="text-green-400 ml-2">✓ Used</span>}</p>
                </div>
                <div className="flex gap-2">
                  {!p.isUsed && <Btn variant="green" onClick={() => markUsed({ id: p._id })}>Mark Used</Btn>}
                  <Btn variant="ghost" onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
                    {expanded === p._id ? "Collapse" : "Expand"}
                  </Btn>
                  <Btn variant="danger" onClick={() => del({ id: p._id })}><Trash2 className="size-3" /></Btn>
                </div>
              </div>
              {expanded === p._id && (
                <div className="mt-4 space-y-4">
                  {p.coldOpen && (
                    <div><h4 className="text-xs text-[#D4A843] uppercase font-bold mb-2">🎬 Cold Open</h4>
                      <pre className="text-xs text-[#aaa] bg-[#0a0a0a] p-3 rounded whitespace-pre-wrap">{p.coldOpen}</pre>
                    </div>
                  )}
                  <div><h4 className="text-xs text-[#D4A843] uppercase font-bold mb-2">❓ Interview Questions ({(p.questions || []).length})</h4>
                    <ol className="space-y-1.5">{(p.questions || []).map((q: string, i: number) => <li key={i} className="text-sm text-[#ccc] flex gap-2"><span className="text-[#D4A843] font-bold min-w-[20px]">{i + 1}.</span>{q}</li>)}</ol>
                  </div>
                  <div><h4 className="text-xs text-[#D4A843] uppercase font-bold mb-2">📋 Outline</h4>
                    <pre className="text-xs text-[#aaa] bg-[#0a0a0a] p-3 rounded whitespace-pre-wrap">{p.outline}</pre>
                  </div>
                  <div><h4 className="text-xs text-[#D4A843] uppercase font-bold mb-2">💡 Talking Points</h4>
                    <ul className="space-y-1">{(p.talkingPoints || []).map((tp: string, i: number) => <li key={i} className="text-sm text-[#ccc]">• {tp}</li>)}</ul>
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   4. AI INVOICE GENERATOR
   ================================================================ */
export function AIInvoiceTab() {
  const invoices = useQuery(api.phase4.listInvoices) || [];
  const generate = useMutation(api.phase4.generateInvoice);
  const updateStatus = useMutation(api.phase4.updateInvoiceStatus);
  const del = useMutation(api.phase4.deleteInvoice);
  const [showForm, setShowForm] = useState(false);
  const [client, setClient] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0 }]);

  const addItem = () => setItems([...items, { description: "", quantity: 1, rate: 0 }]);
  const updateItem = (idx: number, field: string, val: any) => {
    const newItems = [...items]; (newItems[idx] as any)[field] = val; setItems(newItems);
  };
  const subtotal = items.reduce((s, i) => s + i.quantity * i.rate, 0);

  return (
    <div>
      <Section title="AI Invoice Generator" icon={DollarSign} color="#22c55e">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "New Invoice"}</Btn>
          <span className="text-sm text-[#888] self-center">{invoices.length} invoices · ${invoices.reduce((s: number, i: any) => s + i.total, 0).toLocaleString()} total</span>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Client Name</label>
                <input value={client} onChange={e => setClient(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Due Date</label>
                <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" />
              </div>
            </div>
            <h4 className="text-xs text-[#888] uppercase mb-2">Line Items</h4>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-12 gap-2 mb-2">
                <input value={item.description} onChange={e => updateItem(i, "description", e.target.value)} className="col-span-6 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Description" />
                <input type="number" value={item.quantity} onChange={e => updateItem(i, "quantity", Number(e.target.value))} className="col-span-2 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Qty" />
                <input type="number" value={item.rate || ""} onChange={e => updateItem(i, "rate", Number(e.target.value))} className="col-span-3 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Rate" />
                <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="col-span-1 text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
              </div>
            ))}
            <div className="flex justify-between items-center mt-3">
              <Btn variant="ghost" onClick={addItem}><Plus className="size-3 inline mr-1" />Add Item</Btn>
              <p className="text-sm text-[#f0ece4]">Subtotal: <strong>${subtotal.toLocaleString()}</strong></p>
            </div>
            <div className="mt-4">
              <Btn onClick={async () => {
                if (!client || !dueDate) return;
                await generate({ clientName: client, lineItems: items.map(i => ({ ...i, quantity: Number(i.quantity), rate: Number(i.rate) })), dueDate });
                setShowForm(false); setClient(""); setItems([{ description: "", quantity: 1, rate: 0 }]);
              }}>
                <Zap className="size-4 inline mr-1" />Generate Invoice
              </Btn>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {invoices.map((inv: any) => (
            <Card key={inv._id}>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-[#f0ece4]">{inv.invoiceNumber} — {inv.clientName}</h3>
                  <p className="text-xs text-[#888]">{(inv.lineItems || []).length} items · Due {inv.dueDate} · Created {new Date(inv.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="text-xl font-bold text-[#D4A843]">${(inv.total || 0).toLocaleString()}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <StatusBadge status={inv.status} />
                    <select value={inv.status} onChange={e => updateStatus({ id: inv._id, status: e.target.value, ...(e.target.value === "paid" ? { paidAt: new Date().toISOString() } : {}) })} className="bg-[#0a0a0a] text-[#888] text-xs border border-[#2a2622] rounded p-1">
                      <option value="draft">Draft</option><option value="sent">Sent</option><option value="paid">Paid</option><option value="overdue">Overdue</option><option value="cancelled">Cancelled</option>
                    </select>
                    <button onClick={() => del({ id: inv._id })} className="text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   5. AI CONTENT REPURPOSER
   ================================================================ */
export function AIRepurposeTab() {
  const items = useQuery(api.phase4.listRepurpose) || [];
  const generate = useMutation(api.phase4.generateRepurpose);
  const del = useMutation(api.phase4.deleteRepurpose);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");

  return (
    <div>
      <Section title="AI Content Repurposer" icon={Globe} color="#06b6d4">
        <Card className="mb-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Source Content Title</label>
              <input value={title} onChange={e => setTitle(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., Interview with Big Zay ep. 47" />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Content Type</label>
              <select value={type} onChange={e => setType(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="video">Video</option><option value="podcast">Podcast</option><option value="interview">Interview</option><option value="blog">Blog Post</option>
              </select>
            </div>
          </div>
          <Btn onClick={async () => { if (!title) return; await generate({ sourceTitle: title, sourceType: type }); setTitle(""); }}>
            <Sparkles className="size-4 inline mr-1" />Generate Repurpose Ideas
          </Btn>
        </Card>

        <div className="space-y-4">
          {items.map((item: any) => (
            <Card key={item._id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[#f0ece4]">{item.sourceTitle}</h3>
                  <p className="text-xs text-[#888]">{item.sourceType} · {(item.suggestions || []).length} ideas · {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>
                <Btn variant="danger" onClick={() => del({ id: item._id })}><Trash2 className="size-3" /></Btn>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {(item.suggestions || []).map((s: any, i: number) => (
                  <div key={i} className={`flex gap-3 p-3 rounded border ${s.isCompleted ? "border-green-600/20 bg-green-600/5" : "border-[#2a2622] bg-[#0a0a0a]"}`}>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-[#f0ece4]">{s.platform}</p>
                      <p className="text-xs text-[#888]">{s.format} — {s.description}</p>
                    </div>
                    {s.isCompleted && <CheckCircle className="size-4 text-green-400 mt-1" />}
                  </div>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   6. CRM INTELLIGENCE
   ================================================================ */
export function CRMIntelligenceTab() {
  const scores = useQuery(api.phase4.listContactScores) || [];
  const stats = useQuery(api.phase4.getCRMStats);
  const add = useMutation(api.phase4.upsertContactScore);
  const del = useMutation(api.phase4.deleteContactScore);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState(50);
  const [health, setHealth] = useState("warm");

  return (
    <div>
      <Section title="CRM Intelligence" icon={Target} color="#ec4899">
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
            <Card><p className="text-2xl font-bold text-[#D4A843]">{stats.total}</p><p className="text-xs text-[#888]">Total Contacts</p></Card>
            <Card><p className="text-2xl font-bold text-red-400">{stats.tiers.hot}</p><p className="text-xs text-[#888]">🔥 Hot</p></Card>
            <Card><p className="text-2xl font-bold text-yellow-400">{stats.tiers.warm}</p><p className="text-xs text-[#888]">☀️ Warm</p></Card>
            <Card><p className="text-2xl font-bold text-blue-400">{stats.tiers.cold}</p><p className="text-xs text-[#888]">❄️ Cold</p></Card>
            <Card><p className="text-2xl font-bold text-green-400">{stats.avgScore}</p><p className="text-xs text-[#888]">Avg Score</p></Card>
          </div>
        )}

        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "Score Contact"}</Btn>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Contact Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Score (0-100): {score}</label>
                <input type="range" min="0" max="100" value={score} onChange={e => setScore(Number(e.target.value))} className="w-full" />
              </div>
              <div>
                <label className="text-xs text-[#888] uppercase mb-1 block">Health Status</label>
                <select value={health} onChange={e => setHealth(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                  <option value="hot">🔥 Hot</option><option value="warm">☀️ Warm</option><option value="cold">❄️ Cold</option><option value="at-risk">⚠️ At Risk</option>
                </select>
              </div>
            </div>
            <Btn onClick={async () => { if (!name) return; await add({ contactName: name, relationshipScore: score, interactionCount: 0, tags: [], healthStatus: health }); setShowForm(false); setName(""); }}>Save Score</Btn>
          </Card>
        )}

        <div className="space-y-2">
          {scores.map((s: any) => (
            <Card key={s._id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#D4A843]/20 flex items-center justify-center text-[#D4A843] font-bold text-sm">{s.relationshipScore}</div>
                  <div>
                    <h3 className="font-bold text-[#f0ece4]">{s.contactName}</h3>
                    <p className="text-xs text-[#888]">{s.interactionCount} interactions {s.suggestedAction && `· Next: ${s.suggestedAction}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={s.healthStatus} />
                  <button onClick={() => del({ id: s._id })} className="text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   7. COMPETITOR TRACKER
   ================================================================ */
export function CompetitorTrackerTab() {
  const competitors = useQuery(api.phase4.listCompetitors) || [];
  const add = useMutation(api.phase4.addCompetitor);
  const del = useMutation(api.phase4.deleteCompetitor);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [platform, setPlatform] = useState("youtube");
  const [url, setUrl] = useState("");
  const [subs, setSubs] = useState("");
  const [themes, setThemes] = useState("");

  return (
    <div>
      <Section title="Competitor Tracker" icon={Eye} color="#ef4444">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "Add Competitor"}</Btn>
          <span className="text-sm text-[#888] self-center">Tracking {competitors.length} competitors</span>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input value={name} onChange={e => setName(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Competitor name" />
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="facebook">Facebook</option>
              </select>
              <input value={url} onChange={e => setUrl(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Profile URL" />
              <input value={subs} onChange={e => setSubs(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Subscribers (optional)" />
              <input value={themes} onChange={e => setThemes(e.target.value)} className="col-span-2 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Content themes (comma-separated)" />
            </div>
            <Btn onClick={async () => { if (!name || !url) return; await add({ name, platform, profileUrl: url, subscribers: subs ? Number(subs) : undefined, contentThemes: themes.split(",").map(t => t.trim()).filter(Boolean) }); setShowForm(false); setName(""); setUrl(""); setSubs(""); setThemes(""); }}>
              Save Competitor
            </Btn>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {competitors.map((c: any) => (
            <Card key={c._id}>
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-bold text-[#f0ece4]">{c.name}</h3>
                <button onClick={() => del({ id: c._id })} className="text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
              </div>
              <p className="text-xs text-[#888] mb-1">📱 {c.platform} {c.subscribers && `· ${c.subscribers.toLocaleString()} subs`} {c.avgViews && `· ${c.avgViews.toLocaleString()} avg views`}</p>
              <a href={c.profileUrl} target="_blank" rel="noreferrer" className="text-xs text-[#D4A843] hover:underline flex items-center gap-1"><ExternalLink className="size-3" />{c.profileUrl}</a>
              {((c.contentThemes) || []).length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {(c.contentThemes || []).map((t: string, i: number) => <span key={i} className="text-xs bg-[#2a2622] text-[#888] px-2 py-0.5 rounded">{t}</span>)}
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   8. BRAND DEAL CALCULATOR
   ================================================================ */
export function BrandDealCalcTab() {
  const deals = useQuery(api.phase4.listBrandDeals) || [];
  const calc = useMutation(api.phase4.calculateBrandDeal);
  const del = useMutation(api.phase4.deleteBrandDeal);
  const [platform, setPlatform] = useState("youtube");
  const [followers, setFollowers] = useState("");
  const [views, setViews] = useState("");
  const [engagement, setEngagement] = useState("");
  const [niche, setNiche] = useState("entertainment");
  const [dealType, setDealType] = useState("dedicated");

  return (
    <div>
      <Section title="Brand Deal Calculator" icon={DollarSign} color="#D4A843">
        <Card className="mb-6">
          <h3 className="font-bold text-[#f0ece4] mb-4">Calculate Your Rate</h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Platform</label>
              <select value={platform} onChange={e => setPlatform(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="youtube">YouTube</option><option value="instagram">Instagram</option><option value="tiktok">TikTok</option><option value="facebook">Facebook</option><option value="twitter">Twitter/X</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Followers</label>
              <input type="number" value={followers} onChange={e => setFollowers(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., 50000" />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Avg Views</label>
              <input type="number" value={views} onChange={e => setViews(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., 10000" />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Engagement Rate %</label>
              <input type="number" value={engagement} onChange={e => setEngagement(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="e.g., 5" />
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Niche</label>
              <select value={niche} onChange={e => setNiche(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="entertainment">Entertainment</option><option value="news">News</option><option value="music">Music</option><option value="lifestyle">Lifestyle</option><option value="tech">Tech</option><option value="sports">Sports</option><option value="finance">Finance</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-[#888] uppercase mb-1 block">Deal Type</label>
              <select value={dealType} onChange={e => setDealType(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="shoutout">Shoutout</option><option value="dedicated">Dedicated Video</option><option value="integration">Integration</option><option value="ambassador">Ambassador</option>
              </select>
            </div>
          </div>
          <Btn onClick={async () => {
            if (!followers || !views || !engagement) return;
            await calc({ platform, followers: Number(followers), avgViews: Number(views), engagementRate: Number(engagement), niche, dealType });
          }}>
            <Zap className="size-4 inline mr-1" />Calculate Rate
          </Btn>
        </Card>

        <div className="space-y-3">
          {deals.map((d: any) => (
            <Card key={d._id}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-[#888]">{d.platform} · {d.niche} · {d.dealType} · {Number(d.followers).toLocaleString()} followers</p>
                  <p className="text-xs text-[#888]">{Number(d.avgViews).toLocaleString()} avg views · {d.engagementRate}% engagement</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-[#D4A843]">${(d.calculatedRate || 0).toLocaleString()}</p>
                  <p className="text-xs text-[#888]">Range: ${(d.rateRange || {low:0,high:0}).low.toLocaleString()} — ${(d.rateRange || {low:0,high:0}).high.toLocaleString()}</p>
                </div>
                <button onClick={() => del({ id: d._id })} className="text-red-400 hover:text-red-300 ml-3"><Trash2 className="size-3" /></button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   9. WEEKLY REPORTS
   ================================================================ */
export function WeeklyReportTab() {
  const reports = useQuery(api.phase4.listWeeklyReports) || [];
  const generate = useMutation(api.phase4.generateWeeklyReport);
  const del = useMutation(api.phase4.deleteWeeklyReport);

  return (
    <div>
      <Section title="Weekly Business Reports" icon={BarChart3} color="#06b6d4">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => generate({})}><Zap className="size-4 inline mr-1" />Generate This Week's Report</Btn>
          <span className="text-sm text-[#888] self-center">{reports.length} reports</span>
        </div>

        <div className="space-y-4">
          {reports.map((r: any) => (
            <Card key={r._id}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-[#f0ece4]">Week of {new Date(r.weekStart).toLocaleDateString()} — {new Date(r.weekEnd).toLocaleDateString()}</h3>
                <button onClick={() => del({ id: r._id })} className="text-red-400"><Trash2 className="size-3" /></button>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                <div className="bg-[#0a0a0a] p-3 rounded"><p className="text-xl font-bold text-green-400">${((r.revenue || {}).total || 0).toLocaleString()}</p><p className="text-xs text-[#888]">Revenue</p></div>
                <div className="bg-[#0a0a0a] p-3 rounded"><p className="text-xl font-bold text-blue-400">{r.content.published}</p><p className="text-xs text-[#888]">Content Pieces</p></div>
                <div className="bg-[#0a0a0a] p-3 rounded"><p className="text-xl font-bold text-purple-400">{r.community.qaQuestions}</p><p className="text-xs text-[#888]">Q&A Questions</p></div>
                <div className="bg-[#0a0a0a] p-3 rounded"><p className="text-xl font-bold text-[#D4A843]">{r.operations.tasksCompleted}</p><p className="text-xs text-[#888]">Tasks Done</p></div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                <div className="text-xs text-[#888]">
                  <p>💰 Donations: ${((r.revenue || {}).donations || 0).toLocaleString()}</p>
                  <p>🤝 Sponsors: ${((r.revenue || {}).sponsors || 0).toLocaleString()}</p>
                  <p>👕 Merch: ${((r.revenue || {}).merch || 0).toLocaleString()}</p>
                  <p>🎤 Bookings: ${((r.revenue || {}).bookings || 0).toLocaleString()}</p>
                </div>
                <div className="text-xs text-[#888]">
                  <p>✅ Tasks completed: {r.operations.tasksCompleted}</p>
                  <p>⏳ Tasks pending: {r.operations.tasksPending}</p>
                  <p>⚠️ Overdue follow-ups: {r.operations.overdueFollowUps}</p>
                </div>
              </div>
              {(r.highlights || []).length > 0 && (
                <div className="border-t border-[#2a2622] pt-3 mt-3">
                  <h4 className="text-xs text-[#D4A843] uppercase font-bold mb-2">Highlights</h4>
                  <ul>{(r.highlights || []).map((h: string, i: number) => <li key={i} className="text-xs text-[#aaa]">• {h}</li>)}</ul>
                </div>
              )}
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   10. MULTI-USER ROLES
   ================================================================ */
export function TeamRolesTab() {
  const roles = useQuery(api.phase4.listTeamRoles) || [];
  const add = useMutation(api.phase4.addTeamRole);
  const del = useMutation(api.phase4.deleteTeamRole);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const roleColors: Record<string, string> = { admin: "text-red-400", editor: "text-blue-400", finance: "text-green-400", viewer: "text-[#888]" };

  return (
    <div>
      <Section title="Team Roles & Permissions" icon={Shield} color="#ef4444">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "Add Team Member"}</Btn>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={name} onChange={e => setName(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Full name" />
              <input value={email} onChange={e => setEmail(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Email" />
              <select value={role} onChange={e => setRole(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="admin">Admin (Full Access)</option><option value="editor">Editor (Content)</option><option value="finance">Finance (Money)</option><option value="viewer">Viewer (Read Only)</option>
              </select>
            </div>
            <Btn onClick={async () => { if (!name || !email) return; await add({ userName: name, email, role }); setShowForm(false); setName(""); setEmail(""); }}>Add Member</Btn>
          </Card>
        )}

        <div className="space-y-2">
          {roles.map((r: any) => (
            <Card key={r._id}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#2a2622] flex items-center justify-center text-[#D4A843] font-bold text-sm">{r.userName.charAt(0).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-[#f0ece4]">{r.userName}</h3>
                    <p className="text-xs text-[#888]">{r.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm font-bold uppercase ${roleColors[r.role] || "text-[#888]"}`}>{r.role}</span>
                  <div className="flex gap-1">{(r.permissions || []).slice(0, 4).map((p: string, i: number) => <span key={i} className="text-xs bg-[#2a2622] text-[#888] px-1.5 py-0.5 rounded">{p}</span>)}</div>
                  <button onClick={() => del({ id: r._id })} className="text-red-400 hover:text-red-300"><Trash2 className="size-3" /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   11. LIVE POLLS
   ================================================================ */
export function LivePollsTab() {
  const polls = useQuery(api.phase4.listPolls) || [];
  const create = useMutation(api.phase4.createPoll);
  const close = useMutation(api.phase4.closePoll);
  const del = useMutation(api.phase4.deletePoll);
  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  return (
    <div>
      <Section title="Live Poll System" icon={Radio} color="#a855f7">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "Create Poll"}</Btn>
          <span className="text-sm text-[#888] self-center">{polls.filter((p: any) => p.isActive).length} active polls</span>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="mb-4">
              <label className="text-xs text-[#888] uppercase mb-1 block">Question</label>
              <input value={question} onChange={e => setQuestion(e.target.value)} className="w-full bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="What should the next episode be about?" />
            </div>
            <h4 className="text-xs text-[#888] uppercase mb-2">Options</h4>
            {options.map((opt, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={opt} onChange={e => { const newOpts = [...options]; newOpts[i] = e.target.value; setOptions(newOpts); }} className="flex-1 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder={`Option ${i + 1}`} />
                {options.length > 2 && <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="text-red-400"><Trash2 className="size-4" /></button>}
              </div>
            ))}
            <div className="flex gap-3 mt-3">
              <Btn variant="ghost" onClick={() => setOptions([...options, ""])}><Plus className="size-3 inline mr-1" />Add Option</Btn>
              <Btn onClick={async () => {
                const validOpts = options.filter(Boolean);
                if (!question || validOpts.length < 2) return;
                await create({ question, options: validOpts });
                setShowForm(false); setQuestion(""); setOptions(["", ""]);
              }}>Create Poll</Btn>
            </div>
          </Card>
        )}

        <div className="space-y-3">
          {polls.map((p: any) => (
            <Card key={p._id}>
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="font-bold text-[#f0ece4]">{p.question}</h3>
                  <p className="text-xs text-[#888]">{p.totalVotes} votes · {p.isActive ? "🟢 Active" : "🔴 Closed"}</p>
                </div>
                <div className="flex gap-2">
                  {p.isActive && <Btn variant="ghost" onClick={() => close({ id: p._id })}>Close Poll</Btn>}
                  <Btn variant="danger" onClick={() => del({ id: p._id })}><Trash2 className="size-3" /></Btn>
                </div>
              </div>
              <div className="space-y-2">
                {p.options.map((opt: any, i: number) => {
                  const pct = p.totalVotes > 0 ? Math.round((opt.votes / p.totalVotes) * 100) : 0;
                  return (
                    <div key={i} className="relative">
                      <div className="absolute inset-0 bg-[#D4A843]/10 rounded" style={{ width: `${pct}%` }} />
                      <div className="relative flex items-center justify-between p-2 text-sm">
                        <span className="text-[#f0ece4]">{opt.text}</span>
                        <span className="text-[#D4A843] font-bold">{opt.votes} ({pct}%)</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   12. FAN ART GALLERY
   ================================================================ */
export function FanArtTab() {
  const art = useQuery(api.phase4.listFanArt) || [];
  const approve = useMutation(api.phase4.approveFanArt);
  const del = useMutation(api.phase4.deleteFanArt);

  const pending = art.filter((a: any) => !a.isApproved);
  const approved = art.filter((a: any) => a.isApproved);

  return (
    <div>
      <Section title="Fan Art Gallery" icon={Image} color="#ec4899">
        {pending.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-yellow-400 mb-3">⏳ Pending Approval ({pending.length})</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {pending.map((a: any) => (
                <Card key={a._id}>
                  <img src={a.imageUrl} alt={a.title} className="w-full h-40 object-cover rounded mb-3" onError={e => { (e.target as any).style.display = "none"; }} />
                  <h4 className="font-bold text-[#f0ece4] text-sm">{a.title}</h4>
                  <p className="text-xs text-[#888]">By {a.submitterName} · {new Date(a.createdAt).toLocaleDateString()}</p>
                  {a.description && <p className="text-xs text-[#aaa] mt-1">{a.description}</p>}
                  <div className="flex gap-2 mt-3">
                    <Btn variant="green" onClick={() => approve({ id: a._id })}>Approve</Btn>
                    <Btn variant="blue" onClick={() => approve({ id: a._id, featured: true })}>Feature</Btn>
                    <Btn variant="danger" onClick={() => del({ id: a._id })}><Trash2 className="size-3" /></Btn>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        <h3 className="text-sm font-bold text-green-400 mb-3">✅ Approved ({approved.length})</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {approved.map((a: any) => (
            <Card key={a._id}>
              <img src={a.imageUrl} alt={a.title} className="w-full h-40 object-cover rounded mb-3" onError={e => { (e.target as any).style.display = "none"; }} />
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-[#f0ece4] text-sm">{a.title} {a.isFeatured && <Star className="size-3 inline text-[#D4A843]" />}</h4>
                  <p className="text-xs text-[#888]">By {a.submitterName}</p>
                </div>
                <button onClick={() => del({ id: a._id })} className="text-red-400"><Trash2 className="size-3" /></button>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   13. ACHIEVEMENT BADGES
   ================================================================ */
export function AchievementsTab() {
  const achievements = useQuery(api.phase4.listAchievements) || [];
  const badges = useQuery(api.phase4.listFanBadges) || [];
  const create = useMutation(api.phase4.createAchievement);
  const award = useMutation(api.phase4.awardBadge);
  const del = useMutation(api.phase4.deleteAchievement);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("🏆");
  const [cat, setCat] = useState("engagement");
  const [criteria, setCriteria] = useState("");
  const [awardFan, setAwardFan] = useState("");
  const [awardAch, setAwardAch] = useState("");

  return (
    <div>
      <Section title="Achievement Badges" icon={Award} color="#D4A843">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "Create Achievement"}</Btn>
          <span className="text-sm text-[#888] self-center">{achievements.length} achievements · {badges.length} badges awarded</span>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <input value={name} onChange={e => setName(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Achievement name" />
              <input value={desc} onChange={e => setDesc(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Description" />
              <input value={icon} onChange={e => setIcon(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Emoji icon" />
              <select value={cat} onChange={e => setCat(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="engagement">Engagement</option><option value="content">Content</option><option value="community">Community</option><option value="loyalty">Loyalty</option>
              </select>
              <input value={criteria} onChange={e => setCriteria(e.target.value)} className="col-span-2 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="How to earn this badge" />
            </div>
            <Btn onClick={async () => { if (!name || !desc || !criteria) return; await create({ name, description: desc, icon, category: cat, criteria }); setShowForm(false); setName(""); setDesc(""); setCriteria(""); }}>Create Achievement</Btn>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-6">
          {achievements.map((a: any) => (
            <Card key={a._id}>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{a.icon}</span>
                <div>
                  <h3 className="font-bold text-[#f0ece4]">{a.name}</h3>
                  <p className="text-xs text-[#888]">{a.category} · {a.criteria}</p>
                </div>
              </div>
              <p className="text-xs text-[#aaa] mb-2">{a.description}</p>
              <button onClick={() => del({ id: a._id })} className="text-red-400 text-xs hover:text-red-300">Delete</button>
            </Card>
          ))}
        </div>

        {/* Award Badge Section */}
        {achievements.length > 0 && (
          <Card>
            <h3 className="font-bold text-[#f0ece4] mb-3">Award Badge to Fan</h3>
            <div className="flex gap-3">
              <input value={awardFan} onChange={e => setAwardFan(e.target.value)} className="flex-1 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Fan name" />
              <select value={awardAch} onChange={e => setAwardAch(e.target.value)} className="flex-1 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="">Select achievement</option>
                {achievements.map((a: any) => <option key={a._id} value={a._id}>{a.icon} {a.name}</option>)}
              </select>
              <Btn onClick={async () => {
                if (!awardFan || !awardAch) return;
                await award({ fanName: awardFan, achievementId: awardAch as any });
                setAwardFan("");
              }}>Award</Btn>
            </div>
            {badges.length > 0 && (
              <div className="mt-4">
                <h4 className="text-xs text-[#888] uppercase mb-2">Recent Awards</h4>
                {badges.slice(0, 10).map((b: any) => (
                  <p key={b._id} className="text-xs text-[#aaa]">{b.achievementIcon} {b.fanName} earned "{b.achievementName}" — {new Date(b.earnedAt).toLocaleDateString()}</p>
                ))}
              </div>
            )}
          </Card>
        )}
      </Section>
    </div>
  );
}


/* ================================================================
   14. CONTENT REQUEST BOARD
   ================================================================ */
export function ContentRequestTab() {
  const requests = useQuery(api.phase4.listContentRequests) || [];
  const update = useMutation(api.phase4.updateRequestStatus);
  const del = useMutation(api.phase4.deleteContentRequest);

  const statusOrder: Record<string, number> = { open: 0, planned: 1, "in-progress": 2, completed: 3, declined: 4 };
  const sorted = [...requests].sort((a, b) => (statusOrder[a.status] || 0) - (statusOrder[b.status] || 0) || b.votes - a.votes);

  return (
    <div>
      <Section title="Content Request Board" icon={MessageSquare} color="#3b82f6">
        <p className="text-sm text-[#888] mb-4">{requests.length} requests from fans · {requests.filter((r: any) => r.status === "open").length} open</p>

        <div className="space-y-2">
          {sorted.map((r: any) => (
            <Card key={r._id}>
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-center min-w-[50px]">
                  <ThumbsUp className="size-4 text-[#D4A843]" />
                  <span className="text-lg font-bold text-[#D4A843]">{r.votes}</span>
                  <span className="text-xs text-[#888]">votes</span>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-[#f0ece4]">{r.title}</h3>
                    <StatusBadge status={r.status} />
                    <span className="text-xs bg-[#2a2622] text-[#888] px-2 py-0.5 rounded">{r.category}</span>
                  </div>
                  <p className="text-xs text-[#aaa]">{r.description}</p>
                  <p className="text-xs text-[#888] mt-1">By {r.submitterName} · {new Date(r.createdAt).toLocaleDateString()}</p>
                  {r.adminResponse && <p className="text-xs text-[#D4A843] mt-1">💬 {r.adminResponse}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <select value={r.status} onChange={e => update({ id: r._id, status: e.target.value })} className="bg-[#0a0a0a] text-[#888] text-xs border border-[#2a2622] rounded p-1">
                    <option value="open">Open</option><option value="planned">Planned</option><option value="in-progress">In Progress</option><option value="completed">Completed</option><option value="declined">Declined</option>
                  </select>
                  <button onClick={() => del({ id: r._id })} className="text-red-400 text-xs hover:text-red-300">Delete</button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </Section>
    </div>
  );
}


/* ================================================================
   15. EXCLUSIVE DROPS CALENDAR
   ================================================================ */
export function ExclusiveDropsTab() {
  const drops = useQuery(api.phase4.listDrops) || [];
  const add = useMutation(api.phase4.addDrop);
  const publish = useMutation(api.phase4.publishDrop);
  const markDropped = useMutation(api.phase4.markDropped);
  const del = useMutation(api.phase4.deleteDrop);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("content");
  const [dropDate, setDropDate] = useState("");

  const typeIcons: Record<string, string> = { merch: "👕", content: "🎬", event: "🎤", collab: "🤝", announcement: "📢" };

  return (
    <div>
      <Section title="Exclusive Drops Calendar" icon={Calendar} color="#f97316">
        <div className="flex gap-3 mb-6">
          <Btn onClick={() => setShowForm(!showForm)}><Plus className="size-4 inline mr-1" />{showForm ? "Cancel" : "Schedule Drop"}</Btn>
          <span className="text-sm text-[#888] self-center">{drops.length} drops scheduled</span>
        </div>

        {showForm && (
          <Card className="mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <input value={title} onChange={e => setTitle(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Drop title" />
              <select value={type} onChange={e => setType(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm">
                <option value="content">🎬 Content</option><option value="merch">👕 Merch</option><option value="event">🎤 Event</option><option value="collab">🤝 Collab</option><option value="announcement">📢 Announcement</option>
              </select>
              <textarea value={desc} onChange={e => setDesc(e.target.value)} className="col-span-2 bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" placeholder="Description" rows={2} />
              <input type="date" value={dropDate} onChange={e => setDropDate(e.target.value)} className="bg-[#0a0a0a] text-[#f0ece4] border border-[#2a2622] rounded p-2 text-sm" />
            </div>
            <Btn onClick={async () => {
              if (!title || !desc || !dropDate) return;
              await add({ title, description: desc, type, dropDate });
              setShowForm(false); setTitle(""); setDesc(""); setDropDate("");
            }}>Schedule Drop</Btn>
          </Card>
        )}

        <div className="space-y-3">
          {[...drops].sort((a: any, b: any) => a.dropDate.localeCompare(b.dropDate)).map((d: any) => {
            const isUpcoming = new Date(d.dropDate) > new Date();
            return (
              <Card key={d._id}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{typeIcons[d.type] || "📦"}</span>
                    <div>
                      <h3 className="font-bold text-[#f0ece4]">{d.title}</h3>
                      <p className="text-xs text-[#888]">{d.type} · Drops {new Date(d.dropDate).toLocaleDateString()}</p>
                      <p className="text-xs text-[#aaa]">{d.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {!d.isPublished && <Btn variant="blue" onClick={() => publish({ id: d._id })}>Publish</Btn>}
                    {d.isPublished && !d.isDropped && isUpcoming && <span className="text-xs text-green-400">📢 Live</span>}
                    {d.isPublished && !d.isDropped && !isUpcoming && <Btn variant="green" onClick={() => markDropped({ id: d._id })}>Mark Dropped</Btn>}
                    {d.isDropped && <span className="text-xs text-[#888]">✅ Dropped</span>}
                    <button onClick={() => del({ id: d._id })} className="text-red-400"><Trash2 className="size-3" /></button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </Section>
    </div>
  );
}
