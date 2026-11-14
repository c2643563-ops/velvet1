import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Velvet CafeOS | Cafe Management",
  description: "Velvet Cafe & Grill QR ordering and management system"
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
