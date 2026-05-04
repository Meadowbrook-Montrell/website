import { mutation } from "./_generated/server";

/* ═══════════════════════════════════════════════════════════════
   DEMO DATA SEED — Populates entire admin dashboard for demo
   ═══════════════════════════════════════════════════════════════ */

// Clear all demo data first
export const clearAll = mutation({
  args: {},
  handler: async (ctx) => {
    const tables = [
      "artists","musicProjects","studioSessions","beatLibrary","releases","splitSheets",
      "musicStoreItems","musicPurchases","content","podcastEpisodes","blogPosts","publicEvents",
      "finances","merchProducts","merchOrders","guests","tickerItems","subscribers",
      "calendarEvents","guestCRM","bookings","sponsors","revenue","emailCampaigns","documents",
      "tasks","newsletters","showNotes","invoices","waivers","contentSchedule","teamMembers",
      "timeEntries","membershipTiers","linkBioItems","communityPosts","brandAssets","expenses",
      "contracts","followUps","pipeline","fanQA","fanPoints","breakingAlerts","exclusiveContent",
      "mediaAssets","donations","liveStreams","clipQueue","audienceSnapshots","workflows",
      "contacts","stories","promoCodes","competitors","contactScores","liveSessions",
      "fanSubmissions","notifications",
      "audioFiles","aiArtwork","lyrics","sampleClearances","stemsVault","masteringQC",
      "distributions","royaltyEntries","syncLicenses","playlistPitches","musicVideos",
      "rolloutSteps","pressKits","producerCollabs","arPipeline","aiLyricsLogs","aiMasteringLogs",
      "featureVerses","vocalSessions","setlists","tourShows","musicRights","moodBoards",
      "vocalHealth","soundKits","beatLeases","gearInventory","productionTemplates",
      "soundDesigns","producerAnalytics","feedbackReviews","contractMemos","referenceTracks",
      "chordProgressions","dawProjects","revenueGoals","collabCalendar"
    ] as const;
    const counts: Record<string, number> = {};
    for (const table of tables) {
      const docs = await ctx.db.query(table as any).collect();
      for (const doc of docs) {
        await ctx.db.delete(doc._id);
      }
      counts[table] = docs.length;
    }
    return { cleared: counts };
  },
});

