"use client";
import { useMemo, useState } from "react";
import { menuItems } from "@/lib/demo-data";
import { ShoppingBag, Plus, Minus, Coffee } from "lucide-react";
export default function CustomerMenu() {
 const [category,setCategory]=useState("All"); const [cart,setCart]=useState<Record<number,number>>({});
 const categories=["All","Burgers","Mains","Sides","Drinks"];
 const filtered=useMemo(()=>menuItems.filter(x=>category==="All"||x.category===category),[category]);
 const count=Object.values(cart).reduce((a,b)=>a+b,0);
 const total=menuItems.reduce((sum,x)=>sum+x.price*(cart[x.id]||0),0);
 const change=(id:number,d:number)=>setCart(old=>({...old,[id]:Math.max(0,(old[id]||0)+d)}));
 return <main className="customer-page"><header className="customer-header"><div className="customer-brand"><span><Coffee/></span><div><b>velvet</b><small>CAFE & KITCHEN</small></div></div><span className="table-label">TABLE 04</span></header><section className="customer-hero"><span>MADE FRESH. SERVED WITH LOVE.</span><h1>Good food, <em>good mood.</em></h1><p>Explore our menu and order your favourites.</p></section><div className="customer-content"><h2>Our menu</h2><div className="category-row">{categories.map(c=><button key={c} onClick={()=>setCategory(c)} className={category===c?"selected":""}>{c}</button>)}</div><div className="customer-menu-grid">{filtered.map(item=><article className="customer-product" key={item.id}><img src={item.image} alt={item.name}/><div className="customer-product-info"><span>{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><div><b>Rs. {item.price.toLocaleString("en-PK")}</b><button onClick={()=>change(item.id,1)}><Plus size={17}/></button></div>{cart[item.id]>0&&<div className="qty-control"><button onClick={()=>change(item.id,-1)}><Minus size={14}/></button><b>{cart[item.id]}</b><button onClick={()=>change(item.id,1)}><Plus size={14}/></button></div>}</div></article>)}</div></div>{count>0&&<div className="cart-bar"><span><ShoppingBag size={18}/> {count} items · Rs. {total.toLocaleString("en-PK")}</span><button onClick={()=>alert("Demo only: checkout and payment are not connected yet.")}>View cart →</button></div>}<footer className="customer-footer">Powered by <b>Velvet CafeOS</b></footer></main>;
}
