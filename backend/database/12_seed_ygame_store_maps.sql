-- 全部门店「到店地图」素材入库：中/英文 SVG，日文沿用中文图
-- 素材源：裕和堂门店地图（2026-09-27 版）
-- 可重复执行

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/bailemen-map-zh.svg',
  `map_image_en` = '/uploads/20260928/bailemen-map-en.svg',
  `map_image_jp` = '/uploads/20260928/bailemen-map-zh.svg'
WHERE `slug` = 'bailemen';

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/yuyao-map-zh.svg',
  `map_image_en` = '/uploads/20260928/yuyao-map-en.svg',
  `map_image_jp` = '/uploads/20260928/yuyao-map-zh.svg'
WHERE `slug` = 'yuyao';

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/huashan-map-zh.svg',
  `map_image_en` = '/uploads/20260928/huashan-map-en.svg',
  `map_image_jp` = '/uploads/20260928/huashan-map-zh.svg'
WHERE `slug` = 'huashan';

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/taiguhui-map-zh.svg',
  `map_image_en` = '/uploads/20260928/taiguhui-map-en.svg',
  `map_image_jp` = '/uploads/20260928/taiguhui-map-zh.svg'
WHERE `slug` = 'taiguhui';

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/wujianglu-map-zh.svg',
  `map_image_en` = '/uploads/20260928/wujianglu-map-en.svg',
  `map_image_jp` = '/uploads/20260928/wujianglu-map-zh.svg'
WHERE `slug` = 'wujianglu';

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/shanghai-center-map-zh.svg',
  `map_image_en` = '/uploads/20260928/shanghai-center-map-en.svg',
  `map_image_jp` = '/uploads/20260928/shanghai-center-map-zh.svg'
WHERE `slug` = 'shanghai-center';

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/meihua-map-zh.svg',
  `map_image_en` = '/uploads/20260928/meihua-map-en.svg',
  `map_image_jp` = '/uploads/20260928/meihua-map-zh.svg'
WHERE `slug` = 'meihua';

UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/sichuanbei-map-zh.svg',
  `map_image_en` = '/uploads/20260928/sichuanbei-map-en.svg',
  `map_image_jp` = '/uploads/20260928/sichuanbei-map-zh.svg'
WHERE `slug` = 'sichuanbei';

-- 常德路店：由 20251209 PNG 升级为 20260928 同版式 SVG
UPDATE `fa_ygame_store` SET
  `map_image`    = '/uploads/20260928/changde-map-zh.svg',
  `map_image_en` = '/uploads/20260928/changde-map-en.svg',
  `map_image_jp` = '/uploads/20260928/changde-map-zh.svg'
WHERE `slug` = 'changde';
