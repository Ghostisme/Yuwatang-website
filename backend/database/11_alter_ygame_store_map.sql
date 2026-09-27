-- 门店详情「到店地图」：中/英/日图，空则前台不展示
-- 可重复执行
-- 常德路店素材：changde-map-zh.png / changde-map-en.png

DELIMITER $$
DROP PROCEDURE IF EXISTS sp_alter_ygame_store_map $$
CREATE PROCEDURE sp_alter_ygame_store_map()
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'map_image') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `map_image` varchar(255) NOT NULL DEFAULT '' COMMENT '到店地图中文' AFTER `image_jp`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'map_image_en') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `map_image_en` varchar(255) NOT NULL DEFAULT '' COMMENT '到店地图英文' AFTER `map_image`;
  END IF;
  IF NOT EXISTS (SELECT 1 FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'fa_ygame_store' AND COLUMN_NAME = 'map_image_jp') THEN
    ALTER TABLE `fa_ygame_store` ADD COLUMN `map_image_jp` varchar(255) NOT NULL DEFAULT '' COMMENT '到店地图日文' AFTER `map_image_en`;
  END IF;
END $$
DELIMITER ;

CALL sp_alter_ygame_store_map();
DROP PROCEDURE IF EXISTS sp_alter_ygame_store_map;

UPDATE `fa_ygame_store`
SET
  `map_image` = '/uploads/20251209/changde-map-zh.png',
  `map_image_en` = '/uploads/20251209/changde-map-en.png',
  `map_image_jp` = '/uploads/20251209/changde-map-zh.png'
WHERE `slug` = 'changde';
