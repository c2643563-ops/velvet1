"use client";
import { useState } from "react";
import { Shell } from "@/components/shell";
import { demoOrders, type Order, type OrderStatus } from "@/lib/demo-data";
const columns: OrderStatus[] = ["New","Preparing","Ready"];
export default function Kitchen() {
 const [orders,setOrders]=useState<Order[]>(demoOrders.filter(o=>o.status!=="Served"));
 const move=(id:string,status:OrderStatus)=>setOrders(old=>old.map(o=>o.id===id?{...o,status}:o));
 return <Shell title="Kitchen display" subtitle="Keep every order moving smoothly"><div className="page-heading"><div><h2>Kitchen queue</h2><p>Live kitchen workflow · Demo orders</p></div><span className="live-pill">● LIVE DEMO</span></div><div className="kitchen-grid">{columns.map(col=><section className="kitchen-column" key={col}><div className="kitchen-col-head"><b>{col}</b><span>{orders.filter(o=>o.status===col).length}</span></div>{orders.filter(o=>o.status===col).map(o=><article className="kitchen-card" key={o.id}><div className="kitchen-card-top"><b>{o.id}</b><span>Table {o.table}</span></div><p>{o.items}</p><small>Placed at {o.time}</small><button className="button primary full" onClick={()=>move(o.id,col==="New"?"Preparing":col==="Preparing"?"Ready":"Served")}>{col==="New"?"Accept & prepare":col==="Preparing"?"Mark as ready":"Complete order"}</button></article>)}</section>)}</div></Shell>;
}
