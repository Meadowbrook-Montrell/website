import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

/* ================================================================
   PHASE 4 — AI SUITE + ENTERPRISE + FAN ENGAGEMENT 2.0
   Full CRUD + AI template generators for all 15 features
   ================================================================ */

// ─── CONTRACT TEMPLATES ────────────────────────────────────────
const CONTRACT_TEMPLATES: Record<string, { title: string; body: string }> = {
  sponsorship: {
    title: "Sponsorship Agreement",
    body: `SPONSORSHIP AGREEMENT

This Sponsorship Agreement ("Agreement") is entered into as of [DATE] by and between:

SPONSOR: [PARTY2] ("Sponsor")
CREATOR: [PARTY1] ("Creator")

1. SCOPE OF SPONSORSHIP
The Sponsor agrees to sponsor content created by the Creator, including but not limited to:
- [DELIVERABLES]
- Social media posts, video mentions, and/or dedicated content as agreed upon.

2. COMPENSATION
The Sponsor shall pay the Creator a total of $[AMOUNT] for the services outlined above.
Payment terms: [PAYMENT_TERMS]

3. CONTENT REQUIREMENTS
- Creator will produce authentic content that naturally integrates the Sponsor's brand/product.
- Creator retains creative control over the content style and delivery.
- Sponsor may request one (1) round of revisions before publication.

4. TIMELINE
- Content delivery date: [DELIVERY_DATE]
- Campaign duration: [DURATION]

5. USAGE RIGHTS
Sponsor receives a non-exclusive license to repurpose the sponsored content for [USAGE_PERIOD].

6. DISCLOSURE
Creator agrees to comply with FTC guidelines and disclose the sponsored nature of all content.

7. TERMINATION
Either party may terminate this agreement with 14 days written notice.

8. SIGNATURES
_________________________          _________________________
[PARTY1]                            [PARTY2]
Date: ___________                   Date: ___________`
  },
  "guest-appearance": {
    title: "Guest Appearance Release",
    body: `GUEST APPEARANCE & MEDIA RELEASE

Date: [DATE]

BETWEEN:
Host/Producer: [PARTY1]
Guest: [PARTY2]

1. APPEARANCE DETAILS
The Guest agrees to appear on "[SHOW_NAME]" for a recorded interview/conversation.
- Recording Date: [RECORDING_DATE]
- Format: [FORMAT] (video/audio/both)
- Topic(s): [TOPICS]

2. MEDIA RELEASE
The Guest grants [PARTY1] permission to:
- Record, edit, and publish the appearance across all platforms
- Use the Guest's name, likeness, and voice in promotional materials
- Create clips, highlights, and derivative content from the recording

3. COMPENSATION
[COMPENSATION_TERMS]

4. CONTENT RIGHTS
- [PARTY1] retains full ownership of the final produced content
- Guest may share/repost the published content on their own platforms
- Guest receives credit/tag in all published versions

5. APPROVAL
Guest [DOES/DOES NOT] require approval before publication.

6. SIGNATURES
_________________________          _________________________
[PARTY1]                            [PARTY2]
Date: ___________                   Date: ___________`
  },
  licensing: {
    title: "Content Licensing Agreement",
    body: `CONTENT LICENSING AGREEMENT

Date: [DATE]

LICENSOR: [PARTY1]
LICENSEE: [PARTY2]

1. LICENSED CONTENT
Description: [CONTENT_DESCRIPTION]
Content ID/URL: [CONTENT_URL]

2. LICENSE GRANT
Licensor grants Licensee a [EXCLUSIVE/NON-EXCLUSIVE] license to use the above content for:
- [PERMITTED_USES]
- Duration: [LICENSE_DURATION]
- Territory: [TERRITORY]

3. COMPENSATION
License fee: $[AMOUNT]
Payment terms: [PAYMENT_TERMS]

4. RESTRICTIONS
Licensee may NOT:
- Sublicense the content without written permission
- Modify the content beyond agreed-upon edits
- Remove creator credits or watermarks

5. ATTRIBUTION
Licensee shall credit [PARTY1] as: [CREDIT_FORMAT]

6. TERMINATION
This license terminates automatically at the end of the license duration or upon breach.

SIGNATURES
_________________________          _________________________
[PARTY1]                            [PARTY2]`
  },
  nda: {
    title: "Non-Disclosure Agreement",
    body: `NON-DISCLOSURE AGREEMENT (NDA)

Date: [DATE]

BETWEEN:
Disclosing Party: [PARTY1]
Receiving Party: [PARTY2]

1. PURPOSE
The parties wish to explore a potential business relationship regarding [PURPOSE].

2. CONFIDENTIAL INFORMATION
"Confidential Information" includes all non-public information shared between the parties, including but not limited to:
- Business plans, strategies, and financial information
- Unreleased content, projects, and creative ideas
- Contact lists, partnerships, and deal terms
- Any information marked as "confidential"

3. OBLIGATIONS
The Receiving Party agrees to:
- Keep all Confidential Information strictly confidential
- Not disclose to any third party without written consent
- Use the information only for the stated Purpose
- Return or destroy all materials upon request

4. EXCLUSIONS
This NDA does not apply to information that:
- Was publicly available at the time of disclosure
- Becomes public through no fault of the Receiving Party
- Was independently developed by the Receiving Party

5. DURATION
This NDA remains in effect for [DURATION] from the date of signing.

6. REMEDIES
Breach of this NDA may result in legal action and monetary damages.

SIGNATURES
_________________________          _________________________
[PARTY1]                            [PARTY2]`
  },
  freelance: {
    title: "Freelance Service Agreement",
    body: `FREELANCE SERVICE AGREEMENT

Date: [DATE]

CLIENT: [PARTY2]
FREELANCER: [PARTY1]

1. SERVICES
The Freelancer agrees to provide the following services:
- [SERVICE_DESCRIPTION]
- Deliverables: [DELIVERABLES]

2. TIMELINE
- Start date: [START_DATE]
- Delivery date: [DELIVERY_DATE]
- Revisions included: [NUM_REVISIONS]

3. COMPENSATION
Total fee: $[AMOUNT]
Payment schedule:
- [PAYMENT_SCHEDULE]

4. INTELLECTUAL PROPERTY
Upon full payment, all rights to the deliverables transfer to the Client.
Freelancer retains the right to display the work in their portfolio.

5. CANCELLATION
- Client may cancel with [NOTICE_PERIOD] notice
- Freelancer is entitled to payment for work completed up to cancellation

6. INDEPENDENT CONTRACTOR
The Freelancer is an independent contractor, not an employee.

SIGNATURES
_________________________          _________________________
[PARTY1] (Freelancer)               [PARTY2] (Client)`
  },
};

