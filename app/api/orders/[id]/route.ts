import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  try { const { id } = await context.params; const body = await request.json(); const statuses: Record<string,string> = { New:"new", Accepted:"accepted", Preparing:"preparing", Ready:"ready", Served:"served", Completed:"completed", Cancelled:"cancelled" };
    if (!statuses[body.status]) return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    const { error } = await supabaseAdmin.from("orders").update({ status: statuses[body.status], updated_at: new Date().toISOString() }).eq("id", id); if (error) throw error; return NextResponse.json({ ok: true });
  } catch (e:any) { return NextResponse.json({ error: e?.message || "Update failed." }, { status: 500 }); }
}
