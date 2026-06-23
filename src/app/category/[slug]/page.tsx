import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCategories, getToolsByCategory, type Category, type Tool } from '@/lib/tools';
import ToolCard from '@/components/ToolCard';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import AdSidebar, { AdInContent } from '@/components/AdBanner';

type CategoryKey = 'coding' | 'writing' | 'seo' | 'design' | 'marketing' | 'devops' | 'productivity' | 'voice' | 'video' | 'analytics' | 'education' | 'customer-service';

const categoryGuides: Record<CategoryKey, string> = {
  coding: 'AI coding tools have revolutionized how developers write code. From intelligent autocompletion to full AI-powered editors, these tools help you build software faster.',
  writing: 'AI writing tools have transformed content creation. From blog posts to marketing copy, these AI assistants help you produce quality content faster.',
  seo: 'AI SEO tools combine keyword research, content optimization, and competitive analysis into powerful platforms.',
  design: 'AI design tools range from image generation platforms to AI-enhanced professional design software.',
  marketing: 'AI marketing tools help with everything from social media scheduling to email campaigns and customer analytics.',
  devops: 'AI-powered DevOps tools help with deployment, monitoring, and infrastructure management.',
  productivity: 'AI productivity tools help you organize work, track time, manage projects, and stay focused.',
  voice: 'AI voice tools range from text-to-speech generators to voice cloning platforms.',
  video: 'AI video tools are the fastest-growing category. From text-to-video generation to AI-powered editing.',
  analytics: 'AI analytics platforms help you understand your data and make better business decisions.',
  education: 'AI education tools are making learning more accessible and personalized.',
  'customer-service': 'AI customer service tools range from chatbots to helpdesk automation.'
};

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const categories = await getCategories();
  const category = categories.find((c: any) => c.id === slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} AI Tools & Software`,
    description: category.description || `Browse the best ${category.name.toLowerCase()} AI tools curated by Hey AI Hub.`,
    openGraph: {
      images: [
        {
          url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://heyaihub.com'}/api/og?type=${encodeURIComponent(category.name)}&title=${encodeURIComponent(category.name + ' AI Tools')}`,
          width: 1200,
          height: 630,
          alt: category.name,
        },
      ],
    },
    alternates: {
      canonical: `https://heyaihub.com/category/${slug}`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const slug = (await params).slug as CategoryKey;
  const categories = await getCategories();
  const category = categories.find((c: any) => c.id === slug);
  if (!category) notFound();
  const tools = await getToolsByCategory(slug);
  const guide = categoryGuides[slug];

  return (
    <div className='min-h-screen flex flex-col'>
      <Header />
      <main className='flex-1 max-w-7xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full'>
        <div className='flex items-center justify-between mb-2'>
          <span className='text-xs text-gray-400'>
            <Link href={'/best/' + slug} className='hover:text-blue-600'>View ranked list -</Link>
          </span>
        </div>
        <div className='mb-5 md:mb-8'>
          <h1 className='text-2xl md:text-3xl font-bold mb-2'>{category.icon} {category.name}</h1>
          <p className='text-sm md:text-base text-muted-foreground'>{category.description}</p>
        </div>
        <div className='bg-gray-50 rounded-xl p-4 md:p-6 mb-5 md:mb-8 border border-border'>
          <h2 className='font-semibold mb-3 text-base md:text-lg'>About {category.name} Tools</h2>
          <p className='text-xs md:text-sm text-foreground leading-relaxed'>{guide}</p>
        </div>
        <div className='flex items-center justify-between mb-3 md:mb-4 text-xs md:text-sm'>
          <span className='text-muted-foreground'>{tools.length} tools</span>
        </div>
        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5'>
          {tools.map((tool) => <ToolCard key={tool.id} tool={tool} />)}
        </div>
        <AdInContent />
      </main>
      <Footer />
    </div>
  );
}