// ─── CAPTION TEMPLATES ─────────────────────────────────────────
function generateCaptions(title: string, topic: string) {
  const t = title || topic;
  const hashtags = [
    "#3GMG", "#MeadowbrookMontrell", "#FortWorth", "#StreetNews",
    "#HoodsPaparazzi", "#MakeItMakeSense",
    ...(topic ? [`#${topic.replace(/\s+/g, "")}`] : []),
  ];
  return {
    instagram: `\ud83c\udfac NEW DROP \ud83c\udfac\n\n${t}\n\nY'all been waiting for this one. Link in bio \u2b06\ufe0f\n\n${hashtags.slice(0, 8).join(" ")}\n\n\ud83d\udcf8 Follow @3gmgmeadowbrookmontrell for more street coverage`,
    tiktok: `${t} \ud83d\udd25\ud83d\udd25\ud83d\udd25\n\nFull video on YouTube! \u27a1\ufe0f Link in bio\n\n${hashtags.slice(0, 6).join(" ")} #fyp #viral #trending`,
    youtube: `${t}\n\n\ud83d\udd34 Make sure to SUBSCRIBE and hit that notification bell!\n\ud83d\udcf1 Follow on IG: @3gmgmeadowbrookmontrell\n\ud83c\udfb5 TikTok: @meadowbrookmontrellmedia\n\nThe Hood's Paparazzi brings you the REAL stories from the streets of Fort Worth, Texas. No filter, no cap.\n\n${hashtags.join(" ")}`,
    facebook: `\ud83d\udea8 NEW VIDEO \ud83d\udea8\n\n${t}\n\nAnother one from the streets of Fort Worth! Watch the full video and let me know what y'all think in the comments \ud83d\udc47\n\n#3GMG #MeadowbrookMontrell #FortWorth #StreetJournalism`,
    twitter: `\ud83c\udfac ${t}\n\nNew video just dropped! \ud83d\udd25\n\nWatch the full thing \u27a1\ufe0f [LINK]\n\n${hashtags.slice(0, 4).join(" ")}`,
  };
}

