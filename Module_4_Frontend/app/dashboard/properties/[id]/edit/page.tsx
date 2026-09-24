"use client";

import { useParams } from "next/navigation";
import { useMyProperties } from "@/hooks/queries";
import { PropertyForm } from "@/components/dashboard/property-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PageLoader } from "@/components/ui/spinner";

export default function EditPropertyPage() {
  const params = useParams<{ id: string }>();
  const { data, isLoading } = useMyProperties({ params: { limit: 100, page: 1 } });
  const property = data?.data.find((p) => p.id === params.id);

  if (isLoading) return <PageLoader label="Loading property…" />;

  if (!property) {
    return (
      <div className="max-w-2xl">
        <Card>
          <CardContent>
            <EmptyState
              title="Property not found"
              description="This property may have been deleted, or it belongs to another landlord."
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <PageHeader title="Edit property" description={`Update "${property.title}"`} />
      <Card>
        <CardContent className="p-6">
          <PropertyForm initial={property} mode="edit" />
        </CardContent>
      </Card>
    </div>
  );
}