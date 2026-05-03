import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

/* ═══════════════════════════════════════════════════════════
   PHASE 3: 15 New Feature Backend Functions
   ═══════════════════════════════════════════════════════════ */

// ─── EXPENSES ───────────────────────────────────────────────
export const listExpenses = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("expenses").order("desc").collect();
}});
export const addExpense = mutation({
  args: { title: v.optional(v.string()), description: v.optional(v.string()), category: v.string(), amount: v.number(), vendor: v.optional(v.string()), date: v.string(), isRecurring: v.optional(v.boolean()), isDeductible: v.optional(v.boolean()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { return await ctx.db.insert("expenses", { ...args, createdAt: new Date().toISOString() }); },
});
export const deleteExpense = mutation({ args: { id: v.id("expenses") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});
export const getExpenseStats = query({ args: {}, handler: async (ctx) => {
  const all = await ctx.db.query("expenses").collect();
  const now = new Date();
  const thisMonth = all.filter(e => e.date.startsWith(now.toISOString().slice(0, 7)));
  const byCategory: Record<string, number> = {};
  all.forEach(e => { byCategory[e.category] = (byCategory[e.category] || 0) + e.amount; });
  return { total: all.reduce((s, e) => s + e.amount, 0), thisMonth: thisMonth.reduce((s, e) => s + e.amount, 0), count: all.length, byCategory };
}});

// ─── CONTRACTS ──────────────────────────────────────────────
export const listContracts = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("contracts").order("desc").collect();
}});
export const addContract = mutation({
  args: { title: v.string(), party: v.string(), partyEmail: v.optional(v.string()), type: v.string(), content: v.optional(v.string()), amount: v.optional(v.number()), expiresAt: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { return await ctx.db.insert("contracts", { ...args, status: "draft", createdAt: new Date().toISOString() }); },
});
export const updateContractStatus = mutation({
  args: { id: v.id("contracts"), status: v.string() },
  handler: async (ctx, { id, status }) => {
    const updates: any = { status };
    if (status === "signed") updates.signedAt = new Date().toISOString();
    await ctx.db.patch(id, updates);
  },
});
export const deleteContract = mutation({ args: { id: v.id("contracts") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});

// ─── AI CONTENT ─────────────────────────────────────────────
export const listAIContent = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("aiContent").order("desc").collect();
}});
export const addAIContent = mutation({
  args: { sourceTitle: v.string(), type: v.string(), platform: v.optional(v.string()), generatedText: v.string() },
  handler: async (ctx, args) => { return await ctx.db.insert("aiContent", { ...args, isSaved: false, isUsed: false, createdAt: new Date().toISOString() }); },
});
export const toggleAISaved = mutation({
  args: { id: v.id("aiContent") },
  handler: async (ctx, { id }) => { const doc = await ctx.db.get(id); if (doc) await ctx.db.patch(id, { isSaved: !doc.isSaved }); },
});
export const markAIUsed = mutation({
  args: { id: v.id("aiContent") },
  handler: async (ctx, { id }) => { await ctx.db.patch(id, { isUsed: true }); },
});
export const deleteAIContent = mutation({ args: { id: v.id("aiContent") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});

// ─── FOLLOW-UPS ─────────────────────────────────────────────
export const listFollowUps = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("followUps").order("desc").collect();
}});
export const addFollowUp = mutation({
  args: { contactName: v.string(), contactEmail: v.optional(v.string()), contactType: v.string(), reason: v.string(), dueDate: v.string(), priority: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { return await ctx.db.insert("followUps", { ...args, status: "pending", createdAt: new Date().toISOString() }); },
});
export const completeFollowUp = mutation({
  args: { id: v.id("followUps") },
  handler: async (ctx, { id }) => { await ctx.db.patch(id, { status: "completed", completedAt: new Date().toISOString() }); },
});
export const snoozeFollowUp = mutation({
  args: { id: v.id("followUps"), newDate: v.string() },
  handler: async (ctx, { id, newDate }) => { await ctx.db.patch(id, { status: "snoozed", dueDate: newDate }); },
});
export const deleteFollowUp = mutation({ args: { id: v.id("followUps") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});
export const getOverdueFollowUps = query({ args: {}, handler: async (ctx) => {
  const pending = await ctx.db.query("followUps").withIndex("by_status", q => q.eq("status", "pending")).collect();
  const now = new Date().toISOString();
  return pending.filter(f => f.dueDate < now);
}});

// ─── PUBLISHING PIPELINE ────────────────────────────────────
export const listPipeline = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("pipeline").order("desc").collect();
}});
export const addPipelineItem = mutation({
  args: { title: v.string(), contentType: v.string(), stage: v.string(), platforms: v.optional(v.string()), scheduledDate: v.optional(v.string()), assignedTo: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { return await ctx.db.insert("pipeline", { ...args, createdAt: new Date().toISOString() }); },
});
export const updatePipelineStage = mutation({
  args: { id: v.id("pipeline"), stage: v.string() },
  handler: async (ctx, { id, stage }) => {
    const updates: any = { stage };
    if (stage === "published") updates.publishedDate = new Date().toISOString();
    await ctx.db.patch(id, updates);
  },
});
export const deletePipelineItem = mutation({ args: { id: v.id("pipeline") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});

// ─── FAN Q&A ────────────────────────────────────────────────
export const listFanQA = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("fanQA").order("desc").collect();
}});
export const getApprovedQA = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("fanQA").withIndex("by_approved", q => q.eq("isApproved", true)).collect();
}});
export const getFeaturedQA = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("fanQA").withIndex("by_featured", q => q.eq("isFeatured", true)).collect();
}});
export const submitFanQuestion = mutation({
  args: { fanName: v.string(), fanEmail: v.optional(v.string()), question: v.string(), category: v.optional(v.string()) },
  handler: async (ctx, args) => { return await ctx.db.insert("fanQA", { ...args, isApproved: false, isFeatured: false, upvotes: 0, createdAt: new Date().toISOString() }); },
});
export const answerQuestion = mutation({
  args: { id: v.id("fanQA"), answer: v.string() },
  handler: async (ctx, { id, answer }) => { await ctx.db.patch(id, { answer, answeredAt: new Date().toISOString(), isApproved: true }); },
});
export const toggleQAFeatured = mutation({
  args: { id: v.id("fanQA") },
  handler: async (ctx, { id }) => { const doc = await ctx.db.get(id); if (doc) await ctx.db.patch(id, { isFeatured: !doc.isFeatured }); },
});
export const approveQuestion = mutation({
  args: { id: v.id("fanQA") },
  handler: async (ctx, { id }) => { await ctx.db.patch(id, { isApproved: true }); },
});
export const deleteFanQA = mutation({ args: { id: v.id("fanQA") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});

// ─── FAN LEADERBOARD ────────────────────────────────────────
export const getLeaderboard = query({ args: {}, handler: async (ctx) => {
  const all = await ctx.db.query("fanPoints").collect();
  return all.sort((a, b) => b.points - a.points).slice(0, 50);
}});
export const addOrUpdateFanPoints = mutation({
  args: { fanName: v.string(), fanEmail: v.optional(v.string()), points: v.number(), reason: v.string() },
  handler: async (ctx, { fanName, fanEmail, points, reason }) => {
    const all = await ctx.db.query("fanPoints").collect();
    const existing = all.find(f => f.fanName.toLowerCase() === fanName.toLowerCase());
    if (existing) {
      const newPoints = existing.points + points;
      const level = newPoints >= 1000 ? "legend" : newPoints >= 500 ? "vip" : newPoints >= 100 ? "regular" : "rookie";
      await ctx.db.patch(existing._id, { points: newPoints, level, lastActive: new Date().toISOString() });
    } else {
      const level = points >= 1000 ? "legend" : points >= 500 ? "vip" : points >= 100 ? "regular" : "rookie";
      await ctx.db.insert("fanPoints", { fanName, fanEmail, points, level, createdAt: new Date().toISOString(), lastActive: new Date().toISOString() });
    }
  },
});

// ─── BREAKING NEWS ALERTS ───────────────────────────────────
export const getActiveAlerts = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("breakingAlerts").withIndex("by_active", q => q.eq("isActive", true)).collect();
}});
export const listAllAlerts = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("breakingAlerts").order("desc").collect();
}});
export const addAlert = mutation({
  args: { headline: v.string(), message: v.optional(v.string()), linkUrl: v.optional(v.string()), linkText: v.optional(v.string()), severity: v.string(), expiresAt: v.optional(v.string()) },
  handler: async (ctx, args) => { return await ctx.db.insert("breakingAlerts", { ...args, isActive: true, createdAt: new Date().toISOString() }); },
});
export const toggleAlert = mutation({
  args: { id: v.id("breakingAlerts") },
  handler: async (ctx, { id }) => { const doc = await ctx.db.get(id); if (doc) await ctx.db.patch(id, { isActive: !doc.isActive }); },
});
export const deleteAlert = mutation({ args: { id: v.id("breakingAlerts") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});

// ─── EXCLUSIVE CONTENT ──────────────────────────────────────
export const listExclusiveContent = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("exclusiveContent").order("desc").collect();
}});
export const getPublishedExclusive = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("exclusiveContent").withIndex("by_published", q => q.eq("isPublished", true)).collect();
}});
export const addExclusiveContent = mutation({
  args: { title: v.string(), description: v.optional(v.string()), contentType: v.string(), contentUrl: v.optional(v.string()), youtubeId: v.optional(v.string()), thumbnailUrl: v.optional(v.string()), accessLevel: v.string() },
  handler: async (ctx, args) => { return await ctx.db.insert("exclusiveContent", { ...args, isPublished: false, createdAt: new Date().toISOString() }); },
});
export const publishExclusive = mutation({
  args: { id: v.id("exclusiveContent") },
  handler: async (ctx, { id }) => { await ctx.db.patch(id, { isPublished: true, publishedAt: new Date().toISOString() }); },
});
export const deleteExclusive = mutation({ args: { id: v.id("exclusiveContent") }, handler: async (ctx, { id }) => { await ctx.db.delete(id); }});