// ─── EPISODE PREP GENERATOR ────────────────────────────────────
function _buildEpisodePrep(guest: string, topic: string, bio?: string) {
  const questions = [
    `What's your story? Where did you grow up and what shaped you?`,
    `How did you get started in ${topic}?`,
    `What's the biggest lesson you've learned along the way?`,
    `What's something people don't know about you?`,
    `Who were your biggest influences coming up?`,
    `What's the hardest moment you've had to push through?`,
    `Where do you see yourself in 5 years?`,
    `What advice would you give to someone just starting out?`,
    `What projects are you working on right now?`,
    `Any message for the people watching?`,
  ];

  const outline = `EPISODE OUTLINE: ${guest} on "${topic}"

INTRO (2-3 min)
- Cold open / hook clip
- "Make It Make Sense" intro
- Introduce ${guest}${bio ? ` - ${bio}` : ""}

SEGMENT 1: THE COME UP (8-10 min)
- Background and origin story
- Early struggles and breakthroughs
- Key turning points

SEGMENT 2: THE TOPIC (10-15 min)
- Deep dive into ${topic}
- Personal experiences and stories
- Hot takes and real talk

SEGMENT 3: RAPID FIRE (5 min)
- Quick questions, real answers
- Fun/controversial takes

OUTRO (2-3 min)
- Where to find ${guest}
- Plugs and shoutouts
- "Make It Make Sense" closing`;

  const talkingPoints = [
    `${guest}'s background and come-up story`,
    `The current state of ${topic} in Fort Worth / DFW`,
    `Controversial or unpopular opinions about ${topic}`,
    `Recent events or news related to the topic`,
    `Personal stories that connect to the audience`,
    `Future plans and upcoming projects`,
  ];

  const coldOpen = `[Camera tight on ${guest}]\n${guest}: "[Insert powerful quote from later in the interview]"\n\n[Cut to Montrell]\nMontrell: "Make It Make Sense! We got ${guest} in the building today, and trust me, y'all are NOT ready for this conversation..."`;

  return { questions, outline, talkingPoints, coldOpen };
}

// ─── REPURPOSE SUGGESTIONS GENERATOR ───────────────────────────
function generateRepurposeSuggestions(title: string, type: string) {
  const base = [
    { platform: "TikTok", format: "short-clip", description: `Cut 3-5 most engaging 30-60 second clips from "${title}" with captions and trending audio`, isCompleted: false },
    { platform: "Instagram", format: "reel", description: `Create a 60-90 second highlight reel with the most quotable moments`, isCompleted: false },
    { platform: "Instagram", format: "quote-card", description: `Design 3-4 quote cards with the best one-liners from the conversation`, isCompleted: false },
    { platform: "Twitter/X", format: "thread", description: `Write a 5-7 tweet thread breaking down the key takeaways`, isCompleted: false },
    { platform: "YouTube", format: "shorts", description: `Create 3 YouTube Shorts from the most viral-worthy moments`, isCompleted: false },
    { platform: "Blog", format: "article", description: `Write a blog post summarizing the key points and quotes from "${title}"`, isCompleted: false },
    { platform: "Newsletter", format: "email", description: `Feature this in the next newsletter with behind-the-scenes context`, isCompleted: false },
    { platform: "Facebook", format: "post", description: `Create a discussion-starter post with a provocative question from the content`, isCompleted: false },
  ];

  if (type === "interview" || type === "podcast") {
    base.push(
      { platform: "YouTube", format: "audiogram", description: `Create an audiogram with waveform animation for the best audio clip`, isCompleted: false },
      { platform: "Blog", format: "transcript", description: `Publish a full or partial transcript as a blog post for SEO`, isCompleted: false },
    );
  }

  return base;
}

// ─── BRAND DEAL RATE CALCULATOR ────────────────────────────────
function calculateBrandRate(followers: number, avgViews: number, engagementRate: number, niche: string, dealType: string) {
  // CPM-based calculation with niche multipliers
  const nicheMultipliers: Record<string, number> = {
    news: 1.2, entertainment: 1.0, music: 1.1, lifestyle: 0.9,
    sports: 1.0, tech: 1.3, finance: 1.5, gaming: 0.8,
  };
  const dealMultipliers: Record<string, number> = {
    shoutout: 0.5, dedicated: 1.0, integration: 1.5, ambassador: 3.0,
  };

  const nicheMult = nicheMultipliers[niche] || 1.0;
  const dealMult = dealMultipliers[dealType] || 1.0;

  // Base CPM of $15-25 for mid-tier creators
  const baseCPM = 20;
  const baseRate = (avgViews / 1000) * baseCPM * nicheMult * dealMult;

  // Engagement bonus (>5% engagement = premium)
  const engagementBonus = engagementRate > 5 ? 1.3 : engagementRate > 3 ? 1.15 : 1.0;

  // Follower tier bonus
  const tierBonus = followers > 100000 ? 1.5 : followers > 50000 ? 1.3 : followers > 10000 ? 1.1 : 1.0;

  const calculatedRate = Math.round(baseRate * engagementBonus * tierBonus);
  const low = Math.round(calculatedRate * 0.7);
  const high = Math.round(calculatedRate * 1.4);

  return { calculatedRate, rateRange: { low, high } };
}


