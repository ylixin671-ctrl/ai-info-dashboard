# Solstice — KPI Dashboard

A React + Vite + Tailwind + Recharts starting point for a business/analytics
dashboard, wired up to mock data so it runs immediately.

## Stack

- **React 18 + Vite** — fast dev server, minimal config, deploys as static files anywhere (Vercel, Netlify, Cloudflare Pages, S3, etc.)
- **Tailwind CSS** — utility-first styling, custom design tokens already set up in `tailwind.config.js`
- **Recharts** — the revenue trend line chart in `RevenueChart.jsx`; swap for another library if you'd rather, the component boundary is small

## Run it

```bash
npm install
npm run dev
```

Then open the local URL Vite prints (usually http://localhost:5173).

## Build for deployment

```bash
npm run build
```

Outputs static files to `dist/` — drag that folder into Netlify, point Vercel
at the repo, or serve it from any static host.

## Project structure

```
src/
  data/mockData.js        ← replace fetchDashboardData() with a real API call
  components/
    KpiStrip.jsx           ← the four headline numbers
    RevenueChart.jsx        ← line chart, revenue vs. target
    ChannelBreakdown.jsx    ← horizontal bar list
    TransactionsTable.jsx   ← recent orders table
  App.jsx                  ← layout + data loading
```

## Wiring in real data

Everything downstream of `fetchDashboardData()` only depends on the shape of
the object it returns — `{ kpis, revenueTrend, channelBreakdown, recentTransactions }`.
To connect a real backend, replace the body of that function in
`src/data/mockData.js` with a `fetch()` call (or a database/query client call
if you're rendering server-side), keeping the same return shape. No component
changes needed if the shape matches.

## Next steps to consider

- Add a date-range picker and refetch on change
- Add loading/error states per-section instead of one global spinner
- If KPIs need to update live, consider polling or a websocket instead of the one-shot fetch
- Move the nav items in `App.jsx` from static labels to actual routes (e.g. React Router) once there's more than one page
