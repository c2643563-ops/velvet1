"use client";
import { Bell, Search, Menu } from "lucide-react";
export function Topbar({ title, subtitle }: { title: string; subtitle: string }) {
  return <header className="topbar"><div className="top-title"><button className="mobile-menu"><Menu/></button><div><h1>{title}</h1><p>{subtitle}</p></div></div><div className="top-actions"><div className="searchbox"><Search size={16}/><input placeholder="Search anything..."/></div><button className="icon-button" aria-label="Notifications"><Bell size={18}/><i/></button><div className="today-pill">Today <span>⌄</span></div></div></header>;
}
