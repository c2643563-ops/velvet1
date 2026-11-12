"use client";
import { useEffect, useState } from "react";
import { Shell } from "@/components/shell";

type KitchenOrder = {
  id: string;
  table: number;
  customer?: string;
  status: string;
  note?: string;
  createdAt: string;
  items: { name: string; qty: number; price: number }[];
};

const columns = [
  { key: "New", title: "New / Accepted", match: ["New", "Accepted"], next: "Preparing", btn: "Accept & prepare" },
  { key: "Preparing", title: "Preparing", match: ["Preparing"], next: "Ready", btn: "Mark as ready" },
  { key: "Ready", title: "Ready to serve", match: ["Ready"], next: "Served", btn: "Complete & serve" },
];

export default function Kitchen() {
  const [orders, setOrders] = useState<KitchenOrder[]>([]);

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

  const move = async (id: string, status: string) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    });
  };

  return (
    <Shell title="Kitchen display" subtitle="Keep every order moving smoothly">
      <div className="page-heading">
        <div>
          <h2>Kitchen queue</h2>
          <p>Live kitchen workflow synced with Table QR Menus & Cashier POS</p>
        </div>
        <span className="live-pill">● LIVE KITCHEN SYNC</span>
      </div>

      <div className="kitchen-grid">
        {columns.map((col) => {
          const colOrders = orders.filter((o) => col.match.includes(o.status));
          return (
            <section className="kitchen-column" key={col.key}>
              <div className="kitchen-col-head">
                <b>{col.title}</b>
                <span>{colOrders.length}</span>
              </div>
              {colOrders.map((o) => (
                <article className="kitchen-card" key={o.id}>
                  <div className="kitchen-card-top">
                    <b>{o.id}</b>
                    <span>Table {String(o.table).padStart(2, "0")}</span>
                  </div>
                  <p>{o.items.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
                  {o.note && (
                    <p style={{ color: "#6c1438", fontWeight: 600, marginTop: 4 }}>Note: {o.note}</p>
                  )}
                  <small>Placed at {new Date(o.createdAt).toLocaleTimeString()}</small>
                  <button className="button primary full" onClick={() => move(o.id, col.next)}>
                    {col.btn}
                  </button>
                </article>
              ))}
              {colOrders.length === 0 && (
                <p style={{ fontSize: 11, color: "#887b7c", textAlign: "center", padding: "30px 10px" }}>
                  No orders in {col.title.toLowerCase()}
                </p>
              )}
            </section>
          );
        })}
      </div>
    </Shell>
  );
}
