// 这里的类型对应数据库返回的形状；前端如果之后用 TypeScript 重写，
// 可以把这个文件抽成一个共享包，前后端引用同一份类型定义。

export interface Order {
  id: number
  order_code: string
  customer_name: string
  channel: string
  amount: number
  status: 'Fulfilled' | 'Processing' | 'Refunded'
  created_at: string
}

export interface OrdersResponse {
  rows: Order[]
  total: number
}
