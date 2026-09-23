-- 渠道维度表
CREATE TABLE IF NOT EXISTS channels (
  id SERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE
);

-- 订单事实表
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_code TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL,
  channel_id INT REFERENCES channels(id),
  amount NUMERIC(10, 2) NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('Fulfilled', 'Processing', 'Refunded')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 之后 KPI / 趋势 / 渠道占比接口都会按时间和渠道聚合查询，提前建好索引
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders (created_at);
CREATE INDEX IF NOT EXISTS idx_orders_channel ON orders (channel_id);

-- 月度营收目标：这是业务设定的值，不是从订单算出来的，所以单独建表，
-- 而不是在查询里硬编码或者伪造一个系数
CREATE TABLE IF NOT EXISTS monthly_targets (
  month DATE PRIMARY KEY,  -- 统一存每月第一天，如 2026-04-01
  target NUMERIC(12, 2) NOT NULL
);
