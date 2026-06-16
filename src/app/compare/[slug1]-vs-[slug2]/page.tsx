import { notFound } from 'next/navigation';
import { getComparePageBySlug, getToolBySlug, type ComparePage, type Tool } from '@/lib/tools';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getComparePageBySlug(slug);
  if (!page) return { title: 'Comparison Not Found' };
  return { title: page.title + ' | Hey AI Hub', description: 'Compare two AI tools side by side' };
}

/**
 * Safely render HTML content by stripping dangerous attributes and protocols.
 * This is a lightweight sanitizer — not a replacement for a full HTML sanitizer library.
 */
function sanitizeHtml(html: string): string {
  return html
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')    // strip event handlers
    .replace(/javascript\s*:/gi, '')                   // strip javascript: protocol
    .replace(/<iframe\b[^>]*>/gi, '')                  // strip iframes
    .replace(/<\/iframe>/gi, '')
    .replace(/<script\b[^>]*>/gi, '')                  // strip scripts
    .replace(/<\/script>/gi, '')
    .replace(/<object\b[^>]*>/gi, '')                  // strip objects
    .replace(/<embed\b[^>]*>/gi, '');                  // strip embeds
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getComparePageBySlug(slug);
  if (!page) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 flex items-center justify-center'><p className='text-muted-foreground'>Comparison not found</p></main>
        <Footer />
      </div>
    );
  }

  const tool1 = await getToolBySlug(page.tool1_id);
  const tool2 = await getToolBySlug(page.tool2_id);

  const sanitizedContent = sanitizeHtml(page.content);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 max-w-6xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full'>
        <nav className='text-xs md:text-sm text-muted-foreground mb-4 md:mb-6'>
          <Link href='/' className='hover:text-primary transition-colors'>Home</Link> {' > '}
          <span className='text-foreground font-medium'>Compare</span>
        </nav>

        <div className='mb-5 md:mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold mb-2'>{page.title}</h1>
          <div className="prose prose-sm md:prose-base max-w-none" dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {tool1 && (
            <div className='border border-border rounded-xl p-4 md:p-5 bg-card'>
              <h2 className='font-semibold text-lg mb-2'>{tool1.name}</h2>
              <p className='text-sm text-muted-foreground mb-3'>{tool1.description}</p>
              <Link href={`/tools/${tool1.slug}`} className='text-primary hover:underline text-sm font-medium'>Read Full Review →</Link>
            </div>
          )}
          {tool2 && (
            <div className='border border-border rounded-xl p-4 md:p-5 bg-card'>
              <h2 className='font-semibold text-lg mb-2'>{tool2.name}</h2>
              <p className='text-sm text-muted-foreground mb-3'>{tool2.description}</p>
              <Link href={`/tools/${tool2.slug}`} className='text-primary hover:underline text-sm font-medium'>Read Full Review →</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}