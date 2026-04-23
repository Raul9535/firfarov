import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/utils/cn";

export function Container({ className, ...props }: ComponentPropsWithoutRef<"div">) {
  return <div className={cn("mx-auto w-full max-w-site px-site", className)} {...props} />;
}
