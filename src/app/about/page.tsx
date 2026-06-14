import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">About Hey AI Hub</h1>
        <div className="space-y-6 text-gray-700 leading-relaxed">
          <p>Hey AI Hub is a curated directory of the best AI software tools for developers, creators, and businesses. We believe finding the right AI tool shouldn&#39;t require testing dozens of platforms.</p>
          <p>We manually review every tool in our directory, providing honest evaluations based on real-world usage. Our team tests each tool for ease of use, feature quality, pricing value, and privacy practices before adding it to our listings.</p>
          <p>Founded in 2026, our mission is to help the independent developer and creator community navigate the rapidly growing AI tool ecosystem. We focus on tools that genuinely improve productivity — not hype or gimmicks.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8">How We Rate Tools</h2>
          <p>Each tool receives a rating from 1-5 based on our evaluation criteria: functionality (30%), ease of use (25%), value for money (25%), and privacy/security (20%). Ratings are updated whenever a tool releases a major new version.</p>
          <h2 className="text-xl font-semibold text-gray-900 mt-8">Our Commitment</h2>
          <p>We maintain editorial independence. While we may earn commissions through affiliate links, this never influences our reviews or ratings. A tool&#39;s position in our directory is based on quality, not sponsorship.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}