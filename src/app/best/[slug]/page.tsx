export const runtime = 'edge';
﻿import Link from 'next/link';
import { getAllTools, getCategories, type Tool, type Category } from '@/lib/tools';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = bestOfGuides[slug as keyof typeof bestOfGuides];
  if (!guide) return { title: 'Best AI Tools' };
  return { title: guide.title + ' | AI Tool Navigator', description: guide.desc };
}

export default async function BestOfPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = bestOfGuides[slug as keyof typeof bestOfGuides];
  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center"><p className="text-muted-foreground">Category not found</p></main>
        <Footer />
      </div>
    );
  }
  const allTools = await getAllTools();
  const categoryTools = allTools.filter(t => t.category && t.category.toLowerCase().replace(/\s+/g, '-') === slug).sort((a, b) => b.rating - a.rating);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-7xl mx-auto px-3 md:px-4 py-5 md:py-8 w-full">
        <div className="mb-5 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">{guide.title}</h1>
          <p className="text-sm text-muted-foreground mb-4">Ranked by ratings and quality</p>
          <div className="bg-blue-50 rounded-xl p-4 md:p-5 border border-primary/20">
            <p className="text-sm text-blue-800 leading-relaxed">{guide.intro}</p>
          </div>
        </div>

        <div className="space-y-4 md:space-y-6 mb-6 md:mb-8">
          {categoryTools.map((tool, index) => (
            <div key={tool.id} className="border border-border rounded-xl p-4 md:p-5 hover:shadow-md transition-shadow bg-white">
              <div className="flex items-start gap-3 md:gap-4">
                <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-sm md:text-base">{index + 1}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-1">
                    <div>
                      <h3 className="font-semibold text-base md:text-lg"><Link href={'/tools/' + tool.slug} className="hover:text-blue-600">{tool.name}</Link></h3>
                      <p className="text-xs md:text-sm text-muted-foreground mt-0.5">{tool.description}</p>
                    </div>
                    <div className="flex items-center gap-1 ml-3 flex-shrink-0">
                      <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm font-medium">{tool.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-2">
                    <Link href={'/tools/' + tool.slug} className="text-xs text-blue-600 hover:underline !text-blue-600">Read Review</Link>
                    <a href={tool.url} target="_blank" rel="noopener noreferrer" className="text-xs bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 inline-flex items-center gap-1 !text-white">Try Free &rarr;</a>
                    <span className="text-xs text-muted-foreground ml-auto">{tool.price}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <AdInContent />

        <div className="bg-gray-50 rounded-xl p-4 md:p-5 mb-5 md:mb-8 border border-border">
          <h2 className="font-semibold mb-3 text-sm">How We Ranked These AI Tools</h2>
          <ul className="text-xs text-foreground space-y-1.5 list-disc list-inside">
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