// ─── UNIFIED REVENUE DASHBOARD ──────────────────────────────
export const getUnifiedRevenue = query({ args: {}, handler: async (ctx) => {
  const donations = await ctx.db.query("donations").collect();
  const sponsors = await ctx.db.query("sponsors").collect();
  const invoices = await ctx.db.query("invoices").collect();
  const revenue = await ctx.db.query("revenue").collect();
  const expenses = await ctx.db.query("expenses").collect();
  const orders = await ctx.db.query("merchOrders").collect();

  const totalDonations = donations.reduce((s, d) => s + (d.amount || 0), 0);
  const totalSponsors = sponsors.reduce((s, sp) => s + (sp.amount || 0), 0);
  const totalInvoices = invoices.filter(i => i.status === "paid").reduce((s, i) => s + ((i as any).total || (i as any).amount || 0), 0);
  const totalRevenue = revenue.reduce((s, r) => s + (r.amount || 0), 0);
  const totalExpenses = expenses.reduce((s, e) => s + (e.amount || 0), 0);
  const totalMerch = orders.filter(o => o.status === "delivered").reduce((s, o) => s + ((o as any).total || 0), 0);

  const grossIncome = totalDonations + totalSponsors + totalInvoices + totalRevenue + totalMerch;

  return {
    grossIncome, totalExpenses, netProfit: grossIncome - totalExpenses,
    breakdown: { donations: totalDonations, sponsors: totalSponsors, invoices: totalInvoices, revenue: totalRevenue, merch: totalMerch },
    expenseTotal: totalExpenses,
  };
}});

