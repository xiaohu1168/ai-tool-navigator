"use client";

import Link from "next/link";
import { Search, Menu, X, ChevronDown, Moon, Sun } from "lucide-react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
  icon: string;
  href: string;
}

const categories: CategoryItem[] = [
  { id: "coding", name: "Coding", icon: "💻", href: "/category/coding" },
  { id: "writing", name: "Writing", icon: "✍️", href: "/category/writing" },
  { id: "design", name: "Design", icon: "🎨", href: "/category/design" },
  { id: "seo", name: "SEO", icon: "🔍", href: "/category/seo" },
  { id: "marketing", name: "Marketing", icon: "📢", href: "/category/marketing" },
  { id: "devops", name: "DevOps", icon: "⚙️", href: "/category/devops" },
  { id: "productivity", name: "Productivity", icon: "📋", href: "/category/productivity" },
  { id: "voice", name: "Voice", icon: "🎙️", href: "/category/voice" },
  { id: "video", name: "Video", icon: "🎬", href: "/category/video" },
  { id: "analytics", name: "Analytics", icon: "📊", href: "/category/analytics" },
  { id: "education", name: "Education", icon: "📚", href: "/category/education" },
  {
    id: "customer-service",
    name: "Customer Service",
    icon: "🤖",
    href: "/category/customer-service",
  },
];

export default function Header() {
  const [searchQuery, setSearchQuery] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const router = useRouter();
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/80 backdrop-blur-lg shadow-sm"
          : "bg-background"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 md:px-6">
        <div className="flex h-14 items-center gap-3 md:gap-4">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 flex-shrink-0"
            aria-label="Hey AI Hub Home"
          >
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-sm">H</span>
            </div>
            <span className="text-lg font-bold text-foreground hidden sm:inline">
              Hey AI Hub
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1 ml-2" aria-label="Main navigation">
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="sm" className="text-sm font-medium gap-1">
                  Categories
                  <ChevronDown className="w-3.5 h-3.5 opacity-50" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-[280px] p-2">
                {categories.map((cat) => (
                  <DropdownMenuItem key={cat.id}>
                    <Link href={cat.href} className="flex items-center gap-3 px-2 py-1.5 w-full">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="text-sm">{cat.name}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Link href="/best/coding">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Top Picks
              </Button>
            </Link>
            <Link href="/blog">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Blog
              </Button>
            </Link>
            <Link href="/submit">
              <Button variant="ghost" size="sm" className="text-sm font-medium">
                Submit Tool
              </Button>
            </Link>
          </nav>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search AI tools..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-9 pl-9 pr-4 text-sm bg-muted/50 border-transparent focus:bg-background focus:border-primary/30"
              />
            </div>
          </form>

          {/* Right Actions */}
          <div className="flex items-center gap-1 flex-shrink-0">
            {/* Theme toggle — visible on all screen sizes */}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" />
              ) : (
                <Moon className="w-4 h-4" />
              )}
            </Button>

            <Link href="/login">
              <Button variant="ghost" size="sm" className="text-sm hidden sm:inline-flex">
                Sign In
              </Button>
            </Link>
            <Link href="/login">
              <Button size="sm" className="text-sm hidden sm:inline-flex">
                Get Started
              </Button>
            </Link>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="icon-sm"
              className="lg:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-border py-4 space-y-1 overflow-y-auto max-h-[70vh]">
            {/* Mobile search */}
            <form onSubmit={handleSearch} className="mb-3 px-1">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
                <Input
                  type="text"
                  placeholder="Search AI tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 h-10"
                />
              </div>
            </form>

            <Link
              href="/best/coding"
              className="block px-3 py-2 text-sm font-medium rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Top Picks
            </Link>
            <Link
              href="/blog"
              className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Blog
            </Link>
            <Link
              href="/submit"
              className="block px-3 py-2 text-sm rounded-md hover:bg-muted"
              onClick={() => setMobileMenuOpen(false)}
            >
              Submit Tool
            </Link>

            <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              Categories
            </div>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-muted"
                onClick={() => setMobileMenuOpen(false)}
              >
                <span>{cat.icon}</span>
                <span>{cat.name}</span>
              </Link>
            ))}

            <div className="flex items-center gap-2 px-3 pt-3">
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark" ? "Switch to light mode" : "Switch to dark mode"
                }
              >
                {theme === "dark" ? (
                  <Sun className="w-4 h-4" />
                ) : (
                  <Moon className="w-4 h-4" />
                )}
              </Button>
              <span className="text-sm text-muted-foreground">
                {theme === "dark" ? "Dark mode" : "Light mode"}
              </span>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
