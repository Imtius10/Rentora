"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input, Select } from "@/components/ui/field";
import { PRICE_RANGES } from "@/lib/constants";

export function PropertyFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [search, setSearch] = useState(searchParams.get("search") ?? "");
  const [location, setLocation] = useState(searchParams.get("location") ?? "");
  const [category, setCategory] = useState(searchParams.get("category") ?? "");
  const [priceIdx, setPriceIdx] = useState(resolvePriceIdx(searchParams));

  const applyFilters = () => {
    const params = new URLSearchParams();
    if (search.trim()) params.set("search", search.trim());
    if (location.trim()) params.set("location", location.trim());
    if (category) params.set("category", category);
    const range = PRICE_RANGES[priceIdx];
    if (range && (range.min || range.max)) {
      if (range.min) params.set("minPrice", String(range.min));
      if (range.max) params.set("maxPrice", String(range.max));
    }
    router.push(`/properties?${params.toString()}`);
  };

  const clearFilters = () => {
    setSearch("");
    setLocation("");
    setCategory("");
    setPriceIdx(0);
    router.push("/properties");
  };

  const hasFilters =
    search || location || category || priceIdx > 0 || searchParams.get("minPrice") || searchParams.get("maxPrice");

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-900/5 sm:p-5">
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.4fr_1.2fr_1fr_1fr_auto]">
        <div className="relative">
          <Search className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Search by title, area…"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white pl-10 pr-3.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <div className="relative">
          <input
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && applyFilters()}
            placeholder="Location (e.g. Gulshan)"
            className="h-10 w-full rounded-lg border border-slate-300 bg-white px-3.5 text-sm shadow-sm placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
        <Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="self-end"
        >
          <option value="">All categories</option>
          {[
            "apartment",
            "studio",
            "house",
            "condo",
            "penthouse",
            "suite",
            "villa",
            "hostel",
            "flat",
            "building",
          ].map((c) => (
            <option key={c} value={c}>
              {c[0].toUpperCase() + c.slice(1)}
            </option>
          ))}
        </Select>
        <Select value={priceIdx} onChange={(e) => setPriceIdx(Number(e.target.value))} className="self-end">
          {PRICE_RANGES.map((range, i) => (
            <option key={range.label} value={i}>
              {range.label}
            </option>
          ))}
        </Select>
        <div className="flex gap-2 sm:col-span-2 sm:justify-end lg:col-span-1 lg:justify-start">
          <Button onClick={applyFilters} className="w-full lg:w-auto">
            <Search className="size-4" />
            Search
          </Button>
          {hasFilters && (
            <Button variant="ghost" onClick={clearFilters} className="w-full lg:w-auto">
              <X className="size-4" />
              Clear
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

function resolvePriceIdx(searchParams: URLSearchParams): number {
  const min = searchParams.get("minPrice");
  const max = searchParams.get("maxPrice");
  if (!min && !max) return 0;
  return PRICE_RANGES.findIndex(
    (r) => (r.min ? String(r.min) : "") === (min ?? "") && (r.max ? String(r.max) : "") === (max ?? "")
  );
}