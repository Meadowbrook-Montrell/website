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
});

export default schema;
