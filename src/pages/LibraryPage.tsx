import { useState, useEffect, useRef } from "react";
import {
  Mic,
  Video,
  Newspaper,
  Music,
  Play,
  Menu,
  X,
  MapPin,
  Radio,
  Calendar,
  Filter,
} from "lucide-react";

/* ─── Types ─── */
type Category = "all" | "interview" | "street-reporting" | "music" | "shorts";

interface ContentItem {
  id: string;
  title: string;
  category: Category;
  youtubeId: string;
  duration?: string;
  isShort?: boolean;
}

/* ─── All real content from his YouTube channel ─── */
const CONTENT_ITEMS: ContentItem[] = [
  // ─── INTERVIEWS (full-length) ───
  {
    id: "v1",
    title: "Yung Deco Speaks On More Albums Than Lil Flip, Hate In His Own City, Importance Of Work Ethic",
    category: "interview",
    youtubeId: "ufUQcipbtmw",
    duration: "9:25",
  },
  {
    id: "v2",
    title: "Twisted Black Connecting With The People And The Media Before His Video Shoot With Shaq",
    category: "interview",
    youtubeId: "ETyWsOCWxtg",
    duration: "1:11",
  },
  // ─── STREET REPORTING (full-length) ───
  {
    id: "v3",
    title: "DFW Shaka EXPOSES Pandora Strip Club Promoters — Paid Finesse2Tymes For A Walk Through",
    category: "street-reporting",
    youtubeId: "q5IEpbLpvno",
    duration: "4:31",
  },
  // ─── INTERVIEW SHORTS ───
  {
    id: "s-int-1",
    title: "3GMG TAMUNO On Booker T Block Shooting A Mic Drop With Reallyfe Jeff",
    category: "interview",
    youtubeId: "of9vm8OHu0c",
    isShort: true,
  },
  {
    id: "s-int-2",
    title: "34 CHAN Song \"Fort Worth\" Was Based Off Experience",
    category: "interview",
    youtubeId: "onLVp8kDjSo",
    isShort: true,
  },
  {
    id: "s-int-3",
    title: "OG PERCY DAUGHTER Addresses False Allegations Put On The Internet",
    category: "interview",
    youtubeId: "wc8NJuaDJQ4",
    isShort: true,
  },
  {
    id: "s-int-4",
    title: "Dfw Shaka Gives Fort Worth LEGEND MCHENRY His Flowers In NEW 2026 Interview",
    category: "interview",
    youtubeId: "0BbxgRKk_sU",
    isShort: true,
  },
  {
    id: "s-int-5",
    title: "DBoy DaThrowdest Gives some FREE GAME To All The YN'S",
    category: "interview",
    youtubeId: "TxIkyMGLmHE",
    isShort: true,
  },
  {
    id: "s-int-6",
    title: "BOB REPORT SETS THE RECORD STRAIGHT IN NEW INTERVIEW!",
    category: "interview",
    youtubeId: "Uij55B3P3do",
    isShort: true,
  },
  {
    id: "s-int-7",
    title: "3GMG TAMUNO ADDRESSES Twisted Black",
    category: "interview",
    youtubeId: "dBgETb4hxJE",
    isShort: true,
  },
  {
    id: "s-int-8",
    title: "3GMG Tamuno Tells the CRAZIEST STORY",
    category: "interview",
    youtubeId: "yx3Yvr5RLZU",
    isShort: true,
  },
  {
    id: "s-int-9",
    title: "3GMG Tamuno Addresses OG GUMBY For Saying F*CK Fort Worth",
    category: "interview",
    youtubeId: "TOOJZ_fj5gk",
    isShort: true,
  },
  {
    id: "s-int-10",
    title: "Dfw Shaka Says No Limit WON VERZUZ — Lil Wayne Don't F*CK With Cash Money",
    category: "interview",
    youtubeId: "OttdiZ3-7kg",
    isShort: true,
  },
  // ─── STREET REPORTING SHORTS ───
  {
    id: "s-sr-1",
    title: "Security Footage Of Shooting At The White House Correspondents' Dinner",
    category: "street-reporting",
    youtubeId: "goaxBNGparg",
    isShort: true,
  },
  {
    id: "s-sr-2",
    title: "Police Have Arrested 18-Year-Old Ricco Henderson For The December 29 Double M*rder",
    category: "street-reporting",
    youtubeId: "Lhs21dAae7M",
    isShort: true,
  },
  {
    id: "s-sr-3",
    title: "FBI RELEASE VIDEO Of Charlie Kirk Sh**ter Running Across Roof-Top Fleeing The Scene",
    category: "street-reporting",
    youtubeId: "sPG7j1TfMZ0",
    isShort: true,
  },
  // ─── MUSIC / PERFORMANCES ───
  {
    id: "s-mu-1",
    title: "Twisted Black Performing His LEGENDARY SONG \"I'm A Fool Wit It\"",
    category: "music",
    youtubeId: "Mvb41IsSHEM",
    isShort: true,
  },
  {
    id: "s-mu-2",
    title: "Karma Lashay Made It Rain During Her Performance",
    category: "music",
    youtubeId: "tvi82gNf-jU",
    isShort: true,
  },
  {
    id: "s-mu-3",
    title: "OC Chris Performs His Hit Single \"Hey How Ya Doin\" at Save My City Tour",
    category: "music",
    youtubeId: "FOJej6g7kTg",
    isShort: true,
  },
  {
    id: "s-mu-4",
    title: "MYKFRESH Deserves His Flowers For What He's Done In The Rap Game",
    category: "music",
    youtubeId: "CDgpAv9vmYU",
    isShort: true,
  },
  {
    id: "s-mu-5",
    title: "NEW MUSIC — GloRilla, GlossUp, SlimeRoni, Yo Gotti",
    category: "music",
    youtubeId: "vds2-8wMO6Q",
    isShort: true,
  },
  // ─── GENERAL SHORTS / STREET CONTENT ───
  {
    id: "s-1",
    title: "Taco Bell Employee Opens Fire After Customer Fills Water Cup with Soda",
    category: "shorts",
    youtubeId: "pVGl7kCNSnI",
    isShort: true,
  },
  {
    id: "s-2",
    title: "Would You Do A LIFE SENTENCE For A Crime You Didn't Do?",
    category: "shorts",
    youtubeId: "K41_4LTlzww",
    isShort: true,
  },
  {
    id: "s-3",
    title: "MO3 Liked Fort Worth, He Showed Love And Had His Birthday In Fort Worth!",
    category: "shorts",
    youtubeId: "QeVyLrkqci4",
    isShort: true,
  },
  {
    id: "s-4",
    title: "Woman Describes Her TERRIBLE Experience Meeting Beyoncé's Mother at the Houston Rodeo",
    category: "shorts",
    youtubeId: "G__yVg07kSg",
    isShort: true,
  },
  {
    id: "s-5",
    title: "ThirdGate Tamuno Tappin In With HeadHuncho Amir",
    category: "shorts",
    youtubeId: "HgJznP2LATA",
    isShort: true,
  },
  {
    id: "s-6",
    title: "2 Chainz Stops in Fort Worth To Promote His New Book",
    category: "shorts",
    youtubeId: "o9fF-4SYo00",
    isShort: true,
  },
  {
    id: "s-7",
    title: "JASMINE CROCKETT Insinuates Cheating In The Texas Primary!",
    category: "shorts",
    youtubeId: "R79UialVxA8",
    isShort: true,
  },
  {
    id: "s-8",
    title: "Two Legends From Different Era — JazzieMac & DFW Shaka",
    category: "shorts",
    youtubeId: "FSjcJB0GjT0",
    isShort: true,
  },
  {
    id: "s-9",
    title: "Contact Patrick Bowers For Affordable Legal Services",
    category: "shorts",
    youtubeId: "vVfMp7DdTnk",
    isShort: true,
  },
  {
    id: "s-10",
    title: "Why Security Matters: Pink House Owner Is AT FAULT",
    category: "shorts",
    youtubeId: "bRe7UpELUu8",
    isShort: true,
  },
  {
    id: "s-11",
    title: "I Accidentally BLINDED Dee Will Skit With My Bright Light",
    category: "shorts",
    youtubeId: "lu3II-vMVNE",
    isShort: true,
  },
  {
    id: "s-12",
    title: "JhonnieDamnD and Bend University Took Over The Stage",
    category: "shorts",
    youtubeId: "KNWlc484t-k",
    isShort: true,
  },
  {
    id: "s-13",
    title: "Shook Hands With HeadHuncho Amir at \"Motivate The City\" Birthday Bash",
    category: "shorts",
    youtubeId: "q_GD__LSdXI",
    isShort: true,
  },
  {
    id: "s-14",
    title: "34 CHAN: 10 Year Rap Career, Born LA Raised Truman Street",
    category: "shorts",
    youtubeId: "Nq_5qoOoShI",
    isShort: true,
  },
  {
    id: "s-15",
    title: "UNDERGROUND BOXER PRESSURE P EXPLOSIVE KNOCK OUT IN THE FIRST ROUND",
    category: "shorts",
    youtubeId: "MkMACqMZ3jM",
    isShort: true,
  },
  {
    id: "s-16",
    title: "Gunna Meize Vibing at The MAXX Night Club",
    category: "shorts",
    youtubeId: "O1EAtgIcYec",
    isShort: true,
  },
  {
    id: "s-17",
    title: "OG KUNTA & OG LA RON Link Up In Hoova Land",
    category: "shorts",
    youtubeId: "tJHxDgUgH5U",
    isShort: true,
  },
  {
    id: "s-18",
    title: "SPOTIFY New Terms Of Service A SCAM",
    category: "shorts",
    youtubeId: "EHAH_9KA44M",
    isShort: true,
  },
  {
    id: "s-19",
    title: "Kodak Black Training to Fight Ray J",
    category: "shorts",
    youtubeId: "cdkvuyzOk40",
    isShort: true,
  },
];

