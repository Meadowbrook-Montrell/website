/**
 * Command Center v2 — Convex Functions
 * Financial Dashboard, Merch Store, Email Campaigns, Contracts,
 * Tasks, Podcast RSS, Analytics, Brand Kit, Notifications
 */
import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

// ═══════════════════════════════════════════════════════════
//  11. FINANCIAL DASHBOARD
// ═══════════════════════════════════════════════════════════

export const getFinances = query({
  args: { type: v.optional(v.string()), month: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let records = await ctx.db.query("finances").order("desc").collect();
    if (args.type) records = records.filter((r) => r.type === args.type);
    if (args.month) records = records.filter((r) => r.date.startsWith(args.month!));
    return records;
  },
});

export const getFinancialStats = query({
  args: {},
  handler: async (ctx) => {
    const all = await ctx.db.query("finances").collect();
    const income = all.filter((r) => r.type === "income");
    const expenses = all.filter((r) => r.type === "expense");
    const invoices = all.filter((r) => r.type === "invoice");

    const totalIncome = income.reduce((s, r) => s + r.amount, 0);
    const totalExpenses = expenses.reduce((s, r) => s + r.amount, 0);
    const totalInvoiced = invoices.reduce((s, r) => s + r.amount, 0);
    const pendingInvoices = invoices.filter((r) => r.status === "pending");
    const overdueInvoices = invoices.filter((r) => r.status === "overdue");

    // Monthly breakdown (last 6 months)
    const monthly: { month: string; income: number; expenses: number }[] = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(); d.setMonth(d.getMonth() - i);
      const m = d.toISOString().slice(0, 7);
      monthly.push({
        month: m,
        income: all.filter((r) => r.date.startsWith(m) && r.type === "income").reduce((s, r) => s + r.amount, 0),
        expenses: all.filter((r) => r.date.startsWith(m) && r.type === "expense").reduce((s, r) => s + r.amount, 0),
      });
    }

    // By category
    const byCategory: Record<string, number> = {};
    all.forEach((r) => { byCategory[r.category] = (byCategory[r.category] || 0) + r.amount; });

    return {
      totalIncome, totalExpenses, netProfit: totalIncome - totalExpenses,
      totalInvoiced, pendingInvoiceCount: pendingInvoices.length,
      overdueInvoiceCount: overdueInvoices.length,
      pendingAmount: pendingInvoices.reduce((s, r) => s + r.amount, 0),
      monthly, byCategory, totalRecords: all.length,
    };
  },
});

