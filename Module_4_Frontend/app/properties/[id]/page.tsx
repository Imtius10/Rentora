"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Home as HomeIcon,
  MapPin,
  MessageSquareQuote,
  PenLine,
  User,
  Wallet,
} from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useProperty } from "@/hooks/queries";
import { formatBDT, titleCase } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PageLoader } from "@/components/ui/spinner";
import { Avatar } from "@/components/ui/avatar";
import { CategoryThumb } from "@/components/properties/category-icon";
import { ReviewList } from "@/components/properties/review-list";
import { ApplyModal } from "@/components/properties/apply-modal";
import { EmptyState } from "@/components/ui/empty-state";

export default function PropertyDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, isAuthenticated } = useAuth();
  const [applyOpen, setApplyOpen] = useState(false);
  const { data: property, isLoading, isError } = useProperty(params.id);

  if (isLoading) return <PageLoader label="Loading property…" />;

  if (isError || !property) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-20">
        <Card>
          <CardContent>
            <EmptyState
              icon={HomeIcon}
              title="Property not found"
              description="This property may have been removed or the link is incorrect."
              actionLabel="Browse properties"
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = user?.id === property.landlordId;
  const canApply = isAuthenticated && user?.role === "TENANT" && !isOwner;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/properties"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-500 transition hover:text-indigo-600"
      >
        <ArrowLeft className="size-4" /> Back to properties
      </Link>

      <div className="mt-4 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        {/* Left column */}
        <div>
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <CategoryThumb
              category={property.category}
              title={property.title}
              className="h-72"
              iconClassName="size-24 text-white/95"
            />
            <div className="p-6">
              <div className="flex flex-wrap items-center gap-2">
                <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-100">
                  {titleCase(getCategoryLabel(property.category))}
                </Badge>
                <Badge className="bg-emerald-50 text-emerald-700 ring-emerald-100" iconClassName="bg-emerald-500">
                  Available
                </Badge>
              </div>
              <h1 className="mt-3 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
                {property.title}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-slate-500">
                <MapPin className="size-4" /> {property.location}
              </p>
              <div className="mt-6 border-t border-slate-100 pt-5">
                <h2 className="text-base font-semibold text-slate-900">About this property</h2>
                <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-600">
                  {property.description}
                </p>
              </div>
            </div>
          </div>

          {/* Reviews */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquareQuote className="size-4 text-slate-400" /> Reviews
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ReviewList propertyId={property.id} />
            </CardContent>
          </Card>
        </div>

        {/* Right column */}
        <div className="space-y-6">
          <Card className="sticky top-20">
            <CardContent className="p-6">
              <div>
                <span className="text-3xl font-black text-slate-900">
                  {formatBDT(property.price)}
                </span>
                <span className="text-sm text-slate-400"> /month</span>
              </div>
              <div className="mt-4 space-y-3 rounded-xl bg-slate-50 p-4 text-sm">
                <div className="flex items-center gap-3 text-slate-600">
                  <MapPin className="size-4 text-slate-400" /> {property.location}
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <HomeIcon className="size-4 text-slate-400" />{" "}
                  {titleCase(getCategoryLabel(property.category))}
                </div>
                <div className="flex items-center gap-3 text-slate-600">
                  <Calendar className="size-4 text-slate-400" /> Fresh listing
                </div>
              </div>

              {isOwner ? (
                <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
                  This is your property. Manage it from{" "}
                  <Link href="/dashboard/properties" className="font-semibold underline">
                    your dashboard
                  </Link>
                  .
                </div>
              ) : isAuthenticated && user?.role === "LANDLORD" ? (
                <div className="mt-5 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-700">
                  Landlord accounts can&apos;t request rentals. Log in as a tenant to apply, or keep
                  managing your listings.
                </div>
              ) : (
                <Button
                  size="lg"
                  className="mt-5 w-full"
                  onClick={() => setApplyOpen(true)}
                  disabled={Boolean(isAuthenticated) && user?.role !== "TENANT"}
                >
                  <PenLine className="size-5" />
                  Request to rent
                </Button>
              )}

              {!isAuthenticated && (
                <p className="mt-3 text-center text-xs text-slate-400">
                  You&apos;ll need a tenant account to apply.
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-4 text-slate-400" /> Landlord
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar name={property.landlord?.name ?? "Landlord"} className="size-12 text-base" />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-slate-900">
                    {property.landlord?.name}
                  </p>
                  <p className="truncate text-xs text-slate-500">{property.landlord?.email}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wallet className="size-4 text-slate-400" /> Payment
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>
                  After the landlord approves your request, pay the deposit securely via Stripe.
                </span>
              </div>
              <div className="flex items-start gap-2.5">
                <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-600" />
                <span>Use test card <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs">4242 4242 4242 4242</code> to simulate payment.</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <ApplyModal
        open={applyOpen}
        onClose={() => setApplyOpen(false)}
        propertyId={property.id}
        propertyTitle={property.title}
      />
    </div>
  );
}