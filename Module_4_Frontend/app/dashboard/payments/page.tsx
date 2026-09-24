"use client";

import { useState } from "react";
import Link from "next/link";
import { ExternalLink, ReceiptText, TestTubes, Wallet } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import { useCreatePayment, useMyPayments } from "@/hooks/queries";
import { useToast } from "@/components/ui/toast";
import { api, getErrorMessage } from "@/lib/api";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaymentStatusBadge } from "@/components/ui/status-badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/spinner";
import { QUERY_KEYS } from "@/lib/constants";
import { formatBDT, formatDateTime } from "@/lib/utils";
import type { PaymentDTO } from "@/types";

export default function PaymentsPage() {
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const qc = useQueryClient();

  const payments = useMyPayments({ params: { limit: 10, page } });
  const payMutation = useCreatePayment((data) => {
    if (data.checkoutUrl) {
      window.location.href = data.checkoutUrl;
    }
  });

  const handlePay = async (payment: PaymentDTO) => {
    try {
      await payMutation.mutateAsync(payment.rentalRequestId);
    } catch (err) {
      toast.error("Payment could not be created", getErrorMessage(err));
    }
  };

  const handleDevConfirm = async (paymentId: string) => {
    try {
      await api.post<PaymentDTO>("/payments/confirm", { paymentId });
      toast.success("Payment confirmed (dev)", "Marked as paid to simulate the Stripe webhook.");
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myPayments });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.myRequests });
    } catch (err) {
      toast.error("Confirm failed", getErrorMessage(err));
    }
  };

  const data = payments.data;

  return (
    <div>
      <PageHeader
        title="Payments"
        description="Your deposit payments and Stripe checkout history"
      />

      <div className="mb-6 rounded-xl border border-indigo-100 bg-indigo-50/60 px-4 py-3 text-sm leading-relaxed text-indigo-900">
        <strong>How it works:</strong> when a landlord approves your request, hit{" "}
        <strong>Pay now</strong> to open a secure Stripe checkout. Use test card{" "}
        <code className="rounded bg-white px-1.5 py-0.5 text-xs font-mono">4242 4242 4242 4242</code>{" "}
        with any future date and CVC. Your payment then becomes <strong>Paid</strong> automatically.
      </div>

      {payments.isLoading ? (
        <PageLoader label="Loading payments…" />
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={ReceiptText}
              title="No payments yet"
              description="Payments appear here after a landlord approves your rental request."
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data.data.map((payment) => {
              const property = payment.rentalRequest?.property;
              const rentalApproved = payment.rentalRequest?.status === "APPROVED";
              const canPay = payment.status === "PENDING" && rentalApproved;
              return (
                <Card key={payment.id}>
                  <CardContent className="p-5">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base font-semibold text-slate-900">
                            {property?.title ?? "Rental payment"}
                          </h3>
                          <PaymentStatusBadge status={payment.status} />
                        </div>
                        {property && (
                          <Link
                            href={`/properties/${property.id}`}
                            className="mt-0.5 inline-flex items-center gap-1 text-sm text-slate-500 hover:text-indigo-600"
                          >
                            {property.location} <ExternalLink className="size-3" />
                          </Link>
                        )}
                        <div className="mt-2 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                          <span className="text-slate-600">
                            Amount:{" "}
                            <strong className="font-semibold text-slate-900">
                              {formatBDT(payment.amount)}
                            </strong>
                          </span>
                          <span className="text-slate-400">
                            Requested {formatDateTime(payment.createdAt)}
                          </span>
                          {payment.transactionId && (
                            <span className="break-all text-xs text-slate-400">
                              TXN: {payment.transactionId}
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex shrink-0 flex-col items-stretch gap-2 sm:items-end">
                        {canPay && (
                          <Button onClick={() => handlePay(payment)} isLoading={payMutation.isPending}>
                            <Wallet className="size-4" /> Pay now
                          </Button>
                        )}
                        {payment.status === "PENDING" && !rentalApproved && (
                          <span className="text-xs text-amber-600">
                            Waiting for landlord approval
                          </span>
                        )}
                        {payment.status === "PENDING" && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDevConfirm(payment.id)}
                            className="text-slate-400"
                          >
                            <TestTubes className="size-3.5" /> Simulate webhook (dev)
                          </Button>
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
    </div>
  );
}