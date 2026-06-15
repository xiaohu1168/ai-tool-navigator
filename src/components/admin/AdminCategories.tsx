"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
} from "@/components/ui/card";

interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
  count: number;
}

export default function AdminCategories({
  categories,
  loading,
}: {
  categories: Category[];
  loading: boolean;
}) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="h-32 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">Categories</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage your tool categories and view tools in each
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/best/${cat.id}`}
            className="block group"
          >
            <Card className="border-border/60 hover:shadow-md hover:border-primary/30 transition-all h-full">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-2xl">{cat.icon}</span>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{cat.name}</h3>
                </div>
                {cat.description && (
                  <p className="text-sm text-muted-foreground">{cat.description}</p>
                )}
                <p className="text-xs text-muted-foreground mt-3 flex items-center gap-1">
                  {cat.count} tools
                  <span className="opacity-0 group-hover:opacity-100 transition-opacity text-primary">→</span>
                </p>
              </CardContent>
            </Card>
          </Link>
        ))}
        {categories.length === 0 && (
          <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
            No categories found
          </div>
        )}
      </div>
    </div>
  );
}
