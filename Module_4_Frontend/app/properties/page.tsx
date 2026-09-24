"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { SearchX } from "lucide-react";
import { useProperties } from "@/hooks/queries";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyFilters } from "@/components/properties/property-filters";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { Pagination } from "@/components/ui/pagination";
import { EmptyState } from "@/components/ui/empty-state";
import { Card, CardContent } from "@/components/ui/card";

const PAGE_SIZE = 9;

function PropertiesView() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const params: Record<string, string | number> = {
    limit: PAGE_SIZE,
    page,
  };
  const search = searchParams.get("search");
  const location = searchParams.get("location");
  const category = searchParams.get("category");
  const minPrice = searchParams.get("minPrice");
  const maxPrice = searchParams.get("maxPrice");
  if (search) params.search = search;
  if (location) params.location = location;
  if (category) params.category = category;
  if (minPrice) params.minPrice = minPrice;
  if (maxPrice) params.maxPrice = maxPrice;

  const { data, isLoading, isError, refetch } = useProperties({ params });

  const handlePageChange = (next: number) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const activeFilterCount = [search, location, category, minPrice, maxPrice].filter(Boolean).length;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Browse Properties
        </h1>
        <p className="mt-1 text-sm text-slate-500 sm:text-base">
          Find apartments, houses and studios across Bangladesh
          {activeFilterCount > 0 ? (
            <span className="ml-1.5 inline-block translate-y-[-0.5px] rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-semibold text-indigo-700 align-middle">
              {activeFilterCount} active filter{activeFilterCount > 1 ? "s" : ""}
            </span>
          ) : null}
        </p>
      </div>

      <PropertyFilters />

      {isLoading ? (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <PropertyCardSkeleton key={i} />
          ))}
        </div>
      ) : isError ? (
        <Card className="mt-6">
          <CardContent>
            <EmptyState
              title="Could not load properties"
              description="Something went wrong while fetching listings. Please try again."
              actionLabel="Retry"
              onAction={() => refetch()}
            />
          </CardContent>
        </Card>
      ) : data && data.data.length > 0 ? (
        <>
          <p className="mt-6 text-sm text-slate-500">
            Showing {data.data.length} of {data.meta.total} propert{data.meta.total === 1 ? "y" : "ies"}
          </p>
          <div className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {data.data.map((property) => (
              <PropertyCard key={property.id} property={property} />
            ))}
          </div>
          <Pagination meta={data.meta} onChange={handlePageChange} className="mt-8" />
        </>
      ) : (
        <Card className="mt-6">
          <CardContent>
            <EmptyState
              icon={SearchX}
              title="No properties found"
              description="Try adjusting your filters or search terms to see more results."
              actionLabel="Clear all filters"
              onAction={() => {
                router.push("/properties");
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="py-20" />}>
      <PropertiesView />
    </Suspense>
  );
}