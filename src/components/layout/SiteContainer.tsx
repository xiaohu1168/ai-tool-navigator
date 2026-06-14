/**
 * SiteContainer — Centered content wrapper with consistent max-width and padding.
 * Usage: <SiteContainer>{children}</SiteContainer>
 */
export default function SiteContainer({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`max-w-7xl mx-auto px-4 md:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  );
}
