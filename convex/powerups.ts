/**
 * Power-Up Features — Backend functions for 10 new modules
 * Media Library, Donations, Live Streams, Clip Queue, Audience Analytics,
 * Workflows, Contacts, Stories, Merch Fulfillment, Promo Codes
 */
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

// ═══════════════════════════════════════════════════════════
//  21. MEDIA LIBRARY / ASSET MANAGER
// ═══════════════════════════════════════════════════════════

export const getMediaAssets = query({
  args: { fileType: v.optional(v.string()), project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let assets = await ctx.db.query("mediaAssets").order("desc").collect();
    if (args.fileType) assets = assets.filter((a) => a.fileType === args.fileType);
    if (args.project) assets = assets.filter((a) => a.project === args.project);
    return assets;
  },
});

export const addMediaAsset = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    fileUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    fileType: v.string(),
    fileSize: v.optional(v.number()),
    tags: v.optional(v.string()),
    project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("mediaAssets", {
      ...args,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateMediaAsset = mutation({
  args: {
    id: v.id("mediaAssets"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    tags: v.optional(v.string()),
    project: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const deleteMediaAsset = mutation({
  args: { id: v.id("mediaAssets") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  22. TIP JAR / DONATIONS
// ═══════════════════════════════════════════════════════════

export const getDonations = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("donations").order("desc").collect();
  },
});

export const addDonation = mutation({
  args: {
    donorName: v.string(),
    donorEmail: v.optional(v.string()),
    amount: v.number(),
    platform: v.string(),
    message: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    isShoutout: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("donations", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const deleteDonation = mutation({
  args: { id: v.id("donations") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  23. LIVE STREAM COMMAND CENTER
// ═══════════════════════════════════════════════════════════

export const getLiveStreams = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let streams = await ctx.db.query("liveStreams").order("desc").collect();
    if (args.status) streams = streams.filter((s) => s.status === args.status);
    return streams;
  },
});

export const addLiveStream = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.string(),
    platforms: v.string(),
    thumbnailUrl: v.optional(v.string()),
    streamUrl: v.optional(v.string()),
    chatModeration: v.optional(v.string()),
    checklist: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("liveStreams", {
      ...args,
      status: "scheduled",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateLiveStream = mutation({
  args: {
    id: v.id("liveStreams"),
    status: v.optional(v.string()),
    peakViewers: v.optional(v.number()),
    totalViewers: v.optional(v.number()),
    duration: v.optional(v.number()),
    notes: v.optional(v.string()),
    streamUrl: v.optional(v.string()),
    checklist: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const deleteLiveStream = mutation({
  args: { id: v.id("liveStreams") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  24. CLIP GENERATOR QUEUE
// ═══════════════════════════════════════════════════════════

export const getClipQueue = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let clips = await ctx.db.query("clipQueue").order("desc").collect();
    if (args.status) clips = clips.filter((c) => c.status === args.status);
    return clips;
  },
});

export const addClip = mutation({
  args: {
    sourceTitle: v.string(),
    sourceUrl: v.optional(v.string()),
    startTime: v.string(),
    endTime: v.string(),
    clipTitle: v.string(),
    description: v.optional(v.string()),
    priority: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("clipQueue", {
      ...args,
      status: "queued",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateClip = mutation({
  args: {
    id: v.id("clipQueue"),
    status: v.optional(v.string()),
    platforms: v.optional(v.string()),
    exportUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const deleteClip = mutation({
  args: { id: v.id("clipQueue") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  25. AUDIENCE ANALYTICS
// ═══════════════════════════════════════════════════════════

export const getAudienceSnapshots = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("audienceSnapshots").order("desc").take(90);
  },
});

export const addAudienceSnapshot = mutation({
  args: {
    date: v.string(),
    totalVisitors: v.optional(v.number()),
    uniqueVisitors: v.optional(v.number()),
    topPage: v.optional(v.string()),
    topReferrer: v.optional(v.string()),
    subscriberCount: v.optional(v.number()),
    communityPosts: v.optional(v.number()),
    donationTotal: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("audienceSnapshots", {
      ...args,
      createdAt: new Date().toISOString(),
    });
  },
});

export const deleteAudienceSnapshot = mutation({
  args: { id: v.id("audienceSnapshots") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  26. AUTOMATED WORKFLOWS
// ═══════════════════════════════════════════════════════════

export const getWorkflows = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("workflows").order("desc").collect();
  },
});

export const addWorkflow = mutation({
  args: {
    name: v.string(),
    trigger: v.string(),
    action: v.string(),
    config: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("workflows", {
      ...args,
      isActive: true,
      triggerCount: 0,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateWorkflow = mutation({
  args: {
    id: v.id("workflows"),
    isActive: v.optional(v.boolean()),
    config: v.optional(v.string()),
    lastTriggered: v.optional(v.string()),
    triggerCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const deleteWorkflow = mutation({
  args: { id: v.id("workflows") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  27. CONTACTS / SOURCE DATABASE
// ═══════════════════════════════════════════════════════════

export const getContacts = query({
  args: { role: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let contacts = await ctx.db.query("contacts").order("desc").collect();
    if (args.role) contacts = contacts.filter((c) => c.role === args.role);
    return contacts;
  },
});

export const addContact = mutation({
  args: {
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(),
    organization: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contacts", {
      ...args,
      isFavorite: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateContact = mutation({
  args: {
    id: v.id("contacts"),
    name: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.optional(v.string()),
    organization: v.optional(v.string()),
    notes: v.optional(v.string()),
    lastInteraction: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    tags: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const deleteContact = mutation({
  args: { id: v.id("contacts") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  28. STORY / ASSIGNMENT TRACKER
// ═══════════════════════════════════════════════════════════

export const getStories = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let stories = await ctx.db.query("stories").order("desc").collect();
    if (args.status) stories = stories.filter((s) => s.status === args.status);
    return stories;
  },
});

export const addStory = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.string(),
    source: v.optional(v.string()),
    location: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("stories", {
      ...args,
      status: args.status || "lead",
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateStory = mutation({
  args: {
    id: v.id("stories"),
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(v.string()),
    priority: v.optional(v.string()),
    source: v.optional(v.string()),
    location: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    publishUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const deleteStory = mutation({
  args: { id: v.id("stories") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  29. MERCH FULFILLMENT
// ═══════════════════════════════════════════════════════════

// Merch fulfillment uses existing merchOrders + merchProducts tables.
// Additional queries for the fulfillment dashboard:

export const getMerchOrdersByStatus = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let orders = await ctx.db.query("merchOrders").order("desc").collect();
    if (args.status) orders = orders.filter((o: any) => o.status === args.status);
    return orders;
  },
});

export const updateMerchOrderStatus = mutation({
  args: {
    id: v.id("merchOrders"),
    status: v.string(),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const getMerchProductStats = query({
  args: {},
  handler: async (ctx) => {
    const products = await ctx.db.query("merchProducts").collect();
    const orders = await ctx.db.query("merchOrders").collect();
    return {
      totalProducts: products.length,
      activeProducts: products.filter((p: any) => p.isActive).length,
      lowStock: products.filter((p: any) => (p.stock || 0) < 10 && p.isActive).length,
      totalOrders: orders.length,
      pendingOrders: orders.filter((o: any) => o.status === "pending").length,
      shippedOrders: orders.filter((o: any) => o.status === "shipped").length,
      totalRevenue: orders.filter((o: any) => o.status !== "cancelled").reduce((sum: number, o: any) => sum + (o.total || 0), 0),
    };
  },
});

// ═══════════════════════════════════════════════════════════
//  30. AFFILIATE & PROMO CODE MANAGER
// ═══════════════════════════════════════════════════════════

export const getPromoCodes = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("promoCodes").order("desc").collect();
  },
});

export const addPromoCode = mutation({
  args: {
    code: v.string(),
    type: v.string(),
    discountPercent: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    partner: v.optional(v.string()),
    commissionPercent: v.optional(v.number()),
    expiresAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("promoCodes", {
      ...args,
      totalUses: 0,
      totalRevenue: 0,
      totalCommission: 0,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updatePromoCode = mutation({
  args: {
    id: v.id("promoCodes"),
    isActive: v.optional(v.boolean()),
    totalUses: v.optional(v.number()),
    totalRevenue: v.optional(v.number()),
    totalCommission: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const filtered = Object.fromEntries(Object.entries(updates).filter(([_, v]) => v !== undefined));
    await ctx.db.patch(id, filtered);
  },
});

export const deletePromoCode = mutation({
  args: { id: v.id("promoCodes") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});
