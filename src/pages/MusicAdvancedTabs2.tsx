import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

/* ═══════════════════════════════════════════════════════════
   Shared UI primitives (same style as MusicAdvancedTabs.tsx)
   ═══════════════════════════════════════════════════════════ */
const SectionHeader = ({ title, count, onAdd, addLabel }: { title: string; count?: number; onAdd?: () => void; addLabel?: string }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <h2 className="text-2xl font-bold text-white tracking-tight">{title}</h2>
      {count !== undefined && <span className="bg-purple-500/20 text-purple-300 text-xs font-bold px-2.5 py-1 rounded-full">{count}</span>}
    </div>
    {onAdd && <button onClick={onAdd} className="bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-all">{addLabel ?? "+ Add"}</button>}
  </div>
);

const StatusBadge = ({ status, map }: { status: string; map?: Record<string, string> }) => {
  const colors: Record<string, string> = { green: "bg-emerald-500/20 text-emerald-300", yellow: "bg-amber-500/20 text-amber-300", red: "bg-red-500/20 text-red-300", blue: "bg-blue-500/20 text-blue-300", purple: "bg-purple-500/20 text-purple-300", gray: "bg-zinc-500/20 text-zinc-400", orange: "bg-orange-500/20 text-orange-300", cyan: "bg-cyan-500/20 text-cyan-300" };
  const color = map?.[status] ?? "gray";
  return <span className={`text-xs font-bold px-2.5 py-1 rounded-full uppercase tracking-wide ${colors[color] ?? colors.gray}`}>{status.replace(/-/g, " ")}</span>;
};

const EmptyState = ({ icon, title, sub }: { icon: string; title: string; sub: string }) => (
  <div className="text-center py-16"><div className="text-5xl mb-4">{icon}</div><h3 className="text-lg font-semibold text-zinc-300">{title}</h3><p className="text-sm text-zinc-500 mt-1">{sub}</p></div>
);

const CardGrid = ({ children }: { children: React.ReactNode }) => <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">{children}</div>;

const MetricCard = ({ label, value, sub }: { label: string; value: string | number; sub?: string }) => (
  <div className="bg-zinc-800/50 border border-zinc-700/50 rounded-xl p-4">
    <p className="text-xs text-zinc-500 uppercase tracking-wide font-semibold">{label}</p>
    <p className="text-2xl font-bold text-white mt-1">{String(value)}</p>
    {sub && <p className="text-xs text-zinc-400 mt-1">{sub}</p>}
  </div>
);

const InfoRow = ({ label, value }: { label: string; value?: string | number | null }) => value ? (
  <div className="flex justify-between py-1.5 border-b border-zinc-800/50"><span className="text-xs text-zinc-500 font-semibold uppercase tracking-wide">{label}</span><span className="text-sm text-zinc-200 text-right max-w-[60%]">{String(value)}</span></div>
) : null;

/* ═══════════════════════════════════════════════
   1. Feature Verse Manager
   ═══════════════════════════════════════════════ */
