"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Bell, Calendar, Menu, Search, X, Coffee } from "lucide-react";

const mobileLinks = [
  { href: "/", label: "Overview" },
  { href: "/orders", label: "Orders" },
  { href: "/pos", label: "Cashier POS" },
  { href: "/owner", label: "Owner mobile" },
  { href: "/kitchen", label: "Kitchen display" },
  { href: "/menu", label: "Menu management" },
  { href: "/tables", label: "Tables & QR codes" },
  { href: "/customers", label: "Customers" },
  { href: "/inventory", label: "Inventory" },
  { href: "/reports", label: "Reports" },
  { href: "/settings", label: "Settings" },
];

export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  const [open, setOpen] = useState(false);
  const path = usePathname();

  return (
    <>
      <header className="topbar">
        <div className="top-title">
          <button
            className="mobile-menu"
            onClick={() => setOpen(true)}
            aria-label="Open navigation menu"
          >
            <Menu size={20} />
          </button>
          <div>
            <h1>{title}</h1>
            <p>{subtitle}</p>
          </div>
        </div>

        <div className="top-actions">
          <label className="searchbox">
            <Search size={14} />
            <input type="search" placeholder="Search orders, tables, menu..." />
          </label>
          <button className="icon-button" aria-label="Notifications">
            <Bell size={16} />
            <i />
          </button>
          <div className="today-pill">
            <Calendar size={12} style={{ display: "inline", verticalAlign: "-2px", marginRight: 6 }} />
            Today<span>Nov 12, 2026</span>
          </div>
        </div>
      </header>

      {open && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(37, 7, 19, 0.55)",
            zIndex: 50,
            display: "flex",
          }}
          onClick={() => setOpen(false)}
        >
          <nav
            style={{
              width: 260,
              background: "linear-gradient(180deg,#350b1d 0%,#250713 100%)",
              color: "#f8eee9",
              padding: "22px 16px",
              overflowY: "auto",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <span style={{ display: "flex", alignItems: "center", gap: 9, fontWeight: 700 }}>
                <Coffee size={18} color="#c6a15b" /> Velvet CafeOS
              </span>
              <button
                onClick={() => setOpen(false)}
                style={{ background: "none", border: 0, color: "#ead8ae" }}
                aria-label="Close navigation menu"
              >
                <X size={18} />
              </button>
            </div>
            {mobileLinks.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className={`nav-link ${path === item.href ? "active" : ""}`}
              >
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
