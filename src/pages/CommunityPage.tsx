/**
 * Community Board / Fan Wall — public page for shoutouts, topics, and messages
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Link } from "react-router-dom";
import {
  ArrowLeft, MessageSquare, Heart, Pin, Send, Star,
  Lightbulb, HelpCircle, MessageCircle, Filter,
} from "lucide-react";

const typeConfig: Record<string, { label: string; icon: React.ElementType; color: string }> = {
  shoutout: { label: "Shoutout", icon: Star, color: "#D4A843" },
  "topic-suggestion": { label: "Topic Suggestion", icon: Lightbulb, color: "#22c55e" },
  question: { label: "Question", icon: HelpCircle, color: "#3b82f6" },
  message: { label: "Message", icon: MessageCircle, color: "#a855f7" },
};

export function CommunityPage() {
  const posts = useQuery(api.operations.getCommunityPosts, { approvedOnly: true });
  const addPost = useMutation(api.operations.addCommunityPost);
  const likePost = useMutation(api.operations.likeCommunityPost);

  const [filter, setFilter] = useState<string>("all");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    authorName: "",
    authorEmail: "",
    message: "",
    type: "shoutout",
  });

  const filteredPosts = posts?.filter((p) => filter === "all" || p.type === filter) || [];
  const pinnedPosts = filteredPosts.filter((p) => p.isPinned);
  const regularPosts = filteredPosts.filter((p) => !p.isPinned);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addPost({
      authorName: form.authorName,
      authorEmail: form.authorEmail || undefined,
      message: form.message,
      type: form.type,
    });
    setSubmitted(true);
    setForm({ authorName: "", authorEmail: "", message: "", type: "shoutout" });
  };

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  };

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
      <div className="absolute inset-0 bg-black/80" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 py-16 sm:py-24">
        <Link to="/" className="inline-flex items-center gap-2 text-[#D4A843] hover:text-[#E8C767] text-sm mb-8 transition-colors">
          <ArrowLeft className="size-4" /> Back to Home
        </Link>

        {/* Header */}
        <div className="text-center mb-12">
          <MessageSquare className="size-8 text-[#D4A843] mx-auto mb-4" />
          <h1 className="font-display text-4xl sm:text-5xl tracking-wider mb-4">
            COMMUNITY <span className="text-[#D4A843]">WALL</span>
          </h1>
          <p className="text-[#888078] max-w-md mx-auto">
            Drop a shoutout, suggest a topic, or just leave a message. This is the people's wall.
          </p>
        </div>

        {/* Post button */}
        <div className="text-center mb-8">
          <button
            onClick={() => { setShowForm(!showForm); setSubmitted(false); }}
            className="inline-flex items-center gap-2 px-8 py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all"
          >
            <Send className="size-4" /> {showForm ? "Close" : "Post on the Wall"}
          </button>
        </div>

        {/* Post Form */}
        {showForm && (
          <div className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/20 rounded-sm p-6 mb-8">
            {submitted ? (
              <div className="text-center py-4">
                <div className="text-[#D4A843] font-display text-xl tracking-wider mb-2">POSTED! ✓</div>
                <p className="text-[#888078] text-sm">Your message is now live on the wall. Stay real.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={form.authorName}
                      onChange={(e) => setForm({ ...form, authorName: e.target.value })}
                      className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Type</label>
                    <select
                      value={form.type}
                      onChange={(e) => setForm({ ...form, type: e.target.value })}
                      className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] focus:border-[#D4A843] focus:outline-none"
                    >
                      <option value="shoutout">⭐ Shoutout</option>
                      <option value="topic-suggestion">💡 Topic Suggestion</option>
                      <option value="question">❓ Question</option>
                      <option value="message">💬 Message</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold tracking-widest uppercase text-[#D4A843] mb-2">Your Message *</label>
                  <textarea
                    required
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    rows={4}
                    className="w-full bg-[#0a0a0a]/60 border border-[#333] rounded-sm px-4 py-3 text-[#f0ece4] placeholder-[#555] focus:border-[#D4A843] focus:outline-none resize-none"
                    placeholder="What's on your mind?"
                    maxLength={500}
                  />
                  <div className="text-right text-xs text-[#555] mt-1">{form.message.length}/500</div>
                </div>
                <button type="submit" className="w-full px-8 py-3 bg-[#D4A843] text-[#0a0a0a] font-bold text-sm tracking-widest uppercase rounded-sm hover:bg-[#E8C767] transition-all">
                  Submit
                </button>
              </form>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2">
          <Filter className="size-4 text-[#888078] shrink-0" />
          {[
            { key: "all", label: "All" },
            { key: "shoutout", label: "⭐ Shoutouts" },
            { key: "topic-suggestion", label: "💡 Topics" },
            { key: "question", label: "❓ Questions" },
            { key: "message", label: "💬 Messages" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-3 py-1.5 text-xs font-bold tracking-widest uppercase rounded-sm transition-all whitespace-nowrap ${
                filter === f.key
                  ? "bg-[#D4A843] text-[#0a0a0a]"
                  : "bg-[#141414]/60 text-[#888078] border border-[#333] hover:border-[#D4A843]/30"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Posts */}
        <div className="space-y-4">
          {/* Pinned posts */}
          {pinnedPosts.map((post) => {
            const config = typeConfig[post.type] || typeConfig.message;
            return (
              <div key={post._id} className="bg-[#141414]/90 backdrop-blur-sm border border-[#D4A843]/30 rounded-sm p-5 relative">
                <div className="absolute top-3 right-3">
                  <Pin className="size-4 text-[#D4A843]" />
                </div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#D4A843]/20 flex items-center justify-center">
                    <config.icon className="size-4" style={{ color: config.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{post.authorName}</div>
                    <div className="text-xs text-[#888078]">{config.label} • {timeAgo(post.createdAt)}</div>
                  </div>
                </div>
                <p className="text-[#ccc] text-sm leading-relaxed">{post.message}</p>
                <button
                  onClick={() => likePost({ id: post._id })}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#888078] hover:text-red-400 transition-colors"
                >
                  <Heart className="size-3" /> {post.likes || 0}
                </button>
              </div>
            );
          })}

          {/* Regular posts */}
          {regularPosts.map((post) => {
            const config = typeConfig[post.type] || typeConfig.message;
            return (
              <div key={post._id} className="bg-[#141414]/90 backdrop-blur-sm border border-[#333] rounded-sm p-5 hover:border-[#D4A843]/20 transition-all">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-full bg-[#1a1a1a] flex items-center justify-center">
                    <config.icon className="size-4" style={{ color: config.color }} />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{post.authorName}</div>
                    <div className="text-xs text-[#888078]">{config.label} • {timeAgo(post.createdAt)}</div>
                  </div>
                </div>
                <p className="text-[#ccc] text-sm leading-relaxed">{post.message}</p>
                <button
                  onClick={() => likePost({ id: post._id })}
                  className="mt-3 inline-flex items-center gap-1.5 text-xs text-[#888078] hover:text-red-400 transition-colors"
                >
                  <Heart className="size-3" /> {post.likes || 0}
                </button>
              </div>
            );
          })}

          {filteredPosts.length === 0 && (
            <div className="text-center py-16 text-[#555]">
              <MessageSquare className="size-12 mx-auto mb-4 opacity-50" />
              <p className="font-display text-lg tracking-wider">THE WALL IS EMPTY</p>
              <p className="text-sm mt-2">Be the first to post something.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
