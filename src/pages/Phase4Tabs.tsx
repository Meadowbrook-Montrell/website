import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Plus, Trash2, FileText, Zap, Send, Copy, CheckCircle,
  AlertTriangle, Star, Heart, Eye, MessageSquare, Award,
  TrendingUp, TrendingDown, DollarSign, Users, Calendar,
  BarChart3, Shield, Image, ChevronDown, Clock, ExternalLink,
  Filter, ArrowRight, Sparkles, Target, Globe, Mic,
  ThumbsUp, Crown, Gift, Radio,
} from "lucide-react";

/* ═══════════════════════════════════════════════════════════
   PHASE 4 ADMIN TABS — AI Suite + Enterprise + Fan 2.0
   ═══════════════════════════════════════════════════════════ */

const gold = "bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-5 py-2.5 hover:bg-[#E8C767] transition-all";
const input = "w-full bg-[#1a1a1a] text-[#f0ece4] border border-[#333] rounded px-3 py-2.5 text-sm focus:border-[#D4A843] focus:outline-none";
const card = "bg-[#141414] border border-[#222] rounded-xl p-5";
const badge = (color: string) => `text-xs font-medium px-2.5 py-1 rounded-full ${color}`;

/* ─────────────────────────────────────────────────────────
   1. AI CONTRACT GENERATOR
   ───────────────────────────────────────────────────────── */
