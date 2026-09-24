"use client";

import { PropertyForm } from "@/components/dashboard/property-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { Card, CardContent } from "@/components/ui/card";

export default function NewPropertyPage() {
  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Add a property"
        description="Publish a new listing to attract tenants"
      />
      <Card>
        <CardContent className="p-6">
          <PropertyForm mode="create" />
        </CardContent>
      </Card>
    </div>
  );
}