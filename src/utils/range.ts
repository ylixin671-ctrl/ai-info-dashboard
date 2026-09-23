// 解析形如 "30d"（天）或 "7m"（月）的 range 参数，格式不对就用默认值兜底，
// 避免 SQL 里直接拼一个用户可控的字符串。

export function parseDays(range: unknown, fallback: number): number {
  if (typeof range !== 'string') return fallback
  const match = /^(\d+)d$/.exec(range)
  return match ? Number(match[1]) : fallback
}

export function parseMonths(range: unknown, fallback: number): number {
  if (typeof range !== 'string') return fallback
  const match = /^(\d+)m$/.exec(range)
  return match ? Number(match[1]) : fallback
}
