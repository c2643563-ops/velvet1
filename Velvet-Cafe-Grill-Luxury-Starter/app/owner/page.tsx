"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { TrendingUp, ShoppingBag, Wallet, Users, ArrowLeft } from "lucide-react";

export default function Owner() {
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/orders", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch {}
    };
    load();
    const t = setInterval(load, 2000);
    return () => clearInterval(t);
  }, []);

  const validOrders = orders.filter((o) => o.status !== "Cancelled");
  const revenue = validOrders.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const activeTables = new Set(
    validOrders
      .filter((o) => !["Served", "Completed"].includes(o.status))
      .map((o) => o.table)
  ).size;

  return (
    <main className="page-content">
      <div className="page-heading">
        <div>
          <div className="eyebrow">OWNER CONTROL CENTRE</div>
          <h2>Velvet Cafe & Grill overview</h2>
          <p>Mobile-friendly live daily operations snapshot.</p>
        </div>
        <div className="welcome-actions">
          <Link href="/" className="button secondary">
            <ArrowLeft size={14} /> Main Dashboard
          </Link>
          <span className="live-pill">● LIVE SYNC</span>
        </div>
      </div>

      <div className="stats-grid">
        <Stat icon={<Wallet size={18} />} label="Recorded sales" value={`Rs. ${revenue.toLocaleString("en-PK")}`} />
        <Stat icon={<ShoppingBag size={18} />} label="Total orders" value={String(validOrders.length)} />
        <Stat
          icon={<TrendingUp size={18} />}
          label="Average order"
          value={`Rs. ${validOrders.length ? Math.round(revenue / validOrders.length).toLocaleString("en-PK") : 0}`}
        />
        <Stat icon={<Users size={18} />} label="Active tables" value={`${String(activeTables).padStart(2, "0")} / 15`} />
      </div>

      <div className="panel">
        <h3 style={{ marginTop: 0 }}>Live recent orders</h3>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ORDER</th>
                <th>TABLE</th>
                <th>ITEMS</th>
                <th>TIME</th>
                <th>AMOUNT</th>
                <th>PAYMENT</th>
                <th>STATUS</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 20).map((o) => (
                <tr key={o.id}>
                  <td>
                    <b>{o.id}</b>
                  </td>
                  <td>Table {String(o.table).padStart(2, "0")}</td>
                  <td>{Array.isArray(o.items) ? o.items.map((i: any) => `${i.qty}× ${i.name}`).join(", ") : o.items}</td>
                  <td>{new Date(o.createdAt).toLocaleTimeString()}</td>
                  <td>
                    <b>Rs. {Number(o.total).toLocaleString("en-PK")}</b>
                  </td>
                  <td>{o.paymentStatus}</td>
                  <td>
                    <span className="table-chip">{o.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <p className="demo-note">
        Live owner snapshot synced with Cashier POS, Kitchen Display, and all 15 Table QR Menus.
      </p>
    </main>
  );
}

function Stat({ icon, label, value }: { icon: any; label: string; value: string }) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        {label}
        <span className="stat-icon green">{icon}</span>
      </div>
      <h3>{value}</h3>
      <div className="stat-foot">Live daily totals</div>
    </article>
  );
}
