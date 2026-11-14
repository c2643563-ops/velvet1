import { Shell } from "@/components/shell";
import { OrderTable } from "@/components/order-table";
export default function Orders() {
  return <Shell title="Orders" subtitle="Track, manage and fulfil customer orders"><div className="page-heading"><div><h2>All orders</h2><p>Recent activity from your tables.</p></div><button className="button primary">＋ Create order</button></div><section className="panel orders-panel"><div className="panel-heading"><div><h3>Order management</h3><p>Click a status to cycle the demo order forward.</p></div></div><OrderTable/></section></Shell>;
}
