import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ─── Admin Auth (server-side password validation) ───
// Password from environment variable — set ADMIN_PASSWORD in Convex dashboard → Settings → Environment Variables
// TODO: Remove the fallback once the env var is configured in the Convex dashboard
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "3GMG817!";

export const verifyAdminPassword = mutation({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    if (args.password !== ADMIN_PASSWORD) {
      return { success: false, token: null };
    }
    // Generate a random session token
    const token = Math.random().toString(36).slice(2) + Date.now().toString(36) + Math.random().toString(36).slice(2);
    const now = new Date();
    const expires = new Date(now.getTime() + 24 * 60 * 60 * 1000); // 24 hours
    await ctx.db.insert("adminSessions", {
      token,
      createdAt: now.toISOString(),
      expiresAt: expires.toISOString(),
    });
    return { success: true, token };
  },
});

export const validateAdminSession = query({
  args: { token: v.string() },
  handler: async (ctx, args) => {
    const session = await ctx.db
      .query("adminSessions")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .first();
    if (!session) return false;
    return new Date(session.expiresAt) > new Date();
  },
});

// ─── Subscribers ───

export const listSubscribers = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("subscribers").order("desc").collect();
  },
});

export const addSubscriber = mutation({
  args: {
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    source: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Check for duplicate email
    if (args.email) {
      const existing = await ctx.db
        .query("subscribers")
        .withIndex("by_email", (q) => q.eq("email", args.email!))
        .first();
      if (existing) return existing._id;
    }
    return await ctx.db.insert("subscribers", {
      ...args,
      subscribedAt: new Date().toISOString(),
    });
  },
});

export const deleteSubscriber = mutation({
  args: { id: v.id("subscribers") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── Ticker Items ───

export const listTickerItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("tickerItems").order("desc").collect();
  },
});

export const getActiveTickerItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("tickerItems")
      .withIndex("by_active", (q) => q.eq("isActive", true))
      .collect();
  },
});

export const addTickerItem = mutation({
  args: {
    text: v.string(),
    isActive: v.boolean(),
    priority: v.optional(v.number()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tickerItems", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateTickerItem = mutation({
  args: {
    id: v.id("tickerItems"),
    text: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    priority: v.optional(v.number()),
    link: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const deleteTickerItem = mutation({
  args: { id: v.id("tickerItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── Guests ───

export const listGuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("guests").order("desc").collect();
  },
});

export const getFeaturedGuests = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("guests")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
  },
});

export const addGuest = mutation({
  args: {
    name: v.string(),
    title: v.optional(v.string()),
    quote: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    episodeUrl: v.optional(v.string()),
    youtubeId: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("guests", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateGuest = mutation({
  args: {
    id: v.id("guests"),
    name: v.optional(v.string()),
    title: v.optional(v.string()),
    quote: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    episodeUrl: v.optional(v.string()),
    youtubeId: v.optional(v.string()),
    featured: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, filtered);
  },
});

export const deleteGuest = mutation({
  args: { id: v.id("guests") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── Page Views / Analytics ───

export const trackPageView = mutation({
  args: {
    page: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("pageViews", {
      ...args,
      timestamp: new Date().toISOString(),
    });
  },
});

export const getPageViewStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("pageViews").collect();

    // Count by page
    const byPage: Record<string, number> = {};
    const byDay: Record<string, number> = {};

    for (const pv of all) {
      byPage[pv.page] = (byPage[pv.page] || 0) + 1;
      const day = pv.timestamp.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    }

    // Last 7 days
    const last7 = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      last7.push({ date: key, views: byDay[key] || 0 });
    }

    return {
      total: all.length,
      byPage,
      last7Days: last7,
    };
  },
});

// ─── Dashboard Summary ───

export const getDashboardStats = query({
  args: {},
  handler: async (ctx) => {
    const content = await ctx.db.query("content").collect();
    const sessions = await ctx.db.query("liveSessions").collect();
    const subscribers = await ctx.db.query("subscribers").collect();
    const pageViews = await ctx.db.query("pageViews").collect();
    const guests = await ctx.db.query("guests").collect();
    const ticker = await ctx.db.query("tickerItems").collect();

    const now = new Date().toISOString();
    const upcomingSessions = sessions.filter(
      (s) => !s.isCompleted && s.scheduledAt >= now
    );
    const liveSessions = sessions.filter((s) => s.isLive);

    // Views today
    const today = new Date().toISOString().slice(0, 10);
    const todayViews = pageViews.filter((pv) =>
      pv.timestamp.startsWith(today)
    ).length;

    return {
      totalContent: content.length,
      totalSessions: sessions.length,
      upcomingSessions: upcomingSessions.length,
      liveSessions: liveSessions.length,
      totalSubscribers: subscribers.length,
      totalPageViews: pageViews.length,
      todayPageViews: todayViews,
      totalGuests: guests.length,
      activeTickerItems: ticker.filter((t) => t.isActive).length,
    };
  },
});
