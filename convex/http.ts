import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";
import { auth } from "./auth";

const http = httpRouter();
auth.addHttpRoutes(http);

// ─── Podcast RSS Feed (F3) ───
// Serves a valid RSS 2.0 / iTunes podcast feed at /api/podcast-rss
http.route({
  path: "/api/podcast-rss",
  method: "GET",
  handler: httpAction(async (ctx) => {
    const content = await ctx.runQuery("contentLib:listContent" as any, {});
    const episodes = (content as any[]).filter(
      (c: any) => c.category === "podcast" || c.category === "interview"
    );

    const siteUrl = "https://inquisitive-mandazi-d6afda.netlify.app";
    const feedUrl = "https://effervescent-parrot-556.convex.site/api/podcast-rss";

    const escXml = (s: string) =>
      s
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");

    const items = episodes
      .map((ep: any) => {
        const title = escXml(ep.title || "Untitled Episode");
        const desc = escXml(ep.description || "");
        const pubDate = ep.publishedAt
          ? new Date(ep.publishedAt).toUTCString()
          : new Date().toUTCString();
        const link = ep.youtubeId
          ? `https://www.youtube.com/watch?v=${ep.youtubeId}`
          : `${siteUrl}/episode/${ep._id}`;
        const thumb = ep.thumbnailUrl
          ? `<itunes:image href="${escXml(ep.thumbnailUrl)}" />`
          : "";
        const duration = ep.duration || "00:30:00";

        return `    <item>
      <title>${title}</title>
      <description>${desc}</description>
      <link>${escXml(link)}</link>
      <guid isPermaLink="false">${ep._id}</guid>
      <pubDate>${pubDate}</pubDate>
      <itunes:duration>${duration}</itunes:duration>
      ${thumb}
      <itunes:explicit>false</itunes:explicit>
    </item>`;
      })
      .join("\n");

    const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0"
  xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"
  xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Make It Make Sense Podcast</title>
    <link>${siteUrl}</link>
    <language>en-us</language>
    <description>Real talk from the streets of Fort Worth. Hosted by Meadowbrook Montrell — The Hood's Paparazzi. Interviews, stories, and unfiltered conversations.</description>
    <itunes:author>Meadowbrook Montrell</itunes:author>
    <itunes:owner>
      <itunes:name>Meadowbrook Montrell</itunes:name>
    </itunes:owner>
    <itunes:image href="${siteUrl}/og-image.png" />
    <itunes:category text="Society &amp; Culture" />
    <itunes:explicit>false</itunes:explicit>
    <atom:link href="${escXml(feedUrl)}" rel="self" type="application/rss+xml" />
${items}
  </channel>
</rss>`;

    return new Response(rss, {
      status: 200,
      headers: {
        "Content-Type": "application/rss+xml; charset=utf-8",
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }),
});

export default http;
