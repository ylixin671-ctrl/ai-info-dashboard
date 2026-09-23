import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-paper border border-ink px-3 py-2 font-sans text-sm">
      <div className="text-ink-soft text-xs mb-1">{label}</div>
      {payload.map((p) => (
        <div key={p.dataKey} className="font-mono text-ink">
          {p.name}: ${p.value.toLocaleString('en-US')}
        </div>
      ))}
    </div>
  )
}

export default function RevenueChart({ data }) {
  return (
    <div className="py-6">
      <h2 className="font-display text-xl text-ink mb-1">Revenue vs. Target</h2>
      <p className="text-sm text-ink-soft mb-4">Trailing 7 months, USD</p>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data} margin={{ top: 4, right: 8, left: 0, bottom: 0 }}>
            <CartesianGrid stroke="#DEDACD" vertical={false} />
            <XAxis
              dataKey="month"
              stroke="#565A63"
              tick={{ fontSize: 12, fontFamily: 'IBM Plex Sans' }}
              tickLine={false}
              axisLine={{ stroke: '#DEDACD' }}
            />
            <YAxis
              stroke="#565A63"
              tick={{ fontSize: 11, fontFamily: 'IBM Plex Mono' }}
              tickLine={false}
              axisLine={false}
              tickFormatter={(v) => `$${(v / 1000).toFixed(0)}k`}
              width={48}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="target"
              name="Target"
              stroke="#DEDACD"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
            <Line
              type="monotone"
              dataKey="revenue"
              name="Revenue"
              stroke="#1B4B43"
              strokeWidth={2.5}
              dot={{ r: 3, fill: '#1B4B43', strokeWidth: 0 }}
              activeDot={{ r: 5, fill: '#C2872B', strokeWidth: 0 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}
