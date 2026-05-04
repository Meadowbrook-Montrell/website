import { useState, useEffect, useRef, useCallback } from "react";
import {
  Camera,
  Menu,
  X,
  MapPin,
  Filter,
  Expand,
  ChevronLeft,
  ChevronRight,
  Mic,
  Music,
  Users,
  Flame,
} from "lucide-react";

/* ─── Types ─── */
type GalleryCategory = "all" | "interviews" | "events" | "street" | "performances" | "behind-the-scenes";

interface GalleryItem {
  id: string;
  src: string;
  alt: string;
  category: GalleryCategory;
  caption?: string;
  featured?: boolean;
}

/* ─── Gallery images (YouTube thumbnails + future uploads) ─── */
const GALLERY_ITEMS: GalleryItem[] = [
  // Interviews
  {
    id: "g1",
    src: "https://img.youtube.com/vi/ufUQcipbtmw/maxresdefault.jpg",
    alt: "Yung Deco Interview",
    category: "interviews",
    caption: "Yung Deco Speaks On More Albums Than Lil Flip & Work Ethic",
    featured: true,
  },
  {
    id: "g2",
    src: "https://img.youtube.com/vi/ETyWsOCWxtg/maxresdefault.jpg",
    alt: "Twisted Black Interview",
    category: "interviews",
    caption: "Twisted Black Connecting With The People Before His Video Shoot With Shaq",
    featured: true,
  },
  {
    id: "g3",
    src: "https://img.youtube.com/vi/0BbxgRKk_sU/maxresdefault.jpg",
    alt: "DFW Shaka & McHenry",
    category: "interviews",
    caption: "Dfw Shaka Gives Fort Worth Legend McHenry His Flowers",
  },
  {
    id: "g4",
    src: "https://img.youtube.com/vi/of9vm8OHu0c/maxresdefault.jpg",
    alt: "3GMG Tamuno Mic Drop",
    category: "interviews",
    caption: "3GMG Tamuno On Booker T Block Shooting A Mic Drop With Reallyfe Jeff",
  },
  {
    id: "g5",
    src: "https://img.youtube.com/vi/TxIkyMGLmHE/maxresdefault.jpg",
    alt: "DBoy DaThrowdest Interview",
    category: "interviews",
    caption: "DBoy DaThrowdest Gives Free Game To The YN's",
  },
  {
    id: "g6",
    src: "https://img.youtube.com/vi/Uij55B3P3do/maxresdefault.jpg",
    alt: "Bob Report Interview",
    category: "interviews",
    caption: "Bob Report Sets The Record Straight In New Interview",
  },
  {
    id: "g7",
    src: "https://img.youtube.com/vi/OttdiZ3-7kg/maxresdefault.jpg",
    alt: "DFW Shaka Verzuz Take",
    category: "interviews",
    caption: "Dfw Shaka Says No Limit Won Verzuz",
  },
  {
    id: "g8",
    src: "https://img.youtube.com/vi/dBgETb4hxJE/maxresdefault.jpg",
    alt: "3GMG Tamuno Addresses Twisted Black",
    category: "interviews",
    caption: "3GMG Tamuno Addresses Twisted Black",
  },
  // Street Reporting
  {
    id: "g9",
    src: "https://img.youtube.com/vi/q5IEpbLpvno/maxresdefault.jpg",
    alt: "DFW Shaka Exposes Club Promoters",
    category: "street",
    caption: "DFW Shaka Exposes Pandora Strip Club Promoters",
    featured: true,
  },
  {
    id: "g10",
    src: "https://img.youtube.com/vi/wc8NJuaDJQ4/maxresdefault.jpg",
    alt: "OG Percy Daughter",
    category: "street",
    caption: "OG Percy Daughter Addresses False Allegations",
  },
  {
    id: "g11",
    src: "https://img.youtube.com/vi/TOOJZ_fj5gk/maxresdefault.jpg",
    alt: "3GMG Tamuno Addresses OG Gumby",
    category: "street",
    caption: "3GMG Tamuno Addresses OG Gumby For Saying F*ck Fort Worth",
  },
  {
    id: "g12",
    src: "https://img.youtube.com/vi/onLVp8kDjSo/maxresdefault.jpg",
    alt: "34 Chan Fort Worth Story",
    category: "street",
    caption: "34 Chan Song Was Based Off Experience",
  },
  {
    id: "g13",
    src: "https://img.youtube.com/vi/Nq_5qoOoShI/maxresdefault.jpg",
    alt: "34 Chan Career",
    category: "street",
    caption: "34 Chan: 10 Year Rap Career, Born LA Raised Truman Street",
  },
  {
    id: "g14",
    src: "https://img.youtube.com/vi/bRe7UpELUu8/maxresdefault.jpg",
    alt: "Pink House Security",
    category: "street",
    caption: "Why Security Matters: Pink House Owner Is At Fault",
  },
  // Performances & Events
  {
    id: "g15",
    src: "https://img.youtube.com/vi/Mvb41IsSHEM/maxresdefault.jpg",
    alt: "Twisted Black Performance",
    category: "performances",
    caption: "Twisted Black Performing \"I'm A Fool Wit It\"",
    featured: true,
  },
  {
    id: "g16",
    src: "https://img.youtube.com/vi/tvi82gNf-jU/maxresdefault.jpg",
    alt: "Karma Lashay Performance",
    category: "performances",
    caption: "Karma Lashay Made It Rain During Her Performance",
  },
  {
    id: "g17",
    src: "https://img.youtube.com/vi/FOJej6g7kTg/maxresdefault.jpg",
    alt: "OC Chris Performance",
    category: "performances",
    caption: "OC Chris Performs \"Hey How Ya Doin\" at Save My City Tour",
  },
  {
    id: "g18",
    src: "https://img.youtube.com/vi/KNWlc484t-k/maxresdefault.jpg",
    alt: "JhonnieDamnD Performance",
    category: "performances",
    caption: "JhonnieDamnD and Bend University Took Over The Stage",
  },
  {
    id: "g19",
    src: "https://img.youtube.com/vi/CDgpAv9vmYU/maxresdefault.jpg",
    alt: "MykFresh",
    category: "performances",
    caption: "MykFresh Deserves His Flowers For The Rap Game",
  },
  // Behind the Scenes / Events
  {
    id: "g20",
    src: "https://img.youtube.com/vi/HgJznP2LATA/maxresdefault.jpg",
    alt: "Tamuno & HeadHuncho Amir",
    category: "behind-the-scenes",
    caption: "ThirdGate Tamuno Tappin In With HeadHuncho Amir",
  },
  {
    id: "g21",
    src: "https://img.youtube.com/vi/o9fF-4SYo00/maxresdefault.jpg",
    alt: "2 Chainz Fort Worth",
    category: "behind-the-scenes",
    caption: "2 Chainz Stops in Fort Worth To Promote His New Book",
    featured: true,
  },
  {
    id: "g22",
    src: "https://img.youtube.com/vi/FSjcJB0GjT0/maxresdefault.jpg",
    alt: "Two Legends",
    category: "behind-the-scenes",
    caption: "Two Legends From Different Eras — JazzieMac & DFW Shaka",
  },
  {
    id: "g23",
    src: "https://img.youtube.com/vi/q_GD__LSdXI/maxresdefault.jpg",
    alt: "HeadHuncho Amir Birthday Bash",
    category: "behind-the-scenes",
    caption: "Motivate The City Birthday Bash With HeadHuncho Amir",
  },
  {
    id: "g24",
    src: "https://img.youtube.com/vi/QeVyLrkqci4/maxresdefault.jpg",
    alt: "MO3 Fort Worth Love",
    category: "behind-the-scenes",
    caption: "MO3 Showed Love To Fort Worth",
  },
  {
    id: "g25",
    src: "https://img.youtube.com/vi/O1EAtgIcYec/maxresdefault.jpg",
    alt: "Gunna Meize at The MAXX",
    category: "behind-the-scenes",
    caption: "Gunna Meize Vibing at The MAXX Night Club",
  },
  {
    id: "g26",
    src: "https://img.youtube.com/vi/tJHxDgUgH5U/maxresdefault.jpg",
    alt: "OG Kunta & OG La Ron",
    category: "behind-the-scenes",
    caption: "OG Kunta & OG La Ron Link Up In Hoova Land",
  },
  {
    id: "g27",
    src: "https://img.youtube.com/vi/MkMACqMZ3jM/maxresdefault.jpg",
    alt: "Pressure P Boxing",
    category: "events",
    caption: "Underground Boxer Pressure P Explosive Knock Out",
  },
  {
    id: "g28",
    src: "https://img.youtube.com/vi/yx3Yvr5RLZU/maxresdefault.jpg",
    alt: "3GMG Tamuno Crazy Story",
    category: "behind-the-scenes",
    caption: "3GMG Tamuno Tells The Craziest Story",
  },
];

