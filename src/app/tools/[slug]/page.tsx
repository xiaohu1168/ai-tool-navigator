import { notFound } from 'next/navigation';
import { getToolBySlug, getCategories, type Category, getAffiliateLinksByToolSlug, getPromptsByToolSlug, type AffiliateLink, type Prompt } from '@/lib/tools';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdInContent from '@/components/AdBanner';
import { CopyButton, PromptSection } from '@/components/PromptSection';
import AffiliateLinkClickTracker from '@/components/AffiliateLinkClickTracker';
import { Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };
  return { title: tool.name + ' - Review & Pricing | Hey AI Hub', description: tool.description };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 flex items-center justify-center'><p className='text-muted-foreground'>Tool not found</p></main>
      <Footer />
    </div>
  );
  const categories = await getCategories();
  const category = categories.find((c: any) => c.id === tool.category);
  const affiliateLinks = await getAffiliateLinksByToolSlug(slug);
  const prompts = await getPromptsByToolSlug(slug);
  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 max-w-4xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full'>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: "https://heyaihub.com/" },
                ...(category ? [{ "@type": "ListItem", position: 2, name: category.name, item: "https://heyaihub.com/category/" + category.id }] : []),
              ],
            }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              name: tool.name,
              description: tool.description,
              url: tool.url,
              applicationCategory: category?.name || "AI Tool",
              operatingSystem: "Web",
              offers: { "@type": "Offer", price: "0", priceCurrency: "USD", availability: "https://schema.org/InStock" },
              aggregateRating: { "@type": "AggregateRating", ratingValue: String(tool.rating), bestRating: "5", worstRating: "1", ratingCount: "100" },
              review: { "@type": "Review", reviewBody: tool.description, author: { "@type": "Organization", name: "Hey AI Hub" } },
            }),
          }}
        />
        <nav className='text-xs md:text-sm text-muted-foreground mb-4 md:mb-6'>
          <Link href='/' className='hover:text-primary transition-colors'>Home</Link> {' > '}
          {category ? <Link href={'/category/' + category.id} className='hover:text-primary transition-colors'>{category.name}</Link> : 'Tools'} {' > '}
          <span className='text-foreground font-medium'>{tool.name}</span>
        </nav>
        <div className='mb-5 md:mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold mb-2'>{tool.name}</h1>
          <p className='text-sm md:text-lg text-muted-foreground'>{tool.description}</p>
        </div>
        <div className='flex items-center gap-2 mb-5 md:mb-6'>
          <div className='flex'>{[1,2,3,4,5].map(s => (<Star key={s} className={s <= Math.round(tool.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-muted'} />))}</div>
          <span className='text-xs md:text-sm text-muted-foreground'>{tool.rating}/5</span>
        </div>
        <div className='flex flex-wrap gap-3 mb-6 md:mb-8'>
          {affiliateLinks.length > 0 ? (
            <>
              {affiliateLinks.map(link => (
                <a key={link.id} id={'affiliate-link-' + link.id} href={'/api/track/affiliate?linkId=' + link.id} target='_blank' rel='noopener noreferrer' className='bg-green-600 text-white px-5 md:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 text-sm transition-colors shadow-sm'>
                  {link.label} <ExternalLink className='w-4 h-4' />
                </a>
              ))}
              <a href={tool.url} target='_blank' rel='noopener noreferrer' className='bg-background border-2 border-border text-foreground px-4 py-3 rounded-lg font-medium hover:bg-muted/50 flex items-center gap-2 text-sm transition-colors'>
                Official Site <ExternalLink className='w-4 h-4' />
              </a>
            </>
          ) : (
            <a href={tool.url} target='_blank' rel='noopener noreferrer' className='bg-green-600 text-white px-5 md:px-6 py-3 rounded-lg font-semibold hover:bg-green-700 flex items-center gap-2 text-sm transition-colors shadow-sm'>
              Try {tool.name} Free <ExternalLink className='w-4 h-4' />
            </a>
          )}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8'>
          <div className='bg-muted/50 rounded-lg p-3 md:p-4 border border-border'><div className='text-xs text-muted-foreground mb-1'>Price</div><div className='font-semibold text-sm text-foreground'>{tool.price}</div></div>
          <div className='bg-muted/50 rounded-lg p-3 md:p-4 border border-border'><div className='text-xs text-muted-foreground mb-1'>Category</div><div className='font-semibold text-sm text-foreground'>{category?.name || tool.category}</div></div>
          <div className='bg-muted/50 rounded-lg p-3 md:p-4 border border-border'><div className='text-xs text-muted-foreground mb-1'>Rating</div><div className='font-semibold text-sm text-foreground'>{tool.rating}/5</div></div>
          <div className='bg-muted/50 rounded-lg p-3 md:p-4 border border-border'><div className='text-xs text-muted-foreground mb-1'>Updated</div><div className='font-semibold text-sm text-foreground'>{tool.updated || '2026'}</div></div>
        </div>
        {affiliateLinks.length > 0 && (
          <div className='bg-green-50 dark:bg-green-950/20 rounded-xl p-4 border border-green-200 dark:border-green-900/40 mb-6 md:mb-8'>
            <p className='text-xs text-green-800 dark:text-green-400 font-medium'>
              💰 Best deals available — click any button above to try {tool.name} with special pricing
            </p>
          </div>
        )}
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8'>
          <div className='border border-green-200 dark:border-green-900/40 rounded-xl p-4 md:p-5'><h2 className='font-semibold text-green-700 dark:text-green-400 mb-3 text-sm'>Pros</h2>
            <ul className='space-y-2'>{(tool.pros || []).map(p => (<li key={p} className='text-xs text-foreground flex items-start gap-2'><span className='text-green-600'>+</span> {p}</li>))}</ul>
          </div>
          <div className='border border-red-200 dark:border-red-900/40 rounded-xl p-4 md:p-5'><h2 className='font-semibold text-red-700 dark:text-red-400 mb-3 text-sm'>Cons</h2>
            <ul className='space-y-2'>{(tool.cons || []).map(c => (<li key={c} className='text-xs text-foreground flex items-start gap-2'><span className='text-red-500'>-</span> {c}</li>))}</ul>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 md:mb-8'>
          <div className='bg-blue-50 dark:bg-blue-950/30 rounded-xl p-4 border border-blue-200 dark:border-blue-900/40'><h2 className='font-semibold text-blue-900 dark:text-blue-300 mb-2 text-sm'>Best For</h2><p className='text-xs text-blue-800 dark:text-blue-400'>{tool.for_whom}</p></div>
          <div className='bg-muted/50 rounded-xl p-4 border border-border'><h2 className='font-semibold text-muted-foreground mb-2 text-sm'>Not For</h2><p className='text-xs text-muted-foreground'>{tool.not_for}</p></div>
        </div>
        {tool.alternatives && <div className='mb-5 md:mb-8'><h2 className='font-semibold mb-2 text-sm text-foreground'>Similar Tools</h2><p className='text-xs text-muted-foreground'>{tool.alternatives}</p></div>}
        {prompts.length > 0 && (
          <div className='mb-5 md:mb-8'>
            <h2 className='font-semibold mb-4 text-base text-foreground'>{tool.name}</h2>
            {prompts.map((p, i) => (
              <PromptSection key={i} prompt={{ title: p.title, prompt_text: p.prompt_text, use_case: p.use_case }} index={i} />
            ))}
          </div>
        )}
        <AffiliateLinkClickTracker links={affiliateLinks} toolSlug={slug} />
        <AdInContent />
      </main>
      <Footer />
    </div>
  );
}
