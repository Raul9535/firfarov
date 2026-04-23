import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  size?: "md" | "lg";
  className?: string;
};

/**
 * Default size is `md`. Use `lg` for hero CTAs and other cases that need real presence.
 * Padding + type scale are the only things `size` controls — tone, radius, and hover
 * behaviour stay consistent across sizes.
 */
export function Button({
  href,
  children,
  variant = "primary",
  size = "md",
  className,
}: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 font-medium transition-colors duration-[var(--duration-fast)]";
  const sizes = {
    md: "px-5 py-3 text-sm",
    lg: "px-7 py-4 text-base",
  } as const;
  const variants = {
    primary: "bg-ink text-canvas hover:bg-accent",
    ghost: "border border-rule text-ink hover:border-ink",
  } as const;
  return (
    <Link href={href} className={cn(base, sizes[size], variants[variant], className)}>
      {children}
    </Link>
  );
}