/* ─── Category config ─── */
const CATEGORIES: { key: GalleryCategory; label: string; icon: typeof Camera }[] = [
  { key: "all", label: "All", icon: Filter },
  { key: "interviews", label: "Interviews", icon: Mic },
  { key: "street", label: "Street", icon: Flame },
  { key: "performances", label: "Performances", icon: Music },
  { key: "behind-the-scenes", label: "Behind The Scenes", icon: Users },
];

/* ─── Nav links ─── */
const NAV_LINKS = [
  { label: "HOME", href: "/" },
  { label: "LIBRARY", href: "/library" },
  { label: "GALLERY", href: "/gallery" },
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
      { threshold: 0.08 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`transition-all duration-700 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      } ${className}`}
    >
      {children}
    </div>
  );
}

/* ─── Lightbox Component ─── */
function Lightbox({
  item,
  items,
  onClose,
  onNav,
}: {
  item: GalleryItem;
  items: GalleryItem[];
  onClose: () => void;
  onNav: (id: string) => void;
}) {
  const currentIdx = items.findIndex((i) => i.id === item.id);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIdx > 0) onNav(items[currentIdx - 1].id);
      if (e.key === "ArrowRight" && currentIdx < items.length - 1) onNav(items[currentIdx + 1].id);
    },
    [currentIdx, items, onClose, onNav]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [handleKeyDown]);

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 backdrop-blur-md flex items-center justify-center">
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
      >
        <X className="size-5" />
      </button>

      {/* Previous */}
      {currentIdx > 0 && (
        <button
          onClick={() => onNav(items[currentIdx - 1].id)}
          className="absolute left-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronLeft className="size-6" />
        </button>
      )}

      {/* Next */}
      {currentIdx < items.length - 1 && (
        <button
          onClick={() => onNav(items[currentIdx + 1].id)}
          className="absolute right-4 z-10 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
        >
          <ChevronRight className="size-6" />
        </button>
      )}

      {/* Image */}
      <div className="max-w-6xl max-h-[85vh] w-full mx-4 flex flex-col items-center">
        <img
          src={item.src}
          alt={item.alt}
          className="max-w-full max-h-[75vh] object-contain rounded-sm"
          onError={(e) => {
            const img = e.target as HTMLImageElement;
            if (img.src.includes("maxresdefault")) {
              img.src = img.src.replace("maxresdefault", "hqdefault");
            }
          }}
        />
        {item.caption && (
          <div className="mt-4 text-center">
            <p className="font-display text-xl text-[#f0ece4] tracking-wider">
              {item.caption.toUpperCase()}
            </p>
            <p className="text-[#888078] text-sm mt-1">
              {currentIdx + 1} / {items.length}
            </p>
          </div>
        )}
      </div>

      {/* Click outside to close */}
      <div className="absolute inset-0 -z-10" onClick={onClose} />
    </div>
  );
}

