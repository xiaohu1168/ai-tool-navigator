"use client";

import { useState } from "react";
import { Eye, Check, X, Pencil } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";

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
}

export default function AdminSubmissions({
  subs,
  categories,
  onStatus,
  onEdit,
  loading,
}: {
  subs: Submission[];
  categories: { id: string; name: string }[];
  onStatus: (id: string, status: "approved" | "rejected") => Promise<void>;
  onEdit: (sub: Submission) => void;
  loading: boolean;
}) {
  const [filter, setFilter] = useState("all");
  const [actioning, setActioning] = useState<string | null>(null);

  const filtered = subs.filter((s) => filter === "all" || s.status === filter);

  const handleStatus = async (sub: Submission, status: "approved" | "rejected") => {
    setActioning(sub.id);
    try {
      await onStatus(sub.id, status);
      toast.success(status === "approved" ? "Tool approved" : "Submission rejected");
    } catch {
      toast.error("Failed to update status");
    } finally {
      setActioning(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="h-24 bg-muted rounded-xl animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filters */}
      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList>
          <TabsTrigger value="all">All ({subs.length})</TabsTrigger>
          <TabsTrigger value="pending">
            Pending ({subs.filter((s) => s.status === "pending").length})
          </TabsTrigger>
          <TabsTrigger value="approved">Approved</TabsTrigger>
          <TabsTrigger value="rejected">Rejected</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Submissions */}
      {filtered.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <Eye className="w-10 h-10 mx-auto mb-3 opacity-30" />
          <p className="text-sm">No submissions found</p>
        </div>
      )}

      <div className="space-y-3">
        {filtered.map((sub) => {
          const cat = categories.find((c) => c.id === sub.category_id);
          return (
            <Card key={sub.id} className="border-border/60 hover:shadow-sm transition-shadow">
              <CardContent className="p-4 md:p-5">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold truncate">{sub.name}</h3>
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
                    {sub.description && (
                      <p className="text-sm text-muted-foreground mb-1 line-clamp-1">{sub.description}</p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      {sub.url && (
                        <a
                          href={sub.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline truncate max-w-[200px]"
                        >
                          {sub.url}
                        </a>
                      )}
                      {cat && <span>Category: {cat.name}</span>}
                      {sub.price && <span>Price: {sub.price}</span>}
                      <span>{new Date(sub.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {sub.status === "pending" && (
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-green-300 text-green-700 hover:bg-green-50"
                        onClick={() => handleStatus(sub, "approved")}
                        disabled={actioning === sub.id}
                      >
                        <Check className="w-3.5 h-3.5 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="h-8 text-xs border-red-300 text-red-700 hover:bg-red-50"
                        onClick={() => handleStatus(sub, "rejected")}
                        disabled={actioning === sub.id}
                      >
                        <X className="w-3.5 h-3.5 mr-1" />
                        Reject
                      </Button>
                      <Button
                        size="sm"
                        className="h-8 text-xs bg-primary hover:bg-primary/90"
                        onClick={() => onEdit(sub)}
                        disabled={actioning === sub.id}
                      >
                        <Pencil className="w-3.5 h-3.5 mr-1" />
                        Edit
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