/* ================================================================
   1. AI CONTRACT GENERATOR
   ================================================================ */
export const listContracts = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("aiContracts").order("desc").collect();
}});

export const generateContract = mutation({
  args: {
    templateType: v.string(),
    title: v.string(),
    party1: v.string(),
    party2: v.string(),
    fields: v.any(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const template = CONTRACT_TEMPLATES[args.templateType];
    if (!template) throw new Error("Unknown template type");

    let text = template.body
      .replace(/\[PARTY1\]/g, args.party1)
      .replace(/\[PARTY2\]/g, args.party2)
      .replace(/\[DATE\]/g, new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }));

    // Replace any custom fields
    if (args.fields && typeof args.fields === "object") {
      for (const [key, value] of Object.entries(args.fields)) {
        text = text.replace(new RegExp(`\\[${key.toUpperCase()}\\]`, "g"), String(value));
      }
    }

    return await ctx.db.insert("aiContracts", {
      templateType: args.templateType,
      title: args.title || template.title,
      parties: { party1: args.party1, party2: args.party2 },
      fields: args.fields,
      generatedText: text,
      status: "draft",
      createdAt: new Date().toISOString(),
      notes: args.notes,
    });
  },
});

export const updateContractStatus = mutation({
  args: { id: v.id("aiContracts"), status: v.string() },
  handler: async (ctx, { id, status }) => { await ctx.db.patch(id, { status }); },
});

export const deleteContract = mutation({
  args: { id: v.id("aiContracts") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   2. AI SOCIAL CAPTIONS
   ================================================================ */
export const listCaptions = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("aiCaptions").order("desc").collect();
}});

export const generateAllCaptions = mutation({
  args: {
    sourceTitle: v.string(),
    sourceTopic: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const captions = generateCaptions(args.sourceTitle, args.sourceTopic || "");
    const ids = [];
    for (const [platform, caption] of Object.entries(captions)) {
      const id = await ctx.db.insert("aiCaptions", {
        sourceTitle: args.sourceTitle,
        sourceTopic: args.sourceTopic,
        platform,
        generatedCaption: caption,
        hashtags: ["#3GMG", "#MeadowbrookMontrell", "#FortWorth"],
        isSaved: false,
        isUsed: false,
        createdAt: new Date().toISOString(),
      });
      ids.push(id);
    }
    return ids;
  },
});

export const toggleCaptionSaved = mutation({
  args: { id: v.id("aiCaptions") },
  handler: async (ctx, { id }) => {
    const c = await ctx.db.get(id);
    if (c) await ctx.db.patch(id, { isSaved: !c.isSaved });
  },
});

export const deleteCaption = mutation({
  args: { id: v.id("aiCaptions") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   3. AI EPISODE PREP KIT
   ================================================================ */
export const listEpisodePreps = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("aiEpisodePrep").order("desc").collect();
}});

export const generateEpisodePrep = mutation({
  args: {
    guestName: v.string(),
    guestBio: v.optional(v.string()),
    topic: v.string(),
    episodeDate: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const prep = _buildEpisodePrep(args.guestName, args.topic, args.guestBio);
    return await ctx.db.insert("aiEpisodePrep", {
      guestName: args.guestName,
      guestBio: args.guestBio,
      topic: args.topic,
      questions: prep.questions,
      outline: prep.outline,
      talkingPoints: prep.talkingPoints,
      coldOpen: prep.coldOpen,
      createdAt: new Date().toISOString(),
      episodeDate: args.episodeDate,
      isUsed: false,
    });
  },
});

export const deleteEpisodePrep = mutation({
  args: { id: v.id("aiEpisodePrep") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   4. AI INVOICE GENERATOR
   ================================================================ */
export const listInvoices = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("aiInvoices").order("desc").collect();
}});

export const generateInvoice = mutation({
  args: {
    clientName: v.string(),
    clientEmail: v.optional(v.string()),
    lineItems: v.array(v.object({
      description: v.string(),
      quantity: v.number(),
      rate: v.number(),
      amount: v.number(),
    })),
    taxRate: v.optional(v.number()),
    dueDate: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const subtotal = args.lineItems.reduce((s, i) => s + i.amount, 0);
    const taxAmount = args.taxRate ? Math.round(subtotal * (args.taxRate / 100) * 100) / 100 : 0;
    const total = subtotal + taxAmount;

    // Generate invoice number: 3GMG-YYYYMMDD-XXX
    const now = new Date();
    const dateStr = now.toISOString().slice(0, 10).replace(/-/g, "");
    const existing = await ctx.db.query("aiInvoices").collect();
    const num = String(existing.length + 1).padStart(3, "0");

    return await ctx.db.insert("aiInvoices", {
      invoiceNumber: `3GMG-${dateStr}-${num}`,
      clientName: args.clientName,
      clientEmail: args.clientEmail,
      lineItems: args.lineItems,
      subtotal,
      taxRate: args.taxRate,
      taxAmount,
      total,
      status: "draft",
      dueDate: args.dueDate,
      createdAt: now.toISOString(),
      notes: args.notes,
    });
  },
});

