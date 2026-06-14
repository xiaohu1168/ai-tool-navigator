import { getAllTools } from "@/lib/tools";

function getBaseUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL || "https://heyaihub.com";
}

export async function GET() {
  const tools = await getAllTools();
  const latestTools = tools.slice(0, 20);
  const baseUrl = getBaseUrl();

  const items = latestTools
    .map((tool) => {
      const updatedDate = tool.updated ? new Date(tool.updated).toUTCString() : new Date().toUTCString();
      return `<item>
        <title>${tool.name} - AI Tool Review</title>
        <link>${baseUrl}/tools/${tool.slug}</link>
        <description>${tool.description}</description>
        <pubDate>${updatedDate}</pubDate>
        <guid>${baseUrl}/tools/${tool.slug}</guid>
      </item>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hey AI Hub</title>
    <link>${baseUrl}</link>
    <description>Discover the best AI tools for developers and creators</description>
    <atom:link href="${baseUrl}/feed.xml" rel="self" type="application/rss+xml" />
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
