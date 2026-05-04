import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SmartYouTubeEmbed } from "../components/SmartYouTubeEmbed";
import BreakingAlertBanner from "../components/BreakingAlertBanner";
import { ThemeToggle } from "../components/ThemeToggle";
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
  Volume2,
  VolumeX,
  Mail,
  Bell,
  ChevronLeft,
  ChevronRight,
  Quote,
  Search,
  MessageSquare,
  Heart,
  TrendingUp,
  Flame,
} from "lucide-react";

/* ─── tiny TikTok icon (lucide doesn't have one) ─── */
import { TikTokIcon } from "../components/icons/TikTokIcon";

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

/* ─── Animated Counter ─── */
function AnimatedCounter({ end, suffix = "", duration = 2000 }: {
  end: number; suffix?: string; duration?: number;
}) {
  const [count, setCount] = useState(0);
  const { ref, inView } = useInView(0.3);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!inView || hasAnimated.current) return;
    hasAnimated.current = true;
    const startTime = Date.now();
    const step = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [inView, end, duration]);

  return <span ref={ref as any}>{count.toLocaleString()}{suffix}</span>;
}

/* ══════════════════════════════════════════════════════════
   CONSTANTS & CONFIG
   ══════════════════════════════════════════════════════════ */
const SOCIALS = [
  { name: "Facebook", icon: Facebook, url: "https://www.facebook.com/montrell.wilson.884042", followers: "40K" },
  { name: "Instagram", icon: Instagram, url: "https://www.instagram.com/3gmgmeadowbrookmontrell/", followers: "" },
  { name: "TikTok", icon: TikTokIcon, url: "https://www.tiktok.com/@meadowbrookmontrellmedia", followers: "2.1K" },
  { name: "YouTube", icon: Youtube, url: "https://www.youtube.com/@Meadowbrookmontrell", followers: "" },
];

const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Podcast", href: "/podcast" },
  { label: "Library", href: "/library" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blog", href: "/blog" },
  { label: "Events", href: "/events" },
  { label: "Community", href: "/community" },
  { label: "Q&A", href: "/qa" },
  { label: "Shop", href: "/shop" },
  { label: "Book", href: "/booking" },
  { label: "Connect", href: "#connect" },
];

const MERCH_ITEMS = [
  { name: "3GMG Classic Tee", price: "$35", tag: "BEST SELLER", color: "from-amber-900/40 to-stone-900/40" },
  { name: "Hood's Paparazzi Hoodie", price: "$55", tag: "NEW", color: "from-red-900/30 to-stone-900/40" },
  { name: "Meadowbrook Snapback", price: "$30", tag: "", color: "from-stone-800/40 to-stone-900/40" },
  { name: "Fort Worth Rep Tee", price: "$35", tag: "LIMITED", color: "from-yellow-900/30 to-stone-900/40" },
];

const TICKER_DEFAULTS = [
  "🔥 NEW EPISODE DROPPING THIS WEEK",
  "🎤 DFW SHAKA INTERVIEW NOW LIVE ON YOUTUBE",
  "👕 3GMG MERCH COMING SOON — STAY TUNED",
  "📍 STRAIGHT FROM FORT WORTH, TEXAS",
  "🎙️ MAKE IT MAKE SENSE PODCAST",
  "📸 THE HOOD'S PAPARAZZI — ALWAYS IN THE STREETS",
];

const GUEST_DEFAULTS = [
  { name: "Yung Deco", title: "Rapper / Artist", quote: "More albums than Lil Flip — the grind don't stop.", youtubeId: "ufUQcipbtmw" },
  { name: "Twisted Black", title: "Rapper / Entertainer", quote: "Connecting with the people is what it's all about.", youtubeId: "ETyWsOCWxtg" },
  { name: "DFW Shaka", title: "Community Voice", quote: "Somebody gotta expose the truth — that's what we do.", youtubeId: "q5IEpbLpvno" },
  { name: "Fort Worth Legend McHenry", title: "OG / Legend", quote: "The streets remember everything.", youtubeId: "0BbxgRKk_sU" },
];

/* Short clips from YouTube — real content */
const SOCIAL_FEED_VIDEOS = [
  { id: "of9vm8OHu0c", title: "3GMG TAMUNO On Booker T Block", platform: "YouTube" },
  { id: "o9fF-4SYo00", title: "2 Chainz Stops in Fort Worth", platform: "YouTube" },
  { id: "HgJznP2LATA", title: "ThirdGate Tamuno Tappin In With HeadHuncho Amir", platform: "YouTube" },
  { id: "Mvb41IsSHEM", title: "Twisted Black — \"I'm A Fool Wit It\"", platform: "YouTube" },
  { id: "FSjcJB0GjT0", title: "Two Legends From Different Era", platform: "YouTube" },
  { id: "QeVyLrkqci4", title: "MO3 Showed Love to Fort Worth", platform: "YouTube" },
  { id: "pVGl7kCNSnI", title: "Taco Bell Employee Opens Fire", platform: "YouTube" },
  { id: "G__yVg07kSg", title: "TERRIBLE Experience Meeting Beyoncé's Mother", platform: "YouTube" },
  { id: "K41_4LTlzww", title: "LIFE SENTENCE For A Crime You Didn't Do?", platform: "YouTube" },
];

/* ══════════════════════════════════════════════════════════
   SCROLLING NEWS TICKER (Feature 6)
   ══════════════════════════════════════════════════════════ */
