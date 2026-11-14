import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const dynamic = "force-dynamic";
const methods = ["cash", "jazzcash", "easypaisa", "bank_transfer", "raast"];

// Customer QR checkout: validate and save the order + its item snapshots.
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const tableNo = Number(body.tableNo);
    const items = Array.isArray(body.items) ? body.items : [];
    if (!Number.isInteger(tableNo) || tableNo < 1 || tableNo > 15 || !items.length || items.length > 30) return NextResponse.json({ error: "Invalid table or items." }, { status: 400 });
    const method = methods.includes(body.method) ? body.method : "cash";
    const cleanItems = items.map((i: any) => ({ name: String(i.name || "").slice(0,120), qty: Math.max(1, Math.min(50, Number(i.qty) || 1)), price: Math.max(0, Math.round(Number(i.price) || 0)) })).filter((i: any) => i.name);
    if (!cleanItems.length) return NextResponse.json({ error: "No valid order items." }, { status: 400 });
    const subtotal = cleanItems.reduce((s: number, i: any) => s + i.price * i.qty, 0);
    const { data: table, error: tableError } = await supabaseAdmin.from("cafe_tables").select("id").eq("table_number", tableNo).eq("active", true).single();
    if (tableError || !table) return NextResponse.json({ error: "Table not found. Check the table setup." }, { status: 400 });
    const { data: order, error } = await supabaseAdmin.from("orders").insert({ table_id: table.id, customer_name: String(body.customer || "Guest").slice(0,100), customer_phone: String(body.phone || "").slice(0,30), status: "new", payment_method: method, payment_status: "pending", subtotal_paisa: subtotal * 100, total_paisa: subtotal * 100, special_instructions: String(body.note || "").slice(0,500) }).select("id,order_number,created_at").single();
    if (error || !order) throw error || new Error("Order could not be created.");
    const { error: itemError } = await supabaseAdmin.from("order_items").insert(cleanItems.map((i: any) => ({ order_id: order.id, product_name_snapshot: i.name, unit_price_paisa: i.price * 100, quantity: i.qty, line_total_paisa: i.price * i.qty * 100 })));
    if (itemError) { await supabaseAdmin.from("orders").delete().eq("id", order.id); throw itemError; }
    return NextResponse.json({ id: order.id, orderNo: `VC-${order.order_number}` }, { status: 201 });
  } catch (e: any) { return NextResponse.json({ error: e?.message || "Could not place order." }, { status: 500 }); }
}

// Cashier screen polls this endpoint for cross-device order updates. Protect with staff authentication before public launch.
export async function GET() {
  try {
    const { data, error } = await supabaseAdmin.from("orders").select("id,order_number,customer_name,customer_phone,status,payment_method,payment_status,total_paisa,created_at,special_instructions,cafe_tables(table_number),order_items(product_name_snapshot,quantity,unit_price_paisa)").order("created_at", { ascending: false }).limit(100);
    if (error) throw error;
    return NextResponse.json((data || []).map((o: any) => ({ id: `VC-${o.order_number}`, dbId: o.id, table: o.cafe_tables?.table_number || 0, customer: o.customer_name || "Guest", method: o.payment_method, status: ({new:"New",accepted:"Accepted",preparing:"Preparing",ready:"Ready",served:"Served",completed:"Completed",cancelled:"Cancelled"} as any)[o.status] || o.status, paymentStatus: o.payment_status === "paid" ? "Paid" : "Pending", total: Number(o.total_paisa) / 100, createdAt: o.created_at, note: o.special_instructions || "", items: (o.order_items || []).map((i: any) => ({ name: i.product_name_snapshot, qty: i.quantity, price: Number(i.unit_price_paisa) / 100 })) })));
  } catch (e: any) { return NextResponse.json({ error: e?.message || "Could not load orders." }, { status: 500 }); }
}
