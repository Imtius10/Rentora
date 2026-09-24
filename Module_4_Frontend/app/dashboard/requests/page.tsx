"use client";

import { useState } from "react";
import {
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Send,
  Wallet,
  XCircle,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useLandlordRequests,
  useMyPayments,
  useMyRentalRequests,
  useUpdateRequestStatus,
  useCreatePayment,
} from "@/hooks/queries";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/spinner";
import { ReviewModal } from "@/components/properties/apply-modal";
import { getErrorMessage } from "@/lib/api";
import { formatBDT, formatDateTime } from "@/lib/utils";
import type { PaymentDTO, RentalRequestLandlordDTO, RentalRequestTenantDTO } from "@/types";

export default function RequestsPage() {
  const { user } = useAuth();
  const [page, setPage] = useState(1);
  const [reviewFor, setReviewFor] = useState<RentalRequestTenantDTO | null>(null);
  const [rejectFor, setRejectFor] = useState<RentalRequestTenantDTO | RentalRequestLandlordDTO | null>(
    null
  );
  const { toast } = useToast();

  const tenantRequests = useMyRentalRequests({ params: { limit: 10, page } });
  const landlordRequests = useLandlordRequests({ params: { limit: 10, page } });
  const payments = useMyPayments({ params: { limit: 100, page: 1 } });

  const reviewMutation = useUpdateRequestStatus();
  const payMutation = useCreatePayment((data) => {
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    } else {
      toast.error("No checkout URL returned");
    }
  });

  if (!user) return null;

  const isTenant = user.role === "TENANT";
  const isLandlord = user.role === "LANDLORD";

  const data = isTenant ? tenantRequests.data : landlordRequests.data;
  const isLoading = isTenant ? tenantRequests.isLoading : landlordRequests.isLoading;
  const isError = isTenant ? tenantRequests.isError : landlordRequests.isError;

  const handleApprove = (id: string) => {
    reviewMutation.mutate(
      { id, status: "APPROVED" },
      { onSuccess: () => toast.success("Request approved", "The tenant has been notified.") }
    );
  };

  const handleReject = () => {
    if (!rejectFor) return;
    reviewMutation.mutate(
      { id: rejectFor.id, status: "REJECTED" },
      { onSuccess: () => { toast.success("Request rejected"); setRejectFor(null); } }
    );
  };

  const handlePay = async (id: string) => {
    try {
      await payMutation.mutateAsync(id);
    } catch (err) {
      toast.error("Payment could not be created", getErrorMessage(err));
    }
  };

  const paymentByRequest = (requestId: string): PaymentDTO | undefined =>
    payments.data?.data.find((p) => p.rentalRequestId === requestId);

  return (
    <div>
      <PageHeader
        title="Rental Requests"
        description={
          isTenant
            ? "Track the requests you've submitted"
            : "Approve or reject requests from tenants on your properties"
        }
      />

      {isLandlord && (
        <div className="mb-6 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
          <Clock3 className="size-4 shrink-0" />
          Only requests still marked <strong>Pending</strong> can be approved or rejected.
        </div>
      )}

      {isLoading ? (
        <PageLoader label="Loading requests…" />
      ) : isError ? (
        <Card>
          <CardContent>
            <EmptyState title="Could not load requests" description="Please try again in a moment." />
          </CardContent>
        </Card>
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={MessageSquareText}
              title={isTenant ? "No rental requests yet" : "No requests for your properties yet"}
              description={
                isTenant
                  ? "Browse properties and request a rental to get started."
                  : "When tenants apply to your listings, requests will appear here."
              }
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {(data.data as (RentalRequestTenantDTO | RentalRequestLandlordDTO)[]).map((item) => {
              const request = isTenant
                ? (item as RentalRequestTenantDTO)
                : (item as RentalRequestLandlordDTO);
              const payment = isTenant ? paymentByRequest(request.id) : undefined;
              const isPaid = payment?.status === "PAID";
              return (
                <Card key={request.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            {request.property.title}
                          </h3>
                          <RentalStatusBadge status={request.status} />
                          {isTenant && isPaid && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-medium text-emerald-700 ring-1 ring-emerald-200">
                              <CheckCircle2 className="size-3" /> Paid
                            </span>
                          )}
                        </div>
                        <p className="mt-1 text-sm text-slate-500">
                          {request.property.location} · {formatBDT(request.property.price)}/mo
                        </p>
                        {isLandlord && (
                          <div className="mt-3 flex items-center gap-2.5">
                            <Avatar name={request.tenant.name} className="size-8" />
                            <div className="min-w-0">
                              <p className="text-sm font-medium text-slate-800">{request.tenant.name}</p>
                              <p className="truncate text-xs text-slate-500">{request.tenant.email}</p>
                            </div>
                          </div>
                        )}
                        {request.message && (
                          <div className="mt-3 rounded-xl bg-slate-50 p-3 text-sm">{request.message}</div>
                        )}
                        <p className="mt-3 text-xs text-slate-400">
                          Submitted {formatDateTime(request.createdAt)}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-row items-center gap-2 sm:flex-col">
                        {isTenant ? (
                          <>
                            {request.status === "APPROVED" && !isPaid && (
                              <Button onClick={() => handlePay(request.id)} isLoading={payMutation.isPending}>
                                <Wallet className="size-4" /> Pay now
                              </Button>
                            )}
                            {request.status === "APPROVED" && isPaid && (
                              <Button variant="outline" onClick={() => setReviewFor(request as RentalRequestTenantDTO)}>
                                <Send className="size-4" /> Leave review
                              </Button>
                            )}
                            {request.status === "REJECTED" && (
                              <span className="inline-flex items-center gap-1.5 text-sm text-rose-600">
                                <XCircle className="size-4" /> Rejected
                              </span>
                            )}
                            {request.status === "PENDING" && (
                              <span className="inline-flex items-center gap-1.5 text-sm text-amber-600">
                                <Clock3 className="size-4" /> Awaiting landlord
                              </span>
                            )}
                          </>
                        ) : (
                          request.status === "PENDING" && (
                            <>
                              <Button variant="success" size="sm" onClick={() => handleApprove(request.id)}>
                                <CheckCircle2 className="size-4" /> Approve
                              </Button>
                              <Button variant="outline" size="sm" className="text-rose-600 hover:bg-rose-50 hover:text-rose-700" onClick={() => setRejectFor(request)}>
                                <XCircle className="size-4" /> Reject
                              </Button>
                            </>
                          )
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <Pagination
            meta={data.meta}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-8"
          />
        </>
      )}

      <ConfirmDialog
        open={Boolean(rejectFor)}
        onClose={() => setRejectFor(null)}
        onConfirm={handleReject}
        title="Reject rental request?"
        description={
          rejectFor ? `Reject ${rejectFor.tenant.name}'s request for "${rejectFor.property.title}"?` : ""
        }
        confirmLabel="Reject request"
        tone="danger"
        isLoading={reviewMutation.isPending}
      />

      <ReviewModal
        open={Boolean(reviewFor)}
        onClose={() => setReviewFor(null)}
        rentalRequestId={reviewFor?.id ?? ""}
        propertyTitle={reviewFor?.property.title ?? ""}
      />
    </div>
  );
}