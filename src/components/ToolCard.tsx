import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Tool } from "@/lib/tools";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  const hasValidUrl = tool.url && (tool.url.startsWith("http://") || tool.url.startsWith("https://"));

  return (
    <div className="group relative border border-border/60 rounded-xl overflow-hidden hover:shadow-lg hover:border-primary/20 transition-all duration-200 bg-card">
      {/* Top accent line */}
      <div className="h-0.5 bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity" />

      <div className="p-4 md:p-5">
        {/* Header */}
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-base md:text-lg group-hover:text-primary transition-colors line-clamp-1">
            <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
          </h3>
          {tool.featured && (
            <Badge variant="secondary" className="bg-yellow-50 text-yellow-700 border-yellow-200 text-[10px] px-1.5 py-0 h-5">
              Featured
            </Badge>
          )}
        </div>

        {/* Description */}
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2 leading-relaxed">
          {tool.description}
        </p>

        {/* Rating */}
        <div className="flex items-center gap-1.5 mb-3">
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                className={`w-3.5 h-3.5 ${star <= Math.round(tool.rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
              />
            ))}
          </div>
          <span className="text-xs text-muted-foreground font-medium">{tool.rating}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {tool.tags.slice(0, 3).map((tag: string) => (
            <span key={tag} className="text-[11px] bg-muted text-muted-foreground px-2 py-0.5 rounded-md">
              {tag}
            </span>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t border-border/40">
          <span className="text-xs font-medium text-muted-foreground">{tool.price}</span>
          <div className="flex items-center gap-2">
            <Link
              href={`/tools/${tool.slug}`}
              className="text-xs font-medium text-primary hover:underline"
            >
              Review
            </Link>
            {hasValidUrl ? (
              <a
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
              >
                Visit <ExternalLink className="w-3 h-3" />
              </a>
            ) : (
              <Link
                href={`/tools/${tool.slug}`}
                className="flex items-center gap-1 text-xs font-medium text-muted-foreground"
              >
                Details <ExternalLink className="w-3 h-3" />
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
