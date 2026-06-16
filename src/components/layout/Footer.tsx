"use client";

import Link from "next/link";
import { Separator } from "@/components/ui/separator";
import { X, Globe, Mail } from "lucide-react";

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

const socialLinks = [
  { icon: X, href: "https://twitter.com/heyaihub", label: "X (Twitter)" },
  { icon: Globe, href: "/", label: "Website" },
];

export default function Footer() {
  return (
    <footer className="border-t border-border bg-muted/30 mt-auto">
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
        {/* Newsletter Section */}
        <div className="py-10 md:py-14">
          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-6 md:p-8 text-center">
            <Mail className="w-8 h-8 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Stay Updated
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md mx-auto">
              Get weekly updates on the latest AI tools and industry insights delivered to your inbox.
            </p>
            <form
              onSubmit={async (e) => {
                e.preventDefault();
                const form = e.currentTarget;
                const emailInput = form.querySelector("input[type='email']") as HTMLInputElement;
                const btn = form.querySelector("button");
                if (!emailInput || !btn) return;

                btn.disabled = true;
                btn.textContent = "Sending...";

                try {
                  const res = await fetch("/api/newsletter", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ email: emailInput.value }),
                  });

                  if (res.ok) {
                    btn.textContent = "✓ Subscribed!";
                    emailInput.value = "";
                  } else {
                    btn.textContent = "Already subscribed!";
                  }
                } catch {
                  btn.textContent = "Error, try again";
                }

                setTimeout(() => {
                  btn.textContent = "Subscribe";
                  btn.disabled = false;
                }, 3000);
              }}
              className="flex max-w-sm mx-auto gap-2"
            >
              <input
                type="email"
                placeholder="your@email.com"
                required
                className="flex-1 px-4 py-2 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Link Sections */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 py-12 md:py-16">
          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-sm text-foreground mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2.5" role="list">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
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

        {/* Bottom Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-6">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <span className="text-sm font-semibold">Hey AI Hub</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-3">
            {socialLinks.map(({ icon: Icon, href, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="text-muted-foreground hover:text-primary transition-colors duration-200"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
              Sitemap
            </Link>
            <span>
              © {new Date().getFullYear()} Hey AI Hub. All rights reserved.
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
