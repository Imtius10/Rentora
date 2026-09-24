import type { LucideIcon } from "lucide-react";
import {
  Building,
  Building2,
  BuildingComplex,
  Castle,
  Home,
  Hotel,
  House,
  Houses,
  Landmark,
  Tent,
  Warehouse,
} from "lucide-react";

const ICON_MAP: Record<string, LucideIcon> = {
  apartment: BuildingComplex,
  studio: Home,
  house: House,
  condo: Building2,
  penthouse: Castle,
  suite: Hotel,
  villa: Warehouse,
  hostel: Tent,
  flat: Building,
  building: Landmark,
  home: Houses,
};

const GRADIENTS = [
  "from-indigo-600 via-violet-600 to-purple-700",
  "from-emerald-600 via-teal-600 to-cyan-700",
  "from-rose-600 via-pink-600 to-fuchsia-700",
  "from-amber-500 via-orange-600 to-red-700",
  "from-sky-600 via-blue-600 to-indigo-700",
];

export function categoryGradient(category: string): string {
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = (hash * 31 + category.charCodeAt(i)) >>> 0;
  }
  return GRADIENTS[hash % GRADIENTS.length];
}

function categoryIcon(category: string): LucideIcon {
  return ICON_MAP[category.toLowerCase()] ?? House;
}

export function CategoryIcon({
  category,
  className,
}: {
  category: string;
  className?: string;
}) {
  const Icon = categoryIcon(category);
  return <Icon className={className} />;
}

export function CategoryThumb({
  category,
  title,
  className,
  iconClassName,
}: {
  category: string;
  title: string;
  className?: string;
  iconClassName?: string;
}) {
  const Icon = categoryIcon(category);
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden bg-gradient-to-br ${categoryGradient(
        category
      )} ${className ?? ""}`}
    >
      <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(circle_at_20%_20%,white_1.5px,transparent_1.5px)] [background-size:18px_18px]" />
      <div className="absolute -right-8 -top-10 size-40 rounded-full bg-white/15 blur-2xl" />
      <div className="absolute -bottom-12 -left-8 size-40 rounded-full bg-black/15 blur-2xl" />
      <Icon className="absolute -bottom-3 -right-3 size-24 text-white/25" />
      <div className="relative rounded-full bg-white/20 p-3.5 ring-1 ring-white/40 backdrop-blur-sm shadow-lg shadow-black/10">
        <Icon className={iconClassName ?? "size-10 text-white drop-shadow"} />
      </div>
      <span className="sr-only">{title}</span>
    </div>
  );
}