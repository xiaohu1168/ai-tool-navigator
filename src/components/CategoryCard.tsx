import Link from "next/link";
interface CategoryCardProps { category: { id: string; name: string; icon: string; description: string; count: number }; }
export default function CategoryCard({ category }: CategoryCardProps) {
  const href = "/category/" + category.id;
  return (
    <Link href={href} className="block border border-gray-200 rounded-xl p-3 md:p-5 hover:shadow-md transition-shadow hover:border-blue-300 group">
      <div className="text-2xl md:text-3xl mb-1 md:mb-2">{category.icon}</div>
      <h3 className="font-semibold text-sm md:text-base group-hover:text-blue-600 mb-0.5 md:mb-1">{category.name}</h3>
      <p className="text-xs text-gray-500 mb-1 md:mb-2 hidden md:block">{category.description}</p>
      <span className="text-xs text-gray-400">{category.count} tools</span>
    </Link>
  );
}