/**
 * Consumer-facing features — Convex Functions
 * Blog, Events, Fan Submissions, Search, Trending
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══════════════════════════════════════════════════════════
//  BLOG
// ═══════════════════════════════════════════════════════════

export const getPublishedPosts = query({
  args: { category: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("blogPosts").withIndex("by_published", (q) => q.eq("isPublished", true)).order("desc").collect();
    if (args.category) posts = posts.filter((p) => p.category === args.category);
    if (args.limit) posts = posts.slice(0, args.limit);
    return posts;
  },
});

export const getPostBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    const posts = await ctx.db.query("blogPosts").withIndex("by_slug", (q) => q.eq("slug", args.slug)).collect();
    return posts[0] || null;
  },
});

export const getAllPosts = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let posts = await ctx.db.query("blogPosts").order("desc").collect();
    if (args.category) posts = posts.filter((p) => p.category === args.category);
    return posts;
  },
});

export const addBlogPost = mutation({
  args: {
    title: v.string(), slug: v.string(), excerpt: v.optional(v.string()),
    body: v.string(), coverImageUrl: v.optional(v.string()),
    category: v.string(), tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(), authorName: v.optional(v.string()),
    relatedEpisodeId: v.optional(v.id("content")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("blogPosts", {
      ...args, views: 0,
      publishedAt: args.isPublished ? new Date().toISOString() : undefined,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateBlogPost = mutation({
  args: {
    id: v.id("blogPosts"), title: v.optional(v.string()),
    slug: v.optional(v.string()), excerpt: v.optional(v.string()),
    body: v.optional(v.string()), coverImageUrl: v.optional(v.string()),
    category: v.optional(v.string()), isPublished: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned: Record<string, any> = {};
    Object.entries(updates).forEach(([k, val]) => { if (val !== undefined) cleaned[k] = val; });
    if (cleaned.isPublished === true) {
      const post = await ctx.db.get(id);
      if (post && !post.publishedAt) cleaned.publishedAt = new Date().toISOString();
    }
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteBlogPost = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

export const incrementPostViews = mutation({
  args: { id: v.id("blogPosts") },
  handler: async (ctx, args) => {
    const post = await ctx.db.get(args.id);
    if (post) await ctx.db.patch(args.id, { views: (post.views || 0) + 1 });
  },
});

// ═══════════════════════════════════════════════════════════
//  PUBLIC EVENTS
// ═══════════════════════════════════════════════════════════

export const getPublicEvents = query({
  args: { upcoming: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let events = await ctx.db.query("publicEvents").withIndex("by_published", (q) => q.eq("isPublished", true)).order("desc").collect();
    if (args.upcoming) {
      const now = new Date().toISOString().slice(0, 10);
      events = events.filter((e) => e.date >= now).reverse(); // chronological for upcoming
    }
    return events;
  },
});

export const getAllEvents = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("publicEvents").order("desc").collect();
  },
});

export const getEventById = query({
  args: { id: v.id("publicEvents") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const addEvent = mutation({
  args: {
    title: v.string(), description: v.string(), eventType: v.string(),
    date: v.string(), time: v.optional(v.string()), endTime: v.optional(v.string()),
    location: v.optional(v.string()), address: v.optional(v.string()),
    isVirtual: v.optional(v.boolean()), streamUrl: v.optional(v.string()),
    ticketUrl: v.optional(v.string()), ticketPrice: v.optional(v.number()),
    isFree: v.optional(v.boolean()), imageUrl: v.optional(v.string()),
    maxAttendees: v.optional(v.number()), isPublished: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("publicEvents", { ...args, rsvpCount: 0, createdAt: new Date().toISOString() });
  },
});

export const updateEvent = mutation({
  args: {
    id: v.id("publicEvents"), title: v.optional(v.string()),
    description: v.optional(v.string()), date: v.optional(v.string()),
    time: v.optional(v.string()), isPublished: v.optional(v.boolean()),
    location: v.optional(v.string()), ticketUrl: v.optional(v.string()),
    streamUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteEvent = mutation({
  args: { id: v.id("publicEvents") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// RSVP
export const submitRSVP = mutation({
  args: {
    eventId: v.id("publicEvents"), name: v.string(), email: v.string(),
    phone: v.optional(v.string()), attendees: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("eventRsvps", { ...args, createdAt: new Date().toISOString() });
    // Increment RSVP count
    const event = await ctx.db.get(args.eventId);
    if (event) await ctx.db.patch(args.eventId, { rsvpCount: (event.rsvpCount || 0) + (args.attendees || 1) });
    // Notification
    await ctx.db.insert("notifications", {
      type: "booking", title: "New RSVP",
      message: `${args.name} RSVP'd for ${event?.title || "an event"}`,
      isRead: false, createdAt: new Date().toISOString(),
    });
    return id;
  },
});

export const getEventRsvps = query({
  args: { eventId: v.id("publicEvents") },
  handler: async (ctx, args) => {
    return await ctx.db.query("eventRsvps").withIndex("by_event", (q) => q.eq("eventId", args.eventId)).collect();
  },
});

// ═══════════════════════════════════════════════════════════
//  FAN SUBMISSIONS
// ═══════════════════════════════════════════════════════════

export const getApprovedSubmissions = query({
  args: { type: v.optional(v.string()), limit: v.optional(v.number()) },
  handler: async (ctx, args) => {
    let subs = await ctx.db.query("fanSubmissions").withIndex("by_approved", (q) => q.eq("isApproved", true)).order("desc").collect();
    if (args.type) subs = subs.filter((s) => s.type === args.type);
    if (args.limit) subs = subs.slice(0, args.limit);
    return subs;
  },
});

export const getFeaturedSubmissions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("fanSubmissions").withIndex("by_featured", (q) => q.eq("isFeatured", true)).order("desc").collect();
  },
});

export const getAllSubmissions = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let subs = await ctx.db.query("fanSubmissions").order("desc").collect();
    if (args.type) subs = subs.filter((s) => s.type === args.type);
    return subs;
  },
});

export const submitFanMessage = mutation({
  args: {
    name: v.string(), email: v.optional(v.string()),
    type: v.string(), message: v.string(),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("fanSubmissions", { ...args, isApproved: false, isFeatured: false, createdAt: new Date().toISOString() });
    await ctx.db.insert("notifications", {
      type: "community", title: "New Fan Submission",
      message: `${args.name} sent a ${args.type}: "${args.message.slice(0, 50)}..."`,
      isRead: false, createdAt: new Date().toISOString(),
    });
    return id;
  },
});

export const approveFanSubmission = mutation({
  args: { id: v.id("fanSubmissions"), isApproved: v.boolean(), isFeatured: v.optional(v.boolean()), adminResponse: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    await ctx.db.patch(id, updates);
  },
});

export const deleteFanSubmission = mutation({
  args: { id: v.id("fanSubmissions") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  SITEWIDE SEARCH
// ═══════════════════════════════════════════════════════════

export const siteSearch = query({
  args: { q: v.string() },
  handler: async (ctx, args) => {
    const query = args.q.toLowerCase().trim();
    if (!query || query.length < 2) return { content: [], blog: [], guests: [], events: [] };

    const [content, blog, guests, events] = await Promise.all([
      ctx.db.query("content").collect(),
      ctx.db.query("blogPosts").withIndex("by_published", (q) => q.eq("isPublished", true)).collect(),
      ctx.db.query("guests").collect(),
      ctx.db.query("publicEvents").withIndex("by_published", (q) => q.eq("isPublished", true)).collect(),
    ]);

    const matchContent = content.filter((c) =>
      c.title.toLowerCase().includes(query) ||
      c.description.toLowerCase().includes(query) ||
      c.tags?.some((t) => t.toLowerCase().includes(query))
    ).slice(0, 10);

    const matchBlog = blog.filter((b) =>
      b.title.toLowerCase().includes(query) ||
      (b.excerpt || "").toLowerCase().includes(query) ||
      b.body.toLowerCase().includes(query) ||
      b.tags?.some((t) => t.toLowerCase().includes(query))
    ).slice(0, 10);

    const matchGuests = guests.filter((g) =>
      g.name.toLowerCase().includes(query) ||
      (g.title || "").toLowerCase().includes(query) ||
      (g.quote || "").toLowerCase().includes(query)
    ).slice(0, 10);

    const matchEvents = events.filter((e) =>
      e.title.toLowerCase().includes(query) ||
      e.description.toLowerCase().includes(query) ||
      (e.location || "").toLowerCase().includes(query)
    ).slice(0, 10);

    return { content: matchContent, blog: matchBlog, guests: matchGuests, events: matchEvents };
  },
});

// ═══════════════════════════════════════════════════════════
//  TRENDING / MOST VIEWED
// ═══════════════════════════════════════════════════════════

export const getTrending = query({
  args: {},
  handler: async (ctx) => {
    // Get most recent content + most viewed blog posts
    const content = await ctx.db.query("content").order("desc").collect();
    const blog = await ctx.db.query("blogPosts").withIndex("by_published", (q) => q.eq("isPublished", true)).collect();

    // Sort blog by views desc
    const topBlog = [...blog].sort((a, b) => (b.views || 0) - (a.views || 0)).slice(0, 3);

    // Most recent content (last 7 days or top 6)
    const recentContent = content.slice(0, 6);

    // Featured content
    const featured = content.filter((c) => c.featured).slice(0, 3);

    return { recentContent, topBlog, featured };
  },
});

// ═══════════════════════════════════════════════════════════
//  SITE SETTINGS
// ═══════════════════════════════════════════════════════════

export const getSetting = query({
  args: { key: v.string() },
  handler: async (ctx, args) => {
    const settings = await ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", args.key)).collect();
    return settings[0]?.value || null;
  },
});

export const setSetting = mutation({
  args: { key: v.string(), value: v.string() },
  handler: async (ctx, args) => {
    const existing = await ctx.db.query("siteSettings").withIndex("by_key", (q) => q.eq("key", args.key)).collect();
    if (existing[0]) {
      await ctx.db.patch(existing[0]._id, { value: args.value, updatedAt: new Date().toISOString() });
    } else {
      await ctx.db.insert("siteSettings", { key: args.key, value: args.value, updatedAt: new Date().toISOString() });
    }
  },
});
