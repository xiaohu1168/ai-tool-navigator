import { getAllTools } from "@/lib/tools";

export async function GET() {
  const tools = await getAllTools();
  const latestTools = tools.slice(0, 20);

  const items = latestTools
    .map(
      (tool) =>
        `<item>
        <title>${tool.name} - AI Tool Review</title>
        <link>https://heyaihub.com/tools/${tool.slug}</link>
        <description>${tool.description}</description>
        <pubDate>Mon, 08 Jun 2026 00:00:00 GMT</pubDate>
      </item>`
    )
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>Hey AI Hub</title>
    <link>https://heyaihub.com</link>
    <description>Discover the best AI tools for developers and creators</description>
    <atom:link href="https://heyaihub.com/feed.xml" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: { "Content-Type": "application/xml" },
  });
}
