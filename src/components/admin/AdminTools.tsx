"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Trash2,
  Edit3,
  Search,
  Filter,
  Download,
  Pencil,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
// Removed unused Tooltip imports to avoid nested button hydration error

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
}

interface Category {
  id: string;
  name: string;
  icon: string;
}

function parseArray(val: string | string[]): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (typeof val === 'string') {
    try { const p = JSON.parse(val); return Array.isArray(p) ? p.map(String) : val.split(",").map((s) => s.trim()).filter(Boolean); } catch { return val.split(",").map((s) => s.trim()).filter(Boolean); }
  }
  return [];
}

export default function AdminTools({
  tools,
  categories,
  onSave,
  onDelete,
  loading,
}: {
  tools: Tool[];
  categories: Category[];
  onSave: (tool: Partial<Tool>) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  loading: boolean;
}) {
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Tool | null>(null);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    slug: "",
    name: "",
    description: "",
    url: "",
    price: "Free",
    price_type: "Free",
    rating: "4.0",
    featured: false,
    tags: "",
    pros: "",
    cons: "",
    for_whom: "",
    not_for: "",
    alternatives: "",
    category_id: "",
  });

  // Listen for "add from submission" events from parent
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail as {
        name: string;
        url: string;
        description: string;
        category_id: string;
        price: string;
        tags: string;
      };
      setEditing(null);
      setFormData({
        slug: detail.name.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, ""),
        name: detail.name,
        description: detail.description,
        url: detail.url,
        price: detail.price,
        price_type: "Free",
        rating: "4.0",
        featured: false,
        tags: detail.tags,
        pros: "",
        cons: "",
        for_whom: "General users",
        not_for: "Enterprise teams",
        alternatives: "",
        category_id: detail.category_id,
      });
      setShowForm(true);
    };
    window.addEventListener("admin:addFromSubmission", handler);
    return () => window.removeEventListener("admin:addFromSubmission", handler);
  }, []);

  const openEdit = (tool: Tool) => {
    setEditing(tool);
    setFormData({
      slug: tool.slug,
      name: tool.name,
      description: tool.description,
      url: tool.url,
      price: tool.price,
      price_type: tool.price_type,
      rating: (tool.rating ?? 4).toString(),
      featured: !!tool.featured,
      tags: parseArray(tool.tags).join(", "),
      pros: parseArray(tool.pros).join(", "),
      cons: parseArray(tool.cons).join(", "),
      for_whom: tool.for_whom,
      not_for: tool.not_for,
      alternatives: tool.alternatives,
      category_id: tool.category_id,
    });
    setShowForm(true);
  };

  const openNew = () => {
    setEditing(null);
    setFormData({
      slug: "",
      name: "",
      description: "",
      url: "",
      price: "Free",
      price_type: "Free",
      rating: "4.0",
      featured: false,
      tags: "",
      pros: "",
      cons: "",
      for_whom: "",
      not_for: "",
      alternatives: "",
      category_id: categories[0]?.id ?? "",
    });
    setShowForm(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.url || !formData.category_id) {
      toast.error("Name, URL, and Category are required");
      return;
    }
    setSaving(true);
    try {
      await onSave({
        ...formData,
        rating: parseFloat(formData.rating) || 4.0,
        featured: formData.featured ? 1 : 0,
      });
      setShowForm(false);
      toast.success(editing ? "Tool updated" : "Tool created");
    } catch {
      toast.error("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (tool: Tool) => {
    if (!confirm(`Delete "${tool.name}"?`)) return;
    try {
      await onDelete(tool.id);
      toast.success("Tool deleted");
    } catch {
      toast.error("Failed to delete");
    }
  };

  const filtered = tools.filter((t) => {
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.slug.toLowerCase().includes(search.toLowerCase());
    const matchCat = !catFilter || t.category_id === catFilter;
    return matchSearch && matchCat;
  });

  if (loading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="animate-pulse space-y-3">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-12 bg-muted rounded" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <Card>
        <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4 pointer-events-none" />
            <Input
              placeholder="Search tools..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>
          <Select value={catFilter} onValueChange={(v) => setCatFilter(v || "")}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All categories</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button size="sm" onClick={openNew}>
            <Plus className="w-4 h-4 mr-1.5" /> Add Tool
          </Button>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Clicks</TableHead>
              <TableHead className="w-[120px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((tool) => {
              const cat = categories.find((c) => c.id === tool.category_id);
              return (
                <TableRow key={tool.id}>
                  <TableCell>
                    <div className="font-medium text-sm">{tool.name}</div>
                    <div className="text-xs text-muted-foreground font-mono">{tool.slug}</div>
                  </TableCell>
                  <TableCell className="text-sm">{cat?.name ?? tool.category_id}</TableCell>
                  <TableCell>
                    <Badge
                      variant="secondary"
                      className={
                        tool.price_type === "Free"
                          ? "bg-green-50 text-green-700"
                          : tool.price_type === "Freemium"
                          ? "bg-blue-50 text-blue-700"
                          : "bg-purple-50 text-purple-700"
                      }
                    >
                      {tool.price_type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-500">{"★"}</span>
                      <span className="text-sm">{tool.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right text-sm">{tool.click_count}</TableCell>
                  <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                      {/* Edit button with tooltip overlay */}
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => openEdit(tool)}
                          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] size-7"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-background bg-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Edit
                        </div>
                      </div>
                      {/* Delete button with tooltip overlay */}
                      <div className="relative group">
                        <button
                          type="button"
                          onClick={() => handleDelete(tool)}
                          className="inline-flex items-center justify-center rounded-lg border border-transparent bg-clip-padding text-sm font-medium whitespace-nowrap transition-all outline-none select-none hover:bg-muted hover:text-foreground h-7 gap-1 rounded-[min(var(--radius-md),12px)] px-2.5 text-[0.8rem] size-7 text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-1 px-2 py-1 text-xs text-background bg-foreground rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
                          Delete
                        </div>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                  No tools found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Tool" : "Add New Tool"}</DialogTitle>
          </DialogHeader>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Name *</Label>
              <Input value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
            <div>
              <Label>Slug *</Label>
              <Input value={formData.slug} onChange={(e) => setFormData({ ...formData, slug: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Description *</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                rows={2}
              />
            </div>
            <div>
              <Label>URL *</Label>
              <Input value={formData.url} onChange={(e) => setFormData({ ...formData, url: e.target.value })} />
            </div>
            <div>
              <Label>Category *</Label>
              <Select value={formData.category_id} onValueChange={(v) => setFormData({ ...formData, category_id: v || "" })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select..." />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Price</Label>
              <Input value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} />
            </div>
            <div>
              <Label>Price Type</Label>
              <Select value={formData.price_type} onValueChange={(v) => setFormData({ ...formData, price_type: v || "" })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Free">Free</SelectItem>
                  <SelectItem value="Freemium">Freemium</SelectItem>
                  <SelectItem value="Paid">Paid</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Rating</Label>
              <Input type="number" step="0.1" value={formData.rating} onChange={(e) => setFormData({ ...formData, rating: e.target.value })} />
            </div>
            <div className="flex items-center gap-2 pt-4">
              <Checkbox
                id="featured"
                checked={formData.featured}
                onCheckedChange={(v) => setFormData({ ...formData, featured: !!v })}
              />
              <Label htmlFor="featured" className="text-sm font-medium">Featured</Label>
            </div>
            <div className="md:col-span-2">
              <Label>Tags (comma separated)</Label>
              <Input value={formData.tags} onChange={(e) => setFormData({ ...formData, tags: e.target.value })} placeholder="coding, ai, editor" />
            </div>
            <div>
              <Label>Pros (comma separated)</Label>
              <Textarea value={formData.pros} onChange={(e) => setFormData({ ...formData, pros: e.target.value })} rows={2} placeholder="Fast, Accurate, Easy to use" />
            </div>
            <div>
              <Label>Cons (comma separated)</Label>
              <Textarea value={formData.cons} onChange={(e) => setFormData({ ...formData, cons: e.target.value })} rows={2} placeholder="Expensive, Limited free tier" />
            </div>
            <div>
              <Label>For Whom</Label>
              <Input value={formData.for_whom} onChange={(e) => setFormData({ ...formData, for_whom: e.target.value })} />
            </div>
            <div>
              <Label>Not For</Label>
              <Input value={formData.not_for} onChange={(e) => setFormData({ ...formData, not_for: e.target.value })} />
            </div>
            <div className="md:col-span-2">
              <Label>Alternatives</Label>
              <Input value={formData.alternatives} onChange={(e) => setFormData({ ...formData, alternatives: e.target.value })} />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button>
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