export function FeatureVerseTab() {
  const items = useQuery(api.musicAdvanced2.listFeatureVerses) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { requested: "blue", accepted: "green", recording: "yellow", delivered: "purple", declined: "red" };
  const sent = items.filter(i => i.direction === "sent");
  const received = items.filter(i => i.direction === "received");
  const totalFees = items.filter(i => i.fee).reduce((s, i) => s + (i.fee ?? 0), 0);
  return (
    <div>
      <SectionHeader title="Feature Verse Manager" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Features" value={items.length} />
        <MetricCard label="Sent" value={sent.length} />
        <MetricCard label="Received" value={received.length} />
        <MetricCard label="Total Fees" value={`$${totalFees.toLocaleString()}`} />
      </div>
      {items.length === 0 ? <EmptyState icon="🤝" title="No Feature Verses" sub="Track feature requests sent and received" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-3">
              <div><h3 className="text-white font-bold text-sm">{i.trackTitle}</h3><p className="text-zinc-400 text-xs mt-1">{i.artist} × {i.featureArtist}</p></div>
              <StatusBadge status={i.status} map={statusMap} />
            </div>
            <div className="flex gap-2 mb-2">
              <span className={`text-xs px-2 py-0.5 rounded-full ${i.direction === "sent" ? "bg-blue-500/20 text-blue-300" : "bg-green-500/20 text-green-300"}`}>{i.direction}</span>
              {i.fee && <span className="text-xs text-zinc-400">${i.fee.toLocaleString()}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="Deadline" value={i.deadline} />
                <InfoRow label="Contact" value={i.contactEmail} />
                <InfoRow label="Notes" value={i.notes} />
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   2. Vocal Session Tracker
   ═══════════════════════════════════════════════ */
export function VocalSessionTab() {
  const items = useQuery(api.musicAdvanced2.listVocalSessions) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { scheduled: "blue", "in-progress": "yellow", completed: "green", comped: "purple" };
  return (
    <div>
      <SectionHeader title="Vocal Session Tracker" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Sessions" value={items.length} />
        <MetricCard label="Completed" value={items.filter(i => i.status === "completed" || i.status === "comped").length} />
        <MetricCard label="Avg Takes" value={items.filter(i => i.takesRecorded).length ? Math.round(items.filter(i => i.takesRecorded).reduce((s, i) => s + (i.takesRecorded ?? 0), 0) / items.filter(i => i.takesRecorded).length) : "—"} />
        <MetricCard label="Avg Rating" value={items.filter(i => i.rating).length ? (items.filter(i => i.rating).reduce((s, i) => s + (i.rating ?? 0), 0) / items.filter(i => i.rating).length).toFixed(1) + "/5" : "—"} />
      </div>
      {items.length === 0 ? <EmptyState icon="🎙️" title="No Vocal Sessions" sub="Log recording sessions and track your takes" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.trackTitle}</h3><p className="text-zinc-400 text-xs">{i.artist} • {i.sessionDate}</p></div>
              <StatusBadge status={i.status} map={statusMap} />
            </div>
            <div className="flex gap-3 text-xs text-zinc-400">
              {i.takesRecorded && <span>{i.takesRecorded} takes</span>}
              {i.rating && <span>{"⭐".repeat(i.rating)}</span>}
              {i.micUsed && <span>🎤 {i.micUsed}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="Engineer" value={i.engineer} />
                <InfoRow label="Studio" value={i.studio} />
                <InfoRow label="Best Take" value={i.bestTake} />
                <InfoRow label="Mic" value={i.micUsed} />
                <InfoRow label="Preamp" value={i.preamp} />
                <InfoRow label="Compressor" value={i.compressor} />
                {i.vocalChain && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Vocal Chain</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded">{i.vocalChain}</p></div>}
                <InfoRow label="Notes" value={i.notes} />
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   3. Setlist Builder
   ═══════════════════════════════════════════════ */
export function SetlistBuilderTab() {
  const items = useQuery(api.musicAdvanced2.listSetlists) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { draft: "yellow", rehearsed: "blue", performed: "green" };
  return (
    <div>
      <SectionHeader title="Setlist Builder" count={items.length} />
      {items.length === 0 ? <EmptyState icon="📋" title="No Setlists" sub="Create setlists for live shows and rehearsals" /> : (
        <CardGrid>{items.map(i => {
          let songs: any[] = [];
          try { songs = JSON.parse(i.songs); } catch {}
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="text-white font-bold text-sm">{i.showName}</h3><p className="text-zinc-400 text-xs">{i.artist}{i.venue ? ` • ${i.venue}` : ""}</p></div>
                <StatusBadge status={i.status} map={statusMap} />
              </div>
              <div className="flex gap-3 text-xs text-zinc-400">
                <span>{songs.length} songs</span>
                {i.totalDuration && <span>⏱ {i.totalDuration}</span>}
                {i.isTemplate && <span className="bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">Template</span>}
              </div>
              {expanded === i._id && songs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 font-semibold uppercase mb-2">Track Order</p>
                  {songs.map((s: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 py-1 border-b border-zinc-800/50">
                      <span className="text-xs text-zinc-600 w-5 text-right">{idx + 1}</span>
                      <span className="text-sm text-zinc-200 flex-1">{s.title}</span>
                      {s.bpm && <span className="text-xs text-zinc-500">{s.bpm} BPM</span>}
                      {s.key && <span className="text-xs text-zinc-500">{s.key}</span>}
                      {s.duration && <span className="text-xs text-zinc-500">{s.duration}</span>}
                    </div>
                  ))}
                  {i.notes && <p className="text-xs text-zinc-400 mt-2">{i.notes}</p>}
                </div>
              )}
            </div>
          );
        })}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   4. Tour & Show Manager
   ═══════════════════════════════════════════════ */
export function TourShowTab() {
  const items = useQuery(api.musicAdvanced2.listTourShows) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { confirmed: "green", pending: "yellow", cancelled: "red", completed: "purple" };
  const totalGuarantee = items.filter(i => i.guarantee).reduce((s, i) => s + (i.guarantee ?? 0), 0);
  const totalMerch = items.filter(i => i.merch_revenue).reduce((s, i) => s + (i.merch_revenue ?? 0), 0);
  const totalExpenses = items.filter(i => i.expenses).reduce((s, i) => s + (i.expenses ?? 0), 0);
  return (
    <div>
      <SectionHeader title="Tour & Show Manager" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Shows" value={items.length} />
        <MetricCard label="Guarantee Revenue" value={`$${totalGuarantee.toLocaleString()}`} />
        <MetricCard label="Merch Revenue" value={`$${totalMerch.toLocaleString()}`} />
        <MetricCard label="Total Expenses" value={`$${totalExpenses.toLocaleString()}`} />
      </div>
      {items.length === 0 ? <EmptyState icon="🎪" title="No Shows Booked" sub="Track tour dates, revenue, and logistics" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.showName}</h3><p className="text-zinc-400 text-xs">{i.venue} • {i.city}</p></div>
              <StatusBadge status={i.status} map={statusMap} />
            </div>
            <div className="flex gap-3 text-xs text-zinc-400 mb-1">
              <span>📅 {i.showDate}</span>
              {i.guarantee && <span>💰 ${i.guarantee.toLocaleString()}</span>}
              {i.ticketsSold && i.capacity && <span>🎫 {i.ticketsSold}/{i.capacity}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="Show Time" value={i.showTime} />
                <InfoRow label="Promoter" value={i.promoter} />
                <InfoRow label="Promoter Email" value={i.promoterEmail} />
                <InfoRow label="Guarantee" value={i.guarantee ? `$${i.guarantee.toLocaleString()}` : undefined} />
                <InfoRow label="Merch Revenue" value={i.merch_revenue ? `$${i.merch_revenue.toLocaleString()}` : undefined} />
                <InfoRow label="Expenses" value={i.expenses ? `$${i.expenses.toLocaleString()}` : undefined} />
                <InfoRow label="Settlement" value={i.settlementStatus} />
                {i.riderNotes && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Rider Notes</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded">{i.riderNotes}</p></div>}
                {i.travelNotes && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Travel</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded">{i.travelNotes}</p></div>}
                <InfoRow label="Notes" value={i.notes} />
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   5. Music Rights & Publishing Hub
   ═══════════════════════════════════════════════ */
export function MusicRightsTab() {
  const items = useQuery(api.musicAdvanced2.listMusicRights) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { registered: "green", pending: "yellow", unregistered: "gray", disputed: "red" };
  const typeMap: Record<string, string> = { publishing: "purple", mechanical: "blue", performance: "cyan", copyright: "green", master: "orange" };
  return (
    <div>
      <SectionHeader title="Music Rights & Publishing" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Rights" value={items.length} />
        <MetricCard label="Registered" value={items.filter(i => i.status === "registered").length} />
        <MetricCard label="Pending" value={items.filter(i => i.status === "pending").length} />
        <MetricCard label="Disputed" value={items.filter(i => i.status === "disputed").length} />
      </div>
      {items.length === 0 ? <EmptyState icon="📜" title="No Rights Tracked" sub="Track publishing, copyright, and master registrations" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">{i.artist}</p></div>
              <StatusBadge status={i.status} map={statusMap} />
            </div>
            <div className="flex gap-2">
              <StatusBadge status={i.rightType} map={typeMap} />
              {i.pro && <span className="text-xs bg-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded-full">{i.pro}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="Publisher" value={i.publisherName} />
                <InfoRow label="IPI Number" value={i.ipiNumber} />
                <InfoRow label="Split %" value={i.splitPercent ? `${i.splitPercent}%` : undefined} />
                <InfoRow label="Registration ID" value={i.registrationId} />
                <InfoRow label="Registered" value={i.registrationDate} />
                <InfoRow label="Territory" value={i.territory} />
                <InfoRow label="Notes" value={i.notes} />
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   6. Mood Board / Creative Direction
   ═══════════════════════════════════════════════ */
export function MoodBoardTab() {
  const items = useQuery(api.musicAdvanced2.listMoodBoards) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { brainstorming: "yellow", "in-progress": "blue", approved: "green", archived: "gray" };
  return (
    <div>
      <SectionHeader title="Mood Board / Creative Direction" count={items.length} />
      {items.length === 0 ? <EmptyState icon="🎨" title="No Mood Boards" sub="Create visual direction boards for projects" /> : (
        <CardGrid>{items.map(i => {
          let colors: string[] = [];
          try { colors = JSON.parse(i.colorPalette ?? "[]"); } catch {}
          let refs: string[] = [];
          try { refs = JSON.parse(i.referenceUrls ?? "[]"); } catch {}
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">{i.boardType}{i.project ? ` • ${i.project}` : ""}</p></div>
                <StatusBadge status={i.status} map={statusMap} />
              </div>
              {colors.length > 0 && (
                <div className="flex gap-1 mt-2">{colors.map((c, idx) => (
                  <div key={idx} className="w-6 h-6 rounded-full border border-zinc-700" style={{ backgroundColor: c }} title={c} />
                ))}</div>
              )}
              {i.description && <p className="text-xs text-zinc-400 mt-2 line-clamp-2">{i.description}</p>}
              {expanded === i._id && (
                <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                  <InfoRow label="Fonts" value={i.fonts} />
                  <InfoRow label="Tags" value={i.tags} />
                  {i.referenceNotes && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Reference Notes</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded whitespace-pre-wrap">{i.referenceNotes}</p></div>}
                  {refs.length > 0 && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">References</p>{refs.map((u, idx) => <a key={idx} href={u} target="_blank" className="block text-xs text-purple-400 hover:underline truncate">{u}</a>)}</div>}
                </div>
              )}
            </div>
          );
        })}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   7. Vocal Health & Wellness
   ═══════════════════════════════════════════════ */
export function VocalHealthTab() {
  const items = useQuery(api.musicAdvanced2.listVocalHealth) ?? [];
  const conditionMap: Record<string, string> = { excellent: "green", good: "blue", strained: "yellow", fatigued: "orange", "rest-needed": "red" };
  return (
    <div>
      <SectionHeader title="Vocal Health & Wellness" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Entries" value={items.length} />
        <MetricCard label="Rest Days" value={items.filter(i => i.entryType === "rest-day").length} />
        <MetricCard label="Sessions Logged" value={items.filter(i => i.entryType === "session").length} />
        <MetricCard label="Warm-Ups Done" value={items.filter(i => i.warmUpDone).length} />
      </div>
      {items.length === 0 ? <EmptyState icon="🫁" title="No Entries" sub="Track vocal health, rest days, and warm-up routines" /> : (
        <div className="space-y-3">{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-4 hover:border-purple-500/40 transition-all">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{i.entryType === "rest-day" ? "😴" : i.entryType === "warm-up" ? "🎵" : i.entryType === "session" ? "🎤" : "📝"}</span>
                <div>
                  <h3 className="text-white font-bold text-sm">{i.artist} — {i.entryType.replace(/-/g, " ")}</h3>
                  <p className="text-zinc-400 text-xs">{i.date}{i.sessionDuration ? ` • ${i.sessionDuration} min` : ""}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {i.vocalCondition && <StatusBadge status={i.vocalCondition} map={conditionMap} />}
                {i.hydrationLevel && <span className={`text-xs px-2 py-0.5 rounded-full ${i.hydrationLevel === "good" ? "bg-blue-500/20 text-blue-300" : i.hydrationLevel === "moderate" ? "bg-yellow-500/20 text-yellow-300" : "bg-red-500/20 text-red-300"}`}>💧 {i.hydrationLevel}</span>}
                {i.warmUpDone && <span className="text-xs bg-green-500/20 text-green-300 px-2 py-0.5 rounded-full">✓ warm-up</span>}
              </div>
            </div>
            {(i.warmUpRoutine || i.notes) && <div className="mt-2 ml-11 text-xs text-zinc-400">{i.warmUpRoutine && <p>Routine: {i.warmUpRoutine}</p>}{i.notes && <p>{i.notes}</p>}</div>}
          </div>
        ))}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   8. Sound Kit / Sample Pack Builder
   ═══════════════════════════════════════════════ */
export function SoundKitTab() {
  const items = useQuery(api.musicAdvanced2.listSoundKits) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { draft: "yellow", published: "green", archived: "gray" };
  const totalRevenue = items.reduce((s, i) => s + (i.revenue ?? 0), 0);
  const totalDownloads = items.reduce((s, i) => s + (i.downloads ?? 0), 0);
  return (
    <div>
      <SectionHeader title="Sound Kit / Sample Pack Builder" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Kits" value={items.length} />
        <MetricCard label="Published" value={items.filter(i => i.status === "published").length} />
        <MetricCard label="Total Downloads" value={totalDownloads.toLocaleString()} />
        <MetricCard label="Revenue" value={`$${totalRevenue.toLocaleString()}`} />
      </div>
      {items.length === 0 ? <EmptyState icon="🥁" title="No Sound Kits" sub="Build and sell drum kits, loop packs, and sample packs" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">{i.producer} • {i.kitType.replace(/-/g, " ")}</p></div>
              <StatusBadge status={i.status} map={statusMap} />
            </div>
            <div className="flex gap-3 text-xs text-zinc-400">
              {i.soundCount && <span>{i.soundCount} sounds</span>}
              {i.price && <span>${i.price}</span>}
              {i.downloads && <span>📥 {i.downloads}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="Genre" value={i.genre} />
                <InfoRow label="Revenue" value={i.revenue ? `$${i.revenue.toLocaleString()}` : undefined} />
                <InfoRow label="Tags" value={i.tags} />
                {i.description && <p className="text-xs text-zinc-400 mt-2">{i.description}</p>}
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   9. Beat Lease Manager
   ═══════════════════════════════════════════════ */
export function BeatLeaseTab() {
  const items = useQuery(api.musicAdvanced2.listBeatLeases) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { available: "green", sold: "purple", negotiating: "yellow", expired: "red" };
  const typeColors: Record<string, string> = { mp3: "gray", wav: "blue", trackout: "cyan", unlimited: "purple", exclusive: "orange" };
  const totalRevenue = items.filter(i => i.status === "sold").reduce((s, i) => s + i.price, 0);
  return (
    <div>
      <SectionHeader title="Beat Lease Manager" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Leases" value={items.length} />
        <MetricCard label="Sold" value={items.filter(i => i.status === "sold").length} />
        <MetricCard label="Available" value={items.filter(i => i.status === "available").length} />
        <MetricCard label="Revenue" value={`$${totalRevenue.toLocaleString()}`} />
      </div>
      {items.length === 0 ? <EmptyState icon="🎹" title="No Beat Leases" sub="Manage beat leases, pricing tiers, and contracts" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.beatTitle}</h3><p className="text-zinc-400 text-xs">{i.producer}</p></div>
              <StatusBadge status={i.status} map={statusMap} />
            </div>
            <div className="flex gap-2 items-center">
              <StatusBadge status={i.leaseType} map={typeColors} />
              <span className="text-sm font-bold text-white">${i.price}</span>
              {i.buyer && <span className="text-xs text-zinc-400">→ {i.buyer}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="Buyer Email" value={i.buyerEmail} />
                <InfoRow label="License Period" value={i.licensePeriod} />
                <InfoRow label="Stream Limit" value={i.streamLimit?.toLocaleString()} />
                <InfoRow label="Purchase Date" value={i.purchaseDate} />
                <InfoRow label="Notes" value={i.notes} />
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   10. Plugin & Gear Inventory
   ═══════════════════════════════════════════════ */
export function GearInventoryTab() {
  const items = useQuery(api.musicAdvanced2.listGearInventory) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const conditionMap: Record<string, string> = { new: "green", excellent: "blue", good: "cyan", fair: "yellow", "needs-repair": "red" };
  const categories = ["all", ...Array.from(new Set(items.map(i => i.category)))];
  const filtered = filter === "all" ? items : items.filter(i => i.category === filter);
  const totalValue = items.reduce((s, i) => s + (i.purchasePrice ?? 0), 0);
  return (
    <div>
      <SectionHeader title="Plugin & Gear Inventory" count={items.length} />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <MetricCard label="Total Items" value={items.length} />
        <MetricCard label="Total Value" value={`$${totalValue.toLocaleString()}`} />
        <MetricCard label="Needs Repair" value={items.filter(i => i.condition === "needs-repair").length} />
      </div>
      <div className="flex gap-2 mb-4 flex-wrap">{categories.map(c => (
        <button key={c} onClick={() => setFilter(c)} className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-all ${filter === c ? "bg-purple-600 text-white" : "bg-zinc-800 text-zinc-400 hover:bg-zinc-700"}`}>{c.replace(/-/g, " ")}</button>
      ))}</div>
      {filtered.length === 0 ? <EmptyState icon="🎛️" title="No Gear" sub="Catalog your plugins, DAWs, and hardware" /> : (
        <CardGrid>{filtered.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.name}</h3><p className="text-zinc-400 text-xs">{i.manufacturer ?? i.category}</p></div>
              {i.condition && <StatusBadge status={i.condition} map={conditionMap} />}
            </div>
            <span className="text-xs bg-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded-full">{i.category}</span>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="Serial #" value={i.serialNumber} />
                <InfoRow label="License Key" value={i.licenseKey} />
                <InfoRow label="Purchase Date" value={i.purchaseDate} />
                <InfoRow label="Purchase Price" value={i.purchasePrice ? `$${i.purchasePrice.toLocaleString()}` : undefined} />
                <InfoRow label="Warranty Expires" value={i.warrantyExpiry} />
                <InfoRow label="Location" value={i.location} />
                <InfoRow label="Notes" value={i.notes} />
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   11. Production Templates Library
   ═══════════════════════════════════════════════ */
export function ProductionTemplateTab() {
  const items = useQuery(api.musicAdvanced2.listProductionTemplates) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const typeMap: Record<string, string> = { session: "blue", "mixing-chain": "purple", routing: "cyan", mastering: "orange", "vocal-chain": "green" };
  return (
    <div>
      <SectionHeader title="Production Templates" count={items.length} />
      {items.length === 0 ? <EmptyState icon="📐" title="No Templates" sub="Save DAW session templates, mixing chains, and routing presets" /> : (
        <CardGrid>{items.map(i => {
          let plugins: string[] = [];
          try { plugins = JSON.parse(i.plugins ?? "[]"); } catch {}
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">{i.producer} • {i.daw}</p></div>
                <StatusBadge status={i.templateType} map={typeMap} />
              </div>
              <div className="flex gap-2 text-xs text-zinc-400">
                {i.genre && <span>{i.genre}</span>}
                {i.trackCount && <span>{i.trackCount} tracks</span>}
                {i.isShared && <span className="bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">Shared</span>}
              </div>
              {expanded === i._id && (
                <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                  <InfoRow label="BPM Range" value={i.bpmRange} />
                  <InfoRow label="Tags" value={i.tags} />
                  {i.description && <p className="text-xs text-zinc-400 mt-2">{i.description}</p>}
                  {plugins.length > 0 && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Plugins</p><div className="flex gap-1 flex-wrap">{plugins.map((p, idx) => <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">{p}</span>)}</div></div>}
                </div>
              )}
            </div>
          );
        })}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   12. Sound Design Lab
   ═══════════════════════════════════════════════ */
export function SoundDesignTab() {
  const items = useQuery(api.musicAdvanced2.listSoundDesigns) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const catMap: Record<string, string> = { bass: "purple", lead: "blue", pad: "cyan", fx: "orange", drum: "red", "vocal-fx": "green", texture: "yellow" };
  return (
    <div>
      <SectionHeader title="Sound Design Lab" count={items.length} />
      {items.length === 0 ? <EmptyState icon="🔊" title="No Sound Designs" sub="Document synth patches, processing chains, and layering techniques" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.isFavorite ? "⭐ " : ""}{i.title}</h3><p className="text-zinc-400 text-xs">{i.producer}</p></div>
              <StatusBadge status={i.category} map={catMap} />
            </div>
            <div className="flex gap-2 text-xs text-zinc-400">
              {i.synth && <span>🎛️ {i.synth}</span>}
              {i.genre && <span>{i.genre}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                {i.processingChain && <div><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Processing Chain</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded whitespace-pre-wrap">{i.processingChain}</p></div>}
                {i.layering && <div><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Layering</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded whitespace-pre-wrap">{i.layering}</p></div>}
                {i.description && <p className="text-xs text-zinc-400">{i.description}</p>}
                <InfoRow label="Tags" value={i.tags} />
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   13. Producer Analytics Dashboard
   ═══════════════════════════════════════════════ */
export function ProducerAnalyticsTab() {
  const items = useQuery(api.musicAdvanced2.listProducerAnalytics) ?? [];
  return (
    <div>
      <SectionHeader title="Producer Analytics" count={items.length} />
      {items.length === 0 ? <EmptyState icon="📊" title="No Analytics" sub="Track beat sales, revenue, and performance metrics" /> : (
        <div className="space-y-6">{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-6">
            <div className="flex items-center justify-between mb-4">
              <div><h3 className="text-white font-bold text-lg">{i.producer}</h3><p className="text-zinc-400 text-sm">{i.period}</p></div>
              {i.conversionRate && <div className="text-right"><p className="text-xs text-zinc-500">Conversion Rate</p><p className="text-xl font-bold text-purple-400">{i.conversionRate}%</p></div>}
            </div>
            <div className="grid gap-4 md:grid-cols-5">
              <MetricCard label="Total Beats" value={i.totalBeats ?? 0} />
              <MetricCard label="Beats Sold" value={i.beatsSold ?? 0} />
              <MetricCard label="Total Revenue" value={`$${(i.totalRevenue ?? 0).toLocaleString()}`} />
              <MetricCard label="Lease Revenue" value={`$${(i.leaseRevenue ?? 0).toLocaleString()}`} />
              <MetricCard label="Exclusive Revenue" value={`$${(i.exclusiveRevenue ?? 0).toLocaleString()}`} />
            </div>
            <div className="flex gap-3 mt-4 text-xs text-zinc-400">
              {i.topGenre && <span>🎵 Top: {i.topGenre}</span>}
              {i.topBeat && <span>🏆 Best: {i.topBeat}</span>}
              {i.avgBeatPrice && <span>💰 Avg: ${i.avgBeatPrice}</span>}
            </div>
          </div>
        ))}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   14. Feedback & Review Hub
   ═══════════════════════════════════════════════ */
export function FeedbackReviewTab() {
  const items = useQuery(api.musicAdvanced2.listFeedbackReviews) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { "awaiting-review": "yellow", "in-review": "blue", "changes-requested": "orange", approved: "green" };
  const priorityMap: Record<string, string> = { low: "gray", medium: "yellow", high: "orange", urgent: "red" };
  return (
    <div>
      <SectionHeader title="Feedback & Review Hub" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Reviews" value={items.length} />
        <MetricCard label="Awaiting" value={items.filter(i => i.status === "awaiting-review").length} />
        <MetricCard label="In Review" value={items.filter(i => i.status === "in-review").length} />
        <MetricCard label="Approved" value={items.filter(i => i.status === "approved").length} />
      </div>
      {items.length === 0 ? <EmptyState icon="💬" title="No Reviews" sub="Share WIPs for feedback with timestamped comments" /> : (
        <CardGrid>{items.map(i => {
          let comments: any[] = [];
          try { comments = JSON.parse(i.comments ?? "[]"); } catch {}
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="text-white font-bold text-sm">{i.trackTitle}</h3><p className="text-zinc-400 text-xs">{i.artist ?? i.project} • by {i.submittedBy}</p></div>
                <StatusBadge status={i.status} map={statusMap} />
              </div>
              <div className="flex gap-2">
                <span className="text-xs bg-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded-full">{i.feedbackType.replace(/-/g, " ")}</span>
                {i.priority && <StatusBadge status={i.priority} map={priorityMap} />}
                {comments.length > 0 && <span className="text-xs text-zinc-400">💬 {comments.length}</span>}
              </div>
              {expanded === i._id && comments.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 font-semibold uppercase mb-2">Comments</p>
                  {comments.map((c: any, idx: number) => (
                    <div key={idx} className="mb-2 bg-zinc-800/60 p-2 rounded">
                      <div className="flex justify-between"><span className="text-xs font-semibold text-purple-300">{c.author}</span>{c.timestamp && <span className="text-xs text-zinc-500">⏱ {c.timestamp}</span>}</div>
                      <p className="text-xs text-zinc-300 mt-1">{c.text}</p>
                    </div>
                  ))}
                  <InfoRow label="Due Date" value={i.dueDate} />
                </div>
              )}
            </div>
          );
        })}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   15. Contract & Deal Memo Generator
   ═══════════════════════════════════════════════ */
export function ContractMemoTab() {
  const items = useQuery(api.musicAdvanced2.listContractMemos) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { draft: "yellow", sent: "blue", signed: "green", expired: "red", terminated: "gray" };
  const typeMap: Record<string, string> = { "beat-lease": "purple", feature: "blue", "split-sheet": "cyan", sync: "orange", management: "green", distribution: "yellow", custom: "gray" };
  return (
    <div>
      <SectionHeader title="Contract & Deal Memos" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Contracts" value={items.length} />
        <MetricCard label="Signed" value={items.filter(i => i.status === "signed").length} />
        <MetricCard label="Pending" value={items.filter(i => i.status === "draft" || i.status === "sent").length} />
        <MetricCard label="Total Value" value={`$${items.reduce((s, i) => s + (i.fee ?? 0), 0).toLocaleString()}`} />
      </div>
      {items.length === 0 ? <EmptyState icon="📄" title="No Contracts" sub="Generate contracts for beats, features, splits, and sync deals" /> : (
        <CardGrid>{items.map(i => {
          let parties: string[] = [];
          try { parties = JSON.parse(i.parties); } catch { parties = [i.parties]; }
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">{parties.join(" • ")}</p></div>
                <StatusBadge status={i.status} map={statusMap} />
              </div>
              <div className="flex gap-2 items-center">
                <StatusBadge status={i.contractType} map={typeMap} />
                {i.fee && <span className="text-sm font-bold text-white">${i.fee.toLocaleString()}</span>}
                {i.signedByAll && <span className="text-xs bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded">✓ All signed</span>}
              </div>
              {expanded === i._id && (
                <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                  <InfoRow label="Start Date" value={i.startDate} />
                  <InfoRow label="End Date" value={i.endDate} />
                  {i.terms && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Terms</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded whitespace-pre-wrap">{i.terms}</p></div>}
                  <InfoRow label="Notes" value={i.notes} />
                </div>
              )}
            </div>
          );
        })}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   16. Reference Track Library
   ═══════════════════════════════════════════════ */
export function ReferenceTrackTab() {
  const items = useQuery(api.musicAdvanced2.listReferenceTracks) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const aspectMap: Record<string, string> = { mix: "blue", "vocal-tone": "green", drums: "red", arrangement: "purple", energy: "orange", overall: "cyan" };
  return (
    <div>
      <SectionHeader title="Reference Track Library" count={items.length} />
      {items.length === 0 ? <EmptyState icon="🎧" title="No Reference Tracks" sub="Organize tracks to reference for mix, tone, and arrangement" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">by {i.originalArtist}</p></div>
              <StatusBadge status={i.referenceAspect} map={aspectMap} />
            </div>
            <div className="flex gap-3 text-xs text-zinc-400">
              {i.forProject && <span>📁 {i.forProject}</span>}
              {i.bpm && <span>{i.bpm} BPM</span>}
              {i.key && <span>🎵 {i.key}</span>}
              {i.genre && <span>{i.genre}</span>}
            </div>
            {expanded === i._id && (
              <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                <InfoRow label="For Artist" value={i.forArtist} />
                {i.notes && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Notes</p><p className="text-xs text-zinc-300 bg-zinc-800/80 p-2 rounded whitespace-pre-wrap">{i.notes}</p></div>}
                {i.spotifyUrl && <a href={i.spotifyUrl} target="_blank" className="text-xs text-green-400 hover:underline block mt-2">🎵 Open on Spotify</a>}
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   17. Chord Progression & Scale Finder
   ═══════════════════════════════════════════════ */
export function ChordProgressionTab() {
  const items = useQuery(api.musicAdvanced2.listChordProgressions) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div>
      <SectionHeader title="Chord Progressions & Scales" count={items.length} />
      {items.length === 0 ? <EmptyState icon="🎼" title="No Progressions" sub="Save chord progressions, scales, and music theory references" /> : (
        <CardGrid>{items.map(i => (
          <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
            <div className="flex items-start justify-between mb-2">
              <div><h3 className="text-white font-bold text-sm">{i.isFavorite ? "⭐ " : ""}{i.title}</h3><p className="text-zinc-400 text-xs">{i.key} {i.scale}</p></div>
              {i.mood && <span className="text-xs bg-purple-500/20 text-purple-300 px-2 py-0.5 rounded-full">{i.mood}</span>}
            </div>
            <p className="text-lg font-mono text-cyan-300 mt-2">{i.chords}</p>
            <div className="flex gap-3 text-xs text-zinc-400 mt-2">
              {i.genre && <span>{i.genre}</span>}
              {i.bpm && <span>{i.bpm} BPM</span>}
              {i.usedIn && <span>Used in: {i.usedIn}</span>}
            </div>
            {expanded === i._id && i.notes && (
              <div className="mt-3 pt-3 border-t border-zinc-800">
                <p className="text-xs text-zinc-400">{i.notes}</p>
              </div>
            )}
          </div>
        ))}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   18. DAW Project Archive
   ═══════════════════════════════════════════════ */
export function DawProjectTab() {
  const items = useQuery(api.musicAdvanced2.listDawProjects) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const backupMap: Record<string, string> = { "backed-up": "green", "local-only": "yellow", "needs-backup": "red" };
  return (
    <div>
      <SectionHeader title="DAW Project Archive" count={items.length} />
      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <MetricCard label="Total Projects" value={items.length} />
        <MetricCard label="Backed Up" value={items.filter(i => i.backupStatus === "backed-up").length} />
        <MetricCard label="Needs Backup" value={items.filter(i => i.backupStatus === "needs-backup").length} />
      </div>
      {items.length === 0 ? <EmptyState icon="💾" title="No DAW Projects" sub="Archive and organize DAW project files" /> : (
        <CardGrid>{items.map(i => {
          let plugins: string[] = [];
          try { plugins = JSON.parse(i.plugins ?? "[]"); } catch {}
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">{[i.artist, i.producer].filter(Boolean).join(" • ")} • {i.daw}</p></div>
                {i.backupStatus && <StatusBadge status={i.backupStatus} map={backupMap} />}
              </div>
              <div className="flex gap-3 text-xs text-zinc-400">
                {i.bpm && <span>{i.bpm} BPM</span>}
                {i.key && <span>🎵 {i.key}</span>}
                {i.trackCount && <span>{i.trackCount} tracks</span>}
                {i.fileSize && <span>💿 {i.fileSize}</span>}
              </div>
              {expanded === i._id && (
                <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                  <InfoRow label="Version" value={i.version} />
                  <InfoRow label="Last Modified" value={i.lastModified} />
                  <InfoRow label="Collaborators" value={i.collaborators} />
                  {plugins.length > 0 && <div className="mt-2"><p className="text-xs text-zinc-500 font-semibold uppercase mb-1">Plugins</p><div className="flex gap-1 flex-wrap">{plugins.map((p, idx) => <span key={idx} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">{p}</span>)}</div></div>}
                  <InfoRow label="Notes" value={i.notes} />
                </div>
              )}
            </div>
          );
        })}</CardGrid>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   19. Revenue Goal Tracker
   ═══════════════════════════════════════════════ */
export function RevenueGoalTab() {
  const items = useQuery(api.musicAdvanced2.listRevenueGoals) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div>
      <SectionHeader title="Revenue Goal Tracker" count={items.length} />
      {items.length === 0 ? <EmptyState icon="🎯" title="No Goals Set" sub="Set revenue targets and track progress" /> : (
        <div className="space-y-4">{items.map(i => {
          const pct = i.currentAmount ? Math.min(100, Math.round((i.currentAmount / i.targetAmount) * 100)) : 0;
          let milestones: any[] = [];
          try { milestones = JSON.parse(i.milestones ?? "[]"); } catch {}
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-3">
                <div><h3 className="text-white font-bold">{i.name}</h3><p className="text-zinc-400 text-xs">{[i.artist, i.producer].filter(Boolean).join(" • ")} • {i.period} • {i.category}</p></div>
                <div className="text-right"><p className="text-2xl font-bold text-white">{pct}%</p><p className="text-xs text-zinc-500">${(i.currentAmount ?? 0).toLocaleString()} / ${i.targetAmount.toLocaleString()}</p></div>
              </div>
              <div className="w-full bg-zinc-800 rounded-full h-3">
                <div className={`h-3 rounded-full transition-all ${pct >= 100 ? "bg-green-500" : pct >= 60 ? "bg-purple-500" : pct >= 30 ? "bg-amber-500" : "bg-red-500"}`} style={{ width: `${pct}%` }} />
              </div>
              {expanded === i._id && milestones.length > 0 && (
                <div className="mt-3 pt-3 border-t border-zinc-800">
                  <p className="text-xs text-zinc-500 font-semibold uppercase mb-2">Milestones</p>
                  {milestones.map((m: any, idx: number) => (
                    <div key={idx} className="flex items-center gap-2 py-1">
                      <span className={`text-xs ${m.reached ? "text-green-400" : "text-zinc-600"}`}>{m.reached ? "✅" : "⬜"}</span>
                      <span className="text-xs text-zinc-300">{m.label}</span>
                      {m.amount && <span className="text-xs text-zinc-500 ml-auto">${Number(m.amount).toLocaleString()}</span>}
                    </div>
                  ))}
                  {i.notes && <p className="text-xs text-zinc-400 mt-2">{i.notes}</p>}
                </div>
              )}
            </div>
          );
        })}</div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════════
   20. Collab Calendar
   ═══════════════════════════════════════════════ */
export function CollabCalendarTab() {
  const items = useQuery(api.musicAdvanced2.listCollabCalendar) ?? [];
  const [expanded, setExpanded] = useState<string | null>(null);
  const statusMap: Record<string, string> = { scheduled: "blue", confirmed: "green", completed: "purple", cancelled: "red" };
  const typeMap: Record<string, string> = { recording: "purple", mixing: "blue", writing: "cyan", production: "orange", rehearsal: "green" };
  return (
    <div>
      <SectionHeader title="Collab Calendar" count={items.length} />
      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <MetricCard label="Total Sessions" value={items.length} />
        <MetricCard label="Confirmed" value={items.filter(i => i.status === "confirmed").length} />
        <MetricCard label="Completed" value={items.filter(i => i.status === "completed").length} />
        <MetricCard label="Upcoming" value={items.filter(i => i.status === "scheduled" || i.status === "confirmed").length} />
      </div>
      {items.length === 0 ? <EmptyState icon="📅" title="No Sessions Scheduled" sub="Schedule studio time with collaborators" /> : (
        <CardGrid>{items.map(i => {
          let participants: string[] = [];
          try { participants = JSON.parse(i.participants); } catch { participants = [i.participants]; }
          return (
            <div key={i._id} className="bg-zinc-900/80 border border-zinc-800 rounded-xl p-5 hover:border-purple-500/40 transition-all cursor-pointer" onClick={() => setExpanded(expanded === i._id ? null : i._id)}>
              <div className="flex items-start justify-between mb-2">
                <div><h3 className="text-white font-bold text-sm">{i.title}</h3><p className="text-zinc-400 text-xs">{i.sessionDate}{i.startTime ? ` • ${i.startTime}` : ""}{i.endTime ? `–${i.endTime}` : ""}</p></div>
                <StatusBadge status={i.status} map={statusMap} />
              </div>
              <div className="flex gap-2 flex-wrap mb-1">
                <StatusBadge status={i.sessionType} map={typeMap} />
                {participants.map((p, idx) => <span key={idx} className="text-xs bg-zinc-700/50 text-zinc-300 px-2 py-0.5 rounded-full">{p}</span>)}
              </div>
              <div className="flex gap-2 text-xs text-zinc-400">
                {i.studio && <span>🏠 {i.studio}</span>}
                {i.project && <span>📁 {i.project}</span>}
              </div>
              {expanded === i._id && (
                <div className="mt-3 pt-3 border-t border-zinc-800 space-y-1">
                  <InfoRow label="Timezone" value={i.timezone} />
                  <InfoRow label="Reminder Sent" value={i.reminderSent ? "Yes" : "No"} />
                  <InfoRow label="Notes" value={i.notes} />
                </div>
              )}
            </div>
          );
        })}</CardGrid>
      )}
    </div>
  );
}
