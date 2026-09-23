-- 清空重来，方便反复执行本脚本做本地测试
TRUNCATE orders RESTART IDENTITY CASCADE;
TRUNCATE channels RESTART IDENTITY CASCADE;
TRUNCATE monthly_targets;

INSERT INTO channels (name) VALUES
  ('Direct'),
  ('Email'),
  ('Paid Social'),
  ('Organic Search'),
  ('Affiliate');

-- 少量“具名”订单：用来验证 /api/orders 的最近订单列表
INSERT INTO orders (order_code, customer_name, channel_id, amount, status, created_at) VALUES
  ('ST-10482', 'M. Alvarez',   1, 128.00, 'Fulfilled',  now() - interval '1 hour'),
  ('ST-10481', 'J. Okafor',    2,  64.50, 'Fulfilled',  now() - interval '3 hours'),
  ('ST-10480', 'R. Nakamura',  3, 212.30, 'Processing', now() - interval '5 hours'),
  ('ST-10479', 'S. Petrov',    4,  41.00, 'Fulfilled',  now() - interval '8 hours'),
  ('ST-10478', 'L. Dubois',    1,  96.75, 'Refunded',   now() - interval '1 day'),
  ('ST-10477', 'A. Kim',       5, 155.20, 'Fulfilled',  now() - interval '1 day 4 hours');

-- 批量生成过去约 7 个月的随机历史订单，让营收趋势图和渠道占比有真实可看的分布
-- （纯粹是为了本地演示；接入真实业务后这段可以整个删掉）
INSERT INTO orders (order_code, customer_name, channel_id, amount, status, created_at)
SELECT
  'ST-2' || lpad(s::text, 4, '0'),
  'Demo Customer ' || s,
  (1 + floor(random() * 5))::int,
  round((30 + random() * 250)::numeric, 2),
  (ARRAY['Fulfilled', 'Fulfilled', 'Fulfilled', 'Processing', 'Refunded'])[1 + floor(random() * 5)],
  now() - (interval '1 day' * floor(random() * 210))
FROM generate_series(1, 400) AS s;

-- 月度目标：和 /api/revenue-trend 里 LEFT JOIN 的表对上
INSERT INTO monthly_targets (month, target) VALUES
  (date_trunc('month', now() - interval '6 months'), 200000),
  (date_trunc('month', now() - interval '5 months'), 205000),
  (date_trunc('month', now() - interval '4 months'), 210000),
  (date_trunc('month', now() - interval '3 months'), 215000),
  (date_trunc('month', now() - interval '2 months'), 225000),
  (date_trunc('month', now() - interval '1 month'),  235000),
  (date_trunc('month', now()),                        250000);
