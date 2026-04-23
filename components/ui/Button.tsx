import Link from "next/link";
import { cn } from "@/lib/utils/cn";

type ButtonProps = {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "ghost";
  className?: string;
};

export function Button({ href, children, variant = "primary", className }: ButtonProps) {
  const base =
    "inline-flex items-center gap-2 px-5 py-3 text-sm font-medium transition-colors duration-[var(--duration-fast)]";
  const styles =
    variant === "primary"
      ? "bg-ink text-canvas hover:bg-accent"
      : "border border-rule text-ink hover:border-ink";
  return (
    <Link href={href} className={cn(base, styles, className)}>
      {children}
    </Link>
  );
}
