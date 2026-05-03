/**
 * Business Operations v2 — Convex Functions
 * Invoices, Waivers, Content Schedule, Team Management, Memberships
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══════════════════════════════════════════════════════════
//  21. INVOICE GENERATOR
// ═══════════════════════════════════════════════════════════

export const getInvoices = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let invoices = await ctx.db.query("invoices").order("desc").collect();
    if (args.status) invoices = invoices.filter((i) => i.status === args.status);
    return invoices;
  },
});

export const getInvoiceById = query({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => ctx.db.get(args.id),
});

export const getInvoiceStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("invoices").collect();
    const paid = all.filter((i) => i.status === "paid");
    const pending = all.filter((i) => i.status === "sent" || i.status === "draft");
    const overdue = all.filter((i) => i.status === "overdue");
    return {
      total: all.length,
      totalRevenue: paid.reduce((s, i) => s + i.total, 0),
      pendingAmount: pending.reduce((s, i) => s + i.total, 0),
      overdueAmount: overdue.reduce((s, i) => s + i.total, 0),
      paidCount: paid.length,
      pendingCount: pending.length,
      overdueCount: overdue.length,
    };
  },
});

export const getNextInvoiceNumber = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("invoices").collect();
    const num = all.length + 1;
    return `3GMG-${String(num).padStart(4, "0")}`;
  },
});

export const addInvoice = mutation({
  args: {
    invoiceNumber: v.string(), clientName: v.string(),
    clientEmail: v.optional(v.string()), clientCompany: v.optional(v.string()),
    items: v.array(v.object({ description: v.string(), quantity: v.number(), rate: v.number(), amount: v.number() })),
    subtotal: v.number(), tax: v.optional(v.number()), total: v.number(),
    status: v.string(), issueDate: v.string(), dueDate: v.string(),
    notes: v.optional(v.string()), sponsorId: v.optional(v.id("sponsors")),
    guestId: v.optional(v.id("guestCRM")),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("invoices", { ...args, createdAt: new Date().toISOString() });
    await ctx.db.insert("notifications", {
      type: "system", title: "Invoice Created",
      message: `Invoice ${args.invoiceNumber} for ${args.clientName} — $${args.total}`,
      isRead: false, createdAt: new Date().toISOString(),
    });
    return id;
  },
});

export const updateInvoice = mutation({
  args: { id: v.id("invoices"), status: v.optional(v.string()), paidDate: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteInvoice = mutation({
  args: { id: v.id("invoices") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  22. MEDIA RELEASES / WAIVERS
// ═══════════════════════════════════════════════════════════

export const getWaivers = query({
  args: { status: v.optional(v.string()), type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let waivers = await ctx.db.query("waivers").order("desc").collect();
    if (args.status) waivers = waivers.filter((w) => w.status === args.status);
    if (args.type) waivers = waivers.filter((w) => w.type === args.type);
    return waivers;
  },
});

export const getWaiverStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("waivers").collect();
    return {
      total: all.length,
      signed: all.filter((w) => w.status === "signed").length,
      pending: all.filter((w) => w.status === "pending").length,
      expired: all.filter((w) => w.status === "expired").length,
    };
  },
});

export const addWaiver = mutation({
  args: {
    type: v.string(), guestName: v.string(), guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()), description: v.optional(v.string()),
    episodeTitle: v.optional(v.string()), locationFilmed: v.optional(v.string()),
    dateFilmed: v.optional(v.string()), guestCRMId: v.optional(v.id("guestCRM")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("waivers", { ...args, status: "pending", createdAt: new Date().toISOString() });
  },
});

export const signWaiver = mutation({
  args: { id: v.id("waivers"), signatureData: v.optional(v.string()), ipAddress: v.optional(v.string()) },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, {
      status: "signed", signedAt: new Date().toISOString(),
      signatureData: args.signatureData, ipAddress: args.ipAddress,
    });
    const waiver = await ctx.db.get(args.id);
    if (waiver) {
      await ctx.db.insert("notifications", {
        type: "system", title: "Waiver Signed",
        message: `${waiver.guestName} signed ${waiver.type}`,
        isRead: false, createdAt: new Date().toISOString(),
      });
    }
  },
});

export const updateWaiver = mutation({
  args: { id: v.id("waivers"), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteWaiver = mutation({
  args: { id: v.id("waivers") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// Public signing page
export const getWaiverForSigning = query({
  args: { id: v.id("waivers") },
  handler: async (ctx, args) => {
    const w = await ctx.db.get(args.id);
    if (!w || w.status !== "pending") return null;
    return { _id: w._id, type: w.type, guestName: w.guestName, episodeTitle: w.episodeTitle, description: w.description, locationFilmed: w.locationFilmed, dateFilmed: w.dateFilmed };
  },
});

// ═══════════════════════════════════════════════════════════
//  23. CONTENT SCHEDULE (multi-platform calendar)
// ═══════════════════════════════════════════════════════════

export const getContentSchedule = query({
  args: { month: v.optional(v.string()), platform: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let items = await ctx.db.query("contentSchedule").order("desc").collect();
    if (args.month) items = items.filter((i) => i.scheduledDate.startsWith(args.month!));
    if (args.platform) items = items.filter((i) => i.platform === args.platform || i.platform === "all");
    return items;
  },
});

export const getContentScheduleStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("contentSchedule").collect();
    const now = new Date().toISOString().slice(0, 10);
    const upcoming = all.filter((i) => i.scheduledDate >= now && i.status !== "posted" && i.status !== "cancelled");
    const byPlatform: Record<string, number> = {};
    all.forEach((i) => { byPlatform[i.platform] = (byPlatform[i.platform] || 0) + 1; });
    const byStatus: Record<string, number> = {};
    all.forEach((i) => { byStatus[i.status] = (byStatus[i.status] || 0) + 1; });
    return { total: all.length, upcoming: upcoming.length, byPlatform, byStatus };
  },
});

export const addScheduleItem = mutation({
  args: {
    title: v.string(), description: v.optional(v.string()),
    platform: v.string(), contentType: v.string(), status: v.string(),
    scheduledDate: v.string(), scheduledTime: v.optional(v.string()),
    publishedUrl: v.optional(v.string()), thumbnailUrl: v.optional(v.string()),
    assignee: v.optional(v.string()), notes: v.optional(v.string()),
    linkedContentId: v.optional(v.id("content")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentSchedule", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateScheduleItem = mutation({
  args: {
    id: v.id("contentSchedule"), title: v.optional(v.string()),
    status: v.optional(v.string()), scheduledDate: v.optional(v.string()),
    scheduledTime: v.optional(v.string()), platform: v.optional(v.string()),
    assignee: v.optional(v.string()), publishedUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteScheduleItem = mutation({
  args: { id: v.id("contentSchedule") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  24. TEAM / CREW MANAGEMENT
// ═══════════════════════════════════════════════════════════

export const getTeamMembers = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let members = await ctx.db.query("teamMembers").order("desc").collect();
    if (args.activeOnly) members = members.filter((m) => m.isActive);
    return members;
  },
});

export const getTeamStats = query({
  args: {},
  handler: async (ctx) => {
    const members = await ctx.db.query("teamMembers").collect();
    const entries = await ctx.db.query("timeEntries").collect();
    const active = members.filter((m) => m.isActive);
    const totalHours = entries.reduce((s, e) => s + e.hours, 0);
    const unpaidEntries = entries.filter((e) => e.status !== "paid");
    const unpaidAmount = unpaidEntries.reduce((s, e) => s + (e.amount || 0), 0);
    return { totalMembers: members.length, activeMembers: active.length, totalHours, unpaidAmount, unpaidEntries: unpaidEntries.length };
  },
});

export const addTeamMember = mutation({
  args: {
    name: v.string(), role: v.string(), email: v.optional(v.string()),
    phone: v.optional(v.string()), imageUrl: v.optional(v.string()),
    rate: v.optional(v.number()), rateType: v.optional(v.string()),
    isActive: v.boolean(), notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teamMembers", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateTeamMember = mutation({
  args: {
    id: v.id("teamMembers"), name: v.optional(v.string()),
    role: v.optional(v.string()), rate: v.optional(v.number()),
    isActive: v.optional(v.boolean()), notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteTeamMember = mutation({
  args: { id: v.id("teamMembers") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// Time entries
export const getTimeEntries = query({
  args: { memberId: v.optional(v.id("teamMembers")), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let entries = await ctx.db.query("timeEntries").order("desc").collect();
    if (args.memberId) entries = entries.filter((e) => e.teamMemberId === args.memberId);
    if (args.status) entries = entries.filter((e) => e.status === args.status);
    return entries;
  },
});

export const addTimeEntry = mutation({
  args: {
    teamMemberId: v.id("teamMembers"), date: v.string(),
    hours: v.number(), description: v.string(),
    project: v.optional(v.string()), amount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("timeEntries", { ...args, status: "logged", createdAt: new Date().toISOString() });
  },
});

export const updateTimeEntry = mutation({
  args: { id: v.id("timeEntries"), status: v.optional(v.string()), amount: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteTimeEntry = mutation({
  args: { id: v.id("timeEntries") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  25. MEMBERSHIP / VIP TIERS
// ═══════════════════════════════════════════════════════════

export const getMembershipTiers = query({
  args: { activeOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let tiers = await ctx.db.query("membershipTiers").collect();
    if (args.activeOnly) tiers = tiers.filter((t) => t.isActive);
    return tiers.sort((a, b) => a.order - b.order);
  },
});

export const addMembershipTier = mutation({
  args: {
    name: v.string(), price: v.number(), description: v.string(),
    perks: v.array(v.string()), color: v.optional(v.string()),
    isActive: v.boolean(), order: v.number(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("membershipTiers", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateMembershipTier = mutation({
  args: {
    id: v.id("membershipTiers"), name: v.optional(v.string()),
    price: v.optional(v.number()), description: v.optional(v.string()),
    perks: v.optional(v.array(v.string())), isActive: v.optional(v.boolean()),
    order: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteMembershipTier = mutation({
  args: { id: v.id("membershipTiers") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

export const getMembers = query({
  args: { tierId: v.optional(v.id("membershipTiers")), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let members = await ctx.db.query("members").order("desc").collect();
    if (args.tierId) members = members.filter((m) => m.tierId === args.tierId);
    if (args.status) members = members.filter((m) => m.status === args.status);
    return members;
  },
});

export const getMembershipStats = query({
  args: {},
  handler: async (ctx) => {
    const tiers = await ctx.db.query("membershipTiers").collect();
    const members = await ctx.db.query("members").collect();
    const active = members.filter((m) => m.status === "active");
    const mrr = active.reduce((s, m) => {
      const tier = tiers.find((t) => t._id === m.tierId);
      return s + (tier?.price || 0);
    }, 0);
    return {
      totalMembers: members.length,
      activeMembers: active.length,
      totalTiers: tiers.filter((t) => t.isActive).length,
      mrr,
      totalRevenue: members.reduce((s, m) => s + (m.totalPaid || 0), 0),
    };
  },
});

export const addMember = mutation({
  args: {
    name: v.string(), email: v.string(), tierId: v.id("membershipTiers"),
    startDate: v.string(), nextBillingDate: v.optional(v.string()), notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const id = await ctx.db.insert("members", { ...args, status: "active", totalPaid: 0, createdAt: new Date().toISOString() });
    await ctx.db.insert("notifications", {
      type: "subscriber", title: "New Member",
      message: `${args.name} joined as a member!`,
      isRead: false, createdAt: new Date().toISOString(),
    });
    return id;
  },
});

export const updateMember = mutation({
  args: { id: v.id("members"), status: v.optional(v.string()), tierId: v.optional(v.id("membershipTiers")), totalPaid: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteMember = mutation({
  args: { id: v.id("members") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});