export const updateInvoiceStatus = mutation({
  args: { id: v.id("aiInvoices"), status: v.string(), paidAt: v.optional(v.string()) },
  handler: async (ctx, { id, status, paidAt }) => {
    const patch: any = { status };
    if (paidAt) patch.paidAt = paidAt;
    await ctx.db.patch(id, patch);
  },
});

export const deleteInvoice = mutation({
  args: { id: v.id("aiInvoices") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   5. AI CONTENT REPURPOSER
   ================================================================ */
export const listRepurpose = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("aiRepurpose").order("desc").collect();
}});

export const generateRepurpose = mutation({
  args: {
    sourceTitle: v.string(),
    sourceType: v.string(),
    sourceUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const suggestions = generateRepurposeSuggestions(args.sourceTitle, args.sourceType);
    return await ctx.db.insert("aiRepurpose", {
      sourceTitle: args.sourceTitle,
      sourceType: args.sourceType,
      sourceUrl: args.sourceUrl,
      suggestions,
      createdAt: new Date().toISOString(),
    });
  },
});

export const toggleRepurposeItem = mutation({
  args: { id: v.id("aiRepurpose"), index: v.number() },
  handler: async (ctx, { id, index }) => {
    const r = await ctx.db.get(id);
    if (!r) return;
    const suggestions = [...r.suggestions];
    if (suggestions[index]) {
      suggestions[index] = { ...suggestions[index], isCompleted: !suggestions[index].isCompleted };
      await ctx.db.patch(id, { suggestions });
    }
  },
});

export const deleteRepurpose = mutation({
  args: { id: v.id("aiRepurpose") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   6. CRM INTELLIGENCE
   ================================================================ */
export const listContactScores = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("contactScores").order("desc").collect();
}});

export const upsertContactScore = mutation({
  args: {
    contactName: v.string(),
    relationshipScore: v.number(),
    interactionCount: v.number(),
    revenueGenerated: v.optional(v.number()),
    tags: v.array(v.string()),
    healthStatus: v.string(),
    suggestedAction: v.optional(v.string()),
    lastInteraction: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contactScores", {
      ...args,
      updatedAt: new Date().toISOString(),
    });
  },
});

export const updateContactScore = mutation({
  args: { id: v.id("contactScores"), score: v.number(), health: v.string(), action: v.optional(v.string()) },
  handler: async (ctx, { id, score, health, action }) => {
    await ctx.db.patch(id, { relationshipScore: score, healthStatus: health, suggestedAction: action, updatedAt: new Date().toISOString() });
  },
});

export const deleteContactScore = mutation({
  args: { id: v.id("contactScores") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   7. COMPETITOR TRACKER
   ================================================================ */
export const listCompetitors = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("competitors").order("desc").collect();
}});

