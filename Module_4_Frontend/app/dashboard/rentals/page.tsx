"use client";

import { useState } from "react";
import Link from "next/link";
import { ClipboardList } from "lucide-react";
import { useAdminRentals } from "@/hooks/queries";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { RentalStatusBadge } from "@/components/ui/status-badge";
import { Avatar } from "@/components/ui/avatar";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/spinner";
import { formatBDT, formatDateTime } from "@/lib/utils";

export default function AdminRentalsPage() {
  const [page, setPage] = useState(1);
  const rentals = useAdminRentals({ params: { limit: 12, page } });
  const data = rentals.data;

  return (
    <div>
      <PageHeader
        title="All Rental Requests"
        description="Every rental request submitted on the platform"
      />

      {rentals.isLoading ? (
        <PageLoader label="Loading rental requests…" />
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState icon={ClipboardList} title="No rental requests yet" />
          </CardContent>
        </Card>
      ) : (
        <>
          <Card className="overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[46rem] text-sm">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-50/80 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Tenant</th>
                    <th className="px-4 py-3">Property</th>
                    <th className="px-4 py-3">Landlord</th>
                    <th className="px-4 py-3">Status</th>
                    <th className="px-5 py-3 text-right">Requested</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {data.data.map((request) => (
                    <tr key={request.id} className="transition hover:bg-slate-50/60">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <Avatar name={request.tenant.name} />
                          <div className="min-w-0">
                            <p className="truncate font-medium text-slate-900">
                              {request.tenant.name}
                            </p>
                            <p className="truncate text-xs text-slate-500">{request.tenant.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3.5">
                        <Link
                          href={`/properties/${request.propertyId}`}
                          className="block max-w-64 truncate font-medium text-indigo-600 hover:underline"
                          title={request.property.title}
                        >
                          {request.property.title}
                        </Link>
                        <p className="max-w-64 truncate text-xs text-slate-500">
                          {request.property.location} · {formatBDT(request.property.price)}
                        </p>
                      </td>
                      <td className="px-4 py-3.5 text-slate-600">{request.property.landlord?.name}</td>
                      <td className="px-4 py-3.5">
                        <RentalStatusBadge status={request.status} />
                      </td>
                      <td className="px-5 py-3.5 text-right text-xs text-slate-500">
                        {formatDateTime(request.createdAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>

          <Pagination
            meta={data.meta}
            onChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-6"
          />
        </>
      )}
    </div>
  );
}