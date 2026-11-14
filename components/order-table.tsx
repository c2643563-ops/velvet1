"use client";
import { useState } from "react";
import { demoOrders, type Order, type OrderStatus } from "@/lib/demo-data";
import { ArrowUpRight, MoreHorizontal } from "lucide-react";

const badge: Record<OrderStatus, string> = { New: "status-new", Preparing: "status-preparing", Ready: "status-ready", Served: "status-served" };
export function OrderTable() {
  const [orders, setOrders] = useState<Order[]>(demoOrders);
  function advance(id: string) {
    const next: Record<OrderStatus, OrderStatus> = { New: "Preparing", Preparing: "Ready", Ready: "Served", Served: "Served" };
    setOrders(old => old.map(o => o.id === id ? { ...o, status: next[o.status] } : o));
  }
  return <div className="table-wrap"><table><thead><tr><th>ORDER ID</th><th>TABLE</th><th>ORDER DETAILS</th><th>AMOUNT</th><th>PAYMENT</th><th>STATUS</th><th></th></tr></thead><tbody>
    {orders.map(o => <tr key={o.id}><td><b>{o.id}</b><small className="sub-cell">{o.time}</small></td><td><span className="table-chip">T-{String(o.table).padStart(2,"0")}</span></td><td className="order-detail">{o.items}</td><td><b>Rs. {o.total.toLocaleString("en-PK")}</b></td><td><span className={`payment ${o.payment.toLowerCase()}`}>{o.payment}</span></td><td><button className={`status ${badge[o.status]}`} onClick={() => advance(o.id)} title="Click to advance status">{o.status}</button></td><td><button className="more"><MoreHorizontal size={18}/></button></td></tr>)}
  </tbody></table><div className="table-footer">Showing {orders.length} recent orders <button>View all orders <ArrowUpRight size={14}/></button></div></div>;
}
