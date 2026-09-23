function formatValue(value, format) {
  if (format === 'currency') {
    return value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
  }
  if (format === 'percent') {
    return `${value.toFixed(1)}%`
  }
  return value.toLocaleString('en-US')
}

export default function KpiStrip({ kpis }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 border-t border-line">
      {kpis.map((kpi, i) => {
        const positive = kpi.delta >= 0
        return (
          <div
            key={kpi.label}
            className={`py-6 px-5 md:px-6 border-b border-line ${
              i % 2 === 0 ? 'border-r' : ''
            } md:border-r md:last:border-r-0`}
          >
            <div className="text-xs font-sans text-ink-soft tracking-normal">{kpi.label}</div>
            <div className="mt-2 font-display text-3xl md:text-4xl text-ink">
              {formatValue(kpi.value, kpi.format)}
            </div>
            <div className={`mt-1 font-mono text-sm ${positive ? 'text-teal' : 'text-rose'}`}>
              {positive ? '+' : ''}
              {kpi.delta.toFixed(1)}% vs last period
            </div>
          </div>
        )
      })}
    </div>
  )
}
