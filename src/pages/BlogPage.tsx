/**
 * Blog / Written Content Section
 * Street Stories, Opinions, Behind-the-Scenes, News, Interview Recaps
 */
import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Calendar, Eye, ArrowLeft, Tag, Clock, User } from "lucide-react";

const categories = [
  { id: "all", label: "All Posts" },
  { id: "street-story", label: "Street Stories" },
  { id: "opinion", label: "Opinions" },
  { id: "behind-the-scenes", label: "Behind the Scenes" },
  { id: "news", label: "News" },
  { id: "interview-recap", label: "Interview Recaps" },
];

function categoryColor(cat: string): string {
  const map: Record<string, string> = {
    "street-story": "bg-red-500/20 text-red-400",
    opinion: "bg-purple-500/20 text-purple-400",
    "behind-the-scenes": "bg-blue-500/20 text-blue-400",
    news: "bg-green-500/20 text-green-400",
    "interview-recap": "bg-[#D4A843]/20 text-[#D4A843]",
  };
  return map[cat] || "bg-[#333] text-[#888078]";
}

export function BlogPage() {
  const [activeCat, setActiveCat] = useState("all");
  const [selectedSlug, setSelectedSlug] = useState<string | null>(null);
  const posts = useQuery(api.consumer.getPublishedPosts, activeCat === "all" ? {} : { category: activeCat });
  const selectedPost = useQuery(api.consumer.getPostBySlug, selectedSlug ? { slug: selectedSlug } : "skip");
  const incrementViews = useMutation(api.consumer.incrementPostViews);

  const openPost = (slug: string, id: any) => {
    setSelectedSlug(slug);
    incrementViews({ id });
  };

  // Single post view
  if (selectedSlug && selectedPost) {
    return (
      <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
        {/* Header */}
        <div className="sticky top-0 z-50 bg-[#0a0a0a]/95 backdrop-blur-lg border-b border-[#D4A843]/10">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 flex items-center h-16">
            <button onClick={() => setSelectedSlug(null)} className="flex items-center gap-2 text-[#888078] hover:text-[#D4A843] transition-colors">
              <ArrowLeft className="size-4" /> <span className="text-sm">Back to Blog</span>
            </button>
          </div>
        </div>

        <article className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
          {selectedPost.coverImageUrl && (
            <img src={selectedPost.coverImageUrl} alt={selectedPost.title} className="w-full h-64 sm:h-96 object-cover rounded-xl mb-8" />
          )}
          <div className="flex items-center gap-3 mb-4">
            <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${categoryColor(selectedPost.category)}`}>
              {selectedPost.category.replace(/-/g, " ")}
            </span>
            {selectedPost.publishedAt && (
              <span className="text-xs text-[#888078] flex items-center gap-1">
                <Calendar className="size-3" /> {new Date(selectedPost.publishedAt).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
              </span>
            )}
            <span className="text-xs text-[#888078] flex items-center gap-1">
              <Eye className="size-3" /> {selectedPost.views || 0} views
            </span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl text-[#f0ece4] tracking-wider leading-tight mb-6">
            {selectedPost.title}
          </h1>

          {selectedPost.authorName && (
            <div className="flex items-center gap-2 text-sm text-[#888078] mb-8 pb-8 border-b border-[#D4A843]/10">
              <User className="size-4" /> By {selectedPost.authorName}
            </div>
          )}

          {/* Markdown-ish body rendering */}
          <div className="prose prose-invert prose-gold max-w-none space-y-4">
            {selectedPost.body.split("\n\n").map((paragraph: string, i: number) => {
              if (paragraph.startsWith("# ")) return <h2 key={i} className="font-display text-2xl text-[#D4A843] tracking-wider mt-8 mb-4">{paragraph.slice(2)}</h2>;
              if (paragraph.startsWith("## ")) return <h3 key={i} className="font-display text-xl text-[#f0ece4] tracking-wider mt-6 mb-3">{paragraph.slice(3)}</h3>;
              if (paragraph.startsWith("- ")) {
                const items = paragraph.split("\n").filter((l) => l.startsWith("- "));
                return <ul key={i} className="list-disc list-inside space-y-1 text-[#c8c0b0]">{items.map((item, j) => <li key={j}>{item.slice(2)}</li>)}</ul>;
              }
              if (paragraph.startsWith("> ")) return <blockquote key={i} className="border-l-4 border-[#D4A843] pl-4 italic text-[#888078]">{paragraph.slice(2)}</blockquote>;
              return <p key={i} className="text-[#c8c0b0] leading-relaxed text-lg">{paragraph}</p>;
            })}
          </div>

          {selectedPost.tags && selectedPost.tags.length > 0 && (
            <div className="flex items-center gap-2 mt-12 pt-8 border-t border-[#D4A843]/10">
              <Tag className="size-4 text-[#888078]" />
              {selectedPost.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 text-xs bg-[#141414] border border-[#333] rounded text-[#888078]">{tag}</span>
              ))}
            </div>
          )}
        </article>
      </div>
    );
  }

  // Blog list view
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
              <span className="text-[#D4A843]">THE</span> BLOG
            </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="font-display text-4xl sm:text-5xl text-[#f0ece4] tracking-widest mb-4">STREET STORIES</h2>
          <p className="text-[#888078] max-w-2xl mx-auto">Stories, opinions, and behind-the-scenes coverage straight from the streets of Fort Worth.</p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 justify-center mb-12">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(cat.id)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                activeCat === cat.id
                  ? "bg-[#D4A843] text-[#0a0a0a]"
                  : "bg-[#141414] text-[#888078] border border-[#333] hover:border-[#D4A843]/30"
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Posts Grid */}
        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: any) => (
              <button
                key={post._id}
                onClick={() => openPost(post.slug, post._id)}
                className="text-left group border border-[#D4A843]/10 rounded-xl bg-[#141414]/80 overflow-hidden hover:border-[#D4A843]/30 transition-all"
              >
                {post.coverImageUrl ? (
                  <img src={post.coverImageUrl} alt={post.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="w-full h-48 bg-gradient-to-br from-[#D4A843]/10 to-[#0a0a0a] flex items-center justify-center">
                    <span className="font-display text-4xl text-[#D4A843]/20 tracking-widest">3GMG</span>
                  </div>
                )}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <span className={`px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full ${categoryColor(post.category)}`}>
                      {post.category.replace(/-/g, " ")}
                    </span>
                    {post.publishedAt && (
                      <span className="text-[10px] text-[#888078]">{new Date(post.publishedAt).toLocaleDateString()}</span>
                    )}
                  </div>
                  <h3 className="font-display text-lg text-[#f0ece4] tracking-wider group-hover:text-[#D4A843] transition-colors line-clamp-2">{post.title}</h3>
                  {post.excerpt && <p className="text-sm text-[#888078] mt-2 line-clamp-2">{post.excerpt}</p>}
                  <div className="flex items-center gap-3 mt-4 text-[10px] text-[#888078]">
                    <span className="flex items-center gap-1"><Eye className="size-3" /> {post.views || 0}</span>
                    <span className="flex items-center gap-1"><Clock className="size-3" /> {Math.ceil(post.body.length / 1000)} min read</span>
                  </div>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-display text-2xl text-[#D4A843]/30 tracking-widest mb-4">COMING SOON</p>
            <p className="text-[#888078]">Blog posts are being written. Stay tuned for street stories and more.</p>
          </div>
        )}
      </div>
    </div>
  );
}
