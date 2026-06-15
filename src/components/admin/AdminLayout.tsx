"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Monitor,
  Inbox,
  FolderOpen,
  BarChart3,
  Users,
  LogOut,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
  minRole?: string; // Minimum role required to see this nav item
}

interface AdminLayoutProps {
  children: React.ReactNode;
  pendingSubmissions?: number;
  onLogout?: () => void;
  onSectionChange?: (section: string) => void;
  currentUserRole?: string;
}

const navItems = (
  pendingSubmissions?: number,
  currentUserRole?: string
): AdminNavItem[] => {
  const roleLevel = (role: string | undefined) => {
    const levels: Record<string, number> = { EDITOR: 1, ADMIN: 2, SUPER_ADMIN: 3 };
    return levels[role ?? "EDITOR"] ?? 0;
  };

  const userLevel = roleLevel(currentUserRole);

  return [
    { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" />, href: "/admin" },
    { id: "tools", label: "Tools", icon: <Monitor className="w-4 h-4" />, href: "/admin#tools", minRole: "ADMIN" },
    { id: "submissions", label: "Submissions", icon: <Inbox className="w-4 h-4" />, href: "/admin#submissions", badge: pendingSubmissions, minRole: "ADMIN" },
    { id: "categories", label: "Categories", icon: <FolderOpen className="w-4 h-4" />, href: "/admin#categories", minRole: "ADMIN" },
    { id: "blog", label: "Blog", icon: <FileText className="w-4 h-4" />, href: "/admin#blog", minRole: "ADMIN" },
    { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, href: "/admin#analytics", minRole: "ADMIN" },
    { id: "users", label: "Users", icon: <Users className="w-4 h-4" />, href: "/admin#users", minRole: "ADMIN" },
  ].filter((item) => {
    // If no minRole specified, show to all
    if (!item.minRole) return true;
    const requiredLevel = roleLevel(item.minRole);
    return userLevel >= requiredLevel;
  });
};

export default function AdminLayout({
  children,
  pendingSubmissions,
  onLogout,
  onSectionChange,
  currentUserRole,
}: AdminLayoutProps) {
  const pathname = usePathname();
  const items = navItems(pendingSubmissions, currentUserRole);

  const [activeNav, setActiveNav] = useState<AdminNavItem | undefined>(undefined);

  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash) {
      const found = items.find((i) => i.href === `/admin#${hash}`);
      if (found) { setActiveNav(found); return; }
    }
    setActiveNav(items.find((i) => pathname === i.href || (pathname === "/admin" && i.id === "overview")));
  }, [pathname, items.length, items[0]?.id]); // stable: only depends on nav structure, not array identity

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-background flex flex-col">
        {/* Sidebar Header */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-xs">H</span>
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-semibold leading-none">Hey AI Hub</span>
              <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {items.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              onClick={(e) => {
                if (onSectionChange) {
                  e.preventDefault();
                  if (item.href.startsWith("/admin#")) {
                    const section = item.href.replace("/admin#", "");
                    onSectionChange(section);
                  } else {
                    onSectionChange("overview");
                  }
                }
              }}
              className={cn(
                "flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors",
                activeNav?.id === item.id
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <Badge variant="destructive" className="h-4 min-w-4 px-1 text-[10px]">
                  {item.badge}
                </Badge>
              )}
            </Link>
          ))}
        </nav>

        {/* Sidebar Footer */}
        <div className="border-t border-border p-2">
          <div className="flex items-center gap-2 rounded-lg px-3 py-2">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <span className="text-xs font-semibold">
                {currentUserRole ? currentUserRole.charAt(0) : "A"}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">
                {currentUserRole ? currentUserRole.replace("_", " ") : "Admin"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {currentUserRole === "SUPER_ADMIN" ? "Super Administrator" : currentUserRole === "ADMIN" ? "Administrator" : "Editor"}
              </p>
            </div>
            {onLogout ? (
              <Button variant="ghost" size="icon-sm" className="h-6 w-6" onClick={onLogout} title="Sign out">
                <LogOut className="w-3 h-3" />
              </Button>
            ) : (
              <Button variant="ghost" size="icon-sm" className="h-6 w-6" disabled>
                <LogOut className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64 flex-1 flex flex-col min-h-screen">
        {/* Top Bar */}
        <header className="sticky top-0 z-30 h-14 border-b border-border bg-background/80 backdrop-blur-sm flex items-center px-6 gap-4">
          <div className="flex-1">
            {activeNav ? (
              <div className="flex items-center gap-2 text-sm">
                <span className="text-muted-foreground">Admin</span>
                <span className="text-muted-foreground/50">›</span>
                <span className="font-medium text-foreground">{activeNav.label}</span>
              </div>
            ) : (
              <span className="font-medium text-foreground">Admin</span>
            )}
          </div>

          {/* Role Badge */}
          {currentUserRole && (
            <Badge variant="secondary" className="text-xs">
              {currentUserRole.replace("_", " ")}
            </Badge>
          )}
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
