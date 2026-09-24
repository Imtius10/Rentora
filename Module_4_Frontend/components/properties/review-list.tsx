"use client";

import { useReviews } from "@/hooks/queries";
import { StarRating } from "@/components/ui/rating";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/spinner";
import { timeAgo } from "@/lib/utils";
import { MessageSquareQuote } from "lucide-react";

export function ReviewList({ propertyId }: { propertyId: string }) {
  const { data, isLoading } = useReviews(propertyId);

  if (isLoading) return <PageLoader label="Loading reviews…" />;

  if (!data || data.data.length === 0) {
    return (
      <EmptyState
        icon={MessageSquareQuote}
        title="No reviews yet"
        description="Be the first to share your experience about this property."
      />
    );
  }

  return (
    <div className="space-y-5">
      {data.data.map((review) => (
        <div key={review.id} className="flex gap-4">
          <Avatar name={review.tenant?.name ?? "Tenant"} />
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
              <span className="text-sm font-semibold text-slate-900">
                {review.tenant?.name}
              </span>
              <StarRating value={review.rating} readonly />
              <span className="text-xs text-slate-400">{timeAgo(review.createdAt)}</span>
            </div>
            {review.comment && (
              <p className="mt-1.5 text-sm leading-relaxed text-slate-600">{review.comment}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}