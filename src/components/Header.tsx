"use client";
import Link from "next/link";
import { Search, Menu, X } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  return (
    <header className="border-b border-gray-200 sticky top-0 bg-white z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="text-xl font-bold text-blue-600">
          Hey AI Hub
        </Link>

        {/* Desktop search */}
        <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md mx-8">
          <div className="relative w-full">
            <label htmlFor="header-search" className="sr-only">Search AI tools</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="header-search"
              type="text"
              placeholder="Search AI tools..."
              aria-label="Search AI tools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <button type="submit" className="ml-3 px-3 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 btn-solid">Search</button>
        </form>

        {/* Mobile search bar */}
        <form onSubmit={handleSearch} className="flex md:hidden items-center w-full mx-2 mb-0">
          <div className="relative w-full">
            <label htmlFor="header-search-mobile" className="sr-only">Search AI tools</label>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              id="header-search-mobile"
              type="text"
              placeholder="Search..."
              aria-label="Search AI tools"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </form>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm text-gray-600">
          <Link href="/category/coding" className="hover:text-blue-600">Coding</Link>
          <Link href="/category/writing" className="hover:text-blue-600">Writing</Link>
          <Link href="/best/coding" className="hover:text-blue-600 font-medium text-blue-600">Top Picks</Link>
          <Link href="/blog" className="hover:text-blue-600">Blog</Link>
          <Link href="/submit" className="hover:text-blue-600">Submit Tool</Link>
        </nav>

        {/* Mobile hamburger */}
        <button
          type="button"
          className="md:hidden p-2 text-gray-600 hover:text-blue-600"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile dropdown menu */}
      {menuOpen && (
        <nav className="md:hidden border-t border-gray-200 bg-white px-4 py-4">
          <div className="flex flex-col gap-3 text-sm text-gray-600">
            <Link href="/category/coding" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Coding</Link>
            <Link href="/category/writing" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Writing</Link>
            <Link href="/category/design" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Design</Link>
            <Link href="/category/seo" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>SEO</Link>
            <Link href="/category/marketing" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Marketing</Link>
            <Link href="/blog" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Blog</Link>
            <Link href="/submit" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Submit Tool</Link>
            <Link href="/about" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href="/contact" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>Contact</Link>
            <Link href="/faq" className="hover:text-blue-600 py-1" onClick={() => setMenuOpen(false)}>FAQ</Link>
          </div>
        </nav>
      )}
    </header>
  );
}
