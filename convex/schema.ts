import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // ─── Content library items ────────────────────────────────
  content: defineTable({
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
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"]),

  // ─── Live session announcements ───────────────────────────
  liveSessions: defineTable({
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
  })
    .index("by_scheduled", ["scheduledAt"])
    .index("by_live", ["isLive"]),

  // ─── Newsletter / SMS subscribers ─────────────────────────
  subscribers: defineTable({
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    subscribedAt: v.string(),
    source: v.optional(v.string()),
  }).index("by_email", ["email"]),

  // ─── News ticker items ────────────────────────────────────
  tickerItems: defineTable({
    text: v.string(),
    isActive: v.boolean(),
    priority: v.optional(v.number()),
    link: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_active", ["isActive"]),

  // ─── Guest spotlights (existing) ─────────────────────────
  guests: defineTable({
    name: v.string(),
    title: v.optional(v.string()),
    quote: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    episodeUrl: v.optional(v.string()),
    youtubeId: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    createdAt: v.string(),
  }).index("by_featured", ["featured"]),

  // ─── Site analytics / page views ──────────────────────────
  pageViews: defineTable({
    page: v.string(),
    timestamp: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  }).index("by_page", ["page"]),

  // ═══════════════════════════════════════════════════════════
  //   NEW TABLES — Business Operations Hub
  // ═══════════════════════════════════════════════════════════

  // ─── 1. Content Calendar Events ───────────────────────────
  calendarEvents: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    type: v.string(), // "episode" | "interview" | "street-report" | "social-post" | "live-session" | "other"
    date: v.string(), // YYYY-MM-DD
    time: v.optional(v.string()), // HH:mm
    status: v.string(), // "planned" | "in-progress" | "recorded" | "published" | "cancelled"
    color: v.optional(v.string()),
    linkedContentId: v.optional(v.id("content")),
    linkedGuestId: v.optional(v.id("guestCRM")),
    createdAt: v.string(),
  })
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  // ─── 2. Guest CRM ────────────────────────────────────────
  guestCRM: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    instagram: v.optional(v.string()),
    twitter: v.optional(v.string()),
    facebook: v.optional(v.string()),
    tiktok: v.optional(v.string()),
    youtube: v.optional(v.string()),
    bio: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    status: v.string(), // "pitched" | "confirmed" | "recorded" | "published" | "declined"
    interviewDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    episodeId: v.optional(v.id("content")),
    createdAt: v.string(),
    updatedAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_name", ["name"]),

  // ─── 3. Guest Bookings (public form submissions) ─────────
  bookings: defineTable({
    guestName: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    socialHandle: v.optional(v.string()),
    topic: v.string(),
    preferredDate: v.string(),
    preferredTime: v.optional(v.string()),
    message: v.optional(v.string()),
    status: v.string(), // "pending" | "approved" | "declined" | "completed"
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_date", ["preferredDate"]),

  // ─── 4. Sponsors / Brand Deals ────────────────────────────
  sponsors: defineTable({
    companyName: v.string(),
    contactName: v.optional(v.string()),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    website: v.optional(v.string()),
    dealType: v.string(), // "sponsorship" | "ad-read" | "brand-deal" | "affiliate" | "inquiry"
    amount: v.optional(v.number()),
    status: v.string(), // "inquiry" | "negotiating" | "active" | "completed" | "declined"
    startDate: v.optional(v.string()),
    endDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_dealType", ["dealType"]),

  // ─── 5. Revenue Tracking ──────────────────────────────────
  revenue: defineTable({
    source: v.string(), // "sponsorship" | "merch" | "ad-revenue" | "brand-deal" | "affiliate" | "donation" | "other"
    amount: v.number(),
    description: v.string(),
    date: v.string(), // YYYY-MM-DD
    status: v.string(), // "pending" | "received" | "invoiced"
    sponsorId: v.optional(v.id("sponsors")),
    createdAt: v.string(),
  })
    .index("by_date", ["date"])
    .index("by_source", ["source"])
    .index("by_status", ["status"]),

  // ─── 6. Newsletter Campaigns ──────────────────────────────
  newsletters: defineTable({
    subject: v.string(),
    body: v.string(),
    status: v.string(), // "draft" | "scheduled" | "sent"
    scheduledAt: v.optional(v.string()),
    sentAt: v.optional(v.string()),
    recipientCount: v.optional(v.number()),
    openCount: v.optional(v.number()),
    createdAt: v.string(),
  }).index("by_status", ["status"]),

  // ─── 7. Show Notes ────────────────────────────────────────
  showNotes: defineTable({
    contentId: v.optional(v.id("content")),
    episodeTitle: v.string(),
    summary: v.optional(v.string()),
    timestamps: v.optional(v.array(v.object({
      time: v.string(),
      label: v.string(),
    }))),
    keyQuotes: v.optional(v.array(v.string())),
    tags: v.optional(v.array(v.string())),
    published: v.optional(v.boolean()),
    createdAt: v.string(),
  }).index("by_published", ["published"]),

  // ─── 8. Link-in-Bio Items ────────────────────────────────
  linkBioItems: defineTable({
    title: v.string(),
    url: v.string(),
    icon: v.optional(v.string()), // "youtube" | "facebook" | "tiktok" | "spotify" | "merch" | "custom"
    color: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
    clicks: v.optional(v.number()),
    createdAt: v.string(),
  }).index("by_active", ["isActive"]),

  // ─── 9. Community Board Posts ─────────────────────────────
  communityPosts: defineTable({
    authorName: v.string(),
    authorEmail: v.optional(v.string()),
    message: v.string(),
    type: v.string(), // "shoutout" | "topic-suggestion" | "question" | "message"
    isApproved: v.boolean(),
    isPinned: v.optional(v.boolean()),
    likes: v.optional(v.number()),
    adminReply: v.optional(v.string()),
    adminReplyAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_approved", ["isApproved"])
    .index("by_type", ["type"]),

  // ─── 10. Social Media Metrics (manual + API) ──────────────
  socialMetrics: defineTable({
    platform: v.string(), // "youtube" | "facebook" | "tiktok" | "instagram"
    followers: v.optional(v.number()),
    totalViews: v.optional(v.number()),
    totalLikes: v.optional(v.number()),
    totalVideos: v.optional(v.number()),
    lastUpdated: v.string(),
  }).index("by_platform", ["platform"]),

  // ═══════════════════════════════════════════════════════════
  //   COMMAND CENTER v2 — 10 Additional Features
  // ═══════════════════════════════════════════════════════════

  // ─── 11. Financial Transactions (invoices + expenses) ─────
  finances: defineTable({
    type: v.string(), // "income" | "expense" | "invoice"
    category: v.string(), // "sponsorship" | "merch" | "ad-revenue" | "equipment" | "software" | "travel" | "marketing" | "other"
    amount: v.number(),
    description: v.string(),
    date: v.string(),
    status: v.string(), // "paid" | "pending" | "overdue" | "cancelled"
    invoiceNumber: v.optional(v.string()),
    clientName: v.optional(v.string()),
    clientEmail: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    paidDate: v.optional(v.string()),
    attachmentUrl: v.optional(v.string()),
    recurring: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"])
    .index("by_date", ["date"])
    .index("by_category", ["category"]),

  // ─── 12. Merch Products ───────────────────────────────────
  merchProducts: defineTable({
    name: v.string(),
    description: v.optional(v.string()),
    price: v.number(),
    compareAtPrice: v.optional(v.number()),
    category: v.string(), // "hoodie" | "tshirt" | "hat" | "accessory" | "other"
    imageUrl: v.optional(v.string()),
    sizes: v.optional(v.array(v.string())),
    colors: v.optional(v.array(v.string())),
    stock: v.optional(v.number()),
    isActive: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    externalUrl: v.optional(v.string()), // link to purchase
    createdAt: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_active", ["isActive"]),

  // ─── 13. Merch Orders ─────────────────────────────────────
  merchOrders: defineTable({
    customerName: v.string(),
    customerEmail: v.string(),
    customerPhone: v.optional(v.string()),
    items: v.array(v.object({
      productName: v.string(),
      size: v.optional(v.string()),
      color: v.optional(v.string()),
      quantity: v.number(),
      price: v.number(),
    })),
    total: v.number(),
    status: v.string(), // "pending" | "confirmed" | "shipped" | "delivered" | "cancelled"
    shippingAddress: v.optional(v.string()),
    trackingNumber: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"]),

  // ─── 14. Email Campaigns ──────────────────────────────────
  emailCampaigns: defineTable({
    name: v.string(),
    subject: v.string(),
    body: v.string(),
    template: v.string(), // "new-episode" | "live-alert" | "merch-drop" | "newsletter" | "custom"
    status: v.string(), // "draft" | "scheduled" | "sent"
    scheduledAt: v.optional(v.string()),
    sentAt: v.optional(v.string()),
    recipientCount: v.optional(v.number()),
    openRate: v.optional(v.number()),
    clickRate: v.optional(v.number()),
    createdAt: v.string(),
  }).index("by_status", ["status"]),

  // ─── 15. Contracts & Documents ────────────────────────────
  documents: defineTable({
    title: v.string(),
    type: v.string(), // "contract" | "agreement" | "release" | "nda" | "invoice" | "receipt" | "other"
    status: v.string(), // "draft" | "sent" | "signed" | "expired" | "cancelled"
    partyName: v.optional(v.string()),
    partyEmail: v.optional(v.string()),
    description: v.optional(v.string()),
    fileUrl: v.optional(v.string()),
    expiresAt: v.optional(v.string()),
    signedAt: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.string(),
  })
    .index("by_type", ["type"])
    .index("by_status", ["status"]),

  // ─── 16. Tasks & Projects ─────────────────────────────────
  tasks: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    project: v.optional(v.string()), // group tasks by project
    status: v.string(), // "todo" | "in-progress" | "review" | "done"
    priority: v.string(), // "low" | "medium" | "high" | "urgent"
    assignee: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    tags: v.optional(v.array(v.string())),
    completedAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"])
    .index("by_project", ["project"]),

  // ─── 17. Podcast RSS Episodes ─────────────────────────────
  podcastEpisodes: defineTable({
    title: v.string(),
    description: v.string(),
    episodeNumber: v.optional(v.number()),
    season: v.optional(v.number()),
    audioUrl: v.optional(v.string()),
    duration: v.optional(v.string()),
    publishedAt: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    youtubeId: v.optional(v.string()),
    isPublished: v.boolean(),
    showNotesId: v.optional(v.id("showNotes")),
    downloads: v.optional(v.number()),
    tags: v.optional(v.array(v.string())),
    createdAt: v.string(),
  })
    .index("by_published", ["isPublished"]),

  // ─── 18. Site Analytics (detailed) ────────────────────────
  analyticsEvents: defineTable({
    event: v.string(), // "page_view" | "video_play" | "link_click" | "signup" | "booking"
    page: v.optional(v.string()),
    referrer: v.optional(v.string()),
    device: v.optional(v.string()), // "mobile" | "tablet" | "desktop"
    browser: v.optional(v.string()),
    country: v.optional(v.string()),
    sessionId: v.optional(v.string()),
    metadata: v.optional(v.string()), // JSON string for extra data
    timestamp: v.string(),
  })
    .index("by_event", ["event"])
    .index("by_timestamp", ["timestamp"]),

  // ─── 19. Brand Kit Assets ─────────────────────────────────
  brandAssets: defineTable({
    name: v.string(),
    type: v.string(), // "logo" | "color" | "font" | "template" | "photo" | "video" | "guideline"
    value: v.optional(v.string()), // hex for colors, font name, url for files
    fileUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.optional(v.string()), // "primary" | "secondary" | "social" | "print"
    createdAt: v.string(),
  })
    .index("by_type", ["type"]),

  // ═══════════════════════════════════════════════════════════
  //   PHASE 3 — Business Ops + Consumer Features (12 new)
  // ═══════════════════════════════════════════════════════════

  // ─── 21. Invoices (branded, PDF-ready) ────────────────────
  invoices: defineTable({
    invoiceNumber: v.string(),
    clientName: v.string(),
    clientEmail: v.optional(v.string()),
    clientCompany: v.optional(v.string()),
    items: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
    })),
    subtotal: v.number(),
    tax: v.optional(v.number()),
    total: v.number(),
    status: v.string(), // "draft" | "sent" | "paid" | "overdue" | "cancelled"
    issueDate: v.string(),
    dueDate: v.string(),
    paidDate: v.optional(v.string()),
    notes: v.optional(v.string()),
    sponsorId: v.optional(v.id("sponsors")),
    guestId: v.optional(v.id("guestCRM")),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_client", ["clientName"]),

  // ─── 22. Media Releases / Waivers ────────────────────────
  waivers: defineTable({
    type: v.string(), // "media-release" | "interview-consent" | "filming-permit" | "liability-waiver" | "nda"
    guestName: v.string(),
    guestEmail: v.optional(v.string()),
    guestPhone: v.optional(v.string()),
    description: v.optional(v.string()),
    episodeTitle: v.optional(v.string()),
    locationFilmed: v.optional(v.string()),
    dateFilmed: v.optional(v.string()),
    status: v.string(), // "pending" | "signed" | "expired" | "revoked"
    signedAt: v.optional(v.string()),
    signatureData: v.optional(v.string()), // base64 signature image
    ipAddress: v.optional(v.string()),
    guestCRMId: v.optional(v.id("guestCRM")),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_guest", ["guestName"]),

  // ─── 23. Content Schedule (multi-platform calendar) ──────
  contentSchedule: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    platform: v.string(), // "youtube" | "tiktok" | "instagram" | "facebook" | "twitter" | "website" | "all"
    contentType: v.string(), // "video" | "short" | "reel" | "story" | "post" | "live" | "blog" | "podcast"
    status: v.string(), // "idea" | "filming" | "editing" | "scheduled" | "posted" | "cancelled"
    scheduledDate: v.string(),
    scheduledTime: v.optional(v.string()),
    publishedUrl: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    assignee: v.optional(v.string()),
    notes: v.optional(v.string()),
    linkedContentId: v.optional(v.id("content")),
    createdAt: v.string(),
  })
    .index("by_date", ["scheduledDate"])
    .index("by_platform", ["platform"])
    .index("by_status", ["status"]),

  // ─── 24. Team / Crew Members ──────────────────────────────
  teamMembers: defineTable({
    name: v.string(),
    role: v.string(), // "editor" | "cameraman" | "producer" | "social-manager" | "designer" | "writer" | "other"
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    rate: v.optional(v.number()), // per hour or per project
    rateType: v.optional(v.string()), // "hourly" | "per-project" | "salary"
    isActive: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_role", ["role"])
    .index("by_active", ["isActive"]),

  // ─── 25. Time Entries (crew hours) ────────────────────────
  timeEntries: defineTable({
    teamMemberId: v.id("teamMembers"),
    date: v.string(),
    hours: v.number(),
    description: v.string(),
    project: v.optional(v.string()),
    status: v.string(), // "logged" | "approved" | "paid"
    amount: v.optional(v.number()),
    createdAt: v.string(),
  })
    .index("by_member", ["teamMemberId"])
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  // ─── 26. Membership Tiers ─────────────────────────────────
  membershipTiers: defineTable({
    name: v.string(),
    price: v.number(), // monthly
    description: v.string(),
    perks: v.array(v.string()),
    color: v.optional(v.string()),
    isActive: v.boolean(),
    order: v.number(),
    createdAt: v.string(),
  }).index("by_active", ["isActive"]),

  // ─── 27. Members (subscriptions) ──────────────────────────
  members: defineTable({
    name: v.string(),
    email: v.string(),
    tierId: v.id("membershipTiers"),
    status: v.string(), // "active" | "paused" | "cancelled" | "expired"
    startDate: v.string(),
    nextBillingDate: v.optional(v.string()),
    totalPaid: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_tier", ["tierId"])
    .index("by_status", ["status"])
    .index("by_email", ["email"]),

  // ─── 28. Blog Posts ───────────────────────────────────────
  blogPosts: defineTable({
    title: v.string(),
    slug: v.string(),
    excerpt: v.optional(v.string()),
    body: v.string(), // markdown
    coverImageUrl: v.optional(v.string()),
    category: v.string(), // "street-story" | "opinion" | "behind-the-scenes" | "news" | "interview-recap"
    tags: v.optional(v.array(v.string())),
    isPublished: v.boolean(),
    publishedAt: v.optional(v.string()),
    views: v.optional(v.number()),
    authorName: v.optional(v.string()),
    relatedEpisodeId: v.optional(v.id("content")),
    createdAt: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["isPublished"])
    .index("by_category", ["category"]),

  // ─── 29. Public Events (live shows, pop-ups, etc) ────────
  publicEvents: defineTable({
    title: v.string(),
    description: v.string(),
    eventType: v.string(), // "live-show" | "pop-up" | "meet-greet" | "recording" | "panel" | "other"
    date: v.string(),
    time: v.optional(v.string()),
    endTime: v.optional(v.string()),
    location: v.optional(v.string()),
    address: v.optional(v.string()),
    isVirtual: v.optional(v.boolean()),
    streamUrl: v.optional(v.string()),
    ticketUrl: v.optional(v.string()),
    ticketPrice: v.optional(v.number()),
    isFree: v.optional(v.boolean()),
    imageUrl: v.optional(v.string()),
    maxAttendees: v.optional(v.number()),
    rsvpCount: v.optional(v.number()),
    isPublished: v.boolean(),
    createdAt: v.string(),
  })
    .index("by_date", ["date"])
    .index("by_published", ["isPublished"]),

  // ─── 30. Event RSVPs ──────────────────────────────────────
  eventRsvps: defineTable({
    eventId: v.id("publicEvents"),
    name: v.string(),
    email: v.string(),
    phone: v.optional(v.string()),
    attendees: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_event", ["eventId"])
    .index("by_email", ["email"]),

  // ─── 31. Fan Submissions (questions, tips, shoutouts) ────
  fanSubmissions: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    type: v.string(), // "question" | "story-tip" | "shoutout" | "topic-request" | "feedback"
    message: v.string(),
    isApproved: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    adminResponse: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_type", ["type"])
    .index("by_approved", ["isApproved"])
    .index("by_featured", ["isFeatured"]),

  // ─── 32. Site Settings (theme, preferences) ───────────────
  // ─── Admin Sessions (server-side auth) ─────────────────────
  adminSessions: defineTable({
    token: v.string(),
    createdAt: v.string(),
    expiresAt: v.string(),
  }).index("by_token", ["token"]),

  siteSettings: defineTable({
    key: v.string(),
    value: v.string(),
    updatedAt: v.string(),
  }).index("by_key", ["key"]),

  // ─── 20. Notifications ────────────────────────────────────
  notifications: defineTable({
    type: v.string(), // "booking" | "subscriber" | "community" | "sponsor" | "order" | "system"
    title: v.string(),
    message: v.string(),
    isRead: v.boolean(),
    actionUrl: v.optional(v.string()),
    metadata: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_read", ["isRead"])
    .index("by_type", ["type"]),

  // ═══════════════════════════════════════════════════════════
  //   POWER-UP FEATURES — 10 New Modules
  // ═══════════════════════════════════════════════════════════

  // ─── 21. Media Library / Asset Manager ────────────────────
  mediaAssets: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    fileUrl: v.string(),
    thumbnailUrl: v.optional(v.string()),
    fileType: v.string(), // "image" | "video" | "audio" | "document"
    fileSize: v.optional(v.number()),
    tags: v.optional(v.string()), // comma-separated
    project: v.optional(v.string()), // episode name, event, etc.
    isFavorite: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_type", ["fileType"])
    .index("by_project", ["project"]),

  // ─── 22. Tip Jar / Donations ──────────────────────────────
  donations: defineTable({
    donorName: v.string(),
    donorEmail: v.optional(v.string()),
    amount: v.number(),
    platform: v.string(), // "cashapp" | "paypal" | "venmo" | "stripe" | "other"
    message: v.optional(v.string()),
    isAnonymous: v.optional(v.boolean()),
    isShoutout: v.optional(v.boolean()), // show on community wall
    createdAt: v.string(),
  })
    .index("by_platform", ["platform"]),

  // ─── 23. Live Stream Command Center ───────────────────────
  liveStreams: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    scheduledAt: v.string(),
    platforms: v.string(), // comma-separated: "youtube,facebook,tiktok"
    status: v.string(), // "scheduled" | "live" | "ended" | "cancelled"
    thumbnailUrl: v.optional(v.string()),
    streamUrl: v.optional(v.string()),
    chatModeration: v.optional(v.string()), // "strict" | "moderate" | "open"
    checklist: v.optional(v.string()), // JSON array of {item, done}
    peakViewers: v.optional(v.number()),
    totalViewers: v.optional(v.number()),
    duration: v.optional(v.number()), // minutes
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"]),

  // ─── 24. Clip Generator Queue ─────────────────────────────
  clipQueue: defineTable({
    sourceTitle: v.string(),
    sourceUrl: v.optional(v.string()),
    startTime: v.string(), // "01:23:45"
    endTime: v.string(),
    clipTitle: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "queued" | "editing" | "exported" | "posted"
    platforms: v.optional(v.string()), // comma-separated platforms posted to
    exportUrl: v.optional(v.string()),
    priority: v.optional(v.string()), // "high" | "medium" | "low"
    createdAt: v.string(),
  })
    .index("by_status", ["status"]),

  // ─── 25. Audience Analytics ───────────────────────────────
  audienceSnapshots: defineTable({
    date: v.string(),
    totalVisitors: v.optional(v.number()),
    uniqueVisitors: v.optional(v.number()),
    topPage: v.optional(v.string()),
    topReferrer: v.optional(v.string()),
    subscriberCount: v.optional(v.number()),
    communityPosts: v.optional(v.number()),
    donationTotal: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_date", ["date"]),

  // ─── 26. Automated Workflows ──────────────────────────────
  workflows: defineTable({
    name: v.string(),
    trigger: v.string(), // "new_subscriber" | "new_community_post" | "new_booking" | "new_donation" | "scheduled"
    action: v.string(), // "send_email" | "slack_notify" | "auto_approve" | "send_waiver" | "add_notification"
    config: v.optional(v.string()), // JSON config for the action
    isActive: v.boolean(),
    lastTriggered: v.optional(v.string()),
    triggerCount: v.optional(v.number()),
    createdAt: v.string(),
  })
    .index("by_trigger", ["trigger"])
    .index("by_active", ["isActive"]),

  // ─── 27. Contacts / Source Database ───────────────────────
  contacts: defineTable({
    name: v.string(),
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    role: v.string(), // "source" | "collaborator" | "videographer" | "sponsor" | "venue" | "media" | "other"
    organization: v.optional(v.string()),
    notes: v.optional(v.string()),
    lastInteraction: v.optional(v.string()),
    followUpDate: v.optional(v.string()),
    isFavorite: v.optional(v.boolean()),
    tags: v.optional(v.string()), // comma-separated
    createdAt: v.string(),
  })
    .index("by_role", ["role"]),

  // ─── 28. Story / Assignment Tracker ───────────────────────
  stories: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    status: v.string(), // "lead" | "researching" | "filming" | "editing" | "published" | "killed"
    priority: v.string(), // "urgent" | "high" | "medium" | "low"
    source: v.optional(v.string()), // who tipped it
    location: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.string()),
    publishUrl: v.optional(v.string()),
    notes: v.optional(v.string()),
    tags: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_priority", ["priority"]),

  // ─── 29b. Merch Fulfillment (extends existing merchOrders + merchProducts) ──

  // ─── 30. Affiliate & Promo Code Manager ───────────────────
  promoCodes: defineTable({
    code: v.string(),
    type: v.string(), // "affiliate" | "discount" | "referral"
    discountPercent: v.optional(v.number()),
    discountAmount: v.optional(v.number()),
    partner: v.optional(v.string()), // sponsor/affiliate name
    commissionPercent: v.optional(v.number()),
    totalUses: v.optional(v.number()),
    totalRevenue: v.optional(v.number()),
    totalCommission: v.optional(v.number()),
    isActive: v.boolean(),
    expiresAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_code", ["code"])
    .index("by_active", ["isActive"]),

  // ═══════════════════════════════════════════════════════════
  //   PHASE 3 FEATURES — 15 New Modules
  // ═══════════════════════════════════════════════════════════

  // ─── 31b. Expenses Tracker ────────────────────────────────
  expenses: defineTable({
    title: v.optional(v.string()),
    description: v.optional(v.string()),
    category: v.string(), // "equipment" | "travel" | "studio" | "software" | "marketing" | "food" | "other"
    amount: v.number(),
    vendor: v.optional(v.string()),
    receipt: v.optional(v.string()), // URL to receipt image
    date: v.string(),
    isRecurring: v.optional(v.boolean()),
    isDeductible: v.optional(v.boolean()),
    mileage: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_category", ["category"])
    .index("by_date", ["date"]),

  // ─── 32b. Contracts & E-Sign ──────────────────────────────
  contracts: defineTable({
    title: v.string(),
    party: v.string(), // guest, sponsor, venue, etc.
    partyEmail: v.optional(v.string()),
    type: v.string(), // "guest-release" | "sponsorship" | "nda" | "vendor" | "custom"
    status: v.string(), // "draft" | "sent" | "viewed" | "signed" | "expired" | "cancelled"
    content: v.optional(v.string()), // the actual contract text
    signedAt: v.optional(v.string()),
    expiresAt: v.optional(v.string()),
    amount: v.optional(v.number()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // ─── 33. AI Content Prompts / Generated Content ───────────
  aiContent: defineTable({
    sourceTitle: v.string(), // video title, episode, etc.
    type: v.string(), // "description" | "caption" | "blog-post" | "show-notes" | "email" | "thread"
    platform: v.optional(v.string()), // "youtube" | "instagram" | "tiktok" | "twitter" | "email"
    generatedText: v.string(),
    isSaved: v.optional(v.boolean()),
    isUsed: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_type", ["type"]),

  // ─── 34. Follow-Up Reminders ──────────────────────────────
  followUps: defineTable({
    contactName: v.string(),
    contactEmail: v.optional(v.string()),
    contactType: v.string(), // "guest" | "sponsor" | "source" | "collaborator" | "vendor"
    reason: v.string(),
    dueDate: v.string(),
    status: v.string(), // "pending" | "completed" | "snoozed" | "cancelled"
    priority: v.optional(v.string()), // "high" | "medium" | "low"
    notes: v.optional(v.string()),
    completedAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_dueDate", ["dueDate"]),

  // ─── 35. Publishing Pipeline ──────────────────────────────
  pipeline: defineTable({
    title: v.string(),
    contentType: v.string(), // "episode" | "short" | "blog" | "social-post" | "podcast"
    stage: v.string(), // "idea" | "filming" | "editing" | "review" | "scheduling" | "published"
    platforms: v.optional(v.string()), // comma-separated
    scheduledDate: v.optional(v.string()),
    publishedDate: v.optional(v.string()),
    publishUrl: v.optional(v.string()),
    assignedTo: v.optional(v.string()),
    thumbnail: v.optional(v.string()),
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_stage", ["stage"])
    .index("by_contentType", ["contentType"]),

  // ─── 36. Fan Q&A (public) ─────────────────────────────────
  fanQA: defineTable({
    fanName: v.string(),
    fanEmail: v.optional(v.string()),
    question: v.string(),
    answer: v.optional(v.string()),
    answeredAt: v.optional(v.string()),
    isApproved: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    upvotes: v.optional(v.number()),
    category: v.optional(v.string()), // "podcast" | "personal" | "fort-worth" | "business" | "general"
    createdAt: v.string(),
  })
    .index("by_approved", ["isApproved"])
    .index("by_featured", ["isFeatured"]),

  // ─── 37. Fan Leaderboard ──────────────────────────────────
  fanPoints: defineTable({
    fanName: v.string(),
    fanEmail: v.optional(v.string()),
    points: v.number(),
    level: v.optional(v.string()), // "rookie" | "regular" | "vip" | "legend"
    communityPosts: v.optional(v.number()),
    eventAttendances: v.optional(v.number()),
    questionsAsked: v.optional(v.number()),
    referrals: v.optional(v.number()),
    lastActive: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_points", ["points"]),

  // ─── 38. Breaking News Alerts ─────────────────────────────
  breakingAlerts: defineTable({
    headline: v.string(),
    message: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    linkText: v.optional(v.string()),
    severity: v.string(), // "breaking" | "urgent" | "info"
    isActive: v.boolean(),
    expiresAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_active", ["isActive"]),

  // ─── 39. Exclusive / Members-Only Content ─────────────────
  exclusiveContent: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    contentType: v.string(), // "video" | "audio" | "article" | "download" | "early-access"
    contentUrl: v.optional(v.string()),
    youtubeId: v.optional(v.string()),
    thumbnailUrl: v.optional(v.string()),
    accessLevel: v.string(), // "subscriber" | "member" | "donor" | "merch-buyer"
    isPublished: v.boolean(),
    publishedAt: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_accessLevel", ["accessLevel"])
    .index("by_published", ["isPublished"]),

  // === PHASE 4: AI SUITE + ENTERPRISE + FAN ENGAGEMENT 2.0 ===

  // 1. AI Contract Generator
  aiContracts: defineTable({
    templateType: v.string(),
    title: v.string(),
    parties: v.object({ party1: v.string(), party2: v.string() }),
    fields: v.any(),
    generatedText: v.string(),
    status: v.string(),
    createdAt: v.string(),
    expiresAt: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_template", ["templateType"]),

  // 2. AI Social Captions
  aiCaptions: defineTable({
    sourceTitle: v.string(),
    sourceTopic: v.optional(v.string()),
    platform: v.string(),
    generatedCaption: v.string(),
    hashtags: v.array(v.string()),
    isSaved: v.optional(v.boolean()),
    isUsed: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_platform", ["platform"]),

  // 3. AI Episode Prep Kit
  aiEpisodePrep: defineTable({
    guestName: v.string(),
    guestBio: v.optional(v.string()),
    topic: v.string(),
    questions: v.array(v.string()),
    outline: v.string(),
    talkingPoints: v.array(v.string()),
    coldOpen: v.optional(v.string()),
    createdAt: v.string(),
    episodeDate: v.optional(v.string()),
    isUsed: v.optional(v.boolean()),
  })
    .index("by_guest", ["guestName"]),

  // 4. AI Invoice Generator
  aiInvoices: defineTable({
    invoiceNumber: v.string(),
    clientName: v.string(),
    clientEmail: v.optional(v.string()),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
    })),
    subtotal: v.number(),
    taxRate: v.optional(v.number()),
    taxAmount: v.optional(v.number()),
    total: v.number(),
    status: v.string(),
    dueDate: v.string(),
    createdAt: v.string(),
    paidAt: v.optional(v.string()),
    notes: v.optional(v.string()),
  })
    .index("by_status", ["status"])
    .index("by_client", ["clientName"]),

  // 5. AI Content Repurposer
  aiRepurpose: defineTable({
    sourceTitle: v.string(),
    sourceType: v.string(),
    sourceUrl: v.optional(v.string()),
    suggestions: v.array(v.object({
      platform: v.string(),
      format: v.string(),
      description: v.string(),
      isCompleted: v.optional(v.boolean()),
    })),
    createdAt: v.string(),
  }),

  // 6. CRM Intelligence
  contactScores: defineTable({
    contactId: v.optional(v.id("contacts")),
    contactName: v.string(),
    relationshipScore: v.number(),
    lastInteraction: v.optional(v.string()),
    interactionCount: v.number(),
    revenueGenerated: v.optional(v.number()),
    tags: v.array(v.string()),
    healthStatus: v.string(),
    suggestedAction: v.optional(v.string()),
    updatedAt: v.string(),
  })
    .index("by_health", ["healthStatus"])
    .index("by_score", ["relationshipScore"]),

  // 7. Competitor Tracker
  competitors: defineTable({
    name: v.string(),
    platform: v.string(),
    profileUrl: v.optional(v.string()),
    url: v.optional(v.string()),
    subscribers: v.optional(v.number()),
    followers: v.optional(v.number()),
    avgViews: v.optional(v.number()),
    uploadFrequency: v.optional(v.string()),
    contentThemes: v.optional(v.array(v.string())),
    notes: v.optional(v.string()),
    lastChecked: v.optional(v.string()),
    isActive: v.optional(v.boolean()),
    category: v.optional(v.string()),
    location: v.optional(v.string()),
    createdAt: v.optional(v.string()),
    snapshots: v.optional(v.array(v.object({
      date: v.string(),
      followers: v.number(),
      views: v.optional(v.number()),
    }))),
  })
    .index("by_platform", ["platform"]),

  // 8. Brand Deal Calculator
  brandDeals: defineTable({
    platform: v.string(),
    followers: v.number(),
    avgViews: v.number(),
    engagementRate: v.number(),
    niche: v.string(),
    dealType: v.string(),
    calculatedRate: v.number(),
    rateRange: v.object({ low: v.number(), high: v.number() }),
    createdAt: v.string(),
    notes: v.optional(v.string()),
  })
    .index("by_platform", ["platform"]),

  // 9. Weekly Reports
  weeklyReports: defineTable({
    weekStart: v.string(),
    weekEnd: v.string(),
    revenue: v.object({
      total: v.number(),
      donations: v.number(),
      sponsors: v.number(),
      merch: v.number(),
      bookings: v.number(),
    }),
    content: v.object({
      published: v.number(),
      views: v.number(),
      newSubscribers: v.number(),
    }),
    community: v.object({
      newFans: v.number(),
      messages: v.number(),
      qaQuestions: v.number(),
    }),
    operations: v.object({
      tasksCompleted: v.number(),
      tasksPending: v.number(),
      overdueFollowUps: v.number(),
    }),
    highlights: v.array(v.string()),
    createdAt: v.string(),
  })
    .index("by_week", ["weekStart"]),

  // 10. Team Roles
  teamRoles: defineTable({
    userName: v.string(),
    email: v.string(),
    role: v.string(),
    permissions: v.array(v.string()),
    isActive: v.optional(v.boolean()),
    lastLogin: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_role", ["role"])
    .index("by_email", ["email"]),

  // 11. Live Polls
  livePolls: defineTable({
    question: v.string(),
    options: v.array(v.object({
      text: v.string(),
      votes: v.number(),
    })),
    isActive: v.boolean(),
    totalVotes: v.number(),
    createdAt: v.string(),
    endsAt: v.optional(v.string()),
    showResults: v.optional(v.boolean()),
  })
    .index("by_active", ["isActive"]),

  pollVotes: defineTable({
    pollId: v.id("livePolls"),
    optionIndex: v.number(),
    voterId: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_poll", ["pollId"]),

  // 12. Fan Art Gallery
  fanArt: defineTable({
    submitterName: v.string(),
    submitterEmail: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(),
    isApproved: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_approved", ["isApproved"])
    .index("by_featured", ["isFeatured"]),

  // 13. Achievements & Badges
  achievements: defineTable({
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    category: v.string(),
    criteria: v.string(),
    threshold: v.optional(v.number()),
    isActive: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_category", ["category"]),

  fanBadges: defineTable({
    fanName: v.string(),
    fanEmail: v.optional(v.string()),
    achievementId: v.id("achievements"),
    earnedAt: v.string(),
  })
    .index("by_fan", ["fanName"]),

  // 14. Content Request Board
  contentRequests: defineTable({
    title: v.string(),
    description: v.string(),
    submitterName: v.string(),
    submitterEmail: v.optional(v.string()),
    category: v.string(),
    votes: v.number(),
    status: v.string(),
    adminResponse: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_votes", ["votes"])
    .index("by_status", ["status"]),

  requestVotes: defineTable({
    requestId: v.id("contentRequests"),
    voterId: v.string(),
    createdAt: v.string(),
  })
    .index("by_request", ["requestId"]),

  // 15. Exclusive Drops Calendar
  exclusiveDrops: defineTable({
    title: v.string(),
    description: v.string(),
    type: v.string(),
    dropDate: v.string(),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
    isPublished: v.boolean(),
    isDropped: v.optional(v.boolean()),
    createdAt: v.string(),
  })
    .index("by_date", ["dropDate"])
    .index("by_type", ["type"])
    .index("by_published", ["isPublished"]),

  // ═══════════════════════════════════════════════════════════
  //  MUSIC PRODUCTION COMMAND CENTER
  // ═══════════════════════════════════════════════════════════

  // ─── Artist Roster ────────────────────────────────────────
  artists: defineTable({
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
    createdAt: v.string(),
  })
    .index("by_role", ["role"])
    .index("by_status", ["status"]),

  // ─── Music Projects (Songs / Albums / EPs) ────────────────
  musicProjects: defineTable({
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
    progress: v.optional(v.number()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_type", ["type"]),

  // ─── Studio Sessions ─────────────────────────────────────
  studioSessions: defineTable({
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
    createdAt: v.string(),
  })
    .index("by_date", ["date"])
    .index("by_status", ["status"]),

  // ─── Beat / Production Library ────────────────────────────
  beatLibrary: defineTable({
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
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_producer", ["producerName"]),

  // ─── Release Manager ─────────────────────────────────────
  releases: defineTable({
    title: v.string(),
    artistName: v.string(),
    type: v.string(), // "single" | "ep" | "album" | "mixtape"
    releaseDate: v.optional(v.string()),
    status: v.string(), // "planning" | "pre-production" | "production" | "post-production" | "submitted" | "scheduled" | "released"
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
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_artist", ["artistName"])
    .index("by_releaseDate", ["releaseDate"]),

  // ─── Split Sheets & Credits ───────────────────────────────
  splitSheets: defineTable({
    trackTitle: v.string(),
    projectId: v.optional(v.string()),
    contributors: v.array(v.object({
      name: v.string(),
      role: v.string(),
      percentage: v.number(),
      publisherName: v.optional(v.string()),
      pro: v.optional(v.string()),
      ipi: v.optional(v.string()),
    })),
    status: v.optional(v.string()), // "draft" | "pending" | "agreed" | "signed"
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"]),

  // ─── Music Store — Digital Downloads & Previews ───────────
  musicStoreItems: defineTable({
    title: v.string(),
    artistName: v.string(),
    itemType: v.string(), // "single" | "album" | "ep" | "beat"
    price: v.number(),
    description: v.optional(v.string()),
    genre: v.optional(v.string()),
    coverArtUrl: v.optional(v.string()),
    previewAudioUrl: v.optional(v.string()), // 30-second preview clip
    fullAudioUrl: v.optional(v.string()), // full track (post-purchase)
    downloadUrl: v.optional(v.string()), // direct download link
    duration: v.optional(v.string()), // "3:42" display format
    bpm: v.optional(v.number()),
    key: v.optional(v.string()),
    releaseDate: v.optional(v.string()),
    albumId: v.optional(v.id("musicStoreItems")), // parent album for tracks
    trackNumber: v.optional(v.number()),
    isActive: v.boolean(),
    isFeatured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
    streamingLinks: v.optional(v.object({
      spotify: v.optional(v.string()),
      appleMusic: v.optional(v.string()),
      youtube: v.optional(v.string()),
      soundcloud: v.optional(v.string()),
      tidal: v.optional(v.string()),
    })),
    notes: v.optional(v.string()),
    playCount: v.optional(v.number()),
    purchaseCount: v.optional(v.number()),
    createdAt: v.string(),
  })
    .index("by_isActive", ["isActive"])
    .index("by_isFeatured", ["isFeatured"])
    .index("by_itemType", ["itemType"])
    .index("by_artistName", ["artistName"])
    .index("by_albumId", ["albumId"]),

  // ─── Music Purchases / Orders ─────────────────────────────
  musicPurchases: defineTable({
    itemId: v.id("musicStoreItems"),
    itemTitle: v.string(),
    artistName: v.string(),
    itemType: v.string(),
    customerEmail: v.string(),
    customerName: v.optional(v.string()),
    amount: v.number(),
    paymentMethod: v.optional(v.string()),
    status: v.string(), // "pending" | "completed" | "refunded"
    notes: v.optional(v.string()),
    createdAt: v.string(),
  })
    .index("by_status", ["status"])
    .index("by_customerEmail", ["customerEmail"])
    .index("by_itemId", ["itemId"]),
});

export default schema;
