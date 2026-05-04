import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/* ═══════════════════════════════════════════════════════════════
   Music Production – Phase 3 (20 additional features) CRUD
   ═══════════════════════════════════════════════════════════════ */

// ── 1. Feature Verses ──
export const listFeatureVerses = query({ args: {}, handler: async (ctx) => ctx.db.query("featureVerses").order("desc").collect() });
export const addFeatureVerse = mutation({
  args: { trackTitle: v.string(), artist: v.string(), featureArtist: v.string(), direction: v.string(), status: v.string(), fee: v.optional(v.number()), deadline: v.optional(v.string()), contractUrl: v.optional(v.string()), notes: v.optional(v.string()), contactEmail: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("featureVerses", { ...a, createdAt: new Date().toISOString() }),
});
export const updateFeatureVerse = mutation({
  args: { id: v.id("featureVerses"), trackTitle: v.optional(v.string()), artist: v.optional(v.string()), featureArtist: v.optional(v.string()), direction: v.optional(v.string()), status: v.optional(v.string()), fee: v.optional(v.number()), deadline: v.optional(v.string()), contractUrl: v.optional(v.string()), notes: v.optional(v.string()), contactEmail: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteFeatureVerse = mutation({ args: { id: v.id("featureVerses") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 2. Vocal Sessions ──
export const listVocalSessions = query({ args: {}, handler: async (ctx) => ctx.db.query("vocalSessions").order("desc").collect() });
export const addVocalSession = mutation({
  args: { trackTitle: v.string(), artist: v.string(), sessionDate: v.string(), engineer: v.optional(v.string()), studio: v.optional(v.string()), takesRecorded: v.optional(v.number()), bestTake: v.optional(v.string()), vocalChain: v.optional(v.string()), micUsed: v.optional(v.string()), preamp: v.optional(v.string()), compressor: v.optional(v.string()), notes: v.optional(v.string()), rating: v.optional(v.number()), status: v.string() },
  handler: async (ctx, a) => ctx.db.insert("vocalSessions", { ...a, createdAt: new Date().toISOString() }),
});
export const updateVocalSession = mutation({
  args: { id: v.id("vocalSessions"), trackTitle: v.optional(v.string()), artist: v.optional(v.string()), sessionDate: v.optional(v.string()), engineer: v.optional(v.string()), studio: v.optional(v.string()), takesRecorded: v.optional(v.number()), bestTake: v.optional(v.string()), vocalChain: v.optional(v.string()), micUsed: v.optional(v.string()), preamp: v.optional(v.string()), compressor: v.optional(v.string()), notes: v.optional(v.string()), rating: v.optional(v.number()), status: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteVocalSession = mutation({ args: { id: v.id("vocalSessions") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 3. Setlists ──
export const listSetlists = query({ args: {}, handler: async (ctx) => ctx.db.query("setlists").order("desc").collect() });
export const addSetlist = mutation({
  args: { showName: v.string(), artist: v.string(), venue: v.optional(v.string()), showDate: v.optional(v.string()), songs: v.string(), totalDuration: v.optional(v.string()), notes: v.optional(v.string()), isTemplate: v.optional(v.boolean()), status: v.string() },
  handler: async (ctx, a) => ctx.db.insert("setlists", { ...a, createdAt: new Date().toISOString() }),
});
export const updateSetlist = mutation({
  args: { id: v.id("setlists"), showName: v.optional(v.string()), artist: v.optional(v.string()), venue: v.optional(v.string()), showDate: v.optional(v.string()), songs: v.optional(v.string()), totalDuration: v.optional(v.string()), notes: v.optional(v.string()), isTemplate: v.optional(v.boolean()), status: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteSetlist = mutation({ args: { id: v.id("setlists") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 4. Tour Shows ──
export const listTourShows = query({ args: {}, handler: async (ctx) => ctx.db.query("tourShows").order("desc").collect() });
export const addTourShow = mutation({
  args: { showName: v.string(), artist: v.string(), venue: v.string(), city: v.string(), showDate: v.string(), showTime: v.optional(v.string()), status: v.string(), guarantee: v.optional(v.number()), merch_revenue: v.optional(v.number()), expenses: v.optional(v.number()), ticketsSold: v.optional(v.number()), capacity: v.optional(v.number()), promoter: v.optional(v.string()), promoterEmail: v.optional(v.string()), riderNotes: v.optional(v.string()), travelNotes: v.optional(v.string()), settlementStatus: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("tourShows", { ...a, createdAt: new Date().toISOString() }),
});
export const updateTourShow = mutation({
  args: { id: v.id("tourShows"), showName: v.optional(v.string()), artist: v.optional(v.string()), venue: v.optional(v.string()), city: v.optional(v.string()), showDate: v.optional(v.string()), showTime: v.optional(v.string()), status: v.optional(v.string()), guarantee: v.optional(v.number()), merch_revenue: v.optional(v.number()), expenses: v.optional(v.number()), ticketsSold: v.optional(v.number()), capacity: v.optional(v.number()), promoter: v.optional(v.string()), promoterEmail: v.optional(v.string()), riderNotes: v.optional(v.string()), travelNotes: v.optional(v.string()), settlementStatus: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteTourShow = mutation({ args: { id: v.id("tourShows") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 5. Music Rights ──
export const listMusicRights = query({ args: {}, handler: async (ctx) => ctx.db.query("musicRights").order("desc").collect() });
export const addMusicRight = mutation({
  args: { title: v.string(), artist: v.string(), rightType: v.string(), pro: v.optional(v.string()), ipiNumber: v.optional(v.string()), publisherName: v.optional(v.string()), splitPercent: v.optional(v.number()), registrationDate: v.optional(v.string()), registrationId: v.optional(v.string()), status: v.string(), territory: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("musicRights", { ...a, createdAt: new Date().toISOString() }),
});
export const updateMusicRight = mutation({
  args: { id: v.id("musicRights"), title: v.optional(v.string()), artist: v.optional(v.string()), rightType: v.optional(v.string()), pro: v.optional(v.string()), ipiNumber: v.optional(v.string()), publisherName: v.optional(v.string()), splitPercent: v.optional(v.number()), registrationDate: v.optional(v.string()), registrationId: v.optional(v.string()), status: v.optional(v.string()), territory: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteMusicRight = mutation({ args: { id: v.id("musicRights") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 6. Mood Boards ──
export const listMoodBoards = query({ args: {}, handler: async (ctx) => ctx.db.query("moodBoards").order("desc").collect() });
export const addMoodBoard = mutation({
  args: { title: v.string(), project: v.optional(v.string()), artist: v.optional(v.string()), boardType: v.string(), description: v.optional(v.string()), colorPalette: v.optional(v.string()), fonts: v.optional(v.string()), referenceUrls: v.optional(v.string()), referenceNotes: v.optional(v.string()), tags: v.optional(v.string()), status: v.string() },
  handler: async (ctx, a) => ctx.db.insert("moodBoards", { ...a, createdAt: new Date().toISOString() }),
});
export const updateMoodBoard = mutation({
  args: { id: v.id("moodBoards"), title: v.optional(v.string()), project: v.optional(v.string()), artist: v.optional(v.string()), boardType: v.optional(v.string()), description: v.optional(v.string()), colorPalette: v.optional(v.string()), fonts: v.optional(v.string()), referenceUrls: v.optional(v.string()), referenceNotes: v.optional(v.string()), tags: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteMoodBoard = mutation({ args: { id: v.id("moodBoards") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 7. Vocal Health ──
export const listVocalHealth = query({ args: {}, handler: async (ctx) => ctx.db.query("vocalHealth").order("desc").collect() });
export const addVocalHealth = mutation({
  args: { artist: v.string(), date: v.string(), entryType: v.string(), sessionDuration: v.optional(v.number()), vocalCondition: v.optional(v.string()), hydrationLevel: v.optional(v.string()), warmUpDone: v.optional(v.boolean()), warmUpRoutine: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("vocalHealth", { ...a, createdAt: new Date().toISOString() }),
});
export const updateVocalHealth = mutation({
  args: { id: v.id("vocalHealth"), artist: v.optional(v.string()), date: v.optional(v.string()), entryType: v.optional(v.string()), sessionDuration: v.optional(v.number()), vocalCondition: v.optional(v.string()), hydrationLevel: v.optional(v.string()), warmUpDone: v.optional(v.boolean()), warmUpRoutine: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteVocalHealth = mutation({ args: { id: v.id("vocalHealth") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 8. Sound Kits ──
export const listSoundKits = query({ args: {}, handler: async (ctx) => ctx.db.query("soundKits").order("desc").collect() });
export const addSoundKit = mutation({
  args: { title: v.string(), producer: v.string(), kitType: v.string(), genre: v.optional(v.string()), soundCount: v.optional(v.number()), price: v.optional(v.number()), downloads: v.optional(v.number()), revenue: v.optional(v.number()), description: v.optional(v.string()), tags: v.optional(v.string()), status: v.string() },
  handler: async (ctx, a) => ctx.db.insert("soundKits", { ...a, createdAt: new Date().toISOString() }),
});
export const updateSoundKit = mutation({
  args: { id: v.id("soundKits"), title: v.optional(v.string()), producer: v.optional(v.string()), kitType: v.optional(v.string()), genre: v.optional(v.string()), soundCount: v.optional(v.number()), price: v.optional(v.number()), downloads: v.optional(v.number()), revenue: v.optional(v.number()), description: v.optional(v.string()), tags: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteSoundKit = mutation({ args: { id: v.id("soundKits") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 9. Beat Leases ──
export const listBeatLeases = query({ args: {}, handler: async (ctx) => ctx.db.query("beatLeases").order("desc").collect() });
export const addBeatLease = mutation({
  args: { beatTitle: v.string(), producer: v.string(), buyer: v.optional(v.string()), buyerEmail: v.optional(v.string()), leaseType: v.string(), price: v.number(), status: v.string(), licensePeriod: v.optional(v.string()), streamLimit: v.optional(v.number()), purchaseDate: v.optional(v.string()), contractUrl: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("beatLeases", { ...a, createdAt: new Date().toISOString() }),
});
export const updateBeatLease = mutation({
  args: { id: v.id("beatLeases"), beatTitle: v.optional(v.string()), producer: v.optional(v.string()), buyer: v.optional(v.string()), buyerEmail: v.optional(v.string()), leaseType: v.optional(v.string()), price: v.optional(v.number()), status: v.optional(v.string()), licensePeriod: v.optional(v.string()), streamLimit: v.optional(v.number()), purchaseDate: v.optional(v.string()), contractUrl: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteBeatLease = mutation({ args: { id: v.id("beatLeases") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 10. Gear Inventory ──
export const listGearInventory = query({ args: {}, handler: async (ctx) => ctx.db.query("gearInventory").order("desc").collect() });
export const addGearItem = mutation({
  args: { name: v.string(), category: v.string(), manufacturer: v.optional(v.string()), serialNumber: v.optional(v.string()), licenseKey: v.optional(v.string()), purchaseDate: v.optional(v.string()), purchasePrice: v.optional(v.number()), warrantyExpiry: v.optional(v.string()), condition: v.optional(v.string()), location: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("gearInventory", { ...a, createdAt: new Date().toISOString() }),
});
export const updateGearItem = mutation({
  args: { id: v.id("gearInventory"), name: v.optional(v.string()), category: v.optional(v.string()), manufacturer: v.optional(v.string()), serialNumber: v.optional(v.string()), licenseKey: v.optional(v.string()), purchaseDate: v.optional(v.string()), purchasePrice: v.optional(v.number()), warrantyExpiry: v.optional(v.string()), condition: v.optional(v.string()), location: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteGearItem = mutation({ args: { id: v.id("gearInventory") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 11. Production Templates ──
export const listProductionTemplates = query({ args: {}, handler: async (ctx) => ctx.db.query("productionTemplates").order("desc").collect() });
export const addProductionTemplate = mutation({
  args: { title: v.string(), producer: v.string(), daw: v.string(), templateType: v.string(), genre: v.optional(v.string()), bpmRange: v.optional(v.string()), description: v.optional(v.string()), plugins: v.optional(v.string()), trackCount: v.optional(v.number()), isShared: v.optional(v.boolean()), tags: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("productionTemplates", { ...a, createdAt: new Date().toISOString() }),
});
export const updateProductionTemplate = mutation({
  args: { id: v.id("productionTemplates"), title: v.optional(v.string()), producer: v.optional(v.string()), daw: v.optional(v.string()), templateType: v.optional(v.string()), genre: v.optional(v.string()), bpmRange: v.optional(v.string()), description: v.optional(v.string()), plugins: v.optional(v.string()), trackCount: v.optional(v.number()), isShared: v.optional(v.boolean()), tags: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteProductionTemplate = mutation({ args: { id: v.id("productionTemplates") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 12. Sound Designs ──
export const listSoundDesigns = query({ args: {}, handler: async (ctx) => ctx.db.query("soundDesigns").order("desc").collect() });
export const addSoundDesign = mutation({
  args: { title: v.string(), producer: v.string(), category: v.string(), synth: v.optional(v.string()), processingChain: v.optional(v.string()), layering: v.optional(v.string()), description: v.optional(v.string()), genre: v.optional(v.string()), tags: v.optional(v.string()), isFavorite: v.optional(v.boolean()) },
  handler: async (ctx, a) => ctx.db.insert("soundDesigns", { ...a, createdAt: new Date().toISOString() }),
});
export const updateSoundDesign = mutation({
  args: { id: v.id("soundDesigns"), title: v.optional(v.string()), producer: v.optional(v.string()), category: v.optional(v.string()), synth: v.optional(v.string()), processingChain: v.optional(v.string()), layering: v.optional(v.string()), description: v.optional(v.string()), genre: v.optional(v.string()), tags: v.optional(v.string()), isFavorite: v.optional(v.boolean()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteSoundDesign = mutation({ args: { id: v.id("soundDesigns") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 13. Producer Analytics ──
export const listProducerAnalytics = query({ args: {}, handler: async (ctx) => ctx.db.query("producerAnalytics").order("desc").collect() });
export const addProducerAnalytic = mutation({
  args: { producer: v.string(), period: v.string(), totalBeats: v.optional(v.number()), beatsSold: v.optional(v.number()), totalRevenue: v.optional(v.number()), leaseRevenue: v.optional(v.number()), exclusiveRevenue: v.optional(v.number()), topGenre: v.optional(v.string()), topBeat: v.optional(v.string()), conversionRate: v.optional(v.number()), avgBeatPrice: v.optional(v.number()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("producerAnalytics", { ...a, createdAt: new Date().toISOString() }),
});
export const deleteProducerAnalytic = mutation({ args: { id: v.id("producerAnalytics") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 14. Feedback Reviews ──
export const listFeedbackReviews = query({ args: {}, handler: async (ctx) => ctx.db.query("feedbackReviews").order("desc").collect() });
export const addFeedbackReview = mutation({
  args: { trackTitle: v.string(), artist: v.optional(v.string()), project: v.optional(v.string()), submittedBy: v.string(), reviewers: v.optional(v.string()), feedbackType: v.string(), comments: v.optional(v.string()), status: v.string(), priority: v.optional(v.string()), dueDate: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("feedbackReviews", { ...a, createdAt: new Date().toISOString() }),
});
export const updateFeedbackReview = mutation({
  args: { id: v.id("feedbackReviews"), trackTitle: v.optional(v.string()), artist: v.optional(v.string()), project: v.optional(v.string()), submittedBy: v.optional(v.string()), reviewers: v.optional(v.string()), feedbackType: v.optional(v.string()), comments: v.optional(v.string()), status: v.optional(v.string()), priority: v.optional(v.string()), dueDate: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteFeedbackReview = mutation({ args: { id: v.id("feedbackReviews") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 15. Contract Memos ──
export const listContractMemos = query({ args: {}, handler: async (ctx) => ctx.db.query("contractMemos").order("desc").collect() });
export const addContractMemo = mutation({
  args: { title: v.string(), contractType: v.string(), parties: v.string(), terms: v.optional(v.string()), fee: v.optional(v.number()), startDate: v.optional(v.string()), endDate: v.optional(v.string()), status: v.string(), signedByAll: v.optional(v.boolean()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("contractMemos", { ...a, createdAt: new Date().toISOString() }),
});
export const updateContractMemo = mutation({
  args: { id: v.id("contractMemos"), title: v.optional(v.string()), contractType: v.optional(v.string()), parties: v.optional(v.string()), terms: v.optional(v.string()), fee: v.optional(v.number()), startDate: v.optional(v.string()), endDate: v.optional(v.string()), status: v.optional(v.string()), signedByAll: v.optional(v.boolean()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteContractMemo = mutation({ args: { id: v.id("contractMemos") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 16. Reference Tracks ──
export const listReferenceTracks = query({ args: {}, handler: async (ctx) => ctx.db.query("referenceTracks").order("desc").collect() });
export const addReferenceTrack = mutation({
  args: { title: v.string(), originalArtist: v.string(), forProject: v.optional(v.string()), forArtist: v.optional(v.string()), referenceAspect: v.string(), bpm: v.optional(v.number()), key: v.optional(v.string()), genre: v.optional(v.string()), notes: v.optional(v.string()), spotifyUrl: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("referenceTracks", { ...a, createdAt: new Date().toISOString() }),
});
export const updateReferenceTrack = mutation({
  args: { id: v.id("referenceTracks"), title: v.optional(v.string()), originalArtist: v.optional(v.string()), forProject: v.optional(v.string()), forArtist: v.optional(v.string()), referenceAspect: v.optional(v.string()), bpm: v.optional(v.number()), key: v.optional(v.string()), genre: v.optional(v.string()), notes: v.optional(v.string()), spotifyUrl: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteReferenceTrack = mutation({ args: { id: v.id("referenceTracks") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 17. Chord Progressions ──
export const listChordProgressions = query({ args: {}, handler: async (ctx) => ctx.db.query("chordProgressions").order("desc").collect() });
export const addChordProgression = mutation({
  args: { title: v.string(), key: v.string(), scale: v.string(), chords: v.string(), genre: v.optional(v.string()), bpm: v.optional(v.number()), mood: v.optional(v.string()), usedIn: v.optional(v.string()), notes: v.optional(v.string()), isFavorite: v.optional(v.boolean()) },
  handler: async (ctx, a) => ctx.db.insert("chordProgressions", { ...a, createdAt: new Date().toISOString() }),
});
export const updateChordProgression = mutation({
  args: { id: v.id("chordProgressions"), title: v.optional(v.string()), key: v.optional(v.string()), scale: v.optional(v.string()), chords: v.optional(v.string()), genre: v.optional(v.string()), bpm: v.optional(v.number()), mood: v.optional(v.string()), usedIn: v.optional(v.string()), notes: v.optional(v.string()), isFavorite: v.optional(v.boolean()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteChordProgression = mutation({ args: { id: v.id("chordProgressions") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 18. DAW Projects ──
export const listDawProjects = query({ args: {}, handler: async (ctx) => ctx.db.query("dawProjects").order("desc").collect() });
export const addDawProject = mutation({
  args: { title: v.string(), artist: v.optional(v.string()), producer: v.optional(v.string()), daw: v.string(), version: v.optional(v.string()), bpm: v.optional(v.number()), key: v.optional(v.string()), trackCount: v.optional(v.number()), fileSize: v.optional(v.string()), backupStatus: v.optional(v.string()), collaborators: v.optional(v.string()), plugins: v.optional(v.string()), notes: v.optional(v.string()), lastModified: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("dawProjects", { ...a, createdAt: new Date().toISOString() }),
});
export const updateDawProject = mutation({
  args: { id: v.id("dawProjects"), title: v.optional(v.string()), artist: v.optional(v.string()), producer: v.optional(v.string()), daw: v.optional(v.string()), version: v.optional(v.string()), bpm: v.optional(v.number()), key: v.optional(v.string()), trackCount: v.optional(v.number()), fileSize: v.optional(v.string()), backupStatus: v.optional(v.string()), collaborators: v.optional(v.string()), plugins: v.optional(v.string()), notes: v.optional(v.string()), lastModified: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteDawProject = mutation({ args: { id: v.id("dawProjects") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 19. Revenue Goals ──
export const listRevenueGoals = query({ args: {}, handler: async (ctx) => ctx.db.query("revenueGoals").order("desc").collect() });
export const addRevenueGoal = mutation({
  args: { name: v.string(), artist: v.optional(v.string()), producer: v.optional(v.string()), period: v.string(), targetAmount: v.number(), currentAmount: v.optional(v.number()), category: v.string(), milestones: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("revenueGoals", { ...a, createdAt: new Date().toISOString() }),
});
export const updateRevenueGoal = mutation({
  args: { id: v.id("revenueGoals"), name: v.optional(v.string()), artist: v.optional(v.string()), producer: v.optional(v.string()), period: v.optional(v.string()), targetAmount: v.optional(v.number()), currentAmount: v.optional(v.number()), category: v.optional(v.string()), milestones: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteRevenueGoal = mutation({ args: { id: v.id("revenueGoals") }, handler: async (ctx, { id }) => ctx.db.delete(id) });

// ── 20. Collab Calendar ──
export const listCollabCalendar = query({ args: {}, handler: async (ctx) => ctx.db.query("collabCalendar").order("desc").collect() });
export const addCollabEvent = mutation({
  args: { title: v.string(), sessionDate: v.string(), startTime: v.optional(v.string()), endTime: v.optional(v.string()), studio: v.optional(v.string()), participants: v.string(), project: v.optional(v.string()), sessionType: v.string(), status: v.string(), timezone: v.optional(v.string()), reminderSent: v.optional(v.boolean()), notes: v.optional(v.string()) },
  handler: async (ctx, a) => ctx.db.insert("collabCalendar", { ...a, createdAt: new Date().toISOString() }),
});
export const updateCollabEvent = mutation({
  args: { id: v.id("collabCalendar"), title: v.optional(v.string()), sessionDate: v.optional(v.string()), startTime: v.optional(v.string()), endTime: v.optional(v.string()), studio: v.optional(v.string()), participants: v.optional(v.string()), project: v.optional(v.string()), sessionType: v.optional(v.string()), status: v.optional(v.string()), timezone: v.optional(v.string()), reminderSent: v.optional(v.boolean()), notes: v.optional(v.string()) },
  handler: async (ctx, { id, ...rest }) => { const u: any = {}; for (const [k, val] of Object.entries(rest)) { if (val !== undefined) u[k] = val; } if (Object.keys(u).length) await ctx.db.patch(id, u); },
});
export const deleteCollabEvent = mutation({ args: { id: v.id("collabCalendar") }, handler: async (ctx, { id }) => ctx.db.delete(id) });
