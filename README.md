# Velvet CafeOS — complete single-cafe starter

A Next.js 15 / React 19 / TypeScript cafe ordering and operations system for **Velvet Cafe & Grill**, configured for **15 tables** and PKR. It includes a runnable browser-demo flow plus a Supabase schema and a production integration checklist.

## What works immediately in demo mode

- Customer QR routes: `/table/1` through `/table/15`; each route shows the table number, menu, cart, checkout and payment-method selection.
- A submitted order appears on `/pos` and `/owner` in the **same browser** (localStorage demo mode).
- Cashier can move orders through New → Accepted → Preparing → Ready → Served → Completed, confirm payment manually, and print the current page.
- Owner dashboard displays demo order totals.
- Fifteen table QR images are in `public/qr/`; a print-ready A4 PDF is in `public/qr/Velvet-Cafe-Grill-15-Table-QR.pdf`.
- Kitchen workflow UI at `/kitchen`; existing menu, reports, inventory and settings screens remain as UI foundations.

> Demo data is browser-local, not cloud-synced. It is suitable for a local walkthrough only. To serve real customers across multiple phones/computers, complete the Supabase setup and server-side integration below. The project does not claim to be production-ready merely because the demo runs.

## Run on Windows (Cursor)

1. Install **Node.js 20.9+** (LTS) and Cursor.
2. Extract the ZIP, open the extracted `velvet-cafeos` folder in Cursor.
3. Open Terminal → New Terminal and run:

   ```powershell
   npm install
   Copy-Item .env.example .env.local
   npm run dev
   ```

4. Open `http://localhost:3000`.
5. Open the customer test pages: `http://localhost:3000/table/1` (or table 2…15).
6. Open cashier: `http://localhost:3000/pos`; owner dashboard: `http://localhost:3000/owner`; kitchen: `http://localhost:3000/kitchen`.
7. Place a test order from `/table/1`, then open `/pos` in the same browser to see it. Use the same browser profile because demo mode uses localStorage.

To let a phone on the same Wi-Fi open your local demo, run `npm run dev -- --hostname 0.0.0.0`, find the PC's LAN IPv4 address with `ipconfig`, then open `http://PC-LAN-IP:3000/table/1` on the phone. This is for testing only; do not expose the development server publicly.

## Phase-by-phase implementation / activation

### Phase 2 — Supabase database + authentication
1. Create a Supabase project and keep its database password safe.
2. In Supabase → SQL Editor, run `supabase/schema.sql`.
3. In Authentication → Users, create the first owner user. Add that user's UUID to `staff_profiles` with role `owner` (run an insert using the real UUID and a full name).
4. Copy Project URL and anon key into `.env.local` as `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
5. Keep `SUPABASE_SERVICE_ROLE_KEY` server-only. Never paste it into frontend code, Git, screenshots, or a `NEXT_PUBLIC_` variable.
6. Configure password reset, email confirmation, MFA for owner, and role-specific RLS policies before going live. The SQL enables RLS and only provides limited public menu reads and self-profile reads; it intentionally does not create permissive write policies.

### Phase 3 — Real QR ordering
- The QR labels currently point to local demo URLs `http://localhost:3000/table/N`.
- After hosting, set `NEXT_PUBLIC_APP_URL` to the final HTTPS domain and regenerate QR images using `python scripts/generate_qr.py --base-url https://YOUR-DOMAIN`.
- For production, replace table-number-only routes with the table's random `qr_token` from `cafe_tables`; validate token server-side, calculate all prices from the database, rate-limit order creation, and write orders/items in one database transaction. Do not trust prices sent by a customer's browser.

### Phase 4 — Complete cashier POS
- `/pos` is a working same-browser demo POS. Multi-device production mode requires authenticated server endpoints, live Supabase Realtime subscriptions, server-side status transitions, discount/tax permissions, void/refund audit logs, and a daily cash reconciliation.

### Phase 5 — Kitchen management
- `/kitchen` is the kitchen workflow screen foundation. Connect it to the same live order stream; kitchen role should only update preparation status, not payment or price fields.

