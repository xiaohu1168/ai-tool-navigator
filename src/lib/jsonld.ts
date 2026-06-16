/**
 * JSON-LD structured data helper for SEO Rich Snippets.
 * Generates schema.org markup that Google can use to display
 * star ratings, breadcrumbs, and other rich results.
 */
import Script from "next/script";

interface JsonLdProps {
  data: Record<string, unknown>;
}

export function JsonLd({ data }: JsonLdProps) {
  return (
    <Script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

// ============================================================
// Organization (global)
// ============================================================
export function OrganizationJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Hey AI Hub",
    url: "https://heyaihub.com",
    description: "Discover the best AI tools for developers and creators.",
    sameAs: [
      "https://twitter.com/heyaihub",
    ],
  };
  return <JsonLd data={jsonLd} />;
}

// ============================================================
// SoftwareApplication / Product (tool detail pages)
// ============================================================
export function ToolJsonLd(tool: {
  name: string;
  description: string;
  url: string;
  rating: number;
  price: string;
  category?: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: tool.name,
    description: tool.description,
    url: tool.url,
    applicationCategory: tool.category || "AI Tool",
    operatingSystem: "Web",
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: String(tool.rating),
      bestRating: "5",
      worstRating: "1",
      ratingCount: "100",
    },
    review: {
      "@type": "Review",
      reviewBody: tool.description,
      author: {
        "@type": "Organization",
        name: "Hey AI Hub",
      },
    },
  };
  return <JsonLd data={jsonLd} />;
}

// ============================================================
// BreadcrumbList (all pages)
// ============================================================
export function BreadcrumbJsonLd(items: { name: string; url: string }[]) {
  const itemListElements = items.map((item, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: item.name,
    item: item.url,
  }));

  // Add the last item (current page) without an "item" URL
  if (items.length > 0) {
    itemListElements[itemListElements.length - 1].item = undefined;
  }

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: itemListElements.filter(e => e.item !== undefined),
  };
  return <JsonLd data={jsonLd} />;
}

// ============================================================
// Article (blog pages)
// ============================================================
export function ArticleJsonLd(post: {
  title: string;
  description: string;
  url: string;
  date: string;
  category: string;
}) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    url: post.url,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Hey AI Hub",
    },
    publisher: {
      "@type": "Organization",
      name: "Hey AI Hub",
      url: "https://heyaihub.com",
    },
    articleSection: post.category,
  };
  return <JsonLd data={jsonLd} />;
}

// ============================================================
// WebSite + SearchAction (homepage)
// ============================================================
export function WebSiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Hey AI Hub",
    url: "https://heyaihub.com",
    potentialAction: {
      "@type": "SearchAction",
      target: "https://heyaihub.com/search?q={search_term_string}",
      "query-input": "required name=search_term_string",
    },
  };
  return <JsonLd data={jsonLd} />;
}

// ============================================================
// FAQ (FAQ page)
// ============================================================
export function FAQJsonLd(faqs: { question: string; answer: string }[]) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(faq => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };
  return <JsonLd data={jsonLd} />;
}
