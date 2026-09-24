"use client";

import { useEffect, useState, type ReactNode } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  BarChart3,
  Building2,
  Home,
  KeyRound,
  LayoutDashboard,
  LogOut,
  Menu,
  Receipt,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/hooks/use-auth";
import { ROLE_LABELS } from "@/lib/constants";
import { PageLoader } from "@/components/ui/spinner";
import type { UserRole } from "@/types";

interface NavItem {
  href: string;
  label: string;
  icon: typeof Home;
  roles: UserRole[];
}

const NAV_ITEMS: NavItem[] = [
  { href: "/dashboard", label: "Overview", icon: LayoutDashboard, roles: ["TENANT", "LANDLORD", "ADMIN"] },
  { href: "/dashboard/profile", label: "My Profile", icon: KeyRound, roles: ["TENANT", "LANDLORD", "ADMIN"] },
  { href: "/dashboard/requests", label: "Rental Requests", icon: Receipt, roles: ["TENANT", "LANDLORD"] },
  { href: "/dashboard/payments", label: "Payments", icon: BarChart3, roles: ["TENANT"] },
  { href: "/dashboard/properties", label: "My Properties", icon: Building2, roles: ["LANDLORD"] },
  { href: "/dashboard/properties/new", label: "Add Property", icon: Home, roles: ["LANDLORD"] },
  { href: "/dashboard/users", label: "Users", icon: Users, roles: ["ADMIN"] },
  { href: "/dashboard/properties", label: "Properties", icon: Building2, roles: ["ADMIN"] },
  { href: "/dashboard/rentals", label: "Rental Requests", icon: Receipt, roles: ["ADMIN"] },
];

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, isLoading, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [isLoading, user, pathname, router]);

  useEffect(() => {
    if (!isLoading && user && user.activeStatus === "BLOCKED") {
      router.replace("/login?reason=blocked");
    }
  }, [isLoading, user, router]);

  if (isLoading || !user) {
    return <PageLoader label="Loading your dashboard…" />;
  }

  const items = NAV_ITEMS.filter((item) => item.roles.includes(user.role));

  const sidebar = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center gap-2 px-5">
        <Link href="/" className="flex items-center gap-2">
          <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Building2 className="size-5" />
          </span>
          <span className="text-base font-bold text-slate-900">
            Rent<span className="text-indigo-600">Nest</span>
          </span>
        </Link>
      </div>
      <div className="border-b border-slate-100 px-5 py-4">
        <p className="text-sm font-semibold text-slate-900">{user.name}</p>
        <p className="truncate text-xs text-slate-500">{user.email}</p>
        <span className="mt-2 inline-block rounded-full bg-indigo-50 px-2 py-0.5 text-[11px] font-medium text-indigo-700">
          {ROLE_LABELS[user.role]}
        </span>
      </div>
      <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
        {items.map((item) => {
          const active =
            item.href === "/dashboard"
              ? pathname === "/dashboard"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href + item.label}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition",
                active
                  ? "bg-indigo-600 text-white shadow-sm shadow-indigo-600/20"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
              )}
            >
              <item.icon className="size-4.5" />
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-100 p-3">
        <button
          type="button"
          onClick={() => logout()}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-rose-600 transition hover:bg-rose-50"
        >
          <LogOut className="size-4.5" />
          Log out
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-[calc(100vh-4rem)] bg-slate-50">
      <div className="mx-auto flex max-w-[110rem]">
        <aside className="sticky top-0 hidden h-screen w-64 shrink-0 border-r border-slate-200 bg-white lg:block">
          {sidebar}
        </aside>

        {sidebarOpen && (
          <div className="fixed inset-0 z-[80] lg:hidden">
            <div
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute inset-y-0 left-0 w-72 bg-white shadow-2xl">
              <button
                type="button"
                onClick={() => setSidebarOpen(false)}
                className="absolute right-3 top-4 rounded-md p-1 text-slate-400 hover:bg-slate-100"
              >
                <X className="size-5" />
              </button>
              {sidebar}
            </aside>
          </div>
        )}

        <div className="min-w-0 flex-1">
          <div className="flex h-14 items-center justify-between border-b border-slate-200 bg-white px-4 lg:hidden">
            <span className="text-sm font-semibold text-slate-700">Dashboard</span>
            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="rounded-md p-2 text-slate-600 hover:bg-slate-100"
            >
              <Menu className="size-5" />
            </button>
          </div>
          <main className="px-4 py-6 sm:px-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
    </div>
  );
}