"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";

type LiveOrder = {
  id: string;
  table: number;
  customer?: string;
  method: string;
  payment?: string;
  paymentStatus: string;
  status: string;
  total: number;
  createdAt: string;
  items: { name: string; qty: number; price: number }[];
};

const statusClass: Record<string, string> = {
  New: "status-new",
  Accepted: "status-new",
  Preparing: "status-preparing",
  Ready: "status-ready",
  Served: "status-served",
  Completed: "status-served",
  Cancelled: "status-served",
};

const nextStatus: Record<string, string> = {
  New: "Preparing",
  Accepted: "Preparing",
  Preparing: "Ready",
  Ready: "Served",
  Served: "Completed",
  Completed: "Completed",
};

export function OrderTable() {
  const [orders, setOrders] = useState<LiveOrder[]>([]);
  const router = useRouter();

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
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, []);

  async function advance(order: LiveOrder) {
    const status = nextStatus[order.status] || "Served";
    setOrders((old) => old.map((o) => (o.id === order.id ? { ...o, status } : o)));
    await fetch("/api/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: order.id, status }),
    });
  }

  return (
    <div className="table-wrap">
      <table>
        <thead>
          <tr>
            <th>ORDER ID</th>
            <th>TABLE</th>
            <th>ORDER DETAILS</th>
            <th>AMOUNT</th>
            <th>PAYMENT</th>
            <th>STATUS</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => {
            const payType = o.method === "cash" ? "Cash" : "Online";
            return (
              <tr key={o.id}>
                <td>
                  <b>{o.id}</b>
                  <small className="sub-cell">{new Date(o.createdAt).toLocaleTimeString()}</small>
                </td>
                <td>
                  <span className="table-chip">T-{String(o.table).padStart(2, "0")}</span>
                </td>
                <td className="order-detail">
                  {Array.isArray(o.items) ? o.items.map((i) => `${i.qty}× ${i.name}`).join(", ") : ""}
                </td>
                <td>
                  <b>Rs. {Number(o.total).toLocaleString("en-PK")}</b>
                </td>
                <td>
                  <span className={`payment ${payType.toLowerCase()}`}>
                    {payType} ({o.paymentStatus})
                  </span>
                </td>
                <td>
                  <button
                    className={`status ${statusClass[o.status] || "status-new"}`}
                    onClick={() => advance(o)}
                    title="Click to advance order status"
                  >
                    {o.status}
                  </button>
                </td>
                <td>
                  <button className="more" onClick={() => router.push("/pos")} title="Manage in Cashier POS">
                    <MoreHorizontal size={18} />
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className="table-footer">
        Showing {orders.length} live orders{" "}
        <button onClick={() => router.push("/pos")}>
          Open Cashier POS <ArrowUpRight size={14} />
        </button>
      </div>
    </div>
  );
}
