import type { Category, PaymentStatus, RentalStatus, UserRole, UserStatus } from "@/types";

export const DEFAULT_CATEGORIES = ["apartment", "studio", "house", "condo", "penthouse", "suite"];

export const ALLOWED_CATEGORIES = [
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
];

export const CATEGORY_META: Record<string, { label: string; description: string }> = {
  apartment: { label: "Apartment", description: "Modern units in multi-story buildings" },
  studio: { label: "Studio", description: "Compact single-room living" },
  house: { label: "House", description: "Independent homes with space" },
  condo: { label: "Condo", description: "Owned units with shared amenities" },
  penthouse: { label: "Penthouse", description: "Luxury top-floor residences" },
  suite: { label: "Suite", description: "Premium executive living" },
  villa: { label: "Villa", description: "Spacious standalone homes" },
  hostel: { label: "Hostel", description: "Affordable shared living" },
  flat: { label: "Flat", description: "Single-level residences" },
  building: { label: "Building", description: "Full-building rentals" },
};

export function getCategoryLabel(category: string): string {
  return CATEGORY_META[category]?.label ?? category;
}

export const ROLE_LABELS: Record<UserRole, string> = {
  TENANT: "Tenant",
  LANDLORD: "Landlord",
  ADMIN: "Admin",
};

export const RENTAL_STATUS_META: Record<
  RentalStatus,
  { label: string; className: string; dot: string }
> = {
  PENDING: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  APPROVED: {
    label: "Approved",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  REJECTED: {
    label: "Rejected",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

export const PAYMENT_STATUS_META: Record<
  PaymentStatus,
  { label: string; className: string; dot: string }
> = {
  PENDING: {
    label: "Payment pending",
    className: "bg-amber-50 text-amber-700 ring-amber-200",
    dot: "bg-amber-500",
  },
  PAID: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  FAILED: {
    label: "Failed",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
  CANCELLED: {
    label: "Cancelled",
    className: "bg-slate-100 text-slate-600 ring-slate-200",
    dot: "bg-slate-400",
  },
};

export const USER_STATUS_META: Record<
  UserStatus,
  { label: string; className: string; dot: string }
> = {
  ACTIVE: {
    label: "Active",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dot: "bg-emerald-500",
  },
  BLOCKED: {
    label: "Blocked",
    className: "bg-rose-50 text-rose-700 ring-rose-200",
    dot: "bg-rose-500",
  },
};

export const DEMO_ACCOUNTS = [
  { role: "Admin", email: "admin@rentnest.com", password: "admin123" },
  { role: "Landlord", email: "imtius1@example.com", password: "12345678" },
  { role: "Tenant", email: "tanvir@tenant.com", password: "123456" },
];

export const PRICE_RANGES = [
  { label: "Any price", min: "", max: "" },
  { label: "Under ৳20,000", min: "", max: 20000 },
  { label: "৳20,000 – ৳40,000", min: 20000, max: 40000 },
  { label: "৳40,000 – ৳60,000", min: 40000, max: 60000 },
  { label: "Above ৳60,000", min: 60000, max: "" },
];

export const SITE_NAME = "RentNest";

export const QUERY_KEYS = {
  properties: ["properties"],
  categories: ["categories"],
  me: ["me"],
  myRequests: ["my-requests"],
  landlordRequests: ["landlord-requests"],
  myPayments: ["my-payments"],
  myProperties: ["my-properties"],
  adminUsers: ["admin-users"],
  adminProperties: ["admin-properties"],
  adminRentals: ["admin-rentals"],
  adminStatistics: ["admin-statistics"],
} as const;