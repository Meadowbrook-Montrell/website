/**
 * Episode Detail Page — Individual content/episode view
 * Shows full video embed, description, related content, share links
 */
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SmartYouTubeEmbed } from "../components/SmartYouTubeEmbed";
import type { Id } from "../../convex/_generated/dataModel";
import {
  ArrowLeft,
  Calendar,
  Clock,
  Eye,
  Share2,
  ExternalLink,
  Play,
  Facebook,
  Instagram,
  Youtube,
  Tag,
  ChevronRight,
} from "lucide-react";

import { TikTokIcon } from "../components/icons/TikTokIcon";

/* ─── Category badge color ─── */
function categoryBadge(cat: string) {
  const colors: Record<string, string> = {
    interview: "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "street-reporting": "bg-red-500/20 text-red-400 border-red-500/30",
    "music-performance": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    podcast: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    short: "bg-green-500/20 text-green-400 border-green-500/30",
  };
  return colors[cat] || "bg-[#D4A843]/20 text-[#D4A843] border-[#D4A843]/30";
}

export function EpisodePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  // Fetch episode by ID
  const episode = useQuery(
    api.contentLib.getContentById,
    id ? { id: id as Id<"content"> } : "skip"
  );

  // Fetch all content for related episodes
  const allContent = useQuery(api.contentLib.listContent, {});

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Related content: same category, excluding current
  const relatedContent = allContent
    ?.filter((c) => c._id !== id && c.category === episode?.category)
    .slice(0, 6) || [];

  // More from channel
  const moreContent = allContent
    ?.filter((c) => c._id !== id && c.category !== episode?.category)
    .slice(0, 4) || [];

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  function handleShare() {
    if (navigator.share) {
      navigator.share({
        title: episode?.title || "3GMG Episode",
        url: shareUrl,
      });
    } else {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  if (episode === undefined) {
    return (
      <div id="main-content" className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#D4A843] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (episode === null) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-4xl font-bold text-[#D4A843] mb-4">Episode Not Found</h1>
        <p className="text-[#888078] mb-8">This episode doesn't exist or has been removed.</p>
        <button
          onClick={() => navigate("/")}
          className="px-6 py-3 bg-[#D4A843] text-black font-bold rounded-lg hover:bg-[#E8C05A] transition-colors"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const isShort = episode.duration && episode.duration.includes(":") && 
    parseInt(episode.duration.split(":")[0]) === 0 && parseInt(episode.duration.split(":")[1]) < 2;

  // JSON-LD structured data for this episode
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": episode.title,
    "description": episode.description || `${episode.title} — Make It Make Sense Podcast`,
    "thumbnailUrl": episode.youtubeId ? `https://img.youtube.com/vi/${episode.youtubeId}/maxresdefault.jpg` : undefined,
    "uploadDate": episode.publishedAt || episode._creationTime ? new Date(episode._creationTime).toISOString() : undefined,
    "embedUrl": episode.youtubeId ? `https://www.youtube.com/embed/${episode.youtubeId}` : undefined,
    "duration": episode.duration || undefined,
    "author": { "@type": "Person", "name": "Meadowbrook Montrell" },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    <div
      className="min-h-screen bg-[#0a0a0a] text-white"
      style={{
        backgroundImage: "url(/images/hero-graffiti.webp)",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Dark overlay */}
      <div className="min-h-screen" style={{ background: "rgba(10,10,10,0.92)" }}>
        {/* Top bar */}
        <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#D4A843]/10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-[#c8c0b0] hover:text-[#D4A843] transition-colors group"
            >
              <ArrowLeft className="size-5 group-hover:-translate-x-1 transition-transform" />
              <span className="text-sm font-medium tracking-wider uppercase">Back</span>
            </button>

            <a href="/" className="flex items-center">
              <img
                src="/images/logo-3gmg-graffiti.png"
                alt="3GMG"
                className="h-10 w-auto drop-shadow-[0_0_6px_rgba(212,168,67,0.3)]"
              />
            </a>

            <button
              onClick={handleShare}
              className="flex items-center gap-2 text-[#888078] hover:text-[#D4A843] transition-colors"
            >
              <Share2 className="size-4" />
              <span className="text-sm hidden sm:inline">{copied ? "Copied!" : "Share"}</span>
            </button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* ═══ Main Content Column ═══ */}
            <div className="lg:col-span-2 space-y-6">
              {/* Video Embed */}
              {episode.youtubeId && (
                <div className={`rounded-2xl overflow-hidden border border-[#D4A843]/10 shadow-2xl shadow-black/40 ${
                  isShort ? "max-w-sm mx-auto aspect-[9/16]" : "aspect-video"
                }`}>
                  <SmartYouTubeEmbed
                    videoId={episode.youtubeId}
                    title={episode.title}
                    className="w-full h-full"
                  />
                </div>
              )}

              {/* Episode Info */}
              <div className="space-y-4">
                {/* Category & Meta */}
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full border ${categoryBadge(episode.category)}`}>
                    {episode.category.replace(/-/g, " ")}
                  </span>
                  {episode.duration && (
                    <span className="flex items-center gap-1 text-xs text-[#888078]">
                      <Clock className="size-3" />
                      {episode.duration}
                    </span>
                  )}
                  {episode.publishedAt && (
                    <span className="flex items-center gap-1 text-xs text-[#888078]">
                      <Calendar className="size-3" />
                      {new Date(episode.publishedAt).toLocaleDateString("en-US", {
                        year: "numeric", month: "short", day: "numeric",
                      })}
                    </span>
                  )}
                  {episode.platform && (
                    <span className="flex items-center gap-1 text-xs text-[#888078]">
                      <Eye className="size-3" />
                      {episode.platform}
                    </span>
                  )}
                </div>

                {/* Title */}
                <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                  {episode.title}
                </h1>

                {/* Description */}
                <div className="bg-[#141414]/80 border border-[#D4A843]/10 rounded-xl p-6">
                  <p className="text-[#c8c0b0] leading-relaxed whitespace-pre-wrap">
                    {episode.description}
                  </p>
                </div>

                {/* Tags */}
                {episode.tags && episode.tags.length > 0 && (
                  <div className="flex flex-wrap items-center gap-2">
                    <Tag className="size-4 text-[#D4A843]" />
                    {episode.tags.map((tag) => (
                      <span
                        key={tag}
                        className="px-3 py-1 text-xs font-medium text-[#c8c0b0] bg-[#D4A843]/10 rounded-full border border-[#D4A843]/15 hover:border-[#D4A843]/40 transition-colors cursor-default"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 pt-2">
                  {episode.youtubeId && (
                    <a
                      href={`https://www.youtube.com/watch?v=${episode.youtubeId}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-lg transition-colors text-sm"
                    >
                      <Youtube className="size-4" />
                      Watch on YouTube
                    </a>
                  )}
                  {episode.externalUrl && (
                    <a
                      href={episode.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-5 py-2.5 bg-[#D4A843]/20 hover:bg-[#D4A843]/30 text-[#D4A843] font-bold rounded-lg border border-[#D4A843]/30 transition-colors text-sm"
                    >
                      <ExternalLink className="size-4" />
                      External Link
                    </a>
                  )}
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#1a1a1a] hover:bg-[#252525] text-[#c8c0b0] font-medium rounded-lg border border-[#333] transition-colors text-sm"
                  >
                    <Share2 className="size-4" />
                    {copied ? "Link Copied!" : "Share"}
                  </button>
                </div>

                {/* Share to socials */}
                <div className="flex items-center gap-4 pt-2">
                  <span className="text-xs text-[#888078] uppercase tracking-wider">Share to:</span>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[#888078] hover:text-blue-400 transition-colors"
                  >
                    <Facebook className="size-5" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(episode.title)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[#888078] hover:text-sky-400 transition-colors"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                    </svg>
                  </a>
                  <a
                    href={`https://api.whatsapp.com/send?text=${encodeURIComponent(episode.title + " " + shareUrl)}`}
                    target="_blank" rel="noopener noreferrer"
                    className="text-[#888078] hover:text-green-400 transition-colors"
                    aria-label="Share on WhatsApp"
                  >
                    <svg viewBox="0 0 24 24" className="size-5" fill="currentColor">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* ═══ Sidebar ═══ */}
            <div className="space-y-6">
              {/* Related Episodes */}
              {relatedContent.length > 0 && (
                <div className="bg-[#141414]/80 border border-[#D4A843]/10 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#D4A843]/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4A843]">
                      Related Episodes
                    </h3>
                  </div>
                  <div className="divide-y divide-[#D4A843]/5">
                    {relatedContent.map((item) => (
                      <a
                        key={item._id}
                        href={`/episode/${item._id}`}
                        className="flex gap-3 p-4 hover:bg-[#D4A843]/5 transition-colors group"
                      >
                        <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
                          {item.thumbnailUrl ? (
                            <img
                              src={item.thumbnailUrl}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : item.youtubeId ? (
                            <img
                              src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                              alt={item.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="size-5 text-[#D4A843]" />
                            </div>
                          )}
                          {item.duration && (
                            <span className="absolute bottom-1 right-1 bg-black/80 text-white text-[10px] px-1.5 py-0.5 rounded font-mono">
                              {item.duration}
                            </span>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#c8c0b0] group-hover:text-[#D4A843] transition-colors line-clamp-2 leading-tight">
                            {item.title}
                          </h4>
                          <p className="text-[10px] text-[#888078] mt-1 uppercase tracking-wider">
                            {item.category.replace(/-/g, " ")}
                          </p>
                        </div>
                      </a>
                    ))}
                  </div>
                  <a
                    href="/library"
                    className="flex items-center justify-center gap-2 px-5 py-3 text-sm text-[#D4A843] hover:bg-[#D4A843]/10 transition-colors border-t border-[#D4A843]/10"
                  >
                    View All Content
                    <ChevronRight className="size-4" />
                  </a>
                </div>
              )}

              {/* More From 3GMG */}
              {moreContent.length > 0 && (
                <div className="bg-[#141414]/80 border border-[#D4A843]/10 rounded-xl overflow-hidden">
                  <div className="px-5 py-4 border-b border-[#D4A843]/10">
                    <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4A843]">
                      More From 3GMG
                    </h3>
                  </div>
                  <div className="divide-y divide-[#D4A843]/5">
                    {moreContent.map((item) => (
                      <a
                        key={item._id}
                        href={`/episode/${item._id}`}
                        className="flex gap-3 p-4 hover:bg-[#D4A843]/5 transition-colors group"
                      >
                        <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden bg-[#1a1a1a]">
                          {item.thumbnailUrl ? (
                            <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                          ) : item.youtubeId ? (
                            <img
                              src={`https://img.youtube.com/vi/${item.youtubeId}/mqdefault.jpg`}
                              alt={item.title}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="size-5 text-[#D4A843]" />
                            </div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-semibold text-[#c8c0b0] group-hover:text-[#D4A843] transition-colors line-clamp-2 leading-tight">
                            {item.title}
                          </h4>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Links */}
              <div className="bg-[#141414]/80 border border-[#D4A843]/10 rounded-xl p-5 space-y-3">
                <h3 className="text-sm font-bold uppercase tracking-wider text-[#D4A843]">
                  Connect
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: Youtube, label: "YouTube", url: "https://www.youtube.com/@Meadowbrookmontrell", color: "hover:bg-red-500/10 hover:text-red-400" },
                    { icon: Facebook, label: "Facebook", url: "https://www.facebook.com/meadowbrookmontrell", color: "hover:bg-blue-500/10 hover:text-blue-400" },
                    { icon: Instagram, label: "Instagram", url: "https://www.instagram.com/3gmgmeadowbrookmontrell", color: "hover:bg-pink-500/10 hover:text-pink-400" },
                    { icon: TikTokIcon, label: "TikTok", url: "https://www.tiktok.com/@meadowbrookmontrellmedia", color: "hover:bg-cyan-500/10 hover:text-cyan-400" },
                  ].map((s) => (
                    <a
                      key={s.label}
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2 px-3 py-2.5 text-sm text-[#888078] bg-[#1a1a1a] rounded-lg border border-[#333] transition-all ${s.color}`}
                    >
                      <s.icon className="size-4" />
                      {s.label}
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="border-t border-[#D4A843]/10 mt-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center">
            <a href="/">
              <img
                src="/images/logo-3gmg-graffiti.png"
                alt="3GMG"
                className="h-12 w-auto mx-auto mb-4 drop-shadow-[0_0_8px_rgba(212,168,67,0.3)]"
              />
            </a>
            <p className="text-xs text-[#888078]">
              © {new Date().getFullYear()} 3GMG / Make It Make Sense. Fort Worth, TX.
            </p>
          </div>
        </footer>
      </div>
    </div>
    </>
  );
}
