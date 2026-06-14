import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const faqs = [
  {
    q: "What is Hey AI Hub?",
    a: "Hey AI Hub is a curated directory of the best AI software tools for developers, creators, and businesses. We manually test and review every tool to help you find the right solution for your workflow.",
  },
  {
    q: "How do you select and rate tools?",
    a: "Each tool goes through manual testing by our team. We evaluate on functionality (30%), ease of use (25%), value for money (25%), and privacy/security (20%). Ratings range from 1-5 and are updated when tools release major versions.",
  },
  {
    q: "Are the reviews biased by advertising?",
    a: "No. Advertising and sponsorships never influence our reviews or rankings. Featured tools are selected by quality. We maintain full editorial independence.",
  },
  {
    q: "Are free AI tools worth using?",
    a: "Absolutely! Many AI tools offer generous free tiers. Tools like Codeium, ChatGPT, and various design platforms provide substantial free functionality. We clearly mark free, freemium, and paid tools in our listings.",
  },
  {
    q: "How often do you update the directory?",
    a: "We review and update our listings regularly. New tools are added weekly, and existing tools are re-evaluated when they release major updates or new pricing plans.",
  },
  {
    q: "Can I submit a tool for review?",
    a: "Yes! Use our Submit a Tool form to suggest a tool. Our team will evaluate it and add it if it meets our quality criteria.",
  },
  {
    q: "Do you offer affiliate links?",
    a: "Yes, some links on our site are affiliate links. If you click through and make a purchase, we may earn a commission at no extra cost to you. This never affects our reviews or tool rankings.",
  },
  {
    q: "Which categories do you cover?",
    a: "We cover 12 categories: Coding, Writing, SEO, DevOps, Design, Marketing, Productivity, Voice, Video, Analytics, Education, and Customer Service.",
  },
  {
    q: "How can I contact you?",
    a: "You can reach us at hello@heyaihub.com for questions, suggestions, or partnership inquiries.",
  },
];

export default function FaqPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 max-w-3xl mx-auto px-4 py-12">
        <h1 className="text-3xl font-bold mb-4">Frequently Asked Questions</h1>
        <p className="text-gray-600 mb-8">Everything you need to know about Hey AI Hub.</p>
        <div className="space-y-4">
          {faqs.map((item, i) => (
            <details
              key={i}
              className="bg-white rounded-xl border border-gray-200 p-5 group open:bg-gray-50 transition-colors"
            >
              <summary className="font-semibold cursor-pointer text-gray-900">{item.q}</summary>
              <p className="text-sm text-gray-600 mt-3 leading-relaxed">{item.a}</p>
            </details>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}
