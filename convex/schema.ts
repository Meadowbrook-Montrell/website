import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

const schema = defineSchema({
  ...authTables,

  // Content library items (podcasts, interviews, street reporting, etc.)
  content: defineTable({
    title: v.string(),
    description: v.string(),
    category: v.string(), // "podcast" | "interview" | "street-reporting" | "music"
    youtubeId: v.optional(v.string()), // YouTube video ID for embedding
    thumbnailUrl: v.optional(v.string()), // Custom thumbnail URL
    externalUrl: v.optional(v.string()), // Link to external platform
    platform: v.optional(v.string()), // "youtube" | "facebook" | "tiktok" | "spotify"
    duration: v.optional(v.string()), // e.g. "1:23:45"
    publishedAt: v.optional(v.string()), // ISO date string
    featured: v.optional(v.boolean()),
    tags: v.optional(v.array(v.string())),
  })
    .index("by_category", ["category"])
    .index("by_featured", ["featured"]),

  // Live session announcements
  liveSessions: defineTable({
    title: v.string(),
    description: v.string(),
    scheduledAt: v.string(), // ISO datetime
    platform: v.string(), // "youtube" | "facebook" | "instagram" | "tiktok"
    streamUrl: v.optional(v.string()), // Link to the live stream
    thumbnailUrl: v.optional(v.string()),
    isLive: v.optional(v.boolean()), // Currently live right now
    isCompleted: v.optional(v.boolean()),
    guestName: v.optional(v.string()),
    guestTitle: v.optional(v.string()),
  })
    .index("by_scheduled", ["scheduledAt"])
    .index("by_live", ["isLive"]),

  // Newsletter / SMS subscribers
  subscribers: defineTable({
    email: v.optional(v.string()),
    phone: v.optional(v.string()),
    subscribedAt: v.string(),
    source: v.optional(v.string()), // "hero" | "footer" | "live-banner"
  }).index("by_email", ["email"]),

  // News ticker items
  tickerItems: defineTable({
    text: v.string(),
    isActive: v.boolean(),
    priority: v.optional(v.number()), // higher = shows first
    link: v.optional(v.string()),
    createdAt: v.string(),
  }).index("by_active", ["isActive"]),

  // Guest spotlights
  guests: defineTable({
    name: v.string(),
    title: v.optional(v.string()), // e.g. "Rapper" | "Community Leader"
    quote: v.optional(v.string()),
    imageUrl: v.optional(v.string()),
    episodeUrl: v.optional(v.string()),
    youtubeId: v.optional(v.string()),
    featured: v.optional(v.boolean()),
    createdAt: v.string(),
  }).index("by_featured", ["featured"]),

  // Site analytics / page views
  pageViews: defineTable({
    page: v.string(), // "/v2" | "/library" | "/gallery"
    timestamp: v.string(),
    referrer: v.optional(v.string()),
    userAgent: v.optional(v.string()),
  }).index("by_page", ["page"]),
});

export default schema;
