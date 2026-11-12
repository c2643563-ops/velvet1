"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Printer, RefreshCw, ArrowLeft } from "lucide-react";

type LiveOrder = {
  id: string;
  table: number;
  customer: string;
  method: string;
  status: string;
  paymentStatus: string;
  total: number;
  createdAt: string;
  items: { name: string; qty: number; price: number }[];
  note?: string;
};

export default function POS() {
  const [orders, setOrders] = useState<LiveOrder[]>([]);

  const load = async () => {
    try {
      const res = await fetch("/api/orders", { cache: "no-store" });
      if (res.ok) {
        const data = await res.json();
        setOrders(data.orders || []);
      }
    } catch {}
  };

  useEffect(() => {
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  const update = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  const paid = async (id: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, paymentStatus: "Paid" } : o)));
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, paymentStatus: "Paid" }),
    });
  };

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">FRONT OF HOUSE · LIVE SYNC</div>
          <h2>Cashier POS</h2>
          <p>Live orders synced in real time across Customer QR Menus, Kitchen & Owner Dashboard.</p>
        </div>
        <div className="welcome-actions">
          <Link href="/" className="button secondary">
            <ArrowLeft size={14} /> Main Dashboard
          </Link>
          <Link href="/table/1" className="button secondary">
            + Test Table 01 Order
          </Link>
          <button className="button primary" onClick={load}>
            <RefreshCw size={14} /> Refresh
          </button>
        </div>
      </div>

      <div className="panel">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ORDER</th>
                <th>TABLE / GUEST</th>
                <th>ITEMS</th>
                <th>TOTAL</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
                <th>ACTION</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id}>
                  <td>
                    <b>{o.id}</b>
                    <span className="sub-cell">{new Date(o.createdAt).toLocaleTimeString()}</span>
                  </td>
                  <td>
                    <span className="table-chip">Table {String(o.table).padStart(2, "0")}</span>
                    {o.customer && <span className="sub-cell">{o.customer}</span>}
                  </td>
                  <td>
                    {o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}
                    {o.note && <span className="sub-cell">Note: {o.note}</span>}
                  </td>
                  <td>
                    <b>Rs. {o.total.toLocaleString("en-PK")}</b>
                  </td>
                  <td>
                    <b style={{ textTransform: "uppercase" }}>{o.method}</b>
                    <span className="sub-cell">{o.paymentStatus}</span>
                  </td>
                  <td>
                    <span className="table-chip">{o.status}</span>
                  </td>
                  <td>
                    <select
                      className="form-input"
                      style={{ minWidth: 130, padding: "7px 9px", marginTop: 0 }}
                      value={o.status}
                      onChange={(e) => update(o.id, e.target.value)}
                    >
                      <option>New</option>
                      <option>Accepted</option>
                      <option>Preparing</option>
                      <option>Ready</option>
                      <option>Served</option>
                      <option>Completed</option>
                      <option>Cancelled</option>
                    </select>
                    <div style={{ display: "flex", gap: 10, marginTop: 6 }}>
                      {o.paymentStatus !== "Paid" && (
                        <button className="text-button" onClick={() => paid(o.id)}>
                          ✓ Confirm payment
                        </button>
                      )}
                      <button className="text-button" onClick={() => window.print()}>
                        <Printer size={13} /> Print
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="empty-state">
              <div>☕</div>
              <h2>No orders yet</h2>
              <p>Scan one of the table QR codes or open Table 01 to place a live order.</p>
            </div>
          )}
        </div>
      </div>
      <p className="demo-note">
        Live server sync active — orders placed from any browser tab or scanned table QR appear here automatically.
      </p>
    </main>
  );
}