/* ═══════════════════════════════════════════════════
   GALLERY PAGE
   ═══════════════════════════════════════════════════ */
export function GalleryPage() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<GalleryCategory>("all");
  const [lightboxItem, setLightboxItem] = useState<GalleryItem | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const filteredItems =
    selectedCategory === "all"
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === selectedCategory);

  const categoryCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count:
      cat.key === "all"
        ? GALLERY_ITEMS.length
        : GALLERY_ITEMS.filter((item) => item.category === cat.key).length,
  }));

  // Masonry-style layout: distribute items across columns
  const getColumnItems = (colCount: number) => {
    const cols: GalleryItem[][] = Array.from({ length: colCount }, () => []);
    filteredItems.forEach((item, idx) => {
      cols[idx % colCount].push(item);
    });
    return cols;
  };

  return (
    <div id="main-content" className="min-h-screen text-[#f0ece4] overflow-x-hidden">
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
        <div className="absolute inset-0 bg-[#0a0a0a]/70" />
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
            <a href="/" className="flex items-center gap-3 group">
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
                    link.label === "GALLERY"
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
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
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
              Through The Lens
            </p>
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl text-[#f0ece4] tracking-wider mb-4">
              PHOTO
              <br />
              <span className="text-gold-gradient">GALLERY</span>
            </h1>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">
              Moments captured from the streets, the stage, and everything in between.
              The Hood's Paparazzi never misses a shot.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          GALLERY
          ═══════════════════════════════════════════════════ */}
      <section className="py-8 md:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Category Filters */}
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

          {/* Masonry Grid */}
          {filteredItems.length > 0 ? (
            <>
              {/* Desktop: 3 columns */}
              <div className="hidden lg:grid lg:grid-cols-3 gap-4">
                {getColumnItems(3).map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-4">
                    {col.map((item, idx) => (
                      <AnimatedSection key={item.id} delay={Math.min((colIdx * 0.05) + (idx * 0.08), 0.5)}>
                        <div
                          className="group relative rounded-sm overflow-hidden cursor-pointer bg-[#141414]/60 border border-[#D4A843]/5 hover:border-[#D4A843]/30 transition-all duration-500 backdrop-blur-sm"
                          onClick={() => setLightboxItem(item)}
                        >
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              if (img.src.includes("maxresdefault")) {
                                img.src = img.src.replace("maxresdefault", "hqdefault");
                              }
                            }}
                          />
                          {/* Hover overlay */}
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                            <div className="flex items-center justify-between">
                              <p className="font-display text-sm text-[#f0ece4] tracking-wider line-clamp-2 flex-1 mr-2">
                                {(item.caption || item.alt).toUpperCase()}
                              </p>
                              <Expand className="size-5 text-[#D4A843] shrink-0" />
                            </div>
                          </div>
                          {/* Featured badge */}
                          {item.featured && (
                            <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#D4A843] text-[#0a0a0a] text-[10px] font-bold tracking-widest rounded">
                              ★ FEATURED
                            </div>
                          )}
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                ))}
              </div>

              {/* Tablet: 2 columns */}
              <div className="hidden sm:grid sm:grid-cols-2 lg:hidden gap-4">
                {getColumnItems(2).map((col, colIdx) => (
                  <div key={colIdx} className="flex flex-col gap-4">
                    {col.map((item, idx) => (
                      <AnimatedSection key={item.id} delay={Math.min(idx * 0.06, 0.4)}>
                        <div
                          className="group relative rounded-sm overflow-hidden cursor-pointer bg-[#141414]/60 border border-[#D4A843]/5 hover:border-[#D4A843]/30 transition-all duration-500"
                          onClick={() => setLightboxItem(item)}
                        >
                          <img
                            src={item.src}
                            alt={item.alt}
                            className="w-full object-cover group-hover:scale-105 transition-transform duration-700"
                            loading="lazy"
                            onError={(e) => {
                              const img = e.target as HTMLImageElement;
                              if (img.src.includes("maxresdefault")) {
                                img.src = img.src.replace("maxresdefault", "hqdefault");
                              }
                            }}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-4">
                            <p className="font-display text-sm text-[#f0ece4] tracking-wider line-clamp-2">
                              {(item.caption || item.alt).toUpperCase()}
                            </p>
                          </div>
                          {item.featured && (
                            <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#D4A843] text-[#0a0a0a] text-[10px] font-bold tracking-widest rounded">
                              ★ FEATURED
                            </div>
                          )}
                        </div>
                      </AnimatedSection>
                    ))}
                  </div>
                ))}
              </div>

              {/* Mobile: single column */}
              <div className="sm:hidden flex flex-col gap-4">
                {filteredItems.map((item, idx) => (
                  <AnimatedSection key={item.id} delay={Math.min(idx * 0.06, 0.3)}>
                    <div
                      className="group relative rounded-sm overflow-hidden cursor-pointer bg-[#141414]/60 border border-[#D4A843]/5"
                      onClick={() => setLightboxItem(item)}
                    >
                      <img
                        src={item.src}
                        alt={item.alt}
                        className="w-full object-cover"
                        loading="lazy"
                        onError={(e) => {
                          const img = e.target as HTMLImageElement;
                          if (img.src.includes("maxresdefault")) {
                            img.src = img.src.replace("maxresdefault", "hqdefault");
                          }
                        }}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                        <p className="font-display text-sm text-[#f0ece4] tracking-wider line-clamp-2">
                          {(item.caption || item.alt).toUpperCase()}
                        </p>
                      </div>
                      {item.featured && (
                        <div className="absolute top-3 left-3 px-2 py-0.5 bg-[#D4A843] text-[#0a0a0a] text-[10px] font-bold tracking-widest rounded">
                          ★ FEATURED
                        </div>
                      )}
                    </div>
                  </AnimatedSection>
                ))}
              </div>
            </>
          ) : (
            <AnimatedSection className="text-center py-20">
              <div className="w-20 h-20 rounded-full bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center mx-auto mb-6">
                <Camera className="size-8 text-[#D4A843]/50" />
              </div>
              <h3 className="font-display text-2xl text-[#f0ece4] tracking-wider mb-2">
                COMING SOON
              </h3>
              <p className="text-[#888078] max-w-md mx-auto">
                More photos in this category are on the way.
              </p>
            </AnimatedSection>
          )}

          {/* Photo count */}
          <AnimatedSection className="text-center mt-12">
            <p className="text-[#888078] text-sm tracking-wider">
              {filteredItems.length} of {GALLERY_ITEMS.length} photos
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="relative border-t border-[#D4A843]/10 bg-[#0a0a0a]/90 backdrop-blur-sm mt-12">
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

      {/* ─── Lightbox ─── */}
      {lightboxItem && (
        <Lightbox
          item={lightboxItem}
          items={filteredItems}
          onClose={() => setLightboxItem(null)}
          onNav={(id) => setLightboxItem(filteredItems.find((i) => i.id === id) || null)}
        />
      )}

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
