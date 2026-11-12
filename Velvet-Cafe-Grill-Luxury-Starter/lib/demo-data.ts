export type OrderStatus = "New" | "Preparing" | "Ready" | "Served";

export interface Order {
  id: string;
  table: number;
  items: string;
  total: number;
  payment: "Cash" | "Online";
  status: OrderStatus;
  time: string;
}

export interface MenuItem {
  id: number;
  name: string;
  category: "Burgers" | "Mains" | "Sides" | "Drinks";
  description: string;
  price: number;
  image: string;
}

export const menuItems: MenuItem[] = [
  {
    id: 1,
    name: "Velvet Truffle Smash Burger",
    category: "Burgers",
    description: "Double dry-aged beef patties, aged cheddar, black truffle aioli & caramelized onions on toasted brioche.",
    price: 1290,
    image: "/menu/truffle-smash-burger.jpg",
  },
  {
    id: 2,
    name: "Crispy Hot Honey Chicken Burger",
    category: "Burgers",
    description: "Buttermilk fried chicken fillet, house slaw, pickled jalapeños & spiced honey mustard glaze.",
    price: 980,
    image: "/menu/crispy-chicken-burger.jpg",
  },
  {
    id: 3,
    name: "Chargrilled Herb Butter Ribeye",
    category: "Mains",
    description: "Prime 280g ribeye steak flame-seared to order with roasted garlic herb butter & seasonal jus.",
    price: 2850,
    image: "/menu/ribeye-steak.jpg",
  },
  {
    id: 4,
    name: "Creamy Mushroom Tarragon Chicken",
    category: "Mains",
    description: "Pan-seared chicken supreme simmered in wild mushroom, fresh rosemary & velvety tarragon cream.",
    price: 1580,
    image: "/menu/tarragon-chicken.jpg",
  },
  {
    id: 5,
    name: "Parmesan Black Truffle Fries",
    category: "Sides",
    description: "Hand-cut golden potato wedges tossed in white truffle oil, shaved Parmigiano & fresh parsley.",
    price: 690,
    image: "/menu/truffle-fries.jpg",
  },
  {
    id: 6,
    name: "Signature Dynamite Prawns",
    category: "Sides",
    description: "Crisp tempura tiger prawns glazed in smoky sriracha mayo with toasted sesame & spring onion.",
    price: 1150,
    image: "/menu/dynamite-prawns.jpg",
  },
  {
    id: 7,
    name: "Iced Spanish Latte",
    category: "Drinks",
    description: "Double-shot specialty Arabica espresso layered over chilled velvety condensed milk & ice.",
    price: 620,
    image: "/menu/spanish-latte.jpg",
  },
  {
    id: 8,
    name: "Velvet Gold Cappuccino",
    category: "Drinks",
    description: "Rich single-origin espresso crowned with silky microfoam rosetta art & raw cocoa dust.",
    price: 560,
    image: "/menu/velvet-mocha.jpg",
  },
];

export const demoOrders: Order[] = [
  {
    id: "#VC-1048",
    table: 4,
    items: "2× Velvet Truffle Smash Burger, 2× Iced Spanish Latte",
    total: 3820,
    payment: "Online",
    status: "New",
    time: "2 mins ago",
  },
  {
    id: "#VC-1047",
    table: 9,
    items: "1× Chargrilled Herb Butter Ribeye, 1× Parmesan Black Truffle Fries",
    total: 3540,
    payment: "Cash",
    status: "Preparing",
    time: "8 mins ago",
  },
  {
    id: "#VC-1046",
    table: 2,
    items: "2× Creamy Mushroom Tarragon Chicken, 2× Velvet Gold Cappuccino",
    total: 4280,
    payment: "Online",
    status: "Ready",
    time: "14 mins ago",
  },
  {
    id: "#VC-1045",
    table: 12,
    items: "1× Crispy Hot Honey Chicken Burger, 1× Signature Dynamite Prawns",
    total: 2130,
    payment: "Cash",
    status: "Served",
    time: "23 mins ago",
  },
];
