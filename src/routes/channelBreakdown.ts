import { Router } from 'express'
import { pool } from '../db.js'
import { parseDays } from '../utils/range.js'
import type { ChannelBreakdownItem } from '../types.js'

export const channelBreakdownRouter = Router()

// GET /api/channel-breakdown?range=30d
// 从 channels 表出发（而不是从 orders 里 DISTINCT 渠道），
// 这样哪怕某个渠道这段时间一单都没有，也会显示成 0%，而不是干脆不出现。
channelBreakdownRouter.get('/', async (req, res) => {
  const days = parseDays(req.query.range, 30)

  try {
    const { rows } = await pool.query(
      `
      WITH period_orders AS (
        SELECT channel_id, amount
        FROM orders
        WHERE created_at >= now() - ($1::text || ' days')::interval
      ),
      by_channel AS (
        SELECT c.name AS channel, COALESCE(SUM(po.amount), 0) AS revenue
        FROM channels c
        LEFT JOIN period_orders po ON po.channel_id = c.id
        GROUP BY c.name
      ),
      total AS (
        SELECT SUM(revenue) AS total_revenue FROM by_channel
      )
      SELECT
        bc.channel,
        bc.revenue,
        CASE WHEN t.total_revenue > 0 THEN (bc.revenue / t.total_revenue) * 100 ELSE 0 END AS share
      FROM by_channel bc, total t
      ORDER BY bc.revenue DESC
      `,
      [days]
    )

    const breakdown: ChannelBreakdownItem[] = rows.map((row) => ({
      channel: row.channel,
      revenue: Number(row.revenue),
      share: Number(row.share),
    }))

    res.json(breakdown)
  } catch (err) {
    console.error('查询渠道占比失败', err)
    res.status(500).json({ error: '查询渠道占比失败，请稍后重试' })
  }
})
