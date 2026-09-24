"use client";

import { useState } from "react";
import Link from "next/link";
import { Building2, Pencil, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useAdminDeleteProperty, useAdminProperties, useDeleteProperty, useMyProperties } from "@/hooks/queries";
import { useToast } from "@/components/ui/toast";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ConfirmDialog } from "@/components/ui/modal";
import { EmptyState } from "@/components/ui/empty-state";
import { Pagination } from "@/components/ui/pagination";
import { PageLoader } from "@/components/ui/spinner";
import { CategoryThumb } from "@/components/properties/category-icon";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { formatBDT, titleCase } from "@/lib/utils";
import { getCategoryLabel, RENTAL_STATUS_META } from "@/lib/constants";

export default function PropertiesPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [page, setPage] = useState(1);
  const [deleteFor, setDeleteFor] = useState<string | null>(null);

  const isAdmin = user?.role === "ADMIN";

  const myProps = useMyProperties({ params: { limit: 10, page } });
  const adminProps = useAdminProperties({ params: { limit: 10, page } });

  const deleteMutation = useDeleteProperty(() => {
    toast.success("Property deleted");
    setDeleteFor(null);
  });
  const adminDeleteMutation = useAdminDeleteProperty(() => {
    toast.success("Property deleted");
    setDeleteFor(null);
  });

  if (!user) return null;

  const data = isAdmin ? adminProps.data : myProps.data;
  const isLoading = isAdmin ? adminProps.isLoading : myProps.isLoading;

  const confirmDelete = () => {
    if (!deleteFor) return;
    const mutation = isAdmin ? adminDeleteMutation : deleteMutation;
    mutation.mutate(deleteFor);
  };

  return (
    <div>
      <PageHeader
        title={isAdmin ? "All Properties" : "My Properties"}
        description={isAdmin ? "Every listing on the platform" : "Manage the listings you've published"}
        actions={
          !isAdmin ? (
            <Button onClick={() => (window.location.href = "/dashboard/properties/new")}>
              <Plus className="size-4" /> Add property
            </Button>
          ) : undefined
        }
      />

      {isLoading ? (
        <PageLoader label="Loading properties…" />
      ) : !data || data.data.length === 0 ? (
        <Card>
          <CardContent>
            <EmptyState
              icon={Building2}
              title={isAdmin ? "No properties yet" : "You haven't listed any properties"}
              description={
                isAdmin
                  ? "When landlords publish listings, they'll appear here."
                  : "Publish your first listing to start receiving rental requests."
              }
              actionLabel={!isAdmin ? "Add a property" : undefined}
              onAction={!isAdmin ? () => (window.location.href = "/dashboard/properties/new") : undefined}
            />
          </CardContent>
        </Card>
      ) : (
        <>
          <div className="space-y-4">
            {data.data.map((property) => {
              const requests = isAdmin
                ? (property as { rentalRequests?: { id: string; status: string }[] }).rentalRequests ?? []
                : (property as { rentalRequests?: { id: string; status: string }[] }).rentalRequests ?? [];
              const pending = requests.filter((r) => r.status === "PENDING").length;
              return (
                <Card key={property.id}>
                  <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center">
                    <CategoryThumb
                      category={property.category}
                      title={property.title}
                      className="h-24 w-full shrink-0 rounded-xl sm:w-36 sm:rounded-xl"
                      iconClassName="size-10 text-white/95"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link
                          href={`/properties/${property.id}`}
                          className="text-base font-semibold text-slate-900 hover:text-indigo-600"
                        >
                          {property.title}
                        </Link>
                        <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-100">
                          {titleCase(getCategoryLabel(property.category))}
                        </Badge>
                      </div>
                      <p className="mt-1 text-sm text-slate-500">
                        {property.location} · {formatBDT(property.price)}/mo
                      </p>
                      {isAdmin && (
                        <div className="mt-2 flex items-center gap-2">
                          <Avatar name={property.landlord?.name ?? "Owner"} className="size-6 text-[10px]" />
                          <span className="text-sm text-slate-600">{property.landlord?.name}</span>
                          <span className="text-xs text-slate-400">({property.landlord?.email})</span>
                        </div>
                      )}
                      <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                        <span className="text-slate-500">{requests.length} rental request(s)</span>
                        {pending > 0 && (
                          <span className={RENTAL_STATUS_META.PENDING.className + " inline-flex items-center gap-1 rounded-full px-2 py-0.5 font-medium ring-1"}>
                            <span className="size-1.5 rounded-full bg-amber-500" />
                            {pending} pending
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex shrink-0 items-center gap-2">
                      {!isAdmin && (
                        <Link href={`/dashboard/properties/${property.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Pencil className="size-3.5" /> Edit
                          </Button>
                        </Link>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        className="text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        onClick={() => setDeleteFor(property.id)}
                      >
                        <Trash2 className="size-3.5" /> Delete
                      </Button>
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
        open={Boolean(deleteFor)}
        onClose={() => setDeleteFor(null)}
        onConfirm={confirmDelete}
        title="Delete property?"
        description="This permanently removes the listing and all associated rental requests. This action cannot be undone."
        confirmLabel="Delete property"
        tone="danger"
        isLoading={(isAdmin ? adminDeleteMutation : deleteMutation).isPending}
      />
    </div>
  );
}