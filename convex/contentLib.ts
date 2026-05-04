import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ─── Queries ───

export const listContent = query({
  args: {
    category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    if (args.category) {
      return await ctx.db
        .query("content")
        .withIndex("by_category", (q) => q.eq("category", args.category!))
        .order("desc")
        .collect();
    }
    return await ctx.db.query("content").order("desc").collect();
  },
});

export const getContentById = query({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const getFeaturedContent = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("content")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .collect();
  },
});

export const getUpcomingLiveSessions = query({
  args: {},
  handler: async (ctx) => {
    const now = new Date().toISOString();
    const sessions = await ctx.db
      .query("liveSessions")
      .withIndex("by_scheduled")
      .order("asc")
      .collect();
    // Return upcoming and currently live sessions
    return sessions.filter(
      (s) => !s.isCompleted && (s.scheduledAt >= now || s.isLive)
    );
  },
});

export const getCurrentLiveSession = query({
  args: {},
  handler: async (ctx) => {
    const sessions = await ctx.db
      .query("liveSessions")
      .withIndex("by_live", (q) => q.eq("isLive", true))
      .collect();
    return sessions[0] || null;
  },
});

export const getAllLiveSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db
      .query("liveSessions")
      .withIndex("by_scheduled")
      .order("desc")
      .collect();
  },
});

// ─── Mutations ───

export const addContent = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    category: v.string(),
    youtubeId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
    platform: v.optional(v.string()),
    duration: v.optional(v.string()),
    publishedAt: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("content", args);
  },
});

export const addLiveSession = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    scheduledAt: v.string(),
    platform: v.string(),
    streamUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    isLive: v.optional(v.boolean()),
    isCompleted: v.optional(v.boolean()),
    guestName: v.optional(v.string()),
    guestTitle: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("liveSessions", args);
  },
});

export const updateLiveStatus = mutation({
  args: {
    sessionId: v.id("liveSessions"),
    isLive: v.boolean(),
    isCompleted: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.sessionId, {
      isLive: args.isLive,
      ...(args.isCompleted !== undefined ? { isCompleted: args.isCompleted } : {}),
    });
  },
});

export const deleteContent = mutation({
  args: { id: v.id("content") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

export const deleteLiveSession = mutation({
  args: { id: v.id("liveSessions") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

// ─── A3: Bulk YouTube Import ───
// Imports videos from a YouTube channel using the YouTube Data API v3
export const bulkYoutubeImport = mutation({
  args: {
    videos: v.array(v.object({
      title: v.string(),
      description: v.string(),
      youtubeId: v.string(),
      thumbnailUrl: v.optional(v.string()),
      publishedAt: v.optional(v.string()),
      duration: v.optional(v.string()),
      category: v.optional(v.string()),
    })),
  },
  handler: async (ctx, args) => {
    // Check for existing youtubeIds to avoid duplicates
    const existing = await ctx.db.query("content").collect();
    const existingIds = new Set(existing.map((c: any) => c.youtubeId).filter(Boolean));
    
    let imported = 0;
    for (const video of args.videos) {
      if (existingIds.has(video.youtubeId)) continue;
      await ctx.db.insert("content", {
        title: video.title,
        description: video.description,
        youtubeId: video.youtubeId,
        thumbnailUrl: video.thumbnailUrl || `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`,
        publishedAt: video.publishedAt,
        duration: video.duration,
        category: video.category || "interview",
        featured: false,
      });
      imported++;
    }
    return { imported, skipped: args.videos.length - imported };
  },
});
