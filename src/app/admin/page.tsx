"use client";

import { useState, useEffect, useCallback } from "react";
import AdminLayout from "@/components/admin/AdminLayout";
import AdminDashboard from "@/components/admin/AdminDashboard";
import AdminTools from "@/components/admin/AdminTools";
import AdminSubmissions from "@/components/admin/AdminSubmissions";
import AdminCategories from "@/components/admin/AdminCategories";
import AdminAnalytics from "@/components/admin/AdminAnalytics";
import AdminUsers from "@/components/admin/AdminUsers";
import AdminBlog from "@/components/admin/AdminBlog";
import { toast } from "sonner";

// Cookie auto-included via credentials: 'include'
function authFetch(url: string, options: RequestInit = {}): Promise<Response> {
  return fetch(url, {
    ...options,
    credentials: "include",
    headers: {
      ...options.headers,
      "Content-Type": "application/json",
    },
  });
}

interface Tool {
  id: string;
  slug: string;
  name: string;
  description: string;
  url: string;
  price: string;
  price_type: string;
  rating: number;
  featured: number;
  tags: string;
  pros: string;
  cons: string;
  for_whom: string;
  not_for: string;
  alternatives: string;
  category_id: string;
  click_count: number;
  created_at?: string;
  updated_at?: string;
  price_count?: number;
}

