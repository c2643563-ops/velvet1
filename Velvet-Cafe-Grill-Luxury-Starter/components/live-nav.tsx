"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const sections = [
  { href: "/", label: "Main Dashboard" },
  { href: "/table/1", label: "Customer Menu (T-01)" },
  { href: "/pos", label: "Cashier POS" },
  { href: "/kitchen", label: "Kitchen" },
  { href: "/owner", label: "Owner Dashboard" },
  { href: "/tables", label: "Tables & QR" },
];

export function LiveNav() {
  const path = usePathname();

  return (
    <div className="velvet-live-bar">
      <div className="velvet-live-status">
        <span className="velvet-pulse" />
        <b>LIVE</b>
      </div>
      <div className="velvet-live-links">
        {sections.map((s) => {
          const isActive =
            s.href === "/"
              ? path === "/"
              : s.href === "/table/1"
              ? path.startsWith("/table/")
              : path === s.href;
          return (
            <Link
              key={s.href}
              href={s.href}
              className={`velvet-live-link ${isActive ? "active" : ""}`}
            >
              {s.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
