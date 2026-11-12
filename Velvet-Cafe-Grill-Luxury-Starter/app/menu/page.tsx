import { Shell } from "@/components/shell";
import { menuItems } from "@/lib/demo-data";
export default function Menu() {
 return <Shell title="Menu management" subtitle="Manage the products customers can order"><div className="page-heading"><div><h2>Your menu <span className="count-badge">{menuItems.length} items</span></h2><p>Sample menu items — connect the database to save changes.</p></div><button className="button primary">＋ Add product</button></div><div className="menu-grid">{menuItems.map(item=><article className="menu-card" key={item.id}><img src={item.image} alt={item.name}/><div><span className="category-tag">{item.category}</span><h3>{item.name}</h3><p>{item.description}</p><b>Rs. {item.price.toLocaleString("en-PK")}</b></div></article>)}</div></Shell>;
}
