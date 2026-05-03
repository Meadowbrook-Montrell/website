/**
 * Business Operations Hub — Convex Functions
 * Calendar, Guest CRM, Bookings, Revenue, Sponsors,
 * Newsletters, Show Notes, Link-in-Bio, Community, Social Metrics
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══════════════════════════════════════════════════════════
//  1. CONTENT CALENDAR
// ═══════════════════════════════════════════════════════════

export const getCalendarEvents = query({
  args: { month: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.month) {
      const events = await ctx.db.query("calendarEvents").collect();
      return events.filter((e) => e.date.startsWith(args.month!));
    }
    return await ctx.db.query("calendarEvents").order("desc").collect();
  },
});

export const addCalendarEvent = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(),
    date: v.string(),
    time: v.optional(v.string()),
    status: v.string(),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("calendarEvents", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateCalendarEvent = mutation({
  args: {
    id: v.id("calendarEvents"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    type: v.optional(v.string()),
    date: v.optional(v.string()),
    time: v.optional(v.string()),
    status: v.optional(v.string()),
    color: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteCalendarEvent = mutation({
  args: { id: v.id("calendarEvents") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ═══════════════════════════════════════════════════════════
//  2. GUEST CRM
// ═══════════════════════════════════════════════════════════

export const getGuestCRM = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db.query("guestCRM").withIndex("by_status", (q) => q.eq("status", args.status!)).collect();
    }
    return await ctx.db.query("guestCRM").order("desc").collect();
  },
});

export const addGuestCRM = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    youtube: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    status: v.string(),
    interviewDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const now = new Date().toISOString();
    return await ctx.db.insert("guestCRM", { ...args, createdAt: now, updatedAt: now });
  },
});

export const updateGuestCRM = mutation({
  args: {
    id: v.id("guestCRM"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    youtube: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    interviewDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, { ...cleaned, updatedAt: new Date().toISOString() });
  },
});

export const deleteGuestCRM = mutation({
  args: { id: v.id("guestCRM") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  3. GUEST BOOKINGS
// ═══════════════════════════════════════════════════════════

export const getBookings = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db.query("bookings").withIndex("by_status", (q) => q.eq("status", args.status!)).collect();
    }
    return await ctx.db.query("bookings").order("desc").collect();
  },
});

export const addBooking = mutation({
  args: {
    guestName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    socialHandle: v.optional(v.string()),
    topic: v.string(),
    preferredDate: v.string(),
    preferredTime: v.optional(v.string()),
    message: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("bookings", {
      ...args,
      status: "pending",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateBookingStatus = mutation({
  args: { id: v.id("bookings"), status: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { status: args.status });
  },
});

export const deleteBooking = mutation({
  args: { id: v.id("bookings") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  4. SPONSORS / BRAND DEALS
// ═══════════════════════════════════════════════════════════

export const getSponsors = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) {
      return await ctx.db.query("sponsors").withIndex("by_status", (q) => q.eq("status", args.status!)).collect();
    }
    return await ctx.db.query("sponsors").order("desc").collect();
  },
});

export const addSponsor = mutation({
  args: {
    companyName: v.string(),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    dealType: v.string(),
    amount: v.optional(v.number()),
    status: v.string(),
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("sponsors", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateSponsor = mutation({
  args: {
    id: v.id("sponsors"),
    companyName: v.optional(v.string()),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    status: v.optional(v.string()),
    amount: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteSponsor = mutation({
  args: { id: v.id("sponsors") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  5. REVENUE TRACKING
// ═══════════════════════════════════════════════════════════

export const getRevenue = query({
  args: { month: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("revenue").order("desc").collect();
    if (args.month) return all.filter((r) => r.date.startsWith(args.month!));
    return all;
  },
});

export const getRevenueStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("revenue").collect();
    const total = all.reduce((sum, r) => sum + r.amount, 0);
    const received = all.filter((r) => r.status === "received").reduce((sum, r) => sum + r.amount, 0);
    const pending = all.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0);
    const bySource: Record<string, number> = {};
    all.forEach((r) => { bySource[r.source] = (bySource[r.source] || 0) + r.amount; });
    return { total, received, pending, bySource, count: all.length };
  },
});

export const addRevenue = mutation({
  args: {
    source: v.string(),
    amount: v.number(),
    description: v.string(),
    date: v.string(),
    status: v.string(),
    sponsorId: v.optional(v.id("sponsors")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("revenue", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateRevenue = mutation({
  args: { id: v.id("revenue"), status: v.optional(v.string()), amount: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteRevenue = mutation({
  args: { id: v.id("revenue") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  6. NEWSLETTERS
// ═══════════════════════════════════════════════════════════

export const getNewsletters = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("newsletters").order("desc").collect();
  },
});

export const addNewsletter = mutation({
  args: {
    subject: v.string(),
    body: v.string(),
    status: v.string(),
    scheduledAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("newsletters", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateNewsletter = mutation({
  args: {
    id: v.id("newsletters"),
    subject: v.optional(v.string()),
    body: v.optional(v.string()),
    status: v.optional(v.string()),
    scheduledAt: v.optional(v.string()),
    sentAt: v.optional(v.string()),
    recipientCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteNewsletter = mutation({
  args: { id: v.id("newsletters") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

export const sendNewsletter = mutation({
  args: { id: v.id("newsletters") },
  handler: async (ctx, args) => {
    const subscribers = await ctx.db.query("subscribers").collect();
    const count = subscribers.length;
    await ctx.db.patch(args.id, {
      status: "sent",
      sentAt: new Date().toISOString(),
      recipientCount: count,
    });
    return { sent: count };
  },
});

// ═══════════════════════════════════════════════════════════
//  7. SHOW NOTES
// ═══════════════════════════════════════════════════════════

export const getShowNotes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("showNotes").order("desc").collect();
  },
});

export const addShowNotes = mutation({
  args: {
    contentId: v.optional(v.id("content")),
    episodeTitle: v.string(),
    summary: v.optional(v.string()),
    timestamps: v.optional(v.array(v.object({ time: v.string(), label: v.string() }))),
    keyQuotes: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("showNotes", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateShowNotes = mutation({
  args: {
    id: v.id("showNotes"),
    summary: v.optional(v.string()),
    timestamps: v.optional(v.array(v.object({ time: v.string(), label: v.string() }))),
    keyQuotes: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteShowNotes = mutation({
  args: { id: v.id("showNotes") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  8. LINK-IN-BIO
// ═══════════════════════════════════════════════════════════

export const getLinkBioItems = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("linkBioItems").collect();
    const items = args.activeOnly ? all.filter((i) => i.isActive) : all;
    return items.sort((a, b) => a.order - b.order);
  },
});

export const addLinkBioItem = mutation({
  args: {
    title: v.string(),
    url: v.string(),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("linkBioItems", { ...args, clicks: 0, createdAt: new Date().toISOString() });
  },
});

export const updateLinkBioItem = mutation({
  args: {
    id: v.id("linkBioItems"),
    title: v.optional(v.string()),
    url: v.optional(v.string()),
    icon: v.optional(v.string()),
    color: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const trackLinkClick = mutation({
  args: { id: v.id("linkBioItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (item) {
      await ctx.db.patch(args.id, { clicks: (item.clicks || 0) + 1 });
    }
  },
});

export const deleteLinkBioItem = mutation({
  args: { id: v.id("linkBioItems") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  9. COMMUNITY BOARD
// ═══════════════════════════════════════════════════════════

export const getCommunityPosts = query({
  args: { approvedOnly: v.optional(v.boolean()), type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("communityPosts").order("desc").collect();
    if (args.approvedOnly) posts = posts.filter((p) => p.isApproved);
    if (args.type) posts = posts.filter((p) => p.type === args.type);
    return posts;
  },
});

export const addCommunityPost = mutation({
  args: {
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    message: v.string(),
    type: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("communityPosts", {
      ...args,
      isApproved: false,
      likes: 0,
      createdAt: new Date().toISOString(),
    });
  },
});

export const approveCommunityPost = mutation({
  args: { id: v.id("communityPosts"), isApproved: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isApproved: args.isApproved });
  },
});

export const pinCommunityPost = mutation({
  args: { id: v.id("communityPosts"), isPinned: v.boolean() },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { isPinned: args.isPinned });
  },
});

export const likeCommunityPost = mutation({
  args: { id: v.id("communityPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) {
      await ctx.db.patch(args.id, { likes: (post.likes || 0) + 1 });
    }
  },
});

export const deleteCommunityPost = mutation({
  args: { id: v.id("communityPosts") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  10. SOCIAL MEDIA METRICS
// ═══════════════════════════════════════════════════════════

export const getSocialMetrics = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("socialMetrics").collect();
  },
});

export const upsertSocialMetrics = mutation({
  args: {
    platform: v.string(),
    followers: v.optional(v.number()),
    totalViews: v.optional(v.number()),
    totalLikes: v.optional(v.number()),
    totalVideos: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("socialMetrics")
      .withIndex("by_platform", (q) => q.eq("platform", args.platform))
      .first();
    const data = { ...args, lastUpdated: new Date().toISOString() };
    if (existing) {
      const { platform: _, ...updates } = data;
      await ctx.db.patch(existing._id, updates);
    } else {
      await ctx.db.insert("socialMetrics", data);
    }
  },
});

// ═══════════════════════════════════════════════════════════
//  COMBINED DASHBOARD STATS
// ═══════════════════════════════════════════════════════════

export const getOperationsStats = query({
  args: {},
  handler: async (ctx) => {
    const [guests, bookings, sponsors, revenue, subscribers, content, community, newsletters] = await Promise.all([
      ctx.db.query("guestCRM").collect(),
      ctx.db.query("bookings").collect(),
      ctx.db.query("sponsors").collect(),
      ctx.db.query("revenue").collect(),
      ctx.db.query("subscribers").collect(),
      ctx.db.query("content").collect(),
      ctx.db.query("communityPosts").collect(),
      ctx.db.query("newsletters").collect(),
    ]);

    return {
      totalGuests: guests.length,
      pendingBookings: bookings.filter((b) => b.status === "pending").length,
      activeSponsors: sponsors.filter((s) => s.status === "active").length,
      totalRevenue: revenue.reduce((sum, r) => sum + r.amount, 0),
      pendingRevenue: revenue.filter((r) => r.status === "pending").reduce((sum, r) => sum + r.amount, 0),
      totalSubscribers: subscribers.length,
      totalContent: content.length,
      pendingCommunity: community.filter((p) => !p.isApproved).length,
      sentNewsletters: newsletters.filter((n) => n.status === "sent").length,
      guestsByStatus: {
        pitched: guests.filter((g) => g.status === "pitched").length,
        confirmed: guests.filter((g) => g.status === "confirmed").length,
        recorded: guests.filter((g) => g.status === "recorded").length,
        published: guests.filter((g) => g.status === "published").length,
      },
    };
  },
});
