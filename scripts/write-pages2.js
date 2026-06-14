const fs = require('fs');
const path = require('path');

const baseDir = 'C:/Users/wangxiaoping/Documents/New project/ai-tool-navigator/src/app';

// Best Of page
const bestOfPage = `import Link from 'next/link';
import { getAllTools, getCategories, type Tool, type Category } from '@/lib/tools';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import ToolCard from '@/components/ToolCard';
import AdInContent from '@/components/AdBanner';
import { Star } from 'lucide-react';

const bestOfGuides = {
  coding: { title: 'Best AI Coding Tools 2026', desc: 'Top AI coding assistants for developers', intro: 'AI coding tools have transformed how developers write, debug, and deploy code. Here are the best AI coding tools for 2026, ranked by ratings and real-world performance.' },
  writing: { title: 'Best AI Writing Tools 2026', desc: 'Top AI writing assistants for content creators', intro: 'AI writing tools help you create content faster than ever. From blog posts to marketing copy, these are the best AI writing tools available in 2026.' },
  design: { title: 'Best AI Design Tools 2026', desc: 'Top AI-powered design platforms', intro: 'AI design tools range from image generation platforms to AI-enhanced professional design software. Here are the best ones for 2026.' },
  seo: { title: 'Best AI SEO Tools 2026', desc: 'Top AI-powered SEO platforms', intro: 'AI SEO tools combine keyword research, content optimization, and competitive analysis. These are the best AI SEO tools to boost your rankings in 2026.' },
  marketing: { title: 'Best AI Marketing Tools 2026', desc: 'Top AI marketing platforms for growth', intro: 'AI marketing tools help with social media, email campaigns, and analytics. Here are the best AI marketing tools for 2026.' },
  devops: { title: 'Best AI DevOps Tools 2026', desc: 'Top AI DevOps platforms', intro: 'AI-powered DevOps tools help with deployment, monitoring, and infrastructure. These are the best for 2026.' },
  productivity: { title: 'Best AI Productivity Tools 2026', desc: 'Top AI tools to boost your productivity', intro: 'AI productivity tools help you organize work, manage projects, and stay focused. Here are the best for 2026.' },
  video: { title: 'Best AI Video Tools 2026', desc: 'Top AI video platforms', intro: 'AI video tools are the fastest-growing category. From text-to-video generation to AI-powered editing, here are the best for 2026.' },
  voice: { title: 'Best AI Voice Tools 2026', desc: 'Top AI voice generation platforms', intro: 'AI voice tools range from text-to-speech to voice cloning. Here are the best AI voice tools available in 2026.' },
  analytics: { title: 'Best AI Analytics Tools 2026', desc: 'Top AI analytics platforms', intro: 'AI analytics platforms help you understand your data and make better decisions. Here are the best for 2026.' },
  education: { title: 'Best AI Education Tools 2026', desc: 'Top AI learning platforms', intro: 'AI education tools are making learning more accessible and personalized. Here are the best for 2026.' },
  "customer-service": { title: 'Best AI Customer Service Tools 2026', desc: 'Top AI customer service platforms', intro: 'AI customer service tools range from chatbots to helpdesk automation. Here are the best for 2026.' }
};

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const guide = bestOfGuides[slug];
  if (!guide) return { title: 'Best AI Tools' };
  return { title: guide.title + ' | AI Tool Navigator', description: guide.desc };
}

export default async function BestOfPage({ params }) {
  const { slug } = await params;
  const guide = bestOfGuides[slug];
  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><p className="text-gray-500">Category not found</p></main>
        <Footer />
      </div>
    );
  }
  const allTools = getAllTools();
  const categoryTools = allTools.filter(t => t.category && t.category.toLowerCase().replace(/\\s+/g, '-') === slug).sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full">
        <div className="mb-5 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{guide.title}</h1>
          <p className="text-sm text-gray-500 mb-4">Ranked by ratings and quality</p>
          <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-blue-200">
            <p className="text-sm text-blue-800 leading-relaxed">{guide.intro}</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {categoryTools.map((tool, index) => (
            <div key={tool.id} className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm md:text-base">{index + 1}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg"><Link href={'/tools/' + tool.slug} className="hover:text-blue-600">{tool.name}</Link></h3>
                      <p className="text-xs md:text-sm text-gray-600 mt-0.5">{tool.description}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{tool.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link href={'/tools/' + tool.slug} className="text-xs text-blue-600 hover:underline">Read Review</Link>
                    <a href={'/api/track/click?slug=' + tool.slug} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-flex items-center gap-1">Try Free →</a>
                    <span className="text-xs text-gray-500 ml-auto">{tool.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AdInContent />

        <div className="bg-gray-50 rounded-xl p-4 md:p-5 mb-5 md:mb-8 border border-gray-200">
          <h2 className="font-semibold mb-3 text-sm">How We Ranked These AI Tools</h2>
          <ul className="text-xs text-gray-700 space-y-1.5 list-disc list-inside">
            <li><strong>Rating</strong>: Based on overall user satisfaction and feature quality</li>
            <li><strong>Pricing value</strong>: Considering free tiers and cost-effectiveness</li>
            <li><strong>Ease of use</strong>: How quickly users can get value</li>
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
`;

fs.writeFileSync(path.join(baseDir, 'best/[slug]/page.tsx'), bestOfPage, 'utf-8');
console.log('Best Of page written');

