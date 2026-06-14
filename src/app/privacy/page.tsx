import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-sm text-muted-foreground mb-6">Last updated: June 8, 2026</p>
        <div className="space-y-6 text-foreground text-sm leading-relaxed">
          <p>Hey AI Hub (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;) operates the heyaihub.com website. This page informs you of our policies regarding the collection, use, and disclosure of personal data when you use our service.</p>
          <h2 className="text-xl font-semibold text-foreground">Information We Collect</h2>
          <p>We do not collect personal information. Our website does not require user registration. We may collect anonymous usage data through Google Analytics for the purpose of improving our website experience.</p>
          <h2 className="text-xl font-semibold text-foreground">Cookies</h2>
          <p>We may use cookies to improve your browsing experience. You can choose to disable cookies through your browser settings.</p>
          <h2 className="text-xl font-semibold text-foreground">Third-Party Links</h2>
          <p>Our website contains links to third-party websites. We are not responsible for the privacy practices of these external sites. We encourage you to read their privacy policies.</p>
          <h2 className="text-xl font-semibold text-foreground">Affiliate Disclosure</h2>
          <p>Some links on our website are affiliate links. This means if you click through and make a purchase, we may earn a commission at no additional cost to you. This does not influence our tool reviews or rankings.</p>
          <h2 className="text-xl font-semibold text-foreground">GDPR & CCPA</h2>
          <p>We respect the privacy rights of users in the EU (GDPR) and California (CCPA). If you have any privacy-related questions, please contact us at hello@heyaihub.com.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}