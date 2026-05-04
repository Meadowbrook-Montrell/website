/**
 * Sitewide Search Page
 */
import { useState } from "react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Search, ArrowLeft, Play, FileText, Users, Calendar, X } from "lucide-react";

export function SearchPage() {
  const [query, setQuery] = useState("");
  const [submitted, setSubmitted] = useState("");

  const results = useQuery(api.consumer.siteSearch, submitted.length >= 2 ? { q: submitted } : "skip");

  const totalResults = results
    ? results.content.length + results.blog.length + results.guests.length + results.events.length
    : 0;

  return (
    <div id="main-content" className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#D4A843]/10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center h-16 gap-4">
          <a href="/" className="flex items-center gap-2 text-[#888078] hover:text-[#D4A843] transition-colors">
            <ArrowLeft className="size-4" /> <span className="text-sm">Home</span>
          </a>
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-5 text-[#888078]" />
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") setSubmitted(query); }}
              placeholder="Search content, blog posts, guests, events..."
              className="w-full bg-[#141414] border border-[#D4A843]/20 rounded-lg pl-10 pr-10 py-3 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/50 focus:outline-none"
            />
            {query && (
              <button onClick={() => { setQuery(""); setSubmitted(""); }} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#888078] hover:text-[#f0ece4]">
                <X className="size-4" />
              </button>
            )}
          </div>
          <button
            onClick={() => setSubmitted(query)}
            className="px-4 py-2.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm rounded-lg hover:bg-[#E8C767] transition-all"
          >
            Search
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {!submitted ? (
          <div className="text-center py-20">
            <Search className="size-16 text-[#D4A843]/20 mx-auto mb-4" />
            <p className="font-display text-2xl text-[#D4A843]/30 tracking-widest mb-2">SEARCH 3GMG</p>
            <p className="text-[#888078]">Find episodes, blog posts, guests, events, and more.</p>
          </div>
        ) : (
          <>
            <p className="text-sm text-[#888078] mb-8">
              {totalResults} result{totalResults !== 1 ? "s" : ""} for "<span className="text-[#D4A843]">{submitted}</span>"
            </p>

            {/* Content Results */}
            {results && results.content.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Play className="size-5 text-[#D4A843]" />
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Content ({results.content.length})</h3>
                </div>
                <div className="space-y-2">
                  {results.content.map((item: any) => (
                    <a key={item._id} href={`/episode/${item._id}`} className="flex items-center gap-4 p-4 rounded-lg bg-[#141414]/80 border border-[#D4A843]/5 hover:border-[#D4A843]/20 transition-all">
                      {item.youtubeId && (
                        <img src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`} alt="" className="w-24 h-16 object-cover rounded" />
                      )}
                      <div>
                        <p className="text-sm text-[#f0ece4] font-medium">{item.title}</p>
                        <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4A843]">{item.category}</span>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Blog Results */}
            {results && results.blog.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <FileText className="size-5 text-[#D4A843]" />
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Blog Posts ({results.blog.length})</h3>
                </div>
                <div className="space-y-2">
                  {results.blog.map((post: any) => (
                    <a key={post._id} href={`/blog/${post.slug || post._id}`} className="block p-4 rounded-lg bg-[#141414]/80 border border-[#D4A843]/5 hover:border-[#D4A843]/20 transition-all">
                      <p className="text-sm text-[#f0ece4] font-medium">{post.title}</p>
                      {post.excerpt && <p className="text-xs text-[#888078] mt-1 line-clamp-2">{post.excerpt}</p>}
                      <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4A843]">{post.category?.replace(/-/g, " ")}</span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Guest Results */}
            {results && results.guests.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Users className="size-5 text-[#D4A843]" />
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Guests ({results.guests.length})</h3>
                </div>
                <div className="space-y-2">
                  {results.guests.map((g: any) => (
                    <div key={g._id} className="flex items-center gap-4 p-4 rounded-lg bg-[#141414]/80 border border-[#D4A843]/5">
                      <div className="w-10 h-10 rounded-full bg-[#D4A843]/10 flex items-center justify-center text-[#D4A843] font-display text-sm">{g.name.charAt(0)}</div>
                      <div>
                        <p className="text-sm text-[#f0ece4] font-medium">{g.name}</p>
                        <p className="text-[10px] text-[#888078]">{g.title || "Guest"}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Event Results */}
            {results && results.events.length > 0 && (
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-4">
                  <Calendar className="size-5 text-[#D4A843]" />
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider">Events ({results.events.length})</h3>
                </div>
                <div className="space-y-2">
                  {results.events.map((e: any) => (
                    <a key={e._id} href="/events" className="block p-4 rounded-lg bg-[#141414]/80 border border-[#D4A843]/5 hover:border-[#D4A843]/20 transition-all">
                      <p className="text-sm text-[#f0ece4] font-medium">{e.title}</p>
                      <p className="text-xs text-[#888078] mt-1">{new Date(e.date).toLocaleDateString()} {e.location ? `· ${e.location}` : ""}</p>
                    </a>
                  ))}
                </div>
              </div>
            )}

            {totalResults === 0 && (
              <div className="text-center py-20">
                <p className="font-display text-2xl text-[#D4A843]/30 tracking-widest mb-2">NO RESULTS</p>
                <p className="text-[#888078]">Try different keywords or check back later for new content.</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
