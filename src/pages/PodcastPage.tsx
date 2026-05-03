import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Play, Headphones, ExternalLink, ChevronRight, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

const PODCAST_LINKS = {
  youtube: "https://www.youtube.com/@MeadowbrookMontrell",
  spotify: "#",
  apple: "#",
};

export default function PodcastPage() {
  const content = useQuery(api.contentLib.listContent);
  const guests = useQuery(api.admin.listGuests);
  const [selectedEp, setSelectedEp] = useState<string | null>(null);

  // Filter podcast/interview episodes from content
  const episodes = content?.filter(c => c.category === "podcast" || c.category === "interview") ?? [];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#D4A843]/10 to-transparent">
        <div className="max-w-6xl mx-auto px-6 pt-20 pb-16">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4A843] text-sm mb-8 hover:text-[#E8C767] transition-colors"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-red-400 uppercase">Podcast</span>
          </div>
          <h1 className="font-display text-5xl md:text-7xl tracking-wider mb-4">MAKE IT<br /><span className="text-[#D4A843]">MAKE SENSE</span></h1>
          <p className="text-[#888078] max-w-xl text-lg">Real conversations. Real stories. Real Fort Worth. Hosted by Meadowbrook Montrell — The Hood's Paparazzi.</p>
          <div className="flex flex-wrap gap-3 mt-8">
            <a href={PODCAST_LINKS.youtube} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-red-600/20 border border-red-500/30 text-red-400 px-5 py-2.5 rounded hover:bg-red-600/30 transition-all text-sm font-bold tracking-wider">
              <Play className="size-4" /> YouTube
            </a>
            <a href={PODCAST_LINKS.spotify} className="inline-flex items-center gap-2 bg-green-600/20 border border-green-500/30 text-green-400 px-5 py-2.5 rounded hover:bg-green-600/30 transition-all text-sm font-bold tracking-wider">
              <Headphones className="size-4" /> Spotify
            </a>
          </div>
        </div>
      </div>

      {/* Episode Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        <h2 className="font-display text-2xl tracking-wider mb-8 text-[#D4A843]">ALL EPISODES</h2>
        {selectedEp && (
          <div className="mb-8 aspect-video max-w-4xl rounded-lg overflow-hidden border border-[#D4A843]/20">
            <iframe
              src={`https://www.youtube.com/embed/${selectedEp}?autoplay=1`}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              title="Episode Player"
            />
          </div>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {episodes.map(ep => (
            <button
              key={ep._id}
              onClick={() => setSelectedEp(ep.youtubeId || null)}
              className={`group text-left bg-[#141414]/80 border rounded-lg overflow-hidden hover:border-[#D4A843]/40 transition-all ${selectedEp === ep.youtubeId ? "border-[#D4A843]/60 ring-1 ring-[#D4A843]/30" : "border-[#D4A843]/10"}`}
            >
              <div className="relative aspect-video bg-[#1a1a1a]">
                {ep.youtubeId && <img src={`https://img.youtube.com/vi/${ep.youtubeId}/hqdefault.jpg`} alt={ep.title} className="w-full h-full object-cover" />}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-14 h-14 rounded-full bg-[#D4A843] flex items-center justify-center"><Play className="size-6 text-[#0a0a0a] ml-1" /></div>
                </div>
              </div>
              <div className="p-4">
                <span className="text-[9px] font-bold tracking-widest uppercase text-[#D4A843]/70">{ep.category}</span>
                <p className="text-sm text-[#f0ece4] font-medium mt-1 line-clamp-2">{ep.title}</p>
              </div>
            </button>
          ))}
        </div>
        {episodes.length === 0 && (
          <div className="text-center py-20 text-[#888]">
            <Headphones className="size-12 mx-auto mb-4 opacity-30" />
            <p>Episodes coming soon. Subscribe to get notified!</p>
          </div>
        )}
      </div>

      {/* Featured Guests */}
      {(guests?.length ?? 0) > 0 && (
        <div className="border-t border-[#D4A843]/10 bg-[#0d0d0d]">
          <div className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="font-display text-2xl tracking-wider mb-8 text-[#D4A843]">PAST GUESTS</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {guests?.filter(g => g.featured).map(g => (
                <div key={g._id} className="bg-[#141414]/80 border border-[#D4A843]/10 rounded-lg p-6 text-center hover:border-[#D4A843]/30 transition-all">
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#D4A843] to-[#B8922E] mx-auto mb-3 flex items-center justify-center text-[#0a0a0a] font-display text-2xl">{g.name.charAt(0)}</div>
                  <p className="font-display text-sm text-[#D4A843] tracking-wider">{g.name}</p>
                  <p className="text-[10px] text-[#888] mt-1">{g.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
