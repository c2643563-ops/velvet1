import CustomerOrder from '@/components/customer-order';
export default async function TablePage({params}:{params:Promise<{tableNo:string}>}){const {tableNo}=await params;return <CustomerOrder tableNo={Number(tableNo)}/>}