/* ─── Live Sessions ─── */
const LIVE_SESSIONS = [
  {
    id: "live-1",
    title: "Make It Make Sense — LIVE",
    description:
      "Tune in live as Meadowbrook Montrell chops it up with the community. Call in, drop questions, and keep it real.",
    scheduledAt: "Live Sessions — Follow for Updates",
    platform: "youtube",
    streamUrl: "https://www.youtube.com/@Meadowbrookmontrell",
    isLive: false,
    guestName: "TBA",
  },
];

/* ─── Category config ─── */
const CATEGORIES: { key: Category; label: string; icon: typeof Mic }[] = [
  { key: "all", label: "All", icon: Filter },
  { key: "interview", label: "Interviews", icon: Video },
  { key: "street-reporting", label: "Street Reporting", icon: Newspaper },
  { key: "music", label: "Music & Performances", icon: Music },
  { key: "shorts", label: "Street Clips", icon: Play },
];

/* ─── Nav links ─── */
const NAV_LINKS = [
  { label: "HOME", href: "/v2" },
  { label: "LIBRARY", href: "/library" },
];

/* ─── Scroll animation ─── */
function AnimatedSection({
  children,
  className = "",
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => setVisible(true), delay * 1000);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Video Card (landscape for full videos) ─── */
function VideoCard({ item }: { item: ContentItem }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const categoryBadge: Record<string, string> = {
    interview: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "street-reporting": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    music: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    shorts: "bg-green-500/20 text-green-400 border-green-500/30",
  };

  const categoryLabel: Record<string, string> = {
    interview: "INTERVIEW",
    "street-reporting": "STREET REPORTING",
    music: "MUSIC",
    shorts: "STREET CLIP",
  };

  if (item.isShort) {
    return (
      <div className="group relative rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500 backdrop-blur-sm">
        <div className="aspect-[9/16] relative overflow-hidden bg-black max-h-[400px]">
          {isPlaying ? (
            <iframe
              src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
              title={item.title}
              className="w-full h-full"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <>
              <img
                src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
                alt={item.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
                }}
              />
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/5 transition-colors duration-300" />
              <button
                onClick={() => setIsPlaying(true)}
                className="absolute inset-0 flex items-center justify-center"
              >
                <div className="w-14 h-14 rounded-full bg-[#D4A843] flex items-center justify-center shadow-lg shadow-[#D4A843]/30 group-hover:scale-110 transition-transform duration-300">
                  <Play className="size-6 text-[#0a0a0a] ml-0.5" fill="#0a0a0a" />
                </div>
              </button>
              {/* Short badge */}
              <div className="absolute top-2 right-2 px-2 py-0.5 bg-red-600/90 text-white text-[10px] font-bold tracking-wider rounded">
                SHORT
              </div>
            </>
          )}
        </div>
        <div className="p-4">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border inline-block mb-2 ${
              categoryBadge[item.category] || ""
            }`}
          >
            {categoryLabel[item.category] || ""}
          </span>
          <h3 className="font-display text-sm text-[#f0ece4] tracking-wider leading-tight line-clamp-2">
            {item.title.toUpperCase()}
          </h3>
        </div>
      </div>
    );
  }

  // Full-length video card
  return (
    <div className="group relative rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500 backdrop-blur-sm">
      <div className="aspect-video relative overflow-hidden bg-black">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${item.youtubeId}?autoplay=1&rel=0`}
            title={item.title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <>
            <img
              src={`https://img.youtube.com/vi/${item.youtubeId}/maxresdefault.jpg`}
              alt={item.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              onError={(e) => {
                (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${item.youtubeId}/hqdefault.jpg`;
              }}
            />
            <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-300" />
            <button
              onClick={() => setIsPlaying(true)}
              className="absolute inset-0 flex items-center justify-center"
            >
              <div className="w-16 h-16 rounded-full bg-[#D4A843] flex items-center justify-center shadow-lg shadow-[#D4A843]/30 group-hover:scale-110 transition-transform duration-300">
                <Play className="size-7 text-[#0a0a0a] ml-1" fill="#0a0a0a" />
              </div>
            </button>
            {item.duration && (
              <div className="absolute bottom-2 right-2 px-2 py-0.5 bg-black/80 text-white text-xs font-mono rounded">
                {item.duration}
              </div>
            )}
          </>
        )}
      </div>
      <div className="p-5">
        <div className="flex items-center gap-3 mb-3">
          <span
            className={`text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded border ${
              categoryBadge[item.category] || ""
            }`}
          >
            {categoryLabel[item.category] || ""}
          </span>
        </div>
        <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-2 leading-tight line-clamp-2">
          {item.title.toUpperCase()}
        </h3>
      </div>
    </div>
  );
}

/* ─── Live Session Banner ─── */
function LiveBanner({
  session,
}: {
  session: (typeof LIVE_SESSIONS)[0];
}) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-[#D4A843]/20 bg-gradient-to-r from-[#1a1208]/80 via-[#141414]/80 to-[#1a1208]/80 backdrop-blur-sm">
      {session.isLive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-red-400 to-red-500 animate-pulse" />
      )}

      <div className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="shrink-0">
            <div
              className={`w-28 h-28 rounded-full flex items-center justify-center ${
                session.isLive
                  ? "bg-red-500/20 border-2 border-red-500 animate-pulse"
                  : "bg-[#D4A843]/10 border-2 border-[#D4A843]/30"
              }`}
            >
              <Radio
                className={`size-12 ${
                  session.isLive ? "text-red-500" : "text-[#D4A843]"
                }`}
              />
            </div>
          </div>

          <div className="text-center md:text-left flex-1">
            {session.isLive ? (
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-red-500/20 border border-red-500/40 rounded-full">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
                  LIVE NOW
                </span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 mb-3 px-3 py-1 bg-[#D4A843]/10 border border-[#D4A843]/30 rounded-full">
                <Calendar className="size-3 text-[#D4A843]" />
                <span className="text-[#D4A843] text-xs font-bold tracking-widest uppercase">
                  LIVE INTERVIEW SESSIONS
                </span>
              </div>
            )}

            <h3 className="font-display text-3xl md:text-4xl text-[#f0ece4] tracking-wider mb-3">
              {session.title.toUpperCase()}
            </h3>
            <p className="text-[#c8c0b0] leading-relaxed mb-4 max-w-2xl">
              {session.description}
            </p>

            <div className="flex flex-wrap items-center gap-4 justify-center md:justify-start mb-6">
              <div className="flex items-center gap-2 text-[#D4A843]">
                <Calendar className="size-4" />
                <span className="text-sm font-medium">
                  {session.scheduledAt}
                </span>
              </div>
            </div>

            <a
              href={session.streamUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-2 px-6 py-3 font-bold text-xs tracking-widest uppercase rounded-sm transition-all duration-300 ${
                session.isLive
                  ? "bg-red-500 text-white hover:bg-red-400"
                  : "bg-[#D4A843] text-[#0a0a0a] hover:bg-[#E8C767]"
              }`}
            >
              <Radio className="size-4" />
              {session.isLive ? "WATCH LIVE NOW" : "SUBSCRIBE FOR UPDATES"}
            </a>
          </div>
        </div>
      </div>

      <div
        className={`h-1 ${
          session.isLive
            ? "bg-gradient-to-r from-red-500 via-red-400 to-red-500"
            : "bg-gradient-to-r from-[#D4A843] via-[#E8C767] to-[#D4A843]"
        }`}
      />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   LIBRARY PAGE COMPONENT
   ═══════════════════════════════════════════════════ */
export function LibraryPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category>("all");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredContent =
    selectedCategory === "all"
      ? CONTENT_ITEMS
      : CONTENT_ITEMS.filter((item) => item.category === selectedCategory);

  // Split into full videos and shorts
  const fullVideos = filteredContent.filter((i) => !i.isShort);
  const shorts = filteredContent.filter((i) => i.isShort);

  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count:
      cat.key === "all"
        ? CONTENT_ITEMS.length
        : CONTENT_ITEMS.filter((item) => item.category === cat.key).length,
  }));

  return (
    <div className="min-h-screen text-[#f0ece4] overflow-x-hidden">
      {/* Fixed full-page background */}
      <div
        className="fixed inset-0 -z-10"
        style={{
          backgroundImage: `url('/images/hero-graffiti.webp')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="absolute inset-0 bg-[#0a0a0a]/60" />
      </div>

      {/* ─── NAVIGATION ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#D4A843]/10 shadow-lg shadow-black/20"
            : "bg-[#0a0a0a]/80 backdrop-blur-sm"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            <a href="/v2" className="flex items-center gap-3 group">
              <img
                src="/images/logo-3gmg-graffiti.png"
                alt="3GMG"
                className="h-12 md:h-14 w-auto drop-shadow-[0_0_8px_rgba(212,168,67,0.4)]"
              />
            </a>

            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className={`text-xs font-bold tracking-[0.25em] uppercase transition-colors duration-300 ${
                    link.label === "LIBRARY"
                      ? "text-[#D4A843]"
                      : "text-[#c8c0b0] hover:text-[#D4A843]"
                  }`}
                >
                  {link.label}
                </a>
              ))}
            </div>

            <button
              className="md:hidden text-[#c8c0b0] hover:text-[#D4A843] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="size-6" />
              ) : (
                <Menu className="size-6" />
              )}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-lg border-b border-[#D4A843]/10">
            <div className="px-4 py-4 space-y-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-[#c8c0b0] hover:text-[#D4A843] text-sm font-bold tracking-[0.2em] uppercase py-2 transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════
          PAGE HEADER
          ═══════════════════════════════════════════════════ */}
      <section className="pt-28 md:pt-36 pb-8 md:pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">
              The Archive
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f0ece4] tracking-wider mb-4">
              CONTENT
              <br />
              <span className="text-gold-gradient">LIBRARY</span>
            </h1>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">
              Every interview, street report, and clip — all in one place. {CONTENT_ITEMS.length} videos and counting.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          LIVE SESSIONS
          ═══════════════════════════════════════════════════ */}
      <section id="live" className="pb-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="flex items-center gap-3 mb-6">
              <Radio className="size-5 text-[#D4A843]" />
              <h2 className="font-display text-2xl text-[#f0ece4] tracking-wider">
                LIVE SESSIONS
              </h2>
            </div>
            {LIVE_SESSIONS.map((session) => (
              <LiveBanner key={session.id} session={session} />
            ))}
          </AnimatedSection>
        </div>
      </section>

      <div className="h-px max-w-4xl mx-auto bg-gradient-to-r from-transparent via-[#D4A843]/30 to-transparent" />

      {/* ═══════════════════════════════════════════════════
          CONTENT LIBRARY
          ═══════════════════════════════════════════════════ */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filter Tabs */}
          <AnimatedSection className="mb-10">
            <div className="flex flex-wrap gap-2 sm:gap-3 justify-center">
              {categoryCounts.map((cat) => (
                <button
                  key={cat.key}
                  onClick={() => setSelectedCategory(cat.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-sm text-[11px] font-bold tracking-widest uppercase transition-all duration-300 border ${
                    selectedCategory === cat.key
                      ? "bg-[#D4A843] text-[#0a0a0a] border-[#D4A843]"
                      : "bg-[#141414]/60 text-[#c8c0b0] border-[#D4A843]/10 hover:border-[#D4A843]/30 hover:text-[#D4A843] backdrop-blur-sm"
                  }`}
                >
                  <cat.icon className="size-3.5" />
                  {cat.label}
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                      selectedCategory === cat.key
                        ? "bg-[#0a0a0a]/20 text-[#0a0a0a]"
                        : "bg-[#D4A843]/10 text-[#D4A843]"
                    }`}
                  >
                    {cat.count}
                  </span>
                </button>
              ))}
            </div>
          </AnimatedSection>

          {/* Full-Length Videos */}
          {fullVideos.length > 0 && (
            <>
              <AnimatedSection className="mb-6">
                <h3 className="font-display text-xl text-[#D4A843] tracking-wider flex items-center gap-2">
                  <Video className="size-5" />
                  FULL VIDEOS
                </h3>
              </AnimatedSection>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {fullVideos.map((item, idx) => (
                  <AnimatedSection key={item.id} delay={idx * 0.08}>
                    <VideoCard item={item} />
                  </AnimatedSection>
                ))}
              </div>
            </>
          )}

          {/* Shorts / Clips */}
          {shorts.length > 0 && (
            <>
              <AnimatedSection className="mb-6">
                <div className="h-px w-full bg-gradient-to-r from-transparent via-[#D4A843]/20 to-transparent mb-8" />
                <h3 className="font-display text-xl text-[#D4A843] tracking-wider flex items-center gap-2">
                  <Play className="size-5" />
                  CLIPS & SHORTS
                  <span className="text-sm text-[#888078] font-sans font-normal ml-2">
                    ({shorts.length})
                  </span>
                </h3>
              </AnimatedSection>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {shorts.map((item, idx) => (
                  <AnimatedSection key={item.id} delay={Math.min(idx * 0.04, 0.6)}>
                    <VideoCard item={item} />
                  </AnimatedSection>
                ))}
              </div>
            </>
          )}

          {/* Empty state */}
          {filteredContent.length === 0 && (
            <AnimatedSection className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center mx-auto mb-6">
                <Video className="size-8 text-[#D4A843]/50" />
              </div>
              <h3 className="font-display text-2xl text-[#f0ece4] tracking-wider mb-2">
                COMING SOON
              </h3>
              <p className="text-[#888078] max-w-md mx-auto">
                More content in this category is on the way. Stay tuned.
              </p>
            </AnimatedSection>
          )}
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="relative border-t border-[#D4A843]/10 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <img
                src="/images/logo-3gmg-graffiti.png"
                alt="3GMG"
                className="h-12 w-auto drop-shadow-[0_0_8px_rgba(212,168,67,0.3)]"
              />
              <div className="flex items-center gap-2 text-[#888078] text-sm">
                <MapPin className="size-3.5" />
                <span>Fort Worth, Texas</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-[#888078] hover:text-[#D4A843] text-xs font-medium tracking-widest uppercase transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </div>

            <p className="text-[#555] text-xs tracking-wider">
              © {new Date().getFullYear()} 3GMG / MEADOWBROOK MONTRELL
            </p>
          </div>
        </div>
      </footer>

      {/* ─── Styles ─── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Inter:wght@300;400;500;600;700&display=swap');
        .font-display { font-family: 'Bebas Neue', sans-serif; }
        .text-gold-gradient {
          background: linear-gradient(135deg, #D4A843, #E8C767, #D4A843);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