function NewsTicker() {
  const liveItems = useQuery(api.admin.getActiveTickerItems);
  // Use live Convex data if available, fall back to defaults
  const items = liveItems && liveItems.length > 0
    ? liveItems.map((t) => t.text)
    : TICKER_DEFAULTS;
  const doubled = [...items, ...items];

  return (
    <div className="fixed top-16 md:top-20 left-0 right-0 z-40 bg-[#0a0a0a]/95 border-b border-[#D4A843]/20 overflow-hidden backdrop-blur-sm">
      <div className="flex animate-ticker whitespace-nowrap py-2">
        {doubled.map((text, i) => (
          <span key={i} className="inline-flex items-center mx-8 text-xs sm:text-sm font-medium tracking-wider uppercase">
            <span className="text-[#D4A843]">{text}</span>
            <span className="mx-8 text-[#D4A843]/30">◆</span>
          </span>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   LIVE COUNTDOWN TIMER (Feature 2)
   ══════════════════════════════════════════════════════════ */
function LiveCountdown() {
  // Pull real upcoming sessions from Convex
  const upcomingSessions = useQuery(api.contentLib.getUpcomingLiveSessions);
  const currentLive = useQuery(api.contentLib.getCurrentLiveSession);

  // Fallback: next Friday at 8 PM CST if no sessions scheduled
  const getNextFriday = useCallback(() => {
    const now = new Date();
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7));
    nextFriday.setHours(20, 0, 0, 0);
    if (nextFriday <= now) nextFriday.setDate(nextFriday.getDate() + 7);
    return nextFriday;
  }, []);

  const nextSession = upcomingSessions?.[0];
  // Memoize target so a new Date object isn't created every render
  // (which would retrigger the useEffect infinitely → React error #185)
  const scheduledAt = nextSession?.scheduledAt;
  const targetMs = useMemo(() => {
    if (scheduledAt) return new Date(scheduledAt).getTime();
    const now = new Date();
    const nextFriday = new Date(now);
    nextFriday.setDate(now.getDate() + ((5 - now.getDay() + 7) % 7 || 7));
    nextFriday.setHours(20, 0, 0, 0);
    if (nextFriday <= now) nextFriday.setDate(nextFriday.getDate() + 7);
    return nextFriday.getTime();
  }, [scheduledAt]);
  const [timeLeft, setTimeLeft] = useState({ d: 0, h: 0, m: 0, s: 0 });

  useEffect(() => {
    const tick = () => {
      const diff = Math.max(0, targetMs - Date.now());
      setTimeLeft({
        d: Math.floor(diff / 86400000),
        h: Math.floor((diff % 86400000) / 3600000),
        m: Math.floor((diff % 3600000) / 60000),
        s: Math.floor((diff % 60000) / 1000),
      });
    };
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [targetMs]);

  // If currently live, show a GO LIVE button instead of countdown
  if (currentLive) {
    return (
      <a
        href={currentLive.streamUrl || "#"}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-3 px-6 py-3 rounded-sm bg-red-600/90 border border-red-500 backdrop-blur-sm hover:bg-red-500 transition-all duration-300 shadow-[0_0_20px_rgba(239,68,68,0.4)] animate-pulse"
      >
        <div className="w-3 h-3 rounded-full bg-white animate-ping" />
        <span className="text-white text-sm font-bold tracking-widest uppercase">🔴 LIVE NOW — {currentLive.title || "JOIN STREAM"}</span>
      </a>
    );
  }

  return (
    <div className="inline-flex items-center gap-3 px-5 py-2.5 rounded-sm bg-[#0a0a0a]/80 border border-red-500/30 backdrop-blur-sm">
      <div className="flex items-center gap-1.5">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
        <span className="text-red-400 text-xs font-bold tracking-widest uppercase">
          {nextSession ? "NEXT LIVE" : "NEXT LIVE"}
        </span>
      </div>
      <div className="flex items-center gap-1 font-display text-xl tracking-wider text-[#f0ece4]">
        <span className="bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#D4A843]/10">{String(timeLeft.d).padStart(2, "0")}</span>
        <span className="text-[#D4A843]">:</span>
        <span className="bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#D4A843]/10">{String(timeLeft.h).padStart(2, "0")}</span>
        <span className="text-[#D4A843]">:</span>
        <span className="bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#D4A843]/10">{String(timeLeft.m).padStart(2, "0")}</span>
        <span className="text-[#D4A843]">:</span>
        <span className="bg-[#1a1a1a] px-2 py-0.5 rounded border border-[#D4A843]/10">{String(timeLeft.s).padStart(2, "0")}</span>
      </div>
      {nextSession?.guestName && (
        <span className="text-[#D4A843] text-xs font-medium tracking-wider ml-1 hidden sm:inline">
          w/ {nextSession.guestName}
        </span>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FLOATING AUDIO PLAYER (Feature 4)
   ══════════════════════════════════════════════════════════ */
function FloatingAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [minimized, setMinimized] = useState(true);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {!minimized ? (
        <div className="bg-[#141414]/95 backdrop-blur-lg border border-[#D4A843]/20 rounded-sm p-4 shadow-[0_0_30px_rgba(0,0,0,0.5)] w-72">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[10px] font-bold tracking-widest uppercase text-[#D4A843]">NOW PLAYING</span>
            <button onClick={() => setMinimized(true)} className="text-[#888078] hover:text-[#D4A843] transition-colors">
              <ChevronDown className="size-4" />
            </button>
          </div>
          <p className="text-xs text-[#f0ece4] font-medium mb-1 line-clamp-1">Yung Deco Interview</p>
          <p className="text-[10px] text-[#888078] mb-3">Make It Make Sense Podcast</p>
          {/* Waveform visualization */}
          <div className="flex items-end gap-[3px] h-8 mb-3">
            {Array.from({ length: 24 }).map((_, i) => (
              <div
                key={i}
                className={`flex-1 rounded-full transition-all duration-300 ${isPlaying ? "bg-[#D4A843]" : "bg-[#D4A843]/30"}`}
                style={{
                  height: isPlaying
                    ? `${20 + Math.sin(i * 0.8 + Date.now() * 0.003) * 60}%`
                    : `${20 + Math.sin(i * 0.5) * 15}%`,
                  animation: isPlaying ? `waveform ${0.4 + i * 0.05}s ease-in-out infinite alternate` : "none",
                }}
              />
            ))}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-[#888078]">0:00 / 0:30</span>
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="w-10 h-10 rounded-full bg-[#D4A843] text-[#0a0a0a] flex items-center justify-center hover:bg-[#E8C767] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,168,67,0.3)]"
            >
              {isPlaying ? <Volume2 className="size-4" /> : <VolumeX className="size-4" />}
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setMinimized(false)}
          className="group w-14 h-14 rounded-full bg-[#D4A843] text-[#0a0a0a] flex items-center justify-center shadow-[0_0_25px_rgba(212,168,67,0.3)] hover:shadow-[0_0_35px_rgba(212,168,67,0.5)] hover:scale-110 transition-all duration-300"
        >
          <Volume2 className="size-6 group-hover:scale-110 transition-transform" />
          {/* Pulse rings */}
          <div className="absolute inset-0 rounded-full border-2 border-[#D4A843]/40 animate-ping" />
        </button>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   GUEST SPOTLIGHT CAROUSEL (Feature 7)
   ══════════════════════════════════════════════════════════ */
function GuestCarousel() {
  const [current, setCurrent] = useState(0);
  const guests = GUEST_DEFAULTS;

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((c) => (c + 1) % guests.length);
    }, 5000);
    return () => clearInterval(id);
  }, [guests.length]);

  const prev = () => setCurrent((c) => (c - 1 + guests.length) % guests.length);
  const next = () => setCurrent((c) => (c + 1) % guests.length);
  const guest = guests[current];

  return (
    <div className="relative max-w-3xl mx-auto">
      <div className="bg-[#141414]/80 border border-[#D4A843]/15 rounded-sm p-8 md:p-12 text-center overflow-hidden relative">
        {/* Decorative quote marks */}
        <Quote className="absolute top-4 left-4 size-12 text-[#D4A843]/10 rotate-180" />
        <Quote className="absolute bottom-4 right-4 size-12 text-[#D4A843]/10" />

        <div className="relative z-10">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#D4A843] to-[#B8922E] mx-auto mb-4 flex items-center justify-center text-[#0a0a0a] font-display text-2xl">
            {guest.name.charAt(0)}
          </div>
          <p className="text-lg md:text-xl text-[#c8c0b0] italic mb-6 leading-relaxed max-w-xl mx-auto">
            "{guest.quote}"
          </p>
          <h4 className="font-display text-xl text-[#D4A843] tracking-wider">{guest.name}</h4>
          <p className="text-[#888078] text-sm mt-1">{guest.title}</p>

          {/* Dots */}
          <div className="flex items-center justify-center gap-2 mt-6">
            {guests.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${i === current ? "bg-[#D4A843] w-6" : "bg-[#D4A843]/30 hover:bg-[#D4A843]/50"}`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Nav arrows */}
      <button onClick={prev} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0a0a0a]/80 border border-[#D4A843]/20 flex items-center justify-center text-[#D4A843] hover:bg-[#D4A843]/10 transition-all">
        <ChevronLeft className="size-5" />
      </button>
      <button onClick={next} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-[#0a0a0a]/80 border border-[#D4A843]/20 flex items-center justify-center text-[#D4A843] hover:bg-[#D4A843]/10 transition-all">
        <ChevronRight className="size-5" />
      </button>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   EMAIL SIGNUP (Feature 9)
   ══════════════════════════════════════════════════════════ */
function EmailSignup() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const addSubscriber = useMutation(api.admin.addSubscriber);
  const sendWelcome = useAction(api.emailService.sendSubscriberWelcome);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    try {
      await addSubscriber({ email, source: "hero" });
      // F1: Send welcome email (fire-and-forget)
      sendWelcome({ email }).catch(() => {});
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setEmail("");
    } catch (err) {
      console.error("Failed to subscribe:", err);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      {submitted ? (
        <div className="text-center py-4 px-6 rounded-sm border border-green-500/30 bg-green-500/10">
          <Bell className="size-6 text-green-400 mx-auto mb-2" />
          <p className="text-green-400 font-bold text-sm tracking-wider">YOU'RE IN! WE'LL NOTIFY YOU WHEN WE GO LIVE 🔥</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <div className="flex-1 relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#888078]" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email..."
              className="w-full pl-11 pr-4 py-3.5 bg-[#141414] border border-[#D4A843]/20 rounded-sm text-[#f0ece4] text-sm placeholder:text-[#888078]/60 focus:border-[#D4A843]/50 focus:outline-none focus:ring-1 focus:ring-[#D4A843]/30 transition-all"
              required
            />
          </div>
          <button
            type="submit"
            className="px-8 py-3.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,168,67,0.3)] whitespace-nowrap"
          >
            GET NOTIFIED
          </button>
        </form>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════════
   FAN SUBMISSION FORM
   ══════════════════════════════════════════════════════════ */
function FanSubmissionForm() {
  const [form, setForm] = useState({ name: "", email: "", type: "shoutout", message: "" });
  const [submitted, setSubmitted] = useState(false);
  const submitFan = useMutation(api.consumer.submitFanMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.message) return;
    try {
      await submitFan({
        name: form.name,
        email: form.email || undefined,
        type: form.type,
        message: form.message,
      });
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 5000);
      setForm({ name: "", email: "", type: "shoutout", message: "" });
    } catch (err) {
      console.error("Failed to submit:", err);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-8 px-6 rounded-sm border border-green-500/30 bg-green-500/10">
        <Heart className="size-8 text-green-400 mx-auto mb-3" />
        <p className="text-green-400 font-bold text-sm tracking-wider mb-1">MESSAGE SENT! 🔥</p>
        <p className="text-[#888078] text-xs">If it's real, it gets featured. Stay tuned.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg mx-auto">
      <div className="grid grid-cols-2 gap-3">
        <input placeholder="Your name *" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="bg-[#141414] border border-[#D4A843]/20 rounded-sm px-4 py-3 text-sm text-[#f0ece4] placeholder:text-[#888078]/60 focus:border-[#D4A843]/50 focus:outline-none" required />
        <input placeholder="Email (optional)" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="bg-[#141414] border border-[#D4A843]/20 rounded-sm px-4 py-3 text-sm text-[#f0ece4] placeholder:text-[#888078]/60 focus:border-[#D4A843]/50 focus:outline-none" />
      </div>
      <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
        className="w-full bg-[#141414] border border-[#D4A843]/20 rounded-sm px-4 py-3 text-sm text-[#f0ece4] focus:border-[#D4A843]/50 focus:outline-none">
        <option value="shoutout">🔥 Shoutout</option>
        <option value="question">❓ Question for Montrell</option>
        <option value="story-tip">📰 Story Tip</option>
        <option value="topic-request">🎙️ Topic Request</option>
        <option value="feedback">💬 Feedback</option>
      </select>
      <textarea placeholder="Drop your message..." rows={3} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })}
        className="w-full bg-[#141414] border border-[#D4A843]/20 rounded-sm px-4 py-3 text-sm text-[#f0ece4] placeholder:text-[#888078]/60 focus:border-[#D4A843]/50 focus:outline-none resize-none" required />
      <button type="submit" className="w-full py-3.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300 hover:shadow-[0_0_20px_rgba(212,168,67,0.3)]">
        <MessageSquare className="size-4 inline mr-2" /> SUBMIT
      </button>
    </form>
  );
}

/* ══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ══════════════════════════════════════════════════════════ */
export function GraffitiLandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [logoAnimated, setLogoAnimated] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Feature 5: Graffiti spray animation on load
  useEffect(() => {
    const timer = setTimeout(() => setLogoAnimated(true), 300);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div id="main-content" className="min-h-screen text-[#f0ece4] overflow-x-hidden landing-crosshair">
      {/* Breaking News Alert Banner */}
      <BreakingAlertBanner />
      {/* Feature 8: Custom cursor CSS via style tag */}
      <style>{`
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-ticker { animation: ticker 40s linear infinite; }
        @keyframes sprayIn {
          0% { clip-path: circle(0% at 50% 50%); opacity: 0; filter: blur(20px); }
          50% { clip-path: circle(35% at 50% 50%); opacity: 0.7; filter: blur(5px); }
          100% { clip-path: circle(100% at 50% 50%); opacity: 1; filter: blur(0px); }
        }
        .spray-in { animation: sprayIn 1.5s cubic-bezier(0.22, 1, 0.36, 1) forwards; }
        @keyframes waveform {
          0% { height: 15%; }
          100% { height: 85%; }
        }
        @keyframes countUp { 0% { opacity: 0; transform: translateY(10px); } 100% { opacity: 1; transform: translateY(0); } }
        .stat-glow { text-shadow: 0 0 30px rgba(212, 168, 67, 0.4); }
        /* Custom cursor */
        .landing-crosshair { cursor: crosshair; }
        .landing-crosshair a, .landing-crosshair button, .landing-crosshair input, .landing-crosshair select, .landing-crosshair textarea { cursor: pointer; }
        a, button, [role="button"], input, select, textarea { cursor: pointer !important; }
        /* Video hero shimmer */
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
      `}</style>

      {/* Fixed full-page background: Fort Worth Stock Yards */}
      <div className="fixed inset-0 -z-10" style={{
        backgroundImage: `url('/images/hero-graffiti.webp')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}>
        <div className="absolute inset-0 bg-[#0a0a0a]/40" />
      </div>

      {/* Hero Background — static image (video removed until a real URL is provided) */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute inset-0" style={{
          backgroundImage: `url('/images/hero-graffiti.webp')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }} />
        <div className="absolute inset-0 bg-[#0a0a0a]/40" />
      </div>

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
            <a href="#" className="flex items-center gap-2 group">
              <span className="font-display text-lg md:text-xl tracking-[0.2em] text-[#D4A843] group-hover:text-[#E8C767] transition-colors">3RD GATE</span>
            </a>
            <div className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-sm font-medium tracking-wider uppercase text-[#c8c0b0] hover:text-[#D4A843] transition-colors duration-300">
                  {link.label}
                </a>
              ))}

            </div>
            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              <a href="/search" className="text-[#888078] hover:text-[#D4A843] transition-colors duration-300" title="Search">
                <Search className="size-5" />
              </a>
              <div className="w-px h-4 bg-[#D4A843]/20" />
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#888078] hover:text-[#D4A843] transition-colors duration-300" title={s.name}>
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
            <button className="md:hidden text-[#c8c0b0] hover:text-[#D4A843] transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#0a0a0a]/98 backdrop-blur-lg border-b border-[#D4A843]/10">
            <div className="px-4 py-6 space-y-4">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} onClick={() => setMobileMenuOpen(false)} className="block text-lg font-medium tracking-wider uppercase text-[#c8c0b0] hover:text-[#D4A843] transition-colors">
                  {link.label}
                </a>
              ))}

              <div className="flex items-center gap-4 pt-4 border-t border-[#D4A843]/10">
                <ThemeToggle />
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

      {/* Feature 6: Scrolling News Ticker */}
      <NewsTicker />

      {/* ═══════════════════════════════════════════════════
          HERO SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a0a0a]/70" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a]/30 via-transparent to-[#0a0a0a]/30" />
        </div>
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto mt-12">
          {/* Feature 5: Graffiti Spray Animation */}
          <div className={logoAnimated ? "spray-in" : "opacity-0"}>
            <img
              src="/images/logo-3gmg-graffiti.png"
              alt="3GMG Graffiti"
              className="w-64 sm:w-80 md:w-96 mx-auto mb-6 drop-shadow-[0_0_20px_rgba(212,168,67,0.5)]"
            />
          </div>

          <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full border border-[#D4A843]/30 bg-[#0a0a0a]/60 backdrop-blur-sm shadow-[0_0_15px_rgba(212,168,67,0.15)]">
            <MapPin className="size-4 text-[#D4A843]" />
            <span className="text-sm font-medium tracking-widest uppercase text-[#D4A843]">Fort Worth, Texas</span>
          </div>

          <h1 className="font-display text-6xl sm:text-7xl md:text-8xl lg:text-9xl leading-[0.9] mb-4 tracking-wider drop-shadow-[0_0_30px_rgba(212,168,67,0.3)]">
            <span className="block text-[#f0ece4]" style={{ textShadow: "0 0 40px rgba(212,168,67,0.2)" }}>MEADOWBROOK</span>
            <span className="block text-gold-gradient" style={{ textShadow: "0 0 60px rgba(212,168,67,0.4)" }}>MONTRELL</span>
          </h1>

          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px w-12 bg-gradient-to-r from-transparent to-[#D4A843]/50" />
            <p className="text-lg sm:text-xl md:text-2xl font-medium tracking-[0.2em] uppercase text-[#c8c0b0]">The Hood's Paparazzi</p>
            <div className="h-px w-12 bg-gradient-to-l from-transparent to-[#D4A843]/50" />
          </div>

          <p className="text-sm md:text-base text-[#888078] tracking-widest uppercase mb-8">
            Content Creator &bull; Podcast Host &bull; Street Reporter &bull; Songwriter &bull; Father
          </p>

          {/* Feature 2: Live Countdown Timer */}
          <div className="mb-10">
            <LiveCountdown />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#podcast" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300 hover:shadow-[0_0_30px_rgba(212,168,67,0.3)]">
              <Play className="size-4" /> Listen to the Podcast
            </a>
            <a href="#content" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#D4A843]/30 text-[#D4A843] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#D4A843]/10 hover:border-[#D4A843]/50 transition-all duration-300">
              <Video className="size-4" /> Watch Content
            </a>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-[#888078] animate-bounce">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <ChevronDown className="size-5" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ANIMATED STATS BAR (Feature 3)
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-8 bg-[#0a0a0a]/95 border-y border-[#D4A843]/10">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="font-display text-4xl md:text-5xl text-[#D4A843] tracking-wider stat-glow">
                <AnimatedCounter end={40} suffix="K+" />
              </p>
              <p className="text-xs text-[#888078] tracking-widest uppercase mt-2">Followers</p>
            </div>
            <div>
              <p className="font-display text-4xl md:text-5xl text-[#D4A843] tracking-wider stat-glow">
                <AnimatedCounter end={40} suffix="+" />
              </p>
              <p className="text-xs text-[#888078] tracking-widest uppercase mt-2">Videos</p>
            </div>
            <div>
              <p className="font-display text-4xl md:text-5xl text-[#D4A843] tracking-wider stat-glow">
                <AnimatedCounter end={100} suffix="+" />
              </p>
              <p className="text-xs text-[#888078] tracking-widest uppercase mt-2">Interviews</p>
            </div>
            <div>
              <p className="font-display text-4xl md:text-5xl text-[#D4A843] tracking-wider stat-glow">
                <AnimatedCounter end={817} />
              </p>
              <p className="text-xs text-[#888078] tracking-widest uppercase mt-2">Fort Worth, TX</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════
          ABOUT / MISSION SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="about" className="relative py-24 md:py-32 bg-[#0a0a0a]/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <AnimatedSection>
              <div className="relative max-w-md mx-auto lg:mx-0 flex items-center justify-center rounded-sm overflow-hidden">
                <img src="/images/montrell-about.webp" alt="Meadowbrook Montrell - 3GMG - The Hood's Paparazzi" className="w-full h-auto rounded-sm hover:scale-[1.02] transition-transform duration-700" />
                <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-[#D4A843]/40" />
                <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-[#D4A843]/40" />
              </div>
            </AnimatedSection>
            <AnimatedSection delay={0.2}>
              <div>
                <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">The Mission</p>
                <h2 className="font-display text-4xl sm:text-5xl md:text-6xl text-[#f0ece4] mb-6 tracking-wider">
                  STRAIGHT FROM<br /><span className="text-gold-gradient">THE STREETS</span>
                </h2>
                <div className="space-y-4 text-[#c8c0b0] leading-relaxed">
                  <p>Born and raised in the Meadowbrook neighborhood of Fort Worth, Texas, Montrell has always been rooted in his community. Known as <span className="text-[#D4A843] font-medium">"The Hood's Paparazzi,"</span> he brings raw, unfiltered stories from the streets to the people — no filter, no sugarcoating, just the truth.</p>
                  <p>As a father, content creator, songwriter, and podcast host, Montrell wears many hats. But his mission is singular: give a voice to the voiceless and shine a light on the stories that mainstream media overlooks.</p>
                  <p>Through the <span className="text-[#D4A843] font-medium">Make It Make Sense</span> podcast, he breaks down real issues affecting real people — keeping it 100 while building bridges in the community.</p>
                </div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          PODCAST SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="podcast" className="relative py-24 md:py-32 overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A843]/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">The Podcast</p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              MAKE IT<br /><span className="text-gold-gradient">MAKE SENSE</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">Real conversations about real issues. No script, no teleprompter — just raw, uncut dialogue.</p>
          </AnimatedSection>

          {/* Featured Episode */}
          <AnimatedSection delay={0.2} className="max-w-4xl mx-auto mb-12">
            <div className="relative rounded-sm overflow-hidden glow-border bg-gradient-to-br from-[#1a1a1a] to-[#111]">
              <SmartYouTubeEmbed videoId="ufUQcipbtmw" title="Yung Deco Speaks On More Albums Than Lil Flip" />
              <div className="p-6 md:p-8">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-[#D4A843]/20 text-[#D4A843] border border-[#D4A843]/30">★ LATEST EPISODE</span>
                  <span className="text-[#888078] text-xs">9:25</span>
                </div>
                <h3 className="font-display text-xl md:text-2xl text-[#f0ece4] tracking-wider mb-2">YUNG DECO SPEAKS ON MORE ALBUMS THAN LIL FLIP, HATE IN HIS OWN CITY</h3>
                <p className="text-[#888078] text-sm leading-relaxed">Meadowbrook Montrell sits down with Yung Deco to talk discography, city politics, and the grind.</p>
              </div>
              <div className="h-1 bg-gradient-to-r from-[#D4A843] via-[#E8C767] to-[#D4A843]" />
            </div>
          </AnimatedSection>

          {/* More Episodes */}
          <AnimatedSection delay={0.3} className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-6 mb-8">
              <div className="rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500">
                <SmartYouTubeEmbed videoId="ETyWsOCWxtg" title="Twisted Black Before Video Shoot With Shaq" />
                <div className="p-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">INTERVIEW</span>
                  <h4 className="font-display text-sm text-[#f0ece4] tracking-wider mt-2 line-clamp-2">TWISTED BLACK CONNECTING WITH THE PEOPLE BEFORE HIS VIDEO SHOOT WITH SHAQ</h4>
                </div>
              </div>
              <div className="rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500">
                <SmartYouTubeEmbed videoId="q5IEpbLpvno" title="DFW Shaka Exposes Pandora Strip Club Promoters" />
                <div className="p-4">
                  <span className="text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded bg-amber-500/20 text-amber-400 border border-amber-500/30">STREET REPORTING</span>
                  <h4 className="font-display text-sm text-[#f0ece4] tracking-wider mt-2 line-clamp-2">DFW SHAKA EXPOSES PANDORA STRIP CLUB PROMOTERS</h4>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href="/library" className="inline-flex items-center gap-2 px-6 py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300">VIEW FULL LIBRARY</a>
              <a href="https://www.youtube.com/@Meadowbrookmontrell" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-[#D4A843]/30 text-[#D4A843] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#D4A843]/10 transition-all duration-300">
                <Youtube className="size-4" /> YouTube
              </a>
              <a href="https://www.facebook.com/montrell.wilson.884042" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-[#D4A843]/30 text-[#D4A843] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#D4A843]/10 transition-all duration-300">
                <Facebook className="size-4" /> Facebook
              </a>
              <a href="https://www.tiktok.com/@meadowbrookmontrellmedia" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-3 border border-[#D4A843]/30 text-[#D4A843] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#D4A843]/10 transition-all duration-300">
                <TikTokIcon className="size-4" /> TikTok
              </a>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          GUEST SPOTLIGHT (Feature 7)
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">Past Guests</p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              GUEST<br /><span className="text-gold-gradient">SPOTLIGHT</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">The conversations that keep the streets talking.</p>
          </AnimatedSection>
          <AnimatedSection delay={0.2}>
            <GuestCarousel />
          </AnimatedSection>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          CONTENT SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="content" className="relative py-24 md:py-32 bg-[#0a0a0a]/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">The Work</p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">FROM THE<br /><span className="text-gold-gradient">STREETS</span></h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">Street interviews, community coverage, and raw reporting from the heart of Fort Worth.</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[
              { id: "0BbxgRKk_sU", title: "DFW SHAKA & FORT WORTH LEGEND MCHENRY", badge: "INTERVIEW", color: "blue" },
              { id: "of9vm8OHu0c", title: "3GMG TAMUNO ON BOOKER T BLOCK", badge: "STREET", color: "amber" },
              { id: "Mvb41IsSHEM", title: 'TWISTED BLACK — "I\'M A FOOL WIT IT"', badge: "PERFORMANCE", color: "purple" },
              { id: "o9fF-4SYo00", title: "2 CHAINZ STOPS IN FORT WORTH", badge: "STREET", color: "amber" },
            ].map((clip, i) => (
              <AnimatedSection key={clip.id} delay={0.1 + i * 0.05}>
                <div className="rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500">
                  <SmartYouTubeEmbed videoId={clip.id} title={clip.title} aspectClass="aspect-[9/16]" />
                  <div className="p-3">
                    <span className={`text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded ${
                      ({ blue: "bg-blue-500/20 text-blue-400 border border-blue-500/30", amber: "bg-amber-500/20 text-amber-400 border border-amber-500/30", purple: "bg-purple-500/20 text-purple-400 border border-purple-500/30", red: "bg-red-500/20 text-red-400 border border-red-500/30", green: "bg-green-500/20 text-green-400 border border-green-500/30" } as Record<string, string>)[clip.color] || "bg-gray-500/20 text-gray-400 border border-gray-500/30"
                    }`}>{clip.badge}</span>
                    <h4 className="font-display text-xs text-[#f0ece4] tracking-wider mt-1.5 line-clamp-2">{clip.title}</h4>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.3} className="text-center mt-10">
            <a href="/library" className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-xs tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300">VIEW ALL 40+ VIDEOS IN LIBRARY</a>
          </AnimatedSection>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          SOCIAL FEED WALL (Feature 10)
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A843]/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">Always Active</p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              SOCIAL<br /><span className="text-gold-gradient">FEED</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">The latest from across all platforms — always fresh, always real.</p>
          </AnimatedSection>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {SOCIAL_FEED_VIDEOS.map((vid, i) => (
              <AnimatedSection key={vid.id} delay={0.1 + i * 0.04}>
                <div className="group rounded-sm overflow-hidden bg-[#141414]/80 border border-[#D4A843]/10 hover:border-[#D4A843]/30 transition-all duration-500 hover:shadow-[0_0_20px_rgba(212,168,67,0.1)]">
                  <div className="aspect-video relative">
                    <img
                      src={`https://img.youtube.com/vi/${vid.id}/mqdefault.jpg`}
                      alt={vid.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <a
                        href={`https://www.youtube.com/watch?v=${vid.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 rounded-full bg-[#D4A843] text-[#0a0a0a] flex items-center justify-center hover:scale-110 transition-transform"
                      >
                        <Play className="size-6 ml-1" />
                      </a>
                    </div>
                    {/* Platform badge */}
                    <div className="absolute top-2 left-2 px-2 py-0.5 bg-[#0a0a0a]/80 backdrop-blur-sm rounded text-[9px] font-bold text-red-400 tracking-widest uppercase flex items-center gap-1">
                      <Youtube className="size-3" /> {vid.platform}
                    </div>
                  </div>
                  <div className="p-3">
                    <p className="text-xs text-[#c8c0b0] font-medium line-clamp-1">{vid.title}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>

          <AnimatedSection delay={0.4} className="flex flex-wrap gap-4 justify-center mt-10">
            {SOCIALS.map((s) => (
              <a
                key={s.name}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#D4A843]/20 rounded-sm text-[#c8c0b0] text-xs font-bold tracking-widest uppercase hover:bg-[#D4A843]/10 hover:border-[#D4A843]/40 hover:text-[#D4A843] transition-all duration-300"
              >
                <s.icon className="size-4" /> {s.name}
              </a>
            ))}
          </AnimatedSection>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          MERCH SECTION
          ═══════════════════════════════════════════════════ */}
      <section id="merch" className="relative py-24 md:py-32 overflow-hidden bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#D4A843]/[0.02] to-transparent" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">Rep The Brand</p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">OFFICIAL<br /><span className="text-gold-gradient">MERCH</span></h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">Rep the 3GMG brand. Straight from the Meadowbrook, made for the streets.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {MERCH_ITEMS.map((item, i) => (
              <AnimatedSection key={item.name} delay={i * 0.1}>
                <div className="group relative rounded-sm overflow-hidden glow-border bg-[#141414] hover:border-[#D4A843]/30 transition-all duration-500">
                  <div className={`aspect-square bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                    {item.tag && <div className="absolute top-3 left-3 px-3 py-1 bg-[#D4A843] text-[#0a0a0a] text-[10px] font-bold tracking-widest uppercase rounded-sm">{item.tag}</div>}
                    <div className="text-center">
                      <ShoppingBag className="size-12 text-[#D4A843]/30 mx-auto mb-2 group-hover:scale-110 transition-transform duration-500" />
                      <p className="text-[#888078] text-xs tracking-widest uppercase">Coming Soon</p>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold text-sm text-[#f0ece4] mb-1">{item.name}</h3>
                    <p className="text-[#D4A843] font-display text-xl tracking-wider">{item.price}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.5} className="text-center mt-12">
            <div className="inline-flex items-center gap-3 px-6 py-3 rounded-sm border border-[#D4A843]/20 bg-[#141414]">
              <div className="w-2 h-2 rounded-full bg-[#D4A843] animate-pulse" />
              <p className="text-[#c8c0b0] text-sm tracking-wider">Full merch store launching soon — stay tuned</p>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          TRENDING NOW SECTION
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]/85 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Flame className="size-5 text-orange-400 animate-pulse" />
              <p className="text-orange-400 text-sm font-medium tracking-[0.3em] uppercase">Hot Right Now</p>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">TRENDING<br /><span className="text-gold-gradient">NOW</span></h2>
            <p className="text-[#c8c0b0] max-w-2xl mx-auto text-lg leading-relaxed">The latest drops and most popular content from 3GMG.</p>
          </AnimatedSection>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {SOCIAL_FEED_VIDEOS.slice(0, 6).map((video, i) => (
              <AnimatedSection key={video.id} delay={i * 0.08}>
                <div className="group relative rounded-sm overflow-hidden glow-border bg-[#141414] hover:border-[#D4A843]/30 transition-all duration-500">
                  <div className="relative aspect-video overflow-hidden">
                    <img
                      src={`https://img.youtube.com/vi/${video.id}/mqdefault.jpg`}
                      alt={video.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a]/80 via-transparent to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <a href={`https://www.youtube.com/watch?v=${video.id}`} target="_blank" rel="noopener noreferrer" className="w-14 h-14 rounded-full bg-[#D4A843] flex items-center justify-center shadow-lg shadow-[#D4A843]/30">
                        <Play className="size-6 text-[#0a0a0a] ml-1" />
                      </a>
                    </div>
                    <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-orange-500/90 rounded text-[9px] font-bold text-white uppercase tracking-wider">
                      <TrendingUp className="size-3" /> Trending
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-sm font-bold text-[#f0ece4] line-clamp-2 group-hover:text-[#D4A843] transition-colors">{video.title}</h3>
                    <p className="text-[10px] text-[#888078] mt-2 tracking-wider uppercase">{video.platform}</p>
                  </div>
                </div>
              </AnimatedSection>
            ))}
          </div>
          <AnimatedSection delay={0.5} className="text-center mt-10">
            <a href="/library" className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
              View Full Library →
            </a>
          </AnimatedSection>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          FAN INTERACTION WALL
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]/80 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">From The People</p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">FAN<br /><span className="text-gold-gradient">WALL</span></h2>
            <p className="text-[#c8c0b0] max-w-xl mx-auto text-lg leading-relaxed">Got a question, story tip, or shoutout? Drop it here — the best ones get featured.</p>
          </AnimatedSection>
          <FanSubmissionForm />
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          NOTIFY / SIGNUP SECTION (Feature 9)
          ═══════════════════════════════════════════════════ */}
      <section className="relative py-24 md:py-32 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <AnimatedSection>
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse shadow-[0_0_8px_rgba(239,68,68,0.6)]" />
              <span className="text-red-400 text-xs font-bold tracking-widest uppercase">DON'T MISS A THING</span>
            </div>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">
              GET<br /><span className="text-gold-gradient">NOTIFIED</span>
            </h2>
            <p className="text-[#c8c0b0] max-w-xl mx-auto text-lg leading-relaxed mb-10">
              Be the first to know when we go live, drop new episodes, or release merch. No spam — just heat.
            </p>
            <EmailSignup />
          </AnimatedSection>
        </div>
      </section>

      <div className="street-divider mx-auto max-w-4xl" />

      {/* ═══════════════════════════════════════════════════
          CONNECT / SOCIAL LINKS
          ═══════════════════════════════════════════════════ */}
      <section id="connect" className="relative py-24 md:py-32 bg-[#0a0a0a]/85 backdrop-blur-sm">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <p className="text-[#D4A843] text-sm font-medium tracking-[0.3em] uppercase mb-4">Stay Connected</p>
            <h2 className="font-display text-5xl sm:text-6xl md:text-7xl text-[#f0ece4] tracking-wider mb-4">TAP IN<br /><span className="text-gold-gradient">WITH ME</span></h2>
            <p className="text-[#c8c0b0] max-w-xl mx-auto text-lg leading-relaxed">Follow the movement across all platforms.</p>
          </AnimatedSection>
          <div className="grid sm:grid-cols-2 gap-4">
            {SOCIALS.map((social, i) => (
              <AnimatedSection key={social.name} delay={i * 0.1}>
                <a href={social.url} target="_blank" rel="noopener noreferrer" className="group flex items-center gap-5 p-6 rounded-sm glow-border bg-[#141414] hover:border-[#D4A843]/40 hover:bg-[#1a1a1a] transition-all duration-500">
                  <div className="shrink-0 w-14 h-14 rounded-sm bg-[#D4A843]/10 border border-[#D4A843]/20 flex items-center justify-center group-hover:bg-[#D4A843]/20 transition-colors duration-500">
                    <social.icon className="size-6 text-[#D4A843]" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-[#f0ece4] mb-0.5">{social.name}</h3>
                    <p className="text-[#888078] text-sm">{social.followers ? `${social.followers} followers` : "Follow for updates"}</p>
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
      <footer className="relative border-t border-[#D4A843]/10 bg-[#0a0a0a]/90 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex flex-col items-center md:items-start gap-3">
              <img src="/images/logo-3gmg-graffiti.png" alt="3GMG" className="h-12 w-auto drop-shadow-[0_0_8px_rgba(212,168,67,0.3)]" />
              <div className="flex items-center gap-2 text-[#888078] text-sm">
                <MapPin className="size-3.5" /><span>Fort Worth, Texas</span>
              </div>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              {NAV_LINKS.map((link) => (
                <a key={link.href} href={link.href} className="text-sm text-[#888078] hover:text-[#D4A843] transition-colors tracking-wider uppercase">{link.label}</a>
              ))}
            </div>
            <div className="flex items-center gap-4">
              {SOCIALS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" className="text-[#888078] hover:text-[#D4A843] transition-colors">
                  <s.icon className="size-5" />
                </a>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-4 mt-6 text-xs">
            <a href="/media-kit" className="text-[#D4A843]/70 hover:text-[#D4A843] transition-colors tracking-wider uppercase">Media Kit</a>
            <span className="text-[#333]">•</span>
            <a href="/link" className="text-[#D4A843]/70 hover:text-[#D4A843] transition-colors tracking-wider uppercase">Link-in-Bio</a>
          </div>
          <div className="mt-10 pt-6 border-t border-[#D4A843]/5 text-center">
            <p className="text-[#888078]/60 text-xs tracking-wider">
              &copy; {new Date().getFullYear()} 3GMG Meadowbrook Montrell. All Rights Reserved.
              <span className="mx-2">&bull;</span>Fort Worth, TX
              <span className="mx-2">&bull;</span>The Hood's Paparazzi
            </p>
          </div>
        </div>
      </footer>

      {/* Feature 4: Floating Audio Player */}
      {/* FloatingAudioPlayer removed — no real audio source connected yet */}
    </div>
  );
}
