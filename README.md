# KPI Dashboard API

Node.js + Express + TypeScript 后端，第一个真实端点：`GET /api/orders`。

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
# {"rows":[...6条订单...],"total":6}
```

如果这两个请求都能拿到正确的 JSON，说明 **Express → PostgreSQL → JSON 响应**
这条链路已经打通了。

## 目录结构

```
src/
  index.ts          ← Express 入口，挂载路由、启动服务
  db.ts             ← PostgreSQL 连接池
  types.ts          ← 共享类型（Order、OrdersResponse）
  routes/
    orders.ts       ← GET /api/orders，分页查询
db/
  schema.sql        ← 建表脚本（channels, orders）
  seed.sql          ← 示例数据，风格对齐前端 mock 数据
```

## 下一步

- 补齐 `/api/kpis`、`/api/revenue-trend`、`/api/channel-breakdown` 三个端点
  （都是对 `orders` 表做不同维度的聚合查询）
- 把前端 `vite.config.js` 加上 `server.proxy`，本地开发时把 `/api` 转发到这里的 4000 端口
- 部署到 Render：新建 Web Service 指向这个仓库，同时用 Render 的 PostgreSQL
  插件创建生产数据库，把连接串填进 Render 的环境变量
