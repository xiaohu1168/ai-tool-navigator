"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";

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
        <div className="h-40 bg-muted rounded-xl animate-pulse" />
        <div className="h-64 bg-muted rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!stats) return <div className="text-muted-foreground text-sm text-center py-12">No data</div>;

  return (
    <div className="space-y-6">
      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-blue-600">{stats.total_views.toLocaleString()}</p>
            <p className="text-sm text-muted-foreground mt-1">Total Page Views</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-green-600">
              {stats.tool_clicks.reduce((s, c) => s + c.count, 0).toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground mt-1">Total Tool Clicks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <p className="text-3xl font-bold text-purple-600">{stats.search_queries.length}</p>
            <p className="text-sm text-muted-foreground mt-1">Unique Searches</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="clicks">
        <TabsList>
          <TabsTrigger value="clicks">Top Clicked Tools</TabsTrigger>
          <TabsTrigger value="search">Top Search Queries</TabsTrigger>
        </TabsList>

        <TabsContent value="clicks">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Clicked Tools</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.tool_clicks.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No click data yet</p>
              )}
              <div className="space-y-2">
                {stats.tool_clicks.map((c, i) => (
                  <div key={c.slug} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                    <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center p-0 text-[10px]">
                      #{i + 1}
                    </Badge>
                    <span className="text-sm flex-1 font-medium">{c.slug}</span>
                    <span className="text-sm font-semibold">{c.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="search">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Most Searched Queries</CardTitle>
            </CardHeader>
            <CardContent>
              {stats.search_queries.length === 0 && (
                <p className="text-sm text-muted-foreground py-8 text-center">No search data yet</p>
              )}
              <div className="space-y-2">
                {stats.search_queries.map((s, i) => (
                  <div key={s.query} className="flex items-center gap-3 py-2 border-b border-border/40 last:border-0">
                    <Badge variant="secondary" className="w-6 h-6 flex items-center justify-center p-0 text-[10px]">
                      #{i + 1}
                    </Badge>
                    <span className="text-sm flex-1">{s.query}</span>
                    <span className="text-sm font-semibold">{s.count.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
