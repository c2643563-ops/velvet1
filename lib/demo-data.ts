export type OrderStatus = "New" | "Preparing" | "Ready" | "Served";
export type Order = {
  id: string; table: number; items: string; total: number;
  payment: "Cash" | "Online"; status: OrderStatus; time: string;
};
export const demoOrders: Order[] = [
  { id: "#VC-1048", table: 4, items: "2 × Velvet Signature Burger, 1 × Iced Latte", total: 1850, payment: "Cash", status: "New", time: "12:42 PM" },
  { id: "#VC-1047", table: 2, items: "1 × Alfredo Pasta, 2 × Fresh Lime", total: 2100, payment: "Online", status: "Preparing", time: "12:38 PM" },
  { id: "#VC-1046", table: 8, items: "1 × Club Sandwich, 1 × Cappuccino", total: 1450, payment: "Cash", status: "Ready", time: "12:31 PM" },
  { id: "#VC-1045", table: 1, items: "2 × Chicken Wrap", total: 1600, payment: "Online", status: "Served", time: "12:22 PM" }
];
export const menuItems = [
  { id: 1, name: "Velvet Signature Burger", category: "Burgers", price: 950, description: "Smash patty, cheddar, house sauce", image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800" },
  { id: 2, name: "Crispy Chicken Burger", category: "Burgers", price: 750, description: "Crispy chicken, lettuce, mayo", image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=800" },
  { id: 3, name: "Creamy Alfredo Pasta", category: "Mains", price: 1250, description: "Creamy sauce, parmesan, herbs", image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=800" },
  { id: 4, name: "Iced Latte", category: "Drinks", price: 450, description: "Double espresso over chilled milk", image: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=800" },
  { id: 5, name: "Loaded Fries", category: "Sides", price: 550, description: "Golden fries, cheese, signature dip", image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=800" },
  { id: 6, name: "Fresh Lime", category: "Drinks", price: 350, description: "Fresh lime, mint, chilled soda", image: "https://images.unsplash.com/photo-1513558161293-c c42e3e0392".replace(" ", "") }
];
