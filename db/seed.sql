-- 清空重来，方便反复执行本脚本做本地测试
TRUNCATE orders RESTART IDENTITY CASCADE;
TRUNCATE channels RESTART IDENTITY CASCADE;

INSERT INTO channels (name) VALUES
  ('Direct'),
  ('Email'),
  ('Paid Social'),
  ('Organic Search'),
  ('Affiliate');

INSERT INTO orders (order_code, customer_name, channel_id, amount, status, created_at) VALUES
  ('ST-10482', 'M. Alvarez',   1, 128.00, 'Fulfilled',  now() - interval '1 hour'),
  ('ST-10481', 'J. Okafor',    2,  64.50, 'Fulfilled',  now() - interval '3 hours'),
  ('ST-10480', 'R. Nakamura',  3, 212.30, 'Processing', now() - interval '5 hours'),
  ('ST-10479', 'S. Petrov',    4,  41.00, 'Fulfilled',  now() - interval '8 hours'),
  ('ST-10478', 'L. Dubois',    1,  96.75, 'Refunded',   now() - interval '1 day'),
  ('ST-10477', 'A. Kim',       5, 155.20, 'Fulfilled',  now() - interval '1 day 4 hours');
