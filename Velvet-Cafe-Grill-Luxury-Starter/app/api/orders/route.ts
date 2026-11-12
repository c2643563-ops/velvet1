import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export const dynamic = "force-dynamic";

const DATA_FILE = path.join(process.cwd(), "data", "orders.json");

async function readOrders() {
  try {
    const raw = await fs.readFile(DATA_FILE, "utf-8");
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

async function writeOrders(orders: any[]) {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(orders, null, 2), "utf-8");
}

export async function GET() {
  const orders = await readOrders();
  return NextResponse.json({ orders });
}

export async function POST(req: Request) {
  const body = await req.json();
  const orders = await readOrders();

  const id = body.id || `VC-${Date.now().toString().slice(-6)}`;
  const method = body.method || "cash";
  const newOrder = {
    id,
    table: Number(body.table) || 1,
    customer: body.customer?.trim() || "Walk-in Guest",
    phone: body.phone?.trim() || "",
    method,
    payment: method === "cash" ? "Cash" : "Online",
    paymentStatus: method === "cash" ? "Pending" : "Awaiting verification",
    status: "New",
    note: body.note?.trim() || "",
    total: Number(body.total) || 0,
    createdAt: new Date().toISOString(),
    items: Array.isArray(body.items) ? body.items : [],
  };

  orders.unshift(newOrder);
  await writeOrders(orders);
  return NextResponse.json({ order: newOrder, orders });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  const { id, status, paymentStatus } = body;
  const orders = await readOrders();

  const updated = orders.map((o: any) => {
    if (o.id !== id) return o;
    return {
      ...o,
      ...(status ? { status } : {}),
      ...(paymentStatus ? { paymentStatus } : {}),
    };
  });

  await writeOrders(updated);
  return NextResponse.json({ orders: updated });
}
