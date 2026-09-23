# KPI Dashboard API

Node.js + Express + TypeScript 后端，已实现四个端点：
`/api/orders`、`/api/kpis`、`/api/revenue-trend`、`/api/channel-breakdown`。

## 1. 准备数据库

任选一种：

**方式 A：本地 PostgreSQL**
```bash
createdb kpi_dashboard
```

**方式 B：免费云数据库（推荐，省去本地装 PostgreSQL 的麻烦）**
去 [Neon](https://neon.tech) 或 [Supabase](https://supabase.com) 建一个免费项目，
拿到连接串（形如 `postgres://user:pass@host/dbname`）。

## 2. 配置环境变量

```bash
cp .env.example .env
# 编辑 .env，把 DATABASE_URL 换成你上一步拿到的连接串
```

## 3. 安装依赖、建表、灌种子数据

```bash
npm install
npm run db:migrate   # 执行 db/schema.sql，建表
npm run db:seed      # 执行 db/seed.sql，插入几条示例订单
```

## 4. 启动开发服务器

```bash
npm run dev
```

看到 `API 服务已启动：http://localhost:4000` 就说明起来了。

## 5. 验证整条链路

```bash
curl http://localhost:4000/api/health
# {"status":"ok"}

curl "http://localhost:4000/api/orders?limit=5"
# {"rows":[...],"total":406}

curl "http://localhost:4000/api/kpis?range=30d"
# [{"key":"revenue","label":"成交额","value":...,"format":"currency","delta":...}, ...]

curl "http://localhost:4000/api/revenue-trend?range=7m"
# [{"month":"Apr","revenue":...,"target":200000}, ...] 共 7 条，按月份升序

curl "http://localhost:4000/api/channel-breakdown?range=30d"
# [{"channel":"Direct","revenue":...,"share":...}, ...] 按 revenue 降序
```

如果这几个请求都能拿到正确的 JSON，说明 **Express → PostgreSQL → JSON 响应**
这条链路已经打通了。

## 端点一览

| 端点 | 参数 | 说明 |
|---|---|---|
| `GET /api/orders` | `limit`, `offset` | 分页订单列表，`JOIN channels` 直接返回渠道名 |
| `GET /api/kpis` | `range`（如 `30d`） | 本期 vs 上一等长周期的环比，delta 单位是百分比 |
| `GET /api/revenue-trend` | `range`（如 `7m`） | 按月聚合营收，`LEFT JOIN monthly_targets`，月份不断档 |
| `GET /api/channel-breakdown` | `range`（如 `30d`） | 按渠道聚合营收，`share` 是占比（百分比） |

**一个需要你知道的取舍**：`/api/kpis` 里的"退款率"目前是"流失率"的占位替代——
schema 里还没有 `subscriptions` 表，没法算真正的订阅流失率。等确定要不要做
订阅制，再决定是加表还是把这个指标从看板上去掉。

## 目录结构

```
src/
  index.ts          ← Express 入口，挂载路由、启动服务
  db.ts             ← PostgreSQL 连接池
  types.ts          ← 共享类型（Order、OrdersResponse）
  routes/
    orders.ts       ← GET /api/orders，分页查询
db/
  schema.sql        ← 建表脚本（channels, orders, monthly_targets）
  seed.sql          ← 示例数据：6 条具名订单 + 400 条随机历史订单 + 月度目标
src/
  routes/
    orders.ts            ← GET /api/orders
    kpis.ts              ← GET /api/kpis
    revenueTrend.ts       ← GET /api/revenue-trend
    channelBreakdown.ts   ← GET /api/channel-breakdown
  utils/
    range.ts          ← 解析 "30d" / "7m" 这类 range 参数
```

## 下一步

- 把前端 `vite.config.js` 加上 `server.proxy`，本地开发时把 `/api` 转发到这里的 4000 端口
- 把前端 `src/data/mockData.js` 里的 `fetchDashboardData()` 换成对这四个端点的真实请求
- 部署到 Render：新建 Web Service 指向这个仓库，同时用 Render 的 PostgreSQL
  插件创建生产数据库，把连接串填进 Render 的环境变量
