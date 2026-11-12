"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowUpRight, ShoppingBag, Wallet, Users, Clock3, Plus, Download, CalendarDays } from "lucide-react";
import { OrderTable } from "./order-table";

export function Dashboard() {
  const router = useRouter();
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
    const t = setInterval(load, 2500);
    return () => clearInterval(t);
  }, []);

  const valid = orders.filter((o) => o.status !== "Cancelled");
  const liveSum = valid.reduce((s, o) => s + (Number(o.total) || 0), 0);
  const totalRevenue = 70480 + liveSum;
  const totalOrdersCount = 122 + valid.length;
  const avgOrder = Math.round(totalRevenue / Math.max(1, totalOrdersCount));
  const activeTablesCount = new Set(
    valid.filter((o) => !["Served", "Completed"].includes(o.status)).map((o) => o.table)
  ).size;

  const stats = [
    { label: "Total revenue", value: `Rs. ${totalRevenue.toLocaleString("en-PK")}`, change: "+12.8%", note: "vs. yesterday", icon: Wallet, color: "green" },
    { label: "Total orders", value: String(totalOrdersCount), change: "+8.2%", note: "vs. yesterday", icon: ShoppingBag, color: "blue" },
    { label: "Avg. order value", value: `Rs. ${avgOrder.toLocaleString("en-PK")}`, change: "+4.6%", note: "vs. yesterday", icon: Clock3, color: "purple" },
    { label: "Active tables", value: `${String(activeTablesCount).padStart(2, "0")} / 15`, change: `${Math.round((activeTablesCount / 15) * 100)}%`, note: "live table occupancy", icon: Users, color: "orange" },
  ];

  return (
    <>
      <div className="welcome-row">
        <div>
          <div className="eyebrow">
            <span className="live-dot" /> LIVE OVERVIEW
          </div>
          <h2>
            Good afternoon, Owner <span>✦</span>
          </h2>
          <p>Here’s what’s happening live at Velvet Cafe & Grill today.</p>
        </div>
        <div className="welcome-actions">
          <button className="button secondary">
            <CalendarDays size={16} /> Nov 12, 2026
          </button>
          <button className="button primary" onClick={() => router.push("/table/1")}>
            <Plus size={16} /> New table order
          </button>
        </div>
      </div>

      <section className="stats-grid">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <article className="stat-card" key={s.label}>
              <div className="stat-top">
                <span>{s.label}</span>
                <i className={`stat-icon ${s.color}`}>
                  <Icon size={18} />
                </i>
              </div>
              <h3>{s.value}</h3>
              <div className="stat-foot">
                <span className="trend">
                  <ArrowUpRight size={14} />
                  {s.change}
                </span>
                <span>{s.note}</span>
              </div>
            </article>
          );
        })}
      </section>

      <section className="content-grid">
        <article className="panel sales-panel">
          <div className="panel-heading">
            <div>
              <h3>Revenue overview</h3>
              <p>Track your cafe’s performance</p>
            </div>
            <button className="select-button">This week⌄</button>
          </div>
          <div className="revenue-total">
            <strong>Rs. {(328910 + liveSum).toLocaleString("en-PK")}</strong>
            <span>
              <ArrowUpRight size={14} /> 18.4%
            </span>
            <small>vs. last week</small>
          </div>
          <div className="chart">
            <div className="chart-y">
              <span>80k</span>
              <span>60k</span>
              <span>40k</span>
              <span>20k</span>
              <span>0</span>
            </div>
            <div className="chart-area">
              <div className="grid-lines">
                <i />
                <i />
                <i />
                <i />
                <i />
              </div>
              <svg viewBox="0 0 700 190" preserveAspectRatio="none" role="img" aria-label="Weekly revenue chart">
                <defs>
                  <linearGradient id="fill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#6c1438" stopOpacity=".22" />
                    <stop offset="100%" stopColor="#6c1438" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 145 C45 130 60 145 100 116 S165 120 200 96 S260 115 300 80 S365 96 400 70 S460 82 500 55 S565 76 600 38 S665 45 700 18 L700 190 L0 190Z"
                  fill="url(#fill)"
                />
                <path
                  d="M0 145 C45 130 60 145 100 116 S165 120 200 96 S260 115 300 80 S365 96 400 70 S460 82 500 55 S565 76 600 38 S665 45 700 18"
                  fill="none"
                  stroke="#6c1438"
                  strokeWidth="3"
                  vectorEffect="non-scaling-stroke"
                />
              </svg>
              <div className="chart-x">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span>Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </article>

        <article className="panel quick-panel">
          <div className="panel-heading">
            <div>
              <h3>Quick actions</h3>
              <p>Common tasks, one click away</p>
            </div>
          </div>
          <div className="quick-list">
            <button onClick={() => router.push("/menu")}>
              <span className="quick-icon mint">
                <Plus />
              </span>
              <span>
                <b>Menu management</b>
                <small>View & manage your luxury menu</small>
              </span>
              <ArrowUpRight />
            </button>
            <button onClick={() => router.push("/pos")}>
              <span className="quick-icon lavender">
                <Download />
              </span>
              <span>
                <b>Open Cashier POS</b>
                <small>Verify payments & print receipts</small>
              </span>
              <ArrowUpRight />
            </button>
            <button onClick={() => router.push("/tables")}>
              <span className="quick-icon peach">
                <Users />
              </span>
              <span>
                <b>Manage tables & QR</b>
                <small>15 live scannable table QR codes</small>
              </span>
              <ArrowUpRight />
            </button>
          </div>
        </article>
      </section>

      <section className="panel orders-panel">
        <div className="panel-heading">
          <div>
            <h3>
              Recent orders <span className="count-badge">{orders.length}</span>
            </h3>
            <p>Monitor and advance live incoming orders</p>
          </div>
          <button className="button secondary small" onClick={() => router.push("/orders")}>
            View all orders <ArrowUpRight size={14} />
          </button>
        </div>
        <OrderTable />
      </section>

      <p className="demo-note">
        Live cloud workspace · Orders placed on any Table QR link sync across POS, Kitchen, Owner & Main Dashboard.
      </p>
    </>
  );
}
