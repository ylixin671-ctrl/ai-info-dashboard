import { Router } from 'express'
import { pool } from '../db.js'
import { parseDays } from '../utils/range.js'
import type { Kpi } from '../types.js'

export const kpisRouter = Router()

// GET /api/kpis?range=30d
// 本期 vs 上一个等长周期，算出每个指标的环比变化（delta，单位：百分比）
kpisRouter.get('/', async (req, res) => {
  const days = parseDays(req.query.range, 30)

  try {
    const { rows } = await pool.query(
      `
      WITH current_period AS (
        SELECT
          COALESCE(SUM(amount), 0) AS revenue,
          COUNT(*) AS orders,
          COUNT(*) FILTER (WHERE status = 'Refunded') AS refunded
        FROM orders
        WHERE created_at >= now() - ($1::text || ' days')::interval
      ),
      previous_period AS (
        SELECT
          COALESCE(SUM(amount), 0) AS revenue,
          COUNT(*) AS orders,
          COUNT(*) FILTER (WHERE status = 'Refunded') AS refunded
        FROM orders
        WHERE created_at >= now() - (($1 * 2)::text || ' days')::interval
          AND created_at < now() - ($1::text || ' days')::interval
      )
      SELECT
        c.revenue AS current_revenue, p.revenue AS previous_revenue,
        c.orders AS current_orders, p.orders AS previous_orders,
        c.refunded AS current_refunded, p.refunded AS previous_refunded
      FROM current_period c, previous_period p
      `,
      [days]
    )

    const r = rows[0]
    const currentRevenue = Number(r.current_revenue)
    const previousRevenue = Number(r.previous_revenue)
    const currentOrders = Number(r.current_orders)
    const previousOrders = Number(r.previous_orders)
    const currentRefunded = Number(r.current_refunded)
    const previousRefunded = Number(r.previous_refunded)

    const currentAov = currentOrders > 0 ? currentRevenue / currentOrders : 0
    const previousAov = previousOrders > 0 ? previousRevenue / previousOrders : 0

    // 注意：这里用“退款率”代替“流失率”只是占位。真正的订阅流失率需要
    // 一张 subscriptions 表（谁、何时取消/续订），目前 schema 里还没有这个概念。
    // 等业务模型确定要不要做订阅制，再把这个指标换成真实的 churn 计算。
    const currentRefundRate = currentOrders > 0 ? (currentRefunded / currentOrders) * 100 : 0
    const previousRefundRate = previousOrders > 0 ? (previousRefunded / previousOrders) * 100 : 0

    const delta = (current: number, previous: number) =>
      previous === 0 ? 0 : ((current - previous) / previous) * 100

    const kpis: Kpi[] = [
      {
        key: 'revenue',
        label: '成交额',
        value: currentRevenue,
        format: 'currency',
        delta: delta(currentRevenue, previousRevenue),
      },
      {
        key: 'orders',
        label: '订单数',
        value: currentOrders,
        format: 'number',
        delta: delta(currentOrders, previousOrders),
      },
      {
        key: 'aov',
        label: '客单价',
        value: currentAov,
        format: 'currency',
        delta: delta(currentAov, previousAov),
      },
      {
        key: 'refundRate',
        label: '退款率',
        value: currentRefundRate,
        format: 'percent',
        delta: delta(currentRefundRate, previousRefundRate),
      },
    ]

    res.json(kpis)
  } catch (err) {
    console.error('查询 KPI 失败', err)
    res.status(500).json({ error: '查询 KPI 失败，请稍后重试' })
  }
})
