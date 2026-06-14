import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function EditorialPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Editorial Policy</h1>
        <div className="space-y-6 text-foreground text-sm leading-relaxed">
          <p>Hey AI Hub is committed to honest, unbiased, and comprehensive reviews of AI software tools.</p>
          <h2 className="text-xl font-semibold text-foreground">Review Process</h2>
          <p>Every tool goes through manual review. Our team tests for functionality, ease of use, pricing, and privacy before listing.</p>
          <h2 className="text-xl font-semibold text-foreground">Rating System</h2>
          <p>Tools are rated 1-5 based on: functionality (30%), ease of use (25%), value (25%), and privacy (20%). Ratings update with major version releases.</p>
          <h2 className="text-xl font-semibold text-foreground">Ad Policy</h2>
          <p>Advertising does not influence rankings or reviews. Featured tools are selected by quality, not advertising spend. All featured placements are clearly labeled.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}