import Link from "next/link";
import { MapPin } from "lucide-react";
import { formatBDT, titleCase } from "@/lib/utils";
import { getCategoryLabel } from "@/lib/constants";
import type { Property } from "@/types";
import { CategoryThumb } from "@/components/properties/category-icon";
import { Badge } from "@/components/ui/badge";

export function PropertyCard({ property }: { property: Property }) {
  return (
    <Link
      href={`/properties/${property.id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm shadow-slate-900/5 transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-500/10"
    >
      <CategoryThumb
        category={property.category}
        title={property.title}
        className="h-40 w-full shrink-0"
        iconClassName="size-14 text-white/95 transition group-hover:scale-110"
      />
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate text-base font-semibold text-slate-900 group-hover:text-indigo-700">
              {property.title}
            </h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
              <MapPin className="size-3.5 shrink-0" />
              <span className="truncate">{property.location}</span>
            </p>
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-slate-500">
          {property.description}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-lg font-bold text-slate-900">
              {formatBDT(property.price)}
            </span>
            <span className="text-xs text-slate-400">per month</span>
          </div>
          <Badge className="bg-indigo-50 text-indigo-700 ring-indigo-100">
            {titleCase(getCategoryLabel(property.category))}
          </Badge>
        </div>
      </div>
    </Link>
  );
}