"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  BedDouble,
  Building2,
  CheckCircle2,
  KeyRound,
  MapPin,
  Search,
  ShieldCheck,
  Users,
} from "lucide-react";
import { useCategories, useProperties } from "@/hooks/queries";
import { categoryGradient, CategoryIcon } from "@/components/properties/category-icon";
import { PropertyCard } from "@/components/properties/property-card";
import { PropertyCardSkeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { titleCase } from "@/lib/utils";

const PERKS = [
  {
    icon: Search,
    title: "Find your home",
    description: "Browse hundreds of verified listings in Dhaka and beyond with powerful filters.",
  },
  {
    icon: ShieldCheck,
    title: "Secure payments",
    description: "Pay rent deposits securely through Stripe with full payment history.",
  },
  {
    icon: KeyRound,
    title: "Easy management",
    description: "Submit rental requests, track approvals, and review your stays from one dashboard.",
  },
];

const STEPS = [
  { step: "01", title: "Create an account", description: "Sign up as a tenant or landlord in seconds." },
  { step: "02", title: "Apply or list", description: "Tenants request rentals; landlords publish properties." },
  { step: "03", title: "Get approved & pay", description: "Landlords approve requests, tenants pay securely via Stripe." },
  { step: "04", title: "Move in", description: "Rate the rental and leave a review for other tenants." },
];

export default function HomePage() {
  const router = useRouter();
  const [heroQuery, setHeroQuery] = useState("");
  const { data: categories } = useCategories();
  const { data, isLoading } = useProperties({ params: { limit: 6 } });

  const recentProperties = data?.data ?? [];

  const searchHero = () => {
    const params = new URLSearchParams();
    if (heroQuery.trim()) params.set("search", heroQuery.trim());
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-900">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(99,102,241,0.35),transparent_50%),radial-gradient(ellipse_at_bottom_right,rgba(236,72,153,0.25),transparent_50%)]" />
        <div className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:26px_26px]" />
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8 lg:py-28">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              <Building2 className="size-3.5" />
              Bangladesh&apos;s rental marketplace
            </span>
            <h1 className="mt-6 text-4xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              Find your next home, <span className="text-indigo-400">simply.</span>
            </h1>
            <p className="mt-5 max-w-xl text-lg leading-relaxed text-slate-300">
              RentNest connects tenants and landlords with verified listings, transparent
              approvals and secure payments.
            </p>
            <div className="mt-8 flex max-w-xl items-center gap-2 rounded-2xl border border-white/10 bg-white/10 p-2 backdrop-blur">
              <Search className="ml-2 size-5 shrink-0 text-slate-300" />
              <input
                value={heroQuery}
                onChange={(e) => setHeroQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && searchHero()}
                placeholder="Search by area or property type…"
                className="h-11 w-full bg-transparent text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <Button onClick={searchHero} className="rounded-xl">
                Search
              </Button>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-8 gap-y-3 text-sm text-slate-300">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="size-4 text-emerald-400" /> Verified landlords
              </span>
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="size-4 text-emerald-400" /> Secure Stripe payments
              </span>
              <span className="flex items-center gap-1.5">
                <Users className="size-4 text-emerald-400" /> 100+ happy tenants
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Browse by category</h2>
            <p className="mt-1 text-sm text-slate-500">Explore properties by their type</p>
          </div>
          <Link
            href="/properties"
            className="hidden items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700 sm:flex"
          >
            View all <ArrowRight className="size-4" />
          </Link>
        </div>
        <div className="mt-6 grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {(categories ?? []).map((category) => (
            <Link
              key={category}
              href={`/properties?category=${encodeURIComponent(category)}`}
              className="group flex flex-col items-center gap-2 rounded-2xl border border-slate-200 bg-white p-4 text-center transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10"
            >
              <div
                className={`flex size-11 items-center justify-center rounded-xl bg-gradient-to-br text-white ${categoryGradient(
                  category
                )}`}
              >
                <CategoryIcon category={category} className="size-5" />
              </div>
              <span className="text-sm font-medium text-slate-700">{titleCase(category)}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured properties */}
      <section className="bg-white py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-slate-900">Latest listings</h2>
              <p className="mt-1 text-sm text-slate-500">Fresh properties just added</p>
            </div>
            <Link
              href="/properties"
              className="flex items-center gap-1 text-sm font-medium text-indigo-600 hover:text-indigo-700"
            >
              View all <ArrowRight className="size-4" />
            </Link>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => <PropertyCardSkeleton key={i} />)
              : recentProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
          </div>
        </div>
      </section>

      {/* Stats strip */}
      <section className="border-y border-slate-200 bg-slate-50">
        <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
          {[
            { value: "1,200+", label: "Listed properties" },
            { value: "3", label: "User roles" },
            { value: "4", label: "Step rental flow" },
            { value: "100%", label: "Secure payments" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="text-2xl font-black text-indigo-600 sm:text-3xl">{stat.value}</p>
              <p className="mt-1 text-sm text-slate-500">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">How RentNest works</h2>
          <p className="mt-1 text-sm text-slate-500">A simple rental journey from search to move-in</p>
        </div>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((item) => (
            <div key={item.step} className="relative rounded-2xl border border-slate-200 bg-white p-6">
              <span className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 text-sm font-bold text-indigo-600">
                {item.step}
              </span>
              <h3 className="mt-4 font-semibold text-slate-900">{item.title}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-slate-500">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Venue-ish CTA */}
      <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-indigo-700 to-violet-800 px-6 py-14 text-center sm:px-12">
          <div className="pointer-events-none absolute inset-0 opacity-10 [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:20px_20px]" />
          <div className="relative">
            <h2 className="text-2xl font-bold text-white sm:text-3xl">
              Ready to find your next home?
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-indigo-100 sm:text-base">
              Join RentNest today — browse listings, submit rental requests, and manage everything
              from your dashboard.
            </p>
            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" onClick={() => router.push("/register")} className="bg-white text-indigo-700 shadow-lg hover:bg-indigo-50">
                <BedDouble className="size-5" />
                Get started free
              </Button>
              <Button
                size="lg"
                variant="ghost"
                onClick={() => router.push("/properties")}
                className="text-white hover:bg-white/10 hover:text-white"
              >
                Browse listings <ArrowRight className="size-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}