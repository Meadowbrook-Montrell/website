/**
 * Music Production Advanced — Backend for 17 new features
 */
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════
//  1. AUDIO FILE MANAGER
// ═══════════════════════════════════════════════════════════
export const listAudioFiles = query({
  args: { category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.category) return ctx.db.query("audioFiles").withIndex("by_category", (q) => q.eq("category", args.category!)).order("desc").collect();
    return ctx.db.query("audioFiles").order("desc").collect();
  },
});
export const addAudioFile = mutation({
  args: { title: v.string(), fileName: v.string(), format: v.string(), category: v.string(), fileSize: v.optional(v.string()), duration: v.optional(v.string()), bpm: v.optional(v.number()), key: v.optional(v.string()), artist: v.optional(v.string()), project: v.optional(v.string()), tags: v.optional(v.string()), notes: v.optional(v.string()), fileUrl: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("audioFiles", { ...args, version: 1, createdAt: new Date().toISOString() }),
});
export const deleteAudioFile = mutation({ args: { id: v.id("audioFiles") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  2. AI ARTWORK GENERATOR
// ═══════════════════════════════════════════════════════════
export const listAiArtwork = query({
  args: {},
  handler: async (ctx) => ctx.db.query("aiArtwork").order("desc").collect(),
});
export const addAiArtwork = mutation({
  args: { title: v.string(), prompt: v.string(), style: v.string(), artworkType: v.string(), artist: v.optional(v.string()), project: v.optional(v.string()), dimensions: v.optional(v.string()), imageUrl: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("aiArtwork", { ...args, status: args.imageUrl ? "completed" : "generating", isFavorite: false, createdAt: new Date().toISOString() }),
});
export const updateAiArtwork = mutation({
  args: { id: v.id("aiArtwork"), status: v.optional(v.string()), isFavorite: v.optional(v.boolean()), imageUrl: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteAiArtwork = mutation({ args: { id: v.id("aiArtwork") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  3. LYRICS & SONGWRITING PAD
// ═══════════════════════════════════════════════════════════
export const listLyrics = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.status) return ctx.db.query("lyrics").withIndex("by_status", (q) => q.eq("status", args.status!)).order("desc").collect();
    return ctx.db.query("lyrics").order("desc").collect();
  },
});
export const addLyrics = mutation({
  args: { title: v.string(), content: v.string(), status: v.string(), artist: v.optional(v.string()), project: v.optional(v.string()), beat: v.optional(v.string()), mood: v.optional(v.string()), notes: v.optional(v.string()), collaborators: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("lyrics", { ...args, wordCount: args.content.split(/\s+/).length, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }),
});
export const updateLyrics = mutation({
  args: { id: v.id("lyrics"), title: v.optional(v.string()), content: v.optional(v.string()), status: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { id, ...rest } = args;
    const updates: any = { ...rest, updatedAt: new Date().toISOString() };
    if (rest.content) updates.wordCount = rest.content.split(/\s+/).length;
    await ctx.db.patch(id, updates);
  },
});
export const deleteLyrics = mutation({ args: { id: v.id("lyrics") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  4. SAMPLE CLEARANCE TRACKER
// ═══════════════════════════════════════════════════════════
export const listSampleClearances = query({
  args: {},
  handler: async (ctx) => ctx.db.query("sampleClearances").order("desc").collect(),
});
export const addSampleClearance = mutation({
  args: { sampleTitle: v.string(), originalArtist: v.string(), originalSong: v.string(), usedIn: v.string(), sampleType: v.string(), status: v.string(), usedByArtist: v.optional(v.string()), contactName: v.optional(v.string()), contactEmail: v.optional(v.string()), publisherLabel: v.optional(v.string()), licenseFee: v.optional(v.number()), royaltyPercent: v.optional(v.number()), deadline: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("sampleClearances", { ...args, createdAt: new Date().toISOString() }),
});
export const updateSampleClearance = mutation({
  args: { id: v.id("sampleClearances"), status: v.optional(v.string()), licenseFee: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteSampleClearance = mutation({ args: { id: v.id("sampleClearances") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  5. STEMS & MASTERS VAULT
// ═══════════════════════════════════════════════════════════
export const listStemsVault = query({
  args: { project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.project) return ctx.db.query("stemsVault").withIndex("by_project", (q) => q.eq("projectName", args.project!)).order("desc").collect();
    return ctx.db.query("stemsVault").order("desc").collect();
  },
});
export const addStemEntry = mutation({
  args: { projectName: v.string(), trackTitle: v.string(), versionLabel: v.string(), versionNumber: v.number(), stemType: v.string(), format: v.string(), artist: v.optional(v.string()), bitDepth: v.optional(v.string()), sampleRate: v.optional(v.string()), fileUrl: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("stemsVault", { ...args, isLatest: true, createdAt: new Date().toISOString() }),
});
export const deleteStemEntry = mutation({ args: { id: v.id("stemsVault") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  6. MASTERING & QC CHECKLIST
// ═══════════════════════════════════════════════════════════
export const listMasteringQC = query({
  args: {},
  handler: async (ctx) => ctx.db.query("masteringQC").order("desc").collect(),
});
export const addMasteringQC = mutation({
  args: { trackTitle: v.string(), status: v.string(), project: v.optional(v.string()), artist: v.optional(v.string()), engineer: v.optional(v.string()), lufsIntegrated: v.optional(v.number()), truePeak: v.optional(v.number()), dynamicRange: v.optional(v.number()), referenceTrack: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("masteringQC", { ...args, formatCheck: false, metadataCheck: false, clippingCheck: false, phaseCheck: false, createdAt: new Date().toISOString() }),
});
export const updateMasteringQC = mutation({
  args: { id: v.id("masteringQC"), status: v.optional(v.string()), formatCheck: v.optional(v.boolean()), metadataCheck: v.optional(v.boolean()), clippingCheck: v.optional(v.boolean()), phaseCheck: v.optional(v.boolean()), lufsIntegrated: v.optional(v.number()), truePeak: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteMasteringQC = mutation({ args: { id: v.id("masteringQC") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  7. DISTRIBUTION HUB
// ═══════════════════════════════════════════════════════════
export const listDistributions = query({
  args: {},
  handler: async (ctx) => ctx.db.query("distributions").order("desc").collect(),
});
export const addDistribution = mutation({
  args: { releaseTitle: v.string(), artist: v.string(), distributor: v.string(), platforms: v.string(), status: v.string(), upc: v.optional(v.string()), isrc: v.optional(v.string()), releaseDate: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("distributions", { ...args, submittedDate: new Date().toISOString(), createdAt: new Date().toISOString() }),
});
export const updateDistribution = mutation({
  args: { id: v.id("distributions"), status: v.optional(v.string()), spotifyUrl: v.optional(v.string()), appleMusicUrl: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteDistribution = mutation({ args: { id: v.id("distributions") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  8. ROYALTY CALCULATOR
// ═══════════════════════════════════════════════════════════
export const listRoyalties = query({
  args: { artist: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.artist) return ctx.db.query("royaltyEntries").withIndex("by_artist", (q) => q.eq("artist", args.artist!)).order("desc").collect();
    return ctx.db.query("royaltyEntries").order("desc").collect();
  },
});
export const addRoyaltyEntry = mutation({
  args: { trackTitle: v.string(), artist: v.string(), platform: v.string(), streams: v.number(), ratePerStream: v.number(), splitPercent: v.number(), period: v.string(), advanceBalance: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const grossRevenue = args.streams * args.ratePerStream;
    const netRevenue = grossRevenue * (args.splitPercent / 100);
    const recouped = args.advanceBalance ? netRevenue >= args.advanceBalance : undefined;
    return ctx.db.insert("royaltyEntries", { ...args, grossRevenue, netRevenue, recouped, createdAt: new Date().toISOString() });
  },
});
export const deleteRoyaltyEntry = mutation({ args: { id: v.id("royaltyEntries") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  9. SYNC LICENSING MANAGER
// ═══════════════════════════════════════════════════════════
export const listSyncLicenses = query({
  args: {},
  handler: async (ctx) => ctx.db.query("syncLicenses").order("desc").collect(),
});
export const addSyncLicense = mutation({
  args: { trackTitle: v.string(), artist: v.string(), licensee: v.string(), mediaType: v.string(), usageType: v.string(), status: v.string(), showTitle: v.optional(v.string()), fee: v.optional(v.number()), territory: v.optional(v.string()), term: v.optional(v.string()), contactName: v.optional(v.string()), contactEmail: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("syncLicenses", { ...args, createdAt: new Date().toISOString() }),
});
export const updateSyncLicense = mutation({
  args: { id: v.id("syncLicenses"), status: v.optional(v.string()), fee: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteSyncLicense = mutation({ args: { id: v.id("syncLicenses") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  10. PLAYLIST PITCH TRACKER
// ═══════════════════════════════════════════════════════════
export const listPlaylistPitches = query({
  args: {},
  handler: async (ctx) => ctx.db.query("playlistPitches").order("desc").collect(),
});
export const addPlaylistPitch = mutation({
  args: { trackTitle: v.string(), artist: v.string(), playlistName: v.string(), platform: v.string(), status: v.string(), pitchDate: v.string(), curatorName: v.optional(v.string()), curatorEmail: v.optional(v.string()), playlistFollowers: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("playlistPitches", { ...args, createdAt: new Date().toISOString() }),
});
export const updatePlaylistPitch = mutation({
  args: { id: v.id("playlistPitches"), status: v.optional(v.string()), addedDate: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deletePlaylistPitch = mutation({ args: { id: v.id("playlistPitches") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  11. MUSIC VIDEO PLANNER
// ═══════════════════════════════════════════════════════════
export const listMusicVideos = query({
  args: {},
  handler: async (ctx) => ctx.db.query("musicVideos").order("desc").collect(),
});
export const addMusicVideo = mutation({
  args: { trackTitle: v.string(), artist: v.string(), status: v.string(), director: v.optional(v.string()), concept: v.optional(v.string()), location: v.optional(v.string()), shootDate: v.optional(v.string()), budget: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("musicVideos", { ...args, spent: 0, createdAt: new Date().toISOString() }),
});
export const updateMusicVideo = mutation({
  args: { id: v.id("musicVideos"), status: v.optional(v.string()), spent: v.optional(v.number()), videoUrl: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteMusicVideo = mutation({ args: { id: v.id("musicVideos") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  12. RELEASE ROLLOUT PLANNER
// ═══════════════════════════════════════════════════════════
export const listRolloutSteps = query({
  args: { release: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.release) return ctx.db.query("rolloutSteps").withIndex("by_release", (q) => q.eq("releaseTitle", args.release!)).collect();
    return ctx.db.query("rolloutSteps").order("desc").collect();
  },
});
export const addRolloutStep = mutation({
  args: { releaseTitle: v.string(), artist: v.string(), stepName: v.string(), stepType: v.string(), startDate: v.string(), status: v.string(), sortOrder: v.number(), endDate: v.optional(v.string()), assignee: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("rolloutSteps", { ...args, createdAt: new Date().toISOString() }),
});
export const updateRolloutStep = mutation({
  args: { id: v.id("rolloutSteps"), status: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteRolloutStep = mutation({ args: { id: v.id("rolloutSteps") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  13. PRESS KIT / EPK GENERATOR
// ═══════════════════════════════════════════════════════════
export const listPressKits = query({
  args: {},
  handler: async (ctx) => ctx.db.query("pressKits").order("desc").collect(),
});
export const addPressKit = mutation({
  args: { artistName: v.string(), bio: v.string(), status: v.string(), genre: v.optional(v.string()), hometown: v.optional(v.string()), achievements: v.optional(v.string()), contactEmail: v.optional(v.string()), managerName: v.optional(v.string()), pressQuotes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("pressKits", { ...args, lastUpdated: new Date().toISOString(), createdAt: new Date().toISOString() }),
});
export const updatePressKit = mutation({
  args: { id: v.id("pressKits"), bio: v.optional(v.string()), status: v.optional(v.string()), achievements: v.optional(v.string()), pressQuotes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, { ...rest, lastUpdated: new Date().toISOString() }); },
});
export const deletePressKit = mutation({ args: { id: v.id("pressKits") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  14. PRODUCER MARKETPLACE / COLLAB BOARD
// ═══════════════════════════════════════════════════════════
export const listProducerCollabs = query({
  args: {},
  handler: async (ctx) => ctx.db.query("producerCollabs").order("desc").collect(),
});
export const addProducerCollab = mutation({
  args: { producerName: v.string(), status: v.string(), specialty: v.optional(v.string()), genre: v.optional(v.string()), rate: v.optional(v.string()), producerEmail: v.optional(v.string()), portfolio: v.optional(v.string()), project: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("producerCollabs", { ...args, rating: 0, createdAt: new Date().toISOString() }),
});
export const updateProducerCollab = mutation({
  args: { id: v.id("producerCollabs"), status: v.optional(v.string()), rating: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteProducerCollab = mutation({ args: { id: v.id("producerCollabs") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  15. A&R PIPELINE
// ═══════════════════════════════════════════════════════════
export const listArPipeline = query({
  args: { stage: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.stage) return ctx.db.query("arPipeline").withIndex("by_stage", (q) => q.eq("stage", args.stage!)).order("desc").collect();
    return ctx.db.query("arPipeline").order("desc").collect();
  },
});
export const addArEntry = mutation({
  args: { artistName: v.string(), submissionType: v.string(), stage: v.string(), genre: v.optional(v.string()), city: v.optional(v.string()), contactEmail: v.optional(v.string()), socialLinks: v.optional(v.string()), demoUrl: v.optional(v.string()), monthlyListeners: v.optional(v.number()), scoutNotes: v.optional(v.string()), assignedTo: v.optional(v.string()), priority: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("arPipeline", { ...args, createdAt: new Date().toISOString() }),
});
export const updateArEntry = mutation({
  args: { id: v.id("arPipeline"), stage: v.optional(v.string()), priority: v.optional(v.string()), scoutNotes: v.optional(v.string()), developmentPlan: v.optional(v.string()) },
  handler: async (ctx, args) => { const { id, ...rest } = args; await ctx.db.patch(id, rest); },
});
export const deleteArEntry = mutation({ args: { id: v.id("arPipeline") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  16. AI LYRICS ASSISTANT (logs)
// ═══════════════════════════════════════════════════════════
export const listAiLyricsLogs = query({
  args: {},
  handler: async (ctx) => ctx.db.query("aiLyricsLogs").order("desc").collect(),
});
export const addAiLyricsLog = mutation({
  args: { prompt: v.string(), generatedText: v.string(), mood: v.optional(v.string()), style: v.optional(v.string()), project: v.optional(v.string()), artist: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("aiLyricsLogs", { ...args, isSaved: false, createdAt: new Date().toISOString() }),
});
export const toggleAiLyricsSaved = mutation({
  args: { id: v.id("aiLyricsLogs") },
  handler: async (ctx, args) => {
    const doc = await ctx.db.get(args.id);
    if (doc) await ctx.db.patch(args.id, { isSaved: !doc.isSaved });
  },
});
export const deleteAiLyricsLog = mutation({ args: { id: v.id("aiLyricsLogs") }, handler: async (ctx, args) => ctx.db.delete(args.id) });

// ═══════════════════════════════════════════════════════════
//  17. AI MASTERING PREVIEW (logs)
// ═══════════════════════════════════════════════════════════
export const listAiMasteringLogs = query({
  args: {},
  handler: async (ctx) => ctx.db.query("aiMasteringLogs").order("desc").collect(),
});
export const addAiMasteringLog = mutation({
  args: { trackTitle: v.string(), status: v.string(), artist: v.optional(v.string()), inputFormat: v.optional(v.string()), lufsTarget: v.optional(v.number()), suggestedEQ: v.optional(v.string()), suggestedCompression: v.optional(v.string()), suggestedLimiter: v.optional(v.string()), loudnessAnalysis: v.optional(v.string()), referenceTrack: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => ctx.db.insert("aiMasteringLogs", { ...args, createdAt: new Date().toISOString() }),
});
export const deleteAiMasteringLog = mutation({ args: { id: v.id("aiMasteringLogs") }, handler: async (ctx, args) => ctx.db.delete(args.id) });
