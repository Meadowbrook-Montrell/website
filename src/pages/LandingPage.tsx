import { useState, useEffect, useRef } from "react";
import {
  Facebook,
  Instagram,
  Youtube,

  Video,

  ShoppingBag,
  MapPin,
  ChevronDown,
  ExternalLink,
  Play,
  Menu,
  X,
} from "lucide-react";

/* ─── tiny TikTok icon (lucide doesn't have one) ─── */
function TikTokIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V8.71a8.21 8.21 0 004.76 1.52V6.69h-1z" />
    </svg>
  );
}

/* ─── Intersection Observer hook for scroll animations ─── */
function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el); } },
      { threshold, rootMargin: "100px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ─── Animated section wrapper ─── */
function AnimatedSection({ children, className = "", delay = 0 }: {
  children: React.ReactNode; className?: string; delay?: number;
}) {
  const { ref, inView } = useInView();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: inView ? 1 : 0.0,
        transform: inView ? "translateY(0)" : "translateY(30px)",
        transition: `opacity 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s, transform 0.7s cubic-bezier(0.22, 1, 0.36, 1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   SOCIAL LINKS CONFIG
   ══════════════════════════════════════════════════════════ */
const SOCIALS = [
  { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/montrell.wilson.884042", followers: "40K" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/3gmgmeadowbrookmontrell/", followers: "" },
  { name: "TikTok", icon: TikTokIcon, url: "https://www.tiktok.com/@meadowbrookmontrellmedia", followers: "2.1K" },
  { name: "YouTube", icon: Youtube, url: "https://www.youtube.com/@Meadowbrookmontrell", followers: "" },
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Podcast", href: "#podcast" },
  { label: "Content", href: "#content" },
  { label: "Merch", href: "#merch" },
  { label: "Connect", href: "#connect" },
];

/* ══════════════════════════════════════════════════════════
   MERCH PLACEHOLDER DATA
   ══════════════════════════════════════════════════════════ */
const MERCH_ITEMS = [
  { name: "3GMG Classic Tee", price: "$35", tag: "BEST SELLER", color: "from-amber-900/40 to-stone-900/40" },
  { name: "Hood's Paparazzi Hoodie", price: "$55", tag: "NEW", color: "from-red-900/30 to-stone-900/40" },
  { name: "Meadowbrook Snapback", price: "$30", tag: "", color: "from-stone-800/40 to-stone-900/40" },
  { name: "Fort Worth Rep Tee", price: "$35", tag: "LIMITED", color: "from-yellow-900/30 to-stone-900/40" },
];

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] overflow-x-hidden">
      {/* ─── NAVIGATION ─── */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled
            ? "bg-[#0a0a0a]/95 backdrop-blur-md border-b border-[#D4A843]/10 shadow-lg shadow-black/20"
            : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <img
                src="/images/logo-3gmg.webp"
                alt="3GMG"
                className="h-10 md:h-12 w-auto"
              />
            </a>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium tracking-wider uppercase text-[#c8c0b0] hover:text-[#D4A843] transition-colors duration-300"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Social icons desktop */}
            <div className="hidden md:flex items-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888078] hover:text-[#D4A843] transition-colors duration-300"
                  title={s.name}
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden text-[#c8c0b0] hover:text-[#D4A843] transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-lg border-b border-[#D4A843]/10">
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-lg font-medium tracking-wider uppercase text-[#c8c0b0] hover:text-[#D4A843] transition-colors"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex gap-4 pt-4 border-t border-[#D4A843]/10">
                {SOCIALS.map((s) => (
                  <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#888078] hover:text-[#D4A843]">
                    <s.icon className="size-5" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image */}
        <div className="absolute inset-0">
          <img
            src="/images/hero-skyline.webp"
            alt="Fort Worth Skyline"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/70 via-[#0a0a0a]/50 to-[#0a0a0a]" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/60 via-transparent to-[#0a0a0a]/60" />
        </div>

        {/* Noise texture overlay */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        {/* Hero content */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          {/* Location tag */}
          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#D4A843]/20 bg-[#0a0a0a]/50 backdrop-blur-sm">
            <MapPin className="size-4 text-[#D4A843]" />
            <span className="text-sm font-medium tracking-widest uppercase text-[#D4A843]">
              Fort Worth, Texas
            </span>
          </div>

          {/* Main name */}
          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-4 tracking-wider">
            <span className="block text-[#f0ece4]">MEADOWBROOK</span>
            <span className="block text-gold-gradient">MONTRELL</span>
          </h1>

          {/* Tagline */}
          <div className="flex items-center justify-center gap-4 mb-8">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A843]/50" />
            <p className="text-lg sm:text-xl md:text-2xl font-medium tracking-[0.2em] uppercase text-[#c8c0b0]">
              The Hood's Paparazzi
            </p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A843]/50" />
          </div>

          {/* Roles */}
          <p className="text-sm md:text-base text-[#888078] tracking-widest uppercase mb-10">
            Content Creator &bull; Podcast Host &bull; Street Reporter &bull; Songwriter &bull; Father
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#podcast"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.3)]"
            >
              <Play className="size-4" />
              Listen to the Podcast
            </a>
            <a
              href="#content"
              className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#D4A843]/30 text-[#D4A843] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#D4A843]/10 hover:border-[#D4A843]/50 transition-all duration-300"
            >
              <Video className="size-4" />
              Watch Content
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#888078] animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="size-5" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT / MISSION SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="about" className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            {/* About photo */}
            <AnimatedSection>
              <div className="relative max-w-md mx-auto lg:mx-0 rounded-sm overflow-hidden">
                <img src="/images/montrell-about.webp" alt="Meadowbrook Montrell - 3GMG - The Hood's Paparazzi" className="w-full h-auto rounded-sm hover:scale-[1.02] transition-transform duration-700" />
                {/* Gold corner accents */}
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4A843]/40" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D4A843]/40" />
              </div>
            </AnimatedSection>

            {/* Bio text */}
            <AnimatedSection delay={0.2}>
              <div>
                <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">
                  The Mission
                </p>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#f0ece4] mb-6 tracking-wider">
                  STRAIGHT FROM<br />
                  <span className="text-gold-gradient">THE STREETS</span>
                </h2>
                <div className="space-y-4 text-[#c8c0b0] leading-relaxed">
                  <p>
                    Born and raised in the Meadowbrook neighborhood of Fort Worth, Texas,
                    Montrell has always been rooted in his community. Known as{" "}
                    <span className="text-[#D4A843] font-medium">"The Hood's Paparazzi,"</span>{" "}
                    he brings raw, unfiltered stories from the streets to the people —
                    no filter, no sugarcoating, just the truth.
                  </p>
                  <p>
                    As a father, content creator, songwriter, and podcast host,
                    Montrell wears many hats. But his mission is singular: give a voice
                    to the voiceless and shine a light on the stories that mainstream
                    media overlooks. From street interviews to community events,
                    he's always where the action is.
                  </p>
                  <p>
                    Through the{" "}
                    <span className="text-[#D4A843] font-medium">Make It Make Sense</span>{" "}
                    podcast, he breaks down real issues affecting real people — keeping it
                    100 while building bridges in the community.
                  </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 mt-10 pt-8 border-t border-[#D4A843]/10">
                  <div>
                    <p className="font-display text-3xl md:text-4xl text-[#D4A843] tracking-wider">40K+</p>
                    <p className="text-xs text-[#888078] tracking-widest uppercase mt-1">Followers</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl md:text-4xl text-[#D4A843] tracking-wider">FTW</p>
                    <p className="text-xs text-[#888078] tracking-widest uppercase mt-1">Fort Worth</p>
                  </div>
                  <div>
                    <p className="font-display text-3xl md:text-4xl text-[#D4A843] tracking-wider">24/7</p>
                    <p className="text-xs text-[#888078] tracking-widest uppercase mt-1">In The Streets</p>
                  </div>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Street divider */}
      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          PODCAST SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="podcast" className="relative py-24 md:py-32 overflow-hidden">
        {/* Background accent */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A843]/[0.02] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">
              The Podcast
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              MAKE IT<br />
              <span className="text-gold-gradient">MAKE SENSE</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">
              Real conversations about real issues. No script, no teleprompter —
              just raw, uncut dialogue about what's happening in our communities.
            </p>
          </AnimatedSection>

          {/* Featured Episode — embedded */}
          <AnimatedSection delay={0.2} className="max-w-4xl mx-auto mb-10">
            <div className="relative rounded-sm overflow-hidden glow-border bg-gradient-to-br from-[#1a1a1a] to-[#111]">
              <div className="aspect-video">
                <iframe src="https://www.youtube.com/embed/ufUQcipbtmw?rel=0" title="Yung Deco Speaks On More Albums Than Lil Flip" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
              </div>
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/30">★ LATEST EPISODE</span>
                  <span className="text-[#888078] text-xs">9:25</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-[#f0ece4] tracking-wider mb-2">YUNG DECO SPEAKS ON MORE ALBUMS THAN LIL FLIP, HATE IN HIS OWN CITY</h3>
                <p className="text-[#888078] text-sm leading-relaxed mb-4">Meadowbrook Montrell sits down with Yung Deco to talk discography, city politics, and the grind.</p>
                <div className="flex flex-wrap gap-3">
                  <a href="https://www.youtube.com/@Meadowbrookmontrell" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300"><Youtube className="size-4" /> YouTube</a>
                  <a href="https://www.facebook.com/montrell.wilson.884042" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D4A843]/30 text-[#D4A843] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#D4A843]/10 transition-all duration-300"><Facebook className="size-4" /> Facebook</a>
                  <a href="https://www.tiktok.com/@meadowbrookmontrellmedia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D4A843]/30 text-[#D4A843] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#D4A843]/10 transition-all duration-300"><TikTokIcon className="size-4" /> TikTok</a>
                </div>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#D4A843] via-[#E8C767] to-[#D4A843]" />
            </div>
          </AnimatedSection>

          {/* More Episodes */}
          <AnimatedSection delay={0.3} className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500">
                <div className="aspect-video">
                  <iframe src="https://www.youtube.com/embed/ETyWsOCWxtg?rel=0" title="Twisted Black Before Video Shoot With Shaq" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">INTERVIEW</span>
                  <h4 className="font-display text-sm text-[#f0ece4] tracking-wider mt-2 line-clamp-2">TWISTED BLACK CONNECTING WITH THE PEOPLE</h4>
                </div>
              </div>
              <div className="rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500">
                <div className="aspect-video">
                  <iframe src="https://www.youtube.com/embed/q5IEpbLpvno?rel=0" title="DFW Shaka Exposes Pandora Strip Club Promoters" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="p-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">STREET REPORTING</span>
                  <h4 className="font-display text-sm text-[#f0ece4] tracking-wider mt-2 line-clamp-2">DFW SHAKA EXPOSES PANDORA STRIP CLUB PROMOTERS</h4>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Street divider */}
      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          CONTENT SECTION (Interviews + Street Reporting)
          ═══════════════════════════════════════════════════ */}
      <section id="content" className="relative py-24 md:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">
              The Work
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              FROM THE<br />
              <span className="text-gold-gradient">STREETS</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">
              Street interviews, community coverage, and raw reporting from the heart
              of Fort Worth. Always on the scene, always keeping it real.
            </p>
          </AnimatedSection>

          {/* Content cards — real embedded videos */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Street Interviews */}
            <AnimatedSection delay={0.1}>
              <div className="group relative rounded-sm overflow-hidden glow-border bg-[#141414] hover:border-[#D4A843]/30 transition-all duration-500">
                <div className="aspect-video">
                  <iframe src="https://www.youtube.com/embed/0BbxgRKk_sU?rel=0" title="DFW Shaka & Fort Worth Legend McHenry" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">INTERVIEW</span>
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mt-2 mb-2">DFW SHAKA & FORT WORTH LEGEND MCHENRY</h3>
                  <p className="text-[#888078] text-sm leading-relaxed">Raw, unscripted conversations with people from all walks of life.</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Street Reporting */}
            <AnimatedSection delay={0.2}>
              <div className="group relative rounded-sm overflow-hidden glow-border bg-[#141414] hover:border-[#D4A843]/30 transition-all duration-500">
                <div className="aspect-video">
                  <iframe src="https://www.youtube.com/embed/of9vm8OHu0c?rel=0" title="3GMG TAMUNO On Booker T Block" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">STREET REPORTING</span>
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mt-2 mb-2">3GMG TAMUNO ON BOOKER T BLOCK</h3>
                  <p className="text-[#888078] text-sm leading-relaxed">From the block — community coverage the way it should be done.</p>
                </div>
              </div>
            </AnimatedSection>

            {/* Music */}
            <AnimatedSection delay={0.3}>
              <div className="group relative rounded-sm overflow-hidden glow-border bg-[#141414] hover:border-[#D4A843]/30 transition-all duration-500">
                <div className="aspect-video">
                  <iframe src="https://www.youtube.com/embed/Mvb41IsSHEM?rel=0" title="Twisted Black Performing I'm A Fool Wit It" className="w-full h-full" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen />
                </div>
                <div className="p-6">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-purple-500/20 text-purple-400 border border-purple-500/30">MUSIC & PERFORMANCE</span>
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mt-2 mb-2">TWISTED BLACK — "I'M A FOOL WIT IT"</h3>
                  <p className="text-[#888078] text-sm leading-relaxed">Original performances, live music, and creative content from the scene.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Street divider */}
      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          MERCH SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="merch" className="relative py-24 md:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A843]/[0.02] to-transparent" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Rep The Brand
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              OFFICIAL<br />
              <span className="text-gold-gradient">MERCH</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">
              Rep the 3GMG brand. Straight from the Meadowbrook, made for the streets.
              Wear it with pride — Fort Worth on your chest.
            </p>
          </AnimatedSection>

          {/* Merch grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MERCH_ITEMS.map((item, i) => (
              <AnimatedSection key={item.name} delay={i * 0.1}>
                <div className="group relative rounded-sm overflow-hidden glow-border bg-[#141414] hover:border-[#D4A843]/30 transition-all duration-500">
                  {/* Product image placeholder */}
                  <div className={`aspect-square bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                    {item.tag && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4A843] text-[#0a0a0a] text-[10px] font-bold tracking-widest uppercase rounded-sm">
                        {item.tag}
                      </div>
                    )}
                    <div className="text-center">
                      <ShoppingBag className="size-12 text-[#D4A843]/30 mx-auto mb-2 group-hover:scale-110 transition-transform duration-500" />
                      <p className="text-[#888078] text-xs tracking-widest uppercase">Coming Soon</p>
                    </div>
                  </div>

                  {/* Product info */}
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#f0ece4] mb-1">{item.name}</h3>
                    <p className="text-[#D4A843] font-display text-xl tracking-wider">{item.price}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          {/* Coming soon notice */}
          <AnimatedSection delay={0.5} className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-sm border border-[#D4A843]/20 bg-[#141414]">
              <div className="w-2 h-2 rounded-full bg-[#D4A843] animate-pulse" />
              <p className="text-[#c8c0b0] text-sm tracking-wider">
                Full merch store launching soon — stay tuned
              </p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Street divider */}
      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          CONNECT / SOCIAL LINKS SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="connect" className="relative py-24 md:py-32">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">
              Stay Connected
            </p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              TAP IN<br />
              <span className="text-gold-gradient">WITH ME</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-xl mx-auto text-lg leading-relaxed">
              Follow the movement across all platforms. Don't miss a single episode,
              interview, or drop.
            </p>
          </AnimatedSection>

          {/* Social link cards */}
          <div className="grid sm:grid-cols-2 gap-4">
            {SOCIALS.map((social, i) => (
              <AnimatedSection key={social.name} delay={i * 0.1}>
                <a
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center gap-5 p-6 rounded-sm glow-border bg-[#141414] hover:border-[#D4A843]/40 hover:bg-[#1a1a1a] transition-all duration-500"
                >
                  <div className="shrink-0 w-14 h-14 rounded-sm bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center group-hover:bg-[#D4A843]/20 transition-colors duration-500">
                    <social.icon className="size-6 text-[#D4A843]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#f0ece4] mb-0.5">{social.name}</h3>
                    {social.followers && (
                      <p className="text-[#888078] text-sm">{social.followers} followers</p>
                    )}
                    {!social.followers && (
                      <p className="text-[#888078] text-sm">Follow for updates</p>
                    )}
                  </div>
                  <ExternalLink className="size-5 text-[#888078] group-hover:text-[#D4A843] transition-colors shrink-0" />
                </a>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          FOOTER
          ═══════════════════════════════════════════════════ */}
      <footer className="relative border-t border-[#D4A843]/10 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            {/* Logo */}
            <div className="flex flex-col items-center md:items-start gap-3">
              <img src="/images/logo-3gmg.webp" alt="3GMG" className="h-10 w-auto" />
              <div className="flex items-center gap-2 text-[#888078] text-sm">
                <MapPin className="size-3.5" />
                <span>Fort Worth, Texas</span>
              </div>
            </div>

            {/* Nav links */}
            <div className="flex flex-wrap justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm text-[#888078] hover:text-[#D4A843] transition-colors tracking-wider uppercase"
                >
                  {link.label}
                </a>
              ))}
            </div>

            {/* Socials */}
            <div className="flex items-center gap-4">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#888078] hover:text-[#D4A843] transition-colors"
                >
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-[#D4A843]/5 text-center">
            <p className="text-[#888078]/60 text-xs tracking-wider">
              &copy; {new Date().getFullYear()} 3GMG Meadowbrook Montrell. All Rights Reserved.
              <span className="mx-2">&bull;</span>
              Fort Worth, TX
              <span className="mx-2">&bull;</span>
              The Hood's Paparazzi
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
