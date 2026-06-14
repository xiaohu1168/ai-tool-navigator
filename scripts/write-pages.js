const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/wangxiaoping/Documents/New project/ai-tool-navigator/src/app';

// Tool detail page
const toolDetail = `import { notFound } from 'next/navigation';
import { getToolBySlug, getCategories, type Category, getAffiliateLinksByToolSlug, getPromptsByToolSlug, type AffiliateLink, type Prompt } from '@/lib/tools';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdInContent from '@/components/AdBanner';
import { Star, ExternalLink, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

function JsonLdSchema({ tool }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": tool.name,
    "applicationCategory": tool.category || "AI Tool",
    "url": tool.url,
    "description": tool.description,
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": tool.rating, "ratingCount": 100 },
    "offers": { "@type": "Offer", "price": tool.price || "0", "priceCurrency": "USD" }
  };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try { await navigator.clipboard.writeText(text); } catch {
      const ta = document.createElement("textarea"); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); document.body.removeChild(ta);
    }
    setCopied(true); setTimeout(() => setCopied(false), 2000);
  };
  return (
    <button onClick={handleCopy} className="flex items-center gap-1 text-xs bg-gray-100 hover:bg-gray-200 text-gray-600 px-3 py-1.5 rounded-full transition-colors">
      {copied ? <Check className="w-3 h-3 text-green-500" /> : <Copy className="w-3 h-3" />}{copied ? "Copied!" : "Copy"}
    </button>
  );
}

function PromptSection({ prompt, index }) {
  const [expanded, setExpanded] = useState(false);
  return (
    <div className="border border-gray-200 rounded-xl p-4 bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm text-gray-800">{index + 1}. {prompt.title}</h4>
        <CopyButton text={prompt.prompt_text} />
      </div>
      <div className="text-xs text-gray-500 mb-2">{prompt.use_case}{prompt.best_model ? " • Best model: " + prompt.best_model : ""}</div>
      <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 text-xs text-blue-600 hover:underline">
        {expanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}{expanded ? "Hide prompt" : "Show prompt"}
      </button>
      {expanded && <div className="mt-3 p-3 bg-white border border-gray-200 rounded-lg"><pre className="text-xs text-gray-700 whitespace-pre-wrap font-mono select-all">{prompt.prompt_text}</pre></div>}
    </div>
  );
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };
  return { title: tool.name + ' - Review & Pricing | AI Tool Navigator', description: tool.description };
}

export default async function ToolDetailPage({ params }) {
  const { slug } = await params;
  const tool = getToolBySlug(slug);
  if (!tool) notFound();
  const categories = getCategories();
  const category = categories.find(c => c.id === tool.category);
  const affiliateLinks = getAffiliateLinksByToolSlug(slug);
  const prompts = getPromptsByToolSlug(slug);

  return (
    <>
      <JsonLdSchema tool={tool} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-4xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full">
          <nav className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link> {' > '}
            {category ? <Link href={'/category/' + category.id} className="hover:text-blue-600">{category.name}</Link> : 'Tools'} {' > '}
            <span className="text-gray-900">{tool.name}</span>
          </nav>

          <div className="mb-5 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{tool.name}</h1>
            <p className="text-sm md:text-lg text-gray-600">{tool.description}</p>
          </div>

          <div className="flex items-center gap-2 mb-5 md:mb-6">
            <div className="flex">{[1,2,3,4,5].map(s => (<Star key={s} className={s <= Math.round(tool.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />))}</div>
            <span className="text-xs md:text-sm text-gray-600">{tool.rating}/5</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-6 md:mb-8">
            <a href={'/api/track/click?slug=' + tool.slug} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 text-sm">
              Visit Official Site <ExternalLink className="w-4 h-4" />
            </a>
            {affiliateLinks.length > 0 ? affiliateLinks.map(link => (
              <a key={link.id} href={'/api/track/affiliate?linkId=' + link.id} target="_blank" rel="noopener noreferrer" className="bg-white border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg font-medium hover:bg-blue-50 flex items-center gap-2 text-sm">
                {link.label} <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )) : (
              <a href={'/api/track/click?slug=' + tool.slug} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 text-sm">
                Free Trial <ExternalLink className="w-4 h-4" />
              </a>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200"><div className="text-xs text-gray-500 mb-1">Price</div><div className="font-semibold text-sm">{tool.price}</div></div>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200"><div className="text-xs text-gray-500 mb-1">Category</div><div className="font-semibold text-sm">{category?.name || tool.category}</div></div>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200"><div className="text-xs text-gray-500 mb-1">Rating</div><div className="font-semibold text-sm">{tool.rating}/5</div></div>
            <div className="bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200"><div className="text-xs text-gray-500 mb-1">Updated</div><div className="font-semibold text-sm">{tool.updated || '2026'}</div></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="border border-green-200 rounded-xl p-4 md:p-5"><h2 className="font-semibold text-green-800 mb-3 text-sm">Pros</h2>
              <ul className="space-y-2">{(tool.pros || []).map(p => (<li key={p} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-green-500">✓</span> {p}</li>))}</ul>
            </div>
            <div className="border border-red-200 rounded-xl p-4 md:p-5"><h2 className="font-semibold text-red-800 mb-3 text-sm">Cons</h2>
              <ul className="space-y-2">{(tool.cons || []).map(c => (<li key={c} className="text-xs text-gray-700 flex items-start gap-2"><span className="text-red-500">✗</span> {c}</li>))}</ul>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 md:mb-8">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-200"><h2 className="font-semibold text-blue-900 mb-2 text-sm">Best For</h2><p className="text-xs text-blue-800">{tool.for_whom}</p></div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"><h2 className="font-semibold text-gray-800 mb-2 text-sm">Not For</h2><p className="text-xs text-gray-600">{tool.not_for}</p></div>
          </div>

          {tool.alternatives && <div className="mb-5 md:mb-8"><h2 className="font-semibold mb-2 text-sm">Similar Tools</h2><p className="text-xs text-gray-600">{tool.alternatives}</p></div>}

          {prompts.length > 0 && (
            <div className="mb-5 md:mb-8">
              <div className="flex items-center gap-2 mb-3"><span className="text-lg">💡</span><h2 className="font-bold text-base">Best Prompts for {tool.name}</h2></div>
              <p className="text-xs text-gray-500 mb-4">Copy these prompts and use them directly with {tool.name}.</p>
              <div className="space-y-3">{prompts.map((prompt, index) => <PromptSection key={prompt.id} prompt={prompt} index={index} />)}</div>
            </div>
          )}

          <AdInContent />

          <div className="flex flex-wrap gap-2 mb-5 md:mb-8">{(tool.tags || []).map(tag => (<span key={tag} className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{tag}</span>))}</div>

          <div className="bg-gray-50 rounded-xl p-4 md:p-5 mb-5 md:mb-8 border border-gray-200">
            <h2 className="font-semibold mb-3 text-sm">About {tool.name}</h2>
            <div className="text-xs text-gray-700 space-y-2">{tool.description}
              <p>{tool.name} is a powerful AI tool in the {category?.name || 'AI'} category, rated {tool.rating}/5.</p>
            </div>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 text-center border border-blue-200 mb-5">
            <h3 className="font-bold text-base text-blue-900 mb-2">Ready to try {tool.name}?</h3>
            <a href={'/api/track/click?slug=' + tool.slug} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 text-sm">
              Try {tool.name} Now <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
`;

fs.writeFileSync(path.join(baseDir, 'tools/[slug]/page.tsx'), toolDetail, 'utf-8');
console.log('Tool detail page written');
