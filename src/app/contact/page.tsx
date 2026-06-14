import Header from '@/components/Header';
import Footer from '@/components/Footer';

export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-6">Contact Us</h1>
        <div className="space-y-6 text-gray-700">
          <p>Have a question, suggestion, or want to discuss a partnership? We&#39;d love to hear from you.</p>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="font-semibold mb-3">Email</h2>
            <a href="mailto:hello@heyaihub.com" className="text-blue-600">hello@heyaihub.com</a>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="font-semibold mb-3">Social</h2>
            <p className="text-sm text-gray-600">Follow us on Twitter/X for daily AI tool recommendations.</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-6 border border-gray-200">
            <h2 className="font-semibold mb-3">Business Inquiries</h2>
            <p className="text-sm text-gray-600">For advertising, sponsorship, or partnership opportunities, email us with the subject line &quot;Partnership Inquiry&quot;.</p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}