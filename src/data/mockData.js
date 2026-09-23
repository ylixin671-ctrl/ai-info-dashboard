// Placeholder data for a fictional D2C brand, "Solstice Supply Co."
// Replace fetchDashboardData() with a real API/database call — every
// component below only depends on the shape of this object, not its source.

export const kpis = [
  { label: 'Revenue (MTD)', value: 284700, format: 'currency', delta: 8.2 },
  { label: 'Orders', value: 5312, format: 'number', delta: 4.6 },
  { label: 'Avg. Order Value', value: 53.6, format: 'currency', delta: -1.3 },
  { label: 'Net Churn', value: 2.1, format: 'percent', delta: -0.4 },
]

export const revenueTrend = [
  { month: 'Apr', revenue: 198400, target: 200000 },
  { month: 'May', revenue: 211200, target: 205000 },
  { month: 'Jun', revenue: 203900, target: 210000 },
  { month: 'Jul', revenue: 229500, target: 215000 },
  { month: 'Aug', revenue: 241100, target: 225000 },
  { month: 'Sep', revenue: 258700, target: 235000 },
  { month: 'Oct', revenue: 284700, target: 250000 },
]

export const channelBreakdown = [
  { channel: 'Direct', revenue: 98500, share: 34.6 },
  { channel: 'Email', revenue: 71200, share: 25.0 },
  { channel: 'Paid Social', revenue: 58300, share: 20.5 },
  { channel: 'Organic Search', revenue: 39100, share: 13.7 },
  { channel: 'Affiliate', revenue: 17600, share: 6.2 },
]

export const recentTransactions = [
  { id: 'ST-10482', customer: 'M. Alvarez', channel: 'Direct', amount: 128.0, status: 'Fulfilled' },
  { id: 'ST-10481', customer: 'J. Okafor', channel: 'Email', amount: 64.5, status: 'Fulfilled' },
  { id: 'ST-10480', customer: 'R. Nakamura', channel: 'Paid Social', amount: 212.3, status: 'Processing' },
  { id: 'ST-10479', customer: 'S. Petrov', channel: 'Organic Search', amount: 41.0, status: 'Fulfilled' },
  { id: 'ST-10478', customer: 'L. Dubois', channel: 'Direct', amount: 96.75, status: 'Refunded' },
  { id: 'ST-10477', customer: 'A. Kim', channel: 'Affiliate', amount: 155.2, status: 'Fulfilled' },
]

// Swap this for a real fetch() to your API once one exists.
export async function fetchDashboardData() {
  return { kpis, revenueTrend, channelBreakdown, recentTransactions }
}
