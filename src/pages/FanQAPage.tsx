import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { MessageSquare, Star, ArrowLeft, Send, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";

export default function FanQAPage() {
  const approved = useQuery(api.features2.getApprovedQA);
  const featured = useQuery(api.features2.getFeaturedQA);
  const submitQ = useMutation(api.features2.submitFanQuestion);
  const [name, setName] = useState("");
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("general");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !question) return;
    await submitQ({ fanName: name, question, category });
    setName(""); setQuestion(""); setSubmitted(true);
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#f0ece4]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-purple-500/10 to-transparent">
        <div className="max-w-4xl mx-auto px-6 pt-20 pb-12">
          <Link to="/" className="inline-flex items-center gap-2 text-[#D4A843] text-sm mb-8 hover:text-[#E8C767] transition-colors"><ArrowLeft className="size-4" /> Back to Home</Link>
          <div className="flex items-center gap-3 mb-4">
            <MessageSquare className="size-5 text-purple-400" />
            <span className="text-[10px] font-bold tracking-[0.3em] text-purple-400 uppercase">Fan Q&A</span>
          </div>
          <h1 className="font-display text-5xl md:text-6xl tracking-wider mb-4">ASK <span className="text-[#D4A843]">MONTRELL</span></h1>
          <p className="text-[#888078] max-w-xl text-lg">Got a question? About the podcast, Fort Worth, street reporting, or anything else — drop it here and I'll answer it real talk.</p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 pb-20">
        {/* Submit Form */}
        <form onSubmit={handleSubmit} className="bg-[#141414]/80 border border-purple-500/20 rounded-lg p-6 mb-12">
          {submitted ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 rounded-full bg-green-500/20 border border-green-500/30 flex items-center justify-center mx-auto mb-4"><ThumbsUp className="size-6 text-green-400" /></div>
              <h3 className="font-display text-xl text-green-400 tracking-wider mb-2">QUESTION SUBMITTED! 💯</h3>
              <p className="text-[#888] text-sm">Your question is being reviewed. Check back soon for the answer!</p>
            </div>
          ) : (
            <>
              <h3 className="font-display text-lg text-[#f0ece4] tracking-wider mb-4">Drop Your Question</h3>
              <div className="grid sm:grid-cols-2 gap-3 mb-3">
                <input className="bg-[#1a1a1a] border border-purple-500/20 rounded px-4 py-2.5 text-sm text-[#f0ece4] placeholder:text-[#888]/50 focus:border-purple-400/40 focus:outline-none w-full" placeholder="Your Name" value={name} onChange={e => setName(e.target.value)} required />
                <select className="bg-[#1a1a1a] border border-purple-500/20 rounded px-4 py-2.5 text-sm text-[#f0ece4] focus:border-purple-400/40 focus:outline-none w-full" value={category} onChange={e => setCategory(e.target.value)}>
                  <option value="general">General</option>
                  <option value="podcast">About the Podcast</option>
                  <option value="fort-worth">Fort Worth</option>
                  <option value="personal">Personal</option>
                  <option value="business">Business</option>
                </select>
              </div>
              <textarea className="bg-[#1a1a1a] border border-purple-500/20 rounded px-4 py-3 text-sm text-[#f0ece4] placeholder:text-[#888]/50 focus:border-purple-400/40 focus:outline-none w-full min-h-[100px]" placeholder="What's your question?" value={question} onChange={e => setQuestion(e.target.value)} required />
              <button type="submit" className="mt-3 bg-purple-600 text-white font-bold text-sm rounded px-6 py-2.5 hover:bg-purple-500 transition-all flex items-center gap-2"><Send className="size-4" /> Submit Question</button>
            </>
          )}
        </form>

        {/* Featured Questions */}
        {(featured?.length ?? 0) > 0 && (
          <div className="mb-12">
            <h2 className="font-display text-2xl tracking-wider mb-6 flex items-center gap-2"><Star className="size-5 text-[#D4A843]" /> <span className="text-[#D4A843]">FEATURED</span></h2>
            <div className="space-y-4">
              {featured?.map(q => (
                <div key={q._id} className="bg-[#141414]/80 border border-[#D4A843]/20 rounded-lg p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-8 h-8 rounded-full bg-[#D4A843]/20 flex items-center justify-center text-[#D4A843] font-display text-sm">{q.fanName.charAt(0)}</div>
                    <div><p className="text-sm font-medium text-[#f0ece4]">{q.fanName}</p>{q.category && <p className="text-[9px] text-[#D4A843] tracking-widest uppercase">{q.category}</p>}</div>
                  </div>
                  <p className="text-[#ccc] mb-4">❓ {q.question}</p>
                  {q.answer && (
                    <div className="bg-[#D4A843]/5 border-l-3 border-[#D4A843] pl-4 py-3 rounded-r">
                      <p className="text-[10px] font-bold tracking-widest text-[#D4A843] mb-1">MONTRELL'S ANSWER</p>
                      <p className="text-[#f0ece4] text-sm">{q.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Answered */}
        <h2 className="font-display text-2xl tracking-wider mb-6 text-[#f0ece4]">ALL Q&A</h2>
        <div className="space-y-3">
          {approved?.filter(q => q.answer).map(q => (
            <div key={q._id} className="bg-[#141414]/60 border border-[#D4A843]/10 rounded-lg p-5 hover:border-[#D4A843]/20 transition-colors">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm font-medium text-[#D4A843]">{q.fanName}</span>
                {q.category && <span className="text-[8px] tracking-widest uppercase text-[#555] bg-[#1a1a1a] px-2 py-0.5 rounded">{q.category}</span>}
              </div>
              <p className="text-[#ccc] text-sm mb-3">❓ {q.question}</p>
              <div className="bg-[#0a0a0a]/60 border-l-2 border-[#D4A843]/40 pl-3 py-2">
                <p className="text-sm text-[#f0ece4]">💬 {q.answer}</p>
              </div>
            </div>
          ))}
          {(!approved || approved.filter(q => q.answer).length === 0) && (
            <div className="text-center py-16 text-[#888]">
              <MessageSquare className="size-12 mx-auto mb-4 opacity-30" />
              <p>No answered questions yet. Be the first to ask!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
