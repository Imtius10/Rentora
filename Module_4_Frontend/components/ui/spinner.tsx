import { cn } from "@/lib/utils";

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "inline-block size-5 animate-spin rounded-full border-2 border-slate-300 border-t-indigo-600",
        className
      )}
      role="status"
      aria-label="Loading"
    />
  );
}

export function PageLoader({ label }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-slate-500">
      <Spinner className="size-8" />
      {label && <p className="text-sm">{label}</p>}
    </div>
  );
}