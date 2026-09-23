import { useEffect, useState } from 'react'
import { fetchDashboardData } from './data/mockData'
import KpiStrip from './components/KpiStrip'
import RevenueChart from './components/RevenueChart'
import ChannelBreakdown from './components/ChannelBreakdown'
import TransactionsTable from './components/TransactionsTable'

const NAV_ITEMS = ['Overview', 'Orders', 'Customers', 'Channels', 'Settings']

export default function App() {
  const [data, setData] = useState(null)

  useEffect(() => {
    fetchDashboardData().then(setData)
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen bg-paper flex items-center justify-center font-sans text-ink-soft">
        Loading ledger…
      </div>
    )
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-paper text-ink font-sans">
      <div className="max-w-6xl mx-auto md:flex">
        {/* Sidebar */}
        <aside className="md:w-48 shrink-0 md:border-r border-line px-6 py-8">
          <div className="font-display text-lg text-ink mb-8">Solstice</div>
          <nav className="space-y-3">
            {NAV_ITEMS.map((item, i) => (
              <div
                key={item}
                className={`text-sm cursor-default ${
                  i === 0 ? 'text-ink font-medium' : 'text-ink-soft'
                }`}
              >
                {item}
              </div>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 px-6 py-8 md:pl-8">
          <header className="mb-2">
            <h1 className="font-display text-2xl text-ink">Performance Ledger</h1>
            <p className="text-sm text-ink-soft mt-1">{today}</p>
          </header>

          <KpiStrip kpis={data.kpis} />

          <div className="grid md:grid-cols-2 gap-x-8">
            <RevenueChart data={data.revenueTrend} />
            <ChannelBreakdown data={data.channelBreakdown} />
          </div>

          <TransactionsTable rows={data.recentTransactions} />
        </main>
      </div>
    </div>
  )
}