export const addCompetitor = mutation({
  args: {
    name: v.string(),
    platform: v.string(),
    profileUrl: v.string(),
    subscribers: v.optional(v.number()),
    avgViews: v.optional(v.number()),
    uploadFrequency: v.optional(v.string()),
    contentThemes: v.array(v.string()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("competitors", {
      ...args,
      lastChecked: new Date().toISOString(),
      isActive: true,
    });
  },
});

export const updateCompetitor = mutation({
  args: {
    id: v.id("competitors"),
    subscribers: v.optional(v.number()),
    avgViews: v.optional(v.number()),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, { id, ...updates }) => {
    await ctx.db.patch(id, { ...updates, lastChecked: new Date().toISOString() });
  },
});

export const deleteCompetitor = mutation({
  args: { id: v.id("competitors") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   8. BRAND DEAL CALCULATOR
   ================================================================ */
export const listBrandDeals = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("brandDeals").order("desc").collect();
}});

export const calculateBrandDeal = mutation({
  args: {
    platform: v.string(),
    followers: v.number(),
    avgViews: v.number(),
    engagementRate: v.number(),
    niche: v.string(),
    dealType: v.string(),
    notes: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { calculatedRate, rateRange } = calculateBrandRate(
      args.followers, args.avgViews, args.engagementRate, args.niche, args.dealType
    );
    return await ctx.db.insert("brandDeals", {
      ...args,
      calculatedRate,
      rateRange,
      createdAt: new Date().toISOString(),
    });
  },
});

export const deleteBrandDeal = mutation({
  args: { id: v.id("brandDeals") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   9. WEEKLY REPORTS
   ================================================================ */
export const listWeeklyReports = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("weeklyReports").order("desc").collect();
}});

export const generateWeeklyReport = mutation({
  args: {},
  handler: async (ctx) => {
    const now = new Date();
    const weekEnd = now.toISOString().slice(0, 10);
    const weekStartDate = new Date(now.getTime() - 7 * 86400000);
    const weekStart = weekStartDate.toISOString().slice(0, 10);

    // Aggregate data from various tables
    const donations = await ctx.db.query("donations").collect();
    const sponsors = await ctx.db.query("sponsors").collect();
    const merchOrders = await ctx.db.query("merchOrders").collect();
    const bookings = await ctx.db.query("bookings").collect();
    const content = await ctx.db.query("content").collect();
    const subscribers = await ctx.db.query("subscribers").collect();
    const fanMessages = await ctx.db.query("fanSubmissions").collect();
    const tasks = await ctx.db.query("tasks").collect();
    const followUps = await ctx.db.query("followUps").collect();
    const qa = await ctx.db.query("fanQA").collect();

    const donationTotal = donations.reduce((s, d) => s + ((d as any).amount || 0), 0);
    const sponsorTotal = sponsors.reduce((s, d) => s + ((d as any).amount || (d as any).dealValue || 0), 0);
    const merchTotal = merchOrders.reduce((s, d) => s + ((d as any).total || 0), 0);
    const bookingTotal = bookings.reduce((s, d) => s + ((d as any).rate || 0), 0);

    const overdueFollowUps = followUps.filter((f: any) =>
      f.status !== "completed" && f.dueDate && f.dueDate < now.toISOString()
    ).length;

    const highlights = [];
    if (content.length > 0) highlights.push(`${content.length} total content pieces in library`);
    if (subscribers.length > 0) highlights.push(`${subscribers.length} total email subscribers`);
    if (merchOrders.length > 0) highlights.push(`${merchOrders.length} merch orders tracked`);
    if (overdueFollowUps > 0) highlights.push(`\u26a0\ufe0f ${overdueFollowUps} overdue follow-ups need attention`);

    return await ctx.db.insert("weeklyReports", {
      weekStart,
      weekEnd,
      revenue: {
        total: donationTotal + sponsorTotal + merchTotal + bookingTotal,
        donations: donationTotal,
        sponsors: sponsorTotal,
        merch: merchTotal,
        bookings: bookingTotal,
      },
      content: {
        published: content.length,
        views: 0,
        newSubscribers: subscribers.length,
      },
      community: {
        newFans: fanMessages.length,
        messages: fanMessages.length,
        qaQuestions: qa.length,
      },
      operations: {
        tasksCompleted: tasks.filter((t: any) => t.status === "completed" || t.isCompleted).length,
        tasksPending: tasks.filter((t: any) => t.status !== "completed" && !t.isCompleted).length,
        overdueFollowUps,
      },
      highlights,
      createdAt: now.toISOString(),
    });
  },
});


/* ================================================================
   10. TEAM ROLES
   ================================================================ */
export const listTeamRoles = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("teamRoles").order("desc").collect();
}});

export const addTeamRole = mutation({
  args: {
    userName: v.string(),
    email: v.string(),
    role: v.string(),
    permissions: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("teamRoles", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const updateTeamRole = mutation({
  args: { id: v.id("teamRoles"), role: v.string(), permissions: v.array(v.string()) },
  handler: async (ctx, { id, role, permissions }) => {
    await ctx.db.patch(id, { role, permissions });
  },
});

export const toggleTeamRoleActive = mutation({
  args: { id: v.id("teamRoles") },
  handler: async (ctx, { id }) => {
    const r = await ctx.db.get(id);
    if (r) await ctx.db.patch(id, { isActive: !r.isActive });
  },
});

export const deleteTeamRole = mutation({
  args: { id: v.id("teamRoles") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   11. LIVE POLLS
   ================================================================ */
export const listPolls = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("livePolls").order("desc").collect();
}});

export const getActivePolls = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("livePolls").withIndex("by_active", q => q.eq("isActive", true)).collect();
}});

export const createPoll = mutation({
  args: {
    question: v.string(),
    options: v.array(v.string()),
    endsAt: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("livePolls", {
      question: args.question,
      options: args.options.map(text => ({ text, votes: 0 })),
      isActive: true,
      totalVotes: 0,
      createdAt: new Date().toISOString(),
      endsAt: args.endsAt,
      showResults: true,
    });
  },
});

export const votePoll = mutation({
  args: {
    pollId: v.id("livePolls"),
    optionIndex: v.number(),
    voterId: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const poll = await ctx.db.get(args.pollId);
    if (!poll || !poll.isActive) throw new Error("Poll not active");

    // Record vote
    await ctx.db.insert("pollVotes", {
      pollId: args.pollId,
      optionIndex: args.optionIndex,
      voterId: args.voterId,
      createdAt: new Date().toISOString(),
    });

    // Update poll counts
    const options = [...poll.options];
    if (options[args.optionIndex]) {
      options[args.optionIndex] = { ...options[args.optionIndex], votes: options[args.optionIndex].votes + 1 };
    }
    await ctx.db.patch(args.pollId, { options, totalVotes: poll.totalVotes + 1 });
  },
});

export const closePoll = mutation({
  args: { id: v.id("livePolls") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isActive: false });
  },
});

