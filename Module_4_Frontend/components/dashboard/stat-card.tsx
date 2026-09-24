import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  hint?: string;
  iconClassName?: string;
}

export function StatCard({ icon: Icon, label, value, hint, iconClassName }: StatCardProps) {
  return (
    <Card className="flex items-center gap-4 p-5">
      <div
        className={cn(
          "flex size-12 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600",
          iconClassName
        )}
      >
        <Icon className="size-6" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        {hint && <p className="truncate text-xs text-slate-400">{hint}</p>}
      </div>
    </Card>
  );
}