// Compare page
const comparePage = `import { notFound } from 'next/navigation';
import { getToolBySlug, type Tool } from '@/lib/tools';
import { getComparePageBySlug } from '@/lib/db';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdInContent from '@/components/AdBanner';
import { Star, ExternalLink, Check } from 'lucide-react';
import Link from 'next/link';

function JsonLdSchema({ page }) {
  const jsonLd = { "@context": "https://schema.org", "@type": "Article", "headline": page.title, "description": "Comparison between two AI tools" };
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />;
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const page = getComparePageBySlug(slug);
  if (!page) return { title: 'Comparison Not Found' };
  return { title: page.title + ' | AI Tool Navigator', description: 'Compare two AI tools side by side.' };
}

export default async function ComparePage({ params }) {
  const { slug } = await params;
  const comparePage = getComparePageBySlug(slug);
  if (!comparePage) notFound();

  const parts = slug.split('-vs-');
  const t1 = getToolBySlug(parts[0]);
  const t2 = getToolBySlug(parts[1]);
  if (!t1 || !t2) notFound();

  return (
    <>
      <JsonLdSchema page={comparePage} />
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 max-w-5xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full">
          <nav className="text-xs md:text-sm text-gray-500 mb-4 md:mb-6">
            <Link href="/" className="hover:text-blue-600">Home</Link> {' > '}
            <span className="text-gray-900">{comparePage.title}</span>
          </nav>

          <div className="mb-5 md:mb-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-2">{comparePage.title}</h1>
            <p className="text-sm text-gray-500">Last updated: {comparePage.updated_at?.split('T')[0] || '2026'}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
            <div className="border-2 border-blue-200 rounded-xl p-4 md:p-5">
              <h2 className="text-xl font-bold mb-3">{t1.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{t1.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{[1,2,3,4,5].map(s => (<Star key={s} className={s <= Math.round(t1.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />))}</div>
                <span className="text-xs text-gray-500">{t1.rating}/5</span>
              </div>
              <a href={'/api/track/click?slug=' + t1.slug} target="_blank" rel="noopener noreferrer" className="flex-1 bg-blue-600 text-white text-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center justify-center gap-1">
                Try Free <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-3 space-y-1.5">{(t1.pros || []).map(p => (<div key={p} className="text-xs text-gray-700 flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> {p}</div>))}</div>
            </div>

            <div className="border-2 border-purple-200 rounded-xl p-4 md:p-5">
              <h2 className="text-xl font-bold mb-3">{t2.name}</h2>
              <p className="text-sm text-gray-600 mb-3">{t2.description}</p>
              <div className="flex items-center gap-2 mb-3">
                <div className="flex">{[1,2,3,4,5].map(s => (<Star key={s} className={s <= Math.round(t2.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"} />))}</div>
                <span className="text-xs text-gray-500">{t2.rating}/5</span>
              </div>
              <a href={'/api/track/click?slug=' + t2.slug} target="_blank" rel="noopener noreferrer" className="flex-1 bg-purple-600 text-white text-center px-3 py-2 rounded-lg text-sm font-medium hover:bg-purple-700 flex items-center justify-center gap-1">
                Try Free <ExternalLink className="w-3.5 h-3.5" />
              </a>
              <div className="mt-3 space-y-1.5">{(t2.pros || []).map(p => (<div key={p} className="text-xs text-gray-700 flex items-start gap-2"><Check className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" /> {p}</div>))}</div>
            </div>
          </div>

          <div className="mb-6 md:mb-8">
            <h2 className="text-xl font-bold mb-4">Detailed Comparison</h2>
            <div className="text-sm text-gray-700 space-y-3 leading-relaxed whitespace-pre-wrap">{comparePage.content}</div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 md:mb-8">
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"><h3 className="font-semibold mb-2">{t1.name} Pricing</h3><p className="text-sm text-gray-600">{t1.price} ({t1.price_type})</p></div>
            <div className="bg-gray-50 rounded-xl p-4 border border-gray-200"><h3 className="font-semibold mb-2">{t2.name} Pricing</h3><p className="text-sm text-gray-600">{t2.price} ({t2.price_type})</p></div>
          </div>

          <AdInContent />

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5 md:p-6 text-center border border-blue-200 mb-5 md:mb-8">
            <h3 className="font-bold text-base text-blue-900 mb-2">Which one should you choose?</h3>
            <p className="text-xs text-blue-700 mb-4">Try both and decide which fits your workflow best.</p>
            <div className="flex flex-wrap gap-3 justify-center">
              <a href={'/api/track/click?slug=' + t1.slug} target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-blue-700 text-sm flex items-center gap-1">Try {t1.name} <ExternalLink className="w-3.5 h-3.5" /></a>
              <a href={'/api/track/click?slug=' + t2.slug} target="_blank" rel="noopener noreferrer" className="bg-purple-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-purple-700 text-sm flex items-center gap-1">Try {t2.name} <ExternalLink className="w-3.5 h-3.5" /></a>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">comparison</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{t1.slug}</span>
            <span className="bg-gray-100 text-gray-600 text-xs px-3 py-1 rounded-full">{t2.slug}</span>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
`;

fs.writeFileSync(path.join(baseDir, 'compare/[slug1]-vs-[slug2]/page.tsx'), comparePage, 'utf-8');
console.log('Compare page written');
