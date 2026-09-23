export default function ChannelBreakdown({ data }) {
  const maxShare = Math.max(...data.map((d) => d.share))

  return (
    <div className="py-6 md:pl-8 md:border-l border-line h-full">
      <h2 className="font-display text-xl text-ink mb-1">Revenue by Channel</h2>
      <p className="text-sm text-ink-soft mb-5">Share of total, this month</p>
      <div className="space-y-4">
        {data.map((row) => (
          <div key={row.channel}>
            <div className="flex justify-between items-baseline mb-1">
              <span className="font-sans text-sm text-ink">{row.channel}</span>
              <span className="font-mono text-sm text-ink-soft">{row.share.toFixed(1)}%</span>
            </div>
            <div className="h-1.5 bg-line">
              <div
                className="h-1.5 bg-teal"
                style={{ width: `${(row.share / maxShare) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
