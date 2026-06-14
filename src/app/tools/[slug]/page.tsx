import { notFound } from 'next/navigation';
import { getToolBySlug, getCategories, type Category, getAffiliateLinksByToolSlug, getPromptsByToolSlug, type AffiliateLink, type Prompt } from '@/lib/tools';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AdInContent from '@/components/AdBanner';
import { CopyButton, PromptSection } from '@/components/PromptSection';
import { Star, ExternalLink } from 'lucide-react';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return { title: 'Tool Not Found' };
  return { title: tool.name + ' - Review & Pricing | AI Tool Navigator', description: tool.description };
}

export default async function ToolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = await getToolBySlug(slug);
  if (!tool) return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 flex items-center justify-center'><p className='text-gray-500'>Tool not found</p></main>
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
        <nav className='text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
          <Link href='/' className='hover:text-blue-600'>Home</Link> {' > '}
          {category ? <Link href={'/category/' + category.id} className='hover:text-blue-600'>{category.name}</Link> : 'Tools'} {' > '}
          <span className='text-gray-900'>{tool.name}</span>
        </nav>
        <div className='mb-5 md:mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold mb-2'>{tool.name}</h1>
          <p className='text-sm md:text-lg text-gray-600'>{tool.description}</p>
        </div>
        <div className='flex items-center gap-2 mb-5 md:mb-6'>
          <div className='flex'>{[1,2,3,4,5].map(s => (<Star key={s} className={s <= Math.round(tool.rating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'} />))}</div>
          <span className='text-xs md:text-sm text-gray-600'>{tool.rating}/5</span>
        </div>
        <div className='flex flex-wrap gap-3 mb-6 md:mb-8'>
          <a href={tool.url} target='_blank' rel='noopener noreferrer' className='bg-blue-600 text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-blue-700 flex items-center gap-2 text-sm'>
            Visit Official Site <ExternalLink className='w-4 h-4' />
          </a>
          {affiliateLinks.length > 0 ? affiliateLinks.map(link => (
            <a key={link.id} href={'/api/track/affiliate?linkId=' + link.id} target='_blank' rel='noopener noreferrer' className='bg-white border-2 border-blue-600 text-blue-600 px-4 py-2.5 rounded-lg font-medium hover:bg-blue-50 flex items-center gap-2 text-sm'>
              {link.label} <ExternalLink className='w-3.5 h-3.5' />
            </a>
          )) : (
            <a href={tool.url} target='_blank' rel='noopener noreferrer' className='bg-green-600 text-white px-4 md:px-6 py-2.5 rounded-lg font-medium hover:bg-green-700 flex items-center gap-2 text-sm'>
              Free Trial <ExternalLink className='w-4 h-4' />
            </a>
          )}
        </div>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8'>
          <div className='bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200'><div className='text-xs text-gray-500 mb-1'>Price</div><div className='font-semibold text-sm'>{tool.price}</div></div>
          <div className='bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200'><div className='text-xs text-gray-500 mb-1'>Category</div><div className='font-semibold text-sm'>{category?.name || tool.category}</div></div>
          <div className='bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200'><div className='text-xs text-gray-500 mb-1'>Rating</div><div className='font-semibold text-sm'>{tool.rating}/5</div></div>
          <div className='bg-gray-50 rounded-lg p-3 md:p-4 border border-gray-200'><div className='text-xs text-gray-500 mb-1'>Updated</div><div className='font-semibold text-sm'>{tool.updated || '2026'}</div></div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8'>
          <div className='border border-green-200 rounded-xl p-4 md:p-5'><h2 className='font-semibold text-green-800 mb-3 text-sm'>Pros</h2>
            <ul className='space-y-2'>{(tool.pros || []).map(p => (<li key={p} className='text-xs text-gray-700 flex items-start gap-2'><span className='text-green-500'>+</span> {p}</li>))}</ul>
          </div>
          <div className='border border-red-200 rounded-xl p-4 md:p-5'><h2 className='font-semibold text-red-800 mb-3 text-sm'>Cons</h2>
            <ul className='space-y-2'>{(tool.cons || []).map(c => (<li key={c} className='text-xs text-gray-700 flex items-start gap-2'><span className='text-red-500'>-</span> {c}</li>))}</ul>
          </div>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 md:mb-8'>
          <div className='bg-blue-50 rounded-xl p-4 border border-blue-200'><h2 className='font-semibold text-blue-900 mb-2 text-sm'>Best For</h2><p className='text-xs text-blue-800'>{tool.for_whom}</p></div>
          <div className='bg-gray-50 rounded-xl p-4 border border-gray-200'><h2 className='font-semibold text-gray-800 mb-2 text-sm'>Not For</h2><p className='text-xs text-gray-600'>{tool.not_for}</p></div>
        </div>
        {tool.alternatives && <div className='mb-5 md:mb-8'><h2 className='font-semibold mb-2 text-sm'>Similar Tools</h2><p className='text-xs text-gray-600'>{tool.alternatives}</p></div>}
        {prompts.length > 0 && (
          <div className='mb-5 md:mb-8'>
            <h2 className='font-semibold mb-4 text-base'>{tool.name}</h2>
            {prompts.map((p, i) => (
              <PromptSection key={i} prompt={{ title: p.title, prompt_text: p.prompt_text, use_case: p.use_case }} index={i} />
            ))}
          </div>
        )}
        <AdInContent />
      </main>
      <Footer />
    </div>
  );
}
