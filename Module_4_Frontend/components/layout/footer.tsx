import Link from "next/link";
import { Building2 } from "lucide-react";

const FOOTER_LINKS = {
  Explore: [
    { href: "/properties", label: "Browse properties" },
    { href: "/", label: "Categories" },
    { href: "/properties", label: "New listings" },
  ],
  Account: [
    { href: "/login", label: "Log in" },
    { href: "/register", label: "Create account" },
    { href: "/dashboard", label: "Dashboard" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 md:grid-cols-4">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2">
              <span className="flex size-9 items-center justify-center rounded-xl bg-indigo-500 text-white">
                <Building2 className="size-5" />
              </span>
              <span className="text-lg font-bold text-white">
                Rent<span className="text-indigo-400">Nest</span>
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-slate-400">
              The rental property marketplace for Bangladesh. Find your next home, list your
              property, and manage rentals in one place.
            </p>
          </div>
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h3 className="text-sm font-semibold text-white">{title}</h3>
              <ul className="mt-4 space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-slate-400 transition hover:text-white"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-10 border-t border-slate-800 pt-6 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} RentNest · Module 4 · Next.js frontend for the RentNest API
        </div>
      </div>
    </footer>
  );
}