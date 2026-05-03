/**
 * Media Kit / Sponsor Page — professional one-pager with stats for potential sponsors
 */
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import {
  ArrowLeft, Youtube, Users, Eye, Video, TrendingUp,
  Mail, ExternalLink, Handshake, Mic, MapPin, Star,
} from "lucide-react";
import { useState } from "react";

const TikTokIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1v-3.5a6.37 6.37 0 00-.79-.05A6.34 6.34 0 003.15 15.2a6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.34-6.34V9.26a8.33 8.33 0 004.76 1.49v-3.4a4.85 4.85 0 01-1-.66z" />
  </svg>
);

const FacebookIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className}>
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
  </svg>
);

export function MediaKitPage() {
  const metrics = useQuery(api.operations.getSocialMetrics);
  const [showForm, setShowForm] = useState(false);
  const [formSent, setFormSent] = useState(false);

  const ytMetrics = metrics?.find((m) => m.platform === "youtube");
  const fbMetrics = metrics?.find((m) => m.platform === "facebook");
  const tkMetrics = metrics?.find((m) => m.platform === "tiktok");

  const statCards = [
    { label: "Facebook Followers", value: fbMetrics?.followers ?? 40000, icon: Users, color: "#4267B2" },
    { label: "TikTok Followers", value: tkMetrics?.followers ?? 2159, icon: TrendingUp, color: "#ff0050" },
    { label: "YouTube Subscribers", value: ytMetrics?.followers ?? 90, icon: Youtube, color: "#FF0000" },
    { label: "Total Videos", value: ytMetrics?.totalVideos ?? 40, icon: Video, color: "#D4A843" },
    { label: "Total Views", value: ytMetrics?.totalViews ?? 5000, icon: Eye, color: "#D4A843" },
    { label: "Interviews", value: 100, icon: Mic, color: "#D4A843" },
  ];

  const formatNum = (n: number) => n >= 1000 ? `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K` : n.toString();

  return (
    <div
      className="min-h-screen bg-[#0a0a0a] text-[#f0ece4] relative"
      style={{
        backgroundImage: "url('/images/hero-graffiti.webp')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="absolute inset-0 bg-black/85" />

      <div className="relative z-10 max-w-5xl mx-auto px-4 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4A843] hover:text-[#E8C767] text-sm mb-8 transition-colors">
          <ArrowLeft className="size-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <img src="/images/logo-3gmg-graffiti.png" alt="3GMG" className="h-16 mx-auto mb-6" />
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4">
            MEDIA <span className="text-[#D4A843]">KIT</span>
          </h1>
          <p className="text-[#888078] max-w-lg mx-auto text-lg">
            Meadowbrook Montrell — THE HOOD'S PAPARAZZI
          </p>
          <div className="flex items-center justify-center gap-2 text-[#D4A843] mt-3">
            <MapPin className="size-4" /> <span className="text-sm font-medium tracking-wider">Fort Worth, Texas</span>
          </div>
        </div>

        {/* About */}
        <div className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/20 rounded-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-[#D4A843] mb-4">ABOUT</h2>
          <p className="text-[#ccc] leading-relaxed">
            Montrell Wilson, known as Meadowbrook Montrell, is a Fort Worth-based content creator, podcaster, songwriter, and community figure. As the creator of the <strong>"Make It Make Sense"</strong> podcast, he brings raw, unfiltered conversations straight from the streets — covering music, community issues, culture, and real life. With 40,000+ followers across platforms and 100+ interviews, Meadowbrook Montrell is one of Fort Worth's most authentic voices.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/10 rounded-sm p-5 text-center hover:border-[#D4A843]/30 transition-all">
              <stat.icon className="size-6 mx-auto mb-2" style={{ color: stat.color }} />
              <div className="font-display text-3xl text-[#f0ece4] tracking-wider">{formatNum(stat.value)}</div>
              <div className="text-xs text-[#888078] tracking-widest uppercase mt-1">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Platforms */}
        <div className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/20 rounded-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-[#D4A843] mb-6">PLATFORMS</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {[
              { name: "YouTube", url: "https://www.youtube.com/@Meadowbrookmontrell", icon: Youtube, color: "#FF0000", handle: "@Meadowbrookmontrell" },
              { name: "Facebook", url: "https://www.facebook.com/montrell.wilson.884042", icon: FacebookIcon, color: "#4267B2", handle: "3gmg Meadowbrook Montrell" },
              { name: "TikTok", url: "https://www.tiktok.com/@meadowbrookmontrellmedia", icon: TikTokIcon, color: "#ff0050", handle: "@meadowbrookmontrellmedia" },
              { name: "Instagram", url: "https://www.instagram.com/3gmgmeadowbrookmontrell", icon: Star, color: "#E4405F", handle: "@3gmgmeadowbrookmontrell" },
            ].map((p) => (
              <a
                key={p.name}
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-4 p-4 bg-[#0a0a0a]/60 border border-[#333] rounded-sm hover:border-[#D4A843]/30 transition-all group"
              >
                <p.icon className="size-6 shrink-0" style={{ color: p.color }} />
                <div className="min-w-0">
                  <div className="font-bold text-sm tracking-wider">{p.name}</div>
                  <div className="text-xs text-[#888078] truncate">{p.handle}</div>
                </div>
                <ExternalLink className="size-4 text-[#555] group-hover:text-[#D4A843] ml-auto shrink-0 transition-colors" />
              </a>
            ))}
          </div>
        </div>

        {/* Content Types */}
        <div className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/20 rounded-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-[#D4A843] mb-6">CONTENT</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: "Podcast Episodes", desc: "Long-form interviews & discussions" },
              { title: "Street Reporting", desc: "On-location community coverage" },
              { title: "Music Features", desc: "Artist spotlights & performances" },
              { title: "Live Sessions", desc: "Weekly live streaming events" },
            ].map((c) => (
              <div key={c.title} className="text-center p-4">
                <div className="font-display text-sm tracking-wider text-[#f0ece4] mb-1">{c.title}</div>
                <div className="text-xs text-[#888078]">{c.desc}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Partnership Options */}
        <div className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/20 rounded-sm p-6 sm:p-8 mb-8">
          <h2 className="font-display text-2xl tracking-wider text-[#D4A843] mb-6">PARTNERSHIP OPTIONS</h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { title: "Sponsored Episode", desc: "Your brand featured in a full episode with shoutouts, logo placement, and social posts.", price: "Contact for pricing" },
              { title: "Ad Read / Mention", desc: "30-60 second ad read during podcast episodes or live sessions.", price: "Contact for pricing" },
              { title: "Brand Deal", desc: "Custom content creation featuring your product or service in an authentic street-style format.", price: "Contact for pricing" },
            ].map((opt) => (
              <div key={opt.title} className="p-5 bg-[#0a0a0a]/60 border border-[#333] rounded-sm">
                <Handshake className="size-5 text-[#D4A843] mb-3" />
                <h3 className="font-display text-sm tracking-wider mb-2">{opt.title}</h3>
                <p className="text-xs text-[#888078] mb-3">{opt.desc}</p>
                <div className="text-xs text-[#D4A843] font-bold tracking-widest uppercase">{opt.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          {formSent ? (
            <div className="py-8">
              <div className="text-[#D4A843] font-display text-2xl tracking-wider mb-2">MESSAGE SENT ✓</div>
              <p className="text-[#888078]">We'll be in touch soon.</p>
            </div>
          ) : !showForm ? (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-3 px-10 py-4 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300 shadow-lg shadow-[#D4A843]/20"
            >
              <Mail className="size-4" /> Partner With Us
            </button>
          ) : (
            <form
              className="max-w-md mx-auto space-y-4"
              onSubmit={(e) => {
                e.preventDefault();
                setFormSent(true);
              }}
            >
              <input type="text" required placeholder="Company / Your Name" className="w-full bg-[#141414]/90 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none" />
              <input type="email" required placeholder="Email" className="w-full bg-[#141414]/90 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none" />
              <textarea rows={3} placeholder="Tell us about the partnership you have in mind..." className="w-full bg-[#141414]/90 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none resize-none" />
              <button type="submit" className="w-full px-8 py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
                Send Inquiry
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
