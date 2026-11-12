"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";
import { QrCode, Users, Download, ExternalLink } from "lucide-react";

export default function Tables() {
  const [occupiedTables, setOccupiedTables] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          const active = new Set<number>(
            (data.orders || [])
              .filter((o: any) => !["Served", "Completed", "Cancelled"].includes(o.status))
              .map((o: any) => Number(o.table))
          );
          setOccupiedTables(active);
        }
      } catch {}
    };
    load();
    const t = setInterval(load, 3000);
    return () => clearInterval(t);
  }, []);

  return (
    <Shell title="Tables & QR codes" subtitle="15 live table entry points with scannable HTTPS QR codes">
      <div className="page-heading">
        <div>
          <h2>Table management</h2>
          <p>
            15 tables configured with live QR codes. Scan any code with your phone or click to open that table’s menu.
          </p>
        </div>
        <a className="button primary" href="/qr/Velvet-Cafe-Grill-15-Table-QR.pdf" download>
          <Download size={16} /> Download 15-Table QR PDF
        </a>
      </div>

      <div className="table-grid">
        {Array.from({ length: 15 }, (_, i) => {
          const tableNum = i + 1;
          const isOccupied = occupiedTables.has(tableNum);
          return (
            <article className="table-card" key={i}>
              <div className="table-card-top">
                <span className={`table-state ${isOccupied ? "occupied" : "available"}`}>
                  {isOccupied ? "Occupied" : "Available"}
                </span>
                <QrCode size={21} />
              </div>
              <h3>Table {String(tableNum).padStart(2, "0")}</h3>
              <p>
                <Users size={14} /> {i % 3 === 0 ? 4 : i % 3 === 1 ? 2 : 6} seats
              </p>
              <Link href={`/table/${tableNum}`}>
                <img
                  src={`/qr/velvet-table-${String(tableNum).padStart(2, "0")}.png`}
                  alt={`Table ${tableNum} QR`}
                  style={{ display: "block", width: 130, height: 158, objectFit: "contain", margin: "8px auto" }}
                />
              </Link>
              <Link className="text-button" href={`/table/${tableNum}`}>
                Open customer menu <ExternalLink size={13} />
              </Link>
              <a
                className="text-button"
                href={`/qr/velvet-table-${String(tableNum).padStart(2, "0")}.png`}
                download
              >
                Download this QR <Download size={13} />
              </a>
            </article>
          );
        })}
      </div>
      <p className="demo-note">
        All 15 QR codes encode your live cloud URL — scan with any phone camera to place real-time table orders.
      </p>
    </Shell>
  );
}