export const addFinance = mutation({
  args: {
    type: v.string(), category: v.string(), amount: v.number(),
    description: v.string(), date: v.string(), status: v.string(),
    invoiceNumber: v.optional(v.string()), clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()), dueDate: v.optional(v.string()),
    recurring: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("finances", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateFinance = mutation({
  args: {
    id: v.id("finances"), status: v.optional(v.string()),
    amount: v.optional(v.number()), paidDate: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteFinance = mutation({
  args: { id: v.id("finances") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  12. MERCH STORE
// ═══════════════════════════════════════════════════════════

export const getMerchProducts = query({
  args: { activeOnly: v.optional(v.boolean()), category: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let products = await ctx.db.query("merchProducts").order("desc").collect();
    if (args.activeOnly) products = products.filter((p) => p.isActive);
    if (args.category) products = products.filter((p) => p.category === args.category);
    return products;
  },
});

export const addMerchProduct = mutation({
  args: {
    name: v.string(), description: v.optional(v.string()), price: v.number(),
    compareAtPrice: v.optional(v.number()), category: v.string(),
    imageUrl: v.optional(v.string()), sizes: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())), stock: v.optional(v.number()),
    isActive: v.boolean(), isFeatured: v.optional(v.boolean()),
    externalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("merchProducts", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateMerchProduct = mutation({
  args: {
    id: v.id("merchProducts"), name: v.optional(v.string()),
    price: v.optional(v.number()), stock: v.optional(v.number()),
    isActive: v.optional(v.boolean()), isFeatured: v.optional(v.boolean()),
    description: v.optional(v.string()), imageUrl: v.optional(v.string()),
    externalUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteMerchProduct = mutation({
  args: { id: v.id("merchProducts") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// Orders
export const getMerchOrders = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let orders = await ctx.db.query("merchOrders").order("desc").collect();
    if (args.status) orders = orders.filter((o) => o.status === args.status);
    return orders;
  },
});

export const addMerchOrder = mutation({
  args: {
    customerName: v.string(), customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    items: v.array(v.object({ productName: v.string(), size: v.optional(v.string()), color: v.optional(v.string()), quantity: v.number(), price: v.number() })),
    total: v.number(), shippingAddress: v.optional(v.string()), notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("merchOrders", { ...args, status: "pending", createdAt: new Date().toISOString() });
  },
});

export const updateMerchOrder = mutation({
  args: { id: v.id("merchOrders"), status: v.optional(v.string()), trackingNumber: v.optional(v.string()), notes: v.optional(v.string()) },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteMerchOrder = mutation({
  args: { id: v.id("merchOrders") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  14. EMAIL CAMPAIGNS
// ═══════════════════════════════════════════════════════════

export const getEmailCampaigns = query({
  args: { status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let campaigns = await ctx.db.query("emailCampaigns").order("desc").collect();
    if (args.status) campaigns = campaigns.filter((c) => c.status === args.status);
    return campaigns;
  },
});

export const addEmailCampaign = mutation({
  args: {
    name: v.string(), subject: v.string(), body: v.string(),
    template: v.string(), status: v.string(), scheduledAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("emailCampaigns", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateEmailCampaign = mutation({
  args: {
    id: v.id("emailCampaigns"), name: v.optional(v.string()),
    subject: v.optional(v.string()), body: v.optional(v.string()),
    status: v.optional(v.string()), scheduledAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const sendEmailCampaign = mutation({
  args: { id: v.id("emailCampaigns") },
  handler: async (ctx, args) => {
    const subscribers = await ctx.db.query("subscribers").collect();
    await ctx.db.patch(args.id, {
      status: "sent", sentAt: new Date().toISOString(), recipientCount: subscribers.length,
    });
    // Create notification
    await ctx.db.insert("notifications", {
      type: "system", title: "Campaign Sent",
      message: `Email campaign sent to ${subscribers.length} subscribers`,
      isRead: false, createdAt: new Date().toISOString(),
    });
    return { sent: subscribers.length };
  },
});

export const deleteEmailCampaign = mutation({
  args: { id: v.id("emailCampaigns") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  15. CONTRACTS & DOCUMENTS
// ═══════════════════════════════════════════════════════════

export const getDocuments = query({
  args: { type: v.optional(v.string()), status: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let docs = await ctx.db.query("documents").order("desc").collect();
    if (args.type) docs = docs.filter((d) => d.type === args.type);
    if (args.status) docs = docs.filter((d) => d.status === args.status);
    return docs;
  },
});

export const addDocument = mutation({
  args: {
    title: v.string(), type: v.string(), status: v.string(),
    partyName: v.optional(v.string()), partyEmail: v.optional(v.string()),
    description: v.optional(v.string()), fileUrl: v.optional(v.string()),
    expiresAt: v.optional(v.string()), tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("documents", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateDocument = mutation({
  args: {
    id: v.id("documents"), status: v.optional(v.string()),
    signedAt: v.optional(v.string()), title: v.optional(v.string()),
    description: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteDocument = mutation({
  args: { id: v.id("documents") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  16. TASKS & PROJECTS
// ═══════════════════════════════════════════════════════════

export const getTasks = query({
  args: { status: v.optional(v.string()), project: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let tasks = await ctx.db.query("tasks").order("desc").collect();
    if (args.status) tasks = tasks.filter((t) => t.status === args.status);
    if (args.project) tasks = tasks.filter((t) => t.project === args.project);
    return tasks;
  },
});

export const getProjects = query({
  args: {},
  handler: async (ctx) => {
    const tasks = await ctx.db.query("tasks").collect();
    const projects: Record<string, { total: number; done: number }> = {};
    tasks.forEach((t) => {
      const p = t.project || "Uncategorized";
      if (!projects[p]) projects[p] = { total: 0, done: 0 };
      projects[p].total++;
      if (t.status === "done") projects[p].done++;
    });
    return projects;
  },
});

export const addTask = mutation({
  args: {
    title: v.string(), description: v.optional(v.string()),
    project: v.optional(v.string()), status: v.string(),
    priority: v.string(), assignee: v.optional(v.string()),
    dueDate: v.optional(v.string()), tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("tasks", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateTask = mutation({
  args: {
    id: v.id("tasks"), title: v.optional(v.string()),
    status: v.optional(v.string()), priority: v.optional(v.string()),
    assignee: v.optional(v.string()), dueDate: v.optional(v.string()),
    description: v.optional(v.string()), project: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned: Record<string, any> = {};
    Object.entries(updates).forEach(([k, v]) => { if (v !== undefined) cleaned[k] = v; });
    if (cleaned.status === "done") cleaned.completedAt = new Date().toISOString();
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteTask = mutation({
  args: { id: v.id("tasks") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  17. PODCAST RSS EPISODES
// ═══════════════════════════════════════════════════════════

export const getPodcastEpisodes = query({
  args: { publishedOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let eps = await ctx.db.query("podcastEpisodes").order("desc").collect();
    if (args.publishedOnly) eps = eps.filter((e) => e.isPublished);
    return eps;
  },
});

export const addPodcastEpisode = mutation({
  args: {
    title: v.string(), description: v.string(),
    episodeNumber: v.optional(v.number()), season: v.optional(v.number()),
    audioUrl: v.optional(v.string()), duration: v.optional(v.string()),
    publishedAt: v.optional(v.string()), imageUrl: v.optional(v.string()),
    youtubeId: v.optional(v.string()), isPublished: v.boolean(),
    tags: v.optional(v.array(v.string())),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("podcastEpisodes", { ...args, downloads: 0, createdAt: new Date().toISOString() });
  },
});

export const updatePodcastEpisode = mutation({
  args: {
    id: v.id("podcastEpisodes"), title: v.optional(v.string()),
    description: v.optional(v.string()), audioUrl: v.optional(v.string()),
    isPublished: v.optional(v.boolean()), publishedAt: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deletePodcastEpisode = mutation({
  args: { id: v.id("podcastEpisodes") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  18. SITE ANALYTICS
// ═══════════════════════════════════════════════════════════

export const trackEvent = mutation({
  args: {
    event: v.string(), page: v.optional(v.string()),
    referrer: v.optional(v.string()), device: v.optional(v.string()),
    browser: v.optional(v.string()), country: v.optional(v.string()),
    sessionId: v.optional(v.string()), metadata: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("analyticsEvents", { ...args, timestamp: new Date().toISOString() });
  },
});

export const getAnalyticsStats = query({
  args: { days: v.optional(v.number()) },
  handler: async (ctx, args) => {
    const all = await ctx.db.query("analyticsEvents").order("desc").collect();
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (args.days || 30));
    const recent = all.filter((e) => new Date(e.timestamp) >= cutoff);

    const byEvent: Record<string, number> = {};
    const byPage: Record<string, number> = {};
    const byDevice: Record<string, number> = {};
    const byDay: Record<string, number> = {};

    recent.forEach((e) => {
      byEvent[e.event] = (byEvent[e.event] || 0) + 1;
      if (e.page) byPage[e.page] = (byPage[e.page] || 0) + 1;
      if (e.device) byDevice[e.device] = (byDevice[e.device] || 0) + 1;
      const day = e.timestamp.slice(0, 10);
      byDay[day] = (byDay[day] || 0) + 1;
    });

    return {
      totalEvents: recent.length,
      pageViews: byEvent["page_view"] || 0,
      videoPlays: byEvent["video_play"] || 0,
      signups: byEvent["signup"] || 0,
      byEvent, byPage, byDevice, byDay,
    };
  },
});

// ═══════════════════════════════════════════════════════════
//  19. BRAND KIT
// ═══════════════════════════════════════════════════════════

export const getBrandAssets = query({
  args: { type: v.optional(v.string()) },
  handler: async (ctx, args) => {
    let assets = await ctx.db.query("brandAssets").order("desc").collect();
    if (args.type) assets = assets.filter((a) => a.type === args.type);
    return assets;
  },
});

export const addBrandAsset = mutation({
  args: {
    name: v.string(), type: v.string(), value: v.optional(v.string()),
    fileUrl: v.optional(v.string()), thumbnailUrl: v.optional(v.string()),
    description: v.optional(v.string()), category: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("brandAssets", { ...args, createdAt: new Date().toISOString() });
  },
});

export const updateBrandAsset = mutation({
  args: {
    id: v.id("brandAssets"), name: v.optional(v.string()),
    value: v.optional(v.string()), description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { id, ...updates } = args;
    const cleaned = Object.fromEntries(Object.entries(updates).filter(([, v]) => v !== undefined));
    await ctx.db.patch(id, cleaned);
  },
});

export const deleteBrandAsset = mutation({
  args: { id: v.id("brandAssets") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  20. NOTIFICATIONS
// ═══════════════════════════════════════════════════════════

export const getNotifications = query({
  args: { unreadOnly: v.optional(v.boolean()) },
  handler: async (ctx, args) => {
    let notifs = await ctx.db.query("notifications").order("desc").collect();
    if (args.unreadOnly) notifs = notifs.filter((n) => !n.isRead);
    return notifs.slice(0, 50); // max 50
  },
});

export const getUnreadCount = query({
  args: {},
  handler: async (ctx) => {
    const notifs = await ctx.db.query("notifications").withIndex("by_read", (q) => q.eq("isRead", false)).collect();
    return notifs.length;
  },
});

export const markNotificationRead = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => { await ctx.db.patch(args.id, { isRead: true }); },
});

export const markAllNotificationsRead = mutation({
  args: {},
  handler: async (ctx) => {
    const unread = await ctx.db.query("notifications").withIndex("by_read", (q) => q.eq("isRead", false)).collect();
    await Promise.all(unread.map((n) => ctx.db.patch(n._id, { isRead: true })));
  },
});

export const addNotification = mutation({
  args: { type: v.string(), title: v.string(), message: v.string(), actionUrl: v.optional(v.string()) },
  handler: async (ctx, args) => {
    return await ctx.db.insert("notifications", { ...args, isRead: false, createdAt: new Date().toISOString() });
  },
});

export const deleteNotification = mutation({
  args: { id: v.id("notifications") },
  handler: async (ctx, args) => { await ctx.db.delete(args.id); },
});

// ═══════════════════════════════════════════════════════════
//  MASTER COMMAND CENTER STATS
// ═══════════════════════════════════════════════════════════

export const getCommandCenterStats = query({
  args: {},
  handler: async (ctx) => {
    const [finances, products, orders, campaigns, documents, tasks, episodes, analytics, notifications] = await Promise.all([
      ctx.db.query("finances").collect(),
      ctx.db.query("merchProducts").collect(),
      ctx.db.query("merchOrders").collect(),
      ctx.db.query("emailCampaigns").collect(),
      ctx.db.query("documents").collect(),
      ctx.db.query("tasks").collect(),
      ctx.db.query("podcastEpisodes").collect(),
      ctx.db.query("analyticsEvents").collect(),
      ctx.db.query("notifications").withIndex("by_read", (q) => q.eq("isRead", false)).collect(),
    ]);

    const income = finances.filter((f) => f.type === "income").reduce((s, f) => s + f.amount, 0);
    const expenses = finances.filter((f) => f.type === "expense").reduce((s, f) => s + f.amount, 0);

    return {
      netProfit: income - expenses,
      totalIncome: income,
      totalExpenses: expenses,
      activeProducts: products.filter((p) => p.isActive).length,
      pendingOrders: orders.filter((o) => o.status === "pending").length,
      campaignsSent: campaigns.filter((c) => c.status === "sent").length,
      activeContracts: documents.filter((d) => d.status === "signed").length,
      openTasks: tasks.filter((t) => t.status !== "done").length,
      completedTasks: tasks.filter((t) => t.status === "done").length,
      publishedEpisodes: episodes.filter((e) => e.isPublished).length,
      totalPageViews: analytics.filter((e) => e.event === "page_view").length,
      unreadNotifications: notifications.length,
    };
  },
});