export function AIContractTab() {
  const contracts = useQuery(api.phase4.listContracts4) || [];
  const generate = useMutation(api.phase4.generateContract);
  const updateStatus = useMutation(api.phase4.updateContractStatus4);
  const del = useMutation(api.phase4.deleteContract4);

  const [showForm, setShowForm] = useState(false);
  const [template, setTemplate] = useState("sponsorship");
  const [title, setTitle] = useState("");
  const [party1, setParty1] = useState("Meadowbrook Montrell / 3GMG");
  const [party2, setParty2] = useState("");
  const [viewDoc, setViewDoc] = useState<string | null>(null);

  const templates = [
    { id: "sponsorship", label: "Sponsorship Agreement", icon: "🤝" },
    { id: "guest-appearance", label: "Guest Appearance Release", icon: "🎤" },
    { id: "licensing", label: "Content Licensing", icon: "📄" },
    { id: "nda", label: "Non-Disclosure (NDA)", icon: "🔒" },
    { id: "freelance", label: "Freelance Service", icon: "💼" },
  ];

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-500/20 text-yellow-400",
    sent: "bg-blue-500/20 text-blue-400",
    signed: "bg-green-500/20 text-green-400",
    expired: "bg-red-500/20 text-red-400",
  };

  const handleGenerate = async () => {
    if (!party2.trim()) return;
    await generate({ templateType: template, title: title || templates.find(t => t.id === template)?.label || "Contract", party1, party2, fields: {} });
    setShowForm(false); setTitle(""); setParty2("");
  };

  if (viewDoc) {
    const contract = contracts.find((c: any) => c._id === viewDoc);
    return (
      <div className="space-y-4">
        <button onClick={() => setViewDoc(null)} className="text-[#D4A843] text-sm hover:underline">← Back to Contracts</button>
        <div className={card}>
          <h3 className="text-lg font-bold text-[#f0ece4] mb-4">{contract?.title}</h3>
          <pre className="text-sm text-[#ccc] whitespace-pre-wrap font-mono leading-relaxed bg-[#0a0a0a] rounded-lg p-6 max-h-[600px] overflow-y-auto">{contract?.generatedText}</pre>
          <div className="flex gap-2 mt-4">
            <button onClick={() => { navigator.clipboard.writeText(contract?.generatedText || ""); }} className={gold}><Copy className="size-4 inline mr-1" /> Copy Text</button>
            {contract?.status === "draft" && <button onClick={() => updateStatus({ id: contract._id, status: "sent" })} className="bg-blue-600 text-white text-sm font-bold rounded px-4 py-2.5 hover:bg-blue-500">Mark as Sent</button>}
            {contract?.status === "sent" && <button onClick={() => updateStatus({ id: contract._id, status: "signed" })} className="bg-green-600 text-white text-sm font-bold rounded px-4 py-2.5 hover:bg-green-500">Mark as Signed</button>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">📝 AI Contract Generator</h2>
          <p className="text-sm text-[#888]">Generate professional contracts from templates</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> New Contract</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <h3 className="font-bold text-[#f0ece4]">Choose Template</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {templates.map(t => (
              <button key={t.id} onClick={() => setTemplate(t.id)}
                className={`p-3 rounded-lg border text-left transition-all ${template === t.id ? "border-[#D4A843] bg-[#D4A843]/10" : "border-[#333] hover:border-[#555]"}`}>
                <span className="text-2xl block mb-1">{t.icon}</span>
                <span className="text-sm text-[#f0ece4]">{t.label}</span>
              </button>
            ))}
          </div>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Contract title (optional)" className={input} />
          <input value={party1} onChange={e => setParty1(e.target.value)} placeholder="Your name / entity" className={input} />
          <input value={party2} onChange={e => setParty2(e.target.value)} placeholder="Other party name *" className={input} />
          <button onClick={handleGenerate} className={gold}><Sparkles className="size-4 inline mr-1" /> Generate Contract</button>
        </div>
      )}

      <div className="space-y-3">
        {contracts.map((c: any) => (
          <div key={c._id} className={card + " flex items-center justify-between"}>
            <div className="flex-1 cursor-pointer" onClick={() => setViewDoc(c._id)}>
              <p className="font-bold text-[#f0ece4]">{c.title}</p>
              <p className="text-xs text-[#888]">{c.parties.party1} ↔ {c.parties.party2} • {c.templateType}</p>
            </div>
            <div className="flex items-center gap-2">
              <span className={badge(statusColors[c.status] || statusColors.draft)}>{c.status}</span>
              <button onClick={() => del({ id: c._id })} className="text-red-400 hover:text-red-300"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {contracts.length === 0 && <p className="text-center text-[#666] py-8">No contracts yet. Generate your first one!</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   2. AI SOCIAL CAPTIONS
   ───────────────────────────────────────────────────────── */
export function AICaptionsTab() {
  const captions = useQuery(api.phase4.listCaptions) || [];
  const generate = useMutation(api.phase4.generateCaptionsAction);
  const toggleSaved = useMutation(api.phase4.toggleCaptionSaved);
  const del = useMutation(api.phase4.deleteCaptions);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [topic, setTopic] = useState("");

  const platformIcons: Record<string, string> = { instagram: "📸", tiktok: "🎵", youtube: "🎬", facebook: "📱", twitter: "🐦" };

  const handleGenerate = async () => {
    if (!title.trim()) return;
    await generate({ sourceTitle: title, sourceTopic: topic || undefined });
    setShowForm(false); setTitle(""); setTopic("");
  };

  // Group by sourceTitle
  const grouped = captions.reduce((acc: Record<string, any[]>, c: any) => {
    const key = c.sourceTitle;
    if (!acc[key]) acc[key] = [];
    acc[key].push(c);
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">✍️ AI Social Captions</h2>
          <p className="text-sm text-[#888]">Generate platform-specific captions for your content</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> Generate Captions</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Video / content title *" className={input} />
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Topic or keywords (optional)" className={input} />
          <button onClick={handleGenerate} className={gold}><Sparkles className="size-4 inline mr-1" /> Generate for All Platforms</button>
        </div>
      )}

      {Object.entries(grouped).map(([sourceTitle, items]) => (
        <div key={sourceTitle} className={card + " space-y-3"}>
          <h3 className="font-bold text-[#f0ece4]">🎬 {sourceTitle}</h3>
          <div className="grid gap-3">
            {(items as any[]).map((c: any) => (
              <div key={c._id} className="bg-[#0a0a0a] rounded-lg p-4 border border-[#222]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-bold text-[#f0ece4]">{platformIcons[c.platform] || "📱"} {c.platform.charAt(0).toUpperCase() + c.platform.slice(1)}</span>
                  <div className="flex gap-2">
                    <button onClick={() => navigator.clipboard.writeText(c.generatedCaption)} className="text-xs text-[#D4A843] hover:underline">Copy</button>
                    <button onClick={() => toggleSaved({ id: c._id })} className={`text-xs ${c.isSaved ? "text-yellow-400" : "text-[#666]"}`}>{c.isSaved ? "★ Saved" : "☆ Save"}</button>
                    <button onClick={() => del({ id: c._id })} className="text-xs text-red-400">Delete</button>
                  </div>
                </div>
                <pre className="text-sm text-[#ccc] whitespace-pre-wrap">{c.generatedCaption}</pre>
              </div>
            ))}
          </div>
        </div>
      ))}
      {captions.length === 0 && <p className="text-center text-[#666] py-8">Generate captions to see them here</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   3. AI EPISODE PREP KIT
   ───────────────────────────────────────────────────────── */
export function AIEpisodePrepTab() {
  const preps = useQuery(api.phase4.listEpisodePreps) || [];
  const generate = useMutation(api.phase4.generateEpisodePrepAction);
  const del = useMutation(api.phase4.deleteEpisodePrep);

  const [showForm, setShowForm] = useState(false);
  const [guest, setGuest] = useState("");
  const [bio, setBio] = useState("");
  const [topic, setTopic] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!guest.trim() || !topic.trim()) return;
    await generate({ guestName: guest, guestBio: bio || undefined, topic });
    setShowForm(false); setGuest(""); setBio(""); setTopic("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">🎙️ AI Episode Prep Kit</h2>
          <p className="text-sm text-[#888]">Generate interview questions, outlines & cold opens</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> New Prep Kit</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={guest} onChange={e => setGuest(e.target.value)} placeholder="Guest name *" className={input} />
          <input value={bio} onChange={e => setBio(e.target.value)} placeholder="Guest bio / background (optional)" className={input} />
          <input value={topic} onChange={e => setTopic(e.target.value)} placeholder="Episode topic *" className={input} />
          <button onClick={handleGenerate} className={gold}><Sparkles className="size-4 inline mr-1" /> Generate Prep Kit</button>
        </div>
      )}

      {preps.map((p: any) => (
        <div key={p._id} className={card}>
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === p._id ? null : p._id)}>
            <div>
              <p className="font-bold text-[#f0ece4]">🎤 {p.guestName} — "{p.topic}"</p>
              <p className="text-xs text-[#888]">{p.questions?.length || 0} questions • {new Date(p.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-2">
              {p.isUsed && <span className={badge("bg-green-500/20 text-green-400")}>Used</span>}
              <ChevronDown className={`size-5 text-[#888] transition-transform ${expanded === p._id ? "rotate-180" : ""}`} />
              <button onClick={(e) => { e.stopPropagation(); del({ id: p._id }); }} className="text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>

          {expanded === p._id && (
            <div className="mt-4 space-y-4">
              {p.coldOpen && (
                <div>
                  <h4 className="text-sm font-bold text-[#D4A843] mb-2">🎬 Cold Open</h4>
                  <pre className="text-sm text-[#ccc] whitespace-pre-wrap bg-[#0a0a0a] rounded-lg p-4">{p.coldOpen}</pre>
                </div>
              )}
              <div>
                <h4 className="text-sm font-bold text-[#D4A843] mb-2">📋 Interview Questions</h4>
                <div className="space-y-2">
                  {p.questions?.map((q: string, i: number) => (
                    <div key={i} className="flex gap-3 text-sm text-[#ccc] bg-[#0a0a0a] rounded-lg px-4 py-3">
                      <span className="text-[#D4A843] font-bold">{i + 1}.</span>
                      <span>{q}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#D4A843] mb-2">📝 Episode Outline</h4>
                <pre className="text-sm text-[#ccc] whitespace-pre-wrap bg-[#0a0a0a] rounded-lg p-4">{p.outline}</pre>
              </div>
              <div>
                <h4 className="text-sm font-bold text-[#D4A843] mb-2">💡 Talking Points</h4>
                <ul className="space-y-1">
                  {p.talkingPoints?.map((tp: string, i: number) => (
                    <li key={i} className="text-sm text-[#ccc] flex items-start gap-2"><ArrowRight className="size-3 text-[#D4A843] mt-1 shrink-0" />{tp}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      ))}
      {preps.length === 0 && <p className="text-center text-[#666] py-8">No prep kits yet. Create one for your next episode!</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   4. AI INVOICE GENERATOR
   ───────────────────────────────────────────────────────── */
export function AIInvoiceTab() {
  const invoices = useQuery(api.phase4.listInvoices4) || [];
  const create = useMutation(api.phase4.createInvoice);
  const updateStatus = useMutation(api.phase4.updateInvoiceStatus);
  const del = useMutation(api.phase4.deleteInvoice);

  const [showForm, setShowForm] = useState(false);
  const [client, setClient] = useState("");
  const [email, setEmail] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [notes, setNotes] = useState("");
  const [items, setItems] = useState([{ description: "", quantity: 1, rate: 0 }]);

  const statusColors: Record<string, string> = {
    draft: "bg-yellow-500/20 text-yellow-400", sent: "bg-blue-500/20 text-blue-400",
    paid: "bg-green-500/20 text-green-400", overdue: "bg-red-500/20 text-red-400",
  };

  const handleCreate = async () => {
    if (!client.trim() || !dueDate) return;
    const lineItems = items.filter(i => i.description).map(i => ({
      description: i.description, quantity: i.quantity, rate: i.rate, amount: i.quantity * i.rate,
    }));
    await create({ clientName: client, clientEmail: email || undefined, lineItems, dueDate, notes: notes || undefined });
    setShowForm(false); setClient(""); setEmail(""); setDueDate(""); setNotes(""); setItems([{ description: "", quantity: 1, rate: 0 }]);
  };

  const subtotal = items.reduce((s, i) => s + (i.quantity * i.rate), 0);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">💰 AI Invoice Generator</h2>
          <p className="text-sm text-[#888]">Create professional invoices with auto-numbering</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> New Invoice</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <div className="grid grid-cols-2 gap-4">
            <input value={client} onChange={e => setClient(e.target.value)} placeholder="Client name *" className={input} />
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Client email" className={input} />
          </div>
          <input type="date" value={dueDate} onChange={e => setDueDate(e.target.value)} className={input} />
          <div className="space-y-2">
            <p className="text-sm font-bold text-[#f0ece4]">Line Items</p>
            {items.map((item, i) => (
              <div key={i} className="grid grid-cols-[1fr_80px_100px_auto] gap-2">
                <input value={item.description} onChange={e => { const n = [...items]; n[i].description = e.target.value; setItems(n); }} placeholder="Description" className={input} />
                <input type="number" value={item.quantity} onChange={e => { const n = [...items]; n[i].quantity = +e.target.value; setItems(n); }} className={input} />
                <input type="number" value={item.rate} onChange={e => { const n = [...items]; n[i].rate = +e.target.value; setItems(n); }} placeholder="Rate" className={input} />
                <button onClick={() => setItems(items.filter((_, j) => j !== i))} className="text-red-400"><Trash2 className="size-4" /></button>
              </div>
            ))}
            <button onClick={() => setItems([...items, { description: "", quantity: 1, rate: 0 }])} className="text-sm text-[#D4A843] hover:underline">+ Add item</button>
            <p className="text-right text-lg font-bold text-[#D4A843]">Total: ${subtotal.toFixed(2)}</p>
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Notes (optional)" className={input + " h-20"} />
          <button onClick={handleCreate} className={gold}><FileText className="size-4 inline mr-1" /> Create Invoice</button>
        </div>
      )}

      <div className="space-y-3">
        {invoices.map((inv: any) => (
          <div key={inv._id} className={card + " flex items-center justify-between"}>
            <div>
              <p className="font-bold text-[#f0ece4]">{inv.invoiceNumber}</p>
              <p className="text-xs text-[#888]">{inv.clientName} • Due {inv.dueDate}</p>
            </div>
            <div className="flex items-center gap-3">
              <p className="text-lg font-bold text-[#D4A843]">${inv.total?.toFixed(2)}</p>
              <span className={badge(statusColors[inv.status] || "")}>{inv.status}</span>
              <div className="flex gap-1">
                {inv.status === "draft" && <button onClick={() => updateStatus({ id: inv._id, status: "sent" })} className="text-xs bg-blue-600/20 text-blue-400 px-2 py-1 rounded hover:bg-blue-600/30">Send</button>}
                {inv.status === "sent" && <button onClick={() => updateStatus({ id: inv._id, status: "paid", paidAt: new Date().toISOString() })} className="text-xs bg-green-600/20 text-green-400 px-2 py-1 rounded hover:bg-green-600/30">Paid</button>}
                <button onClick={() => del({ id: inv._id })} className="text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
          </div>
        ))}
        {invoices.length === 0 && <p className="text-center text-[#666] py-8">No invoices yet</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   5. AI CONTENT REPURPOSER
   ───────────────────────────────────────────────────────── */
export function AIRepurposeTab() {
  const items = useQuery(api.phase4.listRepurpose) || [];
  const generate = useMutation(api.phase4.generateRepurpose);
  const toggle = useMutation(api.phase4.toggleRepurposeItem);
  const del = useMutation(api.phase4.deleteRepurpose);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("video");

  const handleGenerate = async () => {
    if (!title.trim()) return;
    await generate({ sourceTitle: title, sourceType: type });
    setShowForm(false); setTitle("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">♻️ AI Content Repurposer</h2>
          <p className="text-sm text-[#888]">Turn one piece of content into 10+ assets</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> Repurpose Content</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Content title *" className={input} />
          <select value={type} onChange={e => setType(e.target.value)} className={input}>
            <option value="video">Video</option><option value="podcast">Podcast</option>
            <option value="interview">Interview</option><option value="blog">Blog Post</option>
          </select>
          <button onClick={handleGenerate} className={gold}><Sparkles className="size-4 inline mr-1" /> Generate Suggestions</button>
        </div>
      )}

      {items.map((item: any) => (
        <div key={item._id} className={card}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-bold text-[#f0ece4]">🎬 {item.sourceTitle}</p>
              <p className="text-xs text-[#888]">{item.sourceType} • {item.suggestions?.length || 0} suggestions</p>
            </div>
            <button onClick={() => del({ id: item._id })} className="text-red-400"><Trash2 className="size-4" /></button>
          </div>
          <div className="space-y-2">
            {item.suggestions?.map((s: any, i: number) => (
              <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border transition-all ${s.isCompleted ? "bg-green-900/10 border-green-800/30" : "bg-[#0a0a0a] border-[#222]"}`}>
                <button onClick={() => toggle({ id: item._id, index: i })} className={`mt-0.5 ${s.isCompleted ? "text-green-400" : "text-[#555]"}`}>
                  <CheckCircle className="size-5" />
                </button>
                <div className="flex-1">
                  <p className={`text-sm font-medium ${s.isCompleted ? "text-green-300 line-through" : "text-[#f0ece4]"}`}>{s.format} → {s.platform}</p>
                  <p className="text-xs text-[#888] mt-0.5">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
      {items.length === 0 && <p className="text-center text-[#666] py-8">Generate repurposing ideas for your content</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   6. CRM INTELLIGENCE
   ───────────────────────────────────────────────────────── */
export function CRMIntelligenceTab() {
  const scores = useQuery(api.phase4.listContactScores) || [];
  const add = useMutation(api.phase4.addContactScore);
  const del = useMutation(api.phase4.deleteContactScore);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [score, setScore] = useState(50);
  const [health, setHealth] = useState("warm");
  const [interactions, setInteractions] = useState(1);
  const [tags, setTags] = useState("");
  const [action, setAction] = useState("");

  const healthColors: Record<string, string> = { hot: "bg-red-500/20 text-red-400", warm: "bg-orange-500/20 text-orange-400", cold: "bg-blue-500/20 text-blue-400", "at-risk": "bg-yellow-500/20 text-yellow-400" };

  const handleAdd = async () => {
    if (!name.trim()) return;
    await add({ contactName: name, relationshipScore: score, interactionCount: interactions, tags: tags.split(",").map(t => t.trim()).filter(Boolean), healthStatus: health, suggestedAction: action || undefined });
    setShowForm(false); setName(""); setScore(50); setHealth("warm"); setTags(""); setAction("");
  };

  const avg = scores.length ? Math.round(scores.reduce((a: number, s: any) => a + s.relationshipScore, 0) / scores.length) : 0;
  const hotCount = scores.filter((s: any) => s.healthStatus === "hot").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">🧠 CRM Intelligence</h2>
          <p className="text-sm text-[#888]">Relationship scoring & follow-up recommendations</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> Score Contact</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className={card + " text-center"}><p className="text-3xl font-bold text-[#D4A843]">{scores.length}</p><p className="text-xs text-[#888] mt-1">Scored Contacts</p></div>
        <div className={card + " text-center"}><p className="text-3xl font-bold text-green-400">{avg}</p><p className="text-xs text-[#888] mt-1">Avg Score</p></div>
        <div className={card + " text-center"}><p className="text-3xl font-bold text-red-400">{hotCount}</p><p className="text-xs text-[#888] mt-1">Hot Leads</p></div>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Contact name *" className={input} />
          <div className="flex items-center gap-4">
            <label className="text-sm text-[#888]">Score: {score}</label>
            <input type="range" min={0} max={100} value={score} onChange={e => setScore(+e.target.value)} className="flex-1" />
          </div>
          <select value={health} onChange={e => setHealth(e.target.value)} className={input}>
            <option value="hot">🔥 Hot</option><option value="warm">🟠 Warm</option>
            <option value="cold">🧊 Cold</option><option value="at-risk">⚠️ At Risk</option>
          </select>
          <input value={tags} onChange={e => setTags(e.target.value)} placeholder="Tags (comma separated): sponsor, guest, vip" className={input} />
          <input value={action} onChange={e => setAction(e.target.value)} placeholder="Suggested next action" className={input} />
          <button onClick={handleAdd} className={gold}>Add Score</button>
        </div>
      )}

      <div className="space-y-3">
        {scores.map((s: any) => (
          <div key={s._id} className={card + " flex items-center justify-between"}>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#D4A843]/30 to-[#D4A843]/10 flex items-center justify-center text-lg font-bold text-[#D4A843]">{s.relationshipScore}</div>
              <div>
                <p className="font-bold text-[#f0ece4]">{s.contactName}</p>
                <div className="flex gap-1 mt-1">{s.tags?.map((t: string, i: number) => <span key={i} className="text-xs bg-[#333] text-[#ccc] px-2 py-0.5 rounded">{t}</span>)}</div>
                {s.suggestedAction && <p className="text-xs text-[#D4A843] mt-1">→ {s.suggestedAction}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className={badge(healthColors[s.healthStatus] || "")}>{s.healthStatus}</span>
              <button onClick={() => del({ id: s._id })} className="text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   7. COMPETITOR TRACKER
   ───────────────────────────────────────────────────────── */
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

  const handleAdd = async () => {
    if (!name.trim() || !url.trim()) return;
    await add({ name, platform, profileUrl: url, subscribers: subs ? +subs : undefined, contentThemes: themes.split(",").map(t => t.trim()).filter(Boolean) });
    setShowForm(false); setName(""); setUrl(""); setSubs(""); setThemes("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">🔍 Competitor Tracker</h2>
          <p className="text-sm text-[#888]">Monitor rival creators and benchmark performance</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> Add Competitor</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Creator / channel name *" className={input} />
          <select value={platform} onChange={e => setPlatform(e.target.value)} className={input}>
            <option value="youtube">YouTube</option><option value="instagram">Instagram</option>
            <option value="tiktok">TikTok</option><option value="facebook">Facebook</option>
          </select>
          <input value={url} onChange={e => setUrl(e.target.value)} placeholder="Profile URL *" className={input} />
          <input value={subs} onChange={e => setSubs(e.target.value)} placeholder="Subscriber / follower count" type="number" className={input} />
          <input value={themes} onChange={e => setThemes(e.target.value)} placeholder="Content themes (comma separated)" className={input} />
          <button onClick={handleAdd} className={gold}>Add Competitor</button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {competitors.map((c: any) => (
          <div key={c._id} className={card}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-[#f0ece4]">{c.name}</p>
                <p className="text-xs text-[#888]">{c.platform} {c.subscribers ? `• ${(c.subscribers / 1000).toFixed(1)}K subs` : ""}</p>
              </div>
              <button onClick={() => del({ id: c._id })} className="text-red-400"><Trash2 className="size-4" /></button>
            </div>
            <a href={c.profileUrl} target="_blank" className="text-xs text-[#D4A843] hover:underline flex items-center gap-1"><ExternalLink className="size-3" /> View Profile</a>
            {c.contentThemes?.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">{c.contentThemes.map((t: string, i: number) => <span key={i} className="text-xs bg-[#333] text-[#ccc] px-2 py-0.5 rounded">{t}</span>)}</div>
            )}
          </div>
        ))}
      </div>
      {competitors.length === 0 && <p className="text-center text-[#666] py-8">Add competitors to start tracking</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   8. BRAND DEAL CALCULATOR
   ───────────────────────────────────────────────────────── */
export function BrandDealCalcTab() {
  const deals = useQuery(api.phase4.listBrandDeals) || [];
  const calc = useMutation(api.phase4.calculateBrandDeal);
  const del = useMutation(api.phase4.deleteBrandDeal);

  const [showForm, setShowForm] = useState(false);
  const [platform, setPlatform] = useState("youtube");
  const [followers, setFollowers] = useState("");
  const [views, setViews] = useState("");
  const [engagement, setEngagement] = useState("4");
  const [niche, setNiche] = useState("entertainment");
  const [dealType, setDealType] = useState("dedicated");

  const handleCalc = async () => {
    if (!followers || !views) return;
    await calc({ platform, followers: +followers, avgViews: +views, engagementRate: +engagement, niche, dealType });
    setShowForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">💵 Brand Deal Calculator</h2>
          <p className="text-sm text-[#888]">Calculate your sponsorship rates based on real metrics</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> Calculate Rate</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <div className="grid grid-cols-2 gap-4">
            <select value={platform} onChange={e => setPlatform(e.target.value)} className={input}>
              <option value="youtube">YouTube</option><option value="instagram">Instagram</option>
              <option value="tiktok">TikTok</option><option value="facebook">Facebook</option>
            </select>
            <select value={dealType} onChange={e => setDealType(e.target.value)} className={input}>
              <option value="shoutout">Shoutout</option><option value="dedicated">Dedicated Video</option>
              <option value="integration">Brand Integration</option><option value="ambassador">Brand Ambassador</option>
            </select>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <input value={followers} onChange={e => setFollowers(e.target.value)} placeholder="Followers" type="number" className={input} />
            <input value={views} onChange={e => setViews(e.target.value)} placeholder="Avg views" type="number" className={input} />
            <input value={engagement} onChange={e => setEngagement(e.target.value)} placeholder="Engagement %" type="number" className={input} />
          </div>
          <select value={niche} onChange={e => setNiche(e.target.value)} className={input}>
            <option value="news">News</option><option value="entertainment">Entertainment</option>
            <option value="music">Music</option><option value="lifestyle">Lifestyle</option>
            <option value="sports">Sports</option><option value="tech">Tech</option>
          </select>
          <button onClick={handleCalc} className={gold}><DollarSign className="size-4 inline mr-1" /> Calculate</button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {deals.map((d: any) => (
          <div key={d._id} className={card}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <p className="font-bold text-[#f0ece4] capitalize">{d.platform} — {d.dealType}</p>
                <p className="text-xs text-[#888]">{(d.followers / 1000).toFixed(1)}K followers • {(d.avgViews / 1000).toFixed(1)}K avg views • {d.engagementRate}% engagement</p>
              </div>
              <button onClick={() => del({ id: d._id })} className="text-red-400"><Trash2 className="size-4" /></button>
            </div>
            <div className="text-center py-3 bg-[#0a0a0a] rounded-lg">
              <p className="text-3xl font-bold text-[#D4A843]">${d.calculatedRate?.toLocaleString()}</p>
              <p className="text-xs text-[#888] mt-1">Range: ${d.rateRange?.low?.toLocaleString()} – ${d.rateRange?.high?.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>
      {deals.length === 0 && <p className="text-center text-[#666] py-8">Calculate your sponsorship rates</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   9. WEEKLY REPORTS
   ───────────────────────────────────────────────────────── */
export function WeeklyReportsTab() {
  const reports = useQuery(api.phase4.listWeeklyReports) || [];
  const generate = useMutation(api.phase4.generateWeeklyReport);

  const [expanded, setExpanded] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">📊 Weekly Business Report</h2>
          <p className="text-sm text-[#888]">Auto-generated performance summaries</p>
        </div>
        <button onClick={() => generate({})} className={gold}><BarChart3 className="size-4 inline mr-1" /> Generate Report</button>
      </div>

      {reports.map((r: any) => (
        <div key={r._id} className={card}>
          <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpanded(expanded === r._id ? null : r._id)}>
            <div>
              <p className="font-bold text-[#f0ece4]">📈 Week of {r.weekStart} → {r.weekEnd}</p>
              <p className="text-xs text-[#888]">Revenue: ${r.revenue?.total?.toLocaleString() || 0}</p>
            </div>
            <ChevronDown className={`size-5 text-[#888] transition-transform ${expanded === r._id ? "rotate-180" : ""}`} />
          </div>

          {expanded === r._id && (
            <div className="mt-4 space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-green-400">${r.revenue?.total?.toLocaleString()}</p>
                  <p className="text-xs text-[#888]">Total Revenue</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-blue-400">{r.content?.published}</p>
                  <p className="text-xs text-[#888]">Content Pieces</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-purple-400">{r.community?.qaQuestions}</p>
                  <p className="text-xs text-[#888]">Fan Questions</p>
                </div>
                <div className="bg-[#0a0a0a] rounded-lg p-3 text-center">
                  <p className="text-xl font-bold text-[#D4A843]">{r.operations?.tasksCompleted}</p>
                  <p className="text-xs text-[#888]">Tasks Done</p>
                </div>
              </div>
              {r.highlights?.length > 0 && (
                <div>
                  <h4 className="text-sm font-bold text-[#D4A843] mb-2">Key Highlights</h4>
                  <ul className="space-y-1">{r.highlights.map((h: string, i: number) => (
                    <li key={i} className="text-sm text-[#ccc] flex items-start gap-2"><Star className="size-3 text-[#D4A843] mt-1 shrink-0" />{h}</li>
                  ))}</ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
      {reports.length === 0 && <p className="text-center text-[#666] py-8">Generate your first weekly report</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   10. TEAM ROLES
   ───────────────────────────────────────────────────────── */
export function TeamRolesTab() {
  const roles = useQuery(api.phase4.listTeamRoles) || [];
  const add = useMutation(api.phase4.addTeamRole);
  const toggle = useMutation(api.phase4.toggleTeamRoleActive);
  const del = useMutation(api.phase4.deleteTeamRole);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("viewer");

  const roleColors: Record<string, string> = { admin: "bg-red-500/20 text-red-400", editor: "bg-blue-500/20 text-blue-400", finance: "bg-green-500/20 text-green-400", viewer: "bg-gray-500/20 text-gray-400" };
  const defaultPerms: Record<string, string[]> = { admin: ["*"], editor: ["content", "community", "media"], finance: ["revenue", "expenses", "invoices"], viewer: ["overview"] };

  const handleAdd = async () => {
    if (!name.trim() || !email.trim()) return;
    await add({ userName: name, email, role, permissions: defaultPerms[role] || ["overview"] });
    setShowForm(false); setName(""); setEmail("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">👥 Team Roles & Permissions</h2>
          <p className="text-sm text-[#888]">Manage who has access to what</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> Add Member</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Name *" className={input} />
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email *" className={input} />
          <select value={role} onChange={e => setRole(e.target.value)} className={input}>
            <option value="admin">Admin (Full Access)</option><option value="editor">Editor (Content)</option>
            <option value="finance">Finance (Money)</option><option value="viewer">Viewer (Read Only)</option>
          </select>
          <button onClick={handleAdd} className={gold}>Add Team Member</button>
        </div>
      )}

      <div className="space-y-3">
        {roles.map((r: any) => (
          <div key={r._id} className={card + " flex items-center justify-between"}>
            <div>
              <p className="font-bold text-[#f0ece4]">{r.userName}</p>
              <p className="text-xs text-[#888]">{r.email}</p>
              <div className="flex gap-1 mt-1">{r.permissions?.map((p: string, i: number) => <span key={i} className="text-xs bg-[#222] text-[#aaa] px-2 py-0.5 rounded">{p}</span>)}</div>
            </div>
            <div className="flex items-center gap-2">
              <span className={badge(roleColors[r.role] || "")}>{r.role}</span>
              <button onClick={() => toggle({ id: r._id })} className={`text-xs px-2 py-1 rounded ${r.isActive ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"}`}>{r.isActive ? "Active" : "Disabled"}</button>
              <button onClick={() => del({ id: r._id })} className="text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {roles.length === 0 && <p className="text-center text-[#666] py-8">No team members added yet</p>}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   11. LIVE POLLS (Admin)
   ───────────────────────────────────────────────────────── */
export function LivePollsAdminTab() {
  const polls = useQuery(api.phase4.listPolls) || [];
  const create = useMutation(api.phase4.createPoll);
  const closePoll = useMutation(api.phase4.closePoll);
  const del = useMutation(api.phase4.deletePoll);

  const [showForm, setShowForm] = useState(false);
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", ""]);

  const handleCreate = async () => {
    const validOptions = options.filter(o => o.trim());
    if (!question.trim() || validOptions.length < 2) return;
    await create({ question, options: validOptions });
    setShowForm(false); setQuestion(""); setOptions(["", ""]);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">📊 Live Polls</h2>
          <p className="text-sm text-[#888]">Create real-time polls for your audience</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> New Poll</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="Poll question *" className={input} />
          {options.map((opt, i) => (
            <div key={i} className="flex gap-2">
              <input value={opt} onChange={e => { const n = [...options]; n[i] = e.target.value; setOptions(n); }} placeholder={`Option ${i + 1}`} className={input} />
              {options.length > 2 && <button onClick={() => setOptions(options.filter((_, j) => j !== i))} className="text-red-400"><Trash2 className="size-4" /></button>}
            </div>
          ))}
          <button onClick={() => setOptions([...options, ""])} className="text-sm text-[#D4A843] hover:underline">+ Add option</button>
          <button onClick={handleCreate} className={gold}>Create Poll</button>
        </div>
      )}

      {polls.map((p: any) => {
        const maxVotes = Math.max(...(p.options?.map((o: any) => o.votes) || [1]), 1);
        return (
          <div key={p._id} className={card}>
            <div className="flex items-center justify-between mb-4">
              <div>
                <p className="font-bold text-[#f0ece4]">{p.question}</p>
                <p className="text-xs text-[#888]">{p.totalVotes} total votes • {p.isActive ? "🟢 Active" : "🔴 Closed"}</p>
              </div>
              <div className="flex gap-2">
                {p.isActive && <button onClick={() => closePoll({ id: p._id })} className="text-xs bg-red-600/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-600/30">Close Poll</button>}
                <button onClick={() => del({ id: p._id })} className="text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
            <div className="space-y-2">
              {p.options?.map((opt: any, i: number) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-[#f0ece4]">{opt.text}</span>
                    <span className="text-[#888]">{opt.votes} votes ({p.totalVotes ? Math.round((opt.votes / p.totalVotes) * 100) : 0}%)</span>
                  </div>
                  <div className="h-3 bg-[#222] rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-[#D4A843] to-[#E8C767] rounded-full transition-all" style={{ width: `${(opt.votes / maxVotes) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
      {polls.length === 0 && <p className="text-center text-[#666] py-8">Create your first poll!</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   12. FAN ART GALLERY (Admin)
   ───────────────────────────────────────────────────────── */
export function FanArtAdminTab() {
  const art = useQuery(api.phase4.listFanArt) || [];
  const approve = useMutation(api.phase4.approveFanArt);
  const del = useMutation(api.phase4.deleteFanArt);

  const pending = art.filter((a: any) => !a.isApproved);
  const approved = art.filter((a: any) => a.isApproved);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#f0ece4]">🎨 Fan Art Gallery</h2>
        <p className="text-sm text-[#888]">Review and approve fan-submitted artwork</p>
      </div>

      {pending.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-yellow-400 mb-3">⏳ Pending Approval ({pending.length})</h3>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pending.map((a: any) => (
              <div key={a._id} className={card}>
                <img src={a.imageUrl} alt={a.title} className="w-full h-48 object-cover rounded-lg mb-3" onError={e => (e.target as any).style.display = "none"} />
                <p className="font-bold text-[#f0ece4]">{a.title}</p>
                <p className="text-xs text-[#888]">by {a.submitterName}</p>
                {a.description && <p className="text-xs text-[#aaa] mt-1">{a.description}</p>}
                <div className="flex gap-2 mt-3">
                  <button onClick={() => approve({ id: a._id })} className="text-xs bg-green-600/20 text-green-400 px-3 py-1.5 rounded hover:bg-green-600/30">Approve</button>
                  <button onClick={() => approve({ id: a._id, featured: true })} className="text-xs bg-[#D4A843]/20 text-[#D4A843] px-3 py-1.5 rounded hover:bg-[#D4A843]/30">Feature ⭐</button>
                  <button onClick={() => del({ id: a._id })} className="text-xs bg-red-600/20 text-red-400 px-3 py-1.5 rounded hover:bg-red-600/30">Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div>
        <h3 className="text-sm font-bold text-green-400 mb-3">✅ Approved ({approved.length})</h3>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {approved.map((a: any) => (
            <div key={a._id} className={card}>
              <img src={a.imageUrl} alt={a.title} className="w-full h-48 object-cover rounded-lg mb-3" onError={e => (e.target as any).style.display = "none"} />
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-[#f0ece4]">{a.title} {a.isFeatured && "⭐"}</p>
                  <p className="text-xs text-[#888]">by {a.submitterName}</p>
                </div>
                <button onClick={() => del({ id: a._id })} className="text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {art.length === 0 && <p className="text-center text-[#666] py-8">No fan art submissions yet</p>}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   13. ACHIEVEMENT BADGES (Admin)
   ───────────────────────────────────────────────────────── */
export function AchievementsAdminTab() {
  const achievements = useQuery(api.phase4.listAchievements) || [];
  const badges = useQuery(api.phase4.listFanBadges) || [];
  const create = useMutation(api.phase4.createAchievement);
  const award = useMutation(api.phase4.awardBadge);
  const del = useMutation(api.phase4.deleteAchievement);

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [desc, setDesc] = useState("");
  const [icon, setIcon] = useState("🏆");
  const [category, setCategory] = useState("engagement");
  const [criteria, setCriteria] = useState("");

  const [awardForm, setAwardForm] = useState<string | null>(null);
  const [fanName, setFanName] = useState("");

  const handleCreate = async () => {
    if (!name.trim()) return;
    await create({ name, description: desc, icon, category, criteria });
    setShowForm(false); setName(""); setDesc(""); setCriteria("");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">🏆 Achievement Badges</h2>
          <p className="text-sm text-[#888]">Create achievements and award badges to fans</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> New Achievement</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <div className="grid grid-cols-[60px_1fr] gap-4">
            <input value={icon} onChange={e => setIcon(e.target.value)} placeholder="🏆" className={input + " text-center text-2xl"} />
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Achievement name *" className={input} />
          </div>
          <input value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className={input} />
          <select value={category} onChange={e => setCategory(e.target.value)} className={input}>
            <option value="engagement">Engagement</option><option value="content">Content</option>
            <option value="community">Community</option><option value="loyalty">Loyalty</option>
          </select>
          <input value={criteria} onChange={e => setCriteria(e.target.value)} placeholder="How to earn this badge" className={input} />
          <button onClick={handleCreate} className={gold}>Create Achievement</button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {achievements.map((a: any) => {
          const awardCount = badges.filter((b: any) => b.achievementId === a._id).length;
          return (
            <div key={a._id} className={card}>
              <div className="flex items-start justify-between mb-2">
                <span className="text-4xl">{a.icon}</span>
                <button onClick={() => del({ id: a._id })} className="text-red-400"><Trash2 className="size-4" /></button>
              </div>
              <p className="font-bold text-[#f0ece4]">{a.name}</p>
              <p className="text-xs text-[#888] mt-1">{a.description}</p>
              <p className="text-xs text-[#666] mt-1">Category: {a.category} • Awarded: {awardCount}x</p>
              {a.criteria && <p className="text-xs text-[#D4A843] mt-1">Earn: {a.criteria}</p>}

              {awardForm === a._id ? (
                <div className="mt-3 flex gap-2">
                  <input value={fanName} onChange={e => setFanName(e.target.value)} placeholder="Fan name" className={input} />
                  <button onClick={async () => { if (fanName.trim()) { await award({ fanName, achievementId: a._id }); setAwardForm(null); setFanName(""); } }} className="text-xs bg-green-600 text-white px-3 py-2 rounded">Award</button>
                </div>
              ) : (
                <button onClick={() => setAwardForm(a._id)} className="mt-3 text-xs text-[#D4A843] hover:underline">🎖 Award to fan</button>
              )}
            </div>
          );
        })}
      </div>

      {badges.length > 0 && (
        <div>
          <h3 className="text-sm font-bold text-[#D4A843] mb-3">Recent Awards</h3>
          <div className="space-y-2">
            {badges.slice(0, 10).map((b: any) => {
              const ach = achievements.find((a: any) => a._id === b.achievementId);
              return (
                <div key={b._id} className="flex items-center gap-3 bg-[#0a0a0a] rounded-lg px-4 py-3 border border-[#222]">
                  <span className="text-xl">{ach?.icon || "🏆"}</span>
                  <div>
                    <p className="text-sm text-[#f0ece4]">{b.fanName} earned <strong>{ach?.name || "Badge"}</strong></p>
                    <p className="text-xs text-[#888]">{new Date(b.earnedAt).toLocaleDateString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   14. CONTENT REQUEST BOARD (Admin)
   ───────────────────────────────────────────────────────── */
export function ContentRequestsAdminTab() {
  const requests = useQuery(api.phase4.listContentRequests) || [];
  const updateStatus = useMutation(api.phase4.updateRequestStatus);
  const del = useMutation(api.phase4.deleteContentRequest);

  const statusColors: Record<string, string> = {
    open: "bg-blue-500/20 text-blue-400", planned: "bg-purple-500/20 text-purple-400",
    "in-progress": "bg-yellow-500/20 text-yellow-400", completed: "bg-green-500/20 text-green-400",
    declined: "bg-red-500/20 text-red-400",
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#f0ece4]">📋 Content Request Board</h2>
        <p className="text-sm text-[#888]">Review fan-submitted content ideas and requests</p>
      </div>

      {requests.length === 0 ? (
        <p className="text-center text-[#666] py-8">No content requests yet. Fans can submit at /requests</p>
      ) : (
        <div className="space-y-3">
          {requests.sort((a: any, b: any) => b.votes - a.votes).map((r: any) => (
            <div key={r._id} className={card + " flex items-start gap-4"}>
              <div className="text-center bg-[#0a0a0a] rounded-lg px-3 py-2 min-w-[60px]">
                <p className="text-xl font-bold text-[#D4A843]">{r.votes}</p>
                <p className="text-xs text-[#888]">votes</p>
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-bold text-[#f0ece4]">{r.title}</p>
                  <span className={badge(statusColors[r.status] || "")}>{r.status}</span>
                </div>
                <p className="text-sm text-[#aaa]">{r.description}</p>
                <p className="text-xs text-[#888] mt-1">by {r.submitterName} • {r.category}</p>
                {r.adminResponse && <p className="text-xs text-[#D4A843] mt-2 italic">Admin: {r.adminResponse}</p>}
                <div className="flex gap-2 mt-3">
                  {r.status === "open" && <>
                    <button onClick={() => updateStatus({ id: r._id, status: "planned", adminResponse: "Added to upcoming content calendar!" })} className="text-xs bg-purple-600/20 text-purple-400 px-3 py-1.5 rounded">Plan It</button>
                    <button onClick={() => updateStatus({ id: r._id, status: "declined", adminResponse: "Thanks for the suggestion! Not right now." })} className="text-xs bg-red-600/20 text-red-400 px-3 py-1.5 rounded">Decline</button>
                  </>}
                  {r.status === "planned" && <button onClick={() => updateStatus({ id: r._id, status: "in-progress" })} className="text-xs bg-yellow-600/20 text-yellow-400 px-3 py-1.5 rounded">Start Working</button>}
                  {r.status === "in-progress" && <button onClick={() => updateStatus({ id: r._id, status: "completed" })} className="text-xs bg-green-600/20 text-green-400 px-3 py-1.5 rounded">Mark Done</button>}
                  <button onClick={() => del({ id: r._id })} className="text-xs text-red-400 hover:underline">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────────────────────
   15. EXCLUSIVE DROPS CALENDAR (Admin)
   ───────────────────────────────────────────────────────── */
export function DropsAdminTab() {
  const drops = useQuery(api.phase4.listDrops) || [];
  const create = useMutation(api.phase4.createDrop);
  const publish = useMutation(api.phase4.publishDrop);
  const markDropped = useMutation(api.phase4.markDropped);
  const del = useMutation(api.phase4.deleteDrop);

  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("content");
  const [date, setDate] = useState("");

  const handleCreate = async () => {
    if (!title.trim() || !date) return;
    await create({ title, description: desc, type, dropDate: date });
    setShowForm(false); setTitle(""); setDesc(""); setDate("");
  };

  const typeIcons: Record<string, string> = { merch: "👕", content: "🎬", event: "🎤", collab: "🤝", announcement: "📢" };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#f0ece4]">🔥 Exclusive Drops Calendar</h2>
          <p className="text-sm text-[#888]">Schedule and hype upcoming releases</p>
        </div>
        <button onClick={() => setShowForm(!showForm)} className={gold}><Plus className="size-4 inline mr-1" /> New Drop</button>
      </div>

      {showForm && (
        <div className={card + " space-y-4"}>
          <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Drop title *" className={input} />
          <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Description" className={input + " h-20"} />
          <div className="grid grid-cols-2 gap-4">
            <select value={type} onChange={e => setType(e.target.value)} className={input}>
              <option value="content">🎬 Content</option><option value="merch">👕 Merch</option>
              <option value="event">🎤 Event</option><option value="collab">🤝 Collab</option>
              <option value="announcement">📢 Announcement</option>
            </select>
            <input type="date" value={date} onChange={e => setDate(e.target.value)} className={input} />
          </div>
          <button onClick={handleCreate} className={gold}>Schedule Drop</button>
        </div>
      )}

      <div className="space-y-3">
        {drops.map((d: any) => (
          <div key={d._id} className={card + " flex items-center justify-between"}>
            <div className="flex items-center gap-4">
              <span className="text-3xl">{typeIcons[d.type] || "🔥"}</span>
              <div>
                <p className="font-bold text-[#f0ece4]">{d.title}</p>
                <p className="text-xs text-[#888]">{d.type} • Drops {d.dropDate}</p>
                {d.description && <p className="text-xs text-[#aaa] mt-1">{d.description}</p>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!d.isPublished && <button onClick={() => publish({ id: d._id })} className="text-xs bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded">Publish</button>}
              {d.isPublished && !d.isDropped && <button onClick={() => markDropped({ id: d._id })} className="text-xs bg-green-600/20 text-green-400 px-3 py-1.5 rounded">Dropped ✓</button>}
              {d.isDropped && <span className={badge("bg-green-500/20 text-green-400")}>Dropped ✅</span>}
              <button onClick={() => del({ id: d._id })} className="text-red-400"><Trash2 className="size-4" /></button>
            </div>
          </div>
        ))}
        {drops.length === 0 && <p className="text-center text-[#666] py-8">No drops scheduled yet</p>}
      </div>
    </div>
  );
}
