"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Monitor,
  Inbox,
  FolderOpen,
  FileText,
  BarChart3,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";

interface AdminNavItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: number;
}

const navItems: AdminNavItem[] = [
  { id: "overview", label: "Overview", icon: <LayoutDashboard className="w-4 h-4" />, href: "/admin" },
  { id: "tools", label: "Tools", icon: <Monitor className="w-4 h-4" />, href: "/admin#tools" },
  { id: "submissions", label: "Submissions", icon: <Inbox className="w-4 h-4" />, href: "/admin#submissions", badge: 0 },
  { id: "categories", label: "Categories", icon: <FolderOpen className="w-4 h-4" />, href: "/admin#categories" },
  { id: "blog", label: "Blog", icon: <FileText className="w-4 h-4" />, href: "/admin#blog" },
  { id: "analytics", label: "Analytics", icon: <BarChart3 className="w-4 h-4" />, href: "/admin#analytics" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const activeNav = navItems.find((item) =>
    pathname === item.href || (pathname === "/admin" && item.id === "overview")
  );

  return (
    <div className="min-h-screen bg-muted/30 flex">
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 z-40 h-screen w-64 border-r border-border bg-background flex flex-col">
        {/* Sidebar Header */}
        <div className="flex h-14 items-center gap-2 border-b border-border px-4">
          <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center flex-shrink-0">
            <span className="text-white font-bold text-xs">H</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none">Hey AI Hub</span>
            <span className="text-[10px] text-muted-foreground leading-none mt-0.5">Admin Panel</span>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
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
              <span className="text-xs font-semibold">A</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium truncate">Admin</p>
              <p className="text-[10px] text-muted-foreground truncate">admin@heyaihub.com</p>
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button variant="ghost" size="icon-sm" className="h-6 w-6">
                  <ChevronDown className="w-3 h-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="text-danger">
                  <LogOut className="w-4 h-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50" />
                <span className="font-medium text-foreground">{activeNav.label}</span>
              </div>
            ) : (
              <span className="font-medium text-foreground">Admin</span>
            )}
          </div>

          {/* Search */}
          <div className="relative w-64 hidden md:block">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground w-3.5 h-3.5 pointer-events-none" />
            <Input
              placeholder="Search..."
              className="h-8 pl-8 text-sm bg-muted/50"
            />
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
