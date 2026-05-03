/**
 * Public Events / Live Show Calendar
 * Shows, pop-ups, meet & greets, recording sessions
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Calendar, MapPin, Users, ExternalLink, ArrowLeft, Video, Ticket, CheckCircle } from "lucide-react";

function eventTypeIcon(type: string) {
  const map: Record<string, string> = {
    "live-show": "🎤", "pop-up": "🏪", "meet-greet": "🤝",
    recording: "🎬", panel: "🎙️", other: "📅",
  };
  return map[type] || "📅";
}

function eventTypeBadge(type: string): string {
  const map: Record<string, string> = {
    "live-show": "bg-red-500/20 text-red-400",
    "pop-up": "bg-purple-500/20 text-purple-400",
    "meet-greet": "bg-blue-500/20 text-blue-400",
    recording: "bg-green-500/20 text-green-400",
    panel: "bg-[#D4A843]/20 text-[#D4A843]",
    other: "bg-[#333] text-[#888078]",
  };
  return map[type] || "bg-[#333] text-[#888078]";
}

export function EventsPage() {
  const events = useQuery(api.consumer.getPublicEvents, { upcoming: true });
  const pastEvents = useQuery(api.consumer.getPublicEvents, {});
  const submitRSVP = useMutation(api.consumer.submitRSVP);
  const [rsvpEventId, setRsvpEventId] = useState<string | null>(null);
  const [rsvpForm, setRsvpForm] = useState({ name: "", email: "", phone: "", attendees: "1" });
  const [rsvpSuccess, setRsvpSuccess] = useState(false);

  const handleRSVP = async () => {
    if (!rsvpForm.name || !rsvpForm.email || !rsvpEventId) return;
    await submitRSVP({
      eventId: rsvpEventId as any,
      name: rsvpForm.name,
      email: rsvpForm.email,
      phone: rsvpForm.phone || undefined,
      attendees: parseInt(rsvpForm.attendees) || 1,
    });
    setRsvpSuccess(true);
    setTimeout(() => { setRsvpEventId(null); setRsvpSuccess(false); setRsvpForm({ name: "", email: "", phone: "", attendees: "1" }); }, 3000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Nav */}
      <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#D4A843]/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-2 text-[#888078] hover:text-[#D4A843] transition-colors">
              <ArrowLeft className="size-4" /> <span className="text-sm">Home</span>
            </a>
            <div className="h-6 w-px bg-[#D4A843]/20" />
            <h1 className="font-display text-xl tracking-wider">
              <span className="text-[#D4A843]">EVENTS</span> & SHOWS
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-[#f0ece4] tracking-widest mb-4">UPCOMING EVENTS</h2>
          <p className="text-[#888078] max-w-2xl mx-auto">Live shows, pop-ups, meet & greets, and recording sessions. Pull up and be a part of the movement.</p>
        </div>

        {/* Upcoming Events */}
        {events && events.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
            {events.map((event: any) => {
              const isPast = new Date(event.date) < new Date();
              return (
                <div key={event._id} className="border border-[#D4A843]/15 rounded-xl bg-[#141414]/80 overflow-hidden hover:border-[#D4A843]/30 transition-all group">
                  {event.imageUrl && (
                    <img src={event.imageUrl} alt={event.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                  )}
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-xl">{eventTypeIcon(event.eventType)}</span>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${eventTypeBadge(event.eventType)}`}>
                        {event.eventType.replace(/-/g, " ")}
                      </span>
                      {event.isFree && <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-green-500/20 text-green-400">FREE</span>}
                      {event.isVirtual && <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/20 text-blue-400">VIRTUAL</span>}
                    </div>

                    <h3 className="font-display text-2xl text-[#f0ece4] tracking-wider mb-3 group-hover:text-[#D4A843] transition-colors">{event.title}</h3>
                    <p className="text-sm text-[#888078] mb-4 line-clamp-2">{event.description}</p>

                    <div className="space-y-2 mb-6">
                      <div className="flex items-center gap-2 text-sm text-[#c8c0b0]">
                        <Calendar className="size-4 text-[#D4A843]" />
                        {new Date(event.date).toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}
                        {event.time && ` at ${event.time}`}
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-2 text-sm text-[#c8c0b0]">
                          <MapPin className="size-4 text-[#D4A843]" />
                          {event.location}{event.address ? ` — ${event.address}` : ""}
                        </div>
                      )}
                      {event.rsvpCount > 0 && (
                        <div className="flex items-center gap-2 text-sm text-[#c8c0b0]">
                          <Users className="size-4 text-[#D4A843]" />
                          {event.rsvpCount} {event.rsvpCount === 1 ? "person" : "people"} attending
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3">
                      {!isPast && (
                        <button
                          onClick={() => setRsvpEventId(event._id)}
                          className="flex items-center gap-2 px-5 py-2.5 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded hover:bg-[#E8C767] transition-all"
                        >
                          <Ticket className="size-4" /> RSVP
                        </button>
                      )}
                      {event.ticketUrl && (
                        <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 border border-[#D4A843] text-[#D4A843] font-bold text-sm tracking-widest uppercase rounded hover:bg-[#D4A843]/10 transition-all">
                          <ExternalLink className="size-4" /> Tickets {event.ticketPrice ? `$${event.ticketPrice}` : ""}
                        </a>
                      )}
                      {event.isVirtual && event.streamUrl && (
                        <a href={event.streamUrl} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-5 py-2.5 border border-blue-500 text-blue-400 font-bold text-sm tracking-widest uppercase rounded hover:bg-blue-500/10 transition-all">
                          <Video className="size-4" /> Stream
                        </a>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 mb-16">
            <p className="font-display text-2xl text-[#D4A843]/30 tracking-widest mb-4">NO UPCOMING EVENTS</p>
            <p className="text-[#888078]">Events will be listed here. Stay tuned — something's always cooking.</p>
          </div>
        )}

        {/* Past Events */}
        {pastEvents && pastEvents.filter((e: any) => new Date(e.date) < new Date()).length > 0 && (
          <div>
            <h3 className="font-display text-2xl text-[#888078] tracking-widest mb-6 text-center">PAST EVENTS</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {pastEvents.filter((e: any) => new Date(e.date) < new Date()).map((event: any) => (
                <div key={event._id} className="border border-[#333] rounded-lg bg-[#141414]/50 p-4 opacity-60">
                  <div className="flex items-center gap-2 mb-2">
                    <span>{eventTypeIcon(event.eventType)}</span>
                    <span className="text-xs text-[#888078]">{new Date(event.date).toLocaleDateString()}</span>
                  </div>
                  <h4 className="font-display text-sm text-[#f0ece4] tracking-wider">{event.title}</h4>
                  {event.location && <p className="text-[10px] text-[#888078] mt-1">{event.location}</p>}
                  {event.rsvpCount > 0 && <p className="text-[10px] text-[#D4A843] mt-1">{event.rsvpCount} attended</p>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RSVP Modal */}
      {rsvpEventId && (
        <div className="fixed inset-0 z-[100] bg-black/80 flex items-center justify-center p-4" onClick={() => { if (!rsvpSuccess) setRsvpEventId(null); }}>
          <div className="bg-[#141414] border border-[#D4A843]/20 rounded-xl max-w-md w-full p-6" onClick={(e) => e.stopPropagation()}>
            {rsvpSuccess ? (
              <div className="text-center py-8">
                <CheckCircle className="size-16 text-green-400 mx-auto mb-4" />
                <p className="font-display text-2xl text-[#f0ece4] tracking-wider mb-2">YOU'RE IN!</p>
                <p className="text-[#888078]">RSVP confirmed. See you there! 🔥</p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-xl text-[#f0ece4] tracking-wider mb-6">RSVP</h3>
                <div className="space-y-4">
                  <input placeholder="Your name *" value={rsvpForm.name} onChange={(e) => setRsvpForm({ ...rsvpForm, name: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded px-4 py-3 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <input placeholder="Email *" type="email" value={rsvpForm.email} onChange={(e) => setRsvpForm({ ...rsvpForm, email: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded px-4 py-3 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <input placeholder="Phone (optional)" value={rsvpForm.phone} onChange={(e) => setRsvpForm({ ...rsvpForm, phone: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded px-4 py-3 text-sm text-[#f0ece4] placeholder:text-[#888078]/50 focus:border-[#D4A843]/40 focus:outline-none" />
                  <select value={rsvpForm.attendees} onChange={(e) => setRsvpForm({ ...rsvpForm, attendees: e.target.value })}
                    className="w-full bg-[#0a0a0a] border border-[#333] rounded px-4 py-3 text-sm text-[#f0ece4] focus:border-[#D4A843]/40 focus:outline-none">
                    {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n} {n === 1 ? "person" : "people"}</option>)}
                  </select>
                  <button onClick={handleRSVP}
                    className="w-full py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded hover:bg-[#E8C767] transition-all">
                    CONFIRM RSVP
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