export const deletePoll = mutation({
  args: { id: v.id("livePolls") },
  handler: async (ctx, { id }) => {
    const votes = await ctx.db.query("pollVotes").withIndex("by_poll", q => q.eq("pollId", id)).collect();
    for (const v2 of votes) await ctx.db.delete(v2._id);
    await ctx.db.delete(id);
  },
});


/* ================================================================
   12. FAN ART GALLERY
   ================================================================ */
export const listFanArt = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("fanArt").order("desc").collect();
}});

export const getApprovedFanArt = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("fanArt").withIndex("by_approved", q => q.eq("isApproved", true)).order("desc").collect();
}});

export const submitFanArt = mutation({
  args: {
    submitterName: v.string(),
    submitterEmail: v.optional(v.string()),
    title: v.string(),
    description: v.optional(v.string()),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("fanArt", {
      ...args,
      isApproved: false,
      isFeatured: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const approveFanArt = mutation({
  args: { id: v.id("fanArt"), featured: v.optional(v.boolean()) },
  handler: async (ctx, { id, featured }) => {
    await ctx.db.patch(id, { isApproved: true, isFeatured: featured || false });
  },
});

export const deleteFanArt = mutation({
  args: { id: v.id("fanArt") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   13. ACHIEVEMENTS & BADGES
   ================================================================ */
export const listAchievements = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("achievements").collect();
}});

export const listFanBadges = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("fanBadges").order("desc").collect();
}});

export const createAchievement = mutation({
  args: {
    name: v.string(),
    description: v.string(),
    icon: v.string(),
    category: v.string(),
    criteria: v.string(),
    threshold: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("achievements", {
      ...args,
      isActive: true,
      createdAt: new Date().toISOString(),
    });
  },
});

export const awardBadge = mutation({
  args: {
    fanName: v.string(),
    fanEmail: v.optional(v.string()),
    achievementId: v.id("achievements"),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("fanBadges", {
      ...args,
      earnedAt: new Date().toISOString(),
    });
  },
});

export const deleteAchievement = mutation({
  args: { id: v.id("achievements") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   14. CONTENT REQUEST BOARD
   ================================================================ */
export const listContentRequests = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("contentRequests").order("desc").collect();
}});

export const getTopRequests = query({ args: {}, handler: async (ctx) => {
  const all = await ctx.db.query("contentRequests").collect();
  return all.filter(r => r.status === "open" || r.status === "planned").sort((a, b) => b.votes - a.votes).slice(0, 20);
}});

export const submitContentRequest = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    submitterName: v.string(),
    submitterEmail: v.optional(v.string()),
    category: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("contentRequests", {
      ...args,
      votes: 1,
      status: "open",
      createdAt: new Date().toISOString(),
    });
  },
});

export const voteRequest = mutation({
  args: {
    requestId: v.id("contentRequests"),
    voterId: v.string(),
  },
  handler: async (ctx, args) => {
    // Check for duplicate vote
    const existing = await ctx.db.query("requestVotes").withIndex("by_request", q => q.eq("requestId", args.requestId)).collect();
    if (existing.some(v2 => v2.voterId === args.voterId)) throw new Error("Already voted");

    await ctx.db.insert("requestVotes", {
      requestId: args.requestId,
      voterId: args.voterId,
      createdAt: new Date().toISOString(),
    });

    const req = await ctx.db.get(args.requestId);
    if (req) await ctx.db.patch(args.requestId, { votes: req.votes + 1 });
  },
});

export const updateRequestStatus = mutation({
  args: { id: v.id("contentRequests"), status: v.string(), adminResponse: v.optional(v.string()) },
  handler: async (ctx, { id, status, adminResponse }) => {
    await ctx.db.patch(id, { status, adminResponse });
  },
});

export const deleteContentRequest = mutation({
  args: { id: v.id("contentRequests") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   15. EXCLUSIVE DROPS CALENDAR
   ================================================================ */
export const listDrops = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("exclusiveDrops").order("desc").collect();
}});

