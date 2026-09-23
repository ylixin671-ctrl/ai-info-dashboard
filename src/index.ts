import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { ordersRouter } from './routes/orders.js'

const app = express()
const port = Number(process.env.PORT) || 4000

app.use(
  cors({
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  })
)
app.use(express.json())

// 健康检查：部署到 Render 后，用它确认服务和数据库都活着
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' })
})

app.use('/api/orders', ordersRouter)

app.listen(port, () => {
  console.log(`API 服务已启动：http://localhost:${port}`)
})
