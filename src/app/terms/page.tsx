import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function TermsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Terms of Service</h1>
        <p className="text-sm text-muted-foreground mb-6">Last updated: June 8, 2026</p>
        <div className="space-y-6 text-foreground text-sm leading-relaxed">
          <p>By accessing and using Hey AI Hub, you accept and agree to be bound by these Terms of Service.</p>
          <h2 className="text-xl font-semibold text-foreground">Use of Content</h2>
          <p>The content on this website is for informational purposes only. While we strive to keep information accurate and up-to-date, we make no representations about the completeness, accuracy, or reliability of the tool listings.</p>
          <h2 className="text-xl font-semibold text-foreground">Affiliate Links</h2>
          <p>Some links on this site are affiliate links. We may earn a commission if you click and make a purchase. This does not affect our editorial independence or tool rankings.</p>
          <h2 className="text-xl font-semibold text-foreground">Limitation of Liability</h2>
          <p>Hey AI Hub shall not be liable for any damages arising from use of this website or reliance on the information provided. Always verify tool details on the official website before making a purchase.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}