import Link from "next/link";
import { Star, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { Tool } from "@/lib/tools";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <div className="border border-gray-200 rounded-xl p-4 md:p-5 hover:shadow-lg transition-shadow group">
      <div className="flex items-start justify-between mb-2">
        <h3 className="font-semibold text-base md:text-lg group-hover:text-blue-600">
          <Link href={`/tools/${tool.slug}`}>{tool.name}</Link>
        </h3>
        {tool.featured && <Badge className="bg-yellow-100 text-yellow-800 text-xs">Featured</Badge>}
      </div>
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">{tool.description}</p>
      <div className="flex items-center gap-2 mb-3">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={"w-3.5 h-3.5 " + (star <= Math.round(tool.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300")}
          />
        ))}
        <span className="text-xs text-gray-500 ml-1">{tool.rating}</span>
      </div>
      <div className="flex flex-wrap gap-1 mb-3">
        {tool.tags.slice(0, 3).map((tag: string) => (
          <span key={tag} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
            {tag}
          </span>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{tool.price}</span>
        <div className="flex gap-2">
          <Link
            href={`/tools/${tool.slug}`}
            className="text-xs text-blue-600 hover:underline"
          >
            Review
          </Link>
          <a
            href={tool.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-600 hover:underline text-xs"
          >
            Visit <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </div>
  );
}