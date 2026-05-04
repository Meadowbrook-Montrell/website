import { v } from "convex/values";
import { query, mutation } from "./_generated/server";

// ═══════════════════════════════════════════════════════════
//  MUSIC STORE — 30-Second Previews + Digital Downloads
// ═══════════════════════════════════════════════════════════

// ─── PUBLIC QUERIES (Fan-facing) ────────────────────────────

/** Get all active store items for the public storefront */
export const getStoreItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("musicStoreItems")
      .withIndex("by_isActive")
      .filter((q) => q.eq(q.field("isActive"), true))
      .order("desc")
      .collect();
    return items;
  },
});

/** Get a single store item by ID */
export const getStoreItem = query({
  args: { id: v.id("musicStoreItems") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

/** Get all tracks for an album */
export const getAlbumTracks = query({
  args: { albumId: v.id("musicStoreItems") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("musicStoreItems")
      .withIndex("by_albumId")
      .filter((q) => q.eq(q.field("albumId"), args.albumId))
      .order("asc")
      .collect();
  },
});

/** Get featured items for homepage showcase */
export const getFeaturedItems = query({
  args: {},
  handler: async (ctx) => {
    const items = await ctx.db
      .query("musicStoreItems")
      .withIndex("by_isFeatured")
      .filter((q) => q.eq(q.field("isFeatured"), true))
      .collect();
    return items.filter((i) => i.isActive);
  },
});

// ─── ADMIN QUERIES ──────────────────────────────────────────

/** Get all store items for admin management */
export const getAllStoreItems = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("musicStoreItems").order("desc").collect();
  },
});

/** Get all purchases for admin */
export const getPurchases = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("musicPurchases").order("desc").collect();
  },
});

/** Store stats for dashboard */
export const getStoreStats = query({
  args: {},
  handler: async (ctx) => {
    const [items, purchases] = await Promise.all([
      ctx.db.query("musicStoreItems").collect(),
      ctx.db.query("musicPurchases").collect(),
    ]);

    const activeItems = items.filter((i) => i.isActive).length;
    const albums = items.filter((i) => i.itemType === "album").length;
    const singles = items.filter((i) => i.itemType === "single").length;
    const totalRevenue = purchases
      .filter((p) => p.status === "completed")
      .reduce((sum, p) => sum + p.amount, 0);
    const totalSales = purchases.filter((p) => p.status === "completed").length;

    return {
      totalItems: items.length,
      activeItems,
      albums,
      singles,
      totalRevenue,
      totalSales,
      recentPurchases: purchases.slice(0, 5),
    };
  },
});

// ─── ADMIN MUTATIONS ────────────────────────────────────────

export const addStoreItem = mutation({
  args: {
    title: v.string(),
    artistName: v.string(),
    itemType: v.string(), // "single" | "album" | "ep" | "beat"
    price: v.number(),
    description: v.optional(v.string()),
    genre: v.optional(v.string()),
    coverArtUrl: v.optional(v.string()),
    previewAudioUrl: v.optional(v.string()), // 30-second preview
    fullAudioUrl: v.optional(v.string()), // full track for download after purchase
    downloadUrl: v.optional(v.string()), // direct download link
    duration: v.optional(v.string()), // "3:42" format
    bpm: v.optional(v.number()),
    key: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    albumId: v.optional(v.id("musicStoreItems")), // parent album, if this is a track in an album
    trackNumber: v.optional(v.number()),
    isActive: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    streamingLinks: v.optional(
      v.object({
        spotify: v.optional(v.string()),
        appleMusic: v.optional(v.string()),
        youtube: v.optional(v.string()),
        soundcloud: v.optional(v.string()),
        tidal: v.optional(v.string()),
      })
    ),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("musicStoreItems", {
      ...args,
      playCount: 0,
      purchaseCount: 0,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateStoreItem = mutation({
  args: {
    id: v.id("musicStoreItems"),
    title: v.optional(v.string()),
    artistName: v.optional(v.string()),
    itemType: v.optional(v.string()),
    price: v.optional(v.number()),
    description: v.optional(v.string()),
    genre: v.optional(v.string()),
    coverArtUrl: v.optional(v.string()),
    previewAudioUrl: v.optional(v.string()),
    fullAudioUrl: v.optional(v.string()),
    downloadUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    bpm: v.optional(v.number()),
    key: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    albumId: v.optional(v.id("musicStoreItems")),
    trackNumber: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    streamingLinks: v.optional(
      v.object({
        spotify: v.optional(v.string()),
        appleMusic: v.optional(v.string()),
        youtube: v.optional(v.string()),
        soundcloud: v.optional(v.string()),
        tidal: v.optional(v.string()),
      })
    ),
    notes: v.optional(v.string()),
    playCount: v.optional(v.number()),
    purchaseCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteStoreItem = mutation({
  args: { id: v.id("musicStoreItems") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});

/** Increment play count when someone plays a preview */
export const incrementPlayCount = mutation({
  args: { id: v.id("musicStoreItems") },
  handler: async (ctx, args) => {
    const item = await ctx.db.get(args.id);
    if (item) {
      await ctx.db.patch(args.id, { playCount: (item.playCount || 0) + 1 });
    }
  },
});

/** Record a purchase */
export const addPurchase = mutation({
  args: {
    itemId: v.id("musicStoreItems"),
    itemTitle: v.string(),
    artistName: v.string(),
    itemType: v.string(),
    customerEmail: v.string(),
    customerName: v.optional(v.string()),
    amount: v.number(),
    paymentMethod: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    // Record purchase
    const purchaseId = await ctx.db.insert("musicPurchases", {
      ...args,
      status: "completed",
      createdAt: new Date().toISOString(),
    });

    // Increment purchase count on item
    const item = await ctx.db.get(args.itemId);
    if (item) {
      await ctx.db.patch(args.itemId, {
        purchaseCount: (item.purchaseCount || 0) + 1,
      });
    }

    return purchaseId;
  },
});

export const updatePurchase = mutation({
  args: {
    id: v.id("musicPurchases"),
    status: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(
      Object.entries(updates).filter(([, v]) => v !== undefined)
    );
    await ctx.db.patch(id, cleaned);
  },
});