interface Submission {
  id: string;
  name: string;
  url: string;
  description: string;
  category_id: string;
  price: string | null;
  tags: string | null;
  status: string;
  created_at: string;
  updated_at?: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

interface PageStats {
  total_views: number;
  tool_clicks: { slug: string; count: number }[];
  search_queries: { query: string; count: number }[];
}

interface DbUser {
  id: string;
  username: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: string | null;
  createdAt: string;
  updatedAt: string;
}

interface BlogPost {
  id: string;
  slug: string;
  title: string;
  content: string;
  category: string;
  date: string;
  views: number;
  created_at?: string;
  updated_at?: string;
}

export default function AdminPage() {
  const [loading, setLoading] = useState(true);
  const [tools, setTools] = useState<Tool[]>([]);
  const [subs, setSubs] = useState<Submission[]>([]);
  const [cats, setCats] = useState<Category[]>([]);
  const [stats, setStats] = useState<PageStats | null>(null);
  const [users, setUsers] = useState<DbUser[]>([]);
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [currentUserRole, setCurrentUserRole] = useState<string>("");
  const [activeSection, setActiveSection] = useState<"overview" | "tools" | "submissions" | "categories" | "blog" | "analytics" | "users">("overview");

  // Sync activeSection from URL hash on mount and hash change
  useEffect(() => {
    const fromHash = (): "overview" | "tools" | "submissions" | "categories" | "blog" | "analytics" | "users" => {
      const hash = window.location.hash.replace("#", "") as typeof activeSection;
      if (["tools", "submissions", "categories", "blog", "analytics", "users"].includes(hash)) return hash;
      return "overview";
    };
    setActiveSection(fromHash());

    const handler = () => setActiveSection(fromHash());
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);

  // Update URL hash when activeSection changes (for deep-linking / sidebar nav)
  useEffect(() => {
    const hash = activeSection === "overview" ? "" : `#${activeSection}`;
    if (window.location.hash !== hash) {
      history.replaceState(null, "", hash || "/admin");
    }
  }, [activeSection]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [tRes, sRes, cRes, stRes, uRes, meRes, bRes] = await Promise.all([
        authFetch("/api/tools"),
        authFetch("/api/admin-submissions"),
        authFetch("/api/categories"),
        authFetch("/api/stats"),
        authFetch("/api/users"),
        authFetch("/api/auth/me"),
        authFetch("/api/blog"),
      ]);

      if (!tRes.ok || !sRes.ok || !cRes.ok || !stRes.ok) {
        if (tRes.status === 401 && sRes.status === 401 && cRes.status === 401) {
          window.location.href = "/login";
          return;
        }
        toast.error("Failed to load data. Please try refreshing.");
        setLoading(false);
        return;
      }

      const [t, s, c, st, usersData, meData, bData] = await Promise.all([
        tRes.json(), sRes.json(), cRes.json(), stRes.json(),
        uRes.json(), meRes.json(), bRes.json(),
      ]);

      setTools(t);
      setSubs(s);
      setCats(c);
      setStats(st as PageStats);
      setUsers(usersData as DbUser[]);
      setBlogPosts(bData as BlogPost[]);
      setCurrentUserId((meData as DbUser | null)?.id ?? null);
      setCurrentUserRole((meData as DbUser | null)?.role ?? "");
    } catch {
      toast.error("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleLogout = async () => {
    try {
      await authFetch("/api/auth/logout", { method: "POST" });
    } catch {
      // ignore logout errors
    }
    window.location.href = "/login";
  };

  // ── Tool CRUD handlers ──────────────────────────────
  const handleSaveTool = async (toolData: Partial<Tool>) => {
    try {
      await authFetch("/api/tools", {
        method: "POST",
        body: JSON.stringify({
          ...toolData,
          rating: parseFloat(toolData.rating?.toString() ?? "4") || 4,
          featured: toolData.featured ? 1 : 0,
        }),
      });
      await fetchData();
      toast.success(toolData.id ? "Tool updated" : "Tool created");
    } catch {
      toast.error("Failed to save tool");
    }
  };

  const handleDeleteTool = async (id: string) => {
    await authFetch(`/api/tools?id=${id}`, { method: "DELETE" });
    await fetchData();
  };

  // ── Submission handlers ─────────────────────────────
  const handleSubmissionStatus = async (id: string, status: "approved" | "rejected") => {
    await authFetch("/api/admin-submissions", {
      method: "POST",
      body: JSON.stringify({ id, status }),
    });
    setSubs((prev) => prev.map((s) => (s.id === id ? { ...s, status } : s)));
  };

  const handleEditSubmission = (sub: Submission) => {
    // Switch to tools tab, open form pre-filled from submission
    setActiveSection("tools");
    // Delay to let the tools tab render before opening the form
    setTimeout(() => {
      const event = new CustomEvent("admin:addFromSubmission", {
        detail: {
          name: sub.name,
          url: sub.url,
          description: sub.description,
          category_id: sub.category_id,
          price: (sub.price as string) || "Free",
          tags: (sub.tags as string) || "",
        },
      });
      window.dispatchEvent(event);
    }, 100);
  };

  const pendingCount = subs.filter((s) => s.status === "pending").length;

  // ── Blog CRUD handlers ────────────────────────────
  const handleSaveBlogPost = async (postData: Partial<BlogPost>) => {
    try {
      const titleSlug = postData.title
        ? postData.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
        : `post-${Date.now()}`;
      const method = postData.slug ? "PUT" : "POST";
      const body = {
        slug: postData.slug || titleSlug,
        title: postData.title || "",
        content: postData.content || "",
        category: postData.category || "General",
        date: postData.date || new Date().toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" }),
      };
      await authFetch("/api/blog", { method, body: JSON.stringify(body) });
      await fetchData();
      toast.success(postData.slug ? "Post updated" : "Post created");
    } catch {
      toast.error("Failed to save post");
    }
  };

  const handleDeleteBlogPost = async (slug: string) => {
    try {
      await authFetch(`/api/blog?slug=${encodeURIComponent(slug)}`, { method: "DELETE" });
      setBlogPosts((prev) => prev.filter((p) => p.slug !== slug));
      toast.success("Post deleted");
    } catch {
      toast.error("Failed to delete post");
    }
  };

  return (
    <AdminLayout
      pendingSubmissions={pendingCount}
      onLogout={handleLogout}
      onSectionChange={(section) => {
        setActiveSection(section as typeof activeSection);
      }}
      currentUserRole={currentUserRole}
    >
      {activeSection === "overview" && (
        <AdminDashboard
          tools={tools}
          subs={subs}
          cats={cats}
          stats={stats}
          loading={loading}
        />
      )}

      {activeSection === "tools" && (
        <AdminTools
          tools={tools}
          categories={cats}
          onSave={handleSaveTool}
          onDelete={handleDeleteTool}
          loading={loading}
        />
      )}

      {activeSection === "submissions" && (
        <AdminSubmissions
          subs={subs}
          categories={cats}
          onStatus={handleSubmissionStatus}
          onEdit={handleEditSubmission}
          loading={loading}
        />
      )}

      {activeSection === "categories" && (
        <AdminCategories
          categories={cats}
          loading={loading}
        />
      )}

      {activeSection === "analytics" && (
        <AdminAnalytics
          stats={stats}
          loading={loading}
        />
      )}

      {activeSection === "users" && (
        <AdminUsers
          users={users}
          currentUserId={currentUserId}
          currentUserRole={currentUserRole}
          loading={loading}
        />
      )}

      {activeSection === "blog" && (
        <AdminBlog
          posts={blogPosts}
          onSave={handleSaveBlogPost}
          onDelete={handleDeleteBlogPost}
          loading={loading}
        />
      )}
    </AdminLayout>
  );
}
