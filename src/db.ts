import { Pool } from 'pg'
import 'dotenv/config'

if (!process.env.DATABASE_URL) {
  throw new Error('缺少 DATABASE_URL 环境变量，请复制 .env.example 为 .env 并填写')
}

// 连接池：Express 每个请求复用池中的连接，避免每次请求都新建连接
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
})

pool.on('error', (err) => {
  // 空闲连接上的意外错误不应该让整个进程崩溃，记录下来即可
  console.error('数据库连接池发生意外错误', err)
})