export const seedAll = mutation({
  args: {},
  handler: async (ctx) => {
    const counts: Record<string, number> = {};

    // Helper — auto-adds createdAt/updatedAt for tables that need them
    const now = new Date().toISOString();
    const NO_CREATED_AT = new Set(["analyticsEvents","contactScores","content","fanBadges","liveSessions","pageViews","siteSettings","socialMetrics","subscribers"]);
    const NEEDS_UPDATED_AT = new Set(["guestCRM","siteSettings","contactScores"]);
    const errors: string[] = [];
    const ins = async (table: string, data: any) => {
      if (!data.createdAt && !NO_CREATED_AT.has(table)) data.createdAt = now;
      if (!data.updatedAt && NEEDS_UPDATED_AT.has(table)) data.updatedAt = now;
      try {
        await ctx.db.insert(table as any, data);
        counts[table] = (counts[table] || 0) + 1;
      } catch (e: any) {
        errors.push(`${table}: ${e.message?.slice(0, 150)}`);
      }
    };

    // ────────────────────────────────────────────────
    // 1. MUSIC PRODUCTION — Artists
    // ────────────────────────────────────────────────
    await ins("artists", { name: "Montrell", role: "artist", status: "active", bio: "Founder & lead artist of 3rd Gate Music Group. Versatile rapper, songwriter, and visionary blending street narratives with melodic innovation.", email: "montrell@3rdgatemg.com", phone: "(312) 555-0101", genres: ["Hip-Hop", "Trap", "R&B"] });
    await ins("artists", { name: "DJ Phantom", role: "producer", status: "active", bio: "Grammy-nominated producer known for cinematic trap beats and innovative sound design. 200+ placements.", email: "phantom@3rdgatemg.com", genres: ["Trap", "Cinematic", "Drill"] });
    await ins("artists", { name: "Kira Waves", role: "artist", status: "active", bio: "R&B vocalist with a four-octave range. 2M+ monthly Spotify listeners. Featured on Billboard Hot 100.", email: "kira@3rdgatemg.com", genres: ["R&B", "Pop", "Neo-Soul"] });
    await ins("artists", { name: "Rico Blaze", role: "artist", status: "development", bio: "Up-and-coming drill artist from Chicago's South Side. Raw talent with authentic storytelling.", email: "rico@3rdgatemg.com", genres: ["Drill", "Hip-Hop", "Trap"] });
    await ins("artists", { name: "Sage The Architect", role: "producer", status: "active", bio: "Beatmaker extraordinaire. Specializes in soulful samples over hard-hitting 808s. Credits include Def Jam & Atlantic.", email: "sage@3rdgatemg.com", genres: ["Boom Bap", "Soul", "Lo-Fi"] });
    await ins("artists", { name: "LexiLux", role: "songwriter", status: "active", bio: "Top-line writer and vocal producer. Written for major label artists across pop, R&B, and hip-hop.", email: "lexi@3rdgatemg.com", genres: ["Pop", "R&B", "Hip-Hop"] });
    await ins("artists", { name: "Tone Mason", role: "engineer", status: "active", bio: "Mix & mastering engineer with 10+ years experience. Studio A chief engineer. THX-certified room.", email: "tone@3rdgatemg.com", genres: ["All Genres"] });
    await ins("artists", { name: "Veda Moon", role: "artist", status: "development", bio: "Alternative R&B artist blending ethereal vocals with experimental production. Building debut project.", email: "veda@3rdgatemg.com", genres: ["Alt R&B", "Experimental", "Electronic"] });

    // ────────────────────────────────────────────────
    // 2. MUSIC PRODUCTION — Projects
    // ────────────────────────────────────────────────
    await ins("musicProjects", { title: "Rise of the 3rd Gate", type: "album", status: "recording", genre: "Hip-Hop", bpm: 140, key: "C minor", priority: "urgent", targetReleaseDate: "2026-07-15", notes: "Flagship album. 14 tracks. Features from Kira Waves, Rico Blaze, and 3 industry features TBD." });
    await ins("musicProjects", { title: "Midnight Frequencies", type: "ep", status: "mixing", genre: "R&B", bpm: 90, key: "Eb major", priority: "high", targetReleaseDate: "2026-06-01", notes: "Kira Waves EP. 6 tracks. Produced by DJ Phantom & Sage." });
    await ins("musicProjects", { title: "Street Scriptures", type: "single", status: "mastering", genre: "Drill", bpm: 145, key: "F# minor", priority: "high", targetReleaseDate: "2026-05-20", notes: "Rico Blaze lead single. Drill beat by Phantom. Video shot." });
    await ins("musicProjects", { title: "Golden Hour Deluxe", type: "album", status: "released", genre: "Hip-Hop", bpm: 130, key: "G minor", priority: "medium", notes: "Montrell's previous album with bonus tracks. Re-release with 4 new songs." });
    await ins("musicProjects", { title: "Late Night Confessions", type: "single", status: "writing", genre: "R&B", bpm: 85, key: "Bb minor", priority: "medium", targetReleaseDate: "2026-06-15", notes: "Montrell x Kira Waves collaboration. Concept phase." });
    await ins("musicProjects", { title: "3rd Gate Cypher Vol. 1", type: "single", status: "recording", genre: "Hip-Hop", bpm: 155, key: "D minor", priority: "medium", notes: "Label cypher featuring all roster artists. YouTube exclusive first." });
    await ins("musicProjects", { title: "Neon Dreams", type: "ep", status: "concept", genre: "Alt R&B", bpm: 110, key: "A minor", priority: "low", targetReleaseDate: "2026-09-01", notes: "Veda Moon debut EP. 5 tracks. Experimental direction." });
    await ins("musicProjects", { title: "Block Report", type: "single", status: "ready", genre: "Trap", bpm: 150, key: "E minor", priority: "high", targetReleaseDate: "2026-05-10", notes: "Montrell's next drop. Beat by DJ Phantom. Master approved." });

    // ────────────────────────────────────────────────
    // 3. MUSIC PRODUCTION — Studio Sessions
    // ────────────────────────────────────────────────
    await ins("studioSessions", { title: "Montrell — Album Vocals (Tracks 1-4)", date: "2026-05-05", startTime: "10:00", endTime: "18:00", studio: "Studio A", engineerName: "Tone Mason", sessionType: "recording", status: "scheduled", notes: "Need pop filter replaced. Bring reference tracks.", cost: 800 });
    await ins("studioSessions", { title: "Kira Waves — EP Final Mix", date: "2026-05-06", startTime: "14:00", endTime: "22:00", studio: "Studio A", engineerName: "Tone Mason", sessionType: "mixing", status: "scheduled", notes: "Mix review session. Kira & DJ Phantom attending.", cost: 1200 });
    await ins("studioSessions", { title: "Rico Blaze — Street Scriptures Master", date: "2026-05-04", startTime: "11:00", endTime: "15:00", studio: "Studio B", engineerName: "Tone Mason", sessionType: "mastering", status: "in-progress", notes: "Final master + stems delivery. Apple Digital Master specs.", cost: 500 });
    await ins("studioSessions", { title: "Songwriting Camp — Day 1", date: "2026-05-08", startTime: "12:00", endTime: "20:00", studio: "Lounge", engineerName: "LexiLux", sessionType: "writing", status: "scheduled", notes: "Album writing camp. Montrell, LexiLux, Sage. Catering ordered.", cost: 400 });
    await ins("studioSessions", { title: "3rd Gate Cypher Recording", date: "2026-05-10", startTime: "15:00", endTime: "23:00", studio: "Studio A", engineerName: "Tone Mason", sessionType: "recording", status: "scheduled", notes: "All artists. Video crew arriving at 14:30 for setup.", cost: 1500 });
    await ins("studioSessions", { title: "DJ Phantom — Beat Session", date: "2026-05-03", startTime: "20:00", endTime: "02:00", studio: "Studio B", sessionType: "recording", status: "completed", notes: "Produced 6 new beats. 3 selected for album.", cost: 600 });
    await ins("studioSessions", { title: "Veda Moon — Vocal Demo", date: "2026-05-12", startTime: "13:00", endTime: "17:00", studio: "Studio B", engineerName: "Tone Mason", sessionType: "recording", status: "scheduled", notes: "Demo session for Neon Dreams EP. Experimental vocal processing.", cost: 400 });

    // ────────────────────────────────────────────────
    // 4. MUSIC PRODUCTION — Beat Library
    // ────────────────────────────────────────────────
    await ins("beatLibrary", { title: "Phantom Menace", producerName: "DJ Phantom", genre: "Trap", bpm: 140, key: "C minor", mood: "Dark, Aggressive", status: "assigned", tags: ["808", "dark", "cinematic", "strings"], price: 5000 });
    await ins("beatLibrary", { title: "Soul Provider", producerName: "Sage The Architect", genre: "Boom Bap", bpm: 92, key: "Eb major", mood: "Soulful, Nostalgic", status: "assigned", tags: ["soul sample", "vinyl", "chops", "warm"], price: 3000 });
    await ins("beatLibrary", { title: "Midnight Drive", producerName: "DJ Phantom", genre: "R&B", bpm: 85, key: "Bb minor", mood: "Smooth, Late Night", status: "available", tags: ["guitar", "synth", "ambient", "slow"], price: 4000 });
    await ins("beatLibrary", { title: "Block Party", producerName: "DJ Phantom", genre: "Drill", bpm: 145, key: "F# minor", mood: "Aggressive, Energetic", status: "used", tags: ["drill", "slides", "dark", "UK"], price: 3500 });
    await ins("beatLibrary", { title: "Velvet Skies", producerName: "Sage The Architect", genre: "R&B", bpm: 78, key: "A major", mood: "Dreamy, Ethereal", status: "available", tags: ["ethereal", "pads", "vocal chops", "reverb"], price: 2500 });
    await ins("beatLibrary", { title: "Crown Royal", producerName: "DJ Phantom", genre: "Hip-Hop", bpm: 130, key: "G minor", mood: "Triumphant, Royal", status: "available", tags: ["horns", "orchestral", "anthem", "gold"], price: 6000 });
    await ins("beatLibrary", { title: "3AM Thoughts", producerName: "Sage The Architect", genre: "Lo-Fi", bpm: 75, key: "D minor", mood: "Reflective, Melancholy", status: "available", tags: ["lo-fi", "piano", "rain", "tape hiss"], price: 1500 });
    await ins("beatLibrary", { title: "Concrete Jungle", producerName: "DJ Phantom", genre: "Trap", bpm: 150, key: "E minor", mood: "Hard, Street", status: "assigned", tags: ["808", "hi-hats", "rolls", "aggressive"], price: 4500 });
    await ins("beatLibrary", { title: "Stardust", producerName: "Sage The Architect", genre: "Alt R&B", bpm: 110, key: "A minor", mood: "Spacey, Experimental", status: "on-hold", tags: ["synth", "experimental", "space", "glitch"], price: 2000 });
    await ins("beatLibrary", { title: "Paper Route", producerName: "DJ Phantom", genre: "Trap", bpm: 138, key: "B minor", mood: "Motivational, Flex", status: "sold", tags: ["money", "flex", "808", "bells"], price: 5000 });

    // ────────────────────────────────────────────────
    // 5. MUSIC PRODUCTION — Releases
    // ────────────────────────────────────────────────
    await ins("releases", { title: "Street Scriptures", artistName: "Rico Blaze", type: "single", releaseDate: "2026-05-20", status: "post-production", distributor: "DistroKid", isrc: "US-3GM-26-00012", mastered: true, artworkStatus: "approved", metadataComplete: true, distributorSubmitted: false });
    await ins("releases", { title: "Midnight Frequencies", artistName: "Kira Waves", type: "ep", releaseDate: "2026-06-01", status: "production", distributor: "TuneCore", isrc: "US-3GM-26-00008", mastered: false, artworkStatus: "in-progress", metadataComplete: false, distributorSubmitted: false });
    await ins("releases", { title: "Block Report", artistName: "Montrell", type: "single", releaseDate: "2026-05-10", status: "scheduled", distributor: "DistroKid", isrc: "US-3GM-26-00015", mastered: true, artworkStatus: "approved", metadataComplete: true, distributorSubmitted: true });
    await ins("releases", { title: "Rise of the 3rd Gate", artistName: "Montrell", type: "album", releaseDate: "2026-07-15", status: "pre-production", distributor: "TuneCore", mastered: false, artworkStatus: "not-started", metadataComplete: false, distributorSubmitted: false });
    await ins("releases", { title: "Golden Hour Deluxe", artistName: "Montrell", type: "album", releaseDate: "2026-03-01", status: "released", distributor: "DistroKid", isrc: "US-3GM-26-00001", mastered: true, artworkStatus: "approved", metadataComplete: true, distributorSubmitted: true });

    // ────────────────────────────────────────────────
    // 6. MUSIC PRODUCTION — Splits
    // ────────────────────────────────────────────────
    await ins("splitSheets", { trackTitle: "Block Report", status: "signed", contributors: [
      { name: "Montrell", role: "songwriter", percentage: 40, pro: "BMI" },
      { name: "DJ Phantom", role: "producer", percentage: 30, pro: "ASCAP" },
      { name: "LexiLux", role: "songwriter", percentage: 20, pro: "BMI" },
      { name: "Sage The Architect", role: "producer", percentage: 10, pro: "ASCAP" },
    ]});
    await ins("splitSheets", { trackTitle: "Street Scriptures", status: "agreed", contributors: [
      { name: "Rico Blaze", role: "performer", percentage: 50, pro: "BMI" },
      { name: "DJ Phantom", role: "producer", percentage: 35, pro: "ASCAP" },
      { name: "LexiLux", role: "songwriter", percentage: 15, pro: "BMI" },
    ]});
    await ins("splitSheets", { trackTitle: "Late Night Confessions", status: "draft", contributors: [
      { name: "Montrell", role: "songwriter", percentage: 35 },
      { name: "Kira Waves", role: "performer", percentage: 35 },
      { name: "Sage The Architect", role: "producer", percentage: 30, pro: "ASCAP" },
    ]});
    await ins("splitSheets", { trackTitle: "3rd Gate Cypher Vol. 1", status: "pending", contributors: [
      { name: "Montrell", role: "songwriter", percentage: 25, pro: "BMI" },
      { name: "Rico Blaze", role: "performer", percentage: 20 },
      { name: "Kira Waves", role: "performer", percentage: 20 },
      { name: "Veda Moon", role: "performer", percentage: 10 },
      { name: "DJ Phantom", role: "producer", percentage: 25, pro: "ASCAP" },
    ]});

    // ────────────────────────────────────────────────
    // 7. MUSIC STORE — Items
    // ────────────────────────────────────────────────
    const albumId = await ctx.db.insert("musicStoreItems", {
      title: "Golden Hour Deluxe", artistName: "Montrell", itemType: "album", price: 12.99,
      description: "The critically acclaimed debut album with 4 bonus deluxe tracks. 18 songs of raw storytelling over cinematic production.",
      genre: "Hip-Hop", coverArtUrl: "https://images.unsplash.com/photo-1598387846148-47e82ee120cc?w=400", duration: "58:42",
      releaseDate: "2026-03-01", isActive: true, isFeatured: true, playCount: 4520, purchaseCount: 187,
      tags: ["hip-hop", "debut", "deluxe", "cinematic"], createdAt: now,
      streamingLinks: { spotify: "https://open.spotify.com", appleMusic: "https://music.apple.com", youtube: "https://youtube.com" },
    });
    counts["musicStoreItems"] = (counts["musicStoreItems"] || 0) + 1;

    await ins("musicStoreItems", { title: "Rise Up", artistName: "Montrell", itemType: "single", price: 1.29,
      description: "Anthemic lead single from Golden Hour Deluxe. The track that started it all.",
      genre: "Hip-Hop", previewAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
      duration: "3:42", bpm: 130, key: "G minor", releaseDate: "2026-02-15", albumId, trackNumber: 1,
      isActive: true, isFeatured: true, playCount: 12450, purchaseCount: 892, tags: ["anthem", "motivational"],
      createdAt: new Date().toISOString(),
      streamingLinks: { spotify: "https://open.spotify.com", appleMusic: "https://music.apple.com" },
    });
    await ins("musicStoreItems", { title: "Crown Heavy", artistName: "Montrell", itemType: "single", price: 1.29,
      description: "Hard-hitting second single with orchestral horns over boom bap drums.",
      genre: "Hip-Hop", previewAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
      duration: "4:15", bpm: 95, key: "D minor", albumId, trackNumber: 2,
      isActive: true, playCount: 8730, purchaseCount: 445, tags: ["boom bap", "orchestral"],
      createdAt: new Date().toISOString(),
    });
    await ins("musicStoreItems", { title: "Street Scriptures", artistName: "Rico Blaze", itemType: "single", price: 1.29,
      description: "Raw drill energy from Chicago's next up. Authentic street poetry over Phantom's production.",
      genre: "Drill", previewAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
      duration: "3:18", bpm: 145, key: "F# minor", releaseDate: "2026-05-20",
      isActive: true, isFeatured: true, playCount: 3200, purchaseCount: 156, tags: ["drill", "chicago", "street"],
      createdAt: new Date().toISOString(),
    });
    await ins("musicStoreItems", { title: "Block Report", artistName: "Montrell", itemType: "single", price: 1.29,
      description: "The streets are talking. Montrell delivers his most aggressive bars yet.",
      genre: "Trap", previewAudioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "3:55", bpm: 150, key: "E minor", releaseDate: "2026-05-10",
      isActive: true, isFeatured: true, playCount: 1870, purchaseCount: 89, tags: ["trap", "aggressive", "street"],
      createdAt: new Date().toISOString(),
    });
    await ins("musicStoreItems", { title: "Midnight Frequencies", artistName: "Kira Waves", itemType: "ep", price: 6.99,
      description: "6-track EP exploring late-night emotions through sultry R&B vocals and atmospheric production.",
      genre: "R&B", duration: "24:30", releaseDate: "2026-06-01",
      isActive: true, playCount: 980, purchaseCount: 42, tags: ["r&b", "midnight", "sultry", "atmospheric"],
      createdAt: new Date().toISOString(),
    });

    // Music Store Purchases (use albumId from above, skip itemId for others since we can't reference them easily)
    await ins("musicPurchases", { itemId: albumId, itemTitle: "Golden Hour Deluxe", itemType: "album", artistName: "Montrell", customerName: "Marcus Johnson", customerEmail: "marcus@email.com", amount: 12.99, status: "completed", paymentMethod: "stripe" });
    await ins("musicPurchases", { itemId: albumId, itemTitle: "Golden Hour Deluxe", itemType: "album", artistName: "Montrell", customerName: "Sarah Chen", customerEmail: "sarah@email.com", amount: 12.99, status: "completed", paymentMethod: "paypal" });
    await ins("musicPurchases", { itemId: albumId, itemTitle: "Golden Hour Deluxe", itemType: "album", artistName: "Montrell", customerName: "DeAndre Williams", customerEmail: "deandre@email.com", amount: 12.99, status: "completed", paymentMethod: "stripe" });
    await ins("musicPurchases", { itemId: albumId, itemTitle: "Golden Hour Deluxe", itemType: "album", artistName: "Montrell", customerName: "Tyler Brooks", customerEmail: "tyler@email.com", amount: 12.99, status: "pending", paymentMethod: "stripe" });
    await ins("musicPurchases", { itemId: albumId, itemTitle: "Golden Hour Deluxe", itemType: "album", artistName: "Montrell", customerName: "Jasmine Rivera", customerEmail: "jasmine@email.com", amount: 12.99, status: "completed", paymentMethod: "stripe" });

    // ────────────────────────────────────────────────
    // 8. CONTENT LIBRARY
    // ────────────────────────────────────────────────
    await ins("content", { title: "Montrell — Rise Up (Official Video)", description: "The official music video for Rise Up. Directed by Cole Bennett.", category: "music-video", youtubeId: "dQw4w9WgXcQ", platform: "YouTube", duration: "3:42", publishedAt: "2026-02-15", featured: true, tags: ["music video", "montrell", "rise up"] });
    await ins("content", { title: "3rd Gate Studio Sessions: Making of Golden Hour", description: "Go behind the scenes of the Golden Hour album sessions.", category: "behind-the-scenes", youtubeId: "jNQXAC9IVRw", platform: "YouTube", duration: "18:30", publishedAt: "2026-03-05", featured: true, tags: ["bts", "studio", "golden hour"] });
    await ins("content", { title: "Rico Blaze — Street Scriptures (Lyric Video)", description: "Animated lyric video for Street Scriptures.", category: "music-video", youtubeId: "9bZkp7q19f0", platform: "YouTube", duration: "3:18", publishedAt: "2026-05-18", tags: ["lyric video", "rico blaze", "drill"] });
    await ins("content", { title: "Kira Waves Live at The Velvet Room", description: "Full performance from Kira Waves' sold-out show.", category: "live-performance", youtubeId: "kJQP7kiw5Fk", platform: "YouTube", duration: "45:00", publishedAt: "2026-04-20", featured: true, tags: ["live", "kira waves", "concert"] });
    await ins("content", { title: "Podcast Ep. 24 — The Business of Music", description: "Deep dive into music industry economics with special guest DJ Phantom.", category: "podcast", youtubeId: "RgKAFK5djSk", platform: "YouTube", duration: "1:15:00", publishedAt: "2026-04-28", tags: ["podcast", "business", "music industry"] });
    await ins("content", { title: "Beat Breakdown: How Phantom Menace Was Made", description: "DJ Phantom breaks down the production of Phantom Menace beat.", category: "tutorial", youtubeId: "OPf0YbXqDm0", platform: "YouTube", duration: "12:45", publishedAt: "2026-04-10", tags: ["tutorial", "beat making", "production"] });

    // ────────────────────────────────────────────────
    // 9. PODCAST EPISODES
    // ────────────────────────────────────────────────
    await ins("podcastEpisodes", { title: "The Business of Music: Building a Label from Scratch", description: "Montrell shares the journey of founding 3rd Gate Music Group — from bedroom beats to a full roster.", episodeNumber: 24, season: 2, duration: "1:15:00", publishedAt: "2026-04-28", isPublished: true, tags: ["business", "label", "entrepreneurship"] });
    await ins("podcastEpisodes", { title: "Producer Spotlight: DJ Phantom's Journey", description: "DJ Phantom opens up about his path to Grammy nominations and his signature sound.", episodeNumber: 23, season: 2, duration: "58:00", publishedAt: "2026-04-21", isPublished: true, tags: ["producer", "dj phantom", "beats"] });
    await ins("podcastEpisodes", { title: "Songwriting Secrets with LexiLux", description: "LexiLux reveals her top-line writing process and how she crafts hooks that stick.", episodeNumber: 22, season: 2, duration: "45:30", publishedAt: "2026-04-14", isPublished: true, tags: ["songwriting", "lexilux", "craft"] });
    await ins("podcastEpisodes", { title: "From the Streets to the Studio: Rico Blaze's Story", description: "Rico Blaze shares his raw journey from Chicago's South Side to the 3rd Gate roster.", episodeNumber: 21, season: 2, duration: "1:02:00", publishedAt: "2026-04-07", isPublished: true, tags: ["artist story", "rico blaze", "chicago"] });
    await ins("podcastEpisodes", { title: "Mixing Masterclass with Tone Mason", description: "Chief engineer Tone Mason breaks down his mixing approach and favorite plugins.", episodeNumber: 20, season: 2, duration: "1:20:00", publishedAt: "2026-03-31", isPublished: true, tags: ["mixing", "engineering", "masterclass"] });

    // ────────────────────────────────────────────────
    // 10. BLOG POSTS
    // ────────────────────────────────────────────────
    await ins("blogPosts", { title: "Behind the Beat: The Making of 'Rise Up'", slug: "behind-the-beat-rise-up", excerpt: "An inside look at how Montrell and DJ Phantom crafted the anthem that launched Golden Hour.", body: "It started at 2 AM in Studio A. Montrell had been free-styling over different beats for hours when DJ Phantom loaded up a track with orchestral strings layered over thundering 808s...\n\nThe chemistry was immediate. Within 30 minutes, the hook was written. By sunrise, the vocals were tracked. 'Rise Up' would go on to become the most-streamed track on the album, but in that moment, it was just two artists in a room making magic.\n\n## The Production\n\nPhantom started with a sample from a 1970s soul record, chopping it into something entirely new. The drums were programmed on an MPC, then bounced through analog hardware for that warm, gritty texture.\n\n## The Lyrics\n\nMontrell wrote the verses in one take — stream of consciousness about his journey from the streets to the studio. LexiLux came in the next day and helped refine the bridge, adding the melodic element that tied it all together.", category: "Music", tags: ["behind the scenes", "production", "rise up"], isPublished: true, authorName: "3rd Gate Editorial", views: 2340 });
    await ins("blogPosts", { title: "3rd Gate Music Group: Our 2026 Vision", slug: "3gm-2026-vision", excerpt: "A letter from the founder on where we're headed this year and what fans can expect.", body: "2025 was a breakthrough year. Golden Hour reached #47 on the Billboard 200. We signed three new artists. Our studio was renovated with world-class equipment.\n\nBut 2026 is where we go from independent to enterprise.\n\n## What's Coming\n\n- **Rise of the 3rd Gate** — Montrell's magnum opus, dropping July 15\n- **Midnight Frequencies** — Kira Waves' debut EP\n- **3rd Gate Cypher Series** — Monthly YouTube releases\n- **The Label Tour** — 12 cities, Fall 2026\n- **Merch Collection** — Premium streetwear line launching Q3\n\nWe're not just building a label. We're building a movement.", category: "Announcements", tags: ["vision", "2026", "announcements"], isPublished: true, authorName: "Montrell", views: 5670 });
    await ins("blogPosts", { title: "Rico Blaze Joins the 3rd Gate Roster", slug: "rico-blaze-joins-roster", excerpt: "Introducing the newest addition to the 3rd Gate family — Chicago's own Rico Blaze.", body: "We're excited to announce that Rico Blaze has officially signed with 3rd Gate Music Group.\n\nRico brings raw, authentic energy from Chicago's drill scene with a storytelling ability that sets him apart. His debut single 'Street Scriptures' drops May 20.\n\n\"3rd Gate understands the vision,\" Rico says. \"They let me be me while giving me the resources to level up.\"", category: "News", tags: ["rico blaze", "signing", "new artist"], isPublished: true, authorName: "3rd Gate Editorial", views: 3450 });

    // ────────────────────────────────────────────────
    // 11. EVENTS
    // ────────────────────────────────────────────────
    await ins("publicEvents", { title: "3rd Gate Live: Block Report Release Party", description: "Celebrate the release of Montrell's 'Block Report' single with a live performance, DJ sets, and exclusive merch.", eventType: "Concert", date: "2026-05-10", time: "20:00", endTime: "01:00", location: "The Velvet Room", address: "1234 S Michigan Ave, Chicago, IL 60605", isVirtual: false, ticketPrice: 25, isFree: false, maxAttendees: 500, isPublished: true });
    await ins("publicEvents", { title: "Studio Open House", description: "Tour our world-class recording facility. Meet the engineers, see the gear, and learn about our artist development program.", eventType: "Meet & Greet", date: "2026-05-15", time: "14:00", endTime: "18:00", location: "3rd Gate Studios", address: "456 W Lake St, Chicago, IL 60661", isVirtual: false, isFree: true, maxAttendees: 100, isPublished: true });
    await ins("publicEvents", { title: "Kira Waves: Midnight Frequencies Listening Party", description: "Be the first to hear Kira Waves' debut EP in its entirety. Intimate venue, premium sound system.", eventType: "Listening Party", date: "2026-05-30", time: "21:00", location: "Soho House Chicago", isVirtual: false, ticketPrice: 40, isFree: false, maxAttendees: 200, isPublished: true });
    await ins("publicEvents", { title: "Beat Battle: 3rd Gate Producer Showdown", description: "Watch DJ Phantom and Sage The Architect go head-to-head live. Audience votes the winner. Streamed on YouTube.", eventType: "Live Stream", date: "2026-06-05", time: "19:00", isVirtual: true, streamUrl: "https://youtube.com/live/3rdgate", isFree: true, isPublished: true });

    // ────────────────────────────────────────────────
    // 12. FINANCES (Command Center)
    // ────────────────────────────────────────────────
    await ins("finances", { type: "income", category: "Music Sales", amount: 18750, description: "Golden Hour Deluxe — Q1 digital sales", date: "2026-03-31", status: "received", clientName: "DistroKid" });
    await ins("finances", { type: "income", category: "Streaming", amount: 8420, description: "Spotify/Apple Music royalties — March 2026", date: "2026-04-15", status: "received", clientName: "TuneCore" });
    await ins("finances", { type: "income", category: "Sponsorship", amount: 15000, description: "BeatStars partnership deal — Q2", date: "2026-04-01", status: "received", clientName: "BeatStars" });
    await ins("finances", { type: "income", category: "Merchandise", amount: 6340, description: "Merch store sales — April 2026", date: "2026-04-30", status: "received" });
    await ins("finances", { type: "income", category: "Live Events", amount: 12500, description: "Block Report release party ticket sales (projected)", date: "2026-05-10", status: "pending" });
    await ins("finances", { type: "expense", category: "Studio", amount: 4800, description: "Studio A & B rental — May 2026", date: "2026-05-01", status: "paid" });
    await ins("finances", { type: "expense", category: "Marketing", amount: 3500, description: "Block Report promotional campaign — social ads", date: "2026-04-25", status: "paid" });
    await ins("finances", { type: "expense", category: "Production", amount: 7500, description: "Rise of the 3rd Gate — production costs (beats, sessions)", date: "2026-04-20", status: "paid" });
    await ins("finances", { type: "expense", category: "Equipment", amount: 2200, description: "New Neumann U87 microphone for Studio A", date: "2026-04-15", status: "paid" });
    await ins("finances", { type: "expense", category: "Distribution", amount: 299, description: "TuneCore annual distribution fee", date: "2026-01-15", status: "paid", recurring: true });

    // ────────────────────────────────────────────────
    // 13. MERCH PRODUCTS
    // ────────────────────────────────────────────────
    await ins("merchProducts", { name: "3rd Gate Logo Hoodie", description: "Premium heavyweight hoodie with embroidered 3rd Gate logo. 100% cotton fleece.", price: 65, compareAtPrice: 85, category: "hoodies", sizes: ["S", "M", "L", "XL", "2XL"], colors: ["Black", "Gold", "White"], stock: 150, isActive: true, isFeatured: true });
    await ins("merchProducts", { name: "Golden Hour Tour Tee", description: "Limited edition tour t-shirt. Screen-printed front and back.", price: 35, category: "t-shirts", sizes: ["S", "M", "L", "XL"], colors: ["Black", "White"], stock: 200, isActive: true, isFeatured: true });
    await ins("merchProducts", { name: "3rd Gate Snapback", description: "Structured snapback cap with 3D embroidered logo.", price: 30, category: "accessories", colors: ["Black/Gold", "All Black"], stock: 75, isActive: true });
    await ins("merchProducts", { name: "Montrell Signature Poster (24x36)", description: "High-quality poster featuring the Golden Hour album artwork. Signed by Montrell.", price: 25, category: "posters", stock: 50, isActive: true });
    await ins("merchProducts", { name: "3rd Gate Vinyl — Golden Hour", description: "180g vinyl pressing of Golden Hour. Gatefold sleeve. Limited to 500 copies.", price: 40, compareAtPrice: 55, category: "vinyl", stock: 42, isActive: true, isFeatured: true });
    await ins("merchProducts", { name: "Rise Up Tee", description: "Graphic tee with Rise Up single artwork.", price: 30, category: "t-shirts", sizes: ["S", "M", "L", "XL"], colors: ["Black"], stock: 0, isActive: false });

    // ────────────────────────────────────────────────
    // 14. MERCH ORDERS
    // ────────────────────────────────────────────────
    await ins("merchOrders", { customerName: "Marcus Johnson", customerEmail: "marcus@email.com", items: [{ productName: "3rd Gate Logo Hoodie", size: "L", color: "Black", quantity: 1, price: 65 }], total: 65, status: "shipped", shippingAddress: "123 State St, Chicago, IL 60601", trackingNumber: "1Z999AA1012345678", createdAt: new Date().toISOString() });
    await ins("merchOrders", { customerName: "Aisha Thompson", customerEmail: "aisha@email.com", items: [{ productName: "Golden Hour Tour Tee", size: "M", color: "Black", quantity: 2, price: 35 }, { productName: "3rd Gate Snapback", color: "Black/Gold", quantity: 1, price: 30 }], total: 100, status: "processing", shippingAddress: "456 Oak Ave, Evanston, IL 60201", createdAt: new Date().toISOString() });
    await ins("merchOrders", { customerName: "Tyler Brooks", customerEmail: "tyler@email.com", items: [{ productName: "3rd Gate Vinyl — Golden Hour", quantity: 1, price: 40 }], total: 40, status: "delivered", shippingAddress: "789 Pine Rd, Oak Park, IL 60302", createdAt: new Date().toISOString() });
    await ins("merchOrders", { customerName: "Jasmine Rivera", customerEmail: "jasmine@email.com", items: [{ productName: "3rd Gate Logo Hoodie", size: "S", color: "Gold", quantity: 1, price: 65 }, { productName: "Montrell Signature Poster (24x36)", quantity: 1, price: 25 }], total: 90, status: "pending", shippingAddress: "321 Elm Blvd, Chicago, IL 60614", createdAt: new Date().toISOString() });

    // ────────────────────────────────────────────────
    // 15. GUESTS (Landing page)
    // ────────────────────────────────────────────────
    await ins("guests", { name: "DJ Phantom", title: "Grammy-Nominated Producer", quote: "The future of hip-hop production starts at 3rd Gate.", featured: true });
    await ins("guests", { name: "Kira Waves", title: "R&B Vocalist & Performer", quote: "This label gave me the space to be my authentic self.", featured: true });
    await ins("guests", { name: "Mike Dean", title: "Legendary Producer & Engineer", quote: "3rd Gate is building something special. The talent is undeniable.", featured: true });
    await ins("guests", { name: "Big Sean", title: "Rapper & Entrepreneur", quote: "Montrell has the vision and the work ethic. Watch this label.", featured: false });

    // ────────────────────────────────────────────────
    // 16. TICKER ITEMS
    // ────────────────────────────────────────────────
    await ins("tickerItems", { text: "🔥 NEW SINGLE: Montrell — 'Block Report' drops May 10!", isActive: true, priority: 1 });
    await ins("tickerItems", { text: "🎤 Rico Blaze — 'Street Scriptures' out May 20", isActive: true, priority: 2 });
    await ins("tickerItems", { text: "🎧 Golden Hour Deluxe streaming everywhere now", isActive: true, priority: 3 });
    await ins("tickerItems", { text: "🎪 Block Report Release Party — May 10 at The Velvet Room — Get tickets!", isActive: true, priority: 4 });
    await ins("tickerItems", { text: "📀 Kira Waves EP 'Midnight Frequencies' coming June 1", isActive: true, priority: 5 });

    // ────────────────────────────────────────────────
    // 17. SUBSCRIBERS
    // ────────────────────────────────────────────────
    for (const sub of [
      { email: "marcus.j@email.com", source: "website" },
      { email: "sarah.chen@email.com", source: "instagram" },
      { email: "tyler.b@email.com", source: "website" },
      { email: "aisha.t@email.com", source: "concert" },
      { email: "jasmine.r@email.com", source: "website" },
      { email: "deandre.w@email.com", source: "tiktok" },
      { email: "nicole.p@email.com", source: "website" },
      { email: "jordan.k@email.com", source: "youtube" },
      { email: "brittany.m@email.com", source: "instagram" },
      { email: "chris.l@email.com", source: "website" },
      { email: "mia.g@email.com", source: "referral" },
      { email: "dante.h@email.com", source: "concert" },
    ]) { await ins("subscribers", { ...sub, subscribedAt: now }); }

    // ────────────────────────────────────────────────
    // 18. CALENDAR EVENTS
    // ────────────────────────────────────────────────
    await ins("calendarEvents", { title: "Album Vocal Sessions (Tracks 1-4)", type: "recording", date: "2026-05-05", time: "10:00", status: "confirmed", color: "#ef4444" });
    await ins("calendarEvents", { title: "Kira EP Final Mix Session", type: "recording", date: "2026-05-06", time: "14:00", status: "confirmed", color: "#a855f7" });
    await ins("calendarEvents", { title: "Block Report Release Party", type: "event", date: "2026-05-10", time: "20:00", status: "confirmed", color: "#D4A843" });
    await ins("calendarEvents", { title: "Marketing Meeting — Q2 Strategy", type: "meeting", date: "2026-05-07", time: "11:00", status: "confirmed", color: "#3b82f6" });
    await ins("calendarEvents", { title: "Songwriting Camp (Day 1)", type: "recording", date: "2026-05-08", time: "12:00", status: "confirmed", color: "#22c55e" });
    await ins("calendarEvents", { title: "DistroKid Submission Deadline — Block Report", type: "deadline", date: "2026-05-08", status: "pending", color: "#ef4444" });
    await ins("calendarEvents", { title: "Street Scriptures Video Shoot", type: "event", date: "2026-05-14", time: "08:00", status: "confirmed", color: "#06b6d4" });
    await ins("calendarEvents", { title: "Studio Open House", type: "event", date: "2026-05-15", time: "14:00", status: "confirmed", color: "#D4A843" });

    // ────────────────────────────────────────────────
    // 19. GUEST CRM
    // ────────────────────────────────────────────────
    await ins("guestCRM", { name: "Mike Dean", email: "mike@mikedean.com", bio: "Legendary producer and engineer. Worked with Kanye, Travis Scott, The Weeknd.", status: "confirmed", interviewDate: "2026-05-20", tags: ["producer", "legend", "mixing"], notes: "Confirmed for podcast ep. 25. Wants to discuss new analog gear." });
    await ins("guestCRM", { name: "Russ", email: "team@diemon.com", bio: "Independent artist and entrepreneur. Built a label from his bedroom.", status: "pitched", tags: ["independent", "entrepreneur", "rapper"], notes: "Pitched via DM. Manager said he's interested." });
    await ins("guestCRM", { name: "Alex Tumay", email: "alex@tumay.com", bio: "Grammy-winning mix engineer. Credits: Young Thug, 21 Savage, Metro Boomin.", status: "confirmed", interviewDate: "2026-06-10", tags: ["engineer", "mixing", "grammy"], notes: "Wants to demo his new plugin." });
    await ins("guestCRM", { name: "Nipsey Hussle (Estate)", email: "marathoncontinues@email.com", bio: "Feature on the legacy and business model of Nipsey Hussle.", status: "researching", tags: ["legacy", "business", "entrepreneurship"], notes: "Reaching out to Marathon Clothing team." });

    // ────────────────────────────────────────────────
    // 20. BOOKINGS
    // ────────────────────────────────────────────────
    await ins("bookings", { guestName: "DJ Khaled (Team)", email: "booking@wethebestmusic.com", topic: "Building a Brand Beyond Music", preferredDate: "2026-06-20", preferredTime: "15:00", message: "DJ Khaled's team reached out about a potential podcast appearance.", status: "pending" });
    await ins("bookings", { guestName: "Victoria Monét", email: "bookings@victoriamonet.com", phone: "(310) 555-0200", topic: "Songwriting for Stars", preferredDate: "2026-06-15", message: "Grammy-winning songwriter wants to discuss creative process.", status: "confirmed" });

    // ────────────────────────────────────────────────
    // 21. SPONSORS
    // ────────────────────────────────────────────────
    await ins("sponsors", { companyName: "BeatStars", contactName: "Abe Batshon", email: "partnerships@beatstars.com", website: "https://beatstars.com", dealType: "Sponsorship", amount: 15000, status: "active", startDate: "2026-04-01", endDate: "2026-09-30", notes: "Q2-Q3 sponsorship. Logo on all content + dedicated podcast mid-roll." });
    await ins("sponsors", { companyName: "Splice", contactName: "Kakul Srivastava", email: "partners@splice.com", website: "https://splice.com", dealType: "Affiliate", amount: 5000, status: "active", startDate: "2026-03-01", notes: "Affiliate link in all production tutorials. $2 per signup." });
    await ins("sponsors", { companyName: "Audio-Technica", contactName: "Brand Team", email: "sponsorships@audio-technica.com", website: "https://audio-technica.com", dealType: "Product", amount: 8000, status: "pitched", notes: "Pitched studio gear sponsorship. Waiting on Q3 budget approval." });

    // ────────────────────────────────────────────────
    // 22. REVENUE
    // ────────────────────────────────────────────────
    await ins("revenue", { source: "Sponsorship", amount: 15000, description: "BeatStars Q2 sponsorship payment", date: "2026-04-01", status: "received" });
    await ins("revenue", { source: "Music Sales", amount: 18750, description: "Golden Hour Deluxe digital sales — Q1", date: "2026-03-31", status: "received" });
    await ins("revenue", { source: "Streaming", amount: 8420, description: "Spotify + Apple Music royalties — March", date: "2026-04-15", status: "received" });
    await ins("revenue", { source: "Merchandise", amount: 6340, description: "Online merch store — April sales", date: "2026-04-30", status: "received" });
    await ins("revenue", { source: "Live Events", amount: 12500, description: "Block Report release party (projected)", date: "2026-05-10", status: "pending" });
    await ins("revenue", { source: "Affiliate", amount: 1240, description: "Splice affiliate commissions — April", date: "2026-04-30", status: "received" });

    // ────────────────────────────────────────────────
    // 23. EMAIL CAMPAIGNS
    // ────────────────────────────────────────────────
    await ins("emailCampaigns", { name: "Block Report Launch", subject: "🔥 NEW MUSIC: Montrell — Block Report is HERE", body: "The wait is over. Montrell's new single 'Block Report' is available everywhere.\n\nStream it. Download it. Share it.\n\n[LISTEN NOW]", template: "announcement", status: "sent", sentAt: "2026-05-10T12:00:00Z" });
    await ins("emailCampaigns", { name: "May Newsletter", subject: "3rd Gate May Update: New music, events & more", body: "Hey fam,\n\nBig things happening this month:\n- Block Report drops May 10\n- Street Scriptures May 20\n- Studio Open House May 15\n\nStay tuned.", template: "newsletter", status: "draft" });
    await ins("emailCampaigns", { name: "Release Party Invite", subject: "🎪 You're Invited: Block Report Release Party", body: "Join us May 10 at The Velvet Room for the official Block Report release party.\n\nLive performances, DJ sets, exclusive merch.\n\nTickets: $25", template: "event", status: "scheduled", scheduledAt: "2026-05-06T10:00:00Z" });

    // ────────────────────────────────────────────────
    // 24. DOCUMENTS
    // ────────────────────────────────────────────────
    await ins("documents", { title: "Rico Blaze — Artist Agreement", type: "contract", status: "signed", partyName: "Rico Blaze", partyEmail: "rico@3rdgatemg.com", description: "Standard artist development and distribution agreement. 2-year term.", tags: ["contract", "artist", "rico blaze"], signedAt: "2026-04-01" });
    await ins("documents", { title: "BeatStars Sponsorship Agreement", type: "contract", status: "signed", partyName: "BeatStars Inc.", partyEmail: "legal@beatstars.com", description: "Q2-Q3 sponsorship deal. $15,000 total. Deliverables: podcast mentions, social posts, logo placement.", tags: ["sponsorship", "beatstars"] });
    await ins("documents", { title: "Venue Contract — The Velvet Room", type: "contract", status: "pending", partyName: "The Velvet Room", description: "Venue rental for Block Report release party. May 10, 2026.", tags: ["venue", "event"] });
    await ins("documents", { title: "Master License — Golden Hour Samples", type: "license", status: "signed", partyName: "Universal Music Publishing", description: "Sample clearance for 3 tracks on Golden Hour album.", tags: ["license", "samples"] });
    await ins("documents", { title: "NDA — Upcoming Feature Artist", type: "nda", status: "draft", description: "Non-disclosure for unannounced feature on Rise of the 3rd Gate album.", tags: ["nda", "feature"] });

    // ────────────────────────────────────────────────
    // 25. TASKS
    // ────────────────────────────────────────────────
    await ins("tasks", { title: "Finalize Block Report artwork", project: "Block Report Single", status: "completed", priority: "urgent", assignee: "Art Director", dueDate: "2026-05-04", tags: ["artwork", "urgent"] });
    await ins("tasks", { title: "Submit Block Report to DistroKid", project: "Block Report Single", status: "in-progress", priority: "urgent", assignee: "Montrell", dueDate: "2026-05-06", tags: ["distribution", "deadline"] });
    await ins("tasks", { title: "Book video director for Street Scriptures", project: "Rico Blaze Launch", status: "completed", priority: "high", assignee: "LexiLux", dueDate: "2026-05-08" });
    await ins("tasks", { title: "Mix review — Midnight Frequencies tracks 3-6", project: "Kira EP", status: "todo", priority: "high", assignee: "Tone Mason", dueDate: "2026-05-07" });
    await ins("tasks", { title: "Order merch inventory for release party", project: "Events", status: "in-progress", priority: "medium", assignee: "Operations", dueDate: "2026-05-07" });
    await ins("tasks", { title: "Write press release for Street Scriptures", project: "Rico Blaze Launch", status: "todo", priority: "medium", assignee: "LexiLux", dueDate: "2026-05-12" });
    await ins("tasks", { title: "Set up playlist pitching — Block Report", project: "Marketing", status: "todo", priority: "high", assignee: "Montrell", dueDate: "2026-05-05" });
    await ins("tasks", { title: "Update website with new artist photos", project: "Brand", status: "todo", priority: "low", assignee: "Art Director" });

    // ────────────────────────────────────────────────
    // 26. NEWSLETTERS
    // ────────────────────────────────────────────────
    await ins("newsletters", { subject: "🔥 Block Report Drops Friday!", body: "The wait is almost over. Montrell's most aggressive track yet arrives this Friday. Pre-save now.", status: "sent", sentAt: "2026-05-07T12:00:00Z" });
    await ins("newsletters", { subject: "This Month at 3rd Gate", body: "New music, studio sessions, events, and more. Here's what's happening in May.", status: "draft" });

    // ────────────────────────────────────────────────
    // 27. SHOW NOTES
    // ────────────────────────────────────────────────
    await ins("showNotes", { episodeTitle: "The Business of Music: Building a Label from Scratch", summary: "Montrell breaks down the financials and strategy behind launching 3rd Gate Music Group.", timestamps: [{ time: "0:00", label: "Intro & welcome" }, { time: "5:30", label: "The decision to go independent" }, { time: "18:00", label: "Funding the first project" }, { time: "35:00", label: "Building a team" }, { time: "52:00", label: "Revenue streams breakdown" }, { time: "1:05:00", label: "Advice for aspiring label owners" }], keyQuotes: ["Distribution is just logistics. The real value is in the art.", "I invested my last $5,000 into Golden Hour. Best bet I ever made."], tags: ["business", "label", "entrepreneurship"], published: true });

    // ────────────────────────────────────────────────
    // 28. INVOICES (Business Ops)
    // ────────────────────────────────────────────────
    await ins("invoices", { invoiceNumber: "3GM-2026-001", clientName: "BeatStars Inc.", clientEmail: "accounting@beatstars.com", clientCompany: "BeatStars", items: [{ description: "Q2 Sponsorship — Podcast Mid-Roll (12 episodes)", quantity: 12, rate: 750, amount: 9000 }, { description: "Social Media Posts (6 posts)", quantity: 6, rate: 500, amount: 3000 }, { description: "Logo Placement — Website Banner", quantity: 1, rate: 3000, amount: 3000 }], subtotal: 15000, tax: 0, total: 15000, status: "paid", issueDate: "2026-04-01", dueDate: "2026-04-30", paidDate: "2026-04-15" });
    await ins("invoices", { invoiceNumber: "3GM-2026-002", clientName: "The Velvet Room", clientEmail: "events@velvetroom.com", items: [{ description: "Venue Rental — Release Party (May 10)", quantity: 1, rate: 3500, amount: 3500 }, { description: "Sound System Upgrade Package", quantity: 1, rate: 1500, amount: 1500 }], subtotal: 5000, tax: 437.50, total: 5437.50, status: "pending", issueDate: "2026-05-01", dueDate: "2026-05-08" });
    await ins("invoices", { invoiceNumber: "3GM-2026-003", clientName: "Audio-Technica", clientEmail: "sponsorships@audio-technica.com", clientCompany: "Audio-Technica", items: [{ description: "Product Placement — Studio Sessions (YouTube)", quantity: 4, rate: 1000, amount: 4000 }, { description: "Dedicated Review Video", quantity: 1, rate: 4000, amount: 4000 }], subtotal: 8000, total: 8000, status: "draft", issueDate: "2026-05-04", dueDate: "2026-06-04" });

    // ────────────────────────────────────────────────
    // 29. WAIVERS
    // ────────────────────────────────────────────────
    await ins("waivers", { type: "appearance", guestName: "Mike Dean", guestEmail: "mike@mikedean.com", description: "Podcast appearance release — Episode 25", episodeTitle: "The Art of Mixing", status: "sent", createdAt: new Date().toISOString() });
    await ins("waivers", { type: "appearance", guestName: "Rico Blaze", guestEmail: "rico@3rdgatemg.com", description: "Music video appearance release — Street Scriptures", status: "signed", signedAt: "2026-04-20", createdAt: new Date().toISOString() });
    await ins("waivers", { type: "location", guestName: "The Velvet Room", description: "Location filming release — Release party content", locationFilmed: "1234 S Michigan Ave, Chicago", dateFilmed: "2026-05-10", status: "pending", createdAt: new Date().toISOString() });

    // ────────────────────────────────────────────────
    // 30. CONTENT SCHEDULE
    // ────────────────────────────────────────────────
    await ins("contentSchedule", { title: "Block Report — Teaser Clip", platform: "Instagram", contentType: "Reel", status: "published", scheduledDate: "2026-05-05", scheduledTime: "18:00", assignee: "Art Director" });
    await ins("contentSchedule", { title: "Block Report — Full Music Video", platform: "YouTube", contentType: "Video", status: "scheduled", scheduledDate: "2026-05-10", scheduledTime: "12:00", assignee: "Montrell" });
    await ins("contentSchedule", { title: "Studio Session BTS — Making of Rise of the 3rd Gate", platform: "TikTok", contentType: "Short Video", status: "draft", scheduledDate: "2026-05-07", assignee: "LexiLux" });
    await ins("contentSchedule", { title: "Street Scriptures — Countdown Post", platform: "Twitter", contentType: "Image Post", status: "scheduled", scheduledDate: "2026-05-18", scheduledTime: "10:00", assignee: "Rico Blaze" });
    await ins("contentSchedule", { title: "Podcast Ep. 25 — Promo Clip", platform: "Instagram", contentType: "Reel", status: "draft", scheduledDate: "2026-05-19", assignee: "LexiLux" });
    await ins("contentSchedule", { title: "Kira Waves EP Announcement", platform: "Instagram", contentType: "Carousel", status: "draft", scheduledDate: "2026-05-22", assignee: "Kira Waves" });

    // ────────────────────────────────────────────────
    // 31. TEAM MEMBERS
    // ────────────────────────────────────────────────
    const tm1 = await ctx.db.insert("teamMembers", { name: "Montrell", role: "Founder / Lead Artist", email: "montrell@3rdgatemg.com", rate: 0, rateType: "salary", isActive: true, notes: "Founder. Handles creative direction and A&R.", createdAt: now });
    counts["teamMembers"] = (counts["teamMembers"] || 0) + 1;
    const tm2 = await ctx.db.insert("teamMembers", { name: "Tone Mason", role: "Chief Engineer", email: "tone@3rdgatemg.com", rate: 75, rateType: "hourly", isActive: true, notes: "Mix & master engineer. Studio A.", createdAt: now });
    counts["teamMembers"] = (counts["teamMembers"] || 0) + 1;
    const tm3 = await ctx.db.insert("teamMembers", { name: "LexiLux", role: "Creative Director / Songwriter", email: "lexi@3rdgatemg.com", rate: 60, rateType: "hourly", isActive: true, createdAt: now });
    counts["teamMembers"] = (counts["teamMembers"] || 0) + 1;
    await ins("teamMembers", { name: "DJ Phantom", role: "Head of Production", email: "phantom@3rdgatemg.com", rate: 5000, rateType: "project", isActive: true });
    await ins("teamMembers", { name: "Sage The Architect", role: "Staff Producer", email: "sage@3rdgatemg.com", rate: 3000, rateType: "project", isActive: true });

    // Time entries
    await ins("timeEntries", { teamMemberId: tm2, date: "2026-05-03", hours: 6, description: "DJ Phantom beat session — recording & engineering", project: "Beat Library", amount: 450, status: "approved" });
    await ins("timeEntries", { teamMemberId: tm2, date: "2026-05-04", hours: 4, description: "Rico Blaze mastering session — Street Scriptures", project: "Rico Blaze Launch", amount: 300, status: "approved" });
    await ins("timeEntries", { teamMemberId: tm3, date: "2026-05-03", hours: 5, description: "Songwriting — Late Night Confessions hook concepts", project: "Montrell Album", amount: 300, status: "approved" });
    await ins("timeEntries", { teamMemberId: tm2, date: "2026-05-02", hours: 8, description: "Kira EP mix session — tracks 1-2", project: "Kira EP", amount: 600, status: "approved" });

    // ────────────────────────────────────────────────
    // 32. MEMBERSHIP TIERS
    // ────────────────────────────────────────────────
    await ins("membershipTiers", { name: "Street Team", price: 0, description: "Free access to community and basic updates.", perks: ["Community access", "Newsletter", "Event announcements"], color: "#888", isActive: true, order: 1 });
    await ins("membershipTiers", { name: "Inner Circle", price: 9.99, description: "Exclusive content, early access, and behind-the-scenes footage.", perks: ["Everything in Street Team", "Early music access", "BTS content", "Monthly Q&A", "Exclusive merch discounts"], color: "#D4A843", isActive: true, order: 2 });
    await ins("membershipTiers", { name: "VIP Gate Pass", price: 29.99, description: "Premium tier with direct access, signed merch, and event priority.", perks: ["Everything in Inner Circle", "Signed merch quarterly", "Priority event access", "Direct message access", "Studio tour invite", "Name in album credits"], color: "#a855f7", isActive: true, order: 3 });

    // ────────────────────────────────────────────────
    // 33. LINK BIO ITEMS
    // ────────────────────────────────────────────────
    await ins("linkBioItems", { title: "🎵 Listen to Golden Hour Deluxe", url: "https://open.spotify.com", icon: "music", isActive: true, order: 1, clicks: 3420 });
    await ins("linkBioItems", { title: "🛒 Official Merch Store", url: "https://meek-llama-6ff7bd.netlify.app/shop", icon: "shopping-bag", isActive: true, order: 2, clicks: 1890 });
    await ins("linkBioItems", { title: "🎪 Block Report Release Party — Get Tickets!", url: "https://meek-llama-6ff7bd.netlify.app/events", icon: "ticket", isActive: true, order: 3, clicks: 720 });
    await ins("linkBioItems", { title: "🎙️ Podcast — Latest Episodes", url: "https://meek-llama-6ff7bd.netlify.app/podcast", icon: "mic", isActive: true, order: 4, clicks: 1450 });
    await ins("linkBioItems", { title: "📸 Follow on Instagram", url: "https://instagram.com/3rdgatemg", icon: "instagram", isActive: true, order: 5, clicks: 2100 });

    // ────────────────────────────────────────────────
    // 34. COMMUNITY POSTS
    // ────────────────────────────────────────────────
    await ins("communityPosts", { authorName: "Marcus J", message: "Golden Hour has been on repeat since March. Crown Heavy is easily top 5 songs of 2026 🔥", type: "discussion", isApproved: true, likes: 47, createdAt: "2026-04-20T14:30:00Z" });
    await ins("communityPosts", { authorName: "Sarah C", message: "Just pre-ordered the vinyl! Can't wait to hear it on wax 🎵", type: "discussion", isApproved: true, likes: 23, createdAt: "2026-04-25T09:15:00Z" });
    await ins("communityPosts", { authorName: "Tyler B", message: "Who else is going to the Block Report release party?? Chicago stand up!", type: "discussion", isApproved: true, likes: 35, createdAt: "2026-05-02T18:00:00Z" });
    await ins("communityPosts", { authorName: "Aisha T", message: "Kira Waves' voice is unreal. Midnight Frequencies is going to be incredible.", type: "discussion", isApproved: true, likes: 52, createdAt: "2026-05-01T11:45:00Z" });
    await ins("communityPosts", { authorName: "DeAndre W", message: "Rico Blaze is the real deal. Street Scriptures snippet goes crazy 🔥🔥🔥", type: "hype", isApproved: true, likes: 68, createdAt: "2026-05-03T20:30:00Z" });

    // ────────────────────────────────────────────────
    // 35. BRAND ASSETS
    // ────────────────────────────────────────────────
    await ins("brandAssets", { name: "3rd Gate Logo — Primary", type: "logo", description: "Main logo. Gold on black. Use for all primary branding.", category: "logos" });
    await ins("brandAssets", { name: "3rd Gate Logo — White", type: "logo", description: "All-white version for dark backgrounds and merchandise.", category: "logos" });
    await ins("brandAssets", { name: "Brand Color Palette", type: "color", value: "#D4A843, #0a0a0a, #f0ece4, #a855f7, #ef4444", description: "Primary: Gold. Secondary: Black. Accent: Purple.", category: "colors" });
    await ins("brandAssets", { name: "Brand Typography", type: "font", value: "Display: Cinzel / Body: Inter", description: "Cinzel for headings, Inter for body text.", category: "typography" });
    await ins("brandAssets", { name: "Press Photo — Montrell (Studio)", type: "photo", description: "High-res press photo of Montrell in Studio A. For press kits and media.", category: "photos" });

    // ────────────────────────────────────────────────
    // 36. EXPENSES (features2)
    // ────────────────────────────────────────────────
    await ins("expenses", { title: "Studio A Monthly Rent", category: "Studio", amount: 3200, vendor: "Loop Studios LLC", date: "2026-05-01", isRecurring: true, isDeductible: true });
    await ins("expenses", { title: "Facebook/Instagram Ads — Block Report", category: "Marketing", amount: 1500, vendor: "Meta Platforms", date: "2026-04-28", isDeductible: true });
    await ins("expenses", { title: "Neumann U87 Microphone", category: "Equipment", amount: 2200, vendor: "Sweetwater", date: "2026-04-15", isDeductible: true, notes: "Replacement mic for Studio A." });
    await ins("expenses", { title: "TuneCore Annual Plan", category: "Distribution", amount: 299, vendor: "TuneCore", date: "2026-01-15", isRecurring: true, isDeductible: true });
    await ins("expenses", { title: "Music Video — Rise Up (Director fee)", category: "Content", amount: 8000, vendor: "Cole Bennett / Lyrical Lemonade", date: "2026-02-10", isDeductible: true });
    await ins("expenses", { title: "Splice Subscription", category: "Software", amount: 19.99, vendor: "Splice", date: "2026-05-01", isRecurring: true, isDeductible: true });

    // ────────────────────────────────────────────────
    // 37. CONTRACTS (features2)
    // ────────────────────────────────────────────────
    await ins("contracts", { title: "Artist Agreement — Rico Blaze", party: "Rico Blaze", partyEmail: "rico@3rdgatemg.com", type: "Artist Agreement", amount: 50000, status: "active", expiresAt: "2028-04-01", notes: "2-year deal. Includes 2 albums + 4 singles minimum." });
    await ins("contracts", { title: "Producer Agreement — DJ Phantom", party: "DJ Phantom", partyEmail: "phantom@3rdgatemg.com", type: "Producer Agreement", amount: 75000, status: "active", expiresAt: "2027-12-31", notes: "Exclusive production deal. 20 beats/year minimum." });
    await ins("contracts", { title: "BeatStars Sponsorship", party: "BeatStars Inc.", partyEmail: "legal@beatstars.com", type: "Sponsorship", amount: 15000, status: "active", expiresAt: "2026-09-30" });
    await ins("contracts", { title: "Venue Rental — The Velvet Room", party: "The Velvet Room", type: "Venue", amount: 5000, status: "pending", expiresAt: "2026-05-10" });

    // ────────────────────────────────────────────────
    // 38. FOLLOW-UPS (features2)
    // ────────────────────────────────────────────────
    await ins("followUps", { contactName: "Audio-Technica Brand Team", contactEmail: "sponsorships@audio-technica.com", contactType: "sponsor", reason: "Follow up on Q3 sponsorship proposal", dueDate: "2026-05-10", priority: "high", status: "pending", createdAt: new Date().toISOString() });
    await ins("followUps", { contactName: "Russ (Manager)", contactEmail: "team@diemon.com", contactType: "guest", reason: "Check status of podcast appearance interest", dueDate: "2026-05-08", priority: "medium", status: "pending", createdAt: new Date().toISOString() });
    await ins("followUps", { contactName: "Cole Bennett", contactEmail: "cole@lyricallemonade.com", contactType: "vendor", reason: "Discuss Street Scriptures video concept", dueDate: "2026-05-06", priority: "high", status: "pending", createdAt: new Date().toISOString() });

    // ────────────────────────────────────────────────
    // 39. PIPELINE (features2)
    // ────────────────────────────────────────────────
    await ins("pipeline", { title: "Block Report Music Video", contentType: "Music Video", stage: "post-production", platforms: "YouTube, Instagram, TikTok", scheduledDate: "2026-05-10", assignedTo: "Montrell" });
    await ins("pipeline", { title: "Street Scriptures Lyric Video", contentType: "Lyric Video", stage: "production", platforms: "YouTube", scheduledDate: "2026-05-18", assignedTo: "Art Director" });
    await ins("pipeline", { title: "3rd Gate Cypher Vol. 1", contentType: "Music Video", stage: "pre-production", platforms: "YouTube", scheduledDate: "2026-05-25", assignedTo: "LexiLux" });
    await ins("pipeline", { title: "Podcast Ep. 25 — Mike Dean", contentType: "Podcast", stage: "scheduled", platforms: "YouTube, Spotify, Apple", scheduledDate: "2026-05-20", assignedTo: "Montrell" });
    await ins("pipeline", { title: "Beat Breakdown: Crown Royal", contentType: "Tutorial", stage: "idea", platforms: "YouTube, TikTok", assignedTo: "DJ Phantom" });

    // ────────────────────────────────────────────────
    // 40. FAN Q&A
    // ────────────────────────────────────────────────
    await ins("fanQA", { fanName: "Marcus J", fanEmail: "marcus@email.com", question: "When is Rise of the 3rd Gate dropping?", answer: "July 15, 2026! We're deep in recording right now and the album is sounding incredible. Stay tuned for singles leading up to it.", answeredAt: "2026-04-16", isApproved: true, isFeatured: true, createdAt: "2026-04-15" });
    await ins("fanQA", { fanName: "Aisha T", question: "Will there be a tour for the new album?", answer: "YES! The 3rd Gate Tour is planned for Fall 2026 — 12 cities. Dates coming soon.", answeredAt: "2026-04-21", isApproved: true, isFeatured: true, createdAt: "2026-04-20" });
    await ins("fanQA", { fanName: "Tyler B", question: "How can I submit beats to the label?", isApproved: false, createdAt: "2026-05-01" });
    await ins("fanQA", { fanName: "Nicole P", question: "Any plans for international shows?", isApproved: false, createdAt: "2026-05-03" });

    // ────────────────────────────────────────────────
    // 41. FAN POINTS / LEADERBOARD
    // ────────────────────────────────────────────────
    await ins("fanPoints", { fanName: "DeAndre W", fanEmail: "deandre@email.com", points: 2450, level: "legend", communityPosts: 52, eventAttendances: 8, referrals: 12 });
    await ins("fanPoints", { fanName: "Marcus J", fanEmail: "marcus@email.com", points: 1870, level: "vip", communityPosts: 28, eventAttendances: 5 });
    await ins("fanPoints", { fanName: "Aisha T", fanEmail: "aisha@email.com", points: 1560, level: "vip", communityPosts: 35, referrals: 8 });
    await ins("fanPoints", { fanName: "Tyler B", fanEmail: "tyler@email.com", points: 1200, level: "regular", communityPosts: 15, eventAttendances: 3 });
    await ins("fanPoints", { fanName: "Jasmine R", fanEmail: "jasmine@email.com", points: 980, level: "regular", eventAttendances: 4 });
    await ins("fanPoints", { fanName: "Sarah C", fanEmail: "sarah@email.com", points: 850, level: "regular", communityPosts: 12 });

    // ────────────────────────────────────────────────
    // 42. BREAKING ALERTS
    // ────────────────────────────────────────────────
    await ins("breakingAlerts", { headline: "🔥 'Block Report' drops THIS Friday!", message: "Montrell's most aggressive single yet arrives May 10. Pre-save on all platforms.", severity: "info", isActive: true, createdAt: new Date().toISOString() });

    // ────────────────────────────────────────────────
    // 43. EXCLUSIVE CONTENT
    // ────────────────────────────────────────────────
    await ins("exclusiveContent", { title: "Block Report — Unreleased Demo Version", description: "The original demo recording before the final production. Hear where it all started.", contentType: "audio", accessLevel: "vip", isPublished: true, createdAt: new Date().toISOString() });
    await ins("exclusiveContent", { title: "Studio Cam — Golden Hour Recording Day 1", description: "Raw footage from the first day of album recording.", contentType: "video", accessLevel: "inner-circle", isPublished: true, createdAt: new Date().toISOString() });
    await ins("exclusiveContent", { title: "Montrell's Personal Playlist — May 2026", description: "What Montrell's been listening to this month.", contentType: "playlist", accessLevel: "free", isPublished: true, createdAt: new Date().toISOString() });

    // ────────────────────────────────────────────────
    // 44. MEDIA ASSETS (PowerUps)
    // ────────────────────────────────────────────────
    await ins("mediaAssets", { title: "Golden Hour Album Artwork (Final)", fileUrl: "https://images.unsplash.com/photo-1598387846148-47e82ee120cc?w=800", fileType: "image", tags: "artwork, album, golden hour", project: "Golden Hour Deluxe" });
    await ins("mediaAssets", { title: "Block Report Cover Art", fileUrl: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800", fileType: "image", tags: "artwork, single, block report", project: "Block Report Single" });
    await ins("mediaAssets", { title: "Studio A — Press Photo Set", fileUrl: "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800", fileType: "image", tags: "press, studio, photos", project: "Brand" });
    await ins("mediaAssets", { title: "Rise Up MV — Final Cut", fileUrl: "https://example.com/riseup-final.mp4", fileType: "video", tags: "music video, rise up, final", project: "Golden Hour Deluxe" });

    // ────────────────────────────────────────────────
    // 45. DONATIONS
    // ────────────────────────────────────────────────
    await ins("donations", { donorName: "Marcus Johnson", donorEmail: "marcus@email.com", amount: 50, platform: "Cash App", message: "Keep making fire music! 🔥", isShoutout: true });
    await ins("donations", { donorName: "Anonymous", amount: 100, platform: "PayPal", isAnonymous: true });
    await ins("donations", { donorName: "Tyler B", amount: 25, platform: "Venmo", message: "For the studio sessions!", isShoutout: true });

    // ────────────────────────────────────────────────
    // 46. LIVE STREAMS
    // ────────────────────────────────────────────────
    await ins("liveStreams", { title: "Beat Battle: Phantom vs. Sage", description: "Live producer battle — who makes the best beat in 30 minutes?", scheduledAt: "2026-06-05T00:00:00Z", platforms: "YouTube, Twitch", status: "scheduled", notes: "Need OBS setup and 2 camera angles." });
    await ins("liveStreams", { title: "Golden Hour Listening Party (Replay)", description: "Full album listening party with live commentary from Montrell.", scheduledAt: "2026-03-01T00:00:00Z", platforms: "YouTube", status: "completed", peakViewers: 1250 });

    // ────────────────────────────────────────────────
    // 47. CLIP QUEUE
    // ────────────────────────────────────────────────
    await ins("clipQueue", { sourceTitle: "Podcast Ep. 24 — The Business of Music", startTime: "18:30", endTime: "19:45", clipTitle: "\"I invested my last $5,000 into Golden Hour\"", description: "Powerful quote about betting on yourself", priority: "high", status: "ready" });
    await ins("clipQueue", { sourceTitle: "Podcast Ep. 23 — DJ Phantom's Journey", startTime: "35:00", endTime: "36:30", clipTitle: "How Phantom got his Grammy nomination", description: "The story behind the nomination", priority: "medium", status: "editing" });
    await ins("clipQueue", { sourceTitle: "Studio Session BTS", startTime: "05:00", endTime: "05:30", clipTitle: "Rico Blaze freestyle in the booth", description: "Raw freestyle moment — perfect for TikTok", priority: "urgent", status: "queued" });

    // ────────────────────────────────────────────────
    // 48. AUDIENCE SNAPSHOTS
    // ────────────────────────────────────────────────
    await ins("audienceSnapshots", { date: "2026-05-01", totalVisitors: 12500, uniqueVisitors: 8900, topPage: "/music", topReferrer: "Instagram", subscriberCount: 12, communityPosts: 5, donationTotal: 175 });
    await ins("audienceSnapshots", { date: "2026-04-01", totalVisitors: 9800, uniqueVisitors: 6700, topPage: "/", topReferrer: "Google", subscriberCount: 10, communityPosts: 3, donationTotal: 100 });

    // ────────────────────────────────────────────────
    // 49. WORKFLOWS (Automations)
    // ────────────────────────────────────────────────
    await ins("workflows", { name: "New Subscriber Welcome", trigger: "New subscriber added", action: "Send welcome email with latest single link", isActive: true, triggerCount: 12, lastTriggered: "2026-05-03" });
    await ins("workflows", { name: "Low Stock Alert", trigger: "Merch stock below 10", action: "Notify operations team via email", isActive: true, triggerCount: 3, lastTriggered: "2026-04-28" });
    await ins("workflows", { name: "Release Day Social", trigger: "Release date reached", action: "Auto-post to Instagram, Twitter, TikTok", isActive: true, triggerCount: 2 });

    // ────────────────────────────────────────────────
    // 50. CONTACTS
    // ────────────────────────────────────────────────
    await ins("contacts", { name: "Cole Bennett", email: "cole@lyricallemonade.com", role: "director", organization: "Lyrical Lemonade", notes: "Music video director. Shot Rise Up video. Discussing next project.", tags: "video, director, lyrical lemonade" });
    await ins("contacts", { name: "Abe Batshon", email: "abe@beatstars.com", phone: "(305) 555-0100", role: "partner", organization: "BeatStars", notes: "CEO of BeatStars. Current sponsor. Great relationship.", tags: "sponsor, beatstars, ceo" });
    await ins("contacts", { name: "DJ Akademiks", email: "booking@akademiks.com", role: "media", organization: "Off The Record", notes: "Pitched for album feature/interview. Large platform for hip-hop.", tags: "media, hip-hop, press" });
    await ins("contacts", { name: "Lisa at Complex", email: "lisa@complex.com", role: "media", organization: "Complex", notes: "Music editor. Interested in Rico Blaze story.", tags: "press, complex, media" });
    await ins("contacts", { name: "Jordan (Live Nation)", email: "jordan@livenation.com", phone: "(312) 555-0300", role: "vendor", organization: "Live Nation", notes: "Booking agent for Chicago venues. Discussing fall tour.", tags: "tour, booking, live nation" });

    // ────────────────────────────────────────────────
    // 51. STORIES (Newsroom)
    // ────────────────────────────────────────────────
    await ins("stories", { title: "Rico Blaze Feature — Complex", description: "Complex wants to do a feature on Rico Blaze's signing and journey. Need to coordinate interview and photo shoot.", status: "in-progress", priority: "high", source: "Complex / Lisa", assignedTo: "LexiLux", dueDate: "2026-05-15", tags: "press, rico blaze, complex" });
    await ins("stories", { title: "Block Report Release Coverage", description: "Coordinate press coverage for Block Report single release. Pitch to hip-hop blogs and playlists.", status: "active", priority: "urgent", source: "Internal", assignedTo: "Montrell", dueDate: "2026-05-10", tags: "press, block report, release" });
    await ins("stories", { title: "Studio Renovation Photo Story", description: "Document the studio renovation for social media content series.", status: "completed", priority: "medium", source: "Internal", assignedTo: "Art Director", tags: "studio, renovation, bts" });

    // ────────────────────────────────────────────────
    // 52. PROMO CODES
    // ────────────────────────────────────────────────
    await ins("promoCodes", { code: "3RDGATE20", type: "discount", discountPercent: 20, expiresAt: "2026-06-30", isActive: true, totalUses: 34, totalRevenue: 2890 });
    await ins("promoCodes", { code: "BLOCKPARTY", type: "discount", discountPercent: 15, expiresAt: "2026-05-15", isActive: true, totalUses: 12, totalRevenue: 780 });
    await ins("promoCodes", { code: "BEATSTARS10", type: "affiliate", discountPercent: 10, partner: "BeatStars", commissionPercent: 5, isActive: true, totalUses: 8, totalRevenue: 520, totalCommission: 26 });

    // ────────────────────────────────────────────────
    // 53. COMPETITORS (Phase 4)
    // ────────────────────────────────────────────────
    await ins("competitors", { name: "Internet Money Records", platform: "YouTube", profileUrl: "https://youtube.com/@internetmoney", subscribers: 5200000, avgViews: 450000, uploadFrequency: "2x/week", contentThemes: ["beats", "behind the scenes", "music videos"], notes: "Major competitor in producer/label space. Study their content strategy." });
    await ins("competitors", { name: "Dreamville Records", platform: "YouTube", profileUrl: "https://youtube.com/@dreamville", subscribers: 3800000, avgViews: 1200000, uploadFrequency: "1x/week", contentThemes: ["music videos", "documentary", "cyphers"], notes: "Aspirational comp. J. Cole's label. High production value." });
    await ins("competitors", { name: "Griselda Records", platform: "Instagram", profileUrl: "https://instagram.com/griseldarecords", subscribers: 890000, avgViews: 25000, uploadFrequency: "daily", contentThemes: ["fashion", "music", "street culture"], notes: "Independent label success story. Study merch/branding approach." });

    // ────────────────────────────────────────────────
    // 54. CONTACT SCORES (Phase 4)
    // ────────────────────────────────────────────────
    await ins("contactScores", { contactName: "BeatStars (Abe)", relationshipScore: 92, interactionCount: 24, revenueGenerated: 15000, tags: ["sponsor", "active", "high-value"], healthStatus: "healthy", lastInteraction: "2026-05-01", suggestedAction: "Send Q3 renewal proposal", updatedAt: now });
    await ins("contactScores", { contactName: "Cole Bennett", relationshipScore: 78, interactionCount: 8, revenueGenerated: 0, tags: ["creative", "director", "video"], healthStatus: "healthy", lastInteraction: "2026-04-20", suggestedAction: "Pitch Street Scriptures video", updatedAt: now });
    await ins("contactScores", { contactName: "Audio-Technica", relationshipScore: 45, interactionCount: 3, tags: ["sponsor", "prospect"], healthStatus: "at-risk", lastInteraction: "2026-04-10", suggestedAction: "Follow up on proposal — no response in 3 weeks", updatedAt: now });
    await ins("contactScores", { contactName: "DJ Akademiks", relationshipScore: 30, interactionCount: 1, tags: ["media", "prospect"], healthStatus: "cold", lastInteraction: "2026-03-15", suggestedAction: "Re-pitch with Block Report numbers after release", updatedAt: now });

    // ────────────────────────────────────────────────
    // 55. LIVE SESSIONS (Content Lib)
    // ────────────────────────────────────────────────
    await ins("liveSessions", { title: "3rd Gate Friday Night Live", description: "Weekly live session featuring performances, freestyle, and fan interaction.", scheduledAt: "2026-05-09T01:00:00Z", platform: "YouTube", isLive: false, isCompleted: false, guestName: "Rico Blaze", guestTitle: "Featured Artist" });

    // ────────────────────────────────────────────────
    // 56. FAN SUBMISSIONS
    // ────────────────────────────────────────────────
    await ins("fanSubmissions", { name: "DeAndre W", email: "deandre@email.com", type: "testimonial", message: "3rd Gate changed my life. Montrell's music got me through the hardest year of my life. Forever grateful. 🙏", isApproved: true, isFeatured: true, createdAt: "2026-04-10T15:00:00Z" });
    await ins("fanSubmissions", { name: "Nicole P", type: "fan-art", message: "I drew Montrell from the Golden Hour album cover! Would love for the team to see it. 🎨", isApproved: true, createdAt: "2026-04-22T10:00:00Z" });
    await ins("fanSubmissions", { name: "Jordan K", type: "question", message: "How do I audition for the label? I'm a singer from Atlanta.", isApproved: false, createdAt: "2026-05-02T14:30:00Z" });

    // ────────────────────────────────────────────────
    // 57. NOTIFICATIONS
    // ────────────────────────────────────────────────
    await ins("notifications", { type: "release", title: "Block Report goes live in 6 days", message: "Final checklist: artwork ✅, master ✅, distributor ✅, playlist pitching ⏳", isRead: false, relatedTab: "mp-releases", metadata: JSON.stringify({ artist: "Montrell", project: "Block Report", releaseDate: "2026-05-10", distributor: "DistroKid", status: "Pre-release" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "order", title: "New merch order: $100", message: "Aisha Thompson ordered 2x Tour Tee + 1x Snapback", isRead: false, relatedTab: "merch-fulfillment", metadata: JSON.stringify({ customer: "Aisha Thompson", email: "aisha@email.com", items: "2x Tour Tee ($35 ea), 1x Snapback ($30)", total: "$100", shippingAddress: "Dallas, TX 75201", orderDate: "2026-05-04" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "subscriber", title: "New subscriber from Instagram", message: "mia.g@email.com subscribed via Instagram link", isRead: false, relatedTab: "subscribers", metadata: JSON.stringify({ email: "mia.g@email.com", source: "Instagram Bio Link", subscribedAt: "2026-05-04 10:32 AM" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "booking", title: "New booking request: Summer Block Party", message: "Event promoter DJ Mike wants to book Montrell for June 21st in Dallas", isRead: false, relatedTab: "bookings", metadata: JSON.stringify({ contact: "DJ Mike", email: "djmike@events.com", event: "Summer Block Party", date: "2026-06-21", venue: "Deep Ellum Outdoor Stage", budget: "$5,000", attendees: "500+" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "fan-submission", title: "New fan Q&A submission", message: "Tyler B asks: 'How can I submit beats to the label?'", isRead: false, relatedTab: "fan-qa", metadata: JSON.stringify({ fan: "Tyler B", question: "How can I submit beats to the label?", submittedAt: "2026-05-03 2:15 PM", category: "business" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "music", title: "New music purchase: Street Prophets EP", message: "marcus.j@email.com purchased the full EP for $7.99", isRead: false, relatedTab: "mp-store", metadata: JSON.stringify({ customer: "marcus.j@email.com", item: "Street Prophets EP", amount: "$7.99", format: "Digital Download" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "community", title: "New community post needs review", message: "DeAndre W posted in the community wall — awaiting moderation", isRead: false, relatedTab: "community", metadata: JSON.stringify({ author: "DeAndre W", preview: "Just heard the new single on repeat! The production on this track is insane...", postedAt: "2026-05-04 9:45 AM" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "content", title: "Podcast episode ready for review", message: "Episode 'The Block Report' has been uploaded and needs show notes", isRead: false, relatedTab: "podcast-rss", metadata: JSON.stringify({ episode: "The Block Report", duration: "45:22", recordedAt: "2026-05-02", needsShowNotes: true, needsTranscript: true }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "sponsor", title: "Sponsor payment received: $2,500", message: "BeatStars quarterly sponsorship payment cleared", isRead: true, relatedTab: "sponsors", metadata: JSON.stringify({ sponsor: "BeatStars", amount: "$2,500", period: "Q2 2026", paymentMethod: "Wire Transfer" }), createdAt: new Date().toISOString() });
    await ins("notifications", { type: "system", title: "Weekly analytics report ready", message: "Site traffic up 23% this week. 1,247 unique visitors.", isRead: true, relatedTab: "analytics", metadata: JSON.stringify({ visitors: 1247, pageViews: 3891, topPage: "/music", bounceRate: "32%", avgSession: "4m 12s", growth: "+23%" }), createdAt: new Date().toISOString() });

    // ────────────────────────────────────────────────
    // 58–74. MUSIC PRODUCTION ADVANCED (17 tables)
    // ────────────────────────────────────────────────

    // 58. Audio Files
    await ins("audioFiles", { title: "Block Report - Final Master", fileName: "block-report-master-v3.wav", format: "wav", category: "master", artist: "Montrell", project: "Block Report", duration: "3:42", bpm: 140, key: "Gm", tags: "drill,dark,bass-heavy", fileSize: "42.3 MB" });
    await ins("audioFiles", { title: "Golden Hour - Vocal Stem", fileName: "golden-hour-vox.wav", format: "wav", category: "vocal", artist: "Montrell", project: "Golden Hour", duration: "4:05", bpm: 95, key: "Dm", tags: "melodic,r&b,vocal" });
    await ins("audioFiles", { title: "Street Prophets - Beat", fileName: "street-prophets-beat.mp3", format: "mp3", category: "beat", artist: "Rico Blaze", project: "Street Prophets EP", duration: "3:18", bpm: 130, key: "Am", tags: "trap,808,hard" });
    await ins("audioFiles", { title: "Summer Vibes Instrumental", fileName: "summer-vibes-inst.flac", format: "flac", category: "instrumental", duration: "3:55", bpm: 110, key: "C", tags: "chill,summer,guitar" });
    await ins("audioFiles", { title: "808 Bass Pack - Custom", fileName: "808-bass-pack.wav", format: "wav", category: "sample", tags: "808,bass,drums,custom" });

    // 59. AI Artwork
    await ins("aiArtwork", { title: "Block Report Cover", prompt: "Dark Fort Worth alley with neon graffiti walls, hooded figure walking under streetlight, cinematic fog, red and gold color scheme", style: "cinematic", artworkType: "album-cover", status: "completed", artist: "Montrell", project: "Block Report" });
    await ins("aiArtwork", { title: "Golden Hour Single Art", prompt: "Golden sunset over Texas skyline, silhouette of artist with mic, lens flare, warm tones", style: "photorealistic", artworkType: "single-cover", status: "completed", artist: "Montrell", project: "Golden Hour" });
    await ins("aiArtwork", { title: "3GMG Social Banner", prompt: "3rd Gate Music Group graffiti logo on brick wall, urban setting, spotlight, gold paint drips", style: "graffiti", artworkType: "banner", status: "saved", isFavorite: true });
    await ins("aiArtwork", { title: "Street Prophets Poster", prompt: "City corner at midnight, smoke, boombox, retro VHS aesthetic, purple and orange", style: "retro", artworkType: "poster", status: "generating", artist: "Rico Blaze" });

    // 60. Lyrics
    await ins("lyrics", { title: "Block Report - Verse 1", content: "[Verse 1]\nFrom the block where the sirens sing\nEvery corner got a story, every chain got a ring\nMama prayed for me, said boy you gon' be king\nNow I'm writing history with every bar I bring\n\nPulled up from the bottom, no silver spoon\nJust a pen and a dream under a Texas moon\nThey said I'd never make it, look at me now\nFrom the mud to the stage, take a bow", status: "final", artist: "Montrell", project: "Block Report", mood: "dark", wordCount: 73, collaborators: "Montrell, Jay Script" });
    await ins("lyrics", { title: "Golden Hour Hook", content: "[Hook]\nIn the golden hour, everything shines\nEvery word I speak is by design\nRise up from the shadows, now it's my time\nGolden hour, golden hour, the world is mine\n\n[Post-Hook]\nGold on my neck, gold in my veins\nTurned all my losses into gains", status: "recorded", artist: "Montrell", project: "Golden Hour", mood: "uplifting", wordCount: 49 });
    await ins("lyrics", { title: "New Track - Working Draft", content: "[Verse 1]\nLate nights in the studio, building something real\nEvery beat I touch, they know the deal\n\n[Ideas]\n- Reference Fort Worth roots\n- Talk about the grind from 2019-2024\n- Shoutout the team", status: "draft", artist: "Montrell", mood: "hype", wordCount: 32, notes: "Need to finish verse 2 and bridge" });

    // 61. Sample Clearances
    await ins("sampleClearances", { sampleTitle: "Kanye Vocal Chop", originalArtist: "Kanye West", originalSong: "Runaway", usedIn: "Block Report", sampleType: "direct-sample", status: "approved", publisherLabel: "Def Jam / GOOD Music", licenseFee: 5000, royaltyPercent: 15, usedByArtist: "Montrell" });
    await ins("sampleClearances", { sampleTitle: "Memphis Bass Pattern", originalArtist: "Three 6 Mafia", originalSong: "Stay Fly", usedIn: "Street Prophets", sampleType: "interpolation", status: "pending", publisherLabel: "Sony Music", contactName: "Legal Dept", usedByArtist: "Rico Blaze" });
    await ins("sampleClearances", { sampleTitle: "Jazz Piano Loop", originalArtist: "Herbie Hancock", originalSong: "Cantaloupe Island", usedIn: "Golden Hour", sampleType: "replay", status: "negotiating", publisherLabel: "Blue Note Records", licenseFee: 3000, usedByArtist: "Montrell" });

    // 62. Stems Vault
    await ins("stemsVault", { projectName: "Block Report", trackTitle: "Block Report", artist: "Montrell", versionLabel: "v3-master", versionNumber: 3, stemType: "master", format: "wav", bitDepth: "24", sampleRate: "48000", isLatest: true });
    await ins("stemsVault", { projectName: "Block Report", trackTitle: "Block Report", artist: "Montrell", versionLabel: "v2-mix", versionNumber: 2, stemType: "full-mix", format: "wav", bitDepth: "24", sampleRate: "48000", isLatest: false });
    await ins("stemsVault", { projectName: "Block Report", trackTitle: "Block Report - Vocals", artist: "Montrell", versionLabel: "v1-raw", versionNumber: 1, stemType: "vocals", format: "wav", bitDepth: "24", sampleRate: "48000", isLatest: true });
    await ins("stemsVault", { projectName: "Golden Hour", trackTitle: "Golden Hour", artist: "Montrell", versionLabel: "v2-master", versionNumber: 2, stemType: "master", format: "flac", bitDepth: "24", sampleRate: "96000", isLatest: true });
    await ins("stemsVault", { projectName: "Golden Hour", trackTitle: "Golden Hour - Drums", artist: "Montrell", versionLabel: "v1", versionNumber: 1, stemType: "drums", format: "wav", bitDepth: "24", sampleRate: "48000", isLatest: true });

    // 63. Mastering QC
    await ins("masteringQC", { trackTitle: "Block Report", project: "Block Report", artist: "Montrell", engineer: "Mike Dean", lufsIntegrated: -14, truePeak: -1, dynamicRange: 8, formatCheck: true, metadataCheck: true, clippingCheck: true, phaseCheck: true, status: "passed", referenceTrack: "Metro Boomin - Creepin'" });
    await ins("masteringQC", { trackTitle: "Golden Hour", project: "Golden Hour", artist: "Montrell", engineer: "Alex Tumay", lufsIntegrated: -12, truePeak: -0.5, status: "in-review", formatCheck: true, metadataCheck: false, clippingCheck: true, phaseCheck: false, notes: "Needs metadata cleanup before distribution" });
    await ins("masteringQC", { trackTitle: "Street Prophets Intro", project: "Street Prophets EP", artist: "Rico Blaze", status: "pending", formatCheck: false, metadataCheck: false, clippingCheck: false, phaseCheck: false });

    // 64. Distributions
    await ins("distributions", { releaseTitle: "Block Report", artist: "Montrell", distributor: "DistroKid", platforms: "Spotify,Apple Music,Tidal,Amazon,YouTube Music", status: "live", upc: "198765432109", isrc: "USRC12345678", releaseDate: "2026-05-10", submittedDate: "2026-04-25", spotifyUrl: "https://open.spotify.com/track/example" });
    await ins("distributions", { releaseTitle: "Golden Hour", artist: "Montrell", distributor: "DistroKid", platforms: "Spotify,Apple Music,Tidal", status: "processing", isrc: "USRC12345679", releaseDate: "2026-06-15", submittedDate: "2026-05-01" });
    await ins("distributions", { releaseTitle: "Street Prophets EP", artist: "Rico Blaze", distributor: "TuneCore", platforms: "Spotify,Apple Music,Amazon", status: "draft", releaseDate: "2026-07-01" });

    // 65. Royalty Entries
    await ins("royaltyEntries", { trackTitle: "Block Report", artist: "Montrell", platform: "Spotify", streams: 2450000, ratePerStream: 0.004, grossRevenue: 9800, splitPercent: 80, netRevenue: 7840, period: "2026-Q1", advanceBalance: 10000, recouped: false });
    await ins("royaltyEntries", { trackTitle: "Block Report", artist: "Montrell", platform: "Apple Music", streams: 890000, ratePerStream: 0.008, grossRevenue: 7120, splitPercent: 80, netRevenue: 5696, period: "2026-Q1" });
    await ins("royaltyEntries", { trackTitle: "Golden Hour", artist: "Montrell", platform: "Spotify", streams: 1200000, ratePerStream: 0.004, grossRevenue: 4800, splitPercent: 85, netRevenue: 4080, period: "2026-Q1" });
    await ins("royaltyEntries", { trackTitle: "Street Prophets", artist: "Rico Blaze", platform: "Spotify", streams: 340000, ratePerStream: 0.004, grossRevenue: 1360, splitPercent: 70, netRevenue: 952, period: "2026-Q1" });

    // 66. Sync Licenses
    await ins("syncLicenses", { trackTitle: "Block Report", artist: "Montrell", licensee: "HBO", mediaType: "tv", showTitle: "Euphoria", usageType: "background", status: "active", fee: 15000, territory: "Worldwide", term: "2 years", contactName: "Sarah Chen", contactEmail: "sarah@hbomusic.com" });
    await ins("syncLicenses", { trackTitle: "Golden Hour", artist: "Montrell", licensee: "Nike", mediaType: "commercial", usageType: "featured", status: "negotiating", fee: 25000, territory: "North America", contactName: "Marcus T", contactEmail: "marcus@nikeagency.com" });
    await ins("syncLicenses", { trackTitle: "Night Shift", artist: "Montrell", licensee: "2K Games", mediaType: "video-game", showTitle: "NBA 2K27", usageType: "background", status: "inquiry", notes: "Initial outreach from 2K music supervisor" });

    // 67. Playlist Pitches
    await ins("playlistPitches", { trackTitle: "Block Report", artist: "Montrell", playlistName: "RapCaviar", platform: "Spotify", curatorName: "Spotify Editorial", playlistFollowers: 14800000, pitchDate: "2026-04-20", status: "under-review" });
    await ins("playlistPitches", { trackTitle: "Block Report", artist: "Montrell", playlistName: "New Music Friday", platform: "Apple Music", pitchDate: "2026-04-22", status: "accepted", addedDate: "2026-05-02" });
    await ins("playlistPitches", { trackTitle: "Golden Hour", artist: "Montrell", playlistName: "Chill Vibes", platform: "Spotify", curatorName: "DJ Smooth", curatorEmail: "djsmooth@playlists.com", playlistFollowers: 450000, pitchDate: "2026-04-28", status: "pitched" });
    await ins("playlistPitches", { trackTitle: "Street Prophets", artist: "Rico Blaze", playlistName: "Underground Heat", platform: "Spotify", playlistFollowers: 89000, pitchDate: "2026-05-01", status: "drafted" });

    // 68. Music Videos
    await ins("musicVideos", { trackTitle: "Block Report", artist: "Montrell", director: "Cole Bennett", concept: "Nighttime performance in abandoned warehouse. Graffiti walls, neon lights, smoke. Intercut with rooftop shots overlooking Fort Worth skyline.", location: "Fort Worth, TX - Deep Ellum warehouse", shootDate: "2026-05-15", budget: 15000, spent: 5000, status: "pre-production" });
    await ins("musicVideos", { trackTitle: "Golden Hour", artist: "Montrell", director: "Lyrical Lemonade", concept: "Golden hour shots across Texas landscapes. Artist performing in wheat field, then transitioning to studio performance.", location: "Austin, TX", budget: 25000, status: "concept" });
    await ins("musicVideos", { trackTitle: "Street Prophets Intro", artist: "Rico Blaze", status: "published", videoUrl: "https://youtube.com/watch?v=example", budget: 5000, spent: 4800, director: "In-House" });

    // 69. Rollout Steps
    await ins("rolloutSteps", { releaseTitle: "Block Report", artist: "Montrell", stepName: "Pre-save link goes live", stepType: "pre-save", startDate: "2026-04-28", status: "completed", sortOrder: 1 });
    await ins("rolloutSteps", { releaseTitle: "Block Report", artist: "Montrell", stepName: "Snippet on Instagram Reels", stepType: "social-push", startDate: "2026-05-01", status: "completed", sortOrder: 2 });
    await ins("rolloutSteps", { releaseTitle: "Block Report", artist: "Montrell", stepName: "Pitch to RapCaviar + NMF", stepType: "playlist-pitch", startDate: "2026-05-03", status: "in-progress", sortOrder: 3, assignee: "Management" });
    await ins("rolloutSteps", { releaseTitle: "Block Report", artist: "Montrell", stepName: "Official music video premiere", stepType: "video", startDate: "2026-05-15", status: "upcoming", sortOrder: 4 });
    await ins("rolloutSteps", { releaseTitle: "Block Report", artist: "Montrell", stepName: "Radio promo push", stepType: "radio", startDate: "2026-05-17", status: "upcoming", sortOrder: 5 });
    await ins("rolloutSteps", { releaseTitle: "Block Report", artist: "Montrell", stepName: "Press interviews + features", stepType: "press", startDate: "2026-05-10", status: "upcoming", sortOrder: 6, assignee: "PR Team" });

    // 70. Press Kits
    await ins("pressKits", { artistName: "Montrell", bio: "Montrell is a Fort Worth, Texas-born artist blending drill, melodic rap, and street storytelling. Rising from the underground scene, his music captures the raw energy of life in the city while pushing creative boundaries. With over 5M streams across platforms and features on HBO and Nike campaigns, Montrell is one of the most exciting voices in Southern hip-hop.", genre: "Hip-Hop / Drill / Melodic Rap", hometown: "Fort Worth, TX", achievements: "5M+ total streams across platforms\nHBO Euphoria sync placement\nHeadlined Deep Ellum Music Festival 2025\nFeatured on Apple Music's New Music Friday", contactEmail: "press@3rdgatemusicgroup.com", managerName: "3rd Gate Music Group", status: "published", pressQuotes: "\"One of the most authentic voices coming out of Texas right now.\" — Complex\n\"Block Report is a masterclass in modern drill.\" — Pitchfork" });
    await ins("pressKits", { artistName: "Rico Blaze", bio: "Rico Blaze is a 3rd Gate Music Group artist known for hard-hitting trap production and electrifying live performances. Based in Dallas, his Street Prophets EP has quickly become an underground favorite.", genre: "Trap / Hip-Hop", hometown: "Dallas, TX", status: "draft", contactEmail: "rico@3rdgatemusicgroup.com" });

    // 71. Producer Collabs
    await ins("producerCollabs", { producerName: "Jay Script", specialty: "beats", genre: "Drill / Trap", rate: "$500/beat", status: "booked", project: "Block Report", rating: 5, producerEmail: "jayscript@beats.com", notes: "Go-to producer for dark drill beats. Has done 4 tracks for Montrell." });
    await ins("producerCollabs", { producerName: "Silk The Plug", specialty: "mixing", genre: "R&B / Melodic", rate: "$300/mix", status: "available", rating: 4, producerEmail: "silktheplug@email.com", portfolio: "https://silktheplug.com" });
    await ins("producerCollabs", { producerName: "Thunder Tracks", specialty: "beats", genre: "Trap / Drill", rate: "$800/beat", status: "contacted", notes: "High-profile producer, worked with Lil Baby. Reaching out for Q3 project." });
    await ins("producerCollabs", { producerName: "Melody Queen", specialty: "vocals", genre: "R&B / Pop", rate: "$200/session", status: "in-session", project: "Golden Hour", rating: 5, producerEmail: "melodyqueen@studio.com" });

    // 72. A&R Pipeline
    await ins("arPipeline", { artistName: "Kiera Lane", submissionType: "demo", genre: "R&B / Neo-Soul", city: "Houston, TX", contactEmail: "kiera@email.com", demoUrl: "https://soundcloud.com/kieralane/demo", monthlyListeners: 8500, stage: "reviewing", scoutNotes: "Incredible vocal range. Needs production polish but raw talent is there.", priority: "high" });
    await ins("arPipeline", { artistName: "Yung Prophet", submissionType: "referral", genre: "Drill / Trap", city: "Fort Worth, TX", contactEmail: "yungprophet@email.com", monthlyListeners: 15000, stage: "meeting", scoutNotes: "Referred by Jay Script. Local buzz is real. Meeting scheduled for next week.", assignedTo: "Montrell", priority: "high" });
    await ins("arPipeline", { artistName: "Luna Nova", submissionType: "scouted", genre: "Alternative Hip-Hop", city: "Austin, TX", contactEmail: "lunanova@email.com", monthlyListeners: 45000, stage: "negotiating", scoutNotes: "Found on TikTok. 2.3M views on viral freestyle. Unique sound — could fill a gap in roster.", priority: "urgent" });
    await ins("arPipeline", { artistName: "DJ Kold", submissionType: "self-submit", genre: "DJ / Producer", city: "Arlington, TX", demoUrl: "https://soundcloud.com/djkold/mix", stage: "new", priority: "low" });

    // 73. AI Lyrics Logs
    await ins("aiLyricsLogs", { prompt: "Write about rising from Fort Worth streets to the top of the game", mood: "hype", style: "hip-hop", generatedText: "[Verse 1]\nFrom the Fort where the streets don't sleep\nEvery corner tells a story, every scar runs deep\nMama working doubles just to keep the lights on\nNow I'm writing verses that'll live when I'm gone\n\n[Hook]\nRise up, rise up, from the bottom to the peak\nEvery word I spit is gold, every flow unique\nFort Worth made me, but the world gon' know\nFrom the block to the stage, watch me steal the show", isSaved: true, artist: "Montrell" });
    await ins("aiLyricsLogs", { prompt: "A chill R&B vibe about late nights in the studio", mood: "chill", style: "r&b", generatedText: "[Verse]\nMidnight sessions, candles low\nBeat drops soft, let the melody flow\nInk on paper, thoughts unwind\nEvery note leaving the world behind\n\n[Hook]\nLate night magic in the booth\nPouring out my soul, speaking truth\nJust me and the mic, no disguise\nMaking music under city lights", isSaved: false });

    // 74. AI Mastering Logs
    await ins("aiMasteringLogs", { trackTitle: "Block Report", artist: "Montrell", inputFormat: "wav", lufsTarget: -14, status: "complete", suggestedEQ: "Low shelf +2dB @ 60Hz for sub presence, Dip -1.5dB @ 350Hz to reduce mud, High shelf +1dB @ 10kHz for air", suggestedCompression: "Ratio 4:1, Attack 5ms, Release 80ms, Threshold -16dB, Soft knee", suggestedLimiter: "Ceiling -1.0dB True Peak, Release 40ms, Lookahead 5ms", loudnessAnalysis: "Integrated: -14.2 LUFS, Short-term peak: -10.8 LUFS, LRA: 7.2 LU, True Peak: -0.9 dBTP", referenceTrack: "Metro Boomin - Creepin'" });
    await ins("aiMasteringLogs", { trackTitle: "Golden Hour", artist: "Montrell", inputFormat: "flac", lufsTarget: -13, status: "complete", suggestedEQ: "Boost +1dB @ 3kHz for vocal presence, Cut -2dB @ 200Hz, Shelf +0.5dB @ 12kHz", suggestedCompression: "Ratio 2.5:1, Attack 15ms, Release 120ms, Threshold -20dB", suggestedLimiter: "Ceiling -0.5dB True Peak, Release 60ms", loudnessAnalysis: "Integrated: -13.1 LUFS, Short-term peak: -9.5 LUFS, LRA: 9.1 LU, True Peak: -0.4 dBTP" });

    // ────────────────────────────────────────────────
    // 75–94. MUSIC PRODUCTION PHASE 3 (20 tables)
    // ────────────────────────────────────────────────

    // 75. Feature Verses
    await ins("featureVerses", { trackTitle: "Block Report Remix", artist: "Montrell", featureArtist: "Lil Durk", direction: "sent", status: "requested", fee: 10000, deadline: "2026-06-01", contactEmail: "mgmt@lildurk.com", notes: "Reached out through mutual contact. Waiting on response." });
    await ins("featureVerses", { trackTitle: "Golden Hour Deluxe", artist: "Montrell", featureArtist: "SZA", direction: "sent", status: "accepted", fee: 15000, deadline: "2026-05-20", notes: "SZA's team confirmed. Sending stems this week." });
    await ins("featureVerses", { trackTitle: "Street Prophets EP", artist: "Rico Blaze", featureArtist: "Montrell", direction: "received", status: "recording", notes: "Montrell laying down 16 bars for closing track." });
    await ins("featureVerses", { trackTitle: "Summer Anthem", artist: "Montrell", featureArtist: "Roddy Ricch", direction: "sent", status: "declined", notes: "Schedule conflict. Will revisit for next project." });

    // 76. Vocal Sessions
    await ins("vocalSessions", { trackTitle: "Block Report", artist: "Montrell", sessionDate: "2026-04-15", engineer: "Alex Tumay", studio: "3rd Gate Studio A", takesRecorded: 12, bestTake: "Take 7", vocalChain: "Neumann U87 → Neve 1073 → LA-2A → Pro Tools", micUsed: "Neumann U87", preamp: "Neve 1073", compressor: "LA-2A", rating: 5, status: "completed", notes: "Incredible session. Nailed verse 1 on take 7." });
    await ins("vocalSessions", { trackTitle: "Golden Hour Hook", artist: "Montrell", sessionDate: "2026-04-22", engineer: "Mike Dean", studio: "3rd Gate Studio A", takesRecorded: 8, bestTake: "Take 3", micUsed: "Sony C-800G", preamp: "Avalon 737", rating: 4, status: "comped", notes: "Comp from takes 3 and 5. Smooth delivery." });
    await ins("vocalSessions", { trackTitle: "New Single TBD", artist: "Montrell", sessionDate: "2026-05-10", studio: "3rd Gate Studio B", status: "scheduled", notes: "Block 6 hours for experimental session." });

    // 77. Setlists
    await ins("setlists", { showName: "Deep Ellum Music Fest", artist: "Montrell", venue: "Deep Ellum Outdoor Stage", showDate: "2026-06-21", songs: JSON.stringify([{ title: "Block Report", bpm: 140, key: "Gm", duration: "3:42" }, { title: "Golden Hour", bpm: 95, key: "Dm", duration: "4:05" }, { title: "Street Prophets (feat. Rico Blaze)", bpm: 130, key: "Am", duration: "3:18" }, { title: "Night Shift", bpm: 120, key: "Em", duration: "3:30" }, { title: "Block Report Remix", bpm: 140, key: "Gm", duration: "4:00" }]), totalDuration: "18:35", status: "rehearsed" });
    await ins("setlists", { showName: "Festival Template - 30min Set", artist: "Montrell", songs: JSON.stringify([{ title: "Intro/Night Shift", bpm: 120, duration: "2:00" }, { title: "Block Report", bpm: 140, duration: "3:42" }, { title: "Golden Hour", bpm: 95, duration: "4:05" }, { title: "Freestyle Segment", bpm: 130, duration: "3:00" }, { title: "New Single", bpm: 110, duration: "3:30" }, { title: "Block Report Remix (Closer)", bpm: 140, duration: "4:00" }]), totalDuration: "20:17", isTemplate: true, status: "draft", notes: "Base template for 30-min festival sets. Adjust for crowd energy." });

    // 78. Tour Shows
    await ins("tourShows", { showName: "Deep Ellum Music Fest", artist: "Montrell", venue: "Deep Ellum Outdoor Stage", city: "Dallas, TX", showDate: "2026-06-21", showTime: "9:00 PM", status: "confirmed", guarantee: 5000, capacity: 500, promoter: "DJ Mike", promoterEmail: "djmike@events.com", riderNotes: "2 cases of water, towels, private dressing room, 4 guest list spots", travelNotes: "Local show — 30 min drive from studio" });
    await ins("tourShows", { showName: "SXSW Showcase", artist: "Montrell", venue: "Mohawk", city: "Austin, TX", showDate: "2026-03-14", showTime: "11:00 PM", status: "completed", guarantee: 2000, merch_revenue: 1800, expenses: 600, ticketsSold: 350, capacity: 400, promoter: "Austin Live", settlementStatus: "paid" });
    await ins("tourShows", { showName: "Houston Hip-Hop Fest", artist: "Montrell", venue: "House of Blues", city: "Houston, TX", showDate: "2026-07-12", status: "pending", guarantee: 3500, capacity: 800, promoter: "H-Town Events", notes: "Awaiting contract. Negotiating merch split." });
    await ins("tourShows", { showName: "Rico Blaze - Local Opener", artist: "Rico Blaze", venue: "Trees", city: "Dallas, TX", showDate: "2026-05-28", status: "confirmed", guarantee: 500, capacity: 200, notes: "Opening for regional headliner. Good exposure." });

    // 79. Music Rights
    await ins("musicRights", { title: "Block Report", artist: "Montrell", rightType: "publishing", pro: "BMI", ipiNumber: "00123456789", publisherName: "3rd Gate Publishing", splitPercent: 100, registrationDate: "2026-04-01", registrationId: "BMI-2026-BR001", status: "registered", territory: "Worldwide" });
    await ins("musicRights", { title: "Block Report", artist: "Montrell", rightType: "master", status: "registered", notes: "100% owned by 3rd Gate Music Group", territory: "Worldwide" });
    await ins("musicRights", { title: "Golden Hour", artist: "Montrell", rightType: "publishing", pro: "BMI", splitPercent: 80, publisherName: "3rd Gate Publishing", status: "registered", notes: "20% to co-writer Jay Script" });
    await ins("musicRights", { title: "Street Prophets", artist: "Rico Blaze", rightType: "copyright", status: "pending", notes: "Need to file copyright registration" });

    // 80. Mood Boards
    await ins("moodBoards", { title: "Block Report Visual Identity", project: "Block Report", artist: "Montrell", boardType: "album", description: "Dark, gritty Fort Worth aesthetic. Neon accents against brick and concrete. Night photography. Graffiti textures.", colorPalette: JSON.stringify(["#1a1a2e", "#e94560", "#f5a623", "#16213e", "#0f3460"]), fonts: "Bebas Neue, Oswald, Impact", referenceNotes: "Think Travis Scott Astroworld meets early Kanye Graduation era. Urban decay meets luxury.", status: "approved" });
    await ins("moodBoards", { title: "Golden Hour Campaign", project: "Golden Hour", boardType: "single", description: "Warm golden tones, sunset photography, open landscapes, intimate close-ups", colorPalette: JSON.stringify(["#f5a623", "#f7dc6f", "#e67e22", "#2c3e50", "#ecf0f1"]), fonts: "Playfair Display, Lato", status: "in-progress" });
    await ins("moodBoards", { title: "3GMG Brand Refresh", boardType: "brand", description: "Modern, clean, premium. Black and gold with graffiti accents. Professional but street-authentic.", colorPalette: JSON.stringify(["#000000", "#f5a623", "#ffffff", "#1a1a1a", "#333333"]), status: "brainstorming" });

    // 81. Vocal Health
    await ins("vocalHealth", { artist: "Montrell", date: "2026-05-04", entryType: "session", sessionDuration: 180, vocalCondition: "excellent", hydrationLevel: "good", warmUpDone: true, warmUpRoutine: "Lip trills, scales, humming (15 min)", notes: "Great session. Voice felt strong throughout." });
    await ins("vocalHealth", { artist: "Montrell", date: "2026-05-03", entryType: "rest-day", vocalCondition: "good", hydrationLevel: "good", notes: "Full rest day before tomorrow's session." });
    await ins("vocalHealth", { artist: "Montrell", date: "2026-05-02", entryType: "session", sessionDuration: 240, vocalCondition: "strained", hydrationLevel: "moderate", warmUpDone: false, notes: "Pushed too hard. Need to take tomorrow off. Skipped warm-up — don't do that again." });
    await ins("vocalHealth", { artist: "Montrell", date: "2026-05-01", entryType: "warm-up", warmUpDone: true, warmUpRoutine: "Steam inhale, lip trills, gentle scales, 20 min total", vocalCondition: "good" });

    // 82. Sound Kits
    await ins("soundKits", { title: "3rd Gate Drill Pack Vol. 1", producer: "Jay Script", kitType: "drum-kit", genre: "Drill / Trap", soundCount: 120, price: 29.99, downloads: 450, revenue: 13496, description: "Hard-hitting drill drums. 808s, percs, hi-hats, and kicks designed for dark production.", tags: "drill,808,dark,trap", status: "published" });
    await ins("soundKits", { title: "Golden Hour Loop Pack", producer: "Silk The Plug", kitType: "loop-pack", genre: "R&B / Melodic", soundCount: 40, price: 19.99, downloads: 210, revenue: 4198, description: "Smooth melodic loops perfect for R&B and soul production.", tags: "r&b,loops,melodic,smooth", status: "published" });
    await ins("soundKits", { title: "Fort Worth Bass Pack", producer: "Jay Script", kitType: "one-shots", genre: "Trap", soundCount: 60, price: 14.99, status: "draft", description: "Custom 808 sub bass collection. Saturated, distorted, and clean variants." });

    // 83. Beat Leases
    await ins("beatLeases", { beatTitle: "Midnight Run", producer: "Jay Script", buyer: "Indie Artist A", buyerEmail: "indie@email.com", leaseType: "wav", price: 100, status: "sold", licensePeriod: "1 year", streamLimit: 500000, purchaseDate: "2026-04-10" });
    await ins("beatLeases", { beatTitle: "Midnight Run", producer: "Jay Script", leaseType: "exclusive", price: 3000, status: "available", notes: "WAV lease sold, exclusive still available" });
    await ins("beatLeases", { beatTitle: "Dark Streets", producer: "Jay Script", buyer: "Up-and-Comer B", leaseType: "mp3", price: 30, status: "sold", licensePeriod: "1 year", streamLimit: 100000, purchaseDate: "2026-03-28" });
    await ins("beatLeases", { beatTitle: "Summer Glow", producer: "Silk The Plug", leaseType: "trackout", price: 200, status: "negotiating", notes: "Artist wants custom changes to melody. Discussing price." });

    // 84. Gear Inventory
    await ins("gearInventory", { name: "Neumann U87", category: "mic", manufacturer: "Neumann", serialNumber: "U87-2024-3456", purchaseDate: "2024-06-15", purchasePrice: 3200, warrantyExpiry: "2026-06-15", condition: "excellent", location: "Studio A", notes: "Primary vocal mic" });
    await ins("gearInventory", { name: "Neve 1073 Preamp", category: "preamp", manufacturer: "Neve", serialNumber: "NEVE-1073-8901", purchaseDate: "2024-09-01", purchasePrice: 2800, condition: "excellent", location: "Studio A" });
    await ins("gearInventory", { name: "FL Studio 24 Producer", category: "daw", manufacturer: "Image-Line", licenseKey: "FL24-XXXX-XXXX-XXXX", purchaseDate: "2025-01-10", purchasePrice: 199, condition: "new", notes: "Lifetime free updates" });
    await ins("gearInventory", { name: "Yamaha HS8 (Pair)", category: "monitors", manufacturer: "Yamaha", purchaseDate: "2024-03-20", purchasePrice: 700, condition: "good", location: "Studio B" });
    await ins("gearInventory", { name: "FabFilter Pro-Q 3", category: "plugin", manufacturer: "FabFilter", licenseKey: "FBF-PQ3-XXXX", purchaseDate: "2025-02-14", purchasePrice: 179, condition: "new", notes: "Go-to EQ plugin for mixing" });
    await ins("gearInventory", { name: "Apollo Twin X", category: "interface", manufacturer: "Universal Audio", serialNumber: "UAD-ATX-7654", purchaseDate: "2024-11-01", purchasePrice: 1099, warrantyExpiry: "2026-11-01", condition: "excellent", location: "Studio A" });

    // 85. Production Templates
    await ins("productionTemplates", { title: "Drill Session Starter", producer: "Jay Script", daw: "FL Studio", templateType: "session", genre: "Drill", bpmRange: "130-145", description: "Pre-routed drill template with 808 bus, percussion rack, and vocal chain ready to go.", plugins: JSON.stringify(["Serum", "FabFilter Pro-Q 3", "CamelCrusher", "Valhalla VintageVerb"]), trackCount: 24, isShared: true, tags: "drill,trap,dark" });
    await ins("productionTemplates", { title: "Vocal Recording Chain", producer: "Alex Tumay", daw: "Pro Tools", templateType: "vocal-chain", genre: "Hip-Hop", description: "Standard vocal recording chain: U87 → 1073 → LA-2A → Pro Tools with de-esser, EQ, and light compression on input.", plugins: JSON.stringify(["Waves CLA-2A", "FabFilter Pro-DS", "Sonnox Oxford EQ"]), isShared: true });
    await ins("productionTemplates", { title: "R&B Mixing Template", producer: "Silk The Plug", daw: "Logic Pro", templateType: "mixing-chain", genre: "R&B / Melodic", description: "Full mix template with vocal bus, instrument buses, and master chain. Warm, polished sound.", plugins: JSON.stringify(["Waves SSL Comp", "Soundtoys Decapitator", "FabFilter Pro-L 2"]), trackCount: 48 });

    // 86. Sound Designs
    await ins("soundDesigns", { title: "808 Growl Bass", producer: "Jay Script", category: "bass", synth: "Serum", processingChain: "Serum → CamelCrusher (British Clean) → Fruity Parametric EQ (low cut @ 30Hz, boost @ 55Hz) → Soundgoodizer", description: "Deep growling 808 with harmonic saturation. Perfect for drill beats.", genre: "Drill", tags: "808,bass,growl,drill", isFavorite: true });
    await ins("soundDesigns", { title: "Atmospheric Pad", producer: "Silk The Plug", category: "pad", synth: "Omnisphere", processingChain: "Omnisphere → Valhalla Shimmer → Soundtoys MicroShift → Light compression", layering: "Layer 1: Choir patch, Layer 2: Analog pad, Layer 3: Subtle noise texture", genre: "R&B", tags: "pad,atmosphere,chill" });
    await ins("soundDesigns", { title: "Vinyl Crackle Texture", producer: "Jay Script", category: "texture", processingChain: "iZotope Vinyl → EQ (roll off above 8kHz) → Light reverb", description: "Lo-fi vinyl noise for intros and transitions", tags: "lo-fi,vinyl,texture,ambient" });

    // 87. Producer Analytics
    await ins("producerAnalytics", { producer: "Jay Script", period: "2026-Q1", totalBeats: 45, beatsSold: 18, totalRevenue: 12500, leaseRevenue: 3500, exclusiveRevenue: 9000, topGenre: "Drill", topBeat: "Midnight Run", conversionRate: 12, avgBeatPrice: 694 });
    await ins("producerAnalytics", { producer: "Silk The Plug", period: "2026-Q1", totalBeats: 30, beatsSold: 8, totalRevenue: 4800, leaseRevenue: 2800, exclusiveRevenue: 2000, topGenre: "R&B", topBeat: "Golden Hour Loop", conversionRate: 8, avgBeatPrice: 600 });

    // 88. Feedback Reviews
    await ins("feedbackReviews", { trackTitle: "Block Report - Mix v3", artist: "Montrell", project: "Block Report", submittedBy: "Jay Script", reviewers: JSON.stringify(["Montrell", "Alex Tumay"]), feedbackType: "mix-review", comments: JSON.stringify([{ timestamp: "1:32", author: "Montrell", text: "808 needs more punch here. Feels thin compared to the reference." }, { timestamp: "2:15", author: "Alex Tumay", text: "Vocal sits perfectly in this section. Great balance." }, { timestamp: "0:45", author: "Montrell", text: "Hi-hat pattern is fire. Keep this exactly as is." }]), status: "changes-requested", priority: "high", dueDate: "2026-05-08" });
    await ins("feedbackReviews", { trackTitle: "Golden Hour - Vocal Comp", artist: "Montrell", submittedBy: "Mike Dean", feedbackType: "vocal-comp", comments: JSON.stringify([{ author: "Mike Dean", text: "Take 3 verse is stronger than take 5. Use take 3 for the final." }]), status: "approved", priority: "medium" });
    await ins("feedbackReviews", { trackTitle: "New Single - Arrangement", artist: "Montrell", submittedBy: "Montrell", feedbackType: "arrangement", status: "awaiting-review", priority: "medium", dueDate: "2026-05-12", comments: JSON.stringify([]) });

    // 89. Contract Memos
    await ins("contractMemos", { title: "Block Report - Beat License", contractType: "beat-lease", parties: JSON.stringify(["3rd Gate Music Group", "Jay Script Productions"]), terms: "Exclusive beat license for 'Block Report'. Full ownership of master recording to 3GMG. Producer receives 20% publishing and 3% of master royalties.", fee: 5000, startDate: "2026-03-01", status: "signed", signedByAll: true });
    await ins("contractMemos", { title: "SZA Feature Agreement", contractType: "feature", parties: JSON.stringify(["3rd Gate Music Group", "TDE / RCA Records"]), terms: "16-bar feature verse on Golden Hour Deluxe. One-time fee, no backend royalties. Credit as 'feat. SZA' on all platforms.", fee: 15000, startDate: "2026-05-01", endDate: "2026-12-31", status: "sent" });
    await ins("contractMemos", { title: "HBO Euphoria Sync License", contractType: "sync", parties: JSON.stringify(["3rd Gate Music Group", "HBO Entertainment"]), terms: "Background use of 'Block Report' in Season 4, Episode 3. Worldwide TV and streaming rights for 2 years.", fee: 15000, startDate: "2026-06-01", endDate: "2028-06-01", status: "signed", signedByAll: true });
    await ins("contractMemos", { title: "Rico Blaze - Artist Agreement", contractType: "management", parties: JSON.stringify(["3rd Gate Music Group", "Rico Blaze"]), terms: "2-year artist development deal. 3GMG provides production, marketing, and distribution support. 70/30 split on net revenue.", startDate: "2026-01-01", endDate: "2027-12-31", status: "signed", signedByAll: true });

    // 90. Reference Tracks
    await ins("referenceTracks", { title: "Creepin'", originalArtist: "Metro Boomin ft. The Weeknd", forProject: "Block Report", forArtist: "Montrell", referenceAspect: "mix", bpm: 130, genre: "Dark Trap", notes: "Reference for low-end balance and vocal space. The 808 sits perfectly under the vocal without competing. Study the stereo width of the synths.", spotifyUrl: "https://open.spotify.com/track/2dHHgzDwk4BJdRYgS9VFMo" });
    await ins("referenceTracks", { title: "Blinding Lights", originalArtist: "The Weeknd", forProject: "Golden Hour", referenceAspect: "energy", bpm: 171, genre: "Synth-Pop", notes: "Energy reference for the hook. That driving synth energy — our version will be more hip-hop but same euphoric build." });
    await ins("referenceTracks", { title: "HUMBLE.", originalArtist: "Kendrick Lamar", forArtist: "Montrell", referenceAspect: "drums", bpm: 150, genre: "Hip-Hop", notes: "Drum reference. That punchy, dry kick pattern with minimal reverb. Our drums should hit this hard." });
    await ins("referenceTracks", { title: "No Role Modelz", originalArtist: "J. Cole", forArtist: "Montrell", referenceAspect: "vocal-tone", bpm: 100, genre: "Hip-Hop", notes: "Vocal delivery reference. Natural, conversational flow. Not too processed. Keep it raw." });

    // 91. Chord Progressions
    await ins("chordProgressions", { title: "Classic Drill Progression", key: "Gm", scale: "minor", chords: "Gm — Eb — Cm — D", genre: "Drill", bpm: 140, mood: "dark", usedIn: "Block Report", notes: "Standard minor progression. The D major at the end creates tension that resolves back to Gm.", isFavorite: true });
    await ins("chordProgressions", { title: "Golden Hour Sunset", key: "D", scale: "major", chords: "D — A — Bm — G", genre: "R&B / Pop", bpm: 95, mood: "uplifting", usedIn: "Golden Hour", notes: "Classic I-V-vi-IV. Timeless feel. Works perfectly with the warm vocal tone." });
    await ins("chordProgressions", { title: "Jazzy Bounce", key: "Fm", scale: "dorian", chords: "Fm7 — Bb7 — Ebmaj7 — Ab", genre: "Neo-Soul / Hip-Hop", bpm: 85, mood: "chill", notes: "Dorian mode gives it that jazzy feel without being too complex. Great for smooth beats." });
    await ins("chordProgressions", { title: "Trap Anthem", key: "Am", scale: "minor", chords: "Am — F — G — Em", genre: "Trap", bpm: 130, mood: "hype", isFavorite: true });

    // 92. DAW Projects
    await ins("dawProjects", { title: "Block Report - Final", artist: "Montrell", producer: "Jay Script", daw: "FL Studio", version: "v3.2-master", bpm: 140, key: "Gm", trackCount: 32, fileSize: "2.8 GB", backupStatus: "backed-up", collaborators: "Jay Script, Alex Tumay", plugins: JSON.stringify(["Serum", "FabFilter Pro-Q 3", "CamelCrusher", "Waves CLA-2A", "Valhalla VintageVerb"]), lastModified: "2026-04-28" });
    await ins("dawProjects", { title: "Golden Hour - Mix Session", artist: "Montrell", producer: "Silk The Plug", daw: "Logic Pro", version: "v2.1-mix", bpm: 95, key: "Dm", trackCount: 48, fileSize: "4.1 GB", backupStatus: "backed-up", plugins: JSON.stringify(["Omnisphere", "Kontakt", "FabFilter Pro-L 2"]), lastModified: "2026-04-25" });
    await ins("dawProjects", { title: "Street Prophets EP - Session", artist: "Rico Blaze", producer: "Jay Script", daw: "FL Studio", version: "v1.0", bpm: 130, trackCount: 28, fileSize: "1.9 GB", backupStatus: "local-only", lastModified: "2026-05-01", notes: "NEEDS CLOUD BACKUP — only on studio desktop right now" });
    await ins("dawProjects", { title: "Beat Ideas - May 2026", producer: "Jay Script", daw: "FL Studio", trackCount: 15, fileSize: "800 MB", backupStatus: "needs-backup", lastModified: "2026-05-03", notes: "Collection of 15 beat sketches. Need to sort and back up." });

    // 93. Revenue Goals
    await ins("revenueGoals", { name: "Q2 2026 Streaming Revenue", artist: "Montrell", period: "2026-Q2", targetAmount: 25000, currentAmount: 12500, category: "streaming", milestones: JSON.stringify([{ label: "Block Report 5M streams", amount: 20000, reached: false }, { label: "Golden Hour 2M streams", amount: 8000, reached: true }, { label: "Catalog 1M total", amount: 4000, reached: true }]), notes: "Block Report launch should push us past the target." });
    await ins("revenueGoals", { name: "Beat Sales - Q2", producer: "Jay Script", period: "2026-Q2", targetAmount: 15000, currentAmount: 8200, category: "beats", milestones: JSON.stringify([{ label: "10 leases sold", amount: 3000, reached: true }, { label: "2 exclusives sold", amount: 6000, reached: true }, { label: "5 exclusives sold", amount: 15000, reached: false }]) });
    await ins("revenueGoals", { name: "Live Shows Revenue - Summer", artist: "Montrell", period: "2026-Q2", targetAmount: 15000, currentAmount: 5000, category: "shows", milestones: JSON.stringify([{ label: "SXSW completed", amount: 2000, reached: true }, { label: "Deep Ellum Fest", amount: 5000, reached: false }, { label: "Houston Fest", amount: 3500, reached: false }]) });
    await ins("revenueGoals", { name: "Sync Licensing Target", artist: "Montrell", period: "2026", targetAmount: 50000, currentAmount: 15000, category: "sync", milestones: JSON.stringify([{ label: "HBO Euphoria deal", amount: 15000, reached: true }, { label: "Nike commercial", amount: 25000, reached: false }, { label: "Video game placement", amount: 10000, reached: false }]) });

    // 94. Collab Calendar
    await ins("collabCalendar", { title: "Block Report Remix Session", sessionDate: "2026-05-12", startTime: "7:00 PM", endTime: "11:00 PM", studio: "3rd Gate Studio A", participants: JSON.stringify(["Montrell", "Jay Script", "Alex Tumay"]), project: "Block Report Remix", sessionType: "recording", status: "confirmed", timezone: "America/Chicago" });
    await ins("collabCalendar", { title: "Golden Hour x SZA Recording", sessionDate: "2026-05-20", startTime: "2:00 PM", endTime: "8:00 PM", studio: "Remote / File Exchange", participants: JSON.stringify(["Montrell", "SZA", "Silk The Plug"]), project: "Golden Hour Deluxe", sessionType: "recording", status: "scheduled", timezone: "America/Chicago", notes: "SZA recording remotely. Sending stems by 5/18." });
    await ins("collabCalendar", { title: "Beat Making Session", sessionDate: "2026-05-15", startTime: "3:00 PM", endTime: "9:00 PM", studio: "3rd Gate Studio B", participants: JSON.stringify(["Jay Script", "Thunder Tracks"]), project: "Q3 Beats", sessionType: "production", status: "confirmed", timezone: "America/Chicago" });
    await ins("collabCalendar", { title: "Mixing Review - Block Report", sessionDate: "2026-05-08", startTime: "4:00 PM", endTime: "6:00 PM", studio: "3rd Gate Studio A", participants: JSON.stringify(["Alex Tumay", "Montrell"]), project: "Block Report", sessionType: "mixing", status: "scheduled" });
    await ins("collabCalendar", { title: "Songwriting Camp", sessionDate: "2026-06-01", startTime: "12:00 PM", endTime: "10:00 PM", studio: "3rd Gate Studio A + B", participants: JSON.stringify(["Montrell", "Jay Script", "Melody Queen", "Rico Blaze"]), sessionType: "writing", status: "scheduled", notes: "Full-day songwriting camp. Catering ordered. Goal: 3-4 new songs." });

    return { success: errors.length === 0, counts, errors: errors.slice(0, 20) };
  },
});
