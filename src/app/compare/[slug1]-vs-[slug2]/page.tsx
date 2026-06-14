import { notFound } from 'next/navigation';
import { getComparePageBySlug, getToolBySlug, type ComparePage, type Tool } from '@/lib/tools';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Link from 'next/link';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getComparePageBySlug(slug);
  if (!page) return { title: 'Comparison Not Found' };
  return { title: page.title + ' | AI Tool Navigator', description: 'Compare two AI tools side by side' };
}

export default async function ComparePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const page = await getComparePageBySlug(slug);
  if (!page) {
    return (
      <div className='min-h-screen flex flex-col'>
        <Header />
        <main className='flex-1 flex items-center justify-center'><p className='text-gray-500'>Comparison not found</p></main>
        <Footer />
      </div>
    );
  }

  const tool1 = await getToolBySlug(page.tool1_id);
  const tool2 = await getToolBySlug(page.tool2_id);

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 max-w-6xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full'>
        <nav className='text-xs md:text-sm text-gray-500 mb-4 md:mb-6'>
          <Link href='/' className='hover:text-blue-600'>Home</Link> {' > '}
          <span className='text-gray-900'>Compare</span>
        </nav>

        <div className='mb-5 md:mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold mb-2'>{page.title}</h1>
          <div className='prose max-w-none' dangerouslySetInnerHTML={{ __html: page.content }} />
        </div>

        <div className='grid grid-cols-1 md:grid-cols-2 gap-6 mb-8'>
          {tool1 && (
            <div className='border border-gray-200 rounded-xl p-4 md:p-5'>
              <h2 className='font-semibold text-lg mb-2'>{tool1.name}</h2>
              <p className='text-sm text-gray-600 mb-3'>{tool1.description}</p>
              <Link href={`/tools/${tool1.slug}`} className='text-blue-600 hover:underline text-sm'>Read Full Review →</Link>
            </div>
          )}
          {tool2 && (
            <div className='border border-gray-200 rounded-xl p-4 md:p-5'>
              <h2 className='font-semibold text-lg mb-2'>{tool2.name}</h2>
              <p className='text-sm text-gray-600 mb-3'>{tool2.description}</p>
              <Link href={`/tools/${tool2.slug}`} className='text-blue-600 hover:underline text-sm'>Read Full Review →</Link>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}