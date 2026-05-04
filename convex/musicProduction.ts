import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ═══════════════════════════════════════════════════════════
//  MUSIC PRODUCTION COMMAND CENTER — Convex Functions
// ═══════════════════════════════════════════════════════════

// ─── ARTIST ROSTER ──────────────────────────────────────────

export const getArtists = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("artists").order("desc").collect();
  },
});

export const addArtist = mutation({
  args: {
    name: v.string(),
    role: v.string(), // "artist" | "producer" | "engineer" | "songwriter" | "multi"
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    genres: v.optional(v.array(v.string())),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      spotify: v.optional(v.string()),
      appleMusic: v.optional(v.string()),
      youtube: v.optional(v.string()),
      soundcloud: v.optional(v.string()),
      tiktok: v.optional(v.string()),
    })),
    status: v.string(), // "active" | "inactive" | "development"
    signedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("artists", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateArtist = mutation({
  args: {
    id: v.id("artists"),
    name: v.optional(v.string()),
    role: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    genres: v.optional(v.array(v.string())),
    socialLinks: v.optional(v.object({
      instagram: v.optional(v.string()),
      twitter: v.optional(v.string()),
      spotify: v.optional(v.string()),
      appleMusic: v.optional(v.string()),
      youtube: v.optional(v.string()),
      soundcloud: v.optional(v.string()),
      tiktok: v.optional(v.string()),
    })),
    status: v.optional(v.string()),
    signedDate: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteArtist = mutation({
  args: { id: v.id("artists") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ─── PROJECTS (Songs / Albums / EPs) ────────────────────────

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("musicProjects").order("desc").collect();
  },
});

export const addProject = mutation({
  args: {
    title: v.string(),
    type: v.string(), // "single" | "ep" | "album" | "mixtape" | "feature"
    status: v.string(), // "concept" | "writing" | "recording" | "mixing" | "mastering" | "review" | "ready" | "released"
    artistIds: v.optional(v.array(v.string())),
    producerIds: v.optional(v.array(v.string())),
    engineerIds: v.optional(v.array(v.string())),
    genre: v.optional(v.string()),
    bpm: v.optional(v.number()),
    key: v.optional(v.string()),
    mood: v.optional(v.string()),
    targetReleaseDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    priority: v.optional(v.string()), // "low" | "medium" | "high" | "urgent"
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("musicProjects", {
      ...args,
      progress: 0,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateProject = mutation({
  args: {
    id: v.id("musicProjects"),
    title: v.optional(v.string()),
    type: v.optional(v.string()),
    status: v.optional(v.string()),
    artistIds: v.optional(v.array(v.string())),
    producerIds: v.optional(v.array(v.string())),
    engineerIds: v.optional(v.array(v.string())),
    genre: v.optional(v.string()),
    bpm: v.optional(v.number()),
    key: v.optional(v.string()),
    mood: v.optional(v.string()),
    targetReleaseDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    priority: v.optional(v.string()),
    progress: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteProject = mutation({
  args: { id: v.id("musicProjects") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ─── STUDIO SESSIONS ────────────────────────────────────────

export const getSessions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("studioSessions").order("desc").collect();
  },
});

export const addSession = mutation({
  args: {
    title: v.string(),
    projectId: v.optional(v.string()),
    date: v.string(),
    startTime: v.string(),
    endTime: v.optional(v.string()),
    studio: v.optional(v.string()),
    engineerName: v.optional(v.string()),
    artistNames: v.optional(v.array(v.string())),
    sessionType: v.string(), // "recording" | "mixing" | "mastering" | "writing" | "rehearsal"
    notes: v.optional(v.string()),
    status: v.optional(v.string()), // "scheduled" | "in-progress" | "completed" | "cancelled"
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("studioSessions", {
      ...args,
      status: args.status || "scheduled",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateSession = mutation({
  args: {
    id: v.id("studioSessions"),
    title: v.optional(v.string()),
    projectId: v.optional(v.string()),
    date: v.optional(v.string()),
    startTime: v.optional(v.string()),
    endTime: v.optional(v.string()),
    studio: v.optional(v.string()),
    engineerName: v.optional(v.string()),
    artistNames: v.optional(v.array(v.string())),
    sessionType: v.optional(v.string()),
    notes: v.optional(v.string()),
    status: v.optional(v.string()),
    cost: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteSession = mutation({
  args: { id: v.id("studioSessions") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ─── BEAT / PRODUCTION LIBRARY ──────────────────────────────

export const getBeats = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("beatLibrary").order("desc").collect();
  },
});

export const addBeat = mutation({
  args: {
    title: v.string(),
    producerName: v.string(),
    genre: v.optional(v.string()),
    bpm: v.optional(v.number()),
    key: v.optional(v.string()),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    audioUrl: v.optional(v.string()),
    status: v.string(), // "available" | "on-hold" | "assigned" | "sold" | "used"
    assignedTo: v.optional(v.string()),
    price: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("beatLibrary", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateBeat = mutation({
  args: {
    id: v.id("beatLibrary"),
    title: v.optional(v.string()),
    producerName: v.optional(v.string()),
    genre: v.optional(v.string()),
    bpm: v.optional(v.number()),
    key: v.optional(v.string()),
    mood: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    audioUrl: v.optional(v.string()),
    status: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    price: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteBeat = mutation({
  args: { id: v.id("beatLibrary") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ─── RELEASE MANAGER ────────────────────────────────────────

export const getReleases = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("releases").order("desc").collect();
  },
});

export const addRelease = mutation({
  args: {
    title: v.string(),
    artistName: v.string(),
    type: v.string(), // "single" | "ep" | "album" | "mixtape"
    releaseDate: v.optional(v.string()),
    status: v.string(), // "planning" | "pre-production" | "production" | "post-production" | "submitted" | "scheduled" | "released"
    distributor: v.optional(v.string()),
    isrc: v.optional(v.string()),
    upc: v.optional(v.string()),
    artworkStatus: v.optional(v.string()), // "not-started" | "in-progress" | "approved" | "submitted"
    artworkUrl: v.optional(v.string()),
    mastered: v.optional(v.boolean()),
    metadataComplete: v.optional(v.boolean()),
    distributorSubmitted: v.optional(v.boolean()),
    spotifyUrl: v.optional(v.string()),
    appleMusicUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("releases", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateRelease = mutation({
  args: {
    id: v.id("releases"),
    title: v.optional(v.string()),
    artistName: v.optional(v.string()),
    type: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    status: v.optional(v.string()),
    distributor: v.optional(v.string()),
    isrc: v.optional(v.string()),
    upc: v.optional(v.string()),
    artworkStatus: v.optional(v.string()),
    artworkUrl: v.optional(v.string()),
    mastered: v.optional(v.boolean()),
    metadataComplete: v.optional(v.boolean()),
    distributorSubmitted: v.optional(v.boolean()),
    spotifyUrl: v.optional(v.string()),
    appleMusicUrl: v.optional(v.string()),
    youtubeUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteRelease = mutation({
  args: { id: v.id("releases") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ─── SPLITS & CREDITS ───────────────────────────────────────

export const getSplits = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("splitSheets").order("desc").collect();
  },
});

export const addSplit = mutation({
  args: {
    trackTitle: v.string(),
    projectId: v.optional(v.string()),
    contributors: v.array(v.object({
      name: v.string(),
      role: v.string(), // "songwriter" | "producer" | "performer" | "engineer" | "featured"
      percentage: v.number(),
      publisherName: v.optional(v.string()),
      pro: v.optional(v.string()), // "ASCAP" | "BMI" | "SESAC"
      ipi: v.optional(v.string()),
    })),
    status: v.optional(v.string()), // "draft" | "pending" | "agreed" | "signed"
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("splitSheets", {
      ...args,
      status: args.status || "draft",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateSplit = mutation({
  args: {
    id: v.id("splitSheets"),
    trackTitle: v.optional(v.string()),
    contributors: v.optional(v.array(v.object({
      name: v.string(),
      role: v.string(),
      percentage: v.number(),
      publisherName: v.optional(v.string()),
      pro: v.optional(v.string()),
      ipi: v.optional(v.string()),
    }))),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteSplit = mutation({
  args: { id: v.id("splitSheets") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ─── DASHBOARD STATS ────────────────────────────────────────

export const getMusicProductionStats = query({
  args: {},
  handler: async (ctx) => {
    const [artists, projects, sessions, beats, releases, splits] = await Promise.all([
      ctx.db.query("artists").collect(),
      ctx.db.query("musicProjects").collect(),
      ctx.db.query("studioSessions").collect(),
      ctx.db.query("beatLibrary").collect(),
      ctx.db.query("releases").collect(),
      ctx.db.query("splitSheets").collect(),
    ]);

    const activeArtists = artists.filter(a => a.status === "active").length;
    const activeProjects = projects.filter(p => !["released", "concept"].includes(p.status)).length;
    const upcomingSessions = sessions.filter(s => s.status === "scheduled").length;
    const availableBeats = beats.filter(b => b.status === "available").length;
    const upcomingReleases = releases.filter(r => !["released"].includes(r.status)).length;
    const pendingSplits = splits.filter(s => s.status !== "signed").length;

    const projectsByStatus: Record<string, number> = {};
    projects.forEach(p => { projectsByStatus[p.status] = (projectsByStatus[p.status] || 0) + 1; });

    return {
      totalArtists: artists.length,
      activeArtists,
      totalProjects: projects.length,
      activeProjects,
      totalSessions: sessions.length,
      upcomingSessions,
      totalBeats: beats.length,
      availableBeats,
      totalReleases: releases.length,
      upcomingReleases,
      totalSplits: splits.length,
      pendingSplits,
      projectsByStatus,
    };
  },
});
