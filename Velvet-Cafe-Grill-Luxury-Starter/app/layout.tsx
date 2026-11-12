import type { Metadata } from "next";
import "./globals.css";
import { LiveNav } from "@/components/live-nav";

export const metadata: Metadata = {
  title: "Velvet Cafe & Grill | CafeOS",
  description: "Luxury QR ordering, cashier POS and cafe management for Velvet Cafe & Grill",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <LiveNav />
        {children}
      </body>
    </html>
  );
}
