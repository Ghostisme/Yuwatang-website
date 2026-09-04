-- 门店管理扩展：从「轮播图」升级为官网门店档案（可后台维护、前台动态拉取）
-- 可重复执行：列已存在则跳过（MySQL 8 无 IF NOT EXISTS for COLUMN，用存储过程包裹）

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_alter_ygame_store_v2 $$
CREATE PROCEDURE sp_alter_ygame_store_v2()
BEGIN
  -- slug
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'slug') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `slug` varchar(64) NOT NULL DEFAULT '' COMMENT 'URL标识' AFTER `id`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'title_en') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `title_en` varchar(255) NOT NULL DEFAULT '' COMMENT '店名英文' AFTER `title`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'title_jp') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `title_jp` varchar(255) NOT NULL DEFAULT '' COMMENT '店名日文' AFTER `title_en`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'tagline') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `tagline` varchar(500) NOT NULL DEFAULT '' COMMENT '一句话中文' AFTER `title_jp`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'tagline_en') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `tagline_en` varchar(500) NOT NULL DEFAULT '' AFTER `tagline`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'tagline_jp') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `tagline_jp` varchar(500) NOT NULL DEFAULT '' AFTER `tagline_en`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'intro') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `intro` text NULL COMMENT '介绍中文' AFTER `tagline_jp`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'intro_en') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `intro_en` text NULL AFTER `intro`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'intro_jp') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `intro_jp` text NULL AFTER `intro_en`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'directions') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `directions` text NULL COMMENT '到店指引中文' AFTER `intro_jp`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'directions_en') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `directions_en` text NULL AFTER `directions`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'directions_jp') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `directions_jp` text NULL AFTER `directions_en`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'address') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `address` varchar(255) NOT NULL DEFAULT '' COMMENT '地址中文' AFTER `directions_jp`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'address_en') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `address_en` varchar(255) NOT NULL DEFAULT '' AFTER `address`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'address_jp') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `address_jp` varchar(255) NOT NULL DEFAULT '' AFTER `address_en`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'phone') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `phone` varchar(50) NOT NULL DEFAULT '' AFTER `address_jp`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'hours') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `hours` varchar(100) NOT NULL DEFAULT '9:30–23:00' AFTER `phone`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'metro') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `metro` varchar(255) NOT NULL DEFAULT '' COMMENT '交通中文' AFTER `hours`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'metro_en') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `metro_en` varchar(255) NOT NULL DEFAULT '' AFTER `metro`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'metro_jp') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `metro_jp` varchar(255) NOT NULL DEFAULT '' AFTER `metro_en`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'services') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `services` varchar(255) NOT NULL DEFAULT 'moxibustion,tuina,spa,foot,traditional' COMMENT '服务slug逗号分隔' AFTER `metro_jp`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'facilities') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `facilities` varchar(500) NOT NULL DEFAULT 'privateRoom,tea,hygienic' COMMENT '设施key逗号分隔' AFTER `services`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'status') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `status` tinyint(1) NOT NULL DEFAULT 1 COMMENT '1显示 0隐藏' AFTER `facilities`;
  END IF;
  -- uk_slug 在 seed 清空旧轮播行后再加，避免空 slug 冲突
END $$
DELIMITER ;

CALL sp_alter_ygame_store_v2();
DROP PROCEDURE IF EXISTS sp_alter_ygame_store_v2;
