const statusColor = {
  Fulfilled: 'text-teal',
  Processing: 'text-amber',
  Refunded: 'text-rose',
}

export default function TransactionsTable({ rows }) {
  return (
    <div className="py-6 border-t border-line">
      <h2 className="font-display text-xl text-ink mb-4">Recent Orders</h2>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-ink text-left font-sans text-ink-soft">
              <th className="py-2 pr-4 font-medium">Order</th>
              <th className="py-2 pr-4 font-medium">Customer</th>
              <th className="py-2 pr-4 font-medium">Channel</th>
              <th className="py-2 pr-4 font-medium text-right">Amount</th>
              <th className="py-2 pr-4 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id} className="border-b border-line">
                <td className="py-2.5 pr-4 font-mono text-ink-soft">{row.id}</td>
                <td className="py-2.5 pr-4 font-sans text-ink">{row.customer}</td>
                <td className="py-2.5 pr-4 font-sans text-ink-soft">{row.channel}</td>
                <td className="py-2.5 pr-4 font-mono text-ink text-right">
                  ${row.amount.toFixed(2)}
                </td>
                <td className={`py-2.5 pr-4 font-sans ${statusColor[row.status] ?? 'text-ink'}`}>
                  {row.status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
