import Link from "next/link";
import type { ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { RENTAL_STATUS_META, PAYMENT_STATUS_META } from "@/lib/constants";
import { timeAgo, cn } from "@/lib/utils";
import type { PaymentStatus, RentalStatus } from "@/types";

export function StatusRow({
  title,
  subtitle,
  createdAt,
  status,
  type,
}: {
  title: string;
  subtitle?: string;
  createdAt: string;
  status: RentalStatus | PaymentStatus;
  type: "rental" | "payment";
}) {
  const meta = type === "rental" ? RENTAL_STATUS_META[status as RentalStatus] : PAYMENT_STATUS_META[status as PaymentStatus];

  return (
    <div className="flex items-center gap-3 rounded-lg px-2 py-2.5 transition hover:bg-slate-50">
      <div className="flex min-w-0 flex-1 flex-col">
        <span className="truncate text-sm font-medium text-slate-900">{title}</span>
        {subtitle && <span className="truncate text-xs text-slate-500">{subtitle}</span>}
        <span className="mt-0.5 text-[11px] text-slate-400">{timeAgo(createdAt)}</span>
      </div>
      <span
        className={cn(
          "inline-flex shrink-0 items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[11px] font-medium ring-1",
          meta.className
        )}
      >
        <span className={cn("size-1.5 rounded-full", meta.dot)} aria-hidden />
        {meta.label}
      </span>
    </div>
  );
}

export function ActionLink({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-0.5 text-sm font-medium text-indigo-600 transition hover:text-indigo-700"
    >
      {label} <ChevronRight className="size-3.5" />
    </Link>
  );
}

export function AttachmentButton({ href, label }: { href: string; label: ReactNode }) {
  return (
    <Link
      href={href}
      className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-slate-200 px-3 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-700"
    >
      {label}
    </Link>
  );
}