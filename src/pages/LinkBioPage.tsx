/**
 * Smart Link-in-Bio Page — auto-updating single-link hub
 */
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { ExternalLink, Youtube, Music, Mic, ShoppingBag, Radio, Play, ArrowLeft } from "lucide-react";
import type { Id } from "../../convex/_generated/dataModel";

const iconMap: Record<string, React.ElementType> = {
  youtube: Youtube,
  music: Music,
  podcast: Mic,
  merch: ShoppingBag,
  live: Radio,
  default: ExternalLink,
};

const defaultLinks = [
  { title: "▶ LATEST EPISODE", url: "https://www.youtube.com/watch?v=ufUQcipbtmw", icon: "youtube", color: "#FF0000" },
  { title: "🎙 MAKE IT MAKE SENSE PODCAST", url: "https://www.youtube.com/@Meadowbrookmontrell", icon: "youtube", color: "#FF0000" },
  { title: "📱 FOLLOW ON TIKTOK", url: "https://www.tiktok.com/@meadowbrookmontrellmedia", icon: "default", color: "#ff0050" },
  { title: "📘 FACEBOOK", url: "https://www.facebook.com/montrell.wilson.884042", icon: "default", color: "#4267B2" },
  { title: "📸 INSTAGRAM", url: "https://www.instagram.com/3gmgmeadowbrookmontrell", icon: "default", color: "#E4405F" },
  { title: "🎵 BOOK AN INTERVIEW", url: "/booking", icon: "podcast", color: "#D4A843" },
  { title: "📰 MEDIA KIT / SPONSORS", url: "/media-kit", icon: "default", color: "#D4A843" },
  { title: "💬 COMMUNITY WALL", url: "/community", icon: "default", color: "#D4A843" },
];

export function LinkBioPage() {
  const dbLinks = useQuery(api.operations.getLinkBioItems, { activeOnly: true });
  const trackClick = useMutation(api.operations.trackLinkClick);
  const upcomingSessions = useQuery(api.contentLib.getUpcomingLiveSessions);

  const links = dbLinks && dbLinks.length > 0 ? dbLinks : null;
  const nextLive = upcomingSessions?.[0];

  const handleClick = (id?: Id<"linkBioItems">) => {
    if (id) trackClick({ id });
  };

  return (
    <div
      id="main-content" className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] relative"
      style={{
        backgroundImage: "url('/images/hero-graffiti.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 max-w-md mx-auto px-4 py-12">
        {/* Back to Home */}
        <a href="/" className="inline-flex items-center gap-2 text-[#D4A843] hover:text-[#E8C767] text-sm mb-6 transition-colors">
          <ArrowLeft className="size-4" /> Back to Home
        </a>

        {/* Profile */}
        <div className="text-center mb-8">
          <img
            src="/images/montrell-about.webp"
            alt="Meadowbrook Montrell"
            className="w-24 h-24 rounded-full mx-auto mb-4 border-2 border-[#D4A843] object-cover"
          />
          <img src="/images/logo-3gmg-graffiti.png" alt="3GMG" className="h-10 mx-auto mb-2" />
          <h1 className="font-display text-xl tracking-wider">MEADOWBROOK MONTRELL</h1>
          <p className="text-[#888078] text-sm">THE HOOD'S PAPARAZZI • Fort Worth, TX</p>
        </div>

        {/* Live Session Banner */}
        {nextLive && (
          <a
            href={nextLive.streamUrl || "#"}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-6 p-4 bg-gradient-to-r from-red-600/20 to-[#D4A843]/20 border border-red-500/30 rounded-sm text-center animate-pulse-slow group"
          >
            <div className="flex items-center justify-center gap-2 text-red-400 text-xs font-bold tracking-widest uppercase mb-1">
              <Radio className="size-3" /> NEXT LIVE SESSION
            </div>
            <div className="font-display text-sm tracking-wider group-hover:text-[#D4A843] transition-colors">{nextLive.title}</div>
            <div className="text-xs text-[#888078] mt-1">
              {new Date(nextLive.scheduledAt).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
              {" • "}
              {new Date(nextLive.scheduledAt).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
            </div>
          </a>
        )}

        {/* Links */}
        <div className="space-y-3">
          {(links || defaultLinks).map((link, i) => {
            const Icon = iconMap[(link as any).icon || "default"] || ExternalLink;
            const isExternal = link.url.startsWith("http");
            const color = (link as any).color || "#D4A843";

            const inner = (
              <div
                className="flex items-center gap-4 p-4 bg-[#141414]/90 backdrop-blur-sm border border-[#333] rounded-sm hover:border-[#D4A843]/50 transition-all duration-300 group cursor-pointer"
                style={{ borderLeftColor: color, borderLeftWidth: "3px" }}
              >
                <Icon className="size-5 shrink-0" style={{ color }} />
                <span className="font-bold text-sm tracking-wider flex-1 group-hover:text-[#D4A843] transition-colors">{link.title}</span>
                <ExternalLink className="size-4 text-[#555] group-hover:text-[#D4A843] shrink-0 transition-colors" />
              </div>
            );

            if (isExternal) {
              return (
                <a
                  key={i}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => handleClick((link as any)._id)}
                >
                  {inner}
                </a>
              );
            }
            return (
              <a key={i} href={link.url} onClick={() => handleClick((link as any)._id)}>
                {inner}
              </a>
            );
          })}
        </div>

        {/* Latest Video Embed */}
        <div className="mt-8">
          <div className="text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-3 text-center">
            <Play className="size-3 inline mr-1" /> LATEST DROP
          </div>
          <div className="aspect-video rounded-sm overflow-hidden border border-[#D4A843]/20">
            <iframe
              src="https://www.youtube.com/embed/ufUQcipbtmw?rel=0"
              title="Latest Episode"
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8 text-xs text-[#555]">
          <a href="/" className="text-[#D4A843] hover:text-[#E8C767] transition-colors">Visit Full Website</a>
          <div className="mt-2">© {new Date().getFullYear()} 3GMG Media</div>
        </div>
      </div>
    </div>
  );
}