export const getPublishedDrops = query({ args: {}, handler: async (ctx) => {
  return await ctx.db.query("exclusiveDrops").withIndex("by_published", q => q.eq("isPublished", true)).order("desc").collect();
}});

export const addDrop = mutation({
  args: {
    title: v.string(),
    description: v.string(),
    type: v.string(),
    dropDate: v.string(),
    imageUrl: v.optional(v.string()),
    linkUrl: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("exclusiveDrops", {
      ...args,
      isPublished: false,
      isDropped: false,
      createdAt: new Date().toISOString(),
    });
  },
});

export const publishDrop = mutation({
  args: { id: v.id("exclusiveDrops") },
  handler: async (ctx, { id }) => { await ctx.db.patch(id, { isPublished: true }); },
});

export const markDropped = mutation({
  args: { id: v.id("exclusiveDrops") },
  handler: async (ctx, { id }) => { await ctx.db.patch(id, { isDropped: true }); },
});

export const deleteDrop = mutation({
  args: { id: v.id("exclusiveDrops") },
  handler: async (ctx, { id }) => { await ctx.db.delete(id); },
});


/* ================================================================
   NOTIFICATION BADGE COUNTS
   Aggregates pending/unread counts across all features
   ================================================================ */
export const getNotificationBadges = query({ args: {}, handler: async (ctx) => {
  const [
    fanQA, communityPosts, followUps, contracts, bookings, pipeline,
    fanArt, contentRequests, invoices, polls
  ] = await Promise.all([
    ctx.db.query("fanQA").collect(),
    ctx.db.query("communityPosts").collect(),
    ctx.db.query("followUps").collect(),
    ctx.db.query("aiContracts").collect(),
    ctx.db.query("bookings").collect(),
    ctx.db.query("pipeline").collect(),
    ctx.db.query("fanArt").collect(),
    ctx.db.query("contentRequests").collect(),
    ctx.db.query("aiInvoices").collect(),
    ctx.db.query("livePolls").collect(),
  ]);

  const now = new Date().toISOString();
  return {
    "fan-qa": fanQA.filter((q: any) => !q.answer && !q.isAnswered).length,
    "community": communityPosts.filter((p: any) => !p.isApproved).length,
    "follow-ups": followUps.filter((f: any) => f.status !== "completed" && f.dueDate && f.dueDate < now).length,
    "contracts": contracts.filter((c: any) => c.status === "draft").length,
    "bookings": bookings.filter((b: any) => (b as any).status === "pending").length,
    "pipeline": pipeline.filter((p: any) => p.stage === "review").length,
    "fan-art": fanArt.filter((a: any) => !a.isApproved).length,
    "content-requests": contentRequests.filter((r: any) => r.status === "open").length,
    "invoices-pending": invoices.filter((i: any) => i.status === "sent" || i.status === "overdue").length,
    "polls-active": polls.filter((p: any) => p.isActive).length,
  };
}});

/* ================================================================
   MISSING FUNCTIONS — needed by frontend
   ================================================================ */

// Contract templates (static data)
export const getContractTemplates = query({ args: {}, handler: async () => {
  return [
    { id: "sponsorship", name: "Sponsorship Agreement", description: "Standard brand/sponsor deal" },
    { id: "guest-release", name: "Guest Release Form", description: "Podcast guest appearance release" },
    { id: "freelance", name: "Freelance Contract", description: "Freelancer / contractor agreement" },
    { id: "nda", name: "NDA", description: "Non-disclosure agreement" },
    { id: "licensing", name: "Content Licensing", description: "License content to third parties" },
  ];
}});

// Mark episode prep as used
export const markPrepUsed = mutation({
  args: { id: v.id("aiEpisodePrep") },
  handler: async (ctx, { id }) => {
    await ctx.db.patch(id, { isUsed: true });
  },
});

// CRM Stats (aggregate query)
export const getCRMStats = query({ args: {}, handler: async (ctx) => {
  const scores = await ctx.db.query("contactScores").collect();
  const tiers = { hot: 0, warm: 0, cold: 0 };
  let totalScore = 0;
  for (const s of scores) {
    const sc = (s as any).relationshipScore ?? (s as any).score ?? 50;
    totalScore += sc;
    if (sc >= 75) tiers.hot++;
    else if (sc >= 40) tiers.warm++;
    else tiers.cold++;
  }
  return {
    total: scores.length,
    tiers,
    avgScore: scores.length ? Math.round(totalScore / scores.length) : 0,
  };
}});

// Delete weekly report
export const deleteWeeklyReport = mutation({
  args: { id: v.id("weeklyReports") },
  handler: async (ctx, { id }) => {
    await ctx.db.delete(id);
  },
});
