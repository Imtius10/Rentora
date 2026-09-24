"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { useCreateReview, useRentalRequestMutation } from "@/hooks/queries";
import { useToast } from "@/components/ui/toast";
import { Modal } from "@/components/ui/modal";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/field";
import { StarRating } from "@/components/ui/rating";
import { getErrorMessage } from "@/lib/api";
import type { RentalRequestTenantDTO, ReviewDTO } from "@/types";

interface ApplyModalProps {
  open: boolean;
  onClose: () => void;
  propertyId: string;
  propertyTitle: string;
  onSuccess?: (request: RentalRequestTenantDTO) => void;
}

export function ApplyModal({ open, onClose, propertyId, propertyTitle, onSuccess }: ApplyModalProps) {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const mutation = useRentalRequestMutation(() => {
    toast.success("Rental request sent", `Your request for "${propertyTitle}" has been submitted.`);
    setMessage("");
    onClose();
  });

  useEffect(() => {
    if (open && !isAuthenticated) {
      toast.info("Sign in required", "Please log in as a tenant to request this property.");
      router.push(`/login?next=${encodeURIComponent(`/properties/${propertyId}`)}`);
      onClose();
      return;
    }
    if (open && user && user.role !== "TENANT") {
      toast.info("Tenant only", "Only tenant accounts can submit rental requests.");
      onClose();
    }
    setError("");
  }, [open, isAuthenticated, user, router, propertyId, onClose, toast]);

  const submit = async () => {
    setError("");
    try {
      const res = await mutation.mutateAsync({ propertyId, message: message || undefined });
      onSuccess?.(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Request to rent"
      description={`Send a rental request for "${propertyTitle}"`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={mutation.isPending}>
            Send request
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <Textarea
          label="Message to landlord"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Tell the landlord about yourself, move-in date, etc."
          hint="Optional — the landlord will see this message with your request."
        />
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
        <div className="rounded-xl bg-slate-50 p-3 text-xs leading-relaxed text-slate-500">
          Once the landlord approves your request, you&apos;ll be able to pay the deposit securely
          through Stripe from your dashboard.
        </div>
      </div>
    </Modal>
  );
}

interface ReviewModalProps {
  open: boolean;
  onClose: () => void;
  rentalRequestId: string;
  propertyTitle: string;
  onSuccess?: (review: ReviewDTO) => void;
}

export function ReviewModal({ open, onClose, rentalRequestId, propertyTitle, onSuccess }: ReviewModalProps) {
  const { toast } = useToast();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");

  const mutation = useCreateReview(() => {
    toast.success("Review submitted", "Thanks for sharing your experience.");
    setRating(5);
    setComment("");
    onClose();
  });

  useEffect(() => {
    setError("");
  }, [open]);

  const submit = async () => {
    setError("");
    try {
      const res = await mutation.mutateAsync({
        rentalRequestId,
        rating,
        comment: comment || undefined,
      });
      onSuccess?.(res.data);
    } catch (err) {
      setError(getErrorMessage(err));
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Leave a review"
      description={`Rate "${propertyTitle}"`}
      footer={
        <>
          <Button variant="ghost" onClick={onClose} disabled={mutation.isPending}>
            Cancel
          </Button>
          <Button onClick={submit} isLoading={mutation.isPending}>
            Submit review
          </Button>
        </>
      }
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between rounded-xl bg-slate-50 p-4">
          <span className="text-sm font-medium text-slate-700">Your rating</span>
          <StarRating value={rating} onChange={setRating} size="md" />
        </div>
        <Textarea
          label="Comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder="How was your rental experience?"
        />
        {error && <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p>}
      </div>
    </Modal>
  );
}