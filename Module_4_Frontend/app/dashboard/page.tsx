"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Banknote,
  Building2,
  ClipboardList,
  Clock3,
  Plus,
  Receipt,
  Users,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import {
  useAdminStatistics,
  useLandlordRequests,
  useMyPayments,
  useMyProperties,
  useMyRentalRequests,
} from "@/hooks/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatCard } from "@/components/dashboard/stat-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AttachmentButton, StatusRow, ActionLink } from "@/components/dashboard/summary-widgets";

export default function DashboardOverviewPage() {
  const { user } = useAuth();

  const requests = useMyRentalRequests({ params: { limit: 3 } });
  const payments = useMyPayments({ params: { limit: 3 } });
  const landlordRequests = useLandlordRequests({ params: { limit: 3 } });
  const myProps = useMyProperties({ params: { limit: 3 } });
  const stats = useAdminStatistics();

  const role = user?.role;

  const tenantPending = useMemo(
    () => (requests.data?.data ?? []).filter((r) => r.status === "PENDING").length,
    [requests.data]
  );
  const tenantApproved = useMemo(
    () => (requests.data?.data ?? []).filter((r) => r.status === "APPROVED").length,
    [requests.data]
  );
  const paidCount = useMemo(
    () => (payments.data?.data ?? []).filter((p) => p.status === "PAID").length,
    [payments.data]
  );
  const unpaidCount = useMemo(
    () => (payments.data?.data ?? []).filter((p) => p.status === "PENDING").length,
    [payments.data]
  );

  if (!user) return null;

  return (
    <div>
      <PageHeader
        title={`Hi, ${user.name.split(" ")[0]} 👋`}
        description="Here's what's happening with your rentals today."
      />

      {role === "TENANT" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={ClipboardList} label="Total requests" value={requests.data?.meta.total ?? "–"} />
            <StatCard icon={Clock3} label="Pending approval" value={tenantPending} iconClassName="bg-amber-50 text-amber-600" />
            <StatCard icon={Banknote} label="Paid" value={paidCount} iconClassName="bg-emerald-50 text-emerald-600" />
            <StatCard icon={Receipt} label="Awaiting payment" value={unpaidCount} iconClassName="bg-rose-50 text-rose-600" />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Recent rental requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {(requests.data?.data ?? []).slice(0, 4).map((r) => (
                  <StatusRow
                    key={r.id}
                    title={r.property.title}
                    subtitle={`${r.property.location} · ${r.property.price ? `৳${r.property.price.toLocaleString()}/mo` : ""}`}
                    createdAt={r.createdAt}
                    status={r.status}
                    type="rental"
                  />
                ))}
                {requests.data?.data.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">No requests yet.</p>
                )}
                <div className="pt-3">
                  <ActionLink href="/dashboard/requests" label="View all requests" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recent payments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {(payments.data?.data ?? []).slice(0, 4).map((p) => (
                  <StatusRow
                    key={p.id}
                    title={p.rentalRequest?.property.title ?? "Payment"}
                    subtitle={`${p.rentalRequest?.property.location ?? ""} · ৳${p.amount.toLocaleString()}`}
                    createdAt={p.createdAt}
                    status={p.status}
                    type="payment"
                  />
                ))}
                {payments.data?.data.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">No payments yet.</p>
                )}
                <div className="pt-3">
                  <ActionLink href="/dashboard/payments" label="View all payments" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {role === "LANDLORD" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Building2} label="My properties" value={myProps.data?.meta.total ?? "–"} />
            <StatCard icon={ClipboardList} label="Rental requests" value={landlordRequests.data?.meta.total ?? "–"} />
            <StatCard
              icon={Clock3}
              label="Needs review"
              value={(landlordRequests.data?.data ?? []).filter((r) => r.status === "PENDING").length}
              iconClassName="bg-amber-50 text-amber-600"
            />
            <StatCard
              icon={Users}
              label="Tenants"
              value={new Set((landlordRequests.data?.data ?? []).map((r) => r.tenantId)).size}
              iconClassName="bg-emerald-50 text-emerald-600"
            />
          </div>

          <div className="mt-6 grid gap-6 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Recent listing requests
                  <AttachmentButton href="/dashboard/requests" label="Review" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {(landlordRequests.data?.data ?? []).slice(0, 4).map((r) => (
                  <StatusRow
                    key={r.id}
                    title={r.property.title}
                    subtitle={`${r.tenant.name} · ${r.property.location}`}
                    createdAt={r.createdAt}
                    status={r.status}
                    type="rental"
                  />
                ))}
                {landlordRequests.data?.data.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">No incoming requests yet.</p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  My properties
                  <AttachmentButton href="/dashboard/properties/new" label={<><Plus className="size-3.5" /> Add</>} />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-1">
                {(myProps.data?.data ?? []).slice(0, 4).map((p) => (
                  <StatusRow
                    key={p.id}
                    title={p.title}
                    subtitle={`${p.location} · ৳${p.price.toLocaleString()}/mo · ${(p.rentalRequests ?? []).length} request(s)`}
                    createdAt={p.createdAt}
                    status={p.rentalRequests?.some((r) => r.status === "PENDING") ? "PENDING" : "APPROVED"}
                    type="rental"
                  />
                ))}
                {myProps.data?.data.length === 0 && (
                  <p className="py-8 text-center text-sm text-slate-400">You haven&apos;t listed any properties yet.</p>
                )}
                <div className="pt-3">
                  <ActionLink href="/dashboard/properties" label="Manage properties" />
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {role === "ADMIN" && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard icon={Users} label="Total users" value={stats.data?.users.total ?? "–"} />
            <StatCard icon={Building2} label="Properties" value={stats.data?.properties.total ?? "–"} iconClassName="bg-emerald-50 text-emerald-600" />
            <StatCard icon={ClipboardList} label="Rental requests" value={stats.data?.rentalRequests.total ?? "–"} iconClassName="bg-violet-50 text-violet-600" />
            <StatCard icon={Clock3} label="Pending requests" value={stats.data?.rentalRequests.pending ?? "–"} iconClassName="bg-amber-50 text-amber-600" />
          </div>

          <div className="mt-6 grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Tenants", value: stats.data?.users.tenants ?? 0 },
              { label: "Landlords", value: stats.data?.users.landlords ?? 0 },
              { label: "Approved requests", value: stats.data?.rentalRequests.approved ?? 0 },
              { label: "Rejected requests", value: stats.data?.rentalRequests.rejected ?? 0 },
            ].map((item) => (
              <Card key={item.label} className="p-5">
                <p className="text-sm text-slate-500">{item.label}</p>
                <p className="mt-1 text-3xl font-bold text-slate-900">{item.value}</p>
              </Card>
            ))}
          </div>

          <Card className="mt-6">
            <CardContent className="flex flex-wrap items-center gap-3">
              <Link href="/dashboard/users" className="text-sm font-medium text-indigo-600 hover:underline">
                Manage users →
              </Link>
              <Link href="/dashboard/properties" className="text-sm font-medium text-indigo-600 hover:underline">
                Manage properties →
              </Link>
              <Link href="/dashboard/rentals" className="text-sm font-medium text-indigo-600 hover:underline">
                View all rental requests →
              </Link>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
}