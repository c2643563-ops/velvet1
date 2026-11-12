"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, ClipboardList, Utensils, CookingPot, QrCode, Users, Package, ChartNoAxesCombined, Settings, Coffee, ShoppingCart, Smartphone, type LucideIcon } from "lucide-react";

const groups: { label: string; links: { href: string; label: string; icon: LucideIcon; badge?: string }[] }[] = [
  { label: "WORKSPACE", links: [
    { href: "/", label: "Overview", icon: LayoutDashboard },
    { href: "/orders", label: "Orders", icon: ClipboardList },
    { href: "/pos", label: "Cashier POS", icon: ShoppingCart },
    { href: "/owner", label: "Owner mobile", icon: Smartphone },
    { href: "/kitchen", label: "Kitchen display", icon: CookingPot },
    { href: "/menu", label: "Menu management", icon: Utensils },
    { href: "/tables", label: "Tables & QR codes", icon: QrCode }
  ]},
  { label: "MANAGEMENT", links: [
    { href: "/customers", label: "Customers", icon: Users },
    { href: "/inventory", label: "Inventory", icon: Package },
    { href: "/reports", label: "Reports", icon: ChartNoAxesCombined },
    { href: "/settings", label: "Settings", icon: Settings }
  ]}
];

export function Sidebar() {
  const path = usePathname();
  return <aside className="sidebar">
    <Link href="/" className="brand"><span className="brand-icon"><Coffee size={20}/></span><span><b>velvet</b><small>CAFEOS</small></span></Link>
    <div className="branch-switch"><span className="branch-dot"/> Velvet Cafe & Grill <span className="chevron">⌄</span><small>MAIN BRANCH</small></div>
    {groups.map(group => <div className="nav-group" key={group.label}><p>{group.label}</p>{group.links.map(item => {
      const Icon = item.icon; const active = path === item.href;
      return <Link key={item.href} href={item.href} className={`nav-link ${active ? "active" : ""}`}><Icon size={18}/><span>{item.label}</span>{item.badge && <em>{item.badge}</em>}</Link>;
    })}</div>)}
    <div className="sidebar-bottom"><div className="help-card"><b>Need a hand?</b><span>Our support team is here to help.</span><button>Contact support</button></div><div className="profile"><div className="avatar">VC</div><div><b>Cafe Owner</b><small>Administrator</small></div><span className="dots">•••</span></div></div>
  </aside>;
}
