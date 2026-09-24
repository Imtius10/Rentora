import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface StarRatingProps {
  value: number;
  onChange?: (value: number) => void;
  size?: "sm" | "md";
  readonly?: boolean;
  count?: number;
}

export function StarRating({
  value,
  onChange,
  size = "sm",
  readonly = false,
  count,
}: StarRatingProps) {
  const iconClass = size === "sm" ? "size-3.5" : "size-5";

  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => onChange?.(star)}
          className={cn("transition", !readonly && "cursor-pointer hover:scale-110")}
          aria-label={`Rate ${star} star${star > 1 ? "s" : ""}`}
        >
          <Star
            className={cn(
              iconClass,
              star <= value ? "fill-amber-400 text-amber-400" : "text-slate-300"
            )}
          />
        </button>
      ))}
      {typeof count === "number" && (
        <span className="ml-1 text-xs text-slate-500">({count})</span>
      )}
    </div>
  );
}