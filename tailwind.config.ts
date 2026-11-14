import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: { colors: { ink: "#17231f", muted: "#77827d", brand: "#1d7658", canvas: "#f5f7f5" } } },
  plugins: []
};
export default config;
