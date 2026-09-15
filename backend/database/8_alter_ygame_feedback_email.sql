-- 反馈表增加邮箱字段（手机号 / 邮箱二选一）
-- 执行：mysql -u用户 -p 数据库名 < backend/database/8_alter_ygame_feedback_email.sql

ALTER TABLE `fa_ygame_feedback`
  MODIFY COLUMN `phone` varchar(20) NOT NULL DEFAULT '' COMMENT '手机号（可空，与邮箱二选一）',
  ADD COLUMN `email` varchar(100) NOT NULL DEFAULT '' COMMENT '邮箱（可空，与手机号二选一）' AFTER `phone`;
