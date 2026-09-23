import { Router } from 'express'
import { pool } from '../db.js'
import { parseMonths } from '../utils/range.js'
import type { RevenueTrendPoint } from '../types.js'

export const revenueTrendRouter = Router()

// GET /api/revenue-trend?range=7m
// 用 generate_series 先生成连续的月份序列，再 LEFT JOIN 实际营收和目标值，
// 这样哪怕某个月一单没有，也会返回 0 而不是直接从数组里消失，图表不会断档。
revenueTrendRouter.get('/', async (req, res) => {
  const months = parseMonths(req.query.range, 7)

  try {
    const { rows } = await pool.query(
      `
      WITH months AS (
        SELECT date_trunc('month', now()) - (interval '1 month' * s) AS month
        FROM generate_series(0, $1 - 1) AS s
      ),
      revenue_by_month AS (
        SELECT date_trunc('month', created_at) AS month, SUM(amount) AS revenue
        FROM orders
        GROUP BY 1
      )
      SELECT
        to_char(m.month, 'Mon') AS month,
        COALESCE(r.revenue, 0) AS revenue,
        COALESCE(t.target, 0) AS target
      FROM months m
      LEFT JOIN revenue_by_month r ON r.month = m.month
      LEFT JOIN monthly_targets t ON t.month = m.month
      ORDER BY m.month ASC
      `,
      [months]
    )

    const trend: RevenueTrendPoint[] = rows.map((row) => ({
      month: row.month,
      revenue: Number(row.revenue),
      target: Number(row.target),
    }))

    res.json(trend)
  } catch (err) {
    console.error('查询营收趋势失败', err)
    res.status(500).json({ error: '查询营收趋势失败，请稍后重试' })
  }
})
