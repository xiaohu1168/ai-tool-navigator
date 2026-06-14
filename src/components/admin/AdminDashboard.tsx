"use client";

import { useState, useMemo } from "react";
import {
  Eye,
  MousePointerClick,
  Wrench,
  FileText,
  Clock,
  TrendingUp,
  Users,
  BarChart3,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart,
  Bar,
  ResponsiveContainer,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface StatsData {
  total_views: number;
  tool_clicks: { slug: string; count: number }[];
  search_queries: { query: string; count: number }[];
}

interface Tool {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  click_count: number;
}

interface Submission {
  id: string;
  name: string;
  status: string;
  created_at: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
  icon: string;
  count: number;
}

const statsByCategory = [
  { key: "coding", label: "Coding", color: "#0b5fff" },
  { key: "writing", label: "Writing", color: "#6366f1" },
  { key: "design", label: "Design", color: "#f59e0b" },
  { key: "seo", label: "SEO", color: "#10b981" },
  { key: "marketing", label: "Marketing", color: "#ec4899" },
  { key: "devops", label: "DevOps", color: "#64748b" },
];

export default function AdminDashboard({
  tools,
  subs,
  cats,
  stats,
  loading,
}: {
  tools: Tool[];
  subs: Submission[];
  cats: Category[];
  stats: StatsData | null;
  loading: boolean;
}) {
  const totalViews = stats?.total_views ?? 0;
  const totalClicks = tools.reduce((s, t) => s + (t.click_count || 0), 0);
  const pendingSubs = subs.filter((s) => s.status === "pending").length;

  // Chart data from clicks
  const clickChartData = stats?.tool_clicks
    ?.slice(0, 10)
    .map((c) => ({ name: c.slug, clicks: c.count }))
    .filter(Boolean) ?? [];

  // Search query data
  const searchData = stats?.search_queries
    ?.slice(0, 10)
    .map((s) => ({ name: s.query, count: s.count }))
    .filter(Boolean) ?? [];

  const toolsByCategory = useMemo(() => {
    return statsByCategory.map((cat) => ({
      ...cat,
      count: tools.filter((t) => t.category_id === cat.key).length,
    }));
  }, [tools]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <Skeleton className="h-8 w-8 mb-2" />
                <Skeleton className="h-6 w-16 mb-1" />
                <Skeleton className="h-4 w-24" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[280px] w-full" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <Skeleton className="h-[280px] w-full" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-50 text-green-600">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-purple-50 text-purple-600">
                <FileText className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{pendingSubs}</p>
                <p className="text-xs text-muted-foreground">Pending Reviews</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                <Wrench className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tools.length}</p>
                <p className="text-xs text-muted-foreground">Total Tools</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-blue-600" />
              Top Clicked Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            {clickChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={clickChartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(0, 12)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{ fontSize: 12, borderRadius: 8 }}
                  />
                  <Bar dataKey="clicks" fill="#0b5fff" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                No click data yet
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              Top Search Queries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {searchData.length > 0 ? (
              <ResponsiveContainer width="100%" height={260}>
                <BarChart data={searchData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis dataKey="name" tick={{ fontSize: 11 }} tickFormatter={(v) => v.slice(0, 14)} />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8 }} />
                  <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-[260px] flex items-center justify-center text-muted-foreground text-sm">
                No search data yet
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Submissions Table */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Recent Submissions</CardTitle>
          <CardDescription>{subs.length} total submissions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {subs.slice(0, 5).map((sub) => (
              <div key={sub.id} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                <div className="flex items-center gap-3">
                  <span className="font-medium text-sm">{sub.name}</span>
                  <Badge
                    variant="secondary"
                    className={
                      sub.status === "pending"
                        ? "bg-yellow-50 text-yellow-700"
                        : sub.status === "approved"
                        ? "bg-green-50 text-green-700"
                        : "bg-red-50 text-red-700"
                    }
                  >
                    {sub.status}
                  </Badge>
                </div>
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {new Date(sub.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
            {subs.length === 0 && (
              <div className="text-center py-8 text-muted-foreground text-sm">
                No submissions yet
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Tools by Category */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium">Tools by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
            {toolsByCategory.map((cat) => (
              <div key={cat.key} className="text-center p-3 rounded-lg bg-muted/50">
                <p className="text-lg font-bold" style={{ color: cat.color }}>
                  {cat.count}
                </p>
                <p className="text-[11px] text-muted-foreground">{cat.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
