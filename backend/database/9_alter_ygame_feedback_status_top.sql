-- 反馈状态三态 + 置顶 + 排序
-- status: 0=进行中 1=通过 2=拒绝
-- is_top: 0=否 1=是
-- weigh: 越大越靠前
-- 执行：mysql -u用户 -p 数据库名 < backend/database/9_alter_ygame_feedback_status_top.sql

ALTER TABLE `fa_ygame_feedback`
  MODIFY COLUMN `status` tinyint(1) NOT NULL DEFAULT 0 COMMENT '0进行中 1通过 2拒绝',
  ADD COLUMN `is_top` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否置顶 0否 1是' AFTER `status`,
  ADD COLUMN `weigh` int(10) NOT NULL DEFAULT 0 COMMENT '排序权重，越大越靠前' AFTER `is_top`;

-- 历史「已处理」视为通过；补排序权重
UPDATE `fa_ygame_feedback` SET `weigh` = `id` WHERE `weigh` = 0;
