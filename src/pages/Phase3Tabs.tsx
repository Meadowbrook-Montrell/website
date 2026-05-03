import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Plus, Trash2, DollarSign, FileText, Zap, Clock, ArrowRight,
  CheckCircle, AlertTriangle, Star, Heart, Eye, Send, Copy,
  ChevronDown, Filter, TrendingUp, TrendingDown, Award,
  MessageSquare, Shield, Sparkles, Bell, ExternalLink,
} from "lucide-react";

/* ─── shared card style ─── */
const card = "border border-[#D4A843]/15 rounded-lg bg-[#141414]/80";
const input = "bg-[#1a1a1a] border border-[#D4A843]/15 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none w-full";
const btn = "bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded px-5 py-2.5 hover:bg-[#E8C767] transition-all whitespace-nowrap";
const btnOutline = "border border-[#D4A843]/30 text-[#D4A843] text-xs rounded px-3 py-1.5 hover:bg-[#D4A843]/10 transition-all";
const badge = (color: string) => `inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-wider uppercase ${color}`;

/* ═══════════════════════════════════════════════════════════
   1. EXPENSE TRACKER
   ═══════════════════════════════════════════════════════════ */
export function ExpenseTrackerTab() {
  const expenses = useQuery(api.features2.listExpenses);
  const stats = useQuery(api.features2.getExpenseStats);
  const addExpense = useMutation(api.features2.addExpense);
  const deleteExpense = useMutation(api.features2.deleteExpense);
  const [title, setTitle] = useState(""); const [cat, setCat] = useState("equipment");
  const [amount, setAmount] = useState(""); const [vendor, setVendor] = useState(""); const [date, setDate] = useState("");

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className={`${card} p-5`}><p className="text-[10px] text-[#888] tracking-widest uppercase mb-1">Total Expenses</p><p className="font-display text-2xl text-red-400">${stats?.total?.toFixed(2) ?? "0.00"}</p></div>
        <div className={`${card} p-5`}><p className="text-[10px] text-[#888] tracking-widest uppercase mb-1">This Month</p><p className="font-display text-2xl text-[#f0ece4]">${stats?.thisMonth?.toFixed(2) ?? "0.00"}</p></div>
        <div className={`${card} p-5`}><p className="text-[10px] text-[#888] tracking-widest uppercase mb-1">Transactions</p><p className="font-display text-2xl text-[#D4A843]">{stats?.count ?? 0}</p></div>
        <div className={`${card} p-5`}><p className="text-[10px] text-[#888] tracking-widest uppercase mb-1">Top Category</p><p className="font-display text-lg text-[#f0ece4] capitalize">{stats?.byCategory ? Object.entries(stats.byCategory).sort((a,b) => b[1] - a[1])[0]?.[0] ?? "—" : "—"}</p></div>
      </div>
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Plus className="size-5 text-[#D4A843]" /> Log Expense</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input className={input} placeholder="Description" value={title} onChange={e => setTitle(e.target.value)} />
          <select className={input} value={cat} onChange={e => setCat(e.target.value)}>
            {["equipment","travel","studio","software","marketing","food","other"].map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase()+c.slice(1)}</option>)}
          </select>
          <input className={input} type="number" placeholder="Amount ($)" value={amount} onChange={e => setAmount(e.target.value)} />
          <input className={input} placeholder="Vendor" value={vendor} onChange={e => setVendor(e.target.value)} />
          <div className="flex gap-2">
            <input className={input} type="date" value={date} onChange={e => setDate(e.target.value)} />
            <button className={btn} onClick={async () => { if (!amount || !date) return; await addExpense({ title: title || undefined, category: cat, amount: parseFloat(amount), vendor: vendor || undefined, date }); setTitle(""); setAmount(""); setVendor(""); setDate(""); }}>Add</button>
          </div>
        </div>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Expenses <span className="text-[#888] text-sm">({expenses?.length ?? 0})</span></h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
          {expenses?.map(e => (
            <div key={e._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex-1"><p className="text-sm text-[#f0ece4]">{e.title || e.description || "Expense"}</p><p className="text-[10px] text-[#888]">{e.category} {e.vendor ? `• ${e.vendor}` : ""} • {e.date}</p></div>
              <div className="flex items-center gap-3"><span className="text-red-400 font-bold text-sm">${e.amount.toFixed(2)}</span>
                <button onClick={() => deleteExpense({ id: e._id })} className="text-[#888] hover:text-red-400"><Trash2 className="size-4" /></button></div>
            </div>
          )) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No expenses logged yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   2. CONTRACTS
   ═══════════════════════════════════════════════════════════ */
export function ContractsTab() {
  const contracts = useQuery(api.features2.listContracts);
  const addContract = useMutation(api.features2.addContract);
  const updateStatus = useMutation(api.features2.updateContractStatus);
  const deleteContract = useMutation(api.features2.deleteContract);
  const [title, setTitle] = useState(""); const [party, setParty] = useState(""); const [type, setType] = useState("guest-release");

  const statusColors: Record<string, string> = { draft: "bg-gray-500/20 text-gray-400", sent: "bg-blue-500/20 text-blue-400", viewed: "bg-yellow-500/20 text-yellow-400", signed: "bg-green-500/20 text-green-400", expired: "bg-red-500/20 text-red-400" };

  return (
    <div className="space-y-6">
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Plus className="size-5 text-[#D4A843]" /> New Contract</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <input className={input} placeholder="Contract Title" value={title} onChange={e => setTitle(e.target.value)} />
          <input className={input} placeholder="Party Name" value={party} onChange={e => setParty(e.target.value)} />
          <select className={input} value={type} onChange={e => setType(e.target.value)}>
            {["guest-release","sponsorship","nda","vendor","custom"].map(t => <option key={t} value={t}>{t.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}</option>)}
          </select>
          <button className={btn} onClick={async () => { if (!title || !party) return; await addContract({ title, party, type }); setTitle(""); setParty(""); }}>Create</button>
        </div>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">All Contracts <span className="text-[#888] text-sm">({contracts?.length ?? 0})</span></h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
          {contracts?.map(c => (
            <div key={c._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex-1">
                <div className="flex items-center gap-2"><p className="text-sm text-[#f0ece4] font-medium">{c.title}</p><span className={badge(statusColors[c.status] || "")}>{c.status}</span></div>
                <p className="text-[10px] text-[#888]">{c.party} • {c.type}</p>
              </div>
              <div className="flex items-center gap-2">
                {c.status === "draft" && <button className={btnOutline} onClick={() => updateStatus({ id: c._id, status: "sent" })}>Mark Sent</button>}
                {c.status === "sent" && <button className={btnOutline} onClick={() => updateStatus({ id: c._id, status: "signed" })}>Mark Signed</button>}
                <button onClick={() => deleteContract({ id: c._id })} className="text-[#888] hover:text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
          )) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No contracts yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   3. AI CONTENT ASSISTANT
   ═══════════════════════════════════════════════════════════ */
export function AIContentTab() {
  const items = useQuery(api.features2.listAIContent);
  const addAI = useMutation(api.features2.addAIContent);
  const toggleSaved = useMutation(api.features2.toggleAISaved);
  const markUsed = useMutation(api.features2.markAIUsed);
  const deleteAI = useMutation(api.features2.deleteAIContent);
  const [source, setSource] = useState(""); const [type, setType] = useState("description"); const [text, setText] = useState("");

  const templates: Record<string, string> = {
    description: "🎬 NEW VIDEO: [TITLE] | Meadowbrook Montrell brings you the real stories from Fort Worth. Hit subscribe and turn on notifications! #3GMG #FortWorth #StreetReporting",
    caption: "🔥 Y'all ain't ready for this one. New drop coming soon. Stay tuned. #3GMG #MakeItMakeSense #FortWorth",
    "blog-post": "# [TITLE]\n\nFort Worth, TX — In this episode of Make It Make Sense, Meadowbrook Montrell sits down with...\n\n## Key Takeaways\n- Point 1\n- Point 2\n- Point 3\n\nWatch the full episode on YouTube.",
    "show-notes": "Episode: [TITLE]\nHost: Meadowbrook Montrell\nGuest: [GUEST]\nTopics: \nTimestamps:\n- 0:00 Intro\n- 2:30 Topic 1\n- 15:00 Topic 2",
  };

  return (
    <div className="space-y-6">
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Sparkles className="size-5 text-[#D4A843]" /> Content Generator</h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-4">
          <input className={input} placeholder="Video / Episode Title" value={source} onChange={e => setSource(e.target.value)} />
          <select className={input} value={type} onChange={e => { setType(e.target.value); setText(templates[e.target.value] || ""); }}>
            {["description","caption","blog-post","show-notes","email","thread"].map(t => <option key={t} value={t}>{t.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}</option>)}
          </select>
          <button className={btn} onClick={() => setText(templates[type]?.replace(/\[TITLE\]/g, source || "[TITLE]") || "")}>
            <Sparkles className="size-4 inline mr-1" /> Generate Template
          </button>
        </div>
        <textarea className={`${input} min-h-[120px]`} placeholder="Generated content will appear here..." value={text} onChange={e => setText(e.target.value)} />
        <div className="flex justify-end mt-3 gap-2">
          <button className={btnOutline} onClick={() => { if (text) navigator.clipboard.writeText(text); }}><Copy className="size-3 inline mr-1" /> Copy</button>
          <button className={btn} onClick={async () => { if (!source || !text) return; await addAI({ sourceTitle: source, type, generatedText: text }); setSource(""); setText(""); }}>Save</button>
        </div>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Saved Content <span className="text-[#888] text-sm">({items?.length ?? 0})</span></h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
          {items?.map(i => (
            <div key={i._id} className="px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2"><span className="text-sm text-[#f0ece4] font-medium">{i.sourceTitle}</span><span className={badge("bg-[#D4A843]/20 text-[#D4A843]")}>{i.type}</span>{i.isUsed && <span className={badge("bg-green-500/20 text-green-400")}>Used</span>}</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleSaved({ id: i._id })} className={`text-xs ${i.isSaved ? "text-[#D4A843]" : "text-[#888]"}`}><Star className="size-3.5" /></button>
                  <button onClick={() => markUsed({ id: i._id })} className="text-[#888] hover:text-green-400"><CheckCircle className="size-3.5" /></button>
                  <button onClick={() => deleteAI({ id: i._id })} className="text-[#888] hover:text-red-400"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
              <p className="text-xs text-[#888] line-clamp-2">{i.generatedText}</p>
            </div>
          )) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No saved content yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   4. UNIFIED REVENUE DASHBOARD
   ═══════════════════════════════════════════════════════════ */
export function RevenueDashboardTab() {
  const data = useQuery(api.features2.getUnifiedRevenue);
  if (!data) return <div className="text-center py-12 text-[#888]">Loading revenue data...</div>;

  const sources = [
    { label: "Sponsors", value: data.breakdown.sponsors, color: "from-green-500/20 to-green-500/5 border-green-500/20", text: "text-green-400" },
    { label: "Invoices", value: data.breakdown.invoices, color: "from-blue-500/20 to-blue-500/5 border-blue-500/20", text: "text-blue-400" },
    { label: "Tip Jar", value: data.breakdown.donations, color: "from-pink-500/20 to-pink-500/5 border-pink-500/20", text: "text-pink-400" },
    { label: "Merch", value: data.breakdown.merch, color: "from-orange-500/20 to-orange-500/5 border-orange-500/20", text: "text-orange-400" },
    { label: "Other Revenue", value: data.breakdown.revenue, color: "from-purple-500/20 to-purple-500/5 border-purple-500/20", text: "text-purple-400" },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className={`${card} p-6 bg-gradient-to-br from-green-500/10 to-transparent border-green-500/20`}>
          <p className="text-[10px] text-[#888] tracking-widest uppercase mb-1 flex items-center gap-1"><TrendingUp className="size-3" /> Gross Income</p>
          <p className="font-display text-3xl text-green-400">${data.grossIncome.toFixed(2)}</p>
        </div>
        <div className={`${card} p-6 bg-gradient-to-br from-red-500/10 to-transparent border-red-500/20`}>
          <p className="text-[10px] text-[#888] tracking-widest uppercase mb-1 flex items-center gap-1"><TrendingDown className="size-3" /> Total Expenses</p>
          <p className="font-display text-3xl text-red-400">${data.totalExpenses.toFixed(2)}</p>
        </div>
        <div className={`${card} p-6 bg-gradient-to-br from-[#D4A843]/10 to-transparent border-[#D4A843]/20`}>
          <p className="text-[10px] text-[#888] tracking-widest uppercase mb-1 flex items-center gap-1"><DollarSign className="size-3" /> Net Profit</p>
          <p className={`font-display text-3xl ${data.netProfit >= 0 ? "text-[#D4A843]" : "text-red-400"}`}>${data.netProfit.toFixed(2)}</p>
        </div>
      </div>
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4">Revenue Breakdown</h3>
        <div className="space-y-3">
          {sources.map(s => (
            <div key={s.label} className="flex items-center gap-4">
              <span className="text-xs text-[#888] w-28">{s.label}</span>
              <div className="flex-1 h-6 bg-[#1a1a1a] rounded-full overflow-hidden">
                <div className={`h-full bg-gradient-to-r ${s.color} rounded-full transition-all duration-700`} style={{ width: `${data.grossIncome > 0 ? Math.max((s.value / data.grossIncome) * 100, 2) : 0}%` }} />
              </div>
              <span className={`text-sm font-bold w-20 text-right ${s.text}`}>${s.value.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   5. FOLLOW-UP SYSTEM
   ═══════════════════════════════════════════════════════════ */
export function FollowUpsTab() {
  const followUps = useQuery(api.features2.listFollowUps);
  const overdue = useQuery(api.features2.getOverdueFollowUps);
  const add = useMutation(api.features2.addFollowUp);
  const complete = useMutation(api.features2.completeFollowUp);
  const del = useMutation(api.features2.deleteFollowUp);
  const [name, setName] = useState(""); const [ctype, setCtype] = useState("guest"); const [reason, setReason] = useState(""); const [due, setDue] = useState("");

  return (
    <div className="space-y-6">
      {(overdue?.length ?? 0) > 0 && (
        <div className="border border-red-500/30 rounded-lg bg-red-500/10 p-4 flex items-center gap-3">
          <AlertTriangle className="size-5 text-red-400" />
          <p className="text-sm text-red-300"><strong>{overdue!.length} overdue follow-up{overdue!.length > 1 ? "s" : ""}!</strong> Don't leave people hanging.</p>
        </div>
      )}
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Plus className="size-5 text-[#D4A843]" /> Add Follow-Up</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input className={input} placeholder="Contact Name" value={name} onChange={e => setName(e.target.value)} />
          <select className={input} value={ctype} onChange={e => setCtype(e.target.value)}>
            {["guest","sponsor","source","collaborator","vendor"].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase()+t.slice(1)}</option>)}
          </select>
          <input className={input} placeholder="Reason" value={reason} onChange={e => setReason(e.target.value)} />
          <input className={input} type="date" value={due} onChange={e => setDue(e.target.value)} />
          <button className={btn} onClick={async () => { if (!name || !reason || !due) return; await add({ contactName: name, contactType: ctype, reason, dueDate: due }); setName(""); setReason(""); setDue(""); }}>Add</button>
        </div>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Follow-Ups <span className="text-[#888] text-sm">({followUps?.length ?? 0})</span></h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
          {followUps?.map(f => {
            const isOverdue = f.status === "pending" && f.dueDate < new Date().toISOString().slice(0, 10);
            return (
              <div key={f._id} className={`flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors ${isOverdue ? "bg-red-500/5" : ""}`}>
                <div className="flex-1">
                  <div className="flex items-center gap-2"><p className="text-sm text-[#f0ece4] font-medium">{f.contactName}</p>
                    <span className={badge(f.status === "completed" ? "bg-green-500/20 text-green-400" : isOverdue ? "bg-red-500/20 text-red-400" : "bg-blue-500/20 text-blue-400")}>{isOverdue ? "Overdue" : f.status}</span></div>
                  <p className="text-[10px] text-[#888]">{f.reason} • Due: {f.dueDate} • {f.contactType}</p>
                </div>
                <div className="flex items-center gap-2">
                  {f.status === "pending" && <button className={btnOutline} onClick={() => complete({ id: f._id })}><CheckCircle className="size-3 inline mr-1" /> Done</button>}
                  <button onClick={() => del({ id: f._id })} className="text-[#888] hover:text-red-400"><Trash2 className="size-4" /></button>
                </div>
              </div>
            );
          }) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No follow-ups yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   6. PUBLISHING PIPELINE
   ═══════════════════════════════════════════════════════════ */
export function PipelineTab() {
  const items = useQuery(api.features2.listPipeline);
  const add = useMutation(api.features2.addPipelineItem);
  const updateStage = useMutation(api.features2.updatePipelineStage);
  const del = useMutation(api.features2.deletePipelineItem);
  const [title, setTitle] = useState(""); const [ctype, setCtype] = useState("episode"); const [stage, setStage] = useState("idea");

  const stages = ["idea", "filming", "editing", "review", "scheduling", "published"];
  const stageColors: Record<string, string> = { idea: "bg-gray-500/20 text-gray-400", filming: "bg-red-500/20 text-red-400", editing: "bg-yellow-500/20 text-yellow-400", review: "bg-blue-500/20 text-blue-400", scheduling: "bg-purple-500/20 text-purple-400", published: "bg-green-500/20 text-green-400" };

  return (
    <div className="space-y-6">
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Plus className="size-5 text-[#D4A843]" /> Add to Pipeline</h3>
        <div className="grid sm:grid-cols-4 gap-3">
          <input className={input} placeholder="Content Title" value={title} onChange={e => setTitle(e.target.value)} />
          <select className={input} value={ctype} onChange={e => setCtype(e.target.value)}>
            {["episode","short","blog","social-post","podcast"].map(t => <option key={t} value={t}>{t.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}</option>)}
          </select>
          <select className={input} value={stage} onChange={e => setStage(e.target.value)}>
            {stages.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase()+s.slice(1)}</option>)}
          </select>
          <button className={btn} onClick={async () => { if (!title) return; await add({ title, contentType: ctype, stage }); setTitle(""); }}>Add</button>
        </div>
      </div>
      {/* Kanban-style columns */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {stages.map(s => (
          <div key={s} className={`${card} p-3`}>
            <div className="flex items-center justify-between mb-3"><h4 className={`text-[10px] font-bold tracking-widest uppercase ${stageColors[s]?.split(" ")[1] || "text-[#888]"}`}>{s}</h4><span className="text-[10px] text-[#555]">{items?.filter(i => i.stage === s).length ?? 0}</span></div>
            <div className="space-y-2">
              {items?.filter(i => i.stage === s).map(i => (
                <div key={i._id} className="bg-[#0a0a0a]/60 rounded p-2.5 border border-[#333]/50 group">
                  <p className="text-xs text-[#f0ece4] font-medium mb-1 line-clamp-2">{i.title}</p>
                  <p className="text-[9px] text-[#555] uppercase tracking-wider mb-2">{i.contentType}</p>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    {stages.indexOf(s) < stages.length - 1 && (
                      <button className="text-[8px] text-[#D4A843] hover:text-[#E8C767] flex items-center gap-0.5" onClick={() => updateStage({ id: i._id, stage: stages[stages.indexOf(s) + 1] })}><ArrowRight className="size-2.5" /> Next</button>
                    )}
                    <button onClick={() => del({ id: i._id })} className="text-[#888] hover:text-red-400 ml-auto"><Trash2 className="size-3" /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   7. BREAKING NEWS ALERTS (Admin)
   ═══════════════════════════════════════════════════════════ */
export function AlertsTab() {
  const alerts = useQuery(api.features2.listAllAlerts);
  const add = useMutation(api.features2.addAlert);
  const toggle = useMutation(api.features2.toggleAlert);
  const del = useMutation(api.features2.deleteAlert);
  const [headline, setHeadline] = useState(""); const [sev, setSev] = useState("breaking"); const [msg, setMsg] = useState("");

  return (
    <div className="space-y-6">
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Bell className="size-5 text-red-400" /> New Alert</h3>
        <div className="grid sm:grid-cols-3 gap-3 mb-3">
          <input className={input} placeholder="Headline" value={headline} onChange={e => setHeadline(e.target.value)} />
          <select className={input} value={sev} onChange={e => setSev(e.target.value)}>
            <option value="breaking">🔴 Breaking</option><option value="urgent">🟡 Urgent</option><option value="info">🔵 Info</option>
          </select>
          <button className={btn} onClick={async () => { if (!headline) return; await add({ headline, severity: sev, message: msg || undefined }); setHeadline(""); setMsg(""); }}>Publish Alert</button>
        </div>
        <input className={input} placeholder="Optional details..." value={msg} onChange={e => setMsg(e.target.value)} />
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">All Alerts</h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
          {alerts?.map(a => (
            <div key={a._id} className={`flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors ${a.isActive ? "" : "opacity-50"}`}>
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${a.severity === "breaking" ? "bg-red-500 animate-pulse" : a.severity === "urgent" ? "bg-yellow-500" : "bg-blue-500"}`} />
                <div><p className="text-sm text-[#f0ece4] font-medium">{a.headline}</p>{a.message && <p className="text-[10px] text-[#888]">{a.message}</p>}</div>
              </div>
              <div className="flex items-center gap-2">
                <button className={btnOutline} onClick={() => toggle({ id: a._id })}>{a.isActive ? "Deactivate" : "Activate"}</button>
                <button onClick={() => del({ id: a._id })} className="text-[#888] hover:text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
          )) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No alerts.</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   8. FAN Q&A (Admin View)
   ═══════════════════════════════════════════════════════════ */
export function FanQAAdminTab() {
  const items = useQuery(api.features2.listFanQA);
  const answer = useMutation(api.features2.answerQuestion);
  const approve = useMutation(api.features2.approveQuestion);
  const toggleFeat = useMutation(api.features2.toggleQAFeatured);
  const del = useMutation(api.features2.deleteFanQA);
  const [answerText, setAnswerText] = useState<Record<string, string>>({});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-4">
        <div className={`${card} p-5`}><p className="text-[10px] text-[#888] tracking-widest uppercase mb-1">Total Questions</p><p className="font-display text-2xl text-[#D4A843]">{items?.length ?? 0}</p></div>
        <div className={`${card} p-5`}><p className="text-[10px] text-[#888] tracking-widest uppercase mb-1">Answered</p><p className="font-display text-2xl text-green-400">{items?.filter(i => i.answer).length ?? 0}</p></div>
        <div className={`${card} p-5`}><p className="text-[10px] text-[#888] tracking-widest uppercase mb-1">Pending</p><p className="font-display text-2xl text-yellow-400">{items?.filter(i => !i.answer).length ?? 0}</p></div>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Fan Questions</h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-[500px] overflow-y-auto">
          {items?.map(q => (
            <div key={q._id} className="px-6 py-4 hover:bg-[#1a1a1a]/50 transition-colors">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2"><span className="text-sm text-[#f0ece4] font-medium">{q.fanName}</span>
                  {q.isFeatured && <span className={badge("bg-[#D4A843]/20 text-[#D4A843]")}>Featured</span>}
                  {!q.isApproved && <span className={badge("bg-yellow-500/20 text-yellow-400")}>Pending</span>}
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toggleFeat({ id: q._id })} className={q.isFeatured ? "text-[#D4A843]" : "text-[#888] hover:text-[#D4A843]"}><Star className="size-3.5" /></button>
                  {!q.isApproved && <button className={btnOutline} onClick={() => approve({ id: q._id })}>Approve</button>}
                  <button onClick={() => del({ id: q._id })} className="text-[#888] hover:text-red-400"><Trash2 className="size-3.5" /></button>
                </div>
              </div>
              <p className="text-sm text-[#ccc] mb-2">❓ {q.question}</p>
              {q.answer ? (
                <div className="bg-[#D4A843]/5 border-l-2 border-[#D4A843] pl-3 py-2"><p className="text-xs text-[#D4A843]">💬 {q.answer}</p></div>
              ) : (
                <div className="flex gap-2 mt-2">
                  <input className={`${input} flex-1`} placeholder="Type your answer..." value={answerText[q._id] || ""} onChange={e => setAnswerText(p => ({...p, [q._id]: e.target.value}))} />
                  <button className={btn} onClick={async () => { const a = answerText[q._id]; if (!a) return; await answer({ id: q._id, answer: a }); setAnswerText(p => { const n = {...p}; delete n[q._id]; return n; }); }}>Answer</button>
                </div>
              )}
            </div>
          )) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No questions yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   9. EXCLUSIVE CONTENT (Admin)
   ═══════════════════════════════════════════════════════════ */
export function ExclusiveContentTab() {
  const items = useQuery(api.features2.listExclusiveContent);
  const add = useMutation(api.features2.addExclusiveContent);
  const publish = useMutation(api.features2.publishExclusive);
  const del = useMutation(api.features2.deleteExclusive);
  const [title, setTitle] = useState(""); const [ctype, setCtype] = useState("video"); const [access, setAccess] = useState("subscriber"); const [ytId, setYtId] = useState("");

  return (
    <div className="space-y-6">
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Shield className="size-5 text-[#D4A843]" /> Add Exclusive Content</h3>
        <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-3">
          <input className={input} placeholder="Title" value={title} onChange={e => setTitle(e.target.value)} />
          <select className={input} value={ctype} onChange={e => setCtype(e.target.value)}>
            {["video","audio","article","download","early-access"].map(t => <option key={t} value={t}>{t.split("-").map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(" ")}</option>)}
          </select>
          <select className={input} value={access} onChange={e => setAccess(e.target.value)}>
            <option value="subscriber">Subscribers</option><option value="member">Members</option><option value="donor">Donors</option><option value="merch-buyer">Merch Buyers</option>
          </select>
          <input className={input} placeholder="YouTube ID (optional)" value={ytId} onChange={e => setYtId(e.target.value)} />
          <button className={btn} onClick={async () => { if (!title) return; await add({ title, contentType: ctype, accessLevel: access, youtubeId: ytId || undefined }); setTitle(""); setYtId(""); }}>Add</button>
        </div>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Exclusive Library <span className="text-[#888] text-sm">({items?.length ?? 0})</span></h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
          {items?.map(i => (
            <div key={i._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div><div className="flex items-center gap-2"><p className="text-sm text-[#f0ece4] font-medium">{i.title}</p>
                <span className={badge("bg-purple-500/20 text-purple-400")}>{i.accessLevel}</span>
                <span className={badge(i.isPublished ? "bg-green-500/20 text-green-400" : "bg-gray-500/20 text-gray-400")}>{i.isPublished ? "Live" : "Draft"}</span>
              </div><p className="text-[10px] text-[#888]">{i.contentType}</p></div>
              <div className="flex items-center gap-2">
                {!i.isPublished && <button className={btnOutline} onClick={() => publish({ id: i._id })}>Publish</button>}
                <button onClick={() => del({ id: i._id })} className="text-[#888] hover:text-red-400"><Trash2 className="size-4" /></button>
              </div>
            </div>
          )) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No exclusive content yet.</div>}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════
   10. LEADERBOARD (Admin View)
   ═══════════════════════════════════════════════════════════ */
export function LeaderboardAdminTab() {
  const board = useQuery(api.features2.getLeaderboard);
  const addPoints = useMutation(api.features2.addOrUpdateFanPoints);
  const [name, setName] = useState(""); const [pts, setPts] = useState("");

  const levelColors: Record<string, string> = { legend: "text-[#D4A843]", vip: "text-purple-400", regular: "text-blue-400", rookie: "text-[#888]" };
  const medals = ["🥇", "🥈", "🥉"];

  return (
    <div className="space-y-6">
      <div className={`${card} p-6`}>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4 flex items-center gap-2"><Award className="size-5 text-[#D4A843]" /> Add Points</h3>
        <div className="grid sm:grid-cols-3 gap-3">
          <input className={input} placeholder="Fan Name" value={name} onChange={e => setName(e.target.value)} />
          <input className={input} type="number" placeholder="Points" value={pts} onChange={e => setPts(e.target.value)} />
          <button className={btn} onClick={async () => { if (!name || !pts) return; await addPoints({ fanName: name, points: parseInt(pts), reason: "manual" }); setName(""); setPts(""); }}>Add Points</button>
        </div>
      </div>
      <div className={`${card} overflow-hidden`}>
        <div className="px-6 py-4 border-b border-[#D4A843]/10"><h3 className="font-display text-lg text-[#f0ece4] tracking-wider">🏆 Fan Leaderboard</h3></div>
        <div className="divide-y divide-[#D4A843]/5 max-h-96 overflow-y-auto">
          {board?.map((f, idx) => (
            <div key={f._id} className="flex items-center justify-between px-6 py-3 hover:bg-[#1a1a1a] transition-colors">
              <div className="flex items-center gap-4">
                <span className="text-lg w-8 text-center">{idx < 3 ? medals[idx] : <span className="text-[#555] text-sm">#{idx + 1}</span>}</span>
                <div><p className={`text-sm font-medium ${levelColors[f.level || "rookie"]}`}>{f.fanName}</p><p className="text-[10px] text-[#888] uppercase tracking-wider">{f.level || "Rookie"}</p></div>
              </div>
              <span className="font-display text-lg text-[#D4A843]">{f.points.toLocaleString()} pts</span>
            </div>
          )) ?? <div className="px-6 py-8 text-center text-[#888] text-sm">No fans on the leaderboard yet.</div>}
        </div>
      </div>
    </div>
  );
}
