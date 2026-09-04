"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { name: "Dashboard", href: "/officer" },
  { name: "Farms", href: "/officer/farms" },
  { name: "Disease Map", href: "/officer/disease-map" },
  { name: "Alerts", href: "/officer/alerts" },
  { name: "Analytics", href: "/officer/analytics" },
  { name: "Expert Reviews", href: "/officer/expert-reviews" },
  { name: "Field Confirmation", href: "/officer/confirmation" },
  { name: "Reports", href: "/officer/reports" },
];

export default function OfficerHeader() {
  const pathname = usePathname();

  // Temporary frontend region.
  // This will later come from the authenticated expert profile/backend.
  const expertRegion = "Maharashtra";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white">
      <div className="flex w-full min-h-[72px] items-center gap-6 px-6 lg:px-8 box-border">
        <Link
          href="/officer"
          className="flex shrink-0 items-center gap-2 text-xl font-bold tracking-tight text-green-800"
        >
          <span className="text-2xl">🌱</span>
          <span>agrossential</span>
        </Link>

        <nav className="hidden flex-1 min-w-0 items-center justify-center gap-4 xl:gap-6 overflow-x-auto lg:flex">
          {links.map((link) => {
            const active =
              link.href === "/officer"
                ? pathname === "/officer"
                : pathname.startsWith(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`whitespace-nowrap text-sm font-semibold transition ${
                  active
                    ? "text-green-700"
                    : "text-slate-500 hover:text-green-700"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="ml-auto flex shrink-0 items-center gap-3">
          <div className="hidden text-right sm:block">
            <strong className="block text-sm text-slate-800">
              Agricultural Expert
            </strong>
            <span className="text-xs text-slate-500">
              {expertRegion} Region
            </span>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-full border border-green-200 bg-green-100 text-sm font-bold text-green-800">
            AO
          </div>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto border-t border-slate-100 px-4 py-2 lg:hidden">
        {links.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="whitespace-nowrap text-xs font-semibold text-slate-600"
          >
            {link.name}
          </Link>
        ))}
      </div>
    </header>
  );
}
