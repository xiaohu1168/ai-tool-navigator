"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
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
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {categories.map((cat) => (
        <Card key={cat.id} className="border-border/60 hover:shadow-md transition-shadow">
          <CardContent className="p-5">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="font-semibold text-lg">{cat.name}</h3>
            </div>
            {cat.description && (
              <p className="text-sm text-muted-foreground">{cat.description}</p>
            )}
            <p className="text-xs text-muted-foreground mt-3">{cat.count} tools</p>
          </CardContent>
        </Card>
      ))}
      {categories.length === 0 && (
        <div className="col-span-full text-center py-16 text-muted-foreground text-sm">
          No categories found
        </div>
      )}
    </div>
  );
}
