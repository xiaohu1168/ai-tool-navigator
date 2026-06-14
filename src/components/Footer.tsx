import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          <div>
            <h3 className="font-semibold mb-3 text-sm">Top Picks</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/best/coding" className="hover:text-blue-600">Best Coding Tools</Link></li>
              <li><Link href="/best/writing" className="hover:text-blue-600">Best Writing Tools</Link></li>
              <li><Link href="/best/design" className="hover:text-blue-600">Best Design Tools</Link></li>
              <li><Link href="/best/seo" className="hover:text-blue-600">Best SEO Tools</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Categories</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/category/coding" className="hover:text-blue-600">Coding</Link></li>
              <li><Link href="/category/writing" className="hover:text-blue-600">Writing</Link></li>
              <li><Link href="/category/design" className="hover:text-blue-600">Design</Link></li>
              <li><Link href="/category/seo" className="hover:text-blue-600">SEO</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">More</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/category/marketing" className="hover:text-blue-600">Marketing</Link></li>
              <li><Link href="/category/devops" className="hover:text-blue-600">DevOps</Link></li>
              <li><Link href="/category/productivity" className="hover:text-blue-600">Productivity</Link></li>
              <li><Link href="/category/video" className="hover:text-blue-600">Video</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-3 text-sm">Resources</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><Link href="/blog" className="hover:text-blue-600">Blog</Link></li>
              <li><Link href="/faq" className="hover:text-blue-600">FAQ</Link></li>
              <li><Link href="/submit" className="hover:text-blue-600">Submit a Tool</Link></li>
              <li><Link href="/about" className="hover:text-blue-600">About</Link></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-gray-200 mt-6 md:mt-8 pt-6 md:pt-8 text-center text-xs md:text-sm text-gray-500">
          2026 Hey AI Hub. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
