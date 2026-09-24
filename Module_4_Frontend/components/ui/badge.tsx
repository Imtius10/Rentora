import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  iconClassName?: string;
}

export function Badge({ className, iconClassName, children, ...props }: BadgeProps) {
  if (iconClassName) {
    return (
      <span
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ring-1",
          className
        )}
        {...props}
      >
        <span className={cn("size-1.5 rounded-full", iconClassName)} aria-hidden />
        {children}
      </span>
    );
  }

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 font-medium ring-1",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}