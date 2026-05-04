/**
 * Guest Booking Page — public form for potential interview guests
 */
import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Calendar, Clock, Send, Mic, ArrowLeft, CheckCircle2, AlertCircle } from "lucide-react";
import { Link } from "react-router-dom";

export function BookingPage() {
  const addBooking = useMutation(api.operations.addBooking);
  const sendBookingConfirmation = useAction(api.emailService.sendBookingConfirmation);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState(false);
  const [form, setForm] = useState({
    guestName: "",
    email: "",
    phone: "",
    socialHandle: "",
    topic: "",
    preferredDate: "",
    preferredTime: "",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(false);
    try {
      await addBooking({
        guestName: form.guestName,
        email: form.email,
        phone: form.phone || undefined,
        socialHandle: form.socialHandle || undefined,
        topic: form.topic,
        preferredDate: form.preferredDate,
        preferredTime: form.preferredTime || undefined,
        message: form.message || undefined,
      });
      // F1: Send confirmation email (fire-and-forget — don't block on failure)
      sendBookingConfirmation({
        guestName: form.guestName,
        email: form.email,
        topic: form.topic,
        preferredDate: form.preferredDate,
      }).catch(() => {}); // email failure shouldn't affect UX
      setSubmitted(true);
    } catch {
      setSubmitError(true);
    }
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
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 max-w-2xl mx-auto px-4 py-16 sm:py-24">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4A843] hover:text-[#E8C767] text-sm mb-8 transition-colors">
          <ArrowLeft className="size-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 text-[#D4A843] mb-4">
            <Mic className="size-5" />
            <span className="text-xs font-bold tracking-[0.3em] uppercase">Book Your Interview</span>
          </div>
          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl tracking-wider mb-4">
            BE A <span className="text-[#D4A843]">GUEST</span>
          </h1>
          <p className="text-[#888078] max-w-md mx-auto">
            Got a story to tell? Want to be featured on Make It Make Sense? Fill out the form below and we'll reach out.
          </p>
        </div>

        {submitted ? (
          <div className="text-center py-16">
            <CheckCircle2 className="size-16 text-[#D4A843] mx-auto mb-6" />
            <h2 className="font-display text-3xl tracking-wider mb-4">REQUEST SUBMITTED</h2>
            <p className="text-[#888078] mb-8">We'll review your submission and get back to you. Stay ready.</p>
            <Link to="/" className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
              Back to Home
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/20 rounded-sm p-6 sm:p-8 space-y-5">
              {/* Name */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Your Name *</label>
                <input
                  type="text"
                  required
                  value={form.guestName}
                  onChange={(e) => setForm({ ...form, guestName: e.target.value })}
                  className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none transition-colors"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              {/* Phone + Social */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Phone</label>
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none transition-colors"
                    placeholder="(817) 555-0000"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Social Handle</label>
                  <input
                    type="text"
                    value={form.socialHandle}
                    onChange={(e) => setForm({ ...form, socialHandle: e.target.value })}
                    className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none transition-colors"
                    placeholder="@yourhandle"
                  />
                </div>
              </div>

              {/* Topic */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">What Do You Want To Talk About? *</label>
                <input
                  type="text"
                  required
                  value={form.topic}
                  onChange={(e) => setForm({ ...form, topic: e.target.value })}
                  className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none transition-colors"
                  placeholder="Music, Community, Business, Life..."
                />
              </div>

              {/* Date + Time */}
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">
                    <Calendar className="size-3 inline mr-1" /> Preferred Date *
                  </label>
                  <input
                    type="date"
                    required
                    value={form.preferredDate}
                    onChange={(e) => setForm({ ...form, preferredDate: e.target.value })}
                    className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] focus:border-[#D4A843] focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">
                    <Clock className="size-3 inline mr-1" /> Preferred Time
                  </label>
                  <input
                    type="time"
                    value={form.preferredTime}
                    onChange={(e) => setForm({ ...form, preferredTime: e.target.value })}
                    className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] focus:border-[#D4A843] focus:outline-none transition-colors"
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Anything Else?</label>
                <textarea
                  value={form.message}
                  onChange={(e) => setForm({ ...form, message: e.target.value })}
                  rows={4}
                  className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none transition-colors resize-none"
                  placeholder="Tell us about yourself, your story, or any special requests..."
                />
              </div>
            </div>

            {submitError && (
              <div className="flex items-center gap-2 p-4 bg-red-500/10 border border-red-500/30 rounded-sm text-red-400 text-sm">
                <AlertCircle className="size-4 shrink-0" />
                Submission failed. Please check your connection and try again.
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-3 px-8 py-4 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all duration-300 shadow-lg shadow-[#D4A843]/20"
            >
              <Send className="size-4" /> Submit Booking Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