### Phase 6 — Owner mobile dashboard
- `/owner` is responsive and displays demo totals. Production dashboard should query server-calculated sales, paid/unpaid split, expenses, low stock, staff actions and date filters. Require owner role and MFA.

### Phase 7 — JazzCash + Easypaisa + Raast
- Merchant onboarding and API access must be obtained directly from the payment providers/bank. Put credentials in server environment variables only.
- Implement each provider's current merchant checkout/signature verification and server callback/webhook according to the contract issued to Velvet Cafe & Grill. Confirm amount, currency, order reference, signature and replay protection server-side.
- Until that is implemented, these methods are **payment requests awaiting cashier verification**, not automatic online payment. Cashier must check the merchant app/bank statement independently and record the transaction reference. A screenshot or redirect is never proof of payment.
- Raast QR/merchant acquiring availability and API access depend on the bank/provider agreement. Do not display a personal QR as if it were an integrated merchant payment.

### Phase 8 — Thermal printer + receipts
- Browser print is a basic demo. Production thermal printing needs the exact printer model/interface (USB, LAN or Bluetooth), ESC/POS driver/bridge and paper width (58mm/80mm). Test Urdu/English fonts, cutter, duplicate receipt and printer-offline handling. A web page cannot silently print to arbitrary devices without a configured local print bridge or browser permission.

### Phase 9 — Inventory + expenses
- Database tables for stock items, stock movements and expenses are included in the schema. Before using them, build authenticated CRUD screens and recipe/ingredient consumption rules; do not auto-deduct stock until recipes and units are configured and tested.

### Phase 10 — Testing + live deployment
1. Set up Git repository and deploy to a managed Next.js host (e.g. Vercel) with environment variables.
2. Use a separate Supabase production project, enable backups/PITR appropriate to business needs, configure custom domain + HTTPS, and restrict staff roles.
3. Test: 15 QR URLs, unavailable products, duplicate taps, concurrent orders, order cancellation, cash payment, each online pending state, failed callbacks, refund, kitchen state transitions, timezone (Asia/Karachi), receipt printer offline, database backup restore, and mobile browser sizes.
4. Run a one-day staff pilot with test prices before accepting real orders. Reconcile cash and provider statements at close.

## QR codes

The included QR codes are LOCAL TEST ONLY and point to `http://localhost:3000/table/1` through `/table/15`. They cannot work from customers’ phones over the internet. For real customer use, deploy the app first, then regenerate with your live HTTPS domain using the command above. The PDF is designed for printing and cutting into 15 table labels.

## Important security / launch checklist

- No production staff login or full cloud order write path is enabled in this demo build.
- No JazzCash/Easypaisa/Raast credentials or live provider integration are included.
- No automatic payment confirmation; manual verification only.
- RLS is enabled; do not disable it to “make it work”. Build and test least-privilege policies and server-side endpoints.
- Do not use demo localStorage orders as the cafe's permanent sales record.
- Replace demo menu/prices/photos with the cafe's actual menu before launch.


## Supabase connection (QR orders + cashier)
1. Create a Supabase project.
2. In Supabase SQL Editor, run the complete `supabase/schema.sql` file. It creates the cafe tables and 15 table records.
3. In Vercel → Project → Settings → Environment Variables, add `NEXT_PUBLIC_SUPABASE_URL` (Project URL) and `SUPABASE_SERVICE_ROLE_KEY` (server-side service_role secret). Add them for Production, Preview and Development, then redeploy. For local work, copy these into `.env.local` (never commit that file).
4. Customer QR checkout sends an order to `/api/orders`; the server writes the order and item snapshots to Supabase. Cashier POS reads new orders from the same database and refreshes every 2.5 seconds. Status changes are saved to Supabase.
5. Test using a real table QR URL, place a test order on a phone, and open `/pos` on the cashier laptop.

### Important security note before opening to the public
The included cashier GET/PATCH API routes are a starter integration and are not yet protected by staff login/authorization. Add Supabase Auth and role-based authorization to these routes before using real customer data in a public production environment. The service-role key must remain server-only and must never be added to a `NEXT_PUBLIC_` variable or client component. Online payment options are recorded as pending only; no payment gateway is activated.
