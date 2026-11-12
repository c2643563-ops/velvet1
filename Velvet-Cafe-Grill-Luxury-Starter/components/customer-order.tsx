"use client";
import Link from "next/link";
import { useMemo, useState } from "react";
import { menuItems } from "@/lib/demo-data";
import { ShoppingBag, Plus, Minus, CheckCircle2 } from "lucide-react";

type Cart = Record<number, number>;

export default function CustomerOrder({ tableNo }: { tableNo: number }) {
  const [category, setCategory] = useState("All");
  const [cart, setCart] = useState<Cart>({});
  const [checkout, setCheckout] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [method, setMethod] = useState("cash");
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [orderNo, setOrderNo] = useState("");
  const [submittedTotal, setSubmittedTotal] = useState(0);

  const categories = ["All", "Burgers", "Mains", "Sides", "Drinks"];
  const filtered = useMemo(
    () => menuItems.filter((p) => category === "All" || p.category === category),
    [category]
  );

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = menuItems.reduce((s, p) => s + p.price * (cart[p.id] || 0), 0);

  const change = (id: number, d: number) =>
    setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) + d) }));

  const submit = async () => {
    if (!count || submitting) return;
    setSubmitting(true);
    const no = "VC-" + Date.now().toString().slice(-6);
    const items = menuItems
      .filter((p) => cart[p.id])
      .map((p) => ({ name: p.name, qty: cart[p.id], price: p.price }));

    const payload = {
      id: no,
      table: tableNo,
      customer: name || "Table Guest",
      phone,
      method,
      note,
      total,
      items,
    };

    try {
      await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } catch {
      // Fallback to browser storage if offline
    }

    try {
      const orders = JSON.parse(localStorage.getItem("velvet_orders") || "[]");
      orders.unshift({
        ...payload,
        status: "New",
        paymentStatus: method === "cash" ? "Pending" : "Awaiting verification",
        createdAt: new Date().toISOString(),
      });
      localStorage.setItem("velvet_orders", JSON.stringify(orders));
    } catch {}

    setOrderNo(no);
    setSubmittedTotal(total);
    setSent(true);
    setCheckout(false);
    setCart({});
    setSubmitting(false);
  };

  if (sent) {
    return (
      <main className="customer-page" style={{ display: "grid", placeItems: "center", padding: 20 }}>
        <section className="panel" style={{ maxWidth: 460, textAlign: "center", padding: 35 }}>
          <CheckCircle2 size={48} color="#6c1438" style={{ margin: "0 auto 10px" }} />
          <h1>Order received!</h1>
          <p>
            Your order <b>{orderNo}</b> has been sent live to the cashier & kitchen.
          </p>
          <p>
            Table {tableNo} · <b>Rs. {submittedTotal.toLocaleString("en-PK")}</b>
          </p>
          <small>Keep this screen open. Staff will confirm and prepare your order right away.</small>
          <button
            className="button primary full"
            onClick={() => {
              setSent(false);
              setName("");
              setPhone("");
              setNote("");
            }}
          >
            Place another order
          </button>
          <Link href="/pos" className="button secondary full" style={{ textDecoration: "none" }}>
            Open Cashier POS →
          </Link>
          <Link href="/kitchen" className="button secondary full" style={{ textDecoration: "none" }}>
            Open Kitchen Display →
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="customer-page">
      <header className="customer-header">
        <div className="customer-brand">
          <span>V</span>
          <div>
            <b>velvet</b>
            <small>CAFE & GRILL</small>
          </div>
        </div>
        <span className="table-label">TABLE {String(tableNo).padStart(2, "0")}</span>
      </header>

      <section className="customer-hero">
        <span>MADE FRESH. SERVED WITH LOVE.</span>
        <h1>
          Good food, <em>good mood.</em>
        </h1>
        <p>Choose your favourites and order directly from Table {String(tableNo).padStart(2, "0")}.</p>
      </section>

      <div className="customer-content">
        <h2>Our menu</h2>
        <div className="category-row">
          {categories.map((c) => (
            <button key={c} onClick={() => setCategory(c)} className={category === c ? "selected" : ""}>
              {c}
            </button>
          ))}
        </div>

        <div className="customer-menu-grid">
          {filtered.map((p) => (
            <article className="customer-product" key={p.id}>
              <img src={p.image} alt={p.name} />
              <div className="customer-product-info">
                <span>{p.category}</span>
                <h3>{p.name}</h3>
                <p>{p.description}</p>
                <div>
                  <b>Rs. {p.price.toLocaleString("en-PK")}</b>
                  <button onClick={() => change(p.id, 1)} aria-label={`Add ${p.name}`}>
                    <Plus size={17} />
                  </button>
                </div>
                {cart[p.id] > 0 && (
                  <div className="qty-control">
                    <button onClick={() => change(p.id, -1)} aria-label="Decrease quantity">
                      <Minus size={14} />
                    </button>
                    <b>{cart[p.id]}</b>
                    <button onClick={() => change(p.id, 1)} aria-label="Increase quantity">
                      <Plus size={14} />
                    </button>
                  </div>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>

      {count > 0 && (
        <div className="cart-bar">
          <span>
            <ShoppingBag size={18} />
            {count} items · Rs. {total.toLocaleString("en-PK")}
          </span>
          <button onClick={() => setCheckout(true)}>Checkout →</button>
        </div>
      )}

      {checkout && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "#350b1dcc",
            zIndex: 40,
            display: "grid",
            placeItems: "center",
            padding: 15,
          }}
        >
          <section className="panel" style={{ width: "min(460px,100%)", maxHeight: "90vh", overflow: "auto" }}>
            <h2>Complete your order</h2>
            <p>
              Table {tableNo} · {count} items · <b>Rs. {total.toLocaleString("en-PK")}</b>
            </p>
            <label className="form-label">
              Name
              <input
                className="form-input"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </label>
            <label className="form-label">
              Phone (optional)
              <input
                className="form-input"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03xx-xxxxxxx"
              />
            </label>
            <label className="form-label">
              Special instructions
              <textarea
                className="form-input"
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Less spicy, no onion..."
              />
            </label>
            <label className="form-label">
              Payment method
              <select className="form-input" value={method} onChange={(e) => setMethod(e.target.value)}>
                <option value="cash">Cash at counter</option>
                <option value="jazzcash">JazzCash (verification required)</option>
                <option value="easypaisa">Easypaisa (verification required)</option>
                <option value="raast">Raast / Bank transfer (verification required)</option>
              </select>
            </label>
            {method !== "cash" && (
              <p className="setup-warning">
                Cashier will verify your {method.toUpperCase()} transfer at POS before marking paid.
              </p>
            )}
            <button className="button primary full" onClick={submit} disabled={submitting}>
              {submitting ? "Sending order..." : `Confirm order · Rs. ${total.toLocaleString("en-PK")}`}
            </button>
            <button className="button secondary full" onClick={() => setCheckout(false)}>
              Back to menu
            </button>
          </section>
        </div>
      )}

      <footer className="customer-footer">
        Powered by <b>Velvet CafeOS</b> ·{" "}
        <Link href="/" style={{ color: "inherit", textDecoration: "underline" }}>
          Staff Dashboard
        </Link>
      </footer>
    </main>
  );
}
