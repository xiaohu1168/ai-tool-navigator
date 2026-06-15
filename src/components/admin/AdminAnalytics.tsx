"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Eye,
  MousePointerClick,
  Search,
  TrendingUp,
  BarChart3,
  Clock,
} from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

interface PageStats {
  total_views: number;
  tool_clicks: { slug: string; count: number }[];
  search_queries: { query: string; count: number }[];
}

export default function AdminAnalytics({
  stats,
  loading,
}: {
  stats: PageStats | null;
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="h-8 w-8 bg-muted rounded-lg animate-pulse mb-2" />
                <div className="h-6 w-16 bg-muted rounded animate-pulse mb-1" />
                <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              </CardContent>
            </Card>
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardContent className="p-6">
              <div className="h-[280px] w-full bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="h-[280px] w-full bg-muted rounded animate-pulse" />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const totalViews = stats?.total_views ?? 0;
  const totalClicks = (stats?.tool_clicks ?? []).reduce((s, c) => s + (c.count ?? 0), 0);
  const uniqueSearches = (stats?.search_queries ?? []).length;

  const clickChartData = (stats?.tool_clicks ?? [])
    .slice(0, 10)
    .map((c) => ({ name: c.slug, clicks: c.count }))
    .filter(Boolean);

  const searchData = (stats?.search_queries ?? [])
    .slice(0, 10)
    .map((s) => ({ name: s.query, count: s.count }))
    .filter(Boolean);

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Analytics</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track page views, tool clicks, and search trends
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border-blue-200/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-blue-50 text-blue-600">
                <Eye className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalViews.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Page Views</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-green-200/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-green-50 text-green-600">
                <MousePointerClick className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{totalClicks.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Total Tool Clicks</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-purple-200/50 shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-lg bg-purple-50 text-purple-600">
                <Search className="w-5 h-5" />
              </div>
              <div>
                <p className="text-2xl font-bold">{uniqueSearches}</p>
                <p className="text-xs text-muted-foreground">Unique Searches</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
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
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.slice(0, 12)}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
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

        <Card className="shadow-sm">
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
                  <XAxis
                    dataKey="name"
                    tick={{ fontSize: 11 }}
                    tickFormatter={(v) => v.slice(0, 14)}
                  />
                  <YAxis tick={{ fontSize: 11 }} />
                  <Tooltip
                    contentStyle={{
                      fontSize: 12,
                      borderRadius: 8,
                      border: "none",
                      boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    }}
                  />
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

      {/* Top Clicked Tools Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <MousePointerClick className="w-4 h-4 text-blue-600" />
            Most Clicked Tools
          </CardTitle>
          <CardDescription>
            {(stats?.tool_clicks ?? []).length} tools tracked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {(stats?.tool_clicks ?? [])
              .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
              .slice(0, 15)
              .map((c, i) => {
                const maxCount = (stats?.tool_clicks ?? [])[0]?.count ?? 1;
                const barWidth = maxCount > 0 ? ((c.count ?? 0) / maxCount) * 100 : 0;
                return (
                  <div
                    key={c.slug}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="w-6 text-center text-xs font-medium text-muted-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">{c.slug}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-blue-500 rounded-full transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="min-w-[60px] justify-center tabular-nums"
                    >
                      {(c.count ?? 0).toLocaleString()}
                    </Badge>
                  </div>
                );
              })}
            {(stats?.tool_clicks ?? []).length === 0 && (
              <p className="text-center py-8 text-muted-foreground text-sm">No click data yet</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Top Search Queries Table */}
      <Card className="shadow-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Search className="w-4 h-4 text-purple-600" />
            Most Searched Queries
          </CardTitle>
          <CardDescription>
            {uniqueSearches} unique queries tracked
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-1">
            {(stats?.search_queries ?? [])
              .sort((a, b) => (b.count ?? 0) - (a.count ?? 0))
              .slice(0, 15)
              .map((s, i) => {
                const maxCount = (stats?.search_queries ?? [])[0]?.count ?? 1;
                const barWidth = maxCount > 0 ? ((s.count ?? 0) / maxCount) * 100 : 0;
                return (
                  <div
                    key={s.query}
                    className="flex items-center gap-3 py-2.5 px-2 rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <span className="w-6 text-center text-xs font-medium text-muted-foreground tabular-nums">
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm truncate">{s.query}</span>
                      </div>
                      <div className="mt-1 h-1.5 w-full bg-muted/50 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-purple-500 rounded-full transition-all"
                          style={{ width: `${barWidth}%` }}
                        />
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="min-w-[60px] justify-center tabular-nums"
                    >
                      {(s.count ?? 0).toLocaleString()}
                    </Badge>
                  </div>
                );
              })}
            {(stats?.search_queries ?? []).length === 0 && (
              <p className="text-center py-8 text-muted-foreground text-sm">No search data yet</p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
