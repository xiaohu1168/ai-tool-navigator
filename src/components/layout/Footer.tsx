import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

const sections: FooterSection[] = [
  {
    title: "Top Picks",
    links: [
      { label: "Best Coding Tools", href: "/best/coding" },
      { label: "Best Writing Tools", href: "/best/writing" },
      { label: "Best Design Tools", href: "/best/design" },
      { label: "Best SEO Tools", href: "/best/seo" },
      { label: "Best Marketing Tools", href: "/best/marketing" },
    ],
  },
  {
    title: "Categories",
    links: [
      { label: "Coding", href: "/category/coding" },
      { label: "Writing", href: "/category/writing" },
      { label: "Design", href: "/category/design" },
      { label: "SEO", href: "/category/seo" },
      { label: "Marketing", href: "/category/marketing" },
      { label: "DevOps", href: "/category/devops" },
      { label: "Productivity", href: "/category/productivity" },
      { label: "Video", href: "/category/video" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Blog", href: "/blog" },
      { label: "FAQ", href: "/faq" },
      { label: "Submit a Tool", href: "/submit" },
      { label: "Editorial Policy", href: "/editorial" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 md:py-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-6" />

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="text-sm font-semibold">Hey AI Hub</span>
          </div>
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Hey AI Hub. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <Link href="/sitemap.xml" className="text-xs text-muted-foreground hover:text-foreground">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