// ─── CONTENT SEED (populate admin from landing page defaults) ──
export const seedContent = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if content already seeded
    const existing = await ctx.db.query("content").collect();
    if (existing.length > 0) return { seeded: false, message: "Content already exists" };

    const videos = [
      { title: "3GMG TAMUNO On Booker T Block", youtubeId: "of9vm8OHu0c", category: "street-reporting" },
      { title: "2 Chainz Stops in Fort Worth", youtubeId: "o9fF-4SYo00", category: "interview" },
      { title: "ThirdGate Tamuno Tappin In With HeadHuncho Amir", youtubeId: "HgJznP2LATA", category: "interview" },
      { title: "Twisted Black — \"I'm A Fool Wit It\"", youtubeId: "Mvb41IsSHEM", category: "music" },
      { title: "Two Legends From Different Era", youtubeId: "FSjcJB0GjT0", category: "interview" },
      { title: "MO3 Showed Love to Fort Worth", youtubeId: "QeVyLrkqci4", category: "interview" },
      { title: "Taco Bell Employee Opens Fire", youtubeId: "pVGl7kCNSnI", category: "street-reporting" },
      { title: "TERRIBLE Experience Meeting Beyoncé's Mother", youtubeId: "G__yVg07kSg", category: "podcast" },
      { title: "LIFE SENTENCE For A Crime You Didn't Do?", youtubeId: "K41_4LTlzww", category: "podcast" },
      { title: "Yung Deco Interview", youtubeId: "ufUQcipbtmw", category: "interview" },
      { title: "Twisted Black Interview", youtubeId: "ETyWsOCWxtg", category: "interview" },
      { title: "DFW Shaka Interview", youtubeId: "q5IEpbLpvno", category: "interview" },
      { title: "Fort Worth Legend McHenry", youtubeId: "0BbxgRKk_sU", category: "interview" },
    ];

    for (const vid of videos) {
      await ctx.db.insert("content", {
        title: vid.title,
        description: "",
        category: vid.category,
        youtubeId: vid.youtubeId,
        platform: "youtube",
        featured: false,
        publishedAt: new Date().toISOString(),
      });
    }

    // Seed guests
    const existingGuests = await ctx.db.query("guests").collect();
    if (existingGuests.length === 0) {
      const guests = [
        { name: "Yung Deco", title: "Rapper / Artist", quote: "More albums than Lil Flip — the grind don't stop." },
        { name: "Twisted Black", title: "Rapper / Entertainer", quote: "Connecting with the people is what it's all about." },
        { name: "DFW Shaka", title: "Community Voice", quote: "Somebody gotta expose the truth — that's what we do." },
        { name: "Fort Worth Legend McHenry", title: "OG / Legend", quote: "The streets remember everything." },
      ];
      for (const g of guests) {
        await ctx.db.insert("guests", { ...g, featured: true, imageUrl: undefined });
      }
    }

    // Seed merch products
    const existingMerch = await ctx.db.query("merchProducts").collect();
    if (existingMerch.length === 0) {
      const merch = [
        { name: "3GMG Classic Tee", price: 35, category: "apparel", status: "active", inventory: 50 },
        { name: "Hood's Paparazzi Hoodie", price: 55, category: "apparel", status: "active", inventory: 30 },
        { name: "Meadowbrook Snapback", price: 30, category: "accessories", status: "active", inventory: 40 },
        { name: "Fort Worth Rep Tee", price: 35, category: "apparel", status: "active", inventory: 25 },
      ];
      for (const m of merch) {
        await ctx.db.insert("merchProducts", { ...m, description: "", imageUrl: undefined, createdAt: new Date().toISOString() });
      }
    }

    return { seeded: true, message: `Seeded ${videos.length} videos, guests, and merch` };
  },
});
