import { Router } from 'express'
import { pool } from '../db.js'
import type { OrdersResponse } from '../types.js'

export const ordersRouter = Router()

// GET /api/orders?limit=20&offset=0
// 对应前端的“最近订单”表格：分页返回，附带总数用于翻页控件
ordersRouter.get('/', async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100) // 上限保护，避免一次拉太多
  const offset = Math.max(Number(req.query.offset) || 0, 0)

  try {
    const [rowsResult, countResult] = await Promise.all([
      pool.query(
        `SELECT
           o.id,
           o.order_code,
           o.customer_name,
           c.name AS channel,
           o.amount,
           o.status,
           o.created_at
         FROM orders o
         JOIN channels c ON c.id = o.channel_id
         ORDER BY o.created_at DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
      ),
      pool.query(`SELECT COUNT(*)::int AS total FROM orders`),
    ])

    const response: OrdersResponse = {
      rows: rowsResult.rows,
      total: countResult.rows[0].total,
    }
    res.json(response)
  } catch (err) {
    console.error('查询订单失败', err)
    res.status(500).json({ error: '查询订单失败，请稍后重试' })
  }
})